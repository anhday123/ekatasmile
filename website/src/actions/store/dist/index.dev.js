"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStoreSelectValue = exports.getStore = void 0;

var _index = require("../../consts/index.js");

var getStore = function getStore(data) {
  // alert('1223')
  // alert(data)
  // console.log("|||")
  return {
    type: _index.ACTION.GET_STORE,
    data: data
  };
};

exports.getStore = getStore;

var getStoreSelectValue = function getStoreSelectValue(data) {
  // alert('1223')
  // alert(data)
  // console.log("|||")
  return {
    type: _index.ACTION.SELECT_VALUE,
    data: data
  };
};

exports.getStoreSelectValue = getStoreSelectValue;