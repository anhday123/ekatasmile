const moment = require(`moment`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const filter = require(`../utils/filter`);

let getSaleProductC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        let keywordQuery = req.query.keyword;
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id)
            mongoQuery = { ...mongoQuery, product_id: req.query.product_id };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.branch)
            mongoQuery = { ...mongoQuery, branch: req.query.branch };
        if (req.query.barcode)
            mongoQuery = { ...mongoQuery, barcode: req.query.barcode };
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
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._supplier)
            filterQuery = { ...filterQuery, _supplier: req.query._supplier };
        if (req.query._creator)
            filterQuery = { ...filterQuery, _creator: req.query._creator };
        if (req.query._category)
            filterQuery = { ...filterQuery, _category: req.query._category };
        if (req.query.name)
            filterQuery = { ...filterQuery, name: req.query.name };
        if (req.query.sku) filterQuery = { ...filterQuery, sku: req.query.sku };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _products = await client
            .db(DB)
            .collection(`SaleProducts`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _products.reverse();
        let [__users, __warehouses, __categories, __suppliers] =
            await Promise.all([
                client.db(DB).collection(`Users`).find({}).toArray(),
                client.db(DB).collection(`Warehouses`).find({}).toArray(),
                client.db(DB).collection(`Categories`).find({}).toArray(),
                client.db(DB).collection(`Suppliers`).find({}).toArray(),
            ]);
        let _bussiness = {};
        __users.map((item) => {
            _bussiness[item.user_id] = item;
        });
        let _creator = {};
        __users.map((item) => {
            _creator[item.user_id] = item;
        });
        let _categories = {};
        __categories.map((item) => {
            _categories[item.category_id] = item;
        });
        let _suppliers = {};
        __suppliers.map((item) => {
            _suppliers[item.supplier_id] = item;
        });
        _products.map((item) => {
            let _product = item;
            _product.bussiness = { ..._bussiness[_product.bussiness] };
            _product.creator = { ..._creator[_product.creator] };
            _product.category = { ..._categories[_product.category] };
            _product.suppliers = { ..._suppliers[_product.suppliers] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _product[
                `_bussiness`
            ] = `${_product.bussiness?.first_name} ${_product.bussiness?.last_name}`;
            _product[
                `_creator`
            ] = `${_product.creator?.first_name} ${_product.creator?.last_name}`;
            _product[`_category`] = _product.category?.name;
            _product[`_supplier`] = _product.suppliers?.name;
            delete _product.bussiness.password;
            delete _product.creator.password;
            return _product;
        });
        if (keywordQuery)
            _products = filter.keyword(keywordQuery, _products, [`name`]);
        if (filterQuery) _products = filter.relative(filterQuery, _products);
        let __products = [];
        if (req.query.merge == `false`) {
            for (let i in _products) {
                if (!_products[i].has_variable) __products.push(_products[i]);
                else {
                    for (let j in _products[i].variants) {
                        let _image = _products[i].image.concat(
                            _products[i].variants[j].image
                        );
                        let product_tmp = {
                            ..._products[i],
                            ..._products[i].variants[j],
                            image: _image,
                        };
                        delete product_tmp.attributes;
                        delete product_tmp.variants;
                        __products.push(product_tmp);
                    }
                }
            }
        } else {
            for (let i in _products) __products.push(_products[i]);
        }
        let _counts = __products.length;
        if (page && page_size)
            _products = _products.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: __products,
            count: _counts,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = { getSaleProductC };
