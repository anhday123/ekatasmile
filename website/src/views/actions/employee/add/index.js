import styles from './../add/add.module.scss'
import { ACTION, ROUTES } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
  Select,
  notification,
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  Button,
} from 'antd'
import { apiFilterCity, getAllBranch } from '../../../../apis/branch'
import { apiProvince } from '../../../../apis/information'
import { apiAllRole, apiAllUser } from '../../../../apis/user'
import { apiUpdateEmployee } from '../../../../apis/employee'
import { getAllStore } from '../../../../apis/store'

export default function EmployeeAdd(props) {
  const dispatch = useDispatch()
  let history = useHistory()
  const [form] = Form.useForm()
  const [branch, setBranch] = useState([])

  const { Option } = Select

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên đăng nhập hoặc email đã tồn tại.',
    })
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm nhân sự thành công.',
    })
  }
  const apiUpdateEmployeeData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateEmployee(object)
      console.log(res)
      if (res.status === 200) {
        openNotification()
        props.close()
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
  const [user, setUser] = useState({})
  const [userString, setUserString] = useState('')
  const apiAllUserData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllUser()

      if (res.status === 200) {
        const username = localStorage.getItem('username')
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (username === values.username) {
              setUser(values)
              setUserString(values.company_name.toLowerCase())
            }
          })
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  useEffect(() => {
    apiAllUserData()
  }, [])
  const [store, setStore] = useState([])
  const getAllStoreData = async () => {
    try {
      const res = await getAllStore()
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    getAllStoreData()
  }, [])
  const openNotificationRegisterFailMailPhoneMain = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Liên hệ chưa đúng định dạng',
    })
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onFinish = (value) => {
    if (validateEmail(value.email)) {
      if (password_validate(value.password)) {
        if (isNaN(value.username)) {
          if (isNaN(value.phoneNumber)) {
            openNotificationRegisterFailMailPhoneMain()
          } else {
            if (regex.test(value.phoneNumber)) {
              var array = []
              array.push(value.branch)
              const object = {
                username:
                  user && user.company_name !== ' '
                    ? `${user.company_name.toLowerCase()}_${value.username}`
                    : value.username,
                password: value.password, //
                role: value.role, //
                phone: value.phoneNumber,
                email: value.email, //
                avatar: ' ',
                store: value.store,
                first_name: value && value.name ? value.name : ' ',
                last_name: value && value.surname ? value.surname : ' ',
                branch: value && value.branch ? value.branch : ' ', //
                birthday: '',
                address: value && value.address ? value.address : ' ',
                ward: ' ',
                district: value && value.district ? value.district : ' ',
                province: value && value.city ? value.city : ' ',
                company_name: ' ',
                company_website: ' ',
                tax_code: ' ',
                fax: ' ',
              }

              apiUpdateEmployeeData(object)
            } else {
              openNotificationRegisterFailMailPhoneMain()
            }
          }
        } else {
          openNotificationRegisterFailMailPhone()
        }
      } else {
        openNotificationRegisterFail()
      }
    } else {
      if (!validateEmail(value.email)) {
        openNotificationRegisterFailMail()
      }
    }
  }

  const getAllBranchData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getAllBranch()
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  useEffect(() => {
    getAllBranchData()
  }, [])

  const [provinceMain, setProvinceMain] = useState([])
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
  useEffect(() => {}, [])
  useEffect(() => {
    apiProvinceData()
  }, [])
  const [permission, setPermission] = useState([])
  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllRole()
      if (res.status === 200) {
        setPermission(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  useEffect(() => {
    apiAllRoleData()
  }, [])
  const [checkbox, setCheckbox] = useState(false)
  function onChangeCheckbox(e) {
    setCheckbox(e.target.checked)
  }
  const [districtMainSelect, setDistrictMainSelect] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiFilterCity({ keyword: object })
      if (res.status === 200) {
        setDistrictMainSelect(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function handleChangeCity(value) {
    console.log(`selected ${value}`)
    apiFilterCityData(value)
  }
  const dataValue = form.getFieldValue()
  dataValue.store =
    store && store.length > 0 ? store[store.length - 1].store_id : ''
  dataValue.branch =
    branch && branch.length > 0 ? branch[branch.length - 1].branch_id : ''
  // dataValue.city = provinceMain && provinceMain.length > 0 ? provinceMain[provinceMain.length - 2].province_name : '';
  dataValue.district =
    districtMainSelect && districtMainSelect.length > 0
      ? districtMainSelect[districtMainSelect.length - 2].district_name
      : ''
  dataValue.role =
    permission && permission.length > 0 ? permission[0].role_id : ''
  const [storeValue, setStoreValue] = useState(
    store && store.length > 0 ? store[0].store_id : ''
  )
  const onChangeStoreValue = (e) => {
    setStoreValue(e)
  }
  return (
    <>
      <div className={styles['employee_add_parent']}>
        <Form
          className={styles['employee_add_parent_form']}
          onFinish={onFinish}
          layout="vertical"
          form={form}
          onFinishFailed={onFinishFailed}
        >
          <div
            style={{
              display: 'flex',
              marginBottom: '1rem',
              marginTop: '1rem',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Checkbox onChange={onChangeCheckbox}>
              Thêm thông tin (không bắt buộc)
            </Checkbox>
          </div>
          {checkbox ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Tên đăng nhập
                          </div>
                        }
                        name="username"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        {(user && user.company_name !== '') ||
                        (user && user.company_name !== ' ') ||
                        (user && user.company_name !== 'default') ? (
                          <Input
                            size="large"
                            addonBefore={
                              (user && user.company_name !== '') ||
                              (user && user.company_name !== ' ') ||
                              (user && user.company_name !== 'default')
                                ? userString
                                : ''
                            }
                            placeholder="Nhập tên nhân sự"
                          />
                        ) : (
                          <Input placeholder="Nhập tên nhân sự" size="large" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <div
                        style={{
                          color: 'black',
                          fontWeight: '600',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Họ
                      </div>
                      <Form.Item name="surname">
                        <Input placeholder="Nhập họ" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Mật khẩu
                          </div>
                        }
                        name="password"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <div
                        style={{
                          color: 'black',
                          fontWeight: '600',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Tên
                      </div>
                      <Form.Item
                        // label="Username"
                        name="name"
                      >
                        <Input placeholder="Nhập tên" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Vai trò{' '}
                          </div>
                        }
                        name="role"
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
                          {permission &&
                            permission.length > 0 &&
                            permission.map((values, index) => {
                              return (
                                <Option value={values.role_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
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
                        // label="Username"
                        name="address"
                      >
                        <Input placeholder="Nhập địa chỉ" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
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
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Email
                          </div>
                        }
                        name="email"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Input placeholder="Nhập email" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Chi nhánh làm việc
                          </div>
                        }
                        name="branch"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Select
                          size="large"
                          showSearch
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          placeholder="Chọn chi nhánh làm việc"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {branch &&
                            branch.length > 0 &&
                            branch.map((values, index) => {
                              return (
                                <Option value={values.branch_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Cửa hàng
                          </div>
                        }
                        name="store"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Select
                          size="large"
                          showSearch
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          value={storeValue}
                          onChange={onChangeStoreValue}
                          placeholder="Chọn cửa hàng"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {store &&
                            store.length > 0 &&
                            store.map((values, index) => {
                              return (
                                <Option value={values.store_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <div
                        style={{
                          color: 'black',
                          fontWeight: '600',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Tỉnh/thành phố
                      </div>
                      <Form.Item name="city" hasFeedback>
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
                          {provinceMain &&
                            provinceMain.length > 0 &&
                            provinceMain.map((values, index) => {
                              return (
                                <Option value={values.province_name}>
                                  {values.province_name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {districtMainSelect && districtMainSelect.length > 0 ? (
                  <Col
                    className={styles['employee_add_parent_col']}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row
                      className={styles['employee_add_parent_col_row_child']}
                    >
                      <Col
                        className={
                          styles['employee_add_parent_col_row_child_input']
                        }
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div
                          style={{
                            color: 'black',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Quận/huyện
                        </div>
                        <Form.Item name="district" hasFeedback>
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
                            {districtMainSelect &&
                              districtMainSelect.length > 0 &&
                              districtMainSelect.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>
                                    {values.district_name}
                                  </Option>
                                )
                              })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Tên đăng nhập
                          </div>
                        }
                        name="username"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        {(user && user.company_name !== '') ||
                        (user && user.company_name !== ' ') ||
                        (user && user.company_name !== 'default') ? (
                          <Input
                            size="large"
                            addonBefore={
                              (user && user.company_name !== '') ||
                              (user && user.company_name !== ' ') ||
                              (user && user.company_name !== 'default')
                                ? userString
                                : ''
                            }
                            placeholder="Nhập tên nhân sự"
                          />
                        ) : (
                          <Input placeholder="Nhập tên nhân sự" size="large" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Mật khẩu
                          </div>
                        }
                        name="password"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Input.Password
                          placeholder="Nhập mật khẩu"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Chi nhánh làm việc
                          </div>
                        }
                        name="branch"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Select
                          size="large"
                          showSearch
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          placeholder="Chọn chi nhánh làm việc"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {branch &&
                            branch.length > 0 &&
                            branch.map((values, index) => {
                              return (
                                <Option value={values.branch_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Vai trò{' '}
                          </div>
                        }
                        name="role"
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
                          {permission &&
                            permission.length > 0 &&
                            permission.map((values, index) => {
                              return (
                                <Option value={values.role_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className={styles['employee_add_parent_row']}>
                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Email
                          </div>
                        }
                        name="email"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Input placeholder="Nhập email" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <Form.Item
                        label={
                          <div style={{ color: 'black', fontWeight: '600' }}>
                            Cửa hàng
                          </div>
                        }
                        name="store"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >
                        <Select
                          size="large"
                          showSearch
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          value={storeValue}
                          onChange={onChangeStoreValue}
                          placeholder="Chọn cửa hàng"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {store &&
                            store.length > 0 &&
                            store.map((values, index) => {
                              return (
                                <Option value={values.store_id}>
                                  {values.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                <Col
                  className={styles['employee_add_parent_col']}
                  xs={24}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                >
                  <Row className={styles['employee_add_parent_col_row_child']}>
                    <Col
                      className={
                        styles['employee_add_parent_col_row_child_input']
                      }
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
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
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          )}

          <div className={styles['button']}>
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}
