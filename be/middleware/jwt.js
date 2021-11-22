const jwt = require(`../libs/jwt`);
const client = require(`../config/mongodb`);

let auth = async (req, res, next) => {
    try {
        let token = req.headers[`authorization`];
        if (token) {
            try {
                const decoded = await jwt.verifyToken(token);
                req[`user`] = decoded.data;
                next();
            } catch (error) {
                throw new Error(`400: Unauthorized!`);
            }
        } else {
            throw new Error(`400:  Forbidden!`);
            // var user = await client
            //   .db(process.env.DATABASE)
            //   .collection("Users")
            //   .findOne({ username: "client" });
            // req[`user`] = user;
            // next();
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { auth };
