const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);

const actionService = require(`../services/action`);

module.exports._get = async (req, res, next) => {
    try {
        await actionService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};
