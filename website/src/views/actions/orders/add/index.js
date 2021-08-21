import styles from "./../add/add.module.scss";
import {

  Link,

} from "react-router-dom";
import React from "react";
import {
  Select,
  DatePicker,
  Row,
  Col,
  Form,
  Input,
  Button,
} from "antd";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function OrdersAdd() {
  const [form] = Form.useForm();

  const dateFormat = "YYYY/MM/DD";

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = (fieldsValue) => {
    // Should format date value before submit.
    const values = {
      ...fieldsValue,
      "date-picker": fieldsValue["date-picker"].format("YYYY-MM-DD"),
    };
    console.log("Received values of form: ", values);
    form.resetFields();
  };
  return (
    <>
      <div className={styles["add_orders"]}>
        <Link className={styles["add_orders_title"]} to="/orders/4">

          <div>
            <ArrowLeftOutlined />
          </div>
          <div>Tạo đơn hàng</div>

        </Link>
        <Form
          form={form}
          className={styles["add_orders_bottom"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row className={styles["add_orders_bottom_row"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Mã đơn hàng</div>
              </div>
            </Col>
            <Col xs={24} sm={20} md={20} lg={20} xl={20}>
              <div className={styles["add_orders_bottom_row_col_title"]}>
                <Row
                  className={
                    styles["add_orders_bottom_row_col_title_top_divide"]
                  }
                >
                  <Col
                    className={styles["add_orders_bottom_row_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Form.Item
                      // label="OrdersCode"
                      name="ordersCode"
                      rules={[
                        {
                          required: true,
                          message: "Giá trị rỗng!",
                        },
                      ]}
                    >
                      <Input
                        className={
                          styles["add_orders_bottom_row_col_title_date"]
                        }
                        placeholder="Nhập mã đơn hàng"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className={styles["add_orders_bottom_row_col"]}
                    xs={24}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    <Form.Item
                      // label="OrdersCode"
                      name="ordersQuantity"
                      rules={[
                        {
                          required: true,
                          message: "Giá trị rỗng!",
                        },
                      ]}
                    >
                      <Input
                        className={
                          styles["add_orders_bottom_row_col_title_date"]
                        }
                        placeholder="Nhập số lượng"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className={styles["add_orders_bottom_row_col"]}
                    xs={24}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    <Form.Item
                      // label="OrdersCode"
                      name="ordersMoney"
                      rules={[
                        {
                          required: true,
                          message: "Giá trị rỗng!",
                        },
                      ]}
                    >
                      <Input
                        className={
                          styles["add_orders_bottom_row_col_title_date"]
                        }
                        placeholder="Thành tiền"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className={styles["add_orders_bottom_row"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Ngày tạo đơn hàng</div>
              </div>
            </Col>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <Form.Item
                className={styles["add_orders_bottom_row_col_title"]}
                name="date-picker"
                // label="DatePicker"
                rules={[
                  {
                    required: true,
                    message: "Giá trị rỗng!",
                  },
                ]}
              >
                <DatePicker
                  className={styles["add_orders_bottom_row_col_title_date"]}
                  initialValues={moment("2021/01/01", dateFormat)}
                // format={dateFormat}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles["add_orders_bottom_row"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Tên khách hàng</div>
              </div>
            </Col>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <Form.Item
                // label="OrdersCode"
                name="customerName"
                className={styles["add_orders_bottom_row_col_title"]}
                rules={[
                  {
                    required: true,
                    message: "Giá trị rỗng!",
                  },
                ]}
              >
                <Input
                  className={styles["add_orders_bottom_row_col_title_date"]}
                  placeholder="Nhập tên khách hàng"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles["add_orders_bottom_row_note"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Địa chỉ</div>
              </div>
            </Col>
            <Col xs={24} sm={20} md={20} lg={20} xl={20}>
              <div className={styles["add_orders_bottom_row_col_title"]}>
                <Row className={styles["add_orders_bottom_row_col_title_top"]}>
                  <Col
                    className={styles["add_orders_bottom_row_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item
                      name="province"
                      // label="Gender"
                      rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Select
                        className={
                          styles["add_orders_bottom_row_col_title_date"]
                        }
                        placeholder="Chọn tỉnh thành"
                        allowClear
                      >
                        <Select.Option value="provinceA">Tỉnh A</Select.Option>
                        <Select.Option value="provinceB">Tỉnh B</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col
                    className={styles["add_orders_bottom_row_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <Form.Item
                      name="district"
                      // label="Gender"
                      rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Select
                        className={
                          styles["add_orders_bottom_row_col_title_date"]
                        }
                        placeholder="Chọn quận huyện"
                        allowClear
                      >
                        <Select.Option value="districtA">Quận 1</Select.Option>
                        <Select.Option value="districtB">Quận 2</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className={styles["add_orders_bottom_row"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Tổng tiền</div>
              </div>
            </Col>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <Form.Item
                // label="OrdersCode"
                name="ordersTotalMoney"
                className={styles["add_orders_bottom_row_col_title"]}
                rules={[
                  {
                    required: true,
                    message: "Giá trị rỗng!",
                  },
                ]}
              >
                <Input
                  className={styles["add_orders_bottom_row_col_title_date"]}
                  placeholder="Nhập tổng tiền"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles["add_orders_bottom_row"]}>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div
                className={styles["add_orders_bottom_row_col_title_date_top"]}
              >
                <div>Nhà vận chuyển</div>
              </div>
            </Col>
            <Col
              className={styles["add_orders_bottom_row_col"]}
              xs={24}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <Form.Item
                className={styles["add_orders_bottom_row_col_title"]}
                name="transporter"
                // label="Gender"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Select
                  className={styles["add_orders_bottom_row_col_title_date"]}
                  placeholder="Chọn nhà vận chuyển"
                  allowClear
                >
                  <Select.Option value="ghtk">
                    Giao hàng tiết kiệm
                  </Select.Option>
                  <Select.Option value="ghn">Giao hàng nhanh</Select.Option>
                  <Select.Option value="vp">Viettel Post</Select.Option>
                  <Select.Option value="dhl">ĐHL</Select.Option>
                  <Select.Option value="bm">Boxme</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className={styles["add_orders_button"]}>
            <div className={styles["add_orders_button_left"]}>
              <Button type="primary" danger>
                Hủy
              </Button>
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
