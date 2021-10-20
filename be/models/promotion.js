const { ObjectId } = require('mongodb');
const { removeUnicode, getFirstLetter } = require('../utils/string-handle');
const { validate } = require('../utils/validate');

let promotionForm = {
    promotion_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    name: { data_type: ['string'], not_null: true },
    promotion_code: { data_type: ['string'], not_null: false },
    type: { data_type: ['string'], not_null: true },
    value: { data_type: ['number'], not_null: true },
    max_discount: { data_type: ['number'], not_null: false },
    discount_condition: { data_type: ['number'], not_null: false },
    has_voucher: { data_type: ['boolean'], not_null: false },
    limit: { data_type: ['object'], not_null: false },
    vouchers: { data_type: ['array'], not_null: false },
    discount_total: { data_type: ['number'], not_null: false },
    description: { data_type: ['string'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

let limitForm = {
    amount: { data_type: ['number'], not_null: false },
    branchs: { data_type: ['array'], not_null: false },
    stores: { data_type: ['array'], not_null: false },
};

let voucherForm = {
    voucher: { data_type: ['string'], not_null: true },
    order_id: { data_type: ['string'], not_null: true },
    discount_amount: { data_type: ['number'], not_null: true },
    active: { data_type: ['boolean'], not_null: true },
};

class Promotion {
    validateInput(data) {
        validate(data, promotionForm, true, 400);
    }
    validateInputLimit(data) {
        if (typeof data.amount != 'number') {
            throw new Error('400: amount phải là số!');
        }
        data.branchs.map((branch) => {
            if (typeof branch != 'string' || typeof branch != 'object') {
                throw new Error('400: branch_id phải là string hoặc objectId!');
            }
        });
        data.stores.map((store) => {
            if (typeof store != 'string' || typeof store != 'object') {
                throw new Error('400: store_id phải là string hoặc objectId!');
            }
        });
    }
    create(data) {
        this.validateInput(data);
        this.promotion_id = ObjectId(data.promotion_id);
        this.business_id = ObjectId(data.business_id);
        this.name = data.name.trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.promotion_code =
            data.promotion_code || removeUnicode(getFirstLetter(this.name), true).toUpperCase();
        this.type = data.type || 'Percent';
        this.value = data.value || 0;
        this.max_discount = data.max_discount || 0;
        this.discount_condition = data.discount_condition || 0;
        this.has_limit = data.has_limit || false;
        if (data.limit) {
            this.validateInputLimit(data.limit);
            this.limit = data.limit;
            if (this.limit.amount && this.limit.amount > 0) {
                let len = String(this.limit.amount).length;
                this.vouchers = [...new Array(this.limit.amount)].map(() => {
                    let voucher = `${this.promotion_code}_${String(Math.random()).substr(2, len + 2)}`;
                    return { voucher, order_id: '', discount_amount: 0, active: true };
                });
            } else {
                if (!this.vouchers) {
                    this.vouchers = [];
                }
            }
            if (this.limit.branchs) {
                this.limit.branchs.map((branch) => {
                    return ObjectId(branch);
                });
            }
            if (this.limit.stores) {
                this.limit.stores.map((store) => {
                    return ObjectId(store);
                });
            }
        } else {
            this.limit = {};
            this.vouchers = [];
        }
        if (this.vouchers) {
            validate(this.vouchers, voucherForm, true, 400);
        }
        this.discount_total = data.discount_total || 0;
        this.description = data.description || '';
        this.create_date = data.create_date;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.promotion_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        if (this.discount_total != 0 && this.delete == data.delete && this.active == data.active) {
            throw new Error('400: Chương trình khuyến mãi đã bắt đầu không thể thay đổi!');
        }
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Promotion };
