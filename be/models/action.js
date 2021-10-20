const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let actionForm = {
    business_id: { data_type: ['string', 'object'], not_null: true },
    type: { data_type: ['string'], not_null: true },
    properties: { data_type: ['string'], not_null: true },
    name: { data_type: ['string'], not_null: true },
    data: { data_type: ['string'], not_null: true },
    performer_id: { data_type: ['string', 'object'], not_null: true },
    date: { data_type: ['string'], not_null: true },
};

class Action {
    validateInput(data) {
        validate(data, actionForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.type = data.type.trim().toUpperCase();
        this.sub_type = removeUnicode(this.type, true).toLowerCase();
        this.properties = data.properties.trim().toUpperCase();
        this.sub_properties = removeUnicode(this.properties, true).toLowerCase();
        this.name = data.name.trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.data = data.data;
        this.performer_id = ObjectId(data.performer_id);
        this.date = data.date;
    }
}

module.exports = { Action };
