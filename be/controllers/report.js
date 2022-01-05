const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

module.exports._getIOReport = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.body.branch) {
            aggregateQuery.push({ store_id: '' });
        }
        if (req.body.store) {
            aggregateQuery.push({ branch_id: '' });
        }
        if (req.body.branch_id) {
            aggregateQuery.push({ branch_id: Number(req.query.branch_id) });
        }
        if (req.body.store_id) {
            aggregateQuery.push({ store_id: Number(req.query.store_id) });
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
        aggregateQuery.push({ $sort: { create_date: 1 } });
        aggregateQuery.push({
            $group: {
                _id: {
                    ...(() => {
                        let result = (() => {
                            if (/^(product)$/gi.test(req.query.type)) {
                                return { product_id: '$product_id' };
                            }
                            if (/^(variant)$/gi.test(req.query.type)) {
                                return { variant_id: '$variant_id' };
                            }
                            return { product_id: '$product_id' };
                        })();
                        if (req.query.store) {
                            result['branch_id'] = '';
                        }
                        if (req.query.branch) {
                            result['store_id'] = '';
                        }
                        if (req.query.store_id) {
                            result['store_id'] = Number(req.query.store_id);
                        }
                        if (req.query.branch_id) {
                            result['branch_id'] = Number(req.query.branch_id);
                        }
                    })(),
                },
                product_id: { $first: '$product_id' },
                variant_id: { $first: '$variant_id' },
                branch_id: { $first: '$branch_id' },
                store_id: { $first: '$store_id' },
                begin_quantity: { $first: '$begin_quantity' },
                import_quantity: { $sum: '$import_quantity' },
                export_quantity: { $sum: '$export_quantity' },
                end_quantity: { $last: '$end_quantity' },
            },
        });
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Products',
                    let: { productId: '$product_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                    as: 'product',
                },
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
        );
        aggregateQuery.push({
            $lookup: {
                from: 'Variants',
                let: { productId: '$product_id' },
                pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                as: 'variants',
            },
        });
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Variants',
                    let: { productId: '$variant' },
                    pipeline: [{ $match: { $expr: { $eq: ['$variant', '$$productId'] } } }],
                    as: 'variant',
                },
            },
            { $unwind: { path: '$variant', preserveNullAndEmptyArrays: true } }
        );
    } catch (err) {
        next(err);
    }
};
