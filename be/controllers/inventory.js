const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const XLSX = require('xlsx');

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

let importProduct = async (user, products, productObjects, variantObjects, priceObjects) => {
    try {
        let locationMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Locations' });
        let locationId = (() => {
            if (locationMaxId && locationMaxId.value) {
                return locationMaxId.value;
            }
            return 0;
        })();
    } catch (err) {
        throw new Error(err.message);
    }
};

let exportProduct = () => {
    try {
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports._getImportOrder = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.order_id) {
            aggregateQuery.push({ $match: { order_id: Number(req.query.order_id) } });
        }
        if (req.query.code) {
            aggregateQuery.push({ $match: { code: String(req.query.code) } });
        }
        if (req.query.branch_id) {
            aggregateQuery.push({ $match: { 'import_location.branch_id': Number(req.query.branch_id) } });
        }
        if (req.query.store_id) {
            aggregateQuery.push({ $match: { 'import_location.store_id': Number(req.query.store_id) } });
        }
        if (req.query.status) {
            aggregateQuery.push({ $match: { status: String(req.query.status) } });
        }
        if (req.query['today'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('days').format();
            delete req.query.today;
        }
        if (req.query['yesterday'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, `days`).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, `days`).endOf('days').format();
            delete req.query.yesterday;
        }
        if (req.query['this_week'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('weeks').format();
            delete req.query.this_week;
        }
        if (req.query['last_week'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').endOf('weeks').format();
            delete req.query.last_week;
        }
        if (req.query['this_month'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('months').format();
            delete req.query.this_month;
        }
        if (req.query['last_month'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'months').startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'months').endOf('months').format();
            delete req.query.last_month;
        }
        if (req.query['this_year'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('years').format();
            delete req.query.this_year;
        }
        if (req.query['last_year'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'years').startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'years').endOf('years').format();
            delete req.query.last_year;
        }
        if (req.query['from_date'] != undefined) {
            req.query[`from_date`] = moment(req.query[`from_date`]).tz(TIMEZONE).startOf('days').format();
        }
        if (req.query['to_date'] != undefined) {
            req.query[`to_date`] = moment(req.query[`to_date`]).tz(TIMEZONE).endOf('days').format();
        }
        if (req.query.from_date) {
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'completer_id',
                    foreignField: 'user_id',
                    as: '_completer',
                },
            },
            { $unwind: { path: '$_completer', preserveNullAndEmptyArrays: true } }
        );
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'verifier_id',
                    foreignField: 'user_id',
                    as: '_verifier',
                },
            },
            { $unwind: { path: '$_verifier', preserveNullAndEmptyArrays: true } }
        );
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'creator_id',
                    foreignField: 'user_id',
                    as: '_creator',
                },
            },
            { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
        );
        aggregateQuery.push({
            $project: {
                sub_name: 0,
                '_verifier.password': 0,
                '_creator.password': 0,
            },
        });
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { create_date: -1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }

        // lấy data từ database
        let [orders, counts] = await Promise.all([
            client.db(req.user.database).collection(`ImportOrders`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`ImportOrders`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: orders,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._createImportOrder = async (req, res, next) => {
    try {
        let [order_id] = await Promise.all([
            client
                .db(req.user.database)
                .collection('AppSetting')
                .findOne({ name: 'ImportOrders' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
        ]);
        order_id++;
        const importAt = (() => {
            if (req.body.import_location && req.body.import_location.branch_id) {
                return 'Branchs';
            }
            return 'Stores';
        })();
        let importLocation = await client.db(req.user.database).collection(importAt).findOne(req.body.import_location);
        if (!importLocation) {
            throw new Error('400: Địa điểm nhập hàng không chính xác!');
        }
        let productIds = [];
        let variantIds = [];
        req.body.products.map((product) => {
            productIds.push(product.product_id);
            variantIds.push(product.variant_id);
        });
        productIds = [...new Set(productIds)];
        variantIds = [...new Set(variantIds)];
        let [products, variants] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .find({ product_id: { $in: productIds } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .find({ product_id: { $in: productIds } })
                .toArray(),
        ]);
        let _products = {};
        products.map((product) => {
            _products[String(product.product_id)] = product;
        });
        let _variants = {};
        variants.map((variant) => {
            _variants[String(variant.variant_id)] = variant;
        });
        let total_cost = 0;
        let total_discount = 0;
        let final_cost = 0;
        let total_quantity = 0;
        req.body.products = req.body.products.map((product) => {
            total_cost += product.quantity * product.import_price;
            total_discount += product.discount || 0;
            final_cost += product.quantity * product.import_price - product.discount || 0;
            total_quantity += product.quantity;
            return {
                ...product,
                product_info: _products[product.product_id],
                variant_info: _variants[product.variant_id],
            };
        });
        let payment_amount = (() => {
            let result = 0;
            if (req.body.payment_info && Array.isArray(req.body.payment_info) && req.body.payment_info.length > 0) {
                req.body.payment_info = req.body.payment_info.map((payment) => {
                    result += payment.paid_amount || 0;
                    payment['payment_date'] = moment().tz(TIMEZONE).format();
                    return payment;
                });
            }
            return result;
        })();
        let order = {
            order_id: order_id,
            code: req.body.code || String(order_id).padStart(6, '0'),
            import_location: req.body.import_location,
            import_location_info: importLocation,
            products: req.body.products || [],
            total_quantity: req.body.total_quantity || total_quantity,
            total_cost: req.body.total_cost || total_cost,
            total_tax: req.body.total_tax || 0,
            total_discount: req.body.total_discount || total_discount,
            fee_shipping: req.body.fee_shipping,
            final_cost: req.body.final_cost || final_cost,
            note: req.body.note || '',
            files: req.body.files,
            tags: req.body.tags || [],
            slug_tags: [],
            // DRAFT - VERIFY - SHIPPING - COMPLETE - CANCEL
            status: req.body.status || 'DRAFT',
            payment_info: req.body.payment_info || [],
            payment_amount: req.body.payment_amount || payment_amount,
            // UNPAID - PAYING - PAID - REFUND
            payment_status: req.body.payment_status || 'PAID',
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            verify_date: '',
            verifier_id: '',
            delivery_date: '',
            deliverer_id: '',
            complete_date: '',
            completer_id: '',
            cancel_date: '',
            canceler_id: '',
            order_creator_id: req.body.order_creator_id,
            receiver_id: req.body.receiver_id,
            last_update: moment().tz(TIMEZONE).format(),
            active: true,
        };
        if (order.status == 'COMPLETE') {
            order['completer_id'] = Number(req.user.user_id);
            order['complete_date'] = moment().tz(TIMEZONE).format();
            let [prices, priceMaxId, locationMaxId, inventoryMaxId, inventories] = await Promise.all([
                client
                    .db(req.user.database)
                    .collection('Prices')
                    .find({ product_id: { $in: productIds }, variant_id: { $in: variantIds } })
                    .toArray(),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Prices' }),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Locations' }),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Inventories' }),
                client
                    .db(req.user.database)
                    .collection('Inventories')
                    .find({
                        product_id: { $in: productIds },
                        variant_id: { $in: variantIds },
                        branch_id: order.import_location.branch_id,
                        is_check: false,
                    })
                    .toArray(),
            ]);
            let price_id = (() => {
                if (priceMaxId && priceMaxId.value) {
                    return priceMaxId.value;
                }
                return 0;
            })();
            let location_id = (() => {
                if (locationMaxId && locationMaxId.value) {
                    return locationMaxId.value;
                }
                return 0;
            })();
            let inventory_id = (() => {
                if (inventoryMaxId && inventoryMaxId.value) {
                    return inventoryMaxId.value;
                }
                return 0;
            })();
            let _prices = {};
            prices.map((ePrice) => {
                _prices[`${ePrice.product_id}-${ePrice.variant_id}-${ePrice.import_price}`] = ePrice;
            });
            let _inventories = {};
            inventories.map((eInventory) => {
                _inventories[`${eInventory.product_id}-${eInventory.variant_id}-${eInventory.price_id}`] = eInventory;
            });
            let insertPrices = [];
            let insertLocations = [];
            let insertInventories = [];
            let updateInventories = [];
            order.products.map((eProduct) => {
                if (!_prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`]) {
                    price_id++;
                    let _price = {
                        price_id: Number(price_id),
                        product_id: Number(eProduct.product_id),
                        variant_id: Number(eProduct.variant_id),
                        import_price: Number(eProduct.import_price),
                        create_date: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    insertPrices.push(_price);
                    _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`] = _price;
                }
                location_id++;
                let _location = {
                    location_id: location_id,
                    product_id: eProduct.product_id,
                    variant_id: eProduct.variant_id,
                    price_id:
                        _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`].price_id,
                    type: (() => {
                        if (order.import_location && order.import_location.branch_id) {
                            return 'BRANCH';
                        }
                        if (order.import_location && order.import_location.store_id) {
                            return 'STORE';
                        }
                        return '';
                    })(),
                    branch_id: (() => {
                        if (order.import_location && order.import_location.branch_id) {
                            return order.import_location.branch_id;
                        }
                        return '';
                    })(),
                    store_id: (() => {
                        if (order.import_location && order.import_location.store_id) {
                            return order.import_location.store_id;
                        }
                        return '';
                    })(),
                    quantity: eProduct.quantity,
                    create_date: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    last_update: moment().tz(TIMEZONE).format(),
                    updater_id: req.user.user_id,
                    active: true,
                };
                insertLocations.push(_location);
                inventory_id++;
                let _oldInventory = {
                    ..._inventories[
                        `${eProduct.product_id}-${eProduct.variant_id}-${
                            _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`].price_id
                        }`
                    ],
                };
                let _inventory = (() => {
                    inventory_id++;
                    // console.log(_oldInventory);
                    if (!_oldInventory) {
                        return {
                            inventory_id: inventory_id,
                            product_id: eProduct.product_id,
                            variant_id: eProduct.variant_id,
                            branch_id: _location.branch_id,
                            type: 'IMPORT',
                            begin_quantity: 0,
                            begin_price: 0,
                            import_quantity: eProduct.quantity,
                            import_price: eProduct.quantity * eProduct.import_price,
                            export_quantity: 0,
                            export_price: 0,
                            end_quantity: eProduct.quantity,
                            end_price: eProduct.quantity * eProduct.import_price,
                            create_date: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            is_check: false,
                        };
                    }
                    _oldInventory.is_check = true;
                    updateInventories.push(_oldInventory);
                    return {
                        inventory_id: inventory_id,
                        product_id: eProduct.product_id,
                        variant_id: eProduct.variant_id,
                        branch_id: _location.branch_id,
                        type: 'IMPORT',
                        begin_quantity: _oldInventory.end_quantity,
                        begin_price: _oldInventory.end_price,
                        import_quantity: eProduct.quantity,
                        import_price: eProduct.quantity * eProduct.import_price,
                        export_quantity: 0,
                        export_price: 0,
                        end_quantity: _oldInventory.end_quantity + eProduct.quantity,
                        end_price: _oldInventory.end_price + eProduct.quantity * eProduct.import_price,
                        create_date: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        is_check: false,
                    };
                })();
                insertInventories.push(_inventory);
            });
            await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Locations' },
                        { $set: { name: 'Locations', value: location_id } },
                        { upsert: true }
                    ),
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Inventories' },
                        { $set: { name: 'Inventories', value: inventory_id } },
                        { upsert: true }
                    ),
            ]);
            await Promise.all([
                client.db(req.user.database).collection('Prices').insertMany(insertPrices),
                client.db(req.user.database).collection('Locations').insertMany(insertLocations),
                client.db(req.user.database).collection('Inventories').insertMany(insertInventories),
                ...(() => {
                    return updateInventories.map((eUpdate) => {
                        return client
                            .db(req.user.database)
                            .collection('Inventories')
                            .updateOne({ inventory_id: eUpdate.inventory_id }, { $set: eUpdate });
                    });
                })(),
            ]);
        }
        let variantUpdates = [];
        order.products.map((eProduct) => {
            variantUpdates.push({
                variant_id: Number(eProduct.variant_id),
                import_price_default: Number(eProduct.import_price),
            });
        });
        await Promise.all(
            variantUpdates.map((eVariant) => {
                return client
                    .db(req.user.database)
                    .collection('Variants')
                    .updateOne({ variant_id: eVariant.variant_id }, { $set: eVariant });
            })
        );
        await Promise.all([
            client
                .db(req.user.database)
                .collection('AppSetting')
                .updateOne(
                    { name: 'ImportOrders' },
                    { $set: { name: 'ImportOrders', value: order_id } },
                    { upsert: true }
                ),
            client.db(req.user.database).collection('ImportOrders').insertOne(order),
        ]);
        res.send({
            success: true,
            data: order,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._createImportOrderFile = async (req, res, next) => {
    try {
        if (req.file == undefined) {
            throw new Error('400: Vui lòng truyền file!');
        }
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: true,
        });
        let excelProducts = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        let productSkus = [];
        let variantSkus = [];
        let branchNames = [];
        let storeNames = [];
        excelProducts = excelProducts.map((eProduct) => {
            let _product = {};
            for (let i in eProduct) {
                _product[String(removeUnicode(i, true)).toLowerCase()] = eProduct[i];
            }
            productSkus.push(_product['masanpham']);
            variantSkus.push(_product['maphienban']);
            _product['noinhaphang'] = (() => {
                if (removeUnicode(_product['noinhaphang'], true).toLowerCase() == 'chinhanh') {
                    return 'BRANCH';
                }
                if (removeUnicode(_product['noinhaphang'], true).toLowerCase() == 'cuahang') {
                    return 'STORE';
                }
            })();
            if (_product['noinhaphang'] == 'BRANCH') {
                branchNames.push(_product['tennoinhap'].trim().toUpperCase());
            }
            if (_product['noinhaphang'] == 'STORE') {
                storeNames.push(_product['tennoinhap'].trim().toUpperCase());
            }
            return _product;
        });
        productSkus = [...new Set(productSkus)];
        variantSkus = [...new Set(variantSkus)];
        branchNames = [...new Set(branchNames)];
        storeNames = [...new Set(storeNames)];
        let [products, variants, branchs, stores] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .find({ business_id: Number(req.user.business_id), sku: { $in: productSkus } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .find({ business_id: Number(req.user.business_id), sku: { $in: variantSkus } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Branchs')
                .find({ business_id: Number(req.user.business_id), name: { $in: branchNames } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Stores')
                .find({ business_id: Number(req.user.business_id), name: { $in: storeNames } })
                .toArray(),
        ]);
        let _products = {};
        products.map((eProduct) => {
            _products[eProduct.sku] = eProduct;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[eVariant.sku] = eVariant;
        });
        let _branchs = {};
        branchs.map((eBranch) => {
            _branchs[eBranch.name] = eBranch;
        });
        let _stores = {};
        stores.map((eStore) => {
            _stores[eStore.name] = eStore;
        });

        let [order_id] = await Promise.all([
            client
                .db(req.user.database)
                .collection('AppSetting')
                .findOne({ name: 'ImportOrders' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
        ]);
        let _orders = {};
        excelProducts = excelProducts.map((e) => {
            if (!_orders[e['madonhang']]) {
                order_id++;
                _orders[e['madonhang']] = {
                    business_id: Number(req.user.business_id),
                    order_id: order_id,
                    code: e['madonhang'],
                    import_location: (() => {
                        if (e['noinhaphang'] == 'BRANCH') {
                            return { branch_id: _branchs[e['tennoinhap']].branch_id };
                        }
                        if (e['noinhaphang'] == 'STORE') {
                            return { store_id: _stores[e['tennoinhap']].store_id };
                        }
                        return '';
                    })(),
                    import_location_info: (() => {
                        if (e['noinhaphang'] == 'BRANCH') {
                            return _branchs[e['tennoinhap']];
                        }
                        if (e['noinhaphang'] == 'STORE') {
                            return _stores[e['tennoinhap']];
                        }
                        return {};
                    })(),
                    products: req.body.products || [],
                    total_cost: 0,
                    final_cost: 0,
                    total_quantity: 0,
                    // DRAFT - VERIFY - COMPLETE - CANCEL
                    status: 'DRAFT',
                    verify_date: '',
                    verifier_id: '',
                    complete_date: '',
                    completer_id: '',
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: req.user.user_id,
                    active: true,
                };
            }
            if (_orders[e['madonhang']]) {
                _orders[e['madonhang']].products.push({
                    product_id: _products[e['masanpham']].product_id,
                    variant_id: _variants[e['maphienban']].variant_id,
                    import_price: e['gianhap'],
                    quantity: e['soluongnhap'],
                    product_info: _products[e['masanpham']],
                    variant_info: _variants[e['maphienban']],
                });
                _orders[e['madonhang']].total_cost += e['gianhap'] * e['soluongnhap'];
                _orders[e['madonhang']].final_cost += e['gianhap'] * e['soluongnhap'];
                _orders[e['madonhang']].total_quantity += e['soluongnhap'];
            }
        });
        let orders = Object.values(_orders);
        let insert = await client.db(req.user.database).collection('ImportOrders').insertMany(orders);
        if (!insert.insertedIds) {
            throw new Error(`500: Tạo phiếu nhập kho thất bại!`);
        }
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne({ name: 'ImportOrders' }, { $set: { name: 'ImportOrders', value: order_id } }, { upsert: true }),
            res.send({
                success: true,
                data: orders,
            });
    } catch (err) {
        next(err);
    }
};

module.exports._updateImportOrder = async (req, res, next) => {
    try {
        req.params.order_id = Number(req.params.order_id);
        let order = await client.db(req.user.database).collection('ImportOrders').findOne(req.params);
        const importAt = (() => {
            if (req.body.import_location && req.body.import_location.branch_id) {
                return 'Branchs';
            }
            return 'Stores';
        })();
        let importLocation = await client.db(req.user.database).collection(importAt).findOne(req.body.import_location);
        if (!importLocation) {
            throw new Error('400: Địa điểm nhập hàng không chính xác!');
        }
        delete req.body._id;
        delete req.body.order_id;
        let _order = { ...order, ...req.body };
        let productIds = [];
        let variantIds = [];
        _order.products.map((eProduct) => {
            productIds.push(eProduct.product_id);
            variantIds.push(eProduct.variant_id);
        });
        let [products, variants] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .find({ product_id: { $in: productIds } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .find({ variant_id: { $in: variantIds } })
                .toArray(),
        ]);
        let _products = {};
        products.map((eProduct) => {
            _products[`${eProduct.product_id}`] = eProduct;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[`${eVariant.variant_id}`] = eVariant;
        });
        _order.products = _order.products.map((eProduct) => {
            eProduct['product_info'] = _products[`${eProduct.product_id}`];
            eProduct['variant_info'] = _variants[`${eProduct.variant_id}`];
        });
        let payment_amount = (() => {
            let result = 0;
            if (_order.payment_info && Array.isArray(_order.payment_info) && _order.payment_info.length > 0) {
                _order.payment_info = _order.payment_info.map((payment) => {
                    result += payment.paid_amount || 0;
                    if (!payment['payment_date']) {
                        payment['payment_date'] = moment().tz(TIMEZONE).format();
                    }
                    return payment;
                });
            }
            return result;
        })();
        _order = {
            business_id: Number(_order.business_id),
            order_id: _order.order_id,
            code: _order.code,
            import_location: _order.import_location,
            import_location_info: importLocation,
            products: _order.products,
            total_quantity: _order.total_quantity,
            total_cost: _order.total_cost,
            total_tax: _order.total_tax,
            total_discount: _order.total_discount,
            shipping_cost: _order.shipping_cost,
            final_cost: _order.final_cost,
            note: _order.note,
            files: _order.files,
            tags: _order.tags,
            slug_tags: _order.slug_tags,
            // DRAFT - VERIFY - SHIPPING - COMPLETE - CANCEL
            status: _order.status,
            payment_info: _order.payment_info,
            payment_amount: payment_amount,
            // UNPAID - PAYING - PAID - REFUND
            payment_status: _order.payment_status,
            create_date: _order.create_date,
            creator_id: _order.creator_id,
            verify_date: _order.verify_date,
            verifier_id: _order.verifier_id,
            delivery_date: _order.delivery_date,
            deliverer_id: _order.deliverer_id,
            complete_date: _order.complete_date,
            completer_id: _order.completer_id,
            cancel_date: _order.cancel_date,
            canceler_id: _order.canceler_id,
            order_creator_id: _order.order_creator_id,
            receiver_id: _order.receiver_id,
            last_update: moment().tz(TIMEZONE).format(),
            active: _order.active,
        };
        if (_order.status == 'VERIFY' && order.status != 'VERIFY') {
            _order['verifier_id'] = Number(req.user.user_id);
            _order['verify_date'] = moment().tz(TIMEZONE).format();
        }
        if (_order.status == 'COMPLETE' && order.status != 'COMPLETE') {
            _ỏder['completer_id'] = Number(req.user.user_id);
            _ỏder['complete_date'] = moment().tz(TIMEZONE).format();
            let [prices, priceMaxId, locationMaxId, inventoryMaxId, inventories] = await Promise.all([
                client
                    .db(req.user.database)
                    .collection('Prices')
                    .find({ product_id: { $in: productIds }, variant_id: { $in: variantIds } })
                    .toArray(),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Prices' }),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Locations' }),
                client.db(req.user.database).collection('AppSetting').findOne({ name: 'Inventories' }),
                client
                    .db(req.user.database)
                    .collection('Inventories')
                    .find({
                        product_id: { $in: productIds },
                        variant_id: { $in: variantIds },
                        branch_id: _ỏder.import_location.branch_id,
                        is_check: false,
                    })
                    .toArray(),
            ]);
            let price_id = (() => {
                if (priceMaxId && priceMaxId.value) {
                    return priceMaxId.value;
                }
                return 0;
            })();
            let location_id = (() => {
                if (locationMaxId && locationMaxId.value) {
                    return locationMaxId.value;
                }
                return 0;
            })();
            let inventory_id = (() => {
                if (inventoryMaxId && inventoryMaxId.value) {
                    return inventoryMaxId.value;
                }
                return 0;
            })();
            let _prices = {};
            prices.map((ePrice) => {
                _prices[`${ePrice.product_id}-${ePrice.variant_id}-${ePrice.import_price}`] = ePrice;
            });
            let _inventories = {};
            inventories.map((eInventory) => {
                _inventories[`${eInventory.product_id}-${eInventory.variant_id}-${eInventory.price_id}`] = eInventory;
            });
            let insertPrices = [];
            let insertLocations = [];
            let insertInventories = [];
            let updateInventories = [];
            _ỏder.products.map((eProduct) => {
                if (!_prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`]) {
                    price_id++;
                    let _price = {
                        price_id: Number(price_id),
                        product_id: Number(eProduct.product_id),
                        variant_id: Number(eProduct.variant_id),
                        import_price: Number(eProduct.import_price),
                        create_date: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    insertPrices.push(_price);
                    _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`] = _price;
                }
                location_id++;
                let _location = {
                    location_id: location_id,
                    product_id: eProduct.product_id,
                    variant_id: eProduct.variant_id,
                    price_id:
                        _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`].price_id,
                    type: (() => {
                        if (_ỏder.import_location && _ỏder.import_location.branch_id) {
                            return 'BRANCH';
                        }
                        if (_ỏder.import_location && _ỏder.import_location.store_id) {
                            return 'STORE';
                        }
                        return '';
                    })(),
                    branch_id: (() => {
                        if (_ỏder.import_location && _ỏder.import_location.branch_id) {
                            return _ỏder.import_location.branch_id;
                        }
                        return '';
                    })(),
                    store_id: (() => {
                        if (_ỏder.import_location && _ỏder.import_location.store_id) {
                            return _ỏder.import_location.store_id;
                        }
                        return '';
                    })(),
                    quantity: eProduct.quantity,
                    create_date: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    last_update: moment().tz(TIMEZONE).format(),
                    updater_id: req.user.user_id,
                    active: true,
                };
                insertLocations.push(_location);
                inventory_id++;
                let _oldInventory = {
                    ..._inventories[
                        `${eProduct.product_id}-${eProduct.variant_id}-${
                            _prices[`${eProduct.product_id}-${eProduct.variant_id}-${eProduct.import_price}`].price_id
                        }`
                    ],
                };
                let _inventory = (() => {
                    inventory_id++;
                    if (!_oldInventory) {
                        return {
                            inventory_id: inventory_id,
                            product_id: eProduct.product_id,
                            variant_id: eProduct.variant_id,
                            branch_id: eProduct.branch_id,
                            type: 'IMPORT',
                            begin_quantity: 0,
                            begin_price: 0,
                            import_quantity: eProduct.quantity,
                            import_price: eProduct.quantity * eProduct.price,
                            export_quantity: 0,
                            export_price: 0,
                            end_quantity: eProduct.quantity,
                            end_price: eProduct.quantity * eProduct.price,
                            create_date: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            is_check: false,
                        };
                    }
                    _oldInventory.is_check = true;
                    updateInventories.push(_oldInventory);
                    return {
                        inventory_id: inventory_id,
                        product_id: eProduct.product_id,
                        variant_id: eProduct.variant_id,
                        branch_id: eProduct.branch_id,
                        type: 'IMPORT',
                        begin_quantity: _oldInventory.end_quantity,
                        begin_price: _oldInventory.end_price,
                        import_quantity: eProduct.quantity,
                        import_price: eProduct.quantity * eProduct.price,
                        export_quantity: 0,
                        export_price: 0,
                        end_quantity: _oldInventory.end_quantity + eProduct.quantity,
                        end_price: _oldInventory.end_price + eProduct.quantity * eProduct.price,
                        create_date: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        is_check: false,
                    };
                })();
                insertInventories.push(_inventory);
            });
            await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Locations' },
                        { $set: { name: 'Locations', value: location_id } },
                        { upsert: true }
                    ),
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Inventories' },
                        { $set: { name: 'Inventories', value: inventory_id } },
                        { upsert: true }
                    ),
            ]);
            await Promise.all([
                client.db(req.user.database).collection('Prices').insertMany(insertPrices),
                client.db(req.user.database).collection('Locations').insertMany(insertLocations),
                client.db(req.user.database).collection('Inventories').insertMany(insertInventories),
                ...(() => {
                    return updateInventories.map((eUpdate) => {
                        return client
                            .db(req.user.database)
                            .collection('Inventories')
                            .updateOne({ inventory_id: eUpdate.inventory_id }, { $set: eUpdate });
                    });
                })(),
            ]);
        }
        await client.db(req.user.database).collection('ImportOrders').updateOne(req.params, { $set: _order });
        res.send({ success: true, data: _order });
    } catch (err) {
        next(err);
    }
};

module.exports._deleteImportOrder = async (req, res, next) => {
    try {
        await client
            .db(req.user.database)
            .collection('ImportOrders')
            .deleteMany({ order_id: { $in: req.body.order_id } });
        res.send({ success: true, message: 'Xóa phiếu nhập hàng thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports._getTransportOrder = async (req, res, next) => {
    try {
        try {
            let aggregateQuery = [];
            if (req.query.order_id) {
                aggregateQuery.push({ $match: { order_id: Number(req.query.order_id) } });
            }
            if (req.query.code) {
                aggregateQuery.push({ $match: { code: String(req.query.code) } });
            }
            if (req.query.export_location_name) {
                aggregateQuery.push({
                    $match: {
                        'export_location_info.slug_name': new RegExp(
                            removeUnicode(req.query.export_location_name, true).toLowerCase()
                        ),
                    },
                });
            }
            if (req.query.import_location_name) {
                aggregateQuery.push({
                    $match: {
                        'import_location_info.slug_name': new RegExp(
                            removeUnicode(req.query.import_location_name, true).toLowerCase()
                        ),
                    },
                });
            }
            if (req.query.status) {
                aggregateQuery.push({ $match: { status: String(req.query.status) } });
            }
            if (req.query['today'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).startOf('days').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).endOf('days').format();
                delete req.query.today;
            }
            if (req.query['yesterday'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, `days`).startOf('days').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, `days`).endOf('days').format();
                delete req.query.yesterday;
            }
            if (req.query['this_week'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).startOf('weeks').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).endOf('weeks').format();
                delete req.query.this_week;
            }
            if (req.query['last_week'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').startOf('weeks').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').endOf('weeks').format();
                delete req.query.last_week;
            }
            if (req.query['this_month'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).startOf('months').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).endOf('months').format();
                delete req.query.this_month;
            }
            if (req.query['last_month'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'months').startOf('months').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'months').endOf('months').format();
                delete req.query.last_month;
            }
            if (req.query['this_year'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).startOf('years').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).endOf('years').format();
                delete req.query.this_year;
            }
            if (req.query['last_year'] != undefined) {
                req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'years').startOf('years').format();
                req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'years').endOf('years').format();
                delete req.query.last_year;
            }
            if (req.query['from_date'] != undefined) {
                req.query[`from_date`] = moment(req.query[`from_date`]).tz(TIMEZONE).startOf('days').format();
            }
            if (req.query['to_date'] != undefined) {
                req.query[`to_date`] = moment(req.query[`to_date`]).tz(TIMEZONE).endOf('days').format();
            }
            if (req.query.from_date) {
                aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
            }
            if (req.query.to_date) {
                aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
            }
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'completer_id',
                        foreignField: 'user_id',
                        as: '_completer',
                    },
                },
                { $unwind: { path: '$_completer', preserveNullAndEmptyArrays: true } }
            );
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'verifier_id',
                        foreignField: 'user_id',
                        as: '_verifier',
                    },
                },
                { $unwind: { path: '$_verifier', preserveNullAndEmptyArrays: true } }
            );
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'creator_id',
                        foreignField: 'user_id',
                        as: '_creator',
                    },
                },
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
            );
            aggregateQuery.push({
                $project: {
                    sub_name: 0,
                    '_verifier.password': 0,
                    '_creator.password': 0,
                },
            });
            let countQuery = [...aggregateQuery];
            aggregateQuery.push({ $sort: { create_date: -1 } });
            if (req.query.page && req.query.page_size) {
                let page = Number(req.query.page) || 1;
                let page_size = Number(req.query.page_size) || 50;
                aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
            }

            // lấy data từ database
            let [orders, counts] = await Promise.all([
                client.db(req.user.database).collection(`TransportOrders`).aggregate(aggregateQuery).toArray(),
                client
                    .db(req.user.database)
                    .collection(`TransportOrders`)
                    .aggregate([...countQuery, { $count: 'counts' }])
                    .toArray(),
            ]);
            res.send({
                success: true,
                count: counts[0] ? counts[0].counts : 0,
                data: orders,
            });
        } catch (err) {
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

module.exports._createTransportOrder = async (req, res, next) => {
    try {
        try {
            let [order_id] = await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .findOne({ name: 'TransportOrders' })
                    .then((doc) => {
                        if (doc && doc.value) {
                            return doc.value;
                        }
                        return 0;
                    })
                    .catch((err) => {
                        throw new Error(`500: ${err}`);
                    }),
            ]);
            order_id++;
            const exportAt = (() => {
                if (req.body.export_location && req.body.export_location.branch_id) {
                    return 'Branchs';
                }
                return 'Stores';
            })();
            const importAt = (() => {
                if (req.body.import_location && req.body.import_location.branch_id) {
                    return 'Branchs';
                }
                return 'Stores';
            })();
            let [exportLocation, importLocation] = await Promise.all([
                client.db(req.user.database).collection(exportAt).findOne(req.body.export_location),
                client.db(req.user.database).collection(importAt).findOne(req.body.import_location),
            ]);
            if (!exportLocation) {
                throw new Error('400: Địa điểm xuất hàng không chính xác!');
            }
            if (!importLocation) {
                throw new Error('400: Địa điểm nhập hàng không chính xác!');
            }
            let productIds = [];
            let variantIds = [];
            req.body.products.map((product) => {
                productIds.push(product.product_id);
                variantIds.push(product.variant_id);
            });
            productIds = [...new Set(productIds)];
            variantIds = [...new Set(variantIds)];
            let [products, variants] = await Promise.all([
                client
                    .db(req.user.database)
                    .collection('Products')
                    .find({ product_id: { $in: productIds } })
                    .toArray(),
                client
                    .db(req.user.database)
                    .collection('Variants')
                    .find({ product_id: { $in: productIds } })
                    .toArray(),
            ]);
            let _products = {};
            products.map((product) => {
                _products[String(product.product_id)] = product;
            });
            let _variants = {};
            variants.map((variant) => {
                _variants[String(variant.variant_id)] = variant;
            });
            let total_cost = 0;
            let total_discount = 0;
            let final_cost = 0;
            let total_quantity = 0;
            req.body.products = req.body.products.map((product) => {
                total_cost += product.quantity * product.import_price;
                total_discount += product.discount || 0;
                final_cost += product.quantity * product.import_price - product.discount || 0;
                total_quantity += product.quantity;
                return {
                    ...product,
                    product_info: _products[product.product_id],
                    variant_info: _variants[product.variant_id],
                };
            });
            let order = {
                business_id: Number(req.user.business_id),
                order_id: order_id,
                code: req.body.code || String(order_id).padStart(6, '0'),
                export_location: req.body.export_location,
                export_location_info: exportLocation,
                import_location: req.body.import_location,
                import_location_info: importLocation,
                products: req.body.products || [],
                total_quantity: req.body.total_quantity || total_quantity,
                shipping_cost: req.body.shipping_cost,
                final_cost: req.body.final_cost || final_cost,
                note: req.body.note || '',
                files: req.body.files,
                tags: req.body.tags || [],
                slug_tags: [],
                // DRAFT - VERIFY - SHIPPING - COMPLETE - CANCEL
                status: req.body.status || 'DRAFT',
                payment_info: req.body.payment_info || [],
                // UNPAID - PAYING - PAID
                payment_status: req.body.payment_status || 'PAID',
                delivery_time: req.body.delivery_time || '',
                create_date: moment().tz(TIMEZONE).format(),
                creator_id: req.user.user_id,
                verify_date: '',
                verifier_id: '',
                delivery_date: '',
                deliverer_id: '',
                complete_date: '',
                completer_id: '',
                cancel_date: '',
                canceler_id: '',
                last_update: moment().tz(TIMEZONE).format(),
                active: true,
            };
            if (order.status != 'COMPLETE') {
                order['completer_id'] = Number(req.user.user_id);
                order['complete_date'] = moment().tz(TIMEZONE).format();
                let [price_id, location_id] = await Promise.all([
                    client
                        .db(req.user.database)
                        .collection('AppSetting')
                        .findOne({ name: 'Prices' })
                        .then((doc) => {
                            if (doc && doc.value) {
                                return doc.value;
                            }
                            return 0;
                        })
                        .catch((err) => {
                            throw new Error(`500: ${err}`);
                        }),
                    client
                        .db(req.user.database)
                        .collection('AppSetting')
                        .findOne({ name: 'Locations' })
                        .then((doc) => {
                            if (doc && doc.value) {
                                return doc.value;
                            }
                            return 0;
                        })
                        .catch((err) => {
                            throw new Error(`500: ${err}`);
                        }),
                ]);
                let prices = [];
                let locations = [];
                order.products.map((product) => {
                    price_id++;
                    let _price = {
                        business_id: Number(order.business_id),
                        price_id: Number(price_id),
                        product_id: Number(product.product_id),
                        variant_id: Number(product.variant_id),
                        import_price: Number(product.import_price),
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    prices.push(_price);
                    location_id++;
                    let _location = {
                        business_id: Number(order.business_id),
                        location_id: Number(location_id),
                        product_id: Number(product.product_id),
                        variant_id: Number(product.variant_id),
                        price_id: Number(price_id),
                        type: (() => {
                            if (order.import_location && order.import_location.branch_id) {
                                return 'BRANCH';
                            }
                            if (order.import_location && order.import_location.store_id) {
                                return 'STORE';
                            }
                            return '';
                        })(),
                        branch_id: (() => {
                            if (order.import_location && order.import_location.branch_id) {
                                return order.import_location.branch_id;
                            }
                            return '';
                        })(),
                        store_id: (() => {
                            if (order.import_location && order.import_location.store_id) {
                                return order.import_location.store_id;
                            }
                            return '';
                        })(),
                        quantity: product.quantity,
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    locations.push(_location);
                });
                await Promise.all([
                    client
                        .db(req.user.database)
                        .collection('AppSetting')
                        .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
                    client
                        .db(req.user.database)
                        .collection('AppSetting')
                        .updateOne(
                            { name: 'Locations' },
                            { $set: { name: 'Locations', value: location_id } },
                            { upsert: true }
                        ),
                    client.db(req.user.database).collection('Prices').insertMany(prices),
                    client.db(req.user.database).collection('Locations').insertMany(locations),
                ]);
            }
            let variantUpdates = [];
            order.products.map((eProduct) => {
                variantUpdates.push({
                    variant_id: Number(eProduct.variant_id),
                    import_price_default: Number(eProduct.import_price),
                });
            });
            await Promise.all(
                variantUpdates.map((eVariant) => {
                    return client
                        .db(req.user.database)
                        .collection('Variants')
                        .updateOne({ variant_id: eVariant.variant_id }, { $set: eVariant });
                })
            );
            await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'TransportOrders' },
                        { $set: { name: 'TransportOrders', value: order_id } },
                        { upsert: true }
                    ),
                client.db(req.user.database).collection('TransportOrders').insertOne(order),
            ]);
            res.send({
                success: true,
                data: order,
            });
        } catch (err) {
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

module.exports._createTransportOrderFile = async (req, res, next) => {
    try {
        if (req.file == undefined) {
            throw new Error('400: Vui lòng truyền file!');
        }
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: true,
        });
        let excelProducts = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        let productSkus = [];
        let variantSkus = [];
        let branchNames = [];
        let storeNames = [];
        excelProducts = excelProducts.map((eProduct) => {
            let _product = {};
            for (let i in eProduct) {
                _product[String(removeUnicode(i, true)).toLowerCase()] = eProduct[i];
            }
            productSkus.push(_product['masanpham']);
            variantSkus.push(_product['maphienban']);
            _product['noixuathang'] = (() => {
                if (removeUnicode(_product['noixuathang'], true).toLowerCase() == 'chinhanh') {
                    return 'BRANCH';
                }
                if (removeUnicode(_product['noixuathang'], true).toLowerCase() == 'cuahang') {
                    return 'STORE';
                }
            })();
            if (_product['noixuathang'] == 'BRANCH') {
                branchNames.push(_product['tennoixuat'].trim().toUpperCase());
            }
            if (_product['noixuathang'] == 'STORE') {
                storeNames.push(_product['tennoixuat'].trim().toUpperCase());
            }
            _product['noinhaphang'] = (() => {
                if (removeUnicode(_product['noinhaphang'], true).toLowerCase() == 'chinhanh') {
                    return 'BRANCH';
                }
                if (removeUnicode(_product['noinhaphang'], true).toLowerCase() == 'cuahang') {
                    return 'STORE';
                }
            })();
            if (_product['noinhaphang'] == 'BRANCH') {
                branchNames.push(_product['tennoinhap'].trim().toUpperCase());
            }
            if (_product['noinhaphang'] == 'STORE') {
                storeNames.push(_product['tennoinhap'].trim().toUpperCase());
            }
            return _product;
        });
        productSkus = [...new Set(productSkus)];
        variantSkus = [...new Set(variantSkus)];
        branchNames = [...new Set(branchNames)];
        storeNames = [...new Set(storeNames)];
        let [products, variants, branchs, stores] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .find({ business_id: Number(req.user.business_id), sku: { $in: productSkus } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .find({ business_id: Number(req.user.business_id), sku: { $in: variantSkus } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Branchs')
                .find({ business_id: Number(req.user.business_id), name: { $in: branchNames } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Stores')
                .find({ business_id: Number(req.user.business_id), name: { $in: storeNames } })
                .toArray(),
        ]);
        let _products = {};
        let _productIds = [];
        products.map((eProduct) => {
            _products[eProduct.sku] = eProduct;
            _productIds.push(eProduct.product_id);
        });
        let _variants = {};
        let _variantIds = [];
        variants.map((eVariant) => {
            _variants[eVariant.sku] = eVariant;
            _variantIds.push(eVariant.variant_id);
        });
        let _branchs = {};
        let _branchIds = [];
        branchs.map((eBranch) => {
            _branchs[eBranch.name] = eBranch;
            _branchIds.push(eBranch.branch_id);
        });
        let _stores = {};
        let _storeIds = [];
        stores.map((eStore) => {
            _stores[eStore.name] = eStore;
            _storeIds.push(eStore.store_id);
        });
        let sortQuery = (() => {
            if (req.user.price_recipe == 'FIFO') {
                return { create_date: 1 };
            }
            return { create_date: -1 };
        })();
        let [branchLocations, storeLocations] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Locations')
                .find({
                    type: 'BRANCH',
                    inventory_id: { $in: _branchIds },
                    product_id: { $in: _productIds },
                    variant_id: { $in: _variantIds },
                })
                .sort(sortQuery)
                .toArray(),
            client
                .db(req.user.database)
                .collection('Locations')
                .find({
                    type: 'STORE',
                    inventory_id: { $in: _storeIds },
                    product_id: { $in: _productIds },
                    variant_id: { $in: _variantIds },
                })
                .sort(sortQuery)
                .toArray(),
        ]);
        let _branchLocations = {};
        branchLocations.map((location) => {
            if (!_branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
                _branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`] = [];
            }
            if (_branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
                _branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`].push(
                    location
                );
            }
        });
        let _storeLocations = {};
        storeLocations.map((location) => {
            if (!_storeLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
                _storeLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`] = [];
            }
            if (_storeLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
                _storeLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`].push(
                    location
                );
            }
        });
        let [location_id] = await Promise.all([
            client
                .db(req.user.database)
                .collection('AppSetting')
                .findOne({ name: 'Locations' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
        ]);
        let exportLocations = [];
        let importLocations = [];
        excelProducts = excelProducts.map((product) => {
            if (product['noixuathang'] == 'BRANCH') {
                let _locations =
                    _branchLocations[
                        `${_exportBranchs[product['tennoixuat']].branch_id}-${_products[product['masanpham']]}-${
                            _variants[product['maphienban']]
                        }`
                    ];
                if (Array.isArray(_locations) && _locations.length > 0) {
                    let _exportLocations = [];
                    let _importLocations = [];
                    for (let i in _locations) {
                        product['soluong'] = Number(product['soluong']);
                        if (product['soluong'] <= 0) {
                            break;
                        }
                        if (product['soluong'] > 0 && _locations[i].quantity == 0) {
                            throw new Error(`400: Sản phẩm "${product['tensanpham']}" không đủ số lượng xuất hàng!`);
                        }
                        if (_locations[i].quantity > product['soluong']) {
                            _locations[i].quantity -= product['soluong'];
                            product['soluong'] = 0;
                        }
                        if (product['soluong'] >= _locations[i].quantity) {
                            product['soluong'] -= _locations[i].quantity;
                            _locations[i].quantity = 0;
                        }
                        _exportLocations.push(_locations[i]);
                        location_id++;
                        _importLocations.push({
                            business_id: _locations[i].business_id,
                            location_id: location_id,
                            product_id: _locations[i].product_id,
                            variant_id: _locations[i].variant_id,
                            price_id: _locations[i].price_id,
                            type: 'BRANCH',
                            inventory_id: _importBranchs[product['tennoinhap']],
                            quantity: product['soluong'],
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        });
                    }
                    exportLocations = [...exportLocations, ..._exportLocations];
                    importLocations = [...importLocations, ..._importLocations];
                }
            }
            if (product['noixuathang'] == 'STORE') {
                let _locations =
                    _storeLocations[
                        `${_exportStores[product['tennoixuat']].store_id}-${_products[product['masanpham']]}-${
                            _variants[product['maphienban']]
                        }`
                    ];
                if (Array.isArray(_locations) && _locations.length > 0) {
                    let _exportLocations = [];
                    let _importLocations = [];
                    for (let i in _locations) {
                        product['soluong'] = Number(product['soluong']);
                        if (product['soluong'] <= 0) {
                            break;
                        }
                        if (product['soluong'] > 0 && _locations[i].quantity == 0) {
                            throw new Error(`400: Sản phẩm "${product['tensanpham']}" không đủ số lượng xuất hàng!`);
                        }
                        if (_locations[i].quantity > product['soluong']) {
                            _locations[i].quantity -= product['soluong'];
                            product['soluong'] = 0;
                        }
                        if (product['soluong'] >= _locations[i].quantity) {
                            product['soluong'] -= _locations[i].quantity;
                            _locations[i].quantity = 0;
                        }
                        _exportLocations.push(_locations[i]);
                        location_id++;
                        _importLocations.push({
                            business_id: _locations[i].business_id,
                            location_id: location_id,
                            product_id: _locations[i].product_id,
                            variant_id: _locations[i].variant_id,
                            price_id: _locations[i].price_id,
                            type: 'BRANCH',
                            inventory_id: _importBranchs[product['tennoinhap']],
                            quantity: product['soluong'],
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        });
                    }
                    exportLocations = [...exportLocations, ..._exportLocations];
                    importLocations = [...importLocations, ..._importLocations];
                }
            }
        });
        let insert = await client.db(req.user.database).collection('Locations').insertMany(importLocations);
        await Promise.all(
            exportLocations.map((location) => {
                return client
                    .db(req.user.database)
                    .collection('Locations')
                    .updateOne({ location_id: location.location_id }, { $set: location });
            })
        );
        res.send({ success: true, message: 'Chuyển hàng thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports._updateTransportOrder = async (req, res, next) => {
    try {
        req.params.order_id = Number(req.params.order_id);
        let order = await client.db(req.user.database).collection('TransportOrders').findOne(req.params);
        delete req.body._id;
        delete req.body.order_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _order = { ...order, ...req.body };
        let productIds = [];
        let variantIds = [];
        _order.products.map((product) => {
            productIds.push(product.product_id);
            variantIds.push(product.variant_id);
        });
        productIds = [...new Set(productIds)];
        variantIds = [...new Set(variantIds)];
        let [products, variants] = await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .find({ product_id: { $in: productIds } })
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .find({ product_id: { $in: productIds } })
                .toArray(),
        ]);
        let _products = {};
        products.map((product) => {
            _products[String(product.product_id)] = product;
        });
        let _variants = {};
        variants.map((variant) => {
            _variants[String(variant.variant_id)] = variant;
        });
        let total_cost = 0;
        let total_discount = 0;
        let final_cost = 0;
        let total_quantity = 0;
        _order.products = _order.products.map((product) => {
            total_cost += product.quantity * product.import_price;
            total_discount += product.discount || 0;
            final_cost += product.quantity * product.import_price - product.discount || 0;
            total_quantity += product.quantity;
            return {
                ...product,
                product_info: _products[product.product_id],
                variant_info: _variants[product.variant_id],
            };
        });
        _order = {
            business_id: Number(_order.business_id),
            order_id: _order.order_id,
            code: _order.code,
            export_location: _order.export_location,
            export_location_info: _order.export_location_info,
            import_location: _order.import_location,
            import_location_info: _order.import_location_info,
            products: _order.products,
            total_cost: _order.total_cost,
            total_discount: _order.total_discount,
            cod: _order.cod,
            final_cost: _order.final_cost,
            total_quantity: _order.total_quantity,
            files: _order.files,
            // DRAFT - VERIFY - SHIPPING - COMPLETE - CANCEL
            status: String(_order.status).toUpperCase(),
            note: _order.note,
            verify_date: _order.verify_date,
            verifier_id: _order.verifier_id,
            complete_date: _order.complete_date,
            completer_id: _order.completer_id,
            create_date: _order.create_date,
            creator_id: _order.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            active: _order.active,
        };
        if (_order.status == 'VERIFY' && order.status != 'VERIFY') {
            _order['verifier_id'] = Number(req.user.user_id);
            _order['verify_date'] = moment().tz(TIMEZONE).format();
            let sortQuery = (() => {
                if (req.user.price_recipe == 'FIFO') {
                    return { create_date: 1 };
                }
                return { create_date: -1 };
            })();
            let locations = await client
                .db(req.user.database)
                .collection('Locations')
                .find({
                    variant_id: { $in: variantIds },
                    branch_id: _order.export_location.branch_id,
                    quantity: { $gte: 0 },
                })
                .sort(sortQuery)
                .toArray();
            let _locations = {};
            locations.map((location) => {
                if (!_locations[String(location.variant_id)]) {
                    _locations[String(location.variant_id)] = [];
                }
                if (_locations[String(location.variant_id)]) {
                    _locations[String(location.variant_id)].push(location);
                }
            });
            let prices = await client
                .db(req.user.database)
                .collection('Prices')
                .find({ variant_id: { $in: variantIds } })
                .toArray();
            let _prices = {};
            prices.map((price) => {
                _prices[String(price.price_id)] = price;
            });
            let _updates = [];
            _order.products = _order.products.map((eProduct) => {
                if (!_locations[`${eProduct.variant_id}`]) {
                    throw new Error('400: Sản phẩm trong kho không đủ số lượng!');
                }
                let detailQuantity = eProduct.quantity;
                for (let i in _locations[`${eProduct.variant_id}`]) {
                    location = _locations[`${eProduct.variant_id}`][i];
                    if (detailQuantity == 0) {
                        break;
                    }
                    let _basePrice = {
                        location_id: location.location_id,
                        branch_id: location.branch_id,
                        product_id: location.product_id,
                        variant_id: location.variant_id,
                        price_id: location.price_id,
                        quantity: 0,
                        base_price: (() => {
                            if (_prices[location.price_id] && _prices[location.price_id].import_price) {
                                return _prices[location.price_id].import_price;
                            }
                            throw new Error('400: Không tìm thấy giá vốn!');
                        })(),
                    };
                    if (detailQuantity <= location.quantity) {
                        _basePrice.quantity = detailQuantity;
                        location.quantity -= detailQuantity;
                        detailQuantity = 0;
                    }
                    if (detailQuantity > location.quantity) {
                        _basePrice.quantity = location.quantity;
                        detailQuantity -= location.quantity;
                        location.quantity = 0;
                    }
                    if (!eProduct.base_prices) eProduct.base_prices = [];
                    eProduct.base_prices.push(_basePrice);
                    eProduct.total_base_price += location.quantity * _prices[location.price_id].import_price;
                    _updates.push(location);
                }
                if (detailQuantity > 0) {
                    throw new Error('400: Sản phẩm trong kho không đủ số lượng!');
                }
                return eProduct;
            });
            await Promise.all(
                _updates.map((eUpdate) => {
                    return client
                        .db(req.user.database)
                        .collection('Locations')
                        .updateOne({ location_id: eUpdate.location_id }, { $set: eUpdate });
                })
            );
        }
        if (_order.status == 'COMPLETE' && order.status != 'COMPLETE') {
            _order['completer_id'] = Number(req.user.user_id);
            _order['complete_date'] = moment().tz(TIMEZONE).format();
            let [location_id] = await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .findOne({ name: 'Locations' })
                    .then((doc) => {
                        if (doc && doc.value) {
                            return doc.value;
                        }
                        return 0;
                    })
                    .catch((err) => {
                        throw new Error(`500: ${err}`);
                    }),
            ]);
            let locations = [];
            _order.products.map((eProduct) => {
                location_id++;
                let _location = {
                    location_id: Number(location_id),
                    product_id: Number(eProduct.product_id),
                    variant_id: Number(eProduct.variant_id),
                    price_id: Number(eProduct.price_id || 0),
                    type: (() => {
                        if (_order.import_location && _order.import_location.branch_id) {
                            return 'BRANCH';
                        }
                        if (_order.import_location && _order.import_location.store_id) {
                            return 'STORE';
                        }
                        return '';
                    })(),
                    branch_id: (() => {
                        if (_order.import_location && _order.import_location.branch_id) {
                            return _order.import_location.branch_id;
                        }
                        return '';
                    })(),
                    store_id: (() => {
                        if (_order.import_location && _order.import_location.store_id) {
                            return _order.import_location.store_id;
                        }
                        return '';
                    })(),
                    quantity: eProduct.quantity,
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
                locations.push(_location);
            });
            await Promise.all([
                client
                    .db(req.user.database)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Locations' },
                        { $set: { name: 'Locations', value: location_id } },
                        { upsert: true }
                    ),
                client.db(req.user.database).collection('Locations').insertMany(locations),
            ]);
        }
        if (_order.status == 'CANCEL' && order.status != 'CANCEL') {
            _order['verifier_id'] = Number(req.user.user_id);
            _order['verify_date'] = moment().tz(TIMEZONE).format();
            let _updates = [];
            _order.products.map((eProduct) => {
                if (eProduct.base_prices) {
                    eProduct.base_prices.map((eBasePrice) => {
                        _updates.push(eBasePrice);
                    });
                }
            });
            let importOrderMaxId = await client
                .db(req.user.database)
                .collection('AppSetting')
                .findOne({ name: 'ImportOrders' });
            let importOrderId = (() => {
                if (importOrderMaxId && importOrderMaxId.value) {
                    return importOrderMaxId.value;
                }
                return 0;
            })();
            importOrderId++;
            let importOrder = {
                order_id: importOrderId,
                code: String(importOrderId).padStart(6, '0'),
                import_location: _order.sale_location.store_id,
                import_location_info: _order.sale_location,
                products: _order.products || [],
                total_quantity: 0,
                total_cost: 0,
                total_tax: 0,
                total_discount: 0,
                fee_shipping: 0,
                final_cost: 0,
                note: 'Phiêu nhập hàng của đơn hàng bị hoàn trả',
                files: [],
                tags: [],
                slug_tags: [],
                // DRAFT - VERIFY - SHIPPING - COMPLETE - CANCEL
                status: 'DRAFT',
                payment_info: [],
                payment_amount: 0,
                // UNPAID - PAYING - PAID - REFUND
                payment_status: 'PAID',
                create_date: moment().tz(TIMEZONE).format(),
                creator_id: req.user.user_id,
                verify_date: '',
                verifier_id: '',
                delivery_date: '',
                deliverer_id: '',
                complete_date: '',
                completer_id: '',
                cancel_date: '',
                canceler_id: '',
                order_creator_id: req.body.order_creator_id,
                receiver_id: req.body.receiver_id,
                last_update: moment().tz(TIMEZONE).format(),
                active: true,
            };
            await client
                .db(req.user.database)
                .collection('AppSetting')
                .updateOne({ name: 'ImportOrders' }, { $set: { name: 'ImportOrders', value: importOrderId } });
            await client.db(req.user.database).collection('ImportOrders').insertOne(importOrder);
        }
        await client.db(req.user.database).collection('TransportOrders').updateOne(req.params, { $set: _order });
        res.send({ success: true, data: _order });
    } catch (err) {
        next(err);
    }
};

module.exports._deleteTransportOrder = async (req, res, next) => {
    try {
        await client
            .db(req.user.database)
            .collection('TransportOrders')
            .deleteMany({ order_id: { $in: req.body.order_id } });
        res.send({ success: true, message: 'Xóa phiếu chuyển hàng thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports._getBalanceInventory = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};
