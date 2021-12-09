const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { removeUnicode } = require('../utils/string-handle');
const { Action } = require('../models/action');

let getWarrantyS = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.warranty_id) {
            aggregateQuery.push({ $match: { warranty_id: Number(req.query.warranty_id) } });
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
        if (req.query.time) {
            aggregateQuery.push({ $match: { time: Number(req.query.time) } });
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
                    code: new RegExp(`${removeUnicode(req.query.code, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
                },
            });
        }
        if (req.query.name) {
            aggregateQuery.push({
                $match: {
                    sub_name: new RegExp(`${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
                },
            });
        }
        if (req.query.type) {
            aggregateQuery.push({
                $match: {
                    sub_type: new RegExp(`${removeUnicode(req.query.type, false).replace(/(\s){1,}/g, '(.*?)')}`, 'ig'),
                },
            });
        }
        if (req.query.search) {
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
        }
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
                { $unwind: { path: '$_business', preserveNullAndEmptyArrays: true } }
            );
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
                { $unwind: { path: '$_creator', preserveNullAndEmptyArrays: true } }
            );
        }
        aggregateQuery.push({
            $project: {
                sub_name: 0,
                '_business.password': 0,
                '_creator.password': 0,
            },
        });
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { create_date: -1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        // lấy data từ database
        let [warranties, counts] = await Promise.all([
            client.db(DB).collection(`Warranties`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Warranties`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            data: warranties,
            count: counts[0] ? counts[0].counts : 0,
        });
    } catch (err) {
        next(err);
    }
};

let addWarrantyS = async (req, res, next) => {
    try {
        let _warranty = await client.db(DB).collection(`Warranties`).insertOne(req._insert);
        if (!_warranty.insertedId) {
            throw new Error('500: Lỗi hệ thống, tạo chương trình bảo hành thất bại!');
        }
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Add',
                properties: 'Warranty',
                name: 'Thêm chương trình bảo hành mới',
                data: req._insert,
                performer_id: Number(req.user.user_id),
                date: new Date(),
            });
            await client.db(DB).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: _warranty.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateWarrantyS = async (req, res, next) => {
    try {
        await client.db(DB).collection(`Warranties`).findOneAndUpdate(req.params, { $set: req._update });
        try {
            let _action = new Action();
            _action.create({
                business_id: Number(req.user.business_id),
                type: 'Update',
                properties: 'Warranty',
                name: 'Cập nhật chương trình bảo hành',
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
    getWarrantyS,
    addWarrantyS,
    updateWarrantyS,
};
