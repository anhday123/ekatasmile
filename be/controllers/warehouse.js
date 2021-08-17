const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/warehouse`);
const warehouseService = require(`../services/warehouse`);

let getWarehouseC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getWarehouse))
            throw new Error(`400 ~ Validate data wrong!`);
        await warehouseService.getWarehouseS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarehouseC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addWarehouse))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).toUpperCase();
        let [_counts, _count, _bussiness, _warehouse] = await Promise.all([
            client.db(DB).collection(`Warehouses`).countDocuments(),
            client
                .db(DB)
                .collection(`Warehouses`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Warehouses`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_warehouse) throw new Error(`400 ~ Warehouse name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`warehouse_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _warehouse = {
            warehouse_id: req.body.warehouse_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            type: req.body.type,
            phone: req.body.phone,
            capacity: req.body.capacity,
            monthly_cost: req.body.monthly_cost,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_warehouse`] = _warehouse;
        await warehouseService.addWarehouseS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateWarehouseC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _warehouse = await client
            .db(DB)
            .collection(`Warehouses`)
            .findOne(req.params);
        if (!_warehouse) throw new Error(`400 ~ Warehouse is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).trim().toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Warehouses`)
                .findOne({
                    warehouse_id: { $ne: _warehouse.warehouse_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Warehouse name was exists!`);
        }
        delete req.body._id;
        delete req.body.warehose_id;
        delete req.body.bussiness;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
        await warehouseService.updateWarehouseS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWarehouseC,
    addWarehouseC,
    updateWarehouseC,
};
