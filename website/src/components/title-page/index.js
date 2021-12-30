import React from 'react'

import { Row } from 'antd'

export default function TitlePage({ children, title = '' }) {
  return (
    <Row
      wrap={false}
      align="middle"
      justify="space-between"
      style={{ borderBottom: '1px solid rgb(235, 223, 223)', paddingBottom: '1rem' }}
    >
      <h3 style={{ fontSize: 19, marginBottom: 0 }}>{title}</h3>
      {children}
    </Row>
  )
}
