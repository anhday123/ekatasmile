const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.delivery_note_id)
            mongoQuery = {
                ...mongoQuery,
                delivery_note_id: req.query.delivery_note_id,
            };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.user_ship)
            mongoQuery = { ...mongoQuery, user_ship: req.query.user_ship };
        if (req.query.user_receive)
            mongoQuery = {
                ...mongoQuery,
                user_receive: req.query.user_receive,
            };
        if (req.query.from)
            mongoQuery = { ...mongoQuery, from: req.query.from };
        if (req.query.to) mongoQuery = { ...mongoQuery, to: req.query.to };
        if (req.query.creator)
            mongoQuery = { ...mongoQuery, creator: req.query.creator };
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
        if (req.query.code)
            filterQuery = { ...filterQuery, code: req.query.code };
        if (req.query.type)
            mongoQuery = { ...mongoQuery, type: req.query.type };
        if (req.query.phone)
            filterQuery = { ...filterQuery, phone: req.query.phone };
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._creator)
            filterQuery = { ...filterQuery, _creator: req.query._creator };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _deliveries = await client
            .db(DB)
            .collection(`DeliveryNotes`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _deliveries.reverse();
        let [__users, __branchs] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Branchs`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        let _branchs = {};
        __branchs.map((item) => {
            _branchs[item.branch_id] = item;
        });
        _deliveries.map((item) => {
            let _delivery = item;
            _delivery.bussiness = { ..._bussiness[_delivery.bussiness] };
            _delivery.creator = { ..._creator[_delivery.creator] };
            _delivery.from =
                _delivery.from == `WAREHOUSE`
                    ? _delivery.from
                    : { ..._branchs[_delivery.from] };
            _delivery.to = { ..._branchs[_delivery.to] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _delivery[
                `_bussiness`
            ] = `${_delivery.bussiness?.first_name} ${_delivery.bussiness?.last_name}`;
            _delivery[
                `_creator`
            ] = `${_delivery.creator?.first_name} ${_delivery.creator?.last_name}`;
            return _delivery;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _deliveries = _deliveries.filter((_delivery) => {
                let check = false;
                [`code`, `type`, `name`].map((key) => {
                    {
                        let value = new String(_delivery[key])
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
                    _deliveries = _deliveries.filter((_delivery) => {
                        let value = new String(_delivery[filterKey])
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
        let _counts = _deliveries.length;
        // phân trang
        if (page && page_size)
            _deliveries = _deliveries.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _deliveries,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _delivery = await client
            .db(DB)
            .collection(`DeliveryNotes`)
            .insertOne(req._delivery);
        if (!_delivery.insertedId)
            throw new Error(`500 ~ Create delivery fail!`);
        if (req._delivery.products) {
            let __sources;
            if (req._delivery.from.warehouse_id)
                __sources = await client
                    .db(DB)
                    .collection(`Products`)
                    .find({ active: true })
                    .toArray();
            if (req._delivery.from.branch_id)
                __sources = await client
                    .db(DB)
                    .collection(`SaleProducts`)
                    .find({ active: true })
                    .toArray();
            let __destinations;
            if (req._delivery.to.warehouse_id)
                __destinations = await client
                    .db(DB)
                    .collection(`Products`)
                    .find({ active: true })
                    .toArray();
            if (req._delivery.to.branch_id)
                __destinations = await client
                    .db(DB)
                    .collection(`SaleProducts`)
                    .find({ active: true })
                    .toArray();
            let _sources = {};
            __sources.map((item) => {
                _sources[item.product_id] = item;
            });
            let _destinations = {};
            __destinations.map((item) => {
                _destinations[item.product_id] = item;
            });
            let _update_source = [];
            let _list = new Set([]);

            _list.forEach((item) => {
                _update.push(_products[item]);
            });
            await Promise.all(
                _update.map((item) => {
                    client
                        .db(DB)
                        .collection(source)
                        .findOneAndUpdate(
                            { product_id: item.product_id },
                            { $set: item }
                        );
                })
            );
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Delivery Note`,
                name: `Thêm phiếu chuyển hàng mới`,
                data: _delivery.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _delivery.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateDeliveryS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`DeliveryNotes`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (req.body.status == `COMPLETE`) {
        }
        if (req.body.status == `CANCEL`) {
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Delivery`,
                name: `Cập nhật thông tin phiếu chuyển`,
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
    getDeliveryS,
    addDeliveryS,
    updateDeliveryS,
};
