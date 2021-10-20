const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const toppingService = require(`../services/topping`);
const { Topping } = require('../models/topping');

let getToppingC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await toppingService.getToppingS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addToppingC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _topping = new Topping();
        _topping.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, topping] = await Promise.all([
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
                .collection(`Toppings`)
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
        if (topping) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _topping.create({
            ...req.body,
            ...{
                business_id: business.user_id,
                topping_id: ObjectId(),
                create_date: moment().utc().format(),
                creator_id: ObjectId(token.user_id),
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _topping;
        await toppingService.addToppingS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateToppingC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.topping_id = ObjectId(req.params.topping_id);
        let _topping = new Topping();
        req.body.name = req.body.name.trim().toUpperCase();
        let topping = await client.db(DB).collection(`Toppings`).findOne(req.params);
        if (!topping) {
            throw new Error(`400: topping_id <${req.params.topping_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Toppings`)
                .findOne({
                    business_id: ObjectId(token.user_id),
                    topping_id: { $ne: _topping.topping_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
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

module.exports = {
    getToppingC,
    addToppingC,
    updateToppingC,
};
