import React, { useEffect, useState } from 'react'
import styles from './../offer-list-create/offer-create.module.scss'
// antd
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  PlusSquareOutlined,
  CloseOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  Button,
  Input,
  Select,
  Table,
  Upload,
  message,
  InputNumber,
  notification,
  Row,
  Spin,
} from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IMAGE_DEFAULT, POSITION_TABLE, ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'
import { addDeal, updateDeal } from 'apis/deal'
import { formatCash } from 'utils'
import { apiAllProduct, getProducts } from 'apis/product'
import moment from 'moment'
import { getCategories } from 'apis/category'

const { Option } = Select
const { Search } = Input
const { Dragger } = Upload

export default function OfferListCreate() {
  const history = useHistory()

  const [filter, setFilter] = useState('')
  const [searchStatus, setSearchStatus] = useState(false)
  const [dealName, setDealName] = useState('')
  const [description, setDescription] = useState('')
  const [dealPrice, setDealPrice] = useState('')
  const [products, setProducts] = useState([])
  const [loadingSelect, setLoadingSelect] = useState(false)
  const [dataTableProduct, setDataTableProduct] = useState([])
  const [selectKeysTable, setSelectKeysTable] = useState([])
  const [selectKeys, setSelectKeys] = useState([])

  const handleChangeMoTa = (e) => {
    const value = e.editor.getData()
    setDescription(value)
  }

  const handleChangeFilter = (value) => {
    // console.log(value)
    setFilter(value)
    if (value === 'banner') {
      setSearchStatus(true)
    } else {
      setSearchStatus(false)
    }
  }
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info)
        // status = 'done'
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const _actionDeal = async () => {
    let body = {}
    if (filter === 'product') {
      body = {
        name: dealName,
        type: filter,
        saleoff_type: 'value',
        saleoff_value: dealPrice,
        list: dataTableProduct.map((item) => item.product_id),
        description: description,
      }
    } else if (filter === 'category') {
      body = {
        name: dealName,
        type: filter,
        saleoff_type: 'value',
        saleoff_value: dealPrice,
        // list: dataTableProduct.map((item) => item.product_id),
        description: description,
      }
    }
    try {
      const res = await addDeal(body)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          history.goBack()
          notification.success({ message: 'Tạo ưu đãi thành công' })
        } else {
          notification.success({ message: res.data.message || 'Tạo ưu đãi thất bại' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const data1 = []
  const columns = [
    {
      title: 'Gía ưu đãi',
      dataIndex: 'base_price',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '10%',
      align: 'center',
      render: (text) => (
        <img src={text ? text : IMAGE_DEFAULT} alt="" style={{ width: 80, height: 80 }} />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      width: '10%',
      align: 'center',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categories',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Gía áp dụng',
      dataIndex: 'base_price',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: '10%',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY h:mm:ss'),
    },
  ]
  const columns1 = [
    {
      title: 'Hình ảnh',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tên danh mục',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'SL sản phẩm trong nhóm',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Người tạo',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: '',
      width: '10%',
      align: 'center',
    },
  ]

  const _getProduct = async () => {
    try {
      setLoadingSelect(true)
      const res = await getProducts()
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          const variantsData = []
          res.data.data.map((data) => data.variants.map((variants) => variantsData.push(variants)))
          setProducts(variantsData)
        }
      }
      setLoadingSelect(false)
    } catch (err) {
      console.log(err)
      setLoadingSelect(false)
    }
  }

  const _getCategory = async () => {
    try {
      setLoadingSelect(true)
      const res = await getCategories()
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          const childrenCategory = []
          res.data.data.map((data) =>
            data.children_category.map((item) => childrenCategory.push(item))
          )
          console.log(childrenCategory)
        }
      }
      setLoadingSelect(false)
    } catch (err) {
      console.log(err)
      setLoadingSelect(false)
    }
  }

  const _deleteProductTable = () => {
    const dataNew = dataTableProduct.filter((item) => !selectKeys.includes(item.product_id))
    // console.log(dataNew)
    setDataTableProduct(dataNew)
    setSelectKeys([])
  }

  useEffect(() => {
    _getCategory()
    _getProduct()
  }, [])

  return (
    <div className={styles['body_offer']}>
      <div className={styles['body_offer_header']}>
        <div className={styles['body_offer_header_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['body_offer_header_list_text']}>Tạo ưu đãi</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button onClick={_actionDeal} style={{ width: '90px' }} type="primary">
          Tạo
        </Button>
      </div>
      <hr />
      <div className={styles['body_offer_content']}>
        <div className={styles['body_offer_content_header']}>
          <div className={styles['body_offer_content_header_item_1']}>
            <h3>Tên ưu đãi</h3>
            <Input
              onChange={(e) => setDealName(e.target.value)}
              style={{ width: '80%' }}
              placeholder="Nhập tên ưu đãi"
            ></Input>
          </div>
          <div className={styles['body_offer_content_header_item_2']}>
            <h3>Gía ưu đãi</h3>
            <InputNumber
              onChange={(value) => setDealPrice(value)}
              defaultValue={0}
              min={0}
              max={100000000000}
              style={{ width: '80%' }}
              placeholder="Nhập giá ưu đãi"
            ></InputNumber>
          </div>
        </div>
        <h3 style={{ padding: '20px 0' }}>Mô tả</h3>
        <CKEditor initData={'Nhập mô tả tại đây'} onChange={handleChangeMoTa} />
        <h3 style={{ padding: '20px 0' }}>Loại ưu đãi</h3>
        <Input.Group compact>
          <Select
            onChange={handleChangeFilter}
            style={{ width: '16%' }}
            placeholder="Chọn loại ưu đãi"
            allowClear
          >
            <Option value="product">Sản phẩm</Option>
            <Option value="category">Nhóm sản phẩm</Option>
            <Option value="banner">Banner</Option>
          </Select>
          {/* <Search
            style={{ width: '50%' }}
            placeholder="Tìm kiếm sản phẩm"
            allowClear
            enterButton
            size="medium"
            disabled={searchStatus}
          /> */}
          {filter === 'product' ? (
            <div className="select-product-sell">
              <Select
                notFoundContent={loadingSelect ? <Spin size="small" /> : ''}
                dropdownClassName="dropdown-select-search-product"
                allowClear
                showSearch
                clearIcon={<CloseOutlined style={{ color: 'black' }} />}
                suffixIcon={<SearchOutlined style={{ color: 'black', fontSize: 15 }} />}
                disabled={searchStatus}
                style={{ width: 200 }}
                className={styles['search-product']}
                placeholder="Tìm kiếm sản phẩm"
                dropdownRender={(menu) => (
                  <div>
                    <Row
                      wrap={false}
                      align="middle"
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(ROUTES.PRODUCT_ADD, '_blank')}
                    >
                      <div
                        style={{
                          paddingLeft: 15,
                          width: 45,
                          height: 50,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <PlusSquareOutlined
                          style={{
                            fontSize: 19,
                          }}
                        />
                      </div>
                      <p
                        style={{
                          marginLeft: 20,
                          marginBottom: 0,
                          fontSize: 16,
                        }}
                      >
                        Thêm mới sản phẩm
                      </p>
                    </Row>
                    {menu}
                  </div>
                )}
              >
                {products?.map((data) => (
                  <Select.Option value={data.title} key={data.title}>
                    <Row
                      align="middle"
                      wrap={false}
                      style={{ padding: '7px 13px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        const findProduct = dataTableProduct.find(
                          (item) => item.product_id === data.product_id
                        )
                        if (findProduct) {
                          notification.error({ message: 'Chỉ được chọn sản phẩm khác phân loại' })
                          return
                        }
                        const dataIndex = {
                          product_id: data.product_id,
                          base_price: data.base_price,
                          image: data.image,
                          title: data.title,
                          sku: data.sku,
                          supplier: data.supplier,
                          create_date: data.create_date,
                          categories: data._categories[0].name,
                        }
                        setDataTableProduct([...dataTableProduct, dataIndex])
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
                            {formatCash(data.base_price)}
                          </p>
                        </Row>
                        <Row wrap={false} justify="space-between">
                          <p style={{ marginBottom: 0, color: 'gray' }}>{data.sku}</p>
                          <p style={{ marginBottom: 0, color: 'gray' }}>
                            Có thể bán: {formatCash(data.total_quantity)}
                          </p>
                        </Row>
                      </div>
                    </Row>
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : (
            ''
          )}
        </Input.Group>
        {selectKeys.length !== 0 ? (
          <Button
            onClick={_deleteProductTable}
            style={{ marginTop: '20px' }}
            type="danger"
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
        ) : (
          ''
        )}
        <div className={styles['body_offer_create_content']}>
          {filter === 'product' ? (
            <div>
              <Table
                size="small"
                rowKey="product_id"
                columns={columns}
                dataSource={dataTableProduct}
                rowSelection={{
                  selectedRowKeys: selectKeys,
                  onChange: (keys, records) => {
                    // console.log('keys', keys)
                    setSelectKeys(keys)
                    // console.log(selectKeys)
                  },
                }}
                pagination={{
                  position: POSITION_TABLE,
                  page: 1,
                  pageSize: 5,
                }}
              />
            </div>
          ) : (
            ''
          )}
          {filter === 'category' ? <Table columns={columns1} dataSource={data1} /> : ''}
          {filter === 'banner' ? (
            <Dragger listType="picture" {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
              <p className="ant-upload-hint">Hỗ trợ định dạng .PNG,.JPG,.TIFF,.EPS</p>
            </Dragger>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
