import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES, PERMISSIONS } from './../../consts/index'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './../employee/employee.module.scss'
import {
  Select,
  DatePicker,
  Row,
  notification,
  Switch,
  Col,
  Form,
  Input,
  Modal,
  Button,
  Drawer,
  Table,
  Menu,
  Dropdown,
} from 'antd'
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons'

import { apiFilterRoleEmployee } from '../../apis/employee'
import { apiAllRole, apiSearch, updateUser } from '../../apis/user'
import { apiFilterCity, getAllBranch } from '../../apis/branch'
import { apiDistrict, apiProvince } from '../../apis/information'
import EmployeeAdd from '../actions/employee/add'
import { getAllStore } from '../../apis/store'
import Permission from 'components/permission'
import { compare, removeNull } from 'utils'
const { Option } = Select

export default function Employee() {
  const [employee, setEmployee] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [loading, setLoading] = useState(false)
  const [province, setProvince] = useState([])
  const [record, setRecord] = useState({})
  const [monthSix, setMonthSix] = useState(0)
  const [employeeCount, setEmployeeCount] = useState([])
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [permission, setPermission] = useState([])
  const [district, setDistrict] = useState([])
  const [branch, setBranch] = useState([])
  const [store, setStore] = useState([])
  const [rolelist, setRolelist] = useState([])
  const [showBulkUpdate, setShowBulkUpdate] = useState({
    visible: false,
    key: '',
    title: '',
  })
  const [filter, setFilter] = useState({
    search: '',
    from_date: undefined,
    to_date: undefined,
    role_id: '',
  })
  const [updateForm] = Form.useForm()
  const { RangePicker } = DatePicker
  var temp = 0
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }

  function onChangeSwitch(checked, record) {
    updateUserData(
      { ...record, active: checked },
      record.user_id,
      checked ? 1 : 2
    )
  }

  const changePagi = (page, page_size) => setPagination({ page, page_size })

  const apiAllEmployeeData = async (params) => {
    try {
      setLoading(true)
      const res = await apiSearch({
        page: pagination.page,
        page_size: pagination.page_size,
        ...params,
      })
      if (res.status === 200 && res.data.success) {
        res.data.data.forEach((values) => {
          let now = moment()
          let days = now.diff(values.create_date, 'days')
          if (days > 180) {
            temp++
          }
        })
        setMonthSix(temp)
        // setEmployeeTemp(res.data.data)
        setEmployee(res.data.data)
        setEmployeeCount(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const columns = [
    {
      title: 'Mã nhân sự',
      dataIndex: 'user_id',
      width: 100,
      render: (text, record) => (
        <div
          style={{ color: '#40A9FF', cursor: 'pointer' }}
          onClick={() => {
            updateForm.setFieldsValue(record)
            modal2VisibleModalMain(true, record)
          }}
        >
          {text}
        </div>
      ),
      sorter: (a, b) => compare(a, b, 'user_id'),
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      width: 200,
      sorter: (a, b) => compare(a, b, 'user_name'),
    },
    {
      title: 'Tên nhân sự',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => (
        <div>{`${record.first_name} ${record.last_name}`}</div>
      ),
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Chức vụ',
      dataIndex: '_role',
      width: 150,
      render: (data) => (data ? data.name : ''),
      sorter: (a, b) => compare(a, b, '_role'),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Ngày gia nhập',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    // {
    //   title: 'Cửa hàng',
    //   dataIndex: 'store',
    //   width: 150,
    //   render: (text, record) => <div>{text.name}</div>,
    //   sorter: (a, b) => compare(a, b, 'store'),
    // },
    // {
    //   title: 'Chi nhánh',
    //   dataIndex: 'branch',
    //   width: 150,
    //   render: (text, record) => <div>{text.name}</div>,
    //   sorter: (a, b) => compare(a, b, 'branch'),
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      sorter: (a, b) => compare(a, b, 'email'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
      sorter: (a, b) => compare(a, b, 'address'),
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
      sorter: (a, b) => compare(a, b, 'district'),
    },

    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'province',
      width: 150,
      sorter: (a, b) => compare(a, b, 'province'),
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

  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data && data === 2
          ? 'Vô hiệu hóa nhân sự thành công.'
          : 'Kích hoạt nhân sự thành công.',
    })
  }

  const onClickClear = async () => {
    setFilter({
      search: '',
      from_date: undefined,
      to_date: undefined,
      role_id: '',
    })
    openNotificationClear()
  }
  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Lỗi cập nhật thông tin nhân sự.',
    })
  }

  const updateUserData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await updateUser(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllEmployeeData()
        openNotificationUpdate(data)
        setSelectedRowKeys([])
      } else {
        openNotificationErrorUpdate()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const onUpdateFinish = async (value) => {
    let tmp = { ...value }
    delete tmp.user_id
    try {
      const res = await updateUser(tmp, value.user_id)
      console.log(res)
      if (res.status === 200) {
        await apiAllEmployeeData()
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin nhân sự thành công',
        })
        modal2VisibleModal(false)
      } else {
        notification.error({
          message: 'Thất bại',
          description: res.data.message,
        })
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  }

  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore()
      if (res.status === 200) {
        setStore(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    employee &&
      employee.length > 0 &&
      employee.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            array.push(values)
          }
        })
      })

    setArrayUpdate([...array])
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const apiAllRoleData = async () => {
    try {
      setLoading(true)
      const res = await apiAllRole()

      if (res.status === 200) {
        setPermission(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getAllBranchData = async () => {
    try {
      setLoading(true)
      const res = await getAllBranch()
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict()
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince()
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object })
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function handleChangeCity(value) {
    apiFilterCityData(value)
  }
  const finishBulkUpdate = async (value) => {
    try {
      const res = await Promise.all(
        selectedRowKeys.map((e) => {
          return updateUser(value, e)
        })
      )
      if (res.reduce((a, b) => a && b.data.success, true)) {
        notification.success({ message: 'Cập nhật thông tin thành công' })
        apiAllEmployeeData(removeNull(filter))
        setShowBulkUpdate({ visible: false, key: '', title: '' })
        setSelectedRowKeys([])
      } else {
        notification.error({ message: 'Thất bại' })
      }
    } catch (err) {
      console.log(err)
      notification.error({ message: 'Thất bại' })
    }
  }
  const menuUpdate = () => (
    <Menu>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'phone', title: 'liên hệ' })
        }
      >
        Liên hệ
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'email', title: 'email' })
        }
      >
        Email
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'last_name', title: 'tên' })
        }
      >
        Tên
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'first_name', title: 'họ' })
        }
      >
        Họ
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'address', title: 'địa chỉ' })
        }
      >
        Địa chỉ
      </Menu.Item>
      {/* <Menu.Item
        onClick={() =>
          setShowBulkUpdate({
            visible: true,
            key: 'district',
            title: 'quận/huyện',
          })
        }
      >
        Quận huyện
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({
            visible: true,
            key: 'province',
            title: 'thành phố',
          })
        }
      >
        Thành phố
      </Menu.Item> */}
      <Menu.Item
        onClick={() =>
          setShowBulkUpdate({ visible: true, key: 'role_id', title: 'vai trò' })
        }
      >
        Vai trò
      </Menu.Item>
    </Menu>
  )
  useEffect(() => {
    getAllStoreData()
  }, [])
  useEffect(() => {
    apiAllRoleData()
  }, [])
  useEffect(() => {
    getAllBranchData()
  }, [])
  useEffect(() => {
    apiAllEmployeeData(removeNull(filter))
  }, [filter])
  useEffect(() => {
    apiDistrictData()
  }, [])
  useEffect(() => {
    apiProvinceData()
  }, [])

  return (
    <>
      <div className={`${styles['employee_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgb(231, 224, 224)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Link
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
            >
              Quản lý nhân sự
            </div>
          </Link>
          <Permission permissions={[PERMISSIONS.them_nhan_su]}>
            <Button
              size="large"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={showDrawerUpdate}
            >
              Thêm nhân sự
            </Button>
          </Permission>
        </div>
        <div className={styles['employee_manager_search']}>
          <Row className={styles['employee_manager_search_row']}>
            <Col
              style={{ marginTop: '1.25rem', marginRight: '1rem' }}
              className={styles['employee_manager_search_row_col']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <div style={{ width: '100%' }}>
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  name="name"
                  value={filter.search}
                  enterButton
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className={styles['orders_manager_content_row_col_search']}
                  placeholder="Tìm kiếm theo mã, tên đăng nhập"
                  allowClear
                />
              </div>
            </Col>
            <Col
              style={{ marginTop: '1.25rem', marginRight: '1rem' }}
              className={styles['employee_manager_search_row_col']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <div style={{ width: '100%' }}>
                <RangePicker
                  size="large"
                  className="br-15__date-picker"
                  // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                  value={
                    filter.from_date
                      ? [moment(filter.from_date), moment(filter.to_date)]
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
                  onChange={(date, dateString) =>
                    setFilter({
                      ...filter,
                      from_date: dateString[0],
                      to_date: dateString[1],
                    })
                  }
                />
              </div>
            </Col>
            <Col
              style={{ marginTop: '1.25rem', marginRight: '1rem' }}
              className={styles['employee_manager_search_row_col']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  value={filter.role_id}
                  onChange={(event) => {
                    setFilter({ ...filter, role_id: event })
                  }}
                >
                  <Option value="">Tất cả chức vụ</Option>

                  {permission &&
                    permission.length > 0 &&
                    permission.map((values, index) => {
                      return (
                        <Option value={values.role_id}>{values.name}</Option>
                      )
                    })}
                </Select>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['employee_manager_top']}>
          <Row className={styles['employee_manager_top_center']}>
            <Col
              style={{ marginTop: '1.25rem' }}
              className={styles['employee_manager_top_center_col']}
              xs={20}
              sm={10}
              md={10}
              lg={6}
              xl={6}
            >
              <div className={styles['employee_manager_top_center_item']}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  {employeeCount.length}
                </div>
                <div className={styles['employee_manager_top_center_item_top']}>
                  Tổng nhân sự
                </div>
              </div>
            </Col>
            <Col
              style={{ marginTop: '1.25rem', marginLeft: '1rem' }}
              className={styles['employee_manager_top_center_col']}
              xs={20}
              sm={10}
              md={10}
              lg={6}
              xl={6}
            >
              <div className={styles['employee_manager_top_center_item']}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  {monthSix}
                </div>
                <div className={styles['employee_manager_top_center_item_top']}>
                  Nhân viên trên 6 tháng
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['employee_manager_bottom']}>
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
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <div
              style={{
                display: 'flex',
                marginTop: '1rem',
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
              <Permission permissions={[PERMISSIONS.cap_nhat_nhan_su]}>
                <Dropdown overlay={menuUpdate}>
                  <Button type="primary" size="large">
                    Cập nhật nhân sự
                  </Button>
                </Dropdown>
              </Permission>
            </div>
          ) : (
            ''
          )}
          <div className={styles['employee_manager_bottom_table']}>
            <Table
              size="small"
              rowKey="user_id"
              columns={columns}
              rowSelection={rowSelection}
              loading={loading}
              dataSource={employee}
              scroll={{ y: 500 }}
              pagination={{ onChange: changePagi }}
            />
          </div>{' '}
        </div>
      </div>

      <Modal
        title="Cập nhật thông tin nhân sự"
        centered
        footer={null}
        width={800}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <Form
          wrapperCol={{ xs: 24, lg: 17 }}
          labelCol={{ xs: 24, lg: 7 }}
          form={updateForm}
          onFinish={onUpdateFinish}
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="first_name" label="Họ">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="last_name" label="Tên">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Liên hệ">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branch_id" label="Chi nhánh">
                <Select>
                  {branch.map((e) => (
                    <Option value={e.branch_id}>{e.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role_id" label="Vai trò">
                <Select>
                  {permission.map((e) => (
                    <Option value={e.role_id}>{e.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="province" label="Tỉnh/Thành phố">
                <Select>
                  {province.map((e) => (
                    <Option value={e.name}>{e.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="district" label="Quận/Huyện">
                <Select>
                  {district.map((e) => (
                    <Option value={e.name}>{e.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="user_id">
            <Input hidden />
          </Form.Item>
          <Row justify="end">
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Row>
        </Form>
      </Modal>
      <Modal
        centered
        title={`Cập nhật ${showBulkUpdate.title}`}
        footer=""
        visible={showBulkUpdate.visible}
        onCancel={() => setShowBulkUpdate({ visible: false, key: '' })}
      >
        <Form onFinish={finishBulkUpdate}>
          <Form.Item name={showBulkUpdate.key}>
            {showBulkUpdate.key === 'role_id' ? (
              <Select
                placeholder={`Chọn ${showBulkUpdate.title}`}
                style={{ width: '100%' }}
                size="large"
              >
                {permission.map((e) => (
                  <Option value={e.role_id}>{e.name}</Option>
                ))}
              </Select>
            ) : (
              <Input
                size="large"
                placeholder={`Nhập ${showBulkUpdate.title}`}
              />
            )}
          </Form.Item>
          <Row>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Row>
        </Form>
      </Modal>
      <Drawer
        title="Cập nhật thông tin nhân sự"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary">Cập nhật</Button>
          </div>
        }
      ></Drawer>

      <Drawer
        title="Thêm nhân sự"
        width="75%"
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <EmployeeAdd close={onCloseUpdate} reload={apiAllEmployeeData} />
      </Drawer>
    </>
  )
}
