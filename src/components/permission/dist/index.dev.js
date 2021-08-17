"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _utils = require("utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Permission = function Permission(_ref) {
  var permissions = _ref.permissions,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["permissions", "children"]);

  try {
    var context = localStorage.getItem('accessToken') && (0, _utils.decodeJWT)(localStorage.getItem('accessToken'));

    if (!context) {
      return null;
    }

    if (!permissions || permissions.length === 0 || permissions.filter(function (p) {
      return context.permission.includes(p);
    }).length) {
      return _react["default"].cloneElement(children, props);
    }

    return null;
  } catch (error) {
    return null;
  }
};

var _default = Permission;
exports["default"] = _default;