import styles from './../supplier/supplier.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import {
  apiAllSupplier,
  apiSearch,
  apiUpdateSupplier,
} from '../../apis/supplier'
import { ACTION, PERMISSIONS } from './../../consts/index'
import moment from 'moment'
import { apiDistrict, apiProvince } from '../../apis/information'
import { useDispatch } from 'react-redux'
import {
  Switch,
  DatePicker,
  Form,
  Drawer,
  Select,
  notification,
  Input,
  Button,
  Table,
  Row,
  Col,
  Typography,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { apiFilterCity } from '../../apis/branch'
import SupplierAdd from 'views/actions/supplier/add'
import SupplierInformation from 'views/actions/supplier/information'
import Permission from 'components/permission'
import { compare } from 'utils'

const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
export default function Supplier() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [supplier, setSupplier] = useState([])
  const [viewSupplier, setViewSupplier] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const typingTimeoutRef = useRef(null)
  const apiSearchData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ search: value })

      if (res.status === 200) setSupplier(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end })
      if (res.status === 200) {
        setSupplier(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(0)

    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '')
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
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
      apiSearchData(value)
    }, 300)
  }

  const [arrayUpdate, setArrayUpdate] = useState([])

  const apiAllSupplierData = async () => {
    try {
      setLoading(true)
      const res = await apiAllSupplier()
      if (res.status === 200) {
        setSupplier(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const openNotificationDeleteSupplier = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data === 2
          ? 'Vô hiệu hóa nhà cung cấp thành công.'
          : 'Kích hoạt nhà cung cấp thành công',
    })
  }
  const apiUpdateSupplierData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await apiUpdateSupplier(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllSupplierData()
        openNotificationDeleteSupplier(data)
        setSelectedRowKeys([])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  function onChangeSwitch(checked, record) {
    const object = {
      active: checked,
    }
    apiUpdateSupplierData(object, record.supplier_id, checked ? 1 : 2)
  }

  useEffect(() => {
    apiAllSupplierData()
  }, [])

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

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    supplier &&
      supplier.length > 0 &&
      supplier.forEach((values, index) => {
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
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: `${data} phải là số và có độ dài là 10`,
    })
  }
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gmail phải ở dạng @gmail.com.',
    })
  }
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Cập nhật thông tin nhà cung cấp <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Lỗi cập nhật thông tin nhà cung cấp',
    })
  }
  const apiUpdateSupplierDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateSupplier(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllSupplierData()
        openNotificationUpdate(object.name)
        setSelectedRowKeys([])
        onCloseUpdate()
        onClose()
      } else {
        openNotificationErrorUpdate()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function validateEmail(email) {
    const re =
      /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/
    return re.test(String(email).toLowerCase())
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (validateEmail(values.email)) {
            if (isNaN(values.phone)) {
              openNotificationRegisterFailMailRegex('Liên hệ')
            } else {
              if (regex.test(values.phone)) {
                const object = {
                  name: values.name.toLowerCase(),
                  email: values.email,
                  phone: values.phone,
                  address:
                    values && values.address
                      ? values.address.toLowerCase()
                      : '',
                  // ward: ' ',
                  district: values.district.toLowerCase(),
                  province: values.province.toLowerCase(),
                  active: true,
                }
                console.log(object)
                apiUpdateSupplierDataUpdate(object, values.supplier_id)
              } else {
                openNotificationRegisterFailMailRegex('Liên hệ')
              }
            }
          } else {
            openNotificationRegisterFailMail()
          }
        })
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (validateEmail(values.email)) {
            if (isNaN(values.phone)) {
              openNotificationRegisterFailMailRegex('Liên hệ')
            } else {
              if (regex.test(values.phone)) {
                const object = {
                  name: values.name.toLowerCase(),
                  email: values.email,
                  phone: values.phone,
                  address:
                    arrayUpdate[0] && arrayUpdate[0].address
                      ? arrayUpdate[0].address.toLowerCase()
                      : '',
                  ward: ' ',
                  district: arrayUpdate[0].district.toLowerCase(),
                  province: arrayUpdate[0].province.toLowerCase(),
                  active: true,
                }
                console.log(object)
                apiUpdateSupplierDataUpdate(object, values.supplier_id)
              } else {
                openNotificationRegisterFailMailRegex('Liên hệ')
              }
            }
          } else {
            openNotificationRegisterFailMail()
          }
        })
    }
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const dateFormat = 'YYYY/MM/DD'

  const onClickClear = async () => {
    await apiAllSupplierData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setCity('')
    setDistrictSelect('')
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
  }, [])
  useEffect(() => {
    apiProvinceData()
  }, [])
  const columns = [
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => (
        <span
          style={{ color: '#0019FF', cursor: 'pointer' }}
          onClick={() => {
            setData(record)
            setViewSupplier(true)
          }}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => <div>{text}</div>,
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
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
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      sorter: (a, b) => compare(a, b, 'email'),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
      sorter: (a, b) => compare(a, b, 'phone'),
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

  const apiSearchProvinceData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ province: value })

      if (res.status === 200) setSupplier(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const apiSearchDistrictData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ district: value })

      if (res.status === 200) setSupplier(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [city, setCity] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`)
    setCity(value)
    if (value !== 'default') {
      apiSearchProvinceData(value)
    } else {
      await apiAllSupplierData()
    }
  }
  const [districtSelect, setDistrictSelect] = useState('')
  const handleChangeDistrict = async (value) => {
    setDistrictSelect(value)
    if (value !== 'default') {
      apiSearchDistrictData(value)
    } else {
      await apiAllSupplierData()
    }
  }
  return (
    <>
      <div className={`${styles['supplier_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(241, 236, 236)',
            paddingBottom: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['supplier_manager_title']}>
            Quản lý nhà cung cấp
          </div>
          <Permission permissions={[PERMISSIONS.them_nha_cung_cap]}>
            <Button
              size="large"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={showDrawerUpdate}
            >
              Thêm nhà cung cấp
            </Button>
          </Permission>
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
                value={city ? city : 'default'}
                onChange={(event) => {
                  handleChange(event)
                  handleChangeCity(event)
                }}
              >
                <Option value="default">Tất cả tỉnh/thành phố</Option>
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
                value={districtSelect ? districtSelect : 'default'}
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
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div>
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
                onChange={onChangeDate}
              />
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
            <Permission permissions={[PERMISSIONS.cap_nhat_nha_cung_cap]}>
              <Button type="primary" onClick={showDrawer} size="large">
                Cập nhật thông tin
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
            size="small"
            rowKey="_id"
            rowSelection={rowSelection}
            bordered
            columns={columns}
            dataSource={supplier}
            loading={loading}
            scroll={{ y: 500 }}
          />
        </div>
      </div>

      <Drawer
        title="Cập nhật thông tin nhà cung cấp"
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
                              Tên nhà cung cấp
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
                    if (data === 'email') {
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
                              Email
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'province') {
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
        title="Thêm nhà cung cấp"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <SupplierAdd close={onCloseUpdate} reload={apiAllSupplierData} />
      </Drawer>
      <Drawer
        visible={viewSupplier}
        onClose={() => setViewSupplier(false)}
        title="Chi tiết nhà cung cấp"
        width="75%"
      >
        <SupplierInformation data={data} />
      </Drawer>
    </>
  )
}
