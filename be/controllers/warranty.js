const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/warranty`);
const warrantyService = require(`../services/warranty`);

let getWarrantyC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getWarranty))
            throw new Error(`400 ~ Validate data wrong!`);
        await warrantyService.getWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addWarranty))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _warranty] = await Promise.all([
            client.db(DB).collection(`Warranties`).countDocuments(),
            client
                .db(DB)
                .collection(`Warranties`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Warranties`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_warranty) throw new Error(`400 ~ Warranty name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`warranty_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _warranty = {
            warranty_id: req.body.warranty_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            type: req.body.type,
            time: req.body.time,
            description: req.body.description,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_warranty`] = _warranty;
        await warrantyService.addWarrantyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateWarrantyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        console.log(req.params);
        let _warranty = await client
            .db(DB)
            .collection(`Warranties`)
            .findOne(req.params);
        if (!_warranty) throw new Error(`400 ~ Warranty is not exists!`);
        req.body[`name`] = String(req.body.name).toUpperCase();
        let _check = await client
            .db(DB)
            .collection(`Warranties`)
            .findOne({
                warranty_id: { $ne: _warranty.warranty_id },
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            });
        if (_check) throw new Error(`400 ~ Warranty name was exists!`);
        delete req.body._id;
        delete req.body.warranty_id;
        delete req.body.bussiness;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
