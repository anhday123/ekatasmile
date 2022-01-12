const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const pointService = require(`../services/pointSetting`);

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
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

module.exports._get = async (req, res, next) => {
    try {
        await pointService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        [].map((e) => {
            if (req.body[e] == undefined) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        let settingMaxId = await client
            .db(req.user.database)
            .collection('AppSetting')
            .findOne({ name: 'PointSettings' });
        let settingId = (() => {
            if (settingMaxId && settingId.value) {
                return settingId.value;
            }
            return 0;
        })();
        if (req.body.branch_id) {
        }
        if (req.body.customer_type) {
        }
        if (req.body.category_id) {
        }
        if (req.body.product_id) {
        }
        settingId++;
        let _setting = {
            point_setting_id: settingId,
            name: req.body.name,
            accumulate_for_promotion_product: req.body.accumulate_for_promotion_product || false,
            accumulate_for_refund_order: req.body.accumulate_for_refund_order || false,
            accumulate_for_payment_point: req.body.accumulate_for_payment_point || false,
            accumulate_for_fee_shipping: req.body.accumulate_for_fee_shipping || false,
            stack_point: req.body.stack_point || false,
            exchange_point_rate: req.body.exchange_point_rate || 0,
            exchange_money_rate: req.body.exchange_money_rate || 0,
            order_require: req.body.order_require || 0,
            branch_id: req.body.branch_id || [],
            customer_type_id: req.body.customer_type_id || [],
            category_id: req.body.category_id || [],
            product_id: req.body.product_id || [],
            slug_name: removeUnicode(String(req.body.name || ''), true).toLowerCase(),
        };
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne(
                { name: 'PointSettings' },
                { $set: { name: 'PointSettings', value: settingId } },
                { $upsert: true }
            );
        req['body'] = _setting;
        await pointService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        await pointService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};
