const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getActionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.performer_id) {
            mongoQuery['performer_id'] = req.query.performer_id;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            mongoQuery[`date`] = {
                ...mongoQuery[`date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`date`] = {
                ...mongoQuery[`date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.type) {
            mongoQuery['sub_type'] = createRegExpQuery(req.query.type);
        }
        if (req.query.properties) {
            mongoQuery['sub_properties'] = createRegExpQuery(req.query.properties);
        }
        if (req.query.name) {
            mongoQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.search) {
            mongoQuery['$or'] = [
                { sub_type: createRegExpQuery(req.query.search) },
                { sub_properties: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
            ];
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _actions = await client.db(DB).collection(`Actions`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _actions.reverse();
        // đếm số phần tử
        let _counts = _actions.length;
        // phân trang
        if (page && page_size) {
            _actions = _actions.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [__users] = await Promise.all([client.db(DB).collection(`Users`).find({}).toArray()]);
        let _business = {};
        let _performers = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _performers[__user.user_id] = __user;
        });
        _actions.map((_action) => {
            _action[`_business`] = _business[_action.business_id];
            _action[`_performer`] = _performers[_action.performer_id];
            return _action;
        });
        res.send({
            success: true,
            data: _actions,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionS,
};
