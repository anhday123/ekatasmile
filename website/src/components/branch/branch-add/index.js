import styles from './../branch-add/branch-add.module.scss'
import React, { useState, useEffect } from 'react'
import { ACTION, ROUTES, regexPhone } from 'consts/index'
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
  Upload,
} from 'antd'

//icons
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'

//apis
import { getAllStore } from 'apis/store'
import { apiProvince } from 'apis/information'
import { addBranch, apiFilterCity } from 'apis/branch'
import { uploadFile } from 'apis/upload'

const { Option } = Select
export default function BranchAdd({ reload }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [form] = Form.useForm()
  const [modal2Visible, setModal2Visible] = useState(false)
  const [store, setStore] = useState([])
  const [loadingStore, setLoadingStore] = useState(false)
  const [province, setProvince] = useState([])

  const [imageBranch, setImageBranch] = useState('')
  const [fileImageBranch, setFileImageBranch] = useState(null)

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

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

  const addBranchData = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await addBranch(body)
      console.log(res)
      if (res.status === 200) {
        await reload()
        openNotification()
        modal2VisibleModal(false)
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

  const onFinish = async () => {
    try {
      const dataForm = form.getFieldsValue()

      if (!regexPhone.test(dataForm.phone)) {
        notification.error({ message: 'Số điện thoại liên hệ không hợp lệ' })
        return
      }

      dispatch({ type: ACTION.LOADING, data: true })

      let urlImageBranch
      if (fileImageBranch) urlImageBranch = await uploadFile(fileImageBranch)

      const body = {
        ...dataForm,
        logo: urlImageBranch || '',
        address: dataForm.address || '',
        latitude: '',
        longtitude: '',
        website: '',
        fax: '',
        email: '',
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
    apiProvinceData()
    getAllStoreData()
    apiFilterCityData()

    if (location.state && location.state === 'show-modal-create-branch')
      modal2VisibleModal(true)
  }, [])

  useEffect(() => {
    //reset
    if (!modal2Visible) {
      form.resetFields()
      setImageBranch('')
      setFileImageBranch(null)
    }
  }, [modal2Visible])

  return (
    <>
      <Button
        size="large"
        icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
        type="primary"
        onClick={() => modal2VisibleModal(true)}
      >
        Thêm chi nhánh & kho
      </Button>
      <Modal
        title="Thêm chi nhánh"
        centered
        width={1000}
        footer={null}
        visible={modal2Visible}
        onCancel={() => modal2VisibleModal(false)}
      >
        Hình ảnh
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          onChange={(info) => {
            if (info.file.status === 'done') info.file.status = 'done'
            setFileImageBranch(info.file.originFileObj)
            getBase64(info.file.originFileObj, (imageUrl) =>
              setImageBranch(imageUrl)
            )
          }}
        >
          {imageBranch ? (
            <img src={imageBranch} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
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
              <Form.Item
                label={
                  <div style={{ color: 'black', fontWeight: '600' }}>
                    Tên chi nhánh
                  </div>
                }
                name="name"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input size="large" placeholder="Nhập tên chi nhánh" />
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
                <Form.Item
                  name="address"
                  // rules={[{ required: true, message: "Giá trị rỗng!" }]}
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
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Liên hệ
                    </div>
                  }
                  name="phone"
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
                  name="province"
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
                    placeholder="Chọn quận huyện"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {districtMain.map((values, index) => {
                      return (
                        <Option value={values.district_name} key={index}>
                          {values.district_name}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row justify="end" style={{ width: '100%' }}>
            <Form.Item>
              <Button size="large" type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
