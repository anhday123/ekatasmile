const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const warrantyService = require(`../services/warranty`);
const { Warranty } = require('../models/warranty');

let getWarrantyC = async (req, res, next) => {
    try {
        await warrantyService.getWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarrantyC = async (req, res, next) => {
    try {
        let _warranty = new Warranty();
        _warranty.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let warranty = await client
            .db(DB)
            .collection(`Warranties`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let warrantyMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Warranties' });
        if (warranty) {
            throw new Error(`400: Chương trình bảo hành đã tồn tại!`);
        }
        let warranty_id = (() => {
            if (warrantyMaxId) {
                if (warrantyMaxId.value) {
                    return Number(warrantyMaxId.value);
                }
            }
            return 0;
        })();
        warranty_id++;
        _warranty.create({
            ...req.body,
            ...{
                warranty_id: Number(warranty_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Warranties' }, { $set: { name: 'Warranties', value: warranty_id } }, { upsert: true });
        req[`_insert`] = _warranty;
        await warrantyService.addWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateWarrantyC = async (req, res, next) => {
    try {
        req.params.warranty_id = Number(req.params.warranty_id);
        let _warranty = new Warranty();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let warranty = await client.db(DB).collection(`Warranties`).findOne(req.params);
        if (!warranty) {
            throw new Error(`400: Chương trình bảo hành không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Warranties`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    warranty_id: { $ne: Number(warranty.warranty_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Chương trình bảo hành đã tồn tại!`);
            }
        }
        _warranty.create(warranty);
        _warranty.update(req.body);
        req['_update'] = _warranty;
        await warrantyService.updateWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Warranties`)
            .deleteMany({ warranty_id: { $in: req.body.warranty_id } });
        res.send({
            success: true,
            message: 'Xóa chương trình bảo hành thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWarrantyC,
    addWarrantyC,
    updateWarrantyC,
    _delete,
};
