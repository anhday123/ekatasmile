const { removeUnicode } = require('../utils/string-handle');
const { softValidate } = require('../utils/validate');
const bcrypt = require('../libs/bcrypt');

let userForm = ['username', 'password'];

class User {
    /** Kiểm tra dữ liệu tạo user */
    validateInput(data) {
        softValidate(data, userForm, 400);
    }
    /** Kiểm tra email có đúng định dạng hay không */
    validateUsername(data) {
        let regex = /[a-z][a-z0-9_\.]{6,32}/;
        if (!regex.test(data)) {
            throw new Error('400: Username không đúng định dạng!');
        }
        return data;
    }
    /** Kiểm tra email có đúng định dạng hay không */
    validateEmail(data) {
        let regex = /^[a-z][a-z0-9_\.]{6,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
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
        this.business_id = String(data.business_id);
        this.user_id = String(data.user_id);
        this.username = String(data.username).replace(/\s/g, '').toLowerCase();
        this.password = String(data.password);
        this.otp_code = String(data.otp_code) || false;
        this.otp_timelife = new Date(data.otp_timelife) || false;
        this.role_id = (() => {
            if (data.role_id && data.role_id != '') {
                return String(data.role_id);
            }
            return data.role_id;
        })();
        this.email = String(data.email);
        this.phone = String(data.phone);
        this.avatar = String(data.avatar) || '';
        this.first_name = String(data.first_name) || '';
        this.last_name = String(data.last_name) || '';
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
        this.career_id = (() => {
            if (data.career_id && data.career_id != '') {
                return String(data.career_id);
            }
            return data.career_id;
        })();
        this.tax_code = data.tax_code || '';
        this.fax = data.fax || '';
        this.branch_id = (() => {
            if (data.branch_id && data.branch_id != '') {
                return String(data.branch_id);
            }
            return data.branch_id;
        })();
        this.store_id = (() => {
            if (data.store_id && data.store_id != '') {
                return String(data.store_id);
            }
            return data.store_id;
        })();
        this.is_new = data.is_new || false;
        this.create_date = data.create_date;
        this.last_login = data.last_login;
        this.exp = data.exp;
        this.creator_id = String(data.creator_id);
        this.active = data.active;
    }
    /** Update user bằng thông tin trong data */
    update(data) {
        delete data._id;
        delete data.user_id;
        delete data.business_id;
        delete data.username;
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
