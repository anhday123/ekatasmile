const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const roleService = require(`../services/role`);
const { Role } = require('../models/role');

let getRoleC = async (req, res, next) => {
    try {
        await roleService.getRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addRoleC = async (req, res, next) => {
    try {
        let _role = new Role();
        _role.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        _role.validateName(req.body);
        let role = await client
            .db(DB)
            .collection(`Roles`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let roleMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Roles' });
        if (role) {
            throw new Error(`400: Vai trò đã tồn tại!`);
        }
        let role_id = (() => {
            if (roleMaxId) {
                if (roleMaxId.value) {
                    return Number(roleMaxId.value);
                }
            }
            return 0;
        })();
        role_id++;
        _role.create({
            ...req.body,
            ...{
                role_id: Number(role_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Roles' }, { $set: { name: 'Roles', value: role_id } }, { upsert: true });
        req[`_insert`] = _role;
        await roleService.addRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateRoleC = async (req, res, next) => {
    try {
        req.params.role_id = Number(req.params.role_id);
        let _role = new Role();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let role = await client.db(DB).collection(`Roles`).findOne(req.params);
        console.log(role);
        if (!role) {
            throw new Error(`400: Vai trò không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Roles`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    role_id: { $ne: Number(role.role_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Vai trò đã tồn tại!`);
            }
        }
        _role.create(role);
        _role.update(req.body);
        req['_update'] = _role;
        await roleService.updateRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Roles`)
            .deleteMany({ role_id: { $in: req.body.role_id } });
        res.send({
            success: true,
            message: 'Xóa vai trò thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getRoleC,
    addRoleC,
    updateRoleC,
    _delete,
};
