const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const toppingService = require(`../services/topping`);
const { Topping } = require('../models/topping');

let getToppingC = async (req, res, next) => {
    try {
        await toppingService.getToppingS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addToppingC = async (req, res, next) => {
    try {
        let _topping = new Topping();
        _topping.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let topping = await client
            .db(DB)
            .collection(`Toppings`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let toppingMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Toppings' });
        if (topping) {
            throw new Error(`400: Topping đã tồn tại!`);
        }
        let topping_id = (() => {
            if (toppingMaxId) {
                if (toppingMaxId.value) {
                    return Number(toppingMaxId.value);
                }
            }
            return 0;
        })();
        topping_id++;
        _topping.create({
            ...req.body,
            ...{
                business_id: Number(req.user.business_id),
                topping_id: Number(topping_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Toppings' }, { $set: { name: 'Toppings', value: topping_id } }, { upsert: true });
        req[`_insert`] = _topping;
        await toppingService.addToppingS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateToppingC = async (req, res, next) => {
    try {
        req.params.topping_id = Number(req.params.topping_id);
        let _topping = new Topping();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let topping = await client.db(DB).collection(`Toppings`).findOne(req.params);
        if (!topping) {
            throw new Error(`400: Topping không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Toppings`)
                .findOne({
                    business_id: Number(req.user.user_id),
                    topping_id: { $ne: Number(topping.topping_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Topping đã tồn tại!`);
            }
        }
        _topping.create(topping);
        _topping.update(req.body);
        req['_update'] = _topping;
        await toppingService.updateToppingS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Toppings`)
            .deleteMany({ topping_id: { $in: req.body.topping_id } });
        res.send({
            success: true,
            message: 'Xóa topping thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getToppingC,
    addToppingC,
    updateToppingC,
    _delete,
};
