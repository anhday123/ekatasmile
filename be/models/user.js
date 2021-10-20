const { ObjectId } = require('mongodb');
const { removeUnicode } = require('../utils/string-handle');
const { validate } = require('../utils/validate');
const bcrypt = require('../libs/bcrypt');

let userForm = {
    user_id: { data_type: ['string', 'object'], not_null: false },
    business_id: { data_type: ['string', 'object'], not_null: false },
    username: { data_type: ['string'], not_null: true },
    password: { data_type: ['string'], not_null: true },
    otp_code: { data_type: ['string', 'boolean'], not_null: false },
    otp_timelife: { data_type: ['string', 'boolean'], not_null: false },
    role_id: { data_type: ['string', 'object'], not_null: false },
    email: { data_type: ['string'], not_null: false },
    phone: { data_type: ['string'], not_null: false },
    avatar: { data_type: ['string'], not_null: false },
    first_name: { data_type: ['string'], not_null: false },
    last_name: { data_type: ['string'], not_null: false },
    birthday: { data_type: ['string'], not_null: false },
    address: { data_type: ['string'], not_null: false },
    district: { data_type: ['string'], not_null: false },
    province: { data_type: ['string'], not_null: false },
    company_name: { data_type: ['string'], not_null: false },
    company_website: { data_type: ['string'], not_null: false },
    career_id: { data_type: ['string', 'object'], not_null: false },
    tax_code: { data_type: ['string'], not_null: false },
    fax: { data_type: ['string'], not_null: false },
    branch_id: { data_type: ['string', 'object'], not_null: false },
    store_id: { data_type: ['string', 'object'], not_null: false },
    is_new: { data_type: ['boolean'], not_null: false },
    create_date: { data_type: ['string'], not_null: false },
    last_login: { data_type: ['string'], not_null: false },
    exp: { data_type: ['string'], not_null: false },
    creator_id: { data_type: ['string', 'object'], not_null: false },
    delete: { data_type: ['boolean'], not_null: false },
    active: { data_type: ['boolean'], not_null: false },
};

class User {
    /** Kiểm tra dữ liệu tạo user */
    validateInput(data) {
        validate(data, userForm, true, 400);
    }
    /** Kiểm tra email có đúng định dạng hay không */
    validateEmail(data) {
        let regex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
        if (!regex.test(data)) {
            throw new Error('400: Email không đúng định dạng!');
        }
        return data;
    }
    /** Kiểm tra số điện thoại có đúng định dạng hay không */
    validatePhone(data) {
        let regex = /^(0|\+[0-9]{2})[0-9]{9}$/;
        if (!regex.test(data)) {
            throw new Error('400: Số điện thoại không đúng định dạng!');
        }
        return data;
    }
    /** Tạo user object: data là thông tin user, type là kiểu tạo: register là user đăng ký, create là user được business tạo
     */
    create(data) {
        this.validateInput(data);
        this.user_id = ObjectId(data.user_id);
        this.business_id = ObjectId(data.business_id);
        this.username = data.username;
        this.password = data.password;
        this.otp_code = data.otp_code || false;
        this.otp_timelife = data.otp_timelife || false;
        this.role_id = data.role_id && data.role_id != '' ? ObjectId(data.role_id) : '';
        this.email = this.validateEmail(data.email);
        this.phone = this.validatePhone(data.phone);
        this.avatar = data.avatar || '';
        this.first_name = data.first_name || '';
        this.last_name = data.last_name || '';
        this.sub_name = removeUnicode(this.first_name + this.last_name, true).toLowerCase();
        this.birthday = data.birthday || '2000-01-01';
        this.address = data.address || '';
        this.sub_address = removeUnicode(this.address, true).toLowerCase();
        this.district = data.district || '';
        this.sub_district = removeUnicode(this.district, true).toLowerCase();
        this.province = data.province || '';
        this.sub_province = removeUnicode(this.province, true).toLowerCase();
        this.company_name = data.company_name || '';
        this.company_website = data.company_website || '';
        this.career_id = data.career_id && data.career_id != '' ? ObjectId(data.career_id) : '';
        this.tax_code = data.tax_code || '';
        this.fax = data.fax || '';
        this.branch_id = data.branch_id && data.branch_id != '' ? ObjectId(data.branch_id) : data.branch_id;
        this.store_id = data.store_id && data.store_id != '' ? ObjectId(data.store_id) : data.store_id;
        this.is_new = data.is_new || false;
        this.create_date = data.create_date;
        this.last_login = data.last_login;
        this.exp = data.exp;
        this.creator_id = ObjectId(data.creator_id);
        this.delete = data.delete;
        this.active = data.active;
    }
    /** Update user bằng thông tin trong data */
    update(data) {
        delete data._id;
        delete data.user_id;
        delete data.business_id;
        delete data.create_date;
        delete data.creator_id;
        if (data.new_password) {
            if (bcrypt.compare(data.password, this.password)) {
                this.password = bcrypt.hash(new_password);
            } else {
                throw new Error('400: Mật khẩu cũ không chính xác!');
            }
        }
        data = { ...this, ...data };
        return this.create(data);
    }
}

module.exports = { User };
