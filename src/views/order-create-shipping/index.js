import UI from './../../components/Layout/UI'
import styles from "./../order-create-shipping/order-create-shipping.module.scss";
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
import { ArrowLeftOutlined } from "@ant-design/icons";
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
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: 150,
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
    width: 150,
  },
  {
    title: 'Thành tiền',
    dataIndex: 'moneyTotal',
    width: 150,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    skuCode: <Link to="/actions/order-create-shipping/add/3">{`IAN ${i}`}</Link>,
    productName: `Ly thủy tinh`,
    unit: `${i} đơn vị`,
    quantity: i,
    price: i,
    moneyTotal: i,
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
export default function OrderCreateShipping() {
  let history = useHistory();
  const [current, setCurrent] = useState(0)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll']);
  const [checkedKeys, setCheckedKeys] = useState(['']);
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Tạo đơn thành công.',
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    openNotification()
    history.push('/order-list/4')
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
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={5} xl={5}>
            <Link to="/order-list/4" style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div><ArrowLeftOutlined style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }} /></div>
              <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }}>Tạo đơn hàng</div>
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
          <Col style={{ width: '100%', backgroundColor: 'white', marginBottom: '1rem', padding: '1rem', }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin khách hàng</div>
              <div style={{ display: 'flex', marginTop: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Popover content={content} trigger="click" placement="bottomLeft">
                  <Search style={{ width: '100%' }} placeholder="Tìm kiếm khách hàng" onSearch={onSearch} enterButton />
                </Popover>
              </div>
            </div>
          </Col>
          <Col style={{ width: '100%', backgroundColor: 'white', padding: '1rem', }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin đơn hàng</div>

              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Mã đơn hàng</div>
                    <Form.Item
                      // label="Username"
                      name="orderCode"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Input disabled placeholder="Nhập mã đơn hàng" />
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>Ngày hẹn giao</div>
                    <Form.Item
                      // label="Username"
                      name="date"
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <DatePicker style={{ width: '100%' }} onChange={onChangeDate} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
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
                    <div style={{ marginBottom: '0.5rem' }}>Tên nhân viên</div>
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
              </Row>
            </div>
          </Col>
        </Row>


        <div style={{ display: 'flex', backgroundColor: 'white', marginTop: '1rem', padding: '1rem 1rem 1rem 1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Danh sách sản phẩm</div>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
            <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
        <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', height: '16rem', marginTop: '1rem', backgroundColor: 'white', padding: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Xác nhận thanh toán</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }} name="paymentConfirm" >
                  <Radio.Group>
                    <Radio style={{ marginTop: '1rem' }} value="paymentFirst">Khách hàng thanh toán trước</Radio>
                    <Radio style={{ marginTop: '1rem' }} value="paymentSuccess">Thu COD sau khi giao hàng thành công</Radio><br />
                    <Radio style={{ marginTop: '1rem' }} value="paymentLast">Thanh toán sau</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', backgroundColor: 'white', padding: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Hình thức thanh toán dự kiến</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                <Form.Item name="paymentMethod" >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio style={{ marginTop: '1rem' }} value="card">Quẹt thẻ</Radio>
                      <Radio style={{ marginTop: '1rem' }} value="paymentPoint">Thanh toán bằng điểm</Radio>
                      <Radio style={{ marginTop: '1rem' }} value="paymentOnline">Chuyển khoảng</Radio>

                      <Radio style={{ marginTop: '1rem' }} value="paymentMoney">Tiền mặt</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
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
                    Tạo đơn
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
