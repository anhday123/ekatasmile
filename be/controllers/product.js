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
                            _priceInDBs[`vId${_variant.variant_id}-min${price.min_quantity}-max${price.max_quantity}`]
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
            .updateOne({ name: 'Products' }, { $set: { name: 'Products', value: product_id } }, { upsert: true });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Attributes' }, { $set: { name: 'Attributes', value: attribute_id } }, { upsert: true });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Variants' }, { $set: { name: 'Variants', value: variant_id } }, { upsert: true });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Locations' }, { $set: { name: 'Locations', value: location_id } }, { upsert: true });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Prices' }, { $set: { name: 'Prices', value: price_id } }, { upsert: true });
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
                    price: product['Giá bán lẻ'],
                    bulk_price: product['Giá bán sỉ'],
                    bulk_quantity: product['Số lượng bán sỉ'],
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
                                                    if (_stores[`${product['Tên nơi nhập'].toUpperCase()}`].name) {
                                                        return _stores[`${product['Tên nơi nhập'].toUpperCase()}`]
                                                            .store_id;
                                                    }
                                                }
                                                if (_branchs[`${product['Tên nơi nhập'].toUpperCase()}`]) {
                                                    if (_branchs[`${product['Tên nơi nhập'].toUpperCase()}`].name) {
                                                        return _branchs[`${product['Tên nơi nhập'].toUpperCase()}`]
                                                            .branch_id;
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
                                                if (_stores[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]) {
                                                    if (_stores[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`].name) {
                                                        return _stores[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]
                                                            .store_id;
                                                    }
                                                }
                                                if (_branchs[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]) {
                                                    if (
                                                        _branchs[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`].name
                                                    ) {
                                                        return _branchs[`${product[`Tên nơi nhập_${i}`].toUpperCase()}`]
                                                            .branch_id;
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
