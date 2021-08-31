import styles from './../inventory/inventory.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, PERMISSIONS } from 'consts/index'
import moment from 'moment'
import { useDispatch } from 'react-redux'

//antd
import {
  Switch,
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  notification,
  Col,
  DatePicker,
  Select,
  Table,
} from 'antd'

//icons
import { PlusCircleOutlined } from '@ant-design/icons'

//apis
import { apiAllInventory, apiSearch, apiUpdateInventory } from 'apis/inventory'
import { apiDistrict, apiProvince } from 'apis/information'
import { apiFilterCity } from 'apis/branch'

//components
import InventoryAdd from 'views/actions/inventory/add'
import InventoryView from 'views/actions/inventory/view'
import Permission from 'components/permission'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Inventory() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [showView, setShowView] = useState(false)
  const [inventory, setInventory] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [countInventory, setCountInventory] = useState(0)

  const openNotificationDelete = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data === 2 ? 'Vô hiệu hóa kho thành công.' : 'Kích hoạt kho thành công',
    })
  }
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Cập nhật thông tin kho <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationUpdateError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Lỗi cập nhật thông tin kho.',
    })
  }
  const apiUpdateInventoryData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await apiUpdateInventory(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllInventoryData({ ...paramsFilter })
        setSelectedRowKeys([])
        openNotificationDelete(data)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`)
    const object = {
      active: checked,
    }
    apiUpdateInventoryData(object, record.warehouse_id, checked ? 1 : 2)
  }

  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const { value } = e.target
      if (value) paramsFilter.keyword = value
      else delete paramsFilter.keyword

      setParamsFilter({ page: 1, ...paramsFilter })
    }, 750)
  }
  function formatCash(str) {
    if (isNaN(str) || str.length === 0) {
      return 0
    } else {
      return str
        .split('')
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 3 ? next : next + ',') + prev
        })
    }
  }

  const dateFormat = 'YYYY/MM/DD'
  const columnsPromotion = [
    {
      title: 'Mã kho',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => (
        <span
          onClick={() => {
            setData(record)
            setShowView(true)
          }}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Tên kho',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
    },
    {
      title: 'Loại kho',
      dataIndex: 'type',
      width: 150,
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
      title: 'Phí duy trì tháng',
      dataIndex: 'monthly_cost',
      width: 150,
      render: (text, record) => <div>{`${formatCash(String(text))} VNĐ`}</div>,
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Switch checked={text} onChange={(e) => onChangeSwitch(e, record)} />
      ),
    },
  ]

  const apiAllInventoryData = async (params) => {
    try {
      setLoading(true)
      const res = await apiAllInventory(params)
      console.log(res)
      if (res.status === 200) {
        setInventory(res.data.data)
        setCountInventory(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const [valueSearchDate, setValueSearchDate] = useState(null)
  function onChangeDate(dates, dateStrings) {
    if (dates) {
      setValueSearchDate(dates)
      paramsFilter.from_date = dateStrings[0]
      paramsFilter.to_date = dateStrings[1]
    } else {
      setValueSearchDate(null)
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }
    setParamsFilter({ page: 1, ...paramsFilter })
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

  const [arrayUpdate, setArrayUpdate] = useState([])
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    inventory &&
      inventory.length > 0 &&
      inventory.forEach((values, index) => {
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

  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description: `${data} phải là số và có độ dài là 10`,
    })
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  const apiUpdateInventoryDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateInventory(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllInventoryData({ ...paramsFilter })
        setSelectedRowKeys([])

        onClose()
        openNotificationUpdate(object.name)
        onCloseUpdate()
      } else {
        openNotificationUpdateError()
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      console.log(arrayUpdate)
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (isNaN(values.phone)) {
            if (isNaN(values.phone)) {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          } else {
            if (regex.test(values.phone)) {
              const object = {
                name: values.name,
                type: values.type,
                phone: values.phone,
                capacity: values.capacity,
                monthly_cost:
                  values && values.monthly_cost ? values.monthly_cost : '',
                address: values.address,
                district: values.district,
                province: values.province,
              }
              console.log(object)
              apiUpdateInventoryDataUpdate(object, values.warehouse_id)
            } else {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          }
        })
    } else {
      console.log(arrayUpdate)
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (isNaN(values.phone)) {
            if (isNaN(values.phone)) {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          } else {
            if (regex.test(values.phone)) {
              const object = {
                name: values.name,
                type: arrayUpdate[0].type,
                phone: values.phone,
                capacity: arrayUpdate[0].capacity,
                monthly_cost:
                  arrayUpdate[0] && arrayUpdate[0].monthly_cost
                    ? arrayUpdate[0].monthly_cost
                    : '',
                address: arrayUpdate[0].address,
                district: arrayUpdate[0].district,
                province: arrayUpdate[0].province,
              }
              console.log(object)
              apiUpdateInventoryDataUpdate(object, values.warehouse_id)
            } else {
              openNotificationErrorFormatPhone('Liên hệ')
            }
          }
        })
    }
  }

  const onClickClear = async () => {
    setParamsFilter({ page: 1, page_size: paramsFilter.page_size })
    setValueSearch('')
    setValueSearchDate()
    setSelectedRowKeys([])
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiDistrictData()
    apiProvinceData()
  }, [])

  useEffect(() => {
    apiAllInventoryData({ ...paramsFilter })
  }, [paramsFilter])

  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object })
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function handleChangeCity(value) {
    console.log(`selected ${value}`)
    apiFilterCityData(value)
  }

  const handleChange = (value) => {
    if (value) paramsFilter.province = value
    else delete paramsFilter.province

    setParamsFilter({ page: 1, ...paramsFilter })
  }
  const handleChangeDistrict = async (value) => {
    if (value) paramsFilter.district = value
    else delete paramsFilter.district

    setParamsFilter({ page: 1, ...paramsFilter })
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
          <div className={styles['promotion_manager_title']}>Quản lý kho</div>
          <div className={styles['promotion_manager_button']}>
            <Permission permissions={[PERMISSIONS.them_kho]}>
              <Button
                size="large"
                icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                type="primary"
                onClick={showDrawerUpdate}
              >
                Thêm kho
              </Button>
            </Permission>
          </div>
        </div>
        <Row
          align="middle"
          justify="space-between"
          style={{
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
                enterButton
                name="name"
                value={valueSearch}
                onChange={onSearch}
                className={styles['orders_manager_content_row_col_search']}
                placeholder="Tìm kiếm theo mã, theo tên"
                allowClear
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
              <RangePicker
                size="large"
                className="br-15__date-picker"
                value={valueSearchDate}
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
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                allowClear
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn thành phố"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={paramsFilter.province}
                onChange={(event) => {
                  handleChange(event)
                  handleChangeCity(event)
                }}
              >
                {province.map((values, index) => {
                  return (
                    <Option value={values.province_name} key={index}>
                      {values.province_name}
                    </Option>
                  )
                })}
              </Select>
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
                allowClear
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn quận/huyện"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={paramsFilter.district}
                onChange={handleChangeDistrict}
              >
                <Option value="default">Tất cả quận/huyện</Option>
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
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <Permission permissions={[PERMISSIONS.cap_nhat_kho]}>
              <Button size="large" type="primary" onClick={showDrawer}>
                Cập nhật thông tin kho
              </Button>
            </Permission>
          </div>
        ) : (
          ''
        )}
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
            size="small"
            rowSelection={rowSelection}
            columns={columnsPromotion}
            dataSource={inventory}
            pagination={{
              position: ['bottomLeft'],
              current: paramsFilter.page,
              defaultPageSize: 20,
              pageSizeOptions: [20, 30, 50, 100],
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setSelectedRowKeys([])
                paramsFilter.page = page
                paramsFilter.page_size = pageSize
                setParamsFilter({ ...paramsFilter })
              },
              total: countInventory,
            }}
          />
        </div>
      </div>

      <Drawer
        title="Cập nhật thông tin kho"
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
            <Button
              onClick={() => onCloseUpdateFunc(1)}
              type="primary"
              size="large"
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        {arrayUpdate.map((values, index) => {
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
                  if (data === 'name') {
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
                            Tên kho
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
                  if (data === 'type') {
                    const InputName = () => (
                      <Select
                        size="large"
                        style={{ width: '100%' }}
                        defaultValue={values[data]}
                        onChange={(event) => {
                          arrayUpdate[index][data] = event
                        }}
                      >
                        <Option value="chung">Chung</Option>
                        <Option value="riêng">Riêng</Option>
                        <Option value="dịch vụ">Dịch vụ</Option>
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
                            Loại kho
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
                  if (data === 'monthly_cost') {
                    const InputName = () => (
                      <InputNumber
                        size="large"
                        className="br-15__input"
                        style={{ width: '100%' }}
                        defaultValue={values[data]}
                        onChange={(event) => {
                          arrayUpdate[index][data] = isNaN(event)
                            ? 0
                            : event === 0
                            ? 0
                            : event
                        }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
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
                            Phí duy trì tháng
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
        title="Thêm kho"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <InventoryAdd
          close={onCloseUpdate}
          reload={() => apiAllInventoryData({ ...paramsFilter })}
        />
      </Drawer>
      <Drawer
        visible={showView}
        width="75%"
        onClose={() => setShowView(false)}
        title="Thông tin chi tiết kho"
      >
        <InventoryView data={data} />
      </Drawer>
    </>
  )
}
