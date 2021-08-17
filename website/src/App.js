import React, { useEffect, useState } from 'react'
import { useDispatch, } from 'react-redux'
import { ACTION } from './consts/index'
import disconnection from './assets/img/disconnection.jpg'

import Loading from './components/loading/Loading'
import Login from "./views/login";
import Overview from "./views/overview/index";
import Sell from "./views/sell/index";
import Store from "./views/store/index";
import Orders from "./views/orders/index";
import OrdersAdd from "./views/actions/orders/add";
import OrdersEdit from "./views/actions/orders/edit";
import OrdersView from "./views/actions/orders/view";
import Delivery from "./views/delivery/index";
import Exchange from './views/exchange/index';
import { Modal, Button } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import Inventory from "./views/inventory";
import Product from "./views/product";
import Payment from "./views/payment";
import RevenExpend from "./views/reven-expen";
import Tax from "./views/tax";
// import Users from "./views/users";
import Employee from "./views/employee";
import Shipping from "./views/shipping";
import Customer from "./views/customer";
import Supplier from "./views/supplier";
import User from "./views/user";
import Promotion from "./views/promotion";
import Role from "./views/role";
import ReportEndDay from "./views/report-end-day";
import ShippingControl from "./views/shipping-control";
import Guarantee from "./views/guarantee";
import PasswordNew from './views/password-new';
import OTP from './views/otp';
import UID from './views/uid/index'
import AccumulatePoint from './views/accumulate-point';
import ReportFinancial from './views/report-financial';
import ActivityDiary from './views/activity-diary';
import Branch from './views/branch';
import OrderList from './views/order-list';
import ShippingProduct from './views/shipping-product';
import Business from './views/business';
import OrderCreateShipping from './views/order-create-shipping';
import ReportInventory from './views/report-inventory';
import ReportImport from './views/report-import';
import ConfigurationStore from './views/configuration-store';
import ForgetPassword from './views/forget-password/index'
import InventoryAdd from "./views/actions/inventory/add";
import ProductAdd from "./views/actions/product/add";
import RevenExpenAdd from "./views/actions/reven-expen/add";
import EmployeeAdd from "./views/actions/employee/add";
import EmployeeDelete from "./views/actions/employee/delete";
import EmployeeEdit from "./views/actions/employee/edit";
import CustomerAdd from "./views/actions/customer/add";
import SupplierAdd from "./views/actions/supplier/add";
import SupplierInformation from "./views/actions/supplier/information";
import SupplierView from "./views/actions/supplier/view";
import SupplierUpdate from "./views/actions/supplier/update";
import PromotionAdd from "./views/actions/promotion/add";
import RoleAdd from "./views/actions/role/add";
import GuaranteeAdd from './views/actions/guarantee/add'
import GuaranteeUpdate from './views/actions/guarantee/update'
import GuaranteeView from './views/actions/guarantee/view'
import ProductCheck from "./views/product-check";
import CustomerView from "./views/actions/customer/view";
import CustomerUpdate from "./views/actions/customer/update";
import BusinessUpdate from './views/actions/business/update';
import BusinessAdd from './views/actions/business/add';
import ShippingAdd from "./views/actions/shipping/add";
import ShippingView from "./views/actions/shipping/view";
import ShippingUpdate from "./views/actions/shipping/update";
import RevenueCostView from "./views/actions/revenue-cost/view";
import EmployeeView from "./views/actions/employee/view";
import StoreAdd from "./views/actions/store/add";
import UserAdd from "./views/actions/user/add";
import UserUpdate from "./views/actions/user/update";
import TaxAdd from "./views/actions/tax/add";
import ProductView from "./views/actions/product/view";
import TaxUpdate from "./views/actions/tax/update";
import BranchView from "./views/actions/branch/view";
import ProductUpdate from "./views/actions/product/update";
import ShippingProductAdd from "./views/actions/shipping-product/add";
import BusinessView from "./views/actions/business/view";
import OrderInformatonView from "./views/actions/order-information/view";
import SaleDetailView from "./views/actions/sale-detail/view";
import ShippingProductView from "./views/actions/shipping-product/view";
import ShippingControlAdd from "./views/actions/shipping-control/add";
import ShippingControlUpdate from "./views/actions/shipping-control/update";
import ImportExportFile from './views/import-export-file';
import ShippingControlView from "./views/actions/shipping-control/view";
import OrderInformationViewProduct from "./views/actions/order-information/view-product/index";
import InventoryView from "./views/actions/inventory/view";
import ProductCheckAdd from "./views/actions/product-check/add";
import InventoryUpdate from "./views/actions/inventory/update";
import CardAccumulatePoint from "./views/actions/card-accumulate-point/view";
import AccumulatePointSettingView from "./views/actions/accumulate-point-setting/view";
import CardAccumulatePointAdd from "./views/actions/card-accumulate-point/add";
import AccumulatePointEditView from "./views/actions/accumulate-point-edit/view";
import AccumulatePointEditAdd from "./views/actions/accumulate-point-edit/add";
import AccumulatePointEditDetail from "./views/actions/accumulate-point-edit/detail";
import ProductCheckView from "./views/actions/product-check/view";
import OrderCreateShippingAdd from "./views/actions/order-create-shipping/add";
import OrderListView from './views/actions/order-list/view'
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import PrivateRouter from './components/private-router/private-router'
import CheckRouter from './components/check-router/check-router'
import { Integrations } from "@sentry/tracing";
import { getAllStore } from './apis/store';
import { getStore } from './actions/store';
import { Offline, Online } from "react-detect-offline";
import DeliveryUpdate from './views/actions/shipping-product/update'
export const _frontmatter = {}
Sentry.init({
  dsn: "https://8933ea4ff8064aac9b25381f124c8a0d@o880922.ingest.sentry.io/5836182",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})
