import React, { useEffect, useState } from 'react'
import styles from './sales-report.module.scss'

import { Row, Col, Button, Select, Table, Modal, DatePicker } from 'antd'
import moment from 'moment'
import { formatCash } from 'utils'
import { CalendarComponent } from '@syncfusion/ej2-react-calendars'

//components
import TitlePage from 'components/title-page'
import FilterRangeTime from './filterRangeTime'
import SettingColumns from 'components/setting-columns'
import columnsSalesReport from './columns'

export default function ReportFinancial() {
  const [filter, setFilter] = useState()
  const [columns, setColumns] = useState([])
  const [salesReport, setSalesReport] = useState([])

  useEffect(() => {
    let data = []
    for (let i = 0; i < 10; i++)
      data.push({
        code: Math.floor(Math.random() * 10000),
        name: 'Mặt Hàng A',
        unit: 'C',
        quantity: Math.floor(Math.random() * 15),
        sales: formatCash(Math.floor(Math.random() * 1000000)),
        price_base: formatCash(Math.floor(Math.random() * 100000)),
        profit: formatCash(Math.floor(Math.random() * 10000)),
        percent_sales: formatCash(Math.floor(Math.random() * 50)),
      })
    setSalesReport(data)
  }, [])
  const dateFormat = 'YYYY/MM/DD'
  return (
    <div className={styles['report']}>
      <TitlePage title="Báo cáo bán hàng"></TitlePage>

      <Row gutter={10} style={{ marginTop: 20, marginBottom: 20 }}>
        <DatePicker.RangePicker
          placeholder="Lọc theo ngày"
          style={{ width: 350 }}
          size="large"
          defaultValue={[moment('2021/11/01', dateFormat), moment('2021/12/01', dateFormat)]}
          format={dateFormat}
        />
        {/* <Col xs={24} lg={8}>
          <Select placeholder="Chọn loại phiếu" allowClear style={{ width: '100%' }} size="large">
            <Select.Option value="chi">Phiếu chi</Select.Option>
            <Select.Option value="thu">Phiếu chi</Select.Option>
          </Select>
        </Col>
        <Col>
          <Select
            placeholder="Chọn hình thức thanh toán"
            allowClear
            style={{ width: '100%' }}
            size="large"
          >
            <Select.Option value="money">Tiền mặt</Select.Option>
            <Select.Option value="point">Điểm</Select.Option>
            <Select.Option value="bank">Thẻ ngân hàng</Select.Option>
          </Select>
        </Col>
        <Col>
          <FilterRangeTime filter={filter} setFilter={setFilter} />
        </Col> */}
      </Row>

      <Row justify="end" style={{ marginBottom: 5 }}>
        <SettingColumns
          columnsDefault={columnsSalesReport}
          columns={columns}
          setColumns={setColumns}
          nameColumn="columnsSalesReport"
        />
      </Row>

      <Table
        columns={columns.map((column) => {
          if (column.key === 'stt') return { ...column, render: (text, record, index) => index + 1 }
          return column
        })}
        dataSource={salesReport}
        size="small"
        summary={(pageData) => (
          <Table.Summary.Row>
            {columns.map((e, index) => {
              if (e.key === 'stt')
                return (
                  <Table.Summary.Cell>
                    <h4>Tổng</h4>
                  </Table.Summary.Cell>
                )
              if (e.key === 'quantity') return <Table.Summary.Cell>100</Table.Summary.Cell>
              if (['sales', 'price_base', 'percent_sales'].includes(e.key))
                return <Table.Summary.Cell>500,500</Table.Summary.Cell>
              return <Table.Summary.Cell></Table.Summary.Cell>
            })}
          </Table.Summary.Row>
        )}
      />
    </div>
  )
}
