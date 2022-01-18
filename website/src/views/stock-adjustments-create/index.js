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
  Divider,
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

export default function CreateReport() {
  const history = useHistory()
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
  console.log(dataModal)
  const [allBranch, setAllBranch] = useState([])
  const [users, setUsers] = useState([])
  const [listProduct, setListProduct] = useState([])

  const _getProducts = async (params) => {
    try {
      setLoadingProduct(true)
      const res = await getProducts(params)
      console.log(res.data.data)
      if (res.status === 200) {
        setDataProducts(res.data.data)
        setCountOrder(res.data.count)

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
      if (res.status === 200) setUsers(res.data.data)
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const productsSearch = [
    {
      title: 'test',
      name: 'test',
      price: 20000,
      image: [
        'https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/09/02/95131dfc-bf13-4c49-82f3-6c7c43a7354d_logo_quantribanhang 1.png',
      ],
    },
  ]

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
      dataIndex: 'name',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Tồn chi nhánh',
      dataIndex: 'quantity',
    },
    {
      title: 'Số lượng thực tế',
      dataIndex: 'real_quantity',
    },
  ]

  const columnsModal = [
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

  useEffect(() => {
    _getProducts()
    _getAllBranch()
    _getUsers()
  }, [])

  return (
    <div className="card">
      <Form layout="vertical" form={form}>
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
          <Button style={{ minWidth: 100 }} size="large" type="primary">
            {location.state ? 'Lưu' : 'Tạo phiếu kiểm hàng'}
          </Button>
        </TitlePage>

        <Row>
          <h3>Thông tin phiếu kiểm hàng</h3>
        </Row>
        <Row gutter={16} className={styles['space-row']}>
          <Col span={6}>
            <p>Chi nhánh phiếu kiểm</p>
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
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
          </Col>
          <Col span={6}>
            <p>Nhân viên kiểm</p>
            <Select
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
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
          </Col>
          <Col span={6}>
            <p>Ghi chú</p>
            <TextArea rows={1} style={{ maxWidth: '100%' }} />
          </Col>
          <Col span={6}>
            <p>Tag</p>
            <Input style={{ maxWidth: '100%' }} />
          </Col>
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
                // onChange={(value) => console.log(value)}
                placeholder="Thêm sản phẩm vào hoá đơn"
                dropdownRender={(menu) => <div>{menu}</div>}
              >
                {dataProducts.map((data, index) =>
                  data.variants &&
                  data.variants.map((variant, index) =>
                    <Select.Option value={variant.title} key={variant.title + index + ''} >
                      <Row
                        align="middle"
                        wrap={false}
                        style={{ padding: '7px 13px' }}
                        onClick={(e) => {
                          e.stopPropagation()
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
                  )
                )}
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
            sticky
            pagination={false}
            columns={columns}
            size="small"
            // dataSource={[...orderCreate.order_details]}
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
      </Form >
      <Modal
        title="Chọn nhiều sản phẩm"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
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
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRowKeys, selectedRows)
            },
            getCheckboxProps: (record) => ({
              title: record.title,
            }),
          }}
          loading={loading}
          size="small"
          dataSource={dataModal}
          columns={columnsModal}
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
