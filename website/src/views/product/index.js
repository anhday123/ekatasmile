import React, { useState, useEffect, useRef } from 'react'
import styles from './product.module.scss'
import { Link } from 'react-router-dom'
import { ROUTES, PERMISSIONS, STATUS_PRODUCT, IMAGE_DEFAULT } from 'consts'
import { compareCustom, formatCash } from 'utils'
import moment from 'moment'
import { compare } from 'utils'
import { useSelector } from 'react-redux'

import {
  Switch,
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
import TitlePage from 'components/title-page'
import ImportCSV from 'components/ImportCSV'

//icons
import { PlusCircleOutlined, InboxOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons'

//apis
import { getSuppliers } from 'apis/supplier'
import { getCategories } from 'apis/category'
import { getProducts, updateProduct, deleteProducts, importProduct } from 'apis/product'
import { uploadFile } from 'apis/upload'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Product() {
  const typingTimeoutRef = useRef(null)
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //list checkbox row, key = _id
  const [categories, setCategories] = useState([])
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [columns, setColumns] = useState([])

  const [countProduct, setCountProduct] = useState(0)

  const _getCategories = async () => {
    try {
      const res = await getCategories()
      if (res.status === 200) setCategories(res.data.data.filter((e) => e.active))
    } catch (error) {
      console.log(error)
    }
  }

  const enableBulkPrice = async (product, variant) => {
    try {
      setLoading(true)

      const variantsNew = product.variants.map((e) => {
        if (e.variant_id === variant.variant_id) return variant
        else return e
      })

      const body = { variants: variantsNew }
      const res = await updateProduct(body, product.product_id)
      console.log(res)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const ModalViewBulkPrices = ({ bulkPrices }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const columns = [
      {
        title: 'Số lượng thấp nhất',
        render: (text, record) => formatCash(record.min_quantity_apply || 0),
      },
      {
        title: 'Số lượng cao nhất',
        render: (text, record) => formatCash(record.max_quantity_apply || 0),
      },
      {
        title: 'Giá áp dụng',
        render: (text, record) => formatCash(record.price || 0),
      },
    ]

    return (
      <>
        <a onClick={toggle}>Xem giá sỉ</a>
        <Modal
          width="50%"
          title="Danh sách giá sỉ"
          footer={null}
          visible={visible}
          onCancel={toggle}
        >
          <Table
            scroll={{ y: '50vh' }}
            size="small"
            pagination={false}
            columns={columns}
            dataSource={bulkPrices}
          />
        </Modal>
      </>
    )
  }

  const columnsVariant = [
    {
      title: 'Hình ảnh',
      key: 'image',
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Giá bán lẻ',
      render: (text, record) => formatCash(record.price || 0),
    },
    {
      title: 'Giá bán sỉ',
      render: (text, record) =>
        record.bulk_prices && record.bulk_prices.length ? (
          <ModalViewBulkPrices bulkPrices={record.bulk_prices || []} />
        ) : (
          ''
        ),
    },
    {
      title: 'Kích hoạt giá sỉ',
      key: 'enable_bulk_price',
    },
  ]

  const _getSuppliers = async () => {
    try {
      setLoading(true)
      const res = await getSuppliers()
      console.log(res)
      if (res.status === 200) setSuppliers(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

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

      setParamsFilter({ ...paramsFilter, page: 1 })
    }, 750)
  }

  const _getProductsToExport = async () => {
    try {
      setLoading(true)
      const res = await getProducts({ branch: true, branch_id: branchIdApp })
      console.log(res)
      setLoading(false)
      if (res.status === 200) return res.data.data
      return []
    } catch (error) {
      console.log(error)
      setLoading(false)
      return []
    }
  }

  const _getProducts = async () => {
    setLoading(true)
    setSelectedRowKeys([])
    setProducts([])

    try {
      const res = await getProducts({ ...paramsFilter, branch: true, branch_id: branchIdApp })
      console.log(res)
      if (res.status === 200) {
        setProducts(res.data.data)
        setCountProduct(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    _getProducts()
  }, [paramsFilter, branchIdApp])

  useEffect(() => {
    _getSuppliers()
    _getCategories()
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
            Cập nhật nhóm sản phẩm
          </Button>
        </Permission>
        <Modal
          title="Cập nhật nhóm sản phẩm"
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
            placeholder="Chọn nhóm sản phẩm"
            showSearch={false}
            onChange={(value) => setCategoryIds(value)}
            value={categoryIds}
          >
            {categories.map((category) => (
              <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                {category.children_category.map((child) => (
                  <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                    {child.children_category &&
                      child.children_category.map((e) => (
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
                  await _getProducts()
                  notification.success({
                    message: `Cập nhật thành công nhóm sản phẩm vào các sản phẩm thành công!`,
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

  const _deleteProduct = async (product_id) => {
    console.log(product_id)
    try {
      setLoading(true)
      const res = await deleteProducts({ product_id: [product_id] })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getProducts()
          notification.success({ message: 'Xoá sản phẩm thành công!' })
        } else
          notification.error({
            message: res.data.message || 'Xoá sản phẩm thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xoá sản phẩm thất bại, vui lòng thử lại!',
        })

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const ImagesVariant = ({ record, product }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [images, setImages] = useState(record.image || [])
    const [imagesView, setImagesView] = useState(record.image || [])

    const [loading, setLoading] = useState(false)

    const _uploadFile = async (file) => {
      setLoading(true)
      const url = await uploadFile(file)
      setImages([...images, url])
      const fileNames = url.split('/')
      const fileName = fileNames[fileNames.length - 1]
      setImagesView([
        ...imagesView,
        { uid: imagesView.length, name: fileName, status: 'done', url: url, thumbUrl: url },
      ])
      setLoading(false)
    }

    useEffect(() => {
      if (visible) {
        setImages(record.image || [])
        setImagesView(
          record.image
            ? record.image.map((image, index) => {
              const fileNames = image.split('/')
              const fileName = fileNames[fileNames.length - 1]
              return { uid: index, name: fileName, status: 'done', url: image, thumbUrl: image }
            })
            : []
        )
      }
    }, [visible])

    return (
      <>
        <div onClick={toggle} className={styles['variant-image']}>
          {record.image && record.image.length ? (
            <img src={record.image[0] || IMAGE_DEFAULT} alt="" style={{ width: '100%' }} />
          ) : (
            <img src={IMAGE_DEFAULT} alt="" style={{ width: '100%' }} />
          )}
        </div>
        <Modal
          footer={
            <Row justify="end">
              <Space>
                <Button style={{ minWidth: 100 }} onClick={toggle}>
                  Đóng
                </Button>
                <Button
                  onClick={async () => {
                    const body = {
                      variants: product.variants.map((e) => {
                        if (e.variant_id === record.variant_id) return { ...e, image: images }
                        return e
                      }),
                    }
                    await _updateProduct(body, product.product_id)
                    toggle()
                  }}
                  style={{ minWidth: 100 }}
                  type="primary"
                >
                  Lưu
                </Button>
              </Space>
            </Row>
          }
          width={700}
          onCancel={toggle}
          title="Cập nhật hình ảnh"
          visible={visible}
        >
          <Upload.Dragger
            fileList={imagesView}
            listType="picture"
            data={_uploadFile}
            name="file"
            multiple
            onChange={(info) => {
              if (info.file.status !== 'done') info.file.status = 'done'
            }}
          >
            <p className="ant-upload-drag-icon">
              {loading ? <LoadingOutlined /> : <InboxOutlined />}
            </p>
            <p className="ant-upload-text">Nhấp hoặc hình ảnh vào khu vực này để tải lên</p>
            <p className="ant-upload-hint">Hỗ trợ hình ảnh .PNG, .JPG,...</p>
          </Upload.Dragger>
        </Modal>
      </>
    )
  }

  const onClickClear = async () => {
    setParamsFilter({ page: 1, page_size: 20 })
    setValueSearch('')
    setSelectedRowKeys([])
    setValueTime()
    setValueDateTimeSearch({})
    setValueDateSearch(null)
  }

  const _updateProduct = async (body, id) => {
    try {
      setLoading(true)
      let res = await updateProduct(body, id)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) notification.success({ message: 'Cập nhật thành công!' })
        else
          notification.error({
            message: res.data.message || 'Cập nhật thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Cập nhật thất bại, vui lòng thử lại!',
        })

      await _getProducts()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const [optionSearchName, setOptionSearchName] = useState('name')

  const onChangeCategoryValue = (id) => {
    if (id) paramsFilter.category_id = id.join('---')
    else delete paramsFilter.category_id

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  return (
    <>
      <div className="card">
        <TitlePage title="Danh sách sản phẩm">
          <Space>
            <SettingColumns
              columns={columns}
              setColumns={setColumns}
              columnsDefault={columnsProduct}
              nameColumn="columnsProductStore"
            />
            <ImportCSV
              size="large"
              txt="Import sản phẩm"
              upload={importProduct}
              title="Nhập sản phẩm bằng file excel"
              fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/12/31/bc03caef-25ad-4767-bad3-d9d41459b0ef/ImportProductAO.xlsx"
              reload={_getProducts}
            />
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
        </TitlePage>

        <Row gutter={[16, 16]} style={{ marginTop: '1rem' }}>
          <Col xs={24} sm={24} md={24} lg={11} xl={10}>
            <Input.Group style={{ width: '100%' }}>
              <Row style={{ width: '100%' }}>
                <Col span={16}>
                  <Input
                    size="large"
                    style={{ width: '100%' }}
                    name="name"
                    value={valueSearch}
                    onChange={onSearch}
                    placeholder="Tìm kiếm theo mã, theo tên"
                    allowClear
                  />
                </Col>
                <Col span={8}>
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
          <Col xs={24} sm={24} md={24} lg={11} xl={7}>
            <TreeSelect
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo nhóm sản phẩm"
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
                      {child.children_category &&
                        child.children_category.map((e) => (
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

          <Col xs={24} sm={24} md={24} lg={11} xl={7}>
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
                delete paramsFilter.from_date
                delete paramsFilter.to_date

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
              <Option value="today">Hôm nay</Option>
              <Option value="yesterday">Hôm qua</Option>
              <Option value="this_week">Tuần này</Option>
              <Option value="last_week">Tuần trước</Option>
              <Option value="this_month">Tháng này</Option>
              <Option value="last_month">Tháng trước</Option>
              <Option value="this_year">Năm này</Option>
              <Option value="last_year">Năm trước</Option>
            </Select>
          </Col>
        </Row>

        <Row justify="space-between" style={{ width: '100%', marginTop: 20, marginBottom: 10 }}>
          <Space size="middle" style={{ display: !selectedRowKeys.length && 'none' }}>
            <UpdateCategoryProducts />
            {/* <Permission permission={[PERMISSIONS.xoa_san_pham]}>
              <Popconfirm
                title="Bạn có muốn xoá các sản phẩm này?"
                okText="Đồng ý"
                cancelText="Từ chối"
                onConfirm={_deleteProducts}
              >
                <Button style={{ minWidth: 100 }} size="large" type="primary" danger>
                  Xoá
                </Button>
              </Popconfirm>
            </Permission> */}
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
          </Space>
        </Row>

        <Table
          style={{ width: '100%' }}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          rowKey="product_id"
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div style={{ marginTop: 25, marginBottom: 25 }}>
                  <Table
                    style={{ width: '100%' }}
                    pagination={false}
                    columns={columnsVariant.map((column) => {
                      if (column.key === 'image')
                        return {
                          ...column,
                          render: (text, variant) => (
                            <ImagesVariant record={variant} product={record} />
                          ),
                        }
                      if (column.key === 'enable_bulk_price')
                        return {
                          ...column,
                          render: (text, variant) => (
                            <Switch
                              checked={variant.enable_bulk_price}
                              onChange={(checked) =>
                                enableBulkPrice(record, { ...variant, enable_bulk_price: checked })
                              }
                            />
                          ),
                        }

                      return column
                    })}
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
                    <Link to={{ pathname: ROUTES.PRODUCT_UPDATE, state: record }}>{text}</Link>
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

            if (column.key === 'create_date')
              return {
                ...column,
                sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),

                render: (text, record) =>
                  record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
              }

            if (column.key === 'active')
              return {
                ...column,
                render: (text, record) => (
                  <div>
                    <Switch
                      defaultChecked={record.active}
                      onClick={() => _updateProduct({ active: !record.active }, record.product_id)}
                      style={{ marginRight: 15 }}
                    />
                    <Popconfirm
                      onConfirm={() => _deleteProduct(record.product_id)}
                      title="Bạn có muốn xóa sản phẩm này không?"
                      okText="Đồng ý"
                      cancelText="Từ chối"
                    >
                      <Button
                        style={{ marginTop: 17 }}
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </div>
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
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            total: countProduct,
          }}
        />
      </div>
    </>
  )
}
