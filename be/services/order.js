const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        // mongoQuery['delete'] = false;
        if (req.query.order_id) {
            mongoQuery['order_id'] = ObjectId(req.query.order_id);
        }
        if (token) {
            mongoQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = ObjectId(req.query.business_id);
        }
        if (req.query.employee_id) {
            mongoQuery['employee_id'] = ObjectId(req.query.employee_id);
        }
        if (req.query.customer_id) {
            mongoQuery['customer_id'] = ObjectId(req.query.customer_id);
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            mongoQuery['code'] = createRegExpQuery(req.query.code);
        }
        if (req.query.bill_status) {
            mongoQuery['bill_status'] = createRegExpQuery(req.query.bill_status);
        }
        if (req.query.shipping_status) {
            mongoQuery['shipping_status'] = createRegExpQuery(req.query.shipping_status);
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        console.log(mongoQuery);
        // lấy data từ database
        let orders = await client.db(DB).collection(`Orders`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        orders.reverse();
        // đếm số phần tử
        let _counts = orders.length;
        // phân trang
        if (page && page_size) {
            orders = orders.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [users, branchs, stores, customers, shippingCompanies] = await Promise.all([
            client.db(DB).collection(`Users`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Branchs`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Stores`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Customers`).find({ business_id: mongoQuery.business_id }).toArray(),
            client
                .db(DB)
                .collection(`ShippingCompanies`)
                .find({ business_id: mongoQuery.business_id })
                .toArray(),
        ]);
        let _business = {};
        let _employee = {};
        users.map((user) => {
            delete user.password;
            _business[user.user_id] = user;
            _employee[user.user_id] = user;
        });
        let _customers = {};
        customers.map((customer) => {
            _customers[customer.customer_id] = customer;
        });
        let _branchs = {};
        branchs.map((branch) => {
            _branchs[branch.branch_id] = branch;
        });
        let _stores = {};
        stores.map((store) => {
            _stores[store.store_id] = store;
        });
        let _shippingCompanies = {};
        shippingCompanies.map((shippingCompanie) => {
            _shippingCompanies[shippingCompanie.shipping_company_id] = shippingCompanie;
        });
        orders.map((order) => {
            order['_business'] = { ..._business[order.business_id] };
            order['_employee'] = { ..._employee[order.employee_id] };
            order['_customer'] = { ..._customers[order.customer_id] };
            order['_branch'] = { ..._branchs[order.branch_id] };
            order['_store'] = { ..._stores[order.store_id] };
            order['_shipping_company'] = { ..._shippingCompanies[order.employee_id] };
            return order;
        });
        res.send({
            success: true,
            data: orders,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _order = await client.db(DB).collection(`Orders`).insertOne(req._order);
        if (!_order.insertedId) throw new Error(`500: Create order fail!`);
        // await Promise.all(
        //     req._updates.map((_update) => {
        //         client
        //             .db(DB)
        //             .collection(req.ProductCollection)
        //             .findOneAndUpdate({ product_id: _update.product_id }, { $set: _update });
        //     })
        // );
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: 'add',
                properties: `Order`,
                sub_properties: 'order',
                name: `Thêm đơn hàng mới`,
                sub_name: 'themdonhangmoi',
                data: _order.ops[0],
                performer_id: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _order.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Orders`).updateMany(req.query, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                properties: `Order`,
                name: `Cập nhật thông tin đơn hàng`,
                data: req.body,
                performer: token.user_id,
                date: moment().format(),
            });
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
