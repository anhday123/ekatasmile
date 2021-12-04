import React, { useState, useEffect, useRef } from 'react'
import styles from './order-list.module.scss'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { ROUTES, PERMISSIONS, BILL_STATUS_ORDER, PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'consts'
import { compare, formatCash } from 'utils'
import { useReactToPrint } from 'react-to-print'
import delay from 'delay'

//antd
import { Input, Button, Row, DatePicker, Table, Select, Space } from 'antd'

//icons
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'

//components
import Permissions from 'components/permission'
import PrintOrder from 'components/print/print-order'

//apis
import { apiAllOrder } from 'apis/order'

const { RangePicker } = DatePicker
export default function OrderList() {
  let printOrderRef = useRef()
  const history = useHistory()
  const typingTimeoutRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => printOrderRef.current,
  })

  const [dataPrint, setDataPrint] = useState(null)

  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [orders, setOrders] = useState([])
  const [countOrder, setCountOrder] = useState(0)

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: PAGE_SIZE })
  const [valueSearch, setValueSearch] = useState('')

  const Print = () => (
    <div style={{ display: 'none' }}>
      <PrintOrder ref={printOrderRef} data={dataPrint} />
    </div>
  )

  const _onSearch = (e) => {
    const value = e.target.value
    setValueSearch(value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      paramsFilter.page = 1

      if (value) paramsFilter.order_id = value
      else delete paramsFilter.order_id

      setParamsFilter({ ...paramsFilter })
    }, 650)
  }

  const _onChangeDate = (date, dateString) => {
    paramsFilter.page = 1

    if (date) {
      paramsFilter.from_date = dateString[0]
      paramsFilter.to_date = dateString[1]
    } else {
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    setParamsFilter({ ...paramsFilter })
  }

  const _onChangeStatus = (value) => {
    paramsFilter.page = 1

    if (value) paramsFilter.bill_status = value
    else delete paramsFilter.bill_status

    setParamsFilter({ ...paramsFilter })
  }

  const columnsOrder = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_id',
      sorter: (a, b) => compare(a, b, 'order_id'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) => text && moment(text).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Tên khách hàng',
      render: (text, record) =>
        record.customer ? `${record.customer.first_name} ${record.customer.last_name}` : '',
    },
    {
      title: 'Nhân viên',
      render: (text, record) =>
        record.employee ? `${record.employee.first_name} ${record.employee.last_name}` : '',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'bill_status',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_status',
    },
    {
      title: 'Khách phải trả',
      dataIndex: 'final_cost',
      render: (text) => formatCash(text),
    },
  ]

  const columnsProduct = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_id',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (data) => (
        <img src={data[0] && data[0]} style={{ maxWidth: 60, maxHeight: 60 }} alt="" />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Đơn giá',
      render: (text, record) => (record.price ? formatCash(+record.price) : 0),
    },
    {
      title: 'Chiết khấu',
      render: (text, record) => (record.discount ? formatCash(+record.discount) : 0),
    },
    {
      title: 'Thành tiền',
      render: (text, record) => (record.total_cost ? formatCash(+record.total_cost) : 0),
    },
  ]

  const _getOrders = async (params) => {
    try {
      setLoading(true)
      const res = await apiAllOrder(params)
      console.log(res)
      if (res.status === 200) {
        setOrders(res.data.data)
        setCountOrder(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    _getOrders(paramsFilter)
  }, [paramsFilter])

  return (
    <>
      <Print />
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <Row
          justify="space-between"
          wrap={false}
          align="middle"
          style={{
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            width: '100%',
          }}
        >
          <h3 style={{ marginBottom: 0, fontSize: 19 }}>Danh sách đơn hàng</h3>
          <Permissions permissions={[PERMISSIONS.tao_don_hang]}>
            <Button
              onClick={() => history.push(ROUTES.ORDER_CREATE)}
              size="large"
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Tạo đơn hàng
            </Button>
          </Permissions>
        </Row>

        <Row style={{ marginTop: '1rem', width: '100%' }} wrap={false}>
          <Space>
            <div>
              <div>Tìm kiếm theo mã đơn hàng</div>
              <Input
                style={{ width: 350 }}
                prefix={<SearchOutlined />}
                size="large"
                name="name"
                value={valueSearch}
                onChange={_onSearch}
                placeholder="Nhập mã đơn hàng"
                allowClear
              />
            </div>
            <div>
              <div>Lọc theo thời gian</div>
              <RangePicker
                onChange={_onChangeDate}
                style={{ width: 270 }}
                size="large"
                className="br-15__date-picker"
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
              />
            </div>
            <div>
              <div>Lọc theo trạng thái</div>
              <Select
                value={paramsFilter.value}
                onChange={_onChangeStatus}
                showSearch
                size="large"
                allowClear
                placeholder="Chọn trạng thái"
                style={{ width: 250 }}
              >
                {Object.keys(BILL_STATUS_ORDER).map((status, index) => (
                  <Select.Option value={status} key={index}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Space>
        </Row>

        <Table
          size="small"
          rowKey="_id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div style={{ paddingTop: 17, paddingBottom: 17 }}>
                  <Row wrap={false}>
                    <div
                      style={{
                        width: 'calc(100% - 165px)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 5,
                        border: '1px solid #E8EAEB',
                        padding: '15px 0px',
                        marginRight: 15,
                        fontSize: 14.7,
                      }}
                    >
                      <Row wrap={false}>
                        <div style={{ width: '33.33333%', padding: '0px 25px' }}>
                          <p style={{ fontWeight: 700, marginBottom: 6 }}>Thông tin đơn hàng</p>
                          <Row justify="space-between">
                            <div style={{ color: '#747C87' }}>Mã đơn hàng:</div>
                            <div>{record.order_id || ''}</div>
                          </Row>
                          <Row justify="space-between">
                            <div style={{ color: '#747C87' }}>Ngày tạo:</div>
                            <div>{moment(record.create_date).format('DD/MM/YYYY HH:mm')}</div>
                          </Row>
                          <Row justify="space-between">
                            <div style={{ color: '#747C87' }}>Nguồn bán hàng:</div>
                            <div>POS</div>
                          </Row>
                          <Row justify="space-between">
                            <div style={{ color: '#747C87' }}>Nhân viên bán hàng:</div>
                            <div>
                              {record.employee
                                ? `${record.employee.first_name} ${record.employee.last_name}`
                                : ''}
                            </div>
                          </Row>
                        </div>
                        <div
                          style={{
                            width: '33.33333%',
                            padding: '0px 25px',
                            borderRight: '1px solid #E8EAEB',
                          }}
                        >
                          <p style={{ fontWeight: 700, marginBottom: 6 }}>Khách hàng</p>
                          <Row wrap={false} style={{ width: '100%' }}>
                            <a>
                              {record.customer
                                ? `${record.customer.first_name} ${record.customer.last_name}`
                                : ''}
                            </a>
                            <div style={{ margin: '0px 5px' }}>-</div>
                            <div>{record.customer ? record.customer.phone : ''}</div>
                          </Row>
                          <div>
                            {record.customer
                              ? `${record.customer.address}, ${record.customer.district}, ${record.customer.province}`
                              : ''}
                          </div>
                        </div>
                        <div style={{ width: '33.33333%', padding: '0px 25px' }}>
                          <div style={{ marginBottom: 10 }}>
                            <p style={{ fontWeight: 700, marginBottom: 4 }}>Ghi chú đơn hàng</p>
                            <div style={{ color: record.note ? '' : '#747C87' }}>
                              {record.note ? record.note : 'Đơn hàng không có ghi chú'}
                            </div>
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, marginBottom: 4 }}>Tags</p>
                            <div style={{ color: record.note ? '#747C87' : '' }}>
                              {record.tags && record.tags.length
                                ? record.tags.join(',')
                                : 'Đơn hàng chưa có tag'}
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>
                    <Space direction="vertical">
                      <Button
                        style={{ width: 140 }}
                        size="large"
                        type="primary"
                        onClick={async () => {
                          setDataPrint({
                            ...record,
                            sumCostPaid: record.total_cost,
                            discount:
                              record.promotion && Object.keys(record.promotion).length
                                ? record.promotion
                                : null,
                            moneyToBePaidByCustomer: record.final_cost,
                          })
                          await delay(500)
                          handlePrint()
                        }}
                      >
                        In đơn hàng
                      </Button>
                      <Button style={{ width: 140 }} size="large">
                        Sửa đơn hàng
                      </Button>
                    </Space>
                  </Row>
                  <div className="table-product-in-order">
                    <Table
                      pagination={false}
                      size="small"
                      style={{ width: '99%', marginTop: 30 }}
                      columns={columnsProduct}
                      dataSource={record.order_details}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell colSpan={2}>
                            <div style={{ fontSize: 14.7 }}>
                              <Row wrap={false} justify="space-between">
                                <div>Tổng tiền ({record.order_details.length} sản phẩm)</div>
                                <div>{record.total_cost ? formatCash(+record.total_cost) : 0}</div>
                              </Row>
                              <Row wrap={false} justify="space-between">
                                <div>Chiết khấu</div>
                                <div>
                                  {record.promotion
                                    ? `${formatCash(+(record.promotion.value || 0))} ${
                                        record.promotion.type && record.promotion.type !== 'VALUE'
                                          ? '%'
                                          : ''
                                      }`
                                    : 0}
                                </div>
                              </Row>
                              <Row wrap={false} justify="space-between">
                                <div>Phí giao hàng</div>
                                <div>
                                  {record.shipping_info
                                    ? formatCash(+record.shipping_info.cod || 0)
                                    : 0}
                                </div>
                              </Row>
                              <Row wrap={false} justify="space-between" style={{ fontWeight: 600 }}>
                                <div>Khách phải trả</div>
                                <div>
                                  {record.final_cost ? formatCash(+record.final_cost || 0) : 0}
                                </div>
                              </Row>
                            </div>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    />
                  </div>
                </div>
              )
            },
          }}
          columns={columnsOrder}
          style={{ width: '100%', marginTop: 35 }}
          pagination={{
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              paramsFilter.page = page
              paramsFilter.page_size = pageSize

              setParamsFilter({ ...paramsFilter })
            },
            total: countOrder,
          }}
          scroll={{ x: 'max-content' }}
          dataSource={orders}
        />
      </div>
    </>
  )
}
