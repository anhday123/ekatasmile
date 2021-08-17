import UI from "../../../../components/Layout/UI";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import styles from "./../view/view.module.scss";
import viettelpost from './../../../../assets/img/viettelpost.png'
import { Select, Button, Input, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function ShippingView() {
  const { Search } = Input;
  return (
    <UI>
      <div className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to="/shipping/18">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} />
          <div className={styles["supplier_information_title_right"]}>
            Thông tin chi tiết đối tác GHN
          </div>

        </Link>

        <div className={styles["supplier_information_content_parent"]}>
          <Row className={styles["supplier_information_content_main"]}>
            <Col
              style={{ padding: '1rem 0' }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={12} md={12} lg={6} xl={6}>
                  <div style={{ borderRadius: '0.5rem', border: '2.5px solid #017A6E' }} className={styles["shipping_manager_shipping_col_parent"]}>
                    <img
                      className={styles["shipping_manager_shipping_col_img"]}
                      src={viettelpost}
                      alt=""
                    />
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="An Phát" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>              <div

                >
                  <b>Tên đối tác:</b> GHN
                </div></Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="An Phát" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Địa chỉ:</b> 12 phan huy ích
                  </div>
                </Col>

              </Row>


              {/* <Input
                style={{ width: "100%" }}
                defaultValue="Số 2, đường số 10, Gò Vấp"
              /> */}
            </Col>

          </Row>
          <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Mã đối tác:</b> GNH123456
                  </div>
                </Col>

              </Row>


              {/* <Input disabled="true" style={{ width: "100%" }} defaultValue="MNT200" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Quận/huyện:</b> Gò vấp
                  </div>
                </Col>

              </Row>

              {/* <Input style={{ width: "100%" }} defaultValue="Gò Vấp" /> */}
            </Col>
          </Row>

          <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Liên hệ:</b> 0384943497
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="vanty@gmail.com" /> */}
            </Col>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Tỉnh/thành phố:</b> Hồ chí minh
                  </div>
                </Col>

              </Row>
              {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
            </Col>
          </Row>




        </div>

      </div>
    </UI >
  );
}
