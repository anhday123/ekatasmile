import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import { compare } from 'utils'

//antd
import { Input, Row, Col, DatePicker, Select, Table, Button } from 'antd'

//icons
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'

//components
import TitlePage from 'components/title-page'

//apis
import { getActions } from 'apis/action'

const { RangePicker } = DatePicker
export default function ActivityDiary() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [activityDiary, setActivityDiary] = useState([])
  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [countAction, setCountAction] = useState(0)
  const [valueFilter, setValueFilter] = useState()

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
    }, 650)
  }

  const columns = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên người dùng',
      render: (text, record) =>
        record.data ? `${record.data.first_name || ''} ${record.data.last_name || ''}` : '',
    },
    {
      title: 'Tên chức năng',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'type',
      sorter: (a, b) => compare(a, b, 'type'),
    },
    {
      title: 'Giao diện',
      dataIndex: 'properties',
      sorter: (a, b) => compare(a, b, 'properties'),
    },
    {
      title: 'Thời gian thao tác',
      dataIndex: 'date',
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD H:mm:ss') : ''),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
  ]

  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await getActions({
        from_date: start,
        to_date: end,
      })
      console.log(res)
      if (res.status === 200) setActivityDiary(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function onChangeDate(dates, dateStrings) {
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }

  const _getActionsHistory = async () => {
    try {
      setLoading(true)
      const res = await getActions(paramsFilter)
      console.log(res)
      if (res.status === 200) {
        setCountAction(res.data.count)
        setActivityDiary(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onClickClear = async () => {
    await _getActionsHistory()
    setValueSearch('')
    setParamsFilter({ page: 1, page_size: 20 })
    setValueFilter()
  }

  useEffect(() => {
    _getActionsHistory()
  }, [paramsFilter])

  return (
    <div className="card">
      <TitlePage
        title={
          < Row
            align="middle"
            onClick={() => history.push(ROUTES.CONFIGURATION_STORE)}
            style={{ cursor: 'pointer' }}
          >
            <ArrowLeftOutlined />
            <div style={{ marginLeft: 8 }}>Nhật ký hoạt động</div>
          </Row>
        }
      >
        <Button
          style={{ display: Object.keys(paramsFilter).length <= 2 && 'none' }}
          onClick={onClickClear}
          type="primary"
          size="large"
        >
          Xóa tất cả lọc
        </Button>
      </TitlePage >

      <Row
        gutter={[16, 16]}
        style={{ marginTop: '1rem', marginBottom: '1rem', marginLeft: '0px', marginRight: '0px', border: '1px solid #d9d9d9', borderRadius: 5 }}
      >
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Input
            prefix={<SearchOutlined />}
            style={{ width: '100%' }}
            name="name"
            value={valueSearch}
            enterButton
            onChange={onSearch}
            placeholder="Tìm kiếm theo tên chức năng"
            allowClear
            bordered={false}
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={8}
          style={{ borderLeft: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9' }}
        >
          <RangePicker
            className="br-15__date-picker"
            style={{ width: '100%' }}
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
            }}
            onChange={onChangeDate}
            bordered={false}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Select
            value={valueFilter}
            showSearch
            style={{ width: '100%' }}
            placeholder="Lọc thao tác"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            bordered={false}
            allowClear
            onChange={e => {
              setParamsFilter({ ...paramsFilter, type: e })
              setValueFilter(e)
            }}
          >
            <Select.Option value='Tạo'>Tạo</Select.Option>
            <Select.Option value='Cập nhật'>Cập nhật</Select.Option>
          </Select>
        </Col>
      </Row>

      <Table
        loading={loading}
        size="small"
        columns={columns}
        dataSource={activityDiary}
        style={{ width: '100%' }}
        pagination={{
          position: ['bottomLeft'],
          current: paramsFilter.page,
          pageSize: paramsFilter.page_size,
          pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
          total: countAction,
        }}
      />
    </div >
  )
}
