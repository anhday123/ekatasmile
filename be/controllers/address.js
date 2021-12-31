const moment = require(`moment-timezone`);
const crypto = require(`crypto`);
const client = require(`../config/mongodb`);
const DB = process.env.DATABASE;
const { relative } = require('../utils/filter');

let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
    }
    return text;
};

let getWardC = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.ward_code) {
            aggregateQuery.push({ ward_code: String(req.query.ward_code) });
        }
        if (req.query.district_id) {
            aggregateQuery.push({ district_id: Number(req.query.district_id) });
        }
        if (req.query.province_id) {
            aggregateQuery.push({ province_id: Number(req.query.province_id) });
        }
        if (req.query.ward_name) {
            aggregateQuery.push({ slug_ward_name: new RegExp(removeUnicode(req.query.ward_name, true), 'gi') });
        }
        if (req.query.district_name) {
            aggregateQuery.push({ slug_district_name: new RegExp(removeUnicode(req.query.district_name, true), 'gi') });
        }
        if (req.query.province_name) {
            aggregateQuery.push({ slug_province_name: new RegExp(removeUnicode(req.query.province_name, true), 'gi') });
        }
        let wards = await client.db(DB).collection(`Wards`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: wards });
    } catch (err) {
        next(err);
    }
};

let getDistrictC = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.district_id) {
            aggregateQuery.push({ district_id: Number(req.query.district_id) });
        }
        if (req.query.province_id) {
            aggregateQuery.push({ province_id: Number(req.query.province_id) });
        }
        if (req.query.district_name) {
            aggregateQuery.push({ slug_district_name: new RegExp(removeUnicode(req.query.district_name, true), 'gi') });
        }
        if (req.query.province_name) {
            aggregateQuery.push({ slug_province_name: new RegExp(removeUnicode(req.query.province_name, true), 'gi') });
        }
        let districts = await client.db(DB).collection(`Districts`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: districts });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

let getProvinceC = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.province_id) {
            aggregateQuery.push({ province_id: Number(req.query.province_id) });
        }
        if (req.query.province_name) {
            aggregateQuery.push({ slug_province_name: new RegExp(removeUnicode(req.query.province_name, true), 'gi') });
        }
        let provinces = await client.db(DB).collection(`Provinces`).aggregate(aggregateQuery).toArray();
        res.send({ success: true, data: provinces });
    } catch (err) {
        next(err);
    }
};

let getCountryC = async (req, res, next) => {
    try {
        let aggregateQuery = [];
        if (req.query.code) {
            aggregateQuery.push({ code: String(req.query.code) });
        }
        if (req.query.name) {
            aggregateQuery.push({ slug_name: new RegExp(removeUnicode(req.query.name, true), 'gi') });
        }
        let countries = await client.db(DB).collection(`Countries`).aggregate(aggregateQuery).toArray();
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
