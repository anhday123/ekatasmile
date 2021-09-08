import styles from './../add/add.module.scss'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'
import {
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  Upload,
  notification,
} from 'antd'

import { Link, useHistory } from 'react-router-dom'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'

//apis
import { apiProvince } from 'apis/information'
import { apiFilterCity } from 'apis/branch'
import { apiCreateShipping } from 'apis/shipping'
import axios from 'axios'
import { uploadFile } from 'apis/upload'

const { Option } = Select
const { Dragger } = Upload
export default function ShippingAdd(props) {
  const dispatch = useDispatch()
  let history = useHistory()
  const [form] = Form.useForm()
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm thông tin đối tác thành công.',
    })
  }
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên đối tác đã tồn tại.',
    })
  }
  const apiCreateShippingData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiCreateShipping(object)
      console.log(res)
      if (res.status === 200) {
        openNotification()
        props.close()
        props.reload()
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Liên hệ phải là số và có độ dài là 10',
    })
  }
  const openNotificationZipcode = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Zip code phải là số',
    })
  }
  const openNotificationZipcodeImage = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Bạn chưa chọn ảnh.',
    })
  }

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  useEffect(() => {
    apiProvinceData()
  }, [])

  const [list, setList] = useState('')
  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    maxCount: 1,
    async onChange(info) {
      var { status } = info.file
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          if (info.fileList && info.fileList.length > 0) {
            const image = info.file.originFileObj
            // let formData = new FormData() //formdata object
            // formData.append('files', image) //append the values with key, value pair
            dispatch({ type: ACTION.LOADING, data: true })
            let a = await uploadFile(image)
            dispatch({ type: ACTION.LOADING, data: false })

            setList(a)
          }
        }
      }
    },
    onDrop(e) {},
  }
  const onFinish = async (values) => {
    if (list !== '') {
      if (values.zipCode) {
        if (isNaN(values.phoneNumber) || isNaN(values.zipCode)) {
          if (isNaN(values.phoneNumber)) {
            openNotificationRegisterFailMailPhone()
          }
          if (isNaN(values.zipCode)) {
            openNotificationZipcode()
          }
        } else {
          if (regex.test(values.phoneNumber)) {
            const object = {
              name: values.customerName,
              image: list,
              phone: values.phoneNumber,
              zipcode: values && values.zipCode,
              address: values && values.address ? values.address : '',
              ward: '',
              district: values.district,
              province: values.city,
            }
            apiCreateShippingData(object)
          } else {
            openNotificationRegisterFailMailPhone()
          }
        }
      } else {
        if (isNaN(values.phoneNumber)) {
          if (isNaN(values.phoneNumber)) {
            openNotificationRegisterFailMailPhone()
          }
        } else {
          if (regex.test(values.phoneNumber)) {
            const object = {
              name: values.customerName,
              image: list,
              phone: values.phoneNumber,
              zipcode: '',
              address: values && values.address ? values.address : '',
              ward: '',
              district: values.district,
              province: values.city,
            }
            apiCreateShippingData(object)
          } else {
            openNotificationRegisterFailMailPhone()
          }
        }
      }
    } else {
      openNotificationZipcodeImage()
    }
  }
  const [districtMain, setDistrictMain] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiFilterCity({ keyword: object })
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function handleChangeCity(value) {
    apiFilterCityData(value)
  }
  const dataValue = form.getFieldValue()
  dataValue.district =
    districtMain && districtMain.length > 0
      ? districtMain[districtMain.length - 2].district_name
      : ''
  return (
    <>
      <div className={styles['supplier_add']}>
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          form={form}
          layout="vertical"
        >
          <Row
            style={{
              display: 'flex',
              marginBottom: '1rem',
              marginTop: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col style={{ width: '100%' }} xs={24} sm={5} md={5} lg={5} xl={5}>
              <div style={{ width: '10rem' }}>
                <Dragger {...propsMain}>
                  {list ? (
                    <p
                      style={{ marginTop: '1.25rem' }}
                      className="ant-upload-drag-icon"
                    >
                      <img
                        src={list}
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
                      style={{ marginTop: '1.25rem' }}
                      className="ant-upload-drag-icon"
                    >
                      <PlusOutlined />

                      <div>Thêm ảnh</div>
                    </p>
                  )}
                </Dragger>
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
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tên đối tác
                    </div>
                  }
                  name="customerName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập tên đối tác" />
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
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Địa chỉ
                    </div>
                  }
                  name="address"
                >
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
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Zip code
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="zipCode"
                >
                  <Input placeholder="Nhập zip code" size="large" />
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
                <Form.Item
                  name="city"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tỉnh/thành phố
                    </div>
                  }
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    size="large"
                    onChange={handleChangeCity}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn tỉnh/thành phố"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {province &&
                      province.length > 0 &&
                      province.map((values, index) => {
                        return (
                          <Option value={values.province_name}>
                            {values.province_name}
                          </Option>
                        )
                      })}
                  </Select>
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
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Liên hệ
                    </div>
                  }
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập liên hệ" size="large" />
                </Form.Item>
              </div>
            </Col>
            {districtMain && districtMain.length > 0 ? (
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
                    name="district"
                    label={
                      <div style={{ color: 'black', fontWeight: '600' }}>
                        Quận/huyện
                      </div>
                    }
                    hasFeedback
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
                      {districtMain &&
                        districtMain.length > 0 &&
                        districtMain.map((values, index) => {
                          return (
                            <Option value={values.district_name}>
                              {values.district_name}
                            </Option>
                          )
                        })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            ) : (
              ''
            )}
          </Row>
          <Row className={styles['supplier_add_content_supplier_button']}>
            <Col
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              xs={24}
              sm={24}
              md={5}
              lg={4}
              xl={3}
            >
              <Form.Item>
                <Button size="large" type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
