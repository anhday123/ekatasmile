import styles from './../product/product.module.scss'
import { Link, useHistory } from 'react-router-dom'

import {
  Switch,
  Drawer,
  Slider,
  InputNumber,
  Upload,
  Select,
  Form,
  notification,
  Checkbox,
  Dropdown,
  Button,
  Modal,
  Table,
  Input,
  Row,
  Col,
  DatePicker,
  Popover,
  Radio,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES } from 'consts'
import ProductInfo from './components/productInfo'
import { useDispatch } from 'react-redux'
import moment from 'moment'

//icons
import {
  PlusOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons'

//apis
import { apiAllWarranty } from 'apis/warranty'
import { apiAllSupplier } from 'apis/supplier'
import { getAllBranchMain } from 'apis/branch'
import {
  apiAddCategory,
  apiAllCategorySearch,
  apiUpdateCategory,
} from 'apis/category'
import { apiAllInventory } from 'apis/inventory'
import {
  apiUpdateProduct,
  apiProductSeller,
  apiAllProduct,
  apiUpdateProductStore,
  apiProductCategoryMerge,
} from 'apis/product'
import axios from 'axios'

const { RangePicker } = DatePicker
const { Dragger } = Upload
export default function Product() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [page, setPage] = useState(1)
  const [page_size, setPageSize] = useState(20)
  const [paramsFilter, setParamsFilter] = useState({
    merge: false,
  })
  const [supplier, setSupplier] = useState([])
  const [products, setProducts] = useState([])
  const [warranty, setWarranty] = useState([])
  const [modal6Visible, setModal6Visible] = useState(false)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [category, setCategory] = useState([])
  const [viewMode, setViewMode] = useState(0) //0 kho, 1 product seller
  const [visibleCategoryGroupUpdate, setVisibleCategoryGroupUpdate] =
    useState(false)
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [warehouseList, setWarehouseList] = useState([])
  const [branchList, setBranchList] = useState([])
  const history = useHistory()
  const [form] = Form.useForm()

  const showDrawerCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(true)
  }

  const onCloseCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(false)
  }
  const modal6VisibleModal = (modal6Visible) => {
    setModal6Visible(modal6Visible)
  }
  // tạo nhóm sản phẩm
  const onFinishCategory = (values) => {
    const object = {
      name: values.categoryName,
      type: '',
      description: values.categoryDescription ? values.categoryDescription : '',
    }
    apiAddCategoryDataMain(object)
  }
  const [productGroupName, setProductGroupName] = useState('')
  const onChangeGroupProduct = (e) => {
    setProductGroupName(e.target.value)
  }
  const showDrawerGroup = () => {
    setVisibleDrawer(true)
    setSelectedRowKeys([])
  }

  const onCloseGroup = async () => {
    setVisibleDrawer(false)
    setSelectedRowKeys([])
    await apiAllCategoryData()
  }
  const columnsCategory = [
    {
      title: 'Mã nhóm',
      dataIndex: 'category_id',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'address',
    },
    {
      title: 'Người tạo',
      dataIndex: '_creator',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) =>
        text ? moment(text).format('YYYY-MM-DD, HH:mm:ss') : '',
    },
  ]
  const openNotificationSuccessCategoryMain = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Xóa nhóm sản phẩm <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationSuccessCategoryMainSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thêm nhóm sản phẩm thành công.',
    })
  }
  const openNotificationSuccessCategoryMainError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: (
        <div>
          Nhóm sản phẩm <b>{data}</b> đã tồn tại
        </div>
      ),
    })
  }
  const apiAddCategoryDataMain = async (object) => {
    try {
      setLoading(true)
      const res = await apiAddCategory(object)
      if (res.status === 200) {
        await apiAllCategoryData()
        setModal6Visible(false)
        form.resetFields()
        openNotificationSuccessCategoryMainSuccess()
      } else {
        openNotificationSuccessCategoryMainError(object.name)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const apiUpdateCategoryData = async (object, id, data, name) => {
    try {
      setLoading(true)
      const res = await apiUpdateCategory(object, id)
      if (res.status === 200) {
        await apiAllCategoryData()
        setSelectedRowKeysCategory([])
        setSelectedRowKeys([])
        openNotificationSuccessCategoryMain(name)
      }
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
          Cập nhật thông tin nhóm sản phẩm <b>{data}</b> thành công
        </div>
      ),
    })
  }
  // bật - tắt trang thái sản phẩm
  function onChangeSwitchCategory(checked) {
    arrayUpdateCategory &&
      arrayUpdateCategory.length > 0 &&
      arrayUpdateCategory.forEach((values, index) => {
        const object = {
          active: false,
        }

        apiUpdateCategoryData(
          object,
          values.category_id,
          checked ? 1 : 2,
          values.name
        )
      })
  }
  const apiAllCategoryData = async () => {
    try {
      setLoading(true)

      const res = await apiAllCategorySearch({ page: 1, page_size: 10 })
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setCategory([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [modal5Visible, setModal5Visible] = useState(false)
  const modal5VisibleModal = (modal5Visible) => {
    setModal5Visible(modal5Visible)
  }
  const [modal50Visible, setModal50Visible] = useState(false)
  const modal50VisibleModal = (modal50Visible) => {
    setModal50Visible(modal50Visible)
  }

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

  const [checkboxValue, setCheckboxValue] = useState(false)
  function onChangeCheckbox(e) {
    setCheckboxValue(e.target.checked)
  }

  const UploadImg = ({ imageUrl, indexUpdate }) => {
    const [list, setList] = useState('')
    const propsMain = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      async onChange(info) {
        var { status } = info.file
        if (status !== 'done') {
          status = 'done'
          if (status === 'done') {
            if (info.fileList && info.fileList.length > 0) {
              var image
              let formData = new FormData()
              info.fileList.forEach((values, index) => {
                image = values.originFileObj
                formData.append('files', image) //append the values with key, value pair
              })

              if (formData) {
                dispatch({ type: ACTION.LOADING, data: true })
                let a = axios
                  .post(
                    'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                    formData,
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    }
                  )
                  .then((resp) => resp)
                let resultsMockup = await Promise.all([a])
                dispatch({ type: ACTION.LOADING, data: false })
                setList(resultsMockup[0].data.data)

                products.forEach((values, index) => {
                  if (values._id === indexUpdate) {
                    products[index].image = resultsMockup[0].data.data
                  }
                })
              }
            }
          }
        }
      },
      onDrop(e) {},
    }

    return (
      <Row>
        <Dragger
          style={{ width: '10rem', marginBottom: '1.25rem' }}
          {...propsMain}
        >
          {list ? (
            <p
              style={{ marginTop: '1.25rem' }}
              className="ant-upload-drag-icon"
            >
              <img
                src={list[list.length - 1]}
                style={{
                  width: '7.5rem',
                  height: '5rem',
                  objectFit: 'contain',
                }}
                alt=""
              />
            </p>
          ) : (
            <p
              style={{ marginTop: '1.25rem', width: '10rem' }}
              className="ant-upload-drag-icon"
            >
              <PlusOutlined />

              <div>Thêm ảnh</div>
            </p>
          )}
        </Dragger>
        {list && list.length > 0 ? (
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'auto',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {list &&
              list.length > 0 &&
              list.map((values, index) => {
                return (
                  <Popover placement="right" content={() => content(values)}>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        border: '1px solid rgb(230, 220, 220)',
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '1rem',
                        width: '6.5rem',
                        height: '6.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <a href={values} target="_blank">
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                            cursor: 'pointer',
                          }}
                          alt=""
                        />
                      </a>

                      <div className={styles['icon_hover']}></div>
                    </Col>
                  </Popover>
                )
              })}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'auto',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {imageUrl &&
              imageUrl.length > 0 &&
              imageUrl.map((values, index) => {
                return (
                  <Popover placement="right" content={() => content(values)}>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        border: '1px solid rgb(230, 220, 220)',
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '1rem',
                        width: '6.5rem',
                        height: '6.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <a href={values} target="_blank">
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                            cursor: 'pointer',
                          }}
                          alt=""
                        />
                      </a>
                      <div className={styles['icon_hover']}></div>
                    </Col>
                  </Popover>
                )
              })}
          </div>
        )}
      </Row>
    )
  }
  const UploadImgChild = ({ imageUrl, indexUpdate, index20 }) => {
    const [list, setList] = useState('')

    const propsMain = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      async onChange(info) {
        var { status } = info.file
        if (status !== 'done') {
          status = 'done'
          if (status === 'done') {
            console.log(info.file, info.fileList)
            if (info.fileList && info.fileList.length > 0) {
              var image
              var array = []
              let formData = new FormData()
              info.fileList.forEach((values, index) => {
                image = values.originFileObj
                formData.append('files', image) //append the values with key, value pair
              })

              if (formData) {
                dispatch({ type: ACTION.LOADING, data: true })
                let a = axios
                  .post(
                    'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                    formData,
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    }
                  )
                  .then((resp) => resp)
                let resultsMockup = await Promise.all([a])

                dispatch({ type: ACTION.LOADING, data: false })
                setList(resultsMockup[0].data.data)

                products.forEach((values, index) => {
                  if (values._id === indexUpdate) {
                    products[index].variants[index20].image =
                      resultsMockup[0].data.data
                  }
                })
              }
            }
          }
        }
      },
    }
    return (
      <Row>
        <Dragger
          style={{ width: '10rem', marginBottom: '1.25rem' }}
          {...propsMain}
        >
          {list ? (
            <p
              style={{ marginTop: '1.25rem' }}
              className="ant-upload-drag-icon"
            >
              <img
                src={list[list.length - 1]}
                style={{
                  width: '7.5rem',
                  height: '5rem',
                  objectFit: 'contain',
                }}
                alt=""
              />
            </p>
          ) : (
            <p
              style={{ marginTop: '1.25rem', width: '10rem' }}
              className="ant-upload-drag-icon"
            >
              <PlusOutlined />

              <div>Thêm ảnh</div>
            </p>
          )}
        </Dragger>
        {list && list.length > 0 ? (
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'auto',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '10rem',
            }}
          >
            {list &&
              list.length > 0 &&
              list.map((values, index) => {
                return (
                  <Popover placement="right" content={() => content(values)}>
                    <Col
                      xs={24}
                      sm={24}
                      md={16}
                      lg={16}
                      xl={16}
                      style={{
                        border: '1px solid rgb(230, 220, 220)',
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '1rem',
                        width: '6.5rem',
                        height: '6.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <a href={values} target="_blank">
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                            cursor: 'pointer',
                          }}
                          alt=""
                        />
                      </a>
                      <div className={styles['icon_hover']}></div>
                    </Col>
                  </Popover>
                )
              })}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'auto',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {imageUrl &&
              imageUrl.length > 0 &&
              imageUrl.map((values, index) => {
                return (
                  <Popover placement="right" content={() => content(values)}>
                    <Col
                      xs={24}
                      sm={24}
                      md={16}
                      lg={16}
                      xl={16}
                      style={{
                        border: '1px solid rgb(230, 220, 220)',
                        marginTop: '1rem',
                        marginRight: '1rem',
                        padding: '1rem',
                        width: '6.5rem',
                        height: '6.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <a href={values} target="_blank">
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                            cursor: 'pointer',
                          }}
                          alt=""
                        />
                      </a>
                    </Col>
                  </Popover>
                )
              })}
          </div>
        )}
      </Row>
    )
  }

  const [selectedRowKeysCategory, setSelectedRowKeysCategory] = useState([])
  const [arrayUpdateCategory, setArrayUpdateCategory] = useState([])

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []

    products.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })

    setArrayUpdate([...array])

    const array1 = []

    category.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array1.push(values)
        }
      })
    })
    setArrayUpdateCategory([...array1])
  }

  const [categoryProductGroup, setCategoryProductGroup] = useState([])
  const apiAllCategorySearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiAllCategorySearch({
        keyword: value,
      })
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setCategoryProductGroup([...array])
        setCategory([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
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

      setPage(1)

      if (value) {
        paramsFilter[optionSearchName] = value
      } else {
        delete paramsFilter[optionSearchName]
      }

      getAllProduct({ page: 1, page_size, ...paramsFilter })
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }
  const [record, setRecord] = useState({})
  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const { Option } = Select

  const [count, setCount] = useState(0)

  const openNotificationSuccessGroup = () => {
    notification.success({
      message: 'Thành công',
      description: 'Tạo nhóm thành công.',
    })
  }
  const openNotificationSuccessGroupError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tạo nhóm thất bại.',
    })
  }
  const apiAddCategoryData = async (object) => {
    setLoading(true)
    try {
      const res = await apiAddCategory(object)
      if (res.status === 200) {
        await apiAllCategoryData()
        setSelectedRowKeys([])
        setModal5Visible(false)
        openNotificationSuccessGroup()
      } else {
        openNotificationSuccessGroupError()
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
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
      if (viewMode === 1) res = await apiProductSeller(params)
      else res = await apiAllProduct(params)
      console.log(res)
      if (res.status === 200) {
        setProducts([...res.data.data])
        setCount(res.data.count)
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
      await getwarehouse()
      await getBranch()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    getAllProduct({ page: 1, page_size, ...paramsFilter })
  }, [viewMode])

  useEffect(() => {
    loadingAll()
  }, [])
  function formatCash(str) {
    return str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev
      })
  }
  const onClickGroupProduct = () => {
    // productGroupName
    var array = []
    arrayUpdate &&
      arrayUpdate.length > 0 &&
      arrayUpdate.forEach((values, index) => {
        array.push(values.product_id)
      })
    const object = {
      name: productGroupName ? productGroupName : '',
      product_list: [...array],
    }
    console.log(object)
    apiAddCategoryData(object)
  }
  const [productGroupSelect, setProductGroupSelect] = useState()
  const onChangeCategory = async (e) => {
    setPage(1)
    setProductGroupSelect(e)

    if (e) {
      paramsFilter.category = e
    } else {
      delete paramsFilter.category
    }

    getAllProduct({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }
  const openNotificationProductGroupSelectError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa chọn nhóm sản phẩm.',
    })
  }

  const onClickGroupProductSelect = () => {
    // productGroupName
    if (
      productGroupSelect === '' ||
      productGroupSelect === ' ' ||
      productGroupSelect === 'default'
    ) {
      openNotificationProductGroupSelectError()
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          apiUpdateProductMulti(
            { ...values, category: productGroupSelect },
            values.product_id
          )
        })
    }
  }

  const onChangeImage = async (info, index3, record) => {
    if (info.fileList && info.fileList.length > 0) {
      var image

      let formData = new FormData()
      info.fileList.forEach((values, index) => {
        image = values.originFileObj
        formData.append('files', image) //append the values with key, value pair
      })

      if (formData) {
        setLoading(true)
        let a = axios
          .post(
            'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((resp) => resp)
        let resultsMockup = await Promise.all([a])

        setLoading(false)

        var objectFinish = {}

        products.forEach((values, index) => {
          if (values._id === record._id) {
            var array = []
            array = [...products[index].variants[index3].image]

            var result = array.concat(resultsMockup[0].data.data)
            var objectResult = {
              ...products[index].variants[index3],
              image: result.reverse(),
            }
            var arrayFinish = [...values.variants]
            arrayFinish[index3] = objectResult

            objectFinish = { ...values, variants: arrayFinish }
            apiUpdateProductMultiMain(objectFinish, objectFinish.product_id)
          }
        })
      }
    }
  }
  const onChangeImageSimple = async (info, record) => {
    console.log(info)
    if (info.fileList && info.fileList.length > 0) {
      var image

      let formData = new FormData()
      info.fileList.forEach((values, index) => {
        image = values.originFileObj
        formData.append('files', image) //append the values with key, value pair
      })

      if (formData) {
        setLoading(true)
        let a = axios
          .post(
            'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((resp) => resp)
        let resultsMockup = await Promise.all([a])

        setLoading(false)

        products.forEach((values, index) => {
          if (values._id === record._id) {
            var listImage = [...values.image]
            //   listImage.push(resultsMockup[0].data.data[resultsMockup[0].data.data.length - 1])

            var result = listImage.concat(resultsMockup[0].data.data)
            apiUpdateProductMultiMain(
              { ...values, image: result.reverse() },
              values.product_id
            )
          }
        })
      }
    }
  }

  const [valueImage, setValueImage] = useState(20)

  const onChangeHoverImage = (e) => {
    console.log(e)
    setValueImage(e)
    if (e < 20) {
      setValueImage(20)
    } else if (e > 70) {
      setValueImage(70)
    } else {
      setValueImage(e)
    }
  }
  const content = (url) => {
    return (
      <div style={{ zIndex: '999999999' }}>
        <img
          style={{
            zIndex: '999999999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${valueImage}rem`,
            height: `${valueImage - 10}rem`,
            objectFit: 'contain',
          }}
          src={url}
          alt=""
        />
        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            color: 'black',
            fontSize: '1rem',
            fontWeight: '600',
          }}
        >
          Thay đổi kích thước ảnh
        </div>
        <div
          style={{
            backgroundColor: 'grey',
            padding: '0.25rem 0',
            marginTop: '1rem',
          }}
        >
          <Slider
            value={valueImage}
            min={20}
            max={70}
            onChange={onChangeHoverImage}
          />
        </div>
      </div>
    )
  }
  const [indexCheckbox, setIndexCheckbox] = useState([])
  const [skuSelect, setSkuSelect] = useState('')
  const [skuSelectArray, setSkuSelectArray] = useState([])
  const onChangeTypeViewProduct = async (e) => {
    setViewMode(e.target.value)
    setValueSearch('')
    setCategoryValue()
    setStatusName('')
    setAllSelect()
    setSelectedRowKeys([])
    setParamsFilter({ merge: paramsFilter.merge })
  }
  const [arrayCheck, setArrayCheck] = useState([])
  const onChangeCheckboxImage = (
    e,
    index,
    id,
    index3,
    sku,
    indexFinish,
    list
  ) => {
    setSkuSelect(sku)
    if (e.target.checked) {
      var array = [...indexCheckbox]
      array.push(index)
      setIndexCheckbox([...array])

      setArrayCheck([...list])

      var array1 = [...skuSelectArray]
      if (skuSelectArray && skuSelectArray.length > 0) {
        var result = skuSelectArray.findIndex((x) => x.sku === sku)
        if (result === -1) {
          array1.push({ status: e.target.checked, sku: sku })
          setSkuSelectArray([...array1])([...array1])
        }
      } else {
        array1.push({ status: e.target.checked, sku: sku })
        setSkuSelectArray([...array1])([...array1])
      }
    } else {
      var array = [...indexCheckbox]
      indexCheckbox &&
        indexCheckbox.length > 0 &&
        indexCheckbox.forEach((values1, index1) => {
          if (values1 === index) {
            array.splice(index1, 1)
            setIndexCheckbox([...array])
          }
        })

      var array1 = [...skuSelectArray]
      skuSelectArray &&
        skuSelectArray.length > 0 &&
        skuSelectArray.forEach((values1, index1) => {
          if (values1.sku === sku) {
            array1.splice(index1, 1)
            setSkuSelectArray([...array])([...array])
          }
        })
    }
  }
  const [indexCheckboxSimple, setIndexCheckboxSimple] = useState([])
  const [idSelectSimple, setIdSelectSimple] = useState('')
  const onChangeCheckboxImageSimple = (e, index, record) => {
    setIdSelectSimple(record._id)
    if (e.target.checked) {
      var array = [...indexCheckboxSimple]
      array.push(index)
      setIndexCheckboxSimple([...array])
    } else {
      var array = [...indexCheckboxSimple]
      indexCheckboxSimple &&
        indexCheckboxSimple.length > 0 &&
        indexCheckboxSimple.forEach((values1, index1) => {
          if (values1 === index) {
            array.splice(index1, 1)
            setIndexCheckboxSimple([...array])
          }
        })
    }
  }
  const onClickDeleteImageSimple = (index1, record) => {
    var listImage = [...record.image]
    listImage.splice(index1, 1)
    apiUpdateProductMultiMainDelete(
      { ...record, image: listImage },
      record.product_id
    )
  }
  const onClickDeleteImage = (index1, index2, record, list) => {
    var arrayVariant = [...record.variants]
    arrayVariant[index2].image.splice(index1, 1)
    record.variants = arrayVariant
    apiUpdateProductMultiMainDeleteStore(record, record.product_id)
  }
  const onClickDeleteAllImage = (index2, record) => {
    var array = [...arrayCheck]
    indexCheckbox &&
      indexCheckbox.length > 0 &&
      indexCheckbox.forEach((values, index) => {
        var arrayVariant = [...record.variants]
        arrayVariant[index2].image &&
          arrayVariant[index2].image.length > 0 &&
          arrayVariant[index2].image.forEach((values20, index20) => {
            if (values20 === values) {
              arrayVariant[index2].image.splice(index20, 1)
              array.splice(index20, 1)
              record.variants = arrayVariant
            }
          })
      })
    setArrayCheck([...array])
    apiUpdateProductMultiMainDeleteStore(record, record.product_id)
  }
  const onClickDeleteAllImageSimple = (record) => {
    var listImage = [...record.image]
    indexCheckboxSimple &&
      indexCheckboxSimple.length > 0 &&
      indexCheckboxSimple.forEach((values, index) => {
        listImage &&
          listImage.length > 0 &&
          listImage.forEach((values5, index5) => {
            if (values5 === values) {
              listImage.splice(index5, 1)
            }
          })
      })
    apiUpdateProductMultiMainDelete(
      { ...record, image: [...listImage] },
      record.product_id
    )
  }

  const contentProductGroup = (
    <div className={styles['product__group-select']}>
      {categoryProductGroup && categoryProductGroup.length > 0
        ? categoryProductGroup.map((values, index) => {
            return (
              <div onClick={() => onSearchProductGroupMain(values.name)}>
                {values.name}
              </div>
            )
          })
        : category.map((values, index) => {
            return (
              <div onClick={() => onSearchProductGroupMain(values.name)}>
                {values.name}
              </div>
            )
          })}
    </div>
  )
  const funcHoverImageSimple = (record) => {
    return (
      <Row
        style={{
          display: 'flex',
          padding: '0 1rem 1rem 1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            margin: '1rem 0 0 0',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record.name}
        </div>
        <Col
          style={{ width: '100%', marginTop: '1.25rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={11}
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            multiple
            fileList={[]}
            showUploadList={false}
            onChange={(e) => onChangeImageSimple(e, record)}
            // onPreview={onPreview}
          >
            + Upload
          </Upload>
        </Col>

        {record.image &&
          record.image.length > 0 &&
          record.image.map((values1, index1) => {
            return (
              <Popover placement="right" content={() => content(values1)}>
                <Col
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                  className={styles['hover_Image']}
                  style={{
                    border: '1px solid white',
                    padding: '1rem',
                    width: '6.5rem',
                    height: '6.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <img
                    src={values1}
                    style={{
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'contain',
                    }}
                    alt=""
                  />
                  <div className={styles['icon_hover']}>
                    <a href={values1} target="_blank">
                      <EyeOutlined
                        style={{
                          color: 'white',
                          marginTop: '0.25rem',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          marginRight: '0.5rem',
                        }}
                      />
                    </a>
                    <DeleteOutlined
                      onClick={() => onClickDeleteImageSimple(index1, record)}
                      style={{
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                      }}
                    />
                  </div>

                  <Checkbox
                    onChange={(e) =>
                      onChangeCheckboxImageSimple(e, values1, record)
                    }
                    style={{
                      zIndex: '99',
                      top: '0',
                      right: '0',
                      position: 'absolute',
                    }}
                  ></Checkbox>
                </Col>
              </Popover>
            )
          })}
        {idSelectSimple === record._id ? (
          indexCheckboxSimple && indexCheckboxSimple.length > 0 ? (
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <div
                onClick={() => onClickDeleteAllImageSimple(record)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button style={{ width: '12.5rem' }} type="primary" danger>
                  Xóa tất cả ảnh đã chọn
                </Button>
              </div>
            </Col>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </Row>
    )
  }

  const [valueSearchProductGroup, setValueSearchProductGroup] = useState('')
  const onSearchProductGroup = (e) => {
    setValueSearchProductGroup(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiAllCategorySearchData(value)
    }, 300)
    //
  }
  const onSearchProductGroupMain = (e) => {
    setValueSearchProductGroup(e)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      // const value = e.target.value;
      apiAllCategorySearchData(e)
    }, 300)
    //
  }
  const funcHoverImage = (list, index, record, sku) => {
    return (
      <Row
        style={{
          display: 'flex',
          margin: '0 1rem 1rem 1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Col
          style={{ width: '100%', marginBottom: '0.25rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={11}
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            multiple
            showUploadList={false}
            fileList={[]}
            onChange={(e) => onChangeImage(e, index, record)}
            // onPreview={onPreview}
          >
            + Upload
          </Upload>
        </Col>

        {list &&
          list.length > 0 &&
          list.map((values1, index1) => {
            return (
              <Popover placement="right" content={() => content(values1)}>
                <Col
                  xs={24}
                  sm={24}
                  md={11}
                  lg={11}
                  xl={11}
                  className={styles['hover_Image']}
                  style={{
                    border: '1px solid white',
                    padding: '1rem',
                    width: '6.5rem',
                    height: '6.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <img
                    src={values1}
                    style={{
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'contain',
                    }}
                    alt=""
                  />

                  <div className={styles['icon_hover']}>
                    <a href={values1} target="_blank">
                      <EyeOutlined
                        style={{
                          color: 'white',
                          marginTop: '0.25rem',
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          marginRight: '0.5rem',
                        }}
                      />
                    </a>
                    <DeleteOutlined
                      onClick={() =>
                        onClickDeleteImage(index1, index, record, list)
                      }
                      style={{
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                      }}
                    />
                  </div>

                  <Checkbox
                    onChange={(e) =>
                      onChangeCheckboxImage(
                        e,
                        values1,
                        record._id,
                        index,
                        sku,
                        index1,
                        list
                      )
                    }
                    style={{
                      zIndex: '99',
                      top: '0',
                      right: '0',
                      position: 'absolute',
                    }}
                  ></Checkbox>
                </Col>
              </Popover>
            )
          })}

        {skuSelect === sku ? (
          indexCheckbox && indexCheckbox.length > 0 ? (
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <div
                onClick={() => onClickDeleteAllImage(index, record)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button style={{ width: '12.5rem' }} type="primary" danger>
                  Xóa tất cả ảnh đã chọn
                </Button>
              </div>
            </Col>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </Row>
    )
  }
  const columns = [
    {
      title: 'Hình ảnh',
      align: 'center',
      dataIndex: 'image',
      width: 275,
      render: (text, record) => (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record && record.variants && record.variants.length > 0 ? (
            record.variants.map((values, index) => {
              if (values.status === 'shipping_stock') {
                return (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{
                      backgroundColor: '#2F9BFF',
                      width: '100%',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        marginBottom: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        marginTop: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {values.title}:
                    </div>
                    <Row
                      style={{
                        display: 'flex',

                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {funcHoverImage(values.image, index, record, values.sku)}
                    </Row>
                  </Col>
                )
              }
              if (values.status === 'available_stock') {
                return (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{
                      backgroundColor: '#24A700',
                      width: '100%',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        marginBottom: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        marginTop: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {values.title}:
                    </div>
                    <Row
                      style={{
                        display: 'flex',

                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {funcHoverImage(values.image, index, record, values.sku)}
                    </Row>
                  </Col>
                )
              }
              if (values.status === 'low_stock') {
                return (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{
                      backgroundColor: '#A06000',
                      width: '100%',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        marginBottom: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        marginTop: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {values.title}:
                    </div>
                    <Row
                      style={{
                        display: 'flex',

                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {funcHoverImage(values.image, index, record, values.sku)}
                    </Row>
                  </Col>
                )
              }
              if (values.status === 'out_stock') {
                return (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    style={{
                      backgroundColor: '#FE9292',
                      width: '100%',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        color: 'black',
                        marginBottom: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        marginTop: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {values.title}:
                    </div>
                    <Row
                      style={{
                        display: 'flex',

                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {funcHoverImage(values.image, index, record, values.sku)}
                    </Row>
                  </Col>
                )
              }
            })
          ) : record.status === 'shipping_stock' ? (
            <div style={{ backgroundColor: '#2F9BFF' }}>
              {funcHoverImageSimple(record)}
            </div>
          ) : record.status === 'available_stock' ? (
            <div style={{ backgroundColor: '#24A700' }}>
              {funcHoverImageSimple(record)}
            </div>
          ) : record.status === 'low_stock' ? (
            <div style={{ backgroundColor: '#A06000' }}>
              {funcHoverImageSimple(record)}
            </div>
          ) : (
            <div style={{ backgroundColor: '#FE9292' }}>
              {funcHoverImageSimple(record)}
            </div>
          )}
        </Row>
      ),
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantityMain',
      width: 200,
      render: (text, record) =>
        record.variants && record.variants.length > 0 ? (
          record.variants.map((e) => (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {e.title}
              </div>
              {(e.quantity && e.quantity > 0) ||
              (e.available_stock_quantity && e.available_stock_quantity > 0) ? (
                <div
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {(e.quantity && e.quantity <= 0) ||
                  e.available_stock_quantity <= 0 ? (
                    ''
                  ) : (
                    <div
                      style={{
                        marginRight: '0.25rem',
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '1rem',
                      }}
                    >
                      Số lượng:
                    </div>
                  )}

                  <div>
                    {e.quantity && e.quantity > 0
                      ? e.quantity &&
                        e.quantity &&
                        `${formatCash(String(e.quantity))}.`
                      : e.available_stock_quantity > 0
                      ? e.available_stock_quantity &&
                        e.available_stock_quantity &&
                        `${formatCash(String(e.available_stock_quantity))}.`
                      : ''}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {e.low_stock_quantity <= 0 ? (
                    ''
                  ) : (
                    <div
                      style={{
                        marginRight: '0.25rem',
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '1rem',
                      }}
                    >
                      Số lượng:
                    </div>
                  )}

                  <div>
                    {e.low_stock_quantity > 0
                      ? e.low_stock_quantity &&
                        `${formatCash(String(e.low_stock_quantity))}.`
                      : ''}
                  </div>
                </div>
              )}
            </>
          ))
        ) : (
          <>
            {(record.quantity && record.quantity > 0) ||
            (record.available_stock_quantity &&
              record.available_stock_quantity > 0) ? (
              <div
                style={{
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    marginRight: '0.25rem',
                    color: 'black',
                    fontWeight: '600',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {record.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {record.available_stock_quantity <= 0 ? (
                    ''
                  ) : (
                    <div
                      style={{
                        marginRight: '0.25rem',
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '1rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      Số lượng:
                    </div>
                  )}

                  <div>
                    {record.available_stock_quantity > 0
                      ? record.available_stock_quantity &&
                        `${formatCash(
                          String(record.available_stock_quantity)
                        )}.`
                      : ''}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    marginRight: '0.25rem',
                    color: 'black',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {statusName !== ''
                    ? record && record.variants && record.variants.length === 0
                      ? record.title
                      : record.name
                    : record.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {record.low_stock_quantity <= 0 ? (
                    ''
                  ) : (
                    <div
                      style={{
                        marginRight: '0.25rem',
                        color: 'black',
                        fontWeight: '600',
                        fontSize: '1rem',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      Số lượng:
                    </div>
                  )}

                  <div>
                    {record.low_stock_quantity > 0
                      ? record.low_stock_quantity &&
                        `${formatCash(String(record.low_stock_quantity))}.`
                      : ''}
                  </div>
                </div>
              </div>
            )}
          </>
        ),
    },

    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      render: (text, record) => (
        <div
          onClick={() => modal2VisibleModalMain(true, record)}
          style={{ color: '#0036F3', cursor: 'pointer' }}
        >
          {text ? text.toUpperCase() : ''}
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 250,
      render: (text, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          {record && record.variants && record.variants.length > 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {record.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                Phiên bản:
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                {record && record.variants && record.variants.length > 0
                  ? record &&
                    record.variants.map((values, index) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            marginBottom: '0.5rem',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >{`${values.title}.`}</div>
                      )
                    })
                  : ''}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '0.5rem',
                alignItems: 'center',
                width: '100%',
                color: 'black',
                fontWeight: '600',
              }}
            >
              {record.name}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'category',
      width: 125,
      render: (text, record) => text.name,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusMain',
      width: 250,
      render: (text, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          {record && record.variants && record.variants.length > 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                {record && record.variants && record.variants.length > 0
                  ? record &&
                    record.variants.map((values, index) => {
                      if (values.status === 'available_stock') {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >{`${values.title}.`}</div>
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                textTransform: 'capitalize',
                                fontWeight: '600',
                              }}
                            >{`${values.status}`}</div>
                          </div>
                        )
                      } else if (values.status === 'low_stock') {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >{`${values.title}.`}</div>
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                textTransform: 'capitalize',
                                fontWeight: '600',
                              }}
                            >{`${values.status}`}</div>
                          </div>
                        )
                      } else if (values.status === 'out_stock') {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >{`${values.title}.`}</div>
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                textTransform: 'capitalize',
                                fontWeight: '600',
                              }}
                            >{`${values.status}`}</div>
                          </div>
                        )
                      } else {
                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%',
                              flexDirection: 'column',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >{`${values.title}.`}</div>
                            <div
                              style={{
                                display: 'flex',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                textTransform: 'capitalize',
                                fontWeight: '600',
                              }}
                            >{`${values.status}`}</div>
                          </div>
                        )
                      }
                    })
                  : ''}
              </div>
            </div>
          ) : record.status === 'available_stock' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {record.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}
              >{`${record.status}`}</div>
            </div>
          ) : record.status === 'low_stock' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {record.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}
              >{`${record.status}`}</div>
            </div>
          ) : record.status === 'out_stock' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {record.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}
              >{`${record.status}`}</div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                {record.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: '0.5rem',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}
              >{`${record.status}`}</div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'sale_price',
      width: 250,
      render: (text, record) =>
        record.variants && record.variants.length > 0 ? (
          record.variants.map((e) => (
            <>
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                {e.title}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                {e.sale_price &&
                  `${formatCash(String(e.sale_price))} VNĐ (giá bán),`}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                {e.base_price &&
                  `${formatCash(String(e.base_price))} VNĐ (giá cơ bản).`}
              </div>
            </>
          ))
        ) : (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              {record.sale_price &&
                `${formatCash(String(record.sale_price))} VNĐ (giá bán),`}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              {record.base_price &&
                `${formatCash(String(record.base_price))} VNĐ (giá cơ bản).`}
            </div>
          </>
        ),
    },

    {
      title: 'Ngày nhập',
      dataIndex: 'create_date',
      width: 150,
      render(data) {
        return moment(data).format('DD-MM-YYYY')
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'suppliers',
      width: 200,
      render: (text, record) => <div>{text.name}</div>,
    },
    {
      title: 'Kho',
      dataIndex: 'warehouse',
      width: 200,
      render: (text, record) => <div>{text ? text.name : ''}</div>,
    },
    {
      title: 'Mở bán',
      // fixed: 'right',
      dataIndex: 'active',
      width: 100,
      render: (text, record) =>
        text ? (
          <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        ),
    },
  ]

  const onClickClear = async () => {
    await getAllProduct({ page: 1, page_size })
    setValueSearch('')
    setStatusName('')
    setCategoryValue()
    setAllSelect()
    setSelectedRowKeys([])
    setParamsFilter({})
  }

  const openNotificationSuccessStoreDelete = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        data === 2 ? 'Sản phẩm đã ngừng bán.' : 'Sản phẩm đã bán lại',
    })
  }
  const openNotificationSuccessStoreDeleteError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Cập nhật trạng thái thất bại.',
    })
  }
  const openNotificationSuccessUpdateProduct = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Cập nhật thông tin sản phẩm <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationSuccessUpdateProductError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tên sản phẩm hoặc sku đã tồn tại.',
    })
  }

  const openNotificationSuccessUpdateProductMainDelete = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Xóa ảnh sản phẩm <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const apiUpdateProductMultiMainDeleteStore = async (object, id) => {
    try {
      setLoading(true)
      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        if (res.status === 200) {
          setIndexCheckbox([])

          setSkuSelectArray([])
          setIndexCheckboxSimple([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          setIndexCheckbox([])

          setIndexCheckboxSimple([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
        }
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const apiUpdateProductMultiMainDelete = async (object, id) => {
    try {
      setLoading(true)
      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        if (res.status === 200) {
          if (
            statusName !== '' ||
            statusName !== ' ' ||
            statusName !== 'default'
          ) {
            await getAllProduct({
              status: statusName,
              page,
              page_size,
              ...paramsFilter,
            })
          } else {
          }

          setIndexCheckbox([])

          setSkuSelectArray([])
          setIndexCheckboxSimple([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          if (
            statusName !== '' ||
            statusName !== ' ' ||
            statusName !== 'default'
          ) {
            await getAllProduct({
              status: statusName,
              page,
              page_size,
              ...paramsFilter,
            })
          } else {
          }
          setIndexCheckbox([])

          setIndexCheckboxSimple([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
        }
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const apiUpdateProductMultiMain = async (object, id) => {
    try {
      setLoading(true)

      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)

        if (res.status === 200) {
          if (
            statusName !== '' ||
            statusName !== ' ' ||
            statusName !== 'default' ||
            typeof statusName !== 'undefined'
          ) {
            await getAllProduct({
              status: statusName,
              page,
              page_size,
              ...paramsFilter,
            })
          } else {
          }
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          if (
            statusName !== '' ||
            statusName !== ' ' ||
            statusName !== 'default'
          ) {
            await getAllProduct({
              status: statusName,
              page,
              page_size,
              ...paramsFilter,
            })
          }
        }
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const apiUpdateProductMulti = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      // console.log(value);
      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        if (res.status === 200) {
          setSelectedRowKeys([])
          setModal50Visible(false)
          openNotificationSuccessUpdateProduct(object.name)
          setCheckboxValue(false)
        } else {
          openNotificationSuccessUpdateProductError()
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          setSelectedRowKeys([])
          openNotificationSuccessUpdateProduct(object.name)
          setModal50Visible(false)
          setCheckboxValue(false)
        } else {
          openNotificationSuccessUpdateProductError()
        }
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const apiUpdateProductData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await apiUpdateProduct(object, id)
      console.log(res)
      if (res.status === 200) {
        setSelectedRowKeys([])
        openNotificationSuccessStoreDelete(data)
      } else {
        openNotificationSuccessStoreDeleteError()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  function onChangeSwitch(checked, record) {
    apiUpdateProductData(
      { ...record, active: checked },
      record.product_id,
      checked ? 1 : 2
    )
  }

  const openNotificationNumber = (data) => {
    notification.error({
      message: 'Thất bại',
      description: `${data} phải là số.`,
    })
  }
  const openNotificationErrorCategory = (data) => {
    notification.error({
      message: 'Thất bại',
      description: `Bạn chưa nhập ${data} nhóm sản phẩm.`,
    })
  }
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          apiUpdateProductMulti({ ...values }, values.product_id)
        })
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          console.log(values)
          if (values && values.attributes && values.attributes.length > 0) {
            if (
              values.length === '' &&
              values.width === '' &&
              values.height === '' &&
              values.weight === '' &&
              values.unit === ''
            ) {
              if (
                isNaN(values.regular_price) ||
                isNaN(values.sale_price) ||
                isNaN(values.import_price) ||
                isNaN(values.quantity)
              ) {
                if (isNaN(values.provideQuantity)) {
                  openNotificationNumber('Số lượng cung cấp')
                }
              } else {
                var array = []
                values &&
                  values.suppliers &&
                  values.suppliers.length > 0 &&
                  values.suppliers.forEach((values10, index10) => {
                    array.push(values10.supplier_id)
                  })
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: '',
                  category:
                    typeof arrayUpdate[0].category === 'object'
                      ? arrayUpdate[0].category.category_id
                      : arrayUpdate[0].category,
                  image: [],
                  length: 0,
                  width: 0,
                  height: 0,
                  weight: 0,
                  warranty: [],
                  quantity: 0,
                  unit: '',
                  has_variable: true,
                  suppliers:
                    arrayUpdate[0] && arrayUpdate[0].suppliers ? array : [],
                  variants: arrayUpdate[0].variants,
                  attributes: arrayUpdate[0].attributes,
                }
                apiUpdateProductMulti(object, values.product_id)
              }
            } else {
              if (
                (values.length && isNaN(values.length)) ||
                (values.width && isNaN(values.width)) ||
                (values.height && isNaN(values.height)) ||
                (values.weight && isNaN(values.weight)) ||
                isNaN(values.quantity)
              ) {
                if (values.length && isNaN(values.length)) {
                  openNotificationNumber('Chiều dài')
                }
                if (values.width && isNaN(values.width)) {
                  openNotificationNumber('Chiều rộng')
                }
                if (values.height && isNaN(values.height)) {
                  openNotificationNumber('Chiều cao')
                }
                if (values.weight && isNaN(values.weight)) {
                  openNotificationNumber('Cân nặng')
                }
                if (isNaN(values.quantity)) {
                  openNotificationNumber('Số lượng cung cấp')
                }
              } else {
                var array = []
                arrayUpdate[0] &&
                  arrayUpdate[0].suppliers &&
                  arrayUpdate[0].suppliers.length > 0 &&
                  arrayUpdate[0].suppliers.forEach((values10, index10) => {
                    array.push(values10.supplier_id)
                  })
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: '',
                  category:
                    typeof arrayUpdate[0].category === 'object'
                      ? arrayUpdate[0].category.category_id
                      : arrayUpdate[0].category,
                  image: [],
                  length: arrayUpdate[0].length,
                  width: arrayUpdate[0].width,
                  height: arrayUpdate[0].height,
                  weight: arrayUpdate[0].weight,
                  warranty: [],
                  quantity: 0,
                  unit: '',
                  has_variable: true,
                  suppliers:
                    arrayUpdate[0] && arrayUpdate[0].suppliers ? array : [],
                  variants: arrayUpdate[0].variants,
                  attributes: arrayUpdate[0].attributes,
                }
                console.log(object)
                console.log('|||000111')
                apiUpdateProductMulti(object, values.product_id)
              }
            }
          } else {
            if (
              values.length === '' &&
              values.width === '' &&
              values.height === '' &&
              values.weight === '' &&
              values.unit === ''
            ) {
              if (
                isNaN(values.regular_price) ||
                isNaN(values.sale_price) ||
                isNaN(values.import_price) ||
                isNaN(values.quantity)
              ) {
                if (isNaN(values.provideQuantity)) {
                  openNotificationNumber('Số lượng cung cấp')
                }
              } else {
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: arrayUpdate[0].barcode,
                  category:
                    typeof arrayUpdate[0].category === 'object'
                      ? arrayUpdate[0].category.category_id
                      : arrayUpdate[0].category,
                  image: arrayUpdate[0].image,
                  length: 0,
                  width: 0,
                  height: 0,
                  weight: 0,
                  warranty:
                    arrayUpdate[0] && arrayUpdate[0].warranty
                      ? arrayUpdate[0].warranty[-1]
                      : arrayUpdate[0].warranty,
                  quantity: arrayUpdate[0].quantity,
                  unit: arrayUpdate[0].unit,
                  has_variable: false,
                  suppliers:
                    arrayUpdate[0] && arrayUpdate[0].suppliers
                      ? arrayUpdate[0].suppliers[-1]
                      : arrayUpdate[0].suppliers,
                  regular_price: arrayUpdate[0].regular_price,
                  sale_price: arrayUpdate[0].sale_price,
                }
                console.log(object)
                console.log('|||000111')
                apiUpdateProductMulti(object, values.product_id)
              }
            } else {
              if (
                (values.length && isNaN(values.length)) ||
                (values.width && isNaN(values.width)) ||
                (values.height && isNaN(values.height)) ||
                (values.weight && isNaN(values.weight)) ||
                isNaN(values.quantity)
              ) {
                if (values.length && isNaN(values.length)) {
                  openNotificationNumber('Chiều dài')
                }
                if (values.width && isNaN(values.width)) {
                  openNotificationNumber('Chiều rộng')
                }
                if (values.height && isNaN(values.height)) {
                  openNotificationNumber('Chiều cao')
                }
                if (values.weight && isNaN(values.weight)) {
                  openNotificationNumber('Cân nặng')
                }
                if (isNaN(values.quantity)) {
                  openNotificationNumber('Số lượng cung cấp')
                }
              } else {
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: arrayUpdate[0].barcode,
                  image: arrayUpdate[0].image,
                  length: arrayUpdate[0].length,
                  width: arrayUpdate[0].width,
                  height: arrayUpdate[0].height,
                  weight: arrayUpdate[0].weight,
                  regular_price: arrayUpdate[0].regular_price,
                  sale_price: arrayUpdate[0].sale_price,
                  warranty:
                    arrayUpdate[0] && arrayUpdate[0].warranty
                      ? arrayUpdate[0].warranty[-1]
                      : arrayUpdate[0].warranty,
                  quantity: arrayUpdate[0].quantity,
                  unit:
                    arrayUpdate[0] && arrayUpdate[0].unit
                      ? arrayUpdate[0].unit
                      : '',

                  category:
                    typeof arrayUpdate[0].category === 'object'
                      ? arrayUpdate[0].category.category_id
                      : arrayUpdate[0].category,
                  suppliers:
                    arrayUpdate[0] &&
                    arrayUpdate[0].suppliers &&
                    arrayUpdate[0].suppliers
                      ? arrayUpdate[0].suppliers[-1]
                      : arrayUpdate[0].suppliers,
                  has_variable: false,
                }
                console.log(object)
                console.log('|||000111')
                apiUpdateProductMulti(object, values.product_id)
              }
            }
          }
        })
    }
  }
  const onCloseUpdateFuncCategory = () => {
    arrayUpdateCategory &&
      arrayUpdateCategory.length > 0 &&
      arrayUpdateCategory.forEach((values, index) => {
        if (
          values.name === '' ||
          values.name === ' ' ||
          values.name === 'default'
        ) {
          if (
            values.name === '' ||
            values.name === ' ' ||
            values.name === 'default'
          ) {
            openNotificationErrorCategory('tên')
          }
        } else {
          const object = {
            name: values.name,
            type: '',
            description: values.description ? values.description : '',
          }
          apiUpdateCategoryDataUpdate(object, values.category_id)
        }
      })
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

  const [statusName, setStatusName] = useState('')

  const [optionSearchName, setOptionSearchName] = useState('name')

  const getwarehouse = async () => {
    try {
      const res = await apiAllInventory()
      if (res.status == 200) {
        setWarehouseList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getBranch = async () => {
    try {
      const res = await getAllBranchMain()
      if (res.status == 200) {
        setBranchList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const [allSelect, setAllSelect] = useState()
  const onChangeAllSelect = async (e) => {
    setAllSelect(e)
    setPage(1)

    if (e) {
      if (viewMode) {
        paramsFilter.branch = e
      } else {
        paramsFilter.warehouse = e
      }
    } else {
      delete paramsFilter.branch
      delete paramsFilter.warehouse
    }

    getAllProduct({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }

  const apiUpdateCategoryDataUpdate = async (object, id) => {
    try {
      setLoading(true)
      const res = await apiUpdateCategory(object, id)
      if (res.status === 200) {
        await apiAllCategoryData()
        setSelectedRowKeysCategory([])
        setSelectedRowKeys([])

        openNotificationSuccessStoreUpdate(object.name)
        onCloseCategoryGroupUpdate()
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const filterProductByStatus = (data) => {
    if (data) paramsFilter.status = data
    else {
      delete paramsFilter.status
    }
    setStatusName(data)
    getAllProduct({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }
  const [categoryValue, setCategoryValue] = useState()
  const onChangeCategoryValue = async (id) => {
    if (id) {
      paramsFilter.category = id
    } else {
      delete paramsFilter.category
    }

    getAllProduct({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
    setCategoryValue(id)
  }

  return (
    <>
      <div>
        <div className={styles['view_product']}>
          <Row
            style={{
              display: 'flex',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgb(236, 228, 228)',
              justifyContent: 'space-between',
              width: '100%',
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
              <div className={styles['view_product_back']}>
                <div className={styles['view_product_back_title']}>
                  Danh sách sản phẩm
                </div>
              </div>
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
                <div
                  style={{
                    display: 'flex',
                    marginRight: '1rem',
                    marginTop: '1rem',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    onClick={showDrawerGroup}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  >
                    Nhóm sản phẩm
                  </Button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '1rem',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Link to={ROUTES.PRODUCT_ADD}>
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                      Thêm sản phẩm
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginTop: 20 }}>
            <Radio.Group
              defaultValue={viewMode}
              onChange={(e) => onChangeTypeViewProduct(e)}
            >
              <Radio style={{ marginBottom: '0.5rem' }} value={0}>
                Xem theo Kho
              </Radio>
              <Radio value={1}>Xem theo chi nhánh</Radio>
            </Radio.Group>
          </Row>

          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
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
                value={allSelect}
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder={!viewMode ? `Chọn kho` : 'Chọn chi nhánh'}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={onChangeAllSelect}
              >
                {!viewMode
                  ? warehouseList.map((e) => (
                      <Option value={e.warehouse_id}>{e.name}</Option>
                    ))
                  : branchList.map((e) => (
                      <Option value={e.branch_id}>{e.name}</Option>
                    ))}
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
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn nhóm sản phẩm"
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={categoryValue}
                onChange={onChangeCategoryValue}
              >
                {category.map((values, index) => {
                  return (
                    <Option value={values.category_id}>{values.name}</Option>
                  )
                })}
              </Select>
            </Col>

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
                      style={{ width: '100%' }}
                      name="name"
                      value={valueSearch}
                      onChange={onSearch}
                      className={
                        styles['orders_manager_content_row_col_search']
                      }
                      placeholder="Tìm kiếm theo mã, theo tên"
                      allowClear
                    />
                  </Col>
                  <Col span={10}>
                    <Select
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
              <div style={{ width: '100%' }}>
                <Select
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
                  placeholder="Lọc theo thời gian"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  value={valueTime}
                  onChange={async (value) => {
                    setValueTime(value)

                    //khi search hoac filter thi reset page ve 1
                    setPage(1)

                    //xoa params search date hien tai
                    const p = Object.keys(valueDateTimeSearch)
                    if (p.length) delete paramsFilter[p[0]]

                    setValueDateSearch(null)
                    delete paramsFilter.startDate
                    delete paramsFilter.endDate

                    if (isOpenSelect) toggleOpenSelect()

                    if (value) {
                      const searchDate = Object.fromEntries([[value, true]]) // them params search date moi
                      getAllProduct({
                        page: 1,
                        page_size,
                        ...paramsFilter,
                        ...searchDate,
                      })
                      setParamsFilter({ ...paramsFilter, ...searchDate })
                      setValueDateTimeSearch({ ...searchDate })
                    } else {
                      getAllProduct({ page: 1, page_size, ...paramsFilter })
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
                          setPage(1)

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

                          getAllProduct({
                            page: 1,
                            page_size,
                            ...paramsFilter,
                          })
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
            justify="space-between"
            style={{
              marginTop: '30px',
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Radio.Group
              onChange={(e) => {
                setPage(1)
                const checked = e.target.value
                paramsFilter.merge = checked
                setParamsFilter({ ...paramsFilter })
                getAllProduct({ page: 1, page_size, ...paramsFilter })
              }}
              value={paramsFilter.merge}
            >
              <Radio value={false}>Hiện thị đơn</Radio>
              <Radio value={true}>Hiện thị gộp</Radio>
            </Radio.Group>
            <Button
              onClick={onClickClear}
              type="primary"
              style={{ width: '7.5rem' }}
            >
              Xóa tất cả lọc
            </Button>
          </Row>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Row style={{ width: '100%', marginBottom: 10 }}>
              <Button
                onClick={() => {
                  history.push({
                    pathname: ROUTES.SHIPPING_PRODUCT_ADD,
                    state: arrayUpdate,
                  })
                }}
                type="primary"
              >
                Tạo phiếu chuyển hàng
              </Button>
              <Button
                style={{ marginLeft: '1rem' }}
                onClick={() => modal5VisibleModal(true)}
                type="primary"
              >
                Tạo nhóm sản phẩm
              </Button>
              <Button
                style={{ marginLeft: '1rem' }}
                onClick={() => modal50VisibleModal(true)}
                type="primary"
              >
                Cập nhật nhóm sản phẩm
              </Button>
            </Row>
          ) : (
            ''
          )}
          <Row
            style={{
              width: '100%',
              backgroundColor: 'rgb(235, 224, 224)',
              marginTop: '0.25rem',
              padding: '0.5rem 1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              onClick={() => filterProductByStatus('')}
              style={{
                cursor: 'pointer',
                marginRight: 30,
                fontSize: '1rem',
                fontWeight: '600',
                color: !statusName && 'orange',
              }}
            >
              All &nbsp;
            </div>

            <span
              style={{
                width: 12,
                height: 12,
                background: 'rgba(47, 155, 255, 1)',
                marginRight: 5,
                marginTop: '0.45rem',
              }}
            ></span>
            <div
              style={{
                cursor: 'pointer',
                color:
                  statusName === 'shipping_stock' && 'rgba(47, 155, 255, 1)',
                marginRight: 30,
                fontSize: '1rem',
                fontWeight: '600',
              }}
              onClick={() => filterProductByStatus('shipping_stock')}
            >
              Shipping stock
            </div>

            <span
              style={{
                width: 12,
                height: 12,
                background: '#24A700',
                marginRight: 5,
                marginTop: '0.45rem',
              }}
            ></span>
            <div
              style={{
                cursor: 'pointer',
                color: statusName === 'available_stock' && '#24A700',
                marginRight: 30,
                fontSize: '1rem',
                fontWeight: '600',
              }}
              onClick={() => filterProductByStatus('available_stock')}
            >
              Available stock
            </div>

            <span
              style={{
                width: 12,
                height: 12,
                background: '#A06000',
                marginRight: 5,
                marginTop: '0.45rem',
              }}
            ></span>
            <div
              style={{
                cursor: 'pointer',
                marginRight: 30,
                fontSize: '1rem',
                fontWeight: '600',
                color: statusName === 'low_stock' && '#A06000',
              }}
              onClick={() => filterProductByStatus('low_stock')}
            >
              Low stock
            </div>

            <span
              style={{
                width: 12,
                height: 12,
                background: 'rgba(254, 146, 146, 1)',
                marginRight: 5,
                marginTop: '0.45rem',
              }}
            ></span>
            <div
              style={{
                cursor: 'pointer',
                marginRight: 30,
                fontSize: '1rem',
                fontWeight: '600',
                color: statusName === 'out_stock' && 'rgba(254, 146, 146, 1)',
              }}
              onClick={() => filterProductByStatus('out_stock')}
            >
              Out stock
            </div>
          </Row>

          <div className={styles['view_product_table']}>
            <Table
              rowSelection={rowSelection}
              bordered
              rowKey="_id"
              columns={columns}
              loading={loading}
              dataSource={products}
              scroll={{ x: 'max-content' }}
              size="small"
              pagination={{
                position: ['bottomLeft'],
                current: page,
                defaultPageSize: 20,
                pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
                showQuickJumper: true,
                onChange: (page, pageSize) => {
                  setSelectedRowKeys([])
                  setPage(page)
                  setPageSize(pageSize)
                  getAllProduct({ page, page_size: pageSize, ...paramsFilter })
                },
                total: count,
              }}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Tạo nhóm sản phẩm"
        centered
        width={700}
        footer={null}
        visible={modal5Visible}
        onOk={() => modal5VisibleModal(false)}
        onCancel={() => modal5VisibleModal(false)}
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
          <div
            style={{
              display: 'flex',
              marginBottom: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'black',
                fontSize: '1rem',
                fontWeight: '600',
                width: '10rem',
              }}
            >
              Nhóm sản phẩm:
            </div>
            <div style={{ marginLeft: '1rem', width: '100%' }}>
              <Input
                style={{ width: '100%' }}
                onChange={onChangeGroupProduct}
                placeholder="Nhập tên nhóm sản phẩm"
              />
            </div>
          </div>
          {arrayUpdate &&
            arrayUpdate.length > 0 &&
            arrayUpdate.map((values, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '1rem',
                    borderBottom: '1px solid rgb(235, 226, 226)',
                    paddingBottom: '1rem',
                  }}
                >
                  {values.name}
                </div>
              )
            })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            onClick={onClickGroupProduct}
            type="primary"
            style={{ width: '7.5rem' }}
          >
            Tạo
          </Button>
        </div>
      </Modal>

      <Modal
        title="Cập nhật nhóm sản phẩm"
        centered
        width={700}
        footer={null}
        visible={modal50Visible}
        onOk={() => modal50VisibleModal(false)}
        onCancel={() => modal50VisibleModal(false)}
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
          <div
            style={{
              display: 'flex',
              marginBottom: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <div style={{ width: '100%' }}>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn nhóm sản phẩm"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={onChangeCategory}
                value={productGroupSelect}
              >
                {category.map((values, index) => {
                  return (
                    <Option value={values.category_id}>{values.name}</Option>
                  )
                })}
              </Select>
            </div>
          </div>
          {arrayUpdate &&
            arrayUpdate.length > 0 &&
            arrayUpdate.map((values, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '1rem',
                    borderBottom: '1px solid rgb(235, 226, 226)',
                    paddingBottom: '1rem',
                  }}
                >
                  {values.name}
                </div>
              )
            })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            onClick={onClickGroupProductSelect}
            type="primary"
            style={{ width: '7.5rem' }}
          >
            Cập nhật
          </Button>
        </div>
      </Modal>

      <ProductInfo
        record={record}
        modal2Visible={modal2Visible}
        modal2VisibleModal={modal2VisibleModal}
        warranty={warranty}
      />

      <Drawer
        title="Nhóm sản phẩm"
        width={1000}
        onClose={onCloseGroup}
        visible={visibleDrawer}
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
              <div style={{ width: '100%' }}>
                <Dropdown
                  style={{ width: '100' }}
                  trigger={['click']}
                  overlay={contentProductGroup}
                >
                  <Input
                    style={{ width: '100%' }}
                    name="name"
                    value={valueSearchProductGroup}
                    enterButton
                    onChange={onSearchProductGroup}
                    className={styles['orders_manager_content_row_col_search']}
                    placeholder="Tìm kiếm theo mã, theo tên"
                    allowClear
                    autocomplete="off"
                  />
                </Dropdown>
              </div>
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
                <Button
                  onClick={() => modal6VisibleModal(true)}
                  style={{ width: '10rem' }}
                  type="primary"
                >
                  Tạo nhóm sản phẩm
                </Button>
              </div>
            </Col>
          </Row>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Row style={{ width: '100%', marginTop: 20 }}>
              <Button
                onClick={showDrawerCategoryGroupUpdate}
                type="primary"
                style={{ marginRight: '1rem' }}
              >
                Cập nhật nhóm sản phẩm
              </Button>
              <Button
                onClick={onChangeSwitchCategory}
                danger
                type="primary"
                style={{ marginRight: '1rem' }}
              >
                Xóa
              </Button>
            </Row>
          ) : (
            ''
          )}
          <div
            style={{
              width: '100%',
              marginTop: '1.25rem',
              border: '1px solid rgb(243, 234, 234)',
            }}
          >
            <Table
              rowKey="_id"
              loading={loading}
              rowSelection={rowSelection}
              bordered
              columns={columnsCategory}
              dataSource={category}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </Drawer>

      <Modal
        title="Tạo nhóm sản phẩm"
        centered
        width={500}
        footer={null}
        visible={modal6Visible}
        onOk={() => modal6VisibleModal(false)}
        onCancel={() => modal6VisibleModal(false)}
      >
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinishCategory}
          layout="vertical"
          form={form}
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
              lg={24}
              xl={24}
            >
              <div>
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tên nhóm sản phẩm:
                    </div>
                  }
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="categoryName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tên nhóm sản phẩm" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
            className={styles['supplier_add_content_supplier_button']}
          >
            <Col
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              xs={24}
              sm={24}
              md={5}
              lg={4}
              xl={3}
            >
              <Form.Item>
                <Button
                  style={{ width: '7.5rem' }}
                  type="primary"
                  htmlType="submit"
                >
                  Tạo nhóm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title="Cập nhật nhóm sản phẩm"
        width={500}
        onClose={onCloseCategoryGroupUpdate}
        visible={visibleCategoryGroupUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onCloseUpdateFuncCategory} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {arrayUpdateCategory &&
          arrayUpdateCategory.length > 0 &&
          arrayUpdateCategory.map((values, index) => {
            const obj = Object.keys(values)
            return (
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {obj.map((data) => {
                  if (data === 'name') {
                    const InputName = () => (
                      <Input
                        style={{ width: '100%' }}
                        placeholder="Nhập tên nhóm"
                        defaultValue={values[data]}
                        onChange={(event) => {
                          arrayUpdateCategory[index].name = event.target.value
                        }}
                      />
                    )
                    return (
                      <Col
                        style={{ width: '100%', marginTop: '1rem' }}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div>
                          <div
                            style={{
                              color: 'black',
                              fontWeight: '600',
                              marginBottom: '0.5rem',
                            }}
                          >
                            <b style={{ color: 'red' }}>*</b>Tên nhóm sản phẩm:
                          </div>
                          <InputName />
                        </div>
                      </Col>
                    )
                  }
                })}
              </Row>
            )
          })}
      </Drawer>
    </>
  )
}
