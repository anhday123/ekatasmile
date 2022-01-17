let sortQuery = (() => {
    if (req.user.price_recipe == 'FIFO') {
        return { create_date: 1 };
    }
    return { create_date: -1 };
})();
let branchLocations = await client
    .db(req.user.database)
    .collection('Locations')
    .find({
        branch_id: { $in: _branchIds },
        product_id: { $in: _productIds },
        variant_id: { $in: _variantIds },
    })
    .sort(sortQuery)
    .toArray();
let _branchLocations = {};
branchLocations.map((location) => {
    if (!_branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
        _branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`] = [];
    }
    if (_branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`]) {
        _branchLocations[`${location.inventory_id}-${location.product_id}-${location.variant_id}`].push(location);
    }
});
let location_id = await client
    .db(req.user.database)
    .collection('AppSetting')
    .findOne({ name: 'Locations' })
    .then((doc) => {
        if (doc && doc.value) {
            return doc.value;
        }
        return 0;
    });

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
