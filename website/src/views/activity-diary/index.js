import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import { compare, compareCustom } from 'utils'

//antd
import {
  notification,
  message,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  Popover,
  Button,
} from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//components
import TitlePage from 'components/title-page'

//apis
import { getActions } from 'apis/action'

const { Option } = Select
const { RangePicker } = DatePicker
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
  },
]

export default function ActivityDiary() {
  const { Search } = Input
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [activityDiary, setActivityDiary] = useState([])
  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const apiSearchData = async (value) => {
    try {
      setLoading(true)
      const res = await getActions({ search: value })

      if (res.status === 200) setActivityDiary(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiSearchData(value)
    }, 300)
  }

  const apiSearchProvinceData = async (value, data) => {
    if (data === 1) {
      try {
        setLoading(true)
        const res = await getActions({ type: value })
        console.log(res)
        if (res.status === 200) setActivityDiary(res.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    } else {
      try {
        setLoading(true)
        const res = await getActions({ properties: value })
        console.log(res)
        if (res.status === 200) setActivityDiary(res.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
  }
  const [type, setType] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`)
    setType(value)
    if (value !== 'default') {
      apiSearchProvinceData(value, 1)
    } else {
      await apiAllActivityDiaryData()
    }
  }
  const [properties, setProperties] = useState('')
  const handleChangeProperties = async (value) => {
    console.log(`selected ${value}`)
    setProperties(value)
    if (value !== 'default') {
      apiSearchProvinceData(value, 2)
    } else {
      await apiAllActivityDiaryData()
    }
  }
  const columnsPromotion = [
    {
      title: 'Tên người dùng',
      dataIndex: 'performer',
      render: (text, record) =>
        record.performer && record.performer.first_name && record.performer.last_name
          ? `${record.performer.first_name} ${record.performer.last_name}`
          : '',
      sorter: (a, b) =>
        compareCustom(
          a.performer && `${a.performer.first_name} ${a.performer.last_name}`,
          b.performer && `${b.performer.first_name} ${b.performer.last_name}`
        ),
    },
    {
      title: 'Tên chức năng',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Thời gian thao tác',
      dataIndex: 'date',
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      render: (text, record) =>
        record.bussiness_id && record.bussiness_id.username ? record.bussiness_id.username : '',
      sorter: (a, b) => compare(a, b, 'username'),
    },
    {
      title: 'Tên công ty',
      dataIndex: 'city',
      render: (text, record) =>
        record.data && record.data.company_name ? record.data.company_name : '',
      sorter: (a, b) => compare(a, b, 'city'),
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      render: (text, record) => (record.data && record.data.district ? record.data.district : ''),
      sorter: (a, b) => compare(a, b, 'district'),
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
  ]
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }
  const dataPromotion = []
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      userName: `Văn Tỷ ${i}`,
      optionName: `Mua hàng ${i}`,
      action: `Thêm sản phẩm vào giỏ hàng ${i}`,
      time: `07:30, 2021/06/30 ${i}`,
    })
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
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
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  //
  const [typeAll, setTypeAll] = useState([])
  const [propertiesAll, setPropertiesAll] = useState([])
  const apiAllActivityDiaryData = async () => {
    try {
      setLoading(true)
      const res = await getActions()

      if (res.status === 200) {
        setActivityDiary(res.data.data)
        var array = []
        var arrayProperties = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            array.push(values.type)
            arrayProperties.push(values.properties)
          })
        setTypeAll([...array])
        setPropertiesAll([...arrayProperties])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllActivityDiaryData()
  }, [])
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const dateFormat = 'YYYY/MM/DD'
  const unique = [...new Set(typeAll)]
  const uniqueProperties = [...new Set(propertiesAll)]
  const onClickClear = async () => {
    await apiAllActivityDiaryData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setType('default')
    setProperties('default')
  }
  return (
    <>
      <div className="card">
        <TitlePage
          title={
            <Row
              align="middle"
              onClick={() => history.push(ROUTES.CONFIGURATION_STORE)}
              style={{ cursor: 'pointer' }}
            >
              <ArrowLeftOutlined />
              <div style={{ marginLeft: 8 }}>Nhật ký hoạt động</div>
            </Row>
          }
        ></TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: 15, marginBottom: 15 }}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Input
              size="large"
              style={{ width: '100%' }}
              name="name"
              value={valueSearch}
              enterButton
              onChange={onSearch}
              placeholder="Tìm kiếm theo tên"
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <RangePicker
              size="large"
              className="br-15__date-picker"
              value={
                clear === 1
                  ? []
                  : start !== ''
                  ? [moment(start, dateFormat), moment(end, dateFormat)]
                  : []
              }
              style={{ width: '100%' }}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              onChange={onChangeDate}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Select
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Chọn thao tác"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={type ? type : 'default'}
              onChange={(event) => {
                handleChange(event)
              }}
            >
              <Option value="default">Tất cả thao tác</Option>
              {unique &&
                unique.length > 0 &&
                unique.map((values, index) => {
                  return <Option value={values}>{values}</Option>
                })}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Select
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Chọn thao tác"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={properties ? properties : 'default'}
              onChange={(event) => {
                handleChangeProperties(event)
              }}
            >
              <Option value="default">Tất cả giao diện</Option>
              {uniqueProperties &&
                uniqueProperties.length > 0 &&
                uniqueProperties.map((values, index) => {
                  return <Option value={values}>{values}</Option>
                })}
            </Select>
          </Col>
        </Row>
        <Row justify="end">
          <Button onClick={onClickClear} type="primary" size="large">
            Xóa tất cả lọc
          </Button>
        </Row>
        <div style={{ width: '100%', marginTop: 5, border: '1px solid rgb(243, 234, 234)' }}>
          <Table
            rowKey="_id"
            loading={loading}
            bordered
            size="small"
            columns={columnsPromotion}
            dataSource={activityDiary}
            scroll={{ y: 500 }}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                placeholder="Tìm kiếm khách hàng"
                onSearch={onSearchCustomerChoose}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(209, 191, 191)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Table
              size="small"
              scroll={{ y: 500 }}
              rowSelection={rowSelection}
              columns={columns}
              // dataSource={data}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
