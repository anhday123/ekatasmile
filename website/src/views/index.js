import React from 'react'

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { ROUTES } from 'consts'

//base layout
import BaseLayout from 'components/layout'
import Authentication from 'components/authentication'

//views
import LoginBusiness from './login-business'
import Login from './login'
import Register from './register'
import ProductCheck from './product-check'
import OrderList from './order-list'
import SalesReport from './sales-report'
import ReportInventory from './report-inventory'
import ShippingControl from './shipping-control'
import ShippingControlForm from './shipping-control/shipping-control-form'
import Guarantee from './guarantee'
import GuaranteeForm from './guarantee/guarantee-form'
import ShippingProduct from './shipping-product'
import ClientManagement from './client-management'
import Branch from './branch'
import Reports from './reports'
import ReportVariant from './report-variant'
import ReportImportExportInventoryProduct from './report-import-export-inventory-product'
import ReportImportExportInventoryVariant from './report-import-export-inventory-variant'
import StockAdjustments from './stock-adjustments'
import StockAdjustmentsForm from './stock-adjustments-form'
import ConfigurationStore from './configuration-store'
import OTP from './otp'
import Setting from './setting'
import ReceiptsAndPayment from './receipts-and-payment'
import PaymentType from './receipts-and-payment/payment-type'
import ReceiptsType from './receipts-and-payment/receipts-type'
import PasswordNew from './password-new'
import ForgetPassword from './forget-password'
import Overview from './overview'
import Sell from './sell'
import Store from './store'
import VerifyAccount from './verify-account'
import ActivityDiary from './activity-diary'

import NotFound from './not-found/404'

import ShippingProductForm from './shipping-product/shipping-product-form'
import OrderCreate from './order-create'
import Categories from './categories'
import Category from './category'

import Inventory from './inventory'
import OfferList from './offer-list'
import Product from './product'
import ProductForm from './product/product-form'
import Payment from './payment'
import Tax from './tax'
import Employee from './employee'
import Shipping from './shipping'
import Customer from './customer'
import Supplier from './supplier'
import Promotion from './promotion'
import Role from './role'

