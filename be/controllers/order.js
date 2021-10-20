const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const orderService = require(`../services/order`);
const { Order, OrderDetail } = require('../models/order');

let removeUnicode = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]|\s/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getOrderC = async (req, res, next) => {
    try {
        await orderService.getOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addOrderC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _order = new Order();
        // _order.validateInput(req.body);
        const _saleAt = (() => {
            if (req.body.sale_location) {
                if (req.body.sale_location.branch_id) {
                    return {
                        collection: 'Branchs',
                        location: {
                            branch_id: ObjectId(req.body.sale_location.branch_id),
                            delete: false,
                            active: true,
                        },
                    };
                }
                if (req.body.sale_location.store_id) {
                    return {
                        collection: 'Stores',
                        location: {
                            store_id: ObjectId(req.body.sale_location.store_id),
                            delete: false,
                            active: true,
                        },
                    };
                }
                throw new Error('400: Địa điểm bán hàng không chính xác!');
            }
            throw new Error('400: Đơn hàng phải có địa điểm bán hàng!');
        })();
        let _skuVariants = (() => {
            return req.body.order_details.map((detail) => {
                return detail.sku;
            });
        })();
        let [business, saleLocation, skuVariants] = await Promise.all([
            client
                .db(DB)
                .collection('Users')
                .findOne({ business_id: ObjectId(token.business_id) }),
            client.db(DB).collection(_saleAt.collection).findOne(_saleAt.location),
            client
                .db(DB)
                .collection('Variants')
                .aggregate([{ $match: { sku: { $in: _skuVariants } } }])
                .toArray(),
        ]);
        _skuVariants = (() => {
            let result = {};
            skuVariants.map((variant) => {
                if (!result[variant.sku]) {
                    result[variant.sku] = [];
                }
                if (result[variant.sku]) {
                    result[variant.sku].push(variant);
                }
            });
            return result;
        })();
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (!saleLocation) {
            throw new Error('400: Địa điểm bán hàng <sale_location> không chính xác hoặc đã dừng hoạt động!');
        }
        req.body.sale_location = saleLocation;
        req.body.order_details.map((detail) => {
            let _detail = new OrderDetail();
            _detail.create(detail);
            return _detail;
        });
        _order.create({
            ...req.body,
            ...{ business_id: ObjectId(token.business_id), create_date: moment().utc().format() },
        });
        req[`_order`] = _order;
        // console.log(_order);
        await orderService.addOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateOrderC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _order = await client.db(DB).collection(`Orders`).findOne(req.params);
        if (!_order) throw new Error(`400: Order is not exists!`);
        delete req.body._id;
        delete req.body.order_id;
        delete req.body.business_id;
        delete req.body.sale_at;
        delete req.body.employee_id;
        delete req.body.customer_id;
        delete req.body.create_date;
        delete req.body._business;
        delete req.body._employee;
        delete req.body._customer;
        delete req.body._branch;
        delete req.body._store;
        delete req.body._shipping_company;
        await orderService.updateOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getOrderC,
    addOrderC,
    updateOrderC,
};
