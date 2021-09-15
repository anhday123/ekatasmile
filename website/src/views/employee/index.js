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
  const [filter, setFilter] = useState({
    search: '',
    from_date: undefined,
    to_date: undefined,
    role_id: '',
  })
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
          onClick={() => modal2VisibleModalMain(true, record)}
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
                    {record && record._role ? record._role.name : ''}
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
        <EmployeeAdd close={onCloseUpdate} reload={apiAllEmployeeData} />
      </Drawer>
    </>
  )
}
