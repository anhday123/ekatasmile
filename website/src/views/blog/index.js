import React, { useEffect, useRef, useState } from 'react'

// style
import styles from './../blog/blog.module.scss'

// moment
import moment from 'moment'

// antd
import {
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Input, message, Select, Table, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { deleteDeal, getDeal, updateDeal } from '../../apis/deal'

// html react parser
import parse from 'html-react-parser'

const { Option } = Select

export default function Blog() {
  const [selectKeys, setSelectKeys] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [blogList, setBlogList] = useState([])
  const [countPage, setCountPage] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, pageSize: 5 })
  const [attributeDate, setAttributeDate] = useState(undefined)
  const [valueSearch, setValueSearch] = useState('')
  const typingTimeoutRef = useRef(null)

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '20%',
      align: 'center',
      render: (text) => <img src={text} alt="" style={{ width: 80, height: 80 }} />,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: '25%',
      align: 'center',
      render:(text,record)=><Link to={{pathname:ROUTES.BLOG_CREATE,state:record}}>{text}</Link>
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: '40%',
      align: 'center',
      sorter: (a, b) => a.content.length - b.content.length,
      render: (text, record) => (!text ? '' : parse(text)),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: '15%',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
    },
  ]

  const data = [
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì hảo hảo',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì gấu đỏ',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì omachi',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì 3 miền',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì 4 miền',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
    {
      image:
        'https://vietmartjp.com/wp-content/uploads/2020/09/mi-hao-hao-bun-mi-pho-viet-o-nhat-vietmart.jpg',
      title: 'Mì giấy',
      content: 'Mì omachi ngon hơn',
      create_date: '2021-11-22T02:14:43.371Z',
    },
  ]

  //   const _getDeal = async () => {
  //     try {
  //       setLoadingTable(true)
  //       const res = await getDeal(paramsFilter)
  //       setDealList(res.data.data)
  //       setCountPage(res.data.count)
  //       console.log(res)
  //       setLoadingTable(false)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   const _delelteDeal = async () => {
  //     try {
  //       const res = await deleteDeal(selectKeys)
  //       // console.log(res)
  //       if (res.status === 200) {
  //         if (res.data.success) {
  //           message.success('Xóa ưu đãi thành công')
  //           _getDeal(paramsFilter)
  //         } else {
  //           message.error(res.data.message || 'Xóa ưu đãi không thành công')
  //         }
  //       } else {
  //         message.error('Xóa ưu đãi không thành công')
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  const onChangeOptionSearchDate = (value) => {
    delete paramsFilter[attributeDate]
    if (value) paramsFilter[value] = true
    else delete paramsFilter[value]
    setAttributeDate(value)
    setParamsFilter({ ...paramsFilter })
  }

  const _search = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const value = e.target.value

      //khi search hoac filter thi reset page ve 1
      paramsFilter.page = 1

      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      setParamsFilter({ ...paramsFilter })
    }, 450)
  }

  const _resetFilter = () => {
    setAttributeDate(undefined)
    setValueSearch('')
    setParamsFilter({ page: 1, pageSize: 5 })
  }

  //   useEffect(() => {
  //     _getDeal(paramsFilter)
  //   }, [paramsFilter])

  return (
    <div className={styles['body_blog']}>
      <div className={styles['body_blog_header']}>
        <div className={styles['body_blog_header_title']}>
          <span className={styles['body_blog_header_list_text']}>Quản lý bài viết</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Permission permissions={[PERMISSIONS.tao_bai_viet]}>
        <Link to={ROUTES.BLOG_CREATE}>
          <Button type="primary">Tạo bài viết</Button>
        </Link>
        </Permission>
      </div>
      <hr />
      <div className={styles['body_blog_filter']}>
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
      <div className={styles['body_blog_delete_filter']}>
        <div>
          {selectKeys.length !== 0 ? (
            <>
              <Popconfirm
                placement="rightTop"
                title={'Bạn có chắc chắn muốn xóa bài viết này không ?'}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          ) : (
            <div></div>
          )}
        </div>
        <Button onClick={_resetFilter} type="danger" icon={<FilterOutlined />}>
          Xóa bộ lọc
        </Button>
      </div>
      <Table
        rowKey="blog_id"
        size="small"
        loading={loadingTable}
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange: (keys, records) => {
            // console.log('keys', keys)
            setSelectKeys(keys)
          },
        }}
        pagination={{
          position: POSITION_TABLE,
          total: countPage,
          current: paramsFilter.page,
          pageSize: paramsFilter.pageSize,
          onChange(page, pageSize) {
            setParamsFilter({
              ...paramsFilter,
              page: page,
              pageSize: pageSize,
            })
          },
        }}
      />
    </div>
  )
}
