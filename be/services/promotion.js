const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const filter = require(`../utils/filter`);

let getPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.promotion_id)
            mongoQuery = {
                ...mongoQuery,
                promotion_id: req.query.promotion_id,
            };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
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
            filterQuery = { ...filterQuery, type: req.query.type };
        if (req.query.name)
            filterQuery = { ...filterQuery, name: req.query.name };
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
        let _promotions = await client
            .db(DB)
            .collection(`Promotions`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _promotions.reverse();
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
            _branchs[item.user_id] = item;
        });
        _promotions.map((item) => {
            let _promotion = item;
            if (_promotion.limit.branchs)
                _promotion.limit.branchs.map(async (branch) => {
                    let _branch = { ..._branchs[branch] };
                    return _branch;
                });
            _promotion.bussiness = { ..._bussiness[_promotion.bussiness] };
            _promotion.creator = { ..._creator[_promotion.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _promotion[
                `_bussiness`
            ] = `${_promotion.bussiness?.first_name} ${_promotion.bussiness?.last_name}`;
            _promotion[
                `_creator`
            ] = `${_promotion.creator?.first_name} ${_promotion.creator?.last_name}`;
            return _promotion;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _promotions = _promotions.filter((_promotion) => {
                let check = false;
                [`code`, `type`, `name`].map((key) => {
                    {
                        let value = new String(_promotion[key])
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
            filterQuery = Object.entries(filterQuery);
            filterQuery.forEach(([filterKey, filterValue]) => {
                _promotions = _promotions.filter((_promotion) => {
                    let value = new String(_promotion[filterKey])
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
        // đếm số phần tử
        let _counts = _promotions.length;
        // phân trang
        if (page && page_size)
            _promotions = _promotions.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _promotions,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addPromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _promotion = await client
            .db(DB)
            .collection(`Promotions`)
            .insertOne(req._promotion);
        if (!_promotion.insertedId)
            throw new Error(`500 ~ Create promotion fail!`);
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Promotion`,
                name: `Thêm chương trình khuyến mãi mới`,
                data: _promotion.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _promotion.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updatePromotionS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Promotions`)
            .updateMany(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Promotion`,
                name: `Cập nhật thông tin chương trình khuyến mãi`,
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
    getPromotionS,
    addPromotionS,
    updatePromotionS,
};
