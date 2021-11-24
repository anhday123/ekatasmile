const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let brandForm = ['name'];

class Brand {
    validateInput(data) {
        softValidate(data, brandForm, 400);
    }
    create(data) {
        this.brand_id = Number(data.brand_id);
        this.business_id = Number(data.business_id);
        this.code = Number(this.brand_id) + 1000000;
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.images = data.images;
        this.priority = Number(data.priority);
        this.country_code = String(data.country_code);
        this.founded_year = String(data.founded_year);
        this.content = data.content;
        this.tags = data.tags;
        this.sub_tags = (() => {
            if (Array.isArray(this.tags)) {
                return this.tags.map((tag) => {
                    return removeUnicode(tag, true).toLowerCase();
                });
            }
            return [];
        })();
        this.create_date = new Date(data.create_date);
        this.creator_id = Number(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.business_id;
        delete data.brand_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Brand };
