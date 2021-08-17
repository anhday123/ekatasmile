"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROUTES = exports.loginAccessTokenConst = exports.authConstants = exports.ACTION = void 0;
var ACTION = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOADING: 'LOADING',
  GET_PRODUCTS: 'GET_PRODUCTS',
  GET_STORE: 'GET_STORE',
  SELECT_VALUE: 'SELECT_VALUE',
  ERROR: 'ERROR',
  CHANGE_SIDER: 'CHANGE_SIDER'
};
exports.ACTION = ACTION;
var authConstants = {
  TOGGLE: 'TOGGLE',
  KEY: 'KEY'
};
exports.authConstants = authConstants;
var loginAccessTokenConst = {
  LOGIN_ACCESSTOKEN: 'LOGIN_ACCESSTOKEN'
};
exports.loginAccessTokenConst = loginAccessTokenConst;
var ROUTES = {
  LOGIN: '/login',
  REPORT_IMPORT: '/report-import/:slug',
  USER: '/user/:slug',
  PRODUCT_CHECK: '/product-check/:slug',
  ACCUMULATE_POINT: '/accumulate-point/:slug',
  ORDER_LIST: '/order-list/:slug',
  REPORT_FINANCIAL: '/report-financial/:slug',
  REPORT_INVENTORY: '/report-inventory/:slug',
  REPORT_END_DAY: '/report-end-day/:slug',
  SHIPPING_CONTROL: '/shipping-control/:slug',
  GUARANTEE: '/guarantee/:slug',
  SHIPPING_PRODUCT: '/shipping-product/:slug',
  BUSINESS: '/business/:slug',
  BRANCH: '/branch/:slug',
  CONFIGURATION_STORE: '/configuration-store/:slug',
  OTP: '/otp/:slug',
  PASSWORD_NEW: '/password-new',
  FORGET_PASSWORD: '/forget-password',
  OVERVIEW: '/overview/:slug',
  SELL: '/sell/:slug',
  STORE: '/store/:slug',
  ACTIVITY_DIARY: '/activity-diary/:slug',
  USER_ADD: '/actions/user/add',
  BUSINESS_VIEW: '/actions/business/view/:slug',
  USER_UPDATE: '/actions/user/update',
  TAX_ADD: '/actions/tax/add',
  TAX_UPDATE: '/actions/tax/update',
  BRANCH_VIEW: '/actions/branch/view/:slug',
  SHIPPING_PRODUCT_ADD: '/actions/shipping-product/add',
  ORDER_CREATE_SHIPPING: '/order-create-shipping/:slug',
  INVENTORY: '/inventory/:slug',
  PRODUCT: '/product/:slug',
  PAYMENT: '/payment/:slug',
  TAX: '/tax/:slug',
  EMPLOYEE: '/employee/:slug',
  SHIPPING: '/shipping/:slug',
  CUSTOMER: '/customer/:slug',
  SUPPLIER: '/supplier/:slug',
  PROMOTION: '/promotion/:slug',
  ROLE: '/role/:slug',
  SHIPPING_PRODUCT_VIEW: '/actions/shipping-product/view',
  SHIPPING_CONTROL_ADD: '/actions/shipping-control/add',
  SHIPPING_CONTROL_VIEW: '/actions/shipping-control/view',
  PRODUCT_UPDATE: '/actions/product/update',
  PRODUCT_VIEW: '/actions/product/view/:slug',
  INVENTORY_VIEW: '/actions/inventory/view/:slug',
  INVENTORY_UPDATE: '/actions/inventory/update/:slug',
  CARD_ACCUMULATE_POINT: '/actions/card-accumulate-point/view',
  ACCUMULATE_POINT_SETTING_VIEW: '/actions/accumulate-point-setting/view',
  CARD_ACCUMULATE_POINT_ADD: '/actions/card-accumulate-point/add',
  ACCUMULATE_POINT_EDIT_VIEW: '/actions/accumulate-point-edit/view',
  ACCUMULATE_POINT_EDIT_ADDD: '/actions/accumulate-point-edit/add',
  ACCUMULATE_POINT_EDIT_DETAIL: '/actions/accumulate-point-edit/detail',
  PRODUCT_CHECK_ADD: '/actions/product-check/add',
  PRODUCT_CHECK_VIEW: '/actions/product-check/view',
  ORDER_CREATE_SHIPPING_ADD: '/actions/order-create-shipping/add/:slug',
  STORE_ADD: '/actions/store/add',
  EMPLOYEE_VIEW: '/actions/employee/view/:slug',
  SHIPPING_UPDATE: '/actions/shipping/update',
  SHIPPING_VIEW: '/actions/shipping/view',
  SHIPPING_ADD: '/actions/shipping/add',
  CUSTOMER_VIEW: '/actions/customer/view',
  CUSTOMER_UPDATE: '/actions/customer/update',
  SUPPLIER_UPDATE: '/actions/supplier/update',
  INVENTORY_ADD: '/actions/inventory/add/:slug',
  PRODUCT_ADD: '/actions/product/add',
  EMPLOYEE_ADD: '/actions/employee/add',
  EMPLOYEE_EDIT: '/actions/employee/edit',
  CUSTOMER_ADD: '/actions/customer/add/:slug',
  SUPPLIER_ADD: '/actions/supplier/add',
  SUPPLIER_INFORMATION: '/actions/supplier/information',
  SUPPLIER_VIEW: '/actions/supplier/view',
  PROMOTION_ADD: '/actions/promotion/add',
  ROLE_ADD: '/actions/role/add'
};
exports.ROUTES = ROUTES;