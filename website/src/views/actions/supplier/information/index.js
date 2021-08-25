import {
  useHistory,
  Link,
  useLocation
} from "react-router-dom";
import styles from "./../information/information.module.scss";
import {Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { ROUTES } from "consts";
export default function SupplierInformation() {
  const history = useHistory()
  const location = useLocation()
  const dataSupplier = location.state && location.state;

  useEffect(() => {
    if (!location.state) history.goBack()
  }, [])

  return (
    <>
      <div className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to={ROUTES.SUPPLIER}>

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


            </Col>

            {/*  */}
          </Row>
        </div>
      </div>
    </ >
  );
}
