const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const filter = require(`../utils/filter`);

let getUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery = { ...mongoQuery, ...{ username: { $ne: `viesoftware` } } };
        if (req.query.user_id)
            mongoQuery = { ...mongoQuery, user_id: req.query.user_id };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.store)
            mongoQuery = { ...mongoQuery, store: req.query.store };
        if (req.query.branch)
            mongoQuery = { ...mongoQuery, branch: req.query.branch };
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
        if (req.query._store)
            filterQuery = { ...filterQuery, _store: req.query._store };
        if (req.query._branch)
            filterQuery = { ...filterQuery, _branch: req.query._branch };
        if (req.query._role)
            filterQuery = { ...filterQuery, _role: req.query._role };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _users = await client
            .db(DB)
            .collection(`Users`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _users.reverse();
        let [__users, __roles, __stores, __branchs] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Roles`).find({}).toArray(),
            client.db(DB).collection(`Stores`).find({}).toArray(),
            client.db(DB).collection(`Branchs`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        let _roles = {};
        __roles.map((item) => {
            _roles[item.role_id] = item;
        });
        let _stores = {};
        __stores.map((item) => {
            _stores[item.store_id] = item;
        });
        let _branchs = {};
        __branchs.map((item) => {
            _branchs[item.branch_id] = item;
        });
        _users.map((item) => {
            let _user = item;
            _user.bussiness = { ..._bussiness[_user.bussiness] };
            _user.creator = { ..._creator[_user.creator] };
            _user.role = { ..._roles[_user.role] };
            _user.store = { ..._stores[_user.store] };
            _user.branch = { ..._branchs[_user.branch] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _user[`_full_name`] = `${_user.first_name} ${_user.last_name}`;
            _user[
                `_bussiness`
            ] = `${_user.bussiness?.first_name} ${_user.bussiness?.last_name}`;
            _user[
                `_creator`
            ] = `${_user.creator?.first_name} ${_user.creator?.last_name}`;
            _user[`_role`] = _user.role?.name;
            _user[`_branch`] = _user.branch?.name;
            _user[`_store`] = _user.store?.name;
            delete _user.password;
            return _user;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _users = _users.filter((_user) => {
                let check = false;
                [`user_id`, `username`, `phone`, `_full_name`].map((key) => {
                    {
                        let value = new String(_user[key])
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
                _users = _users.filter((_user) => {
                    let value = new String(_user[filterKey])
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
        let _counts = _users.length;
        // phân trang
        if (page && page_size)
            _users = _users.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _users,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addUserS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _user = await client
            .db(DB)
            .collection(`Users`)
            .insertOne(req._user);
        if (!_user.insertedId) throw new Error(`500 ~ Failed create user!`);
        delete _user.ops[0].password;
        if (!token) {
            let [_counts, _roleDefault] = await Promise.all([
                client.db(DB).collection(`Roles`).countDocuments(),
                client
                    .db(DB)
                    .collection(`Roles`)
                    .find({
                        $and: [
                            { name: { $ne: `ADMIN` } },
                            { name: { $ne: `BUSSINESS` } },
                        ],
                        bussiness: null,
                    })
                    .toArray(),
            ]);
            for (let i in _roleDefault) {
                delete _roleDefault[i]._id;
                _roleDefault[i].role_id = String(_counts + 1 + Number(i));
                _roleDefault[i].bussiness = _user.ops[0].user_id;
                _roleDefault[i].creator = _user.ops[0].user_id;
                _roleDefault[i].create_date = moment().format();
            }
            let _role = await client
                .db(DB)
                .collection(`Roles`)
                .insertMany(_roleDefault);
            if (!_role.insertedIds)
                throw new Error(`500 ~ Failed create role for user!`);
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `User`,
                name: `Thêm tài khoản mới`,
                data: _user.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _user.ops[0] });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let updateUserS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Users`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (req.body.password)
            req.body.password = `Successful change password!`;
        if (token) {
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `User`,
                name: `Cập nhật thông tin tài khoản`,
                data: req.body,
                performer: token.user_id,
                date: moment().format(),
            });
            if (req._updateBussiness) {
                if (req.body.company_name)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { bussiness: token.bussiness.user_id },
                            { $set: { company_name: req.body.company_name } }
                        );
                if (req.body.company_website)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { bussiness: token.bussiness.user_id },
                            {
                                $set: {
                                    company_website: req.body.company_website,
                                },
                            }
                        );
                if (req.body.tax_code)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { bussiness: token.bussiness.user_id },
                            { $set: { tax_code: req.body.tax_code } }
                        );
            }
        }
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserS,
    addUserS,
    updateUserS,
};
