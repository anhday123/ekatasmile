"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiUpdateRole = exports.apiAddRole = exports.apiAllMenu = exports.apiUpdateRolePermission = exports.apiAllRolePermission = exports.apiAllRole = void 0;

var _httpClient = require("./httpClient");

var apiAllRole = function apiAllRole() {
  return (0, _httpClient.get)('/permission/getpermission');
};

exports.apiAllRole = apiAllRole;

var apiAllRolePermission = function apiAllRolePermission() {
  return (0, _httpClient.get)('/role/getrole');
};

exports.apiAllRolePermission = apiAllRolePermission;

var apiUpdateRolePermission = function apiUpdateRolePermission(object, id) {
  return (0, _httpClient.patch)("/role/updaterole/".concat(id), object);
};

exports.apiUpdateRolePermission = apiUpdateRolePermission;

var apiAllMenu = function apiAllMenu() {
  return (0, _httpClient.get)('/permission/getmenu');
};

exports.apiAllMenu = apiAllMenu;

var apiAddRole = function apiAddRole(object) {
  return (0, _httpClient.post)('/role/addrole', object);
};

exports.apiAddRole = apiAddRole;

var apiUpdateRole = function apiUpdateRole(object, id) {
  return (0, _httpClient.patch)("/role/updaterole/".concat(id), object);
};

exports.apiUpdateRole = apiUpdateRole;