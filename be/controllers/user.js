const moment = require(`moment-timezone`);
const TIMEZONE = process.env.TIMEZONE;
const client = require(`../config/mongodb`);
const SDB = process.env.DATABASE;

const userService = require(`../services/user`);

const crypto = require(`crypto`);
const bcrypt = require(`../libs/bcrypt`);
const mail = require(`../libs/nodemailer`);
const { verifyMail } = require('../templates/verifyMail');

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        return '';
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

module.exports._get = async (req, res, next) => {
    try {
        await userService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._register = async (req, res, next) => {
    try {
        req.body.username = String(req.body.username).trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        req.body.email = String(req.body.email).trim().toLowerCase();
        let business = await client.db(SDB).collection('Business').findOne({ prefix: req.body.prefix });
        let user = await client
            .db(SDB)
            .collection('Users')
            .findOne({ username: req.body.username, email: req.body.email });
        if (business) {
            throw new Error(`400: Tên doanh nghiệp đã được đăng ký!`);
        }
        if (user) {
            throw new Error(`400: Tài khoản đã được đăng ký!`);
        }
        const DB = `${req.body.username}Database`;
        let [business_id, system_user_id] = await Promise.all([
            client
                .db(SDB)
                .collection('AppSetting')
                .findOne({ name: 'Business' })
                .then((doc) => {
                    if (doc) {
                        if (doc.value) {
                            return Number(doc.value);
                        }
                    }
                    return 0;
                }),
            client
                .db(SDB)
                .collection('AppSetting')
                .findOne({ name: 'Users' })
                .then((doc) => {
                    if (doc) {
                        if (doc.value) {
                            return Number(doc.value);
                        }
                    }
                    return 0;
                }),
        ]).catch((err) => {
            throw new Error('Kiểm tra thông tin doanh nghiệp không thành công!');
        });
        let otpCode = String(Math.random()).substr(2, 6);
        let verifyId = crypto.randomBytes(10).toString(`hex`);
        let verifyLink = `https://quantribanhang.viesoftware.vn/vertifyaccount?uid=${verifyId}`;
        let link = await client
            .db(DB)
            .collection('VertifyLinks')
            .insertOne({
                username: req.body.username,
                UID: String(verifyId),
                verify_link: verifyLink,
                verify_timelife: moment().tz(TIMEZONE).add(5, `minutes`).format(),
            });
        if (!link.insertedId) {
            throw new Error('Tạo tài khoản thất bại!');
        }
        await mail.sendMail(req.body.email, `Yêu cầu xác thực`, verifyMail(otpCode, verifyLink));
        let user_id = 0;
        let role_id = 0;
        let branch_id = 0;
        let store_id = 0;
        business_id++;
        system_user_id++;
        user_id++;
        role_id++;
        branch_id++;
        store_id++;
        let _business = {
            business_id: business_id,
            prefix: req.body.prefix,
            database_name: `${req.body.username}Database`,
            company_name: req.body.company_name || '',
            company_email: req.body.company_email || '',
            company_phone: req.body.company_phone || '',
            company_website: req.body.company_website || '',
            company_address: req.body.company_address || '',
            company_district: req.body.company_district || '',
            company_province: req.body.company_province || '',
            tax_code: req.body.tax_code || '',
            career_id: req.body.career_id,
            price_recipe: req.body.price_recipe || 'FIFO',
            last_login: moment().tz(TIMEZONE).format(),
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: user_id,
            active: true,
        };
        let _branch = {
            branch_id: branch_id,
            code: String(branch_id).padStart(6, '0'),
            name: 'Chi nhánh mặc định',
            logo: '',
            phone: '',
            email: '',
            fax: '',
            website: '',
            latitude: '',
            longitude: '',
            warehouse_type: 'Sở hữu',
            address: '',
            ward: '',
            district: '',
            province: '',
            accumulate_point: false,
            use_point: false,
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: user_id,
            active: true,
            slug_name: 'chinhanhmacdinh',
            slug_warehouse_type: 'sohuu',
            slug_address: '',
            slug_ward: '',
            slug_district: '',
            slug_province: '',
        };
        let _store = {
            store_id: store_id,
            code: String(store_id).padStart(6, '0'),
            name: 'Cửa hàng mặc định',
            branch_id: branch_id,
            label_id: '',
            logo: '',
            phone: '',
            latitude: '',
            longitude: '',
            address: '',
            ward: '',
            district: '',
            province: '',
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: user_id,
            active: true,
            slug_name: 'cuahangmacdinh',
            slug_address: '',
            slug_ward: '',
            slug_district: '',
            slug_province: '',
        };
        let _role = {
            role_id: role_id,
            code: String(role_id).padStart(6, '0'),
            name: 'ADMIN',
            permission_list: [],
            menu_list: [],
            default: true,
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: 0,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: 0,
            active: true,
            slug_name: 'admin',
        };
        let _user = {
            user_id: user_id,
            system_user_id: system_user_id,
            code: String(user_id).padStart(6, '0'),
            business_id: business_id,
            username: req.body.username,
            password: req.body.password,
            system_role_id: 2,
            role_id: role_id,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birth_day: req.body.birth_day,
            address: req.body.address,
            district: req.body.district,
            province: req.body.province,
            branch_id: branch_id,
            store_id: store_id,
            last_login: moment().tz(TIMEZONE).format(),
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: user_id,
            active: false,
            slug_name: removeUnicode(`${req.body.first_name}${req.body.last_name}`, true).toLowerCase(),
            slug_address: removeUnicode(`${req.body.address}`, true).toLowerCase(),
            slug_district: removeUnicode(`${req.body.district}`, true).toLowerCase(),
            slug_province: removeUnicode(`${req.body.province}`, true).toLowerCase(),
        };
        await Promise.all([
            client.db(SDB).collection('Business').insertOne(_business),
            client.db(SDB).collection('Users').insertOne(_user),
            client.db(DB).collection('Users').insertOne(_user),
            client.db(DB).collection('Roles').insertOne(_role),
            client.db(DB).collection('Branchs').insertOne(_branch),
            client.db(DB).collection('Stores').insertOne(_store),
        ]).catch((err) => {
            throw new Error('Tạo tài khoản không thành công!');
        });
        await Promise.all([
            client
                .db(SDB)
                .collection('AppSetting')
                .updateOne({ name: 'Business' }, { $set: { name: 'Business', value: business_id } }, { upsert: true }),
            client
                .db(SDB)
                .collection('AppSetting')
                .updateOne({ name: 'Users' }, { $set: { name: 'Users', value: system_user_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Users' }, { $set: { name: 'Users', value: user_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Roles' }, { $set: { name: 'Roles', value: role_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Branchs' }, { $set: { name: 'Branchs', value: branch_id } }, { upsert: true }),
            client
                .db(DB)
                .collection('AppSetting')
                .updateOne({ name: 'Stores' }, { $set: { name: 'Stores', value: store_id } }, { upsert: true }),
        ]);
        res.send({ success: true, data: _user });
    } catch (err) {
        next(err);
    }
};

module.exports._create = async (req, res, next) => {
    try {
        req.body.username = String(req.body.username).trim().toLowerCase();
        req.body.password = bcrypt.hash(req.body.password);
        let user = await client
            .db(DB)
            .collection('Users')
            .findOne({
                $or: [{ username: req.body.username }],
            });
        if (user) {
            throw new Error('400: Username hoặc Email đã được sử dụng!');
        }
        let user_id = await client
            .db(DB)
            .collection('AppSetting')
            .findOne({ name: 'Users' })
            .then((doc) => {
                if (doc) {
                    if (doc.value) {
                        return Number(doc.value);
                    }
                }
                return 0;
            });
        user_id++;
        let _user = {
            user_id: user_id,
            code: String(user_id).padStart(6, '0'),
            business_id: req.user.business_id,
            username: req.body.username,
            password: req.body.password,
            role_id: req.body.role_id,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birth_day: req.body.birth_day,
            address: req.body.address,
            district: req.body.district,
            province: req.body.province,
            branch_id: branch_id,
            store_id: store_id,
            last_login: moment().tz(TIMEZONE).format(),
            create_date: moment().tz(TIMEZONE).format(),
            creator_id: req.user.user_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: false,
            slug_name: removeUnicode(`${req.body.first_name}${req.body.last_name}`, true).toLowerCase(),
            slug_address: removeUnicode(`${req.body.address}`, true).toLowerCase(),
            slug_district: removeUnicode(`${req.body.district}`, true).toLowerCase(),
            slug_province: removeUnicode(`${req.body.province}`, true).toLowerCase(),
        };
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Users' }, { $set: { name: 'Users', value: user_id } }, { upsert: true });
        req[`body`] = _user;
        await userService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._update = async (req, res, next) => {
    try {
        let user = await client.db(DB).collection('Users').findOne(req.params);
        if (!user) {
            throw new Error(`400: Người dùng không tồn tại!`);
        }
        delete req.body._id;
        delete req.body.user_id;
        delete req.body.code;
        delete req.body.username;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _user = { ...user, ...req.body };
        _user = {
            user_id: _user.user_id,
            code: _user.code,
            username: _user.username,
            password: _user.password,
            email: _user.email,
            phone: _user.phone,
            avatar: _user.avatar,
            first_name: _user.first_name,
            last_name: _user.last_name,
            birth_day: _user.birth_day,
            address: _user.address,
            district: _user.district,
            province: _user.province,
            branch_id: _user.branch_id,
            store_id: _user.store_id,
            last_login: _user.last_login,
            create_date: _user.create_date,
            creator_id: _user.creator_id,
            last_update: moment().tz(TIMEZONE).format(),
            updater_id: req.user.user_id,
            active: _user.active,
            slug_name: removeUnicode(`${req.body.first_name}${req.body.last_name}`, true).toLowerCase(),
            slug_address: removeUnicode(`${req.body.address}`, true).toLowerCase(),
            slug_district: removeUnicode(`${req.body.district}`, true).toLowerCase(),
            slug_province: removeUnicode(`${req.body.province}`, true).toLowerCase(),
        };
        req['body'] = _user;
        await userService.updateUserS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Users`)
            .deleteMany({ user_id: { $in: req.body.user_id } });
        res.send({
            success: true,
            message: 'Xóa người dùng thành công!',
        });
    } catch (err) {
        next(err);
    }
};
