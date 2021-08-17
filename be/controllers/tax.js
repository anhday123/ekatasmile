const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/tax`);
const taxService = require(`../services/tax`);

let getTaxC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getTax))
            throw new Error(`400 ~ Validate data wrong!`);
        await taxService.getTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addTax))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _tax] = await Promise.all([
            client.db(DB).collection(`Taxes`).countDocuments(),
            client
                .db(DB)
                .collection(`Taxes`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Taxes`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_tax) throw new Error(`400 ~ Tax name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`tax_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _tax = {
            tax_id: req.body.tax_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            value: req.body.value,
            description: req.body.description,
            default: req.body.default,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_tax`] = _tax;
        await taxService.addTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _tax = await client.db(DB).collection(`Taxes`).findOne(req.params);
        if (!_tax) throw new Error(`400 ~ Tax is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Taxs`)
                .findOne({
                    tax_id: { $ne: _tax.tax_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Tax name was exists!`);
        }
        delete req.body._id;
        delete req.body.tax_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
