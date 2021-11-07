const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const productService = require(`../services/product`);
const { Product, Attribute, Variant, Location } = require('../models/product');

let getProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await productService.getProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!req.body.products) {
            throw new Error('400: products không được để trống!');
        }
        let _skuProducts = [];
        let _skuVariants = [];
        req.body.products.map((product) => {
            _skuProducts.push(product.sku);
            product.variants.map((variant) => {
                _skuVariants.push(variant.sku);
            });
        });
        let [business, branchs, stores, skuProducts, skuVariants] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Branchs`)
                .find({
                    business_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Stores`)
                .find({
                    business_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                })
                .toArray(),
            client
                .db(DB)
                .collection(`_Products`)
                .find({
                    business_id: ObjectId(token.business_id),
                    sku: { $in: _skuProducts },
                    delete: false,
                    active: true,
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Variants`)
                .find({
                    business_id: ObjectId(token.business_id),
                    sku: { $in: _skuVariants },
                    delete: false,
                    active: true,
                })
                .toArray(),
        ]);
        if (!business) {
            throw new Error(`400: business_id <${token.business_id}> không khả dụng!`);
        }
        let _branchs = {};
        branchs.map((branch) => {
            _branchs[branch.branch_id] = branch;
        });
        let _stores = {};
        stores.map((store) => {
            _stores[store.store_id] = store;
        });
        let _products = {};
        skuProducts.map((product) => {
            _products[product.sku] = product;
        });
        let _variants = {};
        skuVariants.map((variant) => {
            _variants[variant.sku] = variant;
        });
        let products = [];
        let attributes = [];
        let variants = [];
        let locations = [];
        req.body.products.map((product) => {
            let _product = new Product();
            _product.validateInput(product);
            let productId = _products[product.sku] ? ObjectId(_products[product.sku].product_id) : ObjectId();
            if (_products[product.sku]) {
                _product.create(_products[product.sku]);
            } else {
                _product.create({
                    ...product,
                    ...{
                        business_id: token.business_id,
                        product_id: productId,
                        create_date: moment().utc().format(),
                        creator_id: token.user_id,
                        delete: false,
                        active: true,
                    },
                });
            }
            products.push(_product);
            product.attributes.map((attribute) => {
                let _attribute = new Attribute();
                _attribute.validateInput(attribute);
                let attributeId = ObjectId();
                _attribute.create({
                    ...attribute,
                    ...{
                        business_id: ObjectId(token.business_id),
                        product_id: productId,
                        attribute_id: attributeId,
                    },
                });
                if (_products[product.sku]) {
                    delete _attribute.attribute_id;
                }
                attributes.push(_attribute);
            });
            product.variants.map((variant) => {
                let _variant = new Variant();
                _variant.validateInput(variant);
                let variantId = _variants[variant.sku]
                    ? ObjectId(_variants[variant.sku].variant_id)
                    : ObjectId();
                _variant.create({
                    ...variant,
                    ...{
                        business_id: token.business_id,
                        product_id: productId,
                        variant_id: variantId,
                        create_date: moment().utc().format(),
                        creator_id: token.user_id,
                        delete: false,
                        active: true,
                    },
                });
                variants.push(_variant);
                variant.locations.map((location) => {
                    let _location = new Location();
                    _location.validateInput(location);
                    location.type = location.type.trim().toUpperCase();
                    if (location.type == 'BRANCH') {
                        if (!_branchs[location.inventory_id]) {
                            throw new Error(`400: branch_id <${location.inventory_id}> không khả dụng!`);
                        } else {
                            location['name'] = _branchs[location.inventory_id].name;
                        }
                    } else {
                        if (!_stores[location.inventory_id]) {
                            throw new Error(`400: store_id <${location.inventory_id}> không khả dụng!`);
                        } else {
                            location['name'] = _stores[location.inventory_id].name;
                        }
                    }
                    let locationId = ObjectId();
                    _location.create({
                        ...location,
                        ...{
                            business_id: token.business_id,
                            product_id: productId,
                            variant_id: variantId,
                            location_id: locationId,
                            create_date: moment().utc().format(),
                            creator_id: token.user_id,
                            delete: false,
                            active: true,
                        },
                    });
                    locations.push(_location);
                });
            });
        });
        req[`_insert`] = {
            _products: products,
            _attributes: attributes,
            _variants: variants,
            _locations: locations,
        };
        await productService.addProductS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.product_id = ObjectId(req.params.product_id);
        req[`_update`] = {};
        let product = await client.db(DB).collection('Products').findOne(req.params);
        let _product = new Product();
        _product.create(product);
        _product.update(req.body);
        req._update._product = _product;
        if (req.body.attributes) {
            req._update['_attributes'] = [];
            req.body.attributes.map((attribute) => {
                let _attribute = new Attribute();
                let attributeInfo = (() => {
                    if (attribute.attribute_id) {
                        return {
                            business_id: ObjectId(attribute.business_id),
                            product_id: ObjectId(attribute.product_id),
                            attribute_id: ObjectId(attribute.attribute_id),
                        };
                    }
                    return {
                        business_id: ObjectId(_product.business_id),
                        product_id: ObjectId(_product.product_id),
                        attribute_id: ObjectId(),
                    };
                })();
                _attribute.create({ ...attribute, ...attributeInfo });
                req._update._attributes.push(_attribute);
            });
        }
        if (req.body.variants) {
            req._update['_variants'] = [];
            req.body.variants.map((variant) => {
                let _variant = new Variant();
                let variantInfo = (() => {
                    if (variant.variant_id) {
                        return {
                            business_id: ObjectId(variant.business_id),
                            product_id: ObjectId(variant.product_id),
                            variant_id: ObjectId(),
                        };
                    }
                    return {
                        business_id: ObjectId(_product.business_id),
                        product_id: ObjectId(_product.product_id),
                        variant_id: ObjectId(),
                    };
                })();
                _variant.create({ ...variant, ...variantInfo });
                req._update._variants.push(_variant);
                if (variant.locations) {
                    req._update['_locations'] = [];
                    variant.locations.map((location) => {
                        let _location = new Location();
                        let locationInfo = (() => {
                            if (location.location_id) {
                                return {
                                    business_id: ObjectId(location.business_id),
                                    product_id: ObjectId(location.product_id),
                                    variant_id: ObjectId(_variant.variant_id),
                                    location_id: ObjectId(),
                                };
                            }
                            return {
                                business_id: ObjectId(_product.business_id),
                                product_id: ObjectId(_product.product_id),
                                variant_id: ObjectId(_variant.variant_id),
                                location_id: ObjectId(),
                            };
                        })();
                        _location.create({ ...location, ...locationInfo });
                        req._update._locations.push(_location);
                    });
                }
            });
        }
        await productService.updateProductS(req, res, next);
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

module.exports = {
    getProductC,
    addProductC,
    updateProductC,
    getAllAtttributeC,
};
