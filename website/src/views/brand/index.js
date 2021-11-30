import React, { useEffect, useRef, useState } from 'react'

// style
import styles from './../brand/brand.module.scss'

// moment
import moment from 'moment'

// antd
import {
  DeleteOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Input, message, Select, Table, Popconfirm, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import { IMAGE_DEFAULT, PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { deleteBrand, getBrand } from 'apis/brand'

// html react parser
import parse from 'html-react-parser'

const { Option } = Select
const { RangePicker } = DatePicker

export default function Brand() {
  const [selectKeys, setSelectKeys] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [brandList, setBrandList] = useState([])
  const [countPage, setCountPage] = useState('')
  const [openSelect,setOpenSelect]=useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 5 })
  const [attributeDate, setAttributeDate] = useState(undefined)
  const [valueSearch, setValueSearch] = useState('')
  const [valueDateSearch,setValueDateSearch]=useState(null)
  const typingTimeoutRef = useRef(null)

  const toggleOpenSelect=()=>{
    setOpenSelect(!openSelect)
  }

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <img src={text ? text[0] : IMAGE_DEFAULT} alt="" style={{ width: 80, height: 80 }} />
      ),
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      width: '20%',
      align: 'center',
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record) => (
        <Link to={{ pathname: ROUTES.BRAND_CREATE, state: record }}>{text}</Link>
      ),
    },
    {
      title: 'Quốc gia',
      dataIndex: '_country',
      width: '15%',
      align: 'center',
      render: (text, record) => (text && text[0]?.name ? text[0].name : 'Chưa cập nhật quốc gia'),
    },
    {
      title: 'Năm thành lập',
      dataIndex: 'founded_year',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'content',
      width: '25%',
      align: 'center',
      render: (text) => parse(text),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: '10%',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
    },
  ]

  const _getBrand = async () => {
    try {
      setLoadingTable(true)
      const res = await getBrand(paramsFilter)
      setBrandList(res.data.data)
      setCountPage(res.data.count)
      console.log(res)
      setLoadingTable(false)
    } catch (err) {
      console.log(err)
    }
  }

  const _delelteBrand = async () => {
    const id = {
      brand_id: selectKeys,
    }
    // console.log(id)
    try {
      const res = await deleteBrand(id)
      // console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          message.success('Xóa thương hiệu thành công')
          _getBrand(paramsFilter)
          setSelectKeys('')
        } else {
          message.error(res.data.message || 'Xóa thương hiệu không thành công')
        }
      } else {
        message.error('Xóa thương hiệu không thành công')
      }
    } catch (err) {
      console.log(err)
    }
  }

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

      //khi search hoặc filter thi reset page ve 1
      paramsFilter.page = 1

      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      setParamsFilter({ ...paramsFilter })
    }, 450)
  }

  const _resetFilter = () => {
    setAttributeDate(undefined)
    setValueSearch('')
    setValueDateSearch(null)
    setParamsFilter({ page: 1, page_size: 5 })
  }

  useEffect(() => {
    _getBrand(paramsFilter)
  }, [paramsFilter])

  return (
    <div className={styles['body_brand']}>
      <div className={styles['body_brand_header']}>
        <div className={styles['body_brand_header_title']}>
          <span className={styles['body_brand_header_list_text']}>Quản lý thương hiệu</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Permission permissions={[PERMISSIONS.tao_thuong_hieu]}>
          <Link to={ROUTES.BRAND_CREATE}>
            <Button type="primary">Tạo thương hiệu</Button>
          </Link>
        </Permission>
      </div>
      <hr />
      <div className={styles['body_brand_filter']}>
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
            style={{ width: '25%' }}
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
                 style={{width:"100%"}}
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
        </Input.Group>
      </div>
      <div className={styles['body_brand_delete_filter']}>
        <div>
          {selectKeys.length !== 0 ? (
            <>
              <Popconfirm
                placement="rightTop"
                title={'Bạn có chắc chắn muốn xóa bài viết này không ?'}
                okText="Yes"
                cancelText="No"
                onConfirm={_delelteBrand}
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
        rowKey="brand_id"
        size="small"
        loading={loadingTable}
        columns={columns}
        dataSource={brandList}
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
