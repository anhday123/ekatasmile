"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiProvince = exports.apiDistrict = void 0;

var _httpClient = require("./httpClient");

var apiDistrict = function apiDistrict() {
  return (0, _httpClient.get)('/address/getdistrict');
};

exports.apiDistrict = apiDistrict;

var apiProvince = function apiProvince() {
  return (0, _httpClient.get)('/address/getprovince');
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiProvince = apiProvince;