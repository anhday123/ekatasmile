const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const channelService = require(`../services/channel`);
const { removeUnicode } = require('../utils/string-handle');

let checkPlatform = async (name, url, clientId, secretKey) => {
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
        await channelService._get(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _create = async (req, res, next) => {
    try {
        ['name', 'url', 'platform_id', 'client_id', 'secret_key'].map((properties) => {
            if (req.body[properties] == undefined) {
                throw new Error(`400: Thiếu thuộc tính ${properties}!`);
            }
        });
        let channelMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Channels' });
        let channel_id = (() => {
            if (channelMaxId) {
                if (channelMaxId.value) {
                    return Number(channelMaxId.value);
                }
            }
            return 0;
        })();
        channel_id++;
        let status = await checkPlatform(req.body.name, req.body.url, req.body.client_id, req.body.secret_key).catch(
            (err) => {
                throw new Error(err);
            }
        );
        let _site = {
            channel_id: Number(channel_id),
            business_id: Number(req.user.business_id),
            code: String(channel_id).padStart(6, '0'),
            name: req.body.name,
            slug_name: removeUnicode(String(req.body.name), true),
            url: req.body.url,
            platform_id: req.body.platform_id,
            client_id: req.body.client_id,
            secret_key: req.body.secret_key,
            status: status,
            create_date: new Date(),
            last_update: new Date(),
            creator_id: Number(req.user.user_id),
            active: true,
        };
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Channels' }, { $set: { name: 'Channels', value: channel_id } }, { upsert: true });
        req[`_insert`] = _site;
        await channelService._create(req, res, next);
    } catch (err) {
        next(err);
    }
};
let _update = async (req, res, next) => {
    try {
        req.params.channel_id = Number(req.params.channel_id);
        let site = await client.db(DB).collection(`Channels`).findOne(req.params);
        if (!site) {
            throw new Error(`400: Kênh không tồn tại!`);
        }
        delete req.body._id;
        delete req.body.channel_id;
        delete req.body.code;
        delete req.body.status;
        delete req.body.create_date;
        delete req.body.creator_id;
        let _site = { ...site, ...req.body };
        let status = await checkPlatform(_site.name, _site.url, _site.client_id, _site.secret_key).catch((err) => {
            throw err;
        });
        _site = {
            channel_id: Number(_site.channel_id),
            code: Number(_site.code),
            name: _site.name,
            url: req.body.url,
            platform: _site.platform,
            client_id: _site.client_id,
            secret_key: _site.secret_key,
            status: status,
            create_date: _site.create_date,
            last_update: new Date(),
            creator_id: Number(_site.user_id),
            active: _site.active,
        };
        req['_update'] = _site;
        await channelService._update(req, res, next);
    } catch (err) {
        next(err);
    }
};

let _delete = async (req, res, next) => {
    try {
        await client
            .db(DB)
            .collection('Channels')
            .deleteMany({ channel_id: { $in: req.body.channel_id } });
        res.send({ success: true, data: 'Xóa kênh thành công!' });
    } catch (err) {
        next(err);
    }
};

let _getPlatform = async (req, res, next) => {
    try {
        await channelService._getPlatform(req, res, next);
    } catch (err) {
        next(err);
        s;
    }
};

module.exports = {
    _get,
    _create,
    _update,
    _delete,
    _getPlatform,
};
