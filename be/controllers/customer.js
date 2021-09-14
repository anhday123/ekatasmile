const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const customerService = require(`../services/customer`);

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_customer`)) throw new Error(`400 ~ Forbidden!`);
        await customerService.getCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_customer`)) throw new Error(`400 ~ Forbidden!`);
        ['phone'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        let [_counts, _business, _customer] = await Promise.all([
            client.db(DB).collection(`Customers`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Customers`).findOne({
                phone: req.body.phone,
                business_id: token.business_id,
            }),
        ]);
        if (_customer) throw new Error(`400 ~ Phone was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        let _customers = await client
            .db(DB)
            .collection(`Customers`)
            .find({ business_id: token.business_id })
            .toArray();
        _customers.map((_customer) => {
            let oldName = _customer.first_name + _customer.last_name;
            let newName = req.body.first_name + req.body.last_name;
            if (
                removeUnicode(`khách lẻ`).toLocaleLowerCase() == removeUnicode(newName).toLocaleLowerCase() &&
                removeUnicode(newName).toLocaleLowerCase() == removeUnicode(oldName).toLocaleLowerCase()
            ) {
                throw new Error(`400 ~ "Khách lẻ" was exists!`);
            }
        });
        req.body[`customer_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`type`] = req.body.type.toUpperCase();
        req.body[`business_id`] = _business.user_id;
        _customer = {
            customer_id: req.body.customer_id,
            business_id: req.body.business_id,
            code: req.body.code,
            phone: req.body.phone,
            type: req.body.type || 'Tiềm năng',
            sub_type: removeUnicode(req.body.type || 'Tiềm năng').toLocaleLowerCase(),
            first_name: req.body.first_name || ``,
            last_name: req.body.last_name || ``,
            sub_name: removeUnicode(
                String(req.body.first_name) + String(req.body.last_name)
            ).toLocaleLowerCase(),
            gender: req.body.gender || `NAM`,
            sub_gender: removeUnicode(req.body.gender || 'Nam').toLocaleLowerCase(),
            birthday: req.body.birthday || `2000-01-01`,
            address: req.body.address || ``,
            sub_address: removeUnicode(req.body.address || ``).toLocaleLowerCase(),
            district: req.body.district || ``,
            sub_district: removeUnicode(req.body.district || ``).toLocaleLowerCase(),
            province: req.body.province || ``,
            sub_province: removeUnicode(req.body.province || ``).toLocaleLowerCase(),
            balance: req.body.balance || [],
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            last_login: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _customer;
        await customerService.addCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_customer`)) throw new Error(`400 ~ Forbidden!`);
        let _customer = await client.db(DB).collection(`Customers`).findOne(req.params);
        if (!_customer) throw new Error(`400 ~ Customer is not exists!`);
        if (req.body.type) {
            req.body[`sub_type`] = removeUnicode(req.body.type).toLocaleLowerCase();
        }
        if (req.body.first_name || req.body.last_name) {
            req.body.sub_name = removeUnicode(
                `${req.body.first_name || _user.first_name}${req.body.last_name || _user.last_name}`
            ).toLocaleLowerCase();
        }
        if (req.body.gender) {
            req.body[`sub_gender`] = removeUnicode(req.body.gender).toLocaleLowerCase();
        }
        if (req.body.address) {
            req.body[`sub_address`] = removeUnicode(req.body.address).toLocaleLowerCase();
        }
        if (req.body.district) {
            req.body[`sub_district`] = removeUnicode(req.body.district).toLocaleLowerCase();
        }
        if (req.body.province) {
            req.body[`sub_province`] = removeUnicode(req.body.province).toLocaleLowerCase();
        }
        delete req.body._id;
        delete req.body.customer_id;
        delete req.body.bussiness;
        delete req.body.create_date;
        delete req.body.last_login;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._customer, ...req.body };
        await customerService.updateCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCustomerC,
    addCustomerC,
    updateCustomerC,
};
