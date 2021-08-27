import styles from './../product-check/product-check.module.scss'
import React, { useState } from 'react'
import {
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  Popover,
  Drawer,
} from 'antd'
import { Link } from 'react-router-dom'
import { PlusCircleOutlined, FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ROUTES } from 'consts'
import ProductCheckAdd from 'views/actions/product-check/add'
const { Option } = Select
const { RangePicker } = DatePicker
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  })
}
export default function ProductCheck() {
  const { Search } = Input
  const [showCreate, setShowCreate] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })

  const columnsPromotion = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return (pagination.page - 1) * pagination.page_size + index + 1
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'ticketCode',
      width: 150,
    },
    {
      title: 'Tổng SL thực tế',
      width: 150,
    },
    {
      title: 'Tổng SL hệ thống',
      width: 150,
    },
    {
      title: 'Đơn vị',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: 'Ngày kiểm',
      dataIndex: 'checkDate',
      width: 150,
    },
    {
      title: 'Nhân viên kiểm',
      dataIndex: 'createdEmployee',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      width: 150,
    },
  ]

  const dataPromotion = []
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      ticketCode: (
        <Link to={ROUTES.PRODUCT_CHECK_ADD} style={{ color: '#2400FF' }}>
          GH {i}
        </Link>
      ),
      warehouseCheck: `Chi nhánh mặc định ${i}`,
      status: `Đang kiểm kho ${i}`,
      createdDate: `07:30, 2021/07/01 ${i}`,
      checkDate: `07:30, 2021/07/01 ${i}`,
      createdEmployee: `Nguyễn Văn Tỷ`,
      note: `không có ${i}`,
    })
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  return (
    <>
      <div className={styles['promotion_manager']}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Danh sách phiếu kiểm hàng
          </div>
          <div className={styles['promotion_manager_button']}>
            <Button
              icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
              type="primary"
              onClick={() => setShowCreate(true)}
            >
              Tạo phiếu kiểm
            </Button>
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Search placeholder="Tìm kiếm theo mã, theo tên" enterButton />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }} />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo người dùng"
              >
                <Option value="user1">Người dùng 1</Option>
                <Option value="user2">Người dùng 2</Option>
                <Option value="user3">Người dùng 3</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Col
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
              >
                <Button
                  icon={<FileExcelOutlined />}
                  style={{
                    width: '7.5rem',
                    backgroundColor: '#004F88',
                    color: 'white',
                  }}
                >
                  Nhập excel
                </Button>
              </Col>
              <Col
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  marginLeft: '1rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
              >
                <Button
                  icon={<FileExcelOutlined />}
                  style={{
                    width: '7.5rem',
                    backgroundColor: '#008816',
                    color: 'white',
                  }}
                >
                  Xuất excel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            rowSelection={rowSelection}
            columns={columnsPromotion}
            dataSource={dataPromotion}
            scroll={{ y: 500 }}
          />
        </div>
      </div>
      <Drawer
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        width="75%"
        title="Tạo phiếu kiểm hàng"
      >
        <ProductCheckAdd close={() => setShowCreate(false)} />
      </Drawer>
    </>
  )
}
