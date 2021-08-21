import styles from "./../add/add.module.scss";
import moment from "moment";
import {

  Link,
  useParams
} from "react-router-dom";
import React, { useState } from "react";
import {
  Select,
  DatePicker,
  Row,
  Form,
  Col,
  Input,

  Button,
} from "antd";
import {

  ArrowLeftOutlined,
} from "@ant-design/icons";
const { Option } = Select;
export default function RevenExpenAdd() {
  let {slug} = useParams();

  const dateFormat = "YYYY/MM/DD";

  var  show  = slug;
  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
      "date-picker": fieldsValue["date-picker"].format("YYYY-MM-DD"),
    };
  };


  return (
    <>
      <div className={styles["reven_add"]}>
        <Link  className={styles["reven_add_title"]} to="/reven-expen/12">
   
            <div>
              <ArrowLeftOutlined />
            </div>
            {show === "information" ? (
              <div>Thông tin phiếu thu chi</div>
            ) : (
              <div>Thêm phiếu thu chi</div>
            )}
        </Link>
        <Form
          onFinish={onFinish}
          className={styles["reven_add_bottom"]}
        >
          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Người lập phiếu</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    Nguyễn Văn Tỷ
                  </div>
                ) : (
                  <Form.Item
                    // label="Ngươi"
                    name="voter"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị rỗng",
                      },
                    ]}
                  >
                    <Input
                      className={styles["reven_add_bottom_row_col_input_child"]}
                      placeholder="Nhập tên người lập phiếu"
                    />
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>
          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Ngày lập phiếu</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    2021/04/29
                  </div>
                ) : (
                  <Form.Item name="date-picker">
                    <DatePicker
                      initialValues={moment("2021/01/01", dateFormat)}
                      className={styles["reven_add_bottom_row_col_input_child"]}
                    />
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>

          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Số tiền</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    10.000.000 VNĐ
                  </div>
                ) : (
                  <Form.Item
                    // label="Ngươi"
                    name="money"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị rỗng",
                      },
                    ]}
                  >
                    <Input
                      className={styles["reven_add_bottom_row_col_input_child"]}
                      placeholder="Nhập số tiền"
                    />
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>
          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Loại phiếu</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    Nơi này chứa thông tin user chọn
                  </div>
                ) : (
                  <Form.Item
                    name="filter"
                    noStyle
                    rules={[{ required: true, message: "Giá trị rỗng" }]}
                  >
                    <Select
                      className={styles["reven_add_bottom_row_col_input_child_select"]}
                      placeholder="Chọn điều kiện lọc"
                    >
                      <Option value="doanhthu">Doanh thu</Option>
                      <Option value="chiphi">Chi phí</Option>
                    </Select>
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>

          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Diễn giải</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    hôm nay là thứ 7
                  </div>
                ) : (
                  <Form.Item
                    // label="Ngươi"
                    name="explain"
                    rules={[
                      {
                        required: true,
                        message: "Giá trị rỗng",
                      },
                    ]}
                  >
                    <Input
                      className={styles["reven_add_bottom_row_col_input_child"]}
                      placeholder="Nhập diễn giải"
                    />
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>

          <Row className={styles["reven_add_bottom_row"]}>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["reven_add_bottom_row_col_title"]}>
                <div>Ghi chú</div>
              </div>
            </Col>
            <Col
              className={styles["reven_add_bottom_row_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["reven_add_bottom_row_col_input"]}>
                {show === "information" ? (
                  <div
                    className={
                      styles["reven_add_bottom_row_col_input_child_information"]
                    }
                  >
                    trời sắp mưa rồi
                  </div>
                ) : (
                  <Form.Item name="note">
                    <Input.TextArea
                      placeholder="Nhập ghi chú"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      className={styles["reven_add_bottom_row_col_input_child"]}
                    />
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>
          <div className={styles["reven_add_button"]}>
            <Form.Item className={styles["reven_add_button_left"]}>
              <Button type="primary" danger>
                Hủy
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
}
