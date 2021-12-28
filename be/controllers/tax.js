const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const taxService = require(`../services/tax`);
const { Tax } = require('../models/tax');

let getTaxC = async (req, res, next) => {
    try {
        await taxService.getTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTaxC = async (req, res, next) => {
    try {
        let _tax = new Tax();
        _tax.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let tax = await client
            .db(DB)
            .collection(`Taxes`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let taxMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Taxes' });
        if (tax) {
            throw new Error(`400: Thuế đã tồn tại!`);
        }
        let tax_id = (() => {
            if (taxMaxId) {
                if (taxMaxId.value) {
                    return Number(taxMaxId.value);
                }
            }
            return 0;
        })();
        tax_id++;
        _tax.create({
            ...req.body,
            ...{
                tax_id: Number(tax_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Taxes' }, { $set: { name: 'Taxes', value: tax_id } }, { upsert: true });
        req[`_insert`] = _tax;
        await taxService.addTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTaxC = async (req, res, next) => {
    try {
        req.params.tax_id = Number(req.params.tax_id);
        let _tax = new Tax();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let tax = await client.db(DB).collection(`Taxes`).findOne(req.params);
        if (!tax) {
            throw new Error(`400: Thuế không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Taxs`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    tax_id: { $ne: Number(tax.tax_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Thuế đã tồn tại!`);
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

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Taxes`)
            .deleteMany({ tax_id: { $in: req.body.tax_id } });
        res.send({
            success: true,
            message: 'Xóa thuế thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTaxC,
    addTaxC,
    updateTaxC,
    _delete,
};
