import UI from "../../../../components/Layout/UI";
import styles from "./../update/update.module.scss";
import React from "react";
import { updateUser } from "./../../../../apis/user";
import { ACTION } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment';
import { Button, Input, Form, Row, Col, DatePicker, Radio, notification } from "antd";
import {

  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function UserUpdate(propsData) {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const state = propsData.location.state;

  let history = useHistory();

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin người dùng thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Thông tin cần cập nhật chưa có sự thay đổi nào.',
    });
  };
  const updateUserData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await updateUser(object, id);
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
    console.log("Success:", values);
    if (validateEmail(values.email)) {
      if (isNaN(values.phone)) {
        openNotificationRegisterFailMailRegex('Liên hệ')
      } else {
        const object = {
          role_id: " ",
          phone: values.email,
          email: values.email,
          avatar: " ",
          first_name: values.first_name.toLowerCase(),
          last_name: values.last_name.toLowerCase(),
          birthday: " ",
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
        updateUserData(object, state.user_id)
      }

    } else {
      openNotificationRegisterFailMail()
    }
  };
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY/MM/DD';
  const monthFormat = 'YYYY/MM';

  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

  const customFormat = value => `custom format: ${value.format(dateFormat)}`;

  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/user/19">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật người dùng</div>

        </Link>

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          form={form}
          initialValues={state}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="first_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="tỷ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Họ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="last_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >

                  <Input defaultValue="nguyễn" />
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
                  <Input defaultValue="anhhung_so11@yahoo.com" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Liên hệ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phone"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="0384943497" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Địa chỉ</div>
                <Form.Item
                  name="address"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="27/27, ngô y linh" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày sinh</div>
                <DatePicker style={{ width: '100%' }} value={moment(state.create_date, dateFormat)} format={dateFormat} />
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Role</div>
                <Form.Item name="role" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                  <Radio.Group defaultValue="admin">
                    <Radio checked style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value="Admin">Admin</Radio>
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
