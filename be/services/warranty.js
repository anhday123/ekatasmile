const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.warranty_id) {
            mongoQuery['warranty_id'] = req.query.warranty_id;
        }
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = req.query.creator_id;
        }
        if (req.query.time) {
            mongoQuery['time'] = Number(req.query.time);
        }
        if (req.query.today != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
        }
        if (req.query.yesterday != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
        }
        if (req.query.this_week != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).isoWeekday(1).format(`YYYY-MM-DD`);
        }
        if (req.query.last_week != undefined) {
            req.query[`from_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(1 - 7)
                .format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(7 - 7)
                .format(`YYYY-MM-DD`);
        }
        if (req.query.this_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
                `-` +
                String(`01`);
        }
        if (req.query.last_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).daysInMonth());
        }
        if (req.query.this_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
        }
        if (req.query.last_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`12`) +
                `-` +
                String(`31`);
        }
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) {
            mongoQuery['code'] = new RegExp(removeUnicode(req.query.code).toUpperCase());
        }
        if (req.query.name) {
            mongoQuery['sub_name'] = new RegExp(removeUnicode(req.query.name).toLowerCase());
        }
        if (req.query.type) {
            mongoQuery['sub_type'] = new RegExp(removeUnicode(req.query.type).toLowerCase());
        }
        if (req.query.search) {
            mongoQuery['$or'] = [
                { code: new RegExp(removeUnicode(req.query.search).toUpperCase()) },
                { sub_name: new RegExp(removeUnicode(req.query.search).toLowerCase()) },
            ];
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _warranties = await client.db(DB).collection(`Warranties`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _warranties.reverse();
        // đếm số phần tử
        let _counts = _warranties.length;
        // phân trang
        if (page && page_size) {
            _warranties = _warranties.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [__users] = await Promise.all([client.db(DB).collection(`Users`).find({}).toArray()]);
        let _business = {};
        let _creator = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _creator[__user.user_id] = __user;
        });
        _warranties.map((_warranty) => {
            _warranty[`_business`] = _business[_warranty.business_id];
            _warranty[`_creator`] = _creator[_warranty.creator_id];
            return _warranty;
        });
        res.send({
            success: true,
            data: _warranties,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _warranty = await client.db(DB).collection(`Warranties`).insertOne(req._insert);
        if (!_warranty.ops) throw new Error(`500 ~ Create warranty fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `Warranty`,
                sub_properties: `warranty`,
                name: `Thêm chế độ bảo hành mới`,
                sub_name: `themchedobaohanhmoi`,
                data: _warranty.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _warranty.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Warranties`).findOneAndUpdate(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `Warranty`,
                sub_properties: `warranty`,
                name: `Cập nhật thông tin bảo hành`,
                sub_name: `capnhatthongtinbaohanh`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
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
