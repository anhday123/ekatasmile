"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("./../../../consts/index");

var _reactJwt = require("react-jwt");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// nhận data từ server
var initialState = {
  dataUser: {},
  loading: false,
  username: '',
  objectUsername: {}
};

var login = function login() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _index.loginAccessTokenConst.LOGIN_ACCESSTOKEN:
      {
        var data = (0, _reactJwt.decodeToken)(action.data.accessToken);
        console.log(data);
        console.log("|||999");

        if (data) {
          localStorage.setItem('accessToken', action.data.accessToken);
          localStorage.setItem('refreshToken', action.data.refreshToken);
          localStorage.setItem('username', action.data.username);
          localStorage.setItem('permission_list', JSON.stringify(action.data.role.permission_list));
          localStorage.setItem('menu_list', JSON.stringify(action.data.role.menu_list));
          localStorage.setItem('branch_id', JSON.stringify(data)); // if (action.data.user) var { username, role, balance } = action.data.user
          // if (username) localStorage.setItem('username', username)
          // var { balance, username, role } = data
          // if (balance) localStorage.setItem('balance', JSON.stringify(balance))
          // if (username) localStorage.setItem('username', JSON.stringify(username))
          // if (role) localStorage.setItem('role', JSON.stringify(role))
        }

        return _objectSpread({}, state, {
          dataUser: (0, _reactJwt.decodeToken)(action.data.accessToken),
          username: action.data.username,
          objectUsername: data.data
        });
      }

    case _index.ACTION.LOGOUT:
      {
        localStorage.clear();
        return _objectSpread({}, state, {
          dataUser: {}
        });
      }

    case _index.ACTION.LOADING:
      {
        state.loading = action.data;
        return state;
      }

    default:
      return state;
  }
};

var _default = login;
exports["default"] = _default;