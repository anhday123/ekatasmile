import React, { useState } from 'react'

// style
import styles from './../offer-list/offer.module.scss'

// antd
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons'
import { Badge, Button, Input, Modal, Select, Table } from 'antd'
import { Link } from 'react-router-dom'
import { PERMISSIONS, ROUTES } from 'consts'
import Permission from 'components/permission'

const { Option } = Select

export default function OfferList() {
  const [selectKeys, setSelectKeys] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [name, setName] = useState('')

  const handleOkModal = () => {
    setModalVisible(false)
  }

  const handleCancelModal = () => {
    setModalVisible(false)
  }

  const openModal = () => {
    setModalVisible(true)
  }

  const columns = [
    {
      title: 'Tên ưu đãi',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      align: 'center',
      className: 'columns',
      render: (text, record, index) => <span>{text}</span>,
    },
    {
      title: 'Loại ưu đãi',
      dataIndex: 'age',
      key: 'age',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Sản phẩm áp dụng',
      dataIndex: 'address',
      key: 'address',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Danh mục áp dụng',
      dataIndex: 'address',
      key: 'address',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Banner',
      dataIndex: 'address',
      key: 'address',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'address',
      key: 'address',
      width: '8%',
      align: 'center',
    },
  ]

  const data = [
    {
      key: 'John',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: 'Jim',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: 'Joe',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ]

  const expandedRowRender = () => {
    const columns = [
      { title: 'Gía ưu đãi', dataIndex: 'date', key: 'date', width: '10%' },
      { title: 'Hình ảnh', dataIndex: 'name', key: 'name' },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'status',
        key: 'state',
      },
      { title: 'SKU', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Danh mục',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: 'Thuộc tính',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: 'Gía bán',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: 'Gía áp dụng',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'operation',
        key: 'operation',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'operation',
        key: 'operation',
      },
    ]

    const data = []
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '10.00$',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
        status: 'true',
      })
    }
    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  return (
    <div className={styles['body_offer']}>
      <Modal
        title="Cập nhật tên ưu đãi"
        visible={modalVisible}
        centered={true}
        onCancel={handleCancelModal}
        footer={[
          <Button onClick={handleOkModal} style={{ textAlign: 'center' }} type="primary">
            Cập nhật
          </Button>,
        ]}
      >
        <h3>Tên ưu đãi</h3>
        <Input placeholder="Nhập tên ưu đãi" />
      </Modal>
      <div className={styles['offer_header']}>
        <div className={styles['offer_title']}>
          <span className={styles['offer_list_text']}>Danh sách ưu đãi</span>
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
      <div className={styles['filter_offer']}>
        <Input.Group compact>
          <Input
            style={{ width: '20%' }}
            placeholder="Tìm kiếm theo tên"
            allowClear
            prefix={<SearchOutlined />}
          />
          <Select placeholder="Tất cả loại ưu đãi" allowClear>
            <Option value="1">Sản phẩm</Option>
            <Option value="2">Nhóm sản phẩm</Option>
            <Option value="2">Banner</Option>
          </Select>
          <Select placeholder="Thời gian" allowClear>
            <Option value="1">Hôm nay</Option>
            <Option value="2">Hôm qua</Option>
            <Option value="2">Tuần này</Option>
          </Select>
        </Input.Group>
      </div>
      <div className={styles['delete_filter']}>
        <div>
          {selectKeys.length !== 0 ? (
            <>
              <Button type="danger" icon={<DeleteOutlined />}>
                Xóa
              </Button>
              <Button onClick={openModal} type="primary" style={{ margin: '0 15px',backgroundColor:"#83BC0B" }}>
                Cập nhật tên ưu đãi
              </Button>
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
        rowKey="key"
        size="small"
        expandable={{
          expandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ) : (
              <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ),
        }}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange: (keys, records) => {
            console.log('keys', keys)
            setSelectKeys(keys)
          },
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}
