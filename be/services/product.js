const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const filter = require(`../utils/filter`);

let getProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id)
            mongoQuery = { ...mongoQuery, product_id: req.query.product_id };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.warehouse)
            mongoQuery = { ...mongoQuery, warehouse: req.query.warehouse };
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
        if (req.query.sku) filterQuery = { ...filterQuery, sku: req.query.sku };
        if (req.query.name)
            filterQuery = { ...filterQuery, name: req.query.name };
        if (req.query.status)
            filterQuery = { ...filterQuery, status: req.query.status };
        if (req.query._bussiness)
            filterQuery = { ...filterQuery, _bussiness: req.query._bussiness };
        if (req.query._supplier)
            filterQuery = { ...filterQuery, _supplier: req.query._supplier };
        if (req.query._creator)
            filterQuery = { ...filterQuery, _creator: req.query._creator };
        if (req.query._category)
            filterQuery = { ...filterQuery, _category: req.query._category };
        // lấy các thuộc tính tùy chọn khác
        let [page, page_size] = [
            req.query.page || 1,
            req.query.page_size || 50,
        ];
        // lấy data từ database
        let _products = await client
            .db(DB)
            .collection(`Products`)
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
        let _creator = {};
        __users.map((item) => {
            delete item.password;
            _bussiness[item.user_id] = item;
            _creator[item.user_id] = item;
        });
        let _warehouses = {};
        __warehouses.map((item) => {
            _warehouses[item.warehouse_id] = item;
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
            _product.warehouse = { ..._warehouses[_product.warehouse] };
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
            return _product;
        });
        // tách variant thành các phần tử riêng nếu merge là false
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
                        product_tmp[`category`] = _products[i].category;
                        product_tmp[`_category`] = _products[i]._category;
                        product_tmp[`has_variable`] = false;
                        delete product_tmp.attributes;
                        product_tmp.variants = [];
                        __products.push(product_tmp);
                    }
                }
            }
        } else {
            for (let i in _products) __products.push(_products[i]);
        }
        _products = __products;
        // lọc theo keyword
        if (req.query.keyword) {
            _products = _products.filter((_product) => {
                let check = false;
                [`code`, `sku`, `name`].map((key) => {
                    {
                        let value = new String(_product[key])
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
                _products = _products.filter((_product) => {
                    let value = new String(_product[filterKey])
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

        let _counts = _products.length;
        if (page && page_size)
            _products = _products.slice(
                Number((page - 1) * page_size),
                Number((page - 1) * page_size) + Number(page_size)
            );
        res.send({
            success: true,
            data: _products,
            count: _counts,
        });
    } catch (err) {
        next(err);
    }
};

let addProductS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        if (req._product.length != 0) {
            let _product = await client
                .db(DB)
                .collection(`Products`)
                .insertMany(req._product);
            if (!_product.insertedIds)
                throw new Error(`500 ~ Create product fail!`);
        }
        if (req._update.length != 0) {
            await Promise.all(
                req._update.map((item) => {
                    client
                        .db(DB)
                        .collection(`Products`)
                        .findOneAndUpdate(
                            { product_id: item.product_id },
                            { $set: item }
                        );
                })
            );
        }
        if (token) {
            if (req._product.length != 0)
                await client.db(DB).collection(`Actions`).insertOne({
                    bussiness: token.bussiness.user_id,
                    type: `Add`,
                    properties: `Product`,
                    name: `Thêm sản phẩm mới`,
                    data: req._product,
                    performer: token.user_id,
                    date: moment().format(),
                });
            if (req._update.length != 0)
                await client.db(DB).collection(`Actions`).insertOne({
                    bussiness: token.bussiness.user_id,
                    type: `Update`,
                    properties: `Product`,
                    name: `Cập nhật thông tin sản phẩm`,
                    data: req._update,
                    performer: token.user_id,
                    date: moment().format(),
                });
        }
        res.send({
            success: true,
            data: [
                { name: `insert_product`, product: req._product },
                { name: `update_product`, product: req._update },
            ],
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let updateProductS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`Products`)
            .updateMany(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `Product`,
                name: `Cập nhật thông tin sản phẩm`,
                data: req.body,
                performer: token.user_id,
                date: moment().format(),
            });
        res.send({ success: true, data: req.body });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    getProductS,
    addProductS,
    updateProductS,
};
