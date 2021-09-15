const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const storeService = require(`../services/store`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_store`)) throw new Error(`400 ~ Forbidden!`);
        await storeService.getStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_store`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _branch, _label, _store] = await Promise.all([
            client.db(DB).collection(`Stores`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Branchs`).findOne({
                branch_id: req.body.branch_id,
                active: true,
            }),
            client.db(DB).collection(`Labels`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
            client.db(DB).collection(`Stores`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_store) throw new Error(`400 ~ Store name was exists!`);
        if (!_branch) throw new Error(`400 ~ Branch is not exists or inactive!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`store_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _store = {
            store_id: req.body.store_id,
            business_id: req.body.business_id,
            branch_id: req.body.branch_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: removeUnicode(req.body.name).toLocaleLowerCase(),
            logo: req.body.logo || ``,
            label_id: req.body.label_id || ``,
            phone: req.body.phone || ``,
            latitude: req.body.latitude || ``,
            longtitude: req.body.longtitude || ``,
            address: req.body.address || ``,
            sub_address: removeUnicode(req.body.address || '').toLocaleLowerCase(),
            district: req.body.district || ``,
            sub_district: removeUnicode(req.body.district || '').toLocaleLowerCase(),
            province: req.body.province || ``,
            sub_province: removeUnicode(req.body.province || '').toLocaleLowerCase(),
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _store;
        await storeService.addStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_store`)) throw new Error(`400 ~ Forbidden!`);
        let _store = await client.db(DB).collection(`Stores`).findOne(req.params);
        if (!_store) throw new Error(`400 ~ Store is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = removeUnicode(req.body.name).toLocaleLowerCase();
            let _check = await client
                .db(DB)
                .collection(`Stores`)
                .findOne({
                    store_id: { $ne: _store.store_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400 ~ Store name was exists!`);
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
        delete req.body.store_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        delete req.body._branch;
        delete req.body._employees;
        req['_update'] = { ..._store, ...req.body };
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
