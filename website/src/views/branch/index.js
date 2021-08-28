import styles from './../customer/customer.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES } from 'consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

import {
  Switch,
  Radio,
  Drawer,
  Input,
  Row,
  Col,
  DatePicker,
  notification,
  Select,
  Table,
  Form,
  Button,
} from 'antd'

//components
import BranchAdd from 'components/branch/branch-add'

//apis
import { apiDistrict, apiProvince } from 'apis/information'
import { getAllStore } from 'apis/store'
import {
  apiFilterCity,
  apiSearch,
  apiUpdateBranch,
  getAllBranch,
} from 'apis/branch'
import BranchView from 'views/actions/branch/view'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Branch() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [viewBranch, setViewBranch] = useState(false)
  const [store, setStore] = useState([])
  const [branch, setBranch] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const typingTimeoutRef = useRef(null)
  const apiSearchData = async (value, data) => {
    if (data === 1) {
      try {
        setLoading(true)
        const res = await apiSearch({ keyword: value })

        if (res.status === 200) setBranch(res.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    } else {
      try {
        setLoading(true)

        const res = await apiSearch({ store: value })
        console.log(res)
        if (res.status === 200) setBranch(res.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
  }
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end })
      console.log(res)
      if (res.status === 200) setBranch(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiSearchData(value, 1)
    }, 300)
  }
  const columnsPromotion = [
    {
      title: 'Mã chi nhánh',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => (
        <div
          onClick={() => {
            setData(record)
            setViewBranch(true)
          }}
          style={{ color: '#007ACC', cursor: 'pointer' }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      width: 150,
      render: (text, record) =>
        record && record.store && record.store.name ? record.store.name : '',
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
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
      title: 'Thành phố',
      dataIndex: 'ward',
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

  const [arrayUpdate, setArrayUpdate] = useState([])
  const openNotification = (check) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        check === 2
          ? 'Vô hiệu hóa chi nhánh thành công.'
          : 'Kích hoạt chi nhánh thành công',
    })
  }
  const openNotificationUpdateMulti = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Cập nhật thông tin chi nhánh <b>{data}</b> thành công
        </div>
      ),
    })
  }

  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Lỗi cập nhật thông tin chi nhánh.',
    })
  }

  const apiUpdateBranchData = async (object, id, check) => {
    try {
      setLoading(true)
      const res = await apiUpdateBranch(object, id)
      if (res.status === 200) {
        await getAllBranchData()
        openNotification(check)
        setSelectedRowKeys([])
      } else {
        openNotificationError()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
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

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  }
  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description: `${data} chưa đúng định dạng`,
    })
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }
  const apiUpdateBranchDataUpdateMulti = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateBranch(object, id)
      console.log(res)
      if (res.status === 200) {
        await getAllBranchData()
        openNotificationUpdateMulti(object.name)
        setSelectedRowKeys([])
        onClose()
        onCloseUpdate()
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          console.log(values)
          console.log('_________________678678')
          if (isNaN(values.phone)) {
            if (isNaN(values.phone)) {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          } else {
            if (regex.test(values.phone)) {
              console.log(values)
              const object = {
                // code: values.branchCode.toLowerCase(),
                name: values.name.toLowerCase(),
                phone: values.phone,
                latitude: ' ',
                longtitude: ' ',
                // default: values.defaultStore,
                address:
                  values && values.address ? values.address.toLowerCase() : '',
                ward: values.ward.toLowerCase(),
                district: values.district.toLowerCase(),
                province: ' ',
                store:
                  values && values.store && values.store.store_id
                    ? values.store.store_id
                    : values.store,
              }
              console.log(object)
              console.log('0--------------------------')
              apiUpdateBranchDataUpdateMulti(object, values.branch_id)
            } else {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          }
        })
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (isNaN(values.phone)) {
            if (isNaN(values.phone)) {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          } else {
            if (regex.test(values.phone)) {
              console.log(values)
              const object = {
                // code: values.branchCode.toLowerCase(),
                name: values.name.toLowerCase(),
                phone: values.phone,
                latitude: ' ',
                longtitude: ' ',
                // default: values.defaultStore,
                address:
                  arrayUpdate[0] && arrayUpdate[0].address
                    ? arrayUpdate[0].address.toLowerCase()
                    : '',
                ward: arrayUpdate[0].ward.toLowerCase(),
                district: arrayUpdate[0].district.toLowerCase(),
                province: ' ',
                store:
                  arrayUpdate[0] &&
                  arrayUpdate[0].store &&
                  arrayUpdate[0].store.store_id
                    ? arrayUpdate[0].store.store_id
                    : arrayUpdate[0].store,
              }
              console.log(object)
              console.log('0--------------------------')
              apiUpdateBranchDataUpdateMulti(object, values.branch_id)
            } else {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          }
        })
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    branch &&
      branch.length > 0 &&
      branch.forEach((values, index) => {
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
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const [storeSelect, setStoreSelect] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`)
    setStoreSelect(value)
    if (value > -1) {
      apiSearchData(value, 2)
    } else {
      await getAllBranchData()
    }
  }
  const dateFormat = 'YYYY/MM/DD'
  const onClickClear = async () => {
    await getAllBranchData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setStoreSelect('default')
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict()
      console.log(res)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
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
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    apiProvinceData()
    getAllStoreData()
    getAllBranchData()
    apiDistrictData()
  }, [])
  const [districtMain, setDistrictMain] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object })
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function handleChangeCity(value) {
    apiFilterCityData(value)
  }

  function onChangeSwitch(checked, record) {
    apiUpdateBranchData(
      { ...record, active: checked },
      record.branch_id,
      checked ? 1 : 2
    )
  }

  return (
    <>
      <div className={styles['promotion_manager']}>
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
              Quản lý chi nhánh A
            </div>
          </Link>
          <div className={styles['promotion_manager_button']}>
            <BranchAdd />
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
                placeholder="Tìm kiếm theo mã, theo tên"
                allowClear
              />
            </div>
          </Col>
          <Col
            style={{
              width: '100%',
              marginTop: '1rem',
              marginLeft: '1rem',
              marginRight: '1rem',
            }}
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
                onChange={onChangeDate}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={storeSelect ? storeSelect : 'default'}
                onChange={handleChange}
              >
                <Option value="default">Tất cả cửa hàng</Option>
                {store &&
                  store.length > 0 &&
                  store.map((values, index) => {
                    return (
                      <Option value={values.store_id}>{values.name}</Option>
                    )
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
            rowKey="_id"
            loading={loading}
            bordered
            columns={columnsPromotion}
            dataSource={branch}
            style={{
              width: '100%',
            }}
          />
        </div>
      </div>
<<<<<<< HEAD

      <Drawer
        title="Cập nhật thông tin chi nhánh"
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
            <Button onClick={() => onCloseUpdateFunc(1)} type="primary">
              Cập nhật
            </Button>
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
                    if (data === 'name') {
                      const InputName = () => (
                        <Input
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
                              Tên chi nhánh
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'phone') {
                      const InputName = () => (
                        <Input
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
                    if (data === 'address') {
                      const InputName = () => (
                        <Input
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
                    if (data === 'ward') {
                      const InputName = () => (
                        <Select
                          defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          // onChange={handleChangeCity}

                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
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
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] = event
                          }}
                        >
                          {districtMain && districtMain.length > 0
                            ? districtMain &&
                              districtMain.length > 0 &&
                              districtMain.map((values, index) => {
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
                    if (data === 'store') {
                      const InputName = () => (
                        <Select
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
                            // const value =
                            //   event.target.value;
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
                  })}
                </Row>
              </Form>
            )
          })}
      </Drawer>

      <Drawer
        title="Cập nhật thông tin chi nhánh"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(2)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {arrayUpdate &&
          arrayUpdate.length > 0 &&
          arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            if (index === 0) {
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
                      if (data === 'name') {
                        const InputName = () => (
                          <Input
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
                                Tên chi nhánh
                              </div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'phone') {
                        const InputName = () => (
                          <Input
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
                                Liên hệ
                              </div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'address') {
                        const InputName = () => (
                          <Input
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
                      if (data === 'ward') {
                        const InputName = () => (
                          <Select
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
                            {districtMain && districtMain.length > 0
                              ? districtMain &&
                                districtMain.length > 0 &&
                                districtMain.map((values, index) => {
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
                      if (data === 'store') {
                        const InputName = () => (
                          <Select
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
                    })}
                  </Row>
                </Form>
              )
            }
          })}
      </Drawer>
      <Drawer
        visible={viewBranch}
        onClose={() => setViewBranch(false)}
        title="Chi tiết chi nhánh"
        width="75%"
      >
        <BranchView data={data} />
      </Drawer>
=======
>>>>>>> aa8f489e9e8f9a195ad41b314fd3b61fc2ec8042
    </>
  )
}
