import styles from './../report-inventory/report-inventory.module.scss'
import React, { useEffect, useState } from 'react'

import TitlePage from 'components/title-page'
import {
  Popconfirm,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  Typography,
  Popover,
  Space,
} from 'antd'

import { FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
import { compare, formatCash } from 'utils'
const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function ReportInventory() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState([])

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'code',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
    },
    {
      title: 'ĐVT',
      dataIndex: 'unit',
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
    },
    {
      title: 'Kho 1',
      key: 'warehouse',
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Thành tiền',
          dataIndex: 'cost',
          key: 'cost',
        },
      ],
    },
    {
      title: 'Kho 2',
      key: 'warehouse',
      children: [
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Thành tiền',
          dataIndex: 'cost',
          key: 'cost',
        },
      ],
    },
  ]
  useEffect(() => {
    const data = []
    for (let i = 0; i < 100; i++) {
      data.push({
        code: Math.floor(Math.random() * 10000),
        name: 'Mặt Hàng A',
        unit: 'C',
        group: 'A',
        quantity: Math.floor(Math.random() * 15),
        cost: formatCash(Math.floor(Math.random() * 1000000)),
      })
    }
    setData([...data])
  }, [])
  const dateFormat = 'YYYY/MM/DD'
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <TitlePage title="Báo cáo tồn kho"></TitlePage>
        <Row style={{ marginBottom: 10, marginTop: 20 }}>
          <DatePicker.RangePicker
            placeholder="Lọc theo ngày"
            style={{ width: 350 }}
            size="large"
            defaultValue={[moment('2021/11/01', dateFormat), moment('2021/12/01', dateFormat)]}
            format={dateFormat}
          />
        </Row>

        <Table
          size="small"
          style={{ width: '100%' }}
          pagination={{
            position: ['bottomLeft'],
          }}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          summary={(pageData) => (
            <Table.Summary.Row>
              <Table.Summary.Cell>
                <h4>Tổng</h4>
              </Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell>100</Table.Summary.Cell>
              <Table.Summary.Cell>{formatCash(4500000)}</Table.Summary.Cell>
              <Table.Summary.Cell>100</Table.Summary.Cell>
              <Table.Summary.Cell>{formatCash(5500000)}</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </>
  )
}
