const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const categoryService = require(`../services/category`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_category`)) throw new Error(`400 ~ Forbidden!`);
        await categoryService.getCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_category`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _category] = await Promise.all([
            client.db(DB).collection(`Categories`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Categories`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_category) throw new Error(`400 ~ Category name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`category_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _category = {
            category_id: req.body.category_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            description: req.body.description || ``,
            default: req.body.default || false,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _category;
        await categoryService.addCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_category`)) throw new Error(`400 ~ Forbidden!`);
        let _category = await client.db(DB).collection(`Categories`).findOne(req.params);
        if (!_category) throw new Error(`400 ~ Category is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            req.body[`sub_name`] = createSub(req.body.name);
            let _check = await client
                .db(DB)
                .collection(`Categories`)
                .findOne({
                    category_id: { $ne: _category.category_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Category name was exists!`);
        }
        delete req.body._id;
        delete req.body.category_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._category, ...req.body };
        await categoryService.updateCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let getProductInCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let [__products, __categories] = await Promise.all([
            client
                .db(DB)
                .collection(`SaleProducts`)
                .find({
                    business_id: token.business_id,
                    store_id: token.store_id,
                    active: true,
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Categories`)
                .find({ business_id: token.business_id, active: true })
                .toArray(),
        ]);
        let _categories = {};
        __categories.map((item) => {
            _categories[item.category_id] = item;
        });
        __products.map((item) => {
            let category = { ..._categories[item.category] };
            item[`_category`] = category.name;
            return item;
        });
        _categories = {};
        __categories.map((item) => {
            _categories[item.name] = [];
        });
        __products.map((item) => {
            _categories[item._category].push(item);
        });
        let result = [];
        for (let i in _categories) result.push({ name: i, data: _categories[i] });
        res.send({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategoryC,
    addCategoryC,
    updateCategoryC,
    getProductInCategoryC,
};
