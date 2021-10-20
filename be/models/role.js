const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let roleForm = {
    business_id: { data_type: ['string', 'object'], not_null: true },
    name: { data_type: ['string'], not_null: true },
    permission_list: { data_type: ['array'], not_null: false },
    menu_list: { data_type: ['array'], not_null: false },
    create_date: { data_type: ['string'], not_null: true },
    creator_id: { data_type: ['string', 'object'], not_null: true },
    delete: { data_type: ['boolean'], not_null: true },
    active: { data_type: ['boolean'], not_null: true },
};

class Role {
    validateInput(data) {
        validate(data, roleForm, true, 400);
    }
    validateName(data) {
        let regexName = /^((admin)|(business)){1}$/gi;
        if (regexName.test(data.name)) {
            throw new Error('400: Không được tạo vai trò của hệ thống!');
        }
    }
    create(data) {
        this.validateInput(data);
        this.validateName(data);
        this.business_id = ObjectId(data.business_id);
        this.name = data.name.trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.permission_list = data.permission_list || [];
        this.menu_list = data.menu_list || [];
        this.default = false;
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.delete = data.delete;
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

module.exports = { Role };
