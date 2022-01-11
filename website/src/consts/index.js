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

//status order
export const BILL_STATUS_ORDER = {
  DRAFT: 'Lưu nháp',
  PROCESSING: 'Đang Xử Lý',
  COMPLETE: 'Hoàn Thành',
  VERIFY: 'Xác nhận',
  CANCEL: 'Huỷ Bỏ',
  REFUND: 'Hoàn Tiền',
}

export const SHIP_STATUS_ORDER = {
  DRAFT: 'DRAFT',
  WATTING_FOR_SHIPPING: 'WATTING_FOR_SHIPPING',
  SHIPPING: 'SHIPPING',
  COMPLETE: 'COMPLETE',
  CANCEL: 'CANCEL',
}

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  IMPORT_REPORT_FILE: '/import-report-file',
  PRODUCT_CHECK: '/product-check',
  ORDER_LIST: '/order-list',
  REPORTS: '/reports',
  SALES_REPORT: '/sales-report',
  STOCK_ADJUSTMENTS: '/stock-adjustments',
  STOCK_ADJUSTMENTS_CREATE: '/stock-adjustments/create',
  REPORT_VARIANT: '/report-variant',
  REPORT_INVENTORY: '/report-inventory',
  REPORT_IMPORT_EXPORT_INVENTORY_PRODUCT: '/report-import-export-inventory-product',
  REPORT_IMPORT_EXPORT_INVENTORY_VARIANT: '/report-import-export-inventory-variant',
  SHIPPING_CONTROL: '/shipping-control',
  GUARANTEE: '/guarantee',
  SHIPPING_PRODUCT: '/shipping-product',
  CLIENT_MANAGEMENT: '/client-management',
  BRANCH_MANAGEMENT: '/branch',
  CONFIGURATION_STORE: '/configuration-store',
  OTP: '/otp',
  VERIFY_ACCOUNT: '/verify-account',
  PASSWORD_NEW: '/password-new',
  FORGET_PASSWORD: '/forget-password',
  OVERVIEW: '/overview',
  SELL: '/sell',
  STORE: '/store',
  RECEIPTS_PAYMENT: '/receipts-payment',
  PAYMENT_TYPE: '/payment-type',
  RECEIPTS_TYPE: '/receipts-type',
  ACTIVITY_DIARY: '/activity-diary',
  TAX_ADD: '/actions/tax/add',
  TAX_UPDATE: '/actions/tax/update',
  SHIPPING_PRODUCT_ADD: '/shipping-product-add',
  ORDER_CREATE: '/order-create',
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
  SHIPPING_CONTROL_ADD: '/actions/shipping-control/add',
  SHIPPING_CONTROL_VIEW: '/actions/shipping-control/view',
  ACCUMULATE_POINT_SETTING_VIEW: '/actions/accumulate-point-setting/view',
  CARD_ACCUMULATE_POINT_ADD: '/actions/card-accumulate-point/add',
  ACCUMULATE_POINT_EDIT_ADDD: '/actions/accumulate-point-edit/add',
  ACCUMULATE_POINT_EDIT_DETAIL: '/actions/accumulate-point-edit/detail',
  PRODUCT_CHECK_ADD: '/actions/product-check/add',
  PRODUCT_CHECK_VIEW: '/actions/product-check/view',
  ORDER_CREATE_SHIPPING_ADD: '/actions/order-create-shipping/add',
  REPORT_FINANCIAL_VIEW: '/actions/sale-detail/view',
  REPORT_REVENUE_VIEW: '/actions/revenue-cost/view',
  INVENTORY_ADD: '/actions/inventory/add',
  PRODUCT_ADD: '/product/add',
  PRODUCT_UPDATE: '/product/update',
  PROMOTION_ADD: '/actions/promotion/add',
  ROLE_ADD: '/actions/role/add',
  GUARANTEE_ADD: '/actions/guarantee/add',
  POINT: '/point',
  CATEGORY: '/category',
  CATEGORIES: '/categories',
  SETTING: '/setting',
  OFFER_LIST: '/offer-list',
  OFFER_LIST_CREATE: '/offer-list/create',
  BLOG: '/blog',
  BLOG_CREATE: '/blog/create',
  BRAND: '/brand',
  BRAND_CREATE: '/brand/create',
  CHANNEL: '/channel',
  // CHANNEL_CREATE:'/channel/create',
  CONTACT: '/contact',
  IMPORT_INVENTORIES: '/import-inventories',
  IMPORT_INVENTORY: '/import-inventory',
}

export const PERMISSIONS = {
  //Permission menu
  tong_quan: 'tong_quan',
  ban_hang: 'ban_hang',
  danh_sach_don_hang: 'danh_sach_don_hang',
  quan_li_client: 'quan_li_client',
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
  quan_li_uu_dai: 'quan_li_uu_dai',

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
  tao_bai_viet: 'tao_bai_viet',
  tao_thuong_hieu: 'tao_thuong_hieu',
  tao_kenh_ban_hang: 'tao_kenh_ban_hang',
}

export const VERSION_APP = '1.1.18'

export const regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

export const IMAGE_DEFAULT =
  'https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/11/08/757a2f95-f144-4963-8e11-931bafdee356/image_default.jpg'

export const PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [20, 40, 50, 60, 80, 100]
export const POSITION_TABLE = ['bottomLeft']
