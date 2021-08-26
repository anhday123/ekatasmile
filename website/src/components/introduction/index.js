import React, { useEffect, useState } from 'react'

//antd
import { Button, Modal, Row } from 'antd'

import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

function ModalIntro() {
  const history = useHistory()

  const [visible, setVisible] = useState(false)
  const dataUser = useSelector((state) => state.login.dataUser)

  useEffect(() => {
    if (Object.keys(dataUser).length && dataUser.data.is_new) setVisible(true)
  }, [dataUser])

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
          <Button
            type="primary"
            style={{ width: '7.5rem' }}
            onClick={() => {
              setVisible(false)
              history.push({
                pathname: ROUTES.STORE,
                state: {
                  isHaveStore:
                    Object.keys(dataUser).length && !dataUser.data.is_new,
                },
              })
            }}
          >
            Tiếp tục
          </Button>
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
            src="https://ecomfullfillment.s3.ap-southeast-1.amazonaws.com/1629652136039_ecomfullfillment_0.png"
            alt=""
          />
        </div>
        <div style={{ color: 'black', fontSize: '1.1rem', fontWeight: 400 }}>
          Chào mừng bạn đến với tính năng bán tại cửa hàng. Hãy tạo một cửa hàng
          để bắt đầu kinh doanh cùng{' '}
          <span style={{ fontWeight: 700 }}>Admin Order</span> nhé!!!
        </div>
      </div>
    </Modal>
  )
}

export default ModalIntro
