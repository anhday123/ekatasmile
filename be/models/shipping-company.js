const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let shippingCompanyForm = ['name'];

class ShippingCompany {
    validateInput(data) {
        softValidate(data, shippingCompanyForm, 400);
    }
    create(data) {
        this.shipping_company_id = String(data.shipping_company_id);
        this.business_id = String(data.business_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.image = data.image || '';
        this.phone = data.phone || '';
        this.zipcode = data.zipcode || '';
        this.address = data.address || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = data.district || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = data.province || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.create_date = new Date(data.create_date);
        this.creator_id = String(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.shipping_company_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { ShippingCompany };
