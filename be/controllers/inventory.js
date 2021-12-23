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

module.exports._getImportOrder = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.order_id) {
            aggregateQuery.push({ $match: { order_id: Number(req.query.order_id) } });
        }
        if (req.query.code) {
            aggregateQuery.push({ $match: { code: Number(req.query.code) } });
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
            client.db(DB).collection(`ImportOrders`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
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
                .db(DB)
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
        let importLocation = await client.db(DB).collection(importAt).findOne(req.body.import_location);
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
                .db(DB)
                .collection('Products')
                .find({ product_id: { $in: productIds } })
                .toArray(),
            client
                .db(DB)
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
        let final_cost = 0;
        let total_quantity = 0;
        req.body.products = req.body.products.map((product) => {
            total_cost += product.quantity * product.import_price;
            final_cost += product.quantity * product.import_price;
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
            code: 1000000 + order_id,
            import_location: req.body.import_location,
            import_location_info: importLocation,
            products: req.body.products || [],
            total_cost: req.body.total_cost || total_cost,
            final_cost: req.body.final_cost || final_cost,
            total_quantity: req.body.total_quantity || total_quantity,
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
        await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne(
                    { name: 'ImportOrders' },
                    { $set: { name: 'ImportOrders', value: order_id } },
                    { upsert: true }
                ),
            client.db(DB).collection('ImportOrders').insertOne(order),
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
                .db(DB)
                .collection('Products')
                .find({ business_id: Number(req.user.business_id), sku: { $in: productSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Variants')
                .find({ business_id: Number(req.user.business_id), sku: { $in: variantSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Branchs')
                .find({ business_id: Number(req.user.business_id), name: { $in: branchNames } })
                .toArray(),
            client
                .db(DB)
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
                .db(DB)
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
        let insert = await client.db(DB).collection('ImportOrders').insertMany(orders);
        if (!insert.insertedIds) {
            throw new Error(`500: Tạo phiếu nhập kho thất bại!`);
        }
        await client
            .db(DB)
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
        let order = await client.db(DB).collection('ImportOrders').findOne(req.params);
        delete req.body._id;
        let _order = { ...order, ...req.body };
        _order = {
            business_id: Number(_order.business_id),
            order_id: _order.order_id,
            code: _order.code,
            import_location: _order.import_location,
            import_location_info: _order.importLocation,
            products: _order.products,
            total_cost: _order.total_cost,
            final_cost: _order.final_cost,
            total_quantity: _order.total_quantity,
            // DRAFT - VERIFY - COMPLETE - CANCEL
            status: _order.status,
            verify_date: _order.verify_date,
            verifier_id: _order.verifier_id,
            complete_date: _order.complete_date,
            completer_id: _order.completer_id,
            create_date: _order.create_date,
            last_update: moment().tz(TIMEZONE).format(),
            creator_id: _order.creator_id,
            active: _order.active,
        };
        if (_order.status == 'VERIFY' && order.status != 'VERIFY') {
            _order['verifier_id'] = Number(req.user.user_id);
            _order['verify_date'] = moment().tz(TIMEZONE).format();
        }
        if (_order.status == 'COMPLETE' && order.status != 'COMPLETE') {
            _order['completer_id'] = Number(req.user.user_id);
            _order['complete_date'] = moment().tz(TIMEZONE).format();
            let [price_id, location_id] = await Promise.all([
                client
                    .db(DB)
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
                    .db(DB)
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
            _order.products.map((product) => {
                price_id++;
                let _price = {
                    business_id: Number(_order.business_id),
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
                    business_id: Number(_order.business_id),
                    location_id: Number(location_id),
                    product_id: Number(product.product_id),
                    variant_id: Number(product.variant_id),
                    price_id: Number(price_id),
                    type: (() => {
                        if (_order.import_location && _order.import_location.branch_id) {
                            return 'BRANCH';
                        }
                        if (_order.import_location && _order.import_location.store_id) {
                            return 'STORE';
                        }
                        return '';
                    })(),
                    inventory_id: (() => {
                        if (_order.import_location && _order.import_location.branch_id) {
                            return _order.import_location.branch_id;
                        }
                        if (_order.import_location && _order.import_location.store_id) {
                            return _order.import_location.store_id;
                        }
                        return 0;
                    })(),
                    name: (() => {
                        if (_order.import_location_info && _order.import_location_info.branch_id) {
                            return _order.import_location_info.name;
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
                    .db(DB)
                    .collection('AppSetting')
                    .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
                client
                    .db(DB)
                    .collection('AppSetting')
                    .updateOne(
                        { name: 'Locations' },
                        { $set: { name: 'Locations', value: location_id } },
                        { upsert: true }
                    ),
                client.db(DB).collection('Prices').insertMany(prices),
                client.db(DB).collection('Locations').insertMany(locations),
            ]);
        }
        await client.db(DB).collection('ImportOrders').updateOne(req.params, { $set: _order });
        res.send({ success: true, data: _order });
    } catch (err) {
        next(err);
    }
};

module.exports._getTransportOrder = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};

module.exports._createTransportOrder = async (req, res, next) => {
    try {
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
        });
        let excelProducts = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        let productSkus = [];
        let variantSkus = [];
        let exportBranchNames = [];
        let exportStoreNames = [];
        let importBranchNames = [];
        let importStoreNames = [];
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
                exportBranchNames.push(_product['tennoixuat'].trim().toUpperCase());
            }
            if (_product['noixuathang'] == 'STORE') {
                exportStoreNames.push(_product['tennoixuat'].trim().toUpperCase());
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
                importBranchNames.push(_product['tennoinhap'].trim().toUpperCase());
            }
            if (_product['noinhaphang'] == 'STORE') {
                importStoreNames.push(_product['tennoinhap'].trim().toUpperCase());
            }

            return _product;
        });
        productSkus = [...new Set(productSkus)];
        variantSkus = [...new Set(variantSkus)];
        exportBranchNames = [...new Set(exportBranchNames)];
        exportStoreNames = [...new Set(exportStoreNames)];
        importBranchNames = [...new Set(importBranchNames)];
        importStoreNames = [...new Set(importStoreNames)];
        let [products, variants, exportBranchs, exportStores, importBranchs, importStores] = await Promise.all([
            client
                .db(DB)
                .collection('Products')
                .find({ business_id: Number(req.user.business_id), sku: { $in: productSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Variants')
                .find({ business_id: Number(req.user.business_id), sku: { $in: variantSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Branchs')
                .find({ business_id: Number(req.user.business_id), name: { $in: exportBranchNames } })
                .toArray(),
            client
                .db(DB)
                .collection('Stores')
                .find({ business_id: Number(req.user.business_id), name: { $in: exportStoreNames } })
                .toArray(),
            client
                .db(DB)
                .collection('Branchs')
                .find({ business_id: Number(req.user.business_id), name: { $in: importBranchNames } })
                .toArray(),
            client
                .db(DB)
                .collection('Stores')
                .find({ business_id: Number(req.user.business_id), name: { $in: importStoreNames } })
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
        let _exportBranchs = {};
        let _exportBranchIds = [];
        exportBranchs.map((eBranch) => {
            _exportBranchs[eBranch.name] = eBranch;
            _exportBranchIds.push(eBranch.branch_id);
        });
        let _exportStores = {};
        let _exportStoreIds = [];
        exportStores.map((eStore) => {
            _exportStores[eStore.name] = eStore;
            _exportStoreIds.push(eStore.store_id);
        });
        let _importBranchs = {};
        let _importBranchIds = [];
        importBranchs.map((eBranch) => {
            _importBranchs[eBranch.name] = eBranch;
            _importBranchIds.push(eBranch.branch_id);
        });
        let _importStores = {};
        let _importStoreIds = [];
        importStores.map((eStore) => {
            _importStores[eStore.name] = eStore;
            _importStoreIds.push(eStore.store_id);
        });
        let sortQuery = (() => {
            if (req.user.price_recipe == 'FIFO') {
                return { create_date: 1 };
            }
            return { create_date: -1 };
        })();
        let [branchLocations, storeLocations] = await Promise.all([
            client
                .db(DB)
                .collection('Locations')
                .find({
                    type: 'BRANCH',
                    inventory_id: { $in: _exportBranchIds },
                    product_id: { $in: _productIds },
                    variant_id: { $in: _variantIds },
                })
                .sort(sortQuery)
                .toArray(),
            client
                .db(DB)
                .collection('Locations')
                .find({
                    type: 'STORE',
                    inventory_id: { $in: _exportStoreIds },
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
                .db(DB)
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
        let insert = await client.db(DB).collection('Locations').insertMany(importLocations);
        await Promise.all(
            exportLocations.map((location) => {
                return client
                    .db(DB)
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
    } catch (err) {
        next(err);
    }
};
