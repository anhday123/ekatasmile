const jwt = require(`../libs/jwt`);

let auth = async (req, res, next) => {
    try {
        let token = req.headers[`authorization`];
        if (token) {
            try {
                const decoded = await jwt.verifyToken(token);
                req[`user`] = decoded;
                next();
            } catch (error) {
                throw new Error(`400: Unauthorized!`);
            }
        } else {
            throw new Error(`400:  Forbidden!`);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { auth };
