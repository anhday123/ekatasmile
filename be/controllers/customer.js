const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const customerService = require(`../services/customer`);
const { Customer } = require('../models/customer');

let getCustomerC = async (req, res, next) => {
    try {
        await customerService.getCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCustomerC = async (req, res, next) => {
    try {
        let _customer = new Customer();
        _customer.validateInput(req.body);
        let customer = await client
            .db(DB)
            .collection(`Customers`)
            .findOne({
                business_id: Number(req.user.business_id),
                phone: req.body.phone,
            });
        let customerMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Customers' });
        if (customer) {
            throw new Error(`400: Số điện thoại đã tồn tại!`);
        }
        let customer_id = (() => {
            if (customerMaxId) {
                if (customerMaxId.value) {
                    return Number(customerMaxId.value);
                }
            }
            return 0;
        })();
        customer_id++;
        _customer.create({
            ...req.body,
            ...{
                customer_id: Number(customer_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Customers' }, { $set: { name: 'Customers', value: customer_id } }, { upsert: true });
        req[`_insert`] = _customer;
        await customerService.addCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCustomerC = async (req, res, next) => {
    try {
        req.params.customer_id = Number(req.params.customer_id);
        let _customer = new Customer();
        req.body.phone = String(req.body.phone).trim().toUpperCase();
        let customer = await client.db(DB).collection(`Customers`).findOne(req.params);
        if (!customer) {
            throw new Error(`400: Khách hàng không tồn tại!`);
        }
        if (req.body.phone) {
            let check = await client
                .db(DB)
                .collection(`Customers`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    customer_id: { $ne: Number(customer.customer_id) },
                    phone: req.body.phone,
                });
            if (check) {
                throw new Error(`400: Số điện thoại đã tồn tại!`);
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

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Customers`)
            .deleteMany({ customer_id: { $in: req.body.customer_id } });
        res.send({
            success: true,
            message: 'Xóa khách hàng thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCustomerC,
    addCustomerC,
    updateCustomerC,
};
