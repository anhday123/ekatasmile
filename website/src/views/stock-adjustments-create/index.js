import React, { useEffect, useState } from 'react'
import styles from './stock-adjustments-create.module.scss'

import { useHistory, Link, useLocation } from 'react-router-dom'
import { ROUTES, PERMISSIONS, IMAGE_DEFAULT, ACTION } from 'consts'
import { formatCash } from 'utils'
import moment from 'moment'
import noData from 'assets/icons/no-data.png'
import { useDispatch, useSelector } from 'react-redux'

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

export default function CreateReport() {
  const history = useHistory()
  const [form] = Form.useForm()
  const location = useLocation()
  const { Option } = Select
  const { TextArea, Search } = Input

  const [loadingProduct, setLoadingProduct] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

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
      dataIndex: 'product_name',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Tồn chi nhánh',
      dataIndex: 'existing_branch',
    },
  ]

  return (
    <div className="card">
      <Form layout="vertical" form={form}>
        <div>
          <Affix offsetTop={65}>
            <Row
              className={styles['space-row']}
              wrap={false}
              justify="space-between"
              align="middle"
            >
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

              <Space>
                <Button style={{ minWidth: 100 }} size="large" type="primary">
                  {location.state ? 'Lưu' : 'Tạo phiếu kiểm hàng'}
                </Button>
              </Space>
            </Row>
          </Affix>
        </div>

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
              <Option value="1">Not Identified</Option>
              <Option value="2">Closed</Option>
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
              <Option value="1">Nhân viên A</Option>
              <Option value="2">Nhân viên B</Option>
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
                placeholder="Thêm sản phẩm vào hoá đơn"
                dropdownRender={(menu) => <div>{menu}</div>}
              >
                {productsSearch.map((data, index) => (
                  <Select.Option value={data.title} key={data.title + index + ''}>
                    <Row
                      align="middle"
                      wrap={false}
                      style={{ padding: '7px 13px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <img
                        src={data.image[0] ? data.image[0] : IMAGE_DEFAULT}
                        alt=""
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
                            {data.title}
                          </span>
                          <p style={{ marginBottom: 0, fontWeight: 500 }}>
                            {formatCash(data.price)}
                          </p>
                        </Row>
                      </div>
                    </Row>
                  </Select.Option>
                ))}
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
      </Form>
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
      </Modal>
    </div>
  )
}
