const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.order_id) mongoQuery = { ...mongoQuery, order_id: req.query.order_id };
        if (token) mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.employee) mongoQuery = { ...mongoQuery, employee: req.query.employee };
        if (req.query.customer) mongoQuery = { ...mongoQuery, customer: req.query.customer };
        if (req.query.creator) mongoQuery = { ...mongoQuery, creator: req.query.creator };
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
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        if (req.query.to_date)
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.code) filterQuery = { ...filterQuery, code: req.query.code };
        if (req.query._bussiness) filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._creator) filterQuery = { ...filterQuery, _creator: req.query._creator };
        if (req.query._customer) filterQuery = { ...filterQuery, _customer: req.query._customer };
        if (req.query.status) filterQuery = { ...filterQuery, status: req.query.status };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [req.query.page || 1, req.query.page_size || 50];
        // lấy data từ database
        let _orders = await client.db(DB).collection(`Orders`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _orders.reverse();
        let [__users, __branchs, __taxes, __promotions, __customers, __payments, __transports] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Branchs`).find({}).toArray(),
            client.db(DB).collection(`Taxes`).find({}).toArray(),
            client.db(DB).collection(`Promotions`).find({}).toArray(),
            client.db(DB).collection(`Customers`).find({}).toArray(),
            client.db(DB).collection(`Payments`).find({}).toArray(),
            client.db(DB).collection(`Transports`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _employee = {};
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _employee[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        let _branchs = {};
        __branchs.map((item) => {
            _branchs[item.branch_id] = item;
        });
        let _taxes = {};
        __taxes.map((item) => {
            _taxes[item.tax_id] = item;
        });
        let _promotions = {};
        __promotions.map((item) => {
            _promotions[item.promotion_id] = item;
        });
        let _customer = {};
        __customers.map((item) => {
            _customer[item.customer_id] = item;
        });
        let _payments = {};
        __payments.map((item) => {
            _payments[item.payment_id] = item;
        });
        let _transports = {};
        __transports.map((item) => {
            _transports[item.transport_id] = item;
        });
        _orders.map((item) => {
            let _order = item;
            _order.bussiness = { ..._bussiness[_order.bussiness] };
            _order.branch = { ..._branchs[_order.branch] };
            _order.employee = { ..._employee[_order.employee] };
            for (let i in _order.taxes) {
                _order.taxes[i] = { ..._taxes[_order.taxes[i]] };
            }
            _order.payment = { ..._payments[_order.payment] };
            _order.shipping_company = {
                ..._transports[_order.shipping_company],
            };
            _order.promotion = { ..._promotions[_order.promotion] };
            _order.creator = { ..._creator[_order.creator] };
            _order.customer = { ..._customer[_order.customer] };
            _order[`_bussiness`] = ``;
            if (_order.bussiness) {
                _order[`_bussiness`] = `${_order.bussiness.first_name || ``} ${_order.bussiness.last_name || ``}`;
            }
            _order[`_creator`] = ``;
            if (_order.creator) {
                _order[`_creator`] = `${_order.creator.first_name || ``} ${_order.creator.last_name || ``}`;
            }
            _order[`_customer`] = ``;
            if (_order.customer) {
                _order[`_customer`] = `${_order.customer.first_name || ``} ${_order.customer.last_name || ``}`;
            }
            return _order;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _orders = _orders.filter((_order) => {
                let check = false;
                [`code`].map((key) => {
                    {
                        let value = new String(_order[key])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(req.query.keyword)
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        if (value.includes(compare)) {
                            check = true;
                        }
                    }
                });
                return check;
            });
        }
        // lọc theo query
        if (filterQuery) {
            if (filterQuery) {
                filterQuery = Object.entries(filterQuery);
                filterQuery.forEach(([filterKey, filterValue]) => {
                    _orders = _orders.filter((_order) => {
                        let value = new String(_order[filterKey])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(filterValue)
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        return value.includes(compare);
                    });
                });
            }
        }
        // đếm số phần tử
        let _counts = _orders.length;
        // phân trang
        if (page && page_size)
            _orders = _orders.slice(Number((page - 1) * page_size), Number((page - 1) * page_size) + Number(page_size));
        res.send({
            success: true,
            data: _orders,
            count: _counts,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let addOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let _order = await client.db(DB).collection(`Orders`).insertOne(req._order);
        if (!_order.insertedId) throw new Error(`500 ~ Create order fail!`);
        await Promise.all(
            req._update.map((item) => {
                client
                    .db(DB)
                    .collection(`SaleProducts`)
                    .findOneAndUpdate({ product_id: item.product_id }, { $set: item });
            })
        );
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Order`,
                name: `Thêm đơn hàng mới`,
                data: _order.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _order.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateOrderS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`Orders`).updateMany(req.query, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness_id: token.bussiness_id.user_id,
                type: `Update`,
                properties: `Order`,
                name: `Cập nhật thông tin đơn hàng`,
                data: req.body,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req.body });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getOrderS,
    addOrderS,
    updateOrderS,
};
