const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');
const { Action } = require('../models/action');

const jwt = require(`../libs/jwt`);

let getStoreS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.store_id) {
            matchQuery['store_id'] = ObjectId(req.query.store_id);
        }
        if (req.query.branch_id) {
            matchQuery['branch_id'] = ObjectId(req.query.branch_id);
        }
        if (token) {
            matchQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            matchQuery['business_id'] = ObjectId(req.query.business_id);
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
        if (req.query.code) {
            matchQuery['code'] = createRegExpQuery(req.query.code);
        }
        if (req.query.name) {
            matchQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.address) {
            matchQuery['sub_address'] = createRegExpQuery(req.query.address);
        }
        if (req.query.district) {
            matchQuery['sub_district'] = createRegExpQuery(req.query.district);
        }
        if (req.query.province) {
            matchQuery['sub_province'] = createRegExpQuery(req.query.province);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { code: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
            ];
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
        if (req.query._employees) {
            aggregateQuery.push({
                $lookup: {
                    from: 'Users',
                    let: { storeId: '$store_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$store_id', '$$storeId'] } } }],
                    as: '_employees',
                },
            });
            projectQuery['_employees.password'] = 0;
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [stores, counts] = await Promise.all([
            client.db(DB).collection(`Stores`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Stores`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: stores,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addStoreS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let store = await client.db(DB).collection(`Stores`).insertOne(req._insert);
        if (!store.insertedId) {
            throw new Error(`500: Lỗi hệ thống, tạo cửa hàng thất bại!`);
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Add',
                properties: 'Store',
                name: 'Thêm cửa hàng mới',
                data: req._insert,
                performer_id: token.user_id,
                data: moment().utc().format(),
            });
            await Promise.all([
                client.db(DB).collection(`Actions`).insertOne(_action),
                client
                    .db(DB)
                    .collection(`Users`)
                    .updateOne(
                        { user_id: ObjectId(token.user_id) },
                        { $set: { store_id: req._insert.store_id } }
                    ),
            ]);
        } catch (err) {
            console.log(err);
        }
        let [user] = await client
            .db(DB)
            .collection(`Users`)
            .aggregate([
                { $match: { user_id: ObjectId(token.user_id) } },
                {
                    $lookup: {
                        from: 'Roles',
                        localField: 'role_id',
                        foreignField: 'role_id',
                        as: '_role',
                    },
                },
                { $unwind: { path: '$_role', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'Branchs',
                        localField: 'branch_id',
                        foreignField: 'branch_id',
                        as: '_branch',
                    },
                },
                { $unwind: { path: '$_branch', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'Stores',
                        localField: 'store_id',
                        foreignField: 'store_id',
                        as: '_store',
                    },
                },
                { $unwind: { path: '$_store', preserveNullAndEmptyArrays: true } },
            ])
            .toArray();
        delete user.password;
        let [accessToken, refreshToken] = await Promise.all([
            jwt.createToken(user, process.env.ACCESS_TOKEN_LIFE),
            jwt.createToken(user, process.env.REFRESH_TOKEN_LIFE),
        ]);
        res.send({ success: true, data: req._insert, accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

let updateStoreS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Stores`).findOneAndUpdate(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: token.business_id,
                type: 'Update',
                properties: 'Store',
                name: 'Cập nhật thông tin cửa hàng',
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
    getStoreS,
    addStoreS,
    updateStoreS,
};
