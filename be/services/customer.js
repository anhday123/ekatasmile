const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');
const { Action } = require('../models/action');

let getCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.customer_id) {
            matchQuery['customer_id'] = ObjectId(req.query.customer_id);
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
        if (req.query.type) {
            matchQuery['sub_type'] = createRegExpQuery(req.query.type);
        }
        if (req.query.gender) {
            matchQuery['sub_gender'] = createRegExpQuery(req.query.gender);
        }
        if (req.query.name) {
            matchQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.address) {
            matchQuery['sub_address'] = createRegExpQuery(req.query.address);
        }
        if (req.query.district) {
            matchQuery['sub_district'] = createRegExpQuery(req.query.district);
        }
        if (req.query.province) {
            matchQuery['sub_province'] = createRegExpQuery(req.query.province);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { phone: createRegExpQuery(req.query.search) },
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
        let [customers, counts] = await Promise.all([
            client.db(DB).collection(`Customers`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Customers`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: customers,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _customer = await client.db(DB).collection(`Customers`).insertOne(req._insert);
        if (!_customer.insertedId) {
            throw new Error(`500: Lỗi hệ thống, tạo khách hàng thất bại!`);
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Add',
                properties: 'Customer',
                name: 'Thêm khách hàng mới',
                data: req._insert,
                performer_id: token.user_id,
                data: moment().utc().format(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: _customer.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Customers`).findOneAndUpdate(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Update',
                properties: 'Customer',
                name: 'Cập nhật thông tin khách hàng',
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
    getCustomerS,
    addCustomerS,
    updateCustomerS,
};
