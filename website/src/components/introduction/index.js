import React, { useEffect, useState } from 'react'

//antd
import {
  Button,
  Modal,
  Row,
  Form,
  Input,
  Select,
  Divider,
  Upload,
  notification,
} from 'antd'

import { useSelector, useDispatch } from 'react-redux'
import { ACTION } from 'consts'

//apis
import { apiDistrict, apiProvince } from 'apis/information'
import { addStore } from 'apis/store'
import { addBranch } from 'apis/branch'
import { uploadFile } from 'utils'
import { updateUser } from 'apis/user'

//icons
import { PlusOutlined } from '@ant-design/icons'

function ModalIntro() {
  const [formBranch] = Form.useForm()
  const [formStore] = Form.useForm()
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])

  const [imageBranch, setImageBranch] = useState('')
  const [fileImageBranch, setFileImageBranch] = useState(null)

  const [imageStore, setImageStore] = useState('')
  const [fileImageStore, setFileImageStore] = useState(null)

  const dataUser = useSelector((state) => state.login.dataUser)
  console.log(dataUser)
  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const getProvinceData = async () => {
    try {
      const res = await apiProvince()
      if (res.status === 200) {
        setProvinces(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDistrictData = async () => {
    try {
      const res = await apiDistrict()
      if (res.status === 200) {
        setDistricts(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onCreate = async () => {
    try {
      let validated = true
      try {
        await formBranch.validateFields()
        await formStore.validateFields()
        validated = true
      } catch (error) {
        validated = false
      }

      if (!validated) return

      const dataStore = formStore.getFieldValue()
      const dataBranch = formBranch.getFieldValue()
      dispatch({ type: ACTION.LOADING, data: true })
      /* upload image */
      // let urlImageBranch
      let urlImageStore
      // if (fileImageBranch) urlImageBranch = await uploadFile(fileImageBranch)
      if (fileImageStore) urlImageStore = await uploadFile(fileImageStore)
      /* upload image */

      const bodyStore = {
        ...dataStore,
        logo: urlImageStore || '',
        email: '',
        fax: '',
        website: '',
        latitude: '',
        ward: '',
        longtitude: '',
        address: '',
      }

      const resStore = await addStore(bodyStore)
      console.log(resStore)
      if (resStore.status === 200) {
        const bodyBranch = {
          ...dataBranch,
          latitude: '',
          longtitude: '',
          address: '',
          store: resStore.data.data.store_id,
        }

        const resBranch = await addBranch(bodyBranch)
        console.log(resBranch)
        if (resBranch.status === 200) {
          notification.success({
            message: 'Chúc mừng bạn đã tạo chi nhánh và cửa hàng thành công',
          })
          setVisibleCreate(false)
          const resUser = await updateUser(
            { is_new: false },
            dataUser.data && dataUser.data.user_id
          )
          console.log(resUser)
        }
      } else
        notification.error({
          message: resStore.data.message || 'Tạo cửa hàng thất bại!',
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  useEffect(() => {
    if (Object.keys(dataUser).length && dataUser.data.is_new) setVisible(true)
  }, [dataUser])

  useEffect(() => {
    getProvinceData()
    getDistrictData()
  }, [])

  return (
    <>
      <Modal
        width={650}
        footer={null}
        title="Thêm chi nhánh và cửa hàng"
        visible={visibleCreate}
        closable={false}
      >
        <Form form={formBranch} layout="vertical">
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
          <Row justify="space-between" align="middle">
            <Form.Item
              name="name"
              label="Tên chi nhánh"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chi nhánh!' },
              ]}
            >
              <Input
                size="large"
                style={{ width: 250 }}
                placeholder="Nhập tên chi nhánh"
              />
            </Form.Item>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: 'Vui lòng nhập tỉnh/thành phố!' },
              ]}
            >
              <Select
                style={{ width: 250 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn tỉnh/thành phố"
              >
                {provinces.map((value, index) => (
                  <Select.Option value={value.province_name} key={index}>
                    {value.province_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-between" align="middle">
            <Form.Item
              name="phone"
              label="Liên hệ"
              rules={[{ required: true, message: 'Vui lòng nhập liên hệ!' }]}
            >
              <Input
                size="large"
                style={{ width: 250 }}
                placeholder="Nhập liên hệ"
              />
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/huyện"
              rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
            >
              <Select
                style={{ width: 250 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn quận/huyện"
              >
                {districts.map((value, index) => (
                  <Select.Option value={value.district_name} key={index}>
                    {value.district_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          {/* <Row justify="space-between" align="middle">
            <Form.Item
              name="label"
              label="Label"
              rules={[{ required: true, message: 'Vui lòng nhập label!' }]}
            >
              <Select
                mode="tags"
                style={{ width: 250 }}
                size="large"
                placeholder="Chọn label"
              ></Select>
            </Form.Item>
          </Row> */}
        </Form>
        <Divider />
        <Form form={formStore} layout="vertical">
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            onChange={(info) => {
              if (info.file.status === 'done') info.file.status = 'done'
              setFileImageStore(info.file.originFileObj)
              getBase64(info.file.originFileObj, (imageUrl) =>
                setImageStore(imageUrl)
              )
            }}
          >
            {imageStore ? (
              <img src={imageStore} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Row justify="space-between" align="middle">
            <Form.Item
              name="name"
              label="Tên cửa hàng"
              rules={[
                { required: true, message: 'Vui lòng nhập tên cửa hàng!' },
              ]}
            >
              <Input
                size="large"
                style={{ width: 250 }}
                placeholder="Nhập tên cửa hàng"
              />
            </Form.Item>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: 'Vui lòng nhập tỉnh/thành phố!' },
              ]}
            >
              <Select
                style={{ width: 250 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn tỉnh/thành phố"
              >
                {provinces.map((value, index) => (
                  <Select.Option value={value.province_name} key={index}>
                    {value.province_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-between" align="middle">
            <Form.Item
              name="phone"
              label="Liên hệ"
              rules={[{ required: true, message: 'Vui lòng nhập liên hệ!' }]}
            >
              <Input
                size="large"
                style={{ width: 250 }}
                placeholder="Nhập liên hệ"
              />
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/huyện"
              rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
            >
              <Select
                style={{ width: 250 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn quận/huyện"
              >
                {districts.map((value, index) => (
                  <Select.Option value={value.district_name} key={index}>
                    {value.district_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
        </Form>
        <Divider />
        <Row justify="end">
          <Button type="primary" size="large" onClick={onCreate}>
            Thêm
          </Button>
        </Row>
      </Modal>
      <Modal
        title={
          <div style={{ fontWeight: 600, fontSize: 19 }}>
            Chào mừng đến với Admin Order
          </div>
        }
        centered
        width={580}
        footer={
          <Row justify="end">
            <Button
              type="primary"
              style={{ width: '7.5rem' }}
              onClick={() => {
                setVisible(false)
                setVisibleCreate(true)
              }}
            >
              Tiếp tục
            </Button>
          </Row>
        }
        visible={visible}
        closable={false}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 300,
              marginRight: 20,
            }}
          >
            <img
              style={{ width: '100%' }}
              src="https://ecomfullfillment.s3.ap-southeast-1.amazonaws.com/1629652136039_ecomfullfillment_0.png"
              alt=""
            />
          </div>
          <div style={{ color: 'black', fontSize: '1.1rem', fontWeight: 400 }}>
            Chào mừng bạn đến với tính năng bán tại cửa hàng. Hãy tạo một chi
            nhánh và một cửa hàng để bắt đầu việc kinh doanh cùng{' '}
            <span style={{ fontWeight: 700 }}>Admin Order</span> nhé!!!
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalIntro
