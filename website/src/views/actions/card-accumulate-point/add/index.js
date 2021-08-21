import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import { Button, Input, Form, Row, Col, Checkbox, notification } from "antd";
import {
  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function CardAccumulatePointAdd() {
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Success',
      description:
        'Tạo hạng thẻ tích điểm thành công.',
    });
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    openNotification()
    history.push("/actions/card-accumulate-point/view");
  };

  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/actions/card-accumulate-point/view">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Tạo hạng thẻ tích điểm</div>

        </Link>

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên hạng thẻ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="cardName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên hạng thẻ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tổng giá trị mua hàng</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="orderTotal"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tổng giá trị mua hàng" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Thời gian áp dụng ưu đãi</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="timeApply"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập thời gian áp dụng ưu đãi" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Giá trị tối thiểu đơn</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="valueMini"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập giá trị tối thiểu đơn" />
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Chiết khấu</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="discount"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập chiết khấu" />
                </Form.Item>
              </div>
            </Col>

          </Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} name="cardApplyRank" valuePropName="checked" >
            <Checkbox>Áp dụng hạng thẻ cho cửa hàng</Checkbox>
          </Form.Item>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
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
