import { SearchOutlined } from '@ant-design/icons'
import { Col, Row, Input, DatePicker, Table } from 'antd'
import { compare, formatCash, tableSum } from 'utils'
import moment from 'moment'
import { useState } from 'react'
import { ROUTES } from 'consts'
import { Link } from 'react-router-dom'

export default function OrderCancel(props) {
  const [orderPaidData, setOrderPaidData] = useState([1, 2, 3])
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '',
      render: (data, record) => (
        <Link
          to={{
            pathname: ROUTES.CUSTOMER_ORDER_DETAIL,
            state: { code: 'SON00019' },
          }}
        >
          SON00019
        </Link>
      ),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Thanh toán',
      dataIndex: '',
      render: (data) => (
        <span style={{ color: '#0037F9', cursor: 'pointer' }}></span>
      ),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: '',
      render: (data) => formatCash(520000),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Chiết khấu',
      dataIndex: '',
      render: (data) => formatCash(52000),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Thành tiền',
      dataIndex: '',
      render: (data) => formatCash(468000),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Khách đã trả',
      dataIndex: '',
      render: (data) => formatCash(468000),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Thu ngân',
      dataIndex: '',
      render: (data) => <>Mai Anh</>,
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: '',
      render: (data) => (
        <>{moment('2021-09-07T15:14:09+07:00').format('DD-MM-YYYY hh:mm:ss')}</>
      ),
      sorter: (a, b) => compare(a, b, 'code'),
    },
  ]
  return (
    <>
      <Row gutter={30} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={8}>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo mã"
          />
        </Col>
        <Col xs={24} lg={8}>
          <DatePicker.RangePicker
            size="large"
            style={{ borderRadius: '1em' }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={orderPaidData}
        summary={(pageData) => (
          <Table.Summary.Row style={{ fontWeight: 500 }}>
            <Table.Summary.Cell>Tổng</Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell>{tableSum(pageData, '')}</Table.Summary.Cell>
            <Table.Summary.Cell>{tableSum(pageData, '')}</Table.Summary.Cell>
            <Table.Summary.Cell>{tableSum(pageData, '')}</Table.Summary.Cell>
            <Table.Summary.Cell>{tableSum(pageData, '')}</Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </>
  )
}
