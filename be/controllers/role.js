const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const roleService = require(`../services/role`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_role`)) throw new Error(`400 ~ Forbidden!`);
        await roleService.getRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_role`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        if (createSub(req.body.name) == `admin` || createSub(req.body.name) == `business`) {
            throw new Error(`400 ~ Forbidden!`);
        }
        let [_counts, _business, _role] = await Promise.all([
            client.db(DB).collection(`Roles`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Roles`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_role) throw new Error(`400 ~ Role name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`role_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _role = {
            role_id: req.body.role_id,
            business_id: req.body.business_id,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            permission_list: req.body.permission_list || [],
            menu_list: req.body.menu_list || [],
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _role;
        await roleService.addRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_role`)) throw new Error(`400 ~ Forbidden!`);
        let _role = await client.db(DB).collection(`Roles`).findOne(req.params);
        if (!_role) throw new Error(`400 ~ Role is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
            let _check = await client
                .db(DB)
                .collection(`Roles`)
                .findOne({
                    role_id: { $ne: _role.role_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400 ~ Role name was exists!`);
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
