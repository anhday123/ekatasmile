"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateInventory = exports.apiSearch = exports.apiAllInventory = exports.apiAddInventory = void 0;

var _httpClient = require("./httpClient");

var apiAddInventory = function apiAddInventory(object) {
  return (0, _httpClient.post)('/warehouse/addwarehouse', object);
};

exports.apiAddInventory = apiAddInventory;

var apiAllInventory = function apiAllInventory() {
  return (0, _httpClient.get)('/warehouse/getwarehouse');
};

exports.apiAllInventory = apiAllInventory;

var apiSearch = function apiSearch(object) {
  return (0, _httpClient.get)('/warehouse/getwarehouse', object);
};

exports.apiSearch = apiSearch;

var apiUpdateInventory = function apiUpdateInventory(object, id) {
  return (0, _httpClient.patch)("/warehouse/updatewarehouse?warehouse_id=".concat(id), object);
};

exports.apiUpdateInventory = apiUpdateInventory;