const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.category_id) {
            matchQuery['category_id'] = ObjectId(req.query.category_id);
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
        if (req.query.code) {
            matchQuery['code'] = createRegExpQuery(req.query.code);
        }
        if (req.query.name) {
            matchQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
            ];
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy các thuộc tính tùy chọn khác
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
                        foreignField: 'user_id',
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
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        var [categories, counts] = await Promise.all([
            client.db(DB).collection(`Categories`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Categories`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: categories,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _category = await client.db(DB).collection(`Categories`).insertOne(req._insert);
        if (!_category.insertedId) throw new Error(`500: Create category fail!`);
        if (req.body.products) {
            await Promise.all(
                req.body.products.map((product) => {
                    client
                        .db(DB)
                        .collection(`Products`)
                        .findOneAndUpdate(
                            { product_id: product },
                            { $set: { category_id: req._insert.category_id } }
                        );
                })
            );
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Category`,
                sub_properties: `category`,
                name: `Thêm loại sản phẩm mới`,
                sub_name: `themloaisanphammoi`,
                data: _category.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _category.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Categories`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Category`,
                sub_properties: `category`,
                name: `Cập nhật thông tin phân loại sản phẩm`,
                sub_name: `capnhatthongtinphanloaisanpham`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addCategoryS,
    getCategoryS,
    updateCategoryS,
};
