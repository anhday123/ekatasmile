import {
  Select,
  Row,
  Col,
  notification,
  Button,
  Input,
  Form,
  InputNumber,
  Checkbox,
  Radio,
  Space,
} from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './../add/add.module.scss'
import { addPromotion } from '../../../../apis/promotion'
import { getAllStore } from 'apis/store'
import { removeAccents } from 'utils'
const { Option } = Select

export default function PromotionAdd(props) {
  const [storeList, setStoreList] = useState([])
  const [showVoucher, setShowVoucher] = useState('show')
  const [promotionCode, setPromotionCode] = useState('')
  const [form] = Form.useForm()
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm khuyến mãi thành công.',
    })
  }
  const onFinish = async (values) => {
    try {
      const obj = {
        name: values.name,
        promotion_code: values.promotion_code,
        type: values.type ? values.type : 'percent',
        value: values.value,
        has_voucher: showVoucher === 'show',
        limit: {
          amount: values.amount ? parseInt(values.amount) : 0,
          stores: values.store ? values.store : [],
        },
        description: values.description || ' ',
      }
      const res = await addPromotion(obj)
      if (res.status === 200) {
        openNotification()
        props.reload()
        props.close()
        form.setFieldsValue({
          name: '',
          promotion_code: '',
          type: 'value',
          value: '',
          amount: '',
          store: [],
          description: '',
          low: '',
          hight: '',
        })
      } else throw res
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại!',
        description: e.data && e.data.message,
      })
    }
  }

  const generateCode = (value) => {
    let tmp = value.toUpperCase()
    tmp = tmp.replace(/\s/g, '')
    tmp = removeAccents(tmp)
    return tmp
  }

  const selectAllStore = (value) => {
    value
      ? form.setFieldsValue({
          store: storeList.map((e) => {
            return e.store_id
          }),
        })
      : form.setFieldsValue({ store: [] })
  }

  useEffect(() => {
    const getBranch = async (params) => {
      try {
        const res = await getAllStore(params)
        if (res.status === 200) {
          setStoreList(res.data.data.filter((e) => e.active))
        } else {
          throw res
        }
      } catch (e) {
        console.log(e)
      }
    }
    getBranch()
  }, [])
  return (
    <>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={30}>
          <Col span={12}>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>
                Tên chương trình khuyến mãi{' '}
                <span style={{ color: 'red' }}>*</span>
              </div>
              <Form.Item name="name">
                <Input
                  placeholder="Nhập tên chương trình khuyến mãi"
                  size="large"
                  onChange={(e) => {
                    form.setFieldsValue({
                      promotion_code: generateCode(e.target.value),
                    })
                  }}
                />
              </Form.Item>
              <div className={styles['promotion-add__title']}>
                Mã chương trình khuyến mãi{' '}
                <span style={{ color: 'red' }}>*</span>
              </div>
              <Form.Item name="promotion_code">
                <Input
                  placeholder="Nhập mã chương trình khuyến mãi"
                  size="large"
                />
              </Form.Item>
              <Radio.Group
                value={showVoucher}
                onChange={(e) => setShowVoucher(e.target.value)}
                size="large"
                style={{ marginBottom: '10px' }}
              >
                <Radio value="show">
                  <span style={{ fontSize: 16 }}>Giảm giá theo Voucher</span>
                </Radio>
                <Radio value="hidden">
                  <span style={{ fontSize: 16 }}>Giảm giá tự động</span>
                </Radio>
              </Radio.Group>
              {showVoucher == 'show' ? (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    Số lượng voucher <span style={{ color: 'red' }}>*</span>
                  </div>
                  <Form.Item name="amount">
                    <InputNumber
                      placeholder="Nhập số lượng voucher"
                      size="large"
                      style={{ width: '100%', borderRadius: '15px' }}
                    />
                  </Form.Item>
                </>
              ) : (
                ''
              )}

              <div style={{ marginBottom: '10px' }}>
                Cửa hàng <span style={{ color: 'red' }}>*</span>
              </div>
              <Form.Item name="store">
                <Select
                  placeholder="Chọn cửa hàng"
                  mode="multiple"
                  size="large"
                  style={{ width: '100%' }}
                >
                  {storeList.map((e) => (
                    <Option value={e.store_id}>{e.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Checkbox onChange={(e) => selectAllStore(e.target.checked)}>
                Chọn tất cả cửa hàng
              </Checkbox>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>
                Tùy chọn khuyến mãi
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    initialValue="value"
                    label="Loại khuyến mãi"
                  >
                    <Select placeholder="Loại khuyến mãi" size="large">
                      <Option value="value">Giá trị</Option>
                      <Option value="percent">Phần trăm</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="value" label="Giá trị khuyến mãi">
                    <InputNumber
                      placeholder="Giá trị Khuyến mãi"
                      size="large"
                      style={{ width: '100%', borderRadius: '15px' }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ margin: '1rem 0 0' }} gutter={20}>
                <Col span={12}>
                  <Form.Item name="low" label="Hạn mức áp dụng">
                    <InputNumber
                      style={{ width: '100%', borderRadius: 15 }}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hight" label="Giới hạn khuyến mãi">
                    <InputNumber
                      style={{ width: '100%', borderRadius: 15 }}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>Mô tả</div>
              <Form.Item name="description" style={{ marginBottom: 0 }}>
                <Input.TextArea style={{ height: 100, margin: '15px 0' }} />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <div className={styles['promotion_add_button']}>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: 120 }}
            >
              Tạo
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}
