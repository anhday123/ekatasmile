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
            order_cost_require: req.body.order_cost_require || 0,
            all_branch: req.body.all_branch || false,
            branch_id: req.body.branch_id || [],
            all_customer_type: req.body.all_customer_type || false,
            customer_type_id: req.body.customer_type_id || [],
            all_product: req.body.all_product || false,
            category_id: req.body.category_id || [],
            all_product: req.body.all_product || false,
            product_id: req.body.product_id || [],
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: true,
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
        req.params.point_setting_id = Number(req.params.point_setting_id);
        let setting = await client.db(req.user.database).collection('PointSettings').findOne(req.params);
        if (!setting) {
            throw new Error(`500: Chương trình tích điểm không tồn tại!`);
        }
        delete req.body._id;
        delete req.body.point_setting_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _setting = { ...setting, ...req.body };
        _setting = {
            point_setting_id: _setting.point_setting_id,
            name: _setting.name,
            accumulate_for_promotion_product: _setting.accumulate_for_promotion_product || false,
            accumulate_for_refund_order: _setting.accumulate_for_refund_order || false,
            accumulate_for_payment_point: _setting.accumulate_for_payment_point || false,
            accumulate_for_fee_shipping: _setting.accumulate_for_fee_shipping || false,
            stack_point: _setting.stack_point || false,
            exchange_point_rate: _setting.exchange_point_rate || 0,
            exchange_money_rate: _setting.exchange_money_rate || 0,
            order_require: _setting.order_require || 0,
            order_cost_require: _setting.order_cost_require || 0,
            all_branch: _setting.all_branch || false,
            branch_id: _setting.branch_id || [],
            all_customer_type: _setting.all_customer_type || false,
            customer_type_id: _setting.customer_type_id || [],
            all_category: _setting.all_category || false,
            category_id: _setting.category_id || [],
            all_product: _setting.all_product || false,
            product_id: _setting.product_id || [],
            create_date: _setting.create_date,
            creator_id: _setting.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: _setting.active,
            slug_name: removeUnicode(String(_setting.name || ''), true).toLowerCase(),
        };
        await pointService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(req.user.database)
            .collection(`PointSettings`)
            .deleteMany({ point_setting_id: { $in: req.body.point_setting_id } });
        res.send({
            success: true,
            message: 'Xóa chương trình tích điểm thành công!',
        });
    } catch (err) {
        next(err);
    }
};
