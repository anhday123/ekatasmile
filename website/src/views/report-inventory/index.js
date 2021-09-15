import styles from './../report-inventory/report-inventory.module.scss'
import React, { useState } from 'react'
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
import { compare } from 'utils'
const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function ReportInventory() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

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
      render: (text, record, index) => ++index,
      align: 'center',
      width: 70,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Mã SKU',
      align: 'center',
    },
    {
      title: 'Chi nhánh mặc định',
      align: 'center',
      children: [
        {
          title: 'Tồn kho',
          dataIndex: 'age',
          key: 'age',
          align: 'center',
        },
        {
          title: 'Giá trị tồn kho',
          dataIndex: 'age',
          key: 'age',
          align: 'center',
        },
        {
          title: 'Giá vốn',
          dataIndex: 'age',
          key: 'age',
          align: 'center',
        },
        {
          title: 'Tỷ trọng (%)',
          dataIndex: 'age',
          key: 'age',
          align: 'center',
        },
      ],
    },
    {
      title: 'Hệ thống',
      align: 'center',
      children: [
        {
          title: 'Số lượng tồn kho',
          dataIndex: 'companyAddress',
          key: 'companyAddress',
        },
        {
          title: 'Giá trị tồn kho',
          dataIndex: 'companyName',
          key: 'companyName',
        },
      ],
    },
  ]
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: 'John Brown',
      sku: i + 1,
      street: 'Lake Park',
      building: 'C',
      number: 2035,
      companyAddress: 'Lake Street 42',
      companyName: 'SoftLake Co',
    })
  }

  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Báo cáo tồn kho
          </div>
        </div>
        <Row
          style={{
            width: '100%',
            marginBottom: 40,
            marginTop: 20,
          }}
        >
          <DatePicker
            size="large"
            className="br-15__date-picker"
            style={{ width: 300 }}
          />
        </Row>

        <Table
          style={{ width: '100%' }}
          bordered
          pagination={{
            position: ['bottomLeft'],
          }}
          // rowSelection={rowSelection}
          columns={columns}
          summary={(pageData) => {
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    <Text style={{ fontWeight: 650 }}>Tổng</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text></Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text style={{ fontWeight: 650 }}>300</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text style={{ fontWeight: 650 }}>3000000</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text></Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text></Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text style={{ fontWeight: 650 }}>123123232</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text style={{ fontWeight: 650 }}>760000000</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
          dataSource={data}
        />
      </div>
    </>
  )
}
