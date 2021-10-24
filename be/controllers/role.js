const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const roleService = require(`../services/role`);
const { Role } = require('../models/role');

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await roleService.getRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _role = new Role();
        _role.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        _role.validateName(req.body);
        let [business, role] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Roles`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name.trim().toUpperCase(),
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (role) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _role.create({
            ...req.body,
            ...{
                role_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _role;
        await roleService.addRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_role`)) throw new Error(`400: Forbidden!`);
        let _role = await client.db(DB).collection(`Roles`).findOne(req.params);
        if (!_role) throw new Error(`400: Role is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = removeUnicode(req.body.name).toLocaleLowerCase();
            let _check = await client
                .db(DB)
                .collection(`Roles`)
                .findOne({
                    role_id: { $ne: _role.role_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400: Role name was exists!`);
        }
        delete req.body._id;
        delete req.body.role_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._role, ...req.body };
        await roleService.updateRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getRoleC,
    addRoleC,
    updateRoleC,
};
