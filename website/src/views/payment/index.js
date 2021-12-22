import React, { useEffect, useState } from 'react'
import styles from './payment.module.scss'

//antd
import { Card, Col, Drawer, Row, Switch, Button, Modal, Input, Form, Table } from 'antd'

import { Link } from 'react-router-dom'
import { ROUTES, PERMISSIONS } from 'consts'
import Permission from 'components/permission'

import zalopayMethod from 'assets/img/zalopayMethod.png'
import airpayMethod from 'assets/img/airpayMethod.jpg'
import vnpayMethod from 'assets/img/vnpayMethod.jpg'
import wepayMethod from 'assets/img/wepayMethod.png'
import vinidMethod from 'assets/img/vinidMethod.png'
import mocaMethod from 'assets/img/mocaMethod.png'
import sub from 'assets/img/sub.png'
import vietcombank from 'assets/img/vietcombank.png'

//icons
import { CreditCardOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons'

//apis
import { getAllPayment } from 'apis/payment'
export default function Payment() {
  const [temp, setTemp] = useState(0)
  const [visible, setVisible] = useState(false)
  const [modal1Visible, setModal1Visible] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [paymentTypeModal, setPaymentTypeModal] = useState(false)
  const [payments, setPayments] = useState([
    { name: 'Tiền mặt' },
    { name: 'Thẻ ngân hàng' },
    { name: 'Tiền cọc' },
  ])

  const columns = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên hình thức thanh toán',
      dataIndex: 'name',
    },
    {
      title: 'Hành động',
      render: (text, record, index) => <Switch />,
    },
  ]

  const showDrawer = () => {
    setVisible(true)
    setModal2VisibleNew(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  const setModal1VisibleNew = (modal1Visible) => {
    setModal1Visible(modal1Visible)
  }
  const setModal2VisibleNew = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const [value, setValue] = React.useState(1)

  const showStatusMethod = (status) => {
    setTemp(status)
  }

  const cancel = (data) => {
    setModal2Visible(data)
  }
  const confirmFinish = (data) => {
    setModal1VisibleNew(false)
  }

  const [iconVietcomback, setIconVietcombank] = useState(0)
  const onClickVietcombank = (data) => {
    setIconVietcombank(data)
  }

  const _getPayments = async () => {
    try {
      const res = await getAllPayment()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   _getPayments()
  // }, [])

  return (
    <>
      <div className={`${styles['payment_method']} ${styles['card']}`}>
        <Row
          justify="space-between"
          style={{
            borderBottom: '1px solid rgb(233, 223, 223)',
            width: '100%',
            flexWrap: 'nowrap',
            paddingBottom: 15,
          }}
        >
          <Link
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontSize: '1rem',
              fontWeight: '500',
            }}
            to={ROUTES.CONFIGURATION_STORE}
          >
            <ArrowLeftOutlined style={{ fontSize: '1rem', marginRight: 5 }} />
            Hình thức thanh toán
          </Link>
          <Permission permissions={[PERMISSIONS.them_hinh_thuc_thanh_toan]}>
            <Button
              size="large"
              type="primary"
              onClick={() => setPaymentTypeModal(true)}
              icon={<CreditCardOutlined />}
            >
              Thêm hình thức thanh toán
            </Button>
          </Permission>
        </Row>
        <Table
          columns={columns}
          dataSource={payments}
          size="small"
          style={{ width: '100%', marginTop: 10 }}
        />
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
        <div style={{}} className={styles['choose']}>
          <Row className={styles['wallet']}>
            <Col
              className={temp === 1 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(1)}
            >
              <img
                className={temp === 1 ? styles['wallet_img'] : styles['wallet_img']}
                src={zalopayMethod}
                alt=""
              />
              {temp === 1 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
            <Col
              className={temp === 2 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(2)}
            >
              <img
                className={temp === 2 ? styles['wallet_img'] : styles['wallet_img']}
                src={airpayMethod}
                alt=""
              />
              {temp === 2 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
            <Col
              className={temp === 3 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(3)}
            >
              <img
                className={temp === 3 ? styles['wallet_img'] : styles['wallet_img']}
                src={vnpayMethod}
                alt=""
              />
              {temp === 3 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
            <Col
              className={temp === 4 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(4)}
            >
              <img
                className={temp === 4 ? styles['wallet_img'] : styles['wallet_img']}
                src={wepayMethod}
                alt=""
              />
              {temp === 4 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
            <Col
              className={temp === 5 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(5)}
            >
              <img
                className={temp === 5 ? styles['wallet_img'] : styles['wallet_img']}
                src={vinidMethod}
                alt=""
              />
              {temp === 5 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
            <Col
              className={temp === 6 ? styles['wallet_item_active'] : styles['wallet_item']}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
              onClick={() => showStatusMethod(6)}
            >
              <img
                className={temp === 6 ? styles['wallet_img'] : styles['wallet_img']}
                src={mocaMethod}
                alt=""
              />
              {temp === 6 ? (
                <CheckOutlined
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    margin: '0.25rem 0.25rem 0 0',
                    fontWeight: '900',
                    color: '#0500FF',
                    top: '0',
                    right: '0',
                  }}
                />
              ) : (
                ''
              )}
            </Col>
          </Row>
          {/* <div className={styles['space']}></div> */}
          <div className={styles['choose_button']}>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => cancel(false)}
              className={styles['choose_button_left']}
              type="primary"
              danger
            >
              Hủy
            </Button>
            <Button className={styles['choose_button_left']} onClick={showDrawer} type="primary">
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
        <div className={styles['payment_confirm']}>
          <div className={styles['payment_confirm_child']}>
            <div className={styles['payment_confirm_child_title']}>Bước 1 - Đăng Ký Tài Khoản</div>
            <div className={styles['payment_confirm_child_content']}>
              Đăng ký tài khoản kinh doanh với các thông tin doanh nghiệp cơ bản. Đồng ý với điều
              khoản hợp đồng ZaloPay thể hiện khi đăng ký tài khoản
            </div>
          </div>
          <div className={styles['payment_confirm_child']}>
            <div className={styles['payment_confirm_child_title']}>Bước 2 - Cập Nhật Chứng Từ</div>
            <div className={styles['payment_confirm_child_content']}>
              Tải lên và cập nhật các chứng từ cần thiết: giấy chứng nhận đăng ký doanh nghiệp, mã
              số thuế, v.v...
            </div>
          </div>
          <div className={styles['payment_confirm_child']}>
            <div className={styles['payment_confirm_child_title']}>Bước 3 - In QR / Nghiệm Thu</div>
            <div className={styles['payment_confirm_child_content']}>
              Với giải pháp QR Tĩnh: Sau khi đăng ký thành công, hệ thống sẽ kiểm tra tính hợp lý
              của hồ sơ đăng ký và cung cấp QR Tĩnh sau 2 giờ làm việc (giờ hành chính). Với giải
              pháp QR Động hoặc QuickPay: Doanh nghiệp cần tiến hành tích hợp kỹ thuật, VÍ ĐIỆN TỬ
              sẽ hỗ trợ nghiệm thu sau khi tích hợp thành công. Sau khi in QR/Nghiệm thu, Doanh
              nghiệp có thể triển khai thanh toán bằng nguồn Ví (trong khi chờ thẩm định).
            </div>
          </div>
          <div className={styles['payment_confirm_child']}>
            <div className={styles['payment_confirm_child_title']}>Bước 4 - Thẩm Định</div>
            <div className={styles['payment_confirm_child_content']}>
              Doanh nghiệp in và ký bản Hợp đồng sử dụng dịch vụ, sau đó gửi bản cứng về cho Ví Điện
              Tử trong vòng 5 ngày làm việc. Sau khi nhận hợp đồng, bộ phận pháp chế của Ví Điện Tử
              sẽ tiến hành thẩm định hồ sơ doanh nghiệp trong 2 ngày làm việc. Nếu hồ sơ đủ điều
              kiện, doanh nghiệp sẽ được chấp nhận thanh toán bằng tất cả các kênh thanh toán và hạn
              mức thanh toán chung của Ví Điện Tử.
            </div>
          </div>
          <div onClick={onClose} className={styles['payment_confirm_button']}>
            <Button onClick={() => confirmFinish(false)} type="primary">
              OK
            </Button>
          </div>
        </div>
      </Drawer>
      <Modal
        okText="Thêm"
        cancelText="Đóng"
        visible={paymentTypeModal}
        onCancel={() => setPaymentTypeModal(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Hình thức thanh toán">
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
