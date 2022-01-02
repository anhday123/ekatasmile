const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const promotionService = require(`../services/promotion`);

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        return '';
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

let getFirstLetter = (text) => {
    text = text.split(' ');
    text = text.map((item) => {
        if (/[a-zA-Z]/.test(item)) {
            return item[0];
        } else {
            return item;
        }
    });
    text = text.join('');
    return text;
};

module.exports._get = async (req, res, next) => {
    try {
        await promotionService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};
module.exports._create = async (req, res, next) => {
    try {
        req.body.name = String(req.body.name).trim().toUpperCase();
        let promotion = await client.db(DB).collection(`Promotions`).findOne({
            name: req.body.name,
        });
        if (promotion) {
            throw new Error(`400: Chương trình khuyến mãi đã tồn tại!`);
        }
        let promotion_id = await client
            .db(DB)
            .collection('AppSetting')
            .findOne({ name: 'Promotions' })
            .then((doc) => {
                if (doc && doc.value) {
                    return Number(doc.value);
                }

                return 0;
            });
        promotion_id++;
        let _promotion = {
            promotion_id: promotion_id,
            code: String(promotion_id).padStart(6, '0'),
            name: req.body.name,
            promotion_code: (() => {
                if (req.body.promotion_code && req.body.promotion_code != '') {
                    return req.body.promotion_code;
                } else {
                    return removeUnicode(`${getFirstLetter(req.body.name)}_${promotion_id}`, true);
                }
            })().toUpperCase(),
            type: String(req.body.type || 'percent').toUpperCase(),
            value: Number(req.body.value || 0),
            max_discount: Number(req.body.max_discount || 0),
            discount_condition: Number(req.body.discount_condition || 0),
            has_voucher: req.body.has_voucher || false,
            limit: req.body.limit || {
                amount: 0,
                branchs: [],
                stores: [],
            },
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: true,
            slug_name: removeUnicode(name, true).toLowerCase(),
        };
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Promotions' }, { $set: { name: 'Promotions', value: promotion_id } }, { upsert: true });
        req[`body`] = _promotion;
        await promotionService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        req.params.promotion_id = Number(req.params.promotion_id);
        let promotion = await client.db(DB).collection(`Promotions`).findOne(req.params);
        if (!promotion) {
            throw new Error(`400: Chương trình khuyến mãi không tồn tại!`);
        }
        if (req.body.name) {
            req.body.name = String(req.body.name).trim().toUpperCase();
            let check = await client
                .db(DB)
                .collection(`Promotions`)
                .findOne({
                    promotion_id: { $ne: promotion.promotion_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Chương trình khuyến mãi đã tồn tại!`);
            }
        }
        delete req.body._id;
        delete req.body.promotion_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _promotion = { ...promotion, ...req.body };
        _promotion = {
            promotion_id: _promotion.promotion_id,
            code: _promotion.code,
            name: _promotion.name,
            promotion_code: _promotion.promotion_code,
            type: String(_promotion.type).toUpperCase(),
            value: Number(_promotion.value || 0),
            max_discount: Number(_promotion.max_discount || 0),
            discount_condition: Number(_promotion.discount_condition || 0),
            has_voucher: _promotion.has_voucher || false,
            limit: _promotion.limit || {
                amount: 0,
                branchs: [],
                stores: [],
            },
            description: String(_promotion.description) || '',
            create_date: _promotion.create_date,
            creator_id: _promotion.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: _promotion.active,
            slug_name: removeUnicode(_promotion.name, true).toLowerCase(),
        };
        req['_update'] = _promotion;
        await promotionService.updatePromotionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._checkVoucher = async (req, res, next) => {
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

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Promotions`)
            .deleteMany({ promotion_id: { $in: req.body.promotion_id } });
        res.send({
            success: true,
            message: 'Xóa chương trình khuyến mãi thành công!',
        });
    } catch (err) {
        next(err);
    }
};
