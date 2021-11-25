const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

let getCategoryS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        aggregateQuery.push({ $match: { parent_id: -1 } });
        if (req.query.category_id) {
            aggregateQuery.push({ $match: { category_id: Number(req.query.category_id) } });
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
                    sub_name: new RegExp(
                        `${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.search) {
            aggregateQuery.push({
                $match: {
                    $or: [
                        {
                            code: new RegExp(
                                `${removeUnicode(req.query.search, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        },
                        {
                            sub_name: new RegExp(
                                `${removeUnicode(req.query.search, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        },
                    ],
                },
            });
        }
        // lấy các thuộc tính tùy chọn khác
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Products',
                    localField: 'category_id',
                    foreignField: 'category_id',
                    as: '_products',
                },
            },
            { $addFields: { product_quantity: { $size: '$_products' } } }
        );
        aggregateQuery.push({
            $lookup: {
                from: 'Categories',
                let: { categoryId: '$category_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$parent_id', '$$categoryId'] } } },
                    ...(() => {
                        if (req.query._creator) {
                            return [
                                {
                                    $lookup: {
                                        from: 'Users',
                                        localField: 'creator_id',
                                        foreignField: 'user_id',
                                        as: '_creator',
                                    },
                                },
                                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } },
                            ];
                        }
                        return [];
                    })(),
                    {
                        $lookup: {
                            from: 'Products',
                            localField: 'category_id',
                            foreignField: 'category_id',
                            as: '_products',
                        },
                    },
                    { $addFields: { product_quantity: { $size: '$_products' } } },
                ],
                as: 'children_category',
            },
        });
        aggregateQuery.push({
            $lookup: {
                from: 'Deals',
                let: { categoryId: '$category_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $in: ['$$categoryId', '$category_list'] }, { $eq: ['$type', 'category'] }],
                            },
                        },
                    },
                ],
                as: '_deals',
            },
        });
        aggregateQuery.push({ $addFields: { 'children_category._deals': '$_deals' } });
        aggregateQuery.push({ $addFields: { 'children_category.children_category._deals': '$_deals' } });
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
        aggregateQuery.push({
            $project: {
                sub_name: 0,
                _products: 0,
                'children_category._products': 0,
                'children_category._business.password': 0,
                'children_category._creator.password': 0,
                '_business.password': 0,
                '_creator.password': 0,
            },
        });
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { priority: 1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        // lấy data từ database
        var [categories, counts] = await Promise.all([
            client.db(DB).collection(`Categories`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Categories`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            data: categories,
            count: counts[0] ? counts[0].counts : 0,
        });
    } catch (err) {
        next(err);
    }
};

let addCategoryS = async (req, res, next) => {
    try {
        let _category = await client.db(DB).collection(`Categories`).insertOne(req._insert);
        if (!_category.insertedId) {
            throw new Error('500: Lỗi hệ thống, tạo phân loại sản phẩm thất bại!');
        }
        if (req.body.products) {
            await client
                .db(DB)
                .collection(`Products`)
                .updateMany(
                    { product_id: { $in: products } },
                    { $set: { category_id: Number(req._insert.category_id) } }
                );
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Add',
                properties: 'Category',
                name: 'Thêm phân loại sản phẩm mới',
                data: req._insert,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req._insert });
    } catch (err) {
        next(err);
    }
};

let updateCategoryS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Categories`).findOneAndUpdate(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Update',
                properties: 'Category',
                name: 'Cập nhật phân loại sản phẩm',
                data: req._update,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

let deleteCategoryS = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Categories`)
            .deleteMany({ category_id: { $in: req._delete } });
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Delete',
                properties: 'Category',
                name: 'Xóa phân loại sản phẩm',
                data: req._delete,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, message: 'Xóa phân loại sản phẩm thành công!', data: req._delete });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addCategoryS,
    getCategoryS,
    updateCategoryS,
    deleteCategoryS,
};
