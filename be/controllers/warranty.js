const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const warrantyService = require(`../services/warranty`);
const { Warranty } = require('../models/warranty');

let getWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await warrantyService.getWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _warranty = new Warranty();
        _warranty.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, warranty] = await Promise.all([
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
                .collection(`Warranties`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name,
                    delete: false,
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (warranty) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _warranty.create({
            ...req.body,
            ...{
                warranty_id: ObjectId,
                business_id: business.user_id,
                create_date: moment().utc().format(),
                creator_id: token.user_id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _warranty;
        await warrantyService.addWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.warranty_id = ObjectId(req.params.warranty_id);
        let _warranty = new Warranty();
        req.body.name = req.body.name.trim().toUpperCase();
        let warranty = await client.db(DB).collection(`Warranties`).findOne(req.params);
        if (!warranty) {
            throw new Error(`400: warranty_id <${req.params.warranty_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Warranties`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    warranty_id: { $ne: warranty.warranty_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        _warranty.create(warranty);
        _warranty.update(req.body);
        req['_update'] = _warranty;
        await warrantyService.updateWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWarrantyC,
    addWarrantyC,
    updateWarrantyC,
};
