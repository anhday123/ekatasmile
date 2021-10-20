const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.supplier_id) {
            mongoQuery['supplier_id'] = ObjectId(req.query.supplier_id);
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
        if (req.query.address) {
            mongoQuery['sub_address'] = createRegExpQuery(req.query.address);
        }
        if (req.query.district) {
            mongoQuery['sub_district'] = createRegExpQuery(req.query.district);
        }
        if (req.query.province) {
            mongoQuery['sub_province'] = createRegExpQuery(req.query.province);
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
        var _suppliers = await client.db(DB).collection(`Suppliers`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _suppliers.reverse();
        // đếm số phần tử
        let _counts = _suppliers.length;
        // phân trang
        if (page && page_size) {
            _suppliers = _suppliers.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
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
        _suppliers.map((_supplier) => {
            _supplier[`_business`] = _business[_supplier.business_id];
            _supplier[`_creator`] = _creator[_supplier.creator_id];
            return _supplier;
        });
        res.send({
            success: true,
            data: _suppliers,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _supplier = await client.db(DB).collection(`Suppliers`).insertOne(req._insert);
        if (!_supplier.insertedId) throw new Error(`500: Create supplier fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Supplier`,
                sub_properties: `supplier`,
                name: `Thêm nhà cung cấp mới`,
                sub_name: `themnhacungcapmoi`,
                data: _supplier.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _supplier.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Suppliers`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Supplier`,
                sub_properties: `supplier`,
                name: `Cập nhật thông tin nhà cung cấp`,
                sub_name: `capnhatthongtinnhacungcap`,
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
    addSupplierS,
    getSupplierS,
    updateSupplierS,
};
