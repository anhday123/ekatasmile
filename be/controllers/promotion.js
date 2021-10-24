const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const promotionService = require(`../services/promotion`);
const { Promotion } = require('../models/promotion');

let getPromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await promotionService.getPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addPromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _promotion = new Promotion();
        _promotion.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, promotion] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Promotions`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name,
                    delete: false,
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (promotion) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        if (req.body.limit) {
            _promotion.check;
        }
        _promotion.create({
            ...req.body,
            ...{
                promotion_id: ObjectId(),
                business_id: business.user_id,
                create_date: moment().utc().format(),
                creator_id: ObjectId(token.user_id),
                delete: false,
                active: true,
            },
        });
        _promotion.createLimit(req.body.limit);
        req[`_insert`] = _promotion;
        await promotionService.addPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updatePromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.promotion_id = ObjectId(req.params.promotion_id);
        let _promotion = new Promotion();
        req.body.name = req.body.name.trim().toUpperCase();
        let promotion = await client.db(DB).collection(`Promotions`).findOne(req.params);
        if (!promotion) {
            throw new Error(`400: promotion_id <${req.params.promotion_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Promotions`)
                .findOne({
                    business_id: ObjectId(token.user_id),
                    promotion_id: { $ne: promotion.promotion_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
            }
        }
        _promotion.create(promotion);
        _promotion.update(req.body);
        req['_update'] = _promotion;
        await promotionService.updatePromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let checkVoucherC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!req.body.voucher) {
            throw new Error(`400: Voucher không được để trống!`);
        }
        let promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .findOne({
                business_id: ObjectId(token.business_id),
                promotion_code: req.body.voucher.split(`_`)[0],
                delete: false,
                active: true,
            });
        if (!promotion) {
            throw new Error(`400: Promotion không tồn tại hoặc đã hết hạn!`);
        }
        let check = false;
        promotion.vouchers.map((voucher) => {
            if (voucher && voucher == req.body.voucher) {
                check = true;
            }
        });
        if (check) {
            res.send({ success: true, data: promotion });
        } else {
            throw new Error(`400: Voucher is not exists or used!`);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPromotionC,
    addPromotionC,
    updatePromotionC,
    checkVoucherC,
};
