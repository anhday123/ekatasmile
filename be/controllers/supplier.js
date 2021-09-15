const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const supplierService = require(`../services/supplier`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_supplier`)) throw new Error(`400 ~ Forbidden!`);
        await supplierService.getSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_supplier`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(req.body, form.addsupplier)) throw new Error(`400 ~ Validate Data Wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _supplier] = await Promise.all([
            client.db(DB).collection(`Suppliers`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Suppliers`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_supplier) throw new Error(`400 ~ Supplier name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`supplier_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _supplier = {
            supplier_id: req.body.supplier_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: removeUnicode(req.body.name).toLocaleLowerCase(),
            phone: req.body.phone || ``,
            email: req.body.email || ``,
            address: req.body.address || ``,
            sub_address: removeUnicode(req.body.address || ``).toLocaleLowerCase(),
            district: req.body.district || ``,
            sub_district: removeUnicode(req.body.district || ``).toLocaleLowerCase(),
            province: req.body.province || ``,
            sub_province: removeUnicode(req.body.province || ``).toLocaleLowerCase(),
            default: req.body.default || false,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _supplier;
        await supplierService.addSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateSupplierC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_supplier`)) throw new Error(`400 ~ Forbidden!`);
        let _supplier = await client.db(DB).collection(`Suppliers`).findOne(req.params);
        if (!_supplier) throw new Error(`400 ~ Supplier is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = removeUnicode(req.body.name).toLocaleLowerCase();
            let _check = await client
                .db(DB)
                .collection(`Suppliers`)
                .findOne({
                    supplier_id: { $ne: _supplier.supplier_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400 ~ Supplier name was exists!`);
        }
        if (req.body.address) {
            req.body[`sub_address`] = removeUnicode(req.body.address).toLocaleLowerCase();
        }
        if (req.body.district) {
            req.body[`sub_district`] = removeUnicode(req.body.district).toLocaleLowerCase();
        }
        if (req.body.province) {
            req.body[`sub_province`] = removeUnicode(req.body.province).toLocaleLowerCase();
        }
        delete req.body._id;
        delete req.body.supplier_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._supplier, ...req.body };
        await supplierService.updateSupplierS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addSupplierC,
    getSupplierC,
    updateSupplierC,
};
