"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = API;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var data;

if (process.browser) {
  data = JSON.parse(localStorage.getItem('statusLogin'));
}

var _ref = data ? data : '',
    accessToken = _ref.accessToken;

var defaultHeaders = {
  'Content-type': 'application/json',
  Authorization: "Viesoftware ".concat(accessToken)
};

function API(endpoint) {
  var method,
      body,
      _args = arguments;
  return regeneratorRuntime.async(function API$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          method = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'GET';
          body = _args.length > 2 ? _args[2] : undefined;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: method,
            headers: defaultHeaders,
            url: "https://fullfillment.viesoftware.net:1708/api/".concat(endpoint),
            data: body
          })["catch"](function (err) {}));

        case 4:
          return _context.abrupt("return", _context.sent);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}