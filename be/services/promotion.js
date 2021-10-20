const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.promotion_id) {
            mongoQuery['promotion_id'] = ObjectId(req.query.promotion_id);
        }
        if (token) {
            mongoQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = ObjectId(req.query.business_id);
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = ObjectId(req.query.creator_id);
        }
        if (req.query.has_voucher == 'true') {
            mongoQuery['has_voucher'] = true;
        }
        if (req.query.has_voucher == 'false') {
            mongoQuery['has_voucher'] = false;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            mongoQuery['code'] = createRegExpQuery(req.query.code);
        }
        if (req.query.name) {
            mongoQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.type) {
            mongoQuery['sub_type'] = createRegExpQuery(req.query.type);
        }
        if (req.query.search) {
            mongoQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
            ];
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _promotions = await client.db(DB).collection(`Promotions`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _promotions.reverse();
        // đếm số phần tử
        let _counts = _promotions.length;
        // phân trang
        if (page && page_size) {
            _promotions = _promotions.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [__users] = await Promise.all([
            client.db(DB).collection(`Users`).find({ business_id: mongoQuery.business_id }).toArray(),
        ]);
        let _business = {};
        let _creator = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _creator[__user.user_id] = __user;
        });
        let _discount_total = 0;
        _promotions.map((_promotion) => {
            _promotion[`_business`] = _business[_promotion.business_id];
            _promotion[`_creator`] = _creator[_promotion.creator_id];
            _discount_total += _promotion.discount_total;
            return _promotion;
        });
        res.send({
            success: true,
            data: _promotions,
            count: _counts,
            _discount_total,
        });
    } catch (err) {
        next(err);
    }
};

let addPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _promotion = await client.db(DB).collection(`Promotions`).insertOne(req._insert);
        if (!_promotion.insertedId) throw new Error(`500: Create promotion fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Promotion`,
                sub_properties: `promotion`,
                name: `Thêm chương trình khuyến mãi mới`,
                sub_name: `themchuongtrinhkhuyenmai`,
                data: _promotion.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _promotion.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updatePromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Promotions`).updateMany(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Promotion`,
                sub_properties: `promotion`,
                name: `Cập nhật thông tin chương trình khuyến mãi`,
                sub_name: `capnhatthongtinchuongtrinhkhuyenmai`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPromotionS,
    addPromotionS,
    updatePromotionS,
};
