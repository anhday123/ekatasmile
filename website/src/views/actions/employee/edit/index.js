import UI from "../../../../components/Layout/UI";
import styles from "./../edit/edit.module.scss";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import {
  Select,
  DatePicker,
  Space,
  Upload,
  message,
  Row,
  Col,
  Input,
  Checkbox,
  Popover,
  Button,
  Table,
} from "antd";

import moment from "moment";
import {
  AudioOutlined,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  UserDeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const { Option } = Select;
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
export default function EmployeeEdit() {
  const { TextArea } = Input;
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { RangePicker } = DatePicker;
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      // this.setState({ loading: true });
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setLoading({ imageUrl: imageUrl, loading: false })
      );
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const dateFormat = "YYYY/MM/DD";
  const monthFormat = "YYYY/MM";

  const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];

  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
  const props = {
    action: "//jsonplaceholder.typicode.com/posts/",
    listType: "picture",
    previewFile(file) {
      console.log("Your upload file:", file);
      // Your process logic. Here we just mock to the same file
      return fetch("https://next.json-generator.com/api/json/get/4ytyBoLK8", {
        method: "POST",
        body: file,
      })
        .then((res) => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };
  const onChange = ({ target: { value } }) => {
    setValue(value);
  };
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
