import React, { useEffect, useState } from 'react'

//antd
import { Button, Modal, Row } from 'antd'

//apis
import { getAllStore } from 'apis/store'

import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { ROUTES } from 'consts'

function ModalIntro() {
  const history = useHistory()
  const location = useLocation()

  const [visible, setVisible] = useState(false)
  const [isHaveStore, setIsHaveStore] = useState(false) //check user co store ?
  const dataUser = useSelector((state) => state.login.dataUser)

  //check user co store ??
  const getStoreByUser = async () => {
    try {
      const res = await getAllStore()
      console.log('data store', res)
      if (res.status === 200) {
        if (res.data.data.length) {
          setVisible(false)
          setIsHaveStore(true)
        } else {
          // nếu đang ở router /store thì ko cần hiện
          if (location.pathname !== ROUTES.STORE) setVisible(true)
          setIsHaveStore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadData = async () => {
    await getStoreByUser()
  }

  useEffect(() => {
    if (Object.keys(dataUser).length) {
      loadData()
    }
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
                  isHaveStore,
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
