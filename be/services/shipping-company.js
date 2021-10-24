const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getShippingCompanyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
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
        if (req.query._business) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: 'business_id',
                        as: '_business',
                    },
                },
                { $unwind: '$_business' }
            );
            projectQuery['_business.password'] = 0;
        }
        if (req.query._creator) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'creator_id',
                        foreignField: 'creator_id',
                        as: '_creator',
                    },
                },
                { $unwind: '$_creator' }
            );
            projectQuery['_creator.password'] = 0;
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [shippingCompanies, counts] = await Promise.all([
            client.db(DB).collection(`ShippingCompanies`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`ShippingCompanies`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: shippingCompanies,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addShippingCompanyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _shippingCompany = await client.db(DB).collection(`ShippingCompanies`).insertOne(req._insert);
        if (!_shippingCompany.insertedId) {
            throw new Error(`500: Lỗi hệ thống, tạo đối tác vận chuyển thất bại!`);
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Add',
                properties: 'Shipping Company',
                name: 'Thêm đối tác vận chuyển mới',
                data: req._insert,
                performer_id: token.user_id,
                data: moment().utc().format(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req._insert });
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
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Update',
                properties: 'Shipping Company',
                name: 'Cập nhật thông tin đối tác vận chuyển',
                data: req._update,
                performer_id: token.user_id,
                data: moment().utc().format(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
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
