const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/promotion`);
const promotionService = require(`../services/promotion`);

let getPromotionC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getPromotion))
            throw new Error(`400 ~ Validate data wrong!`);
        await promotionService.getPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addPromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.relative(req.query, form.addPromotion))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _promotion] = await Promise.all([
            client.db(DB).collection(`Promotions`).countDocuments(),
            client
                .db(DB)
                .collection(`Promotions`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Promotions`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_promotion) throw new Error(`400 ~ Promotion name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`promotion_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        if (req.body.limit?.amount > 0) {
            req.body[`vouchers`] = [...new Array(req.body.limit.amount)].map(
                () => {
                    let voucher = `${req.body.name
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``)
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')}_${String(Math.random()).substr(
                        2,
                        4
                    )}`;
                    return { voucher, active: true };
                }
            );
        }
        _promotion = {
            promotion_id: req.body.promotion_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            name: req.body.name,
            type: req.body.type,
            value: req.body.value,
            limit: req.body.limit,
            vouchers: req.body.vouchers,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_promotion`] = _promotion;
        await promotionService.addPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updatePromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .findOne(req.params);
        if (!_promotion) throw new Error(`400 ~ Promotion is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Promotions`)
                .findOne({
                    promotion_id: { $ne: _promotion.promotion_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Promotion name was exists!`);
        }
        delete req.body._id;
        delete req.body.promotion_id;
        delete req.body.bussiness;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
        await promotionService.updatePromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let useVoucherC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        if (!req.body.voucher) throw new Error(`400 ~ Validate data wrong!`);
        let _promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .find({ bussiness: token.bussiness.user_id })
            .toArray();
        for (let i in _promotion) {
            if (
                _promotion[i].name
                    .normalize(`NFD`)
                    .replace(/[\u0300-\u036f]|\s/g, ``) ==
                req.body.voucher.split(`_`)[0]
            ) {
                _promotion = _promotion[i];
                break;
            }
        }
        if (!_promotion)
            throw new Error(`400 ~ Promotion is not exists or expired!`);
        let _check = false;
        for (let i in _promotion.vouchers) {
            if (
                _promotion.vouchers[i].voucher == req.body.voucher &&
                _promotion.vouchers[i].active == true
            ) {
                _check = true;
                res.send({ success: true, data: _promotion });
            }
        }
        if (!_check) throw new Error(`400 ~ Voucher is not exists or used!`);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    getPromotionC,
    addPromotionC,
    updatePromotionC,
    useVoucherC,
};
