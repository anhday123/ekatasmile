"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = exports.uploadFiles = exports.decodeJWT = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _awsS = _interopRequireDefault(require("aws-s3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var decodeJWT = function decodeJWT(_token) {
  if (typeof _token !== 'string') {
    return false;
  }

  var _splitToken = _token.split('.');

  if (_splitToken.length !== 3) {
    return false;
  }

  try {
    var payload = JSON.parse(atob(_splitToken[1])); // if (payload.role === 'client') {
    //   if (!payload.permissions) {
    //     payload.permissions = []
    //   }
    //   payload.permissions = [
    //     ...payload.permissions,
    //   ]
    // }

    return payload;
  } catch (error) {
    return null;
  }
};

exports.decodeJWT = decodeJWT;

var uploadFiles = function uploadFiles(files) {
  var _d, config, listPromise, results;

  return regeneratorRuntime.async(function uploadFiles$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          /* config s3 */
          _d = (0, _moment["default"])(new Date()).format('YYYY/MM/DD');
          config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
          };
          /* config s3 */

          listPromise = files.map(function _callee(file) {
            var ReactS3Client, fileName, res;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    ReactS3Client = new _awsS["default"](config);
                    fileName = file.name.split('.'); //check type file và thay đổi type file
                    //check đuôi file là gì thì set type trong object file giá trị đó

                    Object.defineProperty(file, 'type', {
                      value: "application/".concat(fileName[fileName.length - 1]),
                      writable: true
                    });
                    fileName.splice(fileName.length - 1, 1);
                    _context.next = 6;
                    return regeneratorRuntime.awrap(ReactS3Client.uploadFile(file, _d + '/' + fileName.toString().replaceAll(',', '.')));

                  case 6:
                    res = _context.sent;

                    if (!(res && res.status === 204)) {
                      _context.next = 9;
                      break;
                    }

                    return _context.abrupt("return", res.location);

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          results = Promise.all(listPromise);
          return _context2.abrupt("return", results || []);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.uploadFiles = uploadFiles;

var uploadFile = function uploadFile(file) {
  var _d, config, ReactS3Client, fileName, res;

  return regeneratorRuntime.async(function uploadFile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          /* config s3 */
          _d = (0, _moment["default"])(new Date()).format('YYYY/MM/DD');
          config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
          };
          /* config s3 */

          ReactS3Client = new _awsS["default"](config);
          fileName = file.name.split('.'); //check type file và thay đổi type file
          //check đuôi file là gì thì set type trong object file giá trị đó

          Object.defineProperty(file, 'type', {
            value: "application/".concat(fileName[fileName.length - 1]),
            writable: true
          });
          fileName.splice(fileName.length - 1, 1);
          _context3.next = 9;
          return regeneratorRuntime.awrap(ReactS3Client.uploadFile(file, _d + '/' + fileName.toString().replaceAll(',', '.')));

        case 9:
          res = _context3.sent;

          if (!(res && res.status === 204)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.location);

        case 12:
          return _context3.abrupt("return", '');

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.uploadFile = uploadFile;