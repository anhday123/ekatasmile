const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getTransportS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.transport_id)
            mongoQuery = {
                ...mongoQuery,
                transport_id: req.query.transport_id,
            };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.creator)
            mongoQuery = { ...mongoQuery, creator: req.query.creator };
        if (req.query.from_date)
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        if (req.query.to_date)
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code)
            filterQuery = { ...filterQuery, code: req.query.code };
        if (req.query.name)
            filterQuery = { ...filterQuery, name: req.query.name };
        if (req.query.phone)
            filterQuery = { ...filterQuery, phone: req.query.phone };
        if (req.query.ward)
            filterQuery = { ...filterQuery, ward: req.query.ward };
        if (req.query.district)
            filterQuery = { ...filterQuery, district: req.query.district };
        if (req.query.province)
            filterQuery = { ...filterQuery, province: req.query.province };
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._creator)
            filterQuery = { ...filterQuery, _creator: req.query._creator };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        var _transports = await client
            .db(DB)
            .collection(`Transports`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _transports.reverse();
        let [__users] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        _transports.map((item) => {
            let _transport = item;
            _transport.bussiness = { ..._bussiness[_transport.bussiness] };
            _transport.creator = { ..._creator[_transport.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _transport[
                `_bussiness`
            ] = `${_transport.bussiness?.first_name} ${_transport.bussiness?.last_name}`;
            _transport[
                `_creator`
            ] = `${_transport.creator?.first_name} ${_transport.creator?.last_name}`;
            return _transport;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _transports = _transports.filter((_transport) => {
                let check = false;
                [`code`, `name`, `phone`].map((key) => {
                    {
                        let value = new String(_transport[key])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(req.query.keyword)
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        if (value.includes(compare)) {
                            check = true;
                        }
                    }
                });
                return check;
            });
        }
        // lọc theo query
        if (filterQuery) {
            filterQuery = Object.entries(filterQuery);
            filterQuery.forEach(([filterKey, filterValue]) => {
                _transports = _transports.filter((_transport) => {
                    let value = new String(_transport[filterKey])
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``)
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')
                        .toLocaleLowerCase();
                    let compare = new String(filterValue)
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``)
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')
                        .toLocaleLowerCase();
                    return value.includes(compare);
                });
            });
        }
        // đếm số phần tử
        let _counts = _transports.length;
        // phân trang
        if (page && page_size)
            _transports = _transports.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _transports,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addTransportS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _transport = await client
            .db(DB)
            .collection(`Transports`)
            .insertOne(req._transport);
        if (!_transport.insertedId)
            throw new Error(`500 ~ Create transport fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Transports`,
                name: `Thêm đối tác vận chuyển mới`,
                data: _transport.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _transport.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateTransportS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Transports`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Transport`,
                name: `Cập nhật thông tin đối tác vận chuyển`,
                data: req.body,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addTransportS,
    getTransportS,
    updateTransportS,
};
