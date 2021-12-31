const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const actionService = require(`../services/action`);

module.exports._get = async (req, res, next) => {
    try {
        await actionService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};
