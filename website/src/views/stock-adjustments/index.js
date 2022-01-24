import React, { useEffect, useState, useRef } from 'react'
import styles from './stock-adjustments.module.scss'
import moment from 'moment'
import { ROUTES } from 'consts'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

//components
import columnsStock from './columns'
import SettingColumns from 'components/setting-columns'
import exportToCSV from 'components/ExportCSV/export'
import ImportCSV from 'components/ImportCSV'
import TitlePage from 'components/title-page'
import Permission from 'components/permission'
import locale from 'antd/es/date-picker/locale/zh_CN'

//antd
import { Row, Col, Input, Button, DatePicker, Space, Table, Modal, Select } from 'antd'

//icons
import { SearchOutlined, SettingOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'

//apis
import { getCheckInventoryNote, importCheckInventoryNote } from 'apis/inventory'
import { getAllBranch } from 'apis/branch'
import { getEmployees } from 'apis/employee'

export default function Reports() {
  const history = useHistory()
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)
  const { RangePicker } = DatePicker
  const { Option } = Select

  const [selectRowsKey, setSelectRowKeys] = useState([])
  const [columns, setColumns] = useState([])

  const [loading, setLoading] = useState(false)

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  console.log(paramsFilter)

  const [visibleProductsToSupplier, setVisibleProductsToSupplier] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date

  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [valueFilterTime, setValueFilterTime] = useState()
  const [valueSearch, setValueSearch] = useState('')
  const [valueBranch, setValueBranch] = useState([])
  const [supplierId, setSupplierId] = useState()
  const [inventoryNote, setInventoryNote] = useState([])
  const [productsSupplier, setProductsSupplier] = useState([])
  const [valueUserFilter, setValueUserFilter] = useState(null)
  const [userList, setUserList] = useState([])

  const toggleProductsToSupplier = () => {
    setVisibleProductsToSupplier(!visibleProductsToSupplier)
    setProductsSupplier([])
    setSupplierId()
  }
  const toggleOpenSelect = () => setOpenSelect(!openSelect)

  const _getCheckInventoryNote = async () => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const res = await getCheckInventoryNote({ ...paramsFilter })
      if (res.status === 200) {
        setInventoryNote(res.data.data)
      }
      dispatch({ type: 'LOADING', data: false })
    }
    catch (err) {
      console.log(err)
      dispatch({ type: 'LOADING', data: false })
    }
  }

  const _getUserList = async () => {
    try {
      const res = await getEmployees({ page: 1, page_size: 1000 })
      if (res.status === 200) {
        if (res.data.success) {
          setUserList(res.data.data)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const _getAllBranch = async (query) => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const res = await getAllBranch(query)
      if (res.status === 200) {
        setValueBranch(res.data.data)
      }
      dispatch({ type: 'LOADING', data: false })
    }
    catch (err) {
      console.log(err)
      dispatch({ type: 'LOADING', data: false })
    }
  }

  const _onSearch = (e) => {
    setValueSearch(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.code = value
      else delete paramsFilter.code

      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }

  const _onClearFilters = () => {
    Object.keys(paramsFilter).map((key) => delete paramsFilter[key])

    setValueSearch('')
    setValueFilterTime()
    setValueUserFilter()

    paramsFilter.page = 1
    paramsFilter.page_size = 20

    setParamsFilter({ ...paramsFilter })
  }

  const onChangeUserFilter = (value) => {
    setValueUserFilter(value)
    if (value) paramsFilter.creator_id = value
    else delete paramsFilter.creator_id
    setParamsFilter({ ...paramsFilter })
  }

  const _onFilter = (attribute = '', value = '') => {
    const paramsFilterNew = { ...paramsFilter }
    if (value) paramsFilterNew[attribute] = value
    else delete paramsFilterNew[attribute]
    setParamsFilter({ ...paramsFilterNew })
  }

  const _getStockAdjustmentToExport = async () => {
    let dataExport = []
    try {
      dispatch({ type: 'LOADING', data: true })
      const res = await getCheckInventoryNote()
      console.log(res)
      if (res.status === 200) {
        dataExport = res.data.data.map((item, index) => ({
          STT: index + 1,
          'Mã phiếu': item.code || '',
          'Kho kiểm hàng ': item.branch || '',
          'Trạng thái': item.status || '',
          'Ngày tạo': item.create_date || '',
          'Ngày kiểm': item.inventory_date || '',
          'Nhân viên tạo': item.creator || '',
          'Ghi chú': item.note || '',
        }))
      }
      dispatch({ type: 'LOADING', data: false })
      exportToCSV(dataExport, 'Phiếu kiểm hàng')
    } catch (e) {
      console.log(e)
      dispatch({ type: 'LOADING', data: false })
    }
  }

  useEffect(() => {
    _getCheckInventoryNote()
    _getAllBranch()
    _getUserList()
  }, [paramsFilter])

  return (
    <div className="card">
      <TitlePage title="Phiếu kiểm hàng">
        <Space>
          <Button
            size="large"
            onClick={_getStockAdjustmentToExport}
            icon={<VerticalAlignTopOutlined />}
            style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}
          >
            Xuất excel
          </Button>
          <ImportCSV
            size="large"
            upload={importCheckInventoryNote}
            reload={_getCheckInventoryNote}
            title="Nhập phiếu kiểm hàng bằng file excel"
            fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/12/22/0da13f2d-cb35-4b73-beca-a8ba3dedb47a/NhapKhoAO.xlsx"
          />
          <SettingColumns
            columns={columns}
            setColumns={setColumns}
            columnsDefault={columnsStock}
            nameColumn="columnsStockAdjustments"
          />
          <Link to={ROUTES.STOCK_ADJUSTMENTS_CREATE}>
            <Button type="primary" size="large">
              Tạo phiếu kiểm
            </Button>
          </Link>
        </Space>
      </TitlePage>
      <Row gutter={[16, 16]} style={{ marginLeft: 0, marginRight: 0, marginTop: 15, border: '1px solid #d9d9d9', borderRadius: 5 }}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Input
            allowClear
            onChange={_onSearch}
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo mã phiếu kiểm hàng"
            bordered={false}
            value={valueSearch}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ borderRight: '1px solid #d9d9d9', borderLeft: '1px solid #d9d9d9' }}>
          <Select
            value={valueFilterTime}
            allowClear
            style={{ width: '100%' }}
            placeholder="Lọc theo thời gian"
            showSearch
            open={openSelect}
            onChange={(value) => {
              setValueFilterTime(value)
              delete paramsFilter[valueFilterTime]
              if (value) paramsFilter[value] = true
              else delete paramsFilter[value]
              setParamsFilter({ ...paramsFilter })
            }}
            onBlur={() => {
              if (openSelect) toggleOpenSelect()
            }}
            onClick={() => {
              if (!openSelect) toggleOpenSelect()
            }}
            dropdownRender={(menu) => (
              <>
                <RangePicker
                  style={{ width: '100%' }}
                  onFocus={() => {
                    if (!openSelect) toggleOpenSelect()
                  }}
                  onBlur={() => {
                    if (openSelect) toggleOpenSelect()
                  }}
                  value={valueDateSearch}
                  onChange={(dates, dateStrings) => {
                    //khi search hoac filter thi reset page ve 1
                    paramsFilter.page = 1

                    if (openSelect) toggleOpenSelect()

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
                      setValueFilterTime()
                    } else {
                      const dateFirst = dateStrings[0]
                      const dateLast = dateStrings[1]
                      setValueDateSearch(dates)
                      setValueFilterTime(`${dateFirst} -> ${dateLast}`)

                      dateFirst.replace(/-/g, '/')
                      dateLast.replace(/-/g, '/')

                      paramsFilter.from_date = dateFirst
                      paramsFilter.to_date = dateLast
                    }

                    setParamsFilter({ ...paramsFilter })
                  }}
                />
                {menu}
              </>
            )}
            bordered={false}
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
        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ borderRight: '1px solid #d9d9d9' }}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            showSearch
            bordered={false}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={paramsFilter.status}
            onChange={(value) => _onFilter('status', value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="DRAFT">Lưu nháp</Select.Option>
            <Select.Option value="WATTING_FOR_CHECKING">Chờ kiểm</Select.Option>
            <Select.Option value="CHECKING">Đang kiểm</Select.Option>
            <Select.Option value="CHECKED">Đã kiểm</Select.Option>
            <Select.Option value="BALANCED">Đã cân bằng</Select.Option>
          </Select>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Select
            onChange={onChangeUserFilter}
            value={valueUserFilter}
            style={{ width: '100%' }}
            placeholder="Lọc theo nhân viên tạo"
            allowClear
            showSearch
            bordered={false}
          >
            {userList.map((item, index) => {
              return (
                <Option value={item.user_id}>
                  {item.first_name} {item.last_name}
                </Option>
              )
            })}
          </Select>
        </Col>
      </Row>
      <Button
        onClick={_onClearFilters}
        type="primary"
        danger
        style={{ marginTop: 15, marginLeft: 15, display: Object.keys(paramsFilter).length <= 2 && 'none' }}
      >
        Xóa bộ lọc
      </Button>

      <Table
        loading={loading}
        // rowKey="_id"
        // rowSelection={{
        //   selectedRowKeys: selectRowsKey,
        //   onChange: (keys) => setSelectRowKeys(keys),
        // }}
        size="small"
        dataSource={inventoryNote}
        columns={columns.map((column) => {
          if (column.key === 'stt')
            return {
              ...column,
              width: 50,
              render: (text, record, index) =>
                (paramsFilter.page - 1) * paramsFilter.page_size + index + 1
            }
          if (column.key === 'code')
            return {
              ...column,
              render: (text, record) => <Link to={{ pathname: ROUTES.STOCK_ADJUSTMENTS_UPDATE, state: record }}>{record.code}</Link>,
            }
          if (column.key === 'branch')
            return {
              ...column,
              render: (text, record) => valueBranch.map(value => (value.branch_id === record.branch_id) && value.name)
            }
          if (column.key === 'create_date')
            return {
              ...column,
              render: (text, record) => moment(record.create_date).format('DD/MM/YYYY, hh:mm:ss')
            }
          if (column.key === 'inventory_date')
            return {
              ...column,
              render: (text, record) => record.inventory_date !== '' ? moment(record.inventory_date).format('DD/MM/YYYY, hh:mm:ss') : 'Chưa kiểm'
            }
          if (column.key === 'creator_info')
            return {
              ...column,
              render: (text, record) => record.creator_info ? record.creator_info.first_name + ' ' + record.creator_info.last_name : ''

            }
          if (column.key === 'note')
            return {
              ...column,
              render: (text, record) => record.note ? record.note : ''

            }
          return column
        })}
        style={{ width: '100%', marginTop: 10 }}
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
          // total: countOrder,
        }}
      />
    </div >
  )
}
