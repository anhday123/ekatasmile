const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

let getProductS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id) {
            aggregateQuery.push({ $match: { product_id: Number(req.query.product_id) } });
        }
        if (req.user) {
            aggregateQuery.push({ $match: { business_id: Number(req.user.business_id) } });
        }
        if (req.query.business_id) {
            aggregateQuery.push({ $match: { business_id: Number(req.query.business_id) } });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({ $match: { creator_id: Number(req.query.creator_id) } });
        }
        if (req.query.category_id) {
            let ids = req.query.category_id.split('---');
            ids = ids.map((id) => {
                return Number(id);
            });
            aggregateQuery.push({ $match: { category_id: { $in: ids } } });
        }
        if (req.query.supplier_id) {
            aggregateQuery.push({ $match: { supplier_id: Number(req.query.supplier_id) } });
        }
        if (req.query.slug) {
            aggregateQuery.push({ $match: { slug: String(req.query.slug) } });
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            aggregateQuery.push({
                $match: {
                    code: new RegExp(
                        `${removeUnicode(req.query.code, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.name) {
            aggregateQuery.push({
                $match: {
                    slug: new RegExp(
                        `${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        // lấy các thuộc tính tùy chọn khác
        aggregateQuery.push({
            $lookup: {
                from: 'Attributes',
                let: { productId: '$product_id' },
                pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                as: 'attributes',
            },
        });
        let storeQuery = (() => {
            if (req.query.store_id) {
                return [{ $match: { $expr: { $eq: ['$inventory_id', Number(req.query.store_id)] } } }];
            }
            return [];
        })();
        let branchQuery = (() => {
            if (req.query.branch_id) {
                return [{ $match: { $expr: { $eq: ['$inventory_id', Number(req.query.branch_id)] } } }];
            }
            return [];
        })();
        let mergeQuery = (() => {
            if (req.query.merge == 'true') {
                return [
                    {
                        $group: {
                            _id: '$inventory_id',
                            name: { $first: '$name' },
                            inventory_id: { $first: '$inventory_id' },
                            quantity: { $sum: '$quantity' },
                        },
                    },
                ];
            }
            return [];
        })();
        aggregateQuery.push({
            $lookup: {
                from: 'Variants',
                let: { productId: '$product_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
                    {
                        $lookup: {
                            from: 'Locations',
                            let: { variantId: '$variant_id' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$variant_id', '$$variantId'] } } },
                                ...storeQuery,
                                ...branchQuery,
                                ...mergeQuery,
                            ],
                            as: 'locations',
                        },
                    },
                    { $addFields: { total_quantity: { $sum: '$locations.quantity' } } },
                ],
                as: 'variants',
            },
        });
        if (req.query.detach == 'true') {
            aggregateQuery.push({ $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } });
        }
        if (req.query.attribute) {
            req.query.attribute = String(req.query.attribute).trim().toUpperCase();
            let filters = req.query.attribute.split('---');
            filters = filters.map((filter) => {
                let [option, values] = filter.split(':');
                values = values.split('||');
                return { option: option, values: values };
            });
            filters = filters.map((filter) => {
                let values = filter.values.map((value) => {
                    return new RegExp(
                        `${removeUnicode(String(value), false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    );
                });
                aggregateQuery.push({
                    $match: {
                        'attributes.option': new RegExp(
                            `${removeUnicode(String(filter.option), false).replace(/(\s){1,}/g, '(.*?)')}`,
                            'ig'
                        ),
                        'attributes.values': { $in: values },
                    },
                });
            });
        }
        if (req.query._business) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: 'business_id',
                        as: '_business',
                    },
                },
                { $unwind: { path: '$_business', preserveNullAndEmptyArrays: true } }
            );
        }
        if (req.query._creator) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'creator_id',
                        foreignField: 'creator_id',
                        as: '_creator',
                    },
                },
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
            );
        }
        aggregateQuery.push({
            $project: {
                '_business.password': 0,
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
        let [products, counts] = await Promise.all([
            client.db(DB).collection(`Products`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Products`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            data: products,
            count: counts[0] ? counts[0].counts : 0,
        });
    } catch (err) {
        next(err);
    }
};

let addProductS = async (req, res, next) => {
    try {
        if (req._insert._products.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._insert._products) {
                    await client
                        .db(DB)
                        .collection('Products')
                        .updateOne(
                            {
                                product_id: Number(req._insert._products[i].product_id),
                            },
                            { $set: { ...req._insert._products[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._insert._attributes.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._insert._attributes) {
                    await client
                        .db(DB)
                        .collection('Attributes')
                        .updateOne(
                            {
                                attribute_id: Number(req._insert._attributes[i].attribute_id),
                            },
                            { $set: { ...req._insert._attributes[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._insert._variants.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._insert._variants) {
                    await client
                        .db(DB)
                        .collection('Variants')
                        .updateOne(
                            {
                                variant_id: Number(req._insert._variants[i].variant_id),
                            },
                            { $set: { ...req._insert._variants[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._insert._locations.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._insert._locations) {
                    await client
                        .db(DB)
                        .collection('Locations')
                        .updateOne(
                            {
                                location_id: Number(req._insert._locations[i].location_id),
                            },
                            { $set: { ...req._insert._locations[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        res.send({
            success: true,
            data: req._insert,
        });
    } catch (err) {
        next(err);
    }
};

let updateProductS = async (req, res, next) => {
    try {
        if (req._update._products.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._update._products) {
                    await client
                        .db(DB)
                        .collection('Products')
                        .updateOne(
                            {
                                product_id: Number(req._update._products[i].product_id),
                            },
                            { $set: { ...req._update._products[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._update._attributes.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._update._attributes) {
                    await client
                        .db(DB)
                        .collection('Attributes')
                        .updateOne(
                            {
                                attribute_id: Number(req._update._attributes[i].attribute_id),
                            },
                            { $set: { ...req._update._attributes[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._update._variants.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._update._variants) {
                    await client
                        .db(DB)
                        .collection('Variants')
                        .updateOne(
                            {
                                variant_id: Number(req._update._variants[i].variant_id),
                            },
                            { $set: { ...req._update._variants[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._update._locations.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._update._locations) {
                    await client
                        .db(DB)
                        .collection('Locations')
                        .updateOne(
                            {
                                location_id: Number(req._update._locations[i].location_id),
                            },
                            { $set: { ...req._update._locations[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        if (req._update._prices.length > 0) {
            await new Promise(async (resolve, reject) => {
                for (let i in req._update._prices) {
                    await client
                        .db(DB)
                        .collection('Prices')
                        .updateOne(
                            {
                                price_id: Number(req._update._prices[i].price_id),
                            },
                            { $set: { ...req._update._prices[i] } },
                            { upsert: true }
                        );
                }
                resolve();
            });
        }
        res.send({
            success: true,
            data: req._update,
        });
    } catch (err) {
        next(err);
    }
};

let deleteProductS = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection('Products')
            .deleteMany({ product_id: Number(req.params.product_id) });
        await client
            .db(DB)
            .collection('Attributes')
            .deleteMany({ product_id: Number(req.params.product_id) });
        await client
            .db(DB)
            .collection('Variants')
            .deleteMany({ product_id: Number(req.params.product_id) });
        await client
            .db(DB)
            .collection('Locations')
            .deleteMany({ product_id: Number(req.params.product_id) });
        res.send({ success: true, message: 'Xoá sản phẩm thành công!' });
    } catch (err) {
        next(err);
    }
};

let getAllAtttributeS = async (req, res, next) => {
    try {
        let mongoQuery = {};
        if (req.query.store_id) {
            mongoQuery['name'] = 'STORE';
            mongoQuery['inventory_id'] = Number(req.query.store_id);
        }
        if (req.query.branch_id) {
            mongoQuery['name'] = 'BRANCH';
            mongoQuery['inventory_id'] = Number(req.query.branch_id);
        }
        let locations = await client.db(DB).collection('Locations').find(mongoQuery).toArray();
        let product_ids = locations.map((location) => {
            return String(location.product_id);
        });
        product_ids = [...new Set(product_ids)];
        product_ids = product_ids.map((product_id) => {
            return Number(product_id);
        });
        let attributes = await client
            .db(DB)
            .collection('Attributes')
            .find({ product_id: { $in: product_ids } })
            .toArray();
        let _attributes = {};
        attributes.map((attribute) => {
            if (!_attributes[attribute.option]) {
                _attributes[attribute.option] = attribute;
            } else {
                if (Array.isArray(_attributes[attribute.option].values))
                    _attributes[attribute.option].values = _attributes[attribute.option].values.concat(
                        attribute.values
                    );
            }
        });
        for (let i in _attributes) {
            _attributes[i].values = [...new Set(_attributes[i].values)];
        }
        res.send({ success: true, data: Object.values(_attributes) });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProductS,
    addProductS,
    updateProductS,
    getAllAtttributeS,
};
