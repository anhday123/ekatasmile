"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateBranch = exports.apiFilterCity = exports.apiSearchSelect = exports.apiSearch = exports.addBranch = exports.getAllBranchMain = exports.getAllBranch = void 0;

var _httpClient = require("./httpClient");

var getAllBranch = function getAllBranch(params) {
  return (0, _httpClient.get)('/branch/getbranch', params && params);
};

exports.getAllBranch = getAllBranch;

var getAllBranchMain = function getAllBranchMain() {
  return (0, _httpClient.get)('/branch/getbranch');
};

exports.getAllBranchMain = getAllBranchMain;

var addBranch = function addBranch(object) {
  return (0, _httpClient.post)('/branch/addbranch', object);
};

exports.addBranch = addBranch;

var apiSearch = function apiSearch(object) {
  return (0, _httpClient.get)('/branch/getbranch', object);
};

exports.apiSearch = apiSearch;

var apiSearchSelect = function apiSearchSelect(object) {
  return (0, _httpClient.get)("/branch/getbranch/".concat(object));
};

exports.apiSearchSelect = apiSearchSelect;

var apiFilterCity = function apiFilterCity(object) {
  return (0, _httpClient.get)('/address/getdistrict', object);
};

exports.apiFilterCity = apiFilterCity;

var apiUpdateBranch = function apiUpdateBranch(object, id) {
  return (0, _httpClient.patch)("/branch/updatebranch/".concat(id), object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiUpdateBranch = apiUpdateBranch;