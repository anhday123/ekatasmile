import {

  Link,

} from "react-router-dom";
import styles from "./../view/view.module.scss";
import { Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
export default function CustomerView() {
  return (
    <>
      <div className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to="/customer/17">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} />
          <div className={styles["supplier_information_title_right"]}>
            Thông tin chi tiết khách hàng Mai Ka
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
                  <b>Mã khách hàng:</b> GH6789
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
                    <b>Ngày sinh:</b> 2021/06/28
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
                    <b>Tên khách hàng:</b> Mai Ka
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
                    <b>Liên hệ:</b> 0384943497
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
                    <b>Loại khách hàng:</b> Tiềm năng
                  </div>
                </Col>

              </Row>


            </Col>

            <Col
              style={{ width: '100%' }}
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
                    <b>Địa chỉ:</b> 27/27, đường Ngô Y Linh
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
                    <b>Tên:</b> Mai
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
                    <b>Tỉnh/thành phố:</b> Hồ chí minh
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
                    <b>Họ:</b> Ka
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
                    <b>Quận/huyện:</b> Bình tân
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
                    <b>Email:</b> abc@gmail.com
                  </div>
                </Col>

              </Row>


            </Col>


          </Row>





        </div>
      </div>
    </ >
  );
}
