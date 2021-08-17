"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

var showResults = function showResults(values) {
  return regeneratorRuntime.async(function showResults$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(sleep(500));

        case 2:
          // simulate server latency
          window.alert("You submitted:\n\n".concat(JSON.stringify(values, null, 2)));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports["default"] = showResults;