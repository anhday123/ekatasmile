const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const categoryService = require(`../services/category`);
const { Category } = require('../models/category');

let getCategoryC = async (req, res, next) => {
    try {
        await categoryService.getCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCategoryC = async (req, res, next) => {
    try {
        let _category = new Category();
        _category.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let category = await client
            .db(DB)
            .collection(`Categories`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        console.log(category);
        let categoryMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Categories' });
        if (category) {
            throw new Error(`400: Nhóm sản phẩm đã tồn tại!`);
        }
        let category_id = (() => {
            if (categoryMaxId) {
                if (categoryMaxId.value) {
                    return Number(categoryMaxId.value);
                }
            }
            return 0;
        })();
        category_id++;
        _category.create({
            ...req.body,
            ...{
                category_id: Number(category_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Categories' }, { $set: { name: 'Categories', value: category_id } }, { upsert: true });
        req[`_insert`] = _category;
        await categoryService.addCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCategoryC = async (req, res, next) => {
    try {
        req.params.category_id = Number(req.params.category_id);
        let _category = new Category();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let category = await client.db(DB).collection(`Categories`).findOne(req.params);
        if (!category) {
            throw new Error(`400: Nhóm sản phẩm không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Categories`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    category_id: { $ne: Number(category.category_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Nhóm sản phẩm đã tồn tại!`);
            }
        }
        _category.create(category);
        _category.update(req.body);
        req['_update'] = _category;
        await categoryService.updateCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Categories`)
            .deleteMany({ category_id: { $in: req.body.category_id } });
        res.send({
            success: true,
            message: 'Xóa bài viết thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategoryC,
    addCategoryC,
    updateCategoryC,
    _delete,
};
