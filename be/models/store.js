const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let storeForm = ['name'];

class Store {
    validateInput(data) {
        softValidate(data, storeForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.store_id = Number(data.store_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.branch_id = (() => {
            if (data.branch_id && data.branch_id != '') {
                return Number(data.branch_id);
            }
            return data.branch_id;
        })();
        this.label_id = (() => {
            if (data.label_id && data.label_id != '') {
                return Number(data.label_id);
            }
            return data.label_id;
        })();
        this.logo = String(data.logo) || '';
        this.phone = String(data.phone) || '';
        this.latitude = String(data.latitude) || '';
        this.longtitude = String(data.longtitude) || '';
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
        delete data.store_id;
        delete data.business_id;
        delete data.create_date;
        delete data.creator_id;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Store };
