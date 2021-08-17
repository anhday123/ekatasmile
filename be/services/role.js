const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.role_id)
            mongoQuery = { ...mongoQuery, role_id: req.query.role_id };
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
        let _roles = await client
            .db(DB)
            .collection(`Roles`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _roles.reverse();
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
        _roles.map((item) => {
            let _role = item;
            _role.bussiness = { ..._bussiness[_role.bussiness] };
            _role.creator = { ..._creator[_role.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _role[
                `_bussiness`
            ] = `${_role.bussiness?.first_name} ${_role.bussiness?.last_name}`;
            _role[
                `_creator`
            ] = `${_role.creator?.first_name} ${_role.creator?.last_name}`;
            return _role;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _roles = _roles.filter((_role) => {
                let check = false;
                [`code`, `name`].map((key) => {
                    {
                        let value = new String(_role[key])
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
                _roles = _roles.filter((_role) => {
                    let value = new String(_role[filterKey])
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
        let _counts = _roles.length;
        // phân trang
        if (page && page_size)
            _roles = _roles.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _roles,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _role = await client
            .db(DB)
            .collection(`Roles`)
            .insertOne(req._role);
        if (!_role.insertedId) throw new Error(`500 ~ Create role fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Role`,
                name: `Thêm vai trò mới`,
                data: _role.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _role.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateRoleS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Roles`)
            .updateMany(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness_id: token.bussiness.user_id,
                type: `Update`,
                properties: `Role`,
                name: `Cập nhật thông tin vai trò`,
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
    getRoleS,
    addRoleS,
    updateRoleS,
};
