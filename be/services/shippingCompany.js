const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const XLSX = require('xlsx');

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
    text = new String(text).toLowerCase();
    return text;
};

const validate = (current, fields) => {
    var object = {};
    Object.keys(current).map((cur) => {
        if (fields.includes(cur) == true && current[cur] != undefined) {
            object[cur] = current[cur];
        }
    });
    return Object.keys(object).length == fields.length ? object : false;
};

let convertToSlug = (text) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        return '';
    }

    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    text = text.replace(/\s/g, '_');

    text = new String(text).toLowerCase();
    return text;
};

module.exports._get = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.shipping_company_id) {
            aggregateQuery.push({
                $match: { shipping_company_id: Number(req.query.shipping_company_id) },
            });
        }
        if (req.query.code) {
            aggregateQuery.push({ $match: { code: String(req.query.code) } });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({
                $match: { creator_id: Number(req.query.creator_id) },
            });
        }

        if (req.query['today'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('days').format();
            delete req.query.today;
        }
        if (req.query['yesterday'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, `days`).startOf('days').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, `days`).endOf('days').format();
            delete req.query.yesterday;
        }
        if (req.query['this_week'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('weeks').format();
            delete req.query.this_week;
        }
        if (req.query['last_week'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').startOf('weeks').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'weeks').endOf('weeks').format();
            delete req.query.last_week;
        }
        if (req.query['this_month'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('months').format();
            delete req.query.this_month;
        }
        if (req.query['last_month'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'months').startOf('months').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'months').endOf('months').format();
            delete req.query.last_month;
        }
        if (req.query['this_year'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).endOf('years').format();
            delete req.query.this_year;
        }
        if (req.query['last_year'] != undefined) {
            req.query[`from_date`] = moment().tz(TIMEZONE).add(-1, 'years').startOf('years').format();
            req.query[`to_date`] = moment().tz(TIMEZONE).add(-1, 'years').endOf('years').format();
            delete req.query.last_year;
        }
        if (req.query['from_date'] != undefined) {
            req.query[`from_date`] = moment(req.query[`from_date`]).tz(TIMEZONE).startOf('days').format();
        }
        if (req.query['to_date'] != undefined) {
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
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.name) {
            aggregateQuery.push({
                $match: {
                    slug_name: new RegExp(
                        `${removeUnicode(req.query.name, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.address) {
            aggregateQuery.push({
                $match: {
                    slug_address: new RegExp(
                        `${removeUnicode(req.query.address, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.district) {
            aggregateQuery.push({
                $match: {
                    slug_district: new RegExp(
                        `${removeUnicode(req.query.district, false).replace(/(\s){1,}/g, '(.*?)')}`,
                        'ig'
                    ),
                },
            });
        }
        if (req.query.province) {
            aggregateQuery.push({
                $match: {
                    slug_province: new RegExp(
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
                            slug_name: new RegExp(
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
                slug_name: 0,
                slug_address: 0,
                slug_district: 0,
                slug_province: 0,
                '_business.password': 0,
                '_business.slug_name': 0,
                '_business.slug_address': 0,
                '_business.slug_district': 0,
                '_business.slug_province': 0,
                '_creator.password': 0,
                '_creator.slug_name': 0,
                '_creator.slug_address': 0,
                '_creator.slug_district': 0,
                '_creator.slug_province': 0,
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
        let [shippingCompanies, counts] = await Promise.all([
            client.db(req.user.database).collection(`ShippingCompanies`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`ShippingCompanies`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: shippingCompanies,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        let insert = await client.db(req.user.database).collection(`ShippingCompanies`).insertOne(req.body);
        if (!insert.insertedId) {
            throw new Error(`500: Tạo đối tác vận chuyển thất bại!`);
        }
        try {
            let _action = {
                business_id: req.user.business_id,
                type: 'Tạo',
                properties: 'Đối tác vận chuyển',
                name: 'Tạo đối tác vận chuyển',
                data: req.body,
                performer_id: req.user.user_id,
                date: moment().tz(TIMEZONE).format(),
                slug_type: 'tao',
                slug_properties: 'doitacvanchuyen',
                name: 'taodoitacvanchuyen',
            };
            await Promise.all([client.db(req.user.database).collection(`Actions`).insertOne(_action)]);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        await client.db(req.user.database).collection(`ShippingCompanies`).updateOne(req.params, { $set: req.body });
        try {
            let _action = {
                business_id: req.user.business_id,
                type: 'Cập nhật',
                properties: 'Đối tác vận chuyển',
                name: 'Cập nhật đối tac vận chuyển',
                data: req.body,
                performer_id: req.user.user_id,
                date: moment().tz(TIMEZONE).format(),
                slug_type: 'capnhat',
                slug_properties: 'doitacvanchuyen',
                name: 'capnhatdoitacvanchuyen',
            };
            await client.db(req.user.database).collection(`Actions`).insertOne(_action);
        } catch (err) {
            console.log(err);
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports._importCompareCard = async (req, res, next) => {
    try {
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: true,
        });
        let rows = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);

        var fields_order = [
            'ma_van_don',
            'ngay_nhan_don',
            'ngay_hoan_thanh',
            'khoi_luong',
            'tien_cod',
            'phi_bao_hiem',
            'phi_giao_hang',
            'phi_luu_kho',
        ];

        var fields_shipper = ['ma_don_vi_van_chuyen', 'phi_cod', 'phi_giao_hang', 'phi_luu_kho'];

        if (req.body.type != 'order' && req.body.type != 'shipper') throw new Error('400: Vui lòng truyền loại phiếu');

        if (!req.body.shipping_company_id) throw new Error('400: Vui lòng truyền đơn vị vận chuyển');

        if (!req.body.status) throw new Error('400: Vui lòng truyền trạng thái phiếu');

        if (req.body.status != 'DRAFT' && req.body.status != 'COMPLETE')
            throw new Error('400: Trạng thái phiếu không hợp lệ');

        var fields = [];
        if (req.body.type == 'order') {
            fields = fields_order;
        } else {
            fields = fields_shipper;
        }

        // valid date
        var data_import = [];
        var date_min = moment().tz(TIMEZONE).unix();
        var date_max = moment().subtract(10, 'years').tz(TIMEZONE).unix();
        rows.map((item) => {
            Object.keys(item).map((i) => {
                item[`${convertToSlug(i)}`] = item[`${i}`];
                return item;
            });
            var valid = validate(item, fields);
            if (!valid) throw new Error('401: Tên cột không đúng quy định, vui lòng xem lại');

            if (date_min > moment(item['ngay_nhan_don']).tz(TIMEZONE).unix())
                date_min = moment(item['ngay_nhan_don']).tz(TIMEZONE).unix();
        });

        // Trừ ra thêm 1 ngày cho chắc

        var query = [
            {
                $match: {
                    create_date: {
                        $gte: moment(date_min * 1000)
                            .subtract(1, 'days')
                            .format(),
                    },
                },
            },
            {
                $match: {
                    is_delivery: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    code: 1,
                    final_cost: 1,
                    shipping_info: 1,
                },
            },
        ];

        // Tien hanh doi soat
        var problems = [
            {
                name_problem: 'Chênh lệch tiền thu hộ \n Trên lệch phí vận chuyển',
                description: '',
                row: 1,
                order_code: '001',
                cod_fix: 30000,
                fee_shipping_fix: 12000,
            },
        ];

        var orders = await client.db(req.user.database).collection('Orders').aggregate(query).toArray();

        // Tien hanh doi soat

        for (var i = 0; i < rows.length; i++) {
            rows[i].status = 'done';
        }

        var result_stt = await client
            .db(req.user.database)
            .collection('CardCompare')
            .aggregate([
                {
                    $match: {
                        create_date_stt: moment().tz(process.env.TIMEZONE).format('yyyy/MM/DD'),
                    },
                },
                {
                    $count: 'counts',
                },
            ])
            .toArray();
        var stt = result_stt.length > 1 ? result_stt[0].counts : 0;

        var code = moment().tz(process.env.TIMEZONE).format('yyyy-MM-DD') + '-' + (stt + 1);

        var card = {
            code: code,
            create_date: moment().tz(process.env.TIMEZONE).format(),
            shipping_company_id: parseInt(req.body.shipping_company_id),
            data: rows,
            problems: problems,
            create_date_stt: moment().tz(process.env.TIMEZONE).format('yyyy/MM/DD'),
            status: req.body.status,
            employee_id: parseInt(req.user.user_id),
        };

        await client.db(req.user.database).collection('CardCompare').insertOne(card);

        return res.send({ success: true, result: rows, problems: problems });
    } catch (err) {
        next(err);
    }
};

module.exports._createCompareCard = async (req, res, next) => {
    try {
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports._getCompareCard = async (req, res, next) => {
    try {
        var aggregateQuery = [];

        if (req.query.code) {
            aggregateQuery.push({
                $match: { code: new RegExp(req.query.code, 'ig') },
            });
        }

        if (req.query.shipping_company_id) {
            aggregateQuery.push({
                $match: { shipping_company_id: Number(req.query.shipping_company_id) },
            });
        }

        if (req.query.employee_id) {
            aggregateQuery.push({
                $match: { employee_id: Number(req.query.employee_id) },
            });
        }
        if (req.query.creator_id) {
            aggregateQuery.push({
                $match: { creator_id: Number(req.query.creator_id) },
            });
        }

        if (req.query.shipping_status) {
            aggregateQuery.push({
                $match: {
                    bill_status: removeUnicode(String(req.query.shipping_status), true).toUpperCase(),
                },
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

        if (req.query.status_card) aggregateQuery.push({ $match: { status_card: req.query.status_card } });

        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Branchs',
                    localField: 'sale_location.branch_id',
                    foreignField: 'branch_id',
                    as: 'sale_location',
                },
            },
            { $unwind: { path: '$sale_location', preserveNullAndEmptyArrays: true } }
        );

        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Customers',
                    localField: 'customer_id',
                    foreignField: 'customer_id',
                    as: 'customer',
                },
            },
            { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } }
        );

        aggregateQuery.push(
            {
                $lookup: {
                    from: 'ShippingCompanies',
                    localField: 'shipping_company_id',
                    foreignField: 'shipping_company_id',
                    as: 'shipping_company',
                },
            },
            {
                $unwind: {
                    path: '$shipping_company',
                    preserveNullAndEmptyArrays: true,
                },
            }
        );

        aggregateQuery.push(
            {
                $lookup: {
                    from: 'Users',
                    localField: 'employee_id',
                    foreignField: 'user_id',
                    as: 'employee',
                },
            },
            { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }
        );

        aggregateQuery.push({
            $project: {
                '_business.password': 0,
                '_business.slug_name': 0,
                '_business.slug_address': 0,
                '_business.slug_district': 0,
                '_business.slug_province': 0,
                '_creator.password': 0,
                '_creator.slug_name': 0,
                '_creator.slug_address': 0,
                '_creator.slug_district': 0,
                '_creator.slug_province': 0,
            },
        });

        let countQuery = [...aggregateQuery, { $count: 'counts' }];

        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });

        var cards = await client.db(req.user.database).collection('CardCompare').aggregate(aggregateQuery).toArray();

        var count = await client.db(req.user.database).collection('CardCompare').aggregate(countQuery).toArray();

        return res.send({
            success: true,
            count: count.length > 0 ? count[0].counts : 0,
            data: cards,
        });
    } catch (err) {
        next(err);
    }
};
