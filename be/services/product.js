const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

module.exports.getProductS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id) {
            aggregateQuery.push({
                $match: { product_id: Number(req.query.product_id) },
            });
        }
        if (req.user) {
            aggregateQuery.push({
                $match: { business_id: Number(req.user.business_id) },
            });
        }
        if (req.query.business_id) {
            aggregateQuery.push({
                $match: { business_id: Number(req.query.business_id) },
            });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({
                $match: { creator_id: Number(req.query.creator_id) },
            });
        }
        if (req.query.category_id) {
            let ids = req.query.category_id.split('---');
            ids = ids.map((id) => {
                return Number(id);
            });
            aggregateQuery.push({ $match: { category_id: { $in: ids } } });
        }
        if (req.query.supplier_id) {
            aggregateQuery.push({
                $match: { supplier_id: Number(req.query.supplier_id) },
            });
        }
        if (req.query.slug) {
            aggregateQuery.push({ $match: { slug: String(req.query.slug) } });
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            aggregateQuery.push({
                $match: { create_date: { $gte: req.query.from_date } },
            });
        }
        if (req.query.to_date) {
            aggregateQuery.push({
                $match: { create_date: { $lte: req.query.to_date } },
            });
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            aggregateQuery.push({
                $match: {
                    code: new RegExp(`${removeUnicode(req.query.code, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
                },
            });
        }
        if (req.query.sku) {
            aggregateQuery.push({
                $match: {
                    sku: new RegExp(`${removeUnicode(req.query.sku, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
                },
            });
        }
        if (req.query.name) {
            aggregateQuery.push({
                $match: {
                    slug: new RegExp(`${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
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
        if (req.query.branch_id) {
            req.query['branch'] = true;
        }
        let branchQuery = (() => {
            if (req.query.branch) {
                return [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$type', 'BRANCH'] },
                                    ...(() => {
                                        if (req.query.branch_id) {
                                            return [{ $eq: ['$inventory_id', Number(req.query.branch_id)] }];
                                        }
                                        return [];
                                    })(),
                                ],
                            },
                        },
                    },
                ];
            }
            return [];
        })();
        if (req.query.store_id) {
            req.query['store'] = true;
        }
        let storeQuery = (() => {
            if (req.query.store) {
                return [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$type', 'STORE'] },
                                    ...(() => {
                                        if (req.query.store_id) {
                                            return [{ $eq: ['$inventory_id', Number(req.query.store_id)] }];
                                        }
                                        return [];
                                    })(),
                                ],
                            },
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
                                ...branchQuery,
                                ...storeQuery,
                                {
                                    $group: {
                                        _id: { type: '$type', inventory_id: '$inventory_id' },
                                        type: { $first: '$type' },
                                        name: { $first: '$name' },
                                        inventory_id: { $first: '$inventory_id' },
                                        quantity: { $sum: '$quantity' },
                                    },
                                },
                            ],
                            as: 'locations',
                        },
                    },
                ],
                as: 'variants',
            },
        });
        if (req.query.feedbacks) {
            aggregateQuery.push({
                $lookup: {
                    from: 'Feedbacks',
                    let: { productId: '$product_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                    as: 'feedbacks',
                },
            });
        }
        if (req.query._categories) {
            aggregateQuery.push({
                $lookup: {
                    from: 'Categories',
                    localField: 'category_id',
                    foreignField: 'category_id',
                    as: '_categories',
                },
            });
        }
        if (req.query._deals) {
            aggregateQuery.push({
                $lookup: {
                    from: 'Deals',
                    let: { productId: '$product_id' },
                    pipeline: [{ $match: { $expr: { $in: ['$$productId', '$product_list'] } } }],
                    as: '_deals',
                },
            });
        }
        if (req.query._origin) {
            aggregateQuery.push({
                $lookup: {
                    from: 'Countries',
                    localField: 'origin_code',
                    foreignField: 'code',
                    as: '_origin',
                },
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
                slug_name: 0,
                'attributes.slug_option': 0,
                'attributes.slug_values': 0,
                'variants.slug_title': 0,
                '_business.password': 0,
                '_creator.password': 0,
            },
        });
        let sortQuery = (() => {
            if (req.query.sort) {
                let [field, option] = req.query.sort.split(':');
                let productClass = ['name'];
                let variantClass = ['price'];
                if (productClass.includes(field)) {
                    let result = {};
                    result[field] = Number(option);
                    return result;
                }
                if (variantClass.includes(field)) {
                    let result = {};
                    result[`variants.${field}`] = Number(option);
                    return result;
                }
            }
            return { create_date: -1 };
        })();
        aggregateQuery.push({ $sort: sortQuery });
        let countQuery = [...aggregateQuery];
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

module.exports.addProductS = async (req, res, next) => {
    try {
        let result = [];
        if (req._newProducts && Array.isArray(req._newProducts) && req._newProducts.length > 0) {
            result.push(req._newProducts);
            let insert = await client.db(DB).collection('Products').insertMany(req._newProducts);
            if (!insert.insertedIds) {
                throw new Error('500: Tạo sản phẩm thất bại!');
            }
        }
        if (req._newAttributes && Array.isArray(req._newAttributes) && req._newAttributes.length > 0) {
            result.push(req._newAttributes);
            let insert = await client.db(DB).collection('Attributes').insertMany(req._newAttributes);
            if (!insert.insertedIds) {
                throw new Error('500: Tạo sản thuộc tính sản phẩm bại!');
            }
        }
        if (req._newVariants && Array.isArray(req._newVariants) && req._newVariants.length > 0) {
            result.push(req._newVariants);
            let insert = await client.db(DB).collection('Variants').insertMany(req._newVariants);
            if (!insert.insertedIds) {
                throw new Error('500: Tạo phiên bản sản phẩm thất bại!');
            }
        }
        if (req._oldProducts && Array.isArray(req._oldProducts) && req._oldProducts.length > 0) {
            result.push(req._oldProducts);
            await Promise.all(
                req._oldProducts.map((product) => {
                    return client
                        .db(DB)
                        .collection('Products')
                        .updateOne({ product_id: product.product_id }, { $set: product });
                })
            );
        }
        if (req._oldAttributes && Array.isArray(req._oldAttributes) && req._oldAttributes.length > 0) {
            result.push(req._oldAttributes);
            await Promise.all(
                req._oldAttributes.map((attribute) => {
                    return client
                        .db(DB)
                        .collection('Attributes')
                        .updateOne({ attribute_id: attribute.attribute_id }, { $set: attribute });
                })
            );
        }
        if (req._oldVariants && Array.isArray(req._oldVariants) && req._oldVariants.length > 0) {
            result.push(req._oldVariants);
            await Promise.all(
                req._oldVariants.map((variant) => {
                    return client
                        .db(DB)
                        .collection('Variants')
                        .updateOne({ variant_id: variant.variant_id }, { $set: variant });
                })
            );
        }
        if (req._newPrices && Array.isArray(req._newPrices) && req._newPrices.length > 0) {
            result.push(req._newPrices);
            let insert = await client.db(DB).collection('Prices').insertMany(req._newPrices);
            if (!insert.insertedIds) {
                throw new Error('500: Tạo giá nhập sản phẩm thất bại!');
            }
        }
        res.send({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.updateProductS = async (req, res, next) => {
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

module.exports.deleteProductS = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection('Products')
            .deleteMany({ product_id: { $in: req._delete } });
        await client
            .db(DB)
            .collection('Attributes')
            .deleteMany({ product_id: { $in: req._delete } });
        await client
            .db(DB)
            .collection('Variants')
            .deleteMany({ product_id: { $in: req._delete } });
        await client
            .db(DB)
            .collection('Locations')
            .deleteMany({ product_id: { $in: req._delete } });
        res.send({ success: true, message: 'Xoá sản phẩm thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports.getAllAtttributeS = async (req, res, next) => {
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

module.exports.addFeedbackS = async (req, res, next) => {
    try {
        let _insert = await client.db(DB).collection(`Feedbacks`).insertOne(req._insert);
        if (!_insert.insertedId) {
            throw new Error('500: Thêm nhận xét thất bại!');
        }
        res.send({ success: true, data: req._insert });
    } catch (err) {
        next(err);
    }
};

module.exports.getAllUnitProductS = async (req, res, next) => {
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

        if (req.query.page == undefined || req.query.page_size == undefined) {
            req.query.page = 1;
            req.query.page_size = 20;
        }

        req.query.page = parseInt(req.query.page);
        req.query.page_size = parseInt(req.query.page_size);

        var result = await client
            .db(DB)
            .collection('UnitProducts')
            .find(mongoQuery)
            .skip((req.query.page - 1) * req.query.page_size)
            .limit(req.query.page_size)
            .toArray();

        var count = await client.db(DB).collection('UnitProducts').find(mongoQuery).count();

        res.send({ success: true, count: count, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports.AddUnitProductS = async (req, res, next) => {
    try {
        await client.db(DB).collection('UnitProducts').insertOne(req.body);

        res.send({ success: true, mess: 'Add Success' });
    } catch (err) {
        next(err);
    }
};
