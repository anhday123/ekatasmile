import UI from "../../../../components/Layout/UI";
import {
  Link,

} from "react-router-dom";
import styles from "./../view/view.module.scss";
import { Input, Row, Col } from "antd";
import { ArrowLeftOutlined, ShopOutlined, ShoppingCartOutlined, BranchesOutlined, FormOutlined, TeamOutlined } from "@ant-design/icons";
export default function BusinessView() {
  return (
    <UI>
      <div className={styles['business']}>
        <Link to="/business/5" className={styles['business_title']}>
          <div><ArrowLeftOutlined /></div>
          <div>Thông tin chi tiết doanh nghiệp 1</div>
        </Link>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} className={styles['business_content']}>
          <Col className={styles['hover_item']} xs={24} sm={24} md={11} lg={7} xl={7} style={{ width: '100%', marginTop: '1rem', border: '1px solid #342CDB', borderRadius: '0.5rem', padding: '1rem', marginRight: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#342CDB', fontSize: '1.5rem', fontWeight: '700' }}>100</div>
                <div style={{ backgroundColor: '#D6D5F8', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '50%', padding: '0.5rem' }}><ShopOutlined style={{ fontSize: '1.25rem', color: '#342CDB' }} /></div>
              </div>
              <div style={{ color: 'black', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '400' }}>Số lượng cửa hàng</div>
            </div>
          </Col >
          <Col className={styles['hover_item']} xs={24} sm={24} md={11} lg={7} xl={7} style={{ width: '100%', marginTop: '1rem', border: '1px solid #DB7337', borderRadius: '0.5rem', padding: '1rem', marginRight: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#DB7337', fontSize: '1.5rem', fontWeight: '700' }}>600</div>
                <div style={{ backgroundColor: '#F8E3D7', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '50%', padding: '0.5rem' }}><BranchesOutlined style={{ fontSize: '1.25rem', color: '#DB7337' }} /></div>
              </div>
              <div style={{ color: 'black', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '400' }}>Số lượng chi nhánh</div>
            </div>
          </Col >
          <Col className={styles['hover_item']} xs={24} sm={24} md={11} lg={7} xl={7} style={{ width: '100%', marginTop: '1rem', border: '1px solid #207BDB', borderRadius: '0.5rem', padding: '1rem', marginRight: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#207BDB', fontSize: '1.5rem', fontWeight: '700' }}>90</div>
                <div style={{ backgroundColor: '#D2E5F8 ', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '50%', padding: '0.5rem' }}><TeamOutlined style={{ fontSize: '1.25rem', color: '#207BDB' }} /></div>
              </div>
              <div style={{ color: 'black', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '400' }}>Số lượng nhân viên</div>
            </div>
          </Col >
          <Col className={styles['hover_item']} xs={24} sm={24} md={11} lg={7} xl={7} style={{ width: '100%', marginTop: '1rem', border: '1px solid #DBB90B', borderRadius: '0.5rem', padding: '1rem', marginRight: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#DBB90B', fontSize: '1.5rem', fontWeight: '700' }}>1200</div>
                <div style={{ backgroundColor: '#F8F1CE ', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '50%', padding: '0.5rem' }}><ShoppingCartOutlined style={{ fontSize: '1.25rem', color: '#DBB90B' }} /></div>
              </div>
              <div style={{ color: 'black', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '400' }}>Số lượng sản phẩm</div>
            </div>
          </Col >
          <Col className={styles['hover_item']} xs={24} sm={24} md={11} lg={7} xl={7} style={{ width: '100%', marginTop: '1rem', border: '1px solid #16DBD9', borderRadius: '0.5rem', padding: '1rem', marginRight: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#16DBD9', fontSize: '1.5rem', fontWeight: '700' }}>4000</div>
                <div style={{ backgroundColor: '#D0F8F7 ', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderRadius: '50%', padding: '0.5rem' }}><FormOutlined style={{ fontSize: '1.25rem', color: '#16DBD9' }} /></div>
              </div>
              <div style={{ color: 'black', marginTop: '0.5rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '400' }}>Số lượng đơn hàng</div>
            </div>
          </Col >
        </Row>
      </div>
    </UI >
  );
}
