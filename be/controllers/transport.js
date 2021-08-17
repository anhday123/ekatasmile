const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/transport`);
const transportService = require(`../services/transport`);

let getTransportC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getTransport))
            throw new Error(`400 ~ Validate data wrong!`);
        await transportService.getTransportS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addTransportC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addTransport))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _transport] = await Promise.all([
            client.db(DB).collection(`Transports`).countDocuments(),
            client
                .db(DB)
                .collection(`Transports`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Transports`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_transport) throw new Error(`400 ~ Transport name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`transport_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _transport = {
            transport_id: req.body.transport_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            image: req.body.image,
            phone: req.body.phone,
            zipcode: req.body.zipcode,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_transport`] = _transport;
        await transportService.addTransportS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
let updateTransportC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _transport = await client
            .db(DB)
            .collection(`Transports`)
            .findOne(req.params);
        if (!_transport) throw new Error(`400 ~ Transport is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Transports`)
                .findOne({
                    transport_id: { $ne: _transport.transport_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Transport name was exists!`);
        }
        delete req.body._id;
        delete req.body.transport_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
        await transportService.updateTransportS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTransportC,
    addTransportC,
    updateTransportC,
};
