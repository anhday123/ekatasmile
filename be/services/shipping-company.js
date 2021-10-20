const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getShippingCompanyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.shipping_company_id) {
            mongoQuery['shipping_company_id'] = ObjectId(req.query.shipping_company_id);
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
        var _shippingCompanies = await client
            .db(DB)
            .collection(`ShippingCompanies`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _shippingCompanies.reverse();
        // đếm số phần tử
        let _counts = _shippingCompanies.length;
        // phân trang
        if (page && page_size) {
            _shippingCompanies = _shippingCompanies.slice(
                (page - 1) * page_size,
                (page - 1) * page_size + page_size
            );
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
        _shippingCompanies.map((_shippingCompany) => {
            _shippingCompany[`_business`] = _business[_shippingCompany.business_id];
            _shippingCompany[`_creator`] = _creator[_shippingCompany.creator_id];
            return _shippingCompany;
        });
        res.send({
            success: true,
            data: _shippingCompanies,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addShippingCompanyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _shippingCompany = await client.db(DB).collection(`ShippingCompanies`).insertOne(req._insert);
        if (!_shippingCompany.insertedId) throw new Error(`500: Create shipping company fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `ShippingCompany`,
                sub_properties: `shippingcompany`,
                name: `Thêm đối tác vận chuyển mới`,
                sub_name: `themdoitacvanchuyenmoi`,
                data: _shippingCompany.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _shippingCompany.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateShippingCompanyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client
            .db(DB)
            .collection(`ShippingCompanies`)
            .findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `ShippingCompany`,
                sub_properties: `shippingcompany`,
                name: `Cập nhật thông tin đối tác vận chuyển`,
                sub_name: `capnhatthongtindoitacvanchuyen`,
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
    addShippingCompanyS,
    getShippingCompanyS,
    updateShippingCompanyS,
};
