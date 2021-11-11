const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let productForm = [
    'sku',
    'barcode',
    'name',
    'warranties',
    'taxes',
    'sub_product',
    'brand',
    'length',
    'width',
    'height',
    'weight',
    'unit',
    'description',
];

class Product {
    validateInput(data) {
        softValidate(data, productForm, 400);
    }
    create(data) {
        this.product_id = Number(data.product_id);
        this.business_id = Number(data.business_id);
        this.sku = String(data.sku);
        this.name = String(data.name).trim().toUpperCase();
        this.slug = removeUnicode(this.name, false).toLowerCase().split(' ').join('-');
        this.supplier_id = Number(data.supplier_id);
        this.category_id = Number(data.category_id);
        this.waranties = data.waranties || [];
        this.taxes = data.taxes || [];
        this.sub_products = data.sub_products || [];
        this.length = data.length || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.unit = data.unit || '';
        this.description = data.description || '';
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let attributeForm = ['option', 'values'];

class Attribute {
    validateInput(data) {
        softValidate(data, attributeForm, 400);
    }
    create(data) {
        this.attribute_id = Number(data.attribute_id);
        this.business_id = Number(data.business_id);
        this.product_id = Number(data.product_id);
        this.option = String(data.option).trim().toUpperCase();
        this.values = data.values.map((value) => {
            return String(value).trim().toUpperCase();
        });
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let variantForm = ['sku', 'title', 'options'];

class Variant {
    validateInput(data) {
        softValidate(data, variantForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.product_id = Number(data.product_id);
        this.variant_id = Number(data.variant_id);
        this.title = String(data.title).trim().toUpperCase();
        this.sku = String(data.sku).trim().toUpperCase();
        this.image = data.image;
        this.options = String(data.options);
        if (data.options && data.options.length > 0) {
            for (let i = 0; i < data.options.length; i++) {
                this[`option${i + 1}`] = data.options[i];
            }
        }
        this.supplier = String(data.supplier).trim().toUpperCase();
        this.import_price = Number(data.import_price || 0);
        this.base_price = Number(data.base_price || 0);
        this.sale_price = Number(data.sale_price || 0);
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let locationForm = ['inventory_id', 'type', 'name', 'quantity'];

class Location {
    validateInput(data) {
        softValidate(data, locationForm, 400);
    }
    create(data) {
        this.location_id = Number(data.location_id);
        this.business_id = Number(data.business_id);
        this.product_id = Number(data.product_id);
        this.variant_id = Number(data.variant_id);
        this.inventory_id = Number(data.inventory_id);
        this.type = String(data.type).trim().toUpperCase();
        this.name = String(data.name).trim().toUpperCase();
        this.quantity = Number(data.quantity);
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Product, Attribute, Variant, Location };
