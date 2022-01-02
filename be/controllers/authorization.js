const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const SDB = process.env.DATABASE;

const bcrypt = require(`../libs/bcrypt`);
const jwt = require(`../libs/jwt`);
const mail = require(`../libs/nodemailer`);
const { otpMail } = require('../templates/otpMail');

module.exports._login = async (req, res, next) => {
    try {
        ['username', 'password'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        let [prefix, username] = req.body.username.split('_');
        const DB = await client
            .db(SDB)
            .collection('Business')
            .findOne({ prefix: prefix })
            .then((doc) => {
                if (doc && doc.database_name) {
                    return doc.database_name;
                }
                throw new Error(`400: Tài khoản doanh nghiệp chưa được đăng ký!`);
            });
        req.body.username = username.toLowerCase();
        let [user] = await client
            .db(DB)
            .collection(`Users`)
            .aggregate([
                { $match: { username: req.body.username } },
                {
                    $lookup: {
                        from: 'Roles',
                        localField: 'role_id',
                        foreignField: 'role_id',
                        as: '_role',
                    },
                },
                { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'Branchs',
                        localField: 'branch_id',
                        foreignField: 'branch_id',
                        as: '_branch',
                    },
                },
                { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'Stores',
                        localField: 'store_id',
                        foreignField: 'store_id',
                        as: '_store',
                    },
                },
                { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
            ])
            .toArray();
        if (!user) {
            throw new Error(`400: Tài khoản không tồn tại!`);
        }
        if (user.active == false) {
            throw new Error(`400: Tài khoản chưa được kích hoạt!`);
        }
        if (user.active == `banned`) {
            throw new Error(`400: Tài khoản đã bị chặn bởi ADMIN!`);
        }
        if (!bcrypt.compare(req.body.password, user.password)) {
            throw new Error(`400: Mật khẩu không chính xác!`);
        }
        delete user.password;
        let [accessToken, refreshToken, _update] = await Promise.all([
            jwt.createToken({ ...user, database: DB }, 24 * 60 * 60),
            jwt.createToken({ ...user, database: DB }, 30 * 24 * 60 * 60),
            client
                .db(DB)
                .collection(`Users`)
                .updateOne({ user_id: Number(user.user_id) }, { $set: { last_login: moment().tz(TIMEZONE).format() } }),
        ]);
        res.send({
            success: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports._refreshToken = async (req, res, next) => {
    try {
        ['refreshToken'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        try {
            let decoded = await jwt.verifyToken(req.body.refreshToken);
            let user = decoded.data;
            let accessToken = await jwt.createToken(user);
            res.send({ success: true, accessToken });
        } catch (error) {
            throw new Error(`400: Refresh token không chính xác!`);
        }
    } catch (err) {
        next(err);
    }
};

module.exports._checkVerifyLink = async (req, res, next) => {
    try {
        ['UID'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        let link = await client.db(DB).collection(`VerifyLinks`).findOne({
            UID: req.body.UID,
        });
        if (!link) {
            throw new Error('400: UID không tồn tại!');
        }
        res.send({ success: true, data: link });
    } catch (err) {
        next(err);
    }
};

module.exports._getOTP = async (req, res, next) => {
    try {
        ['username'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        req.body.username = String(req.body.username).toLowerCase();
        let user = await client.db(DB).collection(`Users`).findOne({ username: req.body.username });
        if (!user) {
            throw new Error('400: Tài khoản không tồn tại!');
        }
        let otpCode = String(Math.random()).substr(2, 6);
        await Promise.all(mail.sendMail(user.email, 'Mã xác thực', otpMail(otpCode)));
        await client
            .db(DB)
            .collection(`Users`)
            .updateOne(
                { user_id: Number(user.user_id) },
                {
                    $set: {
                        otp_code: otp.otp_code,
                        otp_timelife: moment().tz(TIMEZONE).add(5, 'minutes').format(),
                    },
                }
            );
        res.send({ success: true, data: `Gửi OTP đến email thành công!` });
    } catch (err) {
        next(err);
    }
};

module.exports._verifyOTP = async (req, res, next) => {
    try {
        ['username', 'otp_code'].map((e) => {
            if (!req.body[e]) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        req.body.username = req.body.username.toLowerCase();
        let user = await client
            .db(SDB)
            .collection('Users')
            .findOne({
                username: req.body.username,
                otp_code: req.body.otp_code,
                otp_timelife: { $gte: moment().tz(TIMEZONE).format() },
            });
        if (!user) {
            throw new Error(`400: Tài khoản không tồn tại, mã OTP không chính xác hoặc đã hết hạn sử dụng!`);
        }
        if (user.active == false) {
            await client
                .db(SDB)
                .collection('Users')
                .updateOne(
                    {
                        system_user_id: user.system_user_id,
                    },
                    {
                        $set: {
                            otp_code: false,
                            otp_timelife: false,
                            active: true,
                        },
                    }
                );
            await client
                .db(`${req.body.username}Database`)
                .collection('Users')
                .updateOne(
                    {
                        system_user_id: user.system_user_id,
                    },
                    {
                        $set: {
                            otp_code: false,
                            otp_timelife: false,
                            active: true,
                        },
                    }
                );
            res.send({ success: true, message: 'Kích hoạt tài khoản thành công!' });
        } else {
            await client
                .db(DB)
                .collection('Users')
                .updateOne(
                    {
                        user_id: Number(user.user_id),
                    },
                    {
                        $set: { otp_code: true, otp_timelife: true },
                    }
                );
            res.send({ success: true, message: `Mã OTP chính xác, xác thực thành công!` });
        }
    } catch (err) {
        next(err);
    }
};
