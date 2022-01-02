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
        let hmac = req.body.order;
        try {
            let bytes = CryptoJS.AES.decrypt(hmac, 'viesoftwarethanhcong');
            let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            req.body = JSON.parse(decryptedData);
        } catch (err) {
            throw new Error('400: Đơn hàng không chính xác!');
        }
        let _order = new Order();
        // _order.validateInput(req.body);
        const saleAt = (() => {
            if (req.body.sale_location) {
                if (req.body.sale_location.branch_id) {
                    return {
                        collection: 'Branchs',
                        type: 'BRANCH',
                        inventory_id: req.body.sale_location.branch_id,
                        location: {
                            branch_id: Number(req.body.sale_location.branch_id),
                        },
                    };
                }
                if (req.body.sale_location.store_id) {
                    return {
                        collection: 'Stores',
                        type: 'STORE',
                        inventory_id: req.body.sale_location.store_id,
                        location: {
                            store_id: Number(req.body.sale_location.store_id),
                        },
                    };
                }
                throw new Error('400: Địa điểm bán hàng không xác định được!');
            }
            return false;
        })();
        req['saleAt'] = saleAt;
        req.body['sale_location'] = await (async () => {
            if (saleAt) {
                let result = await client.db(req.user.database).collection(saleAt.collection).findOne(saleAt.location);
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
            .db(req.user.database)
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
        let variantIds = (() => {
            return req.body.order_details.map((detail) => {
                return Number(detail.variant_id);
            });
        })();
        req['variantIds'] = variantIds;
        let variants = await client
            .db(req.user.database)
            .collection('Variants')
            .aggregate([{ $match: { variant_id: { $in: variantIds } } }])
            .toArray();
        let _variants = {};
        variants.map((variant) => {
            _variants[String(variant.variant_id)] = variant;
        });
        req.body['customer'] = await client
            .db(req.user.database)
            .collection('Customers')
            .findOne({ customer_id: Number(req.body.customer_id) });
        if (req.body.customer) {
            delete req.body.customer.password;
        }
        req.body['employee'] = await client
            .db(req.user.database)
            .collection('Users')
            .findOne({ user_id: Number(req.body.employee_id) });
        if (req.body.employee) {
            delete req.body.employee.password;
        }
        if (!req.body.order_details || req.body.order_details.length == 0) {
            throw new Error('400: Không thể tạo đơn hàng không có sản phẩm!');
        }
        let sortQuery = (() => {
            if (req.user.price_recipe == 'FIFO') {
                return { create_date: 1 };
            }
            return { create_date: -1 };
        })();
        let locations = await client
            .db(req.user.database)
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
        let prices = await client
            .db(req.user.database)
            .collection('Prices')
            .find({ variant_id: { $in: req.variantIds } })
            .toArray();
        let _prices = {};
        prices.map((price) => {
            _prices[String(price.price_id)] = price;
        });
        let _update = [];
        req.body.order_details = req.body.order_details.map((detail) => {
            let _detail = new OrderDetail();
            let locationArray = _locations[String(detail.variant_id)];
            let base_prices = [];
            let total_base_price = 0;
            for (let i in locationArray) {
                if (detail.quantity <= 0) {
                    break;
                }
                if (locationArray[i].quantity > 0) {
                    if (locationArray[i].quantity > detail.quantity) {
                        base_prices.push({
                            import_price: _prices[locationArray[i].price_id].import_price,
                            quantity: detail.quantity,
                        });
                        total_base_price += _prices[locationArray[i].price_id].import_price * detail.quantity;
                        locationArray[i].quantity = Number(locationArray[i].quantity) - Number(detail.quantity);
                        detail.quantity = 0;
                        _update.push(locationArray[i]);
                    } else {
                        base_prices.push({
                            import_price: _prices[locationArray[i].price_id].import_price,
                            quantity: locationArray[i].quantity,
                        });
                        total_base_price += _prices[locationArray[i].price_id].import_price * locationArray[i].quantity;
                        detail.quantity = Number(detail.quantity) - Number(locationArray[i].quantity);
                        locationArray[i].quantity = 0;
                        _update.push(locationArray[i]);
                    }
                }
            }
            // if (detail.quantity > 0) {
            //     throw new Error('400: Số lượng sản phẩm trong kho không đủ cung cấp');
            // }
            _detail.create({
                ..._variants[String(detail.variant_id)],
                ..._products[String(detail.product_id)],
                properties: (() => {
                    if (_variants[String(detail.variant_id)] && _variants[String(detail.variant_id)].options) {
                        return _variants[String(detail.variant_id)].options;
                    }
                    return [];
                })(),
                ...detail,
                base_prices: base_prices,
                total_base_price: total_base_price,
            });
            return _detail;
        });
        if ((req.body.voucher && req.body.voucher != '') || (req.body.promotion_id && req.body.promotion_id != '')) {
            if (req.body.voucher && req.body.voucher != '') {
                let promotion = await client
                    .db(req.user.database)
                    .collection('Promotions')
                    .findOne({ promotion_code: req.body.voucher.split('_')[0] });
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
                            .db(req.user.database)
                            .collection('Promotion')
                            .updateOne({ promotion_id: promotion.promotion_id }, { $set: promotion });
                        // delete promotion.vouchers;
                        req.body.promotion = promotion;
                    } else {
                        req.body.promotion = {};
                    }
                }
            }
            if (req.body.promotion_id) {
                let promotion = await client
                    .db(req.user.database)
                    .collection('Promotions')
                    .findOne({ promotion_id: Number(req.body.promotion_id) });
                if (!promotion) {
                    throw new Error('400: Chương trình khuyến mãi không tồn tại hoặc đã hết hạn!');
                }
                req.body.promotion = promotion;
            }
        } else {
            req.body.promotion = {};
        }
        let maxOrderId = await client.db(req.user.database).collection('AppSetting').findOne({ name: 'Orders' });
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

        await new Promise(async (resolve, reject) => {
            for (let i in _update) {
                await client
                    .db(req.user.database)
                    .collection('Locations')
                    .updateOne({ location_id: Number(_update[i].location_id) }, { $set: _update[i] });
            }
            resolve();
        });
        await client
            .db(req.user.database)
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
        let order = await client.db(req.user.database).collection(`Orders`).findOne(req.params);
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

let _delete = async (req, res, next) => {
    try {
        await client
            .db(req.user.database)
            .collection('Orders')
            .deleteMany({ order_id: { $in: req.body.order_id } });
        res.send({ success: true, message: 'Xóa đơn hàng thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getOrderC,
    addOrderC,
    updateOrderC,
    _delete,
};
