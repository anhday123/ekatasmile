const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let branchForm = {
    branch_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    logo: { data_type: ['string'], not_null: false },
    phone: { data_type: ['string'], not_null: false },
    email: { data_type: ['string'], not_null: false },
    fax: { data_type: ['string'], not_null: false },
    website: { data_type: ['string'], not_null: false },
    latitude: { data_type: ['string'], not_null: false },
    longtitude: { data_type: ['string'], not_null: false },
    warehouse_type: { data_type: ['string'], not_null: false },
    address: { data_type: ['string'], not_null: false },
    district: { data_type: ['string'], not_null: false },
    province: { data_type: ['string'], not_null: false },
    accumulate_point: { data_type: ['boolean'], not_null: false },
    use_point: { data_type: ['boolean'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Branch {
    validateInput(data) {
        validate(data, branchForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.branch_id = ObjectId(data.branch_id);
        this.name = data.name;
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.logo = data.logo || '';
        this.phone = data.phone || '';
        this.email = data.email || '';
        this.fax = data.fax || '';
        this.website = data.website || '';
        this.latitude = data.latitude || '';
        this.longtitude = data.longtitude || '';
        this.warehouse_type = data.warehouse_type || 'Sở hữu';
        this.sub_warehouse_type = removeUnicode(this.warehouse_type, true).toLowerCase();
        this.address = data.address || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = data.district || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = data.province || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.accumulate_point = data.accumulate_point || false;
        this.use_point = data.use_point || false;
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.branch_id;
        delete data.business_id;
        delete data.create_date;
        delete data.creator_id;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Branch };
