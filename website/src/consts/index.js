export const ACTION = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOADING: 'LOADING',
  GET_PRODUCTS: 'GET_PRODUCTS',
  GET_STORE: 'GET_STORE',
  SELECT_VALUE: 'SELECT_VALUE',
  ERROR: 'ERROR',
  CHANGE_SIDER: 'CHANGE_SIDER',
}

//co 6 role mac dinh
export const ROLE_DEFAULT = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  BUSINESS: 'BUSINESS',
}

//status product
export const STATUS_PRODUCT = {
  all: 'all',
  shipping_stock: 'shipping_stock',
  available_stock: 'available_stock',
  low_stock: 'low_stock',
  out_stock: 'out_stock',
}

export const ROUTES = {
  LOGIN: '/login',
  REPORT_IMPORT: '/report-import',
  IMPORT_REPORT_FILE: '/import-report-file',
  USER: '/user',
  PRODUCT_CHECK: '/product-check',
  ORDER_LIST: '/order-list',
  REPORT_FINANCIAL: '/report-financial',
  REPORT_INVENTORY: '/report-inventory',
  SHIPPING_CONTROL: '/shipping-control',
  GUARANTEE: '/guarantee',
  SHIPPING_PRODUCT: '/shipping-product',
  BUSINESS: '/business',
  BRANCH: '/branch',
  CONFIGURATION_STORE: '/configuration-store',
  VERTIFY_ACCOUNT: '/vertifyaccount',
  OTP: '/otp',
  PASSWORD_NEW: '/password-new',
  FORGET_PASSWORD: '/forget-password',
  OVERVIEW: '/overview',
  SELL: '/sell',
  STORE: '/store',
  RECEIPTS_PAYMENT: '/receipts-payment',
  PAYMENT_TYPE: '/payment-type',
  RECEIPTS_TYPE: '/receipts-type',
  ACTIVITY_DIARY: '/activity-diary',
  USER_ADD: '/actions/user/add',
  BUSINESS_VIEW: '/actions/business/view',
  USER_UPDATE: '/actions/user/update',
  TAX_ADD: '/actions/tax/add',
  TAX_UPDATE: '/actions/tax/update',
  BRANCH_VIEW: '/actions/branch/view',
  SHIPPING_PRODUCT_ADD: '/actions/shipping-product/add',
  SHIPPING_PRODUCT_UPDATE: '/actions/shipping-product/update',
  ORDER_CREATE_SHIPPING: '/order-create-shipping',
  INVENTORY: '/inventory',
  PRODUCT: '/product',
  PAYMENT: '/payment',
  TAX: '/tax',
  EMPLOYEE: '/employee',
  SHIPPING: '/shipping',
  CUSTOMER: '/customer',
  SUPPLIER: '/supplier',
  PROMOTION: '/promotion',
  ROLE: '/role',
  SHIPPING_PRODUCT_VIEW: '/actions/shipping-product/view',
  SHIPPING_CONTROL_ADD: '/actions/shipping-control/add',
  SHIPPING_CONTROL_VIEW: '/actions/shipping-control/view',
  PRODUCT_UPDATE: '/actions/product/update',
  PRODUCT_VIEW: '/actions/product/view',
  INVENTORY_VIEW: '/actions/inventory/view',
  INVENTORY_UPDATE: '/actions/inventory/update',
  ACCUMULATE_POINT_SETTING_VIEW: '/actions/accumulate-point-setting/view',
  CARD_ACCUMULATE_POINT_ADD: '/actions/card-accumulate-point/add',
  ACCUMULATE_POINT_EDIT_ADDD: '/actions/accumulate-point-edit/add',
  ACCUMULATE_POINT_EDIT_DETAIL: '/actions/accumulate-point-edit/detail',
  PRODUCT_CHECK_ADD: '/actions/product-check/add',
  PRODUCT_CHECK_VIEW: '/actions/product-check/view',
  ORDER_CREATE_SHIPPING_ADD: '/actions/order-create-shipping/add',
  STORE_ADD: '/actions/store/add',
  EMPLOYEE_VIEW: '/actions/employee/view',
  SHIPPING_UPDATE: '/actions/shipping/update',
  SHIPPING_VIEW: '/actions/shipping/view',
  SHIPPING_ADD: '/actions/shipping/add',
  CUSTOMER_VIEW: '/actions/customer/view',
  REPORT_FINANCIAL_VIEW: '/actions/sale-detail/view',
  REPORT_REVENUE_VIEW: '/actions/revenue-cost/view',
  CUSTOMER_UPDATE: '/actions/customer/update',
  SUPPLIER_UPDATE: '/actions/supplier/update',
  INVENTORY_ADD: '/actions/inventory/add',
  PRODUCT_ADD: '/actions/product/add',
  EMPLOYEE_ADD: '/actions/employee/add',
  EMPLOYEE_EDIT: '/actions/employee/edit',
  CUSTOMER_ADD: '/actions/customer/add',
  SUPPLIER_ADD: '/actions/supplier/add',
  SUPPLIER_INFORMATION: '/actions/supplier/information',
  SUPPLIER_VIEW: '/actions/supplier/view',
  PROMOTION_ADD: '/actions/promotion/add',
  ROLE_ADD: '/actions/role/add',
  GUARANTEE_ADD: '/actions/guarantee/add',
  CUSTOMER_ORDER_LIST: '/customer/order-list',
  CUSTOMER_ORDER_DETAIL: '/customer/order/detail',
  POINT: '/point',
  CATEGORY: '/category',
  CATEGORIES: '/categories',
  SETTING: '/setting',
  OFFER_LIST: '/offer-list',
  OFFER_LIST_CREATE: '/offer-list/create',
  BLOG:'/blog',
  BLOG_CREATE:'/blog/create',
  BRAND:'/brand',
  BRAND_CREATE:'/brand/create',
}

