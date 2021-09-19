import { Row, Col } from 'antd'
import { formatCash } from 'utils'
export default function SearchProductItem(props) {
  return (
    <Row>
      <Col span={4}>
        <img src={props.image} width="60" />
      </Col>
      <Col span={20}>
        <Row justify="space-between">
          <Col>{props.name}</Col>
          <Col>{formatCash(props.sale_price)}</Col>
        </Row>
        <Row justify="space-between">
          <Col span={11}>RXS56 - Trắng</Col>
          <Col span={11}>
            <Row>
              <Col>Đã bán: 50</Col>
              <Col>Có thể bán: 100</Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
