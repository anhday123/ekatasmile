const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getSettingC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        if (req.query.point_setting_id) {
            mongoQuery['point_setting_id'] = req.query.point_setting_id;
        }
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.branch_id) {
            mongoQuery['branchs'] = { $in: [String(req.query.branch_id)] };
        }
        let [_setting, _user] = await Promise.all([
            client.db(DB).collection('PointSettings').findOne({ business_id: token.business_id }),
            client.db(DB).collection(`Users`).findOne({ business_id: token.business_id }),
        ]);

        if (_setting) {
            _setting['_business'] = _user;
        } else {
            let _counts = await client.db(DB).collection(`PointSettings`).countDocuments();
            let setting = {
                point_setting_id: String(Number(_counts) + 1),
                business_id: token.business_id,
                accumulate_point: true,
                accumulate_point_branchs: ['1', '2'],
                use_point: false,
                use_point_branchs: ['1', '2'],
                point_rate: 0,
                currency_rate: 0,
            };
            _setting = await client.db(DB).collection(`PointSettings`).insertOne(setting);
            if (!_setting.insertedId) {
                throw new Error(`500 ~ Failed create point setting!`);
            }
            _setting = _setting.ops[0];
        }
        res.send({ success: true, data: [_setting] });
    } catch (err) {
        next(err);
    }
};

let updateSettingC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _setting = client.db(DB).collection('PointSettings').findOne({ business_id: token.business_id });
        if (!_setting) {
            throw new Error(`400 ~ Business is not exists!`);
        }
        if (req.body.accumulate_point_branchs) {
            if (typeof req.body.accumulate_point_branchs != 'object') {
                throw new Error(`400 ~ accumulate_point_branchs must be array!`);
            }
            await Promise.all([
                client
                    .db(DB)
                    .collection('Branchs')
                    .updateMany(
                        { branch_id: { $in: [req.body.accumulate_point_branchs] } },
                        { $set: { accumulate_point: true } }
                    ),
                client
                    .db(DB)
                    .collection('Branchs')
                    .updateMany(
                        { branch_id: { $nin: [req.body.accumulate_point_branchs] } },
                        { $set: { accumulate_point: false } }
                    ),
            ]);
        }
        if (req.body.use_point_branchs) {
            if (typeof req.body.use_point_branchs != 'object') {
                throw new Error(`400 ~ use_point_branchs must be array!`);
            }
            await Promise.all([
                client
                    .db(DB)
                    .collection('Branchs')
                    .updateMany(
                        { branch_id: { $in: [req.body.use_point_branchs] } },
                        { $set: { use_point: true } }
                    ),
                client
                    .db(DB)
                    .collection('Branchs')
                    .updateMany(
                        { branch_id: { $nin: [req.body.use_point_branchs] } },
                        { $set: { use_point: false } }
                    ),
            ]);
        }
        if (typeof req.body.point_rate != 'number') {
            throw new Error("400 ~ Typeof 'point_rate' must be number");
        }
        if (req.body.currency_rate) {
            throw new Error("400 ~ Typeof 'currency_rate' must be number");
        }
        delete req.body._id;
        delete req.body.business_id;
        delete req.body.point_setting_id;
        delete req.body._business;
        req['_update'] = { ..._setting, ...req.body };
        await client.db(DB).collection('PointSettings').findOneAndUpdate(req.params, { $set: req._update });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = { getSettingC, updateSettingC };
