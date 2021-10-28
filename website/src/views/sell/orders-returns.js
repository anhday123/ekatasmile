import React, { useEffect, useState, useRef } from 'react'
import { formatCash } from 'utils'

import { Modal, Space, Input, Select, Table, Button, Radio } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

//apis
import { apiAllOrder } from 'apis/order'

export default function OrdersReturn() {
  const typingTimeoutRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [ordersRefund, setOrdersRefund] = useState([])
  const [finalCost, setFinalCost] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [cost, setCost] = useState(0)
  const [customerPaid, setCustomerPaid] = useState(0)

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 5 })
  const [countOrdersRefund, setCountOrdersRefund] = useState([])

  const onSearch = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.keyword = value
      else delete paramsFilter.keyword

      paramsFilter.page = 1
      setParamsFilter(paramsFilter)
      _getOrdersRefund(paramsFilter)
    }, 750)
  }

  const _getOrdersRefund = async (params) => {
    try {
      setLoading(true)
      const res = await apiAllOrder({ ...params, bill_status: 'REFUND' })
      console.log('orders', res)
      if (res.status === 200) {
        setOrdersRefund(res.data.data)
        setCountOrdersRefund(res.data.count)

        let finalCost = 0
        let discount = 0
        let cost = 0
        let customerPaid = 0
        res.data.data.map((order) => {
          finalCost += order.final_cost
          discount += order.total_discount
          cost += order.total_cost
          customerPaid += order.customer_paid
        })

        setFinalCost(finalCost)
        setDiscount(discount)
        setCost(cost)
        setCustomerPaid(customerPaid)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
    },
    {
      title: 'Khách hàng',
    },
    {
      title: 'Tổng tiền',
      render: (text, record) => formatCash(record.final_cost),
    },
    {
      title: 'Chiết khấu',
      render: (text, record) => formatCash(record.total_discount),
    },
    {
      title: 'Thành tiền',
      render: (text, record) => formatCash(record.total_cost),
    },
    {
      title: 'Khách đã trả',
      render: (text, record) => formatCash(record.customer_paid),
    },
    {
      title: 'Thu ngân',
      render: (text, record) =>
        (record.first_name || '') + ' ' + (record.last_name || ''),
    },
    {
      render: () => (
        <Button
          style={{
            backgroundColor: '#0877DE',
            borderColor: '#0877DE',
            borderRadius: '3px',
            color: 'white',
            width: 110,
          }}
        >
          Chọn
        </Button>
      ),
    },
  ]

  useEffect(() => {
    _getOrdersRefund(paramsFilter)
  }, [])

  return (
    <>
      <Radio checked={visible} onClick={toggle}>
        Trả hàng
      </Radio>
      <Modal
        width={1150}
        visible={visible}
        onCancel={toggle}
        title="Danh sách đơn hàng"
        footer={null}
      >
        <div>
          <Space style={{ marginBottom: 25 }}>
            <Input
              onChange={onSearch}
              prefix={<SearchOutlined />}
              style={{ width: 350 }}
              placeholder="Tìm kiếm mã đơn hàng"
            />
            <Select style={{ width: 300 }} placeholder="Lọc theo thời gian">
              <Select.Option>Today</Select.Option>
              <Select.Option>Yesterday</Select.Option>
              <Select.Option>This month</Select.Option>
            </Select>
          </Space>
          <Table
            loading={loading}
            scroll={{ y: 300 }}
            style={{ width: '100%' }}
            dataSource={ordersRefund}
            columns={columns}
            pagination={{
              current: paramsFilter.page,
              defaultPageSize: 20,
              pageSizeOptions: [5],
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                paramsFilter.page = page
                paramsFilter.page_size = pageSize
                setParamsFilter(paramsFilter)
                _getOrdersRefund(paramsFilter)
              },
              total: countOrdersRefund,
            }}
          />
        </div>
      </Modal>
    </>
  )
}
