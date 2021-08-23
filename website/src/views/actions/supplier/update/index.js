import styles from "./../add/add.module.scss";
import React from "react";
import { ACTION } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import { Select, Button, Input, Form, Row, Col, notification } from "antd";
import { apiUpdateSupplier } from "../../../../apis/supplier";
import {

  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Option } = Select;
export default function SupplierUpdate(propsData) {
  const dispatch = useDispatch()
  const state = propsData.location.state;
  const [form] = Form.useForm();
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật nhà cung cấp thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin nhà cung cấp',
    });
  };
  const apiUpdateSupplierData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateSupplier(object, id);
      console.log(res);
      if (res.status === 200) {
        openNotification()
        history.push("/supplier/10")
      } else {
        openNotificationError()
      }
      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
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
        'Gmail phải ở dạng @gmail.com',
    });
  };
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
    if (validateEmail(values.email)) {
      if (isNaN(values.phone)) {
        openNotificationRegisterFailMailRegex('Liên hệ')
      } else {
        if (regex.test(values.phone)) {
          const object = {
            name: values.name.toLowerCase(),
            // code: values.code.toLowerCase(),
            email: values.email,
            phone: values.phone,
            address: values && values.address ? values.address.toLowerCase() : '',
            ward: ' ',
            district: values.district.toLowerCase(),
            province: values.province.toLowerCase(),
          }
          console.log(object)
          apiUpdateSupplierData(object, state.supplier_id);
        } else {
          openNotificationRegisterFailMailRegex('Liên hệ')
        }
      }
    } else {
      openNotificationRegisterFailMail()
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/supplier/10">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật thông tin chi tiết nhà cung cấp</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          form={form}
          layout="vertical"
          initialValues={state}
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên nhà cung cấp</div>}
                  name="name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="An Phát" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}
                  name="address"

                >
                  <Input placeholder="27/27, đường Ngô Y Linh" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  name="phone"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="0384943497" />
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
                  <Select placeholder="hcm">
                    <Option value="hcm">Hồ Chí Minh</Option>
                    <Option value="hn">Hà Nội</Option>
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

                  name="email"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Email</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="anhhung_so11@yahoo.com" />
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
                  <Select placeholder="q1">
                    <Option value="q1">Quận 1</Option>
                    <Option value="q2">Quận 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>



          <Row className={styles["supplier_add_content_supplier_button"]}>
          
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
    </>
  );
}
