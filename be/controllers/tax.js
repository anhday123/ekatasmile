const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const taxService = require(`../services/tax`);
const { Tax } = require('../models/tax');

let getTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await taxService.getTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _tax = new Tax();
        _tax.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, tax] = await Promise.all([
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
                .collection(`Taxes`)
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
        if (tax) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _tax.create({
            ...req.body,
            ...{
                tax_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _tax;
        await taxService.addTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.tax_id = ObjectId(req.params.tax_id);
        let _tax = new Tax();
        req.body.name = req.body.name.trim().toUpperCase();
        let tax = await client.db(DB).collection(`Taxes`).findOne(req.params);
        if (!tax) {
            throw new Error(`400: tax_id <${req.params.tax_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Taxs`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    tax_id: { $ne: tax.tax_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        _tax.create(tax);
        _tax.update(req.body);
        req['_update'] = _tax;
        await taxService.updateTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTaxC,
    addTaxC,
    updateTaxC,
};
