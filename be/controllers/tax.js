const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/tax`);
const taxService = require(`../services/tax`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_tax`)) throw new Error(`400 ~ Forbidden!`);
        if (!valid.relative(req.query, form.getTax)) throw new Error(`400 ~ Validate data wrong!`);
        await taxService.getTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_tax`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(tax, form.addTax)) throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _tax] = await Promise.all([
            client.db(DB).collection(`Taxes`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Taxes`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_tax) throw new Error(`400 ~ Tax name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`tax_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _tax = {
            tax_id: req.body.tax_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            value: req.body.value,
            description: req.body.description,
            default: req.body.default || false,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _tax;
        await taxService.addTaxS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTaxC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_tax`)) throw new Error(`400 ~ Forbidden!`);
        let _tax = await client.db(DB).collection(`Taxes`).findOne(req.params);
        if (!_tax) throw new Error(`400 ~ Tax is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
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
        req['_update'] = { ..._tax, ...req.body };
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
