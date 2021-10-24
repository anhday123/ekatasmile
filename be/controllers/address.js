const moment = require(`moment-timezone`);
const { ObjectId } = require('mongodb');
const crypto = require(`crypto`);
const client = require(`../config/mongo/mongodb`);
const DB = process.env.DATABASE;
const { createTimeline } = require('../utils/date-handle');
const { createRegExpQuery } = require('../utils/regex');

let getWardC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.ward_code) {
            matchQuery['ward_code'] = req.query.ward_code;
        }
        if (req.query.district_id) {
            mongoQuery['district_id'] = parseInt(req.query.district_id);
        }
        if (req.query.province_id) {
            mongoQuery['province_id'] = parseInt(req.query.province_id);
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.ward_name) {
            matchQuery['ward_name'] = createRegExpQuery(req.query.ward_name);
        }
        if (req.query.district_name) {
            matchQuery['district_name'] = createRegExpQuery(req.query.district_name);
        }
        if (req.query.province_name) {
            matchQuery['province_name'] = createRegExpQuery(req.query.province_name);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let wards = await client.db(DB).collection(`Wards`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: wards });
    } catch (err) {
        next(err);
    }
};

let getDistrictC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.district_id) {
            mongoQuery['district_id'] = parseInt(req.query.district_id);
        }
        if (req.query.province_id) {
            mongoQuery['province_id'] = parseInt(req.query.province_id);
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.district_name) {
            matchQuery['district_name'] = createRegExpQuery(req.query.district_name);
        }
        if (req.query.province_name) {
            matchQuery['province_name'] = createRegExpQuery(req.query.province_name);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let districts = await client.db(DB).collection(`Districts`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: districts });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let getProvinceC = async (req, res, next) => {
    try {
        let token = req.tokenData.data;
        let matchQuery = {};
        let projectQuery = {};
        let aggregateQuery = [];
        // lấy các thuộc tính tìm kiếm cần độ chính xác cao ('1' == '1', '1' != '12',...)
        if (req.query.district_id) {
            mongoQuery['district_id'] = parseInt(req.query.district_id);
        }
        if (req.query.province_id) {
            mongoQuery['province_id'] = parseInt(req.query.province_id);
        }
        // lấy các thuộc tính tìm kiếm với độ chính xác tương đối ('1' == '1', '1' == '12',...)
        if (req.query.district_name) {
            matchQuery['district_name'] = createRegExpQuery(req.query.district_name);
        }
        if (req.query.province_name) {
            matchQuery['province_name'] = createRegExpQuery(req.query.province_name);
        }
        aggregateQuery.push({ $match: matchQuery });
        // lấy data từ database
        let provinces = await client.db(DB).collection(`Provinces`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: provinces });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getWardC,
    getDistrictC,
    getProvinceC,
};
