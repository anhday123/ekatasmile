import React, { useEffect, useState } from 'react'
import moment from 'moment'

//antd
import { Form, Drawer, Row, Col, Button, Input, notification, DatePicker, Select } from 'antd'

//apis
import { updateUser, addUser } from 'apis/user'
import { apiDistrict, apiProvince } from 'apis/information'

export default function ClientForm({ children, reloadData, record }) {
  const [form] = Form.useForm()

  const [districts, setDistricts] = useState([])
  const [provinces, setProvinces] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const _addOrEditUser = async () => {
    try {
      await form.validateFields()
      const dataForm = form.getFieldsValue()

      setLoading(true)
      const body = {
        ...dataForm,
        avatar: '',
        first_name: dataForm.first_name || '',
        email: dataForm.email || '',
        phone: dataForm.phone || '',
        birthday: dataForm.birthday || '',
        address: dataForm.address || '',
        district: dataForm.district || '',
        province: dataForm.province || '',
      }

      let res
      if (record) res = await updateUser(body, record.user_id)
      else res = await addUser({ ...body, role_id: 2 })
      console.log(res)

      if (res.status === 200) {
        if (res.data.success) {
          toggle()
          reloadData()
          notification.success({
            message: `${record ? 'Cập nhật' : 'Thêm'} client thành công`,
          })
        } else
          notification.error({
            message:
              res.data.message ||
              `${record ? 'Cập nhật' : 'Thêm'} client thất bại, vui lòng thử lại`,
          })
      } else
        notification.error({
          message:
            res.data.message || `${record ? 'Cập nhật' : 'Thêm'} client thất bại, vui lòng thử lại`,
        })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _getDistricts = async (value) => {
    try {
      const res = await apiDistrict({ search: value })
      if (res.status === 200) {
        setDistricts(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _getProvinces = async () => {
    try {
      const res = await apiProvince()
      if (res.status === 200) setProvinces(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getProvinces()
    _getDistricts()
  }, [])

  useEffect(() => {
    if (visible) {
      if (!record) {
        form.resetFields()
      } else {
        console.log(record)
        form.setFieldsValue({
          ...record,
          birthday: record.birthday ? moment(record.birthday) : null,
        })
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
              onClick={_addOrEditUser}
              loading={loading}
              size="large"
              type="primary"
              style={{ width: 120 }}
            >
              {record ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Row>
        }
        title={`${record ? 'Cập nhật' : 'Thêm'} client`}
        placement="right"
        onClose={toggle}
        visible={visible}
      >
        <Form layout="vertical" form={form}>
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Họ" name="first_name">
                <Input placeholder="Nhập họ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label="Tên"
                name="last_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11} style={{ display: record && 'none' }}>
              <Form.Item
                label="Tài khoản"
                name="username"
                rules={[{ required: record ? false : true, message: 'Vui lòng nhập tài khoản!' }]}
              >
                <Input placeholder="Nhập tài khoản" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} style={{ display: record && 'none' }}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: record ? false : true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="Nhập liên hệ" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item name="district" label="Quận/huyện">
                <Select
                  allowClear
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn quận/huyện"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {districts.map((district, index) => {
                    return (
                      <Select.Option value={district.district_name} key={index}>
                        {district.district_name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item name="province" label="Tỉnh/thành phố">
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn tỉnh/thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {provinces.map((province, index) => {
                    return (
                      <Select.Option value={province.province_name} key={index}>
                        {province.province_name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
