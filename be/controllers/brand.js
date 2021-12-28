const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const brandService = require(`../services/brand`);
const { Brand } = require('../models/brand');

let getBrandC = async (req, res, next) => {
    try {
        await brandService.getBrandS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let createBrandC = async (req, res, next) => {
    try {
        let _brand = new Brand();
        _brand.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let brand = await client.db(DB).collection(`Brands`).findOne({
            name: req.body.name,
        });
        let brandMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Brands' });
        if (brand) {
            throw new Error(`400: Thương hiệu đã tồn tại!`);
        }
        let brand_id = (() => {
            if (brandMaxId) {
                if (brandMaxId.value) {
                    return Number(brandMaxId.value);
                }
            }
            return 0;
        })();
        brand_id++;
        _brand.create({
            ...req.body,
            ...{
                brand_id: Number(brand_id),
                business_id: Number(req.user.business_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Brands' }, { $set: { name: 'Brands', value: brand_id } }, { upsert: true });
        req[`_insert`] = _brand;
        await brandService.createBrandS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateBrandC = async (req, res, next) => {
    try {
        req.params.brand_id = Number(req.params.brand_id);
        let _brand = new Brand();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let brand = await client.db(DB).collection(`Brands`).findOne(req.params);
        if (!brand) {
            throw new Error(`400: Bài viết không tồn tại!`);
        }
        if (req.body.title) {
            let check = await client
                .db(DB)
                .collection(`Brands`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    brand_id: { $ne: Number(brand.brand_id) },
                    title: req.body.title,
                });
            if (check) {
                throw new Error(`400: Bài viết đã tồn tại!`);
            }
        }
        _brand.create(brand);
        _brand.update(req.body);
        req['_update'] = _brand;
        await brandService.updateBrandS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports._delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection(`Brands`)
            .deleteMany({ brand_id: { $in: req.body.brand_id } });
        res.send({
            success: true,
            message: 'Xóa thương hiệu thành công!',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBrandC,
    createBrandC,
    updateBrandC,
};
