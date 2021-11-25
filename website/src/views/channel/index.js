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
import { Button, Input, message, Select, Table, Popconfirm, Switch, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { IMAGE_DEFAULT, PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { deleteBlog, getBlog } from 'apis/blog'

// html react parser
import parse from 'html-react-parser'

const { Option } = Select

export default function Channel() {
  const [selectKeys, setSelectKeys] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [channelList, setChannelList] = useState([])
  const [countPage, setCountPage] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 5 })
  const [attributeDate, setAttributeDate] = useState(undefined)
  const [attributeStatus, setAttributeStatus] = useState(undefined)
  const [attributeBase, setAttributeBase] = useState(undefined)
  const [valueSearch, setValueSearch] = useState('')
  const [connect, setConnect] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [dataUpdate, setDataUpdate] = useState({
    name: '',
    url: '',
    base: '',
  })
  const [channelName, setChannelName] = useState('')
  const typingTimeoutRef = useRef(null)

  const handleChange = (checked) => {
    console.log(checked)
    setConnect(checked)
  }
  const toggleModal = () => {
    setModalVisible(!modalVisible)
    setDataUpdate({
      name: '',
      url: '',
      base: '',
    })
    console.log(dataUpdate)
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
      render: (text) => (
        <a target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: 'Nền tảng',
      dataIndex: '',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: '15%',
      align: 'center',
      render: (text) => (text ? 'Hoạt động' : 'Không hoạt động'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: '10%',
      align: 'center',
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
      dataIndex: '',
      width: '20%',
      align: 'center',
      render: (text) => (
        <div>
          <Switch onChange={handleChange} />
          {/* <span>{connect ? 'Đang kết nối' : 'Kết nối'}</span> */}
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
    },
    {
      name: 'Tiki sale',
      url: 'https://tiki.vn/',
      base: 'Tiki',
      active: false,
      create_date: '24/11/2021',
    },
  ]

  const _updateChannel = (record) => {
    console.log(record)
    setDataUpdate({ ...dataUpdate, name: record.name, url: record.url, base: record.base })
    setModalVisible(!modalVisible)
  }

  const handleChangeChannelName = (e) => {
    setDataUpdate({ ...dataUpdate, name: e.target.value })
    console.log(dataUpdate)
  }

  const handleChangeChannelUrl = (e) => {
    setDataUpdate({ ...dataUpdate, url: e.target.value })
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

  // const _delelteBlog = async () => {
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
    setParamsFilter({ page: 1, page_size: 5 })
  }

  const title = `${dataUpdate ? 'Cập nhật' : 'Thêm mới'}  kênh bán hàng`

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
          <Button onClick={toggleModal} style={{ textAlign: 'center' }} type="primary">
            Kết nối
          </Button>,
        ]}
      >
        <h3>Tên hiển thị</h3>
        <Input
          value={dataUpdate.name ? dataUpdate.name : ''}
          onChange={handleChangeChannelName}
          placeholder="Nhập tên hiển thị"
        />
        <h3 style={{ paddingTop: 20 }}>Url trang web</h3>
        <Input
          value={dataUpdate.url ? dataUpdate.url : ''}
          onChange={handleChangeChannelUrl}
          placeholder="Nhập url trang web"
        />
        <h3 style={{ paddingTop: 20 }}>Nền tảng</h3>
        <Select
          style={{ width: '100%' }}
          value={attributeBase}
          onChange={onChangeOptionSearchBase}
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
      <div className={styles['body_channel_filter']}>
        <Input.Group compact>
          <Input
            style={{ width: '20%' }}
            placeholder="Tìm kiếm theo tên"
            allowClear
            prefix={<SearchOutlined />}
            onChange={_search}
            value={valueSearch}
          />
          <Select
            style={{ width: '13%' }}
            value={attributeStatus}
            onChange={onChangeOptionSearchStatus}
            placeholder="Tất cả (trạng thái)"
            allowClear
          >
            <Option value="active">Hoạt động</Option>
            <Option value="nonactive">Không hoạt động</Option>
          </Select>
          <Select
            style={{ width: '18%' }}
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
          <Select
            style={{ width: '16%' }}
            value={attributeDate}
            onChange={onChangeOptionSearchDate}
            placeholder="Thời gian"
            allowClear
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
        </Input.Group>
      </div>
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
