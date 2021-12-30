import React, { useEffect, useState, useRef } from 'react'
import styles from './customer.module.scss'
import moment from 'moment'
import { PERMISSIONS, ROUTES } from 'consts'
import { compare, compareCustom, formatCash, tableSum } from 'utils'
import { Link } from 'react-router-dom'

//antd
import {
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  notification,
  Drawer,
  Modal,
  Checkbox,
  Space,
  Popconfirm,
} from 'antd'

//icons
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons'

//components
import CustomerUpdate from 'views/actions/customer/update'
import CustomerAdd from 'views/actions/customer/add'
import Permission from 'components/permission'
import SettingColumns from 'components/setting-columns'
import columnsCustomer from './columnsCustomer'
import TitlePage from 'components/title-page'

//apis
import { getCustomer, deleteCustomers } from 'apis/customer'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Customer() {
  const typingTimeoutRef = useRef(null)

  const [columns, setColumns] = useState([])
  const [countCustomer, setCountCustomer] = useState(0)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [customers, setCustomers] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [infoCustomer, setInfoCustomer] = useState({})
  const [showCreate, setShowCreate] = useState(false)

  const [customerUpdateDrawer, setCustomerUpdateDrawer] = useState(false)
  const [customerUpdate, setCustomerUpdate] = useState({})
  const [valueSearch, setValueSearch] = useState('')
  const [optionSearch, setOptionSearch] = useState('name')

  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)

  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      setParamsFilter({ ...paramsFilter, page: 1 })
    }, 750)
  }

  function onChangeTypeCustomer(value) {
    if (value) paramsFilter.type = value
    else delete paramsFilter.type
    setParamsFilter({ page: 1, ...paramsFilter })
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const _getCustomers = async () => {
    try {
      setTableLoading(true)
      setSelectedRowKeys([])
      const res = await getCustomer(paramsFilter)
      console.log(res)
      if (res.status === 200) {
        setCustomers(res.data.data.filter((e) => e.active))
        setCountCustomer(res.data.count)
      }
      setTableLoading(false)
    } catch (e) {
      console.log(e)
      setTableLoading(false)
    }
  }

  const _deleteCustomers = async () => {
    try {
      setTableLoading(true)
      const res = await deleteCustomers(selectedRowKeys)
      console.log(res)
      setTableLoading(false)
      if (res.status === 200) {
        if (res.data.success) {
          _getCustomers()
          notification.success({ message: 'Xóa khách hàng thành công!' })
        } else
          notification.error({
            message: res.data.message || 'Xóa khách hàng thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xóa khách hàng thất bại, vui lòng thử lại!',
        })
    } catch (error) {
      console.log(error)
      setTableLoading(false)
    }
  }

  const clearFilter = () => {
    setValueSearch('')
    setParamsFilter({ page: 1, page_size: 20 })
    setValueDateTimeSearch({})
    setValueTime()
    setValueDateSearch(null)
  }

  useEffect(() => {
    _getCustomers()
  }, [paramsFilter])

  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <TitlePage title="Quản lý khách hàng">
          <Permission permissions={[PERMISSIONS.them_khach_hang]}>
            <Button
              size="large"
              icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
              type="primary"
              onClick={() => setShowCreate(true)}
            >
              Thêm khách hàng
            </Button>
          </Permission>
        </TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: 15 }}>
          <Col xs={24} sm={24} md={11} lg={11} xl={11}>
            <Row wrap={false} style={{ width: '100%' }}>
              <Input
                size="large"
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo tên"
                value={valueSearch}
                onChange={(e) => onSearch(e)}
                allowClear
              />
              <Select
                size="large"
                style={{ width: 160 }}
                value={optionSearch}
                onChange={(value) => setOptionSearch(value)}
              >
                <Option value="name">Tên khách hàng</Option>
                <Option value="phone">SDT khách hàng</Option>
                <Option value="code">Mã khách hàng</Option>
              </Select>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={6}>
            <Select
              size="large"
              open={isOpenSelect}
              onBlur={() => {
                if (isOpenSelect) toggleOpenSelect()
              }}
              onClick={() => {
                if (!isOpenSelect) toggleOpenSelect()
              }}
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder="Lọc theo thời gian nhập kho"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={valueTime}
              onChange={async (value) => {
                setValueTime(value)

                paramsFilter.page = 1

                //xoa params search date hien tai
                const p = Object.keys(valueDateTimeSearch)
                if (p.length) delete paramsFilter[p[0]]

                setValueDateSearch(null)
                delete paramsFilter.from_date
                delete paramsFilter.to_date

                if (isOpenSelect) toggleOpenSelect()

                if (value) {
                  const searchDate = Object.fromEntries([[value, true]]) // them params search date moi

                  setParamsFilter({ ...paramsFilter, ...searchDate })
                  setValueDateTimeSearch({ ...searchDate })
                } else {
                  setParamsFilter({ ...paramsFilter })
                  setValueDateTimeSearch({})
                }
              }}
              dropdownRender={(menu) => (
                <>
                  <RangePicker
                    onFocus={() => {
                      if (!isOpenSelect) toggleOpenSelect()
                    }}
                    onBlur={() => {
                      if (isOpenSelect) toggleOpenSelect()
                    }}
                    value={valueDateSearch}
                    onChange={(dates, dateStrings) => {
                      //khi search hoac filter thi reset page ve 1
                      paramsFilter.page = 1

                      if (isOpenSelect) toggleOpenSelect()

                      //nếu search date thì xoá các params date
                      delete paramsFilter.to_day
                      delete paramsFilter.yesterday
                      delete paramsFilter.this_week
                      delete paramsFilter.last_week
                      delete paramsFilter.last_month
                      delete paramsFilter.this_month
                      delete paramsFilter.this_year
                      delete paramsFilter.last_year

                      //Kiểm tra xem date có được chọn ko
                      //Nếu ko thì thoát khỏi hàm, tránh cash app
                      //và get danh sách order
                      if (!dateStrings[0] && !dateStrings[1]) {
                        delete paramsFilter.from_date
                        delete paramsFilter.to_date

                        setValueDateSearch(null)
                        setValueTime()
                      } else {
                        const dateFirst = dateStrings[0]
                        const dateLast = dateStrings[1]
                        setValueDateSearch(dates)
                        setValueTime(`${dateFirst} -> ${dateLast}`)

                        dateFirst.replace(/-/g, '/')
                        dateLast.replace(/-/g, '/')

                        paramsFilter.from_date = dateFirst
                        paramsFilter.to_date = dateLast
                      }

                      setParamsFilter({ ...paramsFilter })
                    }}
                    style={{ width: '100%' }}
                  />
                  {menu}
                </>
              )}
            >
              <Option value="today">Hôm nay</Option>
              <Option value="yesterday">Hôm qua</Option>
              <Option value="this_week">Tuần này</Option>
              <Option value="last_week">Tuần trước</Option>
              <Option value="this_month">Tháng này</Option>
              <Option value="last_month">Tháng trước</Option>
              <Option value="this_year">Năm này</Option>
              <Option value="last_year">Năm trước</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={7}>
            <Select
              size="large"
              style={{ width: '100%' }}
              placeholder="Lọc theo loại khách hàng"
              value={paramsFilter.type}
              onChange={onChangeTypeCustomer}
              allowClear
            >
              <Option value="TIỀM NĂNG">Khách hàng tiềm năng</Option>
              <Option value="VÃNG LAI">Khách hàng vãng lai</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20, marginBottom: 5 }} justify="space-between">
          <Permission permissions={[PERMISSIONS.cap_nhat_khach_hang]}>
            <Popconfirm
              title="Bạn có muốn xóa khách hàng này không?"
              cancelText="Từ chối"
              okText="Đồng ý"
              onConfirm={_deleteCustomers}
            >
              <Button
                danger
                size="large"
                type="primary"
                style={{ width: 100, visibility: !selectedRowKeys.length && 'hidden' }}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Permission>
          <Space>
            <Button
              style={{ display: Object.keys(paramsFilter).length < 3 && 'none' }}
              onClick={clearFilter}
              type="primary"
              size="large"
            >
              Xóa bộ lọc
            </Button>
            <Button
              icon={<DownloadOutlined />}
              style={{
                backgroundColor: 'green',
                borderColor: 'green',
                display: !selectedRowKeys.length && 'none',
              }}
              type="primary"
              size="large"
            >
              Xuất file excel
            </Button>
            <SettingColumns
              columnsDefault={columnsCustomer}
              setColumns={setColumns}
              columns={columns}
              nameColumn="columnsCustomer"
            />
          </Space>
        </Row>

        <Table
          style={{ width: '100%', marginBottom: 5 }}
          rowSelection={rowSelection}
          rowKey="customer_id"
          loading={tableLoading}
          columns={columns.map((column) => {
            if (column.key === 'code')
              return {
                ...column,
                render: (text, record) => (
                  <a
                    onClick={() => {
                      setCustomerUpdateDrawer(true)
                      setCustomerUpdate(record)
                    }}
                  >
                    {record.code}
                  </a>
                ),
              }
            if (column.key === 'name')
              return {
                ...column,
                render: (text, record) => record.first_name + ' ' + record.last_name,
              }

            if (column.key === 'create_date')
              return {
                ...column,
                render: (text, record) =>
                  record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
              }

            if (column.key === 'birthday')
              return {
                ...column,
                render: (text, record) =>
                  record.birthday && moment(record.birthday).format('DD-MM-YYYY HH:mm'),
              }

            if (column.key === 'address')
              return {
                ...column,
                render: (text, record) =>
                  `${record.address && record.address + ', '}${
                    record.district && record.district + ', '
                  }${record.province && record.province}`,
              }

            return column
          })}
          dataSource={customers}
          size="small"
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 70, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize })
            },
            total: countCustomer,
          }}
        />
      </div>

      <CustomerUpdate
        customerData={[customerUpdate]}
        visible={customerUpdateDrawer}
        onClose={() => setCustomerUpdateDrawer(false)}
        reload={_getCustomers}
      />
      <Drawer
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        width="75%"
        title="Thêm khách hàng"
      >
        <CustomerAdd reload={_getCustomers} close={() => setShowCreate(false)} />
      </Drawer>
    </>
  )
}
