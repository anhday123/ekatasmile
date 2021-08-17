"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _login = _interopRequireDefault(require("./login/login"));

var _store = _interopRequireDefault(require("./store/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rootReducers = (0, _redux.combineReducers)({
  login: _login["default"],
  store: _store["default"]
});
var _default = rootReducers;
exports["default"] = _default;