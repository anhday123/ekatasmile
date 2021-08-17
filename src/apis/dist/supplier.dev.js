"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateSupplier = exports.apiSearch = exports.apiAllSupplier = exports.apiAddSupplier = void 0;

var _httpClient = require("./httpClient");

var apiAddSupplier = function apiAddSupplier(object) {
  return (0, _httpClient.post)('/supplier/addsupplier', object);
};

exports.apiAddSupplier = apiAddSupplier;

var apiAllSupplier = function apiAllSupplier() {
  return (0, _httpClient.get)('/supplier/getsupplier');
};

exports.apiAllSupplier = apiAllSupplier;

var apiSearch = function apiSearch(object) {
  return (0, _httpClient.get)('/supplier/getsupplier', object);
};

exports.apiSearch = apiSearch;

var apiUpdateSupplier = function apiUpdateSupplier(object, id) {
  return (0, _httpClient.patch)("/supplier/updatesupplier/".concat(id), object);
}; // export const addStore = (object) => post('/store/addstore', object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiUpdateSupplier = apiUpdateSupplier;