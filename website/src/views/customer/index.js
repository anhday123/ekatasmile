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
} from 'antd'

//icons
import { PlusCircleOutlined } from '@ant-design/icons'

//components
import CustomerInfo from './components/customerInfo'
import CustomerUpdate from 'views/actions/customer/update'
import CustomerAdd from 'views/actions/customer/add'
import Permission from 'components/permission'
import SettingColumns from 'components/setting-columns'
import columnsCustomer from './columnsCustomer'

//apis
import { getCustomer, updateCustomer } from 'apis/customer'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Customer() {
  const typingTimeoutRef = useRef(null)

  const [columns, setColumns] = useState([])
  const [page, setPage] = useState(1)
  const [page_size, setPage_size] = useState(20)
  const [countCustomer, setCountCustomer] = useState(0)
  const [paramsFilter, setParamsFilter] = useState({})
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [infoCustomer, setInfoCustomer] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [customerFilter, setCustomerFilter] = useState({
    search: '',
    date: [],
    category: undefined,
  })
  const [customerUpdateDrawer, setCustomerUpdateDrawer] = useState(false)
  const [customerListUpdate, setCustomerListUpdate] = useState([])
  const [valueSearch, setValueSearch] = useState('')
  const [optionSearch, setOptionSearch] = useState('name')
  const [valueDate, setValueDate] = useState(null)
  const [valueTypeCustomer, setValueTypeCustomer] = useState()

  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      setPage(1)
      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      getAllCustomer({ page: 1, page_size, ...paramsFilter })
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }

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
    setPage(1)
    getAllCustomer({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }

  function onChangeTypeCustomer(value) {
    setPage(1)
    setValueTypeCustomer(value)
    if (value) paramsFilter.type = value
    else delete paramsFilter.type
    getAllCustomer({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }

  const columnsPromotion = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'code',
      key: 0,
      width: 150,

      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Tên khách hàng',
      width: 150,
      key: 1,
      render(data) {
        return data.first_name + ' ' + data.last_name
      },
      sorter: (a, b) =>
        compareCustom(`${a.first_name} ${a.last_name}`, `${b.first_name} ${b.last_name}`),
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'type',
      key: 2,
      width: 150,
      sorter: (a, b) => compare(a, b, 'type'),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      key: 3,
      width: 150,
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Tổng số đơn hàng',
      dataIndex: '',
      key: 4,
      render: (data) => (
        <Link to={ROUTES.CUSTOMER_ORDER_LIST} style={{ fontWeight: 500 }}>
          5
        </Link>
      ),
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Điểm tích lũy',
      dataIndex: '',
      key: 5,
      render: (data) => 5,
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Số điểm đã dùng',
      dataIndex: '',
      key: 6,
      render: (data) => 5,
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Tổng chi tiêu tại cửa hàng',
      dataIndex: '',
      key: 7,
      render: (data) => formatCash(1000000),
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Ngày tạo',
      key: 8,
      dataIndex: 'create_date',
      render: (data) => moment(data).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Ngày sinh',
      key: 9,
      dataIndex: 'birthday',
      render: (data) => moment(data).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.birthday).unix() - moment(b.birthday).unix(),
    },
    {
      title: 'Địa chỉ',
      key: 10,
      dataIndex: 'address',
      sorter: (a, b) => compare(a, b, 'address'),
    },
  ]

  const deleteMultiCustomer = async () => {
    try {
      setTableLoading(true)
      const res = await Promise.all(
        selectedRowKeys.map((e) => {
          return updateCustomer(e, { active: false })
        })
      )
      if (res.reduce((a, b) => a && b.data.success, true)) {
        notification.success({
          message: 'Thành công',
          description: 'Xóa khách hàng thành công',
        })
        getAllCustomer()
      }
      setTableLoading(false)
    } catch (e) {
      notification.error({
        message: 'Thất bại',
        description: 'Xóa khách hàng thất bại',
      })
      setTableLoading(false)
      console.log(e)
    }
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const getAllCustomer = async (params) => {
    setTableLoading(true)
    try {
      const res = await getCustomer(params)
      console.log(res)
      if (res.status === 200) {
        setCustomerList(res.data.data.filter((e) => e.active))
        setCountCustomer(res.data.count)
      }
      setTableLoading(false)
    } catch (e) {
      console.log(e)
      setTableLoading(false)
    }
  }

  const clearFilter = () => {
    getAllCustomer({ page: 1, page_size })
    setValueSearch('')
    setValueDate(null)
    setValueTypeCustomer()
    setParamsFilter({})
  }
  const openUpdateDrawer = () => {
    var tmp = []
    selectedRowKeys.forEach((e) => {
      var customer = customerList.find((c) => c.customer_id === e)
      if (customer) tmp.push(customer)
    })
    setCustomerListUpdate(tmp)
    setTimeout(() => {
      setCustomerUpdateDrawer(true)
    }, 300)
  }

  useEffect(() => {
    getAllCustomer({ page, page_size, ...paramsFilter })
  }, [])

  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <Row
          wrap={false}
          justify="space-between"
          align="middle"
          style={{ borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem' }}
        >
          <div style={{ fontSize: 19, fontWeight: 600 }}>Quản lý khách hàng</div>
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
        </Row>
        <Row justify="space-between" align="middle">
          <Col style={{ marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={9}>
            <Row wrap={false} style={{ width: '100%' }}>
              <Input
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo tên"
                value={valueSearch}
                onChange={(e) => onSearch(e)}
                allowClear
              />
              <Select
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
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={6}>
            <div style={{ width: '100%' }}>
              <RangePicker
                className="br-15__date-picker"
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                value={valueDate}
                onChange={onChangeDate}
              />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo loại khách hàng"
                value={valueTypeCustomer}
                onChange={onChangeTypeCustomer}
                allowClear
              >
                <Option value="TIỀM NĂNG">Khách hàng tiềm năng</Option>
                <Option value="VÃNG LAI">Khách hàng vãng lai</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }} gutter={[10, 20]} justify="space-between">
          {(selectedRowKeys && selectedRowKeys.length > 0 && (
            <Permission permissions={[PERMISSIONS.cap_nhat_khach_hang]}>
              <Col>
                <Button size="large" type="primary" onClick={openUpdateDrawer}>
                  Cập nhật
                </Button>
                <Button
                  size="large"
                  type="primary"
                  style={{
                    background: 'red',
                    border: 'none',
                    marginLeft: 15,
                    width: 95,
                  }}
                  onClick={deleteMultiCustomer}
                >
                  Xóa
                </Button>
              </Col>
            </Permission>
          )) || <Col></Col>}
          <Row justify="end">
            <Space>
              <Button onClick={clearFilter} type="primary" size="large">
                Xóa bộ lọc
              </Button>
              <SettingColumns
                columnsDefault={columnsCustomer}
                setColumns={setColumns}
                columns={columns}
                nameColumn="columnsCustomer"
              />
            </Space>
          </Row>
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
                      setInfoCustomer(record)
                      modal2VisibleModal(true)
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

            // if (column.key === 'create_date')
            //   return {
            //     ...column,
            //     render: (text, record) =>
            //       record.create_date && moment(record.create_date).moment('DD-MM-YYYY HH:mm'),
            //   }

            // if (column.key === 'birthday')
            //   return {
            //     ...column,
            //     render: (text, record) =>
            //       record.birthday && moment(record.birthday).moment('DD-MM-YYYY HH:mm'),
            //   }

            return column
          })}
          dataSource={customerList}
          size="small"
          pagination={{
            position: ['bottomLeft'],
            current: page,
            defaultPageSize: 20,
            pageSizeOptions: [20, 30, 50, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setSelectedRowKeys([])
              setPage(page)
              setPage_size(pageSize)
              getAllCustomer({ page, page_size: pageSize, ...paramsFilter })
            },
            total: countCustomer,
          }}
        />
      </div>
      <CustomerInfo
        visible={modal2Visible}
        onCancel={() => modal2VisibleModal(false)}
        infoCustomer={infoCustomer}
      />
      <CustomerUpdate
        customerData={customerListUpdate}
        visible={customerUpdateDrawer}
        onClose={() => {
          setCustomerUpdateDrawer(false)
        }}
        reload={() => getAllCustomer({ page, page_size, ...paramsFilter })}
      />
      <Drawer
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        width="75%"
        title="Thêm khách hàng"
      >
        <CustomerAdd
          reload={() => getAllCustomer({ page: 1, page_size, ...paramsFilter })}
          close={() => setShowCreate(false)}
        />
      </Drawer>
    </>
  )
}
