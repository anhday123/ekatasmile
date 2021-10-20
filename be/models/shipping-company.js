const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let shippingCompanyForm = {
    shipping_company_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    image: { data_type: ['string'], not_null: false },
    phone: { data_type: ['string'], not_null: false },
    zipcode: { data_type: ['string'], not_null: false },
    address: { data_type: ['string'], not_null: false },
    district: { data_type: ['string'], not_null: false },
    province: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class ShippingCompany {
    validateInput(data) {
        validate(data, shippingCompanyForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.shipping_company_id = ObjectId(data.shipping_company_id);
        this.business_id = ObjectId(data.business_id);
        this.name = data.name.trim().toUpperCase();
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
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.delete = data.delete;
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
