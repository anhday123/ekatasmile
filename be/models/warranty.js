const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let warrantyForm = ['name', 'time'];

class Warranty {
    validateInput(data) {
        softValidate(data, warrantyForm, 400);
    }
    create(data) {
        this.warranty_id = String(data.warranty_id);
        this.business_id = String(data.business_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.type = String(data.type || '');
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.time = Number(data.time || 0);
        this.description = data.description || '';
        this.create_date = new Date(data.create_date);
        this.creator_id = String(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.warranty_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Warranty };
