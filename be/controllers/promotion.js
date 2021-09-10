const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/promotion`);
const promotionService = require(`../services/promotion`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getPromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_promotion`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getPromotion)) throw new Error(`400 ~ Validate data wrong!`);
        await promotionService.getPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addPromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_promotion`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.addPromotion)) throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _promotion] = await Promise.all([
            client.db(DB).collection(`Promotions`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Promotions`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_promotion) throw new Error(`400 ~ Promotion name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`promotion_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        if (req.body.limit.amount > 0) {
            req.body[`vouchers`] = [...new Array(req.body.limit.amount)].map(() => {
                let voucher = `${req.body.name
                    .normalize(`NFD`)
                    .replace(/[\u0300-\u036f]|\s/g, ``)
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'D')}_${String(Math.random()).substr(2, 4)}`;
                return { voucher, active: true };
            });
        }
        _promotion = {
            promotion_id: req.body.promotion_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            type: req.body.type,
            sub_type: createSub(req.body.type),
            value: req.body.value,
            limit: req.body.limit,
            vouchers: req.body.vouchers,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _promotion;
        await promotionService.addPromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updatePromotionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_promotion`)) throw new Error(`400 ~ Forbidden!`);
        let _promotion = await client.db(DB).collection(`Promotions`).findOne(req.params);
        if (!_promotion) throw new Error(`400 ~ Promotion is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
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
        delete req.body.business_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._promotion, ...req.body };
        await promotionService.updatePromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let checkVoucherC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let promotion = req.body;
        if (!promotion.voucher) {
            throw new Error(`400 ~ Validate data wrong!`);
        }
        let _promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .find({
                business_id: token.business_id,
                sub_name: new RegExp(promotion.voucher.split(`_`)[0]),
                active: true,
            })
            .toArray();
        if (!_promotion) throw new Error(`400 ~ Promotion is not exists or expired!`);
        let _check = false;
        _promotion.vouchers.map((voucher) => {
            if (voucher && voucher == promotion.voucher) {
                _check = true;
            }
        });
        if (_check) {
            res.send({ success: true, data: _promotion });
        } else {
            throw new Error(`400 ~ Voucher is not exists or used!`);
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
