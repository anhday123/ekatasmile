import UI from "../../../../components/Layout/UI";
import styles from "./../detail/detail.module.scss";
import React, { useState } from "react";
import { Select, Button, message, Popconfirm, notification, Input, Form, Row, Popover, Col, DatePicker, Table, Modal } from "antd";
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
export default function AccumulatePointEditDetail() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 100,
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
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 150,
    // },
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
      productCode: <div>{`DHN ${i}`}</div>,
      productName: `Sản phẩm ${i}`,
      inventory: i,
      quantity: `Số lượng ${i}`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        {/* <Link style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link> */}
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
      </div>
    });
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );

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

  const onSearch = value => console.log(value);
  const onSearchAddProduct = value => console.log(value);
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Điều chỉnh phiếu điểm thành công.',
    });
  };
  const onClickConfirm = () => {
    openNotification()
  }
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
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/actions/accumulate-point-edit/view/19">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Phiếu điều chỉnh tích điểm DNB001</div>

        </Link>

        <Form
          style={{}}
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row style={{ width: '100%', }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={12} xl={12}>
              <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>

                  <div style={{ display: 'flex', marginBottom: '0.75rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin phiếu</div>

                </Col>
                <Col style={{ width: '100%', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start' }} xs={24} sm={24} md={24} lg={11} xl={11}>
                  <div style={{ width: '10rem ', display: 'flex', justifyContent: 'center', backgroundColor: '#FFAC2F', color: 'black', padding: '0.25rem 1rem', borderRadius: '2rem' }}>Đang điều chỉnh</div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', }}><a style={{ color: 'black', fontWeight: '600', }}>Ngày tạo:</a> 2021/07/01</div>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', }}><a style={{ color: 'black', fontWeight: '600' }}>Ghi chú:</a> chưa có</div>
              </div>
            </Col>
          </Row>
          <Row style={{ borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', }}><a style={{ color: 'black', fontWeight: '600' }}>Nhân viên tạo:</a> văn tỷ</div>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', }}><a style={{ color: 'black', fontWeight: '600' }}>Tag:</a> chưa có</div>
              </div>
            </Col>
          </Row>


          <div style={{ display: 'flex', marginTop: '1rem', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin khách hàng</div>


          <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ y: 500 }} />

          </div>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa phiếu</Button></Popconfirm></div>) : ('')
          }
          <div style={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', fontWeight: '600', marginTop: '1rem' }}>Tổng số lượng khách hàng: 2</div>
          <Row onClick={onClickConfirm} style={{ marginTop: '1rem' }} className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item>
                <Button style={{ width: '10rem', display: 'flex', justifyContent: 'center' }} type="primary" htmlType="submit">
                  Điều chỉnh điểm
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
      </div >
    </UI >
  );
}
