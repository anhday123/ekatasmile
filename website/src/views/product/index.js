import React, { useState, useEffect, useRef } from 'react'

import styles from './product.module.scss'
import { Link } from 'react-router-dom'
import { ROUTES, PERMISSIONS, STATUS_PRODUCT, IMAGE_DEFAULT } from 'consts'
import { compareCustom, formatCash, tableSum } from 'utils'
import moment from 'moment'

import {
  Switch,
  Slider,
  Upload,
  Select,
  notification,
  Button,
  Modal,
  Table,
  Input,
  Row,
  Col,
  DatePicker,
  Popover,
  Space,
  Popconfirm,
  Tag,
  TreeSelect,
} from 'antd'

//components
import Permission from 'components/permission'
import SettingColumns from 'components/setting-columns'
import columnsProduct from './columns'
import ExportProduct from 'components/ExportCSV/ExportProduct'
import ImportProducts from 'components/import-products'

//icons
import { PlusCircleOutlined } from '@ant-design/icons'

//apis
import { apiAllWarranty } from 'apis/warranty'
import { apiAllSupplier } from 'apis/supplier'
import { getAllStore } from 'apis/store'
import { getCategories } from 'apis/category'
import { getProducts, updateProduct, deleteProducts } from 'apis/product'
import { compare } from 'utils'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Product() {
  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [paramsFilter, setParamsFilter] = useState({
    page: 1,
    page_size: 20,
  })

  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [warranty, setWarranty] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //list checkbox row, key = _id
  const [arrayProductShipping, setArrayProductShipping] = useState([])
  const [categories, setCategories] = useState([])
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [stores, setStores] = useState([]) //list store in filter
  const [storeId, setStoreId] = useState() //filter product by store
  const [columns, setColumns] = useState([])

  const [countProduct, setCountProduct] = useState(0)

  const apiAllCategoryData = async () => {
    try {
      const res = await getCategories()
      if (res.status === 200) setCategories(res.data.data.filter((e) => e.active))
    } catch (error) {
      console.log(error)
    }
  }

  const columnsVariant = [
    {
      title: 'Hình ảnh',
      render: (text, record) => <ImageProductVariable record={record} />,
    },
    {
      title: 'Phiên bản',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Giá vốn',
      dataIndex: 'base_price',
      render: (text) => text && formatCash(text),
    },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price',
      render: (text) => text && formatCash(text),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      render: (text) => text && formatCash(text),
    },
  ]

  const apiAllSupplierData = async () => {
    try {
      setLoading(true)
      const res = await apiAllSupplier()
      if (res.status === 200) {
        setSuppliers(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)

    const productsUpdateShipping = products.filter((product) =>
      selectedRowKeys.includes(product.product_id)
    )

    setArrayProductShipping([...productsUpdateShipping])
  }

  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter[optionSearchName] = value
      else delete paramsFilter[optionSearchName]

      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }

  const _getProductsToExport = async () => {
    try {
      const res = await getProducts({ store: true })
      console.log(res)
      if (res.status === 200) return res.data.data
      return []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const getAllProduct = async (params) => {
    setLoading(true)
    setSelectedRowKeys([])
    setProducts([])

    try {
      const res = await getProducts({ ...params, store: true })

      console.log(res)
      if (res.status === 200) {
        //tính tổng số lượng nếu có variant
        const dataNew = res.data.data.map((e) => {
          let sumQuantity = 0
          let sumBasePrice = 0
          let sumSalePrice = 0
          let sumImportPrice = 0

          e.variants.map((v) => {
            sumQuantity += v.total_quantity
            sumBasePrice += v.base_price
            sumSalePrice += v.price
            sumImportPrice += v.import_price
          })
          return {
            ...e,
            sumQuantity: sumQuantity,
            sumBasePrice: sumBasePrice,
            sumSalePrice: sumSalePrice,
            sumImportPrice: sumImportPrice,
          }
        })

        setProducts([...dataNew])
        setCountProduct(res.data.count)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct({ ...paramsFilter })
  }, [paramsFilter])

  useEffect(() => {
    apiAllSupplierData()
    apiAllCategoryData()
    apiAllWarrantyData()
    getStores()
  }, [])

  const UpdateCategoryProducts = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [categoryIds, setCategoryIds] = useState([])

    useEffect(() => {
      if (!visible) setCategoryIds([])
    }, [visible])

    return (
      <>
        <Permission permissions={[PERMISSIONS.cap_nhat_nhom_san_pham]}>
          <Button size="large" onClick={toggle} type="primary">
            Cập nhật danh mục
          </Button>
        </Permission>
        <Modal
          title="Cập nhật danh mục"
          centered
          width={500}
          footer={null}
          visible={visible}
          onCancel={toggle}
        >
          <TreeSelect
            multiple
            treeDefaultExpandAll
            size="large"
            style={{ width: '100%', marginBottom: 30 }}
            placeholder="Chọn danh mục"
            showSearch={false}
            onChange={(value) => setCategoryIds(value)}
            value={categoryIds}
          >
            {categories.map((category) => (
              <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                {category.children_category.map((child) => (
                  <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                    {child.children_category.map((e) => (
                      <TreeSelect.TreeNode value={e.category_id} title={e.name}>
                        {e.name}
                      </TreeSelect.TreeNode>
                    ))}
                  </TreeSelect.TreeNode>
                ))}
              </TreeSelect.TreeNode>
            ))}
          </TreeSelect>
          <Row justify="end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true)

                  const listPromise = selectedRowKeys.map(async (product_id) => {
                    const res = await updateProduct({ category_id: categoryIds }, product_id)
                    return res
                  })

                  await Promise.all(listPromise)
                  setLoading(false)
                  toggle()
                  await getAllProduct({ ...paramsFilter })
                  notification.success({
                    message: `Cập nhật thành công danh mục vào các sản phẩm thành công!`,
                  })
                } catch (error) {
                  setLoading(false)
                  toggle()
                  console.log(error)
                }
              }}
              type="primary"
              size="large"
              disabled={categoryIds.length !== 0 ? false : true}
            >
              Cập nhật
            </Button>
          </Row>
        </Modal>
      </>
    )
  }

  const _deleteProducts = async () => {
    try {
      setLoading(true)
      const res = await deleteProducts(selectedRowKeys.join('---'))
      console.log(res)
      if (res.status === 200) notification.success({ message: 'Xoá sản phẩm thành công!' })
      else notification.error({ message: 'Xoá sản phẩm thất bại!' })
      await getAllProduct({ ...paramsFilter })
      setSelectedRowKeys([])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  /*image product */
  const ContentZoomImage = (data) => {
    const [valueBox, setValueBox] = useState(300)
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <img
          src={data}
          style={{ width: valueBox, height: valueBox, objectFit: 'contain' }}
          alt=""
          onClick={(e) => e.stopPropagation()}
        />
        <Slider
          defaultValue={300}
          min={100}
          max={1000}
          onChange={(value) => setValueBox(value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  }

  const ImageProductVariable = ({ record }) => {
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        disabled
      >
        {record.image && record.image.length ? (
          <Popover style={{ top: 300 }} placement="top" content={ContentZoomImage(record.image[0])}>
            <img src={record.image[0]} alt="" style={{ width: '100%' }} />
          </Popover>
        ) : (
          <img src={IMAGE_DEFAULT} alt="" style={{ width: '100%' }} />
        )}
      </Upload>
    )
  }
  /*image product */

  const onClickClear = async () => {
    Object.keys(paramsFilter).map((key) => {
      delete paramsFilter[key]
    })
    paramsFilter.page = 1
    paramsFilter.page_size = 20
    await getAllProduct({ ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
    setValueSearch('')
    setStoreId()
    setSelectedRowKeys([])
    setValueTime()
  }

  const _updateProduct = async (body, id) => {
    try {
      setLoading(true)
      let res = await updateProduct(body, id)
      console.log(res)
      if (res.status === 200) notification.success({ message: 'Cập nhật thành công!' })
      else notification.error({ message: 'Cập nhật thất bại, vui lòng thử lại!' })

      await getAllProduct({ ...paramsFilter })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const apiAllWarrantyData = async () => {
    try {
      setLoading(true)
      const res = await apiAllWarranty()
      if (res.status === 200) {
        setWarranty(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getStores = async () => {
    try {
      const res = await getAllStore()
      if (res.status === 200) setStores(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const [optionSearchName, setOptionSearchName] = useState('name')

  const onChangeStore = (storeId) => {
    if (storeId) paramsFilter.store_id = storeId
    else delete paramsFilter.store_id

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  const onChangeCategoryValue = (id) => {
    if (id) paramsFilter.category_id = id.join('---')
    else delete paramsFilter.category_id

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  return (
    <>
      <div className={`${styles['view_product']} ${styles['card']}`}>
        <Row
          style={{
            display: 'flex',
            paddingBottom: '1rem',
            paddingTop: '1rem',
            borderBottom: '1px solid rgb(236, 228, 228)',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={12} xl={12}>
            <h3 style={{ marginBottom: 0 }}>Danh sách sản phẩm</h3>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={12} xl={12}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Space>
                <ImportProducts reload={() => getAllProduct({ ...paramsFilter })} />
                <ExportProduct
                  fileName="Products"
                  name="Export Sản Phẩm"
                  getProductsExport={_getProductsToExport}
                />
                <Permission permissions={[PERMISSIONS.them_san_pham]}>
                  <Link to={ROUTES.PRODUCT_ADD}>
                    <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
                      Thêm sản phẩm
                    </Button>
                  </Link>
                </Permission>
              </Space>
            </div>
          </Col>
        </Row>

        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <Input.Group style={{ width: '100%' }}>
              <Row style={{ width: '100%' }}>
                <Col span={14}>
                  <Input
                    size="large"
                    style={{ width: '100%' }}
                    name="name"
                    value={valueSearch}
                    onChange={onSearch}
                    className={styles['orders_manager_content_row_col_search']}
                    placeholder="Tìm kiếm theo mã, theo tên"
                    allowClear
                  />
                </Col>
                <Col span={7}>
                  <Select
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn theo"
                    optionFilterProp="children"
                    value={optionSearchName}
                    onChange={(value) => {
                      delete paramsFilter[optionSearchName]
                      setOptionSearchName(value)
                    }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="name">Tên sản phẩm</Option>
                    <Option value="sku">SKU</Option>
                  </Select>
                </Col>
              </Row>
            </Input.Group>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <TreeSelect
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo danh mục"
              allowClear
              multiple
              showSearch={false}
              treeDefaultExpandAll
              value={
                paramsFilter.category_id ? paramsFilter.category_id.split('---').map((e) => +e) : []
              }
              onChange={onChangeCategoryValue}
            >
              {categories.map((category) => (
                <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                  {category.children_category.map((child) => (
                    <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                      {child.children_category.map((e) => (
                        <TreeSelect.TreeNode value={e.category_id} title={e.name}>
                          {e.name}
                        </TreeSelect.TreeNode>
                      ))}
                    </TreeSelect.TreeNode>
                  ))}
                </TreeSelect.TreeNode>
              ))}
            </TreeSelect>
          </Col>

          <div style={{ width: 455, marginTop: '1rem' }}>
            <Select
              size="large"
              open={isOpenSelect}
              onBlur={() => {
                if (isOpenSelect) toggleOpenSelect()
              }}
              onClick={() => {
                if (!isOpenSelect) toggleOpenSelect()
              }}
              allowClear
              showSearch
              style={{ width: '100%' }}
              placeholder="Lọc theo thời gian nhập kho"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={valueTime}
              onChange={async (value) => {
                setValueTime(value)

                paramsFilter.page = 1

                //xoa params search date hien tai
                const p = Object.keys(valueDateTimeSearch)
                if (p.length) delete paramsFilter[p[0]]

                setValueDateSearch(null)
                delete paramsFilter.startDate
                delete paramsFilter.endDate

                if (isOpenSelect) toggleOpenSelect()

                if (value) {
                  const searchDate = Object.fromEntries([[value, true]]) // them params search date moi

                  setParamsFilter({ ...paramsFilter, ...searchDate })
                  setValueDateTimeSearch({ ...searchDate })
                } else {
                  setParamsFilter({ ...paramsFilter })
                  setValueDateTimeSearch({})
                }
              }}
              dropdownRender={(menu) => (
                <>
                  <RangePicker
                    onFocus={() => {
                      if (!isOpenSelect) toggleOpenSelect()
                    }}
                    onBlur={() => {
                      if (isOpenSelect) toggleOpenSelect()
                    }}
                    value={valueDateSearch}
                    onChange={(dates, dateStrings) => {
                      //khi search hoac filter thi reset page ve 1
                      paramsFilter.page = 1

                      if (isOpenSelect) toggleOpenSelect()

                      //nếu search date thì xoá các params date
                      delete paramsFilter.to_day
                      delete paramsFilter.yesterday
                      delete paramsFilter.this_week
                      delete paramsFilter.last_week
                      delete paramsFilter.last_month
                      delete paramsFilter.this_month
                      delete paramsFilter.this_year
                      delete paramsFilter.last_year

                      //Kiểm tra xem date có được chọn ko
                      //Nếu ko thì thoát khỏi hàm, tránh cash app
                      //và get danh sách order
                      if (!dateStrings[0] && !dateStrings[1]) {
                        delete paramsFilter.from_date
                        delete paramsFilter.to_date

                        setValueDateSearch(null)
                        setValueTime()
                      } else {
                        const dateFirst = dateStrings[0]
                        const dateLast = dateStrings[1]
                        setValueDateSearch(dates)
                        setValueTime(`${dateFirst} -> ${dateLast}`)

                        dateFirst.replace(/-/g, '/')
                        dateLast.replace(/-/g, '/')

                        paramsFilter.from_date = dateFirst
                        paramsFilter.to_date = dateLast
                      }

                      setParamsFilter({ ...paramsFilter })
                    }}
                    style={{ width: '100%' }}
                  />
                  {menu}
                </>
              )}
            >
              <Option value="today">Today</Option>
              <Option value="yesterday">Yesterday</Option>
              <Option value="this_week">This week</Option>
              <Option value="last_week">Last week</Option>
              <Option value="this_month">This month</Option>
              <Option value="last_month">Last Month</Option>
              <Option value="this_year">This year</Option>
              <Option value="last_year">Last year</Option>
            </Select>
          </div>
          {/* <Col
            style={{
              width: '100%',
              marginTop: '1rem',
            }}
            xs={24}
            sm={24}
            md={24}
            lg={11}
            xl={11}
          >
            <Select
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo cửa hàng"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.store_id}
              onChange={onChangeStore}
            >
              {stores.map((store, index) => {
                return (
                  <Option value={store.store_id} key={index}>
                    {store.name}
                  </Option>
                )
              })}
            </Select>
          </Col> */}
        </Row>

        <Row
          justify="end"
          style={{
            marginTop: '30px',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <Space>
            <Button
              style={{
                display: Object.keys(paramsFilter).length <= 2 && 'none',
              }}
              size="large"
              onClick={onClickClear}
              type="primary"
            >
              Xóa tất cả lọc
            </Button>
            <SettingColumns
              columns={columns}
              setColumns={setColumns}
              columnsDefault={columnsProduct}
              nameColumn="columnsProductStore"
            />
          </Space>
        </Row>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <Row style={{ width: '100%', marginBottom: 10 }}>
            <Space size="middle">
              {/* <Permission permission={[PERMISSIONS.tao_phieu_chuyen_hang]}>
                <Button
                  size="large"
                  onClick={() => {
                    history.push({
                      pathname: ROUTES.SHIPPING_PRODUCT_ADD,
                      state: arrayProductShipping,
                    })
                  }}
                  type="primary"
                >
                  Chuyển hàng
                </Button>
              </Permission> */}
              <UpdateCategoryProducts />
              <Permission permission={[PERMISSIONS.xoa_san_pham]}>
                <Popconfirm
                  title="Bạn có muốn xoá các sản phẩm này?"
                  okText="Đồng ý"
                  cancelText="Từ chối"
                  onConfirm={_deleteProducts}
                >
                  <Button size="large" type="primary" danger>
                    Xoá
                  </Button>
                </Popconfirm>
              </Permission>
            </Space>
          </Row>
        ) : (
          ''
        )}

        <div className={styles['view_product_table']}>
          <Table
            style={{ width: '100%' }}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
            }}
            rowKey="product_id"
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <div
                    style={{
                      marginTop: 25,
                      marginBottom: 25,
                    }}
                  >
                    <Table
                      style={{ width: '100%' }}
                      pagination={false}
                      columns={columnsVariant}
                      dataSource={record.variants}
                      size="small"
                    />
                  </div>
                )
              },
              expandedRowKeys: selectedRowKeys,
              expandIconColumnIndex: -1,
            }}
            columns={columns.map((column) => {
              if (column.key === 'name-product')
                return {
                  ...column,
                  render: (text, record) =>
                    record.active ? (
                      <Link to={{ pathname: ROUTES.PRODUCT_ADD, state: record }}>{text}</Link>
                    ) : (
                      text
                    ),
                  sorter: (a, b) => compare(a, b, 'name'),
                }

              if (column.key === 'sku')
                return {
                  ...column,
                  sorter: (a, b) => compare(a, b, 'sku'),
                }

              if (column.key === 'category')
                return {
                  ...column,
                  sorter: (a, b) =>
                    compareCustom(
                      a._category ? a._category.name : '',
                      b._category ? b._category.name : ''
                    ),
                  render: (text, record) =>
                    record._categories &&
                    record._categories.map((category, index) => (
                      <Tag key={index} closable={false}>
                        {category.name}
                      </Tag>
                    )),
                }

              if (column.key === 'supplier')
                return {
                  ...column,
                  sorter: (a, b) =>
                    compareCustom(
                      a.supplier ? a.supplier.name : '',
                      b.supplier ? b.supplier.name : ''
                    ),
                  render: (text, record) => {
                    const supplier = suppliers.find((c) => c.supplier_id === record.supplier_id)
                    if (supplier) return supplier.name
                    else return ''
                  },
                }

              if (column.key === 'base-price')
                return {
                  ...column,
                  sorter: (a, b) => compareCustom(a.sumBasePrice || 0, b.sumBasePrice || 0),

                  render: (text, record) => record.sumBasePrice && formatCash(record.sumBasePrice),
                }

              if (column.key === 'price')
                return {
                  ...column,
                  sorter: (a, b) => compareCustom(a.sumSalePrice || 0, b.sumSalePrice || 0),

                  render: (text, record) => record.sumSalePrice && formatCash(record.sumSalePrice),
                }

              if (column.key === 'import-price')
                return {
                  ...column,
                  sorter: (a, b) => compareCustom(a.sumImportPrice || 0, b.sumImportPrice || 0),

                  render: (text, record) =>
                    record.sumImportPrice && formatCash(record.sumImportPrice),
                }

              if (column.key === 'create_date')
                return {
                  ...column,
                  sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),

                  render: (text, record) =>
                    record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm:ss'),
                }

              if (column.key === 'active')
                return {
                  ...column,
                  render: (text, record) => (
                    <Switch
                      defaultChecked={record.active}
                      onClick={() => _updateProduct({ active: !record.active }, record.product_id)}
                    />
                  ),
                }

              return column
            })}
            loading={loading}
            dataSource={products}
            size="small"
            pagination={{
              position: ['bottomLeft'],
              current: paramsFilter.page,
              defaultPageSize: 20,
              pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setSelectedRowKeys([])
                paramsFilter.page = page
                paramsFilter.page_size = pageSize
                getAllProduct({ ...paramsFilter })
              },
              total: countProduct,
            }}
            summary={(pageData) => (
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <b>Tổng</b>
                </Table.Summary.Cell>
                {columns.map((column) => {
                  if (column.key === 'sum-count')
                    return (
                      <Table.Summary.Cell>
                        {formatCash(tableSum(pageData, 'sumQuantity'))}
                      </Table.Summary.Cell>
                    )
                  if (column.key === 'base-price')
                    return (
                      <Table.Summary.Cell>
                        {formatCash(tableSum(pageData, 'sumBasePrice'))}
                      </Table.Summary.Cell>
                    )
                  if (column.key === 'price')
                    return (
                      <Table.Summary.Cell>
                        {formatCash(tableSum(pageData, 'sumSalePrice'))}
                      </Table.Summary.Cell>
                    )
                  if (column.key === 'import-price')
                    return (
                      <Table.Summary.Cell>
                        {formatCash(tableSum(pageData, 'sumImportPrice'))}
                      </Table.Summary.Cell>
                    )
                  return <Table.Summary.Cell></Table.Summary.Cell>
                })}
              </Table.Summary.Row>
            )}
          />
        </div>
      </div>
    </>
  )
}
