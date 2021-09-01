import React, { useState } from 'react'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Row, Modal, Col, Button } from 'antd'

export default function Sell() {
  const [modal3Visible, setModal3Visible] = useState(false)

  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  return (
    <>
      <Button
        size="large"
        className="br-15__button"
        onClick={() => modal3VisibleModal(true)}
      >
        Phím tắt chức năng
      </Button>

      <Modal
        title="Phím tắt chức năng"
        centered
        width={700}
        footer={null}
        visible={modal3Visible}
        onOk={() => modal3VisibleModal(false)}
        onCancel={() => modal3VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F1:</b> Thêm hóa đơn mới
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F10:</b> Quét mã vạch cân
              điện tử
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F2:</b> Bật/tắt chế độ in tự
              động
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F11:</b> Toàn màn hình
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F3:</b> Tìm sản phẩm
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>Home:</b> thay đổi số lượng
              sản phẩm
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F4:</b> Tìm khách hàng
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>
                <ArrowUpOutlined />:
              </b>{' '}
              Tăng số lượng sản phẩm
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F5:</b> Thanh toán
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>
                <ArrowDownOutlined />:
              </b>{' '}
              Giảm số lượng sản phẩm
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F6:</b> Thay đổi chế độ nhập
              số lượng
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F6:</b> Enter: di chuyển
              xuống sản phẩm tiếp theo
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>F8:</b> Khách thanh toán
            </Col>
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <b style={{ marginRight: '0.25rem' }}>Shjft:</b> di chuyển lên sản
              phẩm tiếp theo
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}
