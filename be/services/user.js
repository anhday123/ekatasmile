const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');
const { Action } = require('../models/action');

const jwt = require(`../libs/jwt`);

let getUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
        if (req.query.user_id) {
            matchQuery['user_id'] = ObjectId(req.query.user_id);
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
        if (req.query.branch_id) {
            matchQuery['branch_id'] = ObjectId(req.query.branch_id);
        }
        if (req.query.store_id) {
            matchQuery['store_id'] = ObjectId(req.query.store_id);
        }
        if (req.query.role_id) {
            matchQuery['role_id'] = ObjectId(req.query.role_id);
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
                { username: createRegExpQuery(req.query.search) },
                { sub_name: createRegExpQuery(req.query.search) },
                { phone: createRegExpQuery(req.query.search) },
            ];
        }
        aggregateQuery.push({ $match: matchQuery });
        projectQuery['password'] = 0;
        // lấy các thuộc tính tùy chọn khác
        if (req.query._business) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'business_id',
                        foreignField: 'user_id',
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
                        foreignField: 'user_id',
                        as: '_creator',
                    },
                },
                { $unwind: '$_creator' }
            );
            projectQuery['_creator.password'] = 0;
        }
        if (req.query._branch) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Branchs',
                        localField: 'branch_id',
                        foreignField: 'branch_id',
                        as: '_branch',
                    },
                },
                { $unwind: '$_branch' }
            );
        }
        if (req.query._store) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Stores',
                        localField: 'store_id',
                        foreignField: 'store_id',
                        as: '_store',
                    },
                },
                { $unwind: '$_store' }
            );
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [users, counts] = await Promise.all([
            client.db(DB).collection(`Users`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Users`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: users,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addUserS = async (req, res, next) => {
    try {
        let token;
        if (req.tokenData) token = req.tokenData.data;
        let user = await client.db(DB).collection(`Users`).insertOne(req._insert);
        if (!user.insertedId) {
            throw new Error(`500: Tạo user thất bại!`);
        }
        delete user.ops[0].password;
        try {
            let _action = new Action();
            _action.create({
                business_id: req._insert.business_id,
                type: 'Add',
                properties: 'Users',
                name: 'Đăng ký người dùng mới',
                data: user.ops[0],
                performer_id: (() => {
                    if (token) {
                        return token.user_id;
                    }
                    return req._insert.user_id;
                })(),
                data: moment().utc().format(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: user.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Users`).findOneAndUpdate(req.params, { $set: req._update });
        delete req._update.password;
        try {
            let _action = new Action();
            _action.create({
                business_id: req._update.business_id,
                type: 'Update',
                properties: 'Users',
                name: 'Cập nhật thông tin người dùng',
                data: user.ops[0],
                performer_id: req._update.user_id,
                data: moment().utc().format(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        if (req._update.user_id == req._update.business_id) {
            await client
                .db(DB)
                .collection('Users')
                .updateMany(
                    {
                        business_id: ObjectId(req._update.user_id),
                    },
                    {
                        $set: {
                            company_name: req._update.company_name,
                            company_website: req._update.company_website,
                        },
                    }
                );
        }
        let [accessToken, refreshToken, _update] = await Promise.all([
            jwt.createToken(req._update, process.env.ACCESS_TOKEN_LIFE),
            jwt.createToken(req._update, process.env.REFRESH_TOKEN_LIFE),
        ]);
        res.send({ success: true, data: req._update, accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserS,
    addUserS,
    updateUserS,
};
