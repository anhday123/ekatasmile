const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const productService = require(`../services/product`);

const XLSX = require('xlsx');

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

module.exports.getProductC = async (req, res, next) => {
    try {
        await productService.getProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.addProductC = async (req, res, next) => {
    try {
        if (!req.body.products) {
            throw new Error('400: products không được để trống!');
        }
        let supplierIds = [];
        let productSkus = [];
        req.body.products.map((product) => {
            if (product.supplier_id) {
                supplierIds.push(Number(product.supplier_id));
            }
            if (product.sku) {
                productSkus.push(
                    String(product.sku || '')
                        .trim()
                        .toUpperCase()
                );
            }
        });
        let [suppliers, products] = await Promise.all([
            client
                .db(DB)
                .collection('Suppliers')
                .find({ supplier_id: { $in: supplierIds } })
                .toArray(),
            client
                .db(DB)
                .collection(`Products`)
                .find({
                    business_id: Number(req.user.business_id),
                    sku: { $in: productSkus },
                })
                .toArray(),
        ]);
        let _suppliers = {};
        suppliers.map((eSupplier) => {
            _suppliers[String(eSupplier.supplier_id)] = eSupplier;
        });
        let _products = {};
        products.map((eProduct) => {
            _products[String(eProduct.sku)] = eProduct;
        });
        let productIds = [];
        products.map((eProduct) => {
            productIds.push(Number(eProduct.product_id));
        });
        let [attributes, variants] = await Promise.all([
            client
                .db(DB)
                .collection(`Attributes`)
                .find({
                    product_id: { $in: productIds },
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Variants`)
                .find({
                    product_id: { $in: productIds },
                })
                .toArray(),
        ]);
        let _attributes = {};
        attributes.map((eAttribute) => {
            _attributes[`${eAttribute.product_id}-${eAttribute.option}`] = eAttribute;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[`${eVariant.product_id}-${eVariant.sku}`] = eVariant;
        });

        let [product_id, attribute_id, variant_id, price_id] = await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Products' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Attributes' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            await client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Variants' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            await client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Prices' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
        ]);

        req['_newProducts'] = [];
        req['_newAttributes'] = [];
        req['_newVariants'] = [];
        req['_newPrices'] = [];
        req['_oldProducts'] = [];
        req['_oldAttributes'] = [];
        req['_oldVariants'] = [];
        req.body.products.map((eProduct) => {
            delete eProduct._id;
            delete eProduct.business_id;
            delete eProduct.product_id;
            delete eProduct.create_date;
            delete eProduct.last_update;
            delete eProduct.creator_id;
            if (_products[eProduct.sku]) {
                let _product = { ..._products[eProduct.sku], ...eProduct };
                _product = {
                    business_id: Number(_product.business_id || 0),
                    product_id: Number(_product.product_id || 0),
                    sku: _product.sku || '',
                    name: _product.name || '',
                    slug_name: String(removeUnicode(_product.name || '', true)).toLowerCase(),
                    slug: String(removeUnicode(_product.name || '', false)).replace(/\s/g, '-'),
                    supplier_id: _product.supplier_id || [],
                    category_id: _product.category_id || [],
                    tax_id: _product.tax_id || [],
                    warranties: _product.warranties || [],
                    length: _product.length || 0,
                    width: _product.width || 0,
                    height: _product.height || 0,
                    weight: _product.weight || 0,
                    unit: _product.unit || '',
                    brand: _product.brand || '',
                    origin_code: _product.origin_code || '',
                    status: _product.status || '',
                    description: _product.description || '',
                    tags: _product.tags || [],
                    files: _product.files || [],
                    sale_quantity: _product.sale_quantity,
                    create_date: _product.create_date,
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: _product.creator_id,
                    active: true,
                };
                req['_oldProducts'].push(_product);
                eProduct.attributes.map((eAttribute) => {
                    delete eAttribute._id;
                    delete eAttribute.business_id;
                    delete eAttribute.attribute_id;
                    delete eAttribute.product_id;
                    delete eAttribute.create_date;
                    delete eAttribute.last_update;
                    delete eAttribute.creator_id;
                    eAttribute.options = String(eAttribute.options).trim().toUpperCase();
                    if (_attributes[`${_product.product_id}-${eAttribute.option}`]) {
                        let _attribute = {
                            ..._attributes[`${_product.product_id}-${eAttribute.option}`],
                            ...eAttribute,
                        };
                        _attribute = {
                            business_id: Number(_attribute.business_id),
                            attribute_id: Number(_attribute.attribute_id),
                            product_id: Number(_product.product_id),
                            option: String(_attribute.option).toUpperCase(),
                            slug_option: String(removeUnicode(_attribute.option, true)).toLowerCase(),
                            values: (() => {
                                return _attribute.values.map((eValue) => {
                                    return String(eValue).toUpperCase();
                                });
                            })(),
                            slug_values: (() => {
                                return _attribute.values.map((eValue) => {
                                    return String(removeUnicode(eValue, true)).toLowerCase();
                                });
                            })(),
                            create_date: _attribute.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(_attribute.creator_id),
                            active: true,
                        };
                        req['_oldAttributes'].push(_attribute);
                    }
                    if (!_attributes[`${_product.product_id}-${eAttribute.option}`]) {
                        attribute_id++;
                        let _attribute = {
                            business_id: Number(req.user.user_id),
                            attribute_id: Number(attribute_id),
                            product_id: Number(_product.product_id),
                            option: String(eAttribute.option).toUpperCase(),
                            slug_option: String(removeUnicode(eAttribute.option, true)).toLowerCase(),
                            values: (() => {
                                return eAttribute.values.map((eValue) => {
                                    return String(eValue).toUpperCase();
                                });
                            })(),
                            slug_values: (() => {
                                return eAttribute.values.map((eValue) => {
                                    return String(removeUnicode(eValue, true)).toLowerCase();
                                });
                            })(),
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        };
                        req['_newAttributes'].push(_attribute);
                    }
                });
                eProduct.variants.map((eVariant) => {
                    delete eVariant._id;
                    delete eVariant.business_id;
                    delete eVariant.variant_id;
                    delete eVariant.product_id;
                    delete eVariant.create_date;
                    delete eVariant.last_update;
                    delete eVariant.creator_id;
                    if (_variants[`${_product.product_id}-${eVariant.sku}`]) {
                        let _variant = { ..._variants[`${_product.product_id}-${eVariant.sku}`], ...eVariant };
                        _variant = {
                            business_id: Number(_product.business_id),
                            variant_id: Number(_variant.variant_id),
                            product_id: Number(_product.product_id),
                            title: _variant.title || '',
                            slug_title: String(removeUnicode(_variant.title || '', true)).toLowerCase(),
                            sku: _variant.sku || '',
                            image: _variant.image || [],
                            options: _variant.options || [],
                            ...(() => {
                                if (_variant.options && _variant.options > 0) {
                                    let options = {};
                                    for (let i = 0; i <= _variant.options; i++) {
                                        options[`option${i + 1}`] = _variant.options[i];
                                    }
                                    return options;
                                }
                                return {};
                            })(),
                            supplier: (() => {
                                if (_suppliers[eProduct.supplier_id] && _suppliers[eProduct.supplier_id].name) {
                                    return _suppliers[eProduct.supplier_id].name;
                                }
                                return '';
                            })(),
                            import_price_default: eVariant.import_price,
                            price: _variant.price,
                            bulk_price: Number(_variant.bulk_price || _variant.price),
                            bulk_quantity: Number(_variant.bulk_quantity || 1),
                            create_date: _variant.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(_variant.creator_id),
                            active: true,
                        };
                        if (eVariant.import_price) {
                            price_id++;
                            let _price = {
                                business_id: Number(req.user.business_id),
                                price_id: Number(price_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                import_price: Number(eVariant.import_price),
                                create_date: moment().tz(TIMEZONE).format(),
                                last_update: moment().tz(TIMEZONE).format(),
                                creator_id: Number(req.user.user_id),
                                active: true,
                            };
                            req['_newPrices'].push(_price);
                        }
                        req['_oldVariants'].push(_variant);
                    }
                    if (!_variants[`${_product.product_id}-${eVariant.sku}`]) {
                        variant_id++;
                        let _variant = {
                            business_id: Number(req.user.business_id),
                            variant_id: Number(variant_id),
                            product_id: Number(_product.product_id),
                            title: eVariant.title || '',
                            slug_title: String(removeUnicode(eVariant.title || '', true)).toLowerCase(),
                            sku: eVariant.sku || '',
                            image: eVariant.image || [],
                            options: eVariant.options || [],
                            ...(() => {
                                if (eVariant.options && eVariant.options > 0) {
                                    let options = {};
                                    for (let i = 0; i <= eVariant.options; i++) {
                                        options[`option${i + 1}`] = eVariant.options[i];
                                    }
                                    return options;
                                }
                                return {};
                            })(),
                            supplier: (() => {
                                if (_suppliers[_product.supplier_id] && _suppliers[_product.supplier_id].name) {
                                    return _suppliers[_product.supplier_id].name;
                                }
                                return '';
                            })(),
                            import_price_default: eVariant.import_price,
                            price: eVariant.price,
                            bulk_price: Number(eVariant.bulk_price || eVariant.price),
                            bulk_quantity: Number(eVariant.bulk_quantity || 1),
                            create_date: eVariant.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(eVariant.creator_id),
                            active: true,
                        };
                        if (eVariant.import_price) {
                            price_id++;
                            let _price = {
                                business_id: Number(req.user.business_id),
                                price_id: Number(price_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                import_price: Number(eVariant.import_price),
                                create_date: moment().tz(TIMEZONE).format(),
                                last_update: moment().tz(TIMEZONE).format(),
                                creator_id: Number(req.user.user_id),
                                active: true,
                            };
                            req['_newPrices'].push(_price);
                        }
                        eVariant = _variant;
                        req['_newVariants'].push(_variant);
                    }
                });
            }
            if (!_products[eProduct.sku]) {
                product_id++;
                let _product = {
                    business_id: Number(req.user.business_id || 0),
                    product_id: Number(product_id || 0),
                    sku: eProduct.sku || '',
                    name: eProduct.name || '',
                    slug_name: String(removeUnicode(eProduct.name || '', true)).toLowerCase(),
                    slug: String(removeUnicode(eProduct.slug || '', false)).replace(/\s/g, '-'),
                    supplier_id: eProduct.supplier_id || [],
                    category_id: eProduct.category_id || [],
                    tax_id: eProduct.tax_id || [],
                    warranties: eProduct.warranties || [],
                    length: eProduct.length || 0,
                    width: eProduct.width || 0,
                    height: eProduct.height || 0,
                    weight: eProduct.weight || 0,
                    unit: eProduct.unit || '',
                    origin_code: eProduct.origin_code || '',
                    description: eProduct.description || '',
                    tags: eProduct.tags || [],
                    files: eProduct.files || [],
                    sale_quantity: eProduct.sale_quantity || 0,
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
                req['_newProducts'].push(_product);
                eProduct.attributes.map((eAttribute) => {
                    attribute_id++;
                    let _attribute = {
                        business_id: Number(req.user.user_id),
                        attribute_id: Number(attribute_id),
                        product_id: Number(_product.product_id),
                        option: String(eAttribute.option).toUpperCase(),
                        slug_option: String(removeUnicode(eAttribute.option, true)).toLowerCase(),
                        values: (() => {
                            return eAttribute.values.map((eValue) => {
                                return String(eValue).toUpperCase();
                            });
                        })(),
                        slug_values: (() => {
                            return eAttribute.values.map((eValue) => {
                                return String(removeUnicode(eValue, true)).toLowerCase();
                            });
                        })(),
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    req['_newAttributes'].push(_attribute);
                });
                eProduct.variants.map((eVariant) => {
                    variant_id++;
                    let _variant = {
                        business_id: Number(req.user.business_id),
                        variant_id: Number(variant_id),
                        product_id: Number(_product.product_id),
                        title: eVariant.title || '',
                        slug_title: String(removeUnicode(eVariant.title || '', true)).toLowerCase(),
                        sku: eVariant.sku || '',
                        image: eVariant.image || [],
                        options: eVariant.options || [],
                        ...(() => {
                            if (eVariant.options && eVariant.options > 0) {
                                let options = {};
                                for (let i = 0; i <= eVariant.options; i++) {
                                    options[`option${i + 1}`] = eVariant.options[i];
                                }
                                return options;
                            }
                            return {};
                        })(),
                        supplier: (() => {
                            if (_suppliers[eProduct.supplier_id] && _suppliers[eProduct.supplier_id].name) {
                                return _suppliers[eProduct.supplier_id].name;
                            }
                            return '';
                        })(),
                        import_price_default: eVariant.import_price,
                        price: eVariant.price,
                        bulk_price: Number(eVariant.bulk_price || eVariant.price),
                        bulk_quantity: Number(eVariant.bulk_quantity || 1),
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    if (eVariant.import_price) {
                        price_id++;
                        let _price = {
                            business_id: Number(req.user.business_id),
                            price_id: Number(price_id),
                            product_id: Number(_product.product_id),
                            variant_id: Number(_variant.variant_id),
                            import_price: Number(eVariant.import_price),
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        };
                        req['_newPrices'].push(_price);
                    }
                    req['_newVariants'].push(_variant);
                });
            }
        });
        await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Products' }, { $set: { name: 'Products', value: product_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne(
                    { name: 'Attributes' },
                    { $set: { name: 'Attributes', value: attribute_id } },
                    { upsert: true }
                ),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Variants' }, { $set: { name: 'Variants', value: variant_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
        ]);
        await productService.addProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.updateProductC = async (req, res, next) => {
    try {
        let tmp = req.body;
        req.body.products = [tmp];
        let supplierIds = [];
        let productSkus = [];
        req.body.products.map((product) => {
            if (product.supplier_id) {
                supplierIds.push(Number(product.supplier_id));
            }
            if (product.sku) {
                productSkus.push(
                    String(product.sku || '')
                        .trim()
                        .toUpperCase()
                );
            }
        });
        let [suppliers, products] = await Promise.all([
            client
                .db(DB)
                .collection('Suppliers')
                .find({ supplier_id: { $in: supplierIds } })
                .toArray(),
            client
                .db(DB)
                .collection(`Products`)
                .find({
                    business_id: Number(req.user.business_id),
                    sku: { $in: productSkus },
                })
                .toArray(),
        ]);
        let _suppliers = {};
        suppliers.map((eSupplier) => {
            _suppliers[String(eSupplier.supplier_id)] = eSupplier;
        });
        let _products = {};
        products.map((eProduct) => {
            _products[String(eProduct.sku)] = eProduct;
        });
        let productIds = [];
        products.map((eProduct) => {
            productIds.push(Number(eProduct.product_id));
        });
        let [attributes, variants] = await Promise.all([
            client
                .db(DB)
                .collection(`Attributes`)
                .find({
                    product_id: { $in: productIds },
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Variants`)
                .find({
                    product_id: { $in: productIds },
                })
                .toArray(),
        ]);
        let _attributes = {};
        attributes.map((eAttribute) => {
            _attributes[`${eAttribute.product_id}-${eAttribute.option}`] = eAttribute;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[`${eVariant.product_id}-${eVariant.sku}`] = eVariant;
        });

        let [product_id, attribute_id, variant_id, price_id] = await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Products' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Attributes' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            await client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Variants' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
            await client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Prices' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                })
                .catch((err) => {
                    throw new Error(`500: ${err}`);
                }),
        ]);

        req['_newProducts'] = [];
        req['_newAttributes'] = [];
        req['_newVariants'] = [];
        req['_newPrices'] = [];
        req['_oldProducts'] = [];
        req['_oldAttributes'] = [];
        req['_oldVariants'] = [];
        req.body.products.map((eProduct) => {
            delete eProduct._id;
            delete eProduct.business_id;
            delete eProduct.product_id;
            delete eProduct.create_date;
            delete eProduct.last_update;
            delete eProduct.creator_id;
            if (_products[eProduct.sku]) {
                let _product = { ..._products[eProduct.sku], ...eProduct };
                _product = {
                    business_id: Number(_product.business_id || 0),
                    product_id: Number(_product.product_id || 0),
                    sku: _product.sku || '',
                    name: _product.name || '',
                    slug_name: String(removeUnicode(_product.name || '', true)).toLowerCase(),
                    slug: String(removeUnicode(_product.name || '', false)).replace(/\s/g, '-'),
                    supplier_id: _product.supplier_id || [],
                    category_id: _product.category_id || [],
                    tax_id: _product.tax_id || [],
                    warranties: _product.warranties || [],
                    length: _product.length || 0,
                    width: _product.width || 0,
                    height: _product.height || 0,
                    weight: _product.weight || 0,
                    unit: _product.unit || '',
                    brand: _product.brand || '',
                    origin_code: _product.origin_code || '',
                    status: _product.status || '',
                    description: _product.description || '',
                    tags: _product.tags || [],
                    files: _product.files || [],
                    sale_quantity: _product.sale_quantity,
                    create_date: _product.create_date,
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: _product.creator_id,
                    active: true,
                };
                req['_oldProducts'].push(_product);
                eProduct.attributes.map((eAttribute) => {
                    delete eAttribute._id;
                    delete eAttribute.business_id;
                    delete eAttribute.attribute_id;
                    delete eAttribute.product_id;
                    delete eAttribute.create_date;
                    delete eAttribute.last_update;
                    delete eAttribute.creator_id;
                    eAttribute.options = String(eAttribute.options).trim().toUpperCase();
                    if (_attributes[`${_product.product_id}-${eAttribute.option}`]) {
                        let _attribute = {
                            ..._attributes[`${_product.product_id}-${eAttribute.option}`],
                            ...eAttribute,
                        };
                        _attribute = {
                            business_id: Number(_attribute.business_id),
                            attribute_id: Number(_attribute.attribute_id),
                            product_id: Number(_product.product_id),
                            option: String(_attribute.option).toUpperCase(),
                            slug_option: String(removeUnicode(_attribute.option, true)).toLowerCase(),
                            values: (() => {
                                return _attribute.values.map((eValue) => {
                                    return String(eValue).toUpperCase();
                                });
                            })(),
                            slug_values: (() => {
                                return _attribute.values.map((eValue) => {
                                    return String(removeUnicode(eValue, true)).toLowerCase();
                                });
                            })(),
                            create_date: _attribute.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(_attribute.creator_id),
                            active: true,
                        };
                        req['_oldAttributes'].push(_attribute);
                    }
                    if (!_attributes[`${_product.product_id}-${eAttribute.option}`]) {
                        attribute_id++;
                        let _attribute = {
                            business_id: Number(req.user.user_id),
                            attribute_id: Number(attribute_id),
                            product_id: Number(_product.product_id),
                            option: String(eAttribute.option).toUpperCase(),
                            slug_option: String(removeUnicode(eAttribute.option, true)).toLowerCase(),
                            values: (() => {
                                return eAttribute.values.map((eValue) => {
                                    return String(eValue).toUpperCase();
                                });
                            })(),
                            slug_values: (() => {
                                return eAttribute.values.map((eValue) => {
                                    return String(removeUnicode(eValue, true)).toLowerCase();
                                });
                            })(),
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        };
                        req['_newAttributes'].push(_attribute);
                    }
                });
                eProduct.variants.map((eVariant) => {
                    delete eVariant._id;
                    delete eVariant.business_id;
                    delete eVariant.variant_id;
                    delete eVariant.product_id;
                    delete eVariant.create_date;
                    delete eVariant.last_update;
                    delete eVariant.creator_id;
                    if (_variants[`${_product.product_id}-${eVariant.sku}`]) {
                        let _variant = { ..._variants[`${_product.product_id}-${eVariant.sku}`], ...eVariant };
                        _variant = {
                            business_id: Number(_product.business_id),
                            variant_id: Number(_variant.variant_id),
                            product_id: Number(_product.product_id),
                            title: _variant.title || '',
                            slug_title: String(removeUnicode(_variant.title || '', true)).toLowerCase(),
                            sku: _variant.sku || '',
                            image: _variant.image || [],
                            options: _variant.options || [],
                            ...(() => {
                                if (_variant.options && _variant.options > 0) {
                                    let options = {};
                                    for (let i = 0; i <= _variant.options; i++) {
                                        options[`option${i + 1}`] = _variant.options[i];
                                    }
                                    return options;
                                }
                                return {};
                            })(),
                            supplier: (() => {
                                if (_suppliers[eProduct.supplier_id] && _suppliers[eProduct.supplier_id].name) {
                                    return _suppliers[eProduct.supplier_id].name;
                                }
                                return '';
                            })(),
                            import_price_default: eVariant.import_price,
                            price: _variant.price,
                            bulk_price: Number(_variant.bulk_price || _variant.price),
                            bulk_quantity: Number(_variant.bulk_quantity || 1),
                            create_date: _variant.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(_variant.creator_id),
                            active: true,
                        };
                        if (eVariant.import_price) {
                            price_id++;
                            let _price = {
                                business_id: Number(req.user.business_id),
                                price_id: Number(price_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                import_price: Number(eVariant.import_price),
                                create_date: moment().tz(TIMEZONE).format(),
                                last_update: moment().tz(TIMEZONE).format(),
                                creator_id: Number(req.user.user_id),
                                active: true,
                            };
                            req['_newPrices'].push(_price);
                        }
                        req['_oldVariants'].push(_variant);
                    }
                    if (!_variants[`${_product.product_id}-${eVariant.sku}`]) {
                        variant_id++;
                        let _variant = {
                            business_id: Number(req.user.business_id),
                            variant_id: Number(variant_id),
                            product_id: Number(_product.product_id),
                            title: eVariant.title || '',
                            slug_title: String(removeUnicode(eVariant.title || '', true)).toLowerCase(),
                            sku: eVariant.sku || '',
                            image: eVariant.image || [],
                            options: eVariant.options || [],
                            ...(() => {
                                if (eVariant.options && eVariant.options > 0) {
                                    let options = {};
                                    for (let i = 0; i <= eVariant.options; i++) {
                                        options[`option${i + 1}`] = eVariant.options[i];
                                    }
                                    return options;
                                }
                                return {};
                            })(),
                            supplier: (() => {
                                if (_suppliers[_product.supplier_id] && _suppliers[_product.supplier_id].name) {
                                    return _suppliers[_product.supplier_id].name;
                                }
                                return '';
                            })(),
                            import_price_default: eVariant.import_price,
                            price: eVariant.price,
                            bulk_price: Number(eVariant.bulk_price || eVariant.price),
                            bulk_quantity: Number(eVariant.bulk_quantity || 1),
                            create_date: eVariant.create_date,
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(eVariant.creator_id),
                            active: true,
                        };
                        if (eVariant.import_price) {
                            price_id++;
                            let _price = {
                                business_id: Number(req.user.business_id),
                                price_id: Number(price_id),
                                product_id: Number(_product.product_id),
                                variant_id: Number(_variant.variant_id),
                                import_price: Number(eVariant.import_price),
                                create_date: moment().tz(TIMEZONE).format(),
                                last_update: moment().tz(TIMEZONE).format(),
                                creator_id: Number(req.user.user_id),
                                active: true,
                            };
                            req['_newPrices'].push(_price);
                        }
                        eVariant = _variant;
                        req['_newVariants'].push(_variant);
                    }
                });
            }
            if (!_products[eProduct.sku]) {
                product_id++;
                let _product = {
                    business_id: Number(req.user.business_id || 0),
                    product_id: Number(product_id || 0),
                    sku: eProduct.sku || '',
                    name: eProduct.name || '',
                    slug_name: String(removeUnicode(eProduct.name || '', true)).toLowerCase(),
                    slug: String(removeUnicode(eProduct.slug || '', false)).replace(/\s/g, '-'),
                    supplier_id: eProduct.supplier_id || [],
                    category_id: eProduct.category_id || [],
                    tax_id: eProduct.tax_id || [],
                    warranties: eProduct.warranties || [],
                    length: eProduct.length || 0,
                    width: eProduct.width || 0,
                    height: eProduct.height || 0,
                    weight: eProduct.weight || 0,
                    unit: eProduct.unit || '',
                    origin_code: eProduct.origin_code || '',
                    description: eProduct.description || '',
                    tags: eProduct.tags || [],
                    files: eProduct.files || [],
                    sale_quantity: eProduct.sale_quantity || 0,
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
                req['_newProducts'].push(_product);
                eProduct.attributes.map((eAttribute) => {
                    attribute_id++;
                    let _attribute = {
                        business_id: Number(req.user.user_id),
                        attribute_id: Number(attribute_id),
                        product_id: Number(_product.product_id),
                        option: String(eAttribute.option).toUpperCase(),
                        slug_option: String(removeUnicode(eAttribute.option, true)).toLowerCase(),
                        values: (() => {
                            return eAttribute.values.map((eValue) => {
                                return String(eValue).toUpperCase();
                            });
                        })(),
                        slug_values: (() => {
                            return eAttribute.values.map((eValue) => {
                                return String(removeUnicode(eValue, true)).toLowerCase();
                            });
                        })(),
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    req['_newAttributes'].push(_attribute);
                });
                eProduct.variants.map((eVariant) => {
                    variant_id++;
                    let _variant = {
                        business_id: Number(req.user.business_id),
                        variant_id: Number(variant_id),
                        product_id: Number(_product.product_id),
                        title: eVariant.title || '',
                        slug_title: String(removeUnicode(eVariant.title || '', true)).toLowerCase(),
                        sku: eVariant.sku || '',
                        image: eVariant.image || [],
                        options: eVariant.options || [],
                        ...(() => {
                            if (eVariant.options && eVariant.options > 0) {
                                let options = {};
                                for (let i = 0; i <= eVariant.options; i++) {
                                    options[`option${i + 1}`] = eVariant.options[i];
                                }
                                return options;
                            }
                            return {};
                        })(),
                        supplier: (() => {
                            if (_suppliers[eProduct.supplier_id] && _suppliers[eProduct.supplier_id].name) {
                                return _suppliers[eProduct.supplier_id].name;
                            }
                            return '';
                        })(),
                        import_price_default: eVariant.import_price,
                        price: eVariant.price,
                        bulk_price: Number(eVariant.bulk_price || eVariant.price),
                        bulk_quantity: Number(eVariant.bulk_quantity || 1),
                        create_date: moment().tz(TIMEZONE).format(),
                        last_update: moment().tz(TIMEZONE).format(),
                        creator_id: Number(req.user.user_id),
                        active: true,
                    };
                    if (eVariant.import_price) {
                        price_id++;
                        let _price = {
                            business_id: Number(req.user.business_id),
                            price_id: Number(price_id),
                            product_id: Number(_product.product_id),
                            variant_id: Number(_variant.variant_id),
                            import_price: Number(eVariant.import_price),
                            create_date: moment().tz(TIMEZONE).format(),
                            last_update: moment().tz(TIMEZONE).format(),
                            creator_id: Number(req.user.user_id),
                            active: true,
                        };
                        req['_newPrices'].push(_price);
                    }
                    req['_newVariants'].push(_variant);
                });
            }
        });
        await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Products' }, { $set: { name: 'Products', value: product_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne(
                    { name: 'Attributes' },
                    { $set: { name: 'Attributes', value: attribute_id } },
                    { upsert: true }
                ),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Variants' }, { $set: { name: 'Variants', value: variant_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true }),
        ]);
        await productService.updateProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteProductC = async (req, res, next) => {
    try {
        req['_delete'] = req.query.product_id.split('---').map((id) => {
            return Number(id);
        });
        await productService.deleteProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.getAllAtttributeC = async (req, res, next) => {
    try {
        await productService.getAllAtttributeS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.getAllUnitProductC = async (req, res, next) => {
    try {
        await productService.getAllUnitProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.addFeedbackC = async (req, res, next) => {
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
            create_date: new Date(),
        });
        req['_insert'] = _feedback;
        await productService.addFeedbackS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteFeedbackC = async (req, res, next) => {
    try {
        let feedback_ids = req.query.feedback_id.split('---').map((id) => {
            return Number(id);
        });
        await client
            .db(DB)
            .collection('Feedbacks')
            .deleteMany({ feedback_id: { $in: feedback_ids } });
        res.send({ success: true, message: 'Xóa phản hồi thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports.importFileC = async (req, res, next) => {
    try {
        if (req.file == undefined) {
            throw new Error('400: Vui lòng truyền file!');
        }
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: true,
        });
        let rows = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        let productSkus = [];
        let variantSkus = [];
        let supplierNames = [];
        let categoryNames = [];
        rows = rows.map((eRow) => {
            let _product = {};
            for (let i in eRow) {
                _product[String(removeUnicode(i, true)).toLowerCase()] = eRow[i];
            }
            productSkus.push(eRow['masanpham']);
            variantSkus.push(eRow['maphienban']);
            eRow['nhacungcap'] = (eRow['nhacungcap'] || '').trim().toUpperCase();
            supplierNames.push(eRow['nhacungcap']);
            eRow['loaisanpham'] = (eRow['loaisanpham'] || '').trim().toUpperCase();
            if (eRow['loaisanpham']) {
                eRow['loaisanpham'] = eRow['loaisanpham'].split(',');
            }
            supplierNames.push(eRow['loaisanpham']);
            return _product;
        });
        let [products, variants, suppliers, categories] = await Promise.all([
            client
                .db(DB)
                .collection('Products')
                .find({ bussiness_id: req.user.user_id, sku: { $in: productSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Variants')
                .find({ bussiness_id: req.user.user_id, sku: { $in: variantSkus } })
                .toArray(),
            client
                .db(DB)
                .collection('Suppliers')
                .find({ bussiness_id: req.user.user_id, name: { $in: supplierNames } })
                .toArray(),
            client
                .db(DB)
                .collection('Categories')
                .find({ bussiness_id: req.user.user_id, name: { $in: categoryNames } })
                .toArray(),
        ]);
        let _products = {};
        products.map((eProduct) => {
            _products[eProduct.sku] = eProduct;
        });
        let _variants = {};
        variants.map((eVariant) => {
            _variants[eVariant.sku] = eVariant;
        });
        let _categories = {};
        categories.map((eCategory) => {
            _categories[eCategory.sku] = eCategory;
        });
        let _suppliers = {};
        suppliers.map((eSuppliers) => {
            _suppliers[eSuppliers.sku] = eSuppliers;
        });
        let [product_id, variant_id] = await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Products' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                }),
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Variants' })
                .then((doc) => {
                    if (doc && doc.value) {
                        return doc.value;
                    }
                    return 0;
                }),
        ]);
        rows.map((eRow) => {
            if (!_products[eRow['masanpham']]) {
                product_id++;
                let _product = {
                    business_id: Number(req.user.business_id || 0),
                    product_id: Number(product_id || 0),
                    sku: eRow['masanpham'],
                    name: eRow['tensanpham'],
                    slug_name: String(removeUnicode(eRow['tensanpham'] || '', true)).toLowerCase(),
                    slug: String(removeUnicode(eRow['tensanpham'] || '', false)).replace(/\s/g, '-'),
                    supplier_id: eProduct.supplier_id || [],
                    category_id: eProduct.category_id || [],
                    tax_id: eProduct.tax_id || [],
                    warranties: eProduct.warranties || [],
                    length: eProduct.length || 0,
                    width: eProduct.width || 0,
                    height: eProduct.height || 0,
                    weight: eProduct.weight || 0,
                    unit: eProduct.unit || '',
                    origin_code: eProduct.origin_code || '',
                    description: eProduct.description || '',
                    tags: eProduct.tags || [],
                    files: eProduct.files || [],
                    sale_quantity: eProduct.sale_quantity || 0,
                    create_date: moment().tz(TIMEZONE).format(),
                    last_update: moment().tz(TIMEZONE).format(),
                    creator_id: Number(req.user.user_id),
                    active: true,
                };
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports.AddUnitProductC = async (req, res, next) => {
    try {
        if (req.body.pcs == undefined || req.body.name == undefined || req.body.price == undefined) {
            return res.send({ success: false, mess: 'pcs or name invalid !!!' });
        }

        req.body.creator_id = req.user.user_id;
        req.body.created_date = moment().tz(timezone).format();
        req.body.updated_date = moment().tz(timezone).format();

        let app = await client.db(DB).collection('AppSetting').findOne({ name: 'Unit' });

        req.body.unit_product_id = parseInt(app.value) + 1;
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Unit' },
                {
                    $set: {
                        value: req.body.unit_product_id,
                    },
                }
            );

        await productService.AddUnitProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};