export const PERMISSIONS = {
  //Permission menu
  tong_quan: 'tong_quan',
  ban_hang: 'ban_hang',
  danh_sach_don_hang: 'danh_sach_don_hang',
  business_management: 'business_management',
  san_pham: 'san_pham',
  quan_li_chi_nhanh: 'quan_li_chi_nhanh',
  quan_li_san_pham: 'quan_li_san_pham',
  quan_li_kho: 'quan_li_kho',
  quan_li_chuyen_hang: 'quan_li_chuyen_hang',
  quan_li_nha_cung_cap: 'quan_li_nha_cung_cap',
  quan_li_bao_hanh: 'quan_li_bao_hanh',
  khuyen_mai: 'khuyen_mai',
  kiem_hang_cuoi_ngay: 'kiem_hang_cuoi_ngay',
  quan_li_khach_hang: 'quan_li_khach_hang',
  bao_cao_don_hang: 'bao_cao_don_hang',
  bao_cao_nhap_hang: 'bao_cao_nhap_hang',
  bao_cao_ton_kho: 'bao_cao_ton_kho',
  bao_cao_tai_chinh: 'bao_cao_tai_chinh',
  van_chuyen: 'van_chuyen',
  doi_soat_van_chuyen: 'doi_soat_van_chuyen',
  quan_li_doi_tac_van_chuyen: 'quan_li_doi_tac_van_chuyen',
  cau_hinh_thong_tin: 'cau_hinh_thong_tin',
  quan_li_phan_quyen: 'quan_li_phan_quyen',
  tich_diem: 'tich_diem',

  //Permission function
  them_cua_hang: 'them_cua_hang',
  tao_don_hang: 'tao_don_hang',
  nhom_san_pham: 'nhom_san_pham',
  them_san_pham: 'them_san_pham',
  xoa_san_pham: 'xoa_san_pham',
  tao_nhom_san_pham: 'tao_nhom_san_pham',
  xoa_nhom_san_pham: 'xoa_nhom_san_pham',
  cap_nhat_nhom_san_pham: 'cap_nhat_nhom_san_pham',
  tao_phieu_chuyen_hang: 'tao_phieu_chuyen_hang',
  them_kho: 'them_kho',
  cap_nhat_kho: 'cap_nhat_kho',
  cap_nhat_trang_thai_phieu_chuyen_hang: 'cap_nhat_trang_thai_phieu_chuyen_hang',
  them_nha_cung_cap: 'them_nha_cung_cap',
  cap_nhat_nha_cung_cap: 'cap_nhat_nha_cung_cap',
  them_phieu_bao_hanh: 'them_phieu_bao_hanh',
  them_khuyen_mai: 'them_khuyen_mai',
  them_phieu_kiem_hang: 'them_phieu_kiem_hang',
  them_khach_hang: 'them_khach_hang',
  cap_nhat_khach_hang: 'cap_nhat_khach_hang',
  them_phieu_doi_soat_van_chuyen: 'them_phieu_doi_soat_van_chuyen',
  them_doi_tac_van_chuyen: 'them_doi_tac_van_chuyen',
  cap_nhat_doi_tac_van_chuyen: 'cap_nhat_doi_tac_van_chuyen',
  xoa_doi_tac_van_chuyen: 'xoa_doi_tac_van_chuyen',
  them_chi_nhanh: 'them_chi_nhanh',
  cap_nhat_chi_nhanh: 'cap_nhat_chi_nhanh',
  quan_li_cua_hang: 'quan_li_cua_hang',
  quan_li_nguoi_dung: 'quan_li_nguoi_dung',
  them_nguoi_dung: 'them_nguoi_dung',
  quan_li_nhan_su: 'quan_li_nhan_su',
  them_nhan_su: 'them_nhan_su',
  cap_nhat_nhan_su: 'cap_nhat_nhan_su',
  quan_li_thue: 'quan_li_thue',
  them_thue: 'them_thue',
  quan_li_thanh_toan: 'quan_li_thanh_toan',
  them_hinh_thuc_thanh_toan: 'them_hinh_thuc_thanh_toan',
  nhap_xuat_file: 'nhap_xuat_file',
  nhat_ki_hoat_dong: 'nhat_ki_hoat_dong',
  tao_quyen: 'tao_quyen',
  tao_uu_dai: 'tao_uu_dai',
  tao_bai_viet:'tao_bai_viet',
  tao_thuong_hieu:'tao_thuong_hieu',
}

export const VERSION_APP = '1.0.3'

export const regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

export const IMAGE_DEFAULT =
  'https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/11/08/757a2f95-f144-4963-8e11-931bafdee356/image_default.jpg'

export const PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [20, 40, 50, 60, 80, 100]
export const POSITION_TABLE = ['bottomLeft']
