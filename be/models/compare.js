const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let sessionForm = {
    business_id: { data_type: ['string', 'object'], not_null: true },
    type: { data_type: ['string'], not_null: true },
    file: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: true },
    creator_id: { data_type: ['string', 'object'], not_null: true },
    delete: { data_type: ['boolean'], not_null: true },
    active: { data_type: ['boolean'], not_null: true },
};

class Session {
    validateInput(data) {
        softValidate(data, sessionForm, 400);
    }
    create(data) {
        this.business_id = ObjectId(data.business_id);
        this.type = data.type;
        this.file = data.file;
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        data = { ...this, ...data };
        return this.create(data);
    }
}

let compareForm = {
    business_id: { data_type: ['string', 'object'], not_null: true },
    session_id: { data_type: ['string', 'object'], not_null: true },
    order_id: { data_type: ['string', 'object'], not_null: true },
    shipping_company_id: { data_type: ['string', 'object'], not_null: true },
    shipping_code: { data_type: ['string'], not_null: true },
    customer_id: { data_type: ['string', 'object'], not_null: true },
    cod_cost: { data_type: ['number'], not_null: false },
    real_cod_cost: { data_type: ['number'], not_null: false },
    card_cost: { data_type: ['number'], not_null: false },
    shipping_cost: { data_type: ['number'], not_null: false },
    insurance_cost: { data_type: ['number'], not_null: false },
    delivery_cost: { data_type: ['number'], not_null: false },
    refun_cost: { data_type: ['number'], not_null: false },
    warehouse_cost: { data_type: ['number'], not_null: false },
    weight: { data_type: ['number'], not_null: false },
    revice_date: { data_type: ['string'], not_null: false },
    note: { data_type: ['string'], not_null: false },
    status: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: true },
    creator_id: { data_type: ['string', 'object'], not_null: true },
    delete: { data_type: ['boolean'], not_null: true },
    active: { data_type: ['boolean'], not_null: true },
};

class Compare {
    validateInput(data) {
        softValidate(data, compareForm, 400);
    }
    create(data) {
        this.business_id = ObjectId(data.business_id);
        this.session_id = ObjectId(data.session_id);
        this.order_id = ObjectId(data.order_id);
        this.shipping_company_id = ObjectId(data.shipping_company_id);
        this.shipping_code = data.shipping_code || '';
        this.customer_id = ObjectId(data.customer_id);
        this.cod_cost = data.cod_cost || 0;
        this.real_cod_cost = data.real_cod_cost || 0;
        this.card_cost = data.card_cost || 0;
        this.shipping_cost = data.shipping_cost || 0;
        this.insurance_cost = data.insurance_cost || 0;
        this.delivery_cost = data.delivery_cost || 0;
        this.refun_cost = data.refun_cost || 0;
        this.warehouse_cost = data.warehouse_cost || 0;
        this.revice_date = data.revice_date || '';
        this.note = data.note || '';
        this.status = data.status || '';
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Session, Compare };
