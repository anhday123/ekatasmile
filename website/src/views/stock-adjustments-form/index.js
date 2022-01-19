import React, { useEffect, useState } from 'react'
import styles from './stock-adjustments-create.module.scss'

import { useHistory, Link, useLocation } from 'react-router-dom'
import { ROUTES, PERMISSIONS, IMAGE_DEFAULT, ACTION } from 'consts'
import { formatCash } from 'utils'
import moment from 'moment'
import noData from 'assets/icons/no-data.png'
import { useDispatch, useSelector } from 'react-redux'

//components
import TitlePage from 'components/title-page'

//antd
import {
  Row,
  Col,
  message,
  Input,
  Button,
  Table,
  InputNumber,
  Form,
  Select,
  Radio,
  Spin,
  Tooltip,
  Space,
  Affix,
  DatePicker,
  Upload,
  Modal,
  notification,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  CloseOutlined,
  InfoCircleTwoTone,
  SearchOutlined,
  PlusSquareOutlined,
  CreditCardFilled,
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

//apis
import { getProducts } from 'apis/product'
import { getAllBranch } from 'apis/branch'
import { getUsers } from 'apis/users'
import { createCheckInventoryNote, updateCheckInventoryNote } from 'apis/inventory'

export default function CreateReport() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const location = useLocation()
  const { Option } = Select
  const { TextArea, Search } = Input

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [countOrder, setCountOrder] = useState(0)

  const [loadingProduct, setLoadingProduct] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [dataProducts, setDataProducts] = useState([])
  const [dataModal, setDataModal] = useState([])
  const [allBranch, setAllBranch] = useState([])
  const [users, setUsers] = useState([])
  const [listProduct, setListProduct] = useState([])

  const [realQuantity, setRealQuantity] = useState(0)
  console.log(listProduct)

  const getDataToCreate = (data, variant) => {
    const body = {
      variant_id: variant.variant_id,
      sku: variant.sku,
      title: variant.title,
      unit: data.unit,
      total_quantity: variant.total_quantity,
      real_quantity: realQuantity
    }
    setListProduct([...listProduct, body])
  }

  const _setRealQuantity = (index, value) => {
    listProduct[index].real_quantity = value
  }

  const _createCheckInventoryNote = async () => {
    try {
      dispatch({ type: 'LOADING', data: true })
      await form.validateFields()
      const dataForm = form.getFieldsValue()
      const body = {
        ...dataForm,
        products: listProduct
      }
      let res
      if (!location.state) res = await createCheckInventoryNote(body)
      else res = await updateCheckInventoryNote(body, location.state.inventory_note_id)
      console.log(res)

      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: `${location.state ? 'Cập nhật' : 'Thêm'} phiếu kiểm hàng thành công` })
        } else
          notification.error({
            message:
              res.data.message ||
              `${location.state ? 'Cập nhật' : 'Thêm'} phiếu kiểm hàng thất bại, vui lòng thử lại!`,
          })
      } else
        notification.error({
          message:
            res.data.message ||
            `${location.state ? 'Cập nhật' : 'Thêm'} phiếu kiểm hàng thất bại, vui lòng thử lại!`,
        })

      dispatch({ type: 'LOADING', data: false })
    }
    catch (err) {
      console.log(err)
      dispatch({ type: 'LOADING', data: false })
    }
  }

  const _getProducts = async (params) => {
    try {
      setLoadingProduct(true)
      const res = await getProducts(params)
      if (res.status === 200) {
        setCountOrder(res.data.count)
        setDataProducts(res.data.data)

        let dataNew = []
        res.data.data.map(item => item.variants.map(e => dataNew.push(e)))
        setDataModal(dataNew)
      }
      setLoadingProduct(false)
    } catch (err) {
      console.log(err)
      setLoadingProduct(false)
    }
  }

  const _getAllBranch = async (query) => {
    try {
      setLoading(true)
      const res = await getAllBranch(query)
      if (res.status === 200) setAllBranch(res.data.data)
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const _getUsers = async (query) => {
    try {
      setLoading(true)
      const res = await getUsers(query)
      if (res.status === 200) {
        setUsers(res.data.data)
        // if (location.state) {
        //   let cloneUser = []
        //   res.data.data.map(user => user.)
        // }
      }
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
    },
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Tồn chi nhánh',
      dataIndex: 'total_quantity',
    },
    {
      title: 'Số lượng thực tế',
      dataIndex: 'real_quantity',
    },
  ]

  const columnsModal = [
    {
      dataIndex: 'variant_id',
      width: 0
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 100,
      render: (text, record) => <img style={{ width: '50%', display: 'block' }} src={text} alt='' />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
    },
  ]

  const onOkayModal = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    _getProducts()
    _getAllBranch()
    _getUsers()
  }, [listProduct, realQuantity])

  useEffect(() => {
    if (location.state) {
      console.log(location.state)
      form.setFieldsValue({
        ...location.state,
        note_creator_id: location.state.creator,
      })
      setListProduct(location.state.products)
    } else {
      form.resetFields()
      setListProduct([])
    }
  }, [form, location.state])


  return (
    <div className="card">
      <Form layout="vertical" form={form} onFinish={_createCheckInventoryNote}>
        <TitlePage
          isAffix={true}
          title={
            <Link to={ROUTES.STOCK_ADJUSTMENTS}>
              <Row
                align="middle"
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontWeight: 600,
                  width: 'max-content',
                }}
              >
                <ArrowLeftOutlined style={{ marginRight: 5 }} />
                {location.state ? 'Cập nhật' : 'Tạo'} phiếu kiểm hàng
              </Row>
            </Link>
          }
        >
          <Button style={{ minWidth: 100 }} size="large" type="primary" htmlType="submit">
            {location.state ? 'Lưu' : 'Tạo phiếu kiểm hàng'}
          </Button>
        </TitlePage>

        <Row>
          <h3>Thông tin phiếu kiểm hàng</h3>
        </Row>
        <Row gutter={16} className={styles['space-row']}>
          <Col span={6}>
            <Form.Item
              label="Chi nhánh phiếu kiểm"
              name="branch_id"
              rules={[{ required: true, message: 'Vui lòng chọn chi nhánh phiếu kiểm!' }]}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn chi nhánh"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {
                  allBranch.map((branch, index) =>
                    <Option key={index} value={branch.branch_id}>{branch.name}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Nhân viên kiểm"
              name="inventorier_id"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên kiểm!' }]}
            >
              <Select
                allowClear
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn nhân viên"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {
                  users.map((user, index) =>
                    <Option key={index} value={user.user_id}>{user.username}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ghi chú"
              name="note"
            >
              <TextArea rows={1} style={{ maxWidth: '100%' }} />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              label="Tag"
              name="tag"
            >
              <Input style={{ maxWidth: '100%' }} />
            </Form.Item>
          </Col> */}
        </Row>

        <div>
          <h3>Danh sách sản phẩm</h3>
          <Row>
            <Col span={6}>
              <Button style={{ width: '90%' }} type="primary">
                Thêm nhóm hàng
              </Button>
            </Col>
            <Col span={14}>
              <Select
                notFoundContent={loadingProduct ? <Spin size="small" /> : null}
                dropdownClassName="dropdown-select-search-product"
                allowClear
                showSearch
                clearIcon={<CloseOutlined style={{ color: 'black' }} />}
                suffixIcon={<SearchOutlined style={{ color: 'black', fontSize: 15 }} />}
                style={{ width: '95%', marginBottom: 15 }}
                placeholder="Thêm sản phẩm vào hoá đơn"
                dropdownRender={(menu) => <div>{menu}</div>}
              >
                {dataProducts.map((data) =>
                  data.variants && data.variants.map((variant, index) =>
                    <Select.Option value={variant.title} key={variant.variant_id} >
                      <Row
                        key={index}
                        align="middle"
                        wrap={false}
                        style={{ padding: '7px 13px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          const findProduct = listProduct.find(
                            (item) => item.variant_id === variant.variant_id
                          )
                          if (findProduct) {
                            notification.error({ message: 'Chỉ được chọn sản phẩm khác phân loại' })
                            return
                          }
                          getDataToCreate(data, variant, index)
                          // console.log([...body])
                        }}
                      >
                        <img
                          src={variant.image[0] ? variant.image[0] : IMAGE_DEFAULT}
                          alt={variant.title}
                          style={{
                            minWidth: 40,
                            minHeight: 40,
                            maxWidth: 40,
                            maxHeight: 40,
                            objectFit: 'cover',
                          }}
                        />

                        <div style={{ width: '100%', marginLeft: 15 }}>
                          <Row wrap={false} justify="space-between">
                            <span
                              style={{
                                maxWidth: 200,
                                marginBottom: 0,
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                display: '-webkit-box',
                              }}
                            >
                              {variant.title}
                            </span>
                            <p style={{ marginBottom: 0, fontWeight: 500 }}>
                              {formatCash(variant.price)}
                            </p>
                          </Row>
                        </div>
                      </Row>
                    </Select.Option>
                  ))
                }
              </Select>
            </Col>

            <Col span={4}>
              <Button
                onClick={() => setIsModalVisible(true)}
                style={{ width: '100%' }}
                type="primary"
              >
                Chọn nhiều
              </Button>
            </Col>
          </Row>
          <Table
            scroll={{ y: 400 }}
            // sticky
            pagination={false}
            columns={
              columns.map(column => {
                if (column.dataIndex === 'stt')
                  return {
                    ...column,
                    width: 50,
                    render: (text, record, index) =>
                      (paramsFilter.page - 1) * paramsFilter.page_size + index + 1
                  }
                if (column.dataIndex === 'sku')
                  return {
                    ...column,
                    render: (text, record) => record.sku
                  }
                if (column.dataIndex === 'title')
                  return {
                    ...column,
                    render: (text, record) => record.title
                  }
                if (column.dataIndex === 'unit')
                  return {
                    ...column,
                    render: (text, record) => {
                      return record.unit
                    }
                  }
                if (column.dataIndex === 'total_quantity')
                  return {
                    ...column,
                    render: (text, record) => record.total_quantity
                  }
                if (column.dataIndex === 'real_quantity')
                  return {
                    ...column,
                    render: (text, record, index) => <InputNumber min={0} defaultValue='0' onChange={e => _setRealQuantity(index, e)} />
                  }
                return column
              })
            }
            size="small"
            dataSource={listProduct}
            locale={{
              emptyText: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  }}
                >
                  <img src={noData} alt="" style={{ width: 90, height: 90 }} />
                  <h4 style={{ fontSize: 15, color: '#555' }}>Trống</h4>
                </div>
              ),
            }}
          />
        </div>
      </Form>
      <Modal
        title="Chọn nhiều sản phẩm"
        visible={isModalVisible}
        onOk={onOkayModal}
        okText="Thêm vào đơn"
        onCancel={() => setIsModalVisible(false)}
        width={'50%'}
      >
        <Search
          placeholder="input search text"
          allowClear
          // onSearch={onSearch}
          style={{ width: '100%' }}
        />
        <Table
          rowKey='variant_id'
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRowKeys, selectedRows)
              selectedRows.length !== 0 && setListProduct(selectedRows)

            },
            getCheckboxProps: (record) => ({
              title: record.title,
            }),
          }}
          loading={loading}
          size="small"
          dataSource={dataModal}
          columns={
            columnsModal.map(column => {
              if (column.dataIndex === 'variant_id')
                return {
                  ...column,
                  render: (text, record) => <span style={{ display: 'none' }}>{record.variant_id}</span>,
                }
              return column
            })
          }
          style={{ width: '100%', marginTop: 10 }}
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              paramsFilter.page = page
              paramsFilter.page_size = pageSize
              setParamsFilter({ ...paramsFilter })
            },
            total: countOrder,
          }}
        />
      </Modal>
    </div >
  )
}
