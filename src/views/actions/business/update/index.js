import UI from "../../../../components/Layout/UI";
import { useDispatch } from 'react-redux'
import { ACTION } from './../../../../consts/index'
import styles from "./../update/update.module.scss";
import { Select, Button, Input, Form, Row, Col, DatePicker, notification } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { apiAddInventory } from "../../../../apis/inventory";
const { Option } = Select;
export default function BusinessUpdate() {
  const dispatch = useDispatch()
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Chỉnh sửa thông tin business thành công',
    });
  };
  const openNotificationError = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationErrorCode = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Mã kho đã tồn tại',
    });
  };
  let history = useHistory();
  const apiAddInventoryData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAddInventory(object);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        openNotification()
        history.push("/inventory/7");
      } else {
        openNotificationErrorCode()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    openNotification()
    history.push('/business/5')
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/business/5">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Chỉnh sửa thông tin doanh nghiệp 1</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã business</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="businessCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã business" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Liên hệ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="phoneNumber"
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
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên business</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="businessName"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên business" />
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
                  <Select placeholder="Chọn tỉnh/thành phố">
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
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Quận/huyện</div>
                <Form.Item
                  name="district"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select placeholder="Chọn quận/huyện">
                    <Option value="binhTan">Bình tân</Option>
                    <Option value="goVap">Gò vấp</Option>
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
            <Col style={{ width: '100%', display: 'flex', marginLeft: '1rem', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
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
