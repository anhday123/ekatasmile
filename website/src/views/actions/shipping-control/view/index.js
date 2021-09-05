import styles from './../view/view.module.scss'
import React, { useState } from 'react'
import {
  Popconfirm,
  message,
  Select,
  Button,
  Input,
  Row,
  Col,
  Popover,
  DatePicker,
  Form,
  Table,
  Typography,
} from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom'
import {
  ArrowLeftOutlined,
  AudioOutlined,
  UserOutlined,
} from '@ant-design/icons'
const { Option } = Select
const { Text } = Typography
export default function ShippingControlView() {
  function onChange(date, dateString) {
    console.log(date, dateString)
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { Search } = Input
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  )
  const onFinish = (values) => {
    console.log('Success:', values)
  }
  const { Option } = Select
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const onSearch = (value) => console.log(value)
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'shippingCode',
      width: 150,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      width: 150,
    },
    {
      title: 'COD (hệ thống)',
      dataIndex: 'systemCOD',
      width: 150,
    },
    {
      title: 'COD (đối tác)',
      dataIndex: 'partnerCOD',
      width: 150,
    },
    {
      title: 'Phí (hệ thống)',
      dataIndex: 'systemFee',
      width: 150,
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí (đối tác)',
      dataIndex: 'partnerFee',
      width: 150,
      sorter: (a, b) => a - b,
    },
    {
      title: 'Người trả phí',
      dataIndex: 'feePaid',
      width: 150,
    },
  ]
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      shippingCode: `GUN ${i}`,
      orderCode: `GHN ${i}`,
      systemCOD: i,
      partnerCOD: i,
      systemFee: i,
      partnerFee: i,
      feePaid: `Nguyễn Văn A ${i}`,
    })
  }
  return (
    <>
      <Form
        onFinish={onFinish}
        className={styles['shipping_control_add']}
        onFinishFailed={onFinishFailed}
      >
        <Link
          to="/shipping-control/17"
          className={styles['shipping_control_add_title']}
        >
          <div>
            <ArrowLeftOutlined />
          </div>
          <div>Thông tin đổi soát DNB001</div>
        </Link>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            justifyContent: 'flex-start',
            marginTop: '1rem',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'black',
              fontWeight: '600',
              width: '100%',
            }}
          >
            Đối tác vận chuyển
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
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginRight: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'black',
                      borderRadius: '50%',
                      padding: '0.25rem',
                    }}
                  >
                    <UserOutlined
                      style={{ color: 'white', fontSize: '1.25rem' }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    Văn Tỷ
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    0384943497
                  </div>
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                Công nợ hiện tại: 4.000.000 VNĐ
              </div>
            </Col>
          </Row>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            justifyContent: 'flex-start',
            marginTop: '1rem',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'black',
              fontWeight: '600',
              width: '100%',
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
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={5}
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
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  Mã phiếu
                </div>
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="ticketCode"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input disabled defaultValue="AWB111" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={5}
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
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  Nhân viên kiểm
                </div>
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="employeeCheck"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    disabled
                    defaultValue="employee1"
                    style={{ width: '100%' }}
                  >
                    <Option value="employee1">Nhân viên 1</Option>
                    <Option value="employee2">Nhân viên 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={5}
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
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  Ghi chú
                </div>
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="note"
                >
                  <Input disabled defaultValue="không có" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={5}
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
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '0.5rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  Tag
                </div>
                <Form.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  // label="Username"
                  name="tag"
                >
                  <Input disabled defaultValue="A B C" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            justifyContent: 'flex-start',
            marginTop: '1rem',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: 'black',
              fontWeight: '600',
              width: '100%',
            }}
          >
            Thông tin vận đơn
          </div>
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div style={{ width: '100%', marginTop: '1rem' }}>
              <Search
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo tên mã đơn hàng, mã vận đơn, tên, liên hệ người nhận"
                onSearch={onSearch}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{
              width: '100%',
              marginTop: '1rem',
              border: '1px solid rgb(235, 222, 222)',
            }}
          >
            <Table
              rowSelection={rowSelection}
              summary={(pageData) => {
                let totalPrice = 0

                console.log(pageData)
                pageData.forEach((values, index) => {
                  totalPrice += values.partnerCOD
                })

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>Tổng cộng:</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalPrice}`}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalPrice}`}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalPrice}`}</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalPrice}`}</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
              columns={columns}
              style={{ width: '100%' }}
              dataSource={data}
              scroll={{ y: 500 }}
            />
          </div>
          {/* <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <Form.Item >
              <Button style={{ width: '7.5rem', marginLeft: '1rem' }} type="primary" htmlType="submit">
                Đối soát
              </Button>
            </Form.Item>
          </div> */}
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
                  Xóa vận đơn
                </Button>
              </Popconfirm>
            </div>
          ) : (
            ''
          )}
        </div>
      </Form>
    </>
  )
}
