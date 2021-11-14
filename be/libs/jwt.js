const jwt = require(`jsonwebtoken`);
const key = require('./key');
// const key = process.env.TOKEN_KEY;

let createToken = (data, timelife) => {
    const payload = {
        ...data,
    };
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                ...payload,
                exp: Math.floor(Date.now()) + timelife * 3600000,
            },
            key.PRIVATEKEY,
            { algorithm: 'RS256' },
            (error, encoded) => {
                if (error) return reject(error);
                return resolve(encoded);
            }
        );
    });
};

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key.PRIVATEKEY, { algorithms: 'RS256' }, (error, decoded) => {
            if (error) return reject(error);
            return resolve(decoded);
        });
    });
};

module.exports = { createToken, verifyToken };
