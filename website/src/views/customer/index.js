import styles from './../customer/customer.module.scss'
import React, { useEffect, useState, useRef } from 'react'
import {
  Switch,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  notification,
  Drawer,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getCustomer, updateCustomer } from '../../apis/customer'
import CustomerInfo from './components/customerInfo'
import CustomerUpdate from '../actions/customer/update'
import { PERMISSIONS } from 'consts'
import CustomerAdd from 'views/actions/customer/add'
import Permission from 'components/permission'

const { Option } = Select
const { RangePicker } = DatePicker

export default function Customer() {
  const typingTimeoutRef = useRef(null)

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
      if (value) paramsFilter._full_name = value
      else delete paramsFilter._full_name

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

  const changeActiveCustomer = async (id, status) => {
    try {
      setTableLoading(true)
      const res = await updateCustomer(id, { active: status })
      if (res.status === 200) {
        if (status) {
          notification.success({ message: 'Kích hoạt khách hàng thành công' })
        } else {
          notification.success({ message: 'Vô hiệu hóa khách hàng thành công' })
        }
      }
      setTableLoading(false)
    } catch (e) {
      console.log(e)
      setTableLoading(false)
    }
  }

  const columnsPromotion = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'code',
      width: 150,
      render(data, record) {
        return (
          <span
            style={{ color: '#42a5f5', cursor: 'pointer' }}
            onClick={() => {
              setInfoCustomer(record)
              modal2VisibleModal(true)
            }}
          >
            {data}
          </span>
        )
      },
    },
    {
      title: 'Tên khách hàng',
      width: 150,
      render(data) {
        return data.first_name + ' ' + data.last_name
      },
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      width: 150,
      render(data) {
        return data && moment(data).format('L')
      },
      sorter: (a, b) => moment(a).unix() - moment(b).unix(),
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
      dataIndex: 'province',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 120,
      render(data, record) {
        return (
          <Switch
            defaultChecked={data}
            onChange={(e) => changeActiveCustomer(record.customer_id, e)}
          />
        )
      },
    },
  ]

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

      if (res.status === 200 && res.data.success) {
        setCustomerList(res.data.data)
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
      var customer = customerList.find((c) => c._id === e)
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
          <div className={styles['promotion_manager_title']}>
            Quản lý khách hàng
          </div>
          <div className={styles['promotion_manager_button']}>
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
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
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
            <Input
              placeholder="Tìm kiếm theo tên"
              value={valueSearch}
              onChange={(e) => onSearch(e)}
              size="large"
              allowClear
            />
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
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                value={valueDate}
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
                placeholder="Lọc theo khách hàng"
                value={valueTypeCustomer}
                onChange={onChangeTypeCustomer}
                allowClear
              >
                <Option value="Tiềm năng">Khách hàng tiềm năng</Option>
                <Option value="Vãng lai">Khách hàng vãng lai</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }} justify="end">
          <Button onClick={clearFilter} type="primary" size="large">
            Xóa bộ lọc
          </Button>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }}>
          {selectedRowKeys && selectedRowKeys.length > 0 && (
            <Permission permissions={[PERMISSIONS.cap_nhat_khach_hang]}>
              <Button size="large" type="primary" onClick={openUpdateDrawer}>
                Cập nhật khách hàng
              </Button>
            </Permission>
          )}
        </Row>

        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            rowSelection={rowSelection}
            rowKey="_id"
            loading={tableLoading}
            columns={columnsPromotion}
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
