const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/user`);
const userService = require(`../services/user`);
const bcrypt = require(`../libs/bcrypt`);
const mail = require(`../libs/nodemailer`);

let checkAccount = (username, password, email) => {
    let [regexUsername, regexPassword, regexEmail] = [
        /^[A-Za-z\d!@#$%^&*()?]{8,}$/,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()?])[A-Za-z\d!@#$%^&*()?]{8,}$/,
        /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
    ];
    if (username.normalize(`NFD`).length != username.length)
        return `400 ~ Username is not correct!`;
    if (!regexUsername.test(username)) return `400 ~ Username is not correct!`;
    if (!regexPassword.test(password)) return `400 ~ Password is not correct!`;
    if (!regexEmail.test(email)) return `400 ~ Email is not correct!`;
    return true;
};

let getUserC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getUser))
            throw new Error(`400 ~ Validate data wrong!`);
        await userService.getUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let registerC = async (req, res, next) => {
    try {
        if (!valid.absolute(req.body, form.addUser))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        req.body.company_name = req.body.company_name.toUpperCase();
        let [_counts, _user] = await Promise.all([
            await client.db(DB).collection(`Users`).countDocuments(),
            await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    $or: [
                        { username: req.body.username },
                        { email: req.body.email },
                    ],
                }),
        ]);
        if (_user) throw new Error(`400 ~ Username or Email is exists!`);
        req.body[`user_id`] = String(_counts + 1);
        let otpCode = String(Math.random()).substr(2, 6);
        let vertifyId = crypto.randomBytes(10).toString(`hex`);
        let vertifyLink = `https://quantribanhang.networkdemo.site/vertifyaccount/${vertifyId}_${req.body.user_id}`;
        await client
            .db(DB)
            .collection(`VertifyLinks`)
            .insertOne({
                user_id: req.body.user_id,
                username: req.body.username,
                UID: `${vertifyId}_${req.body.user_id}`,
                vertify_link: vertifyLink,
                vertify_timelife: moment()
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
                Create by Viesoftware.
            </div>`
        );
        _user = {
            user_id: req.body.user_id,
            bussiness: req.body.user_id,
            username: req.body.username,
            password: bcrypt.hash(req.body.password),
            otp_code: otpCode,
            otp_timelife: moment()
                .add(process.env.OTP_TIMELIFE, `minutes`)
                .format(),
            role: `2`,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: req.body.birthday,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            company_name: req.body.company_name,
            company_website: req.body.company_website,
            tax_code: req.body.tax_code,
            fax: req.body.fax,
            store: req.body.store,
            branch: req.body.branch,
            create_date: moment().format(),
            last_login: moment().format(),
            creator: ` `,
            exp: moment().add(10, 'days').format(),
            active: false,
        };
        req[`_user`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addUser))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        let [_counts, _user] = await Promise.all([
            await client.db(DB).collection(`Users`).countDocuments(),
            await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    $or: [
                        { username: req.body.username },
                        { email: req.body.email },
                    ],
                }),
        ]);
        if (_user) throw new Error(`400 ~ Username or Email is exists!`);
        req.body[`user_id`] = String(_counts + 1);
        _user = {
            user_id: req.body.user_id,
            bussiness: token.bussiness.user_id,
            username: req.body.username,
            password: bcrypt.hash(req.body.password),
            email_OTP: false,
            timelife_OTP: false,
            role: req.body.role,
            phone: req.body.phone,
            email: req.body.email,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthday: req.body.birthday,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            company_name: token.company_name,
            company_website: token.company_website,
            tax_code: token.tax_code,
            fax: token.fax,
            store: req.body.store,
            branch: req.body.branch,
            create_date: moment().format(),
            last_login: moment().format(),
            creator: token.user_id,
            exp: ` `,
            active: true,
        };
        req[`_user`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _user = await client.db(DB).collection(`Users`).findOne(req.params);
        if (!_user) throw new Error(`400 ~ User is not exists!`);
        if (req.body.new_password && req.body.old_password) {
            if (!bcrypt.compare(req.body.old_password, _user.password))
                throw new Error(`400 ~ Wrong password!`);
            req.body[`password`] = bcrypt.hash(req.body.new_password);
        }
        delete req.body.old_password;
        delete req.body.new_password;
        if (req.body.email) {
            req.body.email = req.body?.email.toLowerCase();
            let _email = await client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: { $ne: _user.user_id },
                    email: req.body.email,
                });
            if (_email) throw new Error(`400 ~ Email was exists!`);
        }
        if (req.body.company_name)
            req.body.company_name = req.body?.company_name.toUpperCase();
        if (
            req.body.user_id ==
            (req.body.bussiness.user_id || req.body.bussiness)
        ) {
            req[`_updateBussiness`] = true;
        }
        delete req.body._id;
        delete req.body.user_id;
        delete req.body.bussiness;
        delete req.body.username;
        if (req.body.role)
            req.body.role = req.body.role.role_id || req.body.role;
        if (req.body.store)
            req.body.store = req.body.store.store_id || req.body.store;
        if (req.body.branch)
            req.body.branch = req.body.branch.branch_id || req.body.branch;
        delete req.body.create_date;
        delete req.body.last_login;
        delete req.body.creator;
        delete req.body._full_name;
        delete req.body._bussiness;
        delete req.body._creator;
        delete req.body._role;
        delete req.body._branch;
        delete req.body._store;
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
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(req.query, { $set: req.body });
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
        if (req.body.password)
            req.body.password = bcrypt.hash(req.body.password);
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(req.query, { $set: req.body });
        if (req.body.password)
            req.body.password = `Successful change password!`;
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
