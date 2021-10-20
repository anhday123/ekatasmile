const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let customerForm = {
    customer_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    phone: { data_type: ['string'], not_null: true },
    type: { data_type: ['string'], not_null: false },
    first_name: { data_type: ['string'], not_null: false },
    last_name: { data_type: ['string'], not_null: false },
    gender: { data_type: ['string'], not_null: false },
    address: { data_type: ['string'], not_null: false },
    district: { data_type: ['string'], not_null: false },
    province: { data_type: ['string'], not_null: false },
    point: { data_type: ['array'], not_null: false },
    debt: { data_type: ['boolean'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Customer {
    validateInput(data) {
        validate(data, customerForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.customer_id = ObjectId(data.customer_id);
        this.business_id = ObjectId(data.business_id);
        this.phone = data.phone;
        this.type = data.type || 'Tiềm năng';
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.first_name = data.first_name.trim() || '';
        this.last_name = data.last_name.trim() || '';
        this.sub_name = removeUnicode(this.first_name + this.last_name, true).toLowerCase();
        this.gender = data.gender || '';
        this.sub_gender = removeUnicode(this.gender, true).toLowerCase();
        this.birthday = data.birthday || '';
        this.address = data.address || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = data.district || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = data.province || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.balance = data.balance || [];
        this.point = data.point || 0;
        this.debt = data.debt || 0;
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.customer_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Customer };
