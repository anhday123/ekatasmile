import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'

//antd
import {
  Form,
  Drawer,
  Row,
  Col,
  Button,
  Input,
  notification,
  DatePicker,
  Select,
  Radio,
  Space,
} from 'antd'

//apis
import { updateEmployee, addEmployee } from 'apis/employee'
import { getDistricts, getProvinces } from 'apis/address'
import { getAllBranch } from 'apis/branch'
import { getRoles } from 'apis/role'

export default function EmployeeForm({ children, reloadData, record }) {
  const [form] = Form.useForm()
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [roles, setRoles] = useState([])
  const [province, setProvince] = useState('')
  const [districts, setDistricts] = useState([])
  const [branches, setBranches] = useState([])
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
        birth_day: dataForm.birthday || '',
        address: dataForm.address || '',
        district: dataForm.district || '',
        province: dataForm.province || '',
        role_id: +dataForm.role_id,
      }

      let res
      if (record) res = await updateEmployee(body, record.user_id)
      else res = await addEmployee({ ...body })
      console.log(res)

      if (res.status === 200) {
        if (res.data.success) {
          toggle()
          reloadData()
          notification.success({
            message: `${record ? 'Cập nhật' : 'Thêm'} nhân viên thành công`,
          })
        } else
          notification.error({
            message:
              res.data.message ||
              `${record ? 'Cập nhật' : 'Thêm'} nhân viên thất bại, vui lòng thử lại`,
          })
      } else
        notification.error({
          message:
            res.data.message ||
            `${record ? 'Cập nhật' : 'Thêm'} nhân viên thất bại, vui lòng thử lại`,
        })
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _getDistricts = async () => {
    try {
      const res = await getDistricts()
      if (res.status === 200) setDistricts(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getProvinces = async () => {
    try {
      const res = await getProvinces()
      if (res.status === 200) setProvinces(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getBranches = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getRoles = async () => {
    try {
      const res = await getRoles()
      if (res.status === 200) setRoles(res.data.data.filter((e) => e.role_id !== 1))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getBranches()
    _getRoles()
    _getProvinces()
    _getDistricts()
  }, [])

  useEffect(() => {
    if (visible) {
      if (!record) {
        form.resetFields()
        form.setFieldsValue({
          province: provinces.length ? provinces[0].province_name : '',
          district: districts.length ? districts[0].district_name : '',
        })
        setProvince(provinces.length ? provinces[0].province_name : '')
      } else {
        setProvince(record.province || '')
        form.setFieldsValue({
          ...record,
          birth_day: record.birth_day ? moment(record.birth_day) : null,
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
        title={`${record ? 'Cập nhật' : 'Thêm'} nhân viên`}
        placement="right"
        onClose={toggle}
        visible={visible}
      >
        <Form layout="vertical" form={form}>
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label="Số điện thoại"
                name="username"
                rules={[
                  { required: record ? false : true, message: 'Vui lòng nhập số điện thoại!' },
                ]}
              >
                <Input disabled={record ? true : false} placeholder="Nhập số điện thoại" />
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
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="branch_id"
                label="Chi nhánh làm việc"
                rules={[{ required: true, message: 'Vui lòng chọn chi nhánh làm việc' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  value={branchIdApp}
                  placeholder="Chọn chi nhánh làm việc"
                >
                  {branches.map((branch, index) => (
                    <Select.Option value={branch.branch_id} key={index}>
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
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
              <Form.Item name="province" label="Tỉnh/thành phố">
                <Select
                  value={province}
                  onChange={setProvince}
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
                  {districts
                    .filter((e) => !province || e.province_name === province)
                    .map((district, index) => {
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
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="role_id"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Space wrap={true}>
                  <Radio.Group>
                    {roles.map((role, index) => (
                      <Radio value={role.role_id} key={index}>
                        {role.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
