const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/branch`);
const branchService = require(`../services/branch`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_branch`)) throw new Error(`400 ~ Forbidden!`);
        await branchService.getBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_branch`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(req.body, form.addBranch)) throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _branch] = await Promise.all([
            client.db(DB).collection(`Branchs`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Branchs`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_branch) throw new Error(`400 ~ Branch name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`branch_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _branch = {
            branch_id: req.body.branch_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            logo: req.body.logo || ``,
            phone: req.body.phone || ``,
            email: req.body.email || ``,
            fax: req.body.fax || ``,
            website: req.body.website || ``,
            latitude: req.body.latitude || ``,
            longtitude: req.body.longtitude || ``,
            warehouse_type: req.body.warehouse_type || `Sở hữu`,
            sub_warehouse_type: createSub(req.body.warehouse_type),
            address: req.body.address || ``,
            sub_address: createSub(req.body.address),
            district: req.body.district || ``,
            sub_district: createSub(req.body.district),
            province: req.body.province || ``,
            sub_province: createSub(req.body.province),
            use_point: req.body.use_point || false,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _branch;
        await branchService.addBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_branch`)) throw new Error(`400 ~ Forbidden!`);
        let _branch = await client.db(DB).collection(`Branchs`).findOne(req.params);
        if (!_branch) throw new Error(`400 ~ Branch is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
            let _check = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    branch_id: { $ne: _branch.branch_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400 ~ Branch name was exists!`);
        }
        if (req.body.address) {
            req.body[`sub_address`] = createSub(req.body.address);
        }
        if (req.body.district) {
            req.body[`sub_district`] = createSub(req.body.district);
        }
        if (req.body.province) {
            req.body[`sub_province`] = createSub(req.body.province);
        }
        delete req.body._id;
        delete req.body.branch_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._bussiness;
        delete req.body._creator;
        req[`_update`] = { ..._branch, ...req.body };
        await branchService.updateBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBranchC,
    addBranchC,
    updateBranchC,
};
