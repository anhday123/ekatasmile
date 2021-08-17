import UI from "../../../../components/Layout/UI";
import styles from "./../view/view.module.scss";
import React, { useState } from "react";
import { Input, Space, Button, Row, Col, notification, DatePicker, Select, Table, Modal, Typography, Form, Checkbox, Radio } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined, ArrowLeftOutlined } from "@ant-design/icons";

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
export default function AccumulatePointSetting() {
  let history = useHistory();
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/customer/view" style={{ color: '#2400FF' }}>GH {i}</Link>,
      customerName: `Văn Tỷ ${i}`,
      customerType: `Tiềm năng ${i}`,
      branch: `Chi nhánh ${i}`,
      birthDay: `2021/06/28 ${i}`,
      email: `anhhung_so11@yahoo.com`,
      phoneNumber: '0384943497',
      address: '27/27, đường Ngô Y Linh',
      district: 'Bình Tân',
      city: 'Hồ Chí Minh',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/customer/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <div style={{ color: '#0036F3', cursor: 'pointer' }}>{i}</div>,
      productName: `tên sản phẩm ${i}`,
      productQuantity: i,
      goodsCode: `BS5426${i}`,
      code: `8546${i}`,
      supplier: `Hưng Thịnh`,
      importDate: "2021/07/02",
    });
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cấu hình tích điểm thành công.',
    });
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    openNotification()
    history.push("/accumulate-point/19");
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <UI>

      <Form
        className={styles["promotion_manager"]}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        <Link to="/accumulate-point/19" style={{ display: 'flex', borderBottom: '1px solid grey', cursor: 'pointer', paddingBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <div style={{ marginRight: '0.5rem' }}><ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} /></div>
          <div className={styles["promotion_manager_title"]}>Cấu hình tích điểm</div>
          {/* <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/show">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </div> */}
        </Link>


        <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <div className={styles['accumulate_point_setting_left']}>
              <Form.Item style={{ borderBottom: '1px solid rgb(219, 205, 205)', paddingBottom: '1.25rem' }} name="accumulatePointApply" valuePropName="checked" >
                <Checkbox>Áp dụng tính năng tích điểm cho cửa hàng</Checkbox>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Cơ chế tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }} name="discountProductFunc" valuePropName="checked" >
                    <Checkbox>Tính năng cho các sản phẩm giảm giá</Checkbox>
                  </Form.Item>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }} name="customerReturnProduct" valuePropName="checked" >
                    <Checkbox>Trừ điểm khi khách hàng trả hàng</Checkbox>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Hình thức tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="permanent">Tích điểm cố định</Radio>
                        <Radio value="incremental">Tích điểm lũy tiến - cộng dồn</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Tỷ lệ quy đổi điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                  <Form.Item
                    label="Đơn vị tích điểm"
                    name="rate"
                    rules={[{ required: true, message: 'Please input point unit!' }]}
                  >
                    <Input placeholder="Điểm" />
                  </Form.Item>

                </div>
              </div>
            </div>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <div className={styles['accumulate_point_setting_right']}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Thanh toán</div>
              <div>Tỷ lệ quy ra điểm</div>
              <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Col xs={24} sm={4} md={4} lg={4} xl={4} style={{ marginRight: '1rem', paddingBottom: '1.5rem' }}>1 điểm = </Col>
                <Col style={{ width: '100%' }} xs={24} sm={19} md={19} lg={19} xl={19}>
                  <Form.Item
                    style={{ width: '100%' }}
                    // label="Username"
                    name="point"
                    rules={[{ required: true, message: 'Please input point!' }]}
                  >
                    <Input style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

              </Row>
              <Form.Item name="paymentAllow" valuePropName="checked">
                <Checkbox>Cho phép thanh toán bằng điểm sau:</Checkbox>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Form.Item
                  // label="Username"
                  name="paymentPoint"
                  rules={[{ required: true, message: 'Please input number purchase!' }]}
                >
                  <Input />
                </Form.Item>
                <div style={{ paddingBottom: '1.5rem', marginLeft: '1rem' }}>0 lần mua</div>
              </div>
              <Form.Item name="paymentByPoint" valuePropName="checked">
                <Checkbox>Tích điểm khi khách hàng thanh toán hóa đơn bằng điểm</Checkbox>
              </Form.Item>
              <Form.Item name="accumulatePointPayment" valuePropName="checked">
                <Checkbox>Tích điểm cho giá trị thanh toán bao gồm phí vận chuyển</Checkbox>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Khách hàng áp dụng tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="customerAll">Tất cả khách hàng</Radio>
                        <Radio value="customerGroup">Theo nhóm khách hàng</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Danh sách sản phẩm áp dụng tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="productAll">Tất cả sản phẩm</Radio>
                        <Radio value="productType">Theo loại sản phẩm</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Chi nhánh áp dụng tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="branchAll">Tất cả chi nhánh</Radio>
                        <Radio value="branch">Theo từng chi nhánh</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Nguồn đơn áp dụng tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="branchAllOrder">Tất cả chi nhánh</Radio>
                        <Radio value="branchOrder">Theo từng chi nhánh</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Danh sách sản phẩm áp dụng đổi quà</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }} name="accumulatePointForm">
                    <Radio.Group >
                      <Space direction="vertical">
                        <Radio value="productAllList">Tất cả các sản phẩm</Radio>
                        <Radio value="productTypeList">Theo loại sản phẩm</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          {/* <Form.Item style={{ marginTop: '1rem' }}>
            <Button style={{ width: '5rem' }} type="primary" danger>
              Hủy
            </Button>
          </Form.Item> */}
          <Form.Item style={{ marginTop: '1rem' }}>
            <Button style={{ width: '5rem', marginLeft: '1rem' }} type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </div>
      </Form>

    </UI>
  );
}
