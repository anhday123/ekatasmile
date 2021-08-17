const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/branch`);
const branchService = require(`../services/branch`);

let getBranchC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getBranch))
            throw new Error(`400 ~ Validate data wrong!`);
        await branchService.getBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addBranch))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _store, _branch] = await Promise.all([
            client.db(DB).collection(`Branchs`).countDocuments(),
            client
                .db(DB)
                .collection(`Branchs`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client
                .db(DB)
                .collection(`Stores`)
                .findOne({ store_id: req.body.store, active: true }),
            client.db(DB).collection(`Branchs`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_branch) throw new Error(`400 ~ Branch name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        if (!_store) throw new Error(`400 ~ Store is not exists or inactive!`);
        req.body[`branch_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _branch = {
            branch_id: req.body.branch_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            phone: req.body.phone,
            latitude: req.body.latitude,
            longtitude: req.body.longtitude,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            store: req.body.store,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_branch`] = _branch;
        await branchService.addBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _branch = await client
            .db(DB)
            .collection(`Branchs`)
            .findOne(req.params);
        if (!_branch) throw new Error(`400 ~ Branch is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    branch_id: { $ne: _branch.branch_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Branch name was exists!`);
        }
        delete req.body._id;
        delete req.body.branch_id;
        delete req.body.bussiness;
        delete req.body.code;
        req.body.store = req.body.store.store_id || req.body.store;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
