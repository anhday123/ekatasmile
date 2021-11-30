import React, { useEffect, useState } from 'react'

import { Modal, Row, Button, InputNumber, Space, Popconfirm, Input } from 'antd'
import {
  IdcardOutlined,
  UsergroupDeleteOutlined,
  CreditCardOutlined,
  DollarOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { formatCash } from 'utils'

export default function PaymentMethods({
  editInvoice,
  invoices,
  indexInvoice,
  moneyToBePaidByCustomer,
  setVisible,
  visible,
}) {
  const toggle = () => setVisible(!visible)

  const [payments, setPayments] = useState([])
  const [costPaid, setCostPaid] = useState(0)
  const [excessCash, setExcessCash] = useState(0)

  const _inputValue = (value, index) => {
    let paymentsNew = [...payments]
    paymentsNew[index].value = value

    const sumCostPaid = paymentsNew.reduce((total, current) => total + current.value, 0)
    const excessCash = sumCostPaid - moneyToBePaidByCustomer

    setExcessCash(excessCash >= 0 ? excessCash : 0)
    setCostPaid(sumCostPaid)
    setPayments([...paymentsNew])
  }

  const _addPaymentMethod = (payment) => {
    let paymentsNew = [...payments]
    if (!paymentsNew.find((p) => p.method === payment)) {
      paymentsNew.push({ method: payment, value: 0 })
      setPayments([...paymentsNew])
    }
  }

  const _removePaymentMethod = (index) => {
    let paymentsNew = [...payments]
    paymentsNew.splice(index, 1)

    const sumCostPaid = paymentsNew.reduce((total, current) => total + current.value, 0)
    const excessCash = sumCostPaid - moneyToBePaidByCustomer

    setExcessCash(excessCash >= 0 ? excessCash : 0)
    setCostPaid(sumCostPaid)
    setPayments([...paymentsNew])
  }

  const _savePayments = () => {
    editInvoice('payments', payments)
    if (invoices[indexInvoice].isDelivery) editInvoice('prepay', costPaid)
    else editInvoice('moneyGivenByCustomer', costPaid)
    toggle()
  }

  const _exit = () => {
    toggle()
    setPayments(invoices[indexInvoice].payments && invoices[indexInvoice].payments)
  }

  useEffect(() => {
    if (visible) {
      setPayments([...invoices[indexInvoice].payments])

      if (invoices[indexInvoice].isDelivery) setCostPaid(invoices[indexInvoice].prepay)
      else setCostPaid(invoices[indexInvoice].moneyGivenByCustomer)

      setExcessCash(excessCash)
    }
  }, [visible])

  return (
    <>
      <p onClick={_exit} style={{ marginBottom: 0, color: '#1890ff', cursor: 'pointer' }}>
        Chọn hình thức thanh toán (F8)
      </p>
      <Modal
        width={540}
        footer={
          <Row justify="end">
            <Button style={{ width: 100, borderRadius: 5 }} onClick={_exit}>
              Thoát
            </Button>
            <Button
              onClick={_savePayments}
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
        <Space direction="vertical" size="middle" style={{ width: '100%', fontSize: 18 }}>
          <Row justify="space-between" style={{ fontWeight: 600 }}>
            <p>Khách phải trả</p>
            <p>{formatCash(moneyToBePaidByCustomer)}</p>
          </Row>

          <Row wrap={false} justify="space-between" align="middle">
            <Button
              onClick={() => _addPaymentMethod('COD')}
              icon={<UsergroupDeleteOutlined />}
              style={{
                color: '#3579FE',
                borderColor: '#3579FE',
                borderRadius: 5,
                display: invoices[indexInvoice].isDelivery && 'none',
              }}
            >
              COD
            </Button>
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
          </Row>
          <Space direction="vertical" style={{ width: '100%' }}>
            {payments.map((payment, index) => {
              const SelectPayments = () => (
                <Input
                  value={payment.method}
                  style={{ width: 150, pointerEvents: 'none' }}
                  bordered={false}
                  placeholder="Chọn phương thức thanh toán"
                />
              )

              const InputValue = () => (
                <InputNumber
                  onBlur={(e) => {
                    const value = e.target.value.replaceAll(',', '')
                    _inputValue(+value, index)
                  }}
                  defaultValue={payment.value}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
