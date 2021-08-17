const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getWarrantyS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.warranty_id)
            mongoQuery = { ...mongoQuery, warranty_id: req.query.warranty_id };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.time)
            mongoQuery = { ...mongoQuery, time: parseInt(req.query.time) };
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
        let _warranties = await client
            .db(DB)
            .collection(`Warranties`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _warranties.reverse();
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
        _warranties.map((item) => {
            let _warranty = item;
            _warranty.bussiness = { ..._bussiness[_warranty.bussiness] };
            _warranty.creator = { ..._creator[_warranty.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _warranty[
                `_bussiness`
            ] = `${_warranty.bussiness?.first_name} ${_warranty.bussiness?.last_name}`;
            _warranty[
                `_creator`
            ] = `${_warranty.creator?.first_name} ${_warranty.creator?.last_name}`;
            return _warranty;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _warranties = _warranties.filter((_warranty) => {
                let check = false;
                [`code`, `name`].map((key) => {
                    {
                        let value = new String(_warranty[key])
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
                _warranties = _warranties.filter((_warranty) => {
                    let value = new String(_warranty[filterKey])
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
        let _counts = _warranties.length;
        // phân trang
        if (page && page_size)
            _warranties = _warranties.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
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
        let token = req.tokenData?.data;
        let _warranty = await client
            .db(DB)
            .collection(`Warranties`)
            .insertOne(req._warranty);
        if (!_warranty.ops) throw new Error(`500 ~ Create warranty fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Warranty`,
                name: `Thêm chế độ bảo hành mới`,
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
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Warrantys`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Warranty`,
                name: `Cập nhật thông tin bảo hành`,
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
    getWarrantyS,
    addWarrantyS,
    updateWarrantyS,
};
