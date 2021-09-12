import React, { useState, useEffect } from 'react'
import styles from './../add/add.module.scss'
import { ACTION } from 'consts'
import { useDispatch } from 'react-redux'

//antd
import {
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  notification,
  Checkbox,
} from 'antd'

//apis
import { apiAddSupplier } from 'apis/supplier'
import { apiDistrict, apiProvince } from 'apis/information'

const { Option } = Select
export default function SupplierAdd(props) {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gmail phải ở dạng @gmail.com',
    })
  }
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: `${data} phải là số và có độ dài là 10`,
    })
  }
  function validateEmail(email) {
    const re =
      /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
    return re.test(String(email).toLowerCase())
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onFinish = (values) => {
    if (validateEmail(values.email)) {
      if (isNaN(values.phoneNumber)) {
        openNotificationRegisterFailMailRegex('Liên hệ')
      } else {
        if (regex.test(values.phoneNumber)) {
          const body = {
            default: values.default || false,
            name: values.supplierName.toLowerCase(),
            phone: values.phoneNumber,
            email: values.email,
            address:
              values && values.supplierAddress
                ? values.supplierAddress.toLowerCase()
                : '',
            district: values.district.toLowerCase(),
            province: values.city.toLowerCase(),
          }
          console.log(body)
          apiAddSupplierData(body)
        } else {
          openNotificationRegisterFailMailRegex('Liên hệ')
        }
      }
    } else {
      openNotificationRegisterFailMail()
    }
  }

  const apiAddSupplierData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAddSupplier(object)
      console.log(res)
      if (res.status === 200) {
        openNotification()
        props.reload()
        props.close()
        form.resetFields()
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm nhà cung cấp thành công.',
    })
  }
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên nhà cung cấp đã tồn tại.',
    })
  }

  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      if (res.status === 200) {
        setProvince(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    apiProvinceData()
    apiGetDistricts()
  }, [])

  const [districtMain, setDistrictMain] = useState([])
  const [districtsDefault, setDistrictsDefault] = useState([])
  const apiGetDistricts = async () => {
    try {
      const res = await apiDistrict()
      if (res.status === 200) {
        setDistrictMain(res.data.data)
        setDistrictsDefault(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={styles['supplier_add']}>
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          layout="vertical"
          form={form}
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
              <div>
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tên nhà cung cấp
                    </div>
                  }
                  name="supplierName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập tên nhà cung cấp" />
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
              <div>
                <div
                  style={{
                    color: 'black',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  Địa chỉ
                </div>
                <Form.Item name="supplierAddress">
                  <Input placeholder="Nhập địa chỉ" size="large" />
                </Form.Item>
              </div>
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
              <div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phoneNumber"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Liên hệ
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập liên hệ" size="large" />
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
                name="city"
                label={
                  <div style={{ color: 'black', fontWeight: '600' }}>
                    Tỉnh/thành phố
                  </div>
                }
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn tỉnh/thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => {
                    if (value) {
                      const districtsNew = districtsDefault.filter(
                        (e) => e.province_name === value
                      )
                      if (districtsNew) setDistrictMain([...districtsNew])
                    } else setDistrictMain([...districtsDefault])
                  }}
                >
                  {province.map((values, index) => {
                    return (
                      <Option value={values.province_name}>
                        {values.province_name}
                      </Option>
                    )
                  })}
                </Select>
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
                name="email"
                label={
                  <div style={{ color: 'black', fontWeight: '600' }}>Email</div>
                }
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập email" size="large" />
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
                name="district"
                label={
                  <div style={{ color: 'black', fontWeight: '600' }}>
                    Quận/huyện
                  </div>
                }
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {districtMain.map((values, index) => {
                    return (
                      <Option value={values.district_name}>
                        {values.district_name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="space-between" align="middle" style={{ width: '100%' }}>
            <Form.Item name="default" valuePropName="checked">
              <Checkbox>Chọn làm mặc định</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button size="large" type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </>
  )
}
