import styles from './../promotion/promotion.module.scss'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { PERMISSIONS, ROUTES } from 'consts'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

//antd
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
  Space,
} from 'antd'

//icon antd
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons'

//components
import PromotionAdd from 'views/actions/promotion/add'
import Permission from 'components/permission'
import { compare, tableSum, formatCash } from 'utils'
import TitlePage from 'components/title-page'

//api
import { getPromotions, updatePromotion, deletePromotion } from 'apis/promotion'
import { getAllBranch } from 'apis/branch'
import { getEmployees } from 'apis/employee'
import { getAllStore } from 'apis/store'

const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function Promotion() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [listPromotion, setListPromotion] = useState()
  const [listBranch, setListBranch] = useState([])
  const [listStore, setListStore] = useState([])
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [searchFilter, setSearchFilter] = useState({})
  const [userList, setUserList] = useState([])
  const [valueUserFilter, setValueUserFilter] = useState(null)
  const [dataUpdate, setDataUpdate] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()


  const onClose = () => {
    setVisible(false)
  }
  function onChange(dates, dateStrings) {
    _getPromotions({ from_date: dateStrings[0], to_date: dateStrings[1] })
  }

  function handleChange(value) {
    _getPromotions({ type: value })
  }
  function handleChangeUserFilter(value) {
    _getPromotions({ creator_id: value })
  }
  const columnsPromotion = [
    {
      title: 'Thông tin',
      width: 200,
      sorter: (a, b) => compare(a, b, 'name'),
      render: (data) => (
        <>
          <a href onClick={() => {
            setShowCreate(true)
            setDataUpdate(data)
          }}>{data.name}</a>
          {data.description && <div>Mô tả:{data.description}</div>}
        </>
      ),
    },
    {
      title: 'Loại khuyến mãi',
      dataIndex: 'type',
      width: 150,
      render(data) {
        return data == 'percent' ? 'Phần trăm' : 'Giá trị'
      },
      sorter: (a, b) => compare(a, b, 'type'),
    },
    {
      title: 'Giá trị khuyến mãi',
      dataIndex: 'value',
      width: 150,
      render(data, record) {
        if (record.type.toLowerCase() === 'value') return formatCash(data.toString()) + ' VND'
        return formatCash(data.toString()) + '%'
      },
      sorter: (a, b) => compare(a, b, 'value'),
    },
    {
      title: 'Người tạo',
      dataIndex: '_creator',
      width: 150,
      render: (text, record) => `${text.first_name} ${text.last_name}`,
      sorter: (a, b) =>
        (a._creator && a._creator.first_name + ' ' + a._creator.last_name).length -
        (b._creator && b._creator.first_name + ' ' + b._creator.last_name).length,
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
      title: 'Chi nhánh áp dụng',
      dataIndex: 'limit',
      width: 150,
      sorter: (a, b) => compare(a, b, 'description'),
      render: (data) => {
        return data.stores
          .map((e) => {
            return listBranch.find((s) => s.branch_id === e)
              ? listBranch.find((s) => s.branch_id === e)['name']
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
          <Space size='middle'>
            <Switch checked={data} onChange={(e) => onFinish(record.promotion_id, { active: e })} />
            <Popconfirm
              onConfirm={() => _deletePromotion(record.promotion_id)}
              title="Bạn có muốn xóa sản phẩm này không?"
              okText="Đồng ý"
              cancelText="Từ chối"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
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
        _getPromotions()
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

  const _deletePromotion = async (value) => {
    try {
      const res = await deletePromotion({ promotion_id: value })
      if (res.status === 200) {
        if (res.data.success) {
          _getPromotions()
          notification.success({ message: 'Xoá sản phẩm thành công!' })
        } else
          notification.error({
            message: res.data.message || 'Xoá sản phẩm thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xoá sản phẩm thất bại, vui lòng thử lại!',
        })
    }
    catch (err) {
      console.log(err)
    }
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

  const _getUserList = async () => {
    try {
      const res = await getEmployees({ page: 1, page_size: 1000 })
      if (res.status === 200) {
        if (res.data.success) {
          setUserList(res.data.data)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const _getPromotions = async (params) => {
    try {
      setLoading(true)
      const res = await getPromotions({ ...params, ...pagination, _creator: true })
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
    setSearchFilter({})
  }
  useEffect(() => {
    getBranch()
    getStore()
    _getUserList()
  }, [])

  useEffect(() => {
    let tmp = { ...searchFilter }
    delete tmp['date']
    _getPromotions(tmp)
  }, [searchFilter, pagination])
  return (
    <>
      <div className="card">
        <TitlePage
          title={
            <Row
              onClick={() => history.push(ROUTES.CONFIGURATION_STORE)}
              wrap={false}
              align="middle"
              style={{ cursor: 'pointer' }}
            >
              <ArrowLeftOutlined style={{ marginRight: 8 }} />
              <div>Khuyến mãi</div>
            </Row>
          }
        >
          <Space>
            <Button type="primary" danger onClick={resetFilter} size="large"
              style={{ display: Object.keys(searchFilter).length == 0 && 'none' }}>
              Xóa bộ lọc
            </Button>
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
          </Space>
        </TitlePage>
        <Row
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: 5,
            marginBottom: 10,
            marginTop: 20,
          }}
        >
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Input
              style={{ width: '100%' }}
              placeholder="Tìm kiếm khuyến mãi"
              bordered={false}
              onChange={(e) => {
                setSearchFilter({ ...searchFilter, search: e.target.value })
              }}
              allowClear
              value={searchFilter.search}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={6}
            lg={6}
            xl={6}
            style={{ borderLeft: '1px solid #d9d9d9', borderRight: '1px solid #d9d9d9' }}
          >
            <RangePicker
              className="br-15__date-picker"
              style={{ width: '100%' }}
              bordered={false}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
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
          </Col>

          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Select
              style={{ width: '100%', borderRight: '1px solid #d9d9d9' }}
              allowClear
              bordered={false}
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
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder="Tìm kiếm theo người tạo"
              value={searchFilter.creator_id}
              bordered={false}
              onChange={(e) => {
                setSearchFilter({ ...searchFilter, creator_id: e })
                handleChangeUserFilter(e)
              }}
              showSearch
            >
              {userList.map((item) => {
                return (
                  <Option value={item.user_id}>
                    {item.first_name} {item.last_name}
                  </Option>
                )
              })}
            </Select>
          </Col>
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
                          (total, current) =>
                            total + (current.type === 'PERCENT' ? current.value : 0),
                          0
                        )}{' '}
                        %
                        <br />
                        Giá trị:{' '}
                        {formatCash(
                          pageData.reduce(
                            (total, current) =>
                              total + (current.type !== 'PERCENT' ? current.value : 0),
                            0
                          )
                        )}{' '}
                        VND
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>{formatCash(tableSum(pageData, 'limit.amount'))}</Text>
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
        {/* {selectedRowKeys && selectedRowKeys.length > 0 ? ( */}
        {/* ) : (
          ''
        )} */}
      </div>

      <Drawer
        title="Chỉnh sửa chương trình khuyến mãi"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form className={styles['promotion_add_form_parent']} onFinish={onFinish} form={form}>
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
                  <Input placeholder="Nhập tên chương trình khuyến mãi" disabled />
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
                        className={styles['promotion_add_option_col_left_title']}
                      >
                        Loại khuyến mãi
                      </div>
                      <div className={styles['promotion_add_option_col_left_percent']}>
                        <Form.Item
                          name="type"
                          noStyle
                          rules={[{ required: true, message: 'Giá trị rỗng' }]}
                        >
                          <Select
                            className={styles['promotion_add_form_left_select_child']}
                            placeholder="Theo phần trăm"
                          >
                            <Option value="percent">Phần trăm</Option>
                            <Option value="value">Giá trị</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className={styles['promotion_add_name_col_child_title']}
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
                        className={styles['promotion_add_option_col_left_title_left']}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        Giá trị khuyến mãi
                      </div>
                      <div className={styles['promotion_add_option_col_left_percent']}>
                        <Form.Item
                          className={styles['promotion_add_name_col_child_title']}
                          // label="Username"
                          name="value"
                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                        >
                          <InputNumber
                            placeholder="Nhập giá trị"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                        className={styles['promotion_add_option_col_left_title']}
                      >
                        Vourcher
                      </div>
                      <div className={styles['promotion_add_option_col_left_percent']}>
                        <Form.Item
                          className={styles['promotion_add_name_col_child_title']}
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
                        className={styles['promotion_add_option_col_left_title_left_fix']}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        Chi nhánh
                      </div>
                      <div className={styles['promotion_add_option_col_left_percent']}>
                        <Form.Item
                          name="branch"
                          noStyle
                          rules={[{ required: true, message: 'Giá trị rỗng' }]}
                        >
                          <Select
                            mode="multiple"
                            className={styles['promotion_add_form_left_select_child']}
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
              <div className={styles['promotion_add_form_left_title']}>Mô tả</div>
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
              <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
      <Drawer
        visible={showCreate}
        onClose={() => {
          setShowCreate(false)
          setDataUpdate([])
        }}
        title={dataUpdate.length === 0 ? "Thêm khuyến mãi" : "Chỉnh sửa khuyến mãi"}
        width="75%"
      >
        <PromotionAdd state={dataUpdate} close={() => {
          setShowCreate(false)
        }} reload={_getPromotions} show={showCreate} />
      </Drawer>
    </>
  )
}
