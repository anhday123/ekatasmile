const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.role_id) {
            mongoQuery['role_id'] = req.query.role_id;
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
        let _roles = await client.db(DB).collection(`Roles`).find(mongoQuery).toArray();
        let _default = await client
            .db(DB)
            .collection(`Roles`)
            .find({ name: { $ne: 'ADMIN' }, default: true })
            .toArray();
        if (req.query.default) {
            _roles = _roles.concat(_default);
        }
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _roles.reverse();
        // đếm số phần tử
        let _counts = _roles.length;
        // phân trang
        if (page && page_size) {
            _roles = _roles.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
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
        _roles.map((_role) => {
            _role[`_business`] = _business[_role.business_id];
            _role[`_creator`] = _creator[_role.creator_id];
            return _role;
        });
        res.send({
            success: true,
            data: _roles,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _role = await client.db(DB).collection(`Roles`).insertOne(req._insert);
        if (!_role.insertedId) throw new Error(`500: Create role fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Role`,
                sub_properties: `role`,
                name: `Thêm vai trò mới`,
                sub_name: `themvaitromoi`,
                data: _role.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _role.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Roles`).updateMany(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Role`,
                sub_properties: `role`,
                name: `Cập nhật thông tin vai trò`,
                sub_name: `capnhatthongtinvaitro`,
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
    getRoleS,
    addRoleS,
    updateRoleS,
};
