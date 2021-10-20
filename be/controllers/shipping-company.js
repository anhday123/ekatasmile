const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const shippingCompanyService = require(`../services/shipping-company`);
const { ShippingCompany } = require(`../models/shipping-company`);

let getShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await shippingCompanyService.getShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _shippingCompany = new ShippingCompany();
        _shippingCompany.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, shippingCompany] = await Promise.all([
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
                .collection(`ShippingCompanies`)
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
        if (shippingCompany) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _shippingCompany.create({
            ...req.body,
            ...{
                store_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _shippingCompany;
        await shippingCompanyService.addShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.store_id = ObjectId(req.params.store_id);
        let _shippingCompany = new ShippingCompany();
        req.body.name = req.body.name.trim().toUpperCase();
        let shippingCompany = await client.db(DB).collection(`ShippingCompanies`).findOne(req.params);
        if (!shippingCompany) {
            throw new Error(`400: shipping_company_id <${req.params.shipping_company_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`ShippingCompanies`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    shipping_company_id: { $ne: store.shipping_company_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
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