function App() {
  const [modal2Visible, setModal2Visible] = useState(true)
  const history = useHistory()
  const dispatch = useDispatch()
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  useEffect(() => {
    if (
      localStorage.getItem('accessToken') &&
      localStorage.getItem('refreshToken')
    ) {
      dispatch({
        type: ACTION.LOGIN,
        data: {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        },
      })
    }

  }, [])
  const getAllStoreData = async () => {
    try {
      //  dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        const action = getStore(res.data.data)
        dispatch(action)
        // alert('123')
        // var arrayDistrict = []
        // var arrayProvince = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   arrayDistrict.push(values.district)
        //   arrayProvince.push(values.province)
        // })
        // setDistrict([...arrayDistrict])
        // setProvince([...arrayProvince])
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    getAllStoreData();
  }, []);
  return (
    <>
      {/* <Online>

      </Online>
      <Offline>
        <Modal
          title="Thông báo"
          centered
          header={null}
          visible={modal2Visible}
          footer={null}

        >
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}>Kết nối mạng bị lỗi, xin vui lòng kiểm tra lại.!!!</div>
        </Modal>


      </Offline> */}

      <Router>
        <Loading />
        <Switch>
          <CheckRouter path="/" exact component={Login} />
          <PrivateRouter path="/report-import/:slug" component={ReportImport} />
          <PrivateRouter path="/user/:slug" component={User} />
          <PrivateRouter path="/import-export-file/:slug" component={ImportExportFile} />
          <PrivateRouter path="/product-check/:slug" component={ProductCheck} />
          <PrivateRouter path="/accumulate-point/:slug" component={AccumulatePoint} />
          <PrivateRouter path="/order-list/:slug" component={OrderList} />
          <PrivateRouter path="/report-financial/:slug" component={ReportFinancial} />
          <PrivateRouter path="/report-inventory/:slug" component={ReportInventory} />
          <PrivateRouter path="/report-end-day/:slug" component={ReportEndDay} />
          <PrivateRouter path="/shipping-control/:slug" component={ShippingControl} />
          <PrivateRouter path="/guarantee/:slug" component={Guarantee} />
          <PrivateRouter path="/orders/:slug" component={Orders} />
          <PrivateRouter path="/shipping-product/:slug" component={ShippingProduct} />
          <PrivateRouter path="/business/:slug" component={Business} />
          <PrivateRouter path="/branch/:slug" component={Branch} />

          <PrivateRouter path="/configuration-store/:slug" component={ConfigurationStore} />
          <CheckRouter path="/otp/:slug/:slug1" component={OTP} />
          <CheckRouter path="/password-new/:slug" component={PasswordNew} />
          <CheckRouter path="/vertifyaccount/:slug" component={UID} />
          <CheckRouter path="/forget-password" component={ForgetPassword} />
          <Route path="/overview/:slug" component={Overview} />
          <PrivateRouter path="/sell/:slug" component={Sell} />
          <PrivateRouter path="/store/:slug" component={Store} />
          <PrivateRouter path="/activity-diary/:slug" component={ActivityDiary} />

          <PrivateRouter path="/actions/order-list/view/:slug" component={OrderListView} />
          <PrivateRouter path="/actions/user/add/:slug" component={UserAdd} />
          <PrivateRouter path="/actions/business/view/:slug" component={BusinessView} />
          <PrivateRouter path="/actions/user/update/:slug" component={UserUpdate} />

          <PrivateRouter path="/actions/guarantee/view/:slug" component={GuaranteeView} />
          <PrivateRouter path="/actions/guarantee/update/:slug" component={GuaranteeUpdate} />
          <PrivateRouter path="/actions/guarantee/add/:slug" component={GuaranteeAdd} />
          <PrivateRouter path="/actions/business/view/:slug" component={BusinessView} />
          <PrivateRouter path="/actions/business/update/:slug" component={BusinessUpdate} />
          <PrivateRouter path="/actions/business/add/:slug" component={BusinessAdd} />
          <PrivateRouter path="/actions/tax/add/:slug" component={TaxAdd} />
          <PrivateRouter path="/actions/tax/update/:slug" component={TaxUpdate} />
          <PrivateRouter path="/actions/branch/view/:slug/:slug2" component={BranchView} />
          <PrivateRouter path="/actions/shipping-product/add/:slug" component={ShippingProductAdd} />
          <PrivateRouter path="/actions/shipping-product/view/:slug" component={ShippingProductView} />
          <PrivateRouter path="/actions/shipping-product/update/:slug" component={DeliveryUpdate} />
          <PrivateRouter path="/actions/shipping-control/update/:slug" component={ShippingControlUpdate} />
          <PrivateRouter path="/actions/shipping-control/add/:slug" component={ShippingControlAdd} />
          <PrivateRouter path="/actions/shipping-control/view/:slug" component={ShippingControlView} />
          <PrivateRouter path="/actions/product/update/:slug" component={ProductUpdate} />
          <PrivateRouter path="/actions/product/view/:slug" component={ProductView} />
          <PrivateRouter path="/actions/revenue-cost/view/:slug" component={RevenueCostView} />
          <PrivateRouter path="/actions/sale-detail/view/:slug" component={SaleDetailView} />
          <PrivateRouter path="/actions/order-information/view/:slug" component={OrderInformatonView} />
          <PrivateRouter path="/actions/order-information/view-product/:slug" component={OrderInformationViewProduct} />
          <PrivateRouter path="/actions/inventory/view/:slug" component={InventoryView} />
          <PrivateRouter path="/actions/inventory/update/:slug" component={InventoryUpdate} />
          <PrivateRouter path="/actions/card-accumulate-point/view/:slug" component={CardAccumulatePoint} />
          <PrivateRouter path="/actions/accumulate-point-setting/view/:slug" component={AccumulatePointSettingView} />
          <PrivateRouter path="/actions/card-accumulate-point/add" component={CardAccumulatePointAdd} />
          <PrivateRouter path="/actions/accumulate-point-edit/view/:slug" component={AccumulatePointEditView} />
          <PrivateRouter path="/actions/accumulate-point-edit/add" component={AccumulatePointEditAdd} />
          <PrivateRouter path="/actions/accumulate-point-edit/detail/:slug" component={AccumulatePointEditDetail} />
          <PrivateRouter path="/actions/product-check/add/:slug" component={ProductCheckAdd} />
          <PrivateRouter path="/actions/product-check/view/:slug" component={ProductCheckView} />
          <PrivateRouter path="/order-create-shipping/:slug" component={OrderCreateShipping} />
          <PrivateRouter path="/actions/order-create-shipping/add/:slug" component={OrderCreateShippingAdd} />

          <PrivateRouter path="/actions/store/add" component={StoreAdd} />
          <PrivateRouter path="/actions/employee/view/:slug" component={EmployeeView} />
          <PrivateRouter path="/actions/shipping/update/:slug" component={ShippingUpdate} />
          <PrivateRouter path="/actions/shipping/view/:slug" component={ShippingView} />
          <PrivateRouter path="/actions/shipping/add/:slug" component={ShippingAdd} />
          <PrivateRouter path="/actions/orders/add" component={OrdersAdd} />
          <PrivateRouter path="/actions/customer/view/:slug" component={CustomerView} />
          <PrivateRouter path="/actions/customer/update/:slug" component={CustomerUpdate} />
          <PrivateRouter path="/actions/supplier/update/:slug" component={SupplierUpdate} />
          <PrivateRouter path="/actions/orders/view" component={OrdersView} />
          <PrivateRouter path="/delivery/:slug" component={Delivery} />
          <PrivateRouter path="/exchange/:slug" component={Exchange} />
          <PrivateRouter path="/inventory/:slug" component={Inventory} />
          <PrivateRouter path="/product/:slug" component={Product} />
          <PrivateRouter path="/payment/:slug" component={Payment} />
          <PrivateRouter path="/reven-expen/:slug" component={RevenExpend} />
          <PrivateRouter path="/tax/:slug" component={Tax} />
          <PrivateRouter path="/employee/:slug" component={Employee} />
          <PrivateRouter path="/shipping/:slug" component={Shipping} />
          <PrivateRouter path="/customer/:slug" component={Customer} />
          <PrivateRouter path="/supplier/:slug" component={Supplier} />
          <PrivateRouter path="/promotion/:slug" component={Promotion} />
          <PrivateRouter path="/role/:slug" component={Role} />
          {/* <PrivateRouter path="/users" component={Users} /> */}
          <PrivateRouter path="/actions/orders/edit" component={OrdersEdit} />
          <PrivateRouter path="/actions/inventory/add/:slug" component={InventoryAdd} />
          <PrivateRouter path="/actions/product/add/:slug" component={ProductAdd} />
          <PrivateRouter path="/actions/reven-expen/add/:slug" component={RevenExpenAdd} />
          <PrivateRouter path="/actions/employee/add/:slug" component={EmployeeAdd} />
          <PrivateRouter path="/actions/employee/delete" component={EmployeeDelete} />
          <PrivateRouter path="/actions/employee/edit/:slug" component={EmployeeEdit} />
          <PrivateRouter path="/actions/customer/add/:slug" component={CustomerAdd} />
          <PrivateRouter path="/actions/supplier/add/:slug" component={SupplierAdd} />
          <PrivateRouter path="/actions/supplier/information/:slug" component={SupplierInformation} />
          <PrivateRouter path="/actions/supplier/view/:slug" component={SupplierView} />
          <PrivateRouter path="/actions/promotion/add/:slug" component={PromotionAdd} />
          <PrivateRouter path="/actions/role/add" component={RoleAdd} />
        </Switch>
      </Router>


      {/* //  <>
    //    <Loading />
    //    <Views />
    //  </>


    // phần router này đã setup theo admin2 ở file index.js
    // nhưng ở giao diện UI.js có phần phân quyền nên setup sẵn index.js đợi a hoàng chỉnh ở UI.js */}

    </>
  );
}

export default App;
