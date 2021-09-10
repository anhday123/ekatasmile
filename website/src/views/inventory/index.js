import styles from './../inventory/inventory.module.scss'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Input, Button, Row, Col, DatePicker, Table, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

import { compare, tableSum, formatCash } from 'utils'

// api
import { getProductsBranch } from 'apis/product'

const { RangePicker } = DatePicker

export default function Inventory() {
  const [filter, setFilter] = useState({
    search: '',
    from_date: undefined,
    to_date: undefined,
  })
  const [productList, setProductList] = useState([])
  const branchId = useSelector((state) => state.branch.branchId)
  const columns = [
    {
      title: 'Ảnh',
      key: 0,
      dataIndex: 'image',
      render: (data) => <img src={data && data[0]} width="60" />,
    },
    {
      title: 'Tên sản phẩm',
      key: 1,
      dataIndex: 'name',
      render: (data, record) => (record.has_variable ? record.title : data),
    },
    {
      title: 'Có thể bán',
      key: 2,
      dataIndex: 'available_stock_quantity',
      sorter: (a, b) => compare(a, b, 'available_stock_quantity'),
      // render: ()
    },
    {
      title: 'Tồn kho',
      key: 3,
      dataIndex: 'available_stock_quantity',
      sorter: (a, b) => compare(a, b, 'available_stock_quantity'),
    },
    {
      title: 'Ngày tạo',
      key: 4,
      dataIndex: 'create_date',
      render: (data) => moment(data).format('DD/MM/YYYY hh:mm:ss'),
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Giá bán',
      key: 5,
      dataIndex: 'sale_price',
      render: (data) => formatCash(data),
      sorter: (a, b) => compare(a, b, 'sale_price'),
    },
    {
      title: 'Giá nhập',
      key: 6,
      dataIndex: 'import_price',
      render: (data) => formatCash(data),
      sorter: (a, b) => compare(a, b, 'import_price'),
    },
    {
      title: 'Giá cơ bản',
      key: 7,
      dataIndex: 'base_price',
      render: (data) => formatCash(data),
      sorter: (a, b) => compare(a, b, 'base_price'),
    },
  ]
  const getProduct = async (params) => {
    try {
      const res = await getProductsBranch(params)
      if (res.data.success) {
        setProductList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const resetFilter = () => {
    setFilter({
      search: '',
      from_date: undefined,
      to_date: undefined,
    })
  }
  useEffect(() => {
    getProduct({ branch_id: branchId, merge: false, ...filter })
  }, [branchId, filter])
  return (
    <div className={styles['inventory']}>
      <Row
        align="middle"
        style={{
          borderBottom: 'solid 1px #B4B4B4',
          paddingBottom: '10px',
          fontSize: 20,
          fontWeight: 600,
          marginBottom: '1em',
        }}
      >
        <Col>Quản lý kho</Col>
      </Row>
      <Row gutter={[30, 20]} style={{ margin: '1em 0' }}>
        <Col xs={24} lg={8}>
          <Input
            placeholder="Tìm kiếm theo mã, theo tên"
            prefix={<SearchOutlined style={{ color: '#bdc3c7' }} />}
            size="large"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RangePicker
            size="large"
            style={{ borderRadius: '1em' }}
            value={
              filter.from_date
                ? [moment(filter.from_date), moment(filter.to_date)]
                : []
            }
            onChange={(date, dateString) =>
              setFilter({
                ...filter,
                from_date: dateString[0],
                to_date: dateString[1],
              })
            }
          />
        </Col>
      </Row>
      <Row style={{ margin: '1em 0' }} justify="end">
        <Button type="primary" size="large" onClick={resetFilter}>
          Xóa bộ lọc
        </Button>
      </Row>
      <Table
        columns={columns}
        size="small"
        dataSource={productList}
        scroll={{ x: 'max-content' }}
        summary={(pageData) => (
          <Table.Summary.Row style={{ fontWeight: 500 }}>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell>Tổng:</Table.Summary.Cell>
            <Table.Summary.Cell>
              {formatCash(tableSum(pageData, 'available_stock_quantity'))}
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              {formatCash(tableSum(pageData, 'available_stock_quantity'))}
            </Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell>
              {formatCash(tableSum(pageData, 'sale_price'))}
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              {formatCash(tableSum(pageData, 'import_price'))}
            </Table.Summary.Cell>
            <Table.Summary.Cell>
              {formatCash(tableSum(pageData, 'base_price'))}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </div>
  )
}
