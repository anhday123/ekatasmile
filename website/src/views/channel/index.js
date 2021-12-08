import React, { useEffect, useRef, useState } from 'react'

// style
import styles from './../channel/channel.module.scss'

// moment
import moment from 'moment'

// antd
import {
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  message,
  Select,
  Table,
  Popconfirm,
  Switch,
  Modal,
  DatePicker,
  Form,
  Badge,
  Row,
  Col,
} from 'antd'
import { Link } from 'react-router-dom'
import { IMAGE_DEFAULT, PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { deleteBlog, getBlog } from 'apis/blog'

// html react parser
import parse from 'html-react-parser'
import { compare } from 'utils'

const { Option } = Select
const { RangePicker } = DatePicker

export default function Channel() {
  const [form] = Form.useForm()
  const [selectKeys, setSelectKeys] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [channelList, setChannelList] = useState([])
  const [countPage, setCountPage] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 5 })
  const [attributeDate, setAttributeDate] = useState(undefined)
  const [attributeStatus, setAttributeStatus] = useState(undefined)
  const [attributeBase, setAttributeBase] = useState(undefined)
  const [valueSearch, setValueSearch] = useState('')
  const [valueDateSearch, setValueDateSearch] = useState(null)
  const [connect, setConnect] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [dataUpdate, setDataUpdate] = useState({
    name: '',
    url: '',
    base: '',
  })
  const [base, setBase] = useState('')
  console.log(base)
  const [channelName, setChannelName] = useState('')
  const typingTimeoutRef = useRef(null)

  const handleChange = (checked) => {
    console.log(checked)
    setConnect(checked)
  }
  const toggleModal = () => {
    setModalVisible(!modalVisible)
    // setDataUpdate({
    //   name: '',
    //   url: '',
    //   base: '',
    // })
    form.resetFields()
  }

  const toggleOpenSelect = () => {
    setOpenSelect(!openSelect)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      width: '15%',
      align: 'center',
      sorter: (a, b) => a.name.length - b.name.length,
      // render: (text, record) => (
      //   <Link to={{ pathname: ROUTES.BLOG_CREATE, state: record }}>{text}</Link>
      // ),
    },
    {
      title: 'Url',
      dataIndex: 'url',
      width: '15%',
      align: 'center',
      sorter: (a, b) => a.url.length - b.url.length,
      render: (text) => (
        <a target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: 'Nền tảng',
      dataIndex: 'base',
      width: '15%',
      align: 'center',
      sorter: (a, b) => compare(a, b, 'base'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: '15%',
      align: 'center',
      render: (text) =>
        text ? (
          <Badge status="success" text="Hoạt động" />
        ) : (
          <Badge status="error" text="Không hoạt động" />
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: '10%',
      align: 'center',
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),

      // render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
    },
    {
      title: 'Hành động',
      dataIndex: '',
      width: '15%',
      align: 'center',
      render: (text, record) => (
        <div className={styles['body_channel_table_action']}>
          <Button type="primary" onClick={() => _updateChannel(record)} style={{ width: 100 }}>
            Cập nhật
          </Button>
          <Button type="danger" style={{ width: 100, margin: '10px 0' }}>
            Xóa
          </Button>
          <Button type="primary" style={{ width: 100, backgroundColor: '#70BE4B', border: 'none' }}>
            Kết nối lại
          </Button>
        </div>
      ),
    },
    {
      title: 'Kết nối',
      dataIndex: 'active',
      width: '20%',
      align: 'center',
      render: (text) => (
        <div>
          <Switch defaultChecked={text} onChange={handleChange} />
        </div>
      ),
    },
  ]

  const data = [
    {
      name: 'Shopee sale',
      url: 'https://shopee.vn/',
      base: 'Shopee',
      active: true,
      create_date: '24/11/2021',
      active: true,
    },
    {
      name: 'Tiki sale',
      url: 'https://tiki.vn/',
      base: 'Tiki',
      active: false,
      create_date: '24/11/2021',
      active: false,
    },
  ]

  const _updateChannel = (record) => {
    console.log(record)
    // setDataUpdate({ ...dataUpdate, name: record.name, url: record.url, base: record.base })
    form.setFieldsValue({ name: record.name, url: record.url, base: record.base })
    setModalVisible(!modalVisible)
  }

  const handleChangeChannelName = (e) => {
    // setDataUpdate({ ...dataUpdate, name: e.target.value })
    console.log(dataUpdate)
  }

  const handleChangeChannelUrl = (e) => {
    // setDataUpdate({ ...dataUpdate, url: e.target.value })
    console.log(dataUpdate)
  }

  // const _getBlog = async () => {
  //   try {
  //     setLoadingTable(true)
  //     const res = await getBlog(paramsFilter)
  //     setBlogList(res.data.data)
  //     setCountPage(res.data.count)
  //     // console.log(res)
  //     setLoadingTable(false)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const _actionChannel = async () => {
    try {
      await form.validateFields()
      const formData = form.getFieldsValue()
      const body = {
        name: formData.name,
        url: formData.url,
        base: formData.base,
      }
      console.log(body)
      // const res = await getBlog(paramsFilter)
      // console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  // const _delelteChannel = async () => {
  //   const id = {
  //     blog_id: selectKeys,
  //   }
  //   // console.log(id)
  //   try {
  //     const res = await deleteBlog(id)
  //     // console.log(res)
  //     if (res.status === 200) {
  //       if (res.data.success) {
  //         message.success('Xóa bài viết thành công')
  //         _getBlog(paramsFilter)
  //       } else {
  //         message.error(res.data.message || 'Xóa bài viết không thành công')
  //       }
  //     } else {
  //       message.error('Xóa bài viết không thành công')
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const onChangeOptionSearchDate = (value) => {
    delete paramsFilter[attributeDate]
    if (value) paramsFilter[value] = true
    else delete paramsFilter[value]
    setAttributeDate(value)
    setParamsFilter({ ...paramsFilter })
    if (openSelect) toggleOpenSelect()
  }

  const onChangeOptionSearchStatus = (value) => {
    delete paramsFilter[attributeStatus]
    if (value) paramsFilter[value] = true
    else delete paramsFilter[value]
    setAttributeStatus(value)
    setParamsFilter({ ...paramsFilter })
  }

  const onChangeOptionSearchBase = (value) => {
    delete paramsFilter[attributeBase]
    if (value) paramsFilter.base = value
    else delete paramsFilter.base
    setAttributeBase(value)
    setParamsFilter({ ...paramsFilter })
  }

  const _search = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const value = e.target.value

      //khi search hoặc filter thi reset page ve 1
      paramsFilter.page = 1

      if (value) paramsFilter.title = value
      else delete paramsFilter.title

      setParamsFilter({ ...paramsFilter })
    }, 450)
  }

  const _resetFilter = () => {
    // console.log(paramsFilter)
    setAttributeDate(undefined)
    setAttributeStatus(undefined)
    setAttributeBase(undefined)
    setValueSearch('')
    setValueDateSearch(null)
    setParamsFilter({ page: 1, page_size: 5 })
  }

  const title = `${form.getFieldsValue().name ? 'Cập nhật' : 'Thêm mới'}  kênh bán hàng`

  // useEffect(() => {
  //   _getBlog(paramsFilter)
  // }, [paramsFilter])

  return (
    <div className={styles['body_channel']}>
      <Modal
        title={title}
        visible={modalVisible}
        centered={true}
        onCancel={toggleModal}
        footer={[
          <div style={{ textAlign: 'center' }}>
            <Button onClick={_actionChannel} type="primary">
              Kết nối
            </Button>
          </div>,
        ]}
      >
        <Form form={form}>
          <h3>Tên hiển thị</h3>
          <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên kênh' }]}>
            <Input
              // value={dataUpdate.name ? dataUpdate.name : ''}
              // onChange={handleChangeChannelName}
              placeholder="Nhập tên hiển thị"
            />
          </Form.Item>
          <h3>Url trang web</h3>
          <Form.Item name="url" rules={[{ required: true, message: 'Vui lòng nhập url kênh' }]}>
            <Input
              // value={dataUpdate.url ? dataUpdate.url : ''}
              // onChange={handleChangeChannelUrl}
              placeholder="Nhập url trang web"
            />
          </Form.Item>
          <h3>Nền tảng</h3>
          <Form.Item name="base" rules={[{ required: true, message: 'Vui lòng chọn nền tảng' }]}>
            <Select
              style={{ width: '100%' }}
              value={attributeBase}
              onChange={(value) => setBase(value)}
              placeholder="Chọn nền tảng"
              allowClear
            >
              <Option value="shopify">Shopify</Option>
              <Option value="amazon">Amazon</Option>
              <Option value="shopbase">Shopbase</Option>
              <Option value="wordpress">Woocommerce (wordpress)</Option>
              <Option value="esty">Esty</Option>
              <Option value="tiki">Tiki</Option>
              <Option value="lazada">Lazada</Option>
              <Option value="shopee">Shopee</Option>
            </Select>
          </Form.Item>
          {base ? (
            <>
              <h3>Key</h3>
              <Form.Item name="key" rules={[{ required: true, message: 'Vui lòng nhập key' }]}>
                <Input
                  // value={dataUpdate.url ? dataUpdate.url : ''}
                  // onChange={handleChangeChannelUrl}
                  placeholder="Nhập key"
                />
              </Form.Item>
              <h3>Key Secret</h3>
              <Form.Item
                name="key"
                rules={[{ required: true, message: 'Vui lòng nhập key secret' }]}
              >
                <Input
                  // value={dataUpdate.url ? dataUpdate.url : ''}
                  // onChange={handleChangeChannelUrl}
                  placeholder="Nhập key secret"
                />
              </Form.Item>
            </>
          ) : (
            ''
          )}
        </Form>
      </Modal>
      <div className={styles['body_channel_header']}>
        <div className={styles['body_channel_header_title']}>
          <span className={styles['body_channel_header_list_text']}>Quản lý kênh</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Permission permissions={[PERMISSIONS.tao_kenh_ban_hang]}>
          <Button onClick={toggleModal} type="primary">
            Thêm kênh bán hàng
          </Button>
        </Permission>
      </div>
      <hr />
      <Row style={{ marginTop: 20, marginBottom: 20 }} gutter={30}>
        <Col span={6}>
          <Input
            size="large"
            placeholder="Tìm kiếm theo tên"
            allowClear
            prefix={<SearchOutlined />}
            onChange={_search}
            value={valueSearch}
          />
        </Col>
        <Col span={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={attributeStatus}
            onChange={onChangeOptionSearchStatus}
            placeholder="Tất cả (trạng thái)"
            allowClear
          >
            <Option value="active">Hoạt động</Option>
            <Option value="nonactive">Không hoạt động</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={attributeBase}
            onChange={onChangeOptionSearchBase}
            placeholder="Tất cả (nền tảng)"
            allowClear
          >
            <Option value="shopify">Shopify</Option>
            <Option value="amazon">Amazon</Option>
            <Option value="shopbase">Shopbase</Option>
            <Option value="wordpress">Woocommerce (wordpress)</Option>
            <Option value="esty">Esty</Option>
            <Option value="tiki">Tiki</Option>
            <Option value="lazada">Lazada</Option>
            <Option value="shopee">Shopee</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={attributeDate}
            onChange={onChangeOptionSearchDate}
            placeholder="Thời gian"
            allowClear
            open={openSelect}
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
                      setAttributeDate()
                    } else {
                      const dateFirst = dateStrings[0]
                      const dateLast = dateStrings[1]
                      setValueDateSearch(dates)
                      setAttributeDate(`${dateFirst} -> ${dateLast}`)

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

      <div className={styles['body_channel_delete_filter']}>
        <Button onClick={_resetFilter} type="danger" icon={<FilterOutlined />}>
          Xóa bộ lọc
        </Button>
      </div>
      <Table
        rowKey="name"
        size="small"
        loading={loadingTable}
        columns={columns}
        dataSource={data}
        // rowSelection={{
        //   selectedRowKeys: selectKeys,
        //   onChange: (keys, records) => {
        //     // console.log('keys', keys)
        //     setSelectKeys(keys)
        //   },
        // }}
        pagination={{
          position: POSITION_TABLE,
          total: countPage,
          current: paramsFilter.page,
          pageSize: paramsFilter.page_size,
          onChange(page, pageSize) {
            setParamsFilter({
              ...paramsFilter,
              page: page,
              page_size: pageSize,
            })
          },
        }}
      />
    </div>
  )
}
