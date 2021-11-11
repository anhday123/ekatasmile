import React, { useState, useEffect } from 'react'

import {
  Modal,
  Row,
  Col,
  Button,
  Radio,
  Space,
  Input,
  notification,
} from 'antd'

import gift from 'assets/icons/gift.png'
import { formatCash } from 'utils'
//apis
import { getPromoton, checkVoucher } from 'apis/promotion'

export default function PromotionAvailable({ invoiceCurrent }) {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [loading, setLoading] = useState(false)
  const [voucherCheck, setVoucherCheck] = useState('')

  const [promotions, setPromotions] = useState([])
  const [promotionCheck, setPromotionCheck] = useState(null)

  const _getPromotions = async () => {
    try {
      const res = await getPromoton()
      console.log(res)
      if (res.status === 200)
        setPromotions(res.data.data.filter((e) => e.active))
    } catch (error) {
      console.log(error)
    }
  }

  const _checkVoucher = async () => {
    try {
      setLoading(true)
      const res = await checkVoucher(voucherCheck)
      if (res.status === 200) {
      } else
        notification.warning({
          message:
            res.data.message || 'Kiểm tra voucher thất bại, vui lòng thử lại!',
        })
      console.log(res)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.log(error)
    }
  }
  useEffect(() => {
    _getPromotions()
  }, [])

  return (
    <>
      <img
        onClick={toggle}
        src={gift}
        alt=""
        style={{ width: 16, height: 16, marginLeft: 8, cursor: 'pointer' }}
      />
      <Modal
        width={700}
        visible={visible}
        title="Khuyến mãi khả dụng"
        onCancel={toggle}
        footer={
          <Row justify="end">
            <Button
              type="primary"
              style={{
                backgroundColor: '#0877DE',
                borderRadius: 5,
                borderColor: '#0877DE',
              }}
            >
              Áp dụng
            </Button>
          </Row>
        }
      >
        <Row>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Chương trình khuyến mãi</h3>
          </Col>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Giá trị</h3>
          </Col>
          <Col xs={8} sm={8}>
            <h3 style={{ textAlign: 'center' }}>Hạn mức áp dụng</h3>
          </Col>
        </Row>
        {promotions.map((promotion) => (
          <Row>
            <Col xs={8} sm={8}>
              <Radio
                checked={
                  promotionCheck && promotionCheck._id === promotion._id
                    ? true
                    : false
                }
                onClick={() => {
                  if (invoiceCurrent.sumCostPaid >= promotion.max_discount)
                    setPromotionCheck(promotion)
                  else
                    notification.warning({
                      message:
                        'Đơn hàng của bạn đủ điều kiện để áp dụng chương trình khuyến mãi này !',
                    })
                }}
              >
                {promotion.name}
              </Radio>
            </Col>
            <Col xs={8} sm={8}>
              <p style={{ textAlign: 'center' }}>
                {formatCash(promotion.value)}
              </p>
            </Col>
            <Col xs={8} sm={8}>
              <p style={{ textAlign: 'center' }}>
                {formatCash(promotion.max_discount)}
              </p>
            </Col>
          </Row>
        ))}
        <div style={{ marginTop: 15 }}>
          <h3 style={{ marginBottom: 0, fontSize: 17 }}>Nhập voucher</h3>
          <Space wrap={false}>
            <Input
              value={voucherCheck}
              onChange={(e) => setVoucherCheck(e.target.value)}
              placeholder="Nhập voucher"
              style={{ width: 300 }}
            />
            <Button
              onClick={_checkVoucher}
              loading={loading}
              type="primary"
              style={{
                backgroundColor: '#0877DE',
                borderRadius: 5,
                borderColor: '#0877DE',
              }}
            >
              Kiểm tra
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  )
}
