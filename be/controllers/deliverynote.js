const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/store`);
const deliverySerice = require(`../services/deliverynote`);

let getDeliveryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_delivery`)) throw new Error(`400 ~ Forbidden!`);
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
        // if (!token.role.permission_list.includes(`add_delivery`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(req.body, form.addStore))
        //     throw new Error(`400 ~ Validate data wrong!`);
        let [_counts, _business] = await Promise.all([
            client.db(DB).collection(`DeliveryNotes`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
        ]);
        if (!_business) throw new Error(`400 ~ Business is not exists or inactive!`);
        req.body[`delivery_id`] = String(_counts + 1);
        req.body[`type`] = String(req.body.type).trim().toUpperCase();
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        let _delivery = {
            delivery_id: req.body.delivery_id,
            business_id: req.body.business_id,
            code: req.body.code,
            type: req.body.type,
            user_ship_id: req.body.user_ship_id || token.user_id,
            user_receive_id: req.body.user_receive_id,
            from_id: req.body.from_id,
            to_id: req.body.to_id,
            products: req.body.products,
            note: req.body.note,
            tag: req.body.tag,
            ship_time: req.body.ship_time || moment.tz(`Asia/Ho_Chi_Minh`).format(),
            // PROGRESSING - SHIPPING - CANCEL - COMPLETE
            status: req.body.status || `PROCESSING`,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _delivery;
        await deliverySerice.addDeliveryS(req, res, next);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let updateDeliveryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_delivery`)) throw new Error(`400 ~ Forbidden!`);
        let _delivery = await client.db(DB).collection(`DeliveryNotes`).findOne(req.params);
        if (!_delivery) throw new Error(`400 ~ Delivery note is not exists!`);
        delete req.body._id;
        delete req.body.delivery_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._user_ship;
        delete req.body._user_receive;
        delete req.body._creator;
        delete req.body._from;
        delete req.body._to;
        req['_update'] = { ..._delivery, ...req.body };
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
