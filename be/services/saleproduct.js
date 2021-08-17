const moment = require(`moment`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

let getSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.product_id)
            mongoQuery = { ...mongoQuery, product_id: req.query.product_id };
        if (token)
            mongoQuery = { ...mongoQuery, bussiness: token.bussiness.user_id };
        if (req.query.store)
            mongoQuery = { ...mongoQuery, store: req.query.store };
        if (req.query.branch)
            mongoQuery = { ...mongoQuery, branch: req.query.branch };
        if (req.query.slug)
            mongoQuery = { ...mongoQuery, slug: req.query.slug };
        if (req.query.category)
            mongoQuery = { ...mongoQuery, category: req.query.category };
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
            .collection(`SaleProducts`)
            .find(mongoQuery)
            .toArray();
        // đảo ngược data sau đó gắn data liên quan vào khóa định danh
        _products.reverse();
        let [__users, __stores, __branchs, __categories, __suppliers] =
            await Promise.all([
                client.db(DB).collection(`Users`).find({}).toArray(),
                client.db(DB).collection(`Stores`).find({}).toArray(),
                client.db(DB).collection(`Branchs`).find({}).toArray(),
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
        let _stores = {};
        __stores.map((item) => {
            _stores[item.store_id] = item;
        });
        let _branchs = {};
        __branchs.map((item) => {
            _branchs[item.branch_id] = item;
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
            _product.store = { ..._stores[_product.store] };
            _product.branch = { ..._branchs[_product.branch] };
            _product.category = { ..._categories[_product.category] };
            _product.suppliers = { ..._suppliers[_product.suppliers] };
            // Tạo properties đặc trưng của khóa định danh để lọc với độ chính xác tương đối
            _product[
                `_bussiness`
            ] = `${_product.bussiness?.first_name} ${_product.bussiness?.last_name}`;
            _product[
                `_creator`
            ] = `${_product.creator?.first_name} ${_product.creator?.last_name}`;
            _product[`_store`] = _product.store?.name;
            _product[`_branch`] = _product.branch?.name;
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
                    if (req.query.merge != `false`) {
                        for (let i in _product.variants) {
                            value = new String(_product.variants[i][filterKey])
                                .normalize(`NFD`)
                                .replace(/[\u0300-\u036f]|\s/g, ``)
                                .replace(/đ/g, 'd')
                                .replace(/Đ/g, 'D')
                                .toLocaleLowerCase();
                            if (value.includes(compare)) return true;
                        }
                    }
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
let updateSaleProductS = async (req, res, next) => {
    try {
        let token = req.tokenData?.data;
        await client
            .db(DB)
            .collection(`SaleProducts`)
            .updateMany(req.params, { $set: req.body });
        if (token)
            await client.db(DB).collection(`Actions`).insertOne({
                bussiness: token.bussiness.user_id,
                type: `Update`,
                properties: `SaleProduct`,
                name: `Cập nhật thông tin sản phẩm tại chi nhánh`,
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
    getSaleProductS,
    updateSaleProductS,
};
