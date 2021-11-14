import styles from './../product/product.module.scss'
import { Link, useHistory } from 'react-router-dom'

import {
  Switch,
  Drawer,
  Slider,
  Upload,
  Select,
  Form,
  notification,
  Checkbox,
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
  Tabs,
  Badge,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import {
  ACTION,
  ROUTES,
  PERMISSIONS,
  STATUS_PRODUCT,
  IMAGE_DEFAULT,
} from 'consts'
import { formatCash } from 'utils'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

//components
import Permission from 'components/permission'
import SettingColumns from 'components/setting-columns'
import columnsProduct from 'views/product/columns'

//icons
import { PlusCircleOutlined } from '@ant-design/icons'

//apis
import { apiAllWarranty } from 'apis/warranty'
import { apiAllSupplier } from 'apis/supplier'
import { getAllStore } from 'apis/store'
import { apiAddCategory, getCategories } from 'apis/category'
import {
  apiProductCategoryMerge,
  getProductsBranch,
  updateProductBranch,
  updateProductStore,
  getProductsStore,
  deleteProductStore,
  deleteProductBranch,
} from 'apis/product'
import { uploadFile } from 'apis/upload'
import { compare } from 'utils'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Product() {
  const dispatch = useDispatch()
  const history = useHistory()
  const branchId = useSelector((state) => state.branch.branchId)

  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [paramsFilter, setParamsFilter] = useState({
    page: 1,
    page_size: 20,
    this_week: true,
  })

  const [supplier, setSupplier] = useState([])
  const [products, setProducts] = useState([])
  const [warranty, setWarranty] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //list checkbox row, key = _id
  const [arrayProductShipping, setArrayProductShipping] = useState([])
  const [categories, setCategories] = useState([])
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState('this_week') //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({
    this_week: true,
  })
  const [stores, setStores] = useState([]) //list store in filter
  const [storeId, setStoreId] = useState() //filter product by store
  const [columns, setColumns] = useState(
    localStorage.getItem('columnsProductInventory')
      ? JSON.parse(localStorage.getItem('columnsProductInventory'))
      : [...columnsProduct]
  )
  const [countProductByStatus, setCountProductByStatus] = useState({
    all_count: 0,
    available_count: 0,
    low_count: 0,
    out_count: 0,
    shipping_count: 0,
  })
  const [countProduct, setCountProduct] = useState(0)

  const COLOR_STATUS = {
    colorAll: '#ffcc01',
    colorShipping: '#2badea',
    colorAvailable: '#15a904',
    colorLow: '#886464',
    colorOut: 'red',
  }

  const columnsCategory = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'category_id',
      sorter: (a, b) => compare(a, b, 'category_id'),
    },
    {
      title: 'Người tạo',
      render: (text, record) =>
        record._creator &&
        `${record._creator.first_name} ${record._creator.last_name}`,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) =>
        text ? moment(text).format('YYYY-MM-DD, HH:mm:ss') : '',
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
  ]

  const apiAddCategoryDataMain = async (object) => {
    try {
      setLoading(true)
      const res = await apiAddCategory(object)
      console.log(res)
      if (res.status === 200) {
        notification.success({ message: 'Tạo danh mục thành công' })
      } else
        notification.error({
          message: res.data.mess || 'Tạo danh mục thất bại',
        })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const openNotificationSuccessStoreUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Cập nhật thông tin danh mục <b>{data}</b> thành công
        </div>
      ),
    })
  }

  const apiAllCategoryData = async () => {
    try {
      const res = await getCategories()
      if (res.status === 200)
        setCategories(res.data.data.filter((e) => e.active))
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
      title: 'Danh mục',
      key: 'category',
    },
    {
      title: 'Số lượng',
      render: (text, record) =>
        +record.available_stock_quantity + +record.low_stock_quantity,
    },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price',
      render: (text) => text && formatCash(text),
    },
    {
      title: 'Giá bán',
      dataIndex: 'sale_price',
      render: (text) => text && formatCash(text),
    },
  ]

  const apiAllSupplierData = async () => {
    try {
      setLoading(true)
      const res = await apiAllSupplier()
      if (res.status === 200) {
        setSupplier(res.data.data)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)

    const productsUpdateShipping = products.filter((product) =>
      selectedRowKeys.includes(product._id)
    )
    console.log(productsUpdateShipping)
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

  const apiProductCategoryMergeData = async () => {
    setLoading(true)
    try {
      const res = await apiProductCategoryMerge({ page: 1, page_size: 10 })

      if (res.status === 200) {
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const getAllProduct = async (params) => {
    setLoading(true)
    setSelectedRowKeys([])
    setProducts([])

    try {
      let res
      //Nếu có filter cửa hàng thì gọi api product store
      if (params.store_id) res = await getProductsStore({ ...params })
      else res = await getProductsBranch({ ...params, branch_id: branchId })
      console.log(res)
      if (res.status === 200) {
        //tính tổng số lượng nếu có variant
        const dataNew = res.data.data.map((e) => {
          let sumCount = 0
          if (e.has_variable)
            e.variants.map(
              (v) =>
                (sumCount += v.available_stock_quantity + v.low_stock_quantity)
            )
          else sumCount = -1

          return { ...e, sumCountVariant: sumCount }
        })

        setProducts([...dataNew])
        setCountProduct(res.data.count)
        setCountProductByStatus({
          all_count: res.data.all_count,
          available_count: res.data.available_count,
          low_count: res.data.low_count,
          out_count: res.data.out_count,
          shipping_count: res.data.shipping_count,
        })
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const loadingAll = async () => {
    try {
      setLoading(true)
      await apiAllSupplierData()
      await apiProductCategoryMergeData()
      await apiAllCategoryData()
      await apiAllWarrantyData()
      await getStores()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    delete paramsFilter.store_id
    if (branchId) getAllProduct({ ...paramsFilter })
  }, [branchId])

  useEffect(() => {
    getAllProduct({ ...paramsFilter })
  }, [paramsFilter])

  useEffect(() => {
    loadingAll()

    if (!localStorage.getItem('columnsProductInventory'))
      localStorage.setItem(
        'columnsProductInventory',
        JSON.stringify(columnsProduct)
      )
  }, [])

  const ModalCreateCategory = ({ reload }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [formCategory] = Form.useForm()

    return (
      <>
        <Permission permissions={[PERMISSIONS.tao_nhom_san_pham]}>
          <Button size="large" onClick={toggle} type="primary">
            Tạo danh mục
          </Button>
        </Permission>
        <Modal
          title="Tạo danh mục"
          centered
          width={500}
          footer={null}
          visible={visible}
          onCancel={toggle}
        >
          <Form layout="vertical" form={formCategory}>
            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>
                  Tên danh mục:
                </div>
              }
              name="name"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input
                size="large"
                placeholder="Nhập tên danh mục"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label={
                <div style={{ color: 'black', fontWeight: '600' }}>Mô tả:</div>
              }
              name="description"
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Form.Item name="default" valuePropName="checked">
                <Checkbox>Chọn làm mặc định</Checkbox>
              </Form.Item>

              <Button
                size="large"
                type="primary"
                onClick={async () => {
                  let isValidated = true
                  try {
                    await formCategory.validateFields()
                    isValidated = true
                  } catch (error) {
                    isValidated = false
                  }

                  if (!isValidated) return
                  const data = formCategory.getFieldsValue()
                  const body = {
                    name: data.name,
                    default: data.default,
                    description: data.description || '',
                  }
                  await apiAddCategoryDataMain(body)
                  await reload()
                  toggle()
                }}
              >
                Tạo
              </Button>
            </Row>
          </Form>
        </Modal>
      </>
    )
  }

  const ViewCategories = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const getCategories = async (params) => {
      try {
        setLoading(true)
        const res = await getCategories(params)
        if (res.status === 200)
          setCategories(res.data.data.filter((e) => e.active))
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    const onSearchProductGroup = (e) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value
        if (value) getCategories({ search: value })
        else getCategories()
      }, 750)
    }

    useEffect(() => {
      getCategories()
    }, [])

    return (
      <>
        <Permission permissions={[PERMISSIONS.nhom_san_pham]}>
          <Button size="large" onClick={toggle} type="primary">
            Xem danh mục
          </Button>
        </Permission>
        <Drawer
          title="Danh mục"
          width={1000}
          onClose={toggle}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
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
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={24}
                lg={11}
                xl={11}
              >
                <Input
                  size="large"
                  style={{ width: '100%' }}
                  name="name"
                  enterButton
                  onChange={onSearchProductGroup}
                  className={styles['orders_manager_content_row_col_search']}
                  placeholder="Tìm kiếm theo mã, theo tên"
                  allowClear
                  autocomplete="off"
                />
              </Col>
              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={24}
                lg={11}
                xl={11}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <ModalCreateCategory reload={getCategories} />
                </div>
              </Col>
            </Row>

            <div
              style={{
                width: '100%',
                marginTop: '1.25rem',
                border: '1px solid rgb(243, 234, 234)',
              }}
            >
              <Table
                size="small"
                columns={columnsCategory}
                dataSource={categories}
                scroll={{ x: 'max-content' }}
                pagination={false}
                loading={loading}
              />
            </div>
          </div>
        </Drawer>
      </>
    )
  }

  const UpdateCategoryProducts = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [categoryId, setCategoryId] = useState()
    const [categoryName, setCategoryName] = useState('')

    useEffect(() => {
      if (!visible) setCategoryId()
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
          <Select
            size="large"
            showSearch
            style={{ width: '100%', marginBottom: 30 }}
            placeholder="Chọn danh mục"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) => {
              setCategoryId(value)

              const category = categories.find((e) => e.category_id === value)
              if (category) setCategoryName(category.name)
            }}
            value={categoryId}
          >
            {categories.map((values, index) => {
              return (
                <Option value={values.category_id} key={index}>
                  {values.name}
                </Option>
              )
            })}
          </Select>
          <Row justify="end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true)
                  const productsSelect = products.filter((product) =>
                    selectedRowKeys.includes(product._id)
                  )

                  const listPromise = productsSelect.map(async (e) => {
                    let res
                    const body = { category_id: categoryId }
                    if (paramsFilter.store_id)
                      res = await updateProductStore(body, e._id)
                    else res = await updateProductBranch(body, e._id)

                    return res
                  })

                  await Promise.all(listPromise)
                  setLoading(false)
                  toggle()
                  await getAllProduct({ ...paramsFilter })
                  notification.success({
                    message: `Cập nhật thành công ${selectedRowKeys.length} sản phẩm vào danh mục ${categoryName}`,
                  })
                } catch (error) {
                  setLoading(false)
                  toggle()
                  console.log(error)
                }
              }}
              type="primary"
              size="large"
            >
              Cập nhật
            </Button>
          </Row>
        </Modal>
      </>
    )
  }

  const deleteProducts = async () => {
    try {
      setLoading(true)
      let res
      if (paramsFilter.store_id) {
        const body = {
          store_id: paramsFilter.store_id,
          products: selectedRowKeys,
        }
        res = await deleteProductStore(body)
      } else {
        const body = {
          branch_id: branchId,
          products: selectedRowKeys,
        }
        res = await deleteProductBranch(body)
      }

      if (res.status === 200) {
        await getAllProduct({ ...paramsFilter })
        setSelectedRowKeys([])
        notification.success({ message: 'Xoá sản phẩm thành công!' })
      } else notification.error({ message: 'Xoá sản phẩm thất bại!' })

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
        onChange={(info) => {
          if (info.file.status !== 'done') info.file.status = 'done'
        }}
        disabled
      >
        {record.image ? (
          <Popover
            style={{ top: 300 }}
            placement="top"
            content={ContentZoomImage(record.image)}
          >
            <img src={record.image} alt="avatar" style={{ width: '100%' }} />
          </Popover>
        ) : (
          <img src={IMAGE_DEFAULT} alt="avatar" style={{ width: '100%' }} />
        )}
      </Upload>
    )
  }

  const ImageProductNotVariable = ({ record }) => {
    return (
      <Space>
        {record.image.map((url) => (
          <Popover content={ContentZoomImage(url)}>
            <div
              style={{
                width: 85,
                maxWidth: 85,
                height: 85,
                maxHeight: 85,
                padding: 8,
                border: '1px solid #d9d9d9',
              }}
            >
              <img
                alt=""
                src={url}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </Popover>
        ))}
      </Space>
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

  const updateActiveProduct = async (body, _id) => {
    try {
      setLoading(true)
      let res
      if (paramsFilter.store_id) res = await updateProductStore(body, _id)
      else res = await updateProductBranch(body, _id)

      if (res.status === 200) {
        await getAllProduct({ ...paramsFilter })
        notification.success({ message: 'Cập nhật thành công!' })
      } else {
        await getAllProduct({ ...paramsFilter })
        notification.error({ message: 'Cập nhật thất bại, vui lòng thử lại!' })
      }

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

  const onChangeStore = async (storeId) => {
    if (storeId) paramsFilter.store_id = storeId
    else delete paramsFilter.store_id

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  const filterProductByStatus = (status) => {
    if (status !== STATUS_PRODUCT.all) paramsFilter.status = status
    else delete paramsFilter.status

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  const onChangeCategoryValue = async (id) => {
    if (id) paramsFilter.category_id = id
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
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
          >
            <h3 style={{ marginBottom: 0 }}>Danh sách sản phẩm</h3>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Space size="large">
                <ViewCategories />
                <Permission permissions={[PERMISSIONS.them_san_pham]}>
                  <Link to={ROUTES.PRODUCT_ADD}>
                    <Button
                      size="large"
                      type="primary"
                      icon={<PlusCircleOutlined />}
                    >
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
              value={paramsFilter.store_id}
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo cửa hàng"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={onChangeStore}
            >
              {stores.map((store, index) => (
                <Option value={store.store_id} key={index}>
                  {store.name}
                </Option>
              ))}
            </Select>
          </Col> */}

          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={24}
            lg={11}
            xl={11}
          >
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
                <Col span={10}>
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
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="name">Tên sản phẩm</Option>
                    <Option value="sku">SKU</Option>
                  </Select>
                </Col>
              </Row>
            </Input.Group>
          </Col>

          <Col
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
              placeholder="Tìm kiếm theo danh mục"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.category_id}
              onChange={onChangeCategoryValue}
            >
              {categories.map((values, index) => {
                return <Option value={values.category_id}>{values.name}</Option>
              })}
            </Select>
          </Col>

          <Col
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
            <div style={{ width: '100%' }}>
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
                placeholder="Tìm kiếm theo thời gian"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
          </Col>
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
            <Button size="large" onClick={onClickClear} type="primary">
              Xóa tất cả lọc
            </Button>
            <SettingColumns
              columnsDefault={columnsProduct}
              nameColumn="columnsProductInventory"
              columns={columns}
              setColumns={setColumns}
            />
          </Space>
        </Row>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <Row style={{ width: '100%', marginBottom: 10 }}>
            <Space size="middle">
              <Permission permission={[PERMISSIONS.tao_phieu_chuyen_hang]}>
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
              </Permission>
              <UpdateCategoryProducts />
              <Permission permission={[PERMISSIONS.xoa_san_pham]}>
                <Popconfirm
                  title="Bạn có muốn xoá các sản phẩm này!"
                  okText="Đồng ý"
                  cancelText="Từ chối"
                  onConfirm={deleteProducts}
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

        <Tabs
          defaultActiveKey="all"
          style={{ width: '100%' }}
          onChange={filterProductByStatus}
        >
          <Tabs.TabPane
            tab={
              <Badge
                offset={[0, -10]}
                count={countProductByStatus.all_count}
                showZero
                overflowCount={10000}
                style={{ backgroundColor: COLOR_STATUS.colorAll }}
              >
                Tất Cả
              </Badge>
            }
            key={STATUS_PRODUCT.all}
          />
          <Tabs.TabPane
            tab={
              <Badge
                offset={[0, -10]}
                count={countProductByStatus.shipping_count}
                showZero
                overflowCount={10000}
                style={{ backgroundColor: COLOR_STATUS.colorShipping }}
              >
                Hàng Vận Chuyển
              </Badge>
            }
            key={STATUS_PRODUCT.shipping_stock}
          />
          <Tabs.TabPane
            tab={
              <Badge
                offset={[0, -10]}
                count={countProductByStatus.available_count}
                showZero
                overflowCount={10000}
                style={{ backgroundColor: COLOR_STATUS.colorAvailable }}
              >
                Hàng Khả Dụng
              </Badge>
            }
            key={STATUS_PRODUCT.available_stock}
          />
          <Tabs.TabPane
            tab={
              <Badge
                offset={[0, -10]}
                count={countProductByStatus.low_count}
                showZero
                overflowCount={10000}
                style={{ backgroundColor: COLOR_STATUS.colorLow }}
              >
                Hàng Số Lượng Thấp
              </Badge>
            }
            key={STATUS_PRODUCT.low_stock}
          />
          <Tabs.TabPane
            tab={
              <Badge
                offset={[0, -10]}
                count={countProductByStatus.out_count}
                showZero
                overflowCount={10000}
                style={{ backgroundColor: COLOR_STATUS.colorOut }}
              >
                Hết Hàng
              </Badge>
            }
            key={STATUS_PRODUCT.out_stock}
          />
        </Tabs>
        <div className={styles['view_product_table']}>
          <Table
            style={{ width: '100%' }}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
            }}
            rowKey="_id"
            expandable={{
              expandedRowRender: (record) => {
                if (record.variants && record.variants.length)
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
                        columns={columnsVariant.map((column) => {
                          if (column.key === 'category')
                            return {
                              ...column,
                              render: () =>
                                record._category && record._category.name,
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
              if (column.key === 'image')
                return {
                  ...column,
                  render: (text, record) =>
                    !record.has_variable && (
                      <ImageProductNotVariable record={record} />
                    ),
                }

              if (column.key === 'name-product')
                return {
                  ...column,
                  render: (text, record) =>
                    record.active ? (
                      <Link
                        to={{ pathname: ROUTES.PRODUCT_ADD, state: record }}
                      >
                        {text}
                      </Link>
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
                  render: (text, record) =>
                    record._category && record._category.name,
                }

              if (column.key === 'sum-count')
                return {
                  ...column,
                  render: (text, record) =>
                    record.has_variable
                      ? record.sumCountVariant
                      : +record.available_stock_quantity +
                        +record.low_stock_quantity,
                }

              if (column.key === 'sale-price')
                return {
                  ...column,
                  render: (text, record) =>
                    record.has_variable
                      ? 'Nhiều'
                      : formatCash(record.sale_price),
                }

              if (column.key === 'import-price')
                return {
                  ...column,
                  render: (text, record) =>
                    record.has_variable
                      ? 'Nhiều'
                      : formatCash(record.import_price),
                }

              if (column.key === 'active')
                return {
                  ...column,
                  render: (text, record) => (
                    <Switch
                      defaultChecked={record.active}
                      onClick={() =>
                        updateActiveProduct(
                          { active: !record.active },
                          record._id
                        )
                      }
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
          />
        </div>
      </div>
    </>
  )
}
