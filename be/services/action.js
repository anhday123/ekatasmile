const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        return '';
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

module.exports._get = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.user) {
            aggregateQuery.push({ business_id: Number(req.user.business_id) });
        }
        if (req.query.business_id) {
            aggregateQuery.push({ business_id: Number(req.query.business_id) });
        }
        if (req.query.performer_id) {
            aggregateQuery.push({ performer_id: Number(req.query.performer_id) });
        }
        if (req.query['today']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('days').format();
            delete req.query.today;
        }
        if (req.query['yesterday']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, `days`).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, `days`).endOf('days').format();
            delete req.query.yesterday;
        }
        if (req.query['this_week']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('weeks').format();
            delete req.query.this_week;
        }
        if (req.query['last_week']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').endOf('weeks').format();
            delete req.query.last_week;
        }
        if (req.query['this_month']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('months').format();
            delete req.query.this_month;
        }
        if (req.query['last_month']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'months').startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'months').endOf('months').format();
            delete req.query.last_month;
        }
        if (req.query['this_year']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('years').format();
            delete req.query.this_year;
        }
        if (req.query['last_year']) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'years').startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'years').endOf('years').format();
            delete req.query.last_year;
        }
        if (req.query['from_date']) {
            req.query[`from_date`] = moment(req.query[`from_date`]).tz(TIMEZONE).startOf('days').format();
        }
        if (req.query['to_date']) {
            req.query[`to_date`] = moment(req.query[`to_date`]).tz(TIMEZONE).endOf('days').format();
        }
        if (req.query.from_date) {
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        if (req.query.type) {
            aggregateQuery.push({ slug_type: new RegExp(removeUnicode(req.query.type || '', true), 'gi') });
        }
        if (req.query.properties) {
            aggregateQuery.push({ slug_properties: new RegExp(removeUnicode(req.query.properties || '', true), 'gi') });
        }
        if (req.query.name) {
            aggregateQuery.push({ slug_name: new RegExp(removeUnicode(req.query.name || '', true), 'gi') });
        }
        if (req.query.search) {
            aggregateQuery.push({
                $or: [
                    { sub_type: new RegExp(removeUnicode(req.query.type || '', true), 'gi') },
                    { sub_properties: new RegExp(removeUnicode(req.query.properties || '', true), 'gi') },
                    { sub_name: new RegExp(removeUnicode(req.query.name || '', true), 'gi') },
                ],
            });
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
        }

        aggregateQuery.push({
            $project: {
                '_business.password': 0,
                '_business.sub_name': 0,
                '_business.sub_address': 0,
                '_business.sub_district': 0,
                '_business.sub_province': 0,
                '_performer.password': 0,
                '_performer.sub_name': 0,
                '_performer.sub_address': 0,
                '_performer.sub_district': 0,
                '_performer.sub_province': 0,
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
        let [actions, counts] = await Promise.all([
            client.db(DB).collection(`Actions`).aggregate(aggregateQuery).toArray(),
            client
                .db(DB)
                .collection(`Actions`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: actions,
        });
    } catch (err) {
        next(err);
    }
};
