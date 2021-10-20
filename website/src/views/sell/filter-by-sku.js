import React, { useEffect, useState } from 'react'

//antd
import { Drawer, Row, Button, Checkbox, Space, Spin, Collapse } from 'antd'

//icons
import { FunnelPlotFilled } from '@ant-design/icons'

//apis
import { apiAllCategorySearch } from 'apis/category'

export default function FilterProductsByCategory() {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const _getCategories = async (params) => {
    try {
      setLoading(true)
      const res = await apiAllCategorySearch(params)
      console.log(res)
      if (res.status === 200) setCategories(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    _getCategories()
  }, [])

  return (
    <>
      <FunnelPlotFilled style={{ cursor: 'pointer' }} onClick={toggle} />
      <Drawer
        width={450}
        visible={visible}
        title="Lọc theo danh mục"
        onClose={toggle}
        placement="left"
        footer={
          <Row justify="end">
            <Button
              type="primary"
              style={{
                backgroundColor: '#0877DE',
                borderColor: '#0877DE',
                borderRadius: 8,
              }}
            >
              Xác nhận
            </Button>
          </Row>
        }
      >
        <Row justify="end" style={{ marginBottom: 15 }}>
          <a>Xoá chọn tất cả</a>
        </Row>
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin />
          </div>
        ) : (
          <Collapse ghost defaultActiveKey="1" expandIconPosition="right">
            <Collapse.Panel
              header={
                <span style={{ fontWeight: 700, marginBottom: 0 }}>Size</span>
              }
              key="1"
            >
              <Space wrap={true}>
                <Button type="primary">S</Button>
                <Button type="primary">M</Button>
                <Button type="primary">L</Button>
                <Button type="primary">K</Button>
                <Button type="primary">F</Button>
                <Button type="primary">E</Button>
                <Button type="primary">S</Button>
                <Button type="primary">M</Button>
                <Button type="primary">L</Button>
                <Button type="primary">K</Button>
                <Button type="primary">F</Button>
                <Button type="primary">E</Button>
                <Button type="primary">S</Button>
                <Button type="primary">M</Button>
                <Button type="primary">L</Button>
                <Button type="primary">K</Button>
                <Button type="primary">F</Button>
                <Button type="primary">E</Button>
              </Space>
            </Collapse.Panel>
          </Collapse>
        )}
      </Drawer>
    </>
  )
}
