"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateTax = exports.apiSearchTax = exports.apiAllTax = exports.apiAddTax = void 0;

var _httpClient = require("./httpClient");

var apiAddTax = function apiAddTax(object) {
  return (0, _httpClient.post)('/tax/addtax', object);
};

exports.apiAddTax = apiAddTax;

var apiAllTax = function apiAllTax() {
  return (0, _httpClient.get)('/tax/gettax');
};

exports.apiAllTax = apiAllTax;

var apiSearchTax = function apiSearchTax(object) {
  return (0, _httpClient.get)('/tax/gettax', object);
};

exports.apiSearchTax = apiSearchTax;

var apiUpdateTax = function apiUpdateTax(object, id) {
  return (0, _httpClient.patch)("/tax/updatetax?tax_id=".concat(id), object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiUpdateTax = apiUpdateTax;