import React, { useEffect, useState } from 'react'
import styles from './order-create-shipping.module.scss'

import { useHistory, Link, useLocation } from 'react-router-dom'
import { ROUTES, PERMISSIONS, IMAGE_DEFAULT } from 'consts'
import { formatCash } from 'utils'
import moment from 'moment'
import noData from 'assets/icons/no-data.png'
import { useSelector } from 'react-redux'

//antd
import {
  Row,
  Col,
  Divider,
  Input,
  Button,
  Table,
  InputNumber,
  Form,
  Select,
  Radio,
  Spin,
  Tooltip,
  Space,
  Affix,
  DatePicker,
  Upload,
  Modal,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  CloseOutlined,
  InfoCircleTwoTone,
  SearchOutlined,
  PlusSquareOutlined,
  CreditCardFilled,
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

//apis
import { getProducts } from 'apis/product'
import { getAllBranch } from 'apis/branch'
import { getAllStore } from 'apis/store'
import { uploadFile } from 'apis/upload'
import { apiAllSupplier } from 'apis/supplier'
import { apiAllUser } from 'apis/user'

//components
import Permission from 'components/permission'

export default function ImportInventory() {
  const history = useHistory()
  const location = useLocation()
  const dataUser = useSelector((state) => state.login.dataUser)
  const [formInfoOrder] = Form.useForm()

  const [users, setUsers] = useState([])

  const [loadingUpload, setLoadingUpload] = useState(false)
  const [file, setFile] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [productsSearch, setProductsSearch] = useState([])

  const [supplierId, setSupplierId] = useState()
  const [productsSupplier, setProductsSupplier] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [visibleProductsToSupplier, setVisibleProductsToSupplier] = useState(false)
  const toggleProductsToSupplier = () => {
    setVisibleProductsToSupplier(!visibleProductsToSupplier)
    setProductsSupplier([])
    setSupplierId()
  }

  //object order create
  const [orderCreate, setOrderCreate] = useState({
    name: 'Đơn 1',
    type: 'default',
    order_details: [], //danh sách sản phẩm trong hóa đơn
    payments: [], //hình thức thanh toán
    type_payment: 'payment-all', //hình thức thanh toán
    sumCostPaid: 0, // tổng tiền của tất cả sản phẩm
    discount: null,
    noteInvoice: '',
    salesChannel: '', //kênh bán hàng
    isDelivery: true, //mặc định là hóa đơn giao hàng
    deliveryCharges: 0, //phí giao hàng
    deliveryAddress: null, //địa chỉ nhận hàng
    shipping: null, //đơn vị vận chuyển
    billOfLadingCode: '',
    moneyToBePaidByCustomer: 0, // tổng tiền khách hàng phải trả (Tổng tiền thanh toán)
    prepay: 0, //tiền khách thanh toán trước
    moneyGivenByCustomer: 0, //tiền khách hàng đưa
    excessCash: 0, //tiền thừa
  })

  const [loadingLocation, setLoadingLocation] = useState(false)
  const [branches, setBranches] = useState([])
  const [stores, setStores] = useState([])

  const _editOrder = (attribute, value) => {
    const orderCreateNew = { ...orderCreate }
    orderCreateNew[attribute] = value

    //tổng tiền khách hàng phải trả
    orderCreateNew.moneyToBePaidByCustomer =
      orderCreateNew.sumCostPaid + (orderCreateNew.isDelivery ? orderCreateNew.deliveryCharges : 0)

    //discount có 2 loại
    //nếu type = value thì cộng
    // nếu type = percent thì nhân
    if (orderCreateNew.discount) {
      if (orderCreateNew.discount.type === 'VALUE')
        orderCreateNew.moneyToBePaidByCustomer -= +orderCreateNew.discount.value
      else
        orderCreateNew.moneyToBePaidByCustomer -=
          (+orderCreateNew.discount.value / 100) * orderCreateNew.moneyToBePaidByCustomer
    }

    //tiền thừa
    const excessCashNew =
      (orderCreateNew.isDelivery ? orderCreateNew.prepay : orderCreateNew.moneyGivenByCustomer) -
      orderCreateNew.moneyToBePaidByCustomer

    orderCreateNew.excessCash = excessCashNew >= 0 ? excessCashNew : 0

    setOrderCreate({ ...orderCreateNew })
  }

  const _addProductToOrder = (product) => {
    if (product) {
      const orderCreateNew = { ...orderCreate }
      const indexProduct = orderCreateNew.order_details.findIndex((e) => e._id === product._id)

      if (indexProduct === -1) {
        orderCreateNew.order_details.push(product)

        // tổng tiền của tất cả sản phẩm
        orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
          (total, current) => total + current.sumCost,
          0
        )

        //tổng tiền khách hàng phải trả
        orderCreateNew.moneyToBePaidByCustomer =
          orderCreateNew.sumCostPaid +
          (orderCreateNew.isDelivery ? orderCreateNew.deliveryCharges : 0)

        //discount có 2 loại
        //nếu type = value thì cộng
        // nếu type = percent thì nhân
        if (orderCreateNew.discount) {
          if (orderCreateNew.discount.type === 'VALUE')
            orderCreateNew.moneyToBePaidByCustomer -= +orderCreateNew.discount.value
          else
            orderCreateNew.moneyToBePaidByCustomer -=
              (+orderCreateNew.discount.value / 100) * orderCreateNew.moneyToBePaidByCustomer
        }

        //tiền thừa
        const excessCashNew =
          (orderCreateNew.isDelivery
            ? orderCreateNew.prepay
            : orderCreateNew.moneyGivenByCustomer) - orderCreateNew.moneyToBePaidByCustomer

        orderCreateNew.excessCash = excessCashNew >= 0 ? excessCashNew : 0

        setOrderCreate({ ...orderCreateNew })
      }
    }
  }

  const _editProductInOrder = (attribute, value, index) => {
    if (index !== -1) {
      const orderCreateNew = { ...orderCreate }
      orderCreateNew.order_details[index][attribute] = value

      //tổng tiền của 1 sản phẩm
      orderCreateNew.order_details[index].sumCost =
        +orderCreateNew.order_details[index].quantity *
        +orderCreateNew.order_details[index].import_price

      // tổng tiền của tất cả sản phẩm
      orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
        (total, current) => total + current.sumCost,
        0
      )

      //tổng tiền khách hàng phải trả
      orderCreateNew.moneyToBePaidByCustomer =
        orderCreateNew.sumCostPaid +
        (orderCreateNew.isDelivery ? orderCreateNew.deliveryCharges : 0)

      //discount có 2 loại
      //nếu type = value thì cộng
      // nếu type = percent thì nhân
      if (orderCreateNew.discount) {
        if (orderCreateNew.discount.type === 'VALUE')
          orderCreateNew.moneyToBePaidByCustomer -= +orderCreateNew.discount.value
        else
          orderCreateNew.moneyToBePaidByCustomer -=
            (+orderCreateNew.discount.value / 100) * orderCreateNew.moneyToBePaidByCustomer
      }

      //tiền thừa
      const excessCashNew =
        (orderCreateNew.isDelivery ? orderCreateNew.prepay : orderCreateNew.moneyGivenByCustomer) -
        orderCreateNew.moneyToBePaidByCustomer

      orderCreateNew.excessCash = excessCashNew >= 0 ? excessCashNew : 0

      setOrderCreate({ ...orderCreateNew })
    }
  }

  const _removeProductToOrder = (indexProduct) => {
    if (indexProduct !== -1) {
      const orderCreateNew = { ...orderCreate }
      orderCreateNew.order_details.splice(indexProduct, 1)

      // tổng tiền của tất cả sản phẩm
      orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
        (total, current) => total + current.sumCost,
        0
      )

      //tổng tiền khách hàng phải trả
      orderCreateNew.moneyToBePaidByCustomer =
        orderCreateNew.sumCostPaid +
        (orderCreateNew.isDelivery ? orderCreateNew.deliveryCharges : 0)

      //discount có 2 loại
      //nếu type = value thì cộng
      // nếu type = percent thì nhân
      if (orderCreateNew.discount) {
        if (orderCreateNew.discount.type === 'VALUE')
          orderCreateNew.moneyToBePaidByCustomer -= +orderCreateNew.discount.value
        else
          orderCreateNew.moneyToBePaidByCustomer -=
            (+orderCreateNew.discount.value / 100) * orderCreateNew.moneyToBePaidByCustomer
      }

      //tiền thừa
      const excessCashNew =
        (orderCreateNew.isDelivery ? orderCreateNew.prepay : orderCreateNew.moneyGivenByCustomer) -
        orderCreateNew.moneyToBePaidByCustomer

      orderCreateNew.excessCash = excessCashNew >= 0 ? excessCashNew : 0

      setOrderCreate({ ...orderCreateNew })
    }
  }

  const columnsProductsToSupplier = [
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'product_name',
    },
    {
      title: 'Phiên bản',
      dataIndex: 'title',
    },
    {
      title: 'Đơn giá nhập',
      dataIndex: 'import_price',
    },
  ]

  const columns = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'product_name',
    },
    {
      title: 'Phiên bản',
      dataIndex: 'title',
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'inventory_quantity',
    },
    {
      title: 'Số lượng nhập',
      render: (data, record) => {
        const InputQuantity = () => (
          <InputNumber
            style={{ width: 70 }}
            onBlur={(event) => {
              const value = event.target.value.replaceAll(',', '')
              const indexProduct = orderCreate.order_details.findIndex((e) => e._id === record._id)
              _editProductInOrder('quantity', +value, indexProduct)
            }}
            defaultValue={record.quantity}
            min={1}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập số lượng nhập"
          />
        )

        return <InputQuantity />
      },
    },
    {
      width: 130,
      title: 'Đơn giá nhập',
      render: (data, record) => {
        const InputPrice = () => (
          <InputNumber
            style={{ width: '100%' }}
            onBlur={(e) => {
              const value = e.target.value.replaceAll(',', '')
              const indexProduct = orderCreate.order_details.findIndex((e) => e._id === record._id)
              _editProductInOrder('import_price', +value, indexProduct)
            }}
            defaultValue={record.import_price}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập đơn giá nhập"
          />
        )

        return <InputPrice />
      },
    },
    {
      title: 'Tổng tiền',
      render: (text, record) => record.sumCost && formatCash(record.sumCost || 0),
    },
    {
      width: 30,
      title: '',
      render: (data, record, index) => (
        <DeleteOutlined
          style={{ color: 'red', fontSize: 16 }}
          onClick={() => _removeProductToOrder(index)}
        />
      ),
    },
  ]

  const _getBranches = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getStores = async () => {
    try {
      const res = await getAllStore()
      if (res.status === 200)
        setStores(res.data.data.map((e) => ({ ...e, store_id: +e.store_id * -1 })))
    } catch (error) {
      console.log(error)
    }
  }

  const _loadLocations = async () => {
    setLoadingLocation(true)
    await _getBranches()
    await _getStores()
    setLoadingLocation(false)
  }

  const _getUsers = async () => {
    try {
      const res = await apiAllUser()
      console.log(res)
      if (res.status === 200) setUsers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _uploadFile = async (file) => {
    try {
      setLoadingUpload(true)
      const url = await uploadFile(file)
      if (url) setFile(url)
      setLoadingUpload(false)
    } catch (error) {
      setLoadingUpload(false)
    }
  }

  const _getSuppliers = async () => {
    try {
      const res = await apiAllSupplier()
      console.log(res)
      if (res.status === 200) setSuppliers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getProductsToSupplier = async (supplierId) => {
    try {
      setLoadingProduct(true)
      const branchId = dataUser && dataUser.data ? dataUser.data.branch_id : ''
      const res = await getProducts({
        branch_id: branchId,
        merge: true,
        detach: true,
        supplier_id: supplierId,
      })
      console.log(res)
      if (res.status === 200) {
        const productsSupplierNew = res.data.data.map((e) => ({
          ...e.variants,
          product_name: e.name,
          import_price: e.import_price_default || 0,
          quantity: 1,
          inventory_quantity: e.location && e.location[0] ? e.location[0].quantity : 0,
          sumCost: e.import_price_default || 0,
        }))

        setProductsSupplier([...productsSupplierNew])
      }
      setLoadingProduct(false)
    } catch (error) {
      console.log(error)
      setLoadingProduct(false)
    }
  }

  const _getProductsSearch = async () => {
    try {
      setLoadingProduct(true)
      const branchId = dataUser && dataUser.data ? dataUser.data.branch_id : ''
      const res = await getProducts({ branch_id: branchId, merge: true, detach: true })
      console.log(res)
      if (res.status === 200) {
        const productsSearchNew = res.data.data.map((e) => ({
          ...e.variants,
          product_name: e.name,
          import_price: e.import_price_default || 0,
          quantity: 1,
          inventory_quantity: e.location && e.location[0] ? e.location[0].quantity : 0,
          sumCost: e.import_price_default || 0,
        }))

        const query = new URLSearchParams(location.search)
        const _id = query.get('_id')
        if (_id) {
          const productFind = productsSearchNew.find((e) => e._id === _id)
          console.log(productFind)
          if (productFind) _addProductToOrder(productFind)
        }

        setProductsSearch([...productsSearchNew])
      }
      setLoadingProduct(false)
    } catch (error) {
      console.log(error)
      setLoadingProduct(false)
    }
  }

  useEffect(() => {
    _loadLocations()
    _getSuppliers()
    _getProductsSearch()
    _getUsers()
  }, [])

  return (
    <div className={`${styles['order-create-shipping']}`}>
      <div style={{ background: 'white', padding: '20px' }} className={styles['card']}>
        <Affix offsetTop={65}>
          <Row
            style={{
              backgroundColor: 'white',
              paddingBottom: 20,
              paddingTop: 10,
              marginBottom: 30,
              borderBottom: '1px solid #f5f5f5',
            }}
            wrap={false}
            justify="space-between"
            align="middle"
          >
            <Link to={ROUTES.IMPORT_INVENTORIES}>
              <Row
                align="middle"
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontWeight: 600,
                  width: 'max-content',
                }}
              >
                <ArrowLeftOutlined style={{ marginRight: 5 }} />
                Tạo đơn nhập kho
              </Row>
            </Link>

            <Space>
              <Button size="large" type="primary">
                Lưu nháp
              </Button>
              <Button size="large" type="primary">
                Tạo đơn hàng
              </Button>
            </Space>
          </Row>
        </Affix>
        <Row gutter={30}>
          <Col span={16}>
            <div className={styles['block']}>
              <Row justify="space-between" align="middle" wrap={false}>
                <div className={styles['title']}>Sản phẩm</div>
                <Button type="link" onClick={toggleProductsToSupplier}>
                  Chọn nhanh từ nhà cung cấp
                </Button>
                <Modal
                  footer={null}
                  title="Chọn sản phẩm từ nhà cung cấp"
                  width={820}
                  visible={visibleProductsToSupplier}
                  onCancel={toggleProductsToSupplier}
                >
                  <Row justify="space-between" wrap={false} align="middle">
                    <Select
                      value={supplierId}
                      onChange={(value) => {
                        setSupplierId(value)
                        _getProductsToSupplier(value)
                      }}
                      showSearch
                      style={{ width: 250, marginBottom: 10 }}
                      placeholder="Chọn nhà cung cấp"
                    >
                      {suppliers.map((supplier, index) => (
                        <Select.Option key={index} value={supplier.supplier_id}>
                          {supplier.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button
                      onClick={() => {
                        const orderCreateNew = { ...orderCreate }
                        orderCreateNew.order_details = productsSupplier
                        setOrderCreate({ ...orderCreateNew })
                        toggleProductsToSupplier()
                      }}
                      type="primary"
                      style={{ display: !productsSupplier.length && 'none' }}
                    >
                      Xác nhận
                    </Button>
                  </Row>
                  <Table
                    size="small"
                    loading={loadingProduct}
                    dataSource={productsSupplier}
                    columns={columnsProductsToSupplier}
                    pagination={false}
                    style={{ width: '100%' }}
                    scroll={{ y: 350 }}
                  />
                </Modal>
              </Row>
              <div className="select-product-sell">
                <Select
                  notFoundContent={loadingProduct ? <Spin size="small" /> : null}
                  dropdownClassName="dropdown-select-search-product"
                  allowClear
                  showSearch
                  clearIcon={<CloseOutlined style={{ color: 'black' }} />}
                  suffixIcon={<SearchOutlined style={{ color: 'black', fontSize: 15 }} />}
                  style={{ width: '100%', marginBottom: 15 }}
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
                            <PlusSquareOutlined style={{ fontSize: 19 }} />
                          </div>
                          <p style={{ marginLeft: 20, marginBottom: 0, fontSize: 16 }}>
                            Thêm sản phẩm mới
                          </p>
                        </Row>
                      </Permission>
                      {menu}
                    </div>
                  )}
                >
                  {productsSearch.map((data) => (
                    <Select.Option value={data.title} key={data.title}>
                      <Row
                        align="middle"
                        wrap={false}
                        style={{ padding: '7px 13px' }}
                        onClick={(e) => {
                          _addProductToOrder(data)
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
                              {formatCash(data.price)}
                            </p>
                          </Row>
                          <Row wrap={false} justify="space-between">
                            <p style={{ marginBottom: 0, color: 'gray' }}>{data.sku}</p>
                            <p style={{ marginBottom: 0, color: 'gray' }}>
                              Số lượng hiện tại: {formatCash(data.total_quantity)}
                            </p>
                          </Row>
                        </div>
                      </Row>
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <Table
                sticky
                pagination={false}
                columns={columns}
                size="small"
                dataSource={[...orderCreate.order_details]}
                locale={{
                  emptyText: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 200,
                      }}
                    >
                      <img src={noData} alt="" style={{ width: 90, height: 90 }} />
                      <h4 style={{ fontSize: 15, color: '#555' }}>
                        Đơn hàng của bạn chưa có sản phẩm
                      </h4>
                    </div>
                  ),
                }}
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row
                      style={{ display: orderCreate.order_details.length === 0 && 'none' }}
                    >
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell colSpan={3}>
                        <div style={{ fontSize: 14.4 }}>
                          <Row wrap={false} justify="space-between">
                            <div>Tổng tiền ({orderCreate.order_details.length} sản phẩm)</div>
                            <div>
                              {orderCreate.sumCostPaid ? formatCash(+orderCreate.sumCostPaid) : 0}
                            </div>
                          </Row>
                          <Row wrap={false} justify="space-between">
                            <div>VAT</div>
                            <div>{formatCash(orderCreate.VAT || 0)}</div>
                          </Row>
                          <Row wrap={false} justify="space-between">
                            <div>Chiết khấu</div>
                            <div>
                              {formatCash(orderCreate.discount ? orderCreate.discount.value : 0)}{' '}
                              {orderCreate.discount
                                ? orderCreate.discount.type === 'VALUE'
                                  ? ''
                                  : '%'
                                : ''}
                            </div>
                          </Row>
                          <Row wrap={false} justify="space-between" align="middle">
                            <div>Phí giao hàng</div>
                            <div>
                              <InputNumber
                                style={{ minWidth: 120 }}
                                onBlur={(e) => {
                                  const value = e.target.value.replaceAll(',', '')
                                  _editOrder('deliveryCharges', +value)
                                }}
                                min={0}
                                size="small"
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                defaultValue={orderCreate.deliveryCharges}
                              />
                            </div>
                          </Row>
                          <Row wrap={false} justify="space-between" style={{ fontWeight: 600 }}>
                            <div>Tổng tiền thanh toán</div>
                            <div>{formatCash(+orderCreate.moneyToBePaidByCustomer || 0)}</div>
                          </Row>
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
            <div className={styles['block']} style={{ marginTop: 30 }}>
              <Row wrap={false} align="middle" style={{ fontWeight: 600 }}>
                <CreditCardFilled style={{ fontSize: 17, marginRight: 5 }} />
                <div>PHƯƠNG THỨC THANH TOÁN</div>
              </Row>
              <div style={{ marginTop: 10 }}>
                <Radio.Group
                  onChange={(e) => _editOrder('type_payment', e.target.value)}
                  defaultValue={orderCreate.type_payment}
                >
                  <Space size="small" direction="vertical">
                    <Radio value="payment-all">Đã thanh toán toàn bộ</Radio>
                    <Radio value="payment-part">Thanh toán một phần</Radio>
                    <Radio value="payment-after">Thanh toán sau</Radio>
                  </Space>
                </Radio.Group>
              </div>
              <Divider />

              {orderCreate.type_payment === 'payment-after' && (
                <div>
                  <div>Tổng tiền cần thanh toán (bao gồm VAT)</div>
                  <InputNumber
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '45%' }}
                    placeholder="Nhập tổng tiền cần thanh toán"
                  />
                </div>
              )}
              {orderCreate.type_payment === 'payment-part' && (
                <Row justify="space-between">
                  <div style={{ width: '45%' }}>
                    <div>Tổng tiền cần thanh toán (bao gồm VAT)</div>
                    <InputNumber
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập tổng tiền cần thanh toán"
                    />
                  </div>

                  <div style={{ width: '45%' }}>
                    <div>Số tiền đã trả</div>
                    <InputNumber
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập số tiền đã trả"
                    />
                  </div>
                </Row>
              )}

              {orderCreate.type_payment === 'payment-all' && (
                <div>
                  <div>Tổng tiền cần thanh toán (bao gồm VAT)</div>
                  <InputNumber
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '45%' }}
                    placeholder="Nhập tổng tiền cần thanh toán"
                  />
                </div>
              )}
            </div>
          </Col>

          <Col span={8}>
            <Form layout="vertical" form={formInfoOrder}>
              <div className={styles['block']} style={{ marginBottom: 30 }}>
                <div className={styles['title']}>Thông tin đơn hàng</div>

                <Form.Item label="Mã đơn hàng">
                  <Input placeholder="Nhập mã đơn hàng" />
                </Form.Item>

                <Form.Item label="Địa điểm nhận hàng">
                  <Select
                    defaultValue={dataUser && dataUser.data && dataUser.data.branch_id}
                    allowClear
                    placeholder="Chọn địa điểm nhận hàng"
                    showSearch
                    notFoundContent={loadingLocation ? <Spin /> : null}
                    style={{ width: '100%' }}
                  >
                    {branches.map((e) => (
                      <Select.Option value={e.branch_id}>{e.name}</Select.Option>
                    ))}

                    {stores.map((e) => (
                      <Select.Option value={e.store_id}>{e.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Ngày nhập hàng" name="">
                  <DatePicker
                    defaultValue={moment(new Date(), 'YYYY-MM-DD HH:mm')}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Chọn ngày giao"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="Nhân viên lên đơn" name="user_create">
                  <Select
                    showSearch
                    placeholder="Chọn nhân viên lên đơn"
                    defaultValue={dataUser && dataUser.data && dataUser.data.user_id}
                  >
                    {users.map((user, index) => (
                      <Select.Option value={user.user_id} key={index}>
                        {user.first_name + ' ' + user.last_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Nhân viên nhận hàng" name="user_receiver">
                  <Select
                    defaultValue={dataUser && dataUser.data && dataUser.data.user_id}
                    showSearch
                    placeholder="Chọn nhân viên nhận hàng"
                  >
                    {users.map((user, index) => (
                      <Select.Option value={user.user_id} key={index}>
                        {user.first_name + ' ' + user.last_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className={styles['block']}>
                <div className={styles['title']}>Hóa đơn </div>
                <div>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    data={_uploadFile}
                  >
                    {file ? (
                      <img src={file} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Tải file</div>
                      </div>
                    )}
                  </Upload>
                </div>

                <div className={styles['title']}>
                  Ghi chú{' '}
                  <Tooltip
                    title={
                      <div style={{ textAlign: 'center' }}>
                        Thêm thông tin ghi chú phục vụ cho việc xem thông tin và xử lý đơn hàng.
                        (VD: đơn giao trong ngày, giao trong giờ hành chính...)
                      </div>
                    }
                  >
                    <InfoCircleTwoTone style={{ fontSize: 12 }} />
                  </Tooltip>
                </div>
                <Form.Item name="note">
                  <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
                </Form.Item>

                <div className={styles['title']}>
                  Tag{' '}
                  <Tooltip
                    title={
                      <div style={{ textAlign: 'center' }}>
                        Chọn hoặc thêm các thẻ cho đơn hàng, thẻ này phục vụ cho việc lọc các đơn
                        (VD: Đơn giao gấp, đơn nội thành...)
                      </div>
                    }
                  >
                    <InfoCircleTwoTone style={{ fontSize: 12 }} />
                  </Tooltip>
                </div>
                <Form.Item name="tags">
                  <Select mode="tags" placeholder="Nhập tags"></Select>
                </Form.Item>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  )
}
