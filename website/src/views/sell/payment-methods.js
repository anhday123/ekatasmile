import React, { useState } from 'react'

import {
  Modal,
  Row,
  Button,
  Select,
  InputNumber,
  Space,
  Popconfirm,
} from 'antd'
import {
  IdcardOutlined,
  UsergroupDeleteOutlined,
  CreditCardOutlined,
  DollarOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { formatCash } from 'utils'

export default function PaymentMethods({}) {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [payments, setPayments] = useState([])

  const _inputValue = (value, index) => {
    let paymentsNew = [...payments]
    paymentsNew[index].value = value
    setPayments([...paymentsNew])
  }

  const _changePaymentMethod = (value, index) => {
    let paymentsNew = [...payments]
    paymentsNew[index].name = value
    setPayments([...paymentsNew])
  }

  const _addPaymentMethod = (payment) => {
    let paymentsNew = [...payments]
    paymentsNew.push({ name: payment, value: 0 })
    setPayments([...paymentsNew])
  }

  const _removePaymentMethod = (index) => {
    let paymentsNew = [...payments]
    paymentsNew.splice(index, 1)
    setPayments([...paymentsNew])
  }

  return (
    <>
      <a onClick={toggle}>Chọn hình thức thanh toán</a>
      <Modal
        width={540}
        footer={
          <Row justify="end">
            <Button
              style={{
                width: 100,
                backgroundColor: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
                color: 'white',
              }}
            >
              Lưu
            </Button>
          </Row>
        }
        title="Phương thức thanh toán"
        onCancel={toggle}
        visible={visible}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row justify="space-between">
            <p>Khách phải trả</p>
            <p>{formatCash(100000)}</p>
          </Row>

          <Row wrap={false} justify="space-between" align="middle">
            <Button
              onClick={() => _addPaymentMethod('1')}
              icon={<IdcardOutlined />}
              style={{
                backgroundColor: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
                color: 'white',
              }}
            >
              Quẹt thẻ
            </Button>
            <Button
              onClick={() => _addPaymentMethod('2')}
              icon={<UsergroupDeleteOutlined />}
              style={{
                color: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
              }}
            >
              COD
            </Button>
            <Button
              onClick={() => _addPaymentMethod('3')}
              icon={<CreditCardOutlined />}
              style={{
                backgroundColor: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
                color: 'white',
              }}
            >
              Chuyển khoản
            </Button>
            <Button
              onClick={() => _addPaymentMethod('4')}
              icon={<DollarOutlined />}
              style={{
                color: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
              }}
            >
              Tiền mặt
            </Button>
          </Row>
          <Space direction="vertical" style={{ width: '100%' }}>
            {payments.map((payment, index) => {
              const SelectPayments = () => (
                <Select
                  onChange={(value) => _changePaymentMethod(value, index)}
                  defaultValue={payment.name}
                  style={{ width: 150 }}
                  bordered={false}
                  placeholder="Chọn phương thức thanh toán"
                >
                  <Select.Option value="1">Quẹt thẻ</Select.Option>
                  <Select.Option value="2">COD</Select.Option>
                  <Select.Option value="3">Chuyển khoản</Select.Option>
                  <Select.Option value="4">Tiền mặt</Select.Option>
                </Select>
              )

              const InputValue = () => (
                <InputNumber
                  onBlur={(e) => _inputValue(e.target.value, index)}
                  defaultValue={payment.value}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: 230 }}
                  min={0}
                  placeholder="Tiền khách trả"
                  bordered={false}
                />
              )

              return (
                <Row justify="space-between" align="middle" wrap={false}>
                  <div style={{ borderBottom: '0.75px solid #C9C8C8' }}>
                    <SelectPayments />
                  </div>
                  <Row wrap={false} align="middle">
                    <div style={{ borderBottom: '0.75px solid #C9C8C8' }}>
                      <InputValue />
                    </div>
                    <Popconfirm
                      onConfirm={() => _removePaymentMethod(index)}
                      okText="Đồng ý"
                      cancelText="Từ chối"
                      title="Bạn có muốn xoá phương thức thanh toán này ?"
                    >
                      <DeleteOutlined
                        style={{
                          fontSize: 15,
                          color: 'red',
                          cursor: 'pointer',
                          marginLeft: 10,
                        }}
                      />
                    </Popconfirm>
                  </Row>
                </Row>
              )
            })}
          </Space>
          <Row justify="space-between">
            <p>Tổng tiền khách phải trả</p>
            <p>{formatCash(600000)}</p>
          </Row>
          <Row justify="space-between">
            <p>Tiền thừa</p>
            <p>0</p>
          </Row>
        </Space>
      </Modal>
    </>
  )
}
