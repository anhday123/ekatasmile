"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllPayment = void 0;

var _httpClient = require("./httpClient");

var getAllPayment = function getAllPayment() {
  return (0, _httpClient.get)('/payment/getpayment');
};

exports.getAllPayment = getAllPayment;