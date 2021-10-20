const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        matchQuery['delete'] = false;
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
        if (req.query.warehouse_type) {
            matchQuery['sub_warehouse_type'] = createRegExpQuery(req.query.warehouse_type);
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
                    let: { branchId: '$branch_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$branch_id', '$$branchId'] } } }],
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
        let [branchs, counts] = await Promise.all([
            client.db(DB).collection(`Branchs`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Branchs`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: branchs,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

let addBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _branch = await client.db(DB).collection(`Branchs`).insertOne(req._insert);
        if (!_branch.ops) throw new Error(`500: Create branch fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Branch`,
                sub_properties: `branch`,
                name: `Thêm chi nhánh mới`,
                sub_name: `themchinhanhmoi`,
                data: _branch.ops[0],
                performer_id: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _branch.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Branchs`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Branch`,
                sub_properties: `chinhanh`,
                name: `Cập nhật thông tin chi nhánh`,
                sub_name: `capnhatthongtinchinhanh`,
                data: req._update,
                performer_id: token.user_id,
                date: moment().format(),
            });
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
