import UI from "../../../../components/Layout/UI";
import styles from "./../update/update.module.scss";
import { Select, Button, Input, Form, Row, Col, DatePicker, Space, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ACTION } from './../../../../consts/index'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import moment from 'moment';
import { apiUpdateShipping } from "../../../../apis/shipping";

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customFormat = value => `custom format: ${value.format(dateFormat)}`;
const { Option } = Select;
export default function CustomerUpdate(propsData) {
  const dispatch = useDispatch()
  const state = propsData.location.state;
  const [form] = Form.useForm();
  console.log(state)
  console.log("|||123")
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin đối tác thành công.',
    });
  };
  const apiUpdateShippingData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateShipping(object, id);
      console.log(res);
      if (res.status === 200) {
        openNotification()
        history.push("/shipping/18");
      }

      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Liên hệ phải là số và có độ dài là 10',
    });
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
    if (isNaN(values.phone)) {
      openNotificationRegisterFailMailPhone()
    } else {
      if (regex.test(values.phone)) {
        const object = {
          name: values.name,
          image: state && state.creator && state.creator.avatar ? state.creator.avatar : '',
          phone: values.phone,
          zipcode: state.zipcode,
          address: values.address,
          ward: '',
          district: values.district,
          province: values.province
        }
        console.log(object)
        apiUpdateShippingData(object, state.transprot_id)
      } else {
        openNotificationRegisterFailMailPhone()
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/shipping/18">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật thông tin đối tác</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          layout="vertical"
          form={form}
          initialValues={state}
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên đối tác</div>}
                  name="name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}
                  name="address"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="code"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Mã đối tác</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input disabled />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  name="province"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select >
                    <Option value="hcm">Hồ chí minh</Option>
                    <Option value="hn">Hà nội</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phone"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  name="district"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select >
                    <Option value="q1">Quận 1</Option>
                    <Option value="q2">Quận 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </UI>
  );
}
