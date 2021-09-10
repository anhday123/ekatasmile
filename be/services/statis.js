const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getStatisS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (token) mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.bussiness) mongoQuery = { ...mongoQuery, bussiness: req.query.bussiness };
        if (req.query.today == `true`) {
            req.query.from_date = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
            req.query.to_date = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
        }
        if (req.query.yesterday == `true`) {
            req.query.from_date = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
            req.query.to_date = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
        }
        if (req.query.this_week == `true`) {
            req.query.from_date = moment.tz(`Asia/Ho_Chi_Minh`).isoWeekday(1).format(`YYYY-MM-DD`);
            req.query.to_date = moment.tz(`Asia/Ho_Chi_Minh`).isoWeekday(7).format(`YYYY-MM-DD`);
        }
        if (req.query.last_week != undefined) {
            req.query.from_date = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(1 - 7)
                .format(`YYYY-MM-DD`);
            req.query.to_date = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(7 - 7)
                .format(`YYYY-MM-DD`);
        }
        if (req.query.this_month != undefined) {
            req.query.from_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
                `-` +
                String(`01`);
            req.query.to_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).daysInMonth());
        }
        if (req.query.last_month != undefined) {
            req.query.from_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(`01`);
            req.query.to_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).daysInMonth());
        }
        if (req.query.this_year != undefined) {
            req.query.from_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
        }
        if (req.query.last_year != undefined) {
            req.query.from_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
            req.query.to_date =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`12`) +
                `-` +
                String(`31`);
        }
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
        let [_orders, __products] = await Promise.all([
            client.db(DB).collection(`Orders`).find(mongoQuery).toArray(),
            client.db(DB).collection(`SaleProducts`).find({ bussiness: token.bussiness.user_id }).toArray(),
        ]);
        let _products = {};
        __products.map((item) => {
            if (item.has_variable) {
                for (let i in item.variants) {
                    let _image = item.image.concat(item.variants[i].image);
                    let tmp = { ...item, ...item.variants[i], image: _image };
                    _products[tmp.sku] = tmp;
                }
            } else _products[item.sku] = item;
        });
        let total_base_cost = 0;
        let total_sale_cost = 0;
        let gross_profit = 0;
        let net_profit = 0;
        let total_sale = 0;
        let total_order = 0;
        let total_discount = 0;
        let _ranks = {};
        let _today = [];
        let _yesterday = [];
        for (let i in _orders) {
            if (moment(_orders[i].create_date).format(`YYYY-MM-DD`) == moment().format(`YYYY-MM-DD`)) {
                _today.push(_orders[i]);
            }
            if (moment(_orders[i].create_date).format(`YYYY-MM-DD`) == moment().add(-1, `days`).format(`YYYY-MM-DD`)) {
                _yesterday.push(_orders[i]);
            }
            for (let j in _orders[i].order_details) {
                let sku = _orders[i].order_details[j].sku;
                if (!_ranks[sku])
                    _ranks[String(sku)] = {
                        quantity: 1,
                        cost: _orders[i].order_details[j].total_cost,
                    };
                else {
                    _ranks[sku][`quantity`] += 1;
                    _ranks[sku][`cost`] += _orders[i].order_details[j].total_cost;
                }
                total_base_cost += (_orders[i].order_details[j].base_price || 0) * _orders[i].order_details[j].quantity;
                total_sale_cost += (_orders[i].order_details[j].sale_price || 0) * _orders[i].order_details[j].quantity;
                total_discount += _orders[i].order_details[j].discount || 0;
            }
            total_sale += _orders[i].total_cost;
            total_order += _orders[i].final_cost;
        }
        _ranks = Object.entries(_ranks);
        _ranks.sort((a, b) => {
            if (a[1].cost < b[1].cost) return 1;
            else return -1;
        });
        if (req.query.top) _ranks = _ranks.slice(0, req.query.top || 10);
        for (let i in _ranks) {
            _ranks[i][0] = _products[_ranks[i][0]] || _ranks[i][0];
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
                product_rank: _ranks,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStatisS,
};
