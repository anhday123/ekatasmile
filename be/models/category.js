const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let categoryForm = ['name', 'description'];

class Category {
    validateInput(data) {
        softValidate(data, categoryForm, 400);
    }
    create(data) {
        this.category_id = Number(data.category_id);
        this.business_id = Number(data.business_id);
        this.parent_id = (() => {
            if (isNaN(data.parent_id)) {
                return -1;
            }
            return Number(data.parent_id);
        })();
        this.priority = Number(data.priority);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.image = String(data.image);
        this.description = String(data.description);
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

module.exports = { Category };
