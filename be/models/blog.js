const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let blogForm = ['title'];

class Blog {
    validateInput(data) {
        softValidate(data, blogForm, 400);
    }
    create(data) {
        this.blog_id = Number(data.blog_id);
        this.business_id = Number(data.business_id);
        this.code = Number(this.blog_id) + 1000000;
        this.title = String(data.title).trim().toUpperCase();
        this.image = data.image;
        this.sub_title = removeUnicode(this.title, true).toLowerCase();
        this.content = data.content;
        this.tags = data.tags;
        this.sub_tags = (() => {
            if (Array.isArray(this.tags)) {
                this.tags.map((tag) => {
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
        delete data.blog_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Blog };
