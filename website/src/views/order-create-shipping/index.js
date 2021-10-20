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
  Modal,
  Form,
  Select,
  Typography,
  Radio,
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
import SearchProductItem from './components/SearchProductItem'
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
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Sản phẩm',
      render(data) {
        return <div>{data.title || data.name}</div>
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
      title: 'Đơn giá',
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
    // if (!branch) {
    //   notification.warning({ message: 'Vui lòng chọn chi nhánh' })
    //   return
    // }
    // const data = await getProduct({
    //   search: value,
    //   branch: branch,
    //   merge: false,
    // })
    // setOptions(!data.length ? [] : searchResult(data))
    setOptions(
      searchResult([
        {
          image:
            'https://namlongfashion.com/wp-content/uploads/2020/03/125.jpg',
          name: 'Áo khoán nữ sang trọng RXS56 - Trắng',
          sale_price: 300000,
        },
      ])
    )
  }
  const searchResult = (query) => {
    return query.map((_, idx) => {
      return {
        value: JSON.stringify(_),
        label: <SearchProductItem {..._} />,
      }
    })
  }
  const customerSearch = async (value) => {
    try {
      const res = await getCustomer({ search: value })
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
      const res = await getCustomer({ search: value.split('-').pop() })
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
              <div className={styles['title']}>Cửa hàng</div>
              <Select
                size="large"
                style={{ width: '200px' }}
                onChange={(e) => setBranch(e)}
                placeholder="chọn cửa hàng"
              >
                {branchList
                  .filter((e) => e.active)
                  .map((e) => (
                    <Select.Option value={e.branch_id}>{e.name}</Select.Option>
                  ))}
              </Select>
              <div className={styles['title']}>Sản phẩm</div>
              <AutoComplete
                options={options}
                style={{ width: '100%', marginBottom: 10 }}
                // onSelect={onSelect}
                onSearch={handleSearch}
                onFocus={handleSearch}
              >
                <div>
                  <Input placeholder="Tìm kiếm sản phẩm" size="large" />
                </div>
              </AutoComplete>

              <Table columns={columns} size="small" dataSource={productData} />
            </div>
            <div className={styles['block']} style={{ marginTop: 30 }}>
              <div className={styles['title']}>Thanh toán</div>
              <Row gutter={20}>
                <Col span={12}>
                  <div className={styles['payment-title']}>
                    Ghi chú đơn hàng
                  </div>
                  <Input.TextArea
                    size="large"
                    placeholder="Ghi chú đơn hàng tại đây"
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className={styles['payment-title']}>Nhãn</div>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Thêm nhãn"
                    size="large"
                  ></Select>
                  <div className={styles['payment-title']}>
                    Trạng thái đơn hàng
                  </div>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Trạng thái đơn"
                    size="large"
                  ></Select>
                  <div className={styles['payment-title']}>
                    Trạng thái vận chuyển
                  </div>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Trạng thái vận chuyển"
                    size="large"
                  ></Select>
                  <div className={styles['payment-title']}>Tracking number</div>
                  <Input placeholder="Tracking number" size="large" />
                </Col>
                <Col span={12} style={{ fontSize: 16 }}>
                  <Row gutter={[5, 5]}>
                    <Col span={6}>
                      <div>Thuế</div>
                    </Col>
                    <Col span={18}>
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
                    </Col>
                    <Col span={6}>
                      <div>voucher</div>
                    </Col>
                    <Col span={18}>
                      <Input
                        disabled={promotion}
                        size="large"
                        onChange={(e) => checkVoucher(e.target.value)}
                      />
                    </Col>
                    <Col span={6}>
                      <div>CTKM</div>
                    </Col>
                    <Col span={18}>
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
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Số lượng </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      {productData.length
                        ? productData.reduce((a, b) => a + b.quantity, 0)
                        : 0}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>Tổng tiền</Col>
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
                      <span>Giảm giá</span>
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
                    <Col span={12}>
                      <span>Phí vận chuyển</span>
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
                  <Row justify="end" style={{ marginTop: 20 }}>
                    <Button type="primary" size="large" onClick={createOrder}>
                      Thanh toán
                    </Button>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles['block']}>
              <Row justify="space-between" className={styles['title']}>
                <div>Khách hàng</div>
              </Row>
              <Row gutter={10} align="middle">
                <Col span={20}>
                  <AutoComplete
                    placeholder="Tìm kiếm khách hàng"
                    size="large"
                    options={customerOptions}
                    onSelect={onChooseCustomer}
                    onSearch={customerSearch}
                    onFocus={customerSearch}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={4}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: '#1890ff',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowCreate(true)}
                  >
                    <PlusOutlined />
                  </div>
                </Col>
              </Row>

              <Divider />
              {customerInfo && (
                <>
                  <Row justify="space-between">
                    <span className={styles['payment-title']}>
                      Thông tin khách hàng
                    </span>
                  </Row>
                  <Row>
                    <Col span={24}>
                      {`Họ tên: ${customerInfo.first_name || ''} ${
                        customerInfo.last_name || ''
                      }`}
                    </Col>
                    <Col span={24}>
                      <span style={{ color: '#808080' }}>
                        Số điện thoại: {customerInfo.phone || ''}
                      </span>
                    </Col>
                    <Col span={24}>
                      <span style={{ color: '#808080' }}>
                        Email:{customerInfo.email || ''}
                      </span>
                    </Col>
                    <Col span={24}>
                      <span style={{ color: '#808080' }}>
                        Địa chỉ:{customerInfo.address || ''}
                      </span>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        title="Thêm mới khách hàng"
        visible={showCreate}
        onCancel={() => setShowCreate(false)}
        centered
      >
        <Form layout="vertical">
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="Tên khách hàng">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Địa chỉ">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Liên hệ">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tỉnh/Thành phố">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quận/huyện">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div>Độ tuổi</div>
        <Row>
          <Radio.Group defaultValue="1">
            <Radio value="1">Dưới 18</Radio>
            <Radio value="2">18 đến 25</Radio>
            <Radio value="3">25 đến 35</Radio>
            <Radio value="4">Trên 35</Radio>
          </Radio.Group>
        </Row>
        <div>Giới tính</div>
        <Row>
          <Radio.Group defaultValue="male">
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
        </Row>
      </Modal>
    </div>
  )
}
