const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.branch_id)
            mongoQuery = { ...mongoQuery, branch_id: req.query.branch_id };
        if (req.query.bussiness)
            mongoQuery = { ...mongoQuery, bussiness: req.query.bussiness };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.store)
            mongoQuery = { ...mongoQuery, store: req.query.store };
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
        if (req.query.ward)
            filterQuery = { ...filterQuery, ward: req.query.ward };
        if (req.query.district)
            filterQuery = { ...filterQuery, district: req.query.district };
        if (req.query.province)
            filterQuery = { ...filterQuery, province: req.query.province };
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._store)
            filterQuery = { ...filterQuery, _store: req.query._store };
        if (req.query._creator)
            filterQuery = { ...filterQuery, _creator: req.query._creator };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _branchs = await client
            .db(DB)
            .collection(`Branchs`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _branchs.reverse();
        let [__users, __stores] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Stores`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        let _eployees = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
            if (!_eployees[item.branch]) _eployees[item.branch] = [];
            if (_eployees[item.branch]) _eployees[item.branch].push(item);
        });
        let _store = {};
        __stores.map((item) => {
            _store[item.store_id] = item;
        });
        _branchs.map((item) => {
            let _branch = item;
            _branch.bussiness = { ..._bussiness[_branch.bussiness] };
            _branch.creator = { ..._creator[_branch.creator] };
            _branch.store = { ..._store[_branch.store] };
            _branch[`_eployees`] = _eployees[_branch.branch_id];
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _branch[
                `_bussiness`
            ] = `${_branch.bussiness?.first_name} ${_branch.bussiness?.last_name}`;
            _branch[
                `_creator`
            ] = `${_branch.creator?.first_name} ${_branch.creator?.last_name}`;
            _branch[`_store`] = _branch.store?.name;
            return _branch;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _branchs = _branchs.filter((_branch) => {
                let check = false;
                [`code`, `name`, `phone`].map((key) => {
                    {
                        let value = new String(_branch[key])
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
                _branchs = _branchs.filter((_branch) => {
                    let value = new String(_branch[filterKey])
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
        let _counts = _branchs.length;
        // phân trang
        if (page && page_size)
            _branchs = _branchs.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _branchs,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _branch = await client
            .db(DB)
            .collection(`Branchs`)
            .insertOne(req._branch);
        if (!_branch.ops) throw new Error(`500 ~ Create branch fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Branch`,
                name: `Thêm chi nhánh mới`,
                data: _branch.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _branch.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateBranchS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Branchs`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Branch`,
                name: `Cập nhật thông tin chi nhánh`,
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
    getBranchS,
    addBranchS,
    updateBranchS,
};
