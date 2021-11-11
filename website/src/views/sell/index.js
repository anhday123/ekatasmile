import React, { useState, useEffect, useRef } from 'react'
import styles from './sell.module.scss'

import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { formatCash } from 'utils'
import { IMAGE_DEFAULT, PERMISSIONS, ROUTES } from 'consts'
import noData from 'assets/icons/no-data.png'
import { decodeToken } from 'react-jwt'
import delay from 'delay'
import KeyboardEventHandler from 'react-keyboard-event-handler'

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
import HeaderGroupButton from './header-group-button'

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
  Spin,
  Tag,
  notification,
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
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

//apis
import { getAllCustomer } from 'apis/customer'
import { apiAllShipping } from 'apis/shipping'
import { getProducts } from 'apis/product'

export default function Sell() {
  const inputRef = useRef(null)
  const history = useHistory()
  const dispatch = useDispatch()

  const [shippingsMethod, setShippingsMethod] = useState([])
  const [visibleCustomerUpdate, setVisibleCustomerUpdate] = useState(false)

  const [productsAllStore, setProductsAllStore] = useState([])
  const [productsSearch, setProductsSearch] = useState([])
  const [productsRelated, setProductsRelated] = useState([])
  const [countProducts, setCountProducts] = useState(0)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [loadingProductRelated, setLoadingProductRelated] = useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 10 })

  const [loadingCustomer, setLoadingCustomer] = useState(false)
  const [customers, setCustomers] = useState([])

  //object invoice
  const initInvoice = {
    id: uuidv4(),
    name: 'Đơn 1',
    type: 'default',
    customer: null,
    order_details: [],
    payments: [],
    sumCostPaid: 0,
    noteInvoice: '',
    salesChannel: '',
    isDelivery: false,
    deliveryCharges: 0,
    shippingMethod: '',
    billOfLadingCode: '',
    prepay: 0,
    moneyGivenByCustomer: 0,
  }
  const [invoices, setInvoices] = useState([initInvoice])
  const [indexInvoice, setIndexInvoice] = useState(0)
  const [activeKeyTab, setActiveKeyTab] = useState(initInvoice.id)

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

  const _addProductToCartInvoice = (product) => {
    if (product) {
      const invoicesNew = [...invoices]

      if (product.total_quantity !== 0) {
        const indexProduct = invoicesNew[indexInvoice].order_details.findIndex(
          (e) => e._id === product._id
        )

        if (indexProduct !== -1) {
          if (
            invoicesNew[indexInvoice].order_details[indexProduct].quantity <
            product.total_quantity
          ) {
            invoicesNew[indexInvoice].order_details[indexProduct].quantity++
            invoicesNew[indexInvoice].order_details[indexProduct].sumCost =
              +invoicesNew[indexInvoice].order_details[indexProduct].quantity *
              +invoicesNew[indexInvoice].order_details[indexProduct].sale_price
            invoicesNew[indexInvoice].sumCostPaid = invoicesNew[
              indexInvoice
            ].order_details.reduce(
              (total, current) => total + current.sumCost,
              0
            )
          } else
            notification.warning({
              message:
                'Sản phẩm không đủ số lượng để bán, vui lòng chọn sản phẩm khác!',
            })
        } else {
          invoicesNew[indexInvoice].order_details.push({
            ...product,
            quantity: 1,
            sumCost: product.sale_price,
          })

          invoicesNew[indexInvoice].sumCostPaid = invoicesNew[
            indexInvoice
          ].order_details.reduce((total, current) => total + current.sumCost, 0)
        }
      } else
        notification.warning({
          message:
            'Sản phẩm không đủ số lượng để bán, vui lòng chọn sản phẩm khác!',
        })

      setInvoices([...invoicesNew])
    }
  }

  const _removeProductToCartInvoice = (index) => {
    if (index !== -1) {
      const invoicesNew = [...invoices]
      invoicesNew[indexInvoice].order_details.splice(index, 1)

      invoicesNew[indexInvoice].sumCostPaid = invoicesNew[
        indexInvoice
      ].order_details.reduce((total, current) => total + current.sumCost, 0)

      setInvoices([...invoicesNew])
    }
  }

  const _editInvoice = (attribute, value) => {
    const invoicesNew = [...invoices]
    invoicesNew[indexInvoice][attribute] = value
    setInvoices([...invoicesNew])
  }

  const _editProductInInvoices = (attribute, value, index) => {
    if (index !== -1) {
      const invoicesNew = [...invoices]
      invoicesNew[indexInvoice].order_details[index][attribute] = value
      setInvoices([...invoicesNew])
    }
  }

  const _resetInvoices = () => {
    setInvoices([initInvoice])
    setIndexInvoice(0)
    setActiveKeyTab(initInvoice.id)
  }

  const ModalQuantityProductInStores = ({ product }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [locations, setLocations] = useState([])

    const column = [
      { title: 'Chi nhánh', dataIndex: 'name' },
      {
        title: 'Số lượng',
        render: (text, record) => formatCash(record.quantity || 0),
      },
    ]

    const content = (
      <div>
        <Row justify="space-between">
          <span>Giá nhập</span>
          <span>{formatCash(product ? product.import_price : 0)}</span>
        </Row>
        <Row justify="space-between">
          <span>Giá cơ bản</span>
          <span>{formatCash(product ? product.base_price : 0)}</span>
        </Row>
        <Row justify="space-between">
          <span>Giá bán</span>
          <span>{formatCash(product ? product.sale_price : 0)}</span>
        </Row>
        <Row justify="space-between">
          <span>Có thể bán</span>
          <span>{formatCash(product ? product.total_quantity : 0)}</span>
        </Row>
        <Row justify="space-between">
          <span>Hệ thống</span>
          <span></span>
        </Row>
        <Row justify="space-between">
          <span>Áp dụng thuế</span>
          <span></span>
        </Row>
      </div>
    )

    useEffect(() => {
      for (let i = 0; i < productsAllStore.length; i++) {
        for (let j = 0; j < productsAllStore[i].variants.length; j++) {
          const findVariant = productsAllStore[i].variants.find(
            (e) => e._id === product._id
          )
          if (findVariant) {
            setLocations([...findVariant.locations])
            break
          }
        }
      }

      // setLocations(productsAllStore)
    }, [])

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
                {product && product.title}
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
          width={700}
          footer={
            <Row justify="end">
              <Button onClick={toggle}>Cancel</Button>
            </Row>
          }
          visible={visible}
          onCancel={toggle}
          title={product && product.title}
        >
          <Table
            pagination={false}
            style={{ width: '100%' }}
            columns={column}
            size="small"
            dataSource={locations}
          />
        </Modal>
      </>
    )
  }

  const NoteInvoice = () => (
    <Input.TextArea
      onBlur={(e) => {
        const invoicesNew = [...invoices]
        invoicesNew[indexInvoice].noteInvoice = e.target.value
        setInvoices([...invoicesNew])
      }}
      defaultValue={invoices[indexInvoice].noteInvoice || ''}
      rows={2}
      placeholder="Nhập ghi chú đơn hàng"
      style={{ width: '100%' }}
    />
  )

  const ModalNoteProduct = ({ product, index }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [note, setNote] = useState(product.note || '')

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
          <p className={styles['sell-product__item-note']}>
            {note || 'Ghi chú'}
          </p>
          <EditOutlined style={{ marginLeft: 5 }} />
        </div>
        <Modal
          title={product && product.title}
          onCancel={() => {
            toggle()
            setNote(product.note || '')
          }}
          onOk={() => {
            _editProductInInvoices('note', note, index)
          }}
          visible={visible}
        >
          <div>
            Ghi chú
            <Input.TextArea
              onChange={(e) => setNote(e.target.value)}
              value={note}
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

  const HandlerKeyboard = () => {
    return (
      <KeyboardEventHandler
        handleKeys={['f2']}
        onKeyEvent={(key, e) => {
          switch (key) {
            case 'f2': {
              inputRef.current.focus({ cursor: 'end' })
              break
            }
            default:
              break
          }
        }}
      />
    )
  }

  const _getCustomers = async () => {
    try {
      setLoadingCustomer(true)
      const res = await getAllCustomer()
      console.log(res)
      if (res.status === 200) setCustomers(res.data.data)

      setLoadingCustomer(false)
    } catch (error) {
      setLoadingCustomer(false)
      console.log(error)
    }
  }

  const _getCustomerAfterEditCustomer = async () => {
    try {
      setLoadingCustomer(true)

      const res = await getAllCustomer({
        customer_id: invoices[indexInvoice].customer.customer_id,
      })
      console.log(res)
      if (res.status === 200)
        if (res.data.data.length) {
          const invoicesNew = [...invoices]
          invoices[indexInvoice].customer = res.data.data[0]
          invoicesNew[indexInvoice].name = `${res.data.data[0].first_name} 
          ${res.data.data[0].last_name} - ${res.data.data[0].phone}`
          setInvoices([...invoicesNew])
        }

      setLoadingCustomer(false)
    } catch (error) {
      setLoadingCustomer(false)
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

  const _getProductsAllStore = async () => {
    try {
      const res = await getProducts({ merge: true })
      if (res.status === 200) setProductsAllStore(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getProductsSearch = async (store_id) => {
    try {
      setLoadingProduct(true)
      const res = await getProducts({ store_id, merge: true })
      if (res.status === 200) setProductsSearch(res.data.data)

      setLoadingProduct(false)
    } catch (error) {
      console.log(error)
      setLoadingProduct(false)
    }
  }

  const _getProductsRelated = async (params) => {
    try {
      setLoadingProductRelated(true)

      const store = JSON.parse(localStorage.getItem('storeSell'))

      const res = await getProducts({
        store_id: store.store_id,
        merge: true,
        detach: true,
        ...params,
      })
      console.log(res)
      if (res.status === 200) {
        setProductsRelated(res.data.data.map((e) => e.variants))
        setCountProducts(res.data.count)
      }

      setLoadingProductRelated(false)
    } catch (error) {
      console.log(error)
      setLoadingProductRelated(false)
    }
  }

  useEffect(() => {
    //back to login
    if (!localStorage.getItem('accessToken')) history.push(ROUTES.LOGIN)
    else {
      const data = decodeToken(localStorage.getItem('accessToken'))
      console.log(data)
      if (!localStorage.getItem('storeSell')) {
        if (data.data._store) {
          localStorage.setItem('storeSell', JSON.stringify(data.data._store))
          _getProductsSearch(data.data._store.store_id)
        }
      } else {
        const store = JSON.parse(localStorage.getItem('storeSell'))
        if (store) _getProductsSearch(store.store_id)
      }
    }
  }, [])

  //init invoice
  // useEffect(() => {
  //   dispatch({ type: 'UPDATE_INVOICE', data: [initInvoice] })
  // }, [])

  useEffect(() => {
    _getCustomers()
    _getShippingsMethod()
    _getProductsAllStore()
  }, [])

  useEffect(() => {
    _getProductsRelated(paramsFilter)
  }, [paramsFilter])

  return (
    <div className={styles['sell-container']}>
      <HandlerKeyboard />
      <div className={styles['sell-header']}>
        <Row align="middle" wrap={false}>
          <div className="select-product-sell">
            <Select
              notFoundContent={loadingProduct ? <Spin size="small" /> : null}
              dropdownClassName="dropdown-select-search-product"
              allowClear
              showSearch
              clearIcon={<CloseOutlined style={{ color: 'black' }} />}
              suffixIcon={
                <SearchOutlined style={{ color: 'black', fontSize: 15 }} />
              }
              className={styles['search-product']}
              placeholder="Thêm sản phẩm vào hoá đơn"
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
              {productsSearch.map((product, index) =>
                product.variants.map((data) => (
                  <Select.Option value={data.title} key={data.title}>
                    <Row
                      align="middle"
                      wrap={false}
                      style={{ padding: '7px 13px' }}
                      onClick={(e) => {
                        _addProductToCartInvoice(data)
                        e.stopPropagation()
                      }}
                    >
                      <img
                        src={data.image[0] ? data.image[0] : IMAGE_DEFAULT}
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
                ))
              )}
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
              if (action === 'add') {
                const invoicesNew = [...invoices]
                initInvoice.name = `Đơn ${invoicesNew.length + 1}`
                invoicesNew.push(initInvoice)
                const iVoice = invoicesNew.findIndex(
                  (e) => e.id === initInvoice.id
                )
                if (iVoice !== -1) setIndexInvoice(iVoice)
                setInvoices([...invoicesNew])
                setActiveKeyTab(initInvoice.id)
              }
            }}
            onChange={(activeKey) => {
              const iVoice = invoices.findIndex((e) => e.id === activeKey)
              if (iVoice !== -1) setIndexInvoice(iVoice)
              setActiveKeyTab(activeKey)
            }}
            tabBarStyle={{ height: 55, color: 'white' }}
            type="editable-card"
            className="tabs-invoices"
            addIcon={
              <Tooltip title="Thêm mới đơn hàng">
                <PlusOutlined
                  style={{ color: 'white', fontSize: 21, marginLeft: 7 }}
                />
              </Tooltip>
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

                      if (activeKeyTab === invoice.id) {
                        setIndexInvoice(0)
                        setActiveKeyTab(invoicesNew[0].id)
                      } else {
                        const indexInvoice = invoicesNew.findIndex(
                          (e) => e.id === activeKeyTab
                        )
                        if (indexInvoice !== -1) setIndexInvoice(indexInvoice)
                      }

                      setInvoices([...invoicesNew])
                    }}
                  >
                    <CloseCircleOutlined
                      style={{
                        fontSize: 15,
                        color: invoice.id === activeKeyTab ? 'black' : 'white',
                      }}
                    />
                  </Popconfirm>
                }
                tab={
                  <Tooltip title={invoice.name} mouseEnterDelay={1}>
                    <p
                      style={{
                        marginBottom: 0,
                        color: invoice.id === activeKeyTab ? 'black' : 'white',
                      }}
                    >
                      {invoice.name}
                    </p>
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
            <ModalChangeStore resetInvoices={_resetInvoices} />
            <ModalInfoSeller />
          </div>
          <HeaderGroupButton />
        </Row>
      </div>
      <div className={styles['sell-content']}>
        <div className={styles['sell-left']}>
          <div className={styles['sell-products-invoice']}>
            {invoices[indexInvoice].order_details &&
            invoices[indexInvoice].order_details.length ? (
              invoices[indexInvoice].order_details.map((product, index) => {
                const Quantity = () => (
                  <InputNumber
                    onBlur={(e) => {
                      const value = +e.target.value
                      const invoicesNew = [...invoices]

                      invoicesNew[indexInvoice].order_details[index].sumCost =
                        +product.sale_price * value

                      invoicesNew[indexInvoice].sumCostPaid = invoicesNew[
                        indexInvoice
                      ].order_details.reduce(
                        (total, current) => total + current.sumCost,
                        0
                      )

                      setInvoices([...invoicesNew])
                      _editProductInInvoices('quantity', value, index)
                    }}
                    defaultValue={product.quantity || 1}
                    className="show-handler-number"
                    style={{ width: '100%' }}
                    bordered={false}
                    max={product.total_quantity}
                    min={1}
                    placeholder="Số lượng"
                  />
                )

                const Price = () => (
                  <InputNumber
                    onBlur={(e) => {
                      const value = e.target.value.replaceAll(',', '')

                      const invoicesNew = [...invoices]

                      invoicesNew[indexInvoice].order_details[index].sumCost =
                        +product.quantity * +value

                      invoicesNew[indexInvoice].sumCostPaid = invoicesNew[
                        indexInvoice
                      ].order_details.reduce(
                        (total, current) => total + current.sumCost,
                        0
                      )

                      setInvoices([...invoicesNew])
                      _editProductInInvoices('sale_price', +value, index)
                    }}
                    defaultValue={product.sale_price || ''}
                    min={0}
                    style={{ width: '100%' }}
                    bordered={false}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Giá tiền"
                  />
                )

                const Unit = () => (
                  <Input
                    onBlur={(e) => {
                      const value = e.target.value
                      _editProductInInvoices('unit', value, index)
                    }}
                    defaultValue={product.unit || ''}
                    style={{ width: '100%' }}
                    placeholder="Đơn vị"
                    bordered={false}
                  />
                )

                return (
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
                        onClick={() => _removeProductToCartInvoice(index)}
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
                          <ModalQuantityProductInStores product={product} />
                        </div>
                        <ModalNoteProduct product={product} index={index} />
                      </div>
                    </Row>
                    <Row
                      wrap={false}
                      justify="space-between"
                      align="middle"
                      style={{ marginLeft: 20, marginRight: 10, width: '100%' }}
                    >
                      <div className={styles['sell-product__item-unit']}>
                        <Unit />
                      </div>
                      <div className={styles['sell-product__item-quantity']}>
                        <Quantity />
                      </div>
                      <div className={styles['sell-product__item-price']}>
                        <Price />
                      </div>
                      <p style={{ marginBottom: 0, fontWeight: 600 }}>
                        {formatCash(product.sumCost)}
                      </p>
                    </Row>
                  </Row>
                )
              })
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <img src={noData} alt="" style={{ width: 100, height: 100 }} />
                <h3>Đơn hàng của bạn chưa có sản phẩm</h3>
              </div>
            )}
          </div>
          <div className={styles['sell-products-related']}>
            <Row justify="space-between" align="middle">
              <Space size="middle">
                <FilterProductsByCategory
                  setParamsFilter={setParamsFilter}
                  paramsFilter={paramsFilter}
                />
                <FilterProductsBySku
                  setParamsFilter={setParamsFilter}
                  paramsFilter={paramsFilter}
                />
                <Row align="middle" wrap={false}>
                  {paramsFilter &&
                    Object.keys(paramsFilter).map((key) => {
                      if (key === 'category_id')
                        return (
                          <Tag
                            closable
                            onClose={() => {
                              delete paramsFilter.category_id
                              setParamsFilter({ ...paramsFilter })
                            }}
                          >
                            Đang lọc theo danh mục
                          </Tag>
                        )

                      if (key === 'attribute')
                        return (
                          <Tag
                            closable
                            onClose={() => {
                              delete paramsFilter.attribute
                              setParamsFilter({ ...paramsFilter })
                            }}
                          >
                            Đang lọc theo thuộc tính
                          </Tag>
                        )
                    })}
                </Row>
              </Space>
              <Pagination
                current={paramsFilter.page}
                size="small"
                showSizeChanger={false}
                total={countProducts}
                onChange={(page, pageSize) => {
                  paramsFilter.page = page
                  paramsFilter.page_size = pageSize

                  setParamsFilter(paramsFilter)
                }}
              />
            </Row>
            <div className={styles['list-product-related']}>
              {loadingProductRelated ? (
                <Row
                  justify="center"
                  align="middle"
                  style={{ width: '100%', height: 320 }}
                >
                  <Spin />
                </Row>
              ) : productsRelated.length ? (
                <Space wrap={true} size="large">
                  {productsRelated.map((data) => (
                    <div
                      className={styles['product-item']}
                      onClick={() => _addProductToCartInvoice(data)}
                    >
                      <img
                        src={data.image[0] ? data.image[0] : IMAGE_DEFAULT}
                        alt=""
                        style={{
                          width: '100%',
                          height: '70%',
                          objectFit: data.image[0] ? 'cover' : 'contain',
                        }}
                      />
                      <Row
                        justify="space-between"
                        wrap={false}
                        align="middle"
                        style={{
                          paddingLeft: 5,
                          paddingRight: 5,
                          marginTop: 3,
                        }}
                      >
                        <p className={styles['product-item__name']}>
                          {data.title}
                        </p>
                        <ModalQuantityProductInStores product={data} />
                      </Row>
                      <p className={styles['product-item__price']}>
                        {formatCash(data.sale_price)} VNĐ
                      </p>
                    </div>
                  ))}
                </Space>
              ) : (
                <div
                  style={{
                    height: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={noData} alt="" style={{ width: 100 }} />
                  <h3>Không tìm thấy sản phẩm nào</h3>
                </div>
              )}
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
              notFoundContent={loadingCustomer ? <Spin /> : null}
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
                      _editInvoice('customer', customer)
                      _editInvoice(
                        'name',
                        `${customer.first_name} 
                      ${customer.last_name} - ${customer.phone}`
                      )
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
            style={{
              display: !invoices[indexInvoice].customer && 'none',
              marginTop: 15,
            }}
          >
            <UserOutlined style={{ fontSize: 28, marginRight: 15 }} />
            <div style={{ width: '100%' }}>
              <Row wrap={false} align="middle">
                <p
                  style={{
                    fontWeight: 600,
                    marginRight: 5,
                    color: '#1890ff',
                    marginBottom: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => setVisibleCustomerUpdate(true)}
                >
                  {invoices[indexInvoice].customer &&
                    invoices[indexInvoice].customer.first_name +
                      ' ' +
                      invoices[indexInvoice].customer.last_name}
                </p>
                <Permission permissions={[PERMISSIONS.cap_nhat_khach_hang]}>
                  {invoices[indexInvoice].customer ? (
                    <CustomerUpdate
                      customerData={[invoices[indexInvoice].customer]}
                      visible={visibleCustomerUpdate}
                      onClose={() => setVisibleCustomerUpdate(false)}
                      reload={() => {
                        _getCustomerAfterEditCustomer()
                        _getCustomers()
                      }}
                    />
                  ) : (
                    <div></div>
                  )}
                </Permission>
                <span style={{ fontWeight: 500 }}>
                  {' '}
                  -{' '}
                  {invoices[indexInvoice].customer &&
                    invoices[indexInvoice].customer.phone}
                </span>
              </Row>
              <Row wrap={false} justify="space-between" align="middle">
                <div>
                  <span style={{ fontWeight: 600 }}>Công nợ: </span>
                  <span>
                    {invoices[indexInvoice].customer &&
                      invoices[indexInvoice].customer.debt}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Điểm hiện tại: </span>
                  <span>
                    {invoices[indexInvoice].customer &&
                      invoices[indexInvoice].customer.point}
                  </span>
                </div>
              </Row>
            </div>
            <Popconfirm
              title="Bạn có muốn xoá khách hàng này ?"
              okText="Đồng ý"
              cancelText="Từ chối"
              onConfirm={async () => {
                _editInvoice('customer', null)
                _editInvoice('name', `Đơn ${invoices.length + 1}`)
              }}
            >
              <CloseCircleTwoTone
                style={{ cursor: 'pointer', marginLeft: 20, fontSize: 23 }}
              />
            </Popconfirm>
          </Row>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />
          <Row justify="space-between" align="middle" wrap={false}>
            <div>
              <Switch
                checked={invoices[indexInvoice].isDelivery}
                style={{ marginRight: 10 }}
                onChange={(checked) => _editInvoice('isDelivery', checked)}
              />
              Giao hàng
            </div>
            <div
              style={{
                visibility: !invoices[indexInvoice].isDelivery && 'hidden',
              }}
            >
              Kênh:{' '}
              <Select
                allowClear
                style={{ width: 130, color: '#0977de' }}
                placeholder="Chọn kênh"
                bordered={false}
                value={invoices[indexInvoice].salesChannel || undefined}
                onChange={(value) => _editInvoice('salesChannel', value)}
              >
                <Select.Option value="live">Bán trực tiếp</Select.Option>
                <Select.Option value="facebook">Facebook</Select.Option>
                <Select.Option value="instagram">Instagram</Select.Option>
                <Select.Option value="shopee">Shopee</Select.Option>
                <Select.Option value="lazada">Lazada</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            </div>
          </Row>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />

          <Row wrap={false} justify="space-between" align="middle">
            <Radio
              checked={invoices[indexInvoice].type === 'default' ? true : false}
              onClick={() => _editInvoice('type', 'default')}
            >
              Tạo hoá đơn
            </Radio>
            <Radio
              checked={invoices[indexInvoice].type === 'online' ? true : false}
              onClick={() => _editInvoice('type', 'online')}
            >
              Đặt online
            </Radio>
            <ModalOrdersReturn />
          </Row>
          <div>
            <Row
              justify="space-between"
              wrap={false}
              align="middle"
              style={{ marginTop: 9 }}
            >
              <Row wrap={false} align="middle">
                <p>
                  Tổng tiền (
                  <b>
                    {invoices[indexInvoice].order_details.reduce(
                      (total, current) => total + +current.quantity,
                      0
                    )}
                  </b>{' '}
                  sản phẩm)
                  <ModalPromotion invoiceCurrent={invoices[indexInvoice]} />
                </p>
              </Row>

              <p>{formatCash(invoices[indexInvoice].sumCostPaid)}</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>VAT</p>
              <p>0</p>
            </Row>
            <Row justify="space-between" wrap={false} align="middle">
              <p>Chiết khấu</p>
              <p>0</p>
            </Row>

            <div
              style={{ display: !invoices[indexInvoice].isDelivery && 'none' }}
            >
              <Row justify="space-between" wrap={false} align="middle">
                <p>Đơn vị vận chuyển</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                    marginBottom: 10,
                  }}
                >
                  <Select
                    value={invoices[indexInvoice].shippingMethod || undefined}
                    onChange={(value) => _editInvoice('shippingMethod', value)}
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
                      <Select.Option value={shipping.name} index={index}>
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
                    marginBottom: 10,
                  }}
                >
                  <Input
                    onChange={(e) =>
                      _editInvoice('billOfLadingCode', e.target.value)
                    }
                    value={invoices[indexInvoice].billOfLadingCode}
                    placeholder="Nhập mã vận đơn"
                    bordered={false}
                    style={{ width: '100%' }}
                  />
                </div>
              </Row>
              <Row justify="space-between" wrap={false} align="middle">
                <p style={{ marginTop: 10 }}>Phí giao hàng</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    value={invoices[indexInvoice].deliveryCharges}
                    onChange={(value) => _editInvoice('deliveryCharges', value)}
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
              style={{
                fontWeight: 700,
                color: '#0877de',
                fontSize: 17,
                marginTop: 8,
              }}
            >
              <p style={{ color: 'black', fontWeight: 600 }}>Khách phải trả</p>
              <p>{formatCash(350000)}</p>
            </Row>
            {invoices[indexInvoice].isDelivery ? (
              <Row justify="space-between" wrap={false} align="middle">
                <p style={{ marginBottom: 0 }}>Tiền thanh toán trước (F2)</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <InputNumber
                    ref={inputRef}
                    value={invoices[indexInvoice].prepay}
                    onChange={(value) => _editInvoice('prepay', value)}
                    placeholder="Nhập tiền thanh toán trước"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                    bordered={false}
                    style={{ width: '100%' }}
                  />
                </div>
              </Row>
            ) : (
              <Row justify="space-between" wrap={false} align="middle">
                <p style={{ marginBottom: 0 }}>Tiền khách đưa (F2)</p>
                <div
                  style={{
                    borderBottom: '0.75px solid #C9C8C8',
                    width: '40%',
                  }}
                >
                  <InputNumber
                    placeholder="Nhập tiền tiền khách đưa"
                    ref={inputRef}
                    value={invoices[indexInvoice].moneyGivenByCustomer}
                    onChange={(value) =>
                      _editInvoice('moneyGivenByCustomer', value)
                    }
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                    bordered={false}
                    style={{ width: '100%' }}
                  />
                </div>
              </Row>
            )}
            <Row>
              <PaymentMethods />
            </Row>
          </div>
          <Row
            wrap={false}
            justify="space-between"
            align="middle"
            style={{ display: invoices[indexInvoice].isDelivery && 'none' }}
          >
            <span>Tiền thừa: </span>
            <span style={{ fontWeight: 600, color: 'red' }}>
              {formatCash(10000)}
            </span>
          </Row>
          <div style={{ marginBottom: 15, marginTop: 10 }}>
            Ghi chú <EditOutlined />
            <NoteInvoice />
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
