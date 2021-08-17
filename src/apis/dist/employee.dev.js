"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiFilterRoleEmployee = exports.apiAllEmployee = exports.apiUpdateEmployee = void 0;

var _httpClient = require("./httpClient");

var apiUpdateEmployee = function apiUpdateEmployee(object) {
  return (0, _httpClient.post)('/user/adduser', object);
};

exports.apiUpdateEmployee = apiUpdateEmployee;

var apiAllEmployee = function apiAllEmployee() {
  return (0, _httpClient.get)('/user/getuser');
};

exports.apiAllEmployee = apiAllEmployee;

var apiFilterRoleEmployee = function apiFilterRoleEmployee(object) {
  return (0, _httpClient.get)('/user/getuser', object);
}; // export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiFilterRoleEmployee = apiFilterRoleEmployee;