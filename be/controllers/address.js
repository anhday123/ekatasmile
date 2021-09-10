const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;

const valid = require(`../middleware/validate/validate`);
const form = require(`../middleware/validate/address`);
const filter = require(`../utils/filter`);

let getWardC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getWard)) throw new Error(`400 ~ Validate data wrong!`);
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.ward_code) mongoQuery = { ...mongoQuery, ward_code: req.query.ward_code };
        if (req.query.district_id)
            mongoQuery = { ...mongoQuery, district_id: parseInt(req.query.district_id) };
        if (req.query.province_id)
            mongoQuery = { ...mongoQuery, province_id: parseInt(req.query.province_id) };
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.ward_name) filterQuery = { ...filterQuery, ward_name: req.query.ward_name };
        if (req.query.district_name) filterQuery = { ...filterQuery, district_name: req.query.district_name };
        if (req.query.province_name) filterQuery = { ...filterQuery, province_name: req.query.province_name };
        // lấy data từ database
        let _wards = await client.db(DB).collection(`Wards`).find(mongoQuery).toArray();
        // lọc theo search
        if (req.query.search) {
            _wards = _wards.filter((_ward) => {
                let check = false;
                [`ward_name`, `district_name`, `province_name`].map((key) => {
                    {
                        let value = new String(_ward[key])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(req.query.search)
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
                _wards = _wards.filter((_ward) => {
                    let value = new String(_ward[filterKey])
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
        res.send({ success: true, data: _wards });
    } catch (err) {
        next(err);
    }
};

let getDistrictC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getDistrict)) throw new Error(`400 ~ Validate data wrong!`);
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.district_id)
            mongoQuery = {
                ...mongoQuery,
                district_id: parseInt(req.query.district_id),
            };
        if (req.query.province_id)
            mongoQuery = {
                ...mongoQuery,
                province_id: parseInt(req.query.province_id),
            };
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.district_name)
            filterQuery = {
                ...filterQuery,
                district_name: req.query.district_name,
            };
        if (req.query.province_name)
            filterQuery = {
                ...filterQuery,
                province_name: req.query.province_name,
            };
        // lấy data từ database
        let _districts = await client.db(DB).collection(`Districts`).find(mongoQuery).toArray();
        // lọc theo search
        if (req.query.search) {
            _districts = _districts.filter((_district) => {
                let check = false;
                [`district_name`, `province_name`].map((key) => {
                    {
                        let value = new String(_district[key])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(req.query.search)
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
                _districts = _districts.filter((_district) => {
                    let value = new String(_district[filterKey])
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
        res.send({ success: true, data: _districts });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let getProvinceC = async (req, res, next) => {
    try {
        if (!valid.relative(req.query, form.getProvince)) throw new Error(`400 ~ Validate data wrong!`);
        let mongoQuery = {};
        let filterQuery = {};
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.district_id)
            mongoQuery = {
                ...mongoQuery,
                district_id: parseInt(req.query.district_id),
            };
        if (req.query.province_id)
            mongoQuery = {
                ...mongoQuery,
                province_id: parseInt(req.query.province_id),
            };
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.district_name)
            filterQuery = {
                ...filterQuery,
                district_name: req.query.district_name,
            };
        if (req.query.province_name)
            filterQuery = {
                ...filterQuery,
                province_name: req.query.province_name,
            };
        // lấy data từ database
        let _provinces = await client.db(DB).collection(`Provinces`).find(mongoQuery).toArray();
        // lọc theo search
        if (req.query.search) {
            _provinces = _provinces.filter((_province) => {
                let check = false;
                [`province_name`].map((key) => {
                    {
                        let value = new String(_province[key])
                            .normalize(`NFD`)
                            .replace(/[\u0300-\u036f]|\s/g, ``)
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D')
                            .toLocaleLowerCase();
                        let compare = new String(req.query.search)
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
                _provinces = _provinces.filter((_province) => {
                    let value = new String(_province[filterKey])
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
        res.send({ success: true, data: _provinces });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWardC,
    getDistrictC,
    getProvinceC,
};
