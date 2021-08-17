const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.category_id)
            mongoQuery = { ...mongoQuery, category_id: req.query.category_id };
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
        var _categories = await client
            .db(DB)
            .collection(`Categories`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _categories.reverse();
        let [__users] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        _categories.map((item) => {
            let _category = item;
            _category.bussiness = { ..._bussiness[_category.bussiness] };
            _category.creator = { ..._creator[_category.creator] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _category[
                `_bussiness`
            ] = `${_category.bussiness?.first_name} ${_category.bussiness?.last_name}`;
            _category[
                `_creator`
            ] = `${_category.creator?.first_name} ${_category.creator?.last_name}`;
            return _category;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _categories = _categories.filter((_category) => {
                let check = false;
                [`code`, `type`, `name`].map((key) => {
                    {
                        let value = new String(_category[key])
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
                    _categories = _categories.filter((_category) => {
                        let value = new String(_category[filterKey])
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
        let _counts = _categories.length;
        // phân trang
        if (page && page_size)
            _categories = _categories.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _categories,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        let _category = await client
            .db(DB)
            .collection(`Categories`)
            .insertOne(req._category);
        if (!_category.insertedId)
            throw new Error(`500 ~ Create category fail!`);
        if (req.body.product_list) {
            await Promise.all(
                req.body.product_list.map((item) => {
                    client
                        .db(DB)
                        .collection(`Products`)
                        .findOneAndUpdate(
                            { product_id: item },
                            { $set: { category: req._category.category_id } }
                        );
                })
            );
        }
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Add`,
                properties: `Category`,
                name: `Thêm loại sản phẩm mới`,
                data: _category.ops[0],
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: _category.ops[0] });
    } catch (err) {
        next(err);
    }
};

let updateCategoryS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Categories`)
            .findOneAndUpdate(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Category`,
                name: `Cập nhật thông tin phân loại sản phẩm`,
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
    addCategoryS,
    getCategoryS,
    updateCategoryS,
};
