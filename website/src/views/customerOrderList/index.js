import { ArrowLeftOutlined } from '@ant-design/icons'
import { Col, Row, Tabs } from 'antd'
import { ROUTES } from 'consts'
import { Link } from 'react-router-dom'
import OrderCancel from './components/orderCancel'
import OrderPaid from './components/orderPaid'
import OrderReturn from './components/orderReturn'
import styles from './customerOrderList.module.scss'
const { TabPane } = Tabs
export default function CustomerOrderList() {
  return (
    <div className={styles['customer-order-list']}>
      <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
        <Col>
          <Row align="middle" style={{ fontSize: 20, fontWeight: 600 }}>
            <Link to={ROUTES.CUSTOMER} style={{ color: '#000' }}>
              <ArrowLeftOutlined style={{ marginRight: 7 }} />
            </Link>{' '}
            Danh sách các đơn hàng
          </Row>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span style={{ fontWeight: 500, fontSize: 16 }}>Đơn hàng mua</span>
          }
          key="1"
        >
          <OrderPaid />
        </TabPane>
        <TabPane
          tab={
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              Đơn hàng trả lại
            </span>
          }
          key="2"
        >
          <OrderReturn />
        </TabPane>
        <TabPane
          tab={
            <span style={{ fontWeight: 500, fontSize: 16 }}>Đơn hàng hủy</span>
          }
          key="3"
        >
          <OrderCancel />
        </TabPane>
      </Tabs>
    </div>
  )
}
