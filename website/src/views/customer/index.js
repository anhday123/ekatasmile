import styles from './../customer/customer.module.scss'
import React, { useEffect, useState, useRef } from 'react'
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
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getCustomer, updateCustomer } from '../../apis/customer'
import CustomerInfo from './components/customerInfo'
import CustomerUpdate from '../actions/customer/update'
import { PERMISSIONS, ROUTES } from 'consts'
import CustomerAdd from 'views/actions/customer/add'
import Permission from 'components/permission'
import { compare, compareCustom, formatCash, tableSum } from 'utils'
import { Link } from 'react-router-dom'

const { Option } = Select
const { RangePicker } = DatePicker

export default function Customer() {
  const typingTimeoutRef = useRef(null)
  const [showCustomColums, setShowCustomColumns] = useState(false)
  const [defaultColumns, setDefaultColumns] = useState([0, 1, 2, 3, 4, 5, 6])
  const [displayColumns, setDisplayColumns] = useState([])
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
        compareCustom(
          `${a.first_name} ${a.last_name}`,
          `${b.first_name} ${b.last_name}`
        ),
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
      title: 'điểm tích lũy',
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
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
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

  const handleChangeColumns = () => {
    let tmp = []
    defaultColumns.sort(compareCustom).forEach((e) => {
      tmp.push(columnsPromotion[e])
    })
    setDisplayColumns(tmp)
  }

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
      if (res.status === 200 && res.data.success) {
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
  useEffect(() => {
    handleChangeColumns()
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
                <Option value="TIỀM NĂNG">Khách hàng tiềm năng</Option>
                <Option value="VÃNG LAI">Khách hàng vãng lai</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row
          style={{ width: '100%', marginTop: 20 }}
          gutter={[10, 20]}
          justify="space-between"
        >
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
          <Col>
            <Button onClick={clearFilter} type="primary" size="large">
              Xóa bộ lọc
            </Button>
            <Button
              onClick={() => setShowCustomColumns(true)}
              style={{ marginLeft: 15 }}
              type="primary"
              size="large"
            >
              Điều chỉnh cột
            </Button>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }}></Row>

        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            rowSelection={rowSelection}
            rowKey="customer_id"
            loading={tableLoading}
            columns={displayColumns}
            dataSource={customerList}
            size="small"
            scroll={{ x: 'max-content' }}
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
            summary={(pageData) => (
              <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>
                  <b>Tổng:</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>
                  <b>{tableSum(pageData, '')}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <b>{tableSum(pageData, '')}</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <b>{tableSum(pageData, '')}</b>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
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
      <Modal
        visible={showCustomColums}
        onCancel={() => setShowCustomColumns(false)}
        title="Điều chỉnh cột hiển  thị trên danh sách"
        onOk={() => {
          handleChangeColumns()
          setShowCustomColumns(false)
        }}
      >
        <Checkbox.Group
          value={defaultColumns}
          onChange={(e) => setDefaultColumns(e)}
        >
          <Row>
            {columnsPromotion.map((e, index) => (
              <Col span={12}>
                <Checkbox value={index}>{e.title}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
    </>
  )
}
