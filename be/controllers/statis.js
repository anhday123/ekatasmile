const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

// const valid = require(`../middleware/validate/validate`);
// const form = require(`../middleware/validate/action`);
const statisService = require(`../services/statis`);

let getStatisC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_statis`)) throw new Error(`400 ~ Forbidden!`);
        await statisService.getStatisS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStatisC,
};
