const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const tableService = require(`../services/table`);
const { Table } = require('../models/table');

let getTableC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await tableService.getTableS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTableC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _table = new Table();
        _table.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        req.body.position = req.body.position.trim().toUpperCase();
        let [business, store, table] = await Promise.all([
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
                .collection(`Stores`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    store_id: ObjectId(req.body.store_id),
                    delete: false,
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Tables`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    store_id: ObjectId(req.body.store_id),
                    position: req.body.position,
                    name: req.body.name,
                    delete: false,
                    active: true,
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (!store) {
            throw new Error(`400: store_id <${req.body.store_id}> không tồn tại hoặc chưa được kích hoạt!`);
        }
        if (table) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _table.create({
            ...req.body,
            ...{
                table_id: ObjectId(),
                business_id: token.business_id,
                create_date: moment().utc().format(),
                creator_id: token._id,
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _table;
        await tableService.addTableS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTableC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.table_id = ObjectId(req.params.table_id);
        let _table = new Table();
        req.body.name = req.body.name.trim().toUpperCase();
        let table = await client.db(DB).collection(`Tables`).findOne(req.params);
        if (!table) {
            throw new Error(`400: table_id <${req.params.table_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Tables`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    table_id: { $ne: ObjectId(table.table_id) },
                    position: req.body.position,
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> position <${req.body.position}> đã tồn tại!`);
            }
        }
        _table.create(table);
        _table.update(req.body);
        req['_update'] = _table;
        await tableService.updateTableS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTableC,
    addTableC,
    updateTableC,
};
