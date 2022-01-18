const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const customerService = require(`../services/customer`);

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
    return text;
};

module.exports._get = async (req, res, next) => {
    try {
        await customerService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        let customer = await client.db(req.user.database).collection(`Customers`).findOne({
            phone: req.body.phone,
        });
        if (customer) {
            throw new Error(`400: Số điện thoại đã tồn tại!`);
        }
        let customer_id = await client
            .db(req.user.database)
            .collection('AppSetting')
            .findOne({ name: 'Customers' })
            .then((doc) => {
                if (doc && doc.value) {
                    return Number(doc.value);
                }

                return 0;
            });
        customer_id++;
        let _customer = {
            customer_id: customer_id,
            code: String(customer_id).padStart(6, '0'),
            phone: String(req.body.phone),
            type: req.body.type || 'Tiềm năng',
            first_name: (req.body.first_name || '').trim(),
            last_name: (req.body.last_name || '').trim(),
            gender: req.body.gender || '',
            birthday: req.body.birthday || '',
            address: req.body.address || '',
            district: req.body.district || '',
            province: req.body.province || '',
            balance: req.body.balance || {
                available: 0,
                debt: 0,
                freezing: 0,
            },
            point: req.body.point,
            used_point: req.body.used_point,
            order_quantity: req.body.order_quantity,
            order_total_cost: req.body.order_total_cost,
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: true,
            slug_name: removeUnicode(String(req.body.first_name || '' + req.body.last_name || ''), true).toLowerCase(),
            slug_type: removeUnicode(String(req.body.type || ''), true).toLowerCase(),
            slug_gender: removeUnicode(String(req.body.gender || ''), true).toLowerCase(),
            slug_address: removeUnicode(String(req.body.address || ''), true).toLowerCase(),
            slug_district: removeUnicode(String(req.body.district || ''), true).toLowerCase(),
            slug_province: removeUnicode(String(req.body.province || ''), true).toLowerCase(),
        };
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne({ name: 'Customers' }, { $set: { name: 'Customers', value: customer_id } }, { upsert: true });
        req[`body`] = _customer;
        await customerService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._importFile = async (req, res, next) => {
    try {
        if (req.file == undefined) {
            throw new Error('400: Vui lòng truyền file!');
        }
        let excelData = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: true,
        });
        let rows = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);
        let typeSlugs = [];
        rows = rows.map((eRow) => {
            let _row = {};
            for (let i in eRow) {
                let field = String(removeUnicode(i, true))
                    .replace(/\(\*\)/g, '')
                    .toLowerCase();
                _row[field] = eRow[i];
            }
            if (_row['nhomkhachhang']) {
                _row['_nhomkhachhang'] = removeUnicode(String(_row['nhomkhachhang']), true).toLowerCase();
                typeSlugs.push(_row['_nhomkhachhang']);
            }
            return _row;
        });
        typeSlugs = [...new Set(typeSlugs)];
        let [customerMaxId, typeMaxId] = await Promise.all([
            client.db(req.user.database).collection('AppSetting').findOne({ name: 'Customers' }),
            client.db(req.user.database).collection('AppSetting').findOne({ name: 'CustomerTypes' }),
        ]);
        let customer_id = (() => {
            if (customerMaxId && customerMaxId.value) {
                return customerMaxId.value;
            }
            return 0;
        })();
        let type_id = (() => {
            if (typeMaxId && typeMaxId.value) {
                return typeMaxId.value;
            }
            return 0;
        })();
        let types = await client
            .db(req.user.database)
            .collection('CustomerTypes')
            .find({ slug_name: { $in: typeSlugs } })
            .toArray();
        let _types = {};
        types.map((eType) => {
            _types[`${eType.slug_name}`] = eType;
        });
        insertCustomers = [];
        insertTypes = [];
        rows.map((eRow) => {
            if (eRow['stt']) {
                if (!_types[eRow['_nhomkhachhang']]) {
                    type_id++;
                    let _type = {
                        type_id: type_id,
                        code: String(type_id).padStart(6, '0'),
                        name: eRow['nhomkhachhang'],
                        priority: 100,
                        description: '',
                        create_date: moment().tz(TIMEZONE).format(),
                        creator_id: req.user.user_id,
                        last_update: moment().tz(TIMEZONE).format(),
                        updater_id: req.user.user_id,
                        active: true,
                        slug_name: removeUnicode(String(eRow['nhomkhachhang']), true).toLowerCase(),
                    };
                    insertTypes.push(_type);
                    _types[_type.slug_name] = _type;
                }
                customer_id++;
                let _customer = {
                    customer_id: customer_id,
                    code: String(customer_id).padStart(6, '0'),
                    phone: eRow['sodienthoai'],
                    type_id: (() => {
                        if (_types[eRow['_nhomkhachhang']]) {
                            return _types[eRow['_nhomkhachhang']].type_id;
                        }
                        throw new Error(`400: Nhóm khách hàng ${eRow['nhomkhachhang']} không tồn tại!`);
                    })(),
                    first_name: eRow['hokhachhang'],
                    last_name: eRow['tenkhachhang'],
                    gender: eRow['gioitinh'],
                    birthday: eRow['ngaysinh'],
                    address: eRow['diachi'],
                    district: eRow['quan/huyen'],
                    province: eRow['tinh/thanhpho'],
                    balance: {
                        available: 0,
                        debt: 0,
                        freezing: 0,
                    },
                    point: eRow['diemtichluy'],
                    used_point: eRow['diemdasudung'],
                    order_quantity: eRow['donhangdamua'],
                    order_total_cost: eRow['tongtieuphi'],
                    create_date: moment().tz(TIMEZONE).format(),
                    creator_id: req.user.user_id,
                    last_update: moment().tz(TIMEZONE).format(),
                    updater_id: req.user.user_id,
                    active: true,
                    slug_name: removeUnicode(
                        String(eRow['hokhachhang'] || '' + eRow['tenkhachhang'] || ''),
                        true
                    ).toLowerCase(),
                    slug_type: removeUnicode(String(eRow['_nhomkhachhang'] || ''), true).toLowerCase(),
                    slug_gender: removeUnicode(String(eRow['gioitinh'] || ''), true).toLowerCase(),
                    slug_address: removeUnicode(String(eRow['diachi'] || ''), true).toLowerCase(),
                    slug_district: removeUnicode(String(eRow['quan/huyen'] || ''), true).toLowerCase(),
                    slug_province: removeUnicode(String(eRow['tinh/thanhpho'] || ''), true).toLowerCase(),
                };
                insertCustomers.push(_customer);
            }
        });
        await Promise.all([
            client
                .db(req.user.database)
                .collection('AppSetting')
                .updateOne({ name: 'CustomerTypes' }, { $set: { name: 'CustomerTypes', value: type_id } }),
            client
                .db(req.user.database)
                .collection('AppSetting')
                .updateOne({ name: 'Customers' }, { $set: { name: 'Customers', value: customer_id } }),
        ]);
        if (Array.isArray(insertTypes) && insertTypes.length > 0) {
            await client.db(req.user.database).collection('CustomerTypes').insertMany(insertTypes);
        }
        if (Array.isArray(insertCustomers) && insertCustomers.length > 0) {
            await client.db(req.user.database).collection('Customers').insertMany(insertCustomers);
        }
        res.send({ success: true, message: 'Thêm khách hàng thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        req.params.customer_id = Number(req.params.customer_id);
        req.body.phone = String(req.body.phone).trim().toUpperCase();
        let customer = await client.db(req.user.database).collection(`Customers`).findOne(req.params);
        if (!customer) {
            throw new Error(`400: Khách hàng không tồn tại!`);
        }
        if (req.body.phone) {
            let check = await client
                .db(req.user.database)
                .collection(`Customers`)
                .findOne({
                    customer_id: { $ne: customer.customer_id },
                    phone: req.body.phone,
                });
            if (check) {
                throw new Error(`400: Số điện thoại đã tồn tại!`);
            }
        }
        delete req.body._id;
        delete req.body.customer_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _customer = { ...customer, ...req.body };
        _customer = {
            customer_id: _customer.customer_id,
            code: _customer.code,
            phone: String(_customer.phone),
            type: _customer.type || 'Tiềm năng',
            first_name: (_customer.first_name || '').trim(),
            last_name: (_customer.last_name || '').trim(),
            gender: _customer.gender || '',
            birthday: _customer.birthday || '',
            address: _customer.address || '',
            district: _customer.district || '',
            province: _customer.province || '',
            balance: _customer.balance || {
                available: 0,
                debt: 0,
                freezing: 0,
                total: 0,
            },
            point: _customer.point,
            used_point: _customer.used_point,
            order_quantity: _customer.order_quantity,
            order_total_cost: _customer.order_total_cost,
            create_date: _customer.create_date,
            creator_id: _customer.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: _customer.active,
            slug_name: removeUnicode(_customer.first_name + _customer.last_name, true).toLowerCase(),
            slug_type: removeUnicode(_customer.type, true).toLowerCase(),
            slug_gender: removeUnicode(_customer.gender, true).toLowerCase(),
            slug_address: removeUnicode(_customer.address, true).toLowerCase(),
            slug_district: removeUnicode(_customer.district, true).toLowerCase(),
            slug_province: removeUnicode(_customer.province, true).toLowerCase(),
        };
        req['body'] = _customer;
        await customerService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(req.user.database)
            .collection(`Customers`)
            .deleteMany({ customer_id: { $in: req.body.customer_id } });
        res.send({
            success: true,
            message: 'Xóa khách hàng thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports._getType = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.category_id) {
            aggregateQuery.push({ $match: { category_id: Number(req.query.category_id) } });
        }
        aggregateQuery.push({ $sort: { priority: 1 } });
        let [types, counts] = await Promise.all([
            client.db(req.user.database).collection('CustomerTypes').aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection('CustomerTypes')
                .aggregate([...aggregateQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: types,
        });
    } catch (err) {
        next(err);
    }
};

module.exports._createType = async (req, res, next) => {
    try {
        ['name'].map((e) => {
            if (req.body[e] == undefined) {
                throw new Error(`400: Thiếu thuộc tính ${e}!`);
            }
        });
        let typeCustomer = await client
            .db(req.user.database)
            .collection('CustomerTypes')
            .findOne({ name: req.body.name });
        if (typeCustomer) {
            throw new Error(`400: Nhóm khách hàng đã tồn tại!`);
        }
        let typeMaxId = await client.db(req.user.database).collection('AppSetting').findOne({ name: 'CustomerTypes' });
        let type_id = (() => {
            if (typeMaxId && typeMaxId.value) {
                return typeMaxId.value;
            }
            return 0;
        })();
        type_id++;
        req['body'] = {
            type_id: type_id,
            code: String(type_id).padStart(6, '0'),
            name: req.body.name,
            priority: req.body.priority || 100,
            description: req.body.description || '',
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: true,
            slug_name: removeUnicode(String(req.body.name), true).toLowerCase(),
        };
        await client
            .db(req.user.database)
            .collection('AppSetting')
            .updateOne(
                { name: 'CustomerTypes' },
                { $set: { name: 'CustomerTypes', value: type_id } },
                { upsert: true }
            );
        let insert = await client.db(req.user.database).collection('CustomerTypes').insertOne(req.body);
        if (!insert.insertedId) {
            throw new Error(`Thêm nhóm khách hàng thất bại!`);
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports._updateType = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};

module.exports._deleteType = async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
};

module.exports._getPointHistory = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.customer_id) {
            aggregateQuery.push({ $match: { customer_id: Number(req.query.customer_id) } });
        }
        if (req.query.branch_id) {
            aggregateQuery.push({ $match: { branch_id: Number(req.query.branch_id) } });
        }
        if (req.query.type) {
            aggregateQuery.push({ $match: { type: String(req.query.type).toUpperCase() } });
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
        let countQuery = [...aggregateQuery];
        aggregateQuery.push({ $sort: { create_date: -1 } });
        if (req.query.page && req.query.page_size) {
            let page = Number(req.query.page) || 1;
            let page_size = Number(req.query.page_size) || 50;
            aggregateQuery.push({ $skip: (page - 1) * page_size }, { $limit: page_size });
        }
        let [histories, counts] = await Promise.all([
            client.db(req.user.database).collection(`PointUseHistories`).aggregate(aggregateQuery).toArray(),
            client
                .db(req.user.database)
                .collection(`PointUseHistories`)
                .aggregate([...countQuery, { $count: 'counts' }])
                .toArray(),
        ]);
        res.send({
            success: true,
            count: counts[0] ? counts[0].counts : 0,
            data: histories,
        });
    } catch (err) {
        next(err);
    }
};
