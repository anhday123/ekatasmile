import React, { useEffect, useState, useRef } from 'react'
import { PERMISSIONS, ROUTES } from 'consts'
import { useHistory } from 'react-router-dom'
import { PlusCircleOutlined, FileExcelOutlined, DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'
import { compare, compareCustom } from 'utils'
import { useSelector } from 'react-redux'

import {
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Space,
  Popconfirm,
  notification,
  Tag,
} from 'antd'

//components
import exportToCSV from 'components/ExportCSV/export'
import Permission from 'components/permission'
import TitlePage from 'components/title-page'
import SettingColumns from 'components/setting-columns'
import columnsProduct from './columns'

//apis
import { getAllBranch } from 'apis/branch'
import {
  getTransportOrders,
  deleteTransportOrder,
  updateTransportOrder,
  getStatusTransportOrder,
} from 'apis/transport'

const { Option } = Select
const { RangePicker } = DatePicker
export default function ShippingProduct() {
  const history = useHistory()
  const typingTimeoutRef = useRef(null)
  const STATUS = {
    DRAFT: { name: 'Lưu nháp', color: 'magenta' },
    VERIFY: { name: 'Xác nhận', color: 'cyan' },
    SHIPPING: { name: 'Đang chuyển', color: 'gold' },
    COMPLETE: { name: 'Hoàn thành', color: 'green' },
    CANCEL: { name: 'Hủy', color: 'red' },
  }
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [branches, setBranches] = useState([])
  const [columns, setColumns] = useState([])
  const [statusTransportOrder, setStatusTransportOrder] = useState([])
  const [totalTransportOrder, setTotalTransportOrder] = useState(0)
  const [transportOrders, setTransportOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportVisible, setExportVisible] = useState(false)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [valueSearch, setValueSearch] = useState('')
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})

  const _getTransportOrders = async () => {
    try {
      setLoading(true)
      const res = await getTransportOrders({ ...paramsFilter, branch_id: branchIdApp })
      console.log(res)
      if (res.status === 200) {
        setTransportOrders(res.data.data)
        setTotalTransportOrder(res.data.count)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  const _acceptTransportOrder = async (status = 'VERIFY', id) => {
    try {
      const body = { status: status }
      const res = await updateTransportOrder(body, id)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getTransportOrders()
          notification.success({ message: 'Cập nhật phiếu chuyển hàng thành công!' })
        } else
          notification.error({
            message: res.data.message || 'Cập nhật phiếu chuyển hàng thất bại, vui lòng thử lại!!',
          })
      } else
        notification.error({
          message: res.data.message || 'Cập nhật phiếu chuyển hàng thất bại, vui lòng thử lại!!',
        })
    } catch (error) {
      console.log(error)
    }
  }

  const _deleteTransportOrder = async (id) => {
    try {
      setLoading(true)
      const res = await deleteTransportOrder(id)
      setLoading(false)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getTransportOrders()
          notification.success({ message: 'Xóa phiếu chuyển hàng thành công!' })
        } else
          notification.error({
            message: res.data.message || 'Xóa phiếu chuyển hàng thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xóa phiếu chuyển hàng thất bại, vui lòng thử lại!',
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _onFilters = (attribute = '', value = '') => {
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]

    setParamsFilter({ ...paramsFilter, page: 1 })
  }

  const onSearch = (e) => {
    setValueSearch(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.code = value
      else delete paramsFilter.code

      paramsFilter.setParamsFilter({ ...paramsFilter, page: 1 })
    }, 750)
  }

  const columnsPromotion = [
    {
      title: 'STT',
      width: 60,
      render: (data, record, index) => index + 1,
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      render: (text, record) => (
        <a onClick={() => history.push({ pathname: ROUTES.SHIPPING_PRODUCT_ADD, state: record })}>
          {text}
        </a>
      ),
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Nơi chuyển',
      render: (text, record) => record.export_location_info && record.export_location_info.name,
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'verify_date',
      render: (data) => data && moment(data).format('DD-MM-YYYY hh:mm'),
      sorter: (a, b) => moment(a.verify_date).unix() - moment(b.verify_date).unix(),
    },

    {
      title: 'Nơi nhận',
      render: (text, record) => record.import_location_info && record.import_location_info.name,
    },
    {
      title: 'Ngày chuyển',
      dataIndex: 'delivery_time',
      render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
      sorter: (a, b) => moment(a.delivery_time).unix() - moment(b.delivery_time).unix(),
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Nhân viên tạo',
      dataIndex: '_creator',
      sorter: (a, b) =>
        compareCustom(
          a._creator ? `${a._creator.first_name} ${a._creator.last_name}` : '',
          b._creator ? `${b._creator.first_name} ${b._creator.last_name}` : ''
        ),
      render: (text) => text && text.first_name + ' ' + text.last_name,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text) =>
        (text === 'DRAFT' && 'Lưu nháp') ||
        (text === 'VERIFY' && 'Xác nhận') ||
        (text === 'SHIPPING' && 'Đang chuyển') ||
        (text === 'COMPLETE' && 'Hoàn thành') ||
        (text === 'CANCEL' && 'Hủy'),
      sorter: (a, b) => compare(a, b, 'status'),
    },
  ]

  const ExportExcel = () => {
    exportToCSV(
      transportOrders.map((e) => {
        return {
          code: e.code,
          status: e.status,
          from: e.from.name,
          to: e.to.name,
          create_date: moment(e.create_date).format('DD-MM-YYYY hh:mm'),
          creator: e._creator,
        }
      }),
      'chuyen_hang'
    )
    setExportVisible(false)
  }
  const ExportButton = () => <Button onClick={ExportExcel}>Xuất excel</Button>

  const _getBranches = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getStatus = async () => {
    try {
      const res = await getStatusTransportOrder()
      if (res.status === 200) setStatusTransportOrder(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getBranches()
    _getStatus()
  }, [])

  useEffect(() => {
    _getTransportOrders()
  }, [paramsFilter, branchIdApp])

  return (
    <>
      <div className="card">
        <TitlePage title="Quản lý phiếu chuyển hàng">
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<FileExcelOutlined />}
              // onClick={() => setExportVisible(true)}
            >
              Nhập excel
            </Button>
            <Button
              size="large"
              icon={<FileExcelOutlined />}
              style={{
                backgroundColor: '#008816',
                color: 'white',
              }}
              onClick={() => setExportVisible(true)}
            >
              Xuất excel
            </Button>
            <SettingColumns
              columnsDefault={columnsProduct}
              nameColumn="columnsShippingProduct"
              columns={columns}
              setColumns={setColumns}
            />
            <Permission permissions={[PERMISSIONS.tao_phieu_chuyen_hang]}>
              <Button
                size="large"
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => history.push(ROUTES.SHIPPING_PRODUCT_ADD)}
              >
                Tạo phiếu chuyển hàng
              </Button>
            </Permission>
          </Space>
        </TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: 15 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Input
              value={valueSearch}
              size="large"
              placeholder="Tìm kiếm theo mã phiếu"
              onChange={onSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
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
              placeholder="Lọc theo thời gian nhập chi nhánh"
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
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              value={paramsFilter.status}
              onChange={(value) => _onFilters('status', value)}
            >
              {statusTransportOrder.map((status, index) => (
                <Select.Option value={status.name} key={index}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              placeholder="Lọc theo nơi chuyển"
              style={{ width: '100%' }}
              onChange={(value) => _onFilters('export_location_name', value)}
            >
              {branches.map((e, index) => (
                <Select.Option value={e.name} key={index}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Select
              allowClear
              size="large"
              placeholder="Lọc theo nơi nhận"
              style={{ width: '100%' }}
              onChange={(value) => _onFilters('import_location_name', value)}
            >
              {branches.map((e, index) => (
                <Select.Option value={e.name} key={index}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={6}>
            <Button
              size="large"
              onClick={() => setParamsFilter({ page: 1, page_size: 20 })}
              style={{ display: Object.keys(paramsFilter).length === 2 && 'none' }}
              type="primary"
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>

        <Table
          size="small"
          loading={loading}
          columns={columns.map((column) => {
            if (column.key === 'stt')
              return { ...column, render: (data, record, index) => index + 1 }
            if (column.key === 'code')
              return {
                ...column,
                render: (text, record) => (
                  <a
                    onClick={() =>
                      history.push({ pathname: ROUTES.SHIPPING_PRODUCT_ADD, state: record })
                    }
                  >
                    {text}
                  </a>
                ),
                sorter: (a, b) => compare(a, b, 'code'),
              }
            if (column.key === 'export_location')
              return {
                ...column,
                render: (text, record) =>
                  record.export_location_info && record.export_location_info.name,
              }
            if (column.key === 'import_location')
              return {
                ...column,
                render: (text, record) =>
                  record.import_location_info && record.import_location_info.name,
              }
            if (column.key === 'verify_date')
              return {
                ...column,
                render: (data) => data && moment(data).format('DD-MM-YYYY hh:mm'),
                sorter: (a, b) => moment(a.verify_date).unix() - moment(b.verify_date).unix(),
              }
            if (column.key === 'delivery_time')
              return {
                ...column,
                render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
                sorter: (a, b) => moment(a.delivery_time).unix() - moment(b.delivery_time).unix(),
              }
            if (column.key === 'create_date')
              return {
                ...column,
                render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
                sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
              }
            if (column.key === '_creator')
              return {
                ...column,
                sorter: (a, b) =>
                  compareCustom(
                    a._creator ? `${a._creator.first_name} ${a._creator.last_name}` : '',
                    b._creator ? `${b._creator.first_name} ${b._creator.last_name}` : ''
                  ),
                render: (text) => text && text.first_name + ' ' + text.last_name,
              }
            if (column.key === 'status')
              return {
                ...column,
                render: (text) => <Tag color={STATUS[text].color}>{STATUS[text].name}</Tag>,
                sorter: (a, b) => compare(a, b, 'status'),
              }
            if (column.key === 'action')
              return {
                ...column,
                render: (text, record) => (
                  <Space>
                    {(record.status === 'VERIFY' && (
                      <Popconfirm
                        onConfirm={() => _acceptTransportOrder('COMPLETE', record.order_id)}
                        okText="Đồng ý"
                        cancelText="Từ chối"
                        title="Bạn có muốn hoàn thành phiếu chuyển hàng này không?"
                      >
                        <Button type="primary">Hoàn thành</Button>
                      </Popconfirm>
                    )) ||
                      (record.status === 'DRAFT' && (
                        <Popconfirm
                          onConfirm={() => _acceptTransportOrder('VERIFY', record.order_id)}
                          okText="Đồng ý"
                          cancelText="Từ chối"
                          title="Bạn có muốn xác nhận phiếu chuyển hàng này không?"
                        >
                          <Button type="primary">Xác nhận phiếu</Button>
                        </Popconfirm>
                      ))}
                    <Popconfirm
                      okText="Đồng ý"
                      cancelText="Từ chối"
                      onConfirm={() => _deleteTransportOrder(record.order_id)}
                      title="Bạn có muốn xóa phiếu chuyển hàng này không?"
                    >
                      <Button icon={<DeleteOutlined />} danger type="primary" />
                    </Popconfirm>
                  </Space>
                ),
              }
            return column
          })}
          rowKey="order_id"
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            total: totalTransportOrder,
          }}
          dataSource={transportOrders}
          style={{ width: '100%', marginTop: 10 }}
        />
      </div>
    </>
  )
}
