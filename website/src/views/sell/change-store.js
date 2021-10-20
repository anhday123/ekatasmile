import React, { useState, useEffect } from 'react'
import styles from './sell.module.scss'

import { Row, Modal, Select, Button } from 'antd'

import { useSelector } from 'react-redux'

//images
import location from 'assets/icons/location.png'

export default function ChangeStore() {
  const dataUser = useSelector((state) => state.login.dataUser)

  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [value, setValue] = useState(
    dataUser.data && dataUser.data._store.store_id
  )

  useEffect(() => {
    if (!visible) setValue(dataUser.data && dataUser.data._store.store_id)
  }, [visible])

  return (
    <>
      <Row
        wrap={false}
        align="middle"
        style={{ cursor: 'pointer' }}
        onClick={toggle}
      >
        <img src={location} alt="" style={{ marginRight: 10, width: 10 }} />
        <p className={styles['name-store']}>
          {dataUser.data && dataUser.data._store.name}
        </p>
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
          <Select
            style={{ width: '100%' }}
            disabled
            value={dataUser.data && dataUser.data._branch.name}
          >
            <Select.Option value={dataUser.data && dataUser.data._branch.name}>
              <div style={{ color: 'black' }}>
                {dataUser.data && dataUser.data._branch.name}
              </div>
            </Select.Option>
          </Select>
        </div>
        <div style={{ marginBottom: 25, marginTop: 20 }}>
          <p style={{ marginBottom: 0 }}>Điểm bán</p>
          <Select
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '100%' }}
            value={value}
            onChange={(value) => setValue(value)}
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
            onClick={() => _changeStore(value)}
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
