import styles from './../order-list/order-list.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import {
  Input,
  Button,
  Tabs,
  Popover,
  Pagination,
  Row,
  Col,
  Radio,
  DatePicker,
  Table,
  Modal,
} from 'antd'
import { Link } from 'react-router-dom'
import { PlusCircleOutlined, StarOutlined } from '@ant-design/icons'
import moment from 'moment'
import { apiAllOrder } from './../../apis/order'
import { ROUTES } from 'consts'

const { RangePicker } = DatePicker
const { TabPane } = Tabs
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  })
}
export default function OrderList() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const contentShippingDone = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        2021-08-13 09:10, Giao hàng thành công
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        2021-08-12 10:10, Đang giao hàng
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
      >
        2021-08-11 09:10, Đơn hàng đã đến kho TP.HCM
      </div>
    </div>
  )

  function formatCash(str) {
    return str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev
      })
  }
  const columnsPromotion = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'order_id',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) =>
        text && moment(text).format('YYYY-MM-DD, HH:mm:ss'),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeMain',
      width: 150,
      render: (text, record) =>
        record &&
        record.employee &&
        record.employee.first_name &&
        record.employee.last_name
          ? `${record.employee.first_name} ${record.employee.last_name}`
          : '',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) =>
        record && record.customer && record.customer.first_name
          ? `${record.customer.first_name} ${record.customer.last_name}`
          : '',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      width: 150,
      render: (text, record) => `${formatCash(String(text))} VNĐ`,
    },
    {
      title: 'Khách đã trả',
      dataIndex: 'final_cost',
      width: 150,
      render: (text, record) => `${formatCash(String(text))} VNĐ`,
    },
  ]
  const columnsPromotionWebsite = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'order_id',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) =>
        text && moment(text).format('YYYY-MM-DD, HH:mm:ss'),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) =>
        record && record.customer && record.customer.first_name
          ? `${record.customer.first_name} ${record.customer.last_name}`
          : '',
    },
    {
      title: 'Giao hàng',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) => (
        <div>
          {record.order_id % 2 === 0 ? (
            <Popover content={contentShippingDone}>
              {' '}
              <div style={{ color: '#04B000', cursor: 'pointer' }}>Đã giao</div>
            </Popover>
          ) : (
            <div div style={{ color: '#FF9900' }}>
              {' '}
              Chưa giao hàng
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Nhận xét KH',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) => (
        <div style={{ color: 'black' }}>Giao nhanh</div>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <StarOutlined style={{ color: '#F2E902', marginRight: '0.25rem' }} />
          <StarOutlined style={{ color: '#F2E902', marginRight: '0.25rem' }} />
          <StarOutlined style={{ color: '#F2E902', marginRight: '0.25rem' }} />
          <StarOutlined style={{ color: '#575755', marginRight: '0.25rem' }} />
          <StarOutlined style={{ color: '#575755' }} />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      width: 150,
      render: (text, record) => `${formatCash(String(text))} VNĐ`,
    },
  ]

  const columnsDetailOrder = [
    {
      title: 'Giá bán',
      dataIndex: 'sale_price',
      render: (text, record) =>
        text ? <div>{`${formatCash(String(text))} VNĐ`}</div> : 0,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 150,
    },

    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      width: 150,
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'optionsMain',
      width: 200,
      render: (text, record) =>
        record && record.options && record.options.length > 0 ? (
          <div>
            {record.options.map((values, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        marginRight: '0.25rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      -Thuộc tính:{' '}
                    </div>
                    <div>{values.name}.</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        marginRight: '0.25rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      -Kích thước:{' '}
                    </div>
                    <div>{values.values}.</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          ''
        ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 150,
      render: (text, record) =>
        text ? <div>{`${formatCash(String(text))}`}</div> : 0,
    },

    {
      title: 'Tổng tiền',
      dataIndex: 'total_cost',
      render: (text, record) =>
        text ? <div>{`${formatCash(String(text))} VNĐ`}</div> : 0,
    },
    {
      title: 'Voucher',
      dataIndex: 'voucher',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      render: (text, record) =>
        text ? <div>{`${formatCash(String(text))} VNĐ`}</div> : 0,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      render: (text, record) =>
        text ? (
          <div
            style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}
          >{`${formatCash(String(text))} VNĐ`}</div>
        ) : (
          0
        ),
    },
  ]

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const apiAllOrderDataTable = async (page, page_size) => {
    try {
      setLoading(true)
      const res = await apiAllOrder({ page: page, page_size: page_size })
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function onShowSizeChangeTable(current, pageSize) {
    apiAllOrderDataTable(current, pageSize)
  }
  function onChangeTable(pageNumber) {
    apiAllOrderDataTable(pageNumber, 10)
  }
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  const [radioLocation, setRadioLocation] = useState('store')
  const onChangeRadioLocation = (e) => {
    setRadioLocation(e.target.value)
    setSelectedRowKeys([])
  }
  const [order, setOrder] = useState([])
  const apiAllOrderData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await apiAllOrder({ page: 1, page_size: 10 })
      console.log(res)
      if (res.status === 200) {
        setOrder(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllOrderData()
  }, [])
  const [countTable, setCountTable] = useState(0)
  const apiAllOrderDataTableOrderDetail = async (e) => {
    try {
      setLoading(true)
      const res = await apiAllOrder({ keyword: e, page: 1, page_size: 10 })

      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment()

        setOrder(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const typingTimeoutRef = useRef(null)
  const [valueSearchOrderDetail, setValueSearchOrderDetail] = useState('')
  const onSearchOrderDetail = (e) => {
    setValueSearchOrderDetail(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiAllOrderDataTableOrderDetail(value)
    }, 300)
  }
  const apiAllOrderDataTableOrderDetailDate = async (start, end) => {
    try {
      setLoading(true)
      const res = await apiAllOrder({ from_date: start, to_date: end })

      if (res.status === 200) {
        setCountTable(res.data.count)

        setOrder(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const dateFormat = 'YYYY/MM/DD'
  const [start, setStart] = useState('')
  const [clear, setClear] = useState(-1)
  const [end, setEnd] = useState('')
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiAllOrderDataTableOrderDetailDate(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <Row
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Col
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            className={styles['promotion_manager_title']}
          >
            Danh sách đơn hàng
          </Col>
          <Col
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            cls={24}
            className={styles['promotion_manager_button']}
          >
            <Link
              to={ROUTES.ORDER_CREATE_SHIPPING}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
                Tạo đơn hàng
              </Button>
            </Link>
          </Col>
        </Row>
        <Radio.Group
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            marginTop: '1rem',
          }}
          onChange={onChangeRadioLocation}
          value={radioLocation}
        >
          <Radio
            style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}
            value="store"
          >
            Tại cửa hàng
          </Radio>
          <Radio
            style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}
            value="website"
          >
            Website
          </Radio>
          <Radio
            style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}
            value="mobile"
          >
            Mobile
          </Radio>
        </Radio.Group>
        {radioLocation === 'store' ? (
          <Tabs style={{ width: '100%' }} defaultActiveKey="1">
            <TabPane tab="Tất cả đơn hàng" key="1">
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    marginRight: '1rem',
                  }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <Input
                      size="large"
                      style={{ width: '100%' }}
                      name="name"
                      value={valueSearchOrderDetail}
                      enterButton
                      onChange={onSearchOrderDetail}
                      placeholder="Tìm kiếm theo mã, theo tên"
                      allowClear
                    />
                  </div>
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <RangePicker
                      size="large"
                      className="br-15__date-picker"
                      value={
                        clear === 1
                          ? []
                          : start !== ''
                          ? [moment(start, dateFormat), moment(end, dateFormat)]
                          : []
                      }
                      style={{ width: '100%' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [
                          moment().startOf('month'),
                          moment().endOf('month'),
                        ],
                      }}
                      onChange={onChangeDate}
                    />
                  </div>
                </Col>
              </Row>

              <div
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  border: '1px solid rgb(243, 234, 234)',
                }}
              >
                <Table
                  rowKey="_id"
                  loading={loading}
                  bordered
                  rowSelection={rowSelection}
                  expandable={{
                    expandedRowRender: (record) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            flexDirection: 'column',
                          }}
                        >
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Mã hóa đơn:{' '}
                                </div>
                                <div>{record.order_id}</div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Trạng thái:{' '}
                                </div>
                                <div style={{ color: '#2F9BFF' }}>
                                  {record.status}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Tổng số lượng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách cần trả:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Thời gian:{' '}
                                </div>
                                <div>
                                  {moment(record.create_date).format(
                                    'YYYY-MM-DD, HH:mm:ss'
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người bán:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.customer &&
                                  record.customer.first_name
                                    ? `${record.customer.first_name} ${record.customer.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tạo:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Chi nhánh:{' '}
                                </div>
                                <div>
                                  {record && record.branch && record.branch.name
                                    ? `${record.branch.name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <div
                            style={{
                              backgroundColor: 'white',
                              marginTop: '1rem',
                              border: '1px solid rgb(231, 218, 218)',
                              width: '100%',
                            }}
                          >
                            <Table
                              bordered
                              columns={columnsDetailOrder}
                              dataSource={
                                record &&
                                record.order_details &&
                                record.order_details.length > 0
                                  ? record.order_details
                                  : []
                              }
                              scroll={{ y: 500, x: 1300 }}
                            />
                          </div>
                        </div>
                      )
                    },
                    expandedRowKeys: selectedRowKeys,
                    expandIconColumnIndex: -1,
                  }}
                  columns={columnsPromotion}
                  style={{ width: '100%' }}
                  pagination={false}
                  dataSource={order}
                />
                <Pagination
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChangeTable}
                  defaultCurrent={10}
                  onChange={onChangeTable}
                  total={countTable}
                />
              </div>
            </TabPane>
            <TabPane tab="Đơn hàng hủy" key="2">
              Chưa có
            </TabPane>
            <TabPane tab="Đơn hàng hoàn tiền" key="3">
              Chưa có
            </TabPane>
          </Tabs>
        ) : radioLocation === 'website' ? (
          <Tabs style={{ width: '100%' }} defaultActiveKey="1">
            <TabPane tab="Tất cả đơn hàng" key="1">
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    marginRight: '1rem',
                  }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <Input
                      style={{ width: '100%' }}
                      name="name"
                      value={valueSearchOrderDetail}
                      enterButton
                      onChange={onSearchOrderDetail}
                      className={
                        styles['orders_manager_content_row_col_search']
                      }
                      placeholder="Tìm kiếm theo mã, theo tên"
                      allowClear
                    />
                  </div>
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <RangePicker
                      // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                      value={
                        clear === 1
                          ? []
                          : start !== ''
                          ? [moment(start, dateFormat), moment(end, dateFormat)]
                          : []
                      }
                      style={{ width: '100%' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [
                          moment().startOf('month'),
                          moment().endOf('month'),
                        ],
                      }}
                      onChange={onChangeDate}
                    />
                  </div>
                </Col>
              </Row>

              <div
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  border: '1px solid rgb(243, 234, 234)',
                }}
              >
                <Table
                  loading={loading}
                  bordered
                  rowKey="_id"
                  rowSelection={rowSelection}
                  expandable={{
                    expandedRowRender: (record) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            flexDirection: 'column',
                          }}
                        >
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Mã hóa đơn:{' '}
                                </div>
                                <div>{record.order_id}</div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Trạng thái:{' '}
                                </div>
                                <div style={{ color: '#2F9BFF' }}>
                                  {record.status}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Tổng số lượng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách cần trả:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Thời gian:{' '}
                                </div>
                                <div>
                                  {moment(record.create_date).format(
                                    'YYYY-MM-DD, HH:mm:ss'
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người bán:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.customer &&
                                  record.customer.first_name
                                    ? `${record.customer.first_name} ${record.customer.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tạo:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Chi nhánh:{' '}
                                </div>
                                <div>
                                  {record && record.branch && record.branch.name
                                    ? `${record.branch.name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <div
                            style={{
                              backgroundColor: 'white',
                              marginTop: '1rem',
                              border: '1px solid rgb(231, 218, 218)',
                              width: '100%',
                            }}
                          >
                            <Table
                              bordered
                              columns={columnsDetailOrder}
                              dataSource={
                                record &&
                                record.order_details &&
                                record.order_details.length > 0
                                  ? record.order_details
                                  : []
                              }
                              scroll={{ y: 500, x: 1300 }}
                            />
                          </div>
                        </div>
                      )
                    },
                    expandedRowKeys: selectedRowKeys,
                    expandIconColumnIndex: -1,
                  }}
                  columns={columnsPromotionWebsite}
                  style={{ width: '100%' }}
                  pagination={false}
                  dataSource={order}
                  scroll={{ y: 500 }}
                />
                <Pagination
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChangeTable}
                  defaultCurrent={10}
                  onChange={onChangeTable}
                  total={countTable}
                />
              </div>
            </TabPane>
            <TabPane tab="Đơn hàng hủy" key="2">
              Chưa có
            </TabPane>
            <TabPane tab="Đơn hàng hoàn tiền" key="3">
              Chưa có
            </TabPane>
          </Tabs>
        ) : (
          <Tabs style={{ width: '100%' }} defaultActiveKey="1">
            <TabPane tab="Tất cả đơn hàng" key="1">
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    marginRight: '1rem',
                  }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <Input
                      style={{ width: '100%' }}
                      name="name"
                      value={valueSearchOrderDetail}
                      enterButton
                      onChange={onSearchOrderDetail}
                      className={
                        styles['orders_manager_content_row_col_search']
                      }
                      placeholder="Tìm kiếm theo mã, theo tên"
                      allowClear
                    />
                  </div>
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <RangePicker
                      value={
                        clear === 1
                          ? []
                          : start !== ''
                          ? [moment(start, dateFormat), moment(end, dateFormat)]
                          : []
                      }
                      style={{ width: '100%' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [
                          moment().startOf('month'),
                          moment().endOf('month'),
                        ],
                      }}
                      onChange={onChangeDate}
                    />
                  </div>
                </Col>
              </Row>

              <div
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  border: '1px solid rgb(243, 234, 234)',
                }}
              >
                <Table
                  loading={loading}
                  bordered
                  rowKey="_id"
                  rowSelection={rowSelection}
                  expandable={{
                    expandedRowRender: (record) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            flexDirection: 'column',
                          }}
                        >
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Mã hóa đơn:{' '}
                                </div>
                                <div>{record.order_id}</div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Trạng thái:{' '}
                                </div>
                                <div style={{ color: '#2F9BFF' }}>
                                  {record.status}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Tổng số lượng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{ width: '100%', marginRight: '1rem' }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách cần trả:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Thời gian:{' '}
                                </div>
                                <div>
                                  {moment(record.create_date).format(
                                    'YYYY-MM-DD, HH:mm:ss'
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người bán:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                    record.order_details.length > 0 &&
                                    record.order_details.reduce(
                                      (tempInit, value) => {
                                        return tempInit + value.quantity
                                      },
                                      0
                                    )}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tiền hàng:{' '}
                                </div>
                                <div>{`${formatCash(
                                  String(record.final_cost)
                                )} VNĐ`}</div>
                              </div>
                            </Col>
                          </Row>

                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Khách hàng:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.customer &&
                                  record.customer.first_name
                                    ? `${record.customer.first_name} ${record.customer.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Người tạo:{' '}
                                </div>
                                <div>
                                  {record &&
                                  record.employee &&
                                  record.employee.first_name &&
                                  record.employee.last_name
                                    ? `${record.employee.first_name} ${record.employee.last_name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                            }}
                          >
                            <Col
                              style={{
                                width: '100%',
                                marginTop: '1rem',
                                marginRight: '1rem',
                              }}
                              xs={24}
                              sm={24}
                              md={11}
                              lg={11}
                              xl={5}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    marginRight: '0.25rem',
                                  }}
                                >
                                  Chi nhánh:{' '}
                                </div>
                                <div>
                                  {record && record.branch && record.branch.name
                                    ? `${record.branch.name}`
                                    : ''}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <div
                            style={{
                              backgroundColor: 'white',
                              marginTop: '1rem',
                              border: '1px solid rgb(231, 218, 218)',
                              width: '100%',
                            }}
                          >
                            <Table
                              bordered
                              columns={columnsDetailOrder}
                              dataSource={
                                record &&
                                record.order_details &&
                                record.order_details.length > 0
                                  ? record.order_details
                                  : []
                              }
                              scroll={{ y: 500, x: 1300 }}
                            />
                          </div>
                        </div>
                      )
                    },
                    expandedRowKeys: selectedRowKeys,
                    expandIconColumnIndex: -1,
                  }}
                  columns={columnsPromotionWebsite}
                  style={{ width: '100%' }}
                  pagination={false}
                  dataSource={order}
                  scroll={{ y: 500 }}
                />
                <Pagination
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '1rem',
                  }}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChangeTable}
                  defaultCurrent={10}
                  onChange={onChangeTable}
                  total={countTable}
                />
              </div>
            </TabPane>
            <TabPane tab="Đơn hàng hủy" key="2">
              Chưa có
            </TabPane>
            <TabPane tab="Đơn hàng hoàn tiền" key="3">
              Chưa có
            </TabPane>
          </Tabs>
        )}
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search placeholder="Tìm kiếm khách hàng" enterButton />
            </div>
          </Popover>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(209, 191, 191)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            {' '}
            <Table
              rowKey="_id"
              scroll={{ y: 500 }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
