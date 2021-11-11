const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const promotionService = require(`../services/promotion`);
const { Promotion } = require('../models/promotion');

let getPromotionC = async (req, res, next) => {
    try {
        await promotionService.getPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addPromotionC = async (req, res, next) => {
    try {
        let _promotion = new Promotion();
        _promotion.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let promotionMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Promotions' });
        if (promotion) {
            throw new Error(`400: Chương trình khuyến mãi đã tồn tại!`);
        }
        if (req.body.limit) {
            _promotion.createLimit(req.body.limit);
        }
        let promotion_id = (() => {
            if (promotionMaxId) {
                if (promotionMaxId.value) {
                    return Number(promotionMaxId.value);
                }
            }
            return 0;
        })();
        promotion_id++;
        _promotion.create({
            ...req.body,
            ...{
                promotion_id: Number(promotion_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne(
                { name: 'Promotions' },
                { $set: { name: 'Promotions', value: promotion_id } },
                { upsert: true }
            );
        req[`_insert`] = _promotion;
        await promotionService.addPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updatePromotionC = async (req, res, next) => {
    try {
        req.params.promotion_id = Number(req.params.promotion_id);
        let _promotion = new Promotion();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let promotion = await client.db(DB).collection(`Promotions`).findOne(req.params);
        if (!promotion) {
            throw new Error(`400: Chương trình khuyến mãi không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Promotions`)
                .findOne({
                    business_id: Number(req.user.user_id),
                    promotion_id: { $ne: Number(promotion.promotion_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Chương trình khuyến mãi đã tồn tại!`);
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
        if (!req.body.voucher) {
            throw new Error(`400: Voucher không được để trống!`);
        }
        let promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .findOne({
                business_id: Number(req.user.business_id),
                promotion_code: req.body.voucher.split(`_`)[0],
                active: true,
            });
        if (!promotion) {
            throw new Error(`400: Chương trình khuyến mãi không tồn tại hoặc đã hết hạn!`);
        }
        let check = false;
        promotion.vouchers.map((voucher) => {
            if (voucher && voucher.voucher == req.body.voucher) {
                check = true;
            }
        });
        if (check) {
            res.send({ success: true, data: promotion });
        } else {
            throw new Error(`400: Voucher không tồn tại hoặc đã được sử dụngs!`);
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
