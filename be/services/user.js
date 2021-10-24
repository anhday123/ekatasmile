const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const client = require(`../config/mongo/mongodb`);
const { createToken } = require('../libs/jwt');
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getUserS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        mongoQuery['delete'] = false;
        if (req.query.user_id) {
            mongoQuery['user_id'] = ObjectId(req.query.user_id);
        }
        if (token) {
            mongoQuery['business_id'] = ObjectId(token.business_id);
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = ObjectId(req.query.business_id);
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = ObjectId(req.query.creator_id);
        }
        if (req.query.branch_id) {
            mongoQuery['branch_id'] = ObjectId(req.query.branch_id);
        }
        if (req.query.store_id) {
            mongoQuery['store_id'] = ObjectId(req.query.store_id);
        }
        if (req.query.role_id) {
            mongoQuery['role_id'] = ObjectId(req.query.role_id);
            if (req.query.role_id == `6166a2d4dddaf490b0c4a68d`) {
                delete mongoQuery['business_id'];
            }
        }
        req.query = createTimeline(req.query);
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: req.query.to_date,
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.name) {
            mongoQuery['sub_name'] = createRegExpQuery(req.query.name);
        }
        if (req.query.address) {
            mongoQuery['sub_address'] = createRegExpQuery(req.query.address);
        }
        if (req.query.district) {
            mongoQuery['sub_district'] = createRegExpQuery(req.query.district);
        }
        if (req.query.province) {
            mongoQuery['sub_province'] = createRegExpQuery(req.query.province);
        }
        if (req.query.search) {
            if (req.query.role_id != '6166a2d4dddaf490b0c4a68d') {
                mongoQuery['$or'] = [
                    { user_id: createRegExpQuery(req.query.search) },
                    { username: createRegExpQuery(req.query.search) },
                    { sub_name: createRegExpQuery(req.query.search) },
                ];
            } else {
                mongoQuery['$or'] = [
                    { user_id: createRegExpQuery(req.query.search) },
                    { username: createRegExpQuery(req.query.search) },
                    { phone: createRegExpQuery(req.query.search) },
                ];
            }
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
            client.db(DB).collection(`Users`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Roles`).find().toArray(),
            client.db(DB).collection(`Branchs`).find({ business_id: mongoQuery.business_id }).toArray(),
            client.db(DB).collection(`Stores`).find({ business_id: mongoQuery.business_id }).toArray(),
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
        let user = await client.db(DB).collection(`Users`).insertOne(req._insert);
        if (!user.insertedId) {
            throw new Error(`500: Tạo user thất bại!`);
        }
        delete user.ops[0].password;
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Add`,
                sub_type: `add`,
                properties: `User`,
                sub_properties: `user`,
                name: `Thêm tài khoản mới`,
                sub_name: `themtaikhoanmoi`,
                data: user.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: user.ops[0] });
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
                            {
                                $set: {
                                    company_name: req._update.company_name,
                                    sub_company_name: req._update.sub_company_name,
                                },
                            }
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
