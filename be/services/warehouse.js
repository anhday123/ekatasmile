const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getWarehouseS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.warehouse_id)
            mongoQuery = {
                ...mongoQuery,
                warehouse_id: req.query.warehouse_id,
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
        if (req.query.type)
            filterQuery = { ...filterQuery, type: req.query.type };
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
        let _warehouses = await client
            .db(DB)
            .collection(`Warehouses`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _warehouses.reverse();
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
        _warehouses.map((item) => {
            let _warehouse = item;
            _warehouse.bussiness = { ..._bussiness[_warehouse.bussiness] };
            _warehouse.creator = { ..._creator[_warehouse.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _warehouse[
                `_bussiness`
            ] = `${_warehouse.bussiness?.first_name} ${_warehouse.bussiness?.last_name}`;
            _warehouse[
                `_creator`
            ] = `${_warehouse.creator?.first_name} ${_warehouse.creator?.last_name}`;
            return _warehouse;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _warehouses = _warehouses.filter((_warehouse) => {
                let check = false;
                [`code`, `name`, `phone`, `type`].map((key) => {
                    {
                        let value = new String(_warehouse[key])
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
                _warehouses = _warehouses.filter((_warehouse) => {
                    let value = new String(_warehouse[filterKey])
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
        let _counts = _warehouses.length;
        // phân trang
        if (page && page_size)
            _warehouses = _warehouses.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _warehouses,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addWarehouseS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _warehouse = await client
            .db(DB)
            .collection(`Warehouses`)
            .insertOne(req._warehouse);
        if (!_warehouse.insertedId)
            throw new Error(`500 ~ Create warehouse fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Warehouse`,
                name: `Thêm kho mới`,
                data: _warehouse.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _warehouse.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateWarehouseS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Warehouses`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Warehouse`,
                name: `Cập nhật thông tin kho`,
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
    getWarehouseS,
    addWarehouseS,
    updateWarehouseS,
};
