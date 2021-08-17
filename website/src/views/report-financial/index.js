import UI from "../../components/Layout/UI";
import styles from "./../report-financial/report-financial.module.scss";
import React, { useState } from "react";
import { Input, Row, Col, } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import report_cost from './../../assets/img/report_cost.png'
import money from './../../assets/img/money.png'

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  });
}
export default function ReportFinancial() {
  const { Search } = Input;
  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/customer/view" style={{ color: '#2400FF' }}>GH {i}</Link>,
      customerName: `Văn Tỷ ${i}`,
      customerType: `Tiềm năng ${i}`,
      branch: `Chi nhánh ${i}`,
      birthDay: `2021/06/28 ${i}`,
      email: `anhhung_so11@yahoo.com`,
      phoneNumber: '0384943497',
      address: '27/27, đường Ngô Y Linh',
      district: 'Bình Tân',
      city: 'Hồ Chí Minh',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/customer/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <div style={{ color: '#0036F3', cursor: 'pointer' }}>{i}</div>,
      productName: `tên sản phẩm ${i}`,
      productQuantity: i,
      goodsCode: `BS5426${i}`,
      code: `8546${i}`,
      supplier: `Hưng Thịnh`,
      importDate: "2021/07/02",
    });
  }
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid grey', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Báo cáo tài chính</div>
          {/* <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/show">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </div> */}
        </div>

        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to="/actions/sale-detail/view/16" style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', border: '1px solid #1A3873', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={report_cost} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#18A375', fontSize: '1.25rem', fontWeight: '600' }}>Báo cáo chi tiết bán hàng</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Theo dõi các khoản chi phí của cửa hàng</div>
              </div>
            </Link>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to="/actions/revenue-cost/view/16" style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', border: '1px solid #1A3873', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={money} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#18A375', fontSize: '1.25rem', fontWeight: '600' }}>Báo cáo chi phí doanh thu</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Theo dõi doanh thu, lợi nhuận của cửa hàng</div>
              </div>
            </Link>
          </Col>
        </Row>

      </div>

    </UI>
  );
}
