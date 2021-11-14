const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let branchForm = ['name'];

class Branch {
    validateInput(data) {
        softValidate(data, branchForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.branch_id = Number(data.branch_id);
        this.code = Number(this.branch_id) + 1000000;
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.logo = String(data.logo);
        this.phone = String(data.phone);
        this.email = String(data.email);
        this.fax = String(data.fax);
        this.website = String(data.website);
        this.latitude = String(data.latitude);
        this.longtitude = String(data.longtitude);
        this.warehouse_type = String(data.warehouse_type || 'Sở hữu');
        this.sub_warehouse_type = removeUnicode(this.warehouse_type, true).toLowerCase();
        this.address = String(data.address);
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = String(data.district);
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = String(data.province);
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.accumulate_point = data.accumulate_point || false;
        this.use_point = data.use_point || false;
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
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
