const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { relative } = require('../utils/filter');

let getWardC = async (req, res, next) => {
    try {
        let matchQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.ward_code) {
            matchQuery['ward_code'] = String(req.query.ward_code);
        }
        if (req.query.district_id) {
            matchQuery['district_id'] = Number(req.query.district_id);
        }
        if (req.query.province_id) {
            matchQuery['province_id'] = Number(req.query.province_id);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let wards = await client.db(DB).collection(`Wards`).aggregate(aggregateQuery).toArray();
        wards = relative(
            {
                ...(() => {
                    let result = {};
                    if (req.query.ward_name) {
                        result = { ...result, ...{ ward_name: req.query.ward_name } };
                    }
                    if (req.query.district_name) {
                        result = { ...result, ...{ district_name: req.query.district_name } };
                    }
                    if (req.query.province_name) {
                        result = { ...result, ...{ province_name: req.query.province_name } };
                    }
                    console.log(result);
                    return result;
                })(),
            },
            wards
        );
        res.send({ success: true, data: wards });
    } catch (err) {
        next(err);
    }
};

let getDistrictC = async (req, res, next) => {
    try {
        let matchQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.district_id) {
            matchQuery['district_id'] = Number(req.query.district_id);
        }
        if (req.query.province_id) {
            matchQuery['province_id'] = Number(req.query.province_id);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let districts = await client.db(DB).collection(`Districts`).aggregate(aggregateQuery).toArray();
        districts = relative(
            {
                ...(() => {
                    let result = {};
                    if (req.query.district_name) {
                        result = { ...result, ...{ district_name: req.query.district_name } };
                    }
                    if (req.query.province_name) {
                        result = { ...result, ...{ province_name: req.query.province_name } };
                    }
                    return result;
                })(),
            },
            districts
        );
        res.send({ success: true, data: districts });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let getProvinceC = async (req, res, next) => {
    try {
        let matchQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.province_id) {
            matchQuery['province_id'] = Number(req.query.province_id);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let provinces = await client.db(DB).collection(`Provinces`).aggregate(aggregateQuery).toArray();
        provinces = relative(
            {
                ...(() => {
                    let result = {};
                    if (req.query.province_name) {
                        result = { ...result, ...{ province_name: req.query.province_name } };
                    }
                    return result;
                })(),
            },
            provinces
        );
        res.send({ success: true, data: provinces });
    } catch (err) {
        next(err);
    }
};

let getCountryC = async (req, res, next) => {
    try {
        let matchQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.code) {
            matchQuery['code'] = String(req.query.code).trim().toUpperCase();
        }
        aggregateQuery.push({ $match: matchQuery });
        aggregateQuery.push({ $sort: { priority: -1 } })
        // lấy data từ database
        let countries = await client.db(DB).collection(`Countries`).aggregate(aggregateQuery).toArray();
        countries = relative(
            {
                ...(() => {
                    let result = {};
                    if (req.query.name) {
                        result = { ...result, ...{ name: req.query.name } };
                    }
                    return result;
                })(),
            },
            countries
        );
        res.send({ success: true, data: countries });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWardC,
    getDistrictC,
    getProvinceC,
    getCountryC,
};
