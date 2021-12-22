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
import { uploadFile } from 'apis/upload'

//components
import Permission from 'components/permission'

export default function ImportInventory() {
  const history = useHistory()
  const location = useLocation()
  const dataUser = useSelector((state) => state.login.dataUser)
  const [formInfoOrder] = Form.useForm()

  const [loadingUpload, setLoadingUpload] = useState(false)
  const [file, setFile] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [productsSearch, setProductsSearch] = useState([])

  //object order create
  const [orderCreate, setOrderCreate] = useState({
    name: 'Đơn 1',
    type: 'default',
    order_details: [], //danh sách sản phẩm trong hóa đơn
    payments: [], //hình thức thanh toán
    type_payment: 'payment-all', //hình thức thanh toán
    sumCostPaid: 0, // tổng tiền của tất cả sản phẩm
    discount: null,
    VAT: 0,
    noteInvoice: '',
    salesChannel: '', //kênh bán hàng
    isDelivery: true, //mặc định là hóa đơn giao hàng
    deliveryCharges: 0, //phí giao hàng
    deliveryAddress: null, //địa chỉ nhận hàng
    shipping: null, //đơn vị vận chuyển
    billOfLadingCode: '',
    moneyToBePaidByCustomer: 0, // tổng tiền khách hàng phải trả
    prepay: 0, //tiền khách thanh toán trước
    moneyGivenByCustomer: 0, //tiền khách hàng đưa
    excessCash: 0, //tiền thừa
  })

  const [loadingBranch, setLoadingBranch] = useState(false)
  const [branches, setBranches] = useState([])

  const _editOrder = (attribute, value) => {
    const orderCreateNew = { ...orderCreate }
    orderCreateNew[attribute] = value

    //tổng tiền khách hàng phải trả
    orderCreateNew.moneyToBePaidByCustomer =
      orderCreateNew.sumCostPaid +
      orderCreateNew.VAT +
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

  const _addProductToOrder = (product) => {
    if (product) {
      //check product có đủ số lượng
      // if (product.total_quantity !== 0) {
      const orderCreateNew = { ...orderCreate }
      const indexProduct = orderCreateNew.order_details.findIndex((e) => e._id === product._id)

      //nếu đã có sẵn trong cart rồi thì tăng số lượng và tổng tiền của sản phẩm đó lên
      //nếu chưa có thì push vào giỏ hàng
      if (indexProduct !== -1) {
        // if (orderCreateNew.order_details[indexProduct].quantity < product.total_quantity) {
        orderCreateNew.order_details[indexProduct].quantity++

        orderCreateNew.order_details[indexProduct].sumCost =
          +orderCreateNew.order_details[indexProduct].quantity *
          +orderCreateNew.order_details[indexProduct].price

        //thuế VAT của mỗi sản phẩm
        orderCreateNew.order_details[indexProduct].VAT_Product =
          orderCreateNew.order_details[indexProduct]._taxes &&
          orderCreateNew.order_details[indexProduct]._taxes.length
            ? (
                (orderCreateNew.order_details[indexProduct]._taxes.reduce(
                  (total, current) => total + current.value,
                  0
                ) /
                  100) *
                orderCreateNew.order_details[indexProduct].sumCost
              ).toFixed(0)
            : 0
        // } else
        //   notification.warning({
        //     message: 'Sản phẩm không đủ số lượng để bán, vui lòng chọn sản phẩm khác!',
        //   })
      } else
        orderCreateNew.order_details.push({
          ...product,
          unit: '', //đơn vị
          quantity: 1, //số lượng sản phẩm
          sumCost: product.price, // tổng giá tiền
          VAT_Product:
            product._taxes && product._taxes.length
              ? (
                  (product._taxes.reduce((total, current) => total + current.value, 0) / 100) *
                  product.price
                ).toFixed(0)
              : 0,
        })

      // tổng tiền của tất cả sản phẩm
      orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
        (total, current) => total + current.sumCost,
        0
      )

      //tổng thuế VAT của tất cả sản phẩm
      orderCreateNew.VAT = orderCreateNew.order_details.reduce(
        (total, current) => total + +current.VAT_Product,
        0
      )

      //tổng tiền khách hàng phải trả
      orderCreateNew.moneyToBePaidByCustomer =
        orderCreateNew.sumCostPaid +
        orderCreateNew.VAT +
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
      // } else
      //   notification.warning({
      //     message: 'Sản phẩm không đủ số lượng để bán, vui lòng chọn sản phẩm khác!',
      //   })
    }
  }

  const _editProductInOrder = (attribute, value, index) => {
    if (index !== -1) {
      const orderCreateNew = { ...orderCreate }
      orderCreateNew.order_details[index][attribute] = value

      //tổng tiền của 1 sản phẩm
      orderCreateNew.order_details[index].sumCost =
        +orderCreateNew.order_details[index].quantity * +orderCreateNew.order_details[index].price

      //thuế VAT của mỗi sản phẩm
      orderCreateNew.order_details[index].VAT_Product =
        orderCreateNew.order_details[index]._taxes &&
        orderCreateNew.order_details[index]._taxes.length
          ? (
              (orderCreateNew.order_details[index]._taxes.reduce(
                (total, current) => total + current.value,
                0
              ) /
                100) *
              orderCreateNew.order_details[index].sumCost
            ).toFixed(0)
          : 0

      //tổng thuế VAT của tất cả các sản phẩm
      orderCreateNew.VAT = orderCreateNew.order_details.reduce(
        (total, current) => total + +current.VAT_Product,
        0
      )

      // tổng tiền của tất cả sản phẩm
      orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
        (total, current) => total + current.sumCost,
        0
      )

      //tổng tiền khách hàng phải trả
      orderCreateNew.moneyToBePaidByCustomer =
        orderCreateNew.sumCostPaid +
        orderCreateNew.VAT +
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

      //tổng thuế VAT của tất cả các sản phẩm
      orderCreateNew.VAT = orderCreateNew.order_details.reduce(
        (total, current) => total + +current.VAT_Product,
        0
      )

      // tổng tiền của tất cả sản phẩm
      orderCreateNew.sumCostPaid = orderCreateNew.order_details.reduce(
        (total, current) => total + current.sumCost,
        0
      )

      //tổng tiền khách hàng phải trả
      orderCreateNew.moneyToBePaidByCustomer =
        orderCreateNew.sumCostPaid +
        orderCreateNew.VAT +
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

  const columns = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Phiên bản',
      dataIndex: 'variant',
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'quantity_inventory',
    },
    {
      title: 'Số lượng nhập',
      render: (data, record) => {
        const InputQuantity = () => (
          <InputNumber
            style={{ width: 70 }}
            onBlur={(e) => {
              const value = e.target.value.replaceAll(',', '')
              const indexProduct = orderCreate.order_details.findIndex((e) => e._id === record._id)
              _editProductInOrder('quantity', +value, indexProduct)
            }}
            defaultValue={record.quantity || 1}
            min={1}
            max={record.total_quantity}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập số lượng nhập"
          />
        )

        return <InputQuantity />
      },
    },
    {
      title: 'Đơn giá nhập',
      render: (data, record) => {
        const InputPrice = () => (
          <InputNumber
            style={{ width: 150 }}
            onBlur={(e) => {
              const value = e.target.value.replaceAll(',', '')
              const indexProduct = orderCreate.order_details.findIndex((e) => e._id === record._id)
              _editProductInOrder('price', +value, indexProduct)
            }}
            defaultValue={record.price || 1}
            min={1}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập đơn giá nhập"
          />
        )

        return <InputPrice />
      },
    },
    {
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
      setLoadingBranch(true)
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
      setLoadingBranch(false)
    } catch (error) {
      setLoadingBranch(false)
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

  const _getProductsSearch = async () => {
    try {
      setLoadingProduct(true)
      const branchId = dataUser && dataUser.data ? dataUser.data.branch_id : ''
      const res = await getProducts({ branch_id: branchId, merge: true, detach: true })
      if (res.status === 200) {
        const productsSearchNew = res.data.data.map((e) => e.variants)

        const query = new URLSearchParams(location.search)
        const _id = query.get('_id')
        console.log(_id)
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
    _getBranches()
    _getProductsSearch()
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

            <Button size="large" type="primary">
              Tạo đơn hàng
            </Button>
          </Row>
        </Affix>
        <Row gutter={30}>
          <Col span={16}>
            <div className={styles['block']}>
              <div className={styles['title']}>Sản phẩm</div>
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
                          <div>Khách phải trả</div>
                          <div>{formatCash(+orderCreate.moneyToBePaidByCustomer || 0)}</div>
                        </Row>
                      </div>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
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
                    allowClear
                    placeholder="Chọn địa điểm nhận hàng"
                    showSearch
                    notFoundContent={loadingBranch ? <Spin /> : null}
                    style={{ width: '100%' }}
                  >
                    {branches.map((e, index) => (
                      <Select.Option value={e.branch_id} key={index}>
                        {e.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Ngày nhập hàng" name="">
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Chọn ngày giao"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="Nhân viên lên đơn" name="">
                  <Input
                    placeholder="Nhập tên nhân viên lên đơn"
                    defaultValue={
                      dataUser &&
                      dataUser.data &&
                      dataUser.data.first_name + ' ' + dataUser.data.last_name
                    }
                  />
                </Form.Item>

                <Form.Item label="Nhân viên nhận hàng" name="">
                  <Input
                    placeholder="Nhập tên nhân viên nhận hàng"
                    defaultValue={
                      dataUser &&
                      dataUser.data &&
                      dataUser.data.first_name + ' ' + dataUser.data.last_name
                    }
                  />
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
