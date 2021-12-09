import styles from './../import-export-file/import-export-file.module.scss'
import React, { useState } from 'react'
import {
  Popconfirm,
  message,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Popover,
  Select,
  Table,
  Modal,
  Typography,
} from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ROUTES } from 'consts'
import { compare } from 'utils'
const { Option } = Select
const { Text } = Typography
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
export default function ImportExportFile() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const columnsPromotion = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      width: 150,
      sorter: (a, b) => compare(a, b, 'fileName'),
    },
    {
      title: 'Người thao tác',
      dataIndex: 'actionPerson',
      width: 150,
      sorter: (a, b) => compare(a, b, 'actionPerson'),
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      width: 150,
      sorter: (a, b) => compare(a, b, 'function'),
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: 150,
      sorter: (a, b) => moment(a.time).unix() - moment(b.time).unix(),
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'processStatus',
      width: 150,
      sorter: (a, b) => compare(a, b, 'processStatus'),
    },
  ]

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
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
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <Row
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Col
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            className={styles['promotion_manager_title']}
          >
            <Link
              className={styles['supplier_add_back_parent']}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
              to={ROUTES.CONFIGURATION_STORE}
            >
              <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginLeft: '0.5rem',
                }}
                className={styles['supplier_add_back']}
              >
                Quản lý xuất nhập file
              </div>
            </Link>
          </Col>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}>
                <Input size="large" placeholder="Tìm kiếm theo tên file" enterButton />
              </div>
            </Popover>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }} size="large" className="br-15__date-picker" />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select size="large" style={{ width: '100%' }} placeholder="Lọc theo chi nhánh">
                <Option value="branch1">Chi nhánh 1</Option>
                <Option value="branch2">Chi nhánh 2</Option>
                <Option value="branch3">Chi nhánh 3</Option>
              </Select>
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Trạng thái xử lý" size="large">
                <Option value="status1">Trạng thái 1</Option>
                <Option value="status2">Trạng thái 2</Option>
                <Option value="status3">Trạng thái 3</Option>
              </Select>
            </div>
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
            size="small"
            rowSelection={rowSelection}
            columns={columnsPromotion}
            scroll={{ y: 500 }}
          />
        </div>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popconfirm title="Bạn chắc chắn muốn xóa?" okText="Yes" cancelText="No">
              <Button type="primary" danger size="large">
                Xóa thông tin
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                placeholder="Tìm kiếm khách hàng"
                onSearch={onSearchCustomerChoose}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(209, 191, 191)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Table
              size="small"
              scroll={{ y: 500 }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
