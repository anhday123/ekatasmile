import React, { useState, useEffect, useRef } from 'react'
import styles from './supplier.module.scss'
import { ACTION, PERMISSIONS } from 'consts'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { compare } from 'utils'

//antd
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
  Modal,
} from 'antd'

//icons
import { PlusCircleOutlined } from '@ant-design/icons'

//components
import SupplierAdd from 'views/actions/supplier/add'
import SupplierInformation from 'views/actions/supplier/information'
import Permission from 'components/permission'

//apis
import { apiAllEmployee } from 'apis/employee'
import { apiDistrict, apiProvince } from 'apis/information'
import { apiAllSupplier, apiUpdateSupplier } from 'apis/supplier'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Supplier() {
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [supplier, setSupplier] = useState([])
  const [viewSupplier, setViewSupplier] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [valueSearch, setValueSearch] = useState('')
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [valueDate, setValueDate] = useState(null)
  const [users, setUsers] = useState([])
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  function onChangeDate(dates, dateStrings) {
    setValueDate(dates)

    if (dates) {
      paramsFilter.from_date = dateStrings[0]
      paramsFilter.to_date = dateStrings[1]
    } else {
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }
  const onSearch = (e) => {
    const value = e.target.value

    setValueSearch(value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) paramsFilter.search = value
      else delete paramsFilter.search
      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 650)
  }

  const apiAllSupplierData = async (params) => {
    try {
      setLoading(true)
      const res = await apiAllSupplier({ ...params, _creator: true })
      console.log(res)
      if (res.status === 200) setSupplier(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const openNotificationDeleteSupplier = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data === 2 ? 'Vô hiệu hóa nhà cung cấp thành công.' : 'Kích hoạt nhà cung cấp thành công',
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
                  address: values && values.address ? values.address.toLowerCase() : '',
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

  const onClickClear = () => {
    Object.keys(paramsFilter).map((key) => delete paramsFilter[key])
    paramsFilter.page = 1
    paramsFilter.page_size = 20
    setValueSearch('')
    setValueDate(null)
    setSelectedRowKeys([])

    setParamsFilter({ ...paramsFilter })
  }

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
  const _getUsers = async () => {
    try {
      const res = await apiAllEmployee()
      if (res.status === 200) setUsers(res.data.data)
    } catch (error) {}
  }

  useEffect(() => {
    apiAllSupplierData(paramsFilter)
  }, [paramsFilter])

  useEffect(() => {
    apiProvinceData()
    apiDistrictData()
    _getUsers()
  }, [])
  const columns = [
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'code',
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
      render: (text, record) => <div>{text}</div>,
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      sorter: (a, b) => compare(a, b, 'district'),
    },
    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'province',
      sorter: (a, b) => compare(a, b, 'province'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => compare(a, b, 'email'),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => compare(a, b, 'address'),
    },
    {
      title: 'Người tạo',
      render: (text, record) =>
        record._creator && record._creator.first_name + ' ' + record._creator.last_name,
      sorter: (a, b) =>
        (a._creator && a._creator.first_name + ' ' + a._creator.last_name).length -
        (b._creator && b._creator.first_name + ' ' + b._creator.last_name).length,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 100,
      render: (text, record) =>
        text ? (
          <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        ),
    },
  ]

  const handleChangeSelect = async (attribute = '', value = '') => {
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
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
          <div className={styles['supplier_manager_title']}>Quản lý nhà cung cấp</div>
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
        <Row>
          <Col style={{ marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Input
              size="large"
              value={valueSearch}
              enterButton
              onChange={onSearch}
              className={styles['orders_manager_content_row_col_search']}
              placeholder="Tìm kiếm theo mã, theo tên"
              allowClear
            />
          </Col>

          <Col
            style={{ marginTop: '1rem', marginLeft: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
              allowClear
              style={{ width: '100%' }}
              size="large"
              showSearch
              placeholder="Lọc theo tỉnh/thành phố"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.province}
              onChange={(value) => handleChangeSelect('province', value)}
            >
              {province.map((values, index) => (
                <Option value={values.province_name} key={index}>
                  {values.province_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
              allowClear
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Lọc theo quận/huyện"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.district}
              onChange={(value) => handleChangeSelect('district', value)}
            >
              {district.map((values, index) => (
                <Option value={values.district_name}>{values.district_name}</Option>
              ))}
            </Select>
          </Col>
          <Col style={{ marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <RangePicker
              size="large"
              className="br-15__date-picker"
              style={{ width: '100%' }}
              value={valueDate}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              onChange={onChangeDate}
            />
          </Col>
          <Col
            style={{ marginTop: '1rem', marginLeft: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
              allowClear
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Lọc theo người tạo"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.creator_id}
              onChange={(value) => handleChangeSelect('creator_id', value)}
            >
              {users.map((user, index) => (
                <Option value={user.user_id} key={index}>
                  {user.first_name || ''} {user.last_name || ''}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            style={{
              marginTop: '1rem',
              marginLeft: '1rem',
              display: Object.keys(paramsFilter).length < 3 && 'none',
            }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Button onClick={onClickClear} type="primary" size="large">
              Xóa tất cả lọc
            </Button>
          </Col>
        </Row>

        {selectedRowKeys.length > 0 ? (
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
            columns={columns}
            dataSource={supplier}
            loading={loading}
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
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(value) => {
                            arrayUpdate[index][data] = value
                          }}
                        >
                          {province &&
                            province.length > 0 &&
                            province.map((values, index) => {
                              return (
                                <Option value={values.province_name}>{values.province_name}</Option>
                              )
                            })}
                        </Select>
                      )
                      return (
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
                        >
                          {district.map((values, index) => (
                            <Option value={values.district_name}>{values.district_name}</Option>
                          ))}
                        </Select>
                      )
                      return (
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
      <Modal
        footer=""
        visible={viewSupplier}
        onCancel={() => setViewSupplier(false)}
        title="Chi tiết nhà cung cấp"
        width={650}
      >
        <SupplierInformation data={data} />
      </Modal>
    </>
  )
}
