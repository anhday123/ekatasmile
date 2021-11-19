const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let productForm = ['sku', 'name'];

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
        this.category_id = data.category_id || [];
        this.deal_id = data.deal_id || [];
        this.waranties = data.waranties || [];
        this.tax_id = data.tax_id || [];
        this.sub_products = data.sub_products || [];
        this.length = data.length || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.unit = data.unit || '';
        this.origin_code = data.origin_code || '';
        this.description = data.description || '';
        this.files = data.files || [];
        this.sale_amount = data.sale_amount || 0;
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
        this.sub_option = removeUnicode(this.option, true).toLowerCase();
        this.sub_values = this.values.map((value) => {
            return removeUnicode(value, true).toLowerCase();
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
        this.options = data.options || [];
        if (data.options && data.options.length > 0) {
            for (let i = 0; i < data.options.length; i++) {
                this[`option${i + 1}`] = data.options[i];
            }
        }
        this.supplier = String(data.supplier).trim().toUpperCase();
        this.import_price = Number(data.import_price || 0);
        this.base_price = Number(data.base_price || 0);
        this.price = Number(data.price || 0);
        this.regular_price = Number(data.regular_price) || 0;
        this.bulk_price = Number(data.bulk_price) || 0;
        this.bulk_condition = Number(data.bulk_condition) || 0;
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let locationForm = ['inventory_id', 'type', 'quantity'];

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

let feedbackForm = ['product_id', 'user_id', 'rate', 'content'];

class Feedback {
    validateInput(data) {
        softValidate(data, feedbackForm, 400);
    }
    create(data) {
        this.feedback_id = Number(data.feedback_id);
        this.product_id = Number(data.product_id);
        this.user_id = Number(data.user_id);
        this.rate = Number(data.rate);
        this.content = String(data.content);
        this.files = data.files;
        this.create_date = new Date(data.create_date);
    }
}

module.exports = { Product, Attribute, Variant, Location, Feedback };
