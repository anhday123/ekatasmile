const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.delivery_id) {
            mongoQuery['delivery_id'] = req.query.delivery_id;
        }
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = req.query.creator_id;
        }
        if (req.query.user_ship_id) {
            mongoQuery['user_ship_id'] = req.query.user_ship_id;
        }
        if (req.query.user_receive_id) {
            mongoQuery['user_receive_id'] = req.query.user_receive_id;
        }
        if (req.query.today != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
        }
        if (req.query.yesterday != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
        }
        if (req.query.this_week != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).isoWeekday(1).format(`YYYY-MM-DD`);
        }
        if (req.query.last_week != undefined) {
            req.query[`from_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(1 - 7)
                .format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(7 - 7)
                .format(`YYYY-MM-DD`);
        }
        if (req.query.this_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
                `-` +
                String(`01`);
        }
        if (req.query.last_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).daysInMonth());
        }
        if (req.query.this_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
        }
        if (req.query.last_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`12`) +
                `-` +
                String(`31`);
        }
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            mongoQuery['code'] = new RegExp(removeUnicode(req.query.code).toUpperCase());
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _deliveries = await client.db(DB).collection(`DeliveryNotes`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _deliveries.reverse();
        // đếm số phần tử
        let _counts = _deliveries.length;
        // phân trang
        if (page && page_size) {
            _deliveries = _deliveries.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [__users, __branchs, __stores] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Branchs`).find({}).toArray(),
            client.db(DB).collection(`Stores`).find({}).toArray(),
        ]);
        let _users = {};
        __users.map((__user) => {
            delete __user.password;
            _users[__user.user_id] = __user;
        });
        let _branchs = {};
        __branchs.map((__branch) => {
            _branchs[__branch.branch_id] = __branch;
        });
        let _stores = {};
        __stores.map((__store) => {
            _stores[__store.store_id] = __store;
        });
        _deliveries.map((_delivery) => {
            _delivery[`_business`] = _users[_delivery.business_id];
            _delivery[`_user_ship`] = _users[_delivery.user_ship_id];
            _delivery[`_user_receive`] = _users[_delivery.user_receive_id];
            _delivery[`_creator`] = _users[_delivery.creator_id];
            if (_delivery.type.split('-')[0] == 'BRANCH') {
                _delivery[`_from`] = _branchs[_delivery.from_id];
            } else {
                _delivery[`_from`] = _stores[_delivery.from_id];
            }
            if (_delivery.type.split('-')[1] == 'BRANCH') {
                _delivery[`_to`] = _branchs[_delivery.from_id];
            } else {
                _delivery[`_to`] = _stores[_delivery.from_id];
            }
            return _delivery;
        });
        res.send({
            success: true,
            data: _deliveries,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _delivery = await client.db(DB).collection(`DeliveryNotes`).insertOne(req._insert);
        if (!_delivery.insertedId) throw new Error(`500 ~ Create delivery fail!`);
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
        let databaseSendProduct, databaseReceiveProduct;
        let fromQuery = {};
        let toQuery = {};
        fromQuery['business_id'] = token.business_id;
        toQuery['business_id'] = token.business_id;
        if (req._update.type.split('-')[0] == 'BRANCH') {
            databaseSendProduct = 'Products';
            fromQuery['branch_id'] = req._update.from_id;
        } else {
            databaseSendProduct = 'SaleProducts';
            fromQuery['store_id'] = req._update.from_id;
        }
        if (req._update.type.split('-')[1] == 'BRANCH') {
            databaseReceiveProduct = 'Products';
            toQuery['branch_id'] = req._update.to_id;
        } else {
            databaseReceiveProduct = 'SaleProducts';
            toQuery['store_id'] = req._update.to_id;
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
                                    throw new Error(`400 ~ Product is not enough!`);
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
                            throw new Error(`400 ~ Product is not enough!`);
                        }
                    }
                }
                sendProductsUpdate.push(_updateProduct);
            });
        }
        if (req._update.status == `COMPLETE`) {
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
                            variant['shipping_quantity'] -= product.quantity;
                        }
                        return variant;
                    });
                } else {
                    _updateProduct['shipping_quantity'] -= product.quantity;
                }
                sendProductsUpdate.push(_updateProduct);
            });
            let receiveProductsUpdate = [];
            let receiveProductsInsert = [];
            let _receiveProducts = {};
            __receiveProducts.map((__receiveProduct) => {
                _receiveProducts[__receiveProduct.product_id] = __receiveProduct;
            });
            req._update.products.map((product) => {
                let _updateProduct = _receiveProducts[product.product_id];
                let _insertProduct = _receiveProducts[product.product_id];
                
            });
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
                                    throw new Error(`400 ~ Product is not enough!`);
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
                            throw new Error(`400 ~ Product is not enough!`);
                        }
                    }
                }
                sendProductsUpdate.push(_updateProduct);
            });
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
