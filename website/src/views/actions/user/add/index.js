import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import React, { useState } from "react";
import { apiCreateUserMenu } from "./../../../../apis/user";
import { ACTION } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment';
import { Button, Input, Form, Row, Col, DatePicker, Radio, notification } from "antd";
import {
  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function UserAdd() {
  const dispatch = useDispatch()
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm người dùng mới thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tài khoản đã tồn tại.',
    });
  };
  const [birthDay, setBirthDay] = useState('')
  const apiCreateUserMenuData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiCreateUserMenu(object);
      console.log(res);
      if (res.status === 200) {
        openNotification()
        history.push("/user/19");
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false });
     
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Gmail phải ở dạng @gmail.com.',
    });
  };
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số`,
    });
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const onFinish = (values) => {
    if (validateEmail(values.email)) {
      if (isNaN(values.phoneNumber)) {
        openNotificationRegisterFailMailRegex('Liên hệ')
      } else {
        const object = {
          username: values.username.toLowerCase(),
          password: values.password,
          role_id: '',
          phone: values.phoneNumber,
          email: values.email,
          avatar: " ",
          first_name: values.name.toLowerCase(),
          last_name: values.surname.toLowerCase(),
          birthday: moment(birthDay).format('YYYY-MM-DD'),
          address: values.address.toLowerCase(),
          ward: " ",
          district: " ",
          province: " ",
          company_name: " ",
          company_website: " ",
          tax_code: " ",
          fax: " "
        }
        console.log(object)
        apiCreateUserMenuData(object)
      }
    } else {
      openNotificationRegisterFailMail()
    }
  };

  function onChange(date, dateString) {
    console.log(date, dateString);
    setBirthDay(dateString)
  }

  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/user/19">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Thêm người dùng mới</div>

        </Link>

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Họ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="surname"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >

                  <Input placeholder="Nhập họ" />
                </Form.Item>

              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Email</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="email"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Liên hệ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phoneNumber"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập liên hệ" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mật khẩu</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="password"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Địa chỉ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="address"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày sinh</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="birthDay"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <DatePicker style={{ width: '100%' }} onChange={onChange} />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tài khoản</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="username"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tài khoản" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ghi chú</div>
                <Form.Item
                  name="note"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input.TextArea placeholder="Nhập ghi chú" rows={4} />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Role</div>
                <Form.Item name="role" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                  <Radio.Group>
                    <Radio style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Admin">Admin</Radio>
                    <Radio style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Business">Business</Radio>
                    <Radio style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Accountant">Accountant</Radio>
                    <Radio style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Employee">Employee</Radio>
                    <Radio style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Customer">Customer</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    </UI>
  );
}
