import styles from './../inventory/inventory.module.scss'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  Switch,
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  notification,
  Col,
  DatePicker,
  Select,
  Table,
  Typography,
} from 'antd'

import { SearchOutlined } from '@ant-design/icons'

import { compare } from 'utils'
const { Option } = Select
const { Text } = Typography
const { RangePicker } = DatePicker

export default function Inventory() {
  const [filter, setFilter] = useState({ search: '' })
  const columns = [
    {
      title: 'Ảnh',
    },
    {
      title: 'Tên sản phẩm',
    },
    {
      title: 'Có thể bán',
    },
    {
      title: 'Tồn kho',
    },
  ]
  return (
    <div className={styles['inventory']}>
      <Row
        align="middle"
        style={{
          borderBottom: 'solid 1px #B4B4B4',
          paddingBottom: '10px',
          fontSize: 20,
          fontWeight: 600,
          marginBottom: '1em',
        }}
      >
        <Col>Quản lý kho</Col>
      </Row>
      <Row gutter={[30, 20]} style={{ margin: '1em 0' }}>
        <Col xs={24} lg={8}>
          <Input
            placeholder="Tìm kiếm theo mã, theo tên"
            prefix={<SearchOutlined style={{ color: '#bdc3c7' }} />}
            size="large"
          />
        </Col>
        <Col xs={24} lg={8}>
          <RangePicker size="large" style={{ borderRadius: '1em' }} />
        </Col>
      </Row>
      <Row style={{ margin: '1em 0' }} justify="end">
        <Button type="primary" size="large">
          Xóa bộ lọc
        </Button>
      </Row>
      <Table columns={columns} size="small" />
    </div>
  )
}
