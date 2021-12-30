import { useState } from 'react'
import { Select, DatePicker } from 'antd'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker
export default function FilterRangeTime({ filter, setFilter }) {
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const changeRange = (date, dateString) => {
    setFilter({ ...filter, from_date: dateString[0], to_date: dateString[1] })
  }
  const changeTimeOption = (value) => {
    switch (value) {
      case 'to_day':
        setFilter({
          ...filter,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'yesterday':
        setFilter({
          ...filter,
          from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        })
        break
      case 'this_week':
        setFilter({
          ...filter,
          from_date: moment().startOf('week').format('YYYY-MM-DD'),
          to_date: moment().endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'last_week':
        setFilter({
          ...filter,
          from_date: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'this_month':
        setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'last_month':
        setFilter({
          ...filter,
          from_date: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        })
        break
      case 'this_year':
        setFilter({
          ...filter,
          from_date: moment().startOf('years').format('YYYY-MM-DD'),
          to_date: moment().endOf('years').format('YYYY-MM-DD'),
        })
        break
      case 'last_year':
        setFilter({
          ...filter,
          from_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
        })
        break
      default:
        setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
    }
  }
  return (
    <Select
      size="large"
      open={isOpenSelect}
      defaultValue="this_month"
      onBlur={() => {
        if (isOpenSelect) toggleOpenSelect()
      }}
      onClick={() => {
        if (!isOpenSelect) toggleOpenSelect()
      }}
      style={{ width: 380 }}
      placeholder="Lọc theo thời gian"
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
  )
}
