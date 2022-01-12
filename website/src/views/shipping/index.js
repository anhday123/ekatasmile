import React, { useState, useEffect, useRef } from 'react'
import { ACTION, PERMISSIONS } from 'consts'
import moment from 'moment'
import { useDispatch } from 'react-redux'

//antd
import {
  notification,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  DatePicker,
  Space,
  Popconfirm,
} from 'antd'

// icons
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'

//apis
import { getShippings, deleteShippings } from 'apis/shipping'
import { getProvinces, getDistricts } from 'apis/address'

//components
import Permission from 'components/permission'
import TitlePage from 'components/title-page'
import columnsShipping from './columns'
import SettingColumns from 'components/setting-columns'
import ShippingForm from './shipping-form'

const { Option } = Select
export default function Shipping() {
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [countShipping, setCountShipping] = useState(0)
  const [shippings, setShippings] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columns, setColumns] = useState([])
  const [districts, setDistricts] = useState([])
  const [provinces, setProvinces] = useState([])
  const [valueSearch, setValueSearch] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date

  const _onFilter = (attribute = '', value = '') => {
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]
    paramsFilter.page = 1 //reset page
    setParamsFilter({ ...paramsFilter })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }

  const onSearch = (e) => {
    const value = e.target.value
    setValueSearch(value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) paramsFilter.name = value
      else delete paramsFilter.name
      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 650)
  }

  const _getShippings = async () => {
    try {
      setLoading(true)
      setSelectedRowKeys([])
      const res = await getShippings(paramsFilter)
      console.log(res)
      if (res.status === 200) {
        setCountShipping(res.data.count)
        setShippings(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const _deleteShippings = async () => {
    try {
      setLoading(true)
      const res = await deleteShippings(selectedRowKeys)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getShippings()
          notification.success({ message: `Xóa đối tác vận chuyển thành công` })
        } else
          notification.error({
            message: res.data.message || `Xóa đối tác vận chuyển thất bại, vui lòng thử lại`,
          })
      } else
        notification.error({
          message: res.data.message || `Xóa đối tác vận chuyển thất bại, vui lòng thử lại`,
        })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _clearFilters = () => {
    setParamsFilter({ page: 1, page_size: 20 })
    setValueSearch('')
    setValueTime()
    setValueDateTimeSearch({})
    setValueDateSearch(null)
  }

  const _getDistricts = async () => {
    try {
      const res = await getDistricts()
      console.log(res)
      if (res.status === 200) setDistricts(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getProvinces = async () => {
    try {
      const res = await getProvinces()
      if (res.status === 200) setProvinces(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getShippings()
  }, [paramsFilter])

  useEffect(() => {
    _getDistricts()
    _getProvinces()
  }, [])

  return (
    <>
      <div className="card">
        <TitlePage title="Đối tác vận chuyển">
          <Space>
            <SettingColumns
              nameColumn="columnsShipping"
              columns={columns}
              setColumns={setColumns}
              columnsDefault={columnsShipping}
            />
            <ShippingForm reloadData={_getShippings}>
              <Permission permissions={[PERMISSIONS.them_doi_tac_van_chuyen]}>
                <Button icon={<PlusCircleOutlined />} type="primary" size="large">
                  Thêm đối tác
                </Button>
              </Permission>
            </ShippingForm>
          </Space>
        </TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: 15, marginBottom: 19 }}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Input
              prefix={<SearchOutlined />}
              size="large"
              style={{ width: '100%' }}
              value={valueSearch}
              enterButton
              onChange={onSearch}
              placeholder="Tìm kiếm theo tên vận chuyển"
              allowClear
            />
          </Col>

          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Select
              allowClear
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Lọc theo tỉnh/thành phố"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.province}
              onChange={(value) => _onFilter('province', value)}
            >
              {provinces.map((values, index) => {
                return <Option value={values.province_name}>{values.province_name}</Option>
              })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
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
              {districts.map((values, index) => {
                return (
                  <Option value={values.district_name} key={index}>
                    {values.district_name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
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
              placeholder="Lọc theo thời gian"
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
                  <DatePicker.RangePicker
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
        </Row>

        <Row justify="space-between" wrap={false} style={{ marginBottom: 8 }}>
          <Popconfirm
            okText="Đồng ý"
            cancelText="Từ chối"
            onConfirm={_deleteShippings}
            title="Bạn có muốn xóa các đối tác này không ?"
          >
            {/* <Permission permissions={[PERMISSIONS.xoa_doi_tac_van_chuyen]}> */}
            <Button
              size="large"
              type="primary"
              danger
              style={{ visibility: !selectedRowKeys.length && 'hidden' }}
            >
              Xóa đối tác
            </Button>
            {/* </Permission> */}
          </Popconfirm>

          <Button
            style={{ display: Object.keys(paramsFilter).length <= 2 && 'none' }}
            onClick={_clearFilters}
            type="primary"
            size="large"
          >
            Xóa bộ lọc
          </Button>
        </Row>

        <Table
          size="small"
          rowKey="shipping_company_id"
          loading={loading}
          rowSelection={rowSelection}
          columns={columns.map((column) => {
            if (column.key === 'code')
              return {
                ...column,
                render: (text, record) => (
                  <ShippingForm record={record} reloadData={_getShippings}>
                    <a>{record.code}</a>
                  </ShippingForm>
                ),
              }
            if (column.key === 'create_date')
              return {
                ...column,
                render: (text, record) =>
                  record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
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
          dataSource={shippings}
          scroll={{ y: 500, width: '100%', marginTop: 10 }}
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
            total: countShipping,
          }}
        />
      </div>
    </>
  )
}
