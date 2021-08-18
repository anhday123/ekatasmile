const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/product`);
const productService = require(`../services/product`);

let getProductC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getProduct))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await productService.getProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addProductC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        if (!req.body.product_list)
            throw new Error(`400 ~ Validate data wrong!`);
        // lấy các thông tin để xác định input hợp lệ
        let [
            _counts,
            _count,
            __users,
            __warehouses,
            __warranties,
            __suppliers,
            __categories,
            __products,
        ] = await Promise.all([
            client.db(DB).collection(`Products`).countDocuments(),
            client
                .db(DB)
                .collection(`Products`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).find({ active: true }).toArray(),
            client
                .db(DB)
                .collection(`Warehouses`)
                .find({ active: true })
                .toArray(),
            client
                .db(DB)
                .collection(`Warranties`)
                .find({ active: true })
                .toArray(),
            client
                .db(DB)
                .collection(`Suppliers`)
                .find({ active: true })
                .toArray(),
            client
                .db(DB)
                .collection(`Categories`)
                .find({ active: true })
                .toArray(),
            client
                .db(DB)
                .collection(`Products`)
                .find({ active: true })
                .toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        __users.map((item) => {
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        let _warehouses = {};
        __warehouses.map((item) => {
            _warehouses[item.warehouse_id] = item;
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
        // // Tạo map cho các sản phẩm theo form product[id kho][sku]
        // let _products = {};
        // __products.map((item) => {
        //     if (!_products[item.warehouse]) _products[item.warehouse] = [];
        //     if (_products[item.warehouse]) _products[item.warehouse].push(item);
        // });
        // for (let i in _products) {
        //     let tmp = {};
        //     _products[i].map((item) => {
        //         tmp[item.sku] = item;
        //     });
        //     _products[i] = tmp;
        // }
        // req[`_product`]: sản phẩm mới chưa có trong database
        req[`_product`] = [];
        // req[`_update`]: sản phẩm đã có trong database
        req[`_update`] = [];
        // Duyệt danh sách các sản phẩm gửi lên
        let index = 0;
        for (let i in req.body.product_list) {
            //uppercase tên + sku của sản phẩm
            req.body.product_list[i][`name`] = String(
                req.body.product_list[i].name
            )
                .trim()
                .toUpperCase();
            req.body.product_list[i][`slug`] = req.body.product_list[i].name
                .trim()
                .normalize(`NFD`)
                .replace(/[\u0300-\u036f]/g, ``)
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .replace(/\s/g, '-')
                .toLowerCase();
            req.body.product_list[i][`sku`] = String(
                req.body.product_list[i].sku
            )
                .trim()
                .toUpperCase();
            // kiểm tra bussiness có tồn tại hay không
            if (!_bussiness[token.bussiness.user_id])
                throw new Error(`400 ~ Bussiness is not exists or inactive!`);
            // Kiểm tra kho có tồn tại không
            if (!_warehouses[req.body.product_list[i].warehouse])
                throw new Error(`400 ~ Warehouse is not exists or inactive!`);
            // Kiểm tra loại sản phẩm có tồn tại không
            if (!_categories[req.body.product_list[i].category])
                throw new Error(`400 ~ Category is not exists or inactive!`);
            // Kiểm tra danh sách bảo hành có tồn tại không nếu có thì gắn vào thay cho warranty_id
            for (let j in req.body.product_list[i].warranty)
                if (!_warranties[req.body.product_list[i].warranty[j]])
                    throw new Error(
                        `400 ~ Warranty is not exists or inactive!`
                    );
                else
                    req.body.product_list[i].warranty[j] =
                        _warranties[req.body.product_list[i].warranty[j]];
            // Kiểm tra nhà cung cấp có tồn tại không
            if (!_suppliers[req.body.product_list[i].suppliers])
                throw new Error(`400 ~ Supplier is not exists or inactive!`);
            // Tạo sản phẩm mới
            req.body.product_list[i][`product_id`] = String(
                _counts + 1 + index
            );
            req.body.product_list[i][`code`] = `${String(
                _bussiness.company_name
            )
                .normalize(`NFD`)
                .replace(/[\u0300-\u036f]|\s/g, ``)
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toUpperCase()}_${String(_count + 1 + index)}`;
            index++;
            req.body.product_list[i][`bussiness`] =
                _bussiness[token.bussiness.user_id].user_id;
            if (req.body.product_list[i].has_variable == false) {
                if (req.body.product_list[i].quantity >= 0) {
                    req.body.product_list[i][`available_stock_quantity`] =
                        req.body.product_list[i].quantity || 0;
                    req.body.product_list[i][`low_stock_quantity`] = 0;
                    req.body.product_list[i][`out_stock_quantity`] = 0;
                } else {
                    req.body.product_list[i][`available_stock_quantity`] = 0;
                    req.body.product_list[i][`low_stock_quantity`] = 0;
                    req.body.product_list[i][`out_stock_quantity`] =
                        -req.body.product_list[i].quantity;
                }
                req.body.product_list[i][`shipping_quantity`] = 0;
                req.body.product_list[i][`return_warehouse_quantity`] = 0;
                req.body.product_list[i][`status_check`] =
                    req.body.product_list[i].status_check || 10;
                req.body.product_list[i][`status_check_value`] = Math.round(
                    ((req.body.product_list[i][`available_stock_quantity`] +
                        req.body.product_list[i][`low_stock_quantity`]) *
                        req.body.product_list[i].status_check) /
                        100
                );
                if (
                    req.body.product_list[i][`available_stock_quantity`] +
                        req.body.product_list[i][`low_stock_quantity`] >
                    req.body.product_list[i][`status_check_value`]
                ) {
                    req.body.product_list[i][`available_stock_quantity`] =
                        req.body.product_list[i][`available_stock_quantity`] +
                        req.body.product_list[i][`low_stock_quantity`];
                    req.body.product_list[i][`low_stock_quantity`] = 0;
                    req.body.product_list[i][`out_stock_quantity`] = 0;
                    req.body.product_list[i][`status`] = `available_stock`;
                }
                if (
                    req.body.product_list[i][`available_stock_quantity`] +
                        req.body.product_list[i][`low_stock_quantity`] <=
                    req.body.product_list[i][`status_check_value`]
                ) {
                    req.body.product_list[i][`available_stock_quantity`] = 0;
                    req.body.product_list[i][`low_stock_quantity`] =
                        req.body.product_list[i][`available_stock_quantity`] +
                        req.body.product_list[i][`low_stock_quantity`];
                    req.body.product_list[i][`out_stock_quantity`] = 0;
                    req.body.product_list[i][`status`] = `low_stock`;
                }
                if (req.body.product_list[i].quantity < 0) {
                    req.body.product_list[i][`available_stock_quantity`] = 0;
                    req.body.product_list[i][`low_stock_quantity`] = 0;
                    req.body.product_list[i][`out_stock_quantity`] =
                        -req.body.product_list[i].quantity;
                    req.body.product_list[i][`status`] = `out_stock`;
                }
                delete req.body.product_list[i].quantity;
            } else {
                for (let j in req.body.product_list[i].attributes) {
                    let tmp = req.body.product_list[i].attributes[j];
                    tmp.option = tmp.option.trim().toUpperCase();
                    tmp.values = tmp.values.map((item) => {
                        item = item.trim().toUpperCase();
                        return item;
                    });
                }
                for (let j in req.body.product_list[i].variants) {
                    req.body.product_list[i].variants[j][`title`] =
                        req.body.product_list[i].variants[j][`title`]
                            .trim()
                            .toUpperCase();
                    req.body.product_list[i].variants[j][`sku`] =
                        req.body.product_list[i].variants[j][`sku`]
                            .trim()
                            .toUpperCase();
                    for (let k in req.body.product_list[i].variants[j]
                        .options) {
                        let tmp =
                            req.body.product_list[i].variants[j].options[k];
                        tmp.name = tmp.name.trim().toUpperCase();
                        tmp.values = tmp.values.trim().toUpperCase();
                        req.body.product_list[i].variants[j].options[k] = tmp;
                    }
                    if (req.body.product_list[i].variants[j].quantity >= 0) {
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] = req.body.product_list[i].variants[j].quantity || 0;
                        req.body.product_list[i].variants[j][
                            `low_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `out_stock_quantity`
                        ] = 0;
                    } else {
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `low_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `out_stock_quantity`
                        ] = -req.body.product_list[i].variants[j].quantity;
                    }
                    req.body.product_list[i].variants[j][
                        `shipping_quantity`
                    ] = 0;
                    req.body.product_list[i].variants[j][
                        `return_warehouse_quantity`
                    ] = 0;
                    req.body.product_list[i].variants[j][`status_check`] =
                        req.body.product_list[i].variants[j].status_check || 10;
                    req.body.product_list[i].variants[j][`status_check_value`] =
                        Math.round(
                            ((req.body.product_list[i].variants[j][
                                `available_stock_quantity`
                            ] +
                                req.body.product_list[i].variants[j][
                                    `low_stock_quantity`
                                ]) *
                                req.body.product_list[i].variants[j]
                                    .status_check) /
                                100
                        );
                    if (
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] +
                            req.body.product_list[i].variants[j][
                                `low_stock_quantity`
                            ] >
                        req.body.product_list[i].variants[j][
                            `status_check_value`
                        ]
                    ) {
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] =
                            req.body.product_list[i].variants[j][
                                `available_stock_quantity`
                            ] +
                            req.body.product_list[i].variants[j][
                                `low_stock_quantity`
                            ];
                        req.body.product_list[i].variants[j][
                            `low_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `out_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `status`
                        ] = `available_stock`;
                    }
                    if (
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] +
                            req.body.product_list[i].variants[j][
                                `low_stock_quantity`
                            ] <=
                        req.body.product_list[i].variants[j][
                            `status_check_value`
                        ]
                    ) {
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `low_stock_quantity`
                        ] =
                            req.body.product_list[i].variants[j][
                                `available_stock_quantity`
                            ] +
                            req.body.product_list[i].variants[j][
                                `low_stock_quantity`
                            ];
                        req.body.product_list[i].variants[j][
                            `out_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `status`
                        ] = `low_stock`;
                    }
                    if (req.body.product_list[i].variants[j].quantity < 0) {
                        req.body.product_list[i].variants[j][
                            `available_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `low_stock_quantity`
                        ] = 0;
                        req.body.product_list[i].variants[j][
                            `out_stock_quantity`
                        ] = -req.body.product_list[i].variants[j].quantity;
                        req.body.product_list[i].variants[j][
                            `status`
                        ] = `out_stock`;
                    }
                    delete req.body.product_list[i].variants[j].quantity;
                }
            }
            let _product = {
                product_id: req.body.product_list[i].product_id,
                bussiness: req.body.product_list[i].bussiness,
                warehouse: req.body.product_list[i].warehouse,
                sku: req.body.product_list[i].sku,
                name: req.body.product_list[i].name,
                slug: req.body.product_list[i].slug,
                barcode: req.body.product_list[i].barcode,
                category: req.body.product_list[i].category,
                image: req.body.product_list[i].image,
                length: req.body.product_list[i].length,
                width: req.body.product_list[i].width,
                height: req.body.product_list[i].height,
                weight: req.body.product_list[i].weight,
                warranty: req.body.product_list[i].warranty,
                unit: req.body.product_list[i].unit,
                suppliers: req.body.product_list[i].suppliers,
                has_variable: req.body.product_list[i].has_variable,
                import_price: req.body.product_list[i].import_price,
                base_price: req.body.product_list[i].base_price,
                sale_price: req.body.product_list[i].sale_price,
                available_stock_quantity:
                    req.body.product_list[i].available_stock_quantity,
                low_stock_quantity: req.body.product_list[i].low_stock_quantity,
                out_stock_quantity: req.body.product_list[i].out_stock_quantity,
                shipping_quantity: req.body.product_list[i].shipping_quantity,
                return_warehouse_quantity:
                    req.body.product_list[i].return_warehouse_quantity,
                status_check: req.body.product_list[i].status_check,
                status_check_value: req.body.product_list[i].status_check_value,
                //available_stock - low_stock - out_stock
                status: req.body.product_list[i].status,
                attributes: req.body.product_list[i].attributes,
                variants: req.body.product_list[i].variants,
                description: req.body.product_list[i].description,
                create_date: moment().format(),
                creator: token.user_id,
                active: true,
            };
            req[`_product`].push(_product);
        }
        // res.send({ data: req._product });
        await productService.addProductS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
let updateProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _product = await client
            .db(DB)
            .collection(`Products`)
            .findOne(req.params);
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
            if (req.body.attributes) {
                for (let i in req.body.attributes) {
                    let tmp = req.body.attributes[i];
                    tmp.option = tmp.option.trim().toUpperCase();
                    tmp.values = tmp.values.map((item) => {
                        item = item.trim().toUpperCase();
                        return item;
                    });
                }
            }
            for (i in req.body.variants) {
                req.body.variants[i][`title`] = req.body.variants[i][`title`]
                    .trim()
                    .toUpperCase();
                req.body.variants[i][`sku`] = req.body.variants[i][`sku`]
                    .trim()
                    .toUpperCase();
                for (let j in req.body.variants[i].options) {
                    let tmp = req.body.variants[i].options[j];
                    tmp.name = tmp.name.trim().toUpperCase();
                    tmp.values = tmp.values.trim().toUpperCase();
                    req.body.variants[i].options[j] = tmp;
                }
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
        req.body.warehouse =
            req.body.warehouse.warehouse_id || req.body.warehouse;
        req.body.category = req.body.category.category_id || req.body.category;
        req.body.suppliers =
            req.body.suppliers.supplier_id || req.body.suppliers;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
        delete req.body._category;
        delete req.body._supplier;
        await productService.updateProductS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    getProductC,
    addProductC,
    updateProductC,
};
