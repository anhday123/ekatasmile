import React, { useState, useEffect } from 'react'
import styles from './sell.module.scss'

import { ACTION } from 'consts'
import { useSelector, useDispatch } from 'react-redux'

//antd
import { Row, Modal, Select, Button, notification, Input } from 'antd'

//icons antd
import { ExclamationCircleOutlined } from '@ant-design/icons'

//images
import location from 'assets/icons/location.png'

//apis
import { getAllStore } from 'apis/store'

export default function ChangeStore() {
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)

  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const storeActive =
    localStorage.getItem('storeSell') && JSON.parse(localStorage.getItem('storeSell'))

  const [storeId, setStoreId] = useState(storeActive && storeActive.store_id)

  const _getStores = async () => {
    try {
      setLoading(true)
      const res = await getAllStore()
      if (res.status === 200) setStores(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const _changeStore = async () => {
    const store = stores.find((s) => s.store_id === storeId)
    localStorage.setItem('storeSell', JSON.stringify(store))
    localStorage.setItem('invoice', JSON.stringify({ invoice: {} })) //reset đơn hàng local storage
    dispatch({ type: 'UPDATE_INVOICE', data: [] }) //reset đơn hàng trong reducer
    window.location.reload()
  }

  function confirm() {
    Modal.confirm({
      onOk: () => _changeStore(),
      title: 'Bạn có muốn chuyển đổi cửa hàng này không ?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hệ thống sẽ không lưu lại thông tin của các đơn hàng này',
      okText: 'Đồng ý',
      cancelText: 'Từ chối',
    })
  }

  useEffect(() => {
    if (!visible) setStoreId(storeActive && storeActive.store_id)
  }, [visible])

  useEffect(() => {
    _getStores()
  }, [])

  return (
    <>
      <Row wrap={false} align="middle" style={{ cursor: 'pointer' }} onClick={toggle}>
        <img src={location} alt="" style={{ marginRight: 10, width: 10 }} />
        <p className={styles['name-store']}>{storeActive && storeActive.name}</p>
      </Row>
      <Modal
        width={400}
        onCancel={toggle}
        visible={visible}
        footer={null}
        title="Chuyển đổi cửa hàng"
      >
        <div>
          <p style={{ marginBottom: 0 }}>Doanh nghiệp</p>
          <Input
            style={{ color: 'black' }}
            value={dataUser.data && dataUser.data._branch && dataUser.data._branch.name}
            disabled
          />
        </div>
        <div style={{ marginBottom: 25, marginTop: 20 }}>
          <p style={{ marginBottom: 0 }}>Điểm bán</p>
          <Select
            placeholder="Chọn điểm bán"
            loading={loading}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '100%' }}
            value={storeId}
            onChange={(value) => setStoreId(value)}
          >
            {stores.map((store, index) => (
              <Select.Option key={index} value={store.store_id}>
                {store.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Row justify="end">
          <Button
            onClick={confirm}
            type="primary"
            style={{ backgroundColor: '#0877DE', borderColor: '#0877DE' }}
          >
            Chuyển đổi
          </Button>
        </Row>
      </Modal>
    </>
  )
}
