import {
  Form,
  Button,
  Select,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Input,
  Upload,
  notification,
} from 'antd'
import { useState } from 'react'
import styles from '../add.module.scss'
import { PlusOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { apiAddProduct } from '../../../../../apis/product'
import { ACTION } from '../../../../../consts/index'
import axios from 'axios'
import { useHistory } from 'react-router'
const { Option } = Select
const { Dragger } = Upload
export default function SingleProduct(props) {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const history = useHistory()
  const [guarantee, setGuarantee] = useState(false)
  const [supplierSimple, setSupplierSimple] = useState(
    props.supplier && props.supplier.length > 0
      ? props.supplier[0].supplier_id
      : '1'
  )
  const [list, setList] = useState('')
  const [checkboxValue, setCheckboxValue] = useState(false)
  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    async onChange(info) {
      var { status } = info.file
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          console.log(info.file, info.fileList)
          if (info.fileList && info.fileList.length > 0) {
            var image
            var array = []
            let formData = new FormData()
            info.fileList.forEach((values, index) => {
              image = values.originFileObj
              formData.append('files', image) //append the values with key, value pair
            })

            if (formData) {
              dispatch({ type: ACTION.LOADING, data: true })
              let a = axios
                .post(
                  'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                )
                .then((resp) => resp)
              let resultsMockup = await Promise.all([a])
              console.log(resultsMockup)
              console.log('|||99999999999999999999')
              console.log(resultsMockup[0].data.data[0])
              dispatch({ type: ACTION.LOADING, data: false })
              setList(resultsMockup[0].data.data)
            }
          }
        }
      }
    },
  }
  const onChangeCheckboxGuarantee = (e) => {
    console.log(`checked = ${e.target.checked}`)
    setGuarantee(e.target.checked)
  }

  const openNotificationNumber = (data) => {
    notification.error({
      message: 'Thất bại',
      description: `${data} phải là số.`,
    })
  }

  const [warehouse, setWarehouse] = useState(
    props.warehouse && props.warehouse.length > 0
      ? props.warehouse[0].warehouse_id
      : '1'
  )
  const onChangeWarehousse = (e) => {
    setWarehouse(e)
  }
  const [category, setCategory] = useState(
    props.category && props.category.length > 0
      ? props.category[0].category_id
      : '1'
  )
  const onChangeCategory = (e) => {
    setCategory(e)
  }
  const onChangeSupplierSimple = (e) => {
    setSupplierSimple(e)
  }
  const openNotificationForgetImage = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Bạn chưa chọn ảnh.',
    })
  }
  const openNotificationForgetImageError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tên sản phẩm hoặc sku đã tồn tại.',
    })
  }
  const apiAddProductData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      // console.log(value);
      const res = await apiAddProduct(object)
      console.log(res)
      if (res.status === 200) {
        openNotification()
        history.push('/product/6')
      } else {
        openNotificationForgetImageError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const openNotificationSimple = (data) => {
    notification.warning({
      message: 'Nhắc nhở',
      description: 'Tất cả số lượng, giá nhập đều phải lớn hơn 0.',
    })
  }
  const openNotificationSimpleWarehouse = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description: 'Bạn chưa chọn kho.',
    })
  }
  const openNotificationSimpleSupplier = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description: 'Bạn chưa chọn nhà cung cấp.',
    })
  }
  const openNotificationSimpleCategory = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description: 'Bạn chưa chọn loại sản phẩm.',
    })
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm mới sản phẩm thành công.',
    })
  }

  const onFinish = async (values) => {
    console.log('Success:', values)
    if (
      values.size1 === '' &&
      values.size2 === '' &&
      values.size3 === '' &&
      values.size4 === '' &&
      values.unit === ''
    ) {
      if (list.length > 0 && list) {
        if (
          isNaN(values.priceWholeSale) ||
          category === '' ||
          supplierSimple === '' ||
          warehouse === '' ||
          isNaN(values.priceRetail) ||
          isNaN(values.provideQuantity)
        ) {
          if (category === '') {
            openNotificationSimpleCategory()
          }
          if (supplierSimple === '') {
            openNotificationSimpleSupplier()
          }
          if (warehouse === '') {
            openNotificationSimpleWarehouse()
          }
          if (isNaN(values.provideQuantity)) {
            openNotificationNumber('Số lượng cung cấp')
          }

          if (isNaN(values.priceRetail)) {
            openNotificationNumber('Giá bán')
          }
          if (isNaN(values.priceWholeSale)) {
            openNotificationNumber('Giá cơ bản')
          }
        } else {
          var count1 = 0
          if (count1 > 0) {
            openNotificationSimple()
          }
          if (count1 === 0) {
            const object = {
              product_list: [
                {
                  sku: values.sku.toLowerCase(),
                  name: values.productName.toLowerCase(),
                  barcode: values && values.barCode ? values.barCode : '',
                  category: category,
                  image: list,
                  length: values && values.size1 ? parseInt(values.size1) : 0,
                  width: values && values.size2 ? parseInt(values.size2) : 0,
                  height: values && values.size3 ? parseInt(values.size3) : 0,
                  weight: values && values.size4 ? parseInt(values.size4) : 0,
                  warehouse: warehouse,
                  warranty:
                    values && values.policy && values.policy.length > 0
                      ? values.policy
                      : [],
                  quantity: parseInt(values.provideQuantity),
                  unit: values && values.unit ? values.unit : 0,
                  has_variable: false,
                  suppliers: supplierSimple,

                  import_price: parseInt(values.priceImport),
                  sale_price: parseInt(values.priceRetail),
                  base_price: parseInt(values.priceWholeSale),
                },
              ],
            }
            console.log(object)
            console.log('--------------------------999')
            apiAddProductData(object)
          }
        }
      } else {
        openNotificationForgetImage()
      }
    } else {
      if (list.length > 0 && list) {
        if (
          isNaN(values.priceWholeSale) ||
          category === '' ||
          supplierSimple === '' ||
          warehouse === '' ||
          (values.size3 && isNaN(values.size3)) ||
          (values.size4 && isNaN(values.size4)) ||
          (values.size1 && isNaN(values.size1)) ||
          (values.size2 && isNaN(values.size2)) ||
          isNaN(values.priceRetail) ||
          isNaN(values.provideQuantity)
        ) {
          if (values.size1 && isNaN(values.size1)) {
            openNotificationNumber('Chiều dài')
          }
          if (supplierSimple === '') {
            openNotificationSimpleSupplier()
          }
          if (category === '') {
            openNotificationSimpleCategory()
          }
          if (warehouse === '') {
            openNotificationSimpleWarehouse()
          }
          if (values.size2 && isNaN(values.size2)) {
            openNotificationNumber('Chiều rộng')
          }
          if (values.size3 && isNaN(values.size3)) {
            openNotificationNumber('Chiều cao')
          }
          if (values.size4 && isNaN(values.size4)) {
            openNotificationNumber('Cân nặng')
          }
          if (isNaN(values.provideQuantity)) {
            openNotificationNumber('Số lượng cung cấp')
          }
          if (isNaN(values.priceRetail)) {
            openNotificationNumber('Giá bán')
          }
          if (isNaN(values.priceWholeSale)) {
            openNotificationNumber('Giá cơ bản')
          }
        } else {
          var count1 = 0
          if (count1 > 0) {
            openNotificationSimple()
          }
          if (count1 === 0) {
            const object = {
              product_list: [
                {
                  sku: values.sku.toLowerCase(),
                  name: values.productName.toLowerCase(),
                  barcode: values && values.barCode ? values.barCode : '',
                  category: category,
                  image: list,
                  warehouse: warehouse,
                  length: values && values.size1 ? parseInt(values.size1) : 0,
                  width: values && values.size2 ? parseInt(values.size2) : 0,
                  height: values && values.size3 ? parseInt(values.size3) : 0,
                  weight: values && values.size4 ? parseInt(values.size4) : 0,
                  warranty:
                    values && values.policy && values.policy.length > 0
                      ? values.policy
                      : [],
                  quantity: parseInt(values.provideQuantity),
                  unit: values && values.unit ? values.unit : '',

                  has_variable: false,
                  suppliers: supplierSimple,

                  import_price: parseInt(values.priceImport),
                  sale_price: parseInt(values.priceRetail),
                  base_price: parseInt(values.priceWholeSale),
                },
              ],
            }

            apiAddProductData(object)
          }
        }
      } else {
        openNotificationForgetImage()
      }
    }
  }

  function onChangeCheckbox(e) {
    setCheckboxValue(e.target.checked)
  }

  return (
    <div>
      <Form
        onFinish={onFinish}
        layout="vertical"
        form={form}
        className={styles['product_manager_content']}
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
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>
                  Tên sản phẩm
                </div>
              }
              name="productName"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input size="large" placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>
                  Giá cơ bản
                </div>
              }
              // label="Username"
              name="priceWholeSale"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                className="br-15__input"
                size="large"
                style={{ width: '100%' }}
                placeholder="Nhập giá cơ bản"
                // defaultValue={1000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>Giá bán</div>
              }
              // label="Username"
              name="priceRetail"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                className="br-15__input"
                size="large"
                style={{ width: '100%' }}
                placeholder="Nhập giá bán"
                // defaultValue={1000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>
                  Giá nhập
                </div>
              }
              // label="Username"
              name="priceImport"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                className="br-15__input"
                size="large"
                style={{ width: '100%' }}
                placeholder="Giá nhập"
                // defaultValue={1000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            marginBottom: '1.25rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Checkbox onChange={onChangeCheckbox}>
            Thông số sản phẩm (không bắt buộc)
          </Checkbox>
        </div>
        {checkboxValue ? (
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
              sm={11}
              md={11}
              lg={11}
              xl={5}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="size1"
                >
                  <Input size="large" placeholder="Chiều dài (cm)" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={11}
              md={11}
              lg={11}
              xl={5}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="size2"
                >
                  <Input placeholder="Chiều rộng (cm)" size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={11}
              md={11}
              lg={11}
              xl={5}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="size3"
                >
                  <Input placeholder="Chiều cao (cm)" size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={11}
              md={11}
              lg={11}
              xl={5}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="size4"
                >
                  <Input placeholder="Cân nặng (kg)" size="large" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        ) : (
          ''
        )}

        <div className={styles['product_manager_content_image']}>
          <div className={styles['product_manager_content_image_child_title']}>
            <b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>
            Ảnh sản phẩm
          </div>
          <div className={styles['product_manager_content_image_child']}>
            <Dragger
              style={{ width: '10rem', marginBottom: '1.25rem' }}
              {...propsMain}
            >
              {list ? (
                <p
                  style={{ marginTop: '1.25rem' }}
                  className="ant-upload-drag-icon"
                >
                  <img
                    src={list[list.length - 1]}
                    style={{
                      width: '7.5rem',
                      height: '5rem',
                      objectFit: 'contain',
                    }}
                    alt=""
                  />
                </p>
              ) : (
                <p
                  style={{ marginTop: '1.25rem', width: '10rem' }}
                  className="ant-upload-drag-icon"
                >
                  <PlusOutlined />

                  <div>Thêm ảnh</div>
                </p>
              )}
            </Dragger>
            <div
              style={{
                display: 'flex',
                maxWidth: '100%',
                overflow: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {list &&
                list.length > 0 &&
                list.map((values, index) => {
                  return (
                    <Col
                      style={{
                        width: '100%',
                        marginRight: '1rem',
                        margin: '0.5rem 0 1rem 0',
                      }}
                      xs={24}
                      sm={11}
                      md={5}
                      lg={5}
                      xl={3}
                    >
                      <img
                        src={values}
                        style={{
                          width: '5rem',
                          height: '5rem',
                          objectFit: 'contain',
                        }}
                        alt=""
                      />
                    </Col>
                  )
                })}
            </div>
          </div>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
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
                Mã barcode
              </div>
              <Form.Item
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
                // label="Username"
                name="barCode"
              >
                <Input size="large" placeholder="Nhập mã barcode" />
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
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>SKU</div>
              }
              // label="Username"
              name="sku"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input placeholder="Nhập sku" size="large" />
            </Form.Item>
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
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>
                  Số lượng cung cấp
                </div>
              }
              // label="Username"
              name="provideQuantity"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input placeholder="Nhập số lượng cung cấp" size="large" />
            </Form.Item>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
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
                Đơn vị
              </div>
              <Form.Item
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
                // label="Username"
                name="unit"
              >
                <Input placeholder="Nhập đơn vị" size="large" />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            color: 'black',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          Phân loại
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
            style={{ width: '100%', marginBottom: '1.5rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              <b style={{ color: 'red' }}>*</b>Loại sản phẩm
            </div>
            <Select
              size="large"
              value={category}
              onChange={onChangeCategory}
              style={{ width: '100%' }}
              placeholder="Chọn loại sản phẩm"
            >
              {props.category &&
                props.category.length > 0 &&
                props.category.map((values, index) => {
                  return (
                    <Option value={values.category_id}>{values.name}</Option>
                  )
                })}
            </Select>
          </Col>
          <Col
            style={{ width: '100%', marginBottom: '1.5rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              <b style={{ color: 'red' }}>*</b>Nhà cung cấp
            </div>
            <Select
              size="large"
              onChange={onChangeSupplierSimple}
              style={{ width: '100%' }}
              value={supplierSimple}
              placeholder="Chọn nhà cung cấp"
            >
              {props.supplier &&
                props.supplier.length > 0 &&
                props.supplier.map((values, index) => {
                  return (
                    <Option value={values.supplier_id}>{values.name}</Option>
                  )
                })}
            </Select>
          </Col>
          <Col
            style={{ width: '100%', marginBottom: '1.5rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              <b style={{ color: 'red' }}>*</b>Chọn kho
            </div>
            <Select
              size="large"
              value={warehouse}
              onChange={onChangeWarehousse}
              style={{ width: '100%' }}
              placeholder="Chọn kho"
            >
              {props.warehouse &&
                props.warehouse.length > 0 &&
                props.warehouse.map((values, index) => {
                  return (
                    <Option value={values.warehouse_id}>{values.name}</Option>
                  )
                })}
            </Select>
            {/* </Form.Item> */}
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            margin: '0.5rem 0 1.25rem 0',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Checkbox onChange={onChangeCheckboxGuarantee}>
            Thêm chính sách bảo hành (không bắt buộc)
          </Checkbox>
        </div>
        {guarantee ? (
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
              <div style={{ color: 'black', fontWeight: '600' }}></div>
              <Form.Item name="policy">
                <Select
                  size="large"
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn chính sách bảo hành"
                >
                  {props.warranty &&
                    props.warranty.length > 0 &&
                    props.warranty.map((values) => (
                      <Option value={values.warranty_id}>{values.name}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        ) : (
          ''
        )}
        <div
          className={
            styles['product_manager_content_product_code_product_type_button']
          }
        >
          <Form.Item>
            <Button
              style={{ width: '7.5rem' }}
              htmlType="submit"
              type="primary"
            >
              Thêm
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
