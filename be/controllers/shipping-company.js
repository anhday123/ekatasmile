const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const shippingCompanyService = require(`../services/shipping-company`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_transport`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getTransport)) throw new Error(`400 ~ Validate data wrong!`);
        await shippingCompanyService.getShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_transport`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _shippingCompany] = await Promise.all([
            client.db(DB).collection(`ShippingCompanies`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Transports`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_shippingCompany) throw new Error(`400 ~ Shipping company name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`shipping_company_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _shippingCompany = {
            shipping_company_id: req.body.shipping_company_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            image: req.body.image || ``,
            phone: req.body.phone || ``,
            zipcode: req.body.zipcode || ``,
            address: req.body.address || ``,
            sub_address: createSub(req.body.address || ``),
            district: req.body.district || ``,
            sub_district: createSub(req.body.district || ``),
            province: req.body.province || ``,
            sub_province: createSub(req.body.province || ``),
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _shippingCompany;
        await shippingCompanyService.addShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateShippingCompanyC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_transport`)) throw new Error(`400 ~ Forbidden!`);
        let _shippingCompany = await client.db(DB).collection(`ShippingCompanies`).findOne(req.params);
        if (!_shippingCompany) throw new Error(`400 ~ Shipping company is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
            let _check = await client
                .db(DB)
                .collection(`ShippingCompanies`)
                .findOne({
                    shipping_company_id: { $ne: _shippingCompany.shipping_company_id },
                    name: req.body.name,
                    business_id: token.business_id,
                });
            if (_check) throw new Error(`400 ~ Transport name was exists!`);
        }
        if (req.body.address) {
            req.body[`sub_address`] = createSub(req.body.address);
        }
        if (req.body.district) {
            req.body[`sub_district`] = createSub(req.body.district);
        }
        if (req.body.province) {
            req.body[`sub_province`] = createSub(req.body.province);
        }
        delete req.body._id;
        delete req.body.shipping_company_id;
        delete req.body.business_id;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator_id;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._shippingCompany, ...req.body };
        await shippingCompanyService.updateShippingCompanyS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getShippingCompanyC,
    addShippingCompanyC,
    updateShippingCompanyC,
};
