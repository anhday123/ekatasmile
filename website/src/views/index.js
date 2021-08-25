import React from 'react'

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { ROUTES } from './../consts/index'

//base layout
import UI from './../components/Layout/UI'
import Authentication from 'components/authentication'

//modal intro
import ModalIntro from 'components/introduction'
import ModalWelcome from 'components/welcome'
import NotificationCreateBranch from 'components/notification-create-branch'

//views
import Login from './login/index'
import ReportImport from './report-import/index'
import User from './user/index'
import ProductCheck from './product-check/index'
import OrderList from './order-list/index'
import ReportFinancial from './report-financial/index'
import ReportInventory from './report-inventory'
import ReportEndDay from './report-end-day'
import ShippingControl from './shipping-control'
import Guarantee from './guarantee'
import ShippingProduct from './shipping-product'
import Business from './business'
import Branch from './branch'
import ConfigurationStore from './configuration-store'
import OTP from './otp'
import PasswordNew from './password-new'
import ForgetPassword from './forget-password'
import Overview from './overview'
import Sell from './sell'
import Store from './store'
import ActivityDiary from './activity-diary'
import UserAdd from './actions/user/add'
import BusinessView from './actions/business/view'
import UserUpdate from './actions/user/update'
import NotFound from './not-found/404'
import TaxAdd from './actions/tax/add'
import TaxUpdate from './actions/tax/update'
import BranchView from './actions/branch/view'
import ShippingProductAdd from './actions/shipping-product/add/index'
import OrderCreateShipping from './order-create-shipping'
import VertifyAccount from './vertify-account'
import ImportExportFile from './import-export-file'

import Inventory from './inventory'
import Product from './product'
import Payment from './payment'
import Tax from './tax'
import Employee from './employee'
import Shipping from './shipping'
import Customer from './customer'
import Supplier from './supplier'
import Promotion from './customer'
import Role from './role'
import ShippingProductView from './actions/shipping-product/view/index'
import ShippingControlAdd from './actions/shipping-control/add'
import ShippingControlView from './actions/shipping-control/view'
import ProductUpdate from './actions/product/update'
import ProductView from './actions/product/view'

import InventoryView from './actions/inventory/view'
import InventoryUpdate from './actions/inventory/update'

import ProductCheckAdd from './actions/product-check/add'
import ProductCheckView from './actions/product-check/view'
import OrderCreateShippingAdd from './actions/order-create-shipping/add'
import StoreAdd from './actions/store/add'
import EmployeeView from './actions/employee/view'
import ShippingUpdate from './actions/shipping/update'
import ShippingView from './actions/shipping/view'
import ShippingAdd from './actions/shipping/add'

