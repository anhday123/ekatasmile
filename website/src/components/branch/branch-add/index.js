import styles from './../branch-add/branch-add.module.scss'
import React, { useState, useEffect } from 'react'
import { ACTION } from 'consts/index'
import { useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Input,
  Button,
  Row,
  Col,
  notification,
  Select,
  Modal,
  Form,
  Spin,
} from 'antd'

import { PlusCircleOutlined } from '@ant-design/icons'

//apis
import { getAllStore } from 'apis/store'
import { apiProvince } from 'apis/information'
import { addBranch, apiFilterCity } from 'apis/branch'

let checkUserNewCreateBranch = false //check user moi da tao branch ?
const { Option } = Select
export default function BranchAdd() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [form] = Form.useForm()
  const [modal2Visible, setModal2Visible] = useState(false)
  const [store, setStore] = useState([])
  const [loadingStore, setLoadingStore] = useState(false)
  const [province, setProvince] = useState([])

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thêm chi nhánh thành công.',
    })
  }
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 6,
      description: 'Tên chi nhánh đã tồn tại.',
    })
  }
  const openNotificationErrorStore = () => {
    notification.error({
      message: 'Thất bại',
      duration: 6,
      description: 'Cửa hàng đã bị vô hiệu hóa, không thể thêm chi nhánh.',
    })
  }

  const addBranchData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await addBranch(object)
      console.log(res)
      if (res.status === 200) {
        openNotification()

        modal2VisibleModal(false)
        form.resetFields()

        if (location.state && !location.state.isHaveBranch) history.goBack()
      } else {
        if (res.data.message === 'Branch name was exists!') {
          openNotificationError()
        } else {
          openNotificationErrorStore()
        }
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const onFinish = (values) => {
    try {
      const regexp = new RegExp(regex)

      //check validated phone
      if (!regexp.test(values.phoneNumber)) {
        notification.error({ message: 'Số điện thoại không đúng định dạng' })
        return
      }

      dispatch({ type: ACTION.LOADING, data: true })
      const body = {
        address: values && values.address ? values.address.toLowerCase() : '',
        district: values.district.toLowerCase(),
        name: values.branchName.toLowerCase(),
        phone: values.phoneNumber,
        latitude: ' ',
        longtitude: ' ',
        ward: values.city.toLowerCase(),
        province: ' ',
        store: values.store,
      }
      dispatch({ type: ACTION.LOADING, data: false })

      addBranchData(body)
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  const getAllStoreData = async () => {
    try {
      setLoadingStore(true)
      const res = await getAllStore()
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)
        if (res.data.data.length)
          form.setFieldsValue({
            store: res.data.data[0].store_id,
          })
      }
      setLoadingStore(false)
    } catch (error) {
      setLoadingStore(false)
    }
  }

  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
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
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  function handleChangeCity(value) {
    apiFilterCityData(value)
  }

  useEffect(() => {
    if (location.state && !location.state.isHaveBranch) modal2VisibleModal(true)

    apiProvinceData()
    getAllStoreData()
  }, [])

  return (
    <>
      <Button
        icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
        type="primary"
        onClick={() => modal2VisibleModal(true)}
      >
        Thêm chi nhánh
      </Button>
      <Modal
        title="Thêm chi nhánh"
        centered
        width={1000}
        footer={null}
        visible={modal2Visible}
        onCancel={() => {
          if (location.state && !location.state.isHaveBranch) {
            dispatch({ type: 'SHOW_MODAL_NOTI_CREATE_BRANCH', data: true })
            history.goBack()
          }

          modal2VisibleModal(false)
        }}
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
                      Tên chi nhánh
                    </div>
                  }
                  name="branchName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tên chi nhánh" />
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
                <Form.Item
                  name="address"
                  // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập địa chỉ" />
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
                  <Input placeholder="Nhập liên hệ" />
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
                  name="store"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Cửa hàng
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Chọn cửa hàng"
                    notFoundContent={loadingStore ? <Spin /> : null}
                  >
                    {store.map((values, index) => {
                      return (
                        <Option value={values.store_id}>{values.name}</Option>
                      )
                    })}
                  </Select>
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
                  name="label"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Label
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    mode="tags"
                    placeholder="Please select"
                    // onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    {/* {children} */}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ width: '100%' }}>
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
                <Button
                  style={{ width: '7.5rem' }}
                  type="primary"
                  htmlType="submit"
                >
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
