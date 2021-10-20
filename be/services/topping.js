const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getToppingS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (token) {
            matchQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            matchQuery['business_id'] = ObjectId(req.query.business_id);
        }
        if (req.query.category_id) {
            matchQuery['category_id'] = ObjectId(req.query.category_id);
        }
        if (req.query.topping_id) {
            matchQuery['topping_id'] = ObjectId(req.query.topping_id);
        }
        if (req.query.creator_id) {
            matchQuery['creator_id'] = ObjectId(req.query.creator_id);
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            matchQuery[`create_date`] = {
                ...matchQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.name) {
            matchQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.search) {
            matchQuery['$or'] = [{ sub_name: createRegExpQuery(req.query.search) }];
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy các thuộc tính tùy chọn khác
        if (req.query._business) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: '_id',
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
                        foreignField: '_id',
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
        let [toppings, counts] = await Promise.all([
            client.db(DB).collection(`Toppings`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Toppings`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: toppings,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addToppingS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _topping = await client.db(DB).collection(`Toppings`).insertOne(req._insert);
        if (!_topping.insertedId) {
            throw new Error('500: Thêm topping thất bại!');
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Store`,
                sub_properties: `store`,
                name: `Thêm cửa hàng mới`,
                sub_name: `themcuahangmoi`,
                data: _topping.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _topping.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateToppingS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Toppings`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Store`,
                sub_properties: `store`,
                name: `Cập nhật thông tin cửa hàng`,
                sub_name: `capnhatthongtincuahang`,
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
    getToppingS,
    addToppingS,
    updateToppingS,
};
