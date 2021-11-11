const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const orderService = require(`../services/order`);
const { Order, OrderDetail } = require('../models/order');

let getOrderC = async (req, res, next) => {
    try {
        await orderService.getOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addOrderC = async (req, res, next) => {
    try {
        let _order = new Order();
        // _order.validateInput(req.body);
        const _saleAt = (() => {
            if (req.body.sale_location) {
                if (req.body.sale_location.branch_id) {
                    return {
                        collection: 'Branchs',
                        location: {
                            branch_id: Number(req.body.sale_location.branch_id),
                        },
                    };
                }
                if (req.body.sale_location.store_id) {
                    return {
                        collection: 'Stores',
                        location: {
                            store_id: Number(req.body.sale_location.store_id),
                        },
                    };
                }
                throw new Error('400: Địa điểm bán hàng không chính xác!');
            }
            throw new Error('400: Đơn hàng phải có địa điểm bán hàng!');
        })();
        let variant_ids = (() => {
            return req.body.order_details.map((detail) => {
                return detail.variant_id;
            });
        })();
        let saleLocation = await client.db(DB).collection(_saleAt.collection).findOne(_saleAt.location);
        let variants = await client
            .db(DB)
            .collection('Variants')
            .aggregate([{ $match: { variant_id: { $in: variant_ids } } }])
            .toArray();
        let _variants = {};
        variants.map((variant) => {
            return (_variants[String(variant.variant_id)] = variant);
        });
        if (!saleLocation) {
            throw new Error('400: Địa điểm bán hàng không tồn tại!');
        }
        req.body.sale_location = saleLocation;
        req.body.order_details.map((detail) => {
            let _detail = new OrderDetail();
            _detail.create({ ...detail });
            return _detail;
        });
        _order.create({
            ...req.body,
            ...{ business_id: Number(req.user.business_id), create_date: new Date() },
        });
        req[`_insert`] = _order;
        // console.log(_order);
        await orderService.addOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateOrderC = async (req, res, next) => {
    try {
        req.params.order_id = Number(req.params.order_id);
        let _order = new Order();
        let order = await client.db(DB).collection(`Orders`).findOne(req.params);
        if (!order) {
            throw new Error(`400: Đơn hàng không tồn tại!`);
        }
        _order.create(order);
        _order.update(req.body);
        req['_update'] = _order;
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
