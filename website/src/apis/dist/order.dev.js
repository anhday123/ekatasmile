"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiAllOrder = exports.apiOrderVoucher = exports.apiOrderPromotion = exports.getAllBranch = void 0;

var _httpClient = require("./httpClient");

var getAllBranch = function getAllBranch(params) {
  return (0, _httpClient.get)('/branch/getbranch', params && params);
};

exports.getAllBranch = getAllBranch;

var apiOrderPromotion = function apiOrderPromotion(object) {
  return (0, _httpClient.post)('/order/order', object);
};

exports.apiOrderPromotion = apiOrderPromotion;

var apiOrderVoucher = function apiOrderVoucher(object) {
  return (0, _httpClient.post)('/order/addorder', object);
};

exports.apiOrderVoucher = apiOrderVoucher;

var apiAllOrder = function apiAllOrder(object) {
  return (0, _httpClient.get)('/order/getorder', object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiAllOrder = apiAllOrder;