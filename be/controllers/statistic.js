const moment = require(`moment-timezone`);
const timezone = process.env.TIMEZONE;
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');

let getOverviewC = async (req, res, next) => {
    try {
        let orderQuery = {};
        let todayQuery = {};
        let yesterdayQuery = {};
        if (req.user) {
            orderQuery['business_id'] = Number(req.user.business_id);
            todayQuery['business_id'] = Number(req.user.business_id);
            yesterdayQuery['business_id'] = Number(req.user.business_id);
        }
        if (req.query.business_id) {
            orderQuery['business_id'] = Number(req.query.business_id);
            todayQuery['business_id'] = Number(req.query.business_id);
            yesterdayQuery['business_id'] = Number(req.query.business_id);
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            if (!orderQuery['create_date']) {
                orderQuery['create_date'] = {};
            }
            if (orderQuery['create_date']) {
                orderQuery.create_date['$gte'] = req.query.from_date;
            }
        }
        if (req.query.to_date) {
            if (!orderQuery['create_date']) {
                orderQuery['create_date'] = {};
            }
            if (orderQuery['create_date']) {
                orderQuery.create_date['$lte'] = req.query.to_date;
            }
        }
        todayQuery[`create_date`] = {};
        todayQuery.create_date['$gte'] = new Date(moment.tz(timezone).format(`YYYY-MM-DD 00:00:00`));
        todayQuery.create_date['$lte'] = new Date(moment.tz(timezone).format(`YYYY-MM-DD 23:59:59`));

        yesterdayQuery[`create_date`] = {};
        yesterdayQuery.create_date[`$gte`] = new Date(
            moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD 00:00:00`)
        );
        yesterdayQuery.create_date[`$lte`] = new Date(
            moment.tz(timezone).add(-1, `days`).format(`YYYY-MM-DD 23:59:59`)
        );

        let [orders] = await Promise.all([client.db(DB).collection('Orders').find(orderQuery).toArray()]);
        let total_base_price = 0;
        let total_sales = 0;
        let total_profit = 0;
        orders.map((order) => {
            if (order) {
                order.order_details.map((detail) => {
                    total_base_price += Number(detail.base_price || 0) * Number(detail.quantity);
                    total_sales += Number(detail.total_cost || 0);
                    total_profit +=
                        Number(detail.final_cost || 0) - Number(detail.base_price || 0) * Number(detail.quantity);
                });
            }
        });
        let timelines = [];
        for (let i = 0; i < 24; i++) {
            timelines.push(i);
        }
        let todayOrders = await Promise.all(
            timelines.map((timeline) => {
                return client
                    .db(DB)
                    .collection('Orders')
                    .find({ ...todayQuery, create_time: timeline })
                    .count();
            })
        );
        let _todayOrders = {};
        for (let i in todayOrders) {
            _todayOrders[`${String(i).padStart(2, '0')}:00`] = todayOrders[i];
        }
        let yesterdayOrder = await Promise.all(
            timelines.map((timeline) => {
                return client
                    .db(DB)
                    .collection('Orders')
                    .find({ ...yesterdayQuery, create_time: timeline })
                    .count();
            })
        );
        let _yesterdayOrder = {};
        for (let i in yesterdayOrder) {
            _yesterdayOrder[`${String(i).padStart(2, '0')}:00`] = yesterdayOrder[i];
        }
        res.send({
            success: true,
            data: {
                order_quantity: orders.length,
                total_base_price,
                total_sales,
                total_profit,
                chart: [
                    { name: 'Đơn hàng hôm nay', data: _todayOrders },
                    { name: 'Đơn hàng hôm qua', data: _yesterdayOrder },
                ],
            },
        });
    } catch (err) {
        next(err);
    }
};

let getInventoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        // lấy data từ database
        let [branchProducts, storeProducts, stores] = await Promise.all([
            client.db(DB).collection('Products').find(mongoQuery).toArray(),
            client.db(DB).collection('SaleProducts').find(mongoQuery).toArray(),
            client.db(DB).collection('Stores').find(mongoQuery).toArray(),
        ]);
        let _stores = {};
        stores.map((store) => {
            _stores[store.store_id] = store;
        });
        let allProducts = {};
        branchProducts.map((product) => {
            if (product.has_variable) {
                product.variants.map((variant) => {
                    allProducts[variant.sku] = { ...product, ...variant };
                    allProducts[variant.sku].has_variable = false;
                    allProducts[variant.sku].attributes = [];
                    allProducts[variant.sku].variants = [];
                });
            } else {
                allProducts[product.sku] = { ...product };
            }
        });
        storeProducts.map((product) => {
            if (product.has_variable) {
                product.variants.map((variant) => {
                    allProducts[variant.sku]['available_stock_quantity'] += variant['available_stock_quantity'];
                    allProducts[variant.sku]['low_stock_quantity'] += variant['low_stock_quantity'];
                    allProducts[variant.sku]['out_stock_quantity'] += variant['out_stock_quantity'];
                    allProducts[variant.sku]['shipping_quantity'] += variant['shipping_quantity'];
                    allProducts[variant.sku]['return_warehouse_quantity'] += variant['return_warehouse_quantity'];
                });
            } else {
                allProducts[product.sku]['available_stock_quantity'] += product['available_stock_quantity'];
                allProducts[product.sku]['low_stock_quantity'] += product['low_stock_quantity'];
                allProducts[product.sku]['out_stock_quantity'] += product['out_stock_quantity'];
                allProducts[product.sku]['shipping_quantity'] += product['shipping_quantity'];
                allProducts[product.sku]['return_warehouse_quantity'] += product['return_warehouse_quantity'];
            }
        });
        let result = {};
        storeProducts.map((product) => {
            if (!result[product.store_id]) {
                result[product.store_id] = [];
            }
            if (result[product.store_id]) {
                if (product.has_variable) {
                    product.variants.map((variant) => {
                        let data = {
                            name: variant.title,
                            sku: variant.sku,
                            store_product: {
                                quantity: variant['available_stock_quantity'] + variant['low_stock_quantity'],
                                inventory_value:
                                    (variant['available_stock_quantity'] + variant['low_stock_quantity']) *
                                    variant.sale_price,
                                base_price: variant.base_price,
                                rate:
                                    ((variant['available_stock_quantity'] + variant['low_stock_quantity']) /
                                        (allProducts[variant.sku]['available_stock_quantity'] +
                                            allProducts[variant.sku]['low_stock_quantity'])) *
                                    100,
                            },
                            system_product: {
                                quantity:
                                    allProducts[variant.sku]['available_stock_quantity'] +
                                    allProducts[variant.sku]['low_stock_quantity'],
                                inventory_value:
                                    (allProducts[variant.sku]['available_stock_quantity'] +
                                        allProducts[variant.sku]['low_stock_quantity']) *
                                    allProducts[variant.sku]['sale_price'],
                                base_price: allProducts[variant.sku]['base_price'],
                            },
                        };
                        result[product.store_id].push(data);
                    });
                } else {
                    let data = {
                        name: product.title,
                        sku: product.sku,
                        store_product: {
                            quantity: product['available_stock_quantity'] + product['low_stock_quantity'],
                            inventory_value:
                                (product['available_stock_quantity'] + product['low_stock_quantity']) *
                                product.sale_price,
                            base_price: product.base_price,
                            rate:
                                ((product['available_stock_quantity'] + product['low_stock_quantity']) /
                                    (allProducts[product.sku]['available_stock_quantity'] +
                                        allProducts[product.sku]['low_stock_quantity'])) *
                                100,
                        },
                        system_product: {
                            quantity:
                                allProducts[product.sku]['available_stock_quantity'] +
                                allProducts[product.sku]['low_stock_quantity'],
                            inventory_value:
                                (allProducts[product.sku]['available_stock_quantity'] +
                                    allProducts[product.sku]['low_stock_quantity']) *
                                allProducts[product.sku]['sale_price'],
                            base_price: allProducts[product.sku]['base_price'],
                        },
                    };
                    result[product.store_id].push(data);
                }
            }
        });
        if (req.query.store_id) {
            result = result[req.query.store_id];
            result = result.map((item) => {
                item['store_id'] = req.query.store_id;
                item['_store'] = _stores[req.query.store_id];
            });
        } else {
            let tmp = [];
            for (let i in result) {
                result[i].map((item) => {
                    item['store_id'] = String(i);
                    item['_store'] = _stores[String(i)];
                    tmp.push(item);
                });
            }
            result = tmp;
        }
        res.send({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

let getFinanceC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await statisService.getStatisS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getOverviewC,
    getInventoryC,
    getFinanceC,
};
