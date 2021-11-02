const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let productForm = {
    business_id: { data_type: ['string', 'object'], not_null: false },
    supplier_id: { data_type: ['string', 'object'], not_null: false },
    category_id: { data_type: ['string', 'object'], not_null: false },
    product_id: { data_type: ['string', 'object'], not_null: false },
    sku: { data_type: ['string'], not_null: true },
    barcode: { data_type: ['string'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    warranties: { data_type: ['array'], not_null: false },
    taxes: { data_type: ['array'], not_null: false },
    sub_product: { data_type: ['array'], not_null: false },
    brand: { data_type: ['string'], not_null: false },
    length: { data_type: ['number'], not_null: false },
    width: { data_type: ['number'], not_null: false },
    height: { data_type: ['number'], not_null: false },
    weight: { data_type: ['number'], not_null: false },
    unit: { data_type: ['string'], not_null: false },
    description: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Product {
    validateInput(data) {
        validate(data, productForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.supplier_id = data.supplier_id || '';
        this.category_id = (() => {
            if (data.category_id && data.category_id != '') {
                return ObjectId(data.category_id);
            }
            return data.category_id;
        })();
        this.product_id = ObjectId(data.product_id);
        this.sku = data.sku;
        this.name = data.name.trim().toUpperCase();
        this.slug = removeUnicode(this.name, false).toLowerCase().split(' ').join('-');
        this.waranties = data.waranties || [];
        this.taxes = data.taxes || [];
        this.sub_products = data.sub_products || [];
        this.length = data.length || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.unit = data.unit || '';
        this.description = data.description || '';
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let attributeForm = {
    business_id: { data_type: ['string', 'object'], not_null: false },
    product_id: { data_type: ['string', 'object'], not_null: false },
    attribute_id: { data_type: ['string', 'object'], not_null: false },
    option: { data_type: ['string'], not_null: true },
    values: { data_type: ['array'], not_null: true },
};

class Attribute {
    validateInput(data) {
        validate(data, attributeForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = data.business_id;
        this.product_id = data.product_id;
        this.attribute_id = data.attribute_id;
        this.option = data.option.trim().toUpperCase();
        this.values = data.values.map((value) => {
            if (typeof value != 'string') {
                throw new Error(`400: value <${value}> phải là chuỗi!`);
            }
            return value.trim().toUpperCase();
        });
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let variantForm = {
    business_id: { data_type: ['string', 'object'], not_null: false },
    product_id: { data_type: ['string', 'object'], not_null: false },
    variant_id: { data_type: ['string', 'object'], not_null: false },
    title: { data_type: ['string'], not_null: true },
    sku: { data_type: ['string'], not_null: true },
    image: { data_type: ['array'], not_null: false },
    options: { data_type: ['array'], not_null: false },
    supplier: { data_type: ['string'], not_null: false },
    import_price: { data_type: ['number'], not_null: false },
    base_price: { data_type: ['number'], not_null: false },
    sale_price: { data_type: ['number'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Variant {
    validateInput(data) {
        validate(data, variantForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.product_id = ObjectId(data.product_id);
        this.variant_id = ObjectId(data.variant_id);
        this.title = data.title.trim().toUpperCase();
        this.sku = data.sku.trim().toUpperCase();
        this.image = data.image;
        this.options = data.options;
        if (data.options && data.options.length > 0) {
            for (let i = 0; i < data.options.length; i++) {
                this[`option${i + 1}`] = data.options[i];
            }
        }
        this.supplier = data.supplier.trim().toUpperCase();
        this.import_price = data.import_price;
        this.base_price = data.base_price;
        this.sale_price = data.sale_price;
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let locationForm = {
    business_id: { data_type: ['string', 'object'], not_null: false },
    product_id: { data_type: ['string', 'object'], not_null: false },
    variant_id: { data_type: ['string', 'object'], not_null: false },
    location_id: { data_type: ['string', 'object'], not_null: false },
    type: { data_type: ['string'], not_null: true },
    inventory_id: { data_type: ['string', 'object'], not_null: true },
    name: { data_type: ['string'], not_null: true },
    quantity: { data_type: ['number'], not_null: true },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Location {
    validateInput(data) {
        validate(data, locationForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.product_id = ObjectId(data.product_id);
        this.variant_id = ObjectId(data.variant_id);
        this.location_id = ObjectId(data.location_id);
        this.type = data.type.trim().toUpperCase();
        this.name = data.name.trim().toUpperCase();
        this.inventory_id = ObjectId(data.inventory_id);
        this.quantity = data.quantity;
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Product, Attribute, Variant, Location };
