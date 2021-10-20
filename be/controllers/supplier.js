const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const supplierService = require(`../services/supplier`);
const { Supplier } = require('../models/supplier');

let getSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await supplierService.getSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _supplier = new Supplier();
        _supplier.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, supplier] = await Promise.all([
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
                .collection(`Suppliers`)
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
        if (supplier) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _supplier.create({
            ...req.body,
            ...{
                supplier_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _supplier;
        await supplierService.addSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.supplier_id = ObjectId(req.params.supplier_id);
        let _supplier = new Supplier();
        req.body.name = req.body.name.trim().toUpperCase();
        let supplier = await client.db(DB).collection(`Suppliers`).findOne(req.params);
        if (!tax) {
            throw new Error(`400: tax_id <${req.params.tax_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Suppliers`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    supplier_id: { $ne: tax.supplier_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        _supplier.create(supplier);
        _supplier.update(req.body);
        req['_update'] = _supplier;
        await supplierService.updateSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addSupplierC,
    getSupplierC,
    updateSupplierC,
};
