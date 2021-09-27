import {
  Drawer,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { addCompare } from '../../../apis/compare'
import { apiAllShipping } from '../../../apis/shipping'
import moment from 'moment'
export default function CreateCompare(props) {
  const { visible, onClose } = props
  const [transportList, setTransportList] = useState([])
  const [transport, setTransport] = useState('')
  const onFinish = async (value) => {
    try {
      const obj = {
        type: 'single',
        link: ' ',
        compares: [
          {
            ...value,
            complete_date: moment(value.complete_date).format('YYYY-MM-DD'),
            revice_date: moment(value.revice_date).format('YYYY-MM-DD'),
          },
        ],
      }
      const res = await addCompare(obj)
      if (res.data.success) {
        notification.success({ message: 'Thành công' })
        props.reload()
        onClose()
      }
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại',
        description: e.data && e.data.message,
      })
    }
  }
  const getTransport = async () => {
    try {
      const res = await apiAllShipping()
      if (res.data.success) {
        setTransportList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getTransport()
  }, [])
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={1100}
      title="Tạo đối soát"
    >
      <Form onFinish={onFinish}>
        <Row justify="space-between">
          <Col span={11}>
            <Row>
              <Col span={8}>Đơn vị vận chuyển</Col>
              <Col span={16}>
                <Form.Item name="shipping_company">
                  <Select>
                    {transportList
                      .filter((e) => e.active)
                      .map((e) => (
                        <Select.Option value={e.shipping_company_id}>
                          {e.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Mã vận đơn</Col>
              <Col span={16}>
                <Form.Item name="order">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Phí vận chuyển</Col>
              <Col span={16}>
                <Form.Item name="transfer_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Tiền COD thực nhận</Col>
              <Col span={16}>
                <Form.Item name="real_cod_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Phí giao hàng</Col>
              <Col span={16}>
                <Form.Item name="shipping_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Phí chuyển hoàn</Col>
              <Col span={16}>
                <Form.Item name="delivery_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Tiền chuyển khoản</Col>
              <Col span={16}>
                <Form.Item name="card_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Ngày nhận đơn</Col>
              <Col span={16}>
                <Form.Item name="revice_date">
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Trạng thái vận chuyển</Col>
              <Col span={16}>
                <Form.Item name="status" initialValue="PROCESSING">
                  <Select>
                    <Select.Option value="PROCESSING">Processing</Select.Option>
                    <Select.Option value="REFUN">Refun</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Ngày hoàn thành</Col>
              <Col span={16}>
                <Form.Item name="complete_date">
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Phí bảo hiểm</Col>
              <Col span={16}>
                <Form.Item name="insurance_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Khối lượng (kg)</Col>
              <Col span={16}>
                <Form.Item name="weight">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <Row>
              <Col span={8}>Phí lưu kho</Col>
              <Col span={16}>
                <Form.Item name="warehouse_cost">
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="end">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Drawer>
  )
}
