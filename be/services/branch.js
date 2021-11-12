const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

const jwt = require(`../libs/jwt`);

let getBranchS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.branch_id) {
            aggregateQuery.push({ $match: { branch_id: Number(req.query.branch_id) } });
        }
        if (req.user) {
            aggregateQuery.push({ $match: { business_id: Number(req.user.business_id) } });
        }
        if (req.query.business_id) {
            aggregateQuery.push({ $match: { business_id: Number(req.query.business_id) } });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({ $match: { creator_id: Number(req.query.creator_id) } });
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            aggregateQuery.push({
                $match: {
                    code: new RegExp(
                        `${removeUnicode(req.query.code, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.name) {
            aggregateQuery.push({
                $match: {
                    sub_name: new RegExp(
                        `${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.warehouse_type) {
            aggregateQuery.push({
                $match: {
                    sub_warehouse_type: new RegExp(
                        `${removeUnicode(req.query.warehouse_type, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.address) {
            aggregateQuery.push({
                $match: {
                    sub_address: new RegExp(
                        `${removeUnicode(req.query.address, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.district) {
            aggregateQuery.push({
                $match: {
                    sub_district: new RegExp(
                        `${removeUnicode(req.query.district, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.province) {
            aggregateQuery.push({
                $match: {
                    sub_province: new RegExp(
                        `${removeUnicode(req.query.province, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.search) {
            aggregateQuery.push({
                $match: {
                    $or: [
                        {
                            code: new RegExp(
                                `${removeUnicode(req.query.search, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        },
                        {
                            sub_name: new RegExp(
                                `${removeUnicode(req.query.search, false).replace(/(\s){1,}/g, '(.*?)')}`,
                                'ig'
                            ),
                        },
                    ],
                },
            });
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
                { $unwind: { path: '$_business', preserveNullAndEmptyArrays: true } }
            );
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
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
            );
        }
        if (req.query._employees) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        let: { branchId: '$branch_id' },
                        pipeline: [{ $match: { $expr: { $eq: ['$branch_id', '$$branchId'] } } }],
                        as: '_employees',
                    },
                },
                { $unwind: { path: '$_employees', preserveNullAndEmptyArrays: true } }
            );
        }
        aggregateQuery.push({
            $project: {
                sub_name: 0,
                sub_warehouse_type: 0,
                sub_address: 0,
                sub_district: 0,
                sub_province: 0,
                '_business.password': 0,
                '_creator.password': 0,
                '_employees.password': 0,
            },
        });
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { create_date: -1 } });
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        // lấy data từ database
        let [branchs, counts] = await Promise.all([
            client.db(DB).collection(`Branchs`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Branchs`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            data: branchs,
            count: counts[0] ? counts[0].counts : 0,
        });
    } catch (err) {
        next(err);
    }
};

let addBranchS = async (req, res, next) => {
    try {
        let _branch = await client.db(DB).collection(`Branchs`).insertOne(req._insert);
        if (!_branch.insertedId) {
            throw new Error('500: Lỗi hệ thống, tạo chi nhánh thất bại!');
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Add',
                properties: 'Branch',
                name: 'Thêm chi nhánh mới',
                data: req._insert,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
            await client
                .db(DB)
                .collection(`Users`)
                .updateOne(
                    { user_id: Number(req.user.user_id) },
                    { $set: { branch_id: Number(req._insert.branch_id) } }
                );
        } catch (err) {
            console.log(err);
        }
        let [user] = await client
            .db(DB)
            .collection(`Users`)
            .aggregate([
                { $match: { user_id: Number(req.user.user_id) } },
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

let updateBranchS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Branchs`).findOneAndUpdate(req.params, { $set: req._update });
        await client.db(DB).collection('Locations').updateMany({inventory_id: Number(req.params.branch_id)},{name: req._update.name});
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Update',
                properties: 'Branch',
                name: 'Cập nhật thông tin chi nhánh',
                data: req._update,
                performer_id: Number(req.user.user_id),
                date: new Date(),
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
    getBranchS,
    addBranchS,
    updateBranchS,
};
