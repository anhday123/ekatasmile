const moment = require(`moment-timezone`);

const bcrypt = require(`../libs/bcrypt`);
const jwt = require(`../libs/jwt`);
const mail = require(`../libs/otp`);
const client = require(`../config/mongo/mongodb`);
const { activeUser } = require('./user');
const DB = process.env.DATABASE;

let loginC = async (req, res, next) => {
    try {
        ['username', 'password'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body.username = req.body.username.toLowerCase();
        let _user = await client.db(DB).collection(`Users`).findOne({ username: req.body.username });
        if (!_user) {
            throw new Error(`400 ~ User is not exists!`);
        }
        if (_user.active == false) {
            throw new Error(`400 ~ User has not activated!`);
        }
        if (_user.active == `banned`) {
            throw new Error(`400 ~ User had banned by admin!`);
        }
        if (!bcrypt.compare(req.body.password, _user.password)) {
            throw new Error(`400 ~ Wrong password!`);
        }
        [_user[`_business`], _user[`_creator`], _user[`_role`], _user[`_branch`], _user[`_store`]] =
            await Promise.all([
                client.db(DB).collection(`Users`).findOne({ user_id: _user.business_id }),
                client.db(DB).collection(`Users`).findOne({ user_id: _user.creator_id }),
                client.db(DB).collection(`Roles`).findOne({ role_id: _user.role_id }),
                client.db(DB).collection(`Branchs`).findOne({ branch_id: _user.branch_id }),
                client.db(DB).collection(`Stores`).findOne({ store_id: _user.store_id }),
            ]);
        if (!_user._business || _user._business.active != true) {
            throw new Error(`400 ~ Forbidden!`);
        }
        if (_user._business) {
            delete _user._business.password;
        }
        if (_user._creator) {
            delete _user._creator.password;
        }
        delete _user.password;
        let [accessToken, refreshToken, _update] = await Promise.all([
            jwt.createToken(_user, process.env.ACCESS_TOKEN_LIFE),
            jwt.createToken(_user, process.env.REFRESH_TOKEN_LIFE),
            client
                .db(DB)
                .collection(`Users`)
                .findOneAndUpdate(
                    { username: _user.username },
                    { $set: { last_login: moment.tz(`Asia/Ho_Chi_Minh`).format() } }
                ),
        ]);
        res.send({
            success: true,
            data: {
                username: _user.username,
                role: _user._role,
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
        if (!req.body.refreshToken) throw new Error(`400 ~ Validate data wrong!`);
        const { refreshToken } = req.body;
        if (refreshToken) {
            try {
                const decoded = await jwt.verifyToken(refreshToken);
                const userData = decoded.data;
                const accessToken = await jwt.createToken(userData, process.env.ACCESS_TOKEN_LIFE);
                res.send({ success: true, accessToken });
            } catch (error) {
                throw new Error(`400 ~ Invalid refresh token!`);
            }
        } else {
            throw new Error(`400 ~ No token provided!`);
        }
    } catch (err) {
        next(err);
    }
};

let checkLinkVertifyC = async (req, res, next) => {
    try {
        if (!req.body.UID) throw new Error(`400 ~ Validate data wrong!`);
        let _link = await client
            .db(DB)
            .collection(`VertifyLinks`)
            .findOne({
                UID: req.body.UID,
                vertify_timelife: { $gte: moment.tz(`Asia/Ho_Chi_Minh`).format() },
            });
        if (!_link) throw new Error(`400 ~ Link is not exists!`);
        res.send({ success: true, data: _link });
    } catch (err) {
        next(err);
    }
};

let getOTPC = async (req, res, next) => {
    try {
        if (!req.body.username) throw new Error(`400 ~ Validate data wrong!`);
        let _user = await client.db(DB).collection(`Users`).findOne({ username: req.body.username });
        if (!_user) throw new Error(`400 ~ User is not exists!`);
        let otp = await mail.createOtp(_user.email);
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(
                { username: _user.username },
                {
                    $set: {
                        otp_code: otp.otp_code,
                        otp_timelife: otp.otp_timelife,
                    },
                }
            );
        res.send({ success: true, data: `Send OTP success!` });
    } catch (err) {
        next(err);
    }
};

let vertifyOTPC = async (req, res, next) => {
    try {
        if (!req.body.otp_code || !req.body.username) throw new Error(`400 ~ Validate data wrong!`);
        let [otp_code, username] = [req.body[`otp_code`], req.body[`username`]];
        let _user = await client
            .db(DB)
            .collection(`Users`)
            .findOne({
                username: username,
                otp_code: otp_code,
                otp_timelife: { $gte: moment.tz(`Asia/Ho_Chi_Minh`).format() },
            });
        if (!_user) throw new Error(`400 ~ OTP is not correct or expried!`);
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(
                { username: username },
                {
                    $set: {
                        otp_code: true,
                        otp_timelife: true,
                    },
                }
            );
        if (_user.active == false) activeUser(req, res, next);
        else res.send({ success: true, data: `OTP is correct!` });
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
