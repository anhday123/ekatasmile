import React, { useEffect, useState } from 'react'
import styles from './import-inventory.module.scss'

import { Row, Space, Select, Table } from 'antd'
import moment from 'moment'

import { formatCash } from 'utils'

export default function ImportInventory() {
  const [dataInventory, setDataInventory] = useState([])

  const columns = [
    {
      title: 'Số hóa đơn',
      dataIndex: 'billCode',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplier',
    },
    {
      title: 'Kho hàng nhập',
      dataIndex: 'warehouse',
    },
    {
      title: 'Ngày mua hàng',
      dataIndex: 'dateBuy',
    },
    {
      title: 'Tổng tiền (VND)',
      dataIndex: 'sumCost',
    },
    {
      title: 'Số tiền thanh toán (VND)',
      dataIndex: 'sumCostPaid',
    },
    {
      title: 'Số lượng nhập',
      dataIndex: 'quantity',
    },
    {
      title: 'Người tạo đơn',
      dataIndex: 'creator',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
    },
    {
      title: 'Nhập kho',
      dataIndex: 'importInventory',
    },
  ]

  useEffect(() => {
    let data = []

    for (let i = 0; i < 50; i++)
      data.push({
        billCode: Math.floor(Math.random() * 100000),
        supplier: 'NNC',
        warehouse: 'Kho Hà Nội',
        dateBuy: moment(new Date()).format('DD-MM-YYYY HH:mm'),
        sumCost: formatCash(Math.floor(Math.random() * 10000000)),
        sumCostPaid: formatCash(Math.floor(Math.random() * 9000000)),
        quantity: Math.floor(Math.random() * 15),
        creator: 'Nguyễn Văn A',
        payment: formatCash(Math.floor(Math.random() * 9000000)),
      })

    setDataInventory([...data])
  }, [])

  return (
    <div className={`${styles['import-inventory-container']} ${styles['card']}`}>
      <div style={{ fontSize: 18, borderBottom: '1px solid #ece2e2' }}>
        <h3>Nhập kho</h3>
      </div>
      <div style={{ marginTop: 20 }}>
        <Space>
          <div>
            <div>Lọc theo tên nhà cung cấp</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn nhà cung cấp"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="NNC">NCC</Select.Option>
              <Select.Option value="Thực phẩm">Thực phẩm</Select.Option>
              <Select.Option value="Nước giải khát">Nước giải khát</Select.Option>
            </Select>
          </div>

          <div>
            <div>Lọc theo kho hàng</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn kho hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="Kho HN">Kho HN</Select.Option>
              <Select.Option value="Kho SG">Kho SG</Select.Option>
              <Select.Option value="Logistic">Logistic</Select.Option>
            </Select>
          </div>

          <div>
            <div>Lọc theo ngày mua hàng</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn ngày mua hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="Hôm nay">Hôm nay</Select.Option>
              <Select.Option value="Hôm qua">Hôm qua</Select.Option>
              <Select.Option value="Tuần này">Tuần này</Select.Option>
              <Select.Option value="Tuần trước">Tuần trước</Select.Option>
              <Select.Option value="Tháng này">Tháng này</Select.Option>
              <Select.Option value="Tháng trước">Tháng trước</Select.Option>
            </Select>
          </div>
        </Space>
      </div>

      <Table
        size="small"
        dataSource={dataInventory}
        columns={columns}
        style={{ width: '100%', marginTop: 35 }}
      />
    </div>
  )
}
