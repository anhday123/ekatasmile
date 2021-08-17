"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroy = exports.patch = exports.post = exports.get = exports.FetchAPI = exports.getNewToken = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _antd = require("antd");

var _querystring = require("querystring");

var _reactJwt = require("react-jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import { decodeToken } from 'utils'
// const token = localStorage.getItem('refreshToken');
// const { decodeToken, isExpired } = useJwt(token);
var getNewToken = function getNewToken() {
  if ((0, _reactJwt.decodeToken)(localStorage.getItem('refreshToken')).exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired!');
  }

  try {
    return (0, _axios["default"])({
      url: (process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_DEV) + '/authorization/login',
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      data: {
        refreshToken: localStorage.getItem('refreshToken')
      }
    });
  } catch (error) {
    throw new Error('Token expired!');
  }
};

exports.getNewToken = getNewToken;

var FetchAPI = function FetchAPI(path, method, headers, body) {
  var endpoint,
      payloadAccessToken,
      response,
      defaultHeaders,
      _args = arguments;
  return regeneratorRuntime.async(function FetchAPI$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          endpoint = _args.length > 4 && _args[4] !== undefined ? _args[4] : process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_DEV;

          if (!(!headers || !headers.Authorization)) {
            _context.next = 17;
            break;
          }

          payloadAccessToken = (0, _reactJwt.decodeToken)(localStorage.getItem('accessToken'));

          if (!(payloadAccessToken && payloadAccessToken.exp < Math.floor(Date.now() / 1000) + 5 * 60)) {
            _context.next = 17;
            break;
          }

          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(getNewToken());

        case 7:
          response = _context.sent;

          if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
          }

          _context.next = 17;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          localStorage.clear();

          _antd.notification.warning({
            message: 'Session has expired. Please login again'
          });

          setTimeout(function () {
            window.location.reload();
          }, 500);
          return _context.abrupt("return", {
            status: 401
          });

        case 17:
          defaultHeaders = {
            'Content-type': 'application/json',
            Authorization: localStorage.getItem('accessToken') // Authorization: 'Viesoftware ' + localStorage.getItem('accessToken'),

          };

          if (_typeof(headers) === 'object') {
            Object.assign(defaultHeaders, headers);
          }

          _context.prev = 19;
          _context.next = 22;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            url: endpoint + path,
            method: method,
            headers: defaultHeaders,
            data: body
          }));

        case 22:
          return _context.abrupt("return", _context.sent);

        case 25:
          _context.prev = 25;
          _context.t1 = _context["catch"](19);

          if (!(_context.t1.response && _context.t1.response.status !== 401)) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", _context.t1.response);

        case 29:
          localStorage.clear(); // window.location.reload()

          _antd.notification.error({
            message: 'Hệ thống đang lỗi',
            description: 'Vui lòng thử lại!'
          });

          return _context.abrupt("return", {
            status: 401
          });

        case 32:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11], [19, 25]]);
};

exports.FetchAPI = FetchAPI;

var get = function get(path) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var endpoint = arguments.length > 3 ? arguments[3] : undefined;
  return FetchAPI("".concat(path, "?").concat((0, _querystring.stringify)(query)), 'GET', headers, null, endpoint);
};

exports.get = get;

var post = function post(path, body, headers, endpoint) {
  return FetchAPI(path, 'POST', headers, body, endpoint);
};

exports.post = post;

var patch = function patch(path, body, headers, endpoint) {
  return FetchAPI(path, 'PATCH', headers, body, endpoint);
};

exports.patch = patch;

var destroy = function destroy(path, body, headers, endpoint) {
  return FetchAPI(path, 'DELETE', headers, body, endpoint);
};

exports.destroy = destroy;