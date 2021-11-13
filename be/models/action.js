const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let actionForm = ['type', 'properties', 'name', 'data'];

class Action {
    validateInput(inputData) {
        softValidate(inputData, actionForm, 400);
    }
    create(data) {
        this.business_id = String(data.business_id);
        this.type = String(data.type).trim().toUpperCase();
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.properties = String(data.properties).trim().toUpperCase();
        this.sub_properties = removeUnicode(this.properties, true).toLowerCase();
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.data = data.data;
        this.performer_id = String(data.performer_id);
        this.date = new Date(data.date);
    }
}

module.exports = { Action };
