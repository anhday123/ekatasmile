const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getLabelS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.label_id) {
            mongoQuery['label_id'] = ObjectId(req.query.label_id);
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
        var _labels = await client.db(DB).collection(`Labels`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _labels.reverse();
        // đếm số phần tử
        let _counts = _labels.length;
        // phân trang
        if (page && page_size) {
            _labels = _labels.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
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
        _labels.map((_label) => {
            _label[`_business`] = _business[_label.business_id];
            _label[`_creator`] = _creator[_label.creator_id];
            return _label;
        });
        res.send({
            success: true,
            data: _labels,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addLabelS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _label = await client.db(DB).collection(`Labels`).insertOne(req._insert);
        if (!_label.insertedId) throw new Error(`500: Create label fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Label`,
                sub_properties: `label`,
                name: `Thêm nhóm cửa hàng mới`,
                sub_name: `themnhomcuahangmoi`,
                data: _label.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _label.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateLabelS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Labels`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Label`,
                sub_properties: `label`,
                name: `Cập nhật thông tin nhóm cửa hàng`,
                sub_name: `capnhatthongtinnhomcuahang`,
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
    addLabelS,
    getLabelS,
    updateLabelS,
};
