const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const { createToken } = require('../libs/jwt');
const DB = process.env.DATABASE;

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['username'] = { $ne: `viesoftware` };
        if (req.query.user_id) {
            mongoQuery['user_id'] = req.query.user_id;
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
        if (req.query.branch_id) {
            mongoQuery['branch_id'] = req.query.branch_id;
        }
        if (req.query.store_id) {
            mongoQuery['store_id'] = req.query.store_id;
        }
        if (req.query.role_id) {
            mongoQuery['role_id'] = req.query.role_id;
            if (role_id == `2`) {
                delete mongoQuery.business_id;
            }
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
        if (req.query.user_id) {
            mongoQuery['user_id'] = new RegExp(removeUnicode(req.query.user_id).toUpperCase());
        }
        if (req.query.name) {
            mongoQuery['sub_name'] = new RegExp(removeUnicode(req.query.name).toLowerCase());
        }
        if (req.query.address) {
            mongoQuery['sub_address'] = new RegExp(removeUnicode(req.query.address).toLowerCase());
        }
        if (req.query.district) {
            mongoQuery['sub_district'] = new RegExp(removeUnicode(req.query.district).toLowerCase());
        }
        if (req.query.province) {
            mongoQuery['sub_province'] = new RegExp(removeUnicode(req.query.province).toLowerCase());
        }
        if (req.query.search) {
            mongoQuery['$or'] = [
                { user_id: new RegExp(removeUnicode(req.query.search).toUpperCase()) },
                { sub_name: new RegExp(removeUnicode(req.query.search).toLowerCase()) },
            ];
        }
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _users = await client.db(DB).collection(`Users`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _users.reverse();
        // đếm số phần tử
        let _counts = _users.length;
        // phân trang
        if (page && page_size) {
            _users = _users.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        let [__users, __roles, __branchs, __stores] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Roles`).find({}).toArray(),
            client.db(DB).collection(`Branchs`).find({}).toArray(),
            client.db(DB).collection(`Stores`).find({}).toArray(),
        ]);
        let _business = {};
        let _creator = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _creator[__user.user_id] = __user;
        });
        let _roles = {};
        __roles.map((__role) => {
            _roles[__role.role_id] = __role;
        });
        let _branchs = {};
        __branchs.map((__branch) => {
            _branchs[__branch.branch_id] = __branch;
        });
        let _stores = {};
        __stores.map((__store) => {
            _stores[__store.store_id] = __store;
        });
        _users.map((_user) => {
            delete _user.password;
            _user[`_business`] = _business[_user.business_id];
            _user[`_creator`] = _creator[_user.creator_id];
            _user[`_role`] = _roles[_user.role_id];
            _user[`_branch`] = _branchs[_user.branch_id];
            _user[`_store`] = _stores[_user.store_id];
            return _user;
        });
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
        let token;
        if (req.tokenData) token = req.tokenData.data;
        let _user = await client.db(DB).collection(`Users`).insertOne(req._insert);
        if (!_user.insertedId) throw new Error(`500 ~ Failed create user!`);
        delete _user.ops[0].password;
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `User`,
                sub_properties: `user`,
                name: `Thêm tài khoản mới`,
                sub_name: `themtaikhoanmoi`,
                data: _user.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _user.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Users`).findOneAndUpdate(req.params, { $set: req._update });
        if (req._update.password) req._update.password = `Successful change password!`;
        if (token) {
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                sub_type: `update`,
                properties: `User`,
                sub_properties: `user`,
                name: `Cập nhật thông tin tài khoản`,
                sub_name: `capnhatthongtintaikhoan`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
            if (req._updateBussiness) {
                if (req._update.company_name)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { business_id: token.business_id },
                            { $set: { company_name: req._update.company_name } }
                        );
                if (req._update.company_website)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { business_id: token.business_id },
                            {
                                $set: {
                                    company_website: req._update.company_website,
                                },
                            }
                        );
                if (req._update.tax_code)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { business_id: token.business_id },
                            { $set: { tax_code: req._update.tax_code } }
                        );
                if (req._update.business_areas)
                    await client
                        .db(DB)
                        .collection(`Users`)
                        .updateMany(
                            { business_id: token.business_id },
                            { $set: { business_areas: req._update.business_areas } }
                        );
            }
        }
        let _user = await client.db(DB).collection(`Users`).findOne(req.params);
        [_user[`_business`], _user[`_creator`], _user[`_role`], _user[`_branch`], _user[`_store`]] =
            await Promise.all([
                client.db(DB).collection(`Users`).findOne({ user_id: _user.business_id }),
                client.db(DB).collection(`Users`).findOne({ user_id: _user.creator_id }),
                client.db(DB).collection(`Roles`).findOne({ role_id: _user.role_id }),
                client.db(DB).collection(`Branchs`).findOne({ branch_id: _user.branch_id }),
                client.db(DB).collection(`Stores`).findOne({ store_id: _user.store_id }),
            ]);
        if (_user._business) {
            delete _user._business.password;
        }
        if (_user._creator) {
            delete _user._creator.password;
        }
        delete _user.password;
        console.log(_user);
        let [accessToken, refreshToken, _update] = await Promise.all([
            createToken(_user, process.env.ACCESS_TOKEN_LIFE),
            createToken(_user, process.env.REFRESH_TOKEN_LIFE),
        ]);
        res.send({ success: true, data: req._update, accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserS,
    addUserS,
    updateUserS,
};
