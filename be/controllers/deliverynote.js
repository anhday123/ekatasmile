const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/store`);
const deliverySerice = require(`../services/deliverynote`);

let getDeliveryC = async (req, res, next) => {
    try {
        // if (!valid.relative(req.query, form.getStore))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await deliverySerice.getDeliveryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addDeliveryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!valid.absolute(req.body, form.addStore))
        //     throw new Error(`400 ~ Validate data wrong!`);
        req.body[`type`] = String(req.body.type).trim().toUpperCase();
        let [_counts, _count, _bussiness] = await Promise.all([
            client.db(DB).collection(`DeliveryNotes`).countDocuments(),
            client
                .db(DB)
                .collection(`DeliveryNotes`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
        ]);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`delivery_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        let _delivery = {
            delivery_id: req.body.delivery_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            type: req.body.type,
            user_ship: req.body.user_ship,
            user_receive: req.body.user_receive,
            from: req.body.from,
            to: req.body.to,
            products: req.body.products,
            note: req.body.note,
            tag: req.body.tag,
            status: `PROGRESSING`,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_delivery`] = _delivery;
        await deliverySerice.addDeliveryS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
let updateDeliveryC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _delivery = await client
            .db(DB)
            .collection(`DeliveryNotes`)
            .findOne(req.params);
        if (!_delivery) throw new Error(`400 ~ Delivery note is not exists!`);
        req.body = { status: req.body.status };
        await deliverySerice.updateDeliveryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDeliveryC,
    addDeliveryC,
    updateDeliveryC,
};
