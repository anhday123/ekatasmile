const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const branchService = require(`../services/branch`);
const { Branch } = require('../models/branch');

let getBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await branchService.getBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _branch = new Branch();
        _branch.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, branch] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name,
                    delete: false,
                }),
        ]);
        if (!business) {
            throw new Error(`400: business_id <${token.business_id}> không khả dụng!`);
        }
        if (branch) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _branch.create({
            ...req.body,
            ...{
                branch_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _branch;
        await branchService.addBranchS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBranchC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.branch_id = ObjectId(req.params.branch_id);
        let _branch = new Branch();
        req.body.name = req.body.name.trim().toUpperCase();
        let branch = await client.db(DB).collection(`Branchs`).findOne(req.params);
        if (!branch) {
            throw new Error(`400: branch_id <${req.params.branch_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    branch_id: { $ne: req.params.branch_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        _branch.create(branch);
        _branch.update(req.body);
        req[`_update`] = _branch;
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
