const moment = require(`moment-timezone`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let removeUnicode = (str) => {
    return str
        .normalize(`NFD`)
        .replace(/[\u0300-\u036f]|\s/g, ``)
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

let getSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id) {
            mongoQuery['product_id'] = req.query.product_id;
        }
        if (token) {
            mongoQuery['business_id'] = token.business_id;
        }
        if (req.query.business_id) {
            mongoQuery['business_id'] = req.query.business_id;
        }
        if (req.query.creator_id) {
            mongoQuery['creator_id'] = req.query.creator_id;
        }
        if (req.query.store_id) {
            mongoQuery['store_id'] = req.query.store_id;
        }
        if (req.query.category_id) {
            mongoQuery['category_id'] = req.query.category_id;
        }
        if (req.query.supplier_id) {
            mongoQuery['supplier_id'] = req.query.supplier_id;
        }
        if (req.query.has_variable && req.query.has_variable.toLocaleLowerCase() == 'true') {
            mongoQuery['has_variable'] = true;
        }
        if (req.query.has_variable && req.query.has_variable.toLocaleLowerCase() == 'false') {
            mongoQuery['has_variable'] = false;
        }
        if (req.query.today != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).format(`YYYY-MM-DD`);
        }
        if (req.query.yesterday != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment.tz(`Asia/Ho_Chi_Minh`).add(-1, `days`).format(`YYYY-MM-DD`);
        }
        if (req.query.this_week != undefined) {
            req.query[`from_date`] = moment.tz(`Asia/Ho_Chi_Minh`).isoWeekday(1).format(`YYYY-MM-DD`);
        }
        if (req.query.last_week != undefined) {
            req.query[`from_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(1 - 7)
                .format(`YYYY-MM-DD`);
            req.query[`to_date`] = moment
                .tz(`Asia/Ho_Chi_Minh`)
                .isoWeekday(7 - 7)
                .format(`YYYY-MM-DD`);
        }
        if (req.query.this_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).format(`MM`)) +
                `-` +
                String(`01`);
        }
        if (req.query.last_month != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`YYYY`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).format(`MM`)) +
                `-` +
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `months`).daysInMonth());
        }
        if (req.query.this_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
        }
        if (req.query.last_year != undefined) {
            req.query[`from_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`01`) +
                `-` +
                String(`01`);
            req.query[`to_date`] =
                String(moment().tz(`Asia/Ho_Chi_Minh`).add(-1, `years`).format(`YYYY`)) +
                `-` +
                String(`12`) +
                `-` +
                String(`31`);
        }
        if (req.query.from_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $gte: req.query.from_date,
            };
        }
        if (req.query.to_date) {
            mongoQuery[`create_date`] = {
                ...mongoQuery[`create_date`],
                $lte: moment(req.query.to_date).add(1, `days`).format(),
            };
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.sku) filterQuery = { ...filterQuery, sku: req.query.sku };
        if (req.query.name) filterQuery = { ...filterQuery, name: req.query.name };
        if (req.query.status) filterQuery = { ...filterQuery, status: req.query.status };
        // lấy các thuộc tính tùy chọn khác
        let page = Number(req.query.page) || 1;
        let page_size = Number(req.query.page_size) || 50;
        // lấy data từ database
        let _products = await client.db(DB).collection(`Products`).find(mongoQuery).toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _products.reverse();
        let [__users, __stores, __categories, __suppliers] = await Promise.all([
            client.db(DB).collection(`Users`).find({}).toArray(),
            client.db(DB).collection(`Stores`).find({}).toArray(),
            client.db(DB).collection(`Categories`).find({}).toArray(),
            client.db(DB).collection(`Suppliers`).find({}).toArray(),
        ]);
        let _business = {};
        let _creator = {};
        __users.map((__user) => {
            delete __user.password;
            _business[__user.user_id] = __user;
            _creator[__user.user_id] = __user;
        });
        let _stores = {};
        __stores.map((__store) => {
            _stores[__store.store_id] = __store;
        });
        let _categories = {};
        __categories.map((__categorie) => {
            _categories[__categorie.category_id] = __categorie;
        });
        let _suppliers = {};
        __suppliers.map((__supplier) => {
            _suppliers[__supplier.supplier_id] = __supplier;
        });
        _products.map((_product) => {
            _product[`_business`] = _business[_product.business_id];
            _product[`_creator`] = _creator[_product.creator_id];
            _product[`_branch`] = _stores[_product.store_id];
            _product[`_category`] = _categories[_product.category_id];
            _product[`_supplier`] = _suppliers[_product.supplier_id];
            return _product;
        });
        // tách variant thành các phần tử riêng nếu merge là false
        let __products = [];
        if (req.query.merge == `false`) {
            _products = _products.map((_product) => {
                if (_product.has_variable) {
                    _product.variants = _product.variants.map((variant) => {
                        let _image = [..._product.image];
                        _image.push(variant.image);
                        let product_tmp = {
                            ..._product,
                            ...variant,
                            image: _image,
                        };
                        product_tmp[`has_variable`] = false;
                        product_tmp.attributes = [];
                        product_tmp.variants = [];
                        __products.push(product_tmp);
                    });
                } else {
                    __products.push(_product);
                }
            });
        } else {
            _products.map((_product) => {
                __products.push(_product);
            });
        }
        _products = __products;
        // lọc theo keyword
        if (req.query.search) {
            _products = _products.filter((_product) => {
                let check = false;
                [`code`, `sku`, `name`].map((key) => {
                    {
                        let value = removeUnicode(String(_product[key])).toLocaleLowerCase();
                        let compare = removeUnicode(String(req.query.search)).toLocaleLowerCase();
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
                _products = _products.filter((_product) => {
                    let value = removeUnicode(String(_product[filterKey])).toLocaleLowerCase();
                    let compare = removeUnicode(String(filterValue)).toLocaleLowerCase();
                    return value.includes(compare);
                });
            });
        }
        // đếm số phần tử
        let _counts = _products.length;
        // phân trang
        if (page && page_size) {
            _products = _products.slice((page - 1) * page_size, (page - 1) * page_size + page_size);
        }
        res.send({
            success: true,
            data: _products,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let updateSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        await client.db(DB).collection(`SaleProducts`).updateMany(req.params, { $set: req._update });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                business_id: token.business_id,
                type: `Update`,
                properties: `SaleProduct`,
                name: `Cập nhật thông tin sản phẩm tại cửa hàng`,
                data: req._update,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req._update });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSaleProductS,
    updateSaleProductS,
};
