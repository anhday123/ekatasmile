import styles from './../add/add.module.scss'
import {
  Popconfirm,
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  message,
  Tree,
  Table,
  Modal,
  InputNumber,
} from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, AudioOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
const { Option } = Select

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    width: 150,
  },
  {
    title: 'Tồn chi nhánh',
    dataIndex: 'branchInventory',
    width: 150,
  },
  {
    title: 'Số lượng thực tế',
    width: 150,
    render() {
      return <InputNumber />
    },
  },
  {
    title: 'Số lượng hệ thống',
    width: 150,
    render() {
      return 10
    },
  },
]
const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    skuCode: `IAN ${i}`,
    productName: `Ly thủy tinh`,
    unit: `${i} đơn vị`,
    branchInventory: `Chi nhánh 1`,
  })
}
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
export default function ProductCheckAdd(props) {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll'])
  const [checkedKeys, setCheckedKeys] = useState([''])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  const onFinish = (values) => {
    props.close()
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
  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    message.error('Click on No')
  }
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue)
  }

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue)
  }
  return (
    <>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className={styles['product_check_add']}
      >
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
            Thông tin phiếu kiểm hàng
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
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>Chi nhánh kiểm</div>
                <Form.Item
                  name="checkBranch"
                  // label="Select"
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue="defaultBranch">
                    <Option value="defaultBranch">Chi nhánh mặc định</Option>
                    <Option value="branch1">Chi nhánh 1</Option>
                    <Option value="branch2">Chi nhánh 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>Nhân viên kiểm</div>
                <Form.Item
                  name="checkEmployee"
                  // label="Select"
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue="vt">
                    <Option value="vt">Văn Tỷ</Option>
                    <Option value="vh">Văn hoàng</Option>
                    <Option value="hm">Huỳnh Mẫn</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>Ghi chú</div>
                <Form.Item name="note">
                  <Input placeholder="Nhập ghi chú" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>Tag</div>
                <Form.Item name="tag">
                  <Input placeholder="Nhập tag" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>

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
            Danh sách sản phẩm
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
              xl={11}
            >
              <Search
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo tên sản phẩm, mã sku"
                onSearch={onSearch}
                enterButton
              />
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Form.Item style={{ marginLeft: '1rem', marginTop: '1rem' }}>
              <Button
                style={{ width: '7.5rem' }}
                type="primary"
                htmlType="submit"
              >
                Tạo
              </Button>
            </Form.Item>
          </div>
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
