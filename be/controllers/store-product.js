const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const saleProductService = require(`../services/store-product`);

let getSaleProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_saleproduct`))
        //     throw new Error(`400: Forbidden!`);
        await saleProductService.getSaleProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateSaleProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params._id = ObjectId(req.params._id);
        let _product = await client.db(DB).collection(`SaleProducts`).findOne(req.params);
        if (!_product) throw new Error(`400: Product is not exists!`);
        if (req.body.name) req.body.name = req.body.name.trim().toUpperCase();
        if (req.body.sku) req.body.sku = req.body.sku.trim().toUpperCase();
        if (req.body.slug)
            req.body.slug = req.body.name
                .trim()
                .normalize(`NFD`)
                .replace(/[\u0300-\u036f]/g, ``)
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/\s/g, '-')
                .toLowerCase();
        if (req.body.warranties) {
            __warranties = await client.db(DB).collection(`Warranties`).find({}).toArray();
            let _warranties = {};
            __warranties.map((item) => {
                _warranties[item.warranty_id] = item;
            });
            req.body.warranties = req.body.warranties.map((warranty) => {
                if (typeof warranty == `string`) {
                    return _warranties[warranty];
                }
            });
        }
        if (req.body.has_variable == true) {
            if (req.body.attributes) {
                req.body.attributes = req.body.attributes.map((attribute) => {
                    attribute.option = attribute.option.trim().toUpperCase();
                    attribute.values = attribute.values.map((value) => {
                        return value.trim().toUpperCase();
                    });
                    return attribute;
                });
            }
            req.body.variants = req.body.variants.map((variant) => {
                variant[`title`] = variant[`title`].trim().toUpperCase();
                variant[`sku`] = variant[`sku`].trim().toUpperCase();
                variant.options = variant.options.map((option) => {
                    option.name = option.name.trim().toUpperCase();
                    option.value = option.value.trim().toUpperCase();
                    return option;
                });
                if (variant.quantity && typeof variant.quantity == 'number') {
                    if (variant.quantity >= 0) {
                        if (variant[`status`] == `out_stock`) {
                            if (variant[`out_stock_quantity`] > variant.quantity) {
                                variant[`available_stock_quantity`] = 0;
                                variant[`low_stock_quantity`] = 0;
                                variant[`out_stock_quantity`] =
                                    (variant[`out_stock_quantity`] || 0) - variant.quantity;
                                variant[`shipping_quantity`] = variant[`shipping_quantity`] || 0;
                                variant[`return_warehouse_quantity`] =
                                    variant[`return_warehouse_quantity`] || 0;
                                variant[`status`] = `out_stock`;
                            }
                            if (variant[`out_stock_quantity`] == variant.quantity) {
                                variant[`available_stock_quantity`] = 0;
                                variant[`low_stock_quantity`] = 0;
                                variant[`out_stock_quantity`] = 0;
                                variant[`shipping_quantity`] = variant[`shipping_quantity`] || 0;
                                variant[`return_warehouse_quantity`] =
                                    variant[`return_warehouse_quantity`] || 0;
                                variant[`status`] = `low_stock`;
                            }
                            if (variant[`out_stock_quantity`] < variant.quantity) {
                                variant.quantity = variant.quantity - (variant[`out_stock_quantity`] || 0);
                                variant[`available_stock_quantity`] = variant.quantity;
                                variant[`low_stock_quantity`] = 0;
                                variant[`out_stock_quantity`] = 0;
                                variant[`shipping_quantity`] = variant[`shipping_quantity`] || 0;
                                variant[`return_warehouse_quantity`] =
                                    variant[`return_warehouse_quantity`] || 0;
                                variant[`status`] = `available_stock`;
                                variant[`status_check_value`] = Math.ceil(
                                    (variant[`status_check`] * variant[`available_stock_quantity`]) / 100
                                );
                            }
                        } else {
                            variant.quantity = variant.quantity - (variant[`out_stock_quantity`] || 0);
                            variant[`available_stock_quantity`] = variant.quantity;
                            variant[`low_stock_quantity`] = 0;
                            variant[`out_stock_quantity`] = 0;
                            variant[`shipping_quantity`] = variant[`shipping_quantity`] || 0;
                            variant[`return_warehouse_quantity`] = variant[`return_warehouse_quantity`] || 0;
                            variant[`status`] = `available_stock`;
                            variant[`status_check_value`] = Math.ceil(
                                (variant[`status_check`] * variant[`available_stock_quantity`]) / 100
                            );
                        }
                    } else {
                        variant[`out_stock_quantity`] = -variant.quantity;
                        variant[`status`] = `out_stock`;
                    }
                }
                delete variant.quantity;
                return variant;
            });
        } else {
            if (req.body.quantity >= 0) {
                if (req.body[`status`] == `out_stock`) {
                    if (req.body[`out_stock_quantity`] > req.body.quantity) {
                        req.body[`available_stock_quantity`] = 0;
                        req.body[`low_stock_quantity`] = 0;
                        req.body[`out_stock_quantity`] =
                            (req.body[`out_stock_quantity`] || 0) - req.body.quantity;
                        req.body[`shipping_quantity`] = req.body[`shipping_quantity`] || 0;
                        req.body[`return_warehouse_quantity`] = req.body[`return_warehouse_quantity`] || 0;
                        req.body[`status`] = `out_stock`;
                    }
                    if (req.body[`out_stock_quantity`] == req.body.quantity) {
                        req.body[`available_stock_quantity`] = 0;
                        req.body[`low_stock_quantity`] = 0;
                        req.body[`out_stock_quantity`] = 0;
                        req.body[`shipping_quantity`] = req.body[`shipping_quantity`] || 0;
                        req.body[`return_warehouse_quantity`] = req.body[`return_warehouse_quantity`] || 0;
                        req.body[`status`] = `low_stock`;
                    }
                    if (req.body[`out_stock_quantity`] < req.body.quantity) {
                        req.body.quantity = req.body.quantity - (req.body[`out_stock_quantity`] || 0);
                        req.body[`available_stock_quantity`] = req.body.quantity;
                        req.body[`low_stock_quantity`] = 0;
                        req.body[`out_stock_quantity`] = 0;
                        req.body[`shipping_quantity`] = req.body[`shipping_quantity`] || 0;
                        req.body[`return_warehouse_quantity`] = req.body[`return_warehouse_quantity`] || 0;
                        req.body[`status`] = `available_stock`;
                        req.body[`status_check_value`] = Math.ceil(
                            (req.body[`status_check`] * req.body[`available_stock_quantity`]) / 100
                        );
                    }
                } else {
                    req.body.quantity = req.body.quantity - (req.body[`out_stock_quantity`] || 0);
                    req.body[`available_stock_quantity`] = req.body.quantity;
                    req.body[`low_stock_quantity`] = 0;
                    req.body[`out_stock_quantity`] = 0;
                    req.body[`shipping_quantity`] = req.body[`shipping_quantity`] || 0;
                    req.body[`return_warehouse_quantity`] = req.body[`return_warehouse_quantity`] || 0;
                    req.body[`status`] = `available_stock`;
                    req.body[`status_check_value`] = Math.ceil(
                        (req.body[`status_check`] * req.body[`available_stock_quantity`]) / 100
                    );
                }
            } else {
                req.body[`out_stock_quantity`] = -req.body.quantity;
                req.body[`status`] = `out_stock`;
            }
            delete req.body.quantity;
        }
        delete req.body._id;
        delete req.body.product_id;
        delete req.body.business_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        delete req.body._branch;
        delete req.body._category;
        delete req.body._supplier;
        req['_update'] = { ..._product, ...req.body };
        await saleProductService.updateSaleProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let deleleProductC = async (req, res, next) => {
    try {
        ['products', 'store_id'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400: ${property} is not null!`);
            }
        });
        if (typeof req.body.products != 'object') {
            throw new Error(`400: products must be array!`);
        }
        await client
            .db(DB)
            .collection('Products')
            .updateMany(
                { product_id: { $in: req.body.products }, store_id: req.body.store_id },
                { $set: { delete: true } }
            );
        res.send({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = { getSaleProductC, updateSaleProductC, deleleProductC };
