import styles from "./../report-financial/report-financial.module.scss";
import React from "react";
import {  Row, Col, } from "antd";
import {

  Link,

} from "react-router-dom";
import report_cost from './../../assets/img/report_cost.png'
import money from './../../assets/img/money.png'
import { ROUTES } from "consts";

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

  return (
    <>
      <div className={`${styles["promotion_manager"]}`}>
        <div style={{ display: 'flex', borderBottom: '1px solid grey', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Báo cáo tài chính</div>
        </div>

        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col className={`${styles['hover_item']} ${styles["card"]}`} style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to={ROUTES.REPORT_FINANCIAL_VIEW} style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={report_cost} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#18A375', fontSize: '1.25rem', fontWeight: '600' }}>Báo cáo chi tiết bán hàng</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Theo dõi các khoản chi phí của cửa hàng</div>
              </div>
            </Link>
          </Col>
          <Col className={`${styles['hover_item']} ${styles["card"]}`} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to={ROUTES.REPORT_REVENUE_VIEW} style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={money} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#18A375', fontSize: '1.25rem', fontWeight: '600' }}>Báo cáo chi phí doanh thu</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Theo dõi doanh thu, lợi nhuận của cửa hàng</div>
              </div>
            </Link>
          </Col>
        </Row>

      </div>

    </>
  );
}
