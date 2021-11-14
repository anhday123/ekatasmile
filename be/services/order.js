const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

let getOrderS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.order_id) {
            aggregateQuery.push({ $match: { order_id: Number(req.query.order_id) } });
        }
        if (req.user) {
            aggregateQuery.push({ $match: { business_id: Number(req.user.business_id) } });
        }
        if (req.query.business_id) {
            aggregateQuery.push({ $match: { business_id: Number(req.query.business_id) } });
        }
        if (req.query.employee_id) {
            aggregateQuery.push({ $match: { employee_id: Number(req.query.employee_id) } });
        }
        if (req.query.customer_id) {
            aggregateQuery.push({ $match: { customer_id: Number(req.query.customer_id) } });
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
        if (req.query.bill_status) {
            aggregateQuery.push({
                $match: {
                    bill_status: new RegExp(
                        `${removeUnicode(req.query.bill_status, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.shipping_status) {
            aggregateQuery.push({
                $match: {
                    shipping_status: new RegExp(
                        `${removeUnicode(req.query.shipping_status, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
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
                { $unwind: { path: '$_business', preserveNullAndEmptyArrays: true } }
            );
        }
        if (req.query._employee) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'employee_id',
                        foreignField: 'user_id',
                        as: '_employee',
                    },
                },
                { $unwind: { path: '$_employee', preserveNullAndEmptyArrays: true } }
            );
        }
        if (req.query._customer) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Customers',
                        localField: 'customer_id',
                        foreignField: 'customer_id',
                        as: '_customer',
                    },
                },
                { $unwind: { path: '$_customer', preserveNullAndEmptyArrays: true } }
            );
        }
        aggregateQuery.push({
            $project: {
                '_business.password': 0,
                '_employee.password': 0,
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
        let [orders, counts] = await Promise.all([
            client.db(DB).collection(`Orders`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Orders`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            data: orders,
            count: counts[0] ? counts[0].counts : 0,
        });
    } catch (err) {
        next(err);
    }
};

let addOrderS = async (req, res, next) => {
    try {
        let _order = await client.db(DB).collection(`Orders`).insertOne(req._insert);
        if (!_order.insertedId) {
            throw new Error('500: Lỗi hệ thống, tạo đơn hàng thất bại!');
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Add',
                properties: 'Order',
                name: 'Thêm đơn hàng mới',
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

let updateOrderS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Promotions`).updateMany(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Update',
                properties: 'Promotion',
                name: 'Cập nhật thông tin đơn hàng',
                data: req._update,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getOrderS,
    addOrderS,
    updateOrderS,
};
