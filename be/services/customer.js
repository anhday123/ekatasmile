const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.customer_id)
            mongoQuery = { ...mongoQuery, customer_id: req.query.customer_id };
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
        if (req.query.phone)
            filterQuery = { ...filterQuery, phone: req.query.phone };
        if (req.query.type)
            filterQuery = { ...filterQuery, type: req.query.type };
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
        let _customers = await client
            .db(DB)
            .collection(`Customers`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _customers.reverse();
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
        _customers.map((item) => {
            let _customer = item;
            _customer.bussiness = { ..._bussiness[_customer.bussiness] };
            _customer.creator = { ..._creator[_customer.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _customer[
                `full_name`
            ] = `${_customer?.first_name} ${_customer?.last_name}`;
            _customer[
                `_bussiness`
            ] = `${_customer.bussiness?.first_name} ${_customer.bussiness?.last_name}`;
            _customer[
                `_creator`
            ] = `${_customer.creator?.first_name} ${_customer.creator?.last_name}`;
            return _customer;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _customers = _customers.filter((_customer) => {
                let check = false;
                [`code`, `phone`, `full_name`].map((key) => {
                    {
                        let value = new String(_customer[key])
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
            if (filterQuery) {
                filterQuery = Object.entries(filterQuery);
                filterQuery.forEach(([filterKey, filterValue]) => {
                    _customers = _customers.filter((_customer) => {
                        let value = new String(_customer[filterKey])
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
        }
        // đếm số phần tử
        let _counts = _customers.length;
        // phân trang
        if (page && page_size)
            _customers = _customers.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _customers,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _customer = await client
            .db(DB)
            .collection(`Customers`)
            .insertOne(req._customer);
        if (!_customer.insertedId)
            throw new Error(`500 ~ Failed create customer!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Customer`,
                name: `Thêm khách hàng mới`,
                data: _customer.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _customer.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateCustomerS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Customers`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Customer`,
                name: `Cập nhật thông tin khách hàng`,
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
    getCustomerS,
    addCustomerS,
    updateCustomerS,
};
