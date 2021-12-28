const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const supplierService = require(`../services/supplier`);
const { Supplier } = require('../models/supplier');

let getSupplierC = async (req, res, next) => {
    try {
        await supplierService.getSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addSupplierC = async (req, res, next) => {
    try {
        let _supplier = new Supplier();
        _supplier.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let supplier = await client
            .db(DB)
            .collection(`Suppliers`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let supplierMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Suppliers' });
        if (supplier) {
            throw new Error(`400: Nhà cung cấp đã tồn tại!`);
        }
        let supplier_id = (() => {
            if (supplierMaxId) {
                if (supplierMaxId.value) {
                    return Number(supplierMaxId.value);
                }
            }
            return 0;
        })();
        supplier_id++;
        _supplier.create({
            ...req.body,
            ...{
                supplier_id: Number(supplier_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Suppliers' }, { $set: { name: 'Suppliers', value: supplier_id } }, { upsert: true });
        req[`_insert`] = _supplier;
        await supplierService.addSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateSupplierC = async (req, res, next) => {
    try {
        req.params.supplier_id = Number(req.params.supplier_id);
        let _supplier = new Supplier();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let supplier = await client.db(DB).collection(`Suppliers`).findOne(req.params);
        if (!supplier) {
            throw new Error(`400: Nhà cung cấp không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Suppliers`)
                .findOne({
                    business_id: Number(req.user.supplier_id),
                    supplier_id: { $ne: Number(supplier.supplier_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Nhà cung cấp đã tồn tại!`);
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

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Suppliers`)
            .deleteMany({ supplier_id: { $in: req.body.supplier_id } });
        res.send({
            success: true,
            message: 'Xóa nhà cung cấp thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addSupplierC,
    getSupplierC,
    updateSupplierC,
    _delete,
};
