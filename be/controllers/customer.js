const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/customer`);
const customerService = require(`../services/customer`);

let getCustomerC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getCustomer))
            throw new Error(`400 ~ Validate data wrong!`);
        await customerService.getCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        if (!valid.absolute(req.body, form.addCustomer))
            throw new Error(`400 ~ Validate data wrong!`);
        let [_counts, _count, _bussiness, _customer] = await Promise.all([
            client.db(DB).collection(`Customers`).countDocuments(),
            client
                .db(DB)
                .collection(`Customers`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Customers`).findOne({
                phone: req.body.phone,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_customer) throw new Error(`400 ~ Phone was exists!`);
        let _customers = await client
            .db(DB)
            .collection(`Customers`)
            .find({ bussiness: token.bussiness.user_id })
            .toArray();
        for (let i in _customers) {
            let oldName = _customers[i].first_name + _customers[i].last_name;
            let newName = req.body.first_name + req.body.last_name;
            if (
                `khách lẻ`
                    .normalize(`NFD`)
                    .replace(/[\u0300-\u036f]|\s/g, ``)
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'D')
                    .toLowerCase() ==
                    newName
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``)
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')
                        .toLowerCase() &&
                newName
                    .normalize(`NFD`)
                    .replace(/[\u0300-\u036f]|\s/g, ``)
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'D')
                    .toLowerCase() ==
                    oldName
                        .normalize(`NFD`)
                        .replace(/[\u0300-\u036f]|\s/g, ``)
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')
                        .toLowerCase()
            ) {
                console.log(oldName);
                throw new Error(`400 ~ "Khách lẻ" was exists!`);
            }
        }
        req.body[`customer_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`type`] = req.body.type.toUpperCase();
        req.body[`bussiness`] = _bussiness.user_id;
        _customer = {
            customer_id: req.body.customer_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            phone: req.body.phone,
            type: req.body.type,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            birthday: req.body.birthday,
            address: req.body.address,
            ward: req.body.ward,
            district: req.body.district,
            province: req.body.province,
            balance: req.body.balance || [],
            create_date: moment().format(),
            last_login: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_customer`] = _customer;
        await customerService.addCustomerS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCustomerC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _customer = await client
            .db(DB)
            .collection(`Customers`)
            .findOne(req.params);
        if (!_customer) throw new Error(`400 ~ Customer is not exists!`);
        delete req.body._id;
        delete req.body.customer_id;
        delete req.body.bussiness;
        delete req.body.create_date;
        delete req.body.last_login;
        delete req.body.creator;
        delete req.body._bussiness;
        delete req.body._creator;
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
