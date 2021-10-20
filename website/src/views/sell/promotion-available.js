import React, { useState } from 'react'

import { Modal, Row, Col, Button, Radio, Space, Input } from 'antd'

import gift from 'assets/icons/gift.png'

export default function PromotionAvailable() {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const promotions = [
    { title: 'Khuyến mãi hè 2021', value: 100000, price: 100000 },
    { title: 'Khuyến mãi trung thu 2021', value: 500000, price: 500000 },
    { title: 'Khuyến mãi xuân 2022', value: 20, price: 600000 },
  ]

  return (
    <>
      <img
        onClick={toggle}
        src={gift}
        alt=""
        style={{ width: 16, height: 16, marginLeft: 8, cursor: 'pointer' }}
      />
      <Modal
        width={700}
        visible={visible}
        title="Khuyến mãi khả dụng"
        onCancel={toggle}
        footer={
          <Row justify="end">
            <Button
              type="primary"
              style={{
                backgroundColor: '#0877DE',
                borderRadius: 5,
                borderColor: '#0877DE',
              }}
            >
              Áp dụng
            </Button>
          </Row>
        }
      >
        <Row>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Chương trình khuyến mãi</h3>
          </Col>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Giá trị</h3>
          </Col>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Hạn mức áp dụng</h3>
          </Col>
        </Row>
        {promotions.map((promotion) => (
          <Row>
            <Col xs={8} sm={8}>
              <Radio>{promotion.title}</Radio>
            </Col>
            <Col xs={8} sm={8}>
              <p style={{ textAlign: 'center' }}>{promotion.value}</p>
            </Col>
            <Col xs={8} sm={8}>
              <p style={{ textAlign: 'center' }}>{promotion.price}</p>
            </Col>
          </Row>
        ))}
        <div style={{ marginTop: 15 }}>
          <h3 style={{ marginBottom: 0, fontSize: 17 }}>Nhập voucher</h3>
          <Space wrap={false}>
            <Input placeholder="Nhập voucher" style={{ width: 300 }} />
            <Button
              type="primary"
              style={{
                backgroundColor: '#0877DE',
                borderRadius: 5,
                borderColor: '#0877DE',
              }}
            >
              Kiểm tra
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  )
}
