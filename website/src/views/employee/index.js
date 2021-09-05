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
} from 'antd'
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons'

import { apiFilterRoleEmployee } from '../../apis/employee'
import { apiAllRole, apiSearch, updateUser } from '../../apis/user'
import { apiFilterCity, getAllBranch } from '../../apis/branch'
import { apiDistrict, apiProvince } from '../../apis/information'
import EmployeeAdd from '../actions/employee/add'
import { getAllStore } from '../../apis/store'
import Permission from 'components/permission'
const { Option } = Select
export default function Employee() {
  const dispatch = useDispatch()
  const username = localStorage.getItem('username')
  const [employee, setEmployee] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [loading, setLoading] = useState(false)

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const [record, setRecord] = useState({})
  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }
  const { RangePicker } = DatePicker

  function onChangeSwitch(checked, record) {
    updateUserData(
      { ...record, active: checked },
      record.user_id,
      checked ? 1 : 2
    )
  }

  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ keyword: value })

      if (res.status === 200) {
        setEmployee(res.data.data)
      }
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
  const changePagi = (page, page_size) => setPagination({ page, page_size })

  const [monthSix, setMonthSix] = useState(0)
  var temp = 0
  const [employeeTemp, setEmployeeTemp] = useState([])
  const [employeeCount, setEmployeeCount] = useState([])
  const apiAllEmployeeData = async () => {
    try {
      setLoading(true)
      const res = await apiSearch({
        page: pagination.page,
        page_size: pagination.page_size,
      })
      console.log(res)
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.bussiness.username === username) {
              if (values._role === 'EMPLOYEE') {
                array.push(values)

                let now = moment()
                let days = now.diff(values.create_date, 'days')
                if (days > 180) {
                  temp++
                }
              }
            }
          })
        setMonthSix(temp)
        setEmployeeTemp(res.data.data)
        setEmployee(res.data.data)
        setEmployeeCount(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllEmployeeData()
  }, [])
  const columns = [
    {
      title: 'Mã nhân sự',
      dataIndex: 'user_id',
      width: 100,
      render: (text, record) => (
        <div
          style={{ color: '#40A9FF', cursor: 'pointer' }}
          onClick={() => modal2VisibleModalMain(true, record)}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      width: 200,
    },
    {
      title: 'Tên nhân sự',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => (
        <div>{`${record.first_name} ${record.last_name}`}</div>
      ),
    },
    {
      title: 'Chức vụ',
      dataIndex: '_role',
      width: 150,
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Ngày gia nhập',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
      sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      width: 150,
      render: (text, record) => <div>{text.name}</div>,
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      width: 150,
      render: (text, record) => <div>{text.name}</div>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },

    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'province',
      width: 150,
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
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({
        from_date: start,
        to_date: end,
        page: pagination.page,
        page_size: pagination.page_size,
      })

      if (res.status === 200) {
        setEmployee(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const dateFormat = 'YYYY/MM/DD'
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
        data === 2
          ? 'Vô hiệu hóa nhân sự thành công.'
          : 'Kích hoạt nhân sự thành công.',
    })
  }

  const openNotificationUpdateData = (data, data2) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Cập nhật thông tin nhân sự <b>{`${data} ${data2}`}</b> thành công
        </div>
      ),
    })
  }
  const onClickClear = async () => {
    await apiAllEmployeeData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setRoleSelect('default')
  }
  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Lỗi cập nhật thông tin nhân sự.',
    })
  }

  const updateUserUpdateData = async (object, id, data) => {
    console.log(object)
    console.log('___333')
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await updateUser(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllEmployeeData()
        openNotificationUpdateData(object.first_name, object.last_name)
        setSelectedRowKeys([])
        onClose()
        onCloseUpdate()
      } else {
        openNotificationErrorUpdate()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
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

  const [store, setStore] = useState([])
  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore()
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllStoreData()
  }, [])

  const [arrayUpdate, setArrayUpdate] = useState([])
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
  const [permission, setPermission] = useState([])
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
  useEffect(() => {
    apiAllRoleData()
  }, [])
  const [branch, setBranch] = useState([])
  const getAllBranchData = async () => {
    try {
      setLoading(true)
      const res = await getAllBranch()
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllBranchData()
  }, [])
  const [district, setDistrict] = useState([])
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
  const [province, setProvince] = useState([])
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
  const apiFilterRoleEmployeeData = async (data) => {
    try {
      setLoading(true)
      const res = await apiFilterRoleEmployee({ _role: data })
      if (res.status === 200) {
        setEmployee(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [roleSelect, setRoleSelect] = useState('')
  const onChangeFilter = async (e) => {
    if (e === 'default') {
      await apiAllEmployeeData()
    } else {
      apiFilterRoleEmployeeData(e)
    }
    setRoleSelect(e)
  }
  useEffect(() => {
    apiDistrictData()
  }, [])
  useEffect(() => {
    apiProvinceData()
  }, [])
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
  var employeeName = []
  employeeTemp &&
    employeeTemp.length > 0 &&
    employeeTemp.forEach((values, index) => {
      employeeName.push(values.role.name)
    })
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
                  value={valueSearch}
                  enterButton
                  onChange={onSearch}
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
                  value={roleSelect ? roleSelect : 'default'}
                  onChange={(event) => {
                    onChangeFilter(event)
                  }}
                >
                  <Option value="default">Tất cả chức vụ</Option>

                  {permission &&
                    permission.length > 0 &&
                    permission.map((values, index) => {
                      return <Option value={values.name}>{values.name}</Option>
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
                <Button type="primary" onClick={showDrawer} size="large">
                  Cập nhật nhân sự
                </Button>
              </Permission>
            </div>
          ) : (
            ''
          )}
          <div className={styles['employee_manager_bottom_table']}>
            <Table
              size="small"
              rowKey="_id"
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
        title="Xem chi tiết thông tin nhân sự"
        centered
        footer={null}
        width={800}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div className={styles['supplier_information_content_parent']}>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  {' '}
                  <div>
                    <b>Tên nhân sự:</b>{' '}
                    {`${record.first_name} ${record.last_name}`}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Email:</b> {record.email}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Chức vụ:</b>{' '}
                    {record && record.role ? record.role.name : ''}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Liên hệ:</b> {record.username}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Ngày tạo:</b>{' '}
                    {moment(record.create_date).format('YYYY-MM-DD')}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Địa chỉ:</b> {record.address}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Quận/huyện:</b> {record.district}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Chi nhánh làm việc:</b> {record.branch_id}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Tỉnh/thành phố:</b> {record.province}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
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
      >
        {arrayUpdate &&
          arrayUpdate.length > 0 &&
          arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            return (
              <Form
                style={{
                  borderBottom: '1px solid rgb(238, 224, 224)',
                  paddingBottom: '1.5rem',
                }}
                className={styles['supplier_add_content']}
                // form={form}
                layout="vertical"
                initialValues={values}
              >
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {obj.map((data) => {
                    if (data === 'username') {
                      const InputName = () => (
                        <Input
                          size="large"
                          disabled
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Tên đăng nhập
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'phone') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Liên hệ
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'email') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Email
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'branch') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data].branch_id}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn chi nhánh"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
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
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Chi nhánh làm việc
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'store') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data].store_id}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn cửa hàng"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
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
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Cửa hàng
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'role') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={
                            values[data] && values[data].role_id
                              ? values[data].role_id
                              : 'Đã lưu vai trò'
                          }
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn vai trò"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
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
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Vai trò
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }

                    if (data === 'first_name') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Tên
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'last_name') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Họ
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'address') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Địa chỉ
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'province') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                            handleChangeCity(event)
                          }}
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
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Tỉnh/thành phố
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'district') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
                        >
                          {districtMainAPI && districtMainAPI.length > 0
                            ? districtMainAPI &&
                              districtMainAPI.length > 0 &&
                              districtMainAPI.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>
                                    {values.district_name}
                                  </Option>
                                )
                              })
                            : district &&
                              district.length > 0 &&
                              district.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>
                                    {values.district_name}
                                  </Option>
                                )
                              })}
                        </Select>
                      )
                      return (
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
                                marginTop: '1rem',
                              }}
                            >
                              Quận/huyện
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                  })}
                </Row>
              </Form>
            )
          })}
      </Drawer>

      <Drawer
        title="Thêm nhân sự"
        width="75%"
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <EmployeeAdd close={onCloseUpdate} />
      </Drawer>
    </>
  )
}
