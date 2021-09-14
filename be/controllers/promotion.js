const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const promotionService = require(`../services/promotion`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

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
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
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
        req.body['limit'] = {
            amount: req.body.limit.amount || 0,
            stores: req.body.limit.stores || [],
        };
        if (req.body.limit.amount > 0) {
            let len = String(req.body.limit.amount).length;
            req.body[`vouchers`] = [...new Array(req.body.limit.amount)].map(() => {
                let voucher = `${
                    removeUnicode(req.body.promotion_code) || removeUnicode(req.body.name).toUpperCase()
                }_${String(Math.random()).substr(2, len + 2)}`;
                return { voucher, order_id: '', discount_amount: 0, active: true };
            });
        }
        _promotion = {
            promotion_id: req.body.promotion_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: removeUnicode(req.body.name).toLocaleLowerCase(),
            promotion_code: req.body.promotion_code || removeUnicode(req.body.name).toUpperCase(),
            type: req.body.type || 'Percent',
            sub_type: removeUnicode(req.body.type || 'Percent').toLocaleLowerCase(),
            value: req.body.value || 0,
            limit: req.body.limit,
            vouchers: req.body.vouchers || [],
            description: req.body.description || '',
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
            req.body[`sub_name`] = removeUnicode(req.body.name).toLocaleLowerCase();
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
        if (!promotion.voucher) {
            throw new Error(`400 ~ Voucher must be not null or undefined!`);
        }
        let _promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .findOne({
                business_id: token.business_id,
                promotion_code: req.body.voucher.split(`_`)[0],
                active: true,
            });
        if (!_promotion) throw new Error(`400 ~ Promotion is not exists or expired!`);
        let _check = false;
        _promotion.vouchers.map((voucher) => {
            if (voucher && voucher == req.body.voucher) {
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
