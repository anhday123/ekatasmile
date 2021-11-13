const { removeUnicode, getFirstLetter } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');

let promotionForm = [
    'name',
    'promotion_code',
    'type',
    'value',
    'has_voucher',
    'limit',
];

class Promotion {
    validateInput(data) {
        softValidate(data, promotionForm, 400);
    }
    createLimit(limitData) {
        if (limitData) {
            this.limit = limitData;
            if (this.limit.amount && typeof this.limit.amount != 'number') {
                throw new Error('400: limit amount phải là số!');
            }
            if (this.limit.amount && this.limit.amount > 0) {
                if (!this.promotion_code) {
                    throw new Error('400: promotion_code chưa xác định!');
                }
                let len = String(this.limit.amount).length;
                this.vouchers = [...new Array(this.limit.amount)].map(() => {
                    let voucher = `${this.promotion_code}_${String(Math.random()).substr(2, len + 2)}`;
                    return { voucher, active: true };
                });
            }
            if (this.limit.branchs) {
                this.limit.branchs.map((branch) => {
                    return String(branch);
                });
            }
            if (this.limit.stores) {
                this.limit.stores.map((store) => {
                    return String(store);
                });
            }
        }
    }
    create(data) {
        this.business_id = String(data.business_id);
        this.promotion_id = String(data.promotion_id);
        this.name = String(data.name).trim().toUpperCase();
        this.sub_name = removeUnicode(this.name, true).toLowerCase();
        this.promotion_code = (() => {
            if (data.promotion_code && data.promotion_code != '') {
                return data.promotion_code;
            } else {
                return removeUnicode(`${getFirstLetter(this.name)}_${promotion_id}`, true);
            }
        })().toUpperCase();
        this.type = String(data.type || 'percent').toUpperCase();
        this.value = Number(data.value || 0);
        this.max_discount = Number(data.max_discount || 0);
        this.discount_condition = Number(data.discount_condition || 0);
        this.has_voucher = data.has_voucher || false;
        this.limit = data.limit || {};
        this.vouchers = data.vouchers || [];
        this.description = String(data.description) || '';
        this.create_date = new Date(data.create_date);
        this.creator_id = String(data.creator_id);
        this.active = data.active;
    }
    update(data) {
        delete data._id;
        delete data.promotion_id;
        delete data.business_id;
        delete data.creator_id;
        delete data.create_date;
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { Promotion };
