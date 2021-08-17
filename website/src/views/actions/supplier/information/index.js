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
import styles from "./../information/information.module.scss";
import { Select, Button, Input, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function SupplierInformation(propsData) {
  const { Search } = Input;
  const dataSupplier = propsData.location.state;

  console.log(dataSupplier)
  return (
    <UI>
      <div className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to="/supplier/10">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} />
          <div className={styles["supplier_information_title_right"]}>
            {`Thông tin nhà cung cấp ${dataSupplier.name}`}
          </div>

        </Link>

        <div className={styles["supplier_information_content_parent"]}>
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
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>              <div

                >
                  <b>Tên nhà cung cấp:</b> {dataSupplier.name}
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
                    <b>Địa chỉ:</b> {dataSupplier.address}
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
                    <b>Mã nhà cung cấp:</b> {dataSupplier.code}
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
                    <b>Tỉnh/thành phố:</b> {dataSupplier.province}
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
                    <b>Email:</b> {dataSupplier.email}
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
                    <b>Quận/huyện:</b> {dataSupplier.district}
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
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
                    <b>Liên hệ:</b> {dataSupplier.phone}
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="0384943497" /> */}
            </Col>

            {/*  */}
          </Row>
        </div>
      </div>
    </UI >
  );
}
