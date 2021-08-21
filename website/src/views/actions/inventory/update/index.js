import styles from "./../update/update.module.scss";
import React from "react";
import { ACTION } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import { Select, Button, Input, Form, Row, Col, DatePicker, notification, InputNumber } from "antd";
import {

  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from 'moment';
import { apiUpdateInventory } from "../../../../apis/inventory";
const { Option } = Select;

export default function InventoryUpdate(propsData) {
  const dispatch = useDispatch()
  const state = propsData.location.state;
  const [form] = Form.useForm();
  console.log(moment(state.create_date).format('YYYY-MM-DD'))
  console.log(state)
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin kho thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin kho.',
    });
  };
  const apiUpdateInventoryData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await apiUpdateInventory(object, state.warehouse_id);
      console.log(res);
      if (res.status === 200) {
        openNotification()
        history.push("/inventory/7");
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false });

    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const openNotificationErrorFormat = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
    if (isNaN(values.phone) || isNaN(values.monthly_cost)) {
      if (isNaN(values.phone)) {
        openNotificationErrorFormatPhone('Liên hệ')
      }
      if (isNaN(values.monthly_cost)) {
        openNotificationErrorFormat('Phí duy trì tháng')
      }
    } else {
      if (regex.test(values.phone)) {
        const object = {
          // code: values.code.toLowerCase(),
          name: values.name.toLowerCase(),
          type: values.type.toLowerCase(),
          phone: values.phone,
          capacity: state.capacity,
          monthly_cost: values.monthly_cost,
          address: values.address.toLowerCase(),
          ward: state.ward.toLowerCase(),
          district: values.district.toLowerCase(),
          province: values.province.toLowerCase()
        }
        console.log(object);
        apiUpdateInventoryData(object)
      } else {
        openNotificationErrorFormatPhone('Liên hệ')
      }
    }
  };

  const dateFormat = 'YYYY/MM/DD';

  return (
    <>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/inventory/7">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật thông tin kho</div>

        </Link>

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          form={form}
          layout="vertical"
          initialValues={state}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Mã kho</div>}

                  name="code"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input disabled />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  name="phone"
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

                  name="name"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên kho</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="address"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}
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
                  name="type"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Loại kho</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue={state.type}>
                    <Option value="inventoryType1">Loại kho 1</Option>
                    <Option value="inventoryType2">Loại kho 2</Option>
                  </Select>
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
                  <Select defaultValue={state.province}>
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
                  name="district"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue={state.district}>
                    <Option value="binhTan">Bình tân</Option>
                    <Option value="goVap">Gò vấp</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Phí duy trì tháng</div>}
                  name="monthly_cost"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    defaultValue={100000000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />

                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày tạo</div>
                
                <DatePicker style={{ width: '100%' }} value={moment(state.create_date, dateFormat)} format={dateFormat} />

              </div>
            </Col>
          </Row>

          <Row className={styles["supplier_add_content_supplier_button"]}>
          
            <Col style={{ marginTop: '1rem', width: '100%', display: 'flex', marginLeft: '1rem', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    </>
  );
}
