const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/store`);
const storeService = require(`../services/store`);

let getStoreC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getStore))
            throw new Error(`400 ~ Validate data wrong!`);
        await storeService.getStoreS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addStore))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _store] = await Promise.all([
            client.db(DB).collection(`Stores`).countDocuments(),
            client
                .db(DB)
                .collection(`Stores`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Stores`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_store) throw new Error(`400 ~ Store name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`store_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _store = {
            store_id: req.body.store_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            logo: req.body.logo,
            phone: req.body.phone,
            email: req.body.email,
            fax: req.body.fax,
            website: req.body.website,
            latitude: req.body.latitude,
            longtitude: req.body.longtitude,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_store`] = _store;
        await storeService.addStoreS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
let updateStoreC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _store = await client
            .db(DB)
            .collection(`Stores`)
            .findOne(req.params);
        if (!_store) throw new Error(`400 ~ Store is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Stores`)
                .findOne({
                    store_id: { $ne: _store.store_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Store name was exists!`);
        }
        delete req.body._id;
        delete req.body.store_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
