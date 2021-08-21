import UI from "../../components/Layout/UI";
import styles from "./../accumulate-point/accumulate-point.module.scss";
import React, { useState } from "react";
import { Input, Row, Col, Drawer, Form, Radio, Button, Space, Checkbox, notification } from "antd";
import {
  Link,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import setting from './../../assets/img/setting.png'
import accumulateManager from './../../assets/img/accumulateManager.png'
import updatePoint from './../../assets/img/updatePoint.png'

export default function AccumulatePoint() {
  const [visible, setVisible] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  };
  const onClose = () => {
    setVisible(false)
  };
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
    setVisible(false)
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', paddingBottom: '1rem', borderBottom: '1px solid grey', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link className={styles["supplier_add_back_parent"]} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">
            <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Tích điểm</div>
          </Link>
        </div>

        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col onClick={showDrawer} className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', border: '1px solid #327B8F', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={setting} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#327B8F', fontSize: '1.25rem', fontWeight: '600' }}>Cấu hình tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Thiết lập cấu hình tích điểm</div>
              </div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to="/actions/card-accumulate-point/view/19" style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', border: '1px solid #DB7998', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={accumulateManager} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#DB7998', fontSize: '1.25rem', fontWeight: '600' }}>Quản lý hạng thẻ tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Theo dõi các thứ hạng trong tích điểm</div>
              </div>
            </Link>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Link to="/actions/accumulate-point-edit/view/19" style={{ display: 'flex', backgroundColor: 'white', padding: '1.5rem 1rem', border: '1px solid #62C1DB', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <div style={{ marginRight: '1rem' }}><img style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain' }} src={updatePoint} alt="" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: '#62C1DB', fontSize: '1.25rem', fontWeight: '600' }}>Điều chỉnh tích điểm</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', }}>Thiết lập các điều chỉnh tích điểm</div>
              </div>
            </Link>
          </Col>
        </Row>

      </div>
      <Drawer
        title="Cấu hình tích điểm"
        width={1100}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >

        <Form
          className={styles["promotion_manager"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >


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
            <Form.Item style={{ marginTop: '1rem' }}>
              <Button style={{ width: '7.5rem', marginLeft: '1rem' }} type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </UI>
  );
}
