import React, { useEffect, useState, useRef } from 'react'

//antd
import { Drawer, Row, Button, Input, Checkbox, Space, Spin } from 'antd'

//icons
import { UnorderedListOutlined } from '@ant-design/icons'

//apis
import { apiAllCategorySearch } from 'apis/category'

export default function FilterProductsByCategory() {
  const typingTimeoutRef = useRef(null)

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

  const onSearch = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) _getCategories({ name: value })
      else _getCategories()
    }, 750)
  }

  useEffect(() => {
    _getCategories()
  }, [])

  return (
    <>
      <UnorderedListOutlined style={{ cursor: 'pointer' }} onClick={toggle} />
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
        <Input placeholder="Tìm kiếm danh mục" onChange={onSearch} />

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
          <Space direction="vertical" style={{ marginTop: 20 }}>
            {categories.map((category) => (
              <Checkbox style={{ marginLeft: 0 }}>{category.name}</Checkbox>
            ))}
          </Space>
        )}
      </Drawer>
    </>
  )
}
