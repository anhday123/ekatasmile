import styles from "./../payment/payment.module.scss";
import {
  Card,
  Col,
  Drawer,
  Row,
  Switch,
  Button,
  Modal,
  Radio,
  Space
} from "antd";
import vietcombank from "./../../assets/img/vietcombank.png";
import sub from "./../../assets/img/sub.png";
import {
  Link,
} from "react-router-dom";

import zalopayMethod from "./../../assets/img/zalopayMethod.png";
import airpayMethod from "./../../assets/img/airpayMethod.jpg";
import vnpayMethod from "./../../assets/img/vnpayMethod.jpg";
import wepayMethod from "./../../assets/img/wepayMethod.png";
import vinidMethod from "./../../assets/img/vinidMethod.png";
import mocaMethod from "./../../assets/img/mocaMethod.png";
import React, { useState } from "react";
import {
  CreditCardOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";
export default function Payment() {
  const [temp, setTemp] = useState(0);
  const [visible, setVisible] = useState(false)
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [paymentTypeModal, setPaymentTypeModal] = useState(false)


  const showDrawer = () => {
    setVisible(true)
    setModal2VisibleNew(false)
  };

  const onClose = () => {
    setVisible(false)

  };

  const setModal1VisibleNew = (modal1Visible) => {
    setModal1Visible(modal1Visible);
  };
  const setModal2VisibleNew = (modal2Visible) => {
    setModal2Visible(modal2Visible);
  };
  const [value, setValue] = React.useState(1);

  const showStatusMethod = (status) => {
    setTemp(status);
  };

  const cancel = (data) => {
    setModal2Visible(data);
  };
  const confirmFinish = (data) => {
    setModal1VisibleNew(false);
  };

  const [iconVietcomback, setIconVietcombank] = useState(0)
  const onClickVietcombank = (data) => {
    setIconVietcombank(data)
  }
  return (
    <>
      <div className={styles["payment_method"]}>
        <Row style={{ display: 'flex', borderBottom: '1px solid rgb(233, 223, 223)', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Link className={styles["supplier_add_back_parent"]} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

              <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
              <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Hình thức thanh toán</div>

            </Link>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={12} lg={12} xl={12}>

            <Row className={styles["payment_method_button"]}>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={9}>
                <Button
                  className={
                    styles["payment_method_method_parent_button_left_color"]
                  }
                  type="primary"
                  onClick={() => setPaymentTypeModal(true)}
                  icon={<CreditCardOutlined />}
                >
                  Thêm hình  thức thanh toán
                </Button>
              </Col>
            </Row>

          </Col>
        </Row>

        <Row style={{ marginTop: '50px' }} className={styles["payment_method_payment"]}>
          <Col
            className={styles["payment_method_payment_parent"]}
            xs={22}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            <Card className={styles["payment_method_payment_col_left"]}>
              <div >
                <Switch defaultChecked style={{ position: "absolute", right: 10, top: 10 }} />
                <div className={styles["payment_method_payment_col_title"]}>
                  Thanh toán tiền mặt
                </div>
              </div>
            </Card>
          </Col>
          <Col
            className={styles["payment_method_payment_parent"]}
            xs={22}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            <Card className={styles["payment_method_payment_col_left"]}>
              <div >
                <Switch style={{ position: "absolute", right: 10, top: 10 }} />
                <div className={styles["payment_method_payment_col_title"]}>
                  Thanh toán thẻ ngân hàng
                </div>
              </div>
            </Card>
          </Col>
          <Col
            className={styles["payment_method_payment_parent"]}
            xs={22}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            <Card className={styles["payment_method_payment_col_left"]}>
              <div>
                <Switch style={{ position: "absolute", right: 10, top: 10 }} />
                <div className={styles["payment_method_payment_col_title"]}>
                  Thanh toán cọc
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <div className={styles["payment_method_method_parent"]}>
        </div>
        {value === 2 ? (
          <Row style={{ marginTop: '0.5rem' }} className={styles["payment_method_online"]}>
            <Col
              className={styles["payment_method_online_col"]}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              {" "}
              <div className={styles["payment_method_online_select"]}>
                <Row className={styles["payment_method_online_select_title"]}>

                  <Col className={iconVietcomback === 1 ? (styles['payment_method_active']) : (styles['payment_method_active_disable'])} style={{ with: '100%', position: 'relative', marginBottom: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={11}>

                    <Row
                      className={
                        styles["payment_method_online_select_title_image"]
                      }
                    >
                      <Col xs={24} sm={24} md={7} lg={7} xl={7}>

                        <div
                          className={
                            styles[
                            "payment_method_online_select_title_image_left"
                            ]
                          }
                        >
                          <img
                            className={
                              styles[
                              "payment_method_online_select_title_image_left_momo"
                              ]
                            }
                            src={vietcombank}
                            alt=""
                          />
                        </div>

                      </Col>
                      <Col
                        className={
                          styles[
                          "payment_method_online_select_title_image_col_chil_mini"
                          ]
                        }
                        xs={24}
                        sm={24}
                        md={17}
                        lg={17}
                        xl={17}
                      >
                        <Row
                          className={
                            styles[
                            "payment_method_online_select_title_image_right"
                            ]
                          }
                        >
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item"
                                ]
                              }
                            >
                              <div
                                className={
                                  styles[
                                  "payment_method_online_select_title_image_right_item_total"
                                  ]
                                }
                              >
                                Tổng tiền thanh toán
                              </div>
                            </div>
                          </Col>
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item"
                                ]
                              }
                            >
                              <div
                                className={
                                  styles[
                                  "payment_method_online_select_title_image_right_item_total"
                                  ]
                                }
                              >
                                4.000.000 VNĐ
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row
                          className={
                            styles[
                            "payment_method_online_select_title_image_right"
                            ]
                          }
                        >
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item"
                                ]
                              }
                            >
                              <div>Thanh toán trả trước</div>
                            </div>
                          </Col>
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item_fix"
                                ]
                              }
                            >
                              <div>4.000.000 VNĐ</div>
                            </div>
                          </Col>
                        </Row>

                        <Row
                          className={
                            styles[
                            "payment_method_online_select_title_image_right"
                            ]
                          }
                        >
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item"
                                ]
                              }
                            >
                              <div>Thanh toán trả sau</div>
                            </div>
                          </Col>
                          <Col
                            className={
                              styles[
                              "payment_method_online_select_title_image_right_col"
                              ]
                            }
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                          >
                            <div
                              className={
                                styles[
                                "payment_method_online_select_title_image_right_item_fix"
                                ]
                              }
                            >
                              <div>4.000.000 VNĐ</div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <img onClick={() => onClickVietcombank(1)} src={sub} style={{ width: '1rem', cursor: 'pointer', position: 'absolute', top: '0', margin: '0.25rem 0 0 0.25rem', left: '0', height: '1rem' }} alt="" />
                  </Col>
                </Row>
              </div>

            </Col>
          </Row>
        ) : (
          <div></div>
        )}
      </div>
      <Modal
        title="Chọn ví thanh toán"
        centered
        width={800}
        footer={null}
        visible={modal2Visible}
        // onOk={() => setModal2VisibleNew(false)}
        onCancel={() => setModal2VisibleNew(false)}
      >
        <div style={{}} className={styles["choose"]}>
          <Row className={styles["wallet"]}>
            <Col className={temp === 1 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(1)}>
              <img
                className={temp === 1 ? styles["wallet_img"] : styles["wallet_img"]}
                src={zalopayMethod}
                alt=""
              />
              {temp === 1 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}

            </Col>
            <Col className={temp === 2 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(2)}>
              <img
                className={temp === 2 ? styles["wallet_img"] : styles["wallet_img"]}
                src={airpayMethod}
                alt=""
              />
              {temp === 2 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}
            </Col>
            <Col className={temp === 3 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(3)}>
              <img
                className={temp === 3 ? styles["wallet_img"] : styles["wallet_img"]}
                src={vnpayMethod}
                alt=""
              />
              {temp === 3 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}
            </Col>
            <Col className={temp === 4 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(4)}>
              <img
                className={temp === 4 ? styles["wallet_img"] : styles["wallet_img"]}
                src={wepayMethod}
                alt=""
              />
              {temp === 4 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}
            </Col>
            <Col className={temp === 5 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(5)}>
              <img
                className={temp === 5 ? styles["wallet_img"] : styles["wallet_img"]}
                src={vinidMethod}
                alt=""
              />
              {temp === 5 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}
            </Col>
            <Col className={temp === 6 ? styles["wallet_item_active"] : styles["wallet_item"]} xs={24} sm={24} md={11} lg={7} xl={7} onClick={() => showStatusMethod(6)}>
              <img
                className={temp === 6 ? styles["wallet_img"] : styles["wallet_img"]}
                src={mocaMethod}
                alt=""
              />
              {temp === 6 ? (<CheckOutlined style={{ position: "absolute", fontSize: '1.5rem', margin: '0.25rem 0.25rem 0 0', fontWeight: '900', color: '#0500FF', top: '0', right: '0' }} />) : ('')}
            </Col>
          </Row>
          {/* <div className={styles['space']}></div> */}
          <div className={styles["choose_button"]}>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => cancel(false)}
              className={styles["choose_button_left"]}
              type="primary"
              danger
            >
              Hủy
            </Button>
            <Button className={styles["choose_button_left"]} onClick={showDrawer} type="primary">
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
      <Drawer
        title="Quy trình đăng ký"
        width={400}
        onClose={onClose}
        visible={visible}
      // bodyStyle={{ paddingBottom: 80 }}
      >

        <div className={styles["payment_confirm"]}>
          <div className={styles["payment_confirm_child"]}>
            <div className={styles["payment_confirm_child_title"]}>
              Bước 1 - Đăng Ký Tài Khoản
            </div>
            <div className={styles["payment_confirm_child_content"]}>
              Đăng ký tài khoản kinh doanh với các thông tin doanh nghiệp cơ
              bản. Đồng ý với điều khoản hợp đồng ZaloPay thể hiện khi đăng ký
              tài khoản
            </div>
          </div>
          <div className={styles["payment_confirm_child"]}>
            <div className={styles["payment_confirm_child_title"]}>
              Bước 2 - Cập Nhật Chứng Từ
            </div>
            <div className={styles["payment_confirm_child_content"]}>
              Tải lên và cập nhật các chứng từ cần thiết: giấy chứng nhận đăng
              ký doanh nghiệp, mã số thuế, v.v...
            </div>
          </div>
          <div className={styles["payment_confirm_child"]}>
            <div className={styles["payment_confirm_child_title"]}>
              Bước 3 - In QR / Nghiệm Thu
            </div>
            <div className={styles["payment_confirm_child_content"]}>
              Với giải pháp QR Tĩnh: Sau khi đăng ký thành công, hệ thống sẽ
              kiểm tra tính hợp lý của hồ sơ đăng ký và cung cấp QR Tĩnh sau 2
              giờ làm việc (giờ hành chính). Với giải pháp QR Động hoặc
              QuickPay: Doanh nghiệp cần tiến hành tích hợp kỹ thuật, VÍ ĐIỆN TỬ
              sẽ hỗ trợ nghiệm thu sau khi tích hợp thành công. Sau khi in
              QR/Nghiệm thu, Doanh nghiệp có thể triển khai thanh toán bằng
              nguồn Ví (trong khi chờ thẩm định).
            </div>
          </div>
          <div className={styles["payment_confirm_child"]}>
            <div className={styles["payment_confirm_child_title"]}>
              Bước 4 - Thẩm Định
            </div>
            <div className={styles["payment_confirm_child_content"]}>
              Doanh nghiệp in và ký bản Hợp đồng sử dụng dịch vụ, sau đó gửi bản
              cứng về cho Ví Điện Tử trong vòng 5 ngày làm việc. Sau khi nhận
              hợp đồng, bộ phận pháp chế của Ví Điện Tử sẽ tiến hành thẩm định
              hồ sơ doanh nghiệp trong 2 ngày làm việc. Nếu hồ sơ đủ điều kiện,
              doanh nghiệp sẽ được chấp nhận thanh toán bằng tất cả các kênh
              thanh toán và hạn mức thanh toán chung của Ví Điện Tử.
            </div>
          </div>
          <div onClick={onClose} className={styles["payment_confirm_button"]}>
            <Button onClick={() => confirmFinish(false)} type="primary">
              OK
            </Button>
          </div>
        </div>

      </Drawer>
      <Modal visible={paymentTypeModal} onCancel={() => setPaymentTypeModal(false)} onOk={() => setPaymentTypeModal(false)}>
        <Radio.Group defaultValue='1'>
          <Space direction="vertical" >
            <Radio value="1">Thanh toán bằng smartphone (qua Mobile banking hoặc Mã QR)</Radio>
            <Radio value='2'>Thanh toán bằng cổng thanh toán</Radio>
            <Radio value='3'>Thanh toán bằng ví điện tử</Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </>
  );
}
