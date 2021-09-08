import styles from './../view/view.module.scss'
import {
  Popconfirm,
  message,
  Select,
  Button,
  Input,
  Form,
  Popover,
  notification,
  Row,
  Col,
  Tree,
  Table,
  Modal,
  Typography,
} from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
const { Option } = Select
const { Text } = Typography
const treeData = [
  {
    title: 'Tất cả sản phẩm (tối đa 1000 sản phẩm)',
    key: 'productAll',
  },
  {
    title: 'Tất cả các nhóm sản phẩm',
    key: 'productGroupAll',
    children: [
      {
        title: 'Tất cả loại sản phẩm',
        key: 'productAllType',
      },
      {
        title: 'Tất cả nhãn sản phẩm',
        key: 'productAllBranch',
      },
    ],
  },
]
export default function GuaranteeView() {
  let history = useHistory()
  const [modal2Visible, setModal2Visible] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll'])
  const [checkedKeys, setCheckedKeys] = useState([''])
  const [form] = Form.useForm()
  const [selectedKeys, setSelectedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: 150,
      sorter: (a, b) => {
        return a.productCode > b.productCode
          ? 1
          : a.productCode === b.productCode
          ? 0
          : -1
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
      sorter: (a, b) => {
        return a.productName > b.productName
          ? 1
          : a.productName === b.productName
          ? 0
          : -1
      },
    },
    {
      title: 'Mã bảo hành',
      dataIndex: 'guaranteeCode',
      width: 150,
      sorter: (a, b) => {
        return a.guaranteeCode > b.guaranteeCode
          ? 1
          : a.guaranteeCode === b.guaranteeCode
          ? 0
          : -1
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 150,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Hẹn trả khách',
      dataIndex: 'payment',
      width: 150,
      sorter: (a, b) => moment(a.payment).unix() - moment(b.payment).unix(),
    },
  ]

  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <div>{`IAN ${i}`}</div>,
      productName: `Ly thủy tinh`,
      guaranteeCode: `MH${i}`,
      quantity: i,
      payment: '2021-07-17T15:15:00+07:00',
    })
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật thông tin phiếu bảo hành.',
    })
  }
  const onFinish = (values) => {
    console.log('Success:', values)
    openNotification()
    history.push('/guarantee/11')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const { Search } = Input

  const onSearch = (value) => console.log(value)

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue)
  }

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue)
  }

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }
  function random() {
    return Math.random().toString(16).slice(-4)
  }
  const code = form.getFieldValue()
  code.orderCode = `${random()}-${random()}-${random()}-${random()}-${random()}-${random()}-${random()}-${random()}`
  return (
    <>
      <Form
        onFinish={onFinish}
        form={form}
        onFinishFailed={onFinishFailed}
        className={styles['product_check_add']}
      >
        <Row
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(231, 219, 219)',
            paddingBottom: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <Link
              to="/guarantee/11"
              style={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div>
                <ArrowLeftOutlined
                  style={{
                    color: 'black',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                />
              </div>
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginLeft: '0.5rem',
                }}
              >
                Thông tin phiếu BGHY2365
              </div>
            </Link>
          </Col>
        </Row>

        <Row
          style={{
            display: 'flex',
            marginTop: '1rem',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', backgroundColor: 'white' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
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

              <Row
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Tên khách hàng: nguyễn văn tỷ
                    </div>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Liên hệ: 0384943497
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col
            style={{ width: '100%', backgroundColor: 'white' }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
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
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}
              >
                Thông tin phiếu yêu cầu
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
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Chi nhánh</div>
                    <Form.Item
                      name="branch"
                      // label="Select"
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select defaultValue="branch1">
                        <Option value="branch1">Chi nhánh 1</Option>
                        <Option value="branch2">Chi nhánh 2</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%', marginTop: '1rem' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Ghi chú</div>
                    <Form.Item
                      // label="Username"
                      name="note"
                    >
                      <Input defaultValue="không có" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

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
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      Nhân viên phụ trách
                    </div>
                    <Form.Item
                      // label="Username"
                      name="employeeName"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select defaultValue="employee2">
                        <Option value="employee1">Nhân viên 1</Option>
                        <Option value="employee2">Nhân viên 2</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  style={{ width: '100%' }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={11}
                  xl={11}
                >
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Tag</div>
                    <Form.Item
                      // label="Username"
                      name="tag"
                    >
                      <Input defaultValue="aaa" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Thông tin sản phẩm
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
              style={{ width: '100%', margin: '1.5rem 0rem 1rem 0rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <Popover content={content} trigger="click" placement="bottomLeft">
                <Search
                  style={{ width: '100%' }}
                  placeholder="Tìm kiếm theo tên sản phẩm, mã sku"
                  onSearch={onSearch}
                  enterButton
                />
              </Popover>
            </Col>
          </Row>
          <div
            style={{
              border: '1px solid rgb(224, 208, 208)',
              marginTop: '1rem',
              width: '100%',
            }}
          >
            <Table
              size="small"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              scroll={{ y: 500 }}
              summary={(pageData) => {
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>Tổng cộng:{`${pageData.length}`}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
            />
          </div>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <div
              style={{
                paddingBottom: '1rem',
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
                  Xóa sản phẩm
                </Button>
              </Popconfirm>
            </div>
          ) : (
            ''
          )}
        </div>

        <Modal
          title="Thêm nhanh sản phẩm"
          centered
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div onClick={() => modal2VisibleModal(false)}>
                <Button type="primary" style={{ width: '5rem' }} danger>
                  Hủy
                </Button>
              </div>
              <div>
                <Button
                  type="primary"
                  style={{ width: '5rem', marginLeft: '1rem' }}
                >
                  Thêm
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  )
}
