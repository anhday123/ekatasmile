import styles from './../order-list/order-list.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import {
  Input,
  Button,
  Tabs,
  Pagination,
  Row,
  Col,
  DatePicker,
  Table,
  Modal,
  Typography,
  Select,
  Form,
} from 'antd'
import { Link } from 'react-router-dom'
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { apiAllOrder } from './../../apis/order'
import { ROUTES, PERMISSIONS } from 'consts'
import Permissions from 'components/permission'
import { compare, compareCustom, tableSum, formatCash } from 'utils'

const { Text } = Typography
const { RangePicker } = DatePicker
const { TabPane } = Tabs

export default function OrderList() {
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [showUpdate, setShowUpdate] = useState(false)

  const dataTmp = [
    {
      _id: '612ca61b8997e5680e63d0fe',
      order_id: '34',
      bussiness: {
        _id: '6130603eca474e0a0c802a71',
        user_id: '1',
        business_id: '1',
        username: 'phandangluu',
        otp_code: false,
        otp_timelife: false,
        role_id: '2',
        email: 'phandangluu.viesoftware@gmail.com',
        phone: '0967845619',
        avatar: '',
        first_name: 'Phan Đăng',
        last_name: 'Lưu',
        sub_name: 'phandangluu',
        birthday: '1993-06-07',
        address: 'C7C/18H Phạm Hùng',
        sub_address: 'c7c/18hphamhung',
        district: 'Huyện Bình Chánh',
        sub_district: 'huyenbinhchanh',
        province: 'Hồ Chí Minh',
        sub_province: 'hochiminh',
        company_name: 'LULU',
        company_website: '',
        tax_code: '',
        fax: '',
        branch_id: '',
        store_id: '',
        create_date: '2021-09-02T12:25:18+07:00',
        last_login: '2021-09-02T12:33:29+07:00',
        creator: ' ',
        exp: '2021-09-12T12:25:18+07:00',
        is_new: true,
        active: true,
        sub_company_name: 'lulu',
      },
      code: '000034',
      order_type: null,
      platform: 'SHOP',
      branch: {
        _id: '613c34305965867d61e1bd82',
        branch_id: '1',
        business_id: '2',
        code: '1000001',
        name: 'HAI BÀ TRƯNG',
        sub_name: 'haibatrung',
        logo: '',
        phone: '0833963029',
        email: '',
        fax: '',
        website: '',
        latitude: '',
        longtitude: '',
        warehouse_type: 'sở hữu',
        sub_warehouse_type: 'sohuu',
        address: 'TPHCM',
        sub_address: 'tphcm',
        district: 'Huyện Mường Khương',
        sub_district: 'huyenmuongkhuong',
        province: 'Lào Cai',
        sub_province: 'laocai',
        accumulate_point: false,
        use_point: false,
        create_date: '2021-09-11T11:44:32+07:00',
        creator_id: '2',
        active: true,
      },
      employee: {
        _id: '6130603eca474e0a0c802a71',
        user_id: '1',
        business_id: '1',
        username: 'phandangluu',
        otp_code: false,
        otp_timelife: false,
        role_id: '2',
        email: 'phandangluu.viesoftware@gmail.com',
        phone: '0967845619',
        avatar: '',
        first_name: 'Phan Đăng',
        last_name: 'Lưu',
        sub_name: 'phandangluu',
        birthday: '1993-06-07',
        address: 'C7C/18H Phạm Hùng',
        sub_address: 'c7c/18hphamhung',
        district: 'Huyện Bình Chánh',
        sub_district: 'huyenbinhchanh',
        province: 'Hồ Chí Minh',
        sub_province: 'hochiminh',
        company_name: 'LULU',
        company_website: '',
        tax_code: '',
        fax: '',
        branch_id: '',
        store_id: '',
        create_date: '2021-09-02T12:25:18+07:00',
        last_login: '2021-09-02T12:33:29+07:00',
        creator: ' ',
        exp: '2021-09-12T12:25:18+07:00',
        is_new: true,
        active: true,
        sub_company_name: 'lulu',
      },
      customer: {
        _id: '611b8e9c2b94861ee4e42aec',
        customer_id: '98',
        bussiness: '1',
        code: 'DEMOBUSSINESS_98',
        phone: '7493697401',
        type: 'Tiềm năng',
        first_name: 'Khách hàng',
        last_name: 'Demo 98',
        gender: 'NAM',
        birthday: '2021-08-17T17:28:01+07:00',
        address: 'Số nhà - tên đường',
        ward: 'Xã/Phường',
        district: 'Quận Gò Vấp',
        province: 'Hồ Chí Minh',
        balance: [],
        create_date: '2021-08-17T17:25:32+07:00',
        last_login: '2021-08-17T17:25:32+07:00',
        creator: '1',
        active: true,
      },
      payment: {
        _id: '61013480db4cfa8d8c768b70',
        payment_id: '1',
        bussiness: '1',
        name: 'Tiền mặt',
        type: 'CASH',
        description: 'mô tả',
        tutorial: 'hướng dẫn sử dụng',
        branchs: ['1', '2', '3', '4'],
        active: true,
      },
      info_payment: null,
      taxes: [
        {
          _id: '613b20a6c95b7c3f7306c036',
          tax_id: '1',
          business_id: '2',
          code: '1000001',
          name: 'VAT',
          sub_name: 'vat',
          value: 5,
          description: '',
          default: false,
          create_date: '2021-09-10T16:08:54+07:00',
          creator_id: '2',
          active: true,
        },
      ],
      shipping_company: {},
      shipping: '',
      order_details: [
        {
          quantityAvailable: 100,
          sale_price: 500000,
          title: 'SẢN PHẨM MẪU 2 WHITE S',
          product_id: '2',
          sku: 'SPM2-WHITE-S',
          supplier: 'NCC1',
          options: [
            {
              name: 'COLOR',
              values: 'WHITE',
            },
            {
              name: 'SIZE',
              values: 'S',
            },
          ],
          quantity: 1,
          total_cost: 500000,
          voucher: '',
          discount: 0,
          final_cost: 500000,
          import_price: 90000,
          base_price: 110000,
        },
      ],
      voucher: '',
      promotion: {},
      total_cost: 500000,
      discount: 0,
      final_cost: 525000,
      price_real: 525000,
      note: '',
      fulfillments: [],
      latitude: '',
      longtitude: '',
      bill_status: 'PROCESSING',
      shipping_status: 'COMPLETE',
      hmac: null,
      timestampe: null,
      create_date: '2021-08-30T16:34:19+07:00',
      creator: {
        _id: '6130603eca474e0a0c802a71',
        user_id: '1',
        business_id: '1',
        username: 'phandangluu',
        otp_code: false,
        otp_timelife: false,
        role_id: '2',
        email: 'phandangluu.viesoftware@gmail.com',
        phone: '0967845619',
        avatar: '',
        first_name: 'Phan Đăng',
        last_name: 'Lưu',
        sub_name: 'phandangluu',
        birthday: '1993-06-07',
        address: 'C7C/18H Phạm Hùng',
        sub_address: 'c7c/18hphamhung',
        district: 'Huyện Bình Chánh',
        sub_district: 'huyenbinhchanh',
        province: 'Hồ Chí Minh',
        sub_province: 'hochiminh',
        company_name: 'LULU',
        company_website: '',
        tax_code: '',
        fax: '',
        branch_id: '',
        store_id: '',
        create_date: '2021-09-02T12:25:18+07:00',
        last_login: '2021-09-02T12:33:29+07:00',
        creator: ' ',
        exp: '2021-09-12T12:25:18+07:00',
        is_new: true,
        active: true,
        sub_company_name: 'lulu',
      },
      active: true,
      _bussiness: 'Phan Đăng Lưu',
      _creator: 'Phan Đăng Lưu',
      _customer: 'Khách hàng Demo 98',
    },
  ]

  const columnsPromotion = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'order_id',
      width: 150,
      sorter: (a, b) => compare(a, b, 'order_id'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 200,
      render: (text, record) =>
        text && moment(text).format('YYYY-MM-DD, HH:mm:ss'),
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerMain',
      width: 150,
      render: (text, record) =>
        record && record.customer && record.customer.first_name
          ? `${record.customer.first_name} ${record.customer.last_name}`
          : '',
      sorter: (a, b) =>
        compareCustom(
          `${a.customer.first_name} ${a.customer.last_name}`,
          `${b.customer.first_name} ${b.customer.last_name}`
        ),
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
      title: 'Thanh toán',
      dataIndex: 'bill_status',
      width: 150,
      render(data) {
        return data.toLowerCase() === 'complete' ? (
          <span style={{ color: '#04B000' }}>
            <b>Đã thanh toán</b>
          </span>
        ) : (
          <span style={{ color: '#E59700' }}>
            <b>Chưa thanh toán</b>
          </span>
        )
      },
    },
    {
      title: 'Giao hàng',
      dataIndex: 'shipping_status',
      width: 150,
      render(data) {
        return data.toLowerCase() === 'complete' ? (
          <span style={{ color: '#04B000' }}>
            <b>Đã giao hàng</b>
          </span>
        ) : (
          <span style={{ color: '#E59700' }}>
            <b>Chưa giao hàng</b>
          </span>
        )
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      width: 150,
      render: (text, record) => `${formatCash(String(text))} VNĐ`,
      sorter: (a, b) => compare(a, b, 'final_cost'),
    },
    // {
    //   title: 'Khách đã trả',
    //   dataIndex: 'final_cost',
    //   width: 150,
    //   render: (text, record) => `${formatCash(String(text))} VNĐ`,
    //   sorter: (a, b) => compare(a, b, 'final_cost'),
    // },
  ]

  const columnsDetailOrder = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
    },
    {
      title: 'ảnh',
      dataIndex: 'image',
      render(data) {
        return data && <img src={data[0]} width="60" />
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render(data, record) {
        return record.title || data
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Đơn vị',
      dataIndex: '',
      // render(data) {
      //   return formatCash(data)
      // },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'sale_price',
      render(data) {
        return formatCash(data)
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      render(data) {
        return formatCash(data)
      },
    },
  ]

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
            <Permissions permissions={[PERMISSIONS.tao_don_hang]}>
              <Link
                to={ROUTES.ORDER_CREATE_SHIPPING}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button
                  size="large"
                  type="primary"
                  icon={<PlusCircleOutlined />}
                >
                  Tạo đơn hàng
                </Button>
              </Link>
            </Permissions>
          </Col>
        </Row>

        <Tabs style={{ width: '100%' }} defaultActiveKey="1">
          <TabPane
            tab={
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                Tất cả đơn hàng
              </span>
            }
            key="1"
          ></TabPane>
          <TabPane
            tab={
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                Đơn hàng Hủy
              </span>
            }
            key="2"
          ></TabPane>
          <TabPane
            tab={
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                Đơn hàng hoàn tiền
              </span>
            }
            key="3"
          ></TabPane>
        </Tabs>

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
            size="small"
            rowKey="_id"
            loading={loading}
            bordered
            rowSelection={rowSelection}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <div
                    style={{
                      width: '100%',
                      background: '#fff',
                    }}
                  >
                    <Row
                      justify="space-between"
                      style={{ width: '1000px', padding: 10 }}
                    >
                      <Col span={5}>
                        <Row>Mã hóa đơn: {record.order_id}</Row>
                        <Row>
                          Thời gian: {moment(record.create_date).format('L')}
                        </Row>
                        <Row>Khách hàng: {record._customer}</Row>
                        <Row>Cửa hàng: {record._bussiness}</Row>
                      </Col>
                      <Col span={5}>
                        <Row>
                          <b
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowUpdate(true)}
                          >
                            Thông tin giao hàng <EditOutlined />
                          </b>
                        </Row>
                        <Row>Trạng thái</Row>
                        <Row>Nhân viên bán: {record._creator}</Row>
                        <Row>Nhân viên tạo: {record._creator}</Row>
                      </Col>
                      <Col span={5}>
                        <Row>
                          Tổng số lượng:{' '}
                          {record.order_details.reduce(
                            (a, b) => a + b.quantity,
                            0
                          )}
                        </Row>
                        <Row>Tổng tiền: {record.total_cost}</Row>
                        <Row>Chiết khấu: {record.discount}</Row>
                        <Row>Thành tiền: {record.final_cost}</Row>
                      </Col>
                      <Col span={6}>
                        <Row>Ghi chú</Row>
                        <Row>
                          <Input.TextArea />
                        </Row>
                        <Row>Nhãn</Row>
                        <Row>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                          ></Select>
                        </Row>
                        <Row justify="end" style={{ margin: '1em 0' }}>
                          <Button type="primary">Lưu</Button>
                        </Row>
                      </Col>
                    </Row>
                    <Table
                      size="small"
                      bordered
                      style={{ width: '100%' }}
                      columns={columnsDetailOrder}
                      dataSource={
                        record &&
                        record.order_details &&
                        record.order_details.length > 0
                          ? record.order_details
                          : []
                      }
                    />
                  </div>
                )
              },
              // expandedRowKeys: selectedRowKeys,
              // expandIconColumnIndex: -1,
              rowExpandable: (record) => true,
            }}
            columns={columnsPromotion}
            style={{ width: '100%' }}
            pagination={false}
            scroll={{ x: 'max-content' }}
            dataSource={dataTmp} //order
            summary={(pageData) => {
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>Tổng</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        {formatCash(tableSum(pageData, 'final_cost'))} VND
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
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
      </div>
      <Modal
        title="Cập nhật địa chỉ giao hàng"
        visible={showUpdate}
        onCancel={() => setShowUpdate(false)}
        onOk={() => setShowUpdate(false)}
        centered
      >
        <Form layout="vertical">
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="tên khách hàng">
                <Input placeholder="Nhập  tên khách hàng" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Địa chỉ">
                <Input placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tỉnh/ Thành phố">
                <Select
                  placeholder="Chọn Tỉnh/Thành phố"
                  style={{ width: '100%' }}
                  size="large"
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quận/huyện">
                <Select
                  placeholder="Chọn Quận/Huyện"
                  style={{ width: '100%' }}
                  size="large"
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quốc gia">
                <Select
                  placeholder="Chọn Quốc gia"
                  style={{ width: '100%' }}
                  size="large"
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Công ty">
                <Input placeholder="Nhập tên công ty" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
