const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const orderService = require(`../services/order`);
const { Order, OrderDetail } = require('../models/order');

var CryptoJS = require('crypto-js');

let getOrderC = async (req, res, next) => {
    try {
        await orderService.getOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addOrderC = async (req, res, next) => {
    try {
        let hmac = req.body;
        // let bytes = CryptoJS.AES.decrypt(hmac, 'viesofwarethanhcong');
        // let orderContent = bytes.toString(CryptoJS.enc.Utf8);
        // req.body = JSON.parse(orderContent);
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
                throw new Error('400: Địa điểm bán hàng không xác định được!');
            }
            return false;
        })();
        req.body['sale_location'] = await (async () => {
            if (_saleAt) {
                let result = await client.db(DB).collection(_saleAt.collection).findOne(_saleAt.location);
                return result;
            }
            return {};
        })();
        let productIds = (() => {
            return req.body.order_details.map((detail) => {
                return Number(detail.product_id);
            });
        })();
        let products = await client
            .db(DB)
            .collection('Products')
            .aggregate([
                { $match: { product_id: { $in: productIds } } },
                {
                    $lookup: {
                        from: 'Variants',
                        let: { productId: '$product_id' },
                        pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                        as: 'variants',
                    },
                },
            ])
            .toArray();
        let _products = {};
        products.map((product) => {
            _products[String(product.product_id)] = product;
        });
        let varianIds = (() => {
            return req.body.order_details.map((detail) => {
                return Number(detail.variant_id);
            });
        })();
        let variants = await client
            .db(DB)
            .collection('Variants')
            .aggregate([{ $match: { variant_id: { $in: varianIds } } }])
            .toArray();
        let _variants = {};
        variants.map((variant) => {
            _variants[String(variant.variant_id)] = variant;
        });
        req.body['customer'] = await client
            .db(DB)
            .collection('Customers')
            .findOne({ customer_id: Number(req.body.customer_id) });
        if (req.body.customer) {
            delete req.body.customer.password;
        }
        req.body['employee'] = await client
            .db(DB)
            .collection('Users')
            .findOne({ user_id: Number(req.body.employee_id) });
        if (req.body.employee) {
            delete req.body.employee.password;
        }
        req.body.order_details = req.body.order_details.map((detail) => {
            let _detail = new OrderDetail();
            _detail.create({
                ..._variants[String(detail.variant_id)],
                ..._products[String(detail.product_id)],
                ...detail,
                properties: _variants[String(detail.variant_id)].options,
            });
            return _detail;
        });
        req.body.promotion = (() => {
            if (
                (req.body.voucher && req.body.voucher != '') ||
                (req.body.promotion_id && req.body.promotion_id != '')
            ) {
                if (req.body.voucher && req.body.voucher != '') {
                    let promotion = await client
                        .db(DB)
                        .collection('Promotions')
                        .findOne({ promotion_code: req.body.voucher.split('_')[1] });
                    if (!promotion) {
                        throw new Error('400: Chương trình khuyến mãi không tồn tại hoặc đã hết hạn!');
                    }
                    if (promotion.vouchers) {
                        let checkVoucher = false;
                        promotion.vouchers = promotion.vouchers.map((voucher) => {
                            if (voucher.voucher == req.body.voucher) {
                                voucher.active = false;
                                checkVoucher = true;
                            }
                        });
                        if (checkVoucher) {
                            await client
                                .db(DB)
                                .collection('Promotion')
                                .updateOne({ promotion_id: promotion.promotion_id }, { $set: promotion });
                            // delete promotion.vouchers;
                            return promotion;
                        }
                    }
                }
                if (req.body.promotion_id) {
                    let promotion = await client
                        .db(DB)
                        .collection('Promotions')
                        .findOne({ promotion_id: Number(req.body.promotion_id) });
                    if (!promotion) {
                        throw new Error('400: Chương trình khuyến mãi không tồn tại hoặc đã hết hạn!');
                    }
                    return promotion;
                }
                return {};
            }
            return {};
        })();
        let maxOrderId = await client.db(DB).collection('AppSetting').findOne({ name: 'Orders' });
        let order_id = (() => {
            if (maxOrderId) {
                if (maxOrderId.value) {
                    return maxOrderId.value;
                }
            }
            return 0;
        })();
        order_id++;
        _order.create({
            ...req.body,
            ...{
                business_id: Number(req.user.business_id),
                order_id: Number(order_id),
                create_date: new Date(),
                hmac: hmac,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Orders' }, { $set: { name: 'Orders', value: order_id } }, { upsert: true });
        req[`_insert`] = _order;
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
