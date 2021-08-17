const moment = require(`moment`);

const client = require(`../../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let otp = async (req, res, next) => {
    try {
        let _username = req.body.username;
        if (_username) {
            delete req.body.username;
            let _user = await client.db(DB).collection(`Users`).findOne({
                username: _username,
            });
            if (!_user || _user.otp_code != true)
                throw new Error(`400 ~ Unauthorized!`);
            req[`otpData`] = _user;
            next();
        } else {
            throw new Error(`400 ~  Forbidden!`);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { otp };
