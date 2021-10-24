import React, { useState } from 'react'

import { Modal, Space, Input, Select, Table, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function OrdersReturn() {
  const [visible, setVisible] = useState(true)
  const toggle = () => setVisible(!visible)

  const columns = [
    {
      title: 'Mã đơn hàng',
    },
    {
      title: 'Khách hàng',
    },
    {
      title: 'Tổng tiền',
    },
    {
      title: 'Chiết khấu',
    },
    {
      title: 'Thành tiền',
    },
    {
      title: 'Khách đã trả',
    },
    {
      title: 'Thu ngân',
    },
    {
      render: () => (
        <Button
          style={{
            backgroundColor: '#0877DE',
            borderColor: '#0877DE',
            borderRadius: '3px',
          }}
        >
          Chọn
        </Button>
      ),
    },
  ]

  return (
    <>
      <Modal
        width={900}
        visible={visible}
        onCancel={toggle}
        title="Danh sách đơn hàng trả"
        footer={null}
      >
        <div>
          <Space style={{ marginBottom: 25 }}>
            <Input
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
          <Table style={{ width: '100%' }} />
        </div>
      </Modal>
    </>
  )
}
