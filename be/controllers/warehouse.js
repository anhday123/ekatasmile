const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const warehouseService = require(`../services/warehouse`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getWarehouseC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_warehouse`)) throw new Error(`400 ~ Forbidden!`);
        await warehouseService.getWarehouseS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarehouseC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_warehouse`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).toUpperCase();
        let [_counts, _business, _warehouse] = await Promise.all([
            client.db(DB).collection(`Warehouses`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Warehouses`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_warehouse) throw new Error(`400 ~ Warehouse name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`warehouse_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;

        _warehouse = {
            warehouse_id: req.body.warehouse_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: removeUnicode(req.body.name).toLocaleLowerCase(),
            type: req.body.type || `RIÊNG`,
            sub_type: removeUnicode(req.body.type || 'RIÊNG').toLocaleLowerCase(),
            phone: req.body.phone || '',
            capacity: req.body.capacity || 0,
            monthly_cost: req.body.monthly_cost || 0,
            address: req.body.address || ``,
            sub_address: removeUnicode(req.body.address || ``).toLocaleLowerCase(),
            district: req.body.district || ``,
            sub_district: removeUnicode(req.body.district || ``).toLocaleLowerCase(),
            province: req.body.province || ``,
            sub_province: removeUnicode(req.body.province || ``).toLocaleLowerCase(),
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
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
        // if (!token.role.permission_list.includes(`update_warehouse`)) throw new Error(`400 ~ Forbidden!`);
        let _warehouse = await client.db(DB).collection(`Warehouses`).findOne(req.params);
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
