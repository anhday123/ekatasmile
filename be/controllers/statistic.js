const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { stringHandle } = require('../utils/string-handle');

let _getOrderOverview = async (req, res, next) => {
    try {
        req.query = createTimeline(req.query);
        let queries = [];
        if (req.query.branch_id) {
            queries.push({ $match: { branch_id: Number(req.query.branch_id) } });
        }
        if (req.query.from_date) {
            queries.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            queries.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        let [orders] = await client
            .db(req.user.database)
            .collection('Orders')
            .aggregate([
                ...queries,
                {
                    $group: {
                        _id: null,
                        total_order: { $sum: 1 },
                        total_base_price: { $sum: { $sum: '$order_details.total_base_price' } },
                        total_revenue: { $sum: '$final_cost' },
                        total_profit: { $first: 0 },
                    },
                },
            ])
            .toArray();
        orders.total_profit = orders.total_revenue - orders.total_base_price;
        res.send({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

let _getChartOverview = async (req, res, next) => {
    try {
        req.query = createTimeline(req.query);
        let queries = [];
        if (req.query.branch_id) {
            queries.push({ $match: { branch_id: Number(req.query.branch_id) } });
        }
        if (req.query.from_date) {
            queries.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            queries.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        let charts = await client
            .db(req.user.database)
            .collection('Orders')
            .aggregate([
                ...queries,
                {
                    $group: { _id: '$create_day' },
                    create_day: { $first: '$create_day' },
                    total_cost: { $sum: '$total_cost' },
                },
            ])
            .toArray();
        let _charts = {};
        charts.map((eChart) => {
            _charts[eChart.create_day] = eChart;
        });
        let result = {};
        // let timeStart = moment(req.query.from_date).tz(TIMEZONE).format('YYYY-MM-DD');
        let timeEnd = moment(req.query.from_date).tz(TIMEZONE).format('YYYY-MM-DD');
        let key = moment(req.query.from_date).tz(TIMEZONE).add(-1, 'days').format('YYYY-MM-DD');
        do {
            key = moment(key).tz(TIMEZONE).add(1, 'days').format('YYYY-MM-DD');
            result[key] = (_charts[key] && _charts[key].total_cost) || 0;
        } while (key != timeEnd);
        res.send({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

let _getProductOverview = async (req, res, next) => {
    try {
        req.query = createTimeline(req.query);
        let queries = [];
        if (req.query.branch_id) {
            queries.push({ $match: { branch_id: Number(req.query.branch_id) } });
        }
        if (req.query.from_date) {
            queries.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            queries.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        let products = await client
            .db(req.user.database)
            .collection('Inventories')
            .aggregate([
                ...queries,
                { $match: { type: 'sale-export' } },
                {
                    $group: {
                        _id: { product_id: '$product_id' },
                        product_id: { $first: product_id },
                        sale_quantity: { $sum: '$export_quantity' },
                    },
                },
                {
                    $lookup: {
                        from: 'Products',
                        let: { productId: '$product_id' },
                        pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                        as: 'product_info',
                    },
                },
                { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },
            ])
            .toArray();
        res.send({ success: true, data: products });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    _getChartOverview,
    _getOrderOverview,
    _getProductOverview,
};
