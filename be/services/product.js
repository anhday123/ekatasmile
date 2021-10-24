const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.product_id) {
            matchQuery['product_id'] = ObjectId(req.query.product_id);
        }
        if (token) {
            matchQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            matchQuery['business_id'] = ObjectId(req.query.business_id);
        }
        if (req.query.creator_id) {
            matchQuery['creator_id'] = ObjectId(req.query.creator_id);
        }
        if (req.query.branch_id) {
            matchQuery['branch_id'] = ObjectId(req.query.branch_id);
        }
        if (req.query.category_id) {
            matchQuery['category_id'] = ObjectId(req.query.category_id);
        }
        if (req.query.supplier_id) {
            matchQuery['supplier_id'] = ObjectId(req.query.supplier_id);
        }
        if (req.query.slug) {
            matchQuery['slug'] = req.query.slug;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        aggregateQuery.push({ $match: matchQuery });
        // lấy các thuộc tính tùy chọn khác
        aggregateQuery.push({
            $lookup: {
                from: 'Attributes',
                let: { productId: '$product_id' },
                pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                as: 'attributes',
            },
        });
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
                                ...(() => {
                                    if (req.query.store_id) {
                                        return [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ['$inventory_id', ObjectId(req.query.store_id)],
                                                    },
                                                },
                                            },
                                        ];
                                    }
                                    if (req.query.branch_id) {
                                        return [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ['$inventory_id', ObjectId(req.query.branch_id)],
                                                    },
                                                },
                                            },
                                        ];
                                    }
                                    return [];
                                })(),
                                ...(() => {
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
                                })(),
                            ],
                            as: 'locations',
                        },
                    },
                ],
                as: 'variants',
            },
        });
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
                { $unwind: '$_business' }
            );
            projectQuery['_business.password'] = 0;
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
                { $unwind: '$_creator' }
            );
            projectQuery['_creator.password'] = 0;
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        // lấy data từ database
        let [products, counts] = await Promise.all([
            client.db(DB).collection(`Products`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Products`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: products,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (req._insert._products) {
            await Promise.all(
                req._insert._products.map((_product) => {
                    client
                        .db(DB)
                        .collection('Products')
                        .updateOne(
                            {
                                business_id: ObjectId(token.business_id),
                                product_id: ObjectId(_product.product_id),
                            },
                            { $set: _product },
                            { upsert: true }
                        );
                })
            );
        }
        if (req._insert._attributes) {
            await Promise.all(
                req._insert._attributes.map((_attribute) => {
                    client
                        .db(DB)
                        .collection('Attributes')
                        .updateOne(
                            {
                                product_id: ObjectId(_attribute.product_id),
                                option: _attribute.option,
                            },
                            { $set: _attribute },
                            { upsert: true }
                        );
                })
            );
        }
        if (req._insert._variants) {
            await Promise.all(
                req._insert._variants.map((_variant) => {
                    client
                        .db(DB)
                        .collection('Variants')
                        .updateOne(
                            {
                                product_id: ObjectId(_variant.product_id),
                                variant_id: _variant.variant_id,
                            },
                            { $set: _variant },
                            { upsert: true }
                        );
                })
            );
        }
        if (req._insert._variants) {
            await Promise.all([client.db(DB).collection('Locations').insertMany(req._insert._locations)]);
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
        let token = req.tokenData.data;
        await client.db(DB).collection(`Products`).updateMany(req.params, { $set: req._update });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProductS,
    addProductS,
    updateProductS,
};
