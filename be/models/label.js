const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let labelForm = ['name'];

class Label {
    validateInput(data) {
        softValidate(data, labelForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.label_id = Number(data.label_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.description = String(data.description || '');
        this.default = data.default || false;
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.label_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Label };
