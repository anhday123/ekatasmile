const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const labelService = require(`../services/label`);
const { Label } = require('../models/label');

let getLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await labelService.getLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _label = new Label();
        _label.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, label] = await Promise.all([
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
                .collection(`Labels`)
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
        if (label) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _label.create({
            ...req.body,
            ...{
                label_id: ObjectId(),
                business_id: business.user_id,
                create_date: moment().utc().format(),
                creator_id: ObjectId(token.user_id),
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _label;
        await labelService.addLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.label_id = ObjectId(req.params.label_id);
        let _label = new Label();
        req.body.name = req.body.name.trim().toUpperCase();
        let label = await client.db(DB).collection(`Labels`).findOne(req.params);
        if (!label) {
            throw new Error(`400: label_id <${req.params.label_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Labels`)
                .findOne({
                    business_id: ObjectId(token.user_id),
                    label_id: { $ne: _label.label_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
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

module.exports = {
    getLabelC,
    addLabelC,
    updateLabelC,
};
