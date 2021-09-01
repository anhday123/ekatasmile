import React, { useState, useEffect } from 'react'

//antds
import { Button, Drawer, Row, Divider } from 'antd'
import moment from 'moment'

export default function HistoryBill() {
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const toggle = () => setVisible(!visible)

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else setIsMobile(false)
  }, [])

  return (
    <>
      <Button onClick={toggle} type="primary" size="large">
        Pre-order
      </Button>
      <Drawer
        width={isMobile ? '100%' : 500}
        onClose={toggle}
        visible={visible}
        title="Đơn hàng đặt gần nhất"
      >
        {[1, 2, 3, 4, 5].map((e) => (
          <>
            <Row justify="space-between" align="middle">
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Nguyễn Văn A - 0123456789
              </span>
              <div style={{ fontSize: 15 }}>
                {moment(new Date()).format('HH:mm:ss DD/MM/YYYY')}
              </div>
            </Row>
            <h3
              style={{
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 0,
              }}
            >
              Giày thể thao kiểu dáng Hàn Quốc
            </h3>
            <Row justify="space-between" align="middle">
              <div style={{ fontWeight: 500, fontSize: 14, color: 'gray' }}>
                Màu: Đỏ Đen, Size: 38
              </div>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'gray' }}>
                x2
              </div>
            </Row>
            <Row justify="end">
              <span style={{ fontWeight: 500, fontSize: 15, color: 'gray' }}>
                250.000 VNĐ
              </span>
            </Row>
            <Row justify="end">
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  marginTop: 8,
                }}
              >
                Thành tiền: 500.000 VNĐ
              </span>
            </Row>
            <Row justify="end">
              <Button
                type="primary"
                style={{
                  backgroundColor: '#5d6fe5',
                  borderColor: '#5d6fe5',
                  marginTop: 5,
                }}
              >
                Đặt lại
              </Button>
            </Row>
            <Divider />
          </>
        ))}
      </Drawer>
    </>
  )
}
