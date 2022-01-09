const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const orderService = require(`../services/order`);
const { Order, OrderDetail } = require('../models/order');

var CryptoJS = require('crypto-js');

module.exports._get = async (req, res, next) => {
    try {
        await orderService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        let hmac = req.body.order;
        try {
            let bytes = CryptoJS.AES.decrypt(hmac, 'viesoftwarethanhcong');
            let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            req.body = JSON.parse(decryptedData);
        } catch (err) {
            throw new Error('400: Đơn hàng không chính xác!');
        }
        if (!req.body.order_details || req.body.order_details.length == 0) {
            throw new Error('400: Không thể tạo đơn hàng không có sản phẩm!');
        }
        let [orderMaxId] = await Promise.all([
            client.db(req.user.database).collection('AppSetting').findOne({ name: 'Orders' }),
        ]);
        if (orderMaxId) {
            if (orderMaxId && orderMaxId.value) {
                return orderMaxId.value;
            }
        }
        let productIds = [];
        let variantIds = [];
        req.body.order_details.map((detail) => {
            productIds.push(detail.product_id);
            variantIds.push(detail.variant_id);
        });
        let [products, variants] = await Promise.all([
            client
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
                .toArray(),
            client
                .db(req.user.database)
                .collection('Variants')
                .aggregate([{ $match: { variant_id: { $in: variantIds } } }])
                .toArray(),
        ]);
        let _products = {};
        products.map((eProduct) => {
            _products[String(eProduct.product_id)] = eProduct;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[String(eVariant.variant_id)] = eVariant;
        });
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
                branch_id: req.body.sale_location.branch_id,
                quantity: { $gte: 0 },
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
        let _updates = [];
        let totalCost = 0;
        req.body.order_details = req.body.order_details.map((eDetail) => {
            let _detail = { ..._products[`${eDetail.product_id}`], ..._variants[`${eDetail.variant_id}`], ...eDetail };
            totalCost += eDetail.price * eDetail.quantity;
            if (!_locations[`${eDetail.variant_id}`]) {
                throw new Error('400: Sản phẩm không được cung cấp tại địa điểm bán!');
            }
            let len = _locations[`${eDetail.variant_id}`].length;
            _detail['base_prices'] = [];
            _detail['total_base_price'] = 0;
            for (let i = 0; i < len; i++) {
                if (eDetail.quantity == 0) {
                    break;
                }
                location = _locations[`${eDetail.variant_id}`][i];
                if (eDetail.quantity <= location.quantity) {
                    _detail.base_prices.push({
                        location_id: location.location_id,
                        branch_id: location.branch_id,
                        product_id: location.product_id,
                        variant_id: location.variant_id,
                        price_id: location.price_id,
                        quantity: eDetail.quantity,
                        base_price: (() => {
                            if (_prices[location.price_id] && _prices[location.price_id].import_price) {
                                return _prices[location.price_id].import_price;
                            }
                            throw new Error('400: Không tìm thấy giá vốn!');
                        })(),
                    });
                    _detail.total_base_price += eDetail.quantity * _prices[location.price_id].import_price;
                    location.quantity -= eDetail.quantity;
                    eDetail.quantity = 0;
                }
                if (eDetail.quantity > location.quantity) {
                    if (i == len - 1) {
                        throw new Error('400: Sản phẩm tại địa điểm bán không đủ số lượng cung cấp!');
                    }
                    _detail.base_prices.push({
                        location_id: location.location_id,
                        branch_id: location.branch_id,
                        product_id: location.product_id,
                        variant_id: location.variant_id,
                        price_id: location.price_id,
                        quantity: location.quantity,
                        base_price: (() => {
                            if (_prices[location.price_id] && _prices[location.price_id].import_price) {
                                return _prices[location.price_id].import_price;
                            }
                            throw new Error('400: Không tìm thấy giá vốn!');
                        })(),
                    });
                    _detail.total_base_price += location.quantity * _prices[location.price_id].import_price;
                    eDetail.quantity -= location.quantity;
                    location.quantity = 0;
                }
                _updates.push(location);
            }
            _detail = {
                product_id: _detail.product_id,
                variant_id: _detail.variant_id,
                sku: _detail.sku,
                name: _detail.name,
                title: _detail.title,
                length: _detail.length,
                width: _detail.width,
                height: _detail.height,
                weight: _detail.weight,
                price: _detail.price,
                base_prices: _detail.base_prices,
                quantity: _detail.quantity,
                total_base_price: _detail.total_base_price,
                total_cost: _detail.price * _detail.quantity,
                total_tax: _detail.total_tax || 0,
                total_discount: _detail.total_discount || 0,
                final_cost: _detail.price * _detail.quantity - _detail.total_tax || 0 - _detail.total_discount || 0,
                fulfillment_service: '',
                fulfillment_id: '',
                fulfillment_status: '',
                fulfillable_quantity: 0,
                requires_shipping: false,
                tracking_number: '',
                gift_card: false,
                carrier: '',
                status: '',
            };
            totalCost += _detail.price * _detail.quantity;
            return _detail;
        });
        if (totalCost != req.body.total_cost) {
            throw new Error('400: Tổng giá trị đơn hàng không chính xác!');
        }
        order_id++;
        let _order = {
            order_id: order_id,
            code: String(order_id).padStart(6, '0'),
            channel: req.body.channel || '',
            sale_location: req.body.sale_location,
            customer_id: req.body.customer_id,
            employee_id: req.body.employee_id,
            order_details: req.body.order_details,
            shipping_company_id: req.body.shipping_company_id,
            shipping_info: ((data) => {
                if (!data) {
                    return {};
                }
                return {
                    tracking_number: data.tracking_number,
                    to_name: data.to_name,
                    to_phone: data.to_phone,
                    to_address: data.to_address,
                    to_ward: data.to_ward,
                    to_district: data.to_district,
                    to_province: data.to_province,
                    to_province_code: data.to_province_code,
                    to_postcode: data.to_postcode,
                    to_country_code: data.to_country_code,
                    return_name: data.return_name,
                    return_phone: data.return_phone,
                    return_address: data.return_address,
                    return_ward: data.return_ward,
                    return_district: data.return_district,
                    return_province: data.return_province,
                    return_province_code: data.return_province_code,
                    return_postcode: data.return_postcode,
                    return_country_code: data.return_country_code,
                    fee_shipping: data.fee_shipping,
                    cod: data.cod,
                    delivery_time: data.delivery_time,
                    complete_time: data.complete_time,
                };
            })(req.body.shipping_info),
            voucher: req.body.voucher,
            promotion: req.body.promotion,
            total_cost: req.body.total_cost,
            total_tax: req.body.total_tax,
            total_discount: req.body.total_discount,
            final_cost: req.body.final_cost,
            payment_info: req.body.payment_info,
            customer_paid: req.body.customer_paid,
            customer_debt: req.body.customer_debt,
            payment_info: req.body.payment_info,
            payment_status: req.body.payment_status,
            bill_status: req.body.bill_status,
            ship_status: req.body.ship_status,
            note: req.body.note,
            tags: req.body.tags,
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            verify_date: '',
            verifier_id: '',
            delivery_date: '',
            deliverer_id: '',
            complete_date: '',
            completer_id: '',
            cancel_date: '',
            canceler_id: '',
            refund_date: '',
            refunder_id: '',
            product_handle: '',
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
        };
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne({ name: 'Orders' }, { $set: { name: 'Orders', value: order_id } }, { upsert: true });
        if (!/^(draft)$/gi.test(_order.bill_status)) {
            await Promise.all(
                _updates.map((eUpdate) => {
                    return client
                        .db(req.user.database)
                        .collection('Locations')
                        .updateOne({ location_id: eUpdate.location_id }, { $set: eUpdate });
                })
            );
        }

        await orderService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};
module.exports._update = async (req, res, next) => {
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
        await orderService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
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
