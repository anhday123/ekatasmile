const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const branchService = require(`../services/branch`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
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
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
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
            sub_name: removeUnicode(req.body.name).toLocaleLowerCase(),
            logo: req.body.logo || ``,
            phone: req.body.phone || ``,
            email: req.body.email || ``,
            fax: req.body.fax || ``,
            website: req.body.website || ``,
            latitude: req.body.latitude || ``,
            longtitude: req.body.longtitude || ``,
            warehouse_type: req.body.warehouse_type || `Sở hữu`,
            sub_warehouse_type: removeUnicode(req.body.warehouse_type || `Sở hữu`).toLocaleLowerCase(),
            address: req.body.address || ``,
            sub_address: removeUnicode(req.body.address || ``).toLocaleLowerCase(),
            district: req.body.district || ``,
            sub_district: removeUnicode(req.body.district || ``).toLocaleLowerCase(),
            province: req.body.province || ``,
            sub_province: removeUnicode(req.body.province || ``).toLocaleLowerCase(),
            accumulate_point: req.body.accumulate_point || false,
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
            req.body[`sub_name`] = removeUnicode(req.body.name).toLocaleLowerCase();
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
            req.body[`sub_address`] = removeUnicode(req.body.address).toLocaleLowerCase();
        }
        if (req.body.district) {
            req.body[`sub_district`] = removeUnicode(req.body.district).toLocaleLowerCase();
        }
        if (req.body.province) {
            req.body[`sub_province`] = removeUnicode(req.body.province).toLocaleLowerCase();
        }
        delete req.body._id;
        delete req.body.branch_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._bussiness;
        delete req.body._creator;
        delete req.body._employees;
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
