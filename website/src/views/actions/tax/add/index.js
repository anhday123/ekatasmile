import styles from "./../add/add.module.scss";
import {  Button, Input, Form, Row, Col, notification } from "antd";
import {

  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function TaxAdd() {
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm thông tin thuế thành công.',
    });
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    openNotification()
    history.push("/tax/19");
  };


  return (
    <>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/tax/19">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Thêm thông tin thuế</div>

        </Link>

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên thuế</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="taxName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên thuế" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="taxCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã thuế." />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Thuế suất</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="tax"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập thuế suất" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Giá trị</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="value"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập giá trị" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div style={{ display: 'flex', maxWidth: '100%', overflow: 'auto', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><b style={{ marginRight: '0.25rem' }}>Chú ý:</b> bạn không thể sửa giá trị thuế khi đã sử dụng thuế đó trong một đơn hàng.</div>

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
    </>
  );
}
