const moment = require(`moment-timezone`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getActionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (token) {
            matchQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            matchQuery['business_id'] = req.query.business_id;
        }
        if (req.query.performer_id) {
            matchQuery['performer_id'] = req.query.performer_id;
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            matchQuery[`date`] = {
                ...matchQuery[`date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            matchQuery[`date`] = {
                ...matchQuery[`date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.type) {
            matchQuery['sub_type'] = createRegExpQuery(req.query.type);
        }
        if (req.query.properties) {
            matchQuery['sub_properties'] = createRegExpQuery(req.query.properties);
        }
        if (req.query.name) {
            matchQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.search) {
            matchQuery['$or'] = [
                { sub_type: createRegExpQuery(req.query.search) },
                { sub_properties: createRegExpQuery(req.query.search) },
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
                        foreignField: 'user_id',
                        as: '_business',
                    },
                },
                { $unwind: '$_business' }
            );
            projectQuery['_business.password'] = 0;
        }
        if (req.query._performer) {
            aggregateQuery.push(
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'performer_id',
                        foreignField: 'user_id',
                        as: '_performer',
                    },
                },
                { $unwind: '$_performer' }
            );
            projectQuery['_performer.password'] = 0;
        }
        if (Object.keys(projectQuery).length != 0) {
            aggregateQuery.push({ $project: projectQuery });
        }
        aggregateQuery.push({ $sort: { create_date: -1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        // lấy data từ database
        let [actions, counts] = await Promise.all([
            client.db(DB).collection(`Actions`).aggregate(aggregateQuery).toArray(),
            client.db(DB).collection(`Actions`).find(matchQuery).count(),
        ]);
        res.send({
            success: true,
            data: actions,
            count: counts,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionS,
};
