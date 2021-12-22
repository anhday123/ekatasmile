import React, { useState, useEffect } from 'react'

import { ACTION } from 'consts'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { removeAccents } from 'utils'

//antd
import { Select, notification, Row, Input, Space, Form, Checkbox, Button, InputNumber } from 'antd'

//apis
import { apiFilterCity, getAllBranch } from 'apis/branch'
import { apiProvince } from 'apis/information'
import { apiAllRole, apiAllUser } from 'apis/user'
import { apiUpdateEmployee } from 'apis/employee'
import { getAllStore } from 'apis/store'

const { Option } = Select
export default function EmployeeAdd(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [form] = Form.useForm()
  const [branch, setBranch] = useState([])

  const [checkbox, setCheckbox] = useState(false)
  const [permission, setPermission] = useState([])
  const [provinceMain, setProvinceMain] = useState([])
  const [store, setStore] = useState([])
  const [user, setUser] = useState({})
  const [userString, setUserString] = useState('')

  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'SDT Đăng nhập hoặc email đã tồn tại.',
    })
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm nhân viên thành công.',
    })
  }
  const apiUpdateEmployeeData = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateEmployee(body)
      console.log(res)
      if (res.status === 200) {
        openNotification()
        props.close()
        props.reload()
        form.resetFields()
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function password_validate(password) {
    var re = {
      full: /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()?])[A-Za-z0-9\d!@#$%^&*()?]{8,}$/,
    }
    return re.full.test(password)
  }
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gmail phải ở dạng @gmail.com',
    })
  }
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tên đăng nhập phải là chuỗi',
    })
  }
  const openNotificationRegisterFail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
    })
  }
  function validateEmail(email) {
    const re =
      /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
    return re.test(String(email).toLowerCase())
  }

  const apiAllUserData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllUser()

      if (res.status === 200) {
        const username = localStorage.getItem('username')
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (username === values.username) {
              setUser(values)
              setUserString(removeAccents(values.company_name.toLowerCase().replace(/\s/g, '')))
            }
          })
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const getAllStoreData = async () => {
    try {
      const res = await getAllStore()
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

        if (!location.state && res.data.data && res.data.data.length)
          form.setFieldsValue({ store: res.data.data[0].store_id })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openNotificationRegisterFailMailPhoneMain = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Liên hệ chưa đúng định dạng',
    })
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onFinish = (value) => {
    var array = []
    array.push(value.branch)
    const object = {
      username:
        user && user.company_name !== ''
          ? `${user.company_name.toLowerCase()}_${value.username}`
          : value.username,
      password: value.password, //
      role_id: value.role, //
      phone: value.phoneNumber,
      email: value.email, //
      avatar: '',
      store_id: value.store,
      first_name: value && value.name ? value.name : '',
      last_name: value && value.surname ? value.surname : '',
      branch_id: value && value.branch ? value.branch : '', //
      birthday: '',
      address: value && value.address ? value.address : '',
      district: value && value.district ? value.district : '',
      province: value && value.city ? value.city : '',
      company_name: '',
      company_website: '',
      tax_code: '',
      fax: '',
    }

    apiUpdateEmployeeData(object)
  }

  const getAllBranchData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getAllBranch()
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)

        if (!location.state && res.data.data && res.data.data.length)
          form.setFieldsValue({ branch: res.data.data[0].branch_id })
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvinceMain(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllRole()
      if (res.status === 200) {
        setPermission(res.data.data)

        if (!location.state && res.data.data && res.data.data.length)
          form.setFieldsValue({ role: res.data.data[0].role_id })
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  function onChangeCheckbox(e) {
    setCheckbox(e.target.checked)
  }

  useEffect(() => {
    apiAllRoleData()
    getAllBranchData()
    apiProvinceData()
    getAllStoreData()
    apiAllUserData()
  }, [])

  return (
    <div>
      <Form onFinish={onFinish} layout="vertical" form={form}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row justify="space-between" wrap={false}>
            <Form.Item
              style={{ width: '45%' }}
              label="SĐT đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số điện thoại"
                size="large"
              />
            </Form.Item>

            <Form.Item
              style={{ width: '45%' }}
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password style={{ width: '100%' }} placeholder="Nhập mật khẩu" size="large" />
            </Form.Item>
          </Row>

          <Row justify="space-between" wrap={false}>
            <Form.Item
              label="Địa điểm làm việc"
              name="branch"
              style={{ width: '45%' }}
              rules={[{ required: true, message: 'Vui lòng chọn địa điểm làm việc!' }]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                optionFilterProp="children"
                placeholder="Chọn địa điểm làm việc"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {branch.map((values, index) => {
                  return (
                    <Option value={values.branch_id} key={index}>
                      {values.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              style={{ width: '45%' }}
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn vai trò"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {permission.map((values, index) => {
                  return (
                    <Option value={values.role_id} key={index}>
                      {values.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Row>

          <Row justify="space-between" wrap={false}>
            <Form.Item
              label="Email"
              style={{ width: '45%' }}
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Nhập email" size="large" />
            </Form.Item>

            <Form.Item
              style={{ width: '45%' }}
              label="Cửa hàng"
              name="store"
              rules={[{ required: true, message: 'Vui lòng chọn cửa hàng!' }]}
            >
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                optionFilterProp="children"
                placeholder="Chọn cửa hàng"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {store.map((values, index) => {
                  return (
                    <Option value={values.store_id} key={index}>
                      {values.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Row>

          <Row justify="space-between" wrap={false}>
            <Form.Item
              style={{ width: '45%' }}
              label="Liên hệ"
              name="phoneNumber"
              rules={[{ required: true, message: 'Vui lòng nhập liên hệ!' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Nhập liên hệ" size="large" />
            </Form.Item>

            {checkbox && (
              <Form.Item style={{ width: '45%' }} name="surname" label="Họ">
                <Input style={{ width: '100%' }} placeholder="Nhập họ" size="large" />
              </Form.Item>
            )}
          </Row>
          {checkbox && (
            <Row justify="space-between" wrap={false}>
              <Form.Item style={{ width: '45%' }} label="Tên" name="name">
                <Input style={{ width: '100%' }} placeholder="Nhập tên" size="large" />
              </Form.Item>

              <Form.Item style={{ width: '45%' }} label="Địa chỉ" name="address">
                <Input style={{ width: '100%' }} placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </Row>
          )}

          {checkbox && (
            <Row justify="space-between" wrap={false}>
              <Form.Item style={{ width: '45%' }} name="city" label="Tỉnh/thành phố">
                <Select
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn tỉnh/thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {provinceMain.map((values, index) => {
                    return (
                      <Option value={values.province_name} key={index}>
                        {values.province_name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Row>
          )}
        </Space>

        <Row justify="space-between" align="middle">
          <Checkbox onChange={onChangeCheckbox}>Bổ sung thông tin liên lạc</Checkbox>
          <Button htmlType="submit" type="primary" size="large" style={{ width: 120 }}>
            Thêm
          </Button>
        </Row>
      </Form>
    </div>
  )
}
