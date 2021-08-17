const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/category`);
const orderService = require(`../services/order`);

let getOrderC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getCategory))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await orderService.getOrderS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addOrderC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        // if (!valid.absolute(req.body, form.addCategory))
        //     throw new Error(`400 ~ Validate data wrong!`);
        let [_counts, _count, __users, __products] = await Promise.all([
            client.db(DB).collection(`Orders`).countDocuments(),
            client
                .db(DB)
                .collection(`Orders`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).find({ active: true }).toArray(),
            client
                .db(DB)
                .collection(`SaleProducts`)
                .find({ branch: token.branch.branch_id })
                .toArray(),
        ]);
        let _bussiness = {};
        __users.map((item) => {
            _bussiness[item.user_id] = item;
        });
        let _products = {};
        __products.map((item) => {
            _products[item.product_id] = item;
        });
        _bussiness = _bussiness[token.bussiness.user_id];
        let _update = [];
        let _list = new Set([]);
        for (let i in req.body.order_details) {
            _list.add(req.body.order_details[i].product_id);
            if (_products[req.body.order_details[i].product_id].has_variable) {
                for (let j in _products[req.body.order_details[i].product_id]
                    .variants) {
                    if (
                        req.body.order_details[i].sku ==
                        _products[req.body.order_details[i].product_id]
                            .variants[j].sku
                    ) {
                        req.body.order_details[i][`import_price`] =
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`import_price`];
                        req.body.order_details[i][`base_price`] =
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`base_price`];
                        req.body.order_details[i][`sale_price`] =
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`sale_price`];
                        let quantity =
                            _products[req.body.order_details[i].product_id]
                                .variants[j][`available_stock_quantity`] +
                            _products[req.body.order_details[i].product_id]
                                .variants[j][`low_stock_quantity`];

                        quantity -= req.body.order_details[i].quantity;
                        if (
                            quantity >
                            _products[req.body.order_details[i].product_id]
                                .variants[j][`status_check_value`]
                        ) {
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`available_stock_quantity`] =
                                quantity;
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`low_stock_quantity`] = 0;
                            _products[
                                req.body.order_details[i].product_id
                            ].variants[j][`status`] = `available_stock`;
                        } else {
                            if (quantity < 0) {
                                _products[
                                    req.body.order_details[i].product_id
                                ].variants[j][`out_stock_quantity`] +=
                                    req.body.order_details[i].quantity;
                                _products[
                                    req.body.order_details[i].product_id
                                ].variants[j][`status`] = `out_stock`;
                            } else {
                                _products[
                                    req.body.order_details[i].product_id
                                ].variants[j][`available_stock_quantity`] = 0;
                                _products[
                                    req.body.order_details[i].product_id
                                ].variants[j][`low_stock_quantity`] = quantity;
                                _products[
                                    req.body.order_details[i].product_id
                                ].variants[j][`status`] = `low_stock`;
                            }
                        }
                    }
                }
            } else {
                req.body.order_details[i][`import_price`] =
                    _products[req.body.order_details[i].product_id][
                        `import_price`
                    ];
                req.body.order_details[i][`base_price`] =
                    _products[req.body.order_details[i].product_id][
                        `base_price`
                    ];
                req.body.order_details[i][`sale_price`] =
                    _products[req.body.order_details[i].product_id][
                        `sale_price`
                    ];
                let quantity =
                    _products[req.body.order_details[i].product_id][
                        `available_stock_quantity`
                    ] +
                    _products[req.body.order_details[i].product_id][
                        `low_stock_quantity`
                    ];
                quantity -= req.body.order_details[i].quantity;
                if (
                    quantity >
                    _products[req.body.order_details[i].product_id][
                        `status_check_value`
                    ]
                ) {
                    _products[req.body.order_details[i].product_id][
                        `available_stock_quantity`
                    ] = quantity;
                    _products[req.body.order_details[i].product_id][
                        `low_stock_quantity`
                    ] = 0;
                    _products[req.body.order_details[i].product_id][
                        `status`
                    ] = `available_stock`;
                } else {
                    if (quantity < 0) {
                        _products[req.body.order_details[i].product_id][
                            `out_stock_quantity`
                        ] += req.body.order_details[i].quantity;
                        _products[req.body.order_details[i].product_id][
                            `status`
                        ] = `out_stock`;
                    } else {
                        _products[req.body.order_details[i].product_id][
                            `available_stock_quantity`
                        ] = 0;
                        _products[req.body.order_details[i].product_id][
                            `low_stock_quantity`
                        ] = quantity;
                        _products[req.body.order_details[i].product_id][
                            `status`
                        ] = `low_stock`;
                    }
                }
            }
        }
        _list.forEach((item) => {
            _update.push(_products[item]);
        });
        req[`_update`] = _update;
        if (req.body.voucher) {
            let _promotion = await client
                .db(DB)
                .collection(`Promotions`)
                .find({ bussiness: token.bussiness.user_id })
                .toArray();
            for (let i in _promotion) {
                if (
                    _promotion[i].name
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``) ==
                    req.body.voucher.split(`_`)[0]
                ) {
                    _promotion = _promotion[i];
                    break;
                }
            }
            if (!_promotion)
                throw new Error(`400 ~ Promotion is not exists or expired!`);
            let _check = false;
            req.body[`promotion`] = _promotion.promotion_id;
            for (let i in _promotion.vouchers) {
                if (
                    _promotion.vouchers[i].voucher == req.body.voucher &&
                    _promotion.vouchers[i].active == true
                ) {
                    _promotion.vouchers[i].active = false;
                    await client
                        .db(DB)
                        .collection(`Promotions`)
                        .findOneAndUpdate(
                            {
                                promotion_id: _promotion.promotion_id,
                            },
                            { $set: { vouchers: _promotion.vouchers } }
                        );
                    _check = true;
                }
            }
            if (!_check)
                throw new Error(`400 ~ Voucher is not exists or used!`);
        }
        req.body[`order_id`] = String(_counts + 1);
        req.body[`code`] = `000000`;
        req.body[`code`] =
            req.body[`code`].slice(0, 6 - String(_count + 1).length) +
            String(_count + 1);
        req.body[`type`] = String(req.body[`type`]).toUpperCase();
        let _order = {
            order_id: req.body.order_id,
            bussiness: token.bussiness.user_id,
            code: req.body.code,
            order_type: req.body.order_type,
            platform: req.body.platform,
            branch: req.body.branch,
            employee: token.user_id,
            customer: req.body.customer,
            payment: req.body.payment,
            info_payment: req.body.info_payment,
            taxes: req.body.taxes,
            shipping_company: req.body.shipping_company,
            shipping: req.body.shipping,
            order_details: req.body.order_details,
            voucher: req.body.voucher,
            promotion: req.body.promotion,
            total_cost: req.body.total_cost,
            discount: req.body.discount,
            final_cost: req.body.final_cost,
            price_real: req.body.price_real || req.body.final_cost,
            note: req.body.note,
            fulfillments: req.body.fulfillments || [],
            latitude: req.body.latitude,
            longtitude: req.body.longtitude,
            status: `DRAFT`,
            // DRAFT - SHIPPING - CANCEL - REFUND - PENDING - COMPLETE
            hmac: req.body.hmac,
            timestampe: req.body.timestampem,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_order`] = _order;
        await orderService.addOrderS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
let updateOrderC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!valid.absolute(req.query, form.updateCategoryFilter))
        //     throw new Error(`400 ~ Validate data wrong!`);
        // if (!valid.relative(req.body, form.updateCategoryValue))
        //     throw new Error(`400 ~ Validate data wrong!`);
        let _order = await client
            .db(DB)
            .collection(`Orders`)
            .findOne(req.params);
        if (!_order) throw new Error(`400 ~ Order is not exists!`);
        delete req.body._id;
        delete req.body.order_id;
        delete req.body.bussiness;
        delete req.body.branch;
        delete req.body.employee;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
