const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const storeService = require(`../services/store`);
const { Store } = require('../models/store');

let getStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await storeService.getStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _store = new Store();
        _store.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, branch, store, label] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                }),
            (async () => {
                if (req.body.branch_id && req.body.branch_id != '') {
                    return client
                        .db(DB)
                        .collection(`Branchs`)
                        .findOne({
                            business_id: ObjectId(token.business_id),
                            branch_id: ObjectId(req.body.branch_id),
                            delete: false,
                            active: true,
                        });
                }
                return true;
            })(),
            client
                .db(DB)
                .collection(`Stores`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name,
                    delete: false,
                }),
            (async () => {
                if (req.body.label_id && req.body.label_id != '') {
                    return client
                        .db(DB)
                        .collection(`Labels`)
                        .findOne({
                            business_id: ObjectId(token.business_id),
                            label_id: ObjectId(req.body.label_id),
                            delete: false,
                            active: true,
                        });
                }
                return true;
            })(),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (!branch) {
            throw new Error(`400: branch_id <${req.body.branch_id}> không tồn tại hoặc chưa được kích hoạt!`);
        }
        if (store) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        if (!label) {
            throw new Error(`400: label_id <${req.body.label_id}> không tồn tại hoặc chưa được kích hoạt!`);
        }
        _store.create({
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
        req[`_insert`] = _store;
        await storeService.addStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.store_id = ObjectId(req.params.store_id);
        let _store = new Store();
        req.body.name = req.body.name.trim().toUpperCase();
        let store = await client.db(DB).collection(`Stores`).findOne(req.params);
        if (!store) {
            throw new Error(`400: store_id <${req.params.store_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Stores`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    store_id: { $ne: store.store_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        if (ObjectId(req.body.branch_id) != store.branch_id) {
            let branch = await client
                .db(DB)
                .collection(`Branchs`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    branch_id: ObjectId(req.body.branch_id),
                    delete: false,
                    active: true,
                });
            if (!branch) {
                throw new Error(`400: branch_id <${req.body.branch_id}> không khả dụng!`);
            }
        }
        _store.create(store);
        _store.update(req.body);
        req['_update'] = _store;
        await storeService.updateStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStoreC,
    addStoreC,
    updateStoreC,
};
