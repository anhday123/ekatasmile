const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

module.exports._getIOIReport = async (req, res, next) => {
    try {
        let beginPeriodQuery = [];
        let inPeriodQuery = [];
        let endPeriodQuery = [];
        req.query = createTimeline(req.query);
        if (!req.query.from_date || !req.query.to_date) {
            throw new Error('400: Thiếu mốc thời gian cần báo cáo!');
        }
        if (req.query.from_date) {
            beginPeriodQuery.push({ $match: { create_date: { $lte: req.query.from_date } } });
            inPeriodQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            inPeriodQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
            endPeriodQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
        }
        if (req.query.product_id) {
            beginPeriodQuery.push({ $match: { product_id: Number(req.query.product_id) } });
            inPeriodQuery.push({ $match: { product_id: Number(req.query.product_id) } });
            endPeriodQuery.push({ $match: { product_id: Number(req.query.product_id) } });
        }
        if (req.query.warehouse_id) {
            beginPeriodQuery.push({ $match: { warehouse_id: Number(req.query.warehouse_id) } });
            inPeriodQuery.push({ $match: { warehouse_id: Number(req.query.warehouse_id) } });
            endPeriodQuery.push({ $match: { warehouse_id: Number(req.query.warehouse_id) } });
        }
        if (req.query.bucket_id) {
            beginPeriodQuery.push({ $match: { bucket_id: Number(req.query.bucket_id) } });
            inPeriodQuery.push({ $match: { bucket_id: Number(req.query.bucket_id) } });
            endPeriodQuery.push({ $match: { bucket_id: Number(req.query.bucket_id) } });
        }
        if (req.query.order_id) {
            beginPeriodQuery.push({ $match: { order_id: Number(req.query.order_id) } });
            inPeriodQuery.push({ $match: { order_id: Number(req.query.order_id) } });
            endPeriodQuery.push({ $match: { order_id: Number(req.query.order_id) } });
        }
        beginPeriodQuery.push({
            $group: {
                ...(() => {
                    if (/^(product)$/g.test(req.query.type)) {
                        return { _id: { product_id: '$product_id' }, product_id: { $first: '$product_id' } };
                    }
                    if (/^(variant)$/g.test(req.query.type)) {
                        return { _id: { variant_id: '$variant_id' }, variant_id: { $first: '$variant_id' } };
                    }
                    throw new Error('400: Missing query type!');
                })(),
                begin_quantity: { $sum: { $subtract: ['$import_quantity', '$export_quantity'] } },
                begin_price: { $sum: { $subtract: ['$import_price', '$export_price'] } },
            },
        });
        inPeriodQuery.push({
            $group: {
                ...(() => {
                    if (/^(product)$/g.test(req.query.type)) {
                        return { _id: { product_id: '$product_id' }, product_id: { $first: '$product_id' } };
                    }
                    if (/^(variant)$/g.test(req.query.type)) {
                        return { _id: { variant_id: '$variant_id' }, variant_id: { $first: '$variant_id' } };
                    }
                    throw new Error('400: Missing query type!');
                })(),
                import_quantity: { $sum: '$import_quantity' },
                import_price: { $sum: '$import_price' },
                export_quantity: { $sum: '$export_quantity' },
                export_price: { $sum: '$export_price' },
            },
        });
        endPeriodQuery.push({
            $group: {
                ...(() => {
                    if (/^(product)$/g.test(req.query.type)) {
                        return { _id: { product_id: '$product_id' }, product_id: { $first: '$product_id' } };
                    }
                    if (/^(variant)$/g.test(req.query.type)) {
                        return { _id: { variant_id: '$variant_id' }, variant_id: { $first: '$variant_id' } };
                    }
                    throw new Error('400: Missing query type!');
                })(),
                end_quantity: { $sum: { $subtract: ['$import_quantity', '$export_quantity'] } },
                end_price: { $sum: { $subtract: ['$import_price', '$export_price'] } },
            },
        });
        countQuery = [...endPeriodQuery];
        let page = Number(req.query.page || 1);
        let page_size = Number(req.query.page_size || 50);
        beginPeriodQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        inPeriodQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        endPeriodQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        endPeriodQuery.push(
            {
                $lookup: {
                    from: 'Products',
                    let: { productId: '$_id.product_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$product_id', '$$productId'] } } }],
                    as: 'product_info',
                },
            },
            { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } }
        );
        let beginPeriods = await client.db(DB).collection('Inventories').aggregate(beginPeriodQuery).toArray();
        let inPeriods = await client.db(DB).collection('Inventories').aggregate(inPeriodQuery).toArray();
        let endPeriods = await client.db(DB).collection('Inventories').aggregate(endPeriodQuery).toArray();
        let counts = client
            .db(DB)
            .collection(`Inventories`)
            .aggregate([...countQuery, { $count: 'counts' }])
            .toArray();
        let _beginPeriods = {};
        beginPeriods.map((eBegin) => {
            _beginPeriods[eBegin.product_id] = eBegin;
        });
        let _inPeriods = {};
        inPeriods.map((eIn) => {
            _inPeriods[eIn.product_id] = eIn;
        });
        let _endPeriods = {};
        endPeriods.map((eEnd) => {
            _endPeriods[eEnd.product_id] = eEnd;
        });
        let result = [];
        for (let i in _endPeriods) {
            result.push({
                product_id: (_endPeriods[i] && _endPeriods[i].product_id) || 0,
                begin_quantity: (_beginPeriods[i] && _beginPeriods[i].begin_quantity) || 0,
                begin_price: (_beginPeriods[i] && _beginPeriods[i].begin_price) || 0,
                import_quantity: (_inPeriods[i] && _inPeriods[i].import_quantity) || 0,
                import_price: (_inPeriods[i] && _inPeriods[i].import_price) || 0,
                export_quantity: (_inPeriods[i] && _inPeriods[i].export_quantity) || 0,
                export_price: (_inPeriods[i] && _inPeriods[i].export_price) || 0,
                end_quantity: (_endPeriods[i] && _endPeriods[i].end_quantity) || 0,
                end_price: (_endPeriods[i] && _endPeriods[i].end_price) || 0,
                product_info: (_endPeriods[i] && _endPeriods[i].product_info) || {},
            });
        }
        res.send({ success: true, count: counts[0] ? counts[0].counts : 0, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports._getInventoryReport = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.branch) {
            aggregateQuery.push({ $match: { store_id: '' } });
        }
        if (req.query.store) {
            aggregateQuery.push({ $match: { branch_id: '' } });
        }
        if (req.query.branch_id) {
            let ids = req.query.branch_id.split('---').map((id) => {
                return Number(id);
            });
            console.log(ids);
            aggregateQuery.push({ $match: { branch_id: { $in: ids } } });
        }
        if (req.query.store_id) {
            aggregateQuery.push({ $match: { store_id: Number(req.query.store_id) } });
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
            aggregateQuery.push({
                $match: { create_date: { $gte: req.query.from_date } },
            });
        }
        if (req.query.to_date) {
            aggregateQuery.push({
                $match: { create_date: { $lte: req.query.to_date } },
            });
        }
        if (req.query.warehouse_id) {
            aggregateQuery.push({
                $match: { branch_id: Number(req.query.warehouse_id) },
            });
        }
        aggregateQuery.push({ $sort: { create_date: 1 } });
        if (/^(product)$/gi.test(req.query.type) || !req.query.type) {
            aggregateQuery.push({
                $group: {
                    _id: {
                        product_id: '$product_id',
                        branch_id: '$branch_id',
                        store_id: '$store_id',
                    },
                    product_id: { $first: '$product_id' },
                    branch_id: { $first: '$branch_id' },
                    store_id: { $first: '$store_id' },
                    // begin_quantity: { $first: '$begin_quantity' },
                    // begin_price: { $first: '$begin_price' },
                    // import_quantity: { $sum: '$import_quantity' },
                    // import_price: { $sum: '$import_price' },
                    // export_quantity: { $sum: '$export_quantity' },
                    // export_price: { $sum: '$export_price' },
                    // end_quantity: { $last: '$end_quantity' },
                    // end_price: { $last: '$end_price' },

                    end_quantity: { $last: '$end_quantity' },
                    end_price: { $last: '$end_price' },
                },
            });
        }
        if (/^(variant)$/gi.test(req.query.type)) {
            aggregateQuery.push({
                $group: {
                    _id: {
                        product_id: '$product_id',
                        variant_id: '$variant_id',
                        branch_id: '$branch_id',
                        store_id: '$store_id',
                    },
                    product_id: { $first: '$product_id' },
                    variant_id: { $first: '$variant_id' },
                    branch_id: { $first: '$branch_id' },
                    store_id: { $first: '$store_id' },
                    // begin_quantity: { $first: '$begin_quantity' },
                    // begin_price: { $first: '$begin_price' },
                    // import_quantity: { $sum: '$import_quantity' },
                    // import_price: { $sum: '$import_price' },
                    // export_quantity: { $sum: '$export_quantity' },
                    // export_price: { $sum: '$export_price' },
                    // end_quantity: { $last: '$end_quantity' },
                    // end_price: { $last: '$end_price' },

                    end_quantity: { $last: '$end_quantity' },
                    end_price: { $last: '$end_price' },
                },
            });
        }
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Branchs',
                    let: { branchId: '$branch_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$branch_id', '$$branchId'] } } }],
                    as: 'branch',
                },
            },
            { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } }
        );
        // aggregateQuery.push(
        //     {
        //         $lookup: {
        //             from: 'Stores',
        //             let: { storeId: '$store_id' },
        //             pipeline: [{ $match: { $expr: { $eq: ['$store_id', '$$storeId'] } } }],
        //             as: 'store',
        //         },
        //     },
        //     { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } }
        // );
        if (/^(product)$/gi.test(req.query.type) || !req.query.type) {
            aggregateQuery.push({
                $group: {
                    _id: { product_id: '$product_id' },
                    product_id: { $first: '$product_id' },
                    warehouse: {
                        $push: {
                            branch_id: '$branch_id',
                            branch: '$branch',
                            store_id: '$store_id',
                            store: '$store',
                            // begin_quantity: '$begin_quantity',
                            // begin_price: '$begin_price',
                            // import_quantity: '$import_quantity',
                            // import_price: '$import_price',
                            // export_quantity: '$export_quantity',
                            // export_price: '$export_price',
                            // end_quantity: '$end_quantity',
                            // end_price: '$end_price',

                            quantity: '$end_quantity',
                            price: '$end_price',
                        },
                    },
                },
            });
        }
        if (/^(variant)$/gi.test(req.query.type)) {
            aggregateQuery.push({
                $group: {
                    _id: { variant_id: '$variant_id' },
                    product_id: { $first: '$product_id' },
                    variant_id: { $first: '$variant_id' },
                    warehouse: {
                        $push: {
                            branch_id: '$branch_id',
                            branch: '$branch',
                            store_id: '$store_id',
                            store: '$store',
                            // begin_quantity: '$begin_quantity',
                            // begin_price: '$begin_price',
                            // import_quantity: '$import_quantity',
                            // import_price: '$import_price',
                            // export_quantity: '$export_quantity',
                            // export_price: '$export_price',
                            // end_quantity: '$end_quantity',
                            // end_price: '$end_price',

                            quantity: '$end_quantity',
                            price: '$end_price',
                        },
                    },
                },
            });
        }
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Products',
                    let: { productId: '$product_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
                        {
                            $lookup: {
                                from: 'Categories',
                                let: { categoryId: '$category_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$category_id', '$$categoryId'] },
                                        },
                                    },
                                ],
                                as: '_categories',
                            },
                        },
                        {
                            $lookup: {
                                from: 'Suppliers',
                                let: { supplierId: '$supplier_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$supplier_id', '$$supplierId'] },
                                        },
                                    },
                                ],
                                as: '_suppliers',
                            },
                        },
                        {
                            $unwind: {
                                path: '$_suppliers',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ],
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
                    let: { variantId: '$variant_id' },
                    pipeline: [{ $match: { $expr: { $eq: ['$variant_id', '$$variantId'] } } }],
                    as: 'variant',
                },
            },
            { $unwind: { path: '$variant', preserveNullAndEmptyArrays: true } }
        );
        if (req.query.category_id) {
            let ids = req.query.category_id.map((id) => {
                return Number(id);
            });
            aggregateQuery.push({ $match: { category_id: { $in: ids } } });
        }
        let countQuery = [...aggregateQuery];
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        aggregateQuery.push({ $addFields: { note: '' } });
        // lấy data từ database
        let [result, counts] = await Promise.all([
            client.db(req.user.database).collection(`VariantInventories`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`VariantInventories`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._getOrderReport = async (req, res, next) => {
    try {
        let aggregateQuery = [];
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
            aggregateQuery.push({
                $match: { create_date: { $gte: req.query.from_date } },
            });
        }
        if (req.query.to_date) {
            aggregateQuery.push({
                $match: { create_date: { $lte: req.query.to_date } },
            });
        }
        let orders = await client.db(req.user.database).collection('Orders').aggregate(aggregateQuery).toArray();
        let _products = {};
        let productIds = [];
        orders.map((order) => {
            order.order_details.map((detail) => {
                productIds.push(detail.product_id);
                if (!_products[`${detail.product_id}`]) {
                    _products[`${detail.product_id}`] = {
                        product_id: detail.product_id,
                        product: {},
                        sale_quantity: 0,
                        total_revenue: 0,
                        base_price: 0,
                        gross_profit: 0,
                        profit_rate: 0,
                    };
                }
                if (_products[`${detail.product_id}`]) {
                    _products[`${detail.product_id}`].sale_quantity += detail.quantity;
                    _products[`${detail.product_id}`].total_revenue += detail.quantity * detail.price;
                    _products[`${detail.product_id}`].base_price += detail.total_base_price;
                    _products[`${detail.product_id}`].gross_profit +=
                        detail.quantity * detail.price - detail.total_base_price;
                }
            });
        });
        productIds = [...new Set(productIds)];
        let productInDBs = await client
            .db(req.user.database)
            .collection('Products')
            .find({ product_id: { $in: productIds } })
            .toArray();
        let _productInDBs = {};
        productInDBs.map((eProduct) => {
            _productInDBs[`${eProduct.product_id}`] = eProduct;
        });
        for (let i in _products) {
            _products[i].product = { ..._products[i].product, ..._productInDBs[i] };
            _products[i].profit_rate = Number(
                ((_products[i].total_revenue / _products[i].base_price) * 100).toFixed(2)
            );
        }
        _products = Object.values(_products);
        let counts = _products.length;
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            _products = _products.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        res.send({ success: true, count: counts, data: _products });
    } catch (err) {
        next(err);
    }
};

module.exports._getFinanceReport = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.receipt_id) {
            aggregateQuery.push({
                $match: { receipt_id: Number(req.query.receipt_id) },
            });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({
                $match: { creator_id: Number(req.query.creator_id) },
            });
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
            aggregateQuery.push({
                $match: { create_date: { $gte: req.query.from_date } },
            });
        }
        if (req.query.to_date) {
            aggregateQuery.push({
                $match: { create_date: { $lte: req.query.to_date } },
            });
        }
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'payer',
                    foreignField: 'user_id',
                    as: '_payer',
                },
            },
            { $unwind: { path: '$_payer', preserveNullAndEmptyArrays: true } }
        );
        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'receiver',
                    foreignField: 'user_id',
                    as: '_receiver',
                },
            },
            { $unwind: { path: '$_receiver', preserveNullAndEmptyArrays: true } }
        );
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
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { create_date: 1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        // lấy data từ database
        let [result, counts, total] = await Promise.all([
            client.db(req.user.database).collection(`Finances`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`Finances`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
            client
                .db(req.user.database)
                .collection(`Finances`)
                .aggregate([...countQuery, { $group: { _id: { type: '$type' }, total: { $sum: '$value' } } }])
                .toArray(),
        ]);
        let [totalRevenue, totalExpenditure] = total;
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            total_revenue: totalRevenue ? totalRevenue.total : 0,
            total_expenditure: totalExpenditure ? totalExpenditure.total : 0,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._createFinanceReport = async (req, res, next) => {
    try {
        [].map((e) => {
            if (req.body[e] == undefined) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        let receiptMaxId = await client.db(req.user.database).collection('AppSetting').findOne({ name: 'Finances' });
        let receipt_id = (() => {
            if (receiptMaxId && receiptMaxId.value) {
                return receiptMaxId.value;
            }
            return 0;
        })();
        receipt_id++;
        let _finance = {
            receipt_id: receipt_id,
            code: String(receipt_id).padStart(6, '0'),
            source: req.body.source || 'AUTO',
            //REVENUE - EXPENDITURE
            type: req.body.type || 'REVENUE',
            payments: req.body.payments || [],
            value: req.body.value || 0,
            payer: req.body.payer || req.user.user_id,
            receiver: req.body.receiver || req.user.user_id,
            status: req.body.status || 'DRAFT',
            note: req.body.note || '',
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
        };
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne({ name: 'Finances' }, { $set: { name: 'Finances', value: receipt_id } }, { $upsert: true });
        let insert = await client.db(req.user.database).collection('Finances').insertOne(_finance);
        if (!insert.insertedId) {
            throw new Error(`500: Tạo phiếu thu chi thất bại!`);
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports._updateFinanceReport = async (req, res, next) => {
    try {
        req.params.receipt_id = Number(req.params.receipt_id);
        let finance = await client.db(req.user.database).collection('Finances').findOne(req.params);
        if (!finance) {
            throw new Error(`400: Phiếu thu/chi không tồn tại!`);
        }
        delete req.body._id;
        delete req.body.receipt_id;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _finance = { ...finance, ...req.body };
        _finance = {
            receipt_id: _finance.receipt_id,
            //REVENUE - EXPENDITURE
            type: _finance.type || 'REVENUE',
            payments: _finance.payments || [],
            status: _finance.status || 'DRAFT',
            value: _finance.value || 0,
            payer: _finance.payer || req.user.user_id,
            receiver: _finance.receiver || req.user.user_id,
            note: _finance.note || '',
            create_date: _finance.create_date,
            creator_id: _finance.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
        };
    } catch (err) {
        next(err);
    }
};
