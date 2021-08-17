const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const saleProductService = require(`../services/saleproduct`);

let getSaleProductC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getProduct))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await saleProductService.getSaleProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateSaleProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _product = await client
            .db(DB)
            .collection(`SaleProducts`)
            .findOne(req.params);
        if (!_product) throw new Error(`400 ~ Product is not exists!`);
        if (req.body.name) req.body.name = req.body.name.trim().toUpperCase();
        if (req.body.warranty) {
            __warranties = await client
                .db(DB)
                .collection(`Warranties`)
                .find({})
                .toArray();
            let _warranties = {};
            __warranties.map((item) => {
                _warranties[item.warranty_id] = item;
            });
            for (let i in req.body.warranty) {
                if (typeof req.body.warranty[i] == `string`) {
                    req.body.warranty[i] = _warranties[req.body.warranty[i]];
                }
            }
        }
        if (req.body.has_variable == true) {
            for (i in req.body.variants) {
                if (req.body.variants[i].quantity >= 0) {
                    if (
                        req.body.variants[i][`out_stock_quantity`] >
                        req.body.variants[i].quantity
                    ) {
                        req.body.variants[i][`available_stock_quantity`] = 0;
                        req.body.variants[i][`low_stock_quantity`] = 0;
                        req.body.variants[i][`out_stock_quantity`] -=
                            req.body.variants[i].quantity;
                        req.body.variants[i][`status`] = `out_stock`;
                        continue;
                    }
                    if (
                        req.body.variants[i][`out_stock_quantity`] ==
                        req.body.variants[i].quantity
                    ) {
                        req.body.variants[i][`available_stock_quantity`] = 0;
                        req.body.variants[i][`low_stock_quantity`] = 0;
                        req.body.variants[i][`out_stock_quantity`] = 0;
                        req.body.variants[i][`status`] = `low_stock`;
                        continue;
                    }
                    if (
                        req.body.variants[i][`out_stock_quantity`] <
                        req.body.variants[i].quantity
                    ) {
                        req.body.variants[i].quantity -=
                            req.body.variants[i][`out_stock_quantity`];
                        req.body.variants[i][`available_stock_quantity`] =
                            req.body.variants[i].quantity;
                        req.body.variants[i][`low_stock_quantity`] = 0;
                        req.body.variants[i][`out_stock_quantity`] = 0;
                        req.body.variants[i][`status`] = `available_stock`;
                        req.body.variants[i][`status_check_value`] = Math.ceil(
                            (req.body.variants[i][`status_check`] *
                                req.body.variants[i][
                                    `available_stock_quantity`
                                ]) /
                                100
                        );
                        continue;
                    }
                }
                if (req.body.variants[i].quantity < 0) {
                    req.body.variants[i][`out_stock_quantity`] =
                        -req.body.variants[i].quantity;
                    req.body.variants[i][`status`] = `out_stock`;
                }
                delete req.body.variants[i].quantity;
            }
        } else {
            if (req.body.quantity >= 0) {
                if (req.body[`out_stock_quantity`] > req.body.quantity) {
                    req.body[`available_stock_quantity`] = 0;
                    req.body[`low_stock_quantity`] = 0;
                    req.body[`out_stock_quantity`] -= req.body.quantity;
                    req.body[`status`] = `out_stock`;
                }
                if ((req.body[`out_stock_quantity`] = req.body.quantity)) {
                    req.body[`available_stock_quantity`] = 0;
                    req.body[`low_stock_quantity`] = 0;
                    req.body[`out_stock_quantity`] = 0;
                    req.body[`status`] = `low_stock`;
                }
                if (req.body[`out_stock_quantity`] < req.body.quantity) {
                    req.body.quantity -= req.body[`out_stock_quantity`];
                    req.body[`available_stock_quantity`] = req.body.quantity;
                    req.body[`low_stock_quantity`] = 0;
                    req.body[`out_stock_quantity`] = 0;
                    req.body[`status`] = `available_stock`;
                    req.body[`status_check_value`] = Math.ceil(
                        (req.body[`status_check`] *
                            req.body[`available_stock_quantity`]) /
                            100
                    );
                }
            }
            if (req.body.quantity < 0) {
                req.body[`out_stock_quantity`] = -req.body.quantity;
                req.body[`status`] = `out_stock`;
            }
            delete req.body.quantity;
        }
        delete req.body._id;
        delete req.body.product_id;
        delete req.body.bussiness;
        req.body.branch = req.body.branch.branch_id || req.body.branch;
        req.body.category = req.body.category.category_id || req.body.category;
        req.body.suppliers =
            req.body.suppliers.supplier_id || req.body.suppliers;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
        delete req.body._category;
        delete req.body._supplier;
        await saleProductService.updateSaleProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = { getSaleProductC, updateSaleProductC };
