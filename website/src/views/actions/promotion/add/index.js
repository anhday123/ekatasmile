import { Link, useHistory } from 'react-router-dom'
import {
  Select,
  Row,
  Col,
  notification,
  Button,
  Popover,
  Modal,
  Input,
  DatePicker,
  Table,
  Form,
  InputNumber,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import styles from './../add/add.module.scss'
import { getAllBranch } from '../../../../apis/branch'
import { addPromotion } from '../../../../apis/promotion'
import { ROUTES } from 'consts'

const { Option } = Select
const provinceData = ['Zhejiang', 'Jiangsu']
const cityData = {
  Zhejiang: ['Chương trình khuyến mãi (CTKM)', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
}

const provinceDataPercent = ['Zhejiang', 'Jiangsu']
const cityDataPercent = {
  Zhejiang: ['Theo phần trăm', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
}

const { Search } = Input
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  })
}

export default function PromotionAdd(props) {
  let history = useHistory()
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [value, setValue] = useState(1)
  const [branchList, setBranchList] = useState([])

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
        type: values.type ? value.type : 'percent',
        value: values.value,
        limit: {
          amount: parseInt(values.amount),
          branchs: values.branch ? values.branch : ['1'],
        },
      }
      const res = await addPromotion(obj)
      if (res.status === 200) {
        openNotification()
        props.close()
      } else throw res
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại!',
        description: e.data && e.data.message,
      })
    }
  }

  const content = (
    <div>
      <p>Gợi ý 1</p>
      <p>Gợi ý 2</p>
    </div>
  )
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const getBranch = async (params) => {
    try {
      const res = await getAllBranch(params)
      if (res.status === 200) {
        setBranchList(res.data.data.filter((e) => e.active))
      } else {
        throw res
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getBranch()
  }, [])
  return (
    <>
      <div className={styles['promotion_add']}>
        <Form
          className={styles['promotion_add_form_parent']}
          onFinish={onFinish}
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
                        Chi nhánh
                      </div>
                      <div
                        className={
                          styles['promotion_add_option_col_left_percent']
                        }
                      >
                        <Form.Item
                          name="branch"
                          noStyle
                          rules={[{ required: true, message: 'Giá trị rỗng' }]}
                        >
                          <Select
                            size="large"
                            mode="multiple"
                            className={
                              styles['promotion_add_form_left_select_child']
                            }
                            placeholder="Chọn chi nhánh"
                          >
                            {branchList.map((e) => (
                              <Option value={e.branch_id}>{e.name}</Option>
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
                <Input.TextArea
                  style={{ width: '100%', height: '100%' }}
                  rows={4}
                  placeholder="Nhập mô tả"
                />
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

        <Modal
          title="Danh sách khách hàng"
          centered
          footer={null}
          width={1000}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Popover placement="bottomLeft" trigger="click" content={content}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Search
                  placeholder="Tìm kiếm khách hàng"
                  onSearch={onSearchCustomerChoose}
                  enterButton
                />
              </div>
            </Popover>
            <div
              style={{
                marginTop: '1rem',
                border: '1px solid rgb(209, 191, 191)',
                width: '100%',
                maxWidth: '100%',
                overflow: 'auto',
              }}
            >
              {' '}
              <Table
                scroll={{ y: 500 }}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
              />
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '1rem',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div onClick={() => modal2VisibleModal(false)}>
                <Button type="primary" style={{ width: '7.5rem' }}>
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
