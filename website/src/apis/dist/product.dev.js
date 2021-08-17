"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiProductCategoryMerge = exports.apiProductCategory = exports.apiUpdateProductStore = exports.apiProductSeller = exports.apiSearchProduct = exports.apiUpdateProduct = exports.apiAllProduct = exports.apiAddProduct = void 0;

var _httpClient = require("./httpClient");

var apiAddProduct = function apiAddProduct(object) {
  return (0, _httpClient.post)('/product/addproduct', object);
};

exports.apiAddProduct = apiAddProduct;

var apiAllProduct = function apiAllProduct() {
  return (0, _httpClient.get)('/product/getproduct');
};

exports.apiAllProduct = apiAllProduct;

var apiUpdateProduct = function apiUpdateProduct(object, id) {
  return (0, _httpClient.patch)("/product/updateproduct/".concat(id), object);
};

exports.apiUpdateProduct = apiUpdateProduct;

var apiSearchProduct = function apiSearchProduct(object) {
  return (0, _httpClient.get)('/product/getproduct', object);
};

exports.apiSearchProduct = apiSearchProduct;

var apiProductSeller = function apiProductSeller(object) {
  return (0, _httpClient.get)('/saleproduct/getsaleproduct', object);
};

exports.apiProductSeller = apiProductSeller;

var apiUpdateProductStore = function apiUpdateProductStore(object, id) {
  return (0, _httpClient.patch)("/saleproduct/updatesaleproduct/".concat(id), object);
};

exports.apiUpdateProductStore = apiUpdateProductStore;

var apiProductCategory = function apiProductCategory() {
  return (0, _httpClient.get)('/category/getproductincategory');
};

exports.apiProductCategory = apiProductCategory;

var apiProductCategoryMerge = function apiProductCategoryMerge(object) {
  return (0, _httpClient.get)('/category/getproductincategory', object);
};

exports.apiProductCategoryMerge = apiProductCategoryMerge;