const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getStatisS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.bussiness)
            mongoQuery = { ...mongoQuery, bussiness: req.query.bussiness };
        if (req.query.from_date)
            mongoQuery[`date`] = {
                ...mongoQuery[`date`],
                $gte: req.query.from_date,
            };
        if (req.query.to_date)
            mongoQuery[`date`] = {
                ...mongoQuery[`date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        // lấy data từ database
        let _orders = await client
            .db(DB)
            .collection(`Orders`)
            .find(mongoQuery)
            .toArray();
        let total_base_cost = 0;
        let total_sale_cost = 0;
        let gross_profit = 0;
        let net_profit = 0;
        let total_sale = 0;
        let total_order = 0;
        let total_discount = 0;
        for (let i in _orders) {
            for (let j in _orders[i].order_details) {
                total_base_cost +=
                    (_orders[i].order_details[j].base_price || 0) *
                    _orders[i].order_details[j].quantity;
                total_sale_cost +=
                    (_orders[i].order_details[j].sale_price || 0) *
                    _orders[i].order_details[j].quantity;
                total_discount += _orders[i].order_details[j].discount || 0;
            }
            total_sale += _orders[i].total_cost;
            total_order += _orders[i].final_cost;
        }
        gross_profit = total_order - total_discount - total_base_cost;
        net_profit = total_sale - total_discount - total_base_cost;
        res.send({
            success: true,
            data: {
                order_amount: _orders.length,
                total_base_cost: total_base_cost,
                total_sale_cost: total_sale_cost,
                total_discount: total_discount,
                total_sale: total_sale,
                total_order: total_order,
                gross_profit: gross_profit,
                net_profit: net_profit,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStatisS,
};
