const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        return '';
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

module.exports._get = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id) {
            aggregateQuery.push({
                $match: { product_id: Number(req.query.product_id) },
            });
        }
        if (req.query.code) {
            aggregateQuery.push({ $match: { code: String(req.query.code) } });
        }
        if (req.query.slug) {
            aggregateQuery.push({ $match: { slug: String(req.query.slug) } });
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
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
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
                    slug_name: new RegExp(
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
                                    if (req.query.branch_id) {
                                        return [
                                            {
                                                $match: {
                                                    $expr: { $eq: ['$variant_id', Number(req.query.branch_id)] },
                                                },
                                            },
                                        ];
                                    }
                                    return [];
                                })(),
                                {
                                    $group: {
                                        _id: { type: '$type', branch_id: '$branch_id', store_id: '$store_id' },
                                        branch_id: { $first: '$branch_id' },
                                        quantity: { $sum: '$quantity' },
                                    },
                                },
                            ],
                            as: 'locations',
                        },
                    },
                    {
                        $lookup: {
                            from: 'Prices',
                            let: { variantId: '$variant_id' },
                            pipeline: [{ $match: { $expr: { $eq: ['$variant_id', '$$variantId'] } } }],
                            as: 'base_prices',
                        },
                    },
                    { $addFields: { total_quantity: { $sum: '$locations.quantity' } } },
                ],
                as: 'variants',
            },
        });
        if (req.query.variant_code) {
            aggregateQuery.push({ $match: { 'variants.code': req.query.variant_code } });
        }
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
        aggregateQuery.push({
            $lookup: {
                from: 'Categories',
                localField: 'category_id',
                foreignField: 'category_id',
                as: '_categories',
            },
        });
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
                        foreignField: 'user_id',
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
                        foreignField: 'user_id',
                        as: '_creator',
                    },
                },
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
            );
        }
        if (req.query.detach) {
            aggregateQuery.push({ $unwind: { path: '$variants', preserveNullAndEmptyArrays: true } });
        }
        aggregateQuery.push({
            $project: {
                slug_name: 0,
                'attributes.slug_option': 0,
                'attributes.slug_values': 0,
                'variants.slug_title': 0,
                '_business.password': 0,
                '_business.slug_name': 0,
                '_business.slug_address': 0,
                '_business.slug_district': 0,
                '_business.slug_province': 0,
                '_creator.password': 0,
                '_creator.slug_name': 0,
                '_creator.slug_address': 0,
                '_creator.slug_district': 0,
                '_creator.slug_province': 0,
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
            client.db(req.user.database).collection(`Products`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`Products`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: products,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        let result = req._product;
        let insertProduct = await client.db(req.user.database).collection('Products').insertOne(req._product);
        if (!insertProduct.insertedId) {
            throw new Error('500: Tạo sản phẩm thất bại');
        }
        let insertAttributes = await (() => {
            result.attributes = req.attributes;
            if (req._attributes && req._attributes.length > 0) {
                return client.db(req.user.database).collection('Attributes').insertMany(req._attributes);
            }
            return [];
        })();
        let insertVariants = await (() => {
            result.variants = req._variants;
            if (req._variants && req._variants.length > 0) {
                return client.db(req.user.database).collection('Variants').insertMany(req._variants);
            }
            return [];
        })();
        res.send({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        let result = { ...req._product, attributes: req._attributes, variants: req._variants };
        await Promise.all([
            client
                .db(req.user.database)
                .collection('Products')
                .updateOne({ product_id: req._product.product_id }, { $set: req._product }, { upsert: true }),
            Promise.all(
                req._attributes.map((eAttribute) => {
                    return client
                        .db(req.user.database)
                        .collection('Attributes')
                        .updateOne({ attribute_id: eAttribute.attribute_id }, { $set: eAttribute }, { upsert: true });
                })
            ),
            Promise.all(
                req._variants.map((eVariant) => {
                    return client
                        .db(req.user.database)
                        .collection('Variants')
                        .updateOne({ variant_id: eVariant.variant_id }, { $set: eVariant }, { upsert: true });
                })
            ),
        ]);
        res.send({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._getAllAttributes = async (req, res, next) => {
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
        let locations = await client.db(req.user.database).collection('Locations').find(mongoQuery).toArray();
        let productIds = locations.map((location) => {
            return location.product_id;
        });
        productIds = [...new Set(productIds)];
        let attributes = await client
            .db(req.user.database)
            .collection('Attributes')
            .find({ product_id: { $in: productIds } })
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

module.exports._createFeedback = async (req, res, next) => {
    try {
        let _insert = await client.db(req.user.database).collection(`Feedbacks`).insertOne(req._insert);
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
            .db(req.user.database)
            .collection('UnitProducts')
            .find(mongoQuery)
            .skip((req.query.page - 1) * req.query.page_size)
            .limit(req.query.page_size)
            .toArray();

        var count = await client.db(req.user.database).collection('UnitProducts').find(mongoQuery).count();

        res.send({ success: true, count: count, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports.AddUnitProductS = async (req, res, next) => {
    try {
        await client.db(req.user.database).collection('UnitProducts').insertOne(req.body);

        res.send({ success: true, mess: 'Add Success' });
    } catch (err) {
        next(err);
    }
};
