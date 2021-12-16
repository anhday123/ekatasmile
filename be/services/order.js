const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');
const { ForecastService } = require('aws-sdk');

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
        if (req.query.code) {
            aggregateQuery.push({ $match: { code: String(req.query.code) } });
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
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
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.chanel) {
            aggregateQuery.push({ $match: { chanel: new RegExp(removeUnicode(req.query.chanel, true), 'ig') } });
        }
        if (req.query.product_name) {
            aggregateQuery.push({
                $match: {
                    'order_details.sub_title': {
                        $in: [
                            new RegExp(
                                `${removeUnicode(req.query.product_name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        ],
                    },
                },
            });
        }
        if (req.query.product_sku) {
            aggregateQuery.push({
                $match: {
                    'order_details.sku': {
                        $in: [
                            new RegExp(
                                `${removeUnicode(req.query.product_sku, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        ],
                    },
                },
            });
        }
        if (req.query.customer_code) {
            aggregateQuery.push({ $match: { 'customer.code': Number(req.query.customer_code) } });
        }
        if (req.query.customer_name) {
            aggregateQuery.push({
                $match: {
                    'customer.sub_name': new RegExp(
                        `${removeUnicode(req.query.customer_name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.customer_phone) {
            aggregateQuery.push({
                $match: {
                    'customer.phone': new RegExp(
                        `${removeUnicode(req.query.customer_phone, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.employee_name) {
            aggregateQuery.push({
                $match: {
                    'employee.sub_name': new RegExp(
                        `${removeUnicode(req.query.employee_name, false).replace(/(\s){1,}/g, '(.*?)')}`,
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

        aggregateQuery.push({
            $project: {
                '_business.password': 0,
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
        let sortQuery = (() => {
            if (req.body.type == 'LIFO') {
                return { create_date: -1 };
            }
            return { create_date: 1 };
        })();
        let locations = await client
            .db(DB)
            .collection('Locations')
            .find({
                variant_id: { $in: req.variantIds },
                type: req.saleAt.type,
                inventory_id: req.saleAt.inventory_id,
            })
            .sort(sortQuery)
            .toArray();
        let _locations = {};
        locations.map((location) => {
            if (!_locations[String(location.variant_id)]) {
                _locations[String(location.variant_id)] = [];
            }
            if (_locations[String(location.variant_id)]) {
                _locations[String(location.variant_id)].push(location);
            }
        });
        let _update = [];
        req._insert.order_details.map((_detail) => {
            let locationArray = _locations[String(_detail.variant_id)];
            for (let i in locationArray) {
                if (_detail.quantity <= 0) {
                    break;
                }
                if (locationArray[i].quantity > 0) {
                    if (locationArray[i].quantity > _detail.quantity) {
                        locationArray[i].quantity = Number(locationArray[i].quantity) - Number(_detail.quantity);
                        _detail.quantity = 0;
                        _update.push(locationArray[i]);
                    } else {
                        _detail.quantity = Number(_detail.quantity) - Number(locationArray[i].quantity);
                        locationArray[i].quantity = 0;
                        _update.push(locationArray[i]);
                    }
                }
            }
            // if (_detail.quantity > 0) {
            //     throw new Error('400: Số lượng sản phẩm trong kho không đủ cung cấp');
            // }
        });
        await new Promise(async (resolve, reject) => {
            for (let i in _update) {
                await client
                    .db(DB)
                    .collection('Locations')
                    .updateOne({ location_id: Number(_update[i].location_id) }, { $set: _update[i] });
            }
            resolve();
        });
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
