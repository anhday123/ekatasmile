"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCustomer = exports.addCustomer = exports.getAllCustomer = exports.getCustomer = void 0;

var _httpClient = require("./httpClient");

var getCustomer = function getCustomer(params) {
  return (0, _httpClient.get)('/customer/getcustomer', params && params);
};

exports.getCustomer = getCustomer;

var getAllCustomer = function getAllCustomer() {
  return (0, _httpClient.get)('/customer/getcustomer');
};

exports.getAllCustomer = getAllCustomer;

var addCustomer = function addCustomer(data) {
  return (0, _httpClient.post)('/customer/addcustomer', data);
};

exports.addCustomer = addCustomer;

var updateCustomer = function updateCustomer(data) {
  return (0, _httpClient.patch)('/customer/updatecustomer', data);
};

exports.updateCustomer = updateCustomer;