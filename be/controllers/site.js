const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const siteService = require(`../services/site`);
const { removeUnicode } = require('../utils/string-handle');

let checkPlatform = async (name, url, clientId, secrectKey) => {
    //kiểm tra kết nối với các nền tảng khác nhau dựa theo tên, id, key
    let result = Math.floor(Math.random() * 1000) % 2;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (result == 1) {
                resolve('WORKING');
            } else {
                reject('NOT WORKING');
            }
        }, 2000);
    });
};

let _get = async (req, res, next) => {
    try {
        await siteService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _create = async (req, res, next) => {
    try {
        ['name', 'url', 'platform', 'client_id', 'secrect_key'].map((properties) => {
            if (req.body[properties] == undefined) {
                throw new Error(`400: Thiếu thuộc tính ${properties}!`);
            }
        });
        let siteMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Sites' });
        let site_id = (() => {
            if (siteMaxId) {
                if (siteMaxId.value) {
                    return Number(siteMaxId.value);
                }
            }
            return 0;
        })();
        site_id++;
        let status = await checkPlatform(
            req.body.name,
            req.body.url,
            req.body.client_id,
            req.body.secrect_key
        ).catch((err) => {
            throw new Error(err);
        });
        console.log(status);
        let _site = {
            site_id: Number(site_id),
            code: Number(site_id) + 1000000,
            name: req.body.name,
            slug_name: removeUnicode(String(req.body.name), true),
            url: req.body.url,
            platform: req.body.platform,
            client_id: req.body.client_id,
            secrect_key: req.body.secrect_key,
            status: status,
            create_date: new Date(),
            last_update: new Date(),
            creator_id: Number(req.user.user_id),
            active: true,
        };
        console.log(_site);
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Sites' }, { $set: { name: 'Sites', value: site_id } }, { upsert: true });
        req[`_insert`] = _site;
        await siteService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};
let _update = async (req, res, next) => {
    try {
        req.params.site_id = Number(req.params.site_id);
        let site = await client.db(DB).collection(`Sites`).findOne(req.params);
        if (!site) {
            throw new Error(`400: Kênh không tồn tại!`);
        }
        delete req.body._id;
        delete req.body.site_id;
        delete req.body.code;
        delete req.body.status;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _site = { ...site, ...req.body };
        let status = await checkPlatform(_site.name, _site.url, _site.client_id, _site.secrect_key).catch(
            (err) => {
                throw err;
            }
        );
        _site = {
            site_id: Number(_site.site_id),
            code: Number(_site.code),
            name: _site.name,
            url: req.body.url,
            platform: _site.platform,
            client_id: _site.client_id,
            secrect_key: _site.secrect_key,
            status: status,
            create_date: _site.create_date,
            last_update: new Date(),
            creator_id: Number(_site.user_id),
            active: _site.active,
        };
        req['_update'] = _site;
        await siteService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection('Sites')
            .deleteMany({ site_id: { $in: req.body.site_id } });
        res.send({ success: true, data: 'Xóa kênh thành công!' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    _get,
    _create,
    _update,
    _delete,
};
