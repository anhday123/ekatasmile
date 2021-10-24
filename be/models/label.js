const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let labelForm = {
    label_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    description: { data_type: ['string'], not_null: false },
    default: { data_type: ['boolean'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Label {
    validateInput(data) {
        validate(data, labelForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.label_id = ObjectId(data.label_id);
        this.name = data.name.trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.description = data.description || '';
        this.default = data.default || false;
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
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
