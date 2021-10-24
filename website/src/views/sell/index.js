import React, { useState, useEffect } from 'react'
import styles from './sell.module.scss'

import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { dataMockup } from './data-mockup'
import { formatCash } from 'utils'
import { ACTION, PERMISSIONS, ROUTES } from 'consts'

//components
import AddCustomer from 'views/actions/customer/add'
import FilterProductsByCategory from './filter-by-category'
import FilterProductsBySku from './filter-by-sku'
import ModalKeyboardShortCuts from './keyboard-shortcuts'
import ModalPromotion from './promotion-available'
import Permission from 'components/permission'
import PaymentMethods from './payment-methods'
import ModalOrdersReturn from './orders-returns'

//images
import location from 'assets/icons/location.png'

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
  notification,
  Divider,
  Switch,
  Radio,
  Input,
  InputNumber,
  Table,
  Pagination,
  Popover,
} from 'antd'

//icons antd
import {
  SearchOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  UserOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  PlusSquareFilled,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'

//apis
import { getAllStore } from 'apis/store'
import { updateUser } from 'apis/user'
import { getAllCustomer } from 'apis/customer'

export default function Sell() {
  const history = useHistory()
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)
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

  const [invoices, setInvoices] = useState([
    { id: uuidv4(), name: 'Đơn 1 Đơn 1' },
  ])
  const [activeKeyTab, setActiveKeyTab] = useState('')
  const [isDelivery, setIsDelivery] = useState(false)
  const [customer, setCustomer] = useState(null)

  const [stores, setStores] = useState([])
  const [customers, setCustomers] = useState([])

  const _changeStore = async (store_id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const id = dataUser.data && dataUser.data.user_id
      const body = { store_id: store_id }
      const res = await updateUser(body, id)
      console.log(res)
      if (res.status === 200)
        if (res.data.accessToken) {
          dispatch({ type: ACTION.LOGIN, data: res.data })
          notification.success({ message: 'Chuyển đổi cửa hàng thành công!' })
        } else notification.error({ message: 'Chuyển đổi cửa hàng thất bại!' })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

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

  const ModalChangeStore = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [value, setValue] = useState(
      dataUser.data && dataUser.data._store.store_id
    )

    useEffect(() => {
      if (!visible) setValue(dataUser.data && dataUser.data._store.store_id)
    }, [visible])

    return (
      <>
        <Row
          wrap={false}
          align="middle"
          style={{ cursor: 'pointer' }}
          onClick={toggle}
        >
          <img src={location} alt="" style={{ marginRight: 10, width: 10 }} />
          <p className={styles['name-store']}>
            {dataUser.data && dataUser.data._store.name}
          </p>
        </Row>
        <Modal
          width={400}
          onCancel={toggle}
          visible={visible}
          footer={null}
          title="Chuyển đổi cửa hàng"
        >
          <div>
            <p style={{ marginBottom: 0 }}>Doanh nghiệp</p>
            <Select
              style={{ width: '100%' }}
              disabled
              value={dataUser.data && dataUser.data._branch.name}
            >
              <Select.Option
                value={dataUser.data && dataUser.data._branch.name}
              >
                <div style={{ color: 'black' }}>
                  {dataUser.data && dataUser.data._branch.name}
                </div>
              </Select.Option>
            </Select>
          </div>
          <div style={{ marginBottom: 25, marginTop: 20 }}>
            <p style={{ marginBottom: 0 }}>Điểm bán</p>
            <Select
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: '100%' }}
              value={value}
              onChange={(value) => setValue(value)}
            >
              {stores.map((store, index) => (
                <Select.Option key={index} value={store.store_id}>
                  {store.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Row justify="end">
            <Button
              onClick={() => _changeStore(value)}
              type="primary"
              style={{ backgroundColor: '#0877DE', borderColor: '#0877DE' }}
            >
              Chuyển đổi
            </Button>
          </Row>
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

  const _getStores = async () => {
    try {
      const res = await getAllStore()
      if (res.status === 200) setStores(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getCustomers = async () => {
    try {
      const res = await getAllCustomer()
      if (res.status === 200) setCustomers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getStores()
    _getCustomers()
  }, [])

  useEffect(() => {
    //back to login
    if (!localStorage.getItem('accessToken')) history.push(ROUTES.LOGIN)
  }, [])

  return (
    <div className={styles['sell-container']}>
      <ModalOrdersReturn />
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
            style={{ width: 30, height: 30, marginLeft: 17, cursor: 'pointer' }}
          />
        </Row>
        <Row align="middle" style={{ marginLeft: 30 }}>
          <Tabs
            hideAdd={invoices.length > 9 && true}
            moreIcon={<MoreOutlined style={{ color: 'white', fontSize: 16 }} />}
            activeKey={activeKeyTab || invoices[0].id}
            onEdit={(key, action) => {
              const invoicesNew = [...invoices]
              if (action === 'add') {
                const id = uuidv4()
                invoicesNew.push({ id: id, name: uuidv4() })
                setInvoices([...invoicesNew])
                setActiveKeyTab(id)
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
            <Row wrap={false} align="middle">
              <UserOutlined
                style={{ marginRight: 10, width: 10, color: 'white' }}
              />
              <p className={styles['name-user']}>
                {((dataUser.data && dataUser.data.first_name) || '') +
                  ' ' +
                  ((dataUser.data && dataUser.data.last_name) || '')}
              </p>
            </Row>
          </div>
          <Space size="large" wrap={false}>
            <img
              src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/notes 1.png"
              alt=""
              style={{ width: 24, height: 24, cursor: 'pointer' }}
              onClick={() => history.push(ROUTES.RECEIPTS_PAYMENT)}
            />
            <img
              src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/report 1.png"
              alt=""
              style={{ width: 24, height: 24, cursor: 'pointer' }}
              onClick={() => history.push(ROUTES.REPORT_FINANCIAL)}
            />
            <img
              src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/10/16/6cb46f92-43da-4d2e-9ba1-16598b2c9590/home 1.png"
              alt=""
              style={{ width: 24, height: 24, cursor: 'pointer' }}
              onClick={() => history.push(ROUTES.OVERVIEW)}
            />
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
                className={styles['sell-product__item']}
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
                    style={{ color: 'red', marginRight: 15, cursor: 'pointer' }}
                  />
                  <p className={styles['sell-product__item-sku']}>
                    {product.sku}
                  </p>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p className={styles['sell-product__item-name']}>
                        {product.title}
                      </p>
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
                  <Input style={{ width: 120 }} placeholder="Đơn vị" />
                  <InputNumber
                    min={0}
                    style={{ width: 80 }}
                    placeholder="Số lượng"
                  />
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Giá tiền"
                    style={{ width: 130 }}
                  />
                  <p style={{ marginBottom: 0, fontWeight: 600 }}>
                    {formatCash(150000)}
                  </p>
                </Row>
              </Row>
            ))}
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
            style={{
              backgroundColor: 'white',
              padding: '15px 10px',
            }}
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

            <ModalAddCustomer />
          </Row>
          <Row
            wrap={false}
            align="middle"
            style={{ display: !customer && 'none', marginTop: 15 }}
          >
            <UserOutlined style={{ fontSize: 28, marginRight: 15 }} />
            <div style={{ width: '100%' }}>
              <Row wrap={false} align="middle">
                <a style={{ fontWeight: 600, marginRight: 5 }}>
                  {customer && customer.first_name + ' ' + customer.last_name}
                </a>
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

          <Radio.Group>
            <Row wrap={false} justify="space-between" align="middle">
              <Radio value={1}>Tạo hoá đơn</Radio>
              <Radio value={2}>Đặt online</Radio>
              <Radio value={3}>Trả hàng</Radio>
            </Row>
          </Radio.Group>

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
                  style={{ borderBottom: '0.75px solid #C9C8C8', width: '37%' }}
                >
                  <Select bordered={false} style={{ width: '100%' }}></Select>
                </div>
              </Row>
              <Row justify="space-between" wrap={false} align="middle">
                <p>Mã vận đơn</p>
                <div
                  style={{ borderBottom: '0.75px solid #C9C8C8', width: '37%' }}
                >
                  <Input bordered={false} style={{ width: '100%' }} />
                </div>
              </Row>
              <Row justify="space-between" wrap={false} align="middle">
                <p>Phí giao hàng</p>
                <div
                  style={{ borderBottom: '0.75px solid #C9C8C8', width: '37%' }}
                >
                  <InputNumber
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
                style={{ borderBottom: '0.75px solid #C9C8C8', width: '37%' }}
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
          <Row justify="center" align="middle">
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
