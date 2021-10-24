const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let storeForm = {
    store_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    logo: { data_type: ['string'], not_null: false },
    label_id: { data_type: ['string', 'object'], not_null: false },
    phone: { data_type: ['string'], not_null: false },
    latitude: { data_type: ['string'], not_null: false },
    longtitude: { data_type: ['string'], not_null: false },
    address: { data_type: ['string'], not_null: false },
    district: { data_type: ['string'], not_null: false },
    province: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Store {
    validateInput(data) {
        validate(data, storeForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.store_id = ObjectId(data.store_id);
        this.name = data.name;
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.branch_id = (() => {
            if (data.branch_id && data.branch_id != '') {
                return ObjectId(data.branch_id);
            }
            return data.branch_id;
        })();
        this.label_id = (() => {
            if (data.label_id && data.label_id != '') {
                return ObjectId(data.label_id);
            }
            return data.label_id;
        })();
        this.logo = data.logo || '';
        this.phone = data.phone || '';
        this.latitude = data.latitude || '';
        this.longtitude = data.longtitude || '';
        this.address = data.address || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = data.district || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = data.province || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete || false;
        this.active = data.active || true;
    }
    update(data) {
        delete data._id;
        delete data.store_id;
        delete data.business_id;
        delete data.create_date;
        delete data.creator_id;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Store };
