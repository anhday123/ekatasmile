import UI from "../../../../components/Layout/UI";
import styles from "./../edit/edit.module.scss";
import React from "react";
import {
  Link,

} from "react-router-dom";
import {
  Select,
  DatePicker,
  Row,
  Col,
  Input,

} from "antd";

import moment from "moment";
import {

  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function EmployeeEdit() {
  const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];

  return (
    <UI>
      <div className={styles["employee_add_parent"]}>
        <Link style={{ display: 'flex', borderBottom: '1px solid rgb(228, 217, 217)', paddingBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} className={styles["supplier_information_title"]} to="/employee/19">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', marginRight: '0.5rem', fontSize: '1rem' }} />
          <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} className={styles["supplier_information_title_right"]}>
            Cập nhật thông tin nhân viên
          </div>

        </Link>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Tài khoản</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="nguyenvanty" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Họ</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="nguyễn" />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Mật khẩu</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="123456" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Email</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="anhhung_so11@yahoo.com" />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Xác nhận mật khẩu</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="123456" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Ngày sinh</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <DatePicker
                  className={styles["date"]}
                  defaultValue={moment("1998/01/20", dateFormatList[0])}
                  format={dateFormatList}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Mã nhân viên</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="A2687" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Liên hệ</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="0384943497" />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Chi nhánh làm việc</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="CN1" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Địa chỉ</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="27/27, ngô y linh" />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Chức vụ</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input defaultValue="Nhân viên" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Tỉnh/thành phố</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Select style={{ width: '100%' }} defaultValue="hcm">
                  <Option value="hcm">Hồ Chí Minh</Option>
                  <Option value="hn">Hà Nội</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles["employee_add_parent_row"]}>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Tên</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Input placeholder="tỷ" />
              </Col>
            </Row>
          </Col>
          <Col
            className={styles["employee_add_parent_col"]}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Row className={styles["employee_add_parent_col_row_child"]}>
              <Col
                className={styles["employee_add_parent_col_row_child_name"]}
                xs={24}
                sm={8}
                md={8}
                lg={8}
                xl={8}
              >
                <div>Quận/huyện</div>
              </Col>
              <Col
                className={styles["employee_add_parent_col_row_child_input"]}
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
              >
                <Select style={{ width: '100%' }} defaultValue="binhTan">
                  <Option value="binhTan">Bình tân</Option>
                  <Option value="goVap">Gò vấp</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    </UI>
  );
}
