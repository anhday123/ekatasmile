const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');
const { Action } = require('../models/action');

let getPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.promotion_id) {
            matchQuery['promotion_id'] = ObjectId(req.query.promotion_id);
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
        if (req.query.has_voucher == 'true') {
            matchQuery['has_voucher'] = true;
        }
        if (req.query.has_voucher == 'false') {
            matchQuery['has_voucher'] = false;
        }
        if (req.query.branch_id) {
            matchQuery['branch_id'] = { $in: [ObjectId(req.query.branch_id)] };
        }
        if (req.query.store_id) {
            matchQuery['store_id'] = { $in: [ObjectId(req.query.store_id)] };
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
        if (req.query.type) {
            matchQuery['sub_type'] = createRegExpQuery(req.query.type);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
            ];
        }
        // lấy các thuộc tính tùy chọn khác
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
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [promotions, counts] = await Promise.all([
            client.db(DB).collection(`Promotions`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Promotions`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: promotions,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _promotion = await client.db(DB).collection(`Promotions`).insertOne(req._insert);
        if (!_promotion.insertedId) {
            throw new Error('500: Lỗi hệ thống, tạo chương trình khuyến mãi thất bại!');
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Add',
                properties: 'Promotion',
                name: 'Thêm chương trình khuyến mãi mới',
                data: req._insert,
                performer_id: token.user_id,
                data: moment().utc().format(),
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

let updatePromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Promotions`).updateMany(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Update',
                properties: 'Promotion',
                name: 'Cập nhật chương trình khuyến mãi',
                data: req._update,
                performer_id: token.user_id,
                data: moment().utc().format(),
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

module.exports = {
    getPromotionS,
    addPromotionS,
    updatePromotionS,
};
