import styles from './../add/add.module.scss'
import {
  Popconfirm,
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  notification,
  Popover,
  Steps,
  message,
  Tree,
  Table,
  Modal,
  Typography,
} from 'antd'
import { Link } from 'react-router-dom'
import user from './../../../../assets/img/user.png'
import {
  ArrowLeftOutlined,
  AudioOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import moment from 'moment'
import { ROUTES } from 'consts'
const { Text } = Typography
const { Option } = Select
const { Step } = Steps
const dateFormat = 'YYYY/MM/DD'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 150,
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
    width: 150,
  },
  {
    title: 'Thành tiền',
    dataIndex: 'moneyTotal',
    width: 150,
  },
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    skuCode: <div>{`IAN ${i}`}</div>,
    productName: `Ly thủy tinh`,
    unit: `${i} đơn vị`,
    quantity: i,
    price: i,
    moneyTotal: i,
  })
}
const contentSearch = (
  <div>
    <div>Gợi ý 1</div>
    <div>Gợi ý 2</div>
  </div>
)
const treeData = [
  {
    title: 'Tất cả sản phẩm (tối đa 1000 sản phẩm)',
    key: 'productAll',
  },
  {
    title: 'Tất cả các nhóm sản phẩm',
    key: 'productGroupAll',
    children: [
      {
        title: 'Tất cả loại sản phẩm',
        key: 'productAllType',
      },
      {
        title: 'Tất cả nhãn sản phẩm',
        key: 'productAllBranch',
      },
    ],
  },
]
export default function OrderCreateShippingAdd() {
  const [current, setCurrent] = useState(0)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modal3Visible, setModal3Visible] = useState(false)
  const [modal4Visible, setModal4Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll'])
  const [checkedKeys, setCheckedKeys] = useState([''])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const modal4VisibleModal = (modal4Visible) => {
    setModal4Visible(modal4Visible)
  }

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const { Search } = Input

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue)
  }

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue)
  }

  const content = (
    <div
      style={{
        display: 'flex',
        margin: '0.25rem 0',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          color: 'white',
          cursor: 'pointer',
          marginBottom: '1rem',
          backgroundColor: '#3965BA',
          padding: '0.5rem 1rem',
        }}
      >
        Dịch vụ vận chuyển
      </div>
      <div
        style={{
          color: 'white',
          cursor: 'pointer',
          backgroundColor: '#3965BA',
          padding: '0.5rem 1rem',
        }}
      >
        Nhận tại cửa hàng
      </div>
    </div>
  )
  const onFinishPaymentConfirm = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailedPaymentConfirm = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thanh toán đơn hàng thành công.',
    })
  }
  const openNotificationExportProduct = () => {
    notification.success({
      message: 'Thành công',
      description: 'Xuất kho thành công.',
    })
  }
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }
  const paymentConfirm = () => {
    openNotification()
    modal3VisibleModal(false)
  }
  const onClickExportProduct = () => {
    openNotificationExportProduct()
    modal4VisibleModal(false)
  }
  return (
    <>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={styles['product_check_add']}
      >
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={5} xl={5}>
            <Link
              to={ROUTES.ORDER_CREATE_SHIPPING}
              style={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div>
                <ArrowLeftOutlined
                  style={{
                    color: 'black',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                />
              </div>
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginLeft: '0.5rem',
                }}
              >
                Đơn hàng MONB223
              </div>
            </Link>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            marginTop: '1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Steps
            size="small"
            style={{ height: '20rem', paddingTop: '1rem' }}
            direction="vertical"
            current={current}
            // onChange={onChange}
          >
            <Step title="Đặt hàng" description="2021/07/01, 14:07" />
            <Step title="Duyệt" description="2021/07/02, 14:07" />
            <Step title="Đóng gói" description="2021/07/03, 14:07" />
            <Step title="Xuất kho" description="2021/07/04, 14:07" />
            <Step title="Hoàn thành" description="2021/07/05, 14:07" />
          </Steps>
        </div>
        <Row
          style={{
            display: 'flex',
            marginTop: '1rem',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Col
            style={{
              width: '100%',
              backgroundColor: 'white',
              marginBottom: '1rem',
              padding: '0rem 1rem 1rem 1rem',
            }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '1rem',
                      }}
                    >
                      Thông tin khách hàng
                    </div>
                  </Col>
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      Công nợ hiện tai: 0
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
                      marginTop: '1rem',
                      marginRight: '1.5rem',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    xs={24}
                    sm={24}
                    md={1}
                    lg={1}
                    xl={1}
                  >
                    <img
                      style={{ width: '3rem', height: '3rem' }}
                      src={user}
                      alt=""
                    />
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={21}
                    lg={21}
                    xl={21}
                    style={{
                      display: 'flex',
                      marginTop: '1rem',
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
                      <b style={{ marginRight: '0.25rem' }}>Tên: </b>Văn Văn
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <b style={{ marginRight: '0.25rem' }}>
                        Địa chỉ giao hàng:{' '}
                      </b>
                      12 phan huy ích, gò vấp, hcm
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <b style={{ marginRight: '0.25rem' }}>Liên hệ: </b>
                      0384943497
                    </div>
                    <Link
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      Thay đổi địa chỉ giao hàng
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col
            style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
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
              <Row style={{ width: '100%' }}>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
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
                      style={{ width: '100%' }}
                      xs={24}
                      sm={24}
                      md={8}
                      lg={8}
                      xl={8}
                    >
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: '1rem',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          width: '100%',
                          color: 'black',
                          fontWeight: '600',
                          fontSize: '1rem',
                        }}
                      >
                        Thông tin đơn hàng
                      </div>
                    </Col>
                    <Col
                      style={{ width: '100%', marginBottom: '1rem' }}
                      xs={24}
                      sm={24}
                      md={8}
                      lg={8}
                      xl={8}
                    >
                      <div
                        style={{
                          display: 'flex',
                          color: 'black',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '7.5rem',
                          backgroundColor: '#FFAC2F',
                          borderRadius: '2rem',
                          padding: '0.5rem',
                        }}
                      >
                        Đang giao dịch
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <b>Mã đơn hàng: </b> MONB223
                    </div>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <b>Ngày hẹn giao: </b> 2021/07/01, 09:30 AM
                    </div>
                  </div>
                </Col>
              </Row>
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <b>Chi nhánh: </b> chi nhánh mặc định
                    </div>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <b>Tên nhân viên: </b> Nguyễn Văn Tỷ
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            marginTop: '1rem',
            padding: '1rem 1rem 1rem 1rem',
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
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Danh sách sản phẩm
          </div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <Popover
                placement="bottomLeft"
                content={contentSearch}
                trigger="click"
              >
                <Search
                  style={{ width: '100%' }}
                  placeholder="Tìm kiếm theo tên sản phẩm, mã sku"
                  enterButton
                />
              </Popover>
            </Col>
          </Row>
          <div
            style={{
              border: '1px solid rgb(224, 208, 208)',
              marginTop: '1rem',
              width: '100%',
            }}
          >
            <Table
              size="small"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              scroll={{ y: 500 }}
            />
          </div>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger style={{ width: '7.5rem' }}>
                  Xóa sản phẩm
                </Button>
              </Popconfirm>
            </div>
          ) : (
            ''
          )}
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
                marginTop: '0.75rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <b style={{ marginRight: '0.25rem' }}>Tổng tiền (10 sản phẩm):</b>{' '}
              200.000 VNĐ
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '0.75rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <b style={{ marginRight: '0.25rem' }}>Chiết khấu:</b> 0
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '0.75rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <b style={{ marginRight: '0.25rem' }}>Phí giao hàng:</b> 0
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '0.75rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <b style={{ marginRight: '0.25rem' }}>Khách phải trả:</b> 200.000
              VNĐ
            </div>
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Col
            style={{
              width: '100%',
              marginTop: '1rem',
              backgroundColor: 'white',
              padding: '1rem',
            }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}
              >
                Xác nhận thanh toán
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <b style={{ marginRight: '0.25rem' }}>Đã thanh toán: </b> 0
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <b style={{ marginRight: '0.25rem' }}>Còn phải trả: </b>{' '}
                  60.000 VNĐ
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <b style={{ marginRight: '0.25rem' }}>
                    Hính thức thành toán dự kiến:{' '}
                  </b>{' '}
                  tiền mặt
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            marginTop: '1rem',
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
              color: 'black',
              fontSize: '1rem',
              fontWeight: '600',
            }}
          >
            Đóng gói và giao hàng
          </div>
          <Row style={{ width: '100%' }}>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <div className={styles['shipping']}>
                <Row style={{ marginTop: '1rem', width: '100%' }}>
                  <Col
                    style={{ marginBottom: '1rem' }}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={4}
                  >
                    MOND223
                  </Col>
                  <Col
                    style={{ marginBottom: '1rem' }}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={20}
                  >
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2F9BFF',
                        borderRadius: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '7.5rem',
                      }}
                    >
                      Chờ lấy hàng
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <PrinterOutlined
                      style={{
                        color: 'black',
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginLeft: '0.5rem',
                    }}
                  >
                    In phiếu đóng gói
                  </div>
                </Row>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div style={{ color: '#757575', fontSize: '1rem' }}>
                      Phương thức
                    </div>
                    <div>Nhận tại cửa hàng</div>
                  </Col>
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div style={{ color: '#757575', fontSize: '1rem' }}>
                      Mã vận đơn
                    </div>
                    <div>MOND223</div>
                  </Col>
                </Row>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div style={{ color: '#757575', fontSize: '1rem' }}>
                      Ngày đóng gói
                    </div>
                    <div>2021/07/01, 15:10</div>
                  </Col>
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div style={{ color: '#757575', fontSize: '1rem' }}>
                      Tổng tiền
                    </div>
                    <div>60.000 VNĐ</div>
                  </Col>
                </Row>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div style={{ color: '#757575', fontSize: '1rem' }}>
                      Sản phẩm
                    </div>
                    <div>Ly thủy tinh cap cấ từ Hàn Quốc</div>
                  </Col>
                </Row>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Col
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div>
                      <Button
                        style={{
                          color: 'white',
                          width: '7.5rem',
                          backgroundColor: '#9E9E9E',
                        }}
                      >
                        Hủy đóng gói
                      </Button>
                    </div>
                  </Col>
                  <Col
                    onClick={() => modal4VisibleModal(true)}
                    style={{ width: '100%', marginTop: '1rem' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div>
                      <Button
                        style={{ color: 'white', width: '7.5rem' }}
                        type="primary"
                      >
                        Xuất kho
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div>
                  <div></div>
                  <div></div>
                </div>
                <div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            marginTop: '1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgb(231, 220, 220)',
              paddingBottom: '1rem',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Đơn hàng đã được thanh toán toàn bộ
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div>Xác nhận thanh toán 60.000 VNĐ thành công</div>
            <div>2021/07/01, 15:42</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            marginTop: '1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgb(231, 220, 220)',
              paddingBottom: '1rem',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            Tất cả sản phẩm đã được giao
          </div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <Row
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={3}
                >
                  MOND223
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={20}
                >
                  <div
                    style={{
                      backgroundColor: '#009846',
                      marginLeft: '2rem',
                      padding: '0.5rem 0.1rem',
                      borderRadius: '2rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '7.5rem',
                    }}
                  >
                    Đã giao hàng
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                2021/07/01, 15:42
              </div>
            </Col>
          </Row>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <Row
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Col
                style={{
                  display: 'flex',
                  marginTop: '1rem',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <Form.Item
                  onClick={() => modal3VisibleModal(true)}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    style={{
                      width: '10rem',
                      backgroundColor: '#FF8E0A',
                      color: 'white',
                    }}
                  >
                    Xác nhận thanh toán
                  </Button>
                </Form.Item>
              </Col>
              <Col
                style={{
                  display: 'flex',
                  marginLeft: '2rem',
                  marginTop: '1rem',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <Popover placement="top" content={content}>
                  <Form.Item
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      style={{ width: '10rem' }}
                      type="primary"
                      htmlType="submit"
                    >
                      Giao hàng
                    </Button>
                  </Form.Item>
                </Popover>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          title="Xuất kho cho đơn giao hàng"
          centered
          footer={null}
          visible={modal4Visible}
          onOk={() => modal4VisibleModal(false)}
          onCancel={() => modal4VisibleModal(false)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'black',
                borderBottom: '1px solid rgb(230, 216, 216)',
                width: '100%',
                paddingBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              Bạn có chắc chắn xuất kho đơn hàng này không?
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '1rem',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div onClick={() => modal4VisibleModal(false)}>
                <Button
                  type="primary"
                  style={{
                    width: '5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  danger
                >
                  Hủy
                </Button>
              </div>
              <div
                onClick={onClickExportProduct}
                style={{ marginLeft: '1rem' }}
              >
                <Button
                  style={{
                    width: '5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  type="primary"
                >
                  Xuất kho
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title="Xác nhận thanh toán cho đơn MOND223"
          centered
          visible={modal3Visible}
          footer={null}
          width={700}
          onOk={() => modal3VisibleModal(false)}
          onCancel={() => modal3VisibleModal(false)}
        >
          <Form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
            onFinish={onFinishPaymentConfirm}
            onFinishFailed={onFinishFailedPaymentConfirm}
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
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Phương thức thanh toán
                    </div>
                    <Form.Item
                      name="paymentMethod"
                      // label="Select"
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select defaultValue="moneyPaper">
                        <Option value="moneyPaper">Tiền mặt</Option>
                        <Option value="atm">Chuyển khoản</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Số tiền thanh toán
                    </div>
                    <Form.Item
                      // label="Username"
                      name="paymentMoney"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Input defaultValue="60.000 VNĐ" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Ngày thanh toán
                    </div>
                    <Form.Item
                      name="paymentDate"
                      // label="Select"
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        defaultValue={moment('2015/01/01', dateFormat)}
                        format={dateFormat}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Tham chiếu</div>
                    <Form.Item
                      // label="Username"
                      name="paymentMoney"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div onClick={() => modal3VisibleModal(false)}>
                  <Button type="primary" style={{ width: '5rem' }} danger>
                    Hủy
                  </Button>
                </div>
                <div onClick={paymentConfirm} style={{ marginLeft: '1rem' }}>
                  <Button type="primary" style={{ width: '5rem' }}>
                    Áp dụng
                  </Button>
                </div>
                <div></div>
              </div>
            </div>
          </Form>
        </Modal>
        <Modal
          title="Thêm nhanh sản phẩm"
          centered
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div onClick={() => modal2VisibleModal(false)}>
                <Button type="primary" style={{ width: '5rem' }} danger>
                  Hủy
                </Button>
              </div>
              <div>
                <Button
                  type="primary"
                  style={{ width: '5rem', marginLeft: '1rem' }}
                >
                  Thêm
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  )
}