import CustomerView from './actions/customer/view'
import CustomerUpdate from './actions/shipping/update'
import SupplierUpdate from './actions/supplier/update'
import InventoryAdd from './actions/inventory/add'
import ProductAdd from './actions/product/add'
import EmployeeAdd from './actions/employee/add'
import EmployeeEdit from './actions/employee/edit'
import CustomerAdd from './actions/customer/add'
import SupplierAdd from './actions/supplier/add'
import GuaranteeAdd from './actions/guarantee/add'
import SupplierInformation from './actions/supplier/information'
import SupplierView from './actions/supplier/view'
import PromotionAdd from './actions/promotion/add'
import RoleAdd from './actions/role/add'
import DeliveryUpdate from './actions/shipping-product/update'
const DEFINE_ROUTER = [
  {
    path: ROUTES.REPORT_IMPORT,
    Component: () => <ReportImport />,
    title: 'Báo cáo nhập hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.USER,
    Component: () => <User />,
    title: 'Quản lý người dùng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_CHECK,
    Component: () => <ProductCheck />,
    title: 'Kiểm hàng cuối ngày',
    permissions: [],
    exact: true,
  },

  {
    path: ROUTES.ORDER_LIST,
    Component: () => <OrderList />,
    title: 'Danh sách đơn hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_FINANCIAL,
    Component: () => <ReportFinancial />,
    title: 'Báo cáo tài chính',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_INVENTORY,
    Component: () => <ReportInventory />,
    title: 'Báo cáo tồn kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_END_DAY,
    Component: () => <ReportEndDay />,
    title: 'Báo cáo cuối ngày',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CONTROL,
    Component: () => <ShippingControl />,
    title: 'Đối soát vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.GUARANTEE,
    Component: () => <Guarantee />,
    title: 'Quản lý bảo hành',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.GUARANTEE_ADD,
    Component: () => <GuaranteeAdd />,
    title: 'Quản lý bảo hành',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT,
    Component: () => <ShippingProduct />,
    title: 'Quản lý chuyển hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BUSINESS,
    Component: () => <Business />,
    title: 'Business',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BRANCH,
    Component: () => <Branch />,
    title: 'Quản lý chi nhánh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CONFIGURATION_STORE,
    Component: () => <ConfigurationStore />,
    title: 'Cấu hình thông tin cửa hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.OVERVIEW,
    Component: () => <Overview />,
    title: 'Tổng quan',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SELL,
    Component: () => <Sell />,
    title: 'Bán hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.STORE,
    Component: () => <Store />,
    title: 'Quản lý cửa hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ACTIVITY_DIARY,
    Component: () => <ActivityDiary />,
    title: 'Nhật ký hoạt động',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.IMPORT_REPORT_FILE,
    Component: () => <ImportExportFile />,
    title: 'Xuất/nhập file',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ORDER_CREATE_SHIPPING,
    Component: () => <OrderCreateShipping />,
    title: 'Tạo đơn và giao hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.INVENTORY,
    Component: () => <Inventory />,
    title: 'Quản lý kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT,
    Component: () => <Product />,
    title: 'Quản lý sản phẩm',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PAYMENT,
    Component: () => <Payment />,
    title: 'QL hình thức thanh toán',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.TAX,
    Component: () => <Tax />,
    title: 'Quản lý thuế',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.EMPLOYEE,
    Component: () => <Employee />,
    title: 'Quản lý nhân sự',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING,
    Component: () => <Shipping />,
    title: 'QL đối tác vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CUSTOMER,
    Component: () => <Customer />,
    title: 'QL đối tác vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER,
    Component: () => <Supplier />,
    title: 'Quản lý nhà cung cấp',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PROMOTION,
    Component: () => <Promotion />,
    title: 'Khuyến mãi',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ROLE,
    Component: () => <Role />,
    title: 'Quản lý phân quyền',
    permissions: [],
    exact: true,
  },
]

