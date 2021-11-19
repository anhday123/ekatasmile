const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let dealFrom = ['type', 'name'];

class Deal {
    validateInput(data) {
        softValidate(data, dealFrom, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.deal_id = Number(data.deal_id);
        this.code = Number(this.deal_id) + 1000000;
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.type = String(data.type).trim().toUpperCase();
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.saleoff_type = String(data.saleoff_type).trim().toUpperCase();
        this.sub_saleoff_type = removeUnicode(this.saleoff_type, true).toLowerCase();
        this.saleoff_value = Number(data.saleoff_value || 0);
        this.max_saleoff_value = Number(data.max_saleoff_value || 0);
        this.image = data.image || '';
        this.list = data.list || [];
        this.start_time = new Date(data.start_time);
        this.end_time = new Date(data.end_time);
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.deal_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Deal };
