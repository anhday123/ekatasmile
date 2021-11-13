const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let customerForm = [
    'phone'
];

class Customer {
    validateInput(data) {
        softValidate(data, customerForm, 400);
    }
    create(data) {
        this.customer_id = String(data.customer_id);
        this.business_id = String(data.business_id);
        this.phone = String(data.phone);
        this.type = String(data.type || 'Tiềm năng');
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.first_name = String(data.first_name || '').trim();
        this.last_name = String(data.last_name.trim() || '').trim();
        this.sub_name = removeUnicode(this.first_name + this.last_name, true).toLowerCase();
        this.gender = String(data.gender || '');
        this.sub_gender = removeUnicode(this.gender, true).toLowerCase();
        this.birthday = String(data.birthday || '');
        this.address = String(data.address || '');
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = String(data.district || '');
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = String(data.province || '');
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.balance = data.balance || {};
        this.point = Number(data.point || 0);
        this.debt = Number(data.debt || 0);
        this.create_date = new Date(data.create_date);
        this.creator_id = String(data.creator_id);
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
