const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let taxForm = ['name', 'value', 'description'];

class Tax {
    validateInput(data) {
        softValidate(data, taxForm, 400);
    }
    create(data) {
        this.tax_id = Number(data.tax_id);
        this.business_id = Number(data.business_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.value = Number(data.value);
        this.description = String(data.description) || '';
        this.default = data.default || false;
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Tax };
