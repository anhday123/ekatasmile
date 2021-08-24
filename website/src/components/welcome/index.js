import React, { useEffect, useState } from 'react'

//antd
import { Button, Modal, Row, notification, Space } from 'antd'

import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ROUTES } from 'consts'

function ModalWelcome() {
  const history = useHistory()
  const dispatch = useDispatch()
  const visibleModal = useSelector((state) => state.modal.visibleWelcome)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(visibleModal)
  }, [visibleModal])

  return (
    <Modal
      title={
        <div style={{ fontWeight: 600, fontSize: 19 }}>
          Chào mừng đến với Admin Order
        </div>
      }
      centered
      width={580}
      footer={
        <Row justify="end">
          <Space>
            <Button
              style={{ width: '7.5rem' }}
              onClick={() => {
                setVisible(false)
                dispatch({ type: 'SHOW_MODAL_WELCOME', data: false })
                const key = 'notiCreateBranch'
                notification.warning({
                  key,
                  message: 'Bạn chưa có chi nhánh',
                  description: (
                    <a
                      onClick={() => {
                        history.push({
                          pathname: ROUTES.BRANCH,
                          state: { isHaveBranch: false },
                        })
                      }}
                    >
                      Nhấn vào đây để tạo chi nhánh
                    </a>
                  ),
                  duration: 0,
                  placement: 'bottomLeft',
                })
              }}
            >
              Để sau
            </Button>
            <Button
              type="primary"
              style={{ width: '7.5rem' }}
              onClick={() => {
                history.push({
                  pathname: ROUTES.BRANCH,
                  state: { isHaveBranch: false },
                })
                setVisible(false)
              }}
            >
              Tiếp tục
            </Button>
          </Space>
        </Row>
      }
      visible={visible}
      closable={false}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 300,
            marginRight: 20,
          }}
        >
          <img
            style={{ width: '100%' }}
            src="https://ecomfullfillment.s3.ap-southeast-1.amazonaws.com/1629652152984_ecomfullfillment_0.png"
            alt=""
          />
        </div>
        <div style={{ color: 'black', fontSize: '1.1rem', fontWeight: 400 }}>
          Bạn vừa tạo một cửa hàng trên{' '}
          <span style={{ fontWeight: 700 }}>Admin Order</span>. Hãy tạo một chi
          nhánh (điểm bán hàng) để sử dụng chức năng này nhé
        </div>
      </div>
    </Modal>
  )
}

export default ModalWelcome
