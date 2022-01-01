const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const branchService = require(`../services/branch`);
const { Branch } = require('../models/branch');

let getBranchC = async (req, res, next) => {
    try {
        await branchService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addBranchC = async (req, res, next) => {
    try {
        let _branch = new Branch();
        _branch.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let branch = await client
            .db(DB)
            .collection(`Branchs`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let branchMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Branchs' });
        if (branch) {
            throw new Error(`400: Chi nhánh đã tồn tại!`);
        }
        let branch_id = (() => {
            if (branchMaxId) {
                if (branchMaxId.value) {
                    return Number(branchMaxId.value);
                }
            }
            return 0;
        })();
        branch_id++;
        _branch.create({
            ...req.body,
            ...{
                branch_id: Number(branch_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Branchs' }, { $set: { name: 'Branchs', value: branch_id } }, { upsert: true });
        req[`_insert`] = _branch;
        await branchService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBranchC = async (req, res, next) => {
    try {
        req.params.branch_id = Number(req.params.branch_id);
        let _branch = new Branch();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let branch = await client.db(DB).collection(`Branchs`).findOne(req.params);
        if (!branch) {
            throw new Error(`400: Chi nhánh không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    branch_id: { $ne: Number(req.params.branch_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Chi nhánh đã tồn tại!`);
            }
        }
        _branch.create(branch);
        _branch.update(req.body);
        req[`_update`] = _branch;
        await branchService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Branchs`)
            .deleteMany({ branch_id: { $in: req.body.branch_id } });
        res.send({
            success: true,
            message: 'Xóa chi nhánh thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBranchC,
    addBranchC,
    updateBranchC,
    _delete,
};
