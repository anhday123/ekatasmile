const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let toppingForm = ['category_id', 'name', 'price', 'limit'];

class Topping {
    validateInput(data) {
        softValidate(data, toppingForm, 400);
    }
    create(data) {
        this.business_id = Number(data.business_id);
        this.category_id = Number(data.category_id);
        this.topping_id = Number(data.topping_id);
        this.name = data.name.trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.price = data.price || 0;
        this.limit = data.limit || 10;
        this.create_date = data.create_date;
        this.creator_id = data.creator_id;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.topping_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Topping };
