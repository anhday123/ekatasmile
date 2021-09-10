import styles from './orderDetail.module.scss'
import { Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import moment from 'moment'
export default function CustoemrOrderDetail() {
  const history = useHistory()
  return (
    <div className={styles['order-detail']}>
      <Row
        style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}
        justify="space-between"
      >
        <Col>
          <Row align="middle" style={{ fontSize: 20, fontWeight: 600 }}>
            <Link to={ROUTES.CUSTOMER_ORDER_LIST} style={{ color: '#000' }}>
              <ArrowLeftOutlined style={{ marginRight: 7 }} />
            </Link>
            Đơn hàng {history.location.state.code} &nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ fontSize: 16, fontWeight: 'normal', lineHeight: 1 }}>
              {moment('2021-09-07T15:14:09+07:00').format(
                'DD-MM-YYYY hh:mm:ss'
              )}
            </span>
          </Row>
        </Col>
        <Col style={{ fontSize: 16 }}>
          Trạng thái đơn hàng:{' '}
          <span style={{ color: '#0EAC00' }}>Hoàn thành</span>
        </Col>
      </Row>
    </div>
  )
}
