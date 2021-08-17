"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorReducer = exports.logoutAction = exports.loginAccessToken = void 0;

var _index = require("./../../consts/index.js");

var loginAccessToken = function loginAccessToken(data) {
  // alert(data)
  // console.log("|||")
  return {
    type: _index.loginAccessTokenConst.LOGIN_ACCESSTOKEN,
    data: data
  };
};

exports.loginAccessToken = loginAccessToken;

var logoutAction = function logoutAction(data) {
  // alert('1223')
  // alert(data)
  // console.log("|||")
  return {
    type: _index.ACTION.LOGOUT,
    data: data
  };
};

exports.logoutAction = logoutAction;

var errorReducer = function errorReducer(data) {
  // alert('1223')
  // alert(data)
  // console.log("|||")
  return {
    type: _index.ACTION.ERROR,
    data: data
  };
};

exports.errorReducer = errorReducer;