import {
  Select,
  Row,
  Col,
  notification,
  Button,
  Input,
  Form,
  InputNumber,
} from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './../add/add.module.scss'
import { getAllBranch } from '../../../../apis/branch'
import { addPromotion } from '../../../../apis/promotion'
import { getAllStore } from 'apis/store'
const { Option } = Select

export default function PromotionAdd(props) {
  const [storeList, setStoreList] = useState([])
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
        type: values.type ? values.type : 'percent',
        value: values.value,
        limit: {
          amount: parseInt(values.amount),
          stores: values.store ? values.store : ['1'],
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
          type: '',
          value: '',
          amount: '',
          store: [],
          description: '',
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
      <div className={styles['promotion_add']}>
        <Form
          className={styles['promotion_add_form_parent']}
          onFinish={onFinish}
          form={form}
        >
          <Row className={styles['promotion_add_name']}>
            <Col
              className={styles['promotion_add_name_col']}
              style={{ marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles['promotion_add_name_col_child']}>
                <div className={styles['promotion_add_form_left_title']}>
                  <span style={{ color: 'red' }}>*</span>&nbsp; Tên chương trình
                  khuyến mãi
                </div>
                <Form.Item
                  className={styles['promotion_add_name_col_child_title']}
                  // label="Username"
                  name="name"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input
                    placeholder="Nhập tên chương trình khuyến mãi"
                    size="large"
                  />
                </Form.Item>
              </div>
            </Col>

            <Col
              className={styles['promotion_add_name_col']}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles['promotion_add_name_col_child']}>
                <div className={styles['promotion_add_form_left_title_parent']}>
                  Tùy chọn khuyến mãi
                </div>
                <Row className={styles['promotion_add_option']}>
                  <Col
                    className={styles['promotion_add_option_col']}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles['promotion_add_option_col_left']}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles['promotion_add_option_col_left_title']
                        }
                      >
                        <span style={{ color: 'red' }}>*</span>&nbsp; Loại
                        khuyến mãi
                      </div>
                      <div
                        className={
                          styles['promotion_add_option_col_left_percent']
                        }
                      >
                        <Form.Item
                          name="type"
                          noStyle
                          rules={[{ required: true, message: 'Giá trị rỗng' }]}
                        >
                          <Select
                            size="large"
                            className={
                              styles['promotion_add_form_left_select_child']
                            }
                            placeholder="Loại khuyến mãi"
                          >
                            <Option value="percent">Phần trăm</Option>
                            <Option value="value">Giá trị</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col
                    className={styles['promotion_add_option_col']}
                    xs={22}
                    sm={22}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles['promotion_add_option_col_left']}>
                      <div
                        className={
                          styles['promotion_add_option_col_left_title_left']
                        }
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <span style={{ color: 'red' }}>*</span>&nbsp; Giá trị
                        khuyến mãi
                      </div>
                      <div
                        className={
                          styles['promotion_add_option_col_left_percent']
                        }
                      >
                        <Form.Item
                          className={
                            styles['promotion_add_name_col_child_title']
                          }
                          // label="Username"
                          name="value"
                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                        >
                          <InputNumber
                            size="large"
                            className="br-15__input"
                            placeholder="Nhập giá trị"
                            style={{ width: '100%' }}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row className={styles['promotion_add_name']}>
            <Col
              style={{ marginBottom: '1rem' }}
              className={styles['promotion_add_name_col']}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles['promotion_add_name_col_child']}>
                <div className={styles['promotion_add_form_left_title_parent']}>
                  Giới hạn số lượng khuyến mãi
                </div>
                <Row className={styles['promotion_add_option']}>
                  <Col
                    className={styles['promotion_add_option_col']}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className={styles['promotion_add_option_col_left']}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles['promotion_add_option_col_left_title']
                        }
                      >
                        <span style={{ color: 'red' }}>*</span>&nbsp; Vourcher
                      </div>
                      <div
                        className={
                          styles['promotion_add_option_col_left_percent']
                        }
                      >
                        <Form.Item
                          className={
                            styles['promotion_add_name_col_child_title']
                          }
                          // label="Username"
                          name="amount"
                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                        >
                          <Input
                            placeholder="Nhập số lượng vourcher"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col
                    style={{ marginBottom: '1rem' }}
                    className={styles['promotion_add_option_col']}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className={styles['promotion_add_option_col_left']}>
                      <div
                        className={
                          styles['promotion_add_option_col_left_title_left_fix']
                        }
                        style={{ marginBottom: '0.5rem' }}
                      >
                        Cửa hàng
                      </div>
                      <div
                        className={
                          styles['promotion_add_option_col_left_percent']
                        }
                      >
                        <Form.Item
                          name="store"
                          noStyle
                          rules={[{ required: true, message: 'Giá trị rỗng' }]}
                        >
                          <Select
                            size="large"
                            mode="multiple"
                            className={
                              styles['promotion_add_form_left_select_child']
                            }
                            placeholder="Chọn cửa hàng"
                          >
                            {storeList.map((e) => (
                              <Option value={e.store_id}>{e.name}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['promotion_add_form_right']}
            >
              <div className={styles['promotion_add_form_left_title']}>
                Mô tả
              </div>
              <div
                style={{ width: '100%', height: '100%' }}
                className={styles['promotion_add_form_right_content']}
              >
                <Form.Item name="description" style={{ width: '100%' }}>
                  <Input.TextArea
                    style={{ width: '100%', height: '100%' }}
                    rows={4}
                    placeholder="Nhập mô tả"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className={styles['promotion_add_button']}>
            <Form.Item>
              <Button size="large" type="primary" htmlType="submit">
                Tạo
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}
