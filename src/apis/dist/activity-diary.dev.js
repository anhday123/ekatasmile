"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiSearchActivityDiary = exports.apiAllActivityDiary = void 0;

var _httpClient = require("./httpClient");

var apiAllActivityDiary = function apiAllActivityDiary() {
  return (0, _httpClient.get)('/action/getaction');
};

exports.apiAllActivityDiary = apiAllActivityDiary;

var apiSearchActivityDiary = function apiSearchActivityDiary(object) {
  return (0, _httpClient.get)('/action/getaction', object);
}; // export const getAllUser = () => get('/user/getuser');
// export const getSummary = () => get('/summary')
// export const getChartRevenue = () => get('/summary/chart');
// export const getChartTopSelling = () => get('/summary/topselling');
// export const getChartStatus = () => get('/summary/status');
// export const searchLevel = (object) => get('/level', object)
// export const updateLevel = (body) => post('/level/update', body)
// export const createLevel = (body) => post('/level/create', body)


exports.apiSearchActivityDiary = apiSearchActivityDiary;