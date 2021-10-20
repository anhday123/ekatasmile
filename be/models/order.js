const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let orderForm = {
    order_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    sale_location: { data_type: ['object'], not_null: true },
    employee_id: { data_type: ['string', 'object'], not_null: true },
    customer_id: { data_type: ['string', 'object'], not_null: true },
    order_details: { data_type: ['array'], not_null: true },
    payments: { data_type: ['array'], not_null: true },
    shipping_company_id: { data_type: ['string', 'object'], not_null: false },
    shipping_info: { data_type: ['object'], not_null: false },
    voucher: { data_type: ['string'], not_null: false },
    promotion: { data_type: ['object'], not_null: false },
    total_cost: { data_type: ['number'], not_null: true },
    total_tax: { data_type: ['number'], not_null: true },
    total_discount: { data_type: ['number'], not_null: true },
    final_cost: { data_type: ['number'], not_null: true },
    customer_paid: { data_type: ['number'], not_null: true },
    customer_debt: { data_type: ['boolean'], not_null: false },
    customer_debt_value: { data_type: ['number'], not_null: false },
    bill_status: { data_type: ['string'], not_null: true },
    ship_status: { data_type: ['string'], not_null: true },
    note: { data_type: ['string'], not_null: false },
    tags: { data_type: ['array'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
};

class Order {
    validateInput(data) {
        validate(data, orderForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.order_id = ObjectId(data.order_id);
        this.business_id = ObjectId(data.business_id);
        this.sale_location = data.sale_location;
        if (this.sale_location) {
            if (this.sale_location.store_id) {
                this.sale_location.store_id = ObjectId(this.sale_location.store_id);
            }
            if (this.sale_location.branch_id) {
                this.sale_location.branch_id = ObjectId(this.sale_location.branch_id);
            }
        }
        this.employee_id = ObjectId(data.employee_id);
        this.customer_id = ObjectId(data.customer_id);
        this.order_details = data.order_details || [];
        this.payments = data.payments || [];
        this.shipping_company_id =
            data.shipping_company_id && data.shipping_company_id != ''
                ? ObjectId(data.shipping_company_id)
                : data.shipping_company_id;
        this.shipping_info = data.shipping_info || '';
        this.voucher = data.voucher || '';
        this.promotion = data.promotion || {};
        this.total_cost = data.total_cost || 0;
        this.total_tax = data.total_tax || 0;
        this.total_discount = data.total_discount || 0;
        this.final_cost = data.final_cost || 0;
        this.customer_paid = data.customer_paid;
        this.customer_debt = data.customer_debt || false;
        this.customer_debt_value = data.customer_debt_value || 0;
        this.bill_status = data.bill_status;
        this.ship_status = data.ship_status;
        this.note = data.note;
        this.tags = data.tags;
        this.create_date = data.create_date;
    }
    update(data) {
        delete data._id;
        delete data.order_id;
        delete data.business_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

let orderDetailForm = {
    product_id: { data_type: ['string', 'object'], not_null: false },
    variant_id: { data_type: ['string', 'object'], not_null: false },
    variants: { data_type: ['array'], not_null: false },
    properties: { data_type: ['array'], not_null: false },
    images: { data_type: ['array'], not_null: false },
    length: { data_type: ['number'], not_null: false },
    width: { data_type: ['number'], not_null: false },
    height: { data_type: ['number'], not_null: false },
    weight: { data_type: ['number'], not_null: false },
    import_price: { data_type: ['number'], not_null: false },
    base_price: { data_type: ['number'], not_null: false },
    sale_price: { data_type: ['number'], not_null: false },
    quantity: { data_type: ['number'], not_null: false },
    total: { data_type: ['number'], not_null: false },
    taxable: { data_type: ['boolean'], not_null: false },
    tax_amount: { data_type: ['number'], not_null: false },
    discount: { data_type: ['number'], not_null: false },
    cost: { data_type: ['number'], not_null: false },
    fulfillment_service: { data_type: ['string'], not_null: false },
    fulfillment_id: { data_type: ['string'], not_null: false },
    fulfillment_status: { data_type: ['string'], not_null: false },
    fulfillable_quantity: { data_type: ['number'], not_null: false },
    requires_shipping: { data_type: ['boolean'], not_null: false },
    supplier: { data_type: ['string'], not_null: false },
    tracking_number: { data_type: ['string'], not_null: false },
    gift_card: { data_type: ['boolean'], not_null: false },
    carrier: { data_type: ['string'], not_null: false },
    status: { data_type: ['string'], not_null: false },
};

class OrderDetail {
    validateInput(data) {
        validate(data, orderDetailForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.product_id = ObjectId(data.product_id);
        this.variant_id = ObjectId(data.variant_id);
        this.variants = data.variants;
        this.properties = data.properties;
        this.images = data.images;
        this.length = data.length || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.payments = data.payments || [];
        this.import_price = data.import_price || 0;
        this.base_price = data.base_price || 0;
        this.sale_price = data.sale_price || 0;
        this.quantity = data.quantity || 0;
        this.total = data.total || 0;
        this.taxable = data.taxable || true;
        this.tax_amount = data.tax_amount || 0;
        this.discount = data.discount || 0;
        this.cost = data.cost || 0;
        this.fulfillment_service = data.fulfillment_service;
        this.fulfillment_id = data.fulfillment_id;
        this.fulfillment_status = data.fulfillment_status;
        this.fulfillable_quantity = data.fulfillable_quantity;
        this.requires_shipping = data.requires_shipping;
        this.supplier = data.supplier;
        this.tracking_number = data.tracking_number;
        this.gift_card = data.gift_card;
        this.carrier = data.carrier;
        this.status = data.status;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Order, OrderDetail };
