import React, { useState, useEffect } from 'react'
import styles from './sell.module.scss'

import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { dataMockup } from './data-mockup'
import { formatCash } from 'utils'
import { PERMISSIONS, ROUTES } from 'consts'
import noData from 'assets/icons/no-data.png'
import { decodeToken } from 'react-jwt'

//components
import AddCustomer from 'views/actions/customer/add'
import FilterProductsByCategory from './filter-by-category'
import FilterProductsBySku from './filter-by-sku'
import ModalKeyboardShortCuts from './keyboard-shortcuts'
import ModalPromotion from './promotion-available'
import Permission from 'components/permission'
import PaymentMethods from './payment-methods'
import ModalOrdersReturn from './orders-returns'
import ModalChangeStore from './change-store'
import ModalInfoSeller from './info-seller'
import CustomerUpdate from 'views/actions/customer/update'

//antd
import {
  Row,
  Select,
  Tabs,
  Popconfirm,
  Space,
  Tooltip,
  Modal,
  Button,
  Divider,
  Switch,
  Radio,
  Input,
  InputNumber,
  Table,
  Pagination,
  Popover,
  Affix,
} from 'antd'

//icons antd
import {
  SearchOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  CloseCircleTwoTone,
  MoreOutlined,
  UserOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  PlusSquareFilled,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons'

//apis
import { getAllCustomer } from 'apis/customer'
import { apiAllShipping } from 'apis/shipping'
import { getProductsStore } from 'apis/product'

export default function Sell() {
  const history = useHistory()
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)
  const sell = useSelector((state) => state.sell)

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [shippingsMethod, setShippingsMethod] = useState([])
  const [visibleCustomerUpdate, setVisibleCustomerUpdate] = useState(false)

  const [invoices, setInvoices] = useState([])
  const [activeKeyTab, setActiveKeyTab] = useState('')
  const [isDelivery, setIsDelivery] = useState(false)

  const [customer, setCustomer] = useState(null)
  const [customers, setCustomers] = useState([])

  //object invoice
  const initInvoice = {
    id: uuidv4(),
    name: 'Đơn ' + (invoices.length + 1),
    customer: null,
  }

  var elem = document.documentElement
  /* View in fullscreen */
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen()
    }

    setIsFullScreen(true)
  }

  /* Close fullscreen */
  function closeFullscreen() {
    setIsFullScreen(false)

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msExitFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  const SHORT_CUTS = [
    {
      text: 'Thanh toán',
      icon: '(F1)',
    },
    {
      text: 'Thêm sản phẩm vào hoá đơn',
      icon: '(F3)',
    },
    {
      text: 'Nhập khách hàng mới',
      icon: '(F4)',
    },
    {
      text: 'Điều chỉnh phương thức thanh toán (F8)',
      icon: '',
    },
  ]

  const ModalQuantityProduct = ({ product }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const column = [
      { title: 'Chi nhanh' },
      { title: 'Số lượng', dataIndex: 'total_quantity' },
    ]

    const content = (
      <div>
        <Row justify="space-between">
          <span>Giá bán lẻ</span>
          <span>{formatCash(100000)}</span>
        </Row>
        <Row justify="space-between">
          <span>Giá bán sỉ</span>
          <span>{formatCash(80000)}</span>
        </Row>
        <Row justify="space-between">
          <span>Có thể bán</span>
          <span>{formatCash(100)}</span>
        </Row>
        <Row justify="space-between">
          <span>Hệ thống</span>
          <span>{formatCash(100)}</span>
        </Row>
        <Row justify="space-between">
          <span>Áp dụng thuế</span>
          <span></span>
        </Row>
      </div>
    )

    return (
      <>
        <Popover
          content={content}
          placement="bottom"
          title={
            <Row
              wrap={false}
              justify="space-between"
              align="middle"
              style={{ maxWidth: 450, minWidth: 250 }}
            >
              <p
                style={{
                  marginBottom: 0,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '-webkit-line-clamp': '1',
                  '-webkit-box-orient': 'vertical',
                  display: '-webkit-box',
                }}
              >
                Tên sản phẩm
              </p>
              <SearchOutlined
                onClick={(e) => {
                  toggle()
                  e.stopPropagation()
                }}
                style={{ cursor: 'pointer', marginLeft: 30 }}
              />
            </Row>
          }
        >
          <ExclamationCircleOutlined
            style={{
              color: '#1991FF',
              fontSize: 12,
              cursor: 'pointer',
              marginLeft: 6,
            }}
          />
        </Popover>
        <Modal
          footer={null}
          visible={visible}
          onCancel={toggle}
          title={product && product.title}
        >
          <Table style={{ width: '100%' }} columns={column} />
        </Modal>
      </>
    )
  }

  const ModalNoteProduct = ({ product }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    return (
      <>
        <div
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 12,
            color: 'gray',
            cursor: 'pointer',
          }}
        >
          <p className={styles['sell-product__item-note']}>Ghi chú</p>
          <EditOutlined style={{ marginLeft: 5 }} />
        </div>
        <Modal
          title={product && product.title}
          onCancel={toggle}
          visible={visible}
        >
          <div>
            Ghi chú
            <Input.TextArea
              placeholder="Nhập ghi chú"
              rows={4}
              style={{ width: '100%' }}
            />
          </div>
        </Modal>
      </>
    )
  }

  const ModalAddCustomer = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    return (
      <>
        <PlusSquareFilled
          onClick={toggle}
          style={{
            fontSize: 34,
            color: '#0362BA',
            cursor: 'pointer',
          }}
        />
        <Modal
          onCancel={toggle}
          width={700}
          footer={null}
          title="Thêm khách hàng mới"
          visible={visible}
        >
          <AddCustomer text="Thêm" reload={_getCustomers} />
        </Modal>
      </>
    )
  }

  const _getCustomers = async () => {
    try {
      const res = await getAllCustomer()
      if (res.status === 200) setCustomers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getShippingsMethod = async () => {
    try {
      const res = await apiAllShipping()
      if (res.status === 200) setShippingsMethod(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getProducts = async (store_id) => {
    try {
      const res = await getProductsStore({ store_id })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getCustomers()
    _getShippingsMethod()
  }, [])

  useEffect(() => {
    //back to login
    if (!localStorage.getItem('accessToken')) history.push(ROUTES.LOGIN)
    // else {
    //   const data = decodeToken(localStorage.getItem('accessToken'))
    //   if (!localStorage.getItem('storeSell')) {
    //     localStorage.setItem('storeSell', JSON.stringify(data.data._store))
    //     _getProducts(data.data._store.store_id)
    //   } else
    //     _getProducts(JSON.parse(localStorage.getItem('storeSell')).store_id)
    // }
  }, [])

  //init invoice
  useEffect(() => {
    setActiveKeyTab(initInvoice.id)

    setInvoices([initInvoice])

    dispatch({ type: 'UPDATE_INVOICE', data: [initInvoice] })
  }, [])

  return (
    <div className={styles['sell-container']}>
      <div className={styles['sell-header']}>
        <Row align="middle" wrap={false}>
          <div className="select-product-sell">
            <Select
              dropdownClassName="dropdown-select-search-product"
              allowClear
              showSearch
              clearIcon={<CloseOutlined style={{ color: 'black' }} />}
              suffixIcon={
                <SearchOutlined style={{ color: 'black', fontSize: 15 }} />
              }
              className={styles['search-product']}
              placeholder="Thêm sản phẩm vào đơn"
              dropdownRender={(menu) => (
                <div>
                  <Permission permissions={[PERMISSIONS.them_san_pham]}>
                    <Row
                      wrap={false}
                      align="middle"
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(ROUTES.PRODUCT_ADD, '_blank')}
                    >
                      <div
                        style={{
                          paddingLeft: 15,
                          width: 45,
                          height: 50,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <PlusSquareOutlined
                          style={{
                            fontSize: 19,
                          }}
                        />
                      </div>
                      <p
                        style={{
                          marginLeft: 20,
                          marginBottom: 0,
                          fontSize: 16,
                        }}
                      >
                        Thêm sản phẩm mới
                      </p>
                    </Row>
                  </Permission>
                  {menu}
                </div>
              )}
            >
              {dataMockup.variants.map((data, index) => (
                <Select.Option value={data.title} key={index}>
                  <Row
                    align="middle"
                    wrap={false}
                    style={{ padding: '7px 13px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={data.image[0] && data.image[0]}
                      alt=""
                      style={{
                        minWidth: 40,
                        minHeight: 40,
                        maxWidth: 40,
                        maxHeight: 40,
                        objectFit: 'cover',
                      }}
                    />

                    <div style={{ width: '100%', marginLeft: 15 }}>
                      <Row wrap={false} justify="space-between">
                        <span
                          style={{
                            maxWidth: 200,
                            marginBottom: 0,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            display: '-webkit-box',
                          }}
                        >
                          {data.title}
                        </span>
                        <p style={{ marginBottom: 0, fontWeight: 500 }}>
                          {formatCash(data.sale_price)}
                        </p>
                      </Row>
                      <Row wrap={false} justify="space-between">
                        <p style={{ marginBottom: 0, color: 'gray' }}>
                          {data.sku}
                        </p>
                        <p style={{ marginBottom: 0, color: 'gray' }}>
                          Có thể bán: {formatCash(data.total_quantity)}
                        </p>
                      </Row>
                    </div>
                  </Row>
                </Select.Option>
              ))}
            </Select>
          </div>
          <img
            src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/b2c0b183-9330-4582-8ff0-9050b411532c/barcode 3.png"
            alt=""
            style={{
              width: 30,
              height: 30,
              marginLeft: 17,
              cursor: 'pointer',
            }}
          />
        </Row>
        <Row align="middle" style={{ marginLeft: 30 }}>
          <Tabs
            hideAdd={invoices.length > 9 && true}
            moreIcon={<MoreOutlined style={{ color: 'white', fontSize: 16 }} />}
            activeKey={activeKeyTab}
            onEdit={(key, action) => {
              const invoicesNew = [...invoices]
              if (action === 'add') {
                invoicesNew.push(initInvoice)
                setInvoices([...invoicesNew])
                setActiveKeyTab(initInvoice.id)
                console.log(initInvoice.id)
              }
            }}
            onChange={(activeKey) => setActiveKeyTab(activeKey)}
            tabBarStyle={{ height: 55 }}
            type="editable-card"
            className="tabs-invoices"
            addIcon={
              <PlusOutlined
                style={{ color: 'white', fontSize: 21, marginLeft: 7 }}
              />
            }
          >
            {invoices.map((invoice, index) => (
              <Tabs.TabPane
                closeIcon={
                  <Popconfirm
                    okText="Đồng ý"
                    cancelText="Từ chối"
                    title="Bạn có muốn xoá hoá đơn này ?"
                    onConfirm={() => {
                      const invoicesNew = [...invoices]
                      invoicesNew.splice(index, 1)
                      setInvoices([...invoicesNew])

                      if (activeKeyTab === invoice.id)
                        setActiveKeyTab(invoicesNew[0].id)
                    }}
                  >
                    <CloseCircleOutlined style={{ fontSize: 15 }} />
                  </Popconfirm>
                }
                tab={
                  <Tooltip title={invoice.name} mouseEnterDelay={1}>
                    <p style={{ marginBottom: 0 }}>{invoice.name}</p>
                  </Tooltip>
                }
                key={invoice.id}
                style={{ display: 'none' }}
              />
            ))}
          </Tabs>
        </Row>
        <Row
          wrap={false}
          align="middle"
          justify="space-between"
          style={{ width: '100%', marginLeft: 15 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ModalChangeStore />
            <ModalInfoSeller />
          </div>
          <Space size="middle" wrap={false}>
            {isFullScreen ? (
              <Tooltip title="Thu nhỏ màn hình">
                <FullscreenExitOutlined
                  style={{ color: 'white', fontSize: 25 }}
                  onClick={closeFullscreen}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Mở rộng màn hình">
                <FullscreenOutlined
                  style={{ color: 'white', fontSize: 25 }}
                  onClick={openFullscreen}
                />
              </Tooltip>
            )}
            <Tooltip title="Đi tới trang quản lí thu chi">
              <img
                src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/notes 1.png"
                alt=""
                style={{ width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => history.push(ROUTES.RECEIPTS_PAYMENT)}
              />
            </Tooltip>
            <Tooltip title="Đi tới trang báo cáo tài chính">
              <img
                src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/report 1.png"
                alt=""
                style={{ width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => history.push(ROUTES.REPORT_FINANCIAL)}
              />
            </Tooltip>
            <Tooltip title="Quay về trang tổng quan">
              <img
                src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/home 1.png"
                alt=""
                style={{ width: 24, height: 24, cursor: 'pointer' }}
                onClick={() => history.push(ROUTES.OVERVIEW)}
              />
            </Tooltip>
          </Space>
        </Row>
      </div>
      <div className={styles['sell-content']}>
        <div className={styles['sell-left']}>
          <div className={styles['sell-products-invoice']}>
            {dataMockup.variants.map((product, index) => (
              <Row
                align="middle"
                wrap={false}
                className={`${styles['sell-product__item']} ${
                  styles[index % 2 === 0 && 'bg-active']
                }`}
              >
                <Row wrap={false} align="middle">
                  <p
                    style={{
                      marginBottom: 0,
                      marginRight: 15,
                      width: 17,
                      textAlign: 'center',
                    }}
                  >
                    {index}
                  </p>
                  <DeleteOutlined
                    style={{
                      color: 'red',
                      marginRight: 15,
                      cursor: 'pointer',
                    }}
                  />
                  <Tooltip title={product.sku}>
                    <p className={styles['sell-product__item-sku']}>
                      {product.sku}
                    </p>
                  </Tooltip>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={product.title}>
                        <p className={styles['sell-product__item-name']}>
                          {product.title}
                        </p>
                      </Tooltip>
                      <ModalQuantityProduct product={product} />
                    </div>
                    <ModalNoteProduct product={product} />
                  </div>
                </Row>
                <Row
                  wrap={false}
                  justify="space-between"
                  align="middle"
                  style={{ marginLeft: 20, marginRight: 10, width: '100%' }}
                >
                  <div className={styles['sell-product__item-unit']}>
                    <Input
                      style={{ width: '100%' }}
                      placeholder="Đơn vị"
                      bordered={false}
                    />
                  </div>
                  <div className={styles['sell-product__item-quantity']}>
                    <InputNumber
                      className="show-handler-number"
                      style={{ width: '100%' }}
                      bordered={false}
                      min={0}
                      placeholder="Số lượng"
                    />
                  </div>
                  <div className={styles['sell-product__item-price']}>
                    <InputNumber
                      style={{ width: '100%' }}
                      bordered={false}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder="Giá tiền"
                    />
                  </div>
                  <p style={{ marginBottom: 0, fontWeight: 600 }}>
                    {formatCash(150000)}
                  </p>
                </Row>
              </Row>
            ))}
            {/* <div style={{ textAlign: 'center' }}>
              <img src={noData} alt="" style={{ width: 100, height: 100 }} />
              <h3>Đơn hàng của bạn chưa có sản phẩm</h3>
            </div> */}
          </div>
          <div className={styles['sell-products-related']}>
            <Row justify="space-between">
              <Space size="middle">
                <FilterProductsByCategory />
                <FilterProductsBySku />
              </Space>
              <Pagination size="small" defaultCurrent={1} total={20} />
            </Row>
            <div className={styles['list-product-related']}>
              <Space wrap={true} size="large">
                {dataMockup.variants.map((data, index) => (
                  <div
                    className={styles['product-item']}
                    style={{ display: index > 9 && 'none' }}
                  >
                    <img
                      src={data.image[0] || data.image[0]}
                      alt=""
                      style={{
                        width: '100%',
                        height: '70%',
                        objectFit: 'cover',
                      }}
                    />
                    <Row
                      wrap={false}
                      align="middle"
                      style={{ paddingLeft: 5, paddingRight: 5, marginTop: 3 }}
                    >
                      <p className={styles['product-item__name']}>
                        {data.title}
                      </p>
                      <ModalQuantityProduct />
                    </Row>
                    <p className={styles['product-item__price']}>
                      {formatCash(data.sale_price)} VNĐ
                    </p>
                  </div>
                ))}
              </Space>
            </div>
          </div>
          <Row
            justify="end"
            style={{
              backgroundColor: '#eff1f5',
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <ModalKeyboardShortCuts />
          </Row>
          <Row
            wrap={false}
            justify="space-between"
            style={{ backgroundColor: 'white', padding: '15px 10px' }}
          >
            {SHORT_CUTS.map((shortcut) => (
              <div className={styles['keyboard-shorcuts']}>
                <p style={{ textAlign: 'center', marginBottom: 0 }}>
                  {shortcut.text}
                </p>
                <p style={{ textAlign: 'center', marginBottom: 0 }}>
                  {shortcut.icon}
                </p>
              </div>
            ))}
          </Row>
        </div>
        <div className={styles['sell-right']}>
          <Row justify="space-between" align="middle" wrap={false}>
            <Select
              dropdownClassName="dropdown-select-search-product"
              allowClear
              showSearch
              style={{ width: '100%', marginRight: 20 }}
              placeholder="Tìm kiếm khách hàng"
            >
              {customers.map((customer, index) => (
                <Select.Option
                  value={customer.first_name + ' ' + customer.last_name}
                  key={index}
                >
                  <div
                    style={{ padding: '7px 13px' }}
                    onClick={(e) => {
                      setCustomer(customer)
                      e.stopPropagation()
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: 0 }}>
                      {customer.first_name + ' ' + customer.last_name}
                    </p>
                    <p style={{ marginBottom: 0 }}>{customer.phone}</p>
                  </div>
                </Select.Option>
              ))}
            </Select>

            <Permission permissions={[PERMISSIONS.them_khach_hang]}>
              <ModalAddCustomer />
            </Permission>
          </Row>
          <Row
            wrap={false}
            align="middle"
            style={{ display: !customer && 'none', marginTop: 15 }}
          >
            <UserOutlined style={{ fontSize: 28, marginRight: 15 }} />
            <div style={{ width: '100%' }}>
              <Row wrap={false} align="middle">
                <a
                  style={{ fontWeight: 600, marginRight: 5 }}
                  onClick={() => {
                    setVisibleCustomerUpdate(true)
                    console.log(customer)
                  }}
                >
                  {customer && customer.first_name + ' ' + customer.last_name}
                </a>
                <Permission permissions={[PERMISSIONS.cap_nhat_khach_hang]}>
                  {customer && (
                    <CustomerUpdate
                      customerData={[customer]}
                      visible={visibleCustomerUpdate}
                      onClose={() => setVisibleCustomerUpdate(false)}
                      // reload={() =>
                      //   getAllCustomer({ page, page_size, ...paramsFilter })
                      // }
                    />
                  )}
                </Permission>
                <span style={{ fontWeight: 500 }}>
                  {' '}
                  - {customer && customer.phone}
                </span>
              </Row>
              <Row wrap={false} justify="space-between" align="middle">
                <div>
                  <span style={{ fontWeight: 600 }}>Công nợ: </span>
                  <span>{customer && customer.debt}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Điểm hiện tại: </span>
                  <span>{customer && customer.point}</span>
                </div>
              </Row>
            </div>
            <Popconfirm
              title="Bạn có muốn xoá khách hàng này ?"
              okText="Đồng ý"
              cancelText="Từ chối"
              onConfirm={() => setCustomer(null)}
            >
              <CloseCircleTwoTone
                style={{ cursor: 'pointer', marginLeft: 20, fontSize: 30 }}
              />
            </Popconfirm>
          </Row>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />
          <Row justify="space-between" align="middle" wrap={false}>
            <div>
              <Switch
                checked={isDelivery}
                style={{ marginRight: 10 }}
                onChange={(checked) => setIsDelivery(checked)}
              />
              Giao hàng
            </div>
            <div style={{ visibility: !isDelivery && 'hidden' }}>
              Kênh:{' '}
              <Select
                allowClear
                style={{ width: 130, color: '#0977de' }}
                placeholder="Chọn kênh"
                bordered={false}
              >
                <Select.Option key="1">Bán trực tiếp</Select.Option>
                <Select.Option key="2">Facebook</Select.Option>
                <Select.Option key="3">Instagram</Select.Option>
                <Select.Option key="4">Shopee</Select.Option>
                <Select.Option key="5">Lazada</Select.Option>
                <Select.Option key="6">Khác</Select.Option>
              </Select>
            </div>
          </Row>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />

          <Row wrap={false} justify="space-between" align="middle">
            <Radio value={1}>Tạo hoá đơn</Radio>
            <Radio value={2}>Đặt online</Radio>
            <ModalOrdersReturn />
          </Row>
          <div>
            <Row justify="space-between" wrap={false} align="middle">
              <Row wrap={false} align="middle">
                <p style={{ marginBottom: 0 }}>Tổng tiền</p>
                <ModalPromotion />
              </Row>

              <p>{formatCash(350000)}</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>VAT</p>
              <p>0</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>Chiết khấu</p>
              <p>0</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>Khách cọc</p>
              <p>0</p>
            </Row>
            <div>
              <Row justify="space-between" wrap={false} align="middle">
                <p>Đơn vị vận chuyển</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <Select
                    bordered={false}
                    style={{ width: '100%' }}
                    placeholder="Chọn đơn vị vận chuyển"
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {shippingsMethod.map((shipping, index) => (
                      <Select.Option index={index}>
                        {shipping.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Row>
              <Row justify="space-between" wrap={false} align="middle">
                <p>Mã vận đơn</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <Input
                    placeholder="Nhập mã vận đơn"
                    bordered={false}
                    style={{ width: '100%' }}
                  />
                </div>
              </Row>
              <Row justify="space-between" wrap={false} align="middle">
                <p>Phí giao hàng</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <InputNumber
                    placeholder="Nhập phí giao hàng"
                    min={0}
                    bordered={false}
                    style={{ width: '100%' }}
                  />
                </div>
              </Row>
            </div>
            <Row
              justify="space-between"
              wrap={false}
              align="middle"
              style={{ fontWeight: 600 }}
            >
              <p>Khách phải trả</p>
              <p>{formatCash(350000)}</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>Tiền thanh toán trước</p>
              <div
                style={{
                  borderBottom: '0.75px solid #C9C8C8',
                  width: '40%',
                }}
              >
                <InputNumber
                  min={0}
                  bordered={false}
                  style={{ width: '100%' }}
                />
              </div>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>Tiền khách đưa</p>
              <p></p>
            </Row>
            <Row>
              <PaymentMethods />
            </Row>
          </div>
          <Row wrap={false} justify="space-between" align="middle">
            <span>Tiền thừa: </span>
            <span style={{ fontWeight: 600, color: 'red' }}>
              {formatCash(10000)}
            </span>
          </Row>
          <div style={{ marginBottom: 15, marginTop: 10 }}>
            Ghi chú
            <Input
              placeholder="Nhập ghi chú đơn hàng"
              prefix={<EditOutlined />}
              style={{ width: '100%' }}
            />
          </div>

          <Row
            justify="center"
            align="middle"
            className={styles['sell-right__footer-btn']}
          >
            <Space>
              <Button
                type="primary"
                style={{
                  width: 150,
                  backgroundColor: '#EA9649',
                  borderColor: '#EA9649',
                }}
              >
                In báo giá
              </Button>
              <Button
                type="primary"
                style={{
                  width: 150,
                  backgroundColor: '#0877DE',
                  borderColor: '#0877DE',
                }}
              >
                Thanh toán
              </Button>
            </Space>
          </Row>
        </div>
      </div>
    </div>
  )
}
