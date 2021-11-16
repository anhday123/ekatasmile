import styles from './../user/user.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import {
  apiAllRole,
  apiCreateUserMenu,
  apiSearch,
  updateUser,
} from './../../apis/user'
import { apiAllUser } from '../../apis/user'
import { ROUTES, PERMISSIONS } from './../../consts/index'
import {
  Switch,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  notification,
  Radio,
  Select,
  Drawer,
  Form,
  Table,
} from 'antd'
import { Link } from 'react-router-dom'
import { PlusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { apiFilterRoleEmployee } from '../../apis/employee'
import Permission from 'components/permission'
import { compare, compareCustom } from 'utils'
const { Option } = Select
const { RangePicker } = DatePicker

export default function User() {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [formAdd] = Form.useForm()
  const [birthDay, setBirthDay] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [user, setUser] = useState([])
  const [visibleUpdate, setVisibleUpdate] = useState(false)

  const dateFormat = 'YYYY/MM/DD'

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm người dùng mới thành công.',
    })
  }
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên đăng nhập hoặc gmail đã tồn tại.',
    })
  }
  const apiSearchData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ search: value })
      if (res.status === 200) setUser(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end })

      if (res.status === 200) setUser(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiSearchData(value)
    }, 300)
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChange(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  function onChangeAdd(dates, dateStrings) {
    console.log(dateStrings)
    setBirthDay(dateStrings)
  }
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const columnsPromotion = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      width: 150,
      sorter: (a, b) => compare(a, b, 'username'),
    },

    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      sorter: (a, b) => compare(a, b, 'email'),
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => <div>{moment(text).format('YYYY-MM-DD')}</div>,
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) =>
        compareCustom(
          `${a.first_name} ${a.last_name}`,
          `${b.first_name} ${b.last_name}`
        ),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Vai trò',
      dataIndex: '_role',
      width: 150,
      render: (data) => <>{data ? data.name : 'EMPLOYEE'}</>,
      sorter: (a, b) =>
        compareCustom(
          a._role ? a._role.name : 'EMPLOYEE',
          b._role ? b._role.name : 'EMPLOYEE'
        ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
      sorter: (a, b) => compare(a, b, 'address'),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) =>
        text ? (
          <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        ),
    },
  ]

  function onChangeSwitch(checked, record) {
    updateUserData(
      { ...record, active: checked },
      record.user_id,
      checked ? 1 : 2
    )
  }

  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data === 2
          ? 'Vô hiệu hóa người dùng thành công.'
          : 'Kích hoạt người dùng thành công.',
    })
  }

  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Lỗi cập nhật thông tin khách hàng.',
    })
  }
  const updateUserData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await updateUser(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllUserData()
        openNotificationUpdate(data)
        setSelectedRowKeys([])
        setVisibleUpdate(false)
      } else {
        openNotificationErrorUpdate()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const apiAllUserData = async () => {
    try {
      setLoading(true)
      const res = await apiAllUser()
      console.log(res)
      if (res.status === 200) {
        setUser(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [role, setRole] = useState([])
  const apiAllRoleData = async () => {
    try {
      setLoading(true)
      const res = await apiAllRole()
      console.log(res)
      if (res.status === 200) {
        setRole(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllUserData()
  }, [])
  useEffect(() => {
    apiAllRoleData()
  }, [])
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gmail phải ở dạng @gmail.com.',
    })
  }
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: `${data} phải là số và có độ dài là 10`,
    })
  }
  const apiCreateUserMenuData = async (object) => {
    try {
      setLoading(true)
      const res = await apiCreateUserMenu(object)
      console.log(res)
      if (res.status === 200) {
        await apiAllUserData()
        openNotification()
        setVisible(false)
        formAdd.resetFields()
      } else {
        openNotificationError()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  function password_validate(password) {
    var re = {
      full: /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()?])[A-Za-z0-9\d!@#$%^&*()?]{8,}$/,
    }
    return re.full.test(password)
  }
  const openNotificationRegisterFail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Mật khẩu tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
    })
  }
  function validateEmail(email) {
    const re =
      /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
    return re.test(String(email).toLowerCase())
  }
  function isValid(string) {
    var re = /^([a-zA-Z0-9]|[-._](?![-._])){6,20}$/
    return re.test(string)
  }
  const openNotificationRegisterFailUserPass = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Tài khoản không có khoảng trắng, không dấu, độ dài từ 6 đến 20 ký tự.',
    })
  }
  function nonAccentVietnamese(str) {
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
    return str
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onFinish = (values) => {
    console.log('Success:', values)
    if (validateEmail(values.emailAdd)) {
      if (password_validate(values.password)) {
        if (isNaN(values.phoneNumber) || !isValid(values.username)) {
          if (isNaN(values.phoneNumber)) {
            openNotificationRegisterFailMailRegex('Liên hệ')
          }
          if (!isValid(values.username)) {
            openNotificationRegisterFailUserPass()
          }
        } else {
          if (regex.test(values.phoneNumber)) {
            const object = {
              username: nonAccentVietnamese(
                values.username.toLowerCase().trim()
              ),
              password: values.password,
              store_id: ' ',
              role_id: values.roleAdd,
              phone: values.phoneNumber,
              branch_id: ' ',
              email: values.emailAdd,
              avatar: ' ',
              first_name:
                values && values.name ? values.name.toLowerCase() : '',
              last_name:
                values && values.surname ? values.surname.toLowerCase() : '',
              birthday: moment(birthDay).format('YYYY-MM-DD'),
              address:
                values && values.addressAdd
                  ? values.addressAdd.toLowerCase()
                  : '',
              district: ' ',
              province: ' ',
              company_name: ' ',
              company_website: ' ',
              tax_code: ' ',
              fax: ' ',
            }
            apiCreateUserMenuData(object)
          } else {
            openNotificationRegisterFailMailRegex('Liên hệ')
          }
        }
      } else {
        openNotificationRegisterFail()
      }
    } else {
      openNotificationRegisterFailMail()
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  function validateEmail(email) {
    const re =
      /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
    return re.test(String(email).toLowerCase())
  }

  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const onClickClear = async () => {
    await apiAllUserData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setRoleSelect('default')
  }

  const apiFilterRoleEmployeeData = async (data) => {
    try {
      setLoading(true)
      const res = await apiFilterRoleEmployee({ _role: data })
      if (res.status === 200) {
        setUser(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [roleSelect, setRoleSelect] = useState('')
  const onChangeFilter = async (e) => {
    if (e === 'default') {
      await apiAllUserData()
    } else {
      apiFilterRoleEmployeeData(e)
    }
    setRoleSelect(e)
  }
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Link
            className={styles['supplier_add_back_parent']}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
            to={ROUTES.CONFIGURATION_STORE}
          >
            <ArrowLeftOutlined
              style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }}
            />
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                fontSize: '1rem',
                marginLeft: '0.5rem',
              }}
              className={styles['supplier_add_back']}
            >
              Quản lý người dùng
            </div>
          </Link>
          <div className={styles['promotion_manager_button']}>
            <div onClick={showDrawer}>
              <Permission permissions={[PERMISSIONS.them_nguoi_dung]}>
                <Button
                  size="large"
                  icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                  type="primary"
                >
                  Thêm người dùng
                </Button>
              </Permission>
            </div>
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                size="large"
                style={{ width: '100%' }}
                name="name"
                value={valueSearch}
                enterButton
                onChange={onSearch}
                className={styles['orders_manager_content_row_col_search']}
                placeholder="Tìm kiếm theo tên"
                allowClear
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                value={
                  clear === 1
                    ? []
                    : start !== ''
                    ? [moment(start, dateFormat), moment(end, dateFormat)]
                    : []
                }
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                onChange={onChange}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={roleSelect ? roleSelect : 'default'}
                onChange={(event) => {
                  onChangeFilter(event)
                }}
              >
                <Option value="default">Tất cả chức vụ</Option>

                {role &&
                  role.length > 0 &&
                  role.map((values, index) => {
                    return <Option value={values.name}>{values.name}</Option>
                  })}
              </Select>
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            marginTop: '1rem',
          }}
        >
          <Button onClick={onClickClear} type="primary" size="large">
            Xóa tất cả lọc
          </Button>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            size="small"
            rowKey="_id"
            loading={loading}
            columns={columnsPromotion}
            dataSource={user}
            style={{
              width: '100%',
            }}
          />
        </div>
      </div>

      <Drawer
        title="Thêm người dùng mới"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          layout="vertical"
          form={formAdd}
          onFinishFailed={onFinishFailed}
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
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Tên
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="name"
                >
                  <Input placeholder="Nhập tên" size="large" />
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
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Họ
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="surname"
                >
                  <Input placeholder="Nhập họ" size="large" />
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
                      Email
                    </div>
                  }
                  name="emailAdd"
                  className={styles['supplier_add_content_supplier_code_input']}
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập email" size="large" />
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
                  name="phoneNumber"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Liên hệ
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập liên hệ" size="large" />
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
                  name="password"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Mật khẩu
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" size="large" />
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
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Địa chỉ
                </div>
                <Form.Item
                  name="addressAdd"
                  className={styles['supplier_add_content_supplier_code_input']}
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
                      Ngày sinh
                    </div>
                  }
                  name="birthDay"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <DatePicker
                    size="large"
                    className="br-15__date-picker"
                    style={{ width: '100%' }}
                    onChange={onChangeAdd}
                  />
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
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tên đăng nhập
                    </div>
                  }
                  name="username"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tài khoản" size="large" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
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
                      Vai trò
                    </div>
                  }
                  name="roleAdd"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Radio.Group>
                    {role &&
                      role.length > 0 &&
                      role.map((values, index) => {
                        return (
                          <Radio
                            style={{
                              marginRight: '1.5rem',
                              marginBottom: '1rem',
                            }}
                            value={values.role_id}
                          >
                            {values.name}
                          </Radio>
                        )
                      })}
                  </Radio.Group>
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
            className={styles['supplier_add_content_supplier_button']}
          >
            <Col
              style={{
                width: '100%',
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
      </Drawer>
    </>
  )
}
