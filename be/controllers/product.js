const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const productService = require(`../services/product`);
const { Product, Attribute, Variant, Location, Feedback } = require('../models/product');
const { Category } = require('../models/category');
const { Supplier } = require('../models/supplier');

const XLSX = require('xlsx');

let getProductC = async (req, res, next) => {
    try {
        await productService.getProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addProductC = async (req, res, next) => {
    try {
        if (!req.body.products) {
            throw new Error('400: products không được để trống!');
        }
        let productSkus = [];
        req.body.products.map((product) => {
            productSkus.push(product.sku);
        });
        let products = await client
            .db(DB)
            .collection(`Products`)
            .find({
                business_id: Number(req.user.business_id),
                sku: { $in: productSkus },
            })
            .toArray();
        let maxProductId = await client.db(DB).collection('AppSetting').findOne({ name: 'Products' });
        let suppliers = await client
            .db(DB)
            .collection('Suppliers')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _suppliers = {};
        suppliers.map((supplier) => {
            _suppliers[supplier.supplier_id] = supplier;
        });
        let branchs = await client
            .db(DB)
            .collection('Branchs')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _branchs = {};
        branchs.map((branch) => {
            _branchs[branch.branch_id] = branch;
        });
        let stores = await client
            .db(DB)
            .collection('Stores')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _stores = {};
        stores.map((store) => {
            _stores[store.store_id] = store;
        });
        req['_insert'] = {};
        req._insert['_products'] = [];
        req._insert['_attributes'] = [];
        req._insert['_variants'] = [];
        req._insert['_locations'] = [];
        let product_id = (() => {
            if (maxProductId) {
                if (maxProductId.value) {
                    return Number(maxProductId.value);
                }
            }
            return 0;
        })();
        let _productSkuInDBs = {};
        let _productIdInDBs = [];
        products.map((product) => {
            _productSkuInDBs[product.sku] = product;
            _productIdInDBs.push(product.product_id);
        });
        let attributes = await client
            .db(DB)
            .collection(`Attributes`)
            .find({
                product_id: { $in: _productIdInDBs },
            })
            .toArray();
        let maxAttributeId = await client.db(DB).collection('AppSetting').findOne({ name: 'Attributes' });
        let variants = await client
            .db(DB)
            .collection(`Variants`)
            .find({
                product_id: { $in: _productIdInDBs },
            })
            .toArray();
        let maxVariantId = await client.db(DB).collection('AppSetting').findOne({ name: 'Variants' });
        let maxLocationId = await client.db(DB).collection('AppSetting').findOne({ name: 'Locations' });
        let _attributeInDBs = {};
        attributes.map((attribute) => {
            _attributeInDBs[`pId${attribute.product_id}-aId${attribute.option}`] = attribute;
        });
        let attribute_id = (() => {
            if (maxAttributeId) {
                if (maxAttributeId.value) {
                    return Number(maxAttributeId.value);
                }
            }
            return 0;
        })();
        let _variantInDBs = {};
        variants.map((variant) => {
            _variantInDBs[`pId${variant.product_id}-vId${variant.sku}`] = variant;
        });
        let variant_id = (() => {
            if (maxVariantId) {
                if (maxVariantId.value) {
                    return Number(maxVariantId.value);
                }
            }
            return 0;
        })();
        let location_id = (() => {
            if (maxLocationId) {
                if (maxLocationId.value) {
                    return Number(maxLocationId.value);
                }
            }
            return 0;
        })();
        req.body.products.map((product) => {
            let _product = new Product();
            _product.validateInput(product);
            if (_productSkuInDBs[product.sku]) {
                _product.create({ ..._productSkuInDBs[product.sku] });
            } else {
                product_id++;
                _product.create({
                    ...product,
                    ...{
                        product_id: Number(product_id),
                        business_id: Number(req.user.business_id),
                        create_date: new Date(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    },
                });
            }
            req._insert._products.push(_product);
            if (product.attributes) {
                product.attributes.map((attribute) => {
                    let _attribute = new Attribute();
                    _attribute.validateInput(attribute);
                    if (
                        _attributeInDBs[
                            `pId${_product.product_id}-aId${String(attribute.option).toUpperCase()}`
                        ]
                    ) {
                        _attribute.create({
                            ..._attributeInDBs[
                                `pId${_product.product_id}-aId${String(attribute.option).toUpperCase()}`
                            ],
                        });
                    } else {
                        attribute_id++;
                        _attribute.create({
                            ...attribute,
                            attribute_id: Number(attribute_id),
                            business_id: Number(req.user.business_id),
                            product_id: Number(_product.product_id),
                            create_date: new Date(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        });
                    }
                    req._insert._attributes.push(_attribute);
                });
            }
            if (product.variants) {
                product.variants.map((variant) => {
                    let _variant = new Variant();
                    _variant.validateInput(variant);
                    if (_variantInDBs[`pId${_product.product_id}-vId${String(variant.sku).toUpperCase()}`]) {
                        _variant.create({
                            ..._variantInDBs[
                                `pId${_product.product_id}-vId${String(variant.sku).toUpperCase()}`
                            ],
                        });
                    } else {
                        variant_id++;
                        variant['supplier'] = (() => {
                            if (_suppliers[_product.supplier_id]) {
                                if (_suppliers[_product.supplier_id].name) {
                                    return _suppliers[_product.supplier_id].name;
                                }
                            }
                            return '';
                        })();
                        _variant.create({
                            ...variant,
                            business_id: Number(req.user.business_id),
                            variant_id: Number(variant_id),
                            product_id: Number(_product.product_id),
                            create_date: new Date(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        });
                    }
                    req._insert._variants.push(_variant);
                    if (variant.locations) {
                        variant.locations.map((location) => {
                            let _location = new Location();
                            _location.validateInput(location);
                            location_id++;
                            location['name'] = (() => {
                                if (String(location.type).toLowerCase() == 'branch') {
                                    if (_branchs[location.inventory_id]) {
                                        if (_branchs[location.inventory_id].name) {
                                            return _branchs[location.inventory_id].name;
                                        }
                                    }
                                    return '';
                                }
                                if (String(location.type).toLowerCase() == 'store') {
                                    if (_stores[location.inventory_id]) {
                                        if (_stores[location.inventory_id].name) {
                                            return _stores[location.inventory_id].name;
                                        }
                                    }
                                    return '';
                                }
                            })();
                            _location.create({
                                ...location,
                                business_id: Number(req.user.business_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                location_id: Number(location_id),
                                create_date: new Date(),
                                creator_id: Number(req.user.user_id),
                                active: true,
                            });
                            req._insert._locations.push(_location);
                        });
                    }
                });
            }
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Products' },
                { $set: { name: 'Products', value: product_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Attributes' },
                { $set: { name: 'Attributes', value: attribute_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Variants' },
                { $set: { name: 'Variants', value: variant_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Locations' },
                { $set: { name: 'Locations', value: location_id } },
                { upsert: true }
            );
        await productService.addProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateProductC = async (req, res, next) => {
    try {
        let product = await client
            .db(DB)
            .collection(`Products`)
            .findOne({
                product_id: Number(req.params.product_id),
            });
        if (!product) {
            throw new Error('400: Sản phẩm không tồn tại!');
        }
        let maxProductId = await client.db(DB).collection('AppSetting').findOne({ name: 'Products' });
        req['_update'] = {};
        req._update['_products'] = [];
        req._update['_attributes'] = [];
        req._update['_variants'] = [];
        req._update['_locations'] = [];
        req._update['_prices'] = [];
        let product_id = (() => {
            if (maxProductId) {
                if (maxProductId.value) {
                    return Number(maxProductId.value);
                }
            }
            return 0;
        })();
        let attributes = await client
            .db(DB)
            .collection(`Attributes`)
            .find({
                product_id: Number(product.product_id),
            })
            .toArray();
        let maxAttributeId = await client.db(DB).collection('AppSetting').findOne({ name: 'Attributes' });
        let variants = await client
            .db(DB)
            .collection(`Variants`)
            .find({
                product_id: Number(product.product_id),
            })
            .toArray();
        let maxVariantId = await client.db(DB).collection('AppSetting').findOne({ name: 'Variants' });
        let locations = await client
            .db(DB)
            .collection(`Locations`)
            .find({
                product_id: Number(product.product_id),
            })
            .toArray();
        let maxLocationId = await client.db(DB).collection('AppSetting').findOne({ name: 'Locations' });
        let prices = await client
            .db(DB)
            .collection(`Prices`)
            .find({
                product_id: Number(product.product_id),
            })
            .toArray();
        let maxPriceId = await client.db(DB).collection('AppSetting').findOne({ name: 'Prices' });
        let _attributeInDBs = {};
        attributes.map((attribute) => {
            _attributeInDBs[`pId${attribute.product_id}-aId${attribute.option}`] = attribute;
        });
        let attribute_id = (() => {
            if (maxAttributeId) {
                if (maxAttributeId.value) {
                    return Number(maxAttributeId.value);
                }
            }
            return 0;
        })();
        let _variantInDBs = {};
        variants.map((variant) => {
            _variantInDBs[`pId${variant.product_id}-vId${variant.sku}`] = variant;
        });
        let variant_id = (() => {
            if (maxVariantId) {
                if (maxVariantId.value) {
                    return Number(maxVariantId.value);
                }
            }
            return 0;
        })();
        let _locationInDBs = {};
        locations.map((location) => {
            _locationInDBs[`vId${location.variant_id}-sId${location.store_id}`] = location;
        });
        let location_id = (() => {
            if (maxLocationId) {
                if (maxLocationId.value) {
                    return Number(maxLocationId.value);
                }
            }
            return 0;
        })();
        let _priceInDBs = {};
        prices.map((price) => {
            _priceInDBs[`vId${price.variant_id}-min${price.min_quantity}-max${price.max_quantity}`] = price;
        });
        let price_id = (() => {
            if (maxPriceId) {
                if (maxPriceId.value) {
                    return Number(maxPriceId.value);
                }
            }
            return 0;
        })();
        let _product = new Product();
        _product.validateInput(product);
        _product.create(product);
        _product.update(req.body);
        req._update._products.push(_product);
        if (req.body.attributes) {
            req.body.attributes.map((attribute) => {
                let _attribute = new Attribute();
                _attribute.validateInput(attribute);
                if (_attributeInDBs[`pId${_product.product_id}-aId${attribute.option.toUpperCase()}`]) {
                    _attribute.create({
                        ..._attributeInDBs[`pId${_product.product_id}-aId${attribute.option.toUpperCase()}`],
                    });
                    _attribute.update(attribute);
                } else {
                    attribute_id++;
                    _attribute.create({
                        ...attribute,
                        supplier_id: Number(req.user.supplier_id),
                        product_id: Number(_product.product_id),
                        attribute_id: Number(attribute_id),
                        create_date: new Date(),
                        creator_id: Number(req.user.user_id),
                        is_active: true,
                    });
                }
                req._update._attributes.push(_attribute);
            });
        }
        if (req.body.variants) {
            req.body.variants.map((variant) => {
                let _variant = new Variant();
                _variant.validateInput(variant);
                if (_variantInDBs[`pId${_product.product_id}-vId${variant.sku.toUpperCase()}`]) {
                    _variant.create({
                        ..._variantInDBs[`pId${_product.product_id}-vId${variant.sku.toUpperCase()}`],
                    });
                    _variant.update(variant);
                } else {
                    variant_id++;
                    _variant.create({
                        ...variant,
                        supplier_id: Number(req.user.supplier_id),
                        product_id: Number(_product.product_id),
                        variant_id: Number(variant_id),
                        create_date: new Date(),
                        creator_id: Number(req.user.user_id),
                        is_active: true,
                    });
                }
                req._update._variants.push(_variant);
                if (variant.locations) {
                    variant.locations.map((location) => {
                        let _location = new Location();
                        _location.validateInput(location);
                        if (_locationInDBs[`vId${_variant.variant_id}-sId${location.store_id}`]) {
                            _location.create({
                                ..._locationInDBs[`vId${_variant.variant_id}-sId${location.store_id}`],
                            });
                            _location.update(location);
                        } else {
                            location_id++;
                            _location.create({
                                ...location,
                                supplier_id: Number(req.user.supplier_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                location_id: Number(location_id),
                                create_date: new Date(),
                                creator_id: Number(req.user.user_id),
                                is_active: true,
                            });
                        }
                        req._update._locations.push(_location);
                    });
                }
                if (variant.prices) {
                    variant.prices.map((price) => {
                        let _price = new Price();
                        _price.validateInput(price);
                        if (
                            _priceInDBs[
                                `vId${_variant.variant_id}-min${price.min_quantity}-max${price.max_quantity}`
                            ]
                        ) {
                            _price.create({
                                ..._priceInDBs[
                                    `vId${_variant.variant_id}-min${price.min_quantity}-max${price.max_quantity}`
                                ],
                            });
                            _price.update(price);
                        } else {
                            price_id++;
                            _price.create({
                                ...price,
                                supplier_id: Number(req.user.supplier_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                price_id: Number(price_id),
                                create_date: new Date(),
                                creator_id: Number(req.user.user_id),
                                is_active: true,
                            });
                        }
                        req._update._prices.push(_price);
                    });
                }
            });
        }

        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Products' },
                { $set: { name: 'Products', value: product_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Attributes' },
                { $set: { name: 'Attributes', value: attribute_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Variants' },
                { $set: { name: 'Variants', value: variant_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Locations' },
                { $set: { name: 'Locations', value: location_id } },
                { upsert: true }
            );
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true });
        await productService.updateProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let deleteProductC = async (req, res, next) => {
    try {
        req['_delete'] = req.query.product_id.split('---').map((id) => {
            return Number(id);
        });
        await productService.deleteProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let getAllAtttributeC = async (req, res, next) => {
    try {
        await productService.getAllAtttributeS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addFeedbackC = async (req, res, next) => {
    try {
        let _feedback = new Feedback();
        let feedbackMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Feedbacks' });
        let feedback_id = (() => {
            if (feedbackMaxId) {
                if (feedbackMaxId.value) {
                    return Number(feedbackMaxId.value);
                }
            }
            return 0;
        })();
        feedback_id++;
        _feedback.create({
            ...req.body,
            feedback_id: Number(feedback_id),
            create_date: new Date()
        });
        req['_insert'] = _feedback;
        await productService.addFeedbackS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let importFileC = async (req, res, next) => {
    try {
        if (req.file == undefined) {
            throw new Error('400: Vui lòng truyền file!');
        }
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
        });
        let excelProducts = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        // console.log(excelProducts);
        let suppliers = await client
            .db(DB)
            .collection('Suppliers')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _suppliers = {};
        suppliers.map((supplier) => {
            _suppliers[supplier.name] = supplier;
        });
        let excelSupplier = [];
        for (let i in excelProducts) {
            if (excelProducts[i]['Nhà cung cấp']) {
                excelSupplier.push(excelProducts[i]['Nhà cung cấp']);
            }
        }
        let newSuppliers = await new Promise(async (resolve, reject) => {
            let result = [];
            let supplier_id = await client
                .db(DB)
                .collection('Suplliers')
                .findOne({ name: 'Suplliers' })
                .then((maxSupplierId) => {
                    if (maxSupplierId && maxSupplierId.value) {
                        return maxSupplierId.value;
                    }
                    return 0;
                });
            for (let i in excelSupplier) {
                if (!_suppliers[excelSupplier[i]]) {
                    supplier_id++;
                    let _supplier = new Supplier();
                    _supplier.create({
                        supplier_id: Number(supplier_id),
                        business_id: Number(req.user.business_id),
                        name: excelSupplier[i],
                        create_date: new Date(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    });
                    await client.db(DB).collection('Suplliers').insertOne(_supplier);
                    result.push({ ..._supplier });
                }
            }
            resolve(result);
        });
        newSuppliers.map((supplier) => {
            _suppliers[supplier.name] = supplier;
        });

        let categories = await client
            .db(DB)
            .collection('Categories')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _categories = {};
        categories.map((category) => {
            _categories[category.name] = category;
        });
        let excelCategory = [];
        for (let i in excelProducts) {
            if (excelProducts[i]['Loại sản phẩm']) {
                excelCategory.push(excelProducts[i]['Loại sản phẩm']);
            }
        }
        let newCategories = await new Promise(async (resolve, reject) => {
            let result = [];
            let category_id = await client
                .db(DB)
                .collection('Categories')
                .findOne({ name: 'Categories' })
                .then((maxCategoryId) => {
                    if (maxCategoryId && maxCategoryId.value) {
                        return maxCategoryId.value;
                    }
                    return 0;
                });
            for (let i in excelCategory) {
                if (!_categories[excelCategory[i]]) {
                    category_id++;
                    let _category = new Category();
                    _category.create({
                        category_id: Number(category_id),
                        business_id: Number(req.user.business_id),
                        name: excelCategory[i],
                        create_date: new Date(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    });
                    await client.db(DB).collection('Categories').insertOne(_category);
                    result.push({ ..._category });
                }
            }
            resolve(result);
        });
        newCategories.map((category) => {
            _categories[category.name] = category;
        });

        let branchs = await client
            .db(DB)
            .collection('Branchs')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _branchs = {};
        branchs.map((branch) => {
            _branchs[branch.name] = branch;
        });
        let excelBranch = [];
        for (let i in excelProducts) {
        }

        let stores = await client
            .db(DB)
            .collection('Stores')
            .find({ business_id: Number(req.user.business_id) })
            .toArray();
        let _stores = {};
        stores.map((store) => {
            _stores[store.name] = store;
        });
        let _products = {};
        excelProducts.map((product) => {
            if (!_products[product['Mã sản phẩm']]) {
                _products[product['Mã sản phẩm']] = {
                    name: product['Tên sản phẩm'],
                    sku: product['Mã sản phẩm'],
                    category_id: (() => {
                        if (_categories[product['Loại sản phẩm']]) {
                            if (_categories[product['Loại sản phẩm']].category_id) {
                                return _categories[product['Loại sản phẩm']].category_id;
                            }
                        }
                        return '';
                    })(),
                    supplier_id: (() => {
                        if (_suppliers[product['Nhà cung cấp']]) {
                            if (_suppliers[product['Nhà cung cấp']].supplier_id) {
                                return _suppliers[product['Nhà cung cấp']].supplier_id;
                            }
                        }
                        return '';
                    })(),
                    image: [product['Hình ảnh']],
                    length: product['Chiều dài'],
                    width: product['Chiều rộng'],
                    height: product['Chiều cao'],
                    weight: product['Cân nặng'],
                    unit: product['Đơn vị tính'],
                    description: product['Mô tả'],
                };
            }
            if (!_products[product['Mã sản phẩm']]['attributes']) {
                _products[product['Mã sản phẩm']]['attributes'] = [];
            }
            if (_products[product['Mã sản phẩm']]['attributes']) {
                for (let i = 1; i <= 3; i++) {
                    if (product[`Thuộc tính ${i}`]) {
                        let index = -1;
                        for (let j in _products[product['Mã sản phẩm']].attributes) {
                            if (
                                _products[product['Mã sản phẩm']].attributes[j].option ==
                                product[`Thuộc tính ${i}`].toUpperCase()
                            ) {
                                index = j;
                            }
                        }
                        if (index != -1) {
                            if (
                                !_products[product['Mã sản phẩm']].attributes[index].values.includes(
                                    product[`Giá trị ${i}`].toUpperCase()
                                )
                            ) {
                                _products[product['Mã sản phẩm']].attributes[index].values.push(
                                    product[`Giá trị ${i}`].toUpperCase()
                                );
                            }
                        } else {
                            _products[product['Mã sản phẩm']].attributes.push({
                                option: product[`Thuộc tính ${i}`].toUpperCase(),
                                values: [product[`Giá trị ${i}`].toUpperCase()],
                            });
                        }
                    }
                }
            }
            if (!_products[product['Mã sản phẩm']]['variants']) {
                _products[product['Mã sản phẩm']]['variants'] = [];
            }
            if (_products[product['Mã sản phẩm']]['variants']) {
                _products[product['Mã sản phẩm']]['variants'].push({
                    title: product['Tên phiên bản'],
                    sku: product['Mã phiên bản'],
                    image: [product['Hình ảnh_1']],
                    options: (() => {
                        let result = [];
                        for (let i = 1; i <= 2; i++) {
                            if (product[`Giá trị ${i}`]) {
                                result.push(product[`Giá trị ${i}`]);
                            }
                        }
                        return result;
                    })(),
                    supplier: product['Mã sản phẩm'],
                    import_price: product['Giá nhập hàng'],
                    base_price: product['Giá vốn'],
                    sale_price: product['Giá bán lẻ'],
                    wholesale_price: product['Giá bán sỉ'],
                    wholesale_quantity: product['Số lượng sỉ'],
                    locations: (() => {
                        if (product['Số địa điểm nhập']) {
                            let _locations = [];
                            for (let i = 0; i < product['Số địa điểm nhập']; i++) {
                                let _location = (() => {
                                    if (i == 0) {
                                        return {
                                            type: (() => {
                                                if (
                                                    product['Nơi nhập'].toLowerCase() == 'store' ||
                                                    product['Nơi nhập'].toLowerCase() == 'cửa hàng'
                                                ) {
                                                    return 'store';
                                                }
                                                return 'branch';
                                            })(),
                                            inventory_id: (() => {
                                                if (_stores[`${product['Tên nơi nhập'].toUpperCase()}`]) {
                                                    if (
                                                        _stores[`${product['Tên nơi nhập'].toUpperCase()}`]
                                                            .name
                                                    ) {
                                                        return _stores[
                                                            `${product['Tên nơi nhập'].toUpperCase()}`
                                                        ].store_id;
                                                    }
                                                }
                                                if (_branchs[`${product['Tên nơi nhập'].toUpperCase()}`]) {
                                                    if (
                                                        _branchs[`${product['Tên nơi nhập'].toUpperCase()}`]
                                                            .name
                                                    ) {
                                                        return _branchs[
                                                            `${product['Tên nơi nhập'].toUpperCase()}`
                                                        ].branch_id;
                                                    }
                                                }
                                                return '';
                                            })(),
                                            quantity: product['Số lượng nhập'],
                                        };
                                    } else {
                                        return {
                                            type: (() => {
                                                if (
                                                    product[`Nơi nhập_${i}`].toLowerCase() == 'store' ||
                                                    product[`Nơi nhập_${i}`].toLowerCase() == 'cửa hàng'
                                                ) {
                                                    return 'store';
                                                }
                                                return 'branch';
                                            })(),
                                            inventory_id: (() => {
                                                if (
                                                    _stores[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]
                                                ) {
                                                    if (
                                                        _stores[
                                                            `${product[`Tên nơi nhập_${i}`].toUpperCase()}`
                                                        ].name
                                                    ) {
                                                        return _stores[
                                                            `${product[`Tên nơi nhập_${i}`].toUpperCase()}`
                                                        ].store_id;
                                                    }
                                                }
                                                if (
                                                    _branchs[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]
                                                ) {
                                                    if (
                                                        _branchs[
                                                            `${product[`Tên nơi nhập_${i}`].toUpperCase()}`
                                                        ].name
                                                    ) {
                                                        return _branchs[
                                                            `${product[`Tên nơi nhập_${i}`].toUpperCase()}`
                                                        ].branch_id;
                                                    }
                                                }
                                                return '';
                                            })(),
                                            quantity: product[`Số lượng nhập_${i}`],
                                        };
                                    }
                                })();
                                _locations.push(_location);
                            }
                            return _locations;
                        }
                    })(),
                });
            }
        });
        _products = Object.values(_products);
        req.body = { products: _products };
        await addProductC(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProductC,
    addProductC,
    updateProductC,
    deleteProductC,
    getAllAtttributeC,
    addFeedbackC,
    importFileC,
};
