const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const storeService = require(`../services/store`);
const { Store } = require('../models/store');

let getStoreC = async (req, res, next) => {
    try {
        await storeService.getStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addStoreC = async (req, res, next) => {
    try {
        let _store = new Store();
        _store.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let store = await client
            .db(DB)
            .collection(`Stores`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let storeMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Stores' });
        if (store) {
            throw new Error(`400: Cửa hàng đã tồn tại!`);
        }
        let store_id = (() => {
            if (storeMaxId) {
                if (storeMaxId.value) {
                    return Number(storeMaxId.value);
                }
            }
            return 0;
        })();
        store_id++;
        _store.create({
            ...req.body,
            ...{
                store_id: Number(store_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Stores' }, { $set: { name: 'Stores', value: store_id } }, { upsert: true });
        req[`_insert`] = _store;
        await storeService.addStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateStoreC = async (req, res, next) => {
    try {
        req.params.store_id = Number(req.params.store_id);
        let _store = new Store();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let store = await client.db(DB).collection(`Stores`).findOne(req.params);
        if (!store) {
            throw new Error(`400: Cửa hàng không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Stores`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    store_id: { $ne: Number(store.store_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Cửa hàng đã tồn tại!`);
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

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Stores`)
            .deleteMany({ store_id: { $in: req.body.store_id } });
        res.send({
            success: true,
            message: 'Xóa cửa hàng thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStoreC,
    addStoreC,
    updateStoreC,
    _delete,
};
