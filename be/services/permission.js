const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getPermissionS = async (req, res, next) => {
    try {
        let _permission = await client.db(DB).collection(`Permissions`).findOne({ name: `permission` });
        res.send({ success: true, data: _permission });
    } catch (err) {
        next(err);
    }
};

let addPermissionS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Permissions`).findOneAndUpdate({ name: `permission` }, { $set: req._permission });
        res.send({ success: true, data: req._permission });
    } catch (err) {
        next(err);
    }
};

let getMenuS = async (req, res, next) => {
    try {
        let _menu = await client.db(DB).collection(`Permissions`).findOne({ name: `menu` });
        res.send({ success: true, data: _menu });
    } catch (err) {
        next(err);
    }
};

let addMenuS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Permissions`).findOneAndUpdate({ name: `menu` }, { $set: req._menu });
        res.send({ success: true, data: req._menu });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPermissionS,
    addPermissionS,
    getMenuS,
    addMenuS,
};
