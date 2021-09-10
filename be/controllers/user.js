const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/user`);
const userService = require(`../services/user`);
const bcrypt = require(`../libs/bcrypt`);
const mail = require(`../libs/nodemailer`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getUserC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getUser)) {
        //     throw new Error(`400 ~ Validate data wrong!`);
        // }
        await userService.getUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let registerC = async (req, res, next) => {
    try {
        // if (!valid.absolute(req.body, form.addUser)) {
        //     throw new Error(`400 ~ Validate data wrong!`);
        // }
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        req.body.company_name = req.body.company_name.toUpperCase();
        let [_counts, _user] = await Promise.all([
            await client.db(DB).collection(`Users`).countDocuments(),
            await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    $or: [{ username: req.body.username }, { email: req.body.email }],
                }),
        ]);
        if (_user) {
            throw new Error(`400 ~ Username or Email is exists!`);
        }
        req.body[`user_id`] = String(_counts + 1);
        let otpCode = String(Math.random()).substr(2, 6);
        let vertifyId = crypto.randomBytes(10).toString(`hex`);
        let vertifyLink = `https://quantribanhang.networkdemo.site/vertifyaccount?uid=${vertifyId}_${req.body.user_id}`;
        await client
            .db(DB)
            .collection(`VertifyLinks`)
            .insertOne({
                user_id: req.body.user_id,
                username: req.body.username,
                UID: `${vertifyId}_${req.body.user_id}`,
                vertify_link: vertifyLink,
                vertify_timelife: moment
                    .tz(`Asia/Ho_Chi_Minh`)
                    .add(process.env.OTP_TIMELIFE, `minutes`)
                    .format(),
            });
        await mail.sendMail(
            req.body.email,
            `Yêu cầu xác thực`,
            `<div>
                Mã xác thực của bạn là: <b>${otpCode}</b>.<br/>
                Vui lòng xác thực tài khoản tại đường dẫn dưới đây trong vòng ${process.env.OTP_TIMELIFE} phút.<br/>
                <a href = "${vertifyLink}">${vertifyLink}</a><br/>
                Create by Demo Team.
            </div>`
        );
        _user = {
            user_id: req.body.user_id,
            business_id: req.body.user_id,
            username: req.body.username,
            password: bcrypt.hash(req.body.password),
            otp_code: otpCode,
            otp_timelife: moment.tz(`Asia/Ho_Chi_Minh`).add(process.env.OTP_TIMELIFE, `minutes`).format(),
            role_id: `2`,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            sub_name: createSub(`${req.body.first_name}${req.body.last_name}`),
            birthday: req.body.birthday,
            address: req.body.address,
            sub_address: createSub(req.body.address),
            district: req.body.district,
            sub_district: createSub(req.body.district),
            province: req.body.province,
            sub_province: createSub(req.body.province),
            company_name: req.body.company_name,
            company_website: req.body.company_website,
            business_areas: req.body.business_areas || '',
            tax_code: req.body.tax_code,
            fax: req.body.fax,
            branch_id: req.body.branch_id,
            store_id: req.body.store_id,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            last_login: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: ` `,
            exp: moment.tz(`Asia/Ho_Chi_Minh`).add(10, 'days').format(),
            is_new: true,
            active: false,
        };
        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_user`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(req.body, form.addUser)) {
        //     throw new Error(`400 ~ Validate data wrong!`);
        // }
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        let [_counts, _user] = await Promise.all([
            await client.db(DB).collection(`Users`).countDocuments(),
            await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    $or: [{ username: req.body.username }, { email: req.body.email }],
                }),
        ]);
        if (_user) throw new Error(`400 ~ Username or Email is exists!`);
        req.body[`user_id`] = String(_counts + 1);
        _user = {
            user_id: req.body.user_id,
            business_id: token.business_id,
            username: req.body.username,
            password: bcrypt.hash(req.body.password),
            email_OTP: false,
            timelife_OTP: false,
            role_id: req.body.role_id,
            phone: req.body.phone,
            email: req.body.email,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            sub_name: createSub(`${req.body.first_name}${req.body.last_name}`),
            birthday: req.body.birthday,
            address: req.body.address,
            sub_address: createSub(req.body.address),
            district: req.body.district,
            sub_district: createSub(req.body.district),
            province: req.body.province,
            sub_province: createSub(req.body.province),
            company_name: token.company_name,
            company_website: token.company_website,
            business_areas: token.business_areas || '',
            tax_code: token.tax_code,
            fax: token.fax,
            branch_id: req.body.branch_id,
            store_id: req.body.store_id,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            last_login: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            exp: ``,
            is_new: false,
            active: true,
        };
        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        delete req.body.password;
        let _user = await client.db(DB).collection(`Users`).findOne(req.params);
        if (!_user) {
            throw new Error(`400 ~ User is not exists!`);
        }
        if (req.body.new_password && req.body.old_password) {
            if (!bcrypt.compare(req.body.old_password, _user.password))
                throw new Error(`400 ~ Wrong password!`);
            req.body[`password`] = bcrypt.hash(req.body.new_password);
        }
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
            let _email = await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: { $ne: _user.user_id },
                    email: req.body.email,
                });
            if (_email) {
                throw new Error(`400 ~ Email was exists!`);
            }
        }
        if (req.body.first_name || req.body.last_name) {
            req.body.sub_name = createSub(
                `${req.body.first_name || _user.first_name}${req.body.last_name || _user.last_name}`
            );
        }
        if (req.body.address) {
            req.body.address = createSub(req.body.address);
        }
        if (req.body.district) {
            req.body.district = createSub(req.body.district);
        }
        if (req.body.province) {
            req.body.province = createSub(req.body.province);
        }
        if (req.body.company_name) {
            req.body.company_name = req.body.company_name.toUpperCase();
        }
        if (req.body.branch_id) {
            let _branch = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({ branch_id: req.body.branch_id });
            req.body.store_id = _branch.store_id;
        }
        if (_user.user_id && _user.business_id && _user.user_id == _user.business_id) {
            req[`_updateBussiness`] = true;
        }
        delete req.body._id;
        delete req.body.user_id;
        delete req.body.business_id;
        delete req.body.username;
        delete req.body.old_password;
        delete req.body.new_password;
        delete req.body.create_date;
        delete req.body.last_login;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        delete req.body._role;
        delete req.body._branch;
        delete req.body._store;
        req['_update'] = { ..._user, ...req.body };
        await userService.updateUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let activeUser = async (req, res, next) => {
    try {
        req.query[`username`] = req.body.username;
        delete req.body.otp_code;
        req.body[`otp_code`] = false;
        req.body[`otp_timelife`] = false;
        req.body[`active`] = true;
        await client.db(DB).collection(`Users`).findOneAndUpdate(req.query, { $set: req.body });
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

let forgotPassword = async (req, res, next) => {
    try {
        req.query[`username`] = req.otpData.username;
        req.body[`otp_code`] = false;
        req.body[`otp_timelife`] = false;
        if (req.body.password) req.body.password = bcrypt.hash(req.body.password);
        await client.db(DB).collection(`Users`).findOneAndUpdate(req.query, { $set: req.body });
        if (req.body.password) req.body.password = `Successful change password!`;
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserC,
    registerC,
    addUserC,
    updateUserC,
    activeUser,
    forgotPassword,
};
