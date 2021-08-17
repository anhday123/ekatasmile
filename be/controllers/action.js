const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/action`);
const actionService = require(`../services/action`);

let getActionC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getAction))
            throw new Error(`400 ~ Validate data wrong!`);
        await actionService.getActionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionC,
};
