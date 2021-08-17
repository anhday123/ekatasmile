const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/category`);
const categoryService = require(`../services/category`);

let getCategoryC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getCategory))
            throw new Error(`400 ~ Validate data wrong!`);
        await categoryService.getCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        if (!valid.absolute(req.body, form.addCategory))
            throw new Error(`400 ~ Validate data wrong!`);
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _count, _bussiness, _category] = await Promise.all([
            client.db(DB).collection(`Categories`).countDocuments(),
            client
                .db(DB)
                .collection(`Categories`)
                .find({ bussiness: token.bussiness.user_id })
                .count(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.bussiness.user_id,
                active: true,
            }),
            client.db(DB).collection(`Categories`).findOne({
                name: req.body.name,
                bussiness: token.bussiness.user_id,
            }),
        ]);
        if (_category) throw new Error(`400 ~ Category name was exists!`);
        if (!_bussiness)
            throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`category_id`] = String(_counts + 1);
        req.body[`code`] = `${String(_bussiness.company_name)
            .normalize(`NFD`)
            .replace(/[\u0300-\u036f]|\s/g, ``)
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toUpperCase()}_${String(_count + 1)}`;
        req.body[`bussiness`] = _bussiness.user_id;
        _category = {
            category_id: req.body.category_id,
            bussiness: req.body.bussiness,
            code: req.body.code,
            type: req.body.type,
            name: req.body.name,
            description: req.body.description,
            create_date: moment().format(),
            creator: token.user_id,
            active: true,
        };
        req[`_category`] = _category;
        await categoryService.addCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _category = await client
            .db(DB)
            .collection(`Categories`)
            .findOne(req.params);
        if (!_category) throw new Error(`400 ~ Category is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
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
        delete req.body._bussiness;
        delete req.body._creator;
        await categoryService.updateCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let getProductInCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let [__products, __categories] = await Promise.all([
            client
                .db(DB)
                .collection(`SaleProducts`)
                .find({
                    bussiness: token.bussiness.user_id,
                    branch: token.branch.branch_id,
                    active: true,
                })
                .toArray(),
            client
                .db(DB)
                .collection(`Categories`)
                .find({ bussiness: token.bussiness.user_id, active: true })
                .toArray(),
        ]);
        let _categories = {};
        __categories.map((item) => {
            _categories[item.category_id] = item;
        });
        __products.map((item) => {
            let _product = item;
            let category = { ..._categories[_product.category] };
            _product[`_category`] = category?.name;
            return _product;
        });
        _categories = {};
        __categories.map((item) => {
            _categories[item.name] = [];
        });
        __products.map((item) => {
            _categories[item._category].push(item);
        });
        let result = [];
        for (let i in _categories)
            result.push({ name: i, data: _categories[i] });
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
