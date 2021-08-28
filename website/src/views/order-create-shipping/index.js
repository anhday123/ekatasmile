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
} from 'antd'
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { apiProductSeller } from 'apis/product'
import { getCustomer } from 'apis/customer'
import CustomerAdd from '../actions/customer/add'
import { getAllBranch } from 'apis/branch'
import { apiAllTax } from 'apis/tax'
import { getPromoton } from 'apis/promotion'
import { ROUTES } from 'consts'
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
            min={1}
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
    const data = await getProduct({ keyword: value, merge: false })
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
              // justifyContent: 'space-between',
            }}
          >
            <img src={_.image[0]} width="100px" style={{ marginRight: 20 }} />
            <span>{_.name}</span>
            {/* <span>{_.sale_price}</span> */}
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
  const createOrder = () => {
    const dataList = productData.map((product) => {
      return {
        product_id: product.product_id,
        sku: product.sku,
        supplier: product.suppliers.supplier_id,
        options: product.options,
        voucher: ' ',
        quantity: product.quantity,
        total_cost: product.sale_price * product.quantity,
        discount: 0,
        final_cost: product.sale_price * product.quantity,
      }
    })
    const data = {
      branch: '1',
      customer: customerInfo.customer_id,
      order_details: dataList,
      payment: '1',
      tax_list: ['1'],
      voucher: ' ',
      transport: '1',
      total_cost: dataList.reduce((a, b) => a + b.final_cost, 0),
      discount: dataList.reduce((a, b) => a + b.discount, 0),
      final_cost:
        dataList.reduce((a, b) => a + b.final_cost, 0) -
        dataList.reduce((a, b) => a + b.discount, 0),
      latitude: '50.50',
      longtitude: '50.50',
      note: note,
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
                placeholder="chọn chi nhánh"
              >
                {branchList.map((e) => (
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

              <Table columns={columns} size="small" dataSource={productData} />
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
                      defaultValue={['1']}
                      style={{ width: '100%' }}
                    >
                      {taxList.map((e) => (
                        <Select.Option value={e.tax_id}>{e.name}</Select.Option>
                      ))}
                    </Select>
                    <div style={{ color: 'blue' }}>voucher</div>

                    <Input size="large" />
                    <div style={{ color: 'blue' }}>chương trình khuyến mãi</div>
                    <Select
                      size="large"
                      // onChange={handleChange}
                      style={{ width: '100%' }}
                    >
                      {promotionList.map((e) => (
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
                      0
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
                      0
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
                        ? formatCash(
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
              <Button size="large" type="primary">
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
