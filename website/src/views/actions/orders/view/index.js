import UI from "../../../../components/Layout/UI";
import styles from "./../view/view.module.scss";
import {

  Row,
  Col,

  Button,
} from "antd";
import {
  FileImageOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
export default function OrdersView() {
  return (
    <UI>
      <div className={styles["view_orders"]}>
        <div className={styles["view_orders_title"]}>
          <div>
            <ArrowLeftOutlined />
          </div>
          <div>Xem đơn hàng</div>
        </div>
        <div className={styles["view_orders_row"]}>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Mã đơn hàng</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>#12345</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Mã đơn hàng</div>
              </div>
            </Col>
            <Col
              //   className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Row className={styles["view_orders_row_child_col_parent"]}>
                  <Col
                    className={styles["view_orders_row_child_col"]}
                    xs={21}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["view_orders_row_child_col_left"]}>
                      <div>Gấu bông Teddy cute</div>
                      <div>
                        <FileImageOutlined />
                      </div>
                    </div>
                  </Col>
                  <Col
                    className={styles["view_orders_row_child_col"]}
                    xs={21}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    {" "}
                    <div className={styles["view_orders_row_child_col_left"]}>
                      <div>Số lượng</div>
                      <div>10</div>
                    </div>
                  </Col>
                  <Col
                    className={styles["view_orders_row_child_col"]}
                    xs={21}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    {" "}
                    <div className={styles["view_orders_row_child_col_left"]}>
                      <div>Thành tiền</div>
                      <div>50.000</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Ngày đặt</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>2020/04/23</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Khách hàng</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>Nguyễn Văn A</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Địa chỉ</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>
                abc, phường 10, Gò Vấp, HCM
              </div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>COD</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>20.000</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Tổng tiền</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>70.000</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Nhà vận chuyển</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>Giao hàng nhanh</div>
            </Col>
          </Row>
          <Row className={styles["view_orders_row_child"]}>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["view_orders_row_child_col_orders_code"]}>
                <div>Mã giao hàng</div>
              </div>
            </Col>
            <Col
              className={styles["view_orders_row_child_col"]}
              xs={22}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div className={styles["content"]}>abcc123</div>
            </Col>
          </Row>
          <div className={styles["view_orders_row_child_button"]}>
            {/* <Link href="/actions/orders/edit/show"> */}
            <Button type="primary" danger>
              Sửa
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </UI>
  );
}
