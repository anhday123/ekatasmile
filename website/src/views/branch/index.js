import styles from './../customer/customer.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, PERMISSIONS } from 'consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { compare } from 'utils'

//icons
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons'

//antd
import {
  Switch,
  Drawer,
  Input,
  Row,
  Col,
  DatePicker,
  notification,
  Select,
  Table,
  Button,
  Popover,
} from 'antd'

//components
import BranchForm from './branch-form'
import Permission from 'components/permission'
import TitlePage from 'components/title-page'
import SettingColumns from 'components/setting-columns'
import columnsBranch from './columns'

//apis
import { getDistricts, getProvinces } from 'apis/address'
import { getAllBranch, updateBranch } from 'apis/branch'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Branch() {
  const typingTimeoutRef = useRef(null)

  const [columns, setColumns] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])
  const [countBranch, setCountBranch] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [districts, setDistricts] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districtsDefault, setDistrictsDefault] = useState([])
  const [valueSearch, setValueSearch] = useState('')
  const [valueDate, setValueDate] = useState(null)

  function onChangeDate(date, dateStrings) {
    if (date) {
      setValueDate(date)
      paramsFilter.from_date = dateStrings[0]
      paramsFilter.to_date = dateStrings[1]
    } else {
      setValueDate(null)
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }
    setParamsFilter({ ...paramsFilter, page: 1 })
  }

  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.search = value
      else delete paramsFilter.search

      setParamsFilter({ ...paramsFilter, page: 1 })
    }, 750)
  }

  const _editBranch = async (body, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await updateBranch(body, id)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          dispatch({
            type: ACTION.LOGIN,
            data: { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken },
          })
          _getBranches()
          notification.success({ message: 'Cập nhật thành công' })
        } else
          notification.error({
            message: res.data.message || 'Cập nhật thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Cập nhật thất bại, vui lòng thử lại!',
        })

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  const _getBranches = async () => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
      const res = await getAllBranch({ ...paramsFilter, _creator: true })
      console.log(res)
      if (res.status === 200) {
        setBranches(res.data.data)
        setCountBranch(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onClickClear = async () => {
    setParamsFilter({ page: 1, page_size: 20 })
    setValueSearch('')
    setValueDate(null)
  }

  const _getDistricts = async () => {
    try {
      const res = await getDistricts()
      if (res.status === 200) {
        setDistricts(res.data.data)
        setDistrictsDefault(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const _getProvinces = async () => {
    try {
      const res = await getProvinces()
      if (res.status === 200) {
        setProvinces(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getBranches()
  }, [paramsFilter])

  useEffect(() => {
    _getProvinces()
    _getDistricts()
  }, [])

  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <TitlePage title="Danh sách kho">
          <Permission permissions={[PERMISSIONS.them_chi_nhanh]}>
            <BranchForm reloadData={_getBranches}>
              <Button size="large" icon={<PlusCircleOutlined />} type="primary">
                Thêm kho
              </Button>
            </BranchForm>
          </Permission>
        </TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: 15 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input
              size="large"
              style={{ width: '100%' }}
              name="name"
              value={valueSearch}
              enterButton
              onChange={onSearch}
              placeholder="Tìm kiếm theo mã, theo tên"
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <RangePicker
              size="large"
              className="br-15__date-picker"
              value={valueDate}
              style={{ width: '100%' }}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              onChange={onChangeDate}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo kho"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.warehouse_type}
              onChange={(value) => {
                if (value) paramsFilter.warehouse_type = value
                else delete paramsFilter.warehouse_type

                setParamsFilter({ ...paramsFilter, page: 1 })
              }}
            >
              <Option value="so huu">Kho sở hữu</Option>
              <Option value="dich vu">Kho thuê dịch vụ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo tỉnh/thành phố"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.province}
              onChange={(value) => {
                if (value) {
                  paramsFilter.province = value
                  const districtsByProvince = districtsDefault.filter(
                    (e) => e.province_name === value
                  )
                  setDistricts([...districtsByProvince])
                } else {
                  delete paramsFilter.province
                  setDistricts([...districtsDefault])
                }

                setParamsFilter({ ...paramsFilter, page: 1 })
              }}
            >
              {provinces.map((values, index) => {
                return (
                  <Option value={values.province_name} key={index}>
                    {values.province_name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo quận/huyện"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.district}
              onChange={(value) => {
                if (value) paramsFilter.district = value
                else delete paramsFilter.district

                setParamsFilter({ ...paramsFilter, page: 1 })
              }}
            >
              {districts.map((values, index) => {
                return (
                  <Option value={values.district_name} key={index}>
                    {values.district_name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Button
              style={{ display: Object.keys(paramsFilter).length < 3 && 'none' }}
              onClick={onClickClear}
              type="primary"
              size="large"
            >
              Xóa tất cả lọc
            </Button>
          </Col>
        </Row>

        <Row justify="space-between" style={{ marginTop: 15 }}>
          <Button
            type="primary"
            size="large"
            style={{ visibility: !selectedRowKeys.length && 'hidden', width: 100 }}
            danger
          >
            Xóa
          </Button>
          <SettingColumns
            columnsDefault={columnsBranch}
            columns={columns}
            setColumns={setColumns}
            nameColumn="columnsBranch"
          />
        </Row>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          style={{ width: '100%', marginTop: 5 }}
          rowKey="branch_id"
          size="small"
          loading={loading}
          columns={columns.map((column) => {
            if (column.key === 'code')
              return {
                ...column,
                sorter: (a, b) => compare(a, b, 'code'),
                render: (text, record) => (
                  <BranchForm reloadData={_getBranches} record={record}>
                    <a>{record.code}</a>
                  </BranchForm>
                ),
              }
            if (column.key === 'name') return { ...column, sorter: (a, b) => compare(a, b, 'name') }
            if (column.key === 'create_date')
              return {
                ...column,
                render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : ''),
                sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
              }
            if (column.key === 'phone')
              return { ...column, sorter: (a, b) => compare(a, b, 'phone') }
            if (column.key === 'image')
              return {
                ...column,
                render: (text, record) => (
                  <Popover
                    content={
                      <img src={record.logo || ''} alt="" style={{ width: 350, height: 350 }} />
                    }
                  >
                    <img
                      src={record.logo || ''}
                      alt=""
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                    />
                  </Popover>
                ),
              }
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
            if (column.key === 'action')
              return {
                ...column,
                render: (text, record) => (
                  <Switch
                    checked={record.active}
                    onChange={(checked) => _editBranch({ active: checked }, record.branch_id)}
                  />
                ),
              }

            return column
          })}
          dataSource={branches}
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 50, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            total: countBranch,
          }}
        />
      </div>
    </>
  )
}
