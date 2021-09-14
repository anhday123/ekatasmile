const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const productService = require(`../services/branch-product`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_product`))
        //     throw new Error(`400 ~ Forbidden!`);
        await productService.getProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_product`))
        //     throw new Error(`400 ~ Forbidden!`);
        ['products'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        // lấy các thông tin để xác định input hợp lệ
        let [_counts, _business, __branchs, __warranties, __suppliers, __categories, __products, _sku] =
            await Promise.all([
                client.db(DB).collection(`Products`).countDocuments(),
                client.db(DB).collection(`Users`).findOne({
                    user_id: token.business_id,
                    active: true,
                }),
                client.db(DB).collection(`Branchs`).find({ active: true }).toArray(),
                client.db(DB).collection(`Warranties`).find({ active: true }).toArray(),
                client.db(DB).collection(`Suppliers`).find({ active: true }).toArray(),
                client.db(DB).collection(`Categories`).find({ active: true }).toArray(),
                client.db(DB).collection(`Products`).find({ active: true }).toArray(),
                client.db(DB).collection(`SKUProducts`).findOne({ business_id: token.business_id }),
            ]);
        if (!_business) {
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        }
        if (!_sku) {
            _sku = {
                business_id: token.business_id,
                sku_count: 0,
            };
            let _insert = await client.db(DB).collection(`SKUProducts`).insertOne(_sku);
            if (!_insert.insertedId) {
                throw new Error(`500 ~ Create SKU fail!`);
            }
        }
        _sku.sku_count = Number(_sku.sku_count);
        let _branchs = {};
        __branchs.map((item) => {
            _branchs[item.branch_id] = item;
        });
        let _warranties = {};
        __warranties.map((item) => {
            _warranties[item.warranty_id] = item;
        });
        let _suppliers = {};
        __suppliers.map((item) => {
            _suppliers[item.supplier_id] = item;
        });
        let _categories = {};
        __categories.map((item) => {
            _categories[item.category_id] = item;
        });
        // req[`_insert`]: sản phẩm mới chưa có trong database
        req[`_insert`] = [];
        // Duyệt danh sách các sản phẩm gửi lên
        let index = 0;
        req.body.products.map((product) => {
            ['sku', 'name'].map((property) => {
                if (product[property] == undefined) {
                    throw new Error(`400 ~ ${property} is not null!`);
                }
            });
            //uppercase tên + sku của sản phẩm
            product[`name`] = String(product.name).trim().toUpperCase();
            product[`slug`] = product.name
                .trim()
                .normalize(`NFD`)
                .replace(/[\u0300-\u036f]/g, ``)
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/\s/g, '-')
                .toLowerCase();
            _sku.sku_count++;
            product[`sku`] = String(product.sku + '-' + String(_sku.sku_count))
                .trim()
                .toUpperCase();
            // Kiểm tra chi nhánh có tồn tại không
            if (!_branchs[product.branch_id]) {
                throw new Error(`400 ~ Branch ${product.branch_id} is not exists or inactive!`);
            }
            // Kiểm tra loại sản phẩm có tồn tại không
            if (!_categories[product.category_id]) {
                throw new Error(`400 ~ Category ${product.category_id} is not exists or inactive!`);
            }
            // Kiểm tra danh sách bảo hành có tồn tại không nếu có thì gắn vào thay cho warranty_id
            product.warranties = product.warranties.map((warranty) => {
                if (!_warranties[warranty]) {
                    throw new Error(`400 ~ Warranty ${warranty} is not exists or inactive!`);
                } else {
                    return _warranties[warranty];
                }
            });
            // Kiểm tra nhà cung cấp có tồn tại không
            if (!_suppliers[product.supplier_id]) {
                throw new Error(`400 ~ Supplier ${product.supplier_id} is not exists or inactive!`);
            }
            // Tạo sản phẩm mới
            product[`product_id`] = String(_counts + 1 + index);
            index++;
            product[`business_id`] = token.business_id;
            if (product.has_variable == false) {
                if (product.quantity >= 0) {
                    product[`available_stock_quantity`] = product.quantity || 0;
                    product[`low_stock_quantity`] = 0;
                    product[`out_stock_quantity`] = 0;
                } else {
                    product[`available_stock_quantity`] = 0;
                    product[`low_stock_quantity`] = 0;
                    product[`out_stock_quantity`] = -product.quantity;
                }
                product[`shipping_quantity`] = 0;
                product[`return_warehouse_quantity`] = 0;
                product[`status_check`] = product.status_check || 10;
                product[`status_check_value`] = Math.round(
                    ((product[`available_stock_quantity`] + product[`low_stock_quantity`]) *
                        product.status_check) /
                        100
                );
                if (
                    product[`available_stock_quantity`] + product[`low_stock_quantity`] >
                    product[`status_check_value`]
                ) {
                    product[`available_stock_quantity`] =
                        product[`available_stock_quantity`] + product[`low_stock_quantity`];
                    product[`low_stock_quantity`] = 0;
                    product[`out_stock_quantity`] = 0;
                    product[`status`] = `available_stock`;
                }
                if (
                    product[`available_stock_quantity`] + product[`low_stock_quantity`] <=
                    product[`status_check_value`]
                ) {
                    product[`available_stock_quantity`] = 0;
                    product[`low_stock_quantity`] =
                        product[`available_stock_quantity`] + product[`low_stock_quantity`];
                    product[`out_stock_quantity`] = 0;
                    product[`status`] = `low_stock`;
                }
                if (product.quantity < 0) {
                    product[`available_stock_quantity`] = 0;
                    product[`low_stock_quantity`] = 0;
                    product[`out_stock_quantity`] = -product.quantity;
                    product[`status`] = `out_stock`;
                }
                delete product.quantity;
            } else {
                product.attributes = product.attributes.map((attribute) => {
                    ['option', 'values'].map((property) => {
                        if (attribute[property] == undefined) {
                            throw new Error(`400 ~ Attributes - ${property} is not null!`);
                        }
                    });
                    attribute.option = String(attribute.option).trim().toUpperCase();
                    attribute.values = attribute.values.map((value) => {
                        value = String(value).trim().toUpperCase();
                        return value;
                    });
                    return attribute;
                });
                product.variants = product.variants.map((variant) => {
                    ['title', 'sku'].map((property) => {
                        if (variant[property] == undefined) {
                            throw new Error(`400 ~ Variants - ${property} is not null!`);
                        }
                    });
                    variant[`title`] = String(variant[`title`]).trim().toUpperCase();
                    _sku.sku_count++;
                    variant[`sku`] = String(variant[`sku`] + '-' + _sku.sku_count)
                        .trim()
                        .toUpperCase();
                    variant.options = variant.options.map((option) => {
                        ['name', 'value'].map((property) => {
                            if (option[property] == undefined) {
                                throw new Error(`400 ~ Variant - options - ${property} is not null!`);
                            }
                        });
                        option.name = String(option.name).trim().toUpperCase();
                        option.value = String(option.value).trim().toUpperCase();
                        return option;
                    });
                    variant[`quantity`] = variant.quantity || 0;
                    if (variant.quantity >= 0) {
                        variant[`available_stock_quantity`] = variant.quantity;
                        variant[`low_stock_quantity`] = 0;
                        variant[`out_stock_quantity`] = 0;
                    } else {
                        variant[`available_stock_quantity`] = 0;
                        variant[`low_stock_quantity`] = 0;
                        variant[`out_stock_quantity`] = -variant.quantity;
                    }
                    variant[`shipping_quantity`] = 0;
                    variant[`return_warehouse_quantity`] = 0;
                    variant[`status_check`] = variant.status_check || 10;
                    variant[`status_check_value`] = Math.round(
                        ((variant[`available_stock_quantity`] + variant[`low_stock_quantity`]) *
                            variant.status_check) /
                            100
                    );
                    if (
                        variant[`available_stock_quantity`] + variant[`low_stock_quantity`] >
                        variant[`status_check_value`]
                    ) {
                        variant[`available_stock_quantity`] =
                            variant[`available_stock_quantity`] + variant[`low_stock_quantity`];
                        variant[`low_stock_quantity`] = 0;
                        variant[`out_stock_quantity`] = 0;
                        variant[`status`] = `available_stock`;
                    }
                    if (
                        variant[`available_stock_quantity`] + variant[`low_stock_quantity`] <=
                        variant[`status_check_value`]
                    ) {
                        variant[`available_stock_quantity`] = 0;
                        variant[`low_stock_quantity`] =
                            variant[`available_stock_quantity`] + variant[`low_stock_quantity`];
                        variant[`out_stock_quantity`] = 0;
                        variant[`status`] = `low_stock`;
                    }
                    if (variant.quantity < 0) {
                        variant[`available_stock_quantity`] = 0;
                        variant[`low_stock_quantity`] = 0;
                        variant[`out_stock_quantity`] = -variant.quantity;
                        variant[`status`] = `out_stock`;
                    }
                    delete variant.quantity;
                    return variant;
                });
            }
            let _product = {
                product_id: product.product_id,
                business_id: product.business_id,
                branch_id: product.branch_id,
                sku: product.sku,
                name: product.name,
                sub_name: removeUnicode(product.name).toLocaleLowerCase(),
                slug: product.slug,
                category_id: product.category_id || ``,
                length: product.length || 0,
                width: product.width || 0,
                height: product.height || 0,
                weight: product.weight || 0,
                warranties: product.warranties || [],
                unit: product.unit || ``,
                supplier_id: product.supplier_id || ``,
                description: product.description || ``,
                has_variable: product.has_variable || false,
                image: product.image || [],
                import_price: product.import_price || 0,
                base_price: product.base_price || 0,
                sale_price: product.sale_price || 0,
                available_stock_quantity: product.available_stock_quantity || 0,
                low_stock_quantity: product.low_stock_quantity || 0,
                out_stock_quantity: product.out_stock_quantity || 0,
                shipping_quantity: product.shipping_quantity || 0,
                return_warehouse_quantity: product.return_warehouse_quantity || 0,
                status_check: product.status_check || 10,
                status_check_value: product.status_check_value,
                //available_stock - low_stock - out_stock
                status: product.status || `available_stock`,
                attributes: product.attributes || [],
                variants: product.variants || [],
                create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
                creator_id: token.user_id,
                delete: false,
                active: true,
            };
            req[`_insert`].push(_product);
        });
        req[`_sku`] = _sku;
        await productService.addProductS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let updateProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_product`))
        //     throw new Error(`400 ~ Forbidden!`);
        let _product = await client.db(DB).collection(`Products`).findOne(req.params);
        if (!_product) throw new Error(`400 ~ Product is not exists!`);
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
        await productService.updateProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let deleleProductC = async (req, res, next) => {
    try {
        ['products'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        if (typeof req.body.products != 'object') {
            throw new Error(`400 ~ products must be array!`);
        }
        await client
            .db(DB)
            .collection('Products')
            .updateMany({ product_id: { $in: req.body.products } }, { $set: { delete: true } });
        res.send({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProductC,
    addProductC,
    updateProductC,
    deleleProductC,
};
