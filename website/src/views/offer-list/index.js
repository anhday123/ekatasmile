import React, { useEffect, useState } from 'react'

// style
import styles from './../offer-list/offer.module.scss'

// moment
import moment from 'moment'

// antd
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, message, Modal, Select, Table } from 'antd'
import { Link } from 'react-router-dom'
import { PERMISSIONS, POSITION_TABLE, ROUTES } from 'consts'
import Permission from 'components/permission'

// api
import { getDeal, updateDeal } from '../../apis/deal'

const { Option } = Select

export default function OfferList() {
  const [selectKeys, setSelectKeys] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [dealList, setDealList] = useState([])
  const [name, setName] = useState('')
  const [id,setId]=useState('')
  const [countPage, setCountPage] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, pageSize: 5 })

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const info = (record) => {
    setName(record.name)
    setId(record.deal_id)
    // console.log(record.name)
    // console.log(record.deal_id)
    setModalVisible(!modalVisible)
  }

  const columns = [
    {
      title: 'Tên ưu đãi',
      dataIndex: 'name',
      width: '15%',
      align: 'center',
      render: (text, record, index) => <a onClick={() => info(record)}>{text}</a>,
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
    console.log(record)
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
        title: 'Hình ảnh Category',
        align: 'center',
        dataIndex: 'image',
        render: (text, record, index) =>
          record ? <img src={record.image} alt="" style={{ width: '100px', height: '100px' }} /> : '',
      },
    ]
    if (record.type === 'CATEGORY') {
     
      return <Table columns={columnsCategory} dataSource={record.list} pagination={false} />
    }
    if (record.type === 'BANNER') {
      return <Table columns={columnsBanner} dataSource={record.list} pagination={false} />
    }

    return ''
  }

  const _changeDealName=async()=>{
    const body={
      name:name,
    }
    console.log(body);
    try{
      const res=await updateDeal(body,id)
      console.log(res)
      if(res.data.success){
        setModalVisible(!modalVisible)
        message.success("Thay đổi tên ưu đãi thành công")
        _getDeal(paramsFilter)
      }
      else{
        message.success(res.data.message)
      }
    }
    catch(err){
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

  useEffect(() => {
    _getDeal(paramsFilter)
  }, [paramsFilter])

  return (
    <div className={styles['body_offer']}>
      <Modal
        title="Cập nhật tên ưu đãi"
        visible={modalVisible}
        centered={true}
        onCancel={toggleModal}
        footer={[
          <Button onClick={_changeDealName} style={{ textAlign: 'center' }} type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <h3>Tên ưu đãi</h3>
        <Input onChange={(e)=>setName(e.target.value)} defaultValue={name} placeholder="Nhập tên ưu đãi" />
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
          />
          <Select style={{ width: '16%' }} placeholder="Tất cả loại ưu đãi" allowClear>
            <Option value="1">Sản phẩm</Option>
            <Option value="2">Nhóm sản phẩm</Option>
            <Option value="3">Banner</Option>
          </Select>
          <Select placeholder="Thời gian" allowClear>
            <Option value="1">Hôm nay</Option>
            <Option value="2">Hôm qua</Option>
            <Option value="3">Tuần này</Option>
          </Select>
        </Input.Group>
      </div>
      <div className={styles['body_offer_delete_filter']}>
        <div>
          {selectKeys.length !== 0 ? (
            <>
              <Button type="danger" icon={<DeleteOutlined />}>
                Xóa
              </Button>
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
        <Button type="danger" icon={<EditOutlined />}>
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
          pageSize: paramsFilter.pageSize,
          onChange(page, pageSize) {
            setParamsFilter({
              page: page,
              pageSize: pageSize,
            })
          },
        }}
      />
    </div>
  )
}
