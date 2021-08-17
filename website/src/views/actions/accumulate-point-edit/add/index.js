import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import React, { useState } from "react";
import { Select, Button, Input, Form, Row, Col, DatePicker, Table, Modal, Popover } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ArrowLeftOutlined, AudioOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Search } = Input;
export default function AccumulatePointEditAdd() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'customerCode',
      width: 150,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: 'Điểm hiện tại',
      dataIndex: 'nowPoint',
      width: 150,
    },
    {
      title: 'Chênh lệch',
      dataIndex: 'difference',
      width: 150,
    },
    {
      title: 'Sau điều chỉnh',
      dataIndex: 'updateAfter',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 150,
    },
  ];
  const columnsAddProduct = [
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
      title: 'Tồn kho',
      dataIndex: 'inventory',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 150,
    },
  ];
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/shipping-product/view">{`DHN ${i}`}</Link>,
      customerName: `Nguyễn Văn Tỷ ${i}`,
      nowPoint: `${i} điểm`,
      difference: `${i}`,
      updateAfter: `này là input, có data xử lý sau`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const dataAddProuct = [];
  for (let i = 0; i < 46; i++) {
    dataAddProuct.push({
      key: i,
      stt: i,
      productCode: `DHN ${i}`,
      productName: `Sản phẩm ${i}`,
      inventory: i,
      quantity: `Số lượng ${i}`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/shipping/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const onSearch = value => console.log(value);
  const onSearchAddProduct = value => console.log(value);
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/actions/accumulate-point-edit/view">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Tạo phiếu điều chỉnh tích điểm</div>

        </Link>

        <Form
          style={{}}
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <div style={{ display: 'flex', marginBottom: '0.75rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin phiếu</div>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã phiếu</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="ticketCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã phiếu" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ghi chú</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="note"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập ghi chú" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ borderBottom: '1px solid rgb(236, 226, 226)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Nhân viên tạo</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="createdEmployee"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên nhân viên tạo" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tag</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="tag"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tag" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin khách hàng</div>
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div style={{ display: 'flex', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo mã, theo tên" onSearch={onSearch} enterButton />
            </div>
          </Popover>
          {/* <div onClick={() => modal2VisibleModal(true)} style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem', display: 'flex', justifyContent: 'center' }}>Thêm sản phẩm</Button></div> */}
          <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
            <Table columns={columns} dataSource={data} scroll={{ y: 500 }} />

          </div>
          <Row style={{ marginTop: '1rem' }} className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col>
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>

        <Modal
          title="Thêm sản phẩm"
          centered
          footer={null}
          width={1000}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ display: 'flex', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo mã, theo tên" onSearch={onSearchAddProduct} enterButton />
              </div>
            </Popover>
            <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
              <Table columns={columnsAddProduct} dataSource={dataAddProuct} scroll={{ y: 500 }} />

            </div>
          </div>
          <Row style={{ marginTop: '1rem' }} className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

              <Button style={{ width: '7.5rem' }} type="primary" danger>
                Hủy
              </Button>

            </Col>
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

              <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                Xác nhận
              </Button>

            </Col>
          </Row>
        </Modal>
      </div>
    </UI>
  );
}
