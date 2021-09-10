import styles from './orderDetail.module.scss'
import { Row, Col, Button, Table, Modal, Timeline } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import moment from 'moment'
import { compare, formatCash } from 'utils'
import { useState } from 'react'
export default function CustoemrOrderDetail() {
  const [showLog, setShowLog] = useState(false)
  const history = useHistory()
  const columns = [
    {
      title: 'Mã SKU',
      dataIndex: '',
      key: 0,
      render: (data) => 'GTY00009',
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: '',
      key: 1,
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Số lượng',
      dataIndex: '',
      key: 2,
      render: (data) => formatCash(1),
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Đơn giá',
      dataIndex: '',
      key: 3,
      render: (data) => formatCash(520000) + ' VND',
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Tổng tiền',
      dataIndex: '',
      key: 4,
      render: (data) => formatCash(520000) + ' VND',
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Chiết khấu',
      dataIndex: '',
      key: 0,
      render: (data) => formatCash(52000) + ' VND',
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Thành tiền',
      dataIndex: '',
      key: 0,
      render: (data) => formatCash(468000) + ' VND',
      sorter: (a, b) => compare(a, b, ''),
    },
    {
      title: 'Khuyến mãi',
      dataIndex: '',
      key: 0,
      render: (data) => 'Không có',
      sorter: (a, b) => compare(a, b, ''),
    },
  ]
  return (
    <>
      <div className={styles['order-detail']}>
        <Row
          style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}
          justify="space-between"
        >
          <Col>
            <Row align="middle" style={{ fontSize: 20, fontWeight: 600 }}>
              <Link to={ROUTES.CUSTOMER_ORDER_LIST} style={{ color: '#000' }}>
                <ArrowLeftOutlined style={{ marginRight: 7 }} />
              </Link>
              Đơn hàng {history.location.state.code} &nbsp;&nbsp;&nbsp;&nbsp;
              <span
                style={{ fontSize: 16, fontWeight: 'normal', lineHeight: 1 }}
              >
                {moment('2021-09-07T15:14:09+07:00').format(
                  'DD-MM-YYYY hh:mm:ss'
                )}
              </span>
            </Row>
          </Col>
          <Col style={{ fontSize: 16 }}>
            Trạng thái đơn hàng:{' '}
            <span style={{ color: '#0EAC00', fontWeight: 600 }}>
              Hoàn thành
            </span>
          </Col>
        </Row>
        <Row style={{ margin: '1em 0' }}>
          <Button type="primary" onClick={() => setShowLog(true)}>
            Order log
          </Button>
        </Row>
        <Row gutter={[0, 16]}>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Tên thu ngân:</b> Nguyễn A
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Thuế:</b> VAT
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Tổng tiền:</b> {formatCash(520000)}{' '}
            VND
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Tên khách hàng:</b> Chị Hoàng Mai Anh
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Hình thức thanh toán:</b> Tiền mặt
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Chiết khấu:</b> {formatCash(52000)}{' '}
            VND
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Số điện thoại:</b> 0678965678
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Địa chỉ:</b> Số 41 đường số 21, quận
            Gò Vấp, Hồ Chí Minh
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Thành tiền:</b> {formatCash(468000)}{' '}
            VND
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>Phương thức nhận hàng:</b> Tại cửa
            hàng
          </Col>
          <Col xs={24} lg={8}>
            <b style={{ fontWeight: 500 }}>ghi chú:</b> Không có ghi chú
          </Col>
        </Row>
        <Row style={{ fontSize: 18, margin: '1em 0' }}>
          <b>Thông tin sản phẩm</b>
        </Row>
        <Table
          columns={columns}
          dataSource={[1]}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </div>
      <Modal
        visible={showLog}
        onCancel={() => setShowLog(false)}
        onOk={() => setShowLog(false)}
        title="Order log"
        // centered
      >
        <Timeline>
          <Timeline.Item>
            <Row justify="space-between">
              <Col>Hoàn thành</Col>
              <Col>
                {moment('2021-09-07T15:14:09+07:00').format(
                  'DD/MM/YYYY hh:mm:ss'
                )}
              </Col>
            </Row>
          </Timeline.Item>
          <Timeline.Item>
            <Row justify="space-between">
              <Col>Đang xử lý</Col>
              <Col>
                {moment('2021-09-07T15:14:09+07:00').format(
                  'DD/MM/YYYY hh:mm:ss'
                )}
              </Col>
            </Row>
          </Timeline.Item>
          <Timeline.Item>
            <Row justify="space-between">
              <Col>Đang vận chuyển</Col>
              <Col>
                {moment('2021-09-07T15:14:09+07:00').format(
                  'DD/MM/YYYY hh:mm:ss'
                )}
              </Col>
            </Row>
          </Timeline.Item>
          <Timeline.Item>
            <Row justify="space-between">
              <Col>Đặt hàng</Col>
              <Col>
                {moment('2021-09-07T15:14:09+07:00').format(
                  'DD/MM/YYYY hh:mm:ss'
                )}
              </Col>
            </Row>
          </Timeline.Item>
        </Timeline>
      </Modal>
    </>
  )
}
