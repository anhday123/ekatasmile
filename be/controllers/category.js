const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const categoryService = require(`../services/category`);
const { Category } = require('../models/category');

let getCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await categoryService.getCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _category = new Category();
        _category.validateInput(req.body);
        req.body.name = req.body.name.trim().toUpperCase();
        let [business, category] = await Promise.all([
            client
                .db(DB)
                .collection(`Users`)
                .findOne({
                    user_id: ObjectId(token.business_id),
                    delete: false,
                    active: true,
                }),
            client
                .db(DB)
                .collection(`Categories`)
                .findOne({
                    business_id: ObjectId(token.business_id),
                    name: req.body.name,
                    delete: false,
                }),
        ]);
        if (!business) {
            throw new Error(
                `400: business_id <${token.business_id}> không tồn tại hoặc chưa được kích hoạt!`
            );
        }
        if (category) {
            throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
        }
        _category.create({
            ...req.body,
            ...{
                category_id: ObjectId(),
                business_id: business.user_id,
                create_date: moment().utc().format(),
                creator_id: ObjectId(token.user_id),
                delete: false,
                active: true,
            },
        });
        req[`_insert`] = _category;
        await categoryService.addCategoryS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateCategoryC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        req.params.category_id = ObjectId(req.params.category_id);
        let _category = new Category();
        req.body.name = req.body.name.trim().toUpperCase();
        let category = await client.db(DB).collection(`Categories`).findOne(req.params);
        if (!category) {
            throw new Error(`400: category_id <${req.params.category_id}> không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Categories`)
                .findOne({
                    business_id: ObjectId(token.user_id),
                    category_id: { $ne: category.category_id },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: name <${req.body.name}> đã tồn tại!`);
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

module.exports = {
    getCategoryC,
    addCategoryC,
    updateCategoryC,
};
