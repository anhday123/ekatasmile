const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');

const bcrypt = require(`../libs/bcrypt`);
const jwt = require(`../libs/jwt`);
const mail = require(`../libs/otp`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { activeUser } = require('./user');

let loginC = async (req, res, next) => {
    try {
        if (!req.body.username) {
            throw new Error('400: username không được để trống!');
        }
        if (!req.body.password) {
            throw new Error('400: password không được để trống!');
        }
        req.body.username = req.body.username.toLowerCase();
        let [user] = await client
            .db(DB)
            .collection(`Users`)
            .aggregate([
                { $match: { username: req.body.username, delete: false } },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: 'user_id',
                        as: '_business',
                    },
                },
                { $project: { '_business.password': 0 } },
                { $unwind: { path: '$_business', preserveNullAndEmptyArrays: true } },
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
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'creator_id',
                        foreignField: 'user_id',
                        as: '_creator',
                    },
                },
                { $project: { '_creator.password': 0 } },
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } },
            ])
            .toArray();
        if (!user) {
            throw new Error(`400: User <${req.body.username}> không tồn tại!`);
        }
        if (user.active == false) {
            throw new Error(`400: User <${req.body.username}> chưa được kích hoạt!`);
        }
        if (user.active == `banned`) {
            throw new Error(`400: User <${req.body.username}> đã bị chặn bởi ADMIN!`);
        }
        if (!bcrypt.compare(req.body.password, user.password)) {
            throw new Error(`400: Mật khẩu không chính xác!`);
        }
        delete user.password;
        let [accessToken, refreshToken, _update] = await Promise.all([
            jwt.createToken(user, process.env.ACCESS_TOKEN_LIFE),
            jwt.createToken(user, process.env.REFRESH_TOKEN_LIFE),
            client
                .db(DB)
                .collection(`Users`)
                .findOneAndUpdate(
                    { _id: ObjectId(user._id) },
                    { $set: { last_login: moment().utc().format() } }
                ),
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

let refreshTokenC = async (req, res, next) => {
    try {
        if (!req.body.refreshToken) {
            throw new Error(`400: refreshToken không được để trống!`);
        }
        try {
            let decoded = await jwt.verifyToken(req.body.refreshToken);
            let userData = decoded.data;
            let accessToken = await jwt.createToken(userData, process.env.ACCESS_TOKEN_LIFE);
            res.send({ success: true, accessToken });
        } catch (error) {
            throw new Error(`400: Refresh token không chính xác!`);
        }
    } catch (err) {
        next(err);
    }
};

let checkLinkVertifyC = async (req, res, next) => {
    try {
        if (!req.body.UID) {
            throw new Error(`400: UID không được để trống!`);
        }
        let link = await client.db(DB).collection(`VertifyLinks`).findOne({
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

let getOTPC = async (req, res, next) => {
    try {
        if (!req.body.username) {
            throw new Error(`400: username không được để trống!`);
        }
        let user = await client
            .db(DB)
            .collection(`Users`)
            .findOne({ username: req.body.username, delete: false });
        if (!user) {
            throw new Error('400: Tài khoản không tồn tại!');
        }
        let otp = await mail.sendOTP(user.email);
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(
                { _id: ObjectId(user._id) },
                {
                    $set: {
                        otp_code: otp.otp_code,
                        otp_timelife: moment().utc().add(process.env.OTP_TIMELIFE, 'minutes').format(),
                    },
                }
            );
        res.send({ success: true, data: `Gửi OTP đến email <${user.email}> thành công!` });
    } catch (err) {
        next(err);
    }
};

let vertifyOTPC = async (req, res, next) => {
    try {
        if (!req.body.username) {
            throw new Error(`400: username không được để trống!`);
        }
        if (!req.body.otp_code) {
            throw new Error(`400: otp_code không được để trống!`);
        }
        req.body.username = req.body.username.trim().toLowerCase();
        let user = await client
            .db(DB)
            .collection('Users')
            .findOne({
                username: req.body.username,
                otp_code: req.body.otp_code,
                otp_timelife: { $gte: moment().utc().format() },
                delete: false,
            });
        if (!user) {
            throw new Error(`400: Tài khoản không tồn tại, mã OTP không chính xác hoặc đã hết hạn sử dụng!`);
        }
        if (user.active == false) {
            await client
                .db(DB)
                .collection('Users')
                .updateOne(
                    {
                        user_id: ObjectId(user.user_id),
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
                        user_id: ObjectId(user.user_id),
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

module.exports = {
    loginC,
    refreshTokenC,
    checkLinkVertifyC,
    getOTPC,
    vertifyOTPC,
};