const AUTH_ROUTER = [
  {
    path: ROUTES.LOGIN,
    Component: () => <Login />,
    exact: true,
    title: 'Login',
    permissions: [],
  },
  {
    path: ROUTES.OTP,
    Component: () => <OTP />,
    exact: true,
    title: 'OTP',
    permissions: [],
  },
  {
    path: ROUTES.PASSWORD_NEW,
    Component: () => <PasswordNew />,
    exact: true,
    title: 'New password',
    permissions: [],
  },
  {
    path: ROUTES.FORGET_PASSWORD,
    Component: () => <ForgetPassword />,
    exact: true,
    title: 'Forget password',
    permissions: [],
  },
  {
    path: ROUTES.USER_ADD,
    Component: () => <UserAdd />,
    title: 'Thêm người dùng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BUSINESS_VIEW,
    Component: () => <BusinessView />,
    title: 'Xem chi tiết business',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.USER_UPDATE,
    Component: () => <UserUpdate />,
    title: 'Cập nhật thông tin người dùng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.TAX_ADD,
    Component: () => <TaxAdd />,
    title: 'Thêm thuế',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.TAX_UPDATE,
    Component: () => <TaxUpdate />,
    title: 'Cập nhật thông tin thuế',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BRANCH_VIEW,
    Component: () => <BranchView />,
    title: 'Xem chi tiết chi nhánh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT_ADD,
    Component: () => <ShippingProductAdd />,
    title: 'Thêm quản lý chuyển hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT_VIEW,
    Component: () => <ShippingProductView />,
    title: 'Xem thông tin chi tiết quản lý chuyển hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT_UPDATE,
    Component: () => <DeliveryUpdate />,
    title: 'Xem thông tin chi tiết quản lý chuyển hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CONTROL_ADD,
    Component: () => <ShippingControlAdd />,
    title: 'Thêm đối soát vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CONTROL_VIEW,
    Component: () => <ShippingControlView />,
    title: 'Xem thông tin chi tiết đối soát vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_UPDATE,
    Component: () => <ProductUpdate />,
    title: 'Cập nhật thông tin sản phẩm',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_VIEW,
    Component: () => <ProductView />,
    title: 'Xem chi tiết thông tin sản phẩm',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.INVENTORY_VIEW,
    Component: () => <InventoryView />,
    title: 'Xem chi tiết kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.INVENTORY_UPDATE,
    Component: () => <InventoryUpdate />,
    title: 'Cập nhật thông tin kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_CHECK_ADD,
    Component: () => <ProductCheckAdd />,
    title: 'Thêm kiểm hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_CHECK_VIEW,
    Component: () => <ProductCheckView />,
    title: 'Xem chi tiết kiểm hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ORDER_CREATE_SHIPPING_ADD,
    Component: () => <OrderCreateShippingAdd />,
    title: 'Thêm tạo đơn và giao hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.STORE_ADD,
    Component: () => <StoreAdd />,
    title: 'Thêm cửa hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.EMPLOYEE_VIEW,
    Component: () => <EmployeeView />,
    title: 'Xem chi tiết thông tin nhân viên',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_UPDATE,
    Component: () => <ShippingUpdate />,
    title: 'Cập nhật thông tin quản lý đối tác vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_VIEW,
    Component: () => <ShippingView />,
    title: 'Xem thông tin chi tiết đối tác vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_ADD,
    Component: () => <ShippingAdd />,
    title: 'Thêm đối tác đối tác vận chuyển',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CUSTOMER_VIEW,
    Component: () => <CustomerView />,
    title: 'Xem thông tin chi tiết khách hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CUSTOMER_UPDATE,
    Component: () => <CustomerUpdate />,
    title: 'Cập nhật thông tin khách hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER_UPDATE,
    Component: () => <SupplierUpdate />,
    title: 'Cập nhật thông tin nhà cung cấp',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.INVENTORY_ADD,
    Component: () => <InventoryAdd />,
    title: 'Thêm kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_ADD,
    Component: () => <ProductAdd />,
    title: 'Thêm sản phẩm',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.EMPLOYEE_ADD,
    Component: () => <EmployeeAdd />,
    title: 'Thêm nhân viên',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.EMPLOYEE_EDIT,
    Component: () => <EmployeeEdit />,
    title: 'Cập nhật thông tin nhân viên',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CUSTOMER_ADD,
    Component: () => <CustomerAdd />,
    title: 'Thêm khách hàng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER_ADD,
    Component: () => <SupplierAdd />,
    title: 'Thêm nhà cung cấp',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER_INFORMATION,
    Component: () => <SupplierInformation />,
    title: 'Xem thông tin nhà cung cấp',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER_VIEW,
    Component: () => <SupplierView />,
    title: 'Xem thông tin chi tiết nhà cung cấp',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PROMOTION_ADD,
    Component: () => <PromotionAdd />,
    title: 'Thêm khuyến mãi',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ROLE_ADD,
    Component: () => <RoleAdd />,
    title: 'Thêm phân quyền',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.VERTIFY_ACCOUNT,
    Component: () => <VertifyAccount />,
    title: 'Xác thực tài khoản',
    permissions: [],
    exact: true,
  },
]

export default function Views() {
  return (
    <BrowserRouter>
      <ModalIntro />
      <ModalWelcome />
      <NotificationCreateBranch />f

      <Switch>
        {/* {ACCOUNT_ROUTER.map(({ Component, ...rest }, index) => (
          <Route {...rest} key={index}>
            <Authentication {...rest}>
              <Component />
            </Authentication>
          </Route>
        ))} */}

        <Route path="/" exact={true}>
          <Redirect to={ROUTES.OVERVIEW} />
        </Route>

        {DEFINE_ROUTER.map(({ Component, ...rest }, index) => (
          <Route {...rest} key={index}>
            <Authentication {...rest}>
              <UI>
                <Component />
              </UI>
            </Authentication>
          </Route>
        ))}

        {AUTH_ROUTER.map(({ Component, ...rest }, index) => (
          <Route {...rest} key={index}>
            <Component />
          </Route>
        ))}

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
