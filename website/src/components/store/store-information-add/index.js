import React, { useState, useEffect } from 'react'
import styles from './../store-information-update/store-information-update.module.scss'

import {
  Input,
  Button,
  Row,
  Col,
  notification,
  Select,
  Modal,
  Form,
  Upload,
} from 'antd'

import { useLocation, useHistory } from 'react-router-dom'
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ACTION } from 'consts/index'
import { useDispatch, useSelector } from 'react-redux'

//apis
import { apiProvince } from 'apis/information'
import { apiFilterCity } from 'apis/branch'
import { addStore, getAllStore } from 'apis/store'
import { uploadImgs } from 'apis/upload'
import { updateUser } from 'apis/user'
import { uploadFile } from 'utils'

const { Option } = Select
const { Dragger } = Upload
export default function StoreInformationAdd({ reloadData }) {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const dataUser = useSelector((state) => state.login.dataUser)
  console.log('data user', dataUser)

  const [modal3Visible, setModal3Visible] = useState(false)
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const [imageStorePreview, setImageStorePreview] = useState('')
  const [imageStore, setImageStore] = useState('')

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  function isValidURL(string) {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    )
    return res !== null
  }

  const openNotificationSuccessStore = () => {
    notification.success({
      message: 'Thành công',
      duration: 5,
      description: 'Thêm thông tin cửa hàng thành công.',
    })
  }

  const openNotificationForgetImageError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tên cửa hàng đã tồn tại.',
    })
  }

  const addStoreData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      console.log(object)
      const res = await addStore(object)
      console.log(res)
      if (res.status === 200) {
        await reloadData() //reload data khi tao store thanh cong

        openNotificationSuccessStore()
        modal3VisibleModal(false)

        setImageStorePreview('')
        setImageStore('')
        form.resetFields()
      } else {
        openNotificationForgetImageError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    async onChange(info) {
      var { status } = info.file
      setImageStore(info.file.originFileObj)
      getBase64(info.file.originFileObj, (imageUrl) =>
        setImageStorePreview(imageUrl)
      )

      if (status !== 'done') {
        status = 'done'
      }
    },
  }

  const onFinish = async (values) => {
    try {
      const regexp = new RegExp(regex)

      //check validated phone
      if (!regexp.test(values.phoneNumber)) {
        notification.error({ message: 'Số điện thoại không đúng định dạng' })
        return
      }

      //check validated website
      if (values.websiteLink && !isValidURL(values.websiteLink)) {
        notification.error({ message: 'Link website không đúng định dạng' })
        return
      }

      dispatch({ type: ACTION.LOADING, data: true })

      let imgStore = ''
      if (imageStore) {
        imgStore = await uploadFile(imageStore)
      }

      const body = {
        name: values.storeName,
        logo: imgStore,
        phone: values.phoneNumber,
        email: '',
        fax: values.fax || '',
        website: values.websiteLink ? values.websiteLink : '',
        latitude: '',
        longtitude: '',
        address: values.address ? values.address : '',
        district: values.district,
        province: values.city,
      }
      dispatch({ type: ACTION.LOADING, data: false })

      addStoreData(body)
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
    } catch (error) {
      console.log(error)
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
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function handleChangeCity(value) {
    apiFilterCityData(value)
  }

  useEffect(() => {
    if (!modal3Visible) {
      form.resetFields()
      setImageStorePreview('')
      setImageStore('')
    }
  }, [modal3Visible])

  useEffect(() => {
    apiProvinceData()
  }, [])

  const dataValue = form.getFieldValue()
  dataValue.district =
    districtMain && districtMain.length > 0
      ? districtMain[districtMain.length - 2].district_name
      : ''
  return (
    <>
      <Button
        size="large"
        icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
        type="primary"
        onClick={() => modal3VisibleModal(true)}
      >
        Thêm cửa hàng
      </Button>
      <Modal
        title="Thêm cửa hàng"
        centered
        width={1000}
        footer={null}
        visible={modal3Visible}
        onCancel={() => modal3VisibleModal(false)}
      >
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          form={form}
          layout="vertical"
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
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={5}
              md={5}
              lg={5}
              xl={5}
            >
              <Dragger {...propsMain}>
                {imageStorePreview ? (
                  <p
                    style={{ marginTop: '1.25rem' }}
                    className="ant-upload-drag-icon"
                  >
                    <img
                      src={imageStorePreview}
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
                    Tên cửa hàng
                  </div>
                }
                name="storeName"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input size="large" placeholder="Nhập tên cửa hàng" />
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
                <Form.Item name="address">
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
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Số fax
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="fax"
                >
                  <Input placeholder="Nhập số fax" size="large" />
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
                  Link website
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="websiteLink"
                >
                  <Input size="large" placeholder="Nhập link website" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{
                width: '100%',
                marginLeft: '1rem',
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
                  Thêm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
