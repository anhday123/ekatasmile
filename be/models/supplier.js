const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let supplierForm = ['name'];

class Supplier {
    validateInput(data) {
        softValidate(data, supplierForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.supplier_id = Number(data.supplier_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.logo = String(data.logo) || '';
        this.phone = String(data.phone) || '';
        this.email = String(data.email) || '';
        this.address = String(data.address) || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = String(data.district) || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = String(data.province) || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.supplier_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Supplier };
