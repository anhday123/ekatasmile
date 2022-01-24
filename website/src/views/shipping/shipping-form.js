import React, { useEffect, useState } from 'react'

//antd
import { Form, Drawer, Row, Col, Button, Input, Select, Upload, notification, Checkbox } from 'antd'

//icons
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

//apis
import { getWards, getDistricts, getProvinces } from 'apis/address'
import { uploadFile } from 'apis/upload'
import { addShipping, updateShipping } from 'apis/shipping'

const { Option } = Select
export default function ShippingForm({ children, reloadData, record }) {
  const [form] = Form.useForm()

  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [districtMain, setDistrictMain] = useState([])
  const [districtsDefault, setDistrictsDefault] = useState([])
  const [provinces, setProvinces] = useState([])
  const [wardMain, setWardMain] = useState([])
  const [wardMainDefault, setWardMainDefault] = useState([])

  const _addOrEditShipping = async () => {
    try {
      await form.validateFields()
      const dataForm = form.getFieldsValue()

      setLoading(true)
      const body = { ...dataForm, image: image || '' }

      let res
      if (record) res = await updateShipping(body, record.shipping_company_id)
      else res = await addShipping(body)
      console.log(res)

      if (res.status === 200) {
        if (res.data.success) {
          toggle()
          reloadData()
          notification.success({
            message: `${record ? 'Cập nhật' : 'Thêm'} đối tác vận chuyển thành công`,
          })
        } else
          notification.error({
            message:
              res.data.message ||
              `${record ? 'Cập nhật' : 'Thêm'} đối tác vận chuyển thất bại, vui lòng thử lại`,
          })
      } else
        notification.error({
          message:
            res.data.message ||
            `${record ? 'Cập nhật' : 'Thêm'} đối tác vận chuyển thất bại, vui lòng thử lại`,
        })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _uploadImage = async (file) => {
    try {
      setLoading(true)
      const url = await uploadFile(file)
      setImage(url || '')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _getProvinces = async (params) => {
    try {
      const res = await getProvinces(params)
      if (res.status === 200) setProvinces(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getDistricts = async (value) => {
    try {
      const res = await getDistricts({ search: value })
      if (res.status === 200) {
        setDistrictMain(res.data.data)
        setDistrictsDefault(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _getWards = async (params) => {
    try {
      const res = await getWards(params)
      if (res.status === 200) {
        setWardMain(res.data.data)
        setWardMainDefault(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getProvinces()
    _getDistricts()
    _getWards()
  }, [])

  useEffect(() => {
    if (visible) {
      if (!record) {
        form.resetFields()
        setImage('')
      } else {
        form.setFieldsValue({ ...record })
        setImage(record.image || '')
      }
    }
  }, [visible])

  return (
    <>
      <div onClick={toggle}>{children}</div>
      <Drawer
        width="70%"
        footer={
          <Row justify="end">
            <Button
              onClick={_addOrEditShipping}
              loading={loading}
              size="large"
              type="primary"
              style={{ width: 120 }}
            >
              {record ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Row>
        }
        title={`${record ? 'Cập nhật' : 'Thêm'} đối tác vận chuyển`}
        placement="right"
        onClose={toggle}
        visible={visible}
      >
        <Form form={form} layout="vertical">
          <div style={{ marginBottom: 10 }}>
            <Upload
              data={_uploadImage}
              name="avatar"
              listType="picture-card"
              className="upload-shipping"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              {image ? (
                <img src={image} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </div>

          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label={<div style={{ color: 'black', fontWeight: '600' }}>Tên đối tác</div>}
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên đối tác!' }]}
              >
                <Input size="large" placeholder="Nhập tên đối tác" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}
                name="address"
              >
                <Input placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập liên hệ!' }]}
              >
                <Input placeholder="Nhập liên hệ" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="province"
                label={<div style={{ color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>}
                rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
              >
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn tỉnh/thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => {
                    if (value) {
                      const districtsNew = districtsDefault.filter((e) => e.province_name === value)
                      setDistrictMain([...districtsNew])
                    } else setDistrictMain([...districtsDefault])
                  }}
                >
                  {provinces.map((province, index) => {
                    return (
                      <Option value={province.province_name} key={index}>
                        {province.province_name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="district"
                label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                rules={[{ required: true, message: 'Vui lòng nhập quận/huyện!' }]}
              >
                <Select
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn quận/huyện"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => {
                    if (value) {
                      const wardNew = wardMainDefault.filter((e) => e.district_name === value)
                      setWardMain([...wardNew])
                    } else setWardMain([...wardMainDefault])
                  }}
                >
                  {districtMain.map((district, index) => {
                    return (
                      <Option value={district.district_name} key={index}>
                        {district.district_name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="ward"
                label={<div style={{ color: 'black', fontWeight: '600' }}>Phường/xã</div>}
                rules={[{ required: true, message: 'Vui lòng nhập phường/xã!' }]}
              >
                <Select
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn quận/huyện"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {wardMain.map((ward, index) => {
                    return (
                      <Option value={ward.ward_name} key={index}>
                        {ward.ward_name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item name="default" valuePropName="checked">
                <Checkbox>Chọn làm mặc định</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
