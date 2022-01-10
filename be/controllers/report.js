const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

module.exports._getIOIReport = async (req, res, next) => {
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
                    product_id: '$product_id',
                    variant_id: '$variant_id',
                    branch_id: '$branch_id',
                    store_id: '$store_id',
                },
                product_id: { $first: '$product_id' },
                variant_id: { $first: '$variant_id' },
                branch_id: { $first: '$branch_id' },
                store_id: { $first: '$store_id' },
                begin_quantity: { $first: '$begin_quantity' },
                begin_price: { $first: '$begin_price' },
                import_quantity: { $sum: '$import_quantity' },
                import_price: { $sum: '$import_price' },
                export_quantity: { $sum: '$export_quantity' },
                export_price: { $sum: '$export_price' },
                end_quantity: { $last: '$end_quantity' },
                end_price: { $last: '$end_price' },
            },
        });
        // aggregateQuery.push(
        //     {
        //         $lookup: {
        //             from: 'Branchs',
        //             let: { branchId: '$branch_id' },
        //             pipeline: [{ $match: { $expr: { $eq: ['$branch_id', '$$branchId'] } } }],
        //             as: 'branch',
        //         },
        //     },
        //     { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } }
        // );
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
                    begin_quantity: { $sum: '$begin_quantity' },
                    begin_price: { $sum: '$begin_price' },
                    import_quantity: { $sum: '$import_quantity' },
                    import_price: { $sum: '$import_price' },
                    export_quantity: { $sum: '$export_quantity' },
                    export_price: { $sum: '$export_price' },
                    end_quantity: { $sum: '$end_quantity' },
                    end_price: { $sum: '$end_price' },
                },
            });
        }
        if (/^(variant)$/gi.test(req.query.type)) {
            aggregateQuery.push({
                $group: {
                    _id: { variant_id: '$variant_id' },
                    product_id: { $first: '$product_id' },
                    variant_id: { $first: '$variant_id' },
                    begin_quantity: { $sum: '$begin_quantity' },
                    begin_price: { $sum: '$begin_price' },
                    import_quantity: { $sum: '$import_quantity' },
                    import_price: { $sum: '$import_price' },
                    export_quantity: { $sum: '$export_quantity' },
                    export_price: { $sum: '$export_price' },
                    end_quantity: { $sum: '$end_quantity' },
                    end_price: { $sum: '$end_price' },
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
                                pipeline: [{ $match: { $expr: { $eq: ['$category_id', '$$categoryId'] } } }],
                                as: '_categories',
                            },
                        },
                        {
                            $lookup: {
                                from: 'Suppliers',
                                let: { supplierId: '$supplier_id' },
                                pipeline: [{ $match: { $expr: { $eq: ['$supplier_id', '$$supplierId'] } } }],
                                as: '_suppliers',
                            },
                        },
                        { $unwind: { path: '$_suppliers', preserveNullAndEmptyArrays: true } },
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
        aggregateQuery.push({ $addFields: { note: '' } });
        let countQuery = [...aggregateQuery];
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        aggregateQuery.push({ $addFields: { note: '' } });
        // lấy data từ database
        let [result, counts] = await Promise.all([
            client.db(req.user.database).collection(`Inventories`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`Inventories`)
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

module.exports._getInventoryReport = async (req, res, next) => {
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
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
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
                                pipeline: [{ $match: { $expr: { $eq: ['$category_id', '$$categoryId'] } } }],
                                as: '_categories',
                            },
                        },
                        {
                            $lookup: {
                                from: 'Suppliers',
                                let: { supplierId: '$supplier_id' },
                                pipeline: [{ $match: { $expr: { $eq: ['$supplier_id', '$$supplierId'] } } }],
                                as: '_suppliers',
                            },
                        },
                        { $unwind: { path: '$_suppliers', preserveNullAndEmptyArrays: true } },
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
        let countQuery = [...aggregateQuery];
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        aggregateQuery.push({ $addFields: { note: '' } });
        // lấy data từ database
        let [result, counts] = await Promise.all([
            client.db(req.user.database).collection(`Inventories`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`Inventories`)
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
            aggregateQuery.push({ $match: { create_date: { $gte: req.query.from_date } } });
        }
        if (req.query.to_date) {
            aggregateQuery.push({ $match: { create_date: { $lte: req.query.to_date } } });
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
            _products[i].profit_rate = Number((_products[i].total_revenue / _products[i].base_price) * 100).toFixed(2);
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
