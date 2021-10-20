const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.warranty_id) {
            mongoQuery['warranty_id'] = req.query.warranty_id;
        }
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = req.query.creator_id;
        }
        if (req.query.time) {
            mongoQuery['time'] = Number(req.query.time);
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
        if (req.query.code) {
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
        let _warranties = await client.db(DB).collection(`Warranties`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _warranties.reverse();
        // đếm số phần tử
        let _counts = _warranties.length;
        // phân trang
        if (page && page_size) {
            _warranties = _warranties.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
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
        _warranties.map((_warranty) => {
            _warranty[`_business`] = _business[_warranty.business_id];
            _warranty[`_creator`] = _creator[_warranty.creator_id];
            return _warranty;
        });
        res.send({
            success: true,
            data: _warranties,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _warranty = await client.db(DB).collection(`Warranties`).insertOne(req._insert);
        if (!_warranty.ops) throw new Error(`500: Create warranty fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Warranty`,
                sub_properties: `warranty`,
                name: `Thêm chế độ bảo hành mới`,
                sub_name: `themchedobaohanhmoi`,
                data: _warranty.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _warranty.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Warranties`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Warranty`,
                sub_properties: `warranty`,
                name: `Cập nhật thông tin bảo hành`,
                sub_name: `capnhatthongtinbaohanh`,
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
    getWarrantyS,
    addWarrantyS,
    updateWarrantyS,
};
