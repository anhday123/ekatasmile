const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

// const valid = require(`../middleware/validate/validate`);
// const form = require(`../middleware/validate/action`);
const statisService = require(`../services/statis`);

let getStatisC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getStatis))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await statisService.getStatisS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStatisC,
};
