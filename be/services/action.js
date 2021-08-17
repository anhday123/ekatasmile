const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getActionS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.bussiness)
            mongoQuery = { ...mongoQuery, bussiness: req.query.bussiness };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.performer)
            mongoQuery = { ...mongoQuery, performer: req.query.performer };
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
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.type)
            filterQuery = { ...filterQuery, type: req.query.type };
        if (req.query.properties)
            filterQuery = { ...filterQuery, properties: req.query.properties };
        if (req.query.name)
            filterQuery = { ...filterQuery, name: req.query.name };
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._performer)
            filterQuery = { ...filterQuery, _performer: req.query._performer };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _actions = await client
            .db(DB)
            .collection(`Actions`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _actions.reverse();
        let [__users] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
        ]);
        let _bussiness = {};
        let _performer = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _performer[item.user_id] = item;
        });
        _actions.map((item) => {
            let _action = item;
            _action.bussiness = { ..._bussiness[_action.bussiness] };
            _action.performer = { ..._performer[_action.performer] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _action[
                `_bussiness`
            ] = `${_action.bussiness?.first_name} ${_action.bussiness?.last_name}`;
            _action[
                `_performer`
            ] = `${_action.performer?.first_name} ${_action.performer?.last_name}`;
            return _action;
        });
        // lọc theo keyword
        if (req.query.keyword) {
            _actions = _actions.filter((_action) => {
                let check = false;
                [`type`, `properties`, `name`, `_performer`].map((key) => {
                    {
                        let value = new String(_action[key])
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
                _actions = _actions.filter((_action) => {
                    let value = new String(_action[filterKey])
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
        let _counts = _actions.length;
        // phân trang
        if (page && page_size)
            _actions = _actions.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _actions,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActionS,
};
