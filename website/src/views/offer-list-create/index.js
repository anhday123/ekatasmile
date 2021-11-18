import React from 'react'
import styles from './../offer-list-create/offer-create.module.scss'
// antd
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Input, Select,Table } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'


const { Option } = Select
const { Search } = Input;

export default function OfferListCreate() {
  const history = useHistory()

  const handleChangeMoTa = (e) => {
    const value = e.editor.getData()
    console.log(value)
  }

  const data=[];
  const columns=[];

  return (
    <div className={styles['body_offer']}>
      <div className={styles['offer_header']}>
        <div className={styles['offer_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['offer_list_text']}>Tạo ưu đãi</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button style={{ width: '90px' }} type="primary">
          Tạo
        </Button>
      </div>
      <hr />
      <div className={styles['offer_content']}>
        <h3>Tên ưu đãi</h3>
        <Input style={{ width: '30%' }} placeholder="Nhập tên ưu đãi"></Input>
        <h3 style={{ padding: '20px 0' }}>Mô tả</h3>
        <CKEditor initData={'Nhập mô tả tại đây'} onChange={handleChangeMoTa} />
        <h3 style={{ padding: '20px 0' }}>Loại ưu đãi</h3>
        <Input.Group compact>
          <Select placeholder="Chọn loại ưu đãi" allowClear>
            <Option value="1">Sản phẩm</Option>
            <Option value="2">Nhóm sản phẩm</Option>
            <Option value="2">Banner</Option>
          </Select>
          <Search
            style={{width:"50%"}}
            placeholder="Tìm kiếm sản phẩm"
            allowClear
            enterButton
            size="medium"
            onSearch
          />
        </Input.Group>
        <Table
        style={{padding:"20px 0"}}
        columns={columns}
        dataSource={data}
        />
      </div>
    </div>
  )
}
