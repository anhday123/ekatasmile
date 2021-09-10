const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const permissionService = require(`../services/permission`);

let getPermissionC = async (req, res, next) => {
    try {
        await permissionService.getPermissionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addPermissionC = async (req, res, next) => {
    try {
        let _permission = {
            permission_list: req.body.permission_list,
        };
        req[`_permission`] = _permission;
        await permissionService.addPermissionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let getMenuC = async (req, res, next) => {
    try {
        await permissionService.getMenuS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addMenuC = async (req, res, next) => {
    try {
        let _menu = {
            menu_list: req.body.menu_list,
        };
        req[`_menu`] = _menu;
        await permissionService.addMenuS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPermissionC,
    addPermissionC,
    getMenuC,
    addMenuC,
};
