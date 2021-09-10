const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const labelService = require(`../services/label`);

let createSub = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLocaleLowerCase();
};

let getLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // console.log(req);
        // if (!token.role.permission_list.includes(`view_category`)) throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getCategory)) throw new Error(`400 ~ Validate data wrong!`);
        await labelService.getLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_label`)) throw new Error(`400 ~ Forbidden!`);
        ['name'].map((property) => {
            if (req.body[property] == undefined) {
                throw new Error(`400 ~ ${property} is not null!`);
            }
        });
        req.body[`name`] = String(req.body.name).trim().toUpperCase();
        let [_counts, _business, _label] = await Promise.all([
            client.db(DB).collection(`Labels`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({
                user_id: token.business_id,
                active: true,
            }),
            client.db(DB).collection(`Labels`).findOne({
                name: req.body.name,
                business_id: token.business_id,
            }),
        ]);
        if (_label) throw new Error(`400 ~ Label name was exists!`);
        if (!_business) throw new Error(`400 ~ Bussiness is not exists or inactive!`);
        req.body[`label_id`] = String(_counts + 1);
        req.body[`code`] = String(1000000 + _counts + 1);
        req.body[`business_id`] = _business.user_id;
        _label = {
            label_id: req.body.label_id,
            business_id: req.body.business_id,
            code: req.body.code,
            name: req.body.name,
            sub_name: createSub(req.body.name),
            description: req.body.description || ``,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator_id: token.user_id,
            active: true,
        };
        req[`_insert`] = _label;
        await labelService.addLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateLabelC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_label`)) throw new Error(`400 ~ Forbidden!`);
        // let _label = await client.db(DB).collection(`Labels`).findOne(req.params);
        if (!_label) throw new Error(`400 ~ Label is not exists!`);
        if (req.body.name) {
            req.body[`name`] = String(req.body.name).toUpperCase();
            let _check = await client
                .db(DB)
                .collection(`Labels`)
                .findOne({
                    label_id: { $ne: _label.label_id },
                    name: req.body.name,
                    bussiness: token.bussiness.user_id,
                });
            if (_check) throw new Error(`400 ~ Label name was exists!`);
        }
        delete req.body._id;
        delete req.body.label_id;
        delete req.body.bussiness;
        delete req.body.code;
        delete req.body.create_date;
        delete req.body.creator;
        delete req.body._business;
        delete req.body._creator;
        req['_update'] = { ..._label, ...req.body };
        await labelService.updateLabelS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getLabelC,
    addLabelC,
    updateLabelC,
};
