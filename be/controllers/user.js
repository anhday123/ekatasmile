const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const userService = require(`../services/user`);
const bcrypt = require(`../libs/bcrypt`);
const mail = require(`../libs/nodemailer`);
const { User } = require('../models/user');

let getUserC = async (req, res, next) => {
    try {
        await userService.getUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let registerC = async (req, res, next) => {
    try {
        let _user = new User();
        _user.validateInput(req.body);
        _user.validateEmail(req.body.email);
        req.body.username = req.body.username.trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        req.body.email = req.body.email.trim().toLowerCase();
        let [user] = await Promise.all([
            client
                .db(DB)
                .collection('Users')
                .findOne({
                    $or: [{ username: req.body.username }, { email: req.body.email }],
                    delete: false,
                }),
        ]);
        if (user) {
            throw new Error('400: Username hoặc Email đã được sử dụng!');
        }
        let otpCode = String(Math.random()).substr(2, 6);
        let vertifyId = crypto.randomBytes(10).toString(`hex`);
        let vertifyLink = `https://quantribanhang.networkdemo.site/vertifyaccount?uid=${String(vertifyId)}`;
        let link = await client
            .db(DB)
            .collection('VertifyLinks')
            .insertOne({
                username: req.body.username,
                UID: String(vertifyId),
                vertify_link: vertifyLink,
                vertify_timelife: moment().utc().add(process.env.OTP_TIMELIFE, `minutes`).format(),
            });
        console.log(link);
        if (!link.insertedId) {
            throw new Error('Tạo tài khoản thất bại!');
        }
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
        let id = ObjectId();
        _user.create({
            ...req.body,
            ...{
                user_id: id,
                business_id: id,
                role_id: '6166a2ebdddaf490b0c4a68f',
                otp_code: otpCode,
                otp_timelife: moment().utc().add(process.env.OTP_TIMELIFE, `minutes`).format(),
                is_new: true,
                create_date: moment().utc().format(),
                last_login: moment().utc().format(),
                exp: moment().utc().add(10, 'days').format(),
                creator_id: id,
                delete: false,
                active: false,
            },
        });
        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _user = new User();
        _user.validateInput(req.body);
        _user.validateEmail(req.body.email);
        req.body.username = req.body.username.trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        req.body.email = req.body.email.trim().toLowerCase();
        let [user] = await Promise.all([
            client
                .db(DB)
                .collection('Users')
                .findOne({
                    $or: [{ username: req.body.username }, { email: req.body.email }],
                    delete: false,
                }),
        ]);
        if (user) {
            throw new Error('400: Username hoặc Email đã được sử dụng!');
        }
        _user.create({
            ...req.body,
            ...{
                user_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                last_login: moment().utc().format(),
                exp: '',
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateUserC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.user_id = ObjectId(req.params.user_id);
        let _user = new User();
        let user = await client.db(DB).collection('Users').findOne(req.params);
        if (!user) {
            throw new Error(`400: _id <${req.params.user_id}> không tồn tại!`);
        }
        _user.create(user);
        _user.update(req.body);
        req['_update'] = _user;
        await userService.updateUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let forgotPassword = async (req, res, next) => {
    try {
        if (!req.body.username) {
            throw new Error('400: username không được để trống!');
        }
        if (!req.body.password) {
            throw new Error('400: password không được để trống!');
        }
        req.body.username = req.body.username.trim().toLowerCase();
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(
                { username: req.body.username, delete: false },
                {
                    $set: {
                        password: bcrypt.hash(req.body.password),
                        otp_code: false,
                        otp_timelife: false,
                    },
                }
            );
        res.send({ success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserC,
    registerC,
    addUserC,
    updateUserC,
    forgotPassword,
};
