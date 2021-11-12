const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const shippingCompanyService = require(`../services/shipping-company`);
const { ShippingCompany } = require(`../models/shipping-company`);

let getShippingCompanyC = async (req, res, next) => {
    try {
        await shippingCompanyService.getShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addShippingCompanyC = async (req, res, next) => {
    try {
        let _shippingCompany = new ShippingCompany();
        _shippingCompany.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let shippingCompany = await client
            .db(DB)
            .collection(`ShippingCompanies`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let shippingCompanyMaxId = await client
            .db(DB)
            .collection('AppSetting')
            .findOne({ name: 'ShippingCompanies' });
        if (shippingCompany) {
            throw new Error(`400: Đối tác vận chuyển đã tồn tại!`);
        }
        let shipping_company_id = (() => {
            if (shippingCompanyMaxId) {
                if (shippingCompanyMaxId.value) {
                    return Number(shippingCompanyMaxId.value);
                }
            }
            return 0;
        })();
        shipping_company_id++;
        _shippingCompany.create({
            ...req.body,
            ...{
                shipping_company_id: Number(shipping_company_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'ShippingCompanies' },
                { $set: { name: 'ShippingCompanies', value: shipping_company_id } },
                { upsert: true }
            );
        req[`_insert`] = _shippingCompany;
        await shippingCompanyService.addShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateShippingCompanyC = async (req, res, next) => {
    try {
        req.params.shipping_company_id = Number(req.params.shipping_company_id);
        let _shippingCompany = new ShippingCompany();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let shippingCompany = await client.db(DB).collection(`ShippingCompanies`).findOne(req.params);
        if (!shippingCompany) {
            throw new Error(`400: Đối tác vận chuyển không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`ShippingCompanies`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    shipping_company_id: { $ne: Number(shippingCompany.shipping_company_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Đối tác vận chuyển đã tồn tại!`);
            }
        }
        _shippingCompany.create(shippingCompany);
        _shippingCompany.update(req.body);
        req['_update'] = _shippingCompany;
        await shippingCompanyService.updateShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getShippingCompanyC,
    addShippingCompanyC,
    updateShippingCompanyC,
};
