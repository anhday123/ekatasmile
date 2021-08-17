"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStore = exports.apiSearch = exports.addStore = exports.getAllStore = void 0;

var _httpClient = require("./httpClient");

var getAllStore = function getAllStore() {
  return (0, _httpClient.get)('/store/getstore');
};

exports.getAllStore = getAllStore;

var addStore = function addStore(object) {
  return (0, _httpClient.post)('/store/addstore', object);
};

exports.addStore = addStore;

var apiSearch = function apiSearch(object) {
  return (0, _httpClient.get)('/store/getstore', object);
};

exports.apiSearch = apiSearch;

var updateStore = function updateStore(object, id) {
  return (0, _httpClient.patch)("/store/updatestore/".concat(id), object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.updateStore = updateStore;