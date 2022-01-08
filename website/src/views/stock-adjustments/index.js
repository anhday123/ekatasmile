import React from 'react'
import styles from './stock-adjustments.module.scss'
import { ROUTES } from 'consts'
import { Link } from 'react-router-dom'

//components
import TitlePage from 'components/title-page'
import Permission from 'components/permission'
import locale from 'antd/es/date-picker/locale/zh_CN'

//antd
import { Row, Col, Input, Button, DatePicker } from 'antd'

//icons
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons'

export default function Reports() {
  return (
    <div className={`${styles['card']} ${styles['stock-adjustments']}`}>
      <TitlePage title="Phiếu kiểm hàng">
        <Button type="primary" size="large">
          Tạo phiếu kiểm
        </Button>
      </TitlePage>
      <Row gutter={[16, 16]} style={{ marginTop: 25 }}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo mã phiếu kiểm hàng"
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <DatePicker.RangePicker size="large" />
        </Col>
      </Row>
    </div>
  )
}
