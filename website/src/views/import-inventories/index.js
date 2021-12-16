import React, { useEffect, useState } from 'react'
import styles from './import-inventory.module.scss'

import { Row, Space, Select, Table, Button, Modal } from 'antd'
import moment from 'moment'

import { formatCash } from 'utils'
import { ROUTES } from 'consts'
import { Link } from 'react-router-dom'

export default function ImportInventories() {
  const [dataInventory, setDataInventory] = useState([])
  const [selectRowsKey, setSelectRowKeys] = useState([])

  const columns = [
    {
      title: 'Số hóa đơn',
      dataIndex: 'billCode',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'supplier',
    },
    {
      title: 'Kho hàng nhập',
      dataIndex: 'warehouse',
    },
    {
      title: 'Ngày mua hàng',
      dataIndex: 'dateBuy',
    },
    {
      title: 'Tổng tiền (VND)',
      dataIndex: 'sumCost',
    },
    {
      title: 'Số tiền thanh toán (VND)',
      dataIndex: 'sumCostPaid',
    },
    {
      title: 'Tổng số lượng nhập',
      dataIndex: 'quantity',
    },
    {
      title: 'Người tạo đơn',
      dataIndex: 'creator',
    },
    {
      title: 'Người xác nhận phiếu',
      dataIndex: 'creatorAccept',
    },
    {
      title: 'Ngày xác nhận phiếu',
      dataIndex: 'dateAccept',
    },
    {
      title: 'Danh sách sản phẩm',
      render: (text, record) => <ModalDownloadProducts />,
    },
  ]

  const ModalDownloadProducts = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const columnsProduct = [
      {
        title: 'Tên',
        dataIndex: 'name',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
      },
      {
        title: 'Nhóm hàng',
        dataIndex: 'group',
      },
      {
        title: 'Số lượng nhập',
        dataIndex: 'quantity',
      },
    ]

    return (
      <>
        <a onClick={toggle}>Tải xuống</a>
        <Modal
          width={650}
          footer={
            <Row justify="end">
              <Button type="primary">Tải xuống</Button>
            </Row>
          }
          title="Danh sách sản phẩm"
          onCancel={toggle}
          visible={visible}
        >
          <Table
            size="small"
            style={{ width: '100%' }}
            pagination={false}
            columns={columnsProduct}
          />
        </Modal>
      </>
    )
  }

  useEffect(() => {
    let data = []

    for (let i = 0; i < 50; i++)
      data.push({
        id: i,
        billCode: Math.floor(Math.random() * 100000),
        supplier: 'NNC',
        warehouse: 'Kho Hà Nội',
        dateBuy: moment(new Date()).format('DD-MM-YYYY HH:mm'),
        sumCost: formatCash(Math.floor(Math.random() * 10000000)),
        sumCostPaid: formatCash(Math.floor(Math.random() * 9000000)),
        quantity: Math.floor(Math.random() * 33),
        creator: 'Nguyễn Văn A',
        crLinkeatorAccept: 'Phạm Văn Cường',
        dateAccept: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
        payment: formatCash(Math.floor(Math.random() * 9000000)),
      })

    setDataInventory([...data])
  }, [])

  return (
    <div className={`${styles['import-inventory-container']} ${styles['card']}`}>
      <Row
        justify="space-between"
        wrap={false}
        style={{ fontSize: 17, borderBottom: '1px solid #ece2e2' }}
      >
        <h3>Nhập kho</h3>
        <Link to={ROUTES.IMPORT_INVENTORY}>
          <Button type="primary">Tạo đơn nhập kho</Button>
        </Link>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Space>
          <div>
            <div>Lọc theo tên nhà cung cấp</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn nhà cung cấp"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="NNC">NCC</Select.Option>
              <Select.Option value="Thực phẩm">Thực phẩm</Select.Option>
              <Select.Option value="Nước giải khát">Nước giải khát</Select.Option>
            </Select>
          </div>

          <div>
            <div>Lọc theo kho hàng</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn kho hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="Kho HN">Kho HN</Select.Option>
              <Select.Option value="Kho SG">Kho SG</Select.Option>
              <Select.Option value="Logistic">Logistic</Select.Option>
            </Select>
          </div>

          <div>
            <div>Lọc theo ngày mua hàng</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn ngày mua hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="Hôm nay">Hôm nay</Select.Option>
              <Select.Option value="Hôm qua">Hôm qua</Select.Option>
              <Select.Option value="Tuần này">Tuần này</Select.Option>
              <Select.Option value="Tuần trước">Tuần trước</Select.Option>
              <Select.Option value="Tháng này">Tháng này</Select.Option>
              <Select.Option value="Tháng trước">Tháng trước</Select.Option>
            </Select>
          </div>

          <div>
            <div>Trạng thái</div>
            <Select
              style={{ width: 220 }}
              placeholder="Chọn ngày mua hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="Lưu nháp">Lưu nháp</Select.Option>
              <Select.Option value="Đã thanh toán">Đã thanh toán</Select.Option>
              <Select.Option value="Đã huỷ">Đã huỷ</Select.Option>
            </Select>
          </div>
        </Space>
      </div>

      <div style={{ marginTop: 20 }}>
        {selectRowsKey.length !== 0 ? (
          <Space>
            <Button type="primary">In hóa đơn</Button>
            <Button style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}>
              Xuất excel
            </Button>
          </Space>
        ) : (
          ''
        )}
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectRowsKey,
            onChange: (keys) => setSelectRowKeys(keys),
          }}
          size="small"
          dataSource={dataInventory}
          columns={columns}
          style={{ width: '100%', marginTop: 10 }}
        />
      </div>
    </div>
  )
}
