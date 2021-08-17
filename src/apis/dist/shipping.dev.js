"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateShipping = exports.apiSearchShipping = exports.apiAllShipping = exports.apiCreateShipping = void 0;

var _httpClient = require("./httpClient");

var apiCreateShipping = function apiCreateShipping(object) {
  return (0, _httpClient.post)('/transport/addtransport', object);
};

exports.apiCreateShipping = apiCreateShipping;

var apiAllShipping = function apiAllShipping() {
  return (0, _httpClient.get)('/transport/gettransport');
};

exports.apiAllShipping = apiAllShipping;

var apiSearchShipping = function apiSearchShipping(object) {
  return (0, _httpClient.get)('/transport/gettransport', object);
};

exports.apiSearchShipping = apiSearchShipping;

var apiUpdateShipping = function apiUpdateShipping(object, id) {
  return (0, _httpClient.patch)("/transport/updatetransport/".concat(id), object);
}; // export const addBranch = (object) => post('/branch/addbranch', object)
// export const apiSearch = (object) => get('/branch/getbranch', object)
// export const apiUpdateBranch = (object, id) => patch(`/branch/updatebranch?branch_id=${id}`, object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiUpdateShipping = apiUpdateShipping;