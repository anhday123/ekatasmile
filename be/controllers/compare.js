const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

// const valid = require(`../middleware/validate/validate`);
// const form = require(`../middleware/validate/branch`);
const compareServices = require(`../services/compare`);

let getSessionC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_branch`))
        //     throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getBranch))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await compareServices.getSessionS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let getCompareC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`view_branch`))
        //     throw new Error(`400 ~ Forbidden!`);
        // if (!valid.relative(req.query, form.getBranch))
        //     throw new Error(`400 ~ Validate data wrong!`);
        await compareServices.getCompareS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let addCompareC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`add_branch`))
        //     throw new Error(`400 ~ Forbidden!`);
        // if (!valid.absolute(req.body, form.addBranch))
        //     throw new Error(`400 ~ Validate data wrong!`);
        let [_counts, _session_counts, _bussiness, _creator, __orders, __customers] = await Promise.all([
            client.db(DB).collection(`Compares`).countDocuments(),
            client.db(DB).collection(`CompareSessions`).countDocuments(),
            client.db(DB).collection(`Users`).findOne({ user_id: token._bussiness.user_id }),
            client.db(DB).collection(`Users`).findOne({ user_id: token.user_id }),
            client.db(DB).collection(`Orders`).find({ bussiness: token._bussiness.user_id }).toArray(),
            client.db(DB).collection(`Customers`).find({ bussiness: token._bussiness.user_id }).toArray(),
        ]);
        let _orders = {};
        __orders.map((item) => {
            _orders[item.order_id] = item;
        });
        let _customers = {};
        __customers.map((item) => {
            _customers[item.customer_id] = item;
        });
        req.body[`session_id`] = String(_session_counts + 1);
        req.body[`code`] = String(1000000 + _session_counts + 1);
        let _session = {
            session_id: req.body.session_id,
            bussiness: token.bussiness.user_id,
            code: req.body.code,
            type: req.body.type,
            file: req.body.file,
            create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
            creator: token.user_id,
        };
        req[`_session`] = _session;
        req[`_compares`] = [];
        for (let i in req.body.compares) {
            req.body.compares[i][`compare_id`] = String(_counts + 1 + Number(i));
            req.body.compares[i][`code`] = String(1000000 + _counts + 1 + Number(i));
            let _compare = {
                compare_id: req.body.compares[i].compare_id,
                bussiness: token.bussiness.user_id,
                session: req.body.session_id,
                code: req.body.compares[i].code,
                order: req.body.compares[i].order,
                shipping_company: req.body.compares[i].shipping_company,
                shipping: req.body.compares[i].shipping,
                customer: req.body.compares[i].customer,
                cod_cost: req.body.compares[i].cod_cost,
                real_cod_cost: req.body.compares[i].real_cod_cost,
                card_cost: req.body.compares[i].card_cost,
                shipping_cost: req.body.compares[i].shipping_cost,
                insurance_cost: req.body.compares[i].insurance_cost,
                delivery_cost: req.body.compares[i].delivery_cost,
                transfer_cost: req.body.compares[i].transfer_cost,
                warehouse_cost: req.body.compares[i].warehouse_cost,
                weight: req.body.compares[i].weight,
                revice_date: req.body.compares[i].revice_date,
                complete_date: req.body.compares[i].complete_date,
                note: req.body.compares[i].note,
                status: req.body.compares[i].status,
                create_date: moment.tz(`Asia/Ho_Chi_Minh`).format(),
                creator: token.user_id,
            };
            req[`_compares`].push(_compare);
        }
        await compareServices.addCompareS(req, res, next);
    } catch (err) {
        next(err);
    }
};

let updateCompareC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        // if (!token.role.permission_list.includes(`update_branch`))
        //     throw new Error(`400 ~ Forbidden!`);
        await compareServices.updateCompareS(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSessionC,
    getCompareC,
    addCompareC,
    updateCompareC,
};
