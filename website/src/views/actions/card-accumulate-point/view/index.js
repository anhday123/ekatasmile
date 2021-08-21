import UI from "./../../../../components/Layout/UI";
import styles from "./../view/view.module.scss";
import React, { useState } from "react";
import { Popconfirm, message, Input, Space, Button, Row, Col, DatePicker, Form, Popover, Checkbox, Select, Table, Modal, Drawer, notification } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
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
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  });
}
export default function Promotion() {
  const [visible, setVisible] = useState(false)
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const onSearch = (value) => console.log(value);

  const columnsPromotion = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Tên hạng thẻ',
      dataIndex: 'cardName',
      width: 150,
    },
    {
      title: 'Tổng giá trị mua hàng',
      dataIndex: 'orderTotal',
      width: 175,
    },
    {
      title: 'Giá trị tối thiểu',
      dataIndex: 'valueMini',
      width: 150,
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discount',
      width: 150,
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: 150,
    },
    {
      title: 'Áp dụng',
      dataIndex: 'apply',
      width: 100,
    },

  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      cardName: <div >GH {i}</div>,
      orderTotal: `100.00${i} VNĐ`,
      valueMini: `200.00${i} VNĐ`,
      discount: `${i}%`,
      time: `${i} hours`,
      apply: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {i === 2 ? (<CheckOutlined style={{ fontSize: '1.5rem', color: '#0018EF' }} />) : ('')}
      </div>,
    });
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const openNotification = () => {
    notification.success({
      message: 'Success',
      description:
        'Tạo hạng thẻ tích điểm thành công.',
    });
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    openNotification()
    onClose()
  };

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const contentSearch = (
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
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link to="/accumulate-point/19" style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <div style={{ marginRight: '0.5rem' }}><ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} /></div>
            <div className={styles["promotion_manager_title"]}>Hạng thẻ tích điểm</div>
          </Link>

          <div className={styles["promotion_manager_button"]}>
            <Button onClick={showDrawer} icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm hạng thẻ</Button>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
              /></div>
            </Popover>
          </Col>
        </Row>
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowSelection={rowSelection} columns={columnsPromotion} dataSource={dataPromotion} scroll={{ y: 500 }} />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa hạng thẻ</Button></Popconfirm></div>) : ('')
        }
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <Popover placement="bottomLeft" content={contentSearch} trigger="click">
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <Search placeholder="Tìm kiếm khách hàng" onSearch={onSearchCustomerChoose} enterButton />
            </div>
          </Popover>
          <div style={{ marginTop: '1rem', border: '1px solid rgb(209, 191, 191)', width: '100%', maxWidth: '100%', overflow: 'auto' }}> <Table scroll={{ y: 500 }} rowSelection={rowSelection} columns={columns} dataSource={data} /></div>
        </div>
      </Modal>
      <Drawer
        title="Tạo hạng thẻ tích điểm"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên hạng thẻ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="cardName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên hạng thẻ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tổng giá trị mua hàng</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="orderTotal"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tổng giá trị mua hàng" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Thời gian áp dụng ưu đãi</div>
                <Form.Item
                  name="timeApply"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập thời gian áp dụng ưu đãi" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Giá trị tối thiểu đơn</div>
                <Form.Item
                  name="valueMini"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập giá trị tối thiểu đơn" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Chiết khấu</div>
                <Form.Item
                  name="discount"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập chiết khấu" />
                </Form.Item>
              </div>
            </Col>

          </Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} name="cardApplyRank" valuePropName="checked" >
            <Checkbox>Áp dụng hạng thẻ cho cửa hàng</Checkbox>
          </Form.Item>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Drawer>
    </UI>
  );
}
