import styles from './order-create-shipping.module.scss'
import {
  Row,
  Col,
  Divider,
  Input,
  Button,
  Table,
  InputNumber,
  AutoComplete,
  notification,
  Drawer,
  Select,
  Typography,
} from 'antd'
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AlertOutlined,
} from '@ant-design/icons'
import { apiProductSeller } from 'apis/product'
import { getCustomer } from 'apis/customer'
import CustomerAdd from '../actions/customer/add'
import { getAllBranch } from 'apis/branch'
import { apiAllTax } from 'apis/tax'
import { apiCheckPromotion, getPromoton } from 'apis/promotion'
import { apiOrderVoucher } from 'apis/order'
import { ROUTES } from 'consts'
const { Text } = Typography
function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
export default function OrderCreateShipping() {
  let history = useHistory()
  const [productData, setProductData] = useState([])
  const [options, setOptions] = useState([])
  const [customerOptions, setCustomerOptions] = useState([])
  const [customerInfo, setCustomerInfo] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [note, setNote] = useState('')
  const [branchList, setBranchList] = useState([])
  const [taxList, setTaxList] = useState([])
  const [promotionList, setPromotionList] = useState([])
  const [promotion, setPromotion] = useState('')
  const [taxValue, setTaxValue] = useState(5)
  const [tax, setTax] = useState(['1'])
  const [voucher, setvoucher] = useState('')
  const [discount, setDiscount] = useState('')
  const [branch, setBranch] = useState('')
  const columns = [
    {
      title: 'Sản phẩm',
      render(data) {
        return (
          <div>
            <Row gutter={10}>
              <Col>
                <img src={data.image[0]} width="50" />
              </Col>
              <Col>
                <div>{data.title || data.name}</div>
                <div>
                  {data.options &&
                    data.options
                      .map((e) => {
                        return e.values
                      })
                      .join('/')}
                </div>
                <div>{data.sku}</div>
              </Col>
            </Row>
          </div>
        )
      },
    },
    {
      title: 'Số lượng',
      render(data, record, index) {
        return (
          <InputNumber
            defaultValue={1}
            min={0}
            max={record.available_stock_quantity || record.low_stock_quantity}
            onChange={(e) => {
              var tmp = [...productData]
              tmp[index].quantity = e
              setProductData(tmp)
            }}
          />
        )
      },
    },
    {
      title: 'Giá',
      dataIndex: 'sale_price',
      render(data) {
        return formatCash(data)
      },
    },
    {
      title: 'Thành tiền',
      render(data) {
        return formatCash(data.sale_price * data.quantity)
      },
    },
  ]
  const getProduct = async (params) => {
    try {
      const res = await apiProductSeller(params)
      if (res.data.success) {
        return res.data.data
      }
    } catch (e) {
      console.log(e)
      return []
    }
  }
  const handleSearch = async (value) => {
    if (!branch) {
      notification.warning({ message: 'Vui lòng chọn chi nhánh' })
      return
    }
    const data = await getProduct({
      keyword: value,
      branch: branch,
      merge: false,
    })
    setOptions(!data.length ? [] : searchResult(data))
  }
  const searchResult = (query) => {
    return query.map((_, idx) => {
      return {
        value: JSON.stringify(_),
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', width: '50%' }}>
              <img src={_.image[0]} width="60px" style={{ marginRight: 20 }} />
              <div
                style={{
                  width: '230px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {_.title || _.name}
              </div>
            </div>

            <div style={{ display: 'flex', width: '50%' }}>
              <div style={{ padding: '10px', width: '110px' }}>
                {formatCash(_.sale_price)} VND
              </div>
              <div style={{ padding: '10px', width: '80px', color: 'green' }}>
                <CheckCircleOutlined />
                {formatCash(_.available_stock_quantity)}
              </div>
              <div style={{ padding: '10px', width: '80px', color: 'orange' }}>
                <AlertOutlined /> {_.low_stock_quantity}
              </div>
              <div style={{ padding: '10px', width: '80px', color: 'red' }}>
                <CloseCircleOutlined /> {_.out_stock_quantity}
              </div>
            </div>
          </div>
        ),
      }
    })
  }
  const customerSearch = async (value) => {
    try {
      const res = await getCustomer({ keyword: value })
      setCustomerOptions(
        !res.data.data.length
          ? []
          : res.data.data.map((e) => {
              return {
                value: `${e.first_name} ${e.last_name}-${e.phone}`,
              }
            })
      )
    } catch (e) {
      setCustomerOptions([])
    }
  }
  const onSelect = (value) => {
    const tmp = JSON.parse(value)
    if (
      !productData.find(
        (e) => e.product_id == tmp.product_id && e.sku == tmp.sku
      )
    ) {
      setProductData([...productData, { ...tmp, quantity: 1 }])
    } else {
      notification.warning({ message: 'Sản phẩm đã được thêm trước đó' })
    }
  }
  const onChooseCustomer = async (value) => {
    try {
      const res = await getCustomer({ keyword: value.split('-').pop() })
      if (res.data.success) {
        setCustomerInfo(res.data.data[0])
      }
    } catch (e) {
      console.log(e)
    }
  }
  const createOrder = async () => {
    if (voucher) {
      try {
        const res = await apiCheckPromotion({ voucher })
        if (!res.data.success) {
          notification.error({
            message: 'Voucher không tồn tại hoặc đã được sử dụng',
          })
          return
        }
      } catch (e) {
        notification.error({
          message: 'Voucher không tồn tại hoặc đã được sử dụng',
        })
        return
      }
    }
    let totalDiscount =
      (discount.value / 100) *
      productData.reduce((a, b) => a + b.quantity * b.sale_price, 0)
    const dataList = productData.map((product) => {
      let productDiscount = 0
      if (totalDiscount >= product.sale_price * product.quantity) {
        productDiscount = product.sale_price * product.quantity
        totalDiscount -= product.sale_price * product.quantity
      } else {
        productDiscount = totalDiscount
        totalDiscount = 0
      }
      const data = {
        product_id: product.product_id,
        sku: product.sku,
        supplier: product.suppliers.supplier_id,
        options: product.options,
        // has_variable: product.has_variable,
        quantity: product.quantity,
        total_cost: product.sale_price * product.quantity,
        discount: productDiscount,
        final_cost: product.sale_price * product.quantity - productDiscount,
      }

      return voucher
        ? { ...data, voucher: productDiscount ? voucher : ' ' }
        : { ...data, promotion: productDiscount ? promotion : ' ' }
    })
    const data = {
      branch: branch,
      customer: customerInfo.customer_id,
      order_details: dataList,
      payment: '1',
      tax_list: tax,
      // voucher: voucher,
      transport: '1',
      total_cost: dataList.reduce((a, b) => a + b.final_cost, 0),
      discount: dataList.reduce((a, b) => a + b.discount, 0),
      final_cost:
        dataList.reduce((a, b) => a + b.total_cost, 0) -
        dataList.reduce((a, b) => a + b.discount, 0) +
        (dataList.reduce((a, b) => a + b.final_cost, 0) * taxValue) / 100,
      latitude: '50.50',
      longtitude: '50.50',
      note: note,
    }
    const res = voucher
      ? await apiOrderVoucher({ ...data, voucher })
      : await apiOrderVoucher({ ...data, promotion })
    if (res.data.success) {
      notification.success({ message: 'Tạo hóa đơn thành công' })
      history.push('/order-list')
    }
  }
  const getData = async (api, callback) => {
    try {
      const res = await api()
      if (res.data.success) {
        callback(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const checkVoucher = async (value) => {
    setvoucher(value)
    try {
      const res = await apiCheckPromotion({ voucher, value })
      if (res.data.success) {
        if (res.data.data.type == 'value') {
          setDiscount({ value: res.data.data.value, type: 'value' })
        } else setDiscount({ value: res.data.data.value, type: 'percent' })
      }
    } catch (e) {
      console.log(e)
    }
  }
  const addTax = (value) => {
    setTax(value)
    const totaltax = value
      .map((e) => {
        return parseInt(e.value)
      })
      .reduce((a, b) => a + b, 0)
    setTaxValue(totaltax)
  }
  const addPromotion = (value) => {
    setPromotion(value)
    const pro = promotionList.find((e) => e.promotion_id == value)
    if (pro.type == 'value') {
      setDiscount({ value: pro.value, type: 'value' })
    } else setDiscount({ value: pro.value, type: 'percent' })
  }
  useEffect(() => {
    getData(getAllBranch, setBranchList)
    getData(apiAllTax, setTaxList)

    getData(getPromoton, setPromotionList)
  }, [])
  return (
    <div className={`${styles['order-create-shipping']}`}>
      <div
        style={{ background: 'white', padding: '20px' }}
        className={styles['card']}
      >
        <Row
          align="middle"
          style={{
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            width: 'max-content',
          }}
          onClick={() => history.push(ROUTES.ORDER_LIST)}
        >
          <ArrowLeftOutlined style={{ marginRight: 5 }} />
          Tạo đơn hàng
        </Row>
        <Divider />
        <Row gutter={30}>
          <Col span={16}>
            <div className={styles['block']}>
              <div className={styles['title']}>Chi nhánh</div>
              <Select
                size="large"
                style={{ width: '200px' }}
                onChange={(e) => setBranch(e)}
                placeholder="chọn chi nhánh"
              >
                {branchList
                  .filter((e) => e.active)
                  .map((e) => (
                    <Select.Option value={e.branch_id}>{e.name}</Select.Option>
                  ))}
              </Select>
              <div className={styles['title']}>Sản phẩm</div>
              <AutoComplete
                size="large"
                options={options}
                style={{ width: '100%', marginBottom: 10 }}
                onSelect={onSelect}
                onSearch={handleSearch}
                onFocus={handleSearch}
                placeholder="Tìm kiếm sản phẩm"
              />

              <Table
                columns={columns}
                size="small"
                dataSource={productData}
                summary={(pageData) => {
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text>Tổng cộng:{`${pageData.length}`}</Text>
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
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                }}
              />
            </div>
            <div className={styles['block']} style={{ marginTop: 30 }}>
              <div className={styles['title']}>Thanh toán</div>
              <Row gutter={20}>
                <Col span={12}>
                  <div style={{ fontWeight: 500 }}>Ghi chú đơn hàng</div>
                  <Input
                    size="large"
                    placeholder="Ghi chú đơn hàng tại đây"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <Row>
                    <div style={{ color: 'blue' }}>Thuế</div>
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Please select"
                      defaultValue={tax}
                      onChange={addTax}
                      style={{ width: '100%' }}
                    >
                      {taxList
                        .filter((e) => e.active)
                        .map((e) => (
                          <Select.Option value={e.tax_id}>
                            {e.name}
                          </Select.Option>
                        ))}
                    </Select>
                    <div style={{ color: 'blue' }}>voucher</div>
                    <Input
                      disabled={promotion}
                      size="large"
                      onChange={(e) => checkVoucher(e.target.value)}
                    />
                    <div style={{ color: 'blue' }}>chương trình khuyến mãi</div>
                    <Select
                      size="large"
                      style={{ width: '100%' }}
                      disabled={voucher}
                      allowClear
                      onChange={addPromotion}
                    >
                      {promotionList
                        .filter((e) => e.active)
                        .map((e) => (
                          <Select.Option value={e.promotion_id}>
                            {e.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Row>
                  <Row>
                    <Col span={12}>Số lượng sản phẩm</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {productData.length
                        ? productData.reduce((a, b) => a + b.quantity, 0)
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Tổng tiền hàng</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {productData.length
                        ? formatCash(
                            productData.reduce(
                              (a, b) => a + b.quantity * b.sale_price,
                              0
                            )
                          )
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span>Chiết khấu</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {discount && productData.length
                        ? formatCash(
                            discount.type == 'value'
                              ? discount.value
                              : (discount.value / 100) *
                                  productData.reduce(
                                    (a, b) => a + b.quantity * b.sale_price,
                                    0
                                  )
                          )
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span style={{ color: 'blue' }}>Giảm giá</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span>Tổng thuế</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {productData.length
                        ? formatCash(
                            (taxValue / 100) *
                              productData.reduce(
                                (a, b) => a + b.quantity * b.sale_price,
                                0
                              )
                          )
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Tạm tính</Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <span style={{ color: 'blue' }}>Phí vận chuyển</span>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      0
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <b>Phải thu</b>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {productData.length
                        ? discount
                          ? formatCash(
                              discount.type == 'value'
                                ? discount.value
                                : productData.reduce(
                                    (a, b) => a + b.quantity * b.sale_price,
                                    0
                                  ) - // giảm giá
                                    (discount.value / 100) *
                                      productData.reduce(
                                        (a, b) => a + b.quantity * b.sale_price,
                                        0
                                      ) + // thuế
                                    (taxValue / 100) *
                                      productData.reduce(
                                        (a, b) => a + b.quantity * b.sale_price,
                                        0
                                      )
                            )
                          : formatCash(
                              productData.reduce(
                                (a, b) => a + b.quantity * b.sale_price,
                                0
                              ) + //thuế
                                (taxValue / 100) *
                                  productData.reduce(
                                    (a, b) => a + b.quantity * b.sale_price,
                                    0
                                  )
                            )
                        : 0}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Divider />
            <Row justify="end">
              <Button type="primary" size="large" onClick={createOrder}>
                Thanh toán
              </Button>
            </Row>
          </Col>
          <Col span={8}>
            <div
              className={styles['block']}
              style={{
                boxShadow:
                  ' rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
              }}
            >
              {!customerInfo ? (
                <>
                  <Row justify="space-between" className={styles['title']}>
                    <div>Khách hàng</div>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowCreate(true)}
                    >
                      <PlusOutlined /> Tạo khách hàng
                    </div>
                  </Row>
                  <AutoComplete
                    placeholder="Tìm kiếm khách hàng"
                    size="large"
                    options={customerOptions}
                    onSelect={onChooseCustomer}
                    onSearch={customerSearch}
                    onFocus={customerSearch}
                    style={{ width: '100%' }}
                  />

                  <Divider />
                </>
              ) : (
                <>
                  <Row justify="space-between">
                    <span style={{ color: '#0000FF', fontWeight: 500 }}>
                      Thông tin người mua
                    </span>
                    <CloseOutlined
                      onClick={() => setCustomerInfo(false)}
                      cursor="pointer"
                    />
                  </Row>
                  <Row>
                    <Col span={24}>
                      {`${customerInfo.first_name} ${customerInfo.last_name}`}
                    </Col>
                    <Col span={24}>
                      <span style={{ color: '#808080' }}>
                        {customerInfo.email}
                      </span>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <span style={{ color: '#0000FF', fontWeight: 500 }}>
                      Thông tin giao hàng
                    </span>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {`${customerInfo.first_name} ${customerInfo.last_name}`}
                    </Col>
                    <Col span={24}>
                      <span style={{ color: '#808080' }}>
                        Không có thông tin công ty
                      </span>
                    </Col>
                  </Row>
                  <Divider />
                  <Row justify="space-between">
                    <span style={{ color: '#0000FF', fontWeight: 500 }}>
                      Địa chỉ giao hàng
                    </span>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {customerInfo.address}, {customerInfo.ward},{' '}
                      {customerInfo.district}, {customerInfo.province}
                    </Col>
                  </Row>
                  <Divider />
                  <Row justify="space-between">
                    <span style={{ color: '#0000FF', fontWeight: 500 }}>
                      Ghi chú về khách hàng
                    </span>
                  </Row>
                  <Row>
                    <Col span={24}>Không có ghi chú</Col>
                  </Row>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Drawer
        title="Tạo khách hàng"
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        width="75%"
      >
        <CustomerAdd close={() => setShowCreate(false)} hiddenType />
      </Drawer>
    </div>
  )
}
