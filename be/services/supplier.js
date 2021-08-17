const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const filter = require(`../utils/filter`);

let getSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.supplier_id)
            mongoQuery = { ...mongoQuery, supplier_id: req.query.supplier_id };
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
        var _suppliers = await client
            .db(DB)
            .collection(`Suppliers`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _suppliers.reverse();
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
        _suppliers.map((item) => {
            let _supplier = item;
            _supplier.bussiness = { ..._bussiness[_supplier.bussiness] };
            _supplier.creator = { ..._creator[_supplier.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _supplier[
                `_bussiness`
            ] = `${_supplier.bussiness?.first_name} ${_supplier.bussiness?.last_name}`;
            _supplier[
                `_creator`
            ] = `${_supplier.creator?.first_name} ${_supplier.creator?.last_name}`;
            return _supplier;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _suppliers = _suppliers.filter((_supplier) => {
                let check = false;
                [`code`, `name`, `phone`, `email`].map((key) => {
                    {
                        let value = new String(_supplier[key])
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
                _suppliers = _suppliers.filter((_supplier) => {
                    let value = new String(_supplier[filterKey])
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
        let _counts = _suppliers.length;
        // phân trang
        if (page && page_size)
            _suppliers = _suppliers.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _suppliers,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _supplier = await client
            .db(DB)
            .collection(`Suppliers`)
            .insertOne(req._supplier);
        if (!_supplier.insertedId)
            throw new Error(`500 ~ Create supplier fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Supplier`,
                name: `Thêm nhà cung cấp mới`,
                data: _supplier.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _supplier.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateSupplierS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Suppliers`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Supplier`,
                name: `Cập nhật thông tin nhà cung cấp`,
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
    addSupplierS,
    getSupplierS,
    updateSupplierS,
};
