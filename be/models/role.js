const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let roleForm = ['name', 'permission_list', 'menu_list'];

class Role {
    validateInput(data) {
        softValidate(data, roleForm, 400);
    }
    validateName(data) {
        let regexName = /^((admin)|(business)){1}$/gi;
        if (regexName.test(data.name)) {
            throw new Error('400: Không được tạo vai trò của hệ thống!');
        }
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.role_id = Number(data.role_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.permission_list = data.permission_list || [];
        this.menu_list = data.menu_list || [];
        this.default = false;
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.role_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Role };
