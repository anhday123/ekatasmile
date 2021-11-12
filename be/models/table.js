const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let tableForm = [
    'store_id',
    'position',
    'name',
];

class Table {
    validateInput(data) {
        softValidate(data, tableForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.store_id = Number(data.store_id);
        this.position = String(data.position);
        this.sub_position = removeUnicode(this.position, true).toLowerCase();
        this.table_id = Number(data.table_id);
        this.name = String(data.name);
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.current_people = Number(data.current_people) || 0;
        this.limit_people = Number(data.limit_people) || 10;
        this.current_payment = Number(data.current_payment) || 0;
        this.timepass = Number(data.timepass) || 0;
        this.status = String(data.status) || 'READY';
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
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
