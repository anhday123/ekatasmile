"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.apiSearch = exports.apiAllRole = exports.apiAllUser = exports.apiCreateUserMenu = exports.apiAddUser = void 0;

var _httpClient = require("./httpClient");

var apiAddUser = function apiAddUser(object) {
  return (0, _httpClient.post)('/user/getuser', object);
};

exports.apiAddUser = apiAddUser;

var apiCreateUserMenu = function apiCreateUserMenu(object) {
  return (0, _httpClient.post)('/user/adduser', object);
};

exports.apiCreateUserMenu = apiCreateUserMenu;

var apiAllUser = function apiAllUser() {
  return (0, _httpClient.get)('/user/getuser');
};

exports.apiAllUser = apiAllUser;

var apiAllRole = function apiAllRole() {
  return (0, _httpClient.get)('/role/getrole');
};

exports.apiAllRole = apiAllRole;

var apiSearch = function apiSearch(object) {
  return (0, _httpClient.get)('/user/getuser', object);
};

exports.apiSearch = apiSearch;

var updateUser = function updateUser(object, id) {
  return (0, _httpClient.patch)("/user/updateuser/".concat(id), object);
}; // export const apiAddSupplier = (object) => post('/supplier/addsupplier', object);
// export const apiAllSupplier = () => get('/supplier/getsupplier');
// export const addStore = (object) => post('/store/addstore', object)
// export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.updateUser = updateUser;