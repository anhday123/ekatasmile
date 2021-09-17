import styles from './../promotion/promotion.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Popconfirm,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  notification,
  Drawer,
  Form,
  InputNumber,
  Switch,
  Typography,
} from 'antd'
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getPromoton, updatePromotion } from '../../apis/promotion'
import { getAllBranch } from '../../apis/branch'
import { useDispatch } from 'react-redux'
import { PERMISSIONS } from 'consts'
import PromotionAdd from 'views/actions/promotion/add'
import Permission from 'components/permission'
import { compare, tableSum } from 'utils'
import { getAllStore } from 'apis/store'
const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
export default function Promotion() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [listPromotion, setListPromotion] = useState()
  const [listBranch, setListBranch] = useState([])
  const [listStore, setListStore] = useState([])
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [searchFilter, setSearchFilter] = useState({
    search: '',
    date: [],
    type: undefined,
  })
  const dispatch = useDispatch()

  const onClose = () => {
    setVisible(false)
  }
  function onChange(dates, dateStrings) {
    getPromotions({ from_date: dateStrings[0], to_date: dateStrings[1] })
  }

  function handleChange(value) {
    getPromotions({ type: value })
  }
  const columnsPromotion = [
    {
      title: 'Thông tin',
      width: 200,
      sorter: (a, b) => compare(a, b, 'name'),
      render: (data) => (
        <>
          <div>{data.name}</div>
          <div>Mô tả:{data.description}</div>
        </>
      ),
    },
    {
      title: 'Loại khuyến mãi',
      dataIndex: 'type',
      width: 150,
      render(data) {
        return data == 'percent' ? 'Phần trăm' : 'Gía trị'
      },
      sorter: (a, b) => compare(a, b, 'type'),
    },
    {
      title: 'Giá trị khuyến mãi',
      dataIndex: 'value',
      width: 150,
      render(data, record) {
        if (record.type === 'value') return formatCash(data.toString()) + ' VND'
        return formatCash(data.toString()) + '%'
      },
      sorter: (a, b) => compare(a, b, 'value'),
    },
    {
      title: 'Số lượng khuyến mãi',
      dataIndex: 'limit',
      width: 150,
      render(data) {
        return data.amount
      },
      sorter: (a, b) => compare(a, b, 'limit'),
    },
    {
      title: 'Cửa hàng áp dụng',
      dataIndex: 'limit',
      width: 150,
      sorter: (a, b) => compare(a, b, 'description'),
      render: (data) => {
        return data.stores
          .map((e) => {
            return listStore.find((s) => s.store_id === e)
              ? listStore.find((s) => s.store_id === e)['name']
              : undefined
          })
          .join(', ')
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 100,
      render(data, record) {
        return (
          <Switch
            checked={data}
            onChange={(e) => onFinish(record.promotion_id, { active: e })}
          />
        )
      },
    },
  ]

  const openNotification = (e) => {
    notification.success({
      message: 'Thành công',
      description: e
        ? 'Kích hoạt chương trình khuyến mãi thành công.'
        : 'Vô hiệu hóa chương trình khuyến mãi thành công.',
    })
  }

  const onFinish = async (id, values) => {
    try {
      dispatch({ type: 'LOADING', data: true })

      const res = await updatePromotion(id, values)
      if (res.status == 200) {
        openNotification(values.active)
        onClose()
        form.resetFields()
        getPromotions()
      } else throw res
      dispatch({ type: 'LOADING', data: false })
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại!',
        description: 'Cập nhật khuyến mãi thất bại',
      })
      dispatch({ type: 'LOADING', data: false })
    }
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  const getStore = async (params) => {
    try {
      const res = await getAllStore(params)
      if (res.data.success) {
        setListStore(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const getPromotions = async (params) => {
    try {
      setLoading(true)
      const res = await getPromoton({ ...params, ...pagination })
      if (res.status === 200) {
        setListPromotion(res.data.data)
      } else {
        throw res
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const getBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.status == 200) {
        setListBranch(res.data.data)
      } else {
        throw res
      }
    } catch (e) {
      console.log(e)
    }
  }
  const resetFilter = () => {
    setSearchFilter({ search: '', date: [], type: undefined })
  }
  useEffect(() => {
    getBranch()
    getStore()
  }, [])
  useEffect(() => {
    let tmp = { ...searchFilter }
    delete tmp['date']
    getPromotions(tmp)
  }, [searchFilter, pagination])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>Khuyến mãi</div>
          <div className={styles['promotion_manager_button']}>
            <Permission permissions={[PERMISSIONS.them_khuyen_mai]}>
              <Button
                icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                onClick={() => setShowCreate(true)}
                type="primary"
                size="large"
              >
                Tạo khuyến mãi
              </Button>
            </Permission>
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="Tìm kiếm khuyến mãi"
                onChange={(e) => {
                  setSearchFilter({ ...searchFilter, search: e.target.value })
                }}
                allowClear
                value={searchFilter.search}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                value={searchFilter.date}
                onChange={(a, b) => {
                  setSearchFilter({
                    ...searchFilter,
                    from_date: b[0],
                    to_date: b[1],
                    date: a,
                  })
                  onChange(a, b)
                }}
              />
            </div>
          </Col>

          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                style={{ width: '100%' }}
                allowClear
                placeholder="Lọc theo hình thức khuyến mãi"
                value={searchFilter.type}
                onChange={(e) => {
                  setSearchFilter({ ...searchFilter, type: e })
                  handleChange(e)
                }}
              >
                <Option value="percent">Phần trăm</Option>
                <Option value="value">Giá trị</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }} justify="end">
          <Button type="primary" onClick={resetFilter} size="large">
            Xóa bộ lọc
          </Button>
        </Row>
        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            size="small"
            rowKey="promotion_id"
            loading={loading}
            pagination={{ onChange: changePagi }}
            columns={columnsPromotion}
            dataSource={listPromotion}
            scroll={{ y: 500 }}
            summary={(pageData) => {
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      <Text>Tổng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        Phần trăm:{' '}
                        {pageData.reduce(
                          (a, b) => (a += b.type == 'percent' ? b.value : 0),
                          0
                        )}
                        %
                        <br />
                        Giá trị:{' '}
                        {formatCash(
                          pageData.reduce(
                            (a, b) => (a += b.type !== 'percent' ? b.value : 0),
                            0
                          )
                        )}{' '}
                        VND
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        {formatCash(tableSum(pageData, 'limit.amount'))}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </div>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                style={{
                  width: '7.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Xóa khuyến mãi
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        title="Thông tin khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      ></Modal>
      <Drawer
        title="Chỉnh sửa chương trình khuyến mãi"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
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
                  Tên chương trình khuyến mãi
                </div>
                <Form.Item
                  className={styles['promotion_add_name_col_child_title']}
                  // label="Username"
                  name="name"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input
                    placeholder="Nhập tên chương trình khuyến mãi"
                    disabled
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
                        Loại khuyến mãi
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
                            className={
                              styles['promotion_add_form_left_select_child']
                            }
                            placeholder="Theo phần trăm"
                          >
                            <Option value="percent">Phần trăm</Option>
                            <Option value="value">Giá trị</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className={
                            styles['promotion_add_name_col_child_title']
                          }
                          // label="Username"
                          name="promotion_id"
                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                        >
                          <Input hidden />
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
                        Giá trị khuyến mãi
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
                            placeholder="Nhập giá trị"
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
                        Vourcher
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
                          <Input placeholder="Nhập số lượng vourcher" />
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
                            mode="multiple"
                            className={
                              styles['promotion_add_form_left_select_child']
                            }
                            placeholder="Chọn chi nhánh"
                          >
                            {listBranch.map((e) => (
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
              <Button
                style={{ width: '7.5rem' }}
                type="primary"
                htmlType="submit"
              >
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
      <Drawer
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        title="Thêm khuyến mãi"
        width="75%"
      >
        <PromotionAdd
          close={() => setShowCreate(false)}
          reload={getPromotions}
        />
      </Drawer>
    </>
  )
}
