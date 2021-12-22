import React, { useState, useEffect, useRef } from 'react'
import styles from './order-list.module.scss'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { ROUTES, PERMISSIONS, BILL_STATUS_ORDER, PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'consts'
import { compare, formatCash, compareCustom, tableSum } from 'utils'
import { useReactToPrint } from 'react-to-print'
import delay from 'delay'

//antd
import {
  Input,
  Button,
  Row,
  DatePicker,
  Table,
  Select,
  Space,
  Popconfirm,
  notification,
} from 'antd'

//icons
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'

//components
import Permissions from 'components/permission'
import PrintOrder from 'components/print/print-order'
import SettingColumns from 'components/setting-columns'
import columnsOrder from './columnsOrder'

//apis
import { apiAllOrder, deleteOrders } from 'apis/order'
import { apiAllUser } from 'apis/user'

const { RangePicker } = DatePicker
export default function OrderList() {
  let printOrderRef = useRef()
  const history = useHistory()
  const typingTimeoutRef = useRef(null)
  const handlePrint = useReactToPrint({ content: () => printOrderRef.current })
  const [columns, setColumns] = useState([])
  const [dataPrint, setDataPrint] = useState(null)

  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [orders, setOrders] = useState([])
  const [countOrder, setCountOrder] = useState(0)
  const [employees, setEmployees] = useState([])

  const [optionSearchName, setOptionSearchName] = useState('code')
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

      if (value) paramsFilter[optionSearchName] = value
      else delete paramsFilter[optionSearchName]

      setParamsFilter({ ...paramsFilter })
    }, 650)
  }

  const _deleteOrders = async () => {
    try {
      setLoading(true)
      const res = await deleteOrders(selectedRowKeys)
      setLoading(false)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Xóa các đơn hàng thành công!' })
          _getOrders()
        } else notification.error({ message: res.data.message || 'Xóa các đơn hàng thất bại!' })
      } else notification.error({ message: res.data.message || 'Xóa các đơn hàng thất bại!' })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
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

  const _onChangeFilter = (attribute = '', value = '') => {
    paramsFilter.page = 1
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]
    setParamsFilter({ ...paramsFilter })
  }

  const columnsProduct = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      sorter: (a, b) => compare(a, b, 'sku'),
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
      sorter: (a, b) => compare(a, b, 'title'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      sorter: (a, b) => compare(a, b, 'quantity'),
    },
    {
      title: 'Đơn giá',
      sorter: (a, b) => compare(a, b, 'price'),

      render: (text, record) => (record.price ? formatCash(+record.price) : 0),
    },
    {
      title: 'Chiết khấu',
      sorter: (a, b) => compare(a, b, 'discount'),

      render: (text, record) => (record.discount ? formatCash(+record.discount) : 0),
    },
    {
      title: 'Thành tiền',
      sorter: (a, b) => compare(a, b, 'total_cost'),
      render: (text, record) => (record.total_cost ? formatCash(+record.total_cost) : 0),
    },
  ]

  const _getOrders = async (params) => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
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

  const _getEmployees = async () => {
    try {
      const res = await apiAllUser()
      if (res.status === 200) setEmployees(res.data.data)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getEmployees()
  }, [])

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
          <h3 style={{ marginBottom: 0, fontSize: 19 }}>Danh sách hóa đơn bán hàng</h3>
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

        <Row justify="space-between" style={{ marginTop: '1rem', width: '100%' }} wrap={false}>
          <div>
            <div>Tìm kiếm đơn hàng</div>
            <Row wrap={false}>
              <Input
                style={{ width: 350 }}
                prefix={<SearchOutlined />}
                name="name"
                value={valueSearch}
                onChange={_onSearch}
                placeholder="Tìm kiếm theo ..."
                allowClear
              />
              <Select
                showSearch
                style={{ width: 170 }}
                placeholder="Chọn theo"
                value={optionSearchName}
                onChange={(value) => {
                  delete paramsFilter[optionSearchName]
                  setOptionSearchName(value)
                }}
              >
                <Select.Option value="code">Mã đơn hàng</Select.Option>
                <Select.Option value="product_name">Tên sản phẩm</Select.Option>
                <Select.Option value="product_sku">Mã sản phẩm</Select.Option>
                <Select.Option value="customer_name">Tên khách hàng</Select.Option>
                <Select.Option value="customer_code">Mã khách hàng</Select.Option>
                <Select.Option value="customer_phone">SĐT khách hàng</Select.Option>
                <Select.Option value="employee_name">Tên nhân viên</Select.Option>
              </Select>
            </Row>
          </div>
          <div>
            <div>Lọc theo thời gian</div>
            <RangePicker
              onChange={_onChangeDate}
              style={{ width: 270 }}
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
              value={paramsFilter.bill_status || ''}
              onChange={(value) => _onChangeFilter('bill_status', value)}
              showSearch
              placeholder="Chọn trạng thái"
              style={{ width: 250 }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              {Object.keys(BILL_STATUS_ORDER).map((status, index) => (
                <Select.Option value={status} key={index}>
                  {BILL_STATUS_ORDER[status]}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Row>
        <Row justify="space-between" style={{ marginTop: '1rem', width: '100%' }} wrap={false}>
          <div>
            <div>Lọc theo kênh bán hàng</div>
            <Select
              value={paramsFilter.chanel || ''}
              onChange={(value) => _onChangeFilter('chanel', value)}
              showSearch
              placeholder="Chọn kênh bán hàng"
              style={{ width: 520 }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="Thương mại điện tử">Thương mại điện tử</Select.Option>
              <Select.Option value="Cửa hàng">Cửa hàng</Select.Option>
              <Select.Option value="Kho">Kho</Select.Option>
              <Select.Option value="Mạng Xã Hội">Mạng Xã Hội</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </div>
          <div>
            <div>Lọc theo nhân viên</div>
            <Select
              value={paramsFilter.employee_name || ''}
              onChange={(value) => _onChangeFilter('employee_name', value)}
              showSearch
              placeholder="Chọn nhân viên"
              style={{ width: 250 }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              {employees.map((employee, index) => (
                <Select.Option value={employee.first_name + ' ' + employee.last_name} key={index}>
                  {employee.first_name} {employee.last_name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Row>

        <Row justify="space-between" style={{ width: '100%', marginTop: 30 }}>
          <Popconfirm onConfirm={_deleteOrders} title="Bạn có muốn xóa các đơn hàng này không ?">
            <Button
              style={{ visibility: !selectedRowKeys.length && 'hidden' }}
              type="primary"
              danger
              size="large"
            >
              Xóa đơn hàng
            </Button>
          </Popconfirm>

          <SettingColumns
            columnsDefault={columnsOrder}
            nameColumn="columnsOrder"
            columns={columns}
            setColumns={setColumns}
          />
        </Row>

        <Table
          size="small"
          rowKey="order_id"
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
                            <div style={{ margin: '0px 5px', display: !record.customer && 'none' }}>
                              -
                            </div>
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
                            <div
                              style={{
                                color: !record.tags || !record.tags.length ? '#747C87' : '',
                              }}
                            >
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
                          console.log(record)
                          setDataPrint({
                            ...record,
                            isDelivery: record.shipping_info ? true : false,
                            deliveryCharges:
                              record.shipping_info && (record.shipping_info.cod || 0),
                            sumCostPaid: record.total_cost,
                            discount:
                              record.promotion && Object.keys(record.promotion).length
                                ? record.promotion
                                : null,
                            moneyToBePaidByCustomer: record.final_cost,
                            deliveryAddress: record.shipping_info,
                            moneyGivenByCustomer: 0,
                            prepay: 0,
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
            expandedRowKeys: selectedRowKeys,
            expandIconColumnIndex: -1,
          }}
          columns={columns.map((column) => {
            if (column.key === 'code')
              return {
                ...column,
                sorter: (a, b) => compare(a, b, 'code'),
                render: (text, record) => (
                  <a
                    style={{
                      color:
                        (record.bill_status === 'DRAFT' && 'black') ||
                        (record.bill_status === 'PROCESSING' && 'orange') ||
                        (record.bill_status === 'COMPLETE' && 'green') ||
                        (record.bill_status === 'CANCEL' && 'red') ||
                        (record.bill_status === 'REFUND' && '#ff7089'),
                    }}
                  >
                    #{text}
                  </a>
                ),
              }
            if (column.key === 'create_date')
              return {
                ...column,
                render: (text, record) => text && moment(text).format('DD/MM/YYYY HH:mm'),
                sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
              }
            if (column.key === 'customer')
              return {
                ...column,
                sorter: (a, b) =>
                  compareCustom(
                    a.customer ? `${a.customer.first_name} ${a.customer.last_name}` : '',
                    b.customer ? `${b.customer.first_name} ${b.customer.last_name}` : ''
                  ),
                render: (text, record) =>
                  record.customer
                    ? `${record.customer.first_name} ${record.customer.last_name}`
                    : '',
              }
            if (column.key === 'employee')
              return {
                ...column,
                sorter: (a, b) =>
                  compareCustom(
                    a.employee ? `${a.employee.first_name} ${a.employee.last_name}` : '',
                    a.employee ? `${b.employee.first_name} ${b.employee.last_name}` : ''
                  ),
                render: (text, record) =>
                  record.employee
                    ? `${record.employee.first_name} ${record.employee.last_name}`
                    : '',
              }
            if (column.key === 'bill_status')
              return {
                ...column,
                render: (text) => BILL_STATUS_ORDER[text] || '',
                sorter: (a, b) => compare(a, b, 'bill_status'),
              }
            if (column.key === 'payment_status')
              return { ...column, sorter: (a, b) => compare(a, b, 'payment_status') }
            if (column.key === 'final_cost')
              return {
                ...column,
                sorter: (a, b) => compare(a, b, 'final_cost'),
                render: (text) => formatCash(text),
              }
            return column
          })}
          style={{ width: '100%', marginTop: 15 }}
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
          summary={(pageData) => (
            <Table.Summary.Row>
              <Table.Summary.Cell>
                <b>Tổng</b>
              </Table.Summary.Cell>
              {columns.map((e, index) => {
                if (e.key === 'final_cost')
                  return (
                    <Table.Summary.Cell>
                      {formatCash(tableSum(pageData, 'final_cost'))} VND
                    </Table.Summary.Cell>
                  )
                return <Table.Summary.Cell></Table.Summary.Cell>
              })}
            </Table.Summary.Row>
          )}
        />
      </div>
    </>
  )
}
