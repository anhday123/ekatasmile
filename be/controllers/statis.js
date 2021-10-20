const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getOverviewC = async (req, res, next) => {
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
        let [orders, products] = await Promise.all([
            client.db(DB).collection(`Orders`).find(mongoQuery).toArray(),
            client.db(DB).collection(`Products`).find(mongoQuery).toArray(),
        ]);
        let _products = [];
        products.map((product) => {
            if (product.has_variable) {
                product.variants.map((variant) => {
                    let _image = [...product.image];
                    _image.push(variant.image);
                    let _product = { ...product, image: _image };
                    _products.push(_product);
                });
            } else {
                _products.push(product);
            }
        });
        let todayOrders = 0;
        let investment = 0;
        let todayInvestment = 0;
        let sales = 0;
        let todaySales = 0;
        let profit = 0;
        let todayProfit = 0;
        let topProducts = [];
        orders.map((order) => {
            if (order.order_details) {
                order.order_details.map((detail) => {
                    investment += detail.base_price * detail.quantity || 0;
                    sales += detail.sale_price * detail.quantity || 0;
                    if (
                        moment(order.create_date).format('YYYY-MM-DD') ==
                        moment.tz(`Asia/Ho_Chi_Minh`).format('YYYY-MM-DD')
                    ) {
                        todayInvestment += detail.base_price * detail.quantity || 0;
                        todaySales += detail.sale_price * detail.quantity || 0;
                    }
                    if (!topProducts[detail.sku]) {
                        topProducts[detail.sku] = detail.quantity;
                    } else {
                        topProducts[detail.sku] += detail.quantity || 0;
                    }
                });
                profit += order.final_cost || 0;
                if (
                    moment(order.create_date).format('YYYY-MM-DD') ==
                    moment.tz(`Asia/Ho_Chi_Minh`).format('YYYY-MM-DD')
                ) {
                    todayProfit += order.final_cost || 0;
                    todayOrders++;
                }
            }
        });
        res.send({
            success: true,
            data: {
                all: {
                    count: orders.length,
                    investment: investment,
                    sales: sales,
                    profit: profit,
                },
                today: {
                    today_count: todayOrders,
                    today_investment: todayInvestment,
                    today_sales: todaySales,
                    today_profit: todayProfit,
                },
                top_product: [],
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
                    allProducts[variant.sku]['available_stock_quantity'] +=
                        variant['available_stock_quantity'];
                    allProducts[variant.sku]['low_stock_quantity'] += variant['low_stock_quantity'];
                    allProducts[variant.sku]['out_stock_quantity'] += variant['out_stock_quantity'];
                    allProducts[variant.sku]['shipping_quantity'] += variant['shipping_quantity'];
                    allProducts[variant.sku]['return_warehouse_quantity'] +=
                        variant['return_warehouse_quantity'];
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
