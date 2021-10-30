const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let tableForm = {
    business_id: { data_type: ['string', 'object'], not_null: false },
    store_id: { data_type: ['string', 'object'], not_null: false },
    position_id: { data_type: ['string', 'object'], not_null: false },
    table_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    current_people: { data_type: ['number'], not_null: false },
    limit_people: { data_type: ['number'], not_null: false },
    current_payment: { data_type: ['number'], not_null: false },
    timepass: { data_type: ['string'], not_null: false },
    status: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class Table {
    validateInput(data) {
        validate(data, tableForm, true, 400);
    }
    create(data) {
        this.validateInput(data);
        this.business_id = ObjectId(data.business_id);
        this.store_id = ObjectId(data.store_id);
        this.position = data.position;
        this.sub_position = removeUnicode(this.position, true).toLowerCase();
        this.table_id = ObjectId(data.table_id);
        this.name = data.name;
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.current_people = data.current_people || 0;
        this.limit_people = data.limit_people || 10;
        this.current_payment = data.current_payment || 0;
        this.timepass = data.timepass || 0;
        this.status = data.status || 'READY';
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.table_id;
        delete data.create_date;
        delete data.creator_id;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Table };
