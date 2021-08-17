"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateCategory = exports.apiAddCategory = exports.apiAllCategorySearch = exports.apiAllCategory = void 0;

var _httpClient = require("./httpClient");

var apiAllCategory = function apiAllCategory() {
  return (0, _httpClient.get)('/category/getcategory');
};

exports.apiAllCategory = apiAllCategory;

var apiAllCategorySearch = function apiAllCategorySearch(object) {
  return (0, _httpClient.get)('/category/getcategory', object);
};

exports.apiAllCategorySearch = apiAllCategorySearch;

var apiAddCategory = function apiAddCategory(object) {
  return (0, _httpClient.post)('/category/addcategory', object);
};

exports.apiAddCategory = apiAddCategory;

var apiUpdateCategory = function apiUpdateCategory(object, id) {
  return (0, _httpClient.patch)("/category/updatecategory/".concat(id), object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiUpdateCategory = apiUpdateCategory;