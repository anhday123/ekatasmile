const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');
const { removeUnicode } = require('../utils/string-handle');

let getSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.product_id) {
            mongoQuery['product_id'] = req.query.product_id;
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
        if (req.query.store_id) {
            mongoQuery['store_id'] = req.query.store_id;
        }
        if (req.query.category_id) {
            mongoQuery['category_id'] = req.query.category_id;
        }
        if (req.query.supplier_id) {
            mongoQuery['supplier_id'] = req.query.supplier_id;
        }
        if (req.query.has_variable && req.query.has_variable.toLowerCase() == 'true') {
            mongoQuery['has_variable'] = true;
        }
        if (req.query.has_variable && req.query.has_variable.toLowerCase() == 'false') {
            mongoQuery['has_variable'] = false;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.sku) filterQuery = { ...filterQuery, sku: req.query.sku };
        if (req.query.name) filterQuery = { ...filterQuery, name: req.query.name };
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _products = await client.db(DB).collection(`Products`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _products.reverse();
        let [__users, __stores, __categories, __suppliers] = await Promise.all([
            client.db(DB).collection(`Users`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Stores`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Categories`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Suppliers`).find({ business_id: mongoQuery.business_id }).toArray(),
        ]);
        let _business = {};
        let _creator = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _creator[__user.user_id] = __user;
        });
        let _stores = {};
        __stores.map((__store) => {
            _stores[__store.store_id] = __store;
        });
        let _categories = {};
        __categories.map((__categorie) => {
            _categories[__categorie.category_id] = __categorie;
        });
        let _suppliers = {};
        __suppliers.map((__supplier) => {
            _suppliers[__supplier.supplier_id] = __supplier;
        });
        _products.map((_product) => {
            _product[`_business`] = _business[_product.business_id];
            _product[`_creator`] = _creator[_product.creator_id];
            _product[`_branch`] = _stores[_product.store_id];
            _product[`_category`] = _categories[_product.category_id];
            _product[`_supplier`] = _suppliers[_product.supplier_id];
            return _product;
        });
        // tách variant thành các phần tử riêng nếu merge là false
        let __products = [];
        if (req.query.merge == `false`) {
            _products = _products.map((_product) => {
                if (_product.has_variable) {
                    _product.variants = _product.variants.map((variant) => {
                        let _image = [..._product.image];
                        _image.push(variant.image);
                        let product_tmp = {
                            ..._product,
                            ...variant,
                            image: _image,
                        };
                        product_tmp[`has_variable`] = false;
                        product_tmp.attributes = [];
                        product_tmp.variants = [];
                        __products.push(product_tmp);
                    });
                } else {
                    __products.push(_product);
                }
            });
        } else {
            _products.map((_product) => {
                __products.push(_product);
            });
        }
        _products = __products;
        // lọc theo keyword
        if (req.query.search) {
            _products = _products.filter((_product) => {
                let check = false;
                [`code`, `sku`, `name`].map((key) => {
                    {
                        let value = removeUnicode(String(_product[key])).toLocaleLowerCase();
                        let compare = removeUnicode(String(req.query.search)).toLocaleLowerCase();
                        if (value.includes(compare)) {
                            check = true;
                        }
                    }
                });
                return check;
            });
        }
        // lọc theo query
        if (filterQuery) {
            filterQuery = Object.entries(filterQuery);
            filterQuery.forEach(([filterKey, filterValue]) => {
                if (removeUnicode(filterKey) == 'status') {
                    _products = _products.filter((_product) => {
                        if (_product.has_variable == true) {
                            check = false;
                            _product.variants.map((variant) => {
                                if (
                                    'available_stock'.includes(removeUnicode(filterValue)) &&
                                    'available_stock'.includes(variant.status)
                                ) {
                                    check = true;
                                }
                                if (
                                    'low_stock'.includes(removeUnicode(filterValue)) &&
                                    'low_stock'.includes(variant.status)
                                ) {
                                    check = true;
                                }
                                if (
                                    'out_stock'.includes(removeUnicode(filterValue)) &&
                                    'out_stock'.includes(variant.status)
                                ) {
                                    check = true;
                                }
                                if (
                                    'shipping'.includes(removeUnicode(filterValue)) &&
                                    variant.shipping_quantity > 0
                                ) {
                                    check = true;
                                }
                            });
                            return check;
                        } else {
                            if (
                                'available_stock'.includes(removeUnicode(filterValue)) &&
                                'available_stock'.includes(_product.status)
                            ) {
                                return true;
                            }
                            if (
                                'low_stock'.includes(removeUnicode(filterValue)) &&
                                'low_stock'.includes(_product.status)
                            ) {
                                return true;
                            }
                            if (
                                'out_stock'.includes(removeUnicode(filterValue)) &&
                                'out_stock'.includes(_product.status)
                            ) {
                                return true;
                            }
                            if (
                                'shipping'.includes(removeUnicode(filterValue)) &&
                                _product.shipping_quantity > 0
                            ) {
                                return true;
                            }
                        }
                    });
                } else {
                    _products = _products.filter((_product) => {
                        let value = removeUnicode(String(_product[filterKey])).toLocaleLowerCase();
                        let compare = removeUnicode(String(filterValue)).toLocaleLowerCase();
                        return value.includes(compare);
                    });
                }
            });
        }
        let all_count = 0;
        let available_count = 0;
        let low_count = 0;
        let out_count = 0;
        let shipping_count = 0;
        let return_count = 0;
        _products.map((_product) => {
            if (_product.has_variable == true) {
                _product.variants.map((variant) => {
                    all_count += variant['available_stock_quantity'] || 0;
                    available_count += variant['available_stock_quantity'] || 0;
                    all_count += variant['low_stock_quantity'] || 0;
                    low_count += variant['low_stock_quantity'] || 0;
                    all_count += variant['out_stock_quantity'] || 0;
                    out_count += variant['out_stock_quantity'] || 0;
                    all_count += variant['shipping_quantity'] || 0;
                    shipping_count += variant['shipping_quantity'] || 0;
                    all_count += variant['return_warehouse_quantity'] || 0;
                    return_count += variant['return_warehouse_quantity'] || 0;
                });
            } else {
                all_count += _product['available_stock_quantity'] || 0;
                available_count += _product['available_stock_quantity'] || 0;
                all_count += _product['low_stock_quantity'] || 0;
                low_count += _product['low_stock_quantity'] || 0;
                all_count += _product['out_stock_quantity'] || 0;
                out_count += _product['out_stock_quantity'] || 0;
                all_count += _product['shipping_quantity'] || 0;
                shipping_count += _product['shipping_quantity'] || 0;
                all_count += _product['return_warehouse_quantity'] || 0;
                return_count += _product['return_warehouse_quantity'] || 0;
            }
        });
        if (req.query.status) {
            _products = _products.filter((_product) => {
                if (_product.has_variable == true) {
                    check = false;
                    _product.variants.map((variant) => {
                        if (
                            'shipping'.includes(removeUnicode(req.query.status)) &&
                            variant.shipping_quantity > 0
                        ) {
                            check = true;
                        } else {
                            if (variant.status.includes(removeUnicode(req.query.status))) {
                                check = true;
                            }
                        }
                    });
                    return check;
                } else {
                    if (
                        'shipping'.includes(removeUnicode(req.query.status)) &&
                        _product.shipping_quantity > 0
                    ) {
                        return true;
                    } else {
                        if (_product.status.includes(removeUnicode(req.query.status))) {
                            return true;
                        }
                    }
                }
            });
        }
        // đếm số phần tử
        let _counts = _products.length;
        // phân trang
        if (page && page_size) {
            _products = _products.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        res.send({
            success: true,
            data: _products,
            count: _counts,
            all_count,
            available_count,
            low_count,
            out_count,
            shipping_count,
            return_count,
        });
    } catch (err) {
        next(err);
    }
};

let updateSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`SaleProducts`).updateMany(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                properties: `SaleProduct`,
                name: `Cập nhật thông tin sản phẩm tại cửa hàng`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSaleProductS,
    updateSaleProductS,
};
