import styles from './point.module.scss'
import {
  Row,
  Col,
  Select,
  Checkbox,
  Radio,
  InputNumber,
  Button,
  Space,
} from 'antd'

export default function Point() {
  const PointTitle = ({ title }) => (
    <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
      <Col>
        <Row align="middle" style={{ fontSize: 18, fontWeight: 600 }}>
          {title}
        </Row>
      </Col>
    </Row>
  )
  return (
    <div className={styles['point']}>
      <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
        <Col>
          <Row align="middle" style={{ fontSize: 20, fontWeight: 600 }}>
            Cấu hình tích điểm
          </Row>
        </Col>
      </Row>
      <Row style={{ margin: '1em 0' }}>
        <Select placeholder="Chọn chi nhánh" size="large"></Select>
      </Row>
      <Row style={{ margin: '1em 0' }}>
        <Checkbox>Áp dụng cho tất cả chi nhánh</Checkbox>
      </Row>
      <Row gutter={30} style={{ margin: '1em 0' }}>
        <Col xs={24} lg={12}>
          <div className={styles['setting-box']}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập tích điểm" />
              <Checkbox>
                <span style={{ fontWeight: 500, color: 'blue' }}>
                  Áp dụng tính năng tích điểm
                </span>
              </Checkbox>
              <div>
                <b>Cơ chế tích điểm</b>
              </div>
              <Checkbox>Tích điểm cho toàn bộ sản phẩm</Checkbox>
              <div>
                <b>Hình thức tích điểm</b>
              </div>
              <Radio.Group>
                <Radio>Tích điểm cố định</Radio>
              </Radio.Group>
              <div>
                <b>Tỷ lệ quy đổi điểm</b>
              </div>
              <div>
                <InputNumber /> = 1 điểm
              </div>
            </Space>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className={styles['setting-box']}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập đổi điểm" />
              <Checkbox>
                <span style={{ fontWeight: 500, color: 'blue' }}>
                  Áp dụng tính năng tích điểm
                </span>
              </Checkbox>
              <div>
                <b>Thanh toán</b>
              </div>
              <div>Tỷ lệ quy đổi điểm ra tiền</div>
              <div>
                1 điểm = <InputNumber />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
      <Row justify="end">
        <Button type="primary" size="large" style={{ width: 100 }}>
          Lưu
        </Button>
      </Row>
    </div>
  )
}
