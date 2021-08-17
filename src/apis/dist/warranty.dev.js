"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiAllWarranty = void 0;

var _httpClient = require("./httpClient");

var apiAllWarranty = function apiAllWarranty() {
  return (0, _httpClient.get)('/warranty/getwarranty');
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiAllWarranty = apiAllWarranty;