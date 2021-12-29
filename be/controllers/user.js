const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const userService = require(`../services/user`);
const bcrypt = require(`../libs/bcrypt`);
const mail = require(`../libs/nodemailer`);
const { User } = require('../models/user');
const { Branch } = require('../models/branch');
const { Store } = require('../models/store');

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
        req.body.username = String(req.body.username).trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        req.body.email = String(req.body.email).trim().toLowerCase();
        let user = await client
            .db(DB)
            .collection('Users')
            .findOne({
                $or: [{ username: req.body.username }, { email: req.body.email }],
            });
        let role = await client.db(DB).collection('Roles').findOne({ name: 'BUSINESS' });
        let [user_id, branch_id, store_id] = await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Users' })
                .then((doc) => {
                    if (doc) {
                        if (doc.value) {
                            return Number(doc.value);
                        }
                    }
                    return 0;
                }),
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Branchs' })
                .then((doc) => {
                    if (doc) {
                        if (doc.value) {
                            return Number(doc.value);
                        }
                    }
                    return 0;
                }),
            client
                .db(DB)
                .collection('AppSetting')
                .findOne({ name: 'Stores' })
                .then((doc) => {
                    if (doc) {
                        if (doc.value) {
                            return Number(doc.value);
                        }
                    }
                    return 0;
                }),
        ]).catch((err) => {
            throw new Error('Kiểm tra thông tin id không thành công!');
        });

        if (user) {
            throw new Error('400: Username hoặc Email đã được sử dụng!');
        }
        if (!role) {
            throw new Error('500: Không tìm được role!');
        }
        let otpCode = String(Math.random()).substr(2, 6);
        let vertifyId = crypto.randomBytes(10).toString(`hex`);
        let vertifyLink = `https://quantribanhang.viesoftware.vn/vertifyaccount?uid=${String(vertifyId)}`;
        let link = await client
            .db(DB)
            .collection('VertifyLinks')
            .insertOne({
                username: req.body.username,
                UID: String(vertifyId),
                vertify_link: vertifyLink,
                vertify_timelife: moment().utc().add(process.env.OTP_TIMELIFE, `minutes`).format(),
            });
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
        user_id++;
        branch_id++;
        store_id++;

        let _branch = new Branch();
        _branch.create({
            business_id: Number(user_id),
            branch_id: Number(branch_id),
            name: 'Chi nhánh mặc định',
            creator_id: Number(user_id),
        });

        let _store = new Store();
        _store.create({
            business_id: Number(user_id),
            branch_id: Number(branch_id),
            store_id: Number(store_id),
            name: 'Cửa hàng mặc định',
            creator_id: Number(user_id),
        });
        await Promise.all([
            client.db(DB).collection('Branchs').insertOne(_branch),
            client.db(DB).collection('Stores').insertOne(_branch),
        ]).catch((err) => {
            throw new Error('Tạo cửa hàng hoặc chi nhánh không thành công!');
        });
        _user.create({
            ...req.body,
            ...{
                business_id: Number(user_id),
                user_id: Number(user_id),
                role_id: Number(role.role_id),
                otp_code: otpCode,
                otp_timelife: new Date(moment().add(process.env.OTP_TIMELIFE, `minutes`).format()),
                branch_id: Number(branch_id),
                store_id: Number(store_id),
                is_new: false,
                create_date: new Date(),
                last_login: new Date(),
                exp: new Date(moment().add(10, 'days').format()),
                creator_id: Number(user_id),
                active: false,
            },
        });
        await Promise.all([
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Users' }, { $set: { name: 'Users', value: user_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Branchs' }, { $set: { name: 'Branchs', value: branch_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Stores' }, { $set: { name: 'Stores', value: store_id } }, { upsert: true }),
        ]);

        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addUserC = async (req, res, next) => {
    try {
        let _user = new User();
        _user.validateInput(req.body);
        req.body.username = String(req.body.username).trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        req.body.email = String(req.body.email).trim().toLowerCase();
        let user = await client
            .db(DB)
            .collection('Users')
            .findOne({
                $or: [{ username: req.body.username }, { email: req.body.email }],
            });
        if (user) {
            throw new Error('400: Username hoặc Email đã được sử dụng!');
        }
        let user_id = await client
            .db(DB)
            .collection('AppSetting')
            .findOne({ name: 'Users' })
            .then((doc) => {
                if (doc) {
                    if (doc.value) {
                        return Number(doc.value);
                    }
                }
                return 0;
            });
        let role = await client.db(DB).collection('Roles').findOne({ role_id: req.body.role_id });
        user_id++;
        _user.create({
            ...req.body,
            ...{
                user_id: Number(user_id),
                business_id: (() => {
                    if (role && /business/gi.test(role.sub_name)) {
                        return Number(user_id);
                    }
                    return Number(req.user.business_id);
                })(),
                company_name: (() => {
                    if (role && /business/gi.test(role.sub_name)) {
                        return String(req.body.company_name || '');
                    }
                    return String(req.user.company_name);
                })(),
                company_website: (() => {
                    if (role && /business/gi.test(role.sub_name)) {
                        return String(req.body.company_website || '');
                    }
                    return String(req.user.company_website);
                })(),
                create_date: new Date(),
                last_login: new Date(),
                exp: '',
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Users' }, { $set: { name: 'Users', value: user_id } }, { upsert: true });
        req[`_insert`] = _user;
        await userService.addUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateUserC = async (req, res, next) => {
    try {
        req.params.user_id = Number(req.params.user_id);
        let _user = new User();
        let user = await client.db(DB).collection('Users').findOne(req.params);
        if (!user) {
            throw new Error(`400: Người dùng không tồn tại!`);
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
        req.body.username = String(req.body.username).trim().toLowerCase();
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(
                { username: req.body.username },
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

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Users`)
            .deleteMany({ user_id: { $in: req.body.user_id } });
        res.send({
            success: true,
            message: 'Xóa người dùng thành công!',
        });
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
    _delete,
};
