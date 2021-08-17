const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/role`);
const roleService = require(`../services/role`);

let getRoleC = async (req, res, next) => {
    try {
        await roleService.getRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addRoleC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addRole))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _role] = await Promise.all([
            client.db(DB).collection(`Roles`).countDocuments(),
            client
                .db(DB)
                .collection(`Roles`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Roles`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_role) throw new Error(`400 ~ Role name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`role_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _role = {
            role_id: req.body.role_id,
            bussiness: req.body.bussiness,
            name: req.body.name,
            permission_list: req.body.permission_list,
            menu_list: req.body.menu_list,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_role`] = _role;
        await roleService.addRoleS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateRoleC = async (req, res, next) => {
    try {
        let _role = await client.db(DB).collection(`Roles`).findOne(req.params);
        if (!_role) throw new Error(`400 ~ Role is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Roles`)
                .findOne({
                    role_id: { $ne: _role.role_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Role name was exists!`);
        }
        delete req.body._id;
        delete req.body.role_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
