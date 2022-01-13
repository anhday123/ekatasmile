import React, { useEffect, useState } from 'react'
import styles from './point.module.scss'
import { useDispatch } from 'react-redux'
import { ROUTES } from 'consts'
import { useHistory } from 'react-router-dom'

//components
import TitlePage from 'components/title-page'

//antd
import { Row, Col, Select, Checkbox, Radio, InputNumber, Input, Button, Space, notification, Tooltip } from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//apis
import { getPoint, updatePoint } from 'apis/point'
import { getAllBranch } from 'apis/branch'
import { getProducts } from 'apis/product'
import { getCategories } from 'apis/category'
import { getCustomers } from 'apis/customer'

export default function Point() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [point, setPoint] = useState({})
  const [branches, setBranches] = useState([])
  const [orderPoint, setOrderPoint] = useState()
  const [selectedBranch, setSelectedBranch] = useState(1)
  const [dataProduct, setDataProduct] = useState([])
  const [dataCategories, setDataCategories] = useState([])
  const [dataCustomer, setDataCustomer] = useState([])

  const [config, setConfig] = useState({
    active: true,
    accumulate_for_promotion_product: false,
    accumulate_for_refund_order: false,
    accumulate_for_payment_point: false,
    accumulate_for_fee_shipping: false,
    stack_point: false,
    exchange_point_rate: 0,
    exchange_money_rate: 0,
    order_require: 0,
    order_cost_require: 0,
    all_branch: false,
    branch_id: [],
    all_customer_type: false,
    customer_type_id: [],
    all_category: false,
    category_id: [],
    all_product: false,
    product_id: [],
  })
  console.log(config)

  const PointTitle = ({ title }) => (
    <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
      <Col>
        <Row align="middle" style={{ fontSize: 18, fontWeight: 600 }}>
          {title}
        </Row>
      </Col>
    </Row>
  )

  const onSaveSetting = async () => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const data = {
        active: config.active,
        accumulate_for_promotion_product: config.accumulate_for_promotion_product,
        accumulate_for_refund_order: config.accumulate_for_refund_order,
        accumulate_for_payment_point: config.accumulate_for_payment_point,
        accumulate_for_fee_shipping: config.accumulate_for_fee_shipping,
        stack_point: config.stack_point,
        exchange_point_rate: config.exchange_point_rate,
        exchange_money_rate: config.exchange_money_rate,
        order_require: config.order_require,
        order_cost_require: config.order_cost_require,
        all_branch: false,
        branch_id: config.branch_id,
        all_customer_type: point.all_customer_type,
        customer_type_id: config.customer_type_id,
        all_category: config.all_category,
        category_id: config.category_id,
        all_product: config.all_product,
        product_id: config.product_id,
      }
      const res = await updatePoint(data, point.point_setting_id)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Cập nhật thành công' })
        } else {
          notification.error({ message: 'Cập nhật thất bại' })
        }
      }
      dispatch({ type: 'LOADING', data: false })
    } catch (err) {
      console.log(err)
      dispatch({ type: 'LOADING', data: true })
      notification.error({ message: 'Cập nhật thất bại' })
    }
  }

  const selectAllBranch = (checked) => {
    if (checked) setConfig({ ...config, selected: branches.map((e) => e.branch_id) })
    else setConfig({ ...config, selected: [] })
  }

  const _getPoint = async (params) => {
    try {
      setLoading(true)
      const res = await getPoint(params)
      if (res.data.success)
        setPoint(res.data.data[0])
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const _getBranches = async (params) => {
    try {
      setLoading(true)
      const res = await getAllBranch(params)
      if (res.data.success) {
        setBranches(res.data.data)
        setSelectedBranch(res.data.data[0].branch_id)
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const _getProducts = async (params) => {
    try {
      setLoading(true)
      const res = await getProducts(params)
      if (res.status === 200)
        setDataProduct(res.data.data)
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const _getCategories = async (params) => {
    try {
      setLoading(true)
      const res = await getCategories(params)
      if (res.status === 200)
        setDataCategories(res.data.data)
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const _getCustomers = async (params) => {
    try {
      setLoading(true)
      const res = await getCustomers(params)
      if (res.status === 200)
        setDataCustomer(res.data.data)
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    _getPoint()
    _getBranches()
    _getProducts()
    _getCategories()
    _getCustomers()
  }, [])

  useEffect(() => {
    setConfig({
      active: point.active,
      accumulate_for_promotion_product: point.accumulate_for_promotion_product,
      accumulate_for_refund_order: point.accumulate_for_refund_order,
      accumulate_for_payment_point: point.accumulate_for_payment_point,
      accumulate_for_fee_shipping: point.accumulate_for_fee_shipping,
      stack_point: point.stack_point,
      exchange_point_rate: point.exchange_point_rate,
      exchange_money_rate: point.exchange_money_rate,
      order_require: point.order_require,
      order_cost_require: point.order_cost_require,
      all_branch: point.all_branch,
      branch_id: point.branch_id,
      all_customer_type: point.all_customer_type,
      customer_type_id: point.customer_type_id,
      all_category: point.all_category,
      category_id: point.category_id,
      all_product: point.all_product,
      product_id: point.product_id,
    })
  }, [point])

  return (
    <div className={styles['point-container']}>
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.CONFIGURATION_STORE)}
          >
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Cấu hình tích điểm
          </Row>
        }
      >
        <Button type="primary" size="large" style={{ width: 100 }} onClick={onSaveSetting}>
          Lưu
        </Button>
      </TitlePage>

      <Row justify='space-between' className={styles['point-top']}>
        <Col md={6} lg={6} xl={6}>
          <h3>Thiết lập cơ bản</h3>
          <p>Những thiết lập chung nhất cho việc sử dụng tính năng trên phần mềm.</p>
        </Col>
        <Col md={16} lg={16} xl={16} className={styles['point-top-right']}>
          <Row className={styles['point-top-right-top']}>
            <Checkbox
              value={config.active}
              onChange={(e) =>
                setConfig({
                  ...config,
                  active: e.target.checked,
                })
              }
            >
              <span style={{ fontWeight: 500 }}>Áp dụng tính năng tích điểm</span>
            </Checkbox>
          </Row>

          <Row className={styles['point-top-right-middle-1']}>
            <h4>CƠ CHẾ TÍCH ĐIỂM</h4>
            <Checkbox
              value={config.accumulate_for_promotion_product}
              onChange={(e) => setConfig({
                ...config,
                accumulate_for_promotion_product: e.target.checked
              })}
            >Tích điểm cho các sản phẩm giảm giá</Checkbox>
            <Checkbox
              value={config.accumulate_for_refund_order}
              onChange={(e) => setConfig({
                ...config,
                accumulate_for_refund_order: e.target.checked
              })}
            >Tích điểm khi khách hàng trả hàng</Checkbox>
          </Row>

          <Row className={styles['point-top-right-middle-2']}>
            <h4>HÌNH THỨC TÍCH ĐIỂM</h4>
            <Radio.Group onChange={e => setConfig({ ...config, stack_point: e.target.value })} value={config.stack_point}>
              <Radio value={false}>Tích điểm cố định</Radio>
              <Radio value={true}>Tích điểm lũy tiến - cộng dồn</Radio>
            </Radio.Group>
          </Row>

          <Row className={styles['point-top-right-bottom']}>
            <h4>TỶ LỆ QUY ĐỔI ĐIỂM</h4>
            <Row>
              <Col span={10}>
                <InputNumber
                  value={config.exchange_point_rate}
                  onChange={(e) => setConfig({ ...config, exchange_point_rate: e })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />{' '}
                = 1 điểm
              </Col>
              <Col span={14}>
                Đơn vị tích điểm <Input defaultValue='Điểm' style={{ width: '30%' }} />
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>

      <Row justify='space-between' className={styles['point-bottom']}>
        <Col md={6} lg={6} xl={6}>
          <h3>Thiết lập nâng cao</h3>
          <p>Những thiết lập liên quan đến thanh toán và đối tượng được áp dụng.</p>
        </Col>
        <Col md={16} lg={16} xl={16} className={styles['point-bottom-right']}>
          <Row className={styles['point-bottom-right-payment']}>
            <h4>THANH TOÁN</h4>
            <p>Tỷ lệ quy điểm ra tiền</p>
            <div>
              1 điểm ={' '}
              <InputNumber
                value={config.exchange_money_rate}
                onChange={(e) => setConfig({ ...config, exchange_money_rate: e })}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>
            <div>
              <div>
                <Checkbox
                  value={config.order_require}
                  onChange={(e) => setOrderPoint({
                    order_require: e.target.checked
                  })}>Cho phép thanh toán bằng điểm sau</Checkbox>
                <InputNumber onChange={e => setConfig({
                  ...config,
                  order_require: orderPoint.order_require === true ? e : -1
                })} defaultValue='0' min={1} style={{ width: '15%', zIndex: 10 }} /> lần mua
              </div>
              <Checkbox
                value={config.accumulate_for_payment_point}
                onChange={(e) => setConfig({
                  ...config,
                  accumulate_for_payment_point: e.target.checked
                })}>Tích điểm khi khách hàng thanh toán hóa đơn bằng điểm</Checkbox>
              <Checkbox
                value={config.accumulate_for_fee_shipping}
                onChange={(e) => setConfig({
                  ...config,
                  accumulate_for_fee_shipping: e.target.checked
                })}>Tích điểm cho giá trị thanh toán bao gồm phí vận chuyển</Checkbox>
            </div>
          </Row>

          <Row className={styles['point-bottom-right-content']}>
            <h4>KHÁCH HÀNG ÁP DỤNG TÍCH ĐIỂM</h4>
            <Radio.Group className={styles['point-bottom-right-radio']} onChange={e => setConfig({ ...config, all_customer_type: e.target.value })} value={config.all_customer_type}>
              <Radio value={true}>Tất cả khách hàng</Radio>
              <Radio value={false}>Theo nhóm khách hàng</Radio>
            </Radio.Group>
            <Row>
              <Select
                mode="multiple"
                placeholder="Chọn sản phẩm"
                size="small"
                value={config.customer_type_id}
                onChange={(e) => setConfig({ ...config, customer_type_id: e })}
                style={{ display: `${config.all_customer_type === false ? 'block' : 'none'}`, width: '50%', marginTop: 10 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {dataCustomer.map((e) => (
                  <Select.Option value={e.customer_type_id}>{e.name}</Select.Option>
                ))}
              </Select>
            </Row>
          </Row>

          <Row className={styles['point-bottom-right-content']}>
            <h4>DANH SÁCH SẢN PHẨM ÁP DỤNG TÍCH ĐIỂM</h4>
            <Radio.Group className={styles['point-bottom-right-radio']} onChange={e => setConfig({ ...config, all_category: e.target.value })} value={config.all_category}>
              <Radio value={true}>Tất cả sản phẩm</Radio>
              <Radio value={false}>Theo loại sản phẩm</Radio>
            </Radio.Group>
            <Row>
              <Select
                mode="multiple"
                placeholder="Chọn sản phẩm"
                size="small"
                value={config.category_id}
                onChange={(e) => setConfig({ ...config, category_id: e })}
                style={{ display: `${config.all_category === false ? 'block' : 'none'}`, width: '50%', marginTop: 10 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {dataCategories.map((e) => (
                  <Select.Option value={e.category_id}>{e.name}</Select.Option>
                ))}
              </Select>
            </Row>
          </Row>

          <Row className={styles['point-bottom-right-content']}>
            <h4>SẢN PHẨM ÁP DỤNG TÍCH ĐIỂM</h4>
            <Radio.Group className={styles['point-bottom-right-radio']} onChange={e => setConfig({ ...config, all_product: e.target.value })} value={config.all_product}>
              <Radio value={true}>Tất cả sản phẩm</Radio>
              <Radio value={false}>Theo sản phẩm</Radio>
            </Radio.Group>
            <Row>
              <Select
                mode="multiple"
                placeholder="Chọn sản phẩm"
                size="small"
                value={config.product_id}
                onChange={(e) => setConfig({ ...config, product_id: e })}
                style={{ display: `${config.all_product === false ? 'block' : 'none'}`, width: '50%', marginTop: 10 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {dataProduct.map((e) => (
                  <Select.Option value={e.product_id}>{e.name}</Select.Option>
                ))}
              </Select>
            </Row>
          </Row>

          <Row className={styles['point-bottom-right-content']}>
            <h4>CHI NHÁNH ÁP DỤNG TÍCH ĐIỂM</h4>
            <Radio.Group className={styles['point-bottom-right-radio']} onChange={e => setConfig({ ...config, all_branch: e.target.value })} value={config.all_branch}>
              <Radio value={true}>Tất cả chi nhánh</Radio>
              <Radio value={false}>Theo từng chi nhánh</Radio>
            </Radio.Group>
            <Row>
              <Select
                mode="multiple"
                placeholder="Chọn chi nhánh"
                size="small"
                value={config.branch_id}
                onChange={(e) => setConfig({ ...config, branch_id: e })}
                style={{ display: `${config.all_branch === false ? 'block' : 'none'}`, width: '50%', marginTop: 10 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {branches.map((e) => (
                  <Select.Option value={e.branch_id}>{e.name}</Select.Option>
                ))}
              </Select>
            </Row>
          </Row>

          {/* <Row className={styles['point-bottom-right-content']}>
            <h4>NGUỒN ĐƠN HÀNG ÁP DỤNG TÍCH ĐIỂM</h4>
            <Radio.Group>
              <Radio>Tất cả các nguồn</Radio>
              <Radio>Theo từng nguồn đơn hàng</Radio>
            </Radio.Group>
          </Row>

          <Row className={styles['point-bottom-right-content']}>
            <h4>DANH SÁCH SẢN PHẨM ÁP DỤNG ĐỔI QUÀ</h4>
            <Radio.Group>
              <Radio>Tất cả các sản phẩm</Radio>
              <Radio>Theo loại sản phẩm</Radio>
            </Radio.Group>
          </Row> */}
        </Col>
      </Row>






      <Row style={{ margin: '1em 0' }}>
        <Col xs={24} lg={8}>
          <Select
            mode="multiple"
            placeholder="Chọn chi nhánh"
            size="large"
            value={config.branch_id}
            onChange={(e) => setConfig({ ...config, branch_id: e })}
            style={{ width: '100%' }}
          >
            {branches.map((e) => (
              <Select.Option value={e.branch_id}>{e.name}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row style={{ margin: '1em 0' }}>
        <Checkbox onChange={(e) => selectAllBranch(e.target.checked)}>
          Áp dụng cho tất cả chi nhánh
        </Checkbox>
      </Row>
      <Row gutter={30} style={{ margin: '1em 0' }}>
        <Col xs={24} lg={12}>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập tích điểm" />
              <Checkbox
                checked={config.accumulate}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    accumulate: e.target.checked,
                  })
                }
              >
                <span style={{ fontWeight: 500, color: 'blue' }}>Áp dụng tính năng tích điểm</span>
              </Checkbox>
              <div>
                <b>Cơ chế tích điểm</b>
              </div>
              <Checkbox checked={config.accumulate}>Tích điểm cho toàn bộ sản phẩm</Checkbox>
              <div>
                <b>Hình thức tích điểm</b>
              </div>
              <Radio.Group>
                <Radio>Tích điểm cố định</Radio>
              </Radio.Group>
              <div>
                <b>Tỷ lệ quy đổi điểm</b>
              </div>
              <div>
                <InputNumber
                  value={config.accumulate_price}
                  onChange={(e) => setConfig({ ...config, accumulate_price: e })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />{' '}
                = 1 điểm
              </div>
            </Space>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập đổi điểm" />
              <Checkbox
                checked={config.use}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    use: e.target.checked,
                  })
                }
              >
                <span style={{ fontWeight: 500, color: 'blue' }}>Áp dụng tính năng đổi điểm</span>
              </Checkbox>
              <div>
                <b>Thanh toán</b>
              </div>
              <div>Tỷ lệ quy đổi điểm ra tiền</div>
              <div>
                1 điểm ={' '}
                <InputNumber
                  value={config.use_price}
                  onChange={(e) => setConfig({ ...config, use_price: e })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}
