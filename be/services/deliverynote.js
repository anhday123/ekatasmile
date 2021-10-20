const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.delivery_id) {
            matchQuery['delivery_id'] = req.query.delivery_id;
        }
        if (token) {
            matchQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            matchQuery['business_id'] = req.query.business_id;
        }
        if (req.query.creator_id) {
            matchQuery['creator_id'] = req.query.creator_id;
        }
        if (req.query.user_ship_id) {
            matchQuery['user_ship_id'] = req.query.user_ship_id;
        }
        if (req.query.user_receive_id) {
            matchQuery['user_receive_id'] = req.query.user_receive_id;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            matchQuery['code'] = createRegExpQuery(req.query.code);
        }
        if (req.query.status) {
            matchQuery['status'] = createRegExpQuery(req.query.status);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { status: createRegExpQuery(req.query.search) },
            ];
        }
        aggregateQuery.push({ $match: matchQuery });
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
                { $unwind: '$_business' }
            );
            projectQuery['_business.password'] = 0;
        }
        if (req.query._user_ship) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'user_ship_id',
                        foreignField: 'user_id',
                        as: '_user_ship',
                    },
                },
                { $unwind: '$_user_ship' }
            );
            projectQuery['_user_ship.password'] = 0;
        }
        if (req.query._user_receive) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: 'user_receive_id',
                        as: '_user_receive',
                    },
                },
                { $unwind: '$_user_receive' }
            );
            projectQuery['_user_receive.password'] = 0;
        }
        if (req.query._creator) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'creator_id',
                        foreignField: 'user_id',
                        as: '_creator',
                    },
                },
                { $unwind: '$_creator' }
            );
            projectQuery['_creator.password'] = 0;
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [deliveries, counts] = await Promise.all([
            client.db(DB).collection(`DeliveryNotes`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`DeliveryNotes`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: deliveries,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _delivery = await client.db(DB).collection(`DeliveryNotes`).insertOne(req._insert);
        if (!_delivery.insertedId) throw new Error(`500: Create delivery fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                properties: `Delivery Note`,
                name: `Thêm phiếu chuyển hàng mới`,
                data: _delivery.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _delivery.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`DeliveryNotes`).findOneAndUpdate(req.params, { $set: req._update });
        const databaseSendProduct = req._update.from.branch_id ? 'Products' : 'SaleProducts';
        const databaseReceiveProduct = req._update.to.branch_id ? 'Products' : 'SaleProducts';
        let fromQuery = {};
        let toQuery = {};
        fromQuery['business_id'] = token.business_id;
        toQuery['business_id'] = token.business_id;
        if (req._update.from.branch_id) {
            fromQuery['branch_id'] = req._update.from.branch_id;
        } else {
            fromQuery['store_id'] = req._update.from.store_id;
        }
        if (req._update.to.branch_id) {
            toQuery['branch_id'] = req._update.to.branch_id;
        } else {
            toQuery['store_id'] = req._update.to.store_id;
        }

        let [__sendProducts, __receiveProducts] = await Promise.all([
            client.db(DB).collection(databaseSendProduct).find(fromQuery).toArray(),
            client.db(DB).collection(databaseReceiveProduct).find(toQuery).toArray(),
        ]);
        if (req._update.status == `SHIPPING`) {
            let sendProductsUpdate = [];
            let _sendProducts = {};
            __sendProducts.map((__sendProduct) => {
                _sendProducts[__sendProduct.product_id] = __sendProduct;
            });
            req._update.products.map((product) => {
                let _updateProduct = _sendProducts[product.product_id];
                if (_updateProduct.has_variable) {
                    _updateProduct.variants.map((variant) => {
                        if (variant.sku == product.sku) {
                            let quantity =
                                variant['available_stock_quantity'] + variant['low_stock_quantity'];
                            quantity -= product.quantity;
                            if (quantity > variant['status_check_value']) {
                                variant['available_stock_quantity'] = quantity;
                                variant['low_stock_quantity'] = 0;
                                variant['shipping_quantity'] += product.quantity;
                                variant['status'] = 'available_stock';
                            } else {
                                if (quantity >= 0) {
                                    variant['available_stock_quantity'] = 0;
                                    variant['low_stock_quantity'] = quantity;
                                    variant['shipping_quantity'] += product.quantity;
                                    variant['status'] = 'low_stock';
                                } else {
                                    throw new Error(`400: Product is not enough!`);
                                }
                            }
                        }
                        return variant;
                    });
                } else {
                    let quantity =
                        _updateProduct['available_stock_quantity'] + _updateProduct['low_stock_quantity'];
                    quantity -= product.quantity;
                    if (quantity > _updateProduct['status_check_value']) {
                        _updateProduct['available_stock_quantity'] = quantity;
                        _updateProduct['low_stock_quantity'] = 0;
                        _updateProduct['shipping_quantity'] += product.quantity;
                        _updateProduct['status'] = 'available_stock';
                    } else {
                        if (quantity >= 0) {
                            _updateProduct['available_stock_quantity'] = 0;
                            _updateProduct['low_stock_quantity'] = quantity;
                            _updateProduct['shipping_quantity'] += product.quantity;
                            _updateProduct['status'] = 'low_stock';
                        } else {
                            throw new Error(`400: Product is not enough!`);
                        }
                    }
                }
                sendProductsUpdate.push(_updateProduct);
            });
            await Promise.all(
                sendProductsUpdate.map((product) => {
                    client
                        .db(DB)
                        .collection(databaseSendProduct)
                        .findOneAndUpdate(
                            { product_id: product.product_id, ...fromQuery },
                            { $set: product },
                            { upsert: true }
                        );
                })
            );
        }
        if (req._update.status == `COMPLETE`) {
            let _receiveProducts = {};
            __receiveProducts.map((__receiveProduct) => {
                _receiveProducts[__receiveProduct.sku] = __receiveProduct;
            });
            req._update.products.map((product) => {
                delete product._branch;
                delete product._business;
                delete product._category;
                delete product._creator;
                delete product._supplier;
                if (_receiveProducts[product.sku]) {
                    if (_receiveProducts[product.sku].has_variable) {
                        _receiveProducts[product.sku].variants.map((variant) => {
                            if (variant.sku == product.sku) {
                                let quantity =
                                    variant['available_stock_quantity'] + variant['low_stock_quantity'];
                                quantity += product.quantity;
                                variant['status_check_value'] = Math.round(
                                    (quantity * variant['status_check']) / 100
                                );
                                variant['available_stock_quantity'] = quantity;
                                variant['low_stock_quantity'] = 0;
                                variant['shipping_quantity'] = 0;
                                variant['status'] = 'available_stock';
                            }
                            return variant;
                        });
                    } else {
                        let quantity =
                            _receiveProducts[product.sku]['available_stock_quantity'] +
                            _receiveProducts[product.sku]['low_stock_quantity'];
                        quantity += _receiveProducts[product.sku].quantity;
                        _receiveProducts[product.sku]['status_check_value'] = Math.round(
                            (quantity * _receiveProducts[product.sku]['status_check']) / 100
                        );
                        _receiveProducts[product.sku]['available_stock_quantity'] = quantity;
                        _receiveProducts[product.sku]['low_stock_quantity'] = 0;
                        _receiveProducts[product.sku]['shipping_quantity'] = 0;
                        _receiveProducts[product.sku]['status'] = 'available_stock';
                    }
                } else {
                    _receiveProducts[product.sku] = product;
                }
            });
            _receiveProducts = Object.values(_receiveProducts);
            await Promise.all(
                _receiveProducts.map((product) => {
                    client
                        .db(DB)
                        .collection(databaseReceiveProduct)
                        .findOneAndUpdate(
                            { product_id: product.product_id, ...toQuery },
                            { $set: product },
                            { upsert: true }
                        );
                })
            );
        }
        if (req._update.status == `CANCEL`) {
            let sendProductsUpdate = [];
            let _sendProducts = {};
            __sendProducts.map((__sendProduct) => {
                _sendProducts[__sendProduct.product_id] = __sendProduct;
            });
            req._update.products.map((product) => {
                let _updateProduct = _sendProducts[product.product_id];
                if (_updateProduct.has_variable) {
                    _updateProduct.variants.map((variant) => {
                        if (variant.sku == product.sku) {
                            let quantity =
                                variant['available_stock_quantity'] + variant['low_stock_quantity'];
                            quantity += product.quantity;
                            if (quantity > variant['status_check_value']) {
                                variant['available_stock_quantity'] = quantity;
                                variant['low_stock_quantity'] = 0;
                                variant['shipping_quantity'] -= product.quantity;
                                variant['status'] = 'available_stock';
                            } else {
                                if (quantity >= 0) {
                                    variant['available_stock_quantity'] = 0;
                                    variant['low_stock_quantity'] = quantity;
                                    variant['shipping_quantity'] -= product.quantity;
                                    variant['status'] = 'low_stock';
                                } else {
                                    throw new Error(`400: Product is not enough!`);
                                }
                            }
                        }
                        return variant;
                    });
                } else {
                    let quantity =
                        _updateProduct['available_stock_quantity'] + _updateProduct['low_stock_quantity'];
                    quantity += product.quantity;
                    if (quantity > _updateProduct['status_check_value']) {
                        _updateProduct['available_stock_quantity'] = quantity;
                        _updateProduct['low_stock_quantity'] = 0;
                        _updateProduct['shipping_quantity'] -= product.quantity;
                        _updateProduct['status'] = 'available_stock';
                    } else {
                        if (quantity >= 0) {
                            _updateProduct['available_stock_quantity'] = 0;
                            _updateProduct['low_stock_quantity'] = quantity;
                            _updateProduct['shipping_quantity'] -= product.quantity;
                            _updateProduct['status'] = 'low_stock';
                        } else {
                            throw new Error(`400: Product is not enough!`);
                        }
                    }
                }
                sendProductsUpdate.push(_updateProduct);
            });
            await Promise.all(
                sendProductsUpdate.map((product) => {
                    client
                        .db(DB)
                        .collection(databaseSendProduct)
                        .findOneAndUpdate(
                            { product_id: product.product_id, ...fromQuery },
                            { $set: product },
                            { upsert: true }
                        );
                })
            );
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Delivery`,
                sub_properties: `delivery`,
                name: `Cập nhật thông tin phiếu chuyển`,
                sub_name: `capnhatthongtinphieuchuyen`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDeliveryS,
    addDeliveryS,
    updateDeliveryS,
};
