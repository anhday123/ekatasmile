const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const tableService = require(`../services/table`);
const { Table } = require('../models/table');

let getTableC = async (req, res, next) => {
    try {
        await tableService.getTableS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTableC = async (req, res, next) => {
    try {
        let _table = new Table();
        _table.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        req.body.position = String(req.body.position).trim().toUpperCase();
        let table = await client
            .db(DB)
            .collection(`Tables`)
            .findOne({
                business_id: Number(req.user.business_id),
                store_id: Number(req.body.store_id),
                position: req.body.position,
                name: req.body.name,
                active: true,
            });
        let tableMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Tables' });
        if (table) {
            throw new Error(`400: Bàn tại vị trí này đã tồn tại!`);
        }
        let table_id = (() => {
            if (tableMaxId) {
                if (tableMaxId.value) {
                    return Number(tableMaxId.value);
                }
            }
            return 0;
        })();
        table_id++;
        _table.create({
            ...req.body,
            ...{
                table_id: Number(table_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Tables' }, { $set: { name: 'Tables', value: table_id } }, { upsert: true });
        req[`_insert`] = _table;
        await tableService.addTableS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateTableC = async (req, res, next) => {
    try {
        req.params.table_id = Number(req.params.table_id);
        let _table = new Table();
        req.body.name = String(req.body.name).trim().toUpperCase();
        if (req.body.position) {
            req.body.position = String(req.body.position).trim().toUpperCase();
        }
        let table = await client.db(DB).collection(`Tables`).findOne(req.params);
        if (!table) {
            throw new Error(`400: Bàn không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Tables`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    table_id: { $ne: Number(table.table_id) },
                    position: String(req.body.position || table.position),
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Bàn tại vị trí này đã tồn tại!`);
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
