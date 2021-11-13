const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let orderDetailForm = [
    'product_id',
    'variant_id',
    'variants',
    'properties',
    'images',
    'length',
    'width',
    'height',
    'weight',
    'import_price',
    'base_price',
    'sale_price',
    'quantity',
    'total_selling_price',
    'taxable',
    'tax_amount',
    'discount',
    'total_discount',
    'total_cost',
    'fulfillment_service',
    'fulfillment_id',
    'fulfillment_status',
    'fulfillable_quantity',
    'requires_shipping',
    'supplier',
    'tracking_number',
    'gift_card',
    'carrier',
    'status',
];

class OrderDetail {
    validateInput(data) {
        softValidate(data, orderDetailForm,  400);
    }
    create(data) {
        this.product_id = String(data.product_id);
        this.variant_id = String(data.variant_id);
        this.variants = data.variants || [];
        this.properties = data.properties || [];
        this.images = data.images || [];
        this.length = data.length || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;
        this.weight = data.weight || 0;
        this.import_price = data.import_price || 0;
        this.base_price = data.base_price || 0;
        this.sale_price = data.sale_price || 0;
        this.quantity = data.quantity || 0;
        this.total_selling_price = data.total_selling_price || 0;
        this.taxable = data.taxable || true;
        this.tax_amount = data.tax_amount || 0;
        this.discount = data.discount || 0;
        this.cost = data.cost || 0;
        this.fulfillment_service = data.fulfillment_service || '';
        this.fulfillment_id = data.fulfillment_id || '';
        this.fulfillment_status = data.fulfillment_status || '';
        this.fulfillable_quantity = data.fulfillable_quantity || 0;
        this.requires_shipping = data.requires_shipping || false;
        this.supplier = data.supplier || '';
        this.tracking_number = data.tracking_number || '';
        this.gift_card = data.gift_card || false;
        this.carrier = data.carrier || '';
        this.status = data.status || '';
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let orderForm = [
    'sale_location',
    'employee_id',
    'customer_id',
    'order_details',
    'payments',
    'shipping_company_id',
    'shipping_info',
    'voucher',
    'promotion',
    'total_cost',
    'total_tax',
    'total_discount',
    'final_cost',
    'customer_paid',
    'customer_debt',
    'bill_status',
    'ship_status',
    'note',
    'tags',
];

class Order {
    validateInput(data) {
        softValidate(data, orderForm, 400);
    }
    create(data) {
        this.order_id = String(data.order_id);
        this.business_id = String(data.business_id);
        this.sale_location = data.sale_location;
        if (this.sale_location) {
            if (this.sale_location.store_id) {
                this.sale_location.store_id = String(this.sale_location.store_id);
            }
            if (this.sale_location.branch_id) {
                this.sale_location.branch_id = String(this.sale_location.branch_id);
            }
        }
        this.employee_id = (() => {
            if (data.employee_id && data.employee_id != '') {
                return String(data.employee_id);
            }
            return data.employee_id;
        })();
        this.customer_id = (() => {
            if (data.customer_id && data.customer_id != '') {
                return String(data.customer_id);
            }
            return data.customer_id;
        })();
        this.order_details = data.order_details || [];
        this.payments = data.payments || [];
        this.shipping_company_id = (() => {
            if (data.shipping_company_id && data.shipping_company_id != '') {
                return String(data.shipping_company_id);
            }
            return data.shipping_company_id;
        })();
        this.shipping_info = data.shipping_info || '';
        this.voucher = data.voucher || '';
        this.promotion = data.promotion || {};
        this.total_cost = data.total_cost || 0;
        this.total_tax = data.total_tax || 0;
        this.total_discount = data.total_discount || 0;
        this.final_cost = data.final_cost || 0;
        this.customer_paid = data.customer_paid;
        this.customer_debt = data.customer_debt || 0;
        // DRAFT - PROCESSING - COMPLETE - CANCEL - REFUND
        this.bill_status = data.bill_status || 'DRAFT';
        // DRAFT - WATTING_FOR_SHIPPING - SHIPPING - COMPLETE - CANCEL
        this.ship_status = data.ship_status || 'WATTING_FOR_SHIPPING';
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

module.exports = { Order, OrderDetail };
