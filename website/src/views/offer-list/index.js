import React, { useEffect, useRef, useState } from 'react'
import { formatCash } from 'utils'

// style
import styles from './../offer-list/offer.module.scss'

// moment
import moment from 'moment'

// antd
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Table,
  Popconfirm,
  InputNumber,
  DatePicker,
} from 'antd'
import { Link } from 'react-router-dom'
import { PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { deleteDeal, getDeal, updateDeal } from '../../apis/deal'

// html react parser
import parse from 'html-react-parser'

const { Option } = Select
const { RangePicker } = DatePicker

export default function OfferList() {
  const [selectKeys, setSelectKeys] = useState([])
  const [modalVisibleName, setModalVisibleName] = useState(false)
  const [modalVisiblePrice, setModalVisiblePrice] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [dealList, setDealList] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [idChange, setIdChange] = useState('')
  const [countPage, setCountPage] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 5 })
  const [attributeDate, setAttributeDate] = useState(undefined)
  const [valueSearch, setValueSearch] = useState('')
  const [openSelect,setOpenSelect]=useState(false)
  const [valueDateSearch,setValueDateSearch]=useState(null)
  const typingTimeoutRef = useRef(null)

  const toggleModalName = () => {
    setModalVisibleName(!modalVisibleName)
  }

  const toggleModalPrice = () => {
    setModalVisiblePrice(!modalVisiblePrice)
  }
  
  const toggleOpenSelect=()=>{
    setOpenSelect(!openSelect)
  }

  const infoName = (record) => {
    setName(record.name)
    setIdChange(record.deal_id)
    setModalVisibleName(!modalVisibleName)
  }

  const infoPrice = (record) => {
    setPrice(record.saleoff_value)
    setIdChange(record.deal_id)
    setModalVisiblePrice(!modalVisiblePrice)
  }

  const columns = [
    {
      title: 'Tên ưu đãi',
      dataIndex: 'name',
      width: '15%',
      align: 'center',
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record, index) => <a onClick={() => infoName(record)}>{text}</a>,
    },
    {
      title: 'Loại ưu đãi',
      dataIndex: 'type',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'saleoff_value',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.saleoff_value - b.saleoff_value,
      render: (text, record, index) => text ? <a onClick={() => infoPrice(record)}>{formatCash(text)}</a> : '',
    },
    {
      title: 'Giảm giá tối đa',
      dataIndex: 'max_saleoff_value',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Danh mục áp dụng',
      dataIndex: 'sub_type',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Banner',
      dataIndex: 'type',
      width: '10%',
      align: 'center',
      render: (item, record) => (item !== 'BANNER' ? <span>Không có</span> : <span>Có</span>),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '30%',
      align: 'center',
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

  const expandedRowRender = (record) => {
    // console.log(record)
    const columnsBanner = [
      {
        title: 'Hình ảnh banner',
        align: 'center',
        dataIndex: '',
        render: (text, record, index) =>
          record ? <img src={record} alt="" style={{ width: '100px', height: '100px' }} /> : '',
      },
    ]

    const columnsCategory = [
      {
        title: 'Tên danh mục',
        dataIndex: 'name',
        align: 'center',
        children: [],
      },
      {
        title: 'Hình ảnh Category',
        align: 'center',
        dataIndex: 'image',
        render: (text, record, index) =>
          record ? (
            <img src={record.image} alt="" style={{ width: '100px', height: '100px' }} />
          ) : (
            ''
          ),
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: 'Độ ưu tiên',
        dataIndex: 'priority',
        align: 'center',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'create_date',
        align: 'center',
        render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
      },
    ]
    const columnsProduct = [
      {
        title: 'Hình ảnh',
        align: 'center',
        dataIndex: 'image',
        render: (text, record, index) =>
          record ? (
            <img src={record.image} alt="" style={{ width: '100px', height: '100px' }} />
          ) : (
            ''
          ),
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'title',
        align: 'center',
        children: [],
      },

      {
        title: 'SKU',
        dataIndex: 'sku',
        align: 'center',
      },
      {
        title: 'Danh mục',
        dataIndex: 'category',
        align: 'center',
      },
      {
        title: 'Gía áp dụng',
        dataIndex: 'price',
        align: 'center',
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        align: 'center',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'create_date',
        align: 'center',
        render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
      },
    ]
    const expandedRowRenderChild = (record) => {
      // console.log(record)
      const columnsChild = [
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: 'Hình ảnh',
          dataIndex: 'image',
          align: 'center',
          render: (text, record, index) =>
            text ? <img src={text} alt="" style={{ width: '100px', height: '100px' }} /> : '',
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          align: 'center',
          render: (text) => (text ? <span>{text}</span> : <span>Chưa có mô tả</span>),
        },
        {
          title: 'Độ ưu tiên',
          dataIndex: 'priority',
          align: 'center',
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'create_date',
          align: 'center',
          render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
        },
      ]
      return (
        <Table
          rowKey="category_id"
          columns={columnsChild}
          dataSource={record.children_category}
          pagination={false}
        />
      )
    }
    if (record.type === 'CATEGORY') {
      return (
        <Table
          rowKey="category_id"
          expandable={{
            expandedRowRender: expandedRowRenderChild,
            rowExpandable: (record) => (record.children_category.length ? true : false),
          }}
          columns={columnsCategory}
          dataSource={record._categories}
          pagination={false}
        />
      )
    }
    if (record.type === 'BANNER') {
      return <Table columns={columnsBanner} dataSource={record.image_list} pagination={false} />
    }
    if (record.type === 'PRODUCT') {
      const dataProductVariant = []
      record._products.map((product) =>
        product.variants.map((item) => dataProductVariant.push(item))
      )
      // console.log(dataProductVariant)
      return <Table columns={columnsProduct} dataSource={dataProductVariant} pagination={false} />
    }

    return ''
  }

  const _changeDealName = async () => {
    const body = {
      name: name,
    }
    // console.log(body)
    try {
      const res = await updateDeal(body, idChange)
      console.log(res)
      if (res.data.success) {
        setModalVisibleName(!modalVisibleName)
        message.success('Thay đổi tên ưu đãi thành công')
        _getDeal(paramsFilter)
      } else {
        message.success(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const _changePrice = async () => {
    const body = {
      saleoff_value: price,
    }
    console.log(body)
    try {
      const res = await updateDeal(body, idChange)
      console.log(res)
      if (res.data.success) {
        setModalVisiblePrice(!modalVisiblePrice)
        message.success('Thay đổi giá ưu đãi thành công')
        _getDeal(paramsFilter)
      } else {
        message.success(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const _getDeal = async () => {
    try {
      setLoadingTable(true)
      const res = await getDeal(paramsFilter)
      setDealList(res.data.data)
      setCountPage(res.data.count)
      console.log(res)
      setLoadingTable(false)
    } catch (err) {
      console.log(err)
    }
  }

  const _delelteDeal = async () => {
    try {
      const res = await deleteDeal(selectKeys)
      // console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          message.success('Xóa ưu đãi thành công')
          _getDeal(paramsFilter)
          setSelectKeys([])
        } else {
          message.error(res.data.message || 'Xóa ưu đãi không thành công')
        }
      } else {
        message.error('Xóa ưu đãi không thành công')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onChangeOptionSearchType = (value) => {
    if (value) paramsFilter.type = value
    else delete paramsFilter.type
    setParamsFilter({ ...paramsFilter })
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

      //khi search hoac filter thi reset page ve 1
      paramsFilter.page = 1

      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      setParamsFilter({ ...paramsFilter })
    }, 450)
  }

  const _resetFilter = () => {
    setAttributeDate(undefined)
    setValueDateSearch(null)
    setValueSearch('')
    setParamsFilter({ page: 1, pageSize: 5 })
  }

  useEffect(() => {
    _getDeal(paramsFilter)
  }, [paramsFilter])

  return (
    <div className={styles['body_offer']}>
      <Modal
        title="Cập nhật tên ưu đãi"
        visible={modalVisibleName}
        centered={true}
        onCancel={toggleModalName}
        footer={[
          <Button onClick={_changeDealName} style={{ textAlign: 'center' }} type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <h3>Tên ưu đãi</h3>
        <Input
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Nhập tên ưu đãi"
        />
      </Modal>
      <Modal
        title="Cập nhật giá ưu đãi"
        visible={modalVisiblePrice}
        centered={true}
        onCancel={toggleModalPrice}
        footer={[
          <Button onClick={_changePrice} style={{ textAlign: 'center' }} type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <h3>Gía ưu đãi</h3>
        <InputNumber
          style={{ width: '100%' }}
          onChange={(value) => setPrice(value)}
          value={price}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          placeholder="Nhập giá ưu đãi"
        />
      </Modal>

      <div className={styles['body_offer_header']}>
        <div className={styles['body_offer_header_title']}>
          <span className={styles['body_offer_header_list_text']}>Danh sách ưu đãi</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Permission permissions={[PERMISSIONS.tao_uu_dai]}>
          <Link to={ROUTES.OFFER_LIST_CREATE}>
            <Button type="primary">Tạo ưu đãi</Button>
          </Link>
        </Permission>
      </div>
      <hr />
      <div className={styles['body_offer_filter']}>
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
            onChange={onChangeOptionSearchType}
            value={paramsFilter.type}
            style={{ width: '16%' }}
            placeholder="Tất cả loại ưu đãi"
            allowClear
          >
            <Option value="PRODUCT">Sản phẩm</Option>
            <Option value="category">Nhóm sản phẩm</Option>
            <Option value="banner">Banner</Option>
          </Select>
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
      <div className={styles['body_offer_delete_filter']}>
        <div>
          {selectKeys.length !== 0 ? (
            <>
              <Popconfirm
                placement="rightTop"
                onConfirm={_delelteDeal}
                title={'Bạn có chắc chắn muốn xóa ưu đãi này không ?'}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
              {/* <Button
                onClick={toggleModal}
                type="primary"
                style={{ margin: '0 15px', backgroundColor: '#83BC0B', border: 'none' }}
              >
                Cập nhật tên ưu đãi
              </Button> */}
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
        rowKey="deal_id"
        size="small"
        loading={loadingTable}
        columns={columns}
        dataSource={dealList}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange: (keys, records) => {
            // console.log('keys', keys)
            setSelectKeys(keys)
          },
        }}
        expandable={{
          expandedRowRender,
          expandedRowKeys: selectKeys,
          expandIconColumnIndex: -1,
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
