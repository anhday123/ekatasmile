import styles from './../view/view.module.scss'
import React, { useState } from 'react'
import {
  Popconfirm,
  message,
  Input,
  Button,
  Row,
  Col,
  Popover,
  notification,
  Drawer,
  Form,
  Table,
  Modal,
} from 'antd'
import { Link } from 'react-router-dom'
import { PlusCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'

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

const { Search } = Input
export default function AccumulatePointEditView() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  const openNotification = () => {
    notification.success({
      message: 'Success',
      description: 'Thêm phiếu điều chỉnh thành công.',
    })
  }
  const onClose = () => {
    setVisible(false)
  }
  const onCloseAdd = () => {
    setVisible(false)
    openNotification()
  }
  const onSearch = (value) => console.log(value)
  const columnsPromotion = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'ticketCode',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 175,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 150,
    },
    {
      title: 'Ngày điều chỉnh',
      dataIndex: 'editDate',
      width: 150,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updateDate',
      width: 150,
    },
  ]

  const dataPromotion = []
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      ticketCode: (
        <Link
          to="/actions/accumulate-point-edit/detail/19"
          style={{ color: '#2400FF' }}
        >
          GH {i}
        </Link>
      ),
      status:
        i % 2 === 0 ? (
          <Link
            to="/actions/accumulate-point-edit/detail/19"
            style={{ color: '#009C22' }}
          >
            Đã điều chỉnh {i}
          </Link>
        ) : (
          <Link
            to="/actions/accumulate-point-edit/detail/19"
            style={{ color: '#FF7A00' }}
          >
            Đang điều chỉnh {i}
          </Link>
        ),
      createdDate: `09:30, 2021/07/01`,
      editDate: `09:30, 2021/07/01`,
      updateDate: `09:30, 2021/07/01`,
    })
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const onFinish = (values) => {
    console.log('Success:', values)
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }
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
          <Link
            to="/accumulate-point/19"
            style={{
              display: 'flex',
              cursor: 'pointer',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ marginRight: '0.5rem' }}>
              <ArrowLeftOutlined
                style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}
              />
            </div>
            <div className={styles['promotion_manager_title']}>
              Phiếu điều chỉnh tích điểm
            </div>
          </Link>

          <div
            onClick={showDrawer}
            className={styles['promotion_manager_button']}
          >
            <div>
              <Button
                icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                type="primary"
              >
                Tạo phiếu điều chỉnh
              </Button>
            </div>
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
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}>
                <Search
                  placeholder="Tìm kiếm theo mã, theo tên"
                  onSearch={onSearch}
                  enterButton
                />
              </div>
            </Popover>
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
            columns={columnsPromotion.filter(
              (values) => values.dataIndex !== ''
            )}
            dataSource={dataPromotion}
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
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger style={{ width: '7.5rem' }}>
                Xóa phiếu
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
            {' '}
            <Table
              scroll={{ y: 500 }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </div>
      </Modal>
      <Drawer
        title="Tạo phiếu điều chỉnh tích điểm"
        width={'82.5%'}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          style={{}}
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div
            style={{
              display: 'flex',
              marginBottom: '0.75rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Thông tin phiếu
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
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Mã phiếu
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="ticketCode"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập mã phiếu" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Ghi chú
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="note"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập ghi chú" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row
            style={{
              borderBottom: '1px solid rgb(236, 226, 226)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Nhân viên tạo
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="createdEmployee"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tên nhân viên tạo" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Tag
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="tag"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tag" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Thông tin khách hàng
          </div>
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                margin: '1rem 0',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}
          >
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
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
              <Popconfirm
                title="Bạn chắc chắn muốn xóa"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger style={{ width: '7.5rem' }}>
                  Xóa phiếu
                </Button>
              </Popconfirm>
            </div>
          ) : (
            ''
          )}
          <Row
            style={{ marginTop: '1rem' }}
            className={styles['supplier_add_content_supplier_button']}
          >
            <Col
              onClick={onCloseAdd}
              style={{
                width: '100%',
                marginLeft: '1rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              xs={24}
              sm={24}
              md={5}
              lg={4}
              xl={3}
            >
              <Form.Item>
                <Button
                  style={{ width: '7.5rem' }}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
