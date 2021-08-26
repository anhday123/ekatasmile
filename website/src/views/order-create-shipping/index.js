import styles from './order-create-shipping.module.scss'
import { Row, Col, Divider, Input, Button, Table, InputNumber } from 'antd'
import { useHistory } from 'react-router-dom'
import React from 'react'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
export default function OrderCreateShipping() {
  let history = useHistory()
  const columns = [
    {
      title: 'Sản phẩm',
      render(data) {
        return (
          <div>
            <Row gutter={10}>
              <Col>
                <img src={data.img} width="50" />
              </Col>
              <Col>
                <div>{data.name}</div>
                <div>{data.option}</div>
                <div>{data.sku}</div>
              </Col>
            </Row>
          </div>
        )
      },
    },
    {
      title: 'Số lượng',
      render(data) {
        return <InputNumber />
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render(data) {
        return formatCash(data)
      },
    },
    {
      title: 'Thành  tiền',
    },
  ]
  const data = [
    {
      img: 'https://storage.googleapis.com/viesoftware0710/1629148696927_viesoftware0710_0.webp',
      name: 'Áo có slogan',
      option: 'Đen/L',
      sku: 'AO966',
      price: 100000,
    },
  ]
  return (
    <div className={styles['order-create-shipping']}>
      <div style={{ background: 'white', padding: '20px' }}>
        <Row align="middle" style={{ fontSize: 18, fontWeight: 600 }}>
          <ArrowLeftOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => history.push('/order-list')}
          />
          Tạo đơn hàng
        </Row>
        <Divider />
        <Row gutter={30}>
          <Col span={16}>
            <div className={styles['block']}>
              <div className={styles['title']}>Sản phẩm</div>
              <Input.Search
                enterButton="Tìm kiếm"
                style={{ marginBottom: 20 }}
              />
              <Table columns={columns} size="small" dataSource={data} />
            </div>
            <div className={styles['block']} style={{ marginTop: 30 }}>
              <div className={styles['title']}>Thanh toán</div>
              <Row gutter={20}>
                <Col span={12}>
                  <div style={{ fontWeight: 500 }}>Ghi chú đơn hàng</div>
                  <Input placeholder="Ghi chú đơn hàng tại đây" />
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={12}>Số lượng sản phẩm</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Tổng tiền hàng</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span style={{ color: 'blue' }}>Giảm giá</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Tạm tính</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span style={{ color: 'blue' }}>Phí vận chuyển</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <b>Phải thu</b>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Divider />
            <Row justify="end">
              <Button type="primary" style={{ marginRight: 20 }}>
                Đã thanh toán
              </Button>
              <Button type="primary" disabled>
                Thanh toán sau
              </Button>
            </Row>
          </Col>
          <Col span={8}>
            <div className={styles['block']}>
              <Row justify="space-between" className={styles['title']}>
                <div>Khách hàng</div>
                <div style={{ cursor: 'pointer' }}>
                  <PlusOutlined /> Tạo khách hàng
                </div>
              </Row>
              <Input
                placeholder="Tìm kiếm khách hàng"
                prefix={<SearchOutlined />}
              />
              <Divider />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
