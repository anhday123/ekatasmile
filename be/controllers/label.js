const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const labelService = require(`../services/label`);
const { Label } = require('../models/label');

let getLabelC = async (req, res, next) => {
    try {
        await labelService.getLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addLabelC = async (req, res, next) => {
    try {
        let _label = new Label();
        _label.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let label = await client
            .db(DB)
            .collection(`Labels`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let labelMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Labels' });
        if (label) {
            throw new Error(`400: Nhóm cửa hàng đã tồn tại!`);
        }
        let label_id = (() => {
            if (labelMaxId) {
                if (labelMaxId.value) {
                    return Number(labelMaxId.value);
                }
            }
            return 0;
        })();
        label_id++;
        _label.create({
            ...req.body,
            ...{
                label_id: Number(label_id),
                business_id: Number(req.user.user_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Labels' }, { $set: { name: 'Labels', value: label_id } }, { upsert: true });
        req[`_insert`] = _label;
        await labelService.addLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateLabelC = async (req, res, next) => {
    try {
        req.params.label_id = Number(req.params.label_id);
        let _label = new Label();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let label = await client.db(DB).collection(`Labels`).findOne(req.params);
        if (!label) {
            throw new Error(`400: Nhóm cửa hàng không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Labels`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    label_id: { $ne: Number(label.label_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Nhóm cửa hàng đã tồn tại!`);
            }
        }
        _label.create(label);
        _label.update(req.body);
        req['_update'] = _label;
        await labelService.updateLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Labels`)
            .deleteMany({ label_id: { $in: req.body.label_id } });
        res.send({
            success: true,
            message: 'Xóa bài viết thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getLabelC,
    addLabelC,
    updateLabelC,
    _delete,
};
