const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getPaymentC = async (req, res, next) => {
    try {
        let _payment = await client.db(DB).collection(`Payments`).find({}).toArray();
        res.send({ success: true, data: _payment });
    } catch (err) {
        next(err);
    }
};

module.exports = { getPaymentC };
