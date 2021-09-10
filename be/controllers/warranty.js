const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const warrantyService = require(`../services/warranty`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_warranty`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getWarranty)) throw new Error(`400 ~ Validate data wrong!`);
        await warrantyService.getWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_warranty`)) throw new Error(`400 ~ Forbidden!`);
        ['name', 'type'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _warranty] = await Promise.all([
            client.db(DB).collection(`Warranties`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Warranties`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_warranty) throw new Error(`400 ~ Warranty name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`warranty_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _warranty = {
            warranty_id: req.body.warranty_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            type: req.body.type,
            sub_type: createSub(req.body.type),
            time: req.body.time || 0,
            description: req.body.description || ``,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _warranty;
        await warrantyService.addWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_warranty`)) throw new Error(`400 ~ Forbidden!`);
        let _warranty = await client.db(DB).collection(`Warranties`).findOne(req.params);
        if (!_warranty) throw new Error(`400 ~ Warranty is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
            let _check = await client
                .db(DB)
                .collection(`Warranties`)
                .findOne({
                    warranty_id: { $ne: _warranty.warranty_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Warranty name was exists!`);
        }
        delete req.body._id;
        delete req.body.warranty_id;
        delete req.body.business_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._bussiness;
        delete req.body._creator;
        req['_update'] = { ..._warranty, ...req.body };
        await warrantyService.updateWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWarrantyC,
    addWarrantyC,
    updateWarrantyC,
};
