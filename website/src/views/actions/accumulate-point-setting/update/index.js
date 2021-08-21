import styles from "./../update/update.module.scss";
import { Select, Button, Input, Form, Row, Col, DatePicker } from "antd";
import {
  Link,

} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
export default function CustomerUpdate() {

  return (
    <>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/customer/17">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật thông tin khách hàng</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã khách hàng</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="customerCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="GH6789" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày sinh</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="birthDay"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <DatePicker style={{ width: '100%' }} defaultValue={moment('2021/06/28', dateFormat)} format={dateFormat} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên khách hàng</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="customerName"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="Mai Ka" />
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
                  <Input defaultValue="0384943497" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Loại khách hàng</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="customerType"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="Tiềm năng" />
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
                  <Input defaultValue="27/27, đường Ngô Y Linh" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="name"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="Tỷ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>
                <Form.Item
                  name="city"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue="hcm">
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
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Họ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="surname"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input defaultValue="Nguyễn" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Quận/huyện</div>
                <Form.Item
                  name="district"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue="q1">
                    <Option value="q1">Quận 1</Option>
                    <Option value="q2">Quận 2</Option>
                  </Select>
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
          </Row>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col>
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
