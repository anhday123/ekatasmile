const jwt = require(`jsonwebtoken`);
const key = process.env.TOKEN_KEY;

let createToken = (tokenData, tokenLife) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { data: tokenData },
            key,
            {
                algorithm: `HS256`,
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            }
        );
    });
};

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
};

module.exports = { createToken, verifyToken };
