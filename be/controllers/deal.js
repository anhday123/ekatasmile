const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;

const dealService = require(`../services/deal`);
const { Deal } = require('../models/deal');

let getDealC = async (req, res, next) => {
    try {
        await dealService.getDealS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addDealC = async (req, res, next) => {
    try {
        let _deal = new Deal();
        _deal.validateInput(req.body);
        req.body.name = String(req.body.name).trim().toUpperCase();
        let deal = await client
            .db(DB)
            .collection(`Deals`)
            .findOne({
                business_id: Number(req.user.business_id),
                name: req.body.name,
            });
        let dealMaxId = await client.db(DB).collection('AppSetting').findOne({ name: 'Deals' });
        if (deal) {
            throw new Error(`400: Chương trình giảm giá đã tồn tại!`);
        }
        let deal_id = (() => {
            if (dealMaxId) {
                if (dealMaxId.value) {
                    return Number(dealMaxId.value);
                }
            }
            return 0;
        })();
        deal_id++;
        _deal.create({
            ...req.body,
            ...{
                deal_id: Number(deal_id),
                business_id: Number(req.user.user_id),
                create_date: new Date(),
                creator_id: Number(req.user.user_id),
                active: true,
            },
        });
        await client
            .db(DB)
            .collection('AppSetting')
            .updateOne({ name: 'Deals' }, { $set: { name: 'Deals', value: deal_id } }, { upsert: true });
        req[`_insert`] = _deal;
        await dealService.addDealS(req, res, next);
    } catch (err) {
        next(err);
    }
};
let updateDealC = async (req, res, next) => {
    try {
        req.params.deal_id = Number(req.params.deal_id);
        let _deal = new Deal();
        req.body.name = String(req.body.name).trim().toUpperCase();
        let deal = await client.db(DB).collection(`Deals`).findOne(req.params);
        if (!deal) {
            throw new Error(`400: Chương trình giảm giá không tồn tại!`);
        }
        if (req.body.name) {
            let check = await client
                .db(DB)
                .collection(`Deals`)
                .findOne({
                    business_id: Number(req.user.business_id),
                    deal_id: { $ne: Number(deal.deal_id) },
                    name: req.body.name,
                });
            if (check) {
                throw new Error(`400: Chương trình giảm giá đã tồn tại!`);
            }
        }
        _deal.create(deal);
        _deal.update(req.body);
        req['_update'] = _deal;
        await dealService.updateDealS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDealC,
    addDealC,
    updateDealC,
};
