"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImgs = exports.uploadImg = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uploadImg = function uploadImg(formData) {
  return _axios["default"].post('https://ecom-fulfill.com/api/fileupload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

exports.uploadImg = uploadImg;

var uploadImgs = function uploadImgs(formData) {
  return _axios["default"].post('https://ecom-fulfill.com/api/fileupload/multi', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

exports.uploadImgs = uploadImgs;