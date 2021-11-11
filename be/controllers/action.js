const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const actionService = require(`../services/action`);

let getActionC = async (req, res, next) => {
    try {
        await actionService.getActionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionC,
};
