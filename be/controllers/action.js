const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const actionService = require(`../services/action`);

let getActionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await actionService.getActionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionC,
};
