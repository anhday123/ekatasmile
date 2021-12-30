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
import Permission from 'components/permission'
import TitlePage from 'components/title-page'
import SupplierForm from './supplier-form'
import columnsSupplier from './columns'
import SettingColumns from 'components/setting-columns'

//apis
import { apiAllEmployee } from 'apis/employee'
import { apiDistrict, apiProvince } from 'apis/information'
import { apiAllSupplier } from 'apis/supplier'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Supplier() {
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)

  const [columns, setColumns] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [valueSearch, setValueSearch] = useState('')
  const [valueDate, setValueDate] = useState(null)

  const [countSupplier, setCountSupplier] = useState(0)
  const [suppliers, setSuppliers] = useState([])
  const [users, setUsers] = useState([])
  const [districts, setDistricts] = useState([])
  const [provinces, setProvinces] = useState([])

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

  const _getSuppliers = async () => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
      const res = await apiAllSupplier({ ...paramsFilter, _creator: true })
      console.log(res)
      if (res.status === 200) {
        setSuppliers(res.data.data)
        setCountSupplier(res.data.count)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }

  const onClickClear = () => {
    setValueSearch('')
    setValueDate(null)
    setSelectedRowKeys([])

    setParamsFilter({ page: 1, page_size: 20 })
  }

  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict()
      if (res.status === 200) setDistricts(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince()
      if (res.status === 200) setProvinces(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const _getUsers = async () => {
    try {
      const res = await apiAllEmployee()
      if (res.status === 200) setUsers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getSuppliers()
  }, [paramsFilter])

  useEffect(() => {
    apiProvinceData()
    apiDistrictData()
    _getUsers()
  }, [])

  const _onFilter = async (attribute = '', value = '') => {
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  return (
    <div className={`${styles['supplier_manager']} ${styles['card']}`}>
      <TitlePage title="Quản lý nhà cung cấp">
        <SupplierForm reloadData={_getSuppliers}>
          <Permission permissions={[PERMISSIONS.them_nha_cung_cap]}>
            <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
              Thêm nhà cung cấp
            </Button>
          </Permission>
        </SupplierForm>
      </TitlePage>

      <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
        <Col xs={24} sm={24} md={11} lg={11} xl={8}>
          <Input
            size="large"
            value={valueSearch}
            enterButton
            onChange={onSearch}
            placeholder="Tìm kiếm theo mã, theo tên"
            allowClear
          />
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={8}>
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
            onChange={(value) => _onFilter('province', value)}
          >
            {provinces.map((province, index) => (
              <Option value={province.province_name} key={index}>
                {province.province_name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} xl={8}>
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
            onChange={(value) => _onFilter('district', value)}
          >
            {districts.map((district, index) => (
              <Option value={district.district_name} key={index}>
                {district.district_name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} xl={8}>
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
        <Col xs={24} sm={24} md={11} lg={11} xl={8}>
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
            onChange={(value) => _onFilter('creator_id', value)}
          >
            {users.map((user, index) => (
              <Option value={user.user_id} key={index}>
                {user.first_name || ''} {user.last_name || ''}
              </Option>
            ))}
          </Select>
        </Col>
        <Col style={{ display: Object.keys(paramsFilter).length < 3 && 'none' }}>
          <Button onClick={onClickClear} type="primary" size="large">
            Xóa tất cả lọc
          </Button>
        </Col>
      </Row>

      <Row justify="end" style={{ marginTop: 10 }}>
        <SettingColumns
          nameColumn="columnsSupplier"
          columns={columns}
          setColumns={setColumns}
          columnsDefault={columnsSupplier}
        />
      </Row>
      <Table
        style={{ marginTop: 5, width: '100%' }}
        size="small"
        rowKey="_id"
        // rowSelection={rowSelection}
        columns={columns.map((column) => {
          if (column.key === 'stt') return { ...column, render: (text, record, index) => index + 1 }
          if (column.key === 'code')
            return {
              ...column,
              render: (text, record) => (
                <SupplierForm reloadData={_getSuppliers} record={record}>
                  <a>{text}</a>
                </SupplierForm>
              ),
              sorter: (a, b) => compare(a, b, 'code'),
            }
          if (column.key === 'name') return { ...column, sorter: (a, b) => compare(a, b, 'name') }
          if (column.key === 'create_date')
            return {
              ...column,
              render: (text, record) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : ''),
              sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
            }
          if (column.key === 'email') return { ...column, sorter: (a, b) => compare(a, b, 'email') }
          if (column.key === 'phone') return { ...column, sorter: (a, b) => compare(a, b, 'phone') }
          if (column.key === 'address')
            return {
              ...column,
              render: (text, record) =>
                `${record.address && record.address + ', '}${
                  record.district && record.district + ', '
                }${record.province && record.province}`,
            }
          if (column.key === 'creator')
            return {
              ...column,
              render: (text, record) =>
                record._creator && record._creator.first_name + ' ' + record._creator.last_name,
              sorter: (a, b) =>
                (a._creator && a._creator.first_name + ' ' + a._creator.last_name).length -
                (b._creator && b._creator.first_name + ' ' + b._creator.last_name).length,
            }
          if (column.key === 'debt') return { ...column, render: () => <a>Công nợ</a> }

          return column
        })}
        dataSource={suppliers}
        loading={loading}
        pagination={{
          position: ['bottomLeft'],
          current: paramsFilter.page,
          pageSize: paramsFilter.page_size,
          pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            paramsFilter.page = page
            paramsFilter.page_size = pageSize
            setParamsFilter({ ...paramsFilter })
          },
          total: countSupplier,
        }}
      />
    </div>
  )
}
