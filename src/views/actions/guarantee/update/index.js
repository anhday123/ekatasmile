import UI from './../../../../components/Layout/UI'
import styles from "./../add/add.module.scss";
import { Popconfirm, message, Select, Button, Input, Form, Popover, notification, Row, Col, DatePicker, Steps, Space, Radio, Tree, Table, Modal } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
const { Option } = Select;
const { Step } = Steps;
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
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: 'Mã bảo hành',
    dataIndex: 'guaranteeCode',
    width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 150,
  },
  {
    title: 'Hẹn trả khách',
    dataIndex: 'payment',
    width: 150,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    productCode: <div>{`IAN ${i}`}</div>,
    productName: `Ly thủy tinh`,
    guaranteeCode: `MH${i}`,
    quantity: i,
    payment: '2021/07/17, 15:15',
  });
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
];
export default function GuaranteeUpdate() {
  let history = useHistory();
  const [current, setCurrent] = useState(0)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll']);
  const [checkedKeys, setCheckedKeys] = useState(['']);
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin phiếu bảo hành.',
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    openNotification()
    history.push('/guarantee/11')
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const { Search } = Input;



  const onSearch = value => console.log(value);

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  function random() {
    return Math.random().toString(16).slice(-4)
  }
  const code = form.getFieldValue()
  code.orderCode = `${random()}-${random()}-${random()}-${random()}-${random()}-${random()}-${random()}-${random()}`
  return (
    <UI>
      <Form onFinish={onFinish}
        form={form}
        onFinishFailed={onFinishFailed} className={styles['product_check_add']}>
        <Row style={{ display: 'flex', borderBottom: '1px solid rgb(231, 219, 219)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <Link to="/guarantee/11" style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div><ArrowLeftOutlined style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }} /></div>
              <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }}>Chỉnh sửa phiếu BGHY2365</div>
            </Link>
          </Col>
          {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={17} xl={17}>
            <div>
              <Steps current={current} onChange={onChange}>
                <Step title="Lên danh sách kiểm"
                // description="This is a description."
                />
                <Step title="Kiểm hàng"
                // description="This is a description."
                />
                <Step title="Thống kê"
                // description="This is a description."
                />
                <Step title="Hoàn thành!"
                // description="This is a description."
                />
              </Steps>

            </div>
          </Col> */}
        </Row>
        {/* 
        <div style={{ display: 'flex', backgroundColor: 'white', padding: '1rem', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Steps size="small" style={{ height: '20rem', paddingTop: '2rem' }} direction="vertical" current={current}
          // onChange={onChange}
          >
            <Step title="Đặt hàng"
            // description="This is a description."
            />
            <Step title="Duyệt"
            // description="This is a description."
            />
            <Step title="Đóng gói"
            // description="This is a description."
            />
            <Step title="Xuất kho"
            // description="This is a description."
            />
            <Step title="Hoàn thành"
            // description="This is a description."
            />
          </Steps>
        </div>
        */}
        <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', backgroundColor: 'white', }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin khách hàng</div>

              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Tên khách hàng</div>
                    <Form.Item
                      // label="Username"
                      name="customerName"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Liên hệ</div>
                    <Form.Item
                      // label="Username"
                      name="phoneNumber"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Input placeholder="Nhập liên hệ" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

            </div>
          </Col>
          <Col style={{ width: '100%', backgroundColor: 'white', }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin phiếu yêu cầu</div>

              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Chi nhánh</div>
                    <Form.Item
                      name="branch"
                      // label="Select"
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select placeholder="Chọn chi nhánh">
                        <Option value="branch1">Chi nhánh 1</Option>
                        <Option value="branch2">Chi nhánh 2</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Ghi chú</div>
                    <Form.Item
                      // label="Username"
                      name="note"

                    >
                      <Input placeholder="Nhập ghi chú" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                <Col style={{ width: '100%', }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Nhân viên phụ trách</div>
                    <Form.Item
                      // label="Username"
                      name="employeeName"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select placeholder="Chọn nhân viên">
                        <Option value="employee1">Nhân viên 1</Option>
                        <Option value="employee2">Nhân viên 2</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%', }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Tag</div>
                    <Form.Item
                      // label="Username"
                      name="tag"

                    >
                      <Input placeholder="Nhập tag" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>


        <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin sản phẩm</div>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
            <Col style={{ width: '100%', margin: '1.5rem 0rem 1rem 0rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <Popover content={content} trigger="click" placement="bottomLeft">
                <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo tên sản phẩm, mã sku" onSearch={onSearch} enterButton />
              </Popover>
            </Col>
            {/* <Col onClick={() => modal2VisibleModal(true)} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '12.5rem' }}>Thêm nhanh sản phẩm</Button></div>
            </Col> */}
          </Row>
          <div style={{ border: '1px solid rgb(224, 208, 208)', marginTop: '1rem', width: '100%' }}>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y: 500 }} />
          </div>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa sản phẩm</Button></Popconfirm></div>) : ('')
          }
        </div>


        <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {/* <Col style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={7} lg={7} xl={7}>
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button style={{ width: '10rem' }} type="primary" danger>
                    Hủy
                  </Button>
                </Form.Item>
              </Col> */}
              <Col style={{ display: 'flex', marginLeft: '2rem', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={7} lg={7} xl={7}>
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                    Lưu
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Col>

        </Row>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <div onClick={() => modal2VisibleModal(false)}><Button type="primary" style={{ width: '5rem' }} danger>Hủy</Button></div>
              <div><Button type="primary" style={{ width: '5rem', marginLeft: '1rem' }} >Thêm</Button></div>
            </div>
          </div>
        </Modal>
      </Form>
    </UI>
  );
}
