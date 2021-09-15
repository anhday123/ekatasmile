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
  Divider,
} from 'antd'

import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ACTION, regexPhone } from 'consts/index'
import { useDispatch, useSelector } from 'react-redux'

//apis
import { apiProvince } from 'apis/information'
import { apiFilterCity, getAllBranch } from 'apis/branch'
import { addStore, getAllStore } from 'apis/store'
import { uploadFile } from 'apis/upload'
import { getAllLabel, addLabel } from 'apis/label'

const { Option } = Select
const { Dragger } = Upload
export default function StoreInformationAdd({ reloadData }) {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const branchId = useSelector((state) => state.branch.branchId)

  const [branchList, setBranchList] = useState([])
  const [imageStore, setImageStore] = useState('')
  const [fileImageStore, setFileImageStore] = useState(null)
  const [inputLabel, setInputLabel] = useState('')
  const [labels, setLabels] = useState([])

  const [modal3Visible, setModal3Visible] = useState(false)
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
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

  const addStoreData = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      console.log(body)
      const res = await addStore(body)
      if (res.status === 200) {
        await reloadData() //reload data khi tao store thanh cong

        openNotificationSuccessStore()
        modal3VisibleModal(false)

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

  const onFinish = async () => {
    //validated form
    let isValidated = true
    try {
      await form.validateFields()
      isValidated = true
    } catch (error) {
      isValidated = false
    }

    if (!isValidated) return

    try {
      const formData = form.getFieldsValue()

      //check validated phone
      if (!regexPhone.test(formData.phone)) {
        notification.error({ message: 'Số điện thoại không đúng định dạng' })
        return
      }

      dispatch({ type: ACTION.LOADING, data: true })

      let imgStore = ''
      if (fileImageStore) imgStore = await uploadFile(fileImageStore)

      const body = {
        ...formData,
        logo: imgStore,
        latitude: '',
        longtitude: '',
        address: formData.address || '',
        label_id: formData.label || '',
      }
      dispatch({ type: ACTION.LOADING, data: false })

      addStoreData(body)
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  const _addLabel = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const body = {
        name: inputLabel,
        description: '',
      }
      const res = await addLabel(body)
      console.log(res)
      if (res.status === 200) {
        let arrayLabelNew = [...labels]
        arrayLabelNew.push(res.data.data)
        setLabels([...arrayLabelNew])
        setInputLabel('')
        notification.success({ message: 'Tạo thành công label!' })
      }

      if (res.status === 400) {
        setInputLabel('')
        notification.error({ message: 'Label đã tồn tại!' })
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const [provinces, setProvinces] = useState([])
  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvinces(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [districtMain, setDistrictMain] = useState([])
  const [districtsDefault, setDistrictsDefault] = useState([])
  const apiFilterCityData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiFilterCity()
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
        setDistrictsDefault(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const getLabel = async () => {
    try {
      const res = await getAllLabel()
      if (res.data.success) {
        setLabels(res.data.data.filter((e) => e.active))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.data.success) {
        setBranchList(res.data.data.filter((e) => e.active))
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!modal3Visible) {
      form.resetFields()
      setImageStore('')
      setFileImageStore(null)
    } else {
      form.setFieldsValue({ branch_id: branchId })
    }
  }, [modal3Visible])

  useEffect(() => {
    apiProvinceData()
    apiFilterCityData()
  }, [])

  useEffect(() => {
    getBranch()
    getLabel()
  }, [])

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
        width={850}
        footer={null}
        visible={modal3Visible}
        onCancel={() => modal3VisibleModal(false)}
      >
        <Form form={form} layout="vertical">
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
                style={{ width: 350 }}
                placeholder="Nhập tên cửa hàng"
              />
            </Form.Item>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: 'Vui lòng chọn tỉnh/thành phố!' },
              ]}
            >
              <Select
                style={{ width: 350 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn tỉnh/thành phố"
                onChange={(value) => {
                  if (value) {
                    const districtsNew = districtsDefault.filter(
                      (e) => e.province_name === value
                    )
                    setDistrictMain([...districtsNew])
                  } else setDistrictMain([...districtsDefault])
                }}
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
                style={{ width: 350 }}
                placeholder="Nhập liên hệ"
              />
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/huyện"
              rules={[{ required: true, message: 'Vui lòng chon quận/huyện!' }]}
            >
              <Select
                style={{ width: 350 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn quận/huyện"
              >
                {districtMain.map((value, index) => (
                  <Select.Option value={value.district_name} key={index}>
                    {value.district_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-between">
            <Form.Item
              name="branch_id"
              label="Chi nhánh"
              rules={[{ required: true, message: 'Vui chọn chon chi nhánh!' }]}
            >
              <Select
                style={{ width: 350 }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Chọn chi nhánh"
              >
                {branchList.map((value, index) => (
                  <Select.Option value={value.branch_id} key={index}>
                    {value.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="label_id" label="Label">
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                style={{ width: 350 }}
                size="large"
                placeholder="Chọn label"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: 'auto' }}
                        onChange={(e) => setInputLabel(e.target.value)}
                        value={inputLabel}
                      />
                      <a
                        style={{
                          flex: 'none',
                          padding: '8px',
                          display: 'block',
                          cursor: 'pointer',
                        }}
                        onClick={_addLabel}
                      >
                        <PlusOutlined /> Add label
                      </a>
                    </div>
                  </div>
                )}
              >
                {labels.map((l, index) => (
                  <Select.Option
                    value={l.label_id}
                    key={index}
                    style={{ display: !l.active && 'none' }}
                  >
                    {l.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="address" label="Địa chỉ">
              <Input
                size="large"
                style={{ width: 350 }}
                placeholder="Nhập địa chỉ"
              />
            </Form.Item>
          </Row>
        </Form>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button size="large" type="primary" onClick={onFinish}>
            Thêm
          </Button>
        </Row>
      </Modal>
    </>
  )
}
