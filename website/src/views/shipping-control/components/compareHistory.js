import { Col, Row, Input, DatePicker, Select, Button, Table } from 'antd'
import { useState, useEffect } from 'react'
import SessionHistory from './sessionHistory'
import moment from 'moment'
import ImportFile from './ImportFile'
export default function CompareHistory(props) {
  const { compareList } = props
  const { Option } = Select
  const { RangePicker } = DatePicker
  const [showDetail, setShowDetail] = useState(false)
  const [sessionDetail, setSessionDetail] = useState({})
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [filter, setFilter] = useState({
    keyword: '',
    from_date: moment().startOf('month').format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    branch: '',
  })
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const columns = [
    {
      title: 'Mã phiên đối soát',
      dataIndex: 'code',
      render(data, record) {
        return (
          <span
            style={{ color: '#40a9ff', cursor: 'pointer' }}
            onClick={() => {
              setSessionDetail(record)
              setTimeout(() => setShowDetail(true), 200)
            }}
          >
            {data}
          </span>
        )
      },
    },
    {
      title: 'Thời gian đối soát',
      dataIndex: 'create_date',
      render(data) {
        return moment(data).format('DD-MM-YYYY hh:mm')
      },
    },
    {
      title: 'Hình thức đối soát',
      dataIndex: 'type',
    },
    {
      title: 'File đính kèm',
      dataIndex: 'file',
      render(data) {
        return (
          <a href={data} target="_blank">
            Tải file
          </a>
        )
      },
    },
  ]
  const changeRange = (date, dateString) => {
    props.setFilter({
      ...filter,
      from_date: dateString[0],
      to_date: dateString[1],
    })
  }
  const changeTimeOption = (value) => {
    switch (value) {
      case 'to_day':
        props.setFilter({
          ...filter,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'yesterday':
        props.setFilter({
          ...filter,
          from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        })
        break
      case 'this_week':
        props.setFilter({
          ...filter,
          from_date: moment().startOf('week').format('YYYY-MM-DD'),
          to_date: moment().endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'last_week':
        props.setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'weeks')
            .startOf('week')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'weeks')
            .endOf('week')
            .format('YYYY-MM-DD'),
        })
        break
      case 'this_month':
        props.setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'last_month':
        props.setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
        })
        break
      case 'this_year':
        props.setFilter({
          ...filter,
          from_date: moment().startOf('years').format('YYYY-MM-DD'),
          to_date: moment().endOf('years').format('YYYY-MM-DD'),
        })
        break
      case 'last_year':
        props.setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'year')
            .startOf('year')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'year')
            .endOf('year')
            .format('YYYY-MM-DD'),
        })
        break
      default:
        props.setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
    }
  }
  return (
    <div>
      <Row justify="space-between">
        <Col xs={24} sm={24} md={24} lg={7} xl={7} style={{ marginTop: 13 }}>
          <Input
            size="large"
            onChange={(e) =>
              props.setFilter({
                ...filter,
                keyword: e.target.value,
              })
            }
            placeholder="Tìm theo mã, theo tên"
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={7} xl={7} style={{ marginTop: 13 }}>
          <Select
            size="large"
            open={isOpenSelect}
            onBlur={() => {
              if (isOpenSelect) toggleOpenSelect()
            }}
            onClick={() => {
              if (!isOpenSelect) toggleOpenSelect()
            }}
            style={{ width: '100%' }}
            placeholder="Choose time"
            allowClear
            onChange={async (value) => {
              if (isOpenSelect) toggleOpenSelect()
              changeTimeOption(value)
            }}
            dropdownRender={(menu) => (
              <div>
                <RangePicker
                  onFocus={() => {
                    if (!isOpenSelect) toggleOpenSelect()
                  }}
                  onBlur={() => {
                    if (isOpenSelect) toggleOpenSelect()
                  }}
                  style={{ width: '100%' }}
                  onChange={changeRange}
                />
                {menu}
              </div>
            )}
          >
            <Option value="to_day">Today</Option>
            <Option value="yesterday">Yesterday</Option>
            <Option value="this_week">This week</Option>
            <Option value="last_week">Last week</Option>
            <Option value="last_month">Last month</Option>
            <Option value="this_month">This month</Option>
            <Option value="this_year">This year</Option>
            <Option value="last_year">Last year</Option>
          </Select>
        </Col>
        <Col xs={24} sm={24} md={24} lg={7} xl={7} style={{ marginTop: 13 }}>
          <Select
            size="large"
            placeholder="Chọn chi nhánh"
            style={{ width: '100%' }}
            onChange={(e) =>
              props.setFilter({
                ...filter,
                branch: e,
              })
            }
          >
            {props.branchList
              .filter((e) => e.active)
              .map((e) => (
                <Option value={e.branch_id}>{e.name}</Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: 15, marginBottom: 15 }}>
        <ImportFile />
      </Row>
      <Table
        size="small"
        columns={columns}
        rowKey="_id"
        dataSource={compareList}
      />
      <SessionHistory
        data={sessionDetail}
        visible={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  )
}