import Point from './point'
import OfferListCreate from './offer-list-create'
import Blog from './blog'
import BlogCreate from './blog-create'
import Brand from './brand'
import SettingBill from './setting-bill'
import BrandCreate from './brand-create'
import Channel from './channel'
import Contact from './contact'
import ImportInventories from './import-inventories'
import ImportInventory from './import-inventory'
import ImportReportFile from './import-report-file'
import DeliveryControl from './delivery-control'
import ShippingForm from './shipping/shipping-form'
import ShippingFormGHTK from './shipping/shipping-ghtk'
import ShippingFormGHN from './shipping/shipping-ghn'
const DEFINE_ROUTER = [
  {
    path: ROUTES.PRODUCT_CHECK,
    Component: () => <ProductCheck />,
    title: 'Ki???m h??ng cu???i ng??y',
    permissions: [],
    exact: true,
  },

  {
    path: ROUTES.PRODUCT_ADD,
    Component: () => <ProductForm />,
    title: 'Th??m s???n ph???m',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PRODUCT_UPDATE,
    Component: () => <ProductForm />,
    title: 'C???p nh???t s???n ph???m',
    permissions: [],
    exact: true,
  },

  {
    path: ROUTES.ORDER_LIST,
    Component: () => <OrderList />,
    title: 'Danh s??ch ????n h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SALES_REPORT,
    Component: () => <SalesReport />,
    title: 'B??o c??o b??n h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_INVENTORY,
    Component: () => <ReportInventory />,
    title: 'B??o c??o t???n kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORTS,
    Component: () => <Reports />,
    title: 'B??o c??o t???ng h???p',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_VARIANT,
    Component: () => <ReportVariant />,
    title: 'B??o c??o t???n kho theo thu???c t??nh',
    permissions: [],
    exact: true,
  },

  {
    path: ROUTES.STOCK_ADJUSTMENTS,
    Component: () => <StockAdjustments />,
    title: 'Ki???m h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.STOCK_ADJUSTMENTS_CREATE,
    Component: () => <StockAdjustmentsForm />,
    title: 'T???o phi???u ki???m h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.STOCK_ADJUSTMENTS_UPDATE,
    Component: () => <StockAdjustmentsForm />,
    title: 'C???p nh???t phi???u ki???m h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_IMPORT_EXPORT_INVENTORY_PRODUCT,
    Component: () => <ReportImportExportInventoryProduct />,
    title: 'B??o c??o xu???t nh???p t???n theo s???n ph???m',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.REPORT_IMPORT_EXPORT_INVENTORY_VARIANT,
    Component: () => <ReportImportExportInventoryVariant />,
    title: 'B??o c??o xu???t nh???p t???n theo thu???c t??nh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CONTROL,
    Component: () => <ShippingControl />,
    title: '?????i so??t v???n chuy???n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.DELIVERY_CONTROL,
    Component: () => <DeliveryControl />,
    title: 'Qu???n l?? giao h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CONTROL_ADD,
    Component: () => <ShippingControlForm />,
    title: 'T???o phi???u ?????i so??t v???n chuy???n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.GUARANTEE,
    Component: () => <Guarantee />,
    title: 'Qu???n l?? b???o h??nh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.GUARANTEE_ADD,
    Component: () => <GuaranteeForm />,
    title: 'Th??m b???o h??nh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT,
    Component: () => <ShippingProduct />,
    title: 'Qu???n l?? chuy???n h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CLIENT_MANAGEMENT,
    Component: () => <ClientManagement />,
    title: 'Qu???n l?? client',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BRANCH_MANAGEMENT,
    Component: () => <Branch />,
    title: 'Qu???n l?? kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CONFIGURATION_STORE,
    Component: () => <ConfigurationStore />,
    title: 'C???u h??nh th??ng tin c???a h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.OVERVIEW,
    Component: () => <Overview />,
    title: 'T???ng quan',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.STORE,
    Component: () => <Store />,
    title: 'Qu???n l?? c???a h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.POINT,
    Component: () => <Point />,
    title: 'T??ch ??i???m',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ACTIVITY_DIARY,
    Component: () => <ActivityDiary />,
    title: 'Nh???t k?? ho???t ?????ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ORDER_CREATE,
    Component: () => <OrderCreate />,
    title: 'T???o ????n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.INVENTORY,
    Component: () => <Inventory />,
    title: 'Qu???n l?? kho',
    permissions: [],
    exact: true,
  },

  {
    path: ROUTES.PRODUCT,
    Component: () => <Product />,
    title: 'Qu???n l?? s???n ph???m',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PAYMENT,
    Component: () => <Payment />,
    title: 'Qu???n l?? h??nh th???c thanh to??n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.TAX,
    Component: () => <Tax />,
    title: 'Qu???n l?? thu???',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.EMPLOYEE,
    Component: () => <Employee />,
    title: 'Qu???n l?? nh??n vi??n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.IMPORT_REPORT_FILE,
    Component: () => <ImportReportFile />,
    title: 'Nh???p xu???t File',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING,
    Component: () => <Shipping />,
    title: 'Qu???n l?? ?????i t??c v???n chuy???n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CREATE,
    Component: () => <ShippingForm />,
    title: 'Th??m ?????i t??c v???n chuy???n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CREATE_GHTK,
    Component: () => <ShippingFormGHTK />,
    title: 'K???t n???i GHTK',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_CREATE_GHN,
    Component: () => <ShippingFormGHN />,
    title: 'K???t n???i GHN',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CUSTOMER,
    Component: () => <Customer />,
    title: 'Qu???n l?? kh??ch h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SUPPLIER,
    Component: () => <Supplier />,
    title: 'Qu???n l?? nh?? cung c???p',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.PROMOTION,
    Component: () => <Promotion />,
    title: 'Khuy???n m??i',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.ROLE,
    Component: () => <Role />,
    title: 'Qu???n l?? ph??n quy???n',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SHIPPING_PRODUCT_ADD,
    Component: () => <ShippingProductForm />,
    title: 'Th??m phi???u chuy???n h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CATEGORIES,
    Component: () => <Categories />,
    title: 'Qu???n l?? danh m???c',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CATEGORY,
    Component: () => <Category />,
    title: 'Danh m???c',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SETTING,
    Component: () => <Setting />,
    title: 'C??i ?????t',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.OFFER_LIST,
    Component: () => <OfferList />,
    title: 'Danh s??ch ??u ????i',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.OFFER_LIST_CREATE,
    Component: () => <OfferListCreate />,
    title: 'T???o ??u ????i',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BLOG,
    Component: () => <Blog />,
    title: 'Danh s??ch b??i vi???t',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BLOG_CREATE,
    Component: () => <BlogCreate />,
    title: 'T???o b??i vi???t',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BRAND,
    Component: () => <Brand />,
    title: 'Danh s??ch th????ng hi???u',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.BRAND_CREATE,
    Component: () => <BrandCreate />,
    title: 'T???o th????ng hi???u',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CHANNEL,
    Component: () => <Channel />,
    title: 'Danh s??ch k??nh',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.IMPORT_INVENTORIES,
    Component: () => <ImportInventories />,
    title: 'Nh???p h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.IMPORT_INVENTORY,
    Component: () => <ImportInventory />,
    title: 'Chi ti???t ????n h??ng nh???p kho',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.RECEIPTS_PAYMENT,
    Component: () => <ReceiptsAndPayment />,
    title: 'B??o c??o thu chi',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SELL,
    Component: () => <Sell />,
    title: 'B??n h??ng',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.SETTING_BILL,
    Component: () => <SettingBill />,
    title: 'C??i ?????t m??y in bill',
    permissions: [],
    exact: true,
  },
]

const AUTH_ROUTER = [
  {
    path: ROUTES.CHECK_SUBDOMAIN,
    Component: () => <LoginBusiness />,
    exact: true,
    title: 'Login business',
    permissions: [],
  },
  {
    path: ROUTES.LOGIN,
    Component: () => <Login />,
    exact: true,
    title: 'Login',
    permissions: [],
  },
  {
    path: ROUTES.REGISTER,
    Component: () => <Register />,
    exact: true,
    title: 'Register',
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
    path: ROUTES.VERIFY_ACCOUNT,
    Component: () => <VerifyAccount />,
    title: 'X??c th???c t??i kho???n',
    permissions: [],
    exact: true,
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
    path: ROUTES.PAYMENT_TYPE,
    Component: () => <PaymentType />,
    title: 'Lo???i phi??u chi',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.RECEIPTS_TYPE,
    Component: () => <ReceiptsType />,
    title: 'Lo???i phi???u thu',
    permissions: [],
    exact: true,
  },
  {
    path: ROUTES.CONTACT,
    Component: () => <Contact />,
    title: 'Li??n h???',
    permissions: [],
    exact: true,
  },
]

export default function Views() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true}>
          <Redirect to={ROUTES.OVERVIEW} />
        </Route>

        {DEFINE_ROUTER.map(({ Component, ...rest }, index) => (
          <Route {...rest} key={index}>
            <Authentication {...rest}>
              <BaseLayout>
                <Component />
              </BaseLayout>
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

        {/* ??? ????y */}
      </Switch>
    </BrowserRouter>
  )
}
