import React, { useState } from 'react'

import {
  Modal,
  Row,
  Button,
  Select,
  InputNumber,
  Space,
  Popconfirm,
  Input,
} from 'antd'
import {
  IdcardOutlined,
  UsergroupDeleteOutlined,
  CreditCardOutlined,
  DollarOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { formatCash } from 'utils'

export default function PaymentMethods() {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const COST = 1000000
  const [payments, setPayments] = useState([{ name: 'Quẹt thẻ', value: '0' }])
  const [costPaid, setCostPaid] = useState('0')
  const [excessCash, setExcessCash] = useState('0')

  const _inputValue = (value, index) => {
    let paymentsNew = [...payments]
    paymentsNew[index].value = value
    const sumCostPaid = paymentsNew.reduce(
      (total, current) => total + +current.value.replaceAll(',', ''),
      0
    )
    const excessCash = sumCostPaid > COST ? +sumCostPaid - COST : '0'

    setExcessCash(excessCash)
    setCostPaid(sumCostPaid)
    setPayments([...paymentsNew])
  }

  const _changePaymentMethod = (value, index) => {
    let paymentsNew = [...payments]
    paymentsNew[index].name = value
    setPayments([...paymentsNew])
  }

  const _addPaymentMethod = (payment) => {
    let paymentsNew = [...payments]
    if (!paymentsNew.find((p) => p.name === payment)) {
      paymentsNew.push({ name: payment, value: '0' })
      setPayments([...paymentsNew])
    }
  }

  const _removePaymentMethod = (index) => {
    let paymentsNew = [...payments]
    paymentsNew.splice(index, 1)
    const sumCostPaid = paymentsNew.reduce(
      (total, current) => total + +current.value.replaceAll(',', ''),
      0
    )
    const excessCash = sumCostPaid > COST ? +sumCostPaid - COST : '0'

    setExcessCash(excessCash)
    setCostPaid(sumCostPaid)
    setPayments([...paymentsNew])
  }

  return (
    <>
      <a onClick={toggle}>Chọn hình thức thanh toán</a>
      <Modal
        width={540}
        footer={
          <Row justify="end">
            <Button style={{ width: 100, borderRadius: 5 }} onClick={toggle}>
              Thoát
            </Button>
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
        <Space
          direction="vertical"
          size="middle"
          style={{ width: '100%', fontSize: 18 }}
        >
          <Row justify="space-between" style={{ fontWeight: 600 }}>
            <p>Khách phải trả</p>
            <p>{formatCash(COST)}</p>
          </Row>

          <Row wrap={false} justify="space-between" align="middle">
            <Button
              onClick={() => _addPaymentMethod('Quẹt thẻ')}
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
              onClick={() => _addPaymentMethod('COD')}
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
              onClick={() => _addPaymentMethod('Chuyển khoản')}
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
              onClick={() => _addPaymentMethod('Tiền mặt')}
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
                <Input
                  value={payment.name}
                  onChange={(value) => _changePaymentMethod(value, index)}
                  style={{ width: 150, pointerEvents: 'none' }}
                  bordered={false}
                  placeholder="Chọn phương thức thanh toán"
                />
              )

              const InputValue = () => (
                <InputNumber
                  onBlur={(e) => {
                    const value = e.target.value
                    _inputValue(value, index)
                  }}
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
          <Row justify="space-between" style={{ fontWeight: 600 }}>
            <p>Tổng tiền khách trả</p>
            <p>{formatCash(costPaid)}</p>
          </Row>
          <Row justify="space-between" style={{ fontWeight: 600 }}>
            <p>Tiền thừa</p>
            <p>{formatCash(excessCash)}</p>
          </Row>
        </Space>
      </Modal>
    </>
  )
}
