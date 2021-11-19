import React, { useState } from 'react'
import styles from './../offer-list-create/offer-create.module.scss'
// antd
import { ArrowLeftOutlined, InfoCircleOutlined,InboxOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table,Upload,message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'

const { Option } = Select
const { Search } = Input
const {Dragger} = Upload

export default function OfferListCreate() {
  const history = useHistory()

  const [filter, setFilter] = useState('')

  const handleChangeMoTa = (e) => {
    const value = e.editor.getData()
    console.log(value)
  }

  const handleChangeFilter = (value) => {
    // console.log(value)
    setFilter(value)
  }
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const data = []
  const data1 = []
  const columns = [
    {
      title: 'Gía ưu đãi',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'SKU',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Danh mục',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Gía áp dụng',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
  ]
  const columns1=[
    {
      title: 'Hình ảnh',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tên danh mục',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'SL sản phẩm trong nhóm',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
  ]

  return (
    <div className={styles['body_offer']}>
      <div className={styles['body_offer_header']}>
        <div className={styles['body_offer_header_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['body_offer_header_list_text']}>Tạo ưu đãi</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button style={{ width: '90px' }} type="primary">
          Tạo
        </Button>
      </div>
      <hr />
      <div>
        <h3>Tên ưu đãi</h3>
        <Input style={{ width: '30%' }} placeholder="Nhập tên ưu đãi"></Input>
        <h3 style={{ padding: '20px 0' }}>Mô tả</h3>
        <CKEditor initData={'Nhập mô tả tại đây'} onChange={handleChangeMoTa} />
        <h3 style={{ padding: '20px 0' }}>Loại ưu đãi</h3>
        <Input.Group compact>
          <Select
            onChange={handleChangeFilter}
            style={{ width: '16%' }}
            placeholder="Chọn loại ưu đãi"
            allowClear
          >
            <Option value="sanpham">Sản phẩm</Option>
            <Option value="nhomsanpham">Nhóm sản phẩm</Option>
            <Option value="banner">Banner</Option>
          </Select>
          <Search
            style={{ width: '50%' }}
            placeholder="Tìm kiếm sản phẩm"
            allowClear
            enterButton
            size="medium"
            onSearch
          />
        </Input.Group>
        <div className={styles['body_offer_create_content']}>
        {filter === 'sanpham' ? (
          <Table columns={columns} dataSource={data} />
        ) : (
          ''
        )}
        {filter === 'nhomsanpham' ? (
          <Table columns={columns1} dataSource={data1} />
        ) : (
          ''
        )}
        {filter === 'banner' ? (
          <Dragger listType="picture" {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
          <p className="ant-upload-hint">
            Hỗ trợ định dạng .PNG,.JPG,.TIFF,.EPS
          </p>
        </Dragger>
        ) : (
          ''
        )}
      </div>
      </div>
    </div>
  )
}
