const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const customerService = require(`../services/customer`);
const { Customer } = require('../models/customer');

let getCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await customerService.getCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _customer = new Customer();
        _customer.validateInput(req.body);
        let [business, customer] = await Promise.all([
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
                .collection(`Customers`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    phone: req.body.phone,
                    delete: false,
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (customer) {
            throw new Error(`400: phone <${req.body.phone}> đã tồn tại!`);
        }
        _customer.create({
            ...req.body,
            ...{
                customer_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _customer;
        await customerService.addCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.customer_id = ObjectId(req.params.customer_id);
        let _customer = new Customer();
        req.body.phone = req.body.phone.trim().toUpperCase();
        let customer = await client.db(DB).collection(`Customers`).findOne(req.params);
        if (!customer) {
            throw new Error(`400: customer_id <${req.params.customer_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Customers`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    customer_id: { $ne: tax.customer_id },
                    phone: req.body.phone,
                });
            if (check) {
                throw new Error(`400: phone <${req.body.phone}> đã tồn tại!`);
            }
        }
        _customer.create(customer);
        _customer.update(req.body);
        req['_update'] = _customer;
        await customerService.updateCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCustomerC,
    addCustomerC,
    updateCustomerC,
};
