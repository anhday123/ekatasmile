import styles from './../customer/customer.module.scss'
import React, { useEffect, useState } from 'react'
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
  Radio,
  Drawer,
} from 'antd'
import { Link } from 'react-router-dom'
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getCustomer, updateCustomer } from '../../apis/customer'
import CustomerInfo from './components/customerInfo'
import CustomerUpdate from '../actions/customer/update'
import { ROUTES } from 'consts'
import CustomerAdd from 'views/actions/customer/add'
const { Option } = Select
const { RangePicker } = DatePicker

export default function Customer() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
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
  const onSearch = (value) => {
    getAllCustomer({ _full_name: value })
    changeFilter('search', value)
  }
  function onChange(dates, dateStrings) {
    getAllCustomer({ from_date: dateStrings[0], to_date: dateStrings[1] })
    changeFilter('date', [moment(dateStrings[0]), moment(dateStrings[1])])
  }

  function handleChange(value) {
    getAllCustomer({ type: value })
    changeFilter('category', value)
  }
  const changeActiveCustomer = async (id, status) => {
    try {
      const res = await updateCustomer(id, { active: status })
      if (res.status === 200) {
        if (status) {
          notification.success({ message: 'Kích hoạt khách hàng thành công' })
        } else {
          notification.success({ message: 'Vô hiệu hóa khách hàng thành công' })
        }
      }
    } catch (e) {
      console.log(e)
      notification.error({ message: 'Thay thay đổi trạng thái thất bại' })
    }
  }
  const changeFilter = (key, val) => {
    setCustomerFilter((e) => {
      return { ...e, [key]: val }
    })
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
      render(data) {
        if (data && data.toUpperCase() == 'POTENTIAL') {
          return 'Tiềm năng'
        } else return 'Vãng lai'
      },
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      width: 150,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      width: 150,
      render(data) {
        return data && moment(data).format('L')
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
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
      fixed: 'right',
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
  const changePagi = (page, size) => setPagination({ page, size })

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
      const res = await getCustomer({
        ...params,
        page: pagination.page,
        page_size: pagination.size,
      })

      if (res.status === 200 && res.data.success) {
        setCustomerList(res.data.data)
        setTableLoading(false)
      }
    } catch (e) {
      console.log(e)
      setTableLoading(false)
    }
  }

  const clearFilter = () => {
    getAllCustomer()
    setCustomerFilter({ search: '', date: [], category: undefined })
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
    getAllCustomer()
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
            <Button
              size="large"
              icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
              type="primary"
              onClick={() => setShowCreate(true)}
            >
              Thêm khách hàng
            </Button>
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
              value={customerFilter.search}
              onChange={(e) => onSearch(e.target.value)}
              size="large"
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
                value={customerFilter.date}
                onChange={onChange}
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
                value={customerFilter.category}
                onChange={handleChange}
              >
                <Option value="POTENTIAL">Khách hàng tiềm năng</Option>
                <Option value="VANGLAI">Khách hàng vãng lai</Option>
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
            <Button size="large" type="primary" onClick={openUpdateDrawer}>
              Cập nhật khách hàng
            </Button>
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
            pagination={{ onChange: changePagi }}
            columns={columnsPromotion}
            dataSource={customerList}
            scroll={{ y: 500 }}
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
        <CustomerAdd close={() => setShowCreate(false)} />
      </Drawer>
    </>
  )
}
