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

module.exports._importOrder = async (req, res, next) => {
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
        excelProducts.map((product) => {
            if (_products[product['masanpham']] && _variants[product['maphienban']]) {
                price_id++;
                let _price = {
                    business_id: Number(req.user.business_id),
                    price_id: Number(price_id),
                    product_id: Number(_products[product['masanpham']].product_id),
                    variant_id: Number(_variants[product['maphienban']].variant_id),
                    import_price: Number(product['gianhap']),
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
                prices.push(_price);
                location_id++;
                let _location = {
                    business_id: Number(req.user.business_id),
                    location_id: Number(location_id),
                    product_id: Number(_products[product['masanpham']].product_id),
                    variant_id: Number(_variants[product['maphienban']].variant_id),
                    price_id: Number(price_id),
                    type: product['noinhaphang'],
                    inventory_id: (() => {
                        if (product['noinhaphang'] == 'BRANCH') {
                            return _branchs[product['tennoinhap']].branch_id;
                        }
                        if (product['noinhaphang'] == 'STORE') {
                            return _stores[product['tennoinhap']].store_id;
                        }
                    })(),
                    name: product['tennoinhap'],
                    quantity: product['soluongnhap'],
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
                locations.push(_location);
            }
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
        res.send({
            success: true,
            data: {
                prices: prices,
                locations: locations,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports._transportOrder = async (req, res, next) => {
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
