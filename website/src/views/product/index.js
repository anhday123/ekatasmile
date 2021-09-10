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
  Space,
  Popconfirm,
  Tabs,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES, PERMISSIONS } from 'consts'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

//components
import ProductInfo from './components/productInfo'
import Permission from 'components/permission'
import SettingColumns from 'components/setting-column'
import columnsProduct from 'views/product/columns'

//icons
import {
  DeleteOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'

//apis
import { apiAllWarranty } from 'apis/warranty'
import { apiAllSupplier } from 'apis/supplier'
import { getAllBranchMain } from 'apis/branch'
import { getAllStore } from 'apis/store'
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
  getProductsBranch,
  updateProductBranch,
  updateProductStore,
  getProductsStore,
} from 'apis/product'
import { uploadFiles, uploadFile } from 'apis/upload'
import { compare } from 'utils'

const { RangePicker } = DatePicker
export default function Product() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = Form.useForm()
  const branchId = useSelector((state) => state.branch.branchId)
  const STATUS_PRODUCT = {
    all: 'all',
    shipping_stock: 'shipping_stock',
    available_stock: 'available_stock',
    low_stock: 'low_stock',
    out_stock: 'out_stock',
  }

  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [paramsFilter, setParamsFilter] = useState({
    page: 1,
    page_size: 20,
    has_variable: false,
    this_week: true,
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
  const [visibleCategoryGroupUpdate, setVisibleCategoryGroupUpdate] =
    useState(false)
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState('this_week') //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({
    this_week: true,
  })
  const [stores, setStores] = useState([]) //list store in filter
  const [storeId, setStoreId] = useState() //filter product by store
  const [columns, setColumns] = useState(
    localStorage.getItem('columnsProduct')
      ? JSON.parse(localStorage.getItem('columnsProduct'))
      : [...columnsProduct]
  )

  const showDrawerCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(true)
  }

  const onCloseCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(false)
  }
  const modal6VisibleModal = (modal6Visible) => {
    setModal6Visible(modal6Visible)
  }
  // tạo Danh mục
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
      sorter: (a, b) => compare(a, b, 'category_id'),
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'address',
      sorter: (a, b) => compare(a, b, 'address'),
    },
    {
      title: 'Người tạo',
      dataIndex: '_creator',
      sorter: (a, b) => compare(a, b, '_creator'),
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
  const openNotificationSuccessCategoryMain = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Xóa danh mục <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationSuccessCategoryMainSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thêm danh mục thành công.',
    })
  }
  const openNotificationSuccessCategoryMainError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: (
        <div>
          danh mục <b>{data}</b> đã tồn tại
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
          Cập nhật thông tin danh mục <b>{data}</b> thành công
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

      if (value) paramsFilter[optionSearchName] = value
      else delete paramsFilter[optionSearchName]

      paramsFilter.page = 1
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
      //Nếu có filter cửa hàng thì gọi api product store
      if (params.store_id) res = await getProductsStore({ ...params })
      else res = await getProductsBranch({ ...params, branch_id: branchId })

      console.log(res)
      if (res.status === 200) {
        if (paramsFilter.has_variable) {
          let dataNew = []

          res.data.data.map((e) =>
            e.variants.map((v) =>
              dataNew.push({
                ...v,
                product_id: e.product_id,
                category: e._category.name || '',
                create_date: e.create_date || '',
              })
            )
          )

          setProducts([...dataNew])
        } else setProducts([...res.data.data])

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

    if (!localStorage.getItem('columnsProduct'))
      localStorage.setItem('columnsProduct', JSON.stringify(columnsProduct))
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
    setProductGroupSelect(e)

    if (e) {
      paramsFilter.category = e
    } else {
      delete paramsFilter.category
    }

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }
  const openNotificationProductGroupSelectError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa chọn danh mục.',
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
      setLoading(true)

      let resultsMockup = await uploadFiles(
        info.fileList.map((e) => e.originFileObj)
      )
      console.log('resutl', resultsMockup)
      setLoading(false)

      var objectFinish = {}

      products.forEach((values, index) => {
        if (values._id === record._id) {
          var array = []
          array = [...products[index].variants[index3].image]

          var result = array.concat(resultsMockup)
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
  const onChangeImageSimple = async (info, record) => {
    try {
      if (info.fileList && info.fileList.length > 0) {
        setLoading(true)

        let resultsMockup = await uploadFiles(
          info.fileList.map((e) => e.originFileObj)
        )
        console.log('resutl', resultsMockup)

        setLoading(false)

        const product = products.find((e) => e._id === record._id)
        if (product) {
          const listImage = [...product.image]
          apiUpdateProductMultiMain(
            { ...product, image: [...resultsMockup, ...listImage] },
            product.product_id
          )
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const Content = (url) => {
    const [valueImage, setValueImage] = useState(20)

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

        <Slider
          value={valueImage}
          min={20}
          max={70}
          onChange={(e) => setValueImage(e)}
        />
      </div>
    )
  }
  const [indexCheckbox, setIndexCheckbox] = useState([])
  const [skuSelect, setSkuSelect] = useState('')
  const [skuSelectArray, setSkuSelectArray] = useState([])

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
    }, 750)
    //
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

  const uploadImageProductVariable = async (file, record) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const image = await uploadFile(file)

      const indexVariant = products.findIndex((p) => p.title === record.title)
      let productId = ''
      if (indexVariant !== -1) {
        products[indexVariant].image = image || record.image
        productId = products[0].product_id
        const productsNew = products.map((e) => {
          delete e.product_id
          delete e.category
          delete e.create_date
          return e
        })

        const body = { variants: productsNew }

        let res
        if (paramsFilter.store_id)
          res = await updateProductStore(body, productId)
        else res = await updateProductBranch(body, productId)

        if (res.status === 200) {
          notification.success({ message: 'Upload ảnh thành công' })
          getAllProduct({ ...paramsFilter })
        } else
          notification.success({
            message: 'Upload ảnh thất bại, vui lòng thử lại',
          })
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
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
        data={(file) => uploadImageProductVariable(file, record)}
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
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    )
  }

  const removeImagesProductNotVariable = async (images, record) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      console.log(images)
      const body = { image: images }

      let res
      if (paramsFilter.store_id)
        res = await updateProductStore(body, record.product_id)
      else res = await updateProductBranch(body, record.product_id)

      if (res.status === 200) {
        notification.success({ message: 'Xoá ảnh thành công' })
        getAllProduct({ ...paramsFilter })
      } else
        notification.success({ message: 'Xoá ảnh thất bại, vui lòng thử lại' })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const uploadImagesProductNotVariable = async (files, record) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const images = await uploadFiles(files)
      const body = {
        image: images ? [...record.image, ...images] : record.image,
      }

      let res
      if (paramsFilter.store_id)
        res = await updateProductStore(body, record.product_id)
      else res = await updateProductBranch(body, record.product_id)

      if (res.status === 200) {
        notification.success({ message: 'Upload ảnh thành công' })
        getAllProduct({ ...paramsFilter })
      } else
        notification.success({
          message: 'Upload ảnh thất bại, vui lòng thử lại',
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const ImageProductNotVariable = ({ record }) => {
    const [listImageRemove, setListImageRemove] = useState([]) // list checkbox xoa anh hang loat
    const [classUploadImageProduct, setClassUploadImageProduct] = useState('')

    const [data, setData] = useState([])

    useEffect(() => {
      setData(
        record.image && typeof record.image === 'object'
          ? [
              ...record.image.map((url, index) => {
                return {
                  uid: index,
                  name: 'image',
                  status: 'done',
                  url: url,
                }
              }),
            ]
          : []
      )
    }, [])

    return (
      <>
        <Upload
          listType="picture-card"
          multiple
          fileList={data}
          onChange={({ fileList }) => {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(async () => {
              const files = fileList
                .filter((e) => e.originFileObj)
                .map((file) => file.originFileObj)
              uploadImagesProductNotVariable(files, record)
            }, 350)
          }}
          className={classUploadImageProduct}
          showUploadList={{
            showRemoveIcon: true,
            removeIcon: (file) => (
              <div
                style={{
                  position: 'absolute',
                  left: '-1px',
                  right: '-1px',
                  top: '-1px',
                  bottom: '-1px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  defaultChecked={listImageRemove.includes(file.url)}
                  onClick={(e) => {
                    const listImageRemoveNew = [...listImageRemove]
                    const indexLink = listImageRemoveNew.findIndex(
                      (e) => e === file.url
                    )

                    if (indexLink !== -1)
                      listImageRemoveNew.splice(indexLink, 1)
                    else listImageRemoveNew.push(file.url)

                    if (listImageRemoveNew.length)
                      setClassUploadImageProduct('image-product')
                    else setClassUploadImageProduct('')

                    setListImageRemove([...listImageRemoveNew])

                    e.stopPropagation()
                  }}
                ></Checkbox>
              </div>
            ),
            showDownloadIcon: true,
            downloadIcon: (file) => {
              return (
                <Popover
                  style={{ top: 300 }}
                  placement="top"
                  content={ContentZoomImage(file.url)}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      position: 'absolute',
                      left: '-38px',
                      top: '-38px',
                    }}
                  ></div>
                </Popover>
              )
            },
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>

        <Popconfirm
          title="Bạn có muốn xoá các ảnh này ?"
          onConfirm={() => {
            const listImagesRemoveNew = data.filter(
              (e) => !listImageRemove.includes(e.url)
            )

            removeImagesProductNotVariable(
              listImagesRemoveNew.map((e) => e.url),
              record
            )
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="dashed"
            danger
            style={{ display: !listImageRemove.length && 'none' }}
          >
            Remove list image
          </Button>
        </Popconfirm>
      </>
    )
  }
  /*image product */

  const onClickClear = async () => {
    Object.keys(paramsFilter).map((key) => {
      delete paramsFilter[key]
    })
    paramsFilter.has_variable = false
    paramsFilter.page = 1
    paramsFilter.page_size = 20
    await getAllProduct({ ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
    setValueSearch('')
    setStoreId()
    setSelectedRowKeys([])
    setValueTime()
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
      // const res = await apiUpdateProductStore(object, id)
      // console.log(res)
      // if (res.status === 200) {
      //   setIndexCheckbox([])

      //   setSkuSelectArray([])
      //   setIndexCheckboxSimple([])
      //   openNotificationSuccessUpdateProductMainDelete(object.name)
      // }

      // const res = await apiUpdateProduct(object, id)
      // console.log(res)
      // if (res.status === 200) {
      //   setIndexCheckbox([])

      //   setIndexCheckboxSimple([])
      //   openNotificationSuccessUpdateProductMainDelete(object.name)
      // }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const apiUpdateProductMultiMainDelete = async (object, id) => {
    try {
      setLoading(true)
      // if (viewMode === 1) {
      //   const res = await apiUpdateProductStore(object, id)
      //   console.log(res)
      //   if (res.status === 200) {
      //     if (
      //       statusName !== '' ||
      //       statusName !== ' ' ||
      //       statusName !== 'default'
      //     ) {
      //       await getAllProduct({
      //         status: statusName,
      //         page,
      //         page_size,
      //         ...paramsFilter,
      //       })
      //     } else {
      //     }

      //     setIndexCheckbox([])

      //     setSkuSelectArray([])
      //     setIndexCheckboxSimple([])
      //     openNotificationSuccessUpdateProductMainDelete(object.name)
      //   }
      // } else {
      //   const res = await apiUpdateProduct(object, id)
      //   console.log(res)
      //   if (res.status === 200) {
      //     if (
      //       statusName !== '' ||
      //       statusName !== ' ' ||
      //       statusName !== 'default'
      //     ) {
      //       await getAllProduct({
      //         status: statusName,
      //         page,
      //         page_size,
      //         ...paramsFilter,
      //       })
      //     } else {
      //     }
      //     setIndexCheckbox([])

      //     setIndexCheckboxSimple([])
      //     openNotificationSuccessUpdateProductMainDelete(object.name)
      //   }
      // }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const apiUpdateProductMultiMain = async (object, id) => {
    try {
      setLoading(true)

      // if (viewMode === 1) {
      //   const res = await apiUpdateProductStore(object, id)

      //   if (res.status === 200) {
      //     if (
      //       statusName !== '' ||
      //       statusName !== ' ' ||
      //       statusName !== 'default' ||
      //       typeof statusName !== 'undefined'
      //     ) {
      //       await getAllProduct({
      //         status: statusName,
      //         page,
      //         page_size,
      //         ...paramsFilter,
      //       })
      //     } else {
      //     }
      //   }
      // } else {
      //   const res = await apiUpdateProduct(object, id)
      //   console.log(res)
      //   if (res.status === 200) {
      //     if (
      //       statusName !== '' ||
      //       statusName !== ' ' ||
      //       statusName !== 'default'
      //     ) {
      //       await getAllProduct({
      //         status: statusName,
      //         page,
      //         page_size,
      //         ...paramsFilter,
      //       })
      //     }
      //   }
      // }

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
      // if (viewMode === 1) {
      //   const res = await apiUpdateProductStore(object, id)
      //   console.log(res)
      //   if (res.status === 200) {
      //     setSelectedRowKeys([])
      //     setModal50Visible(false)
      //     openNotificationSuccessUpdateProduct(object.name)
      //   } else {
      //     openNotificationSuccessUpdateProductError()
      //   }
      // } else {
      //   const res = await apiUpdateProduct(object, id)
      //   console.log(res)
      //   if (res.status === 200) {
      //     setSelectedRowKeys([])
      //     openNotificationSuccessUpdateProduct(object.name)
      //     setModal50Visible(false)
      //   } else {
      //     openNotificationSuccessUpdateProductError()
      //   }
      // }

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
      description: `Bạn chưa nhập ${data} danh mục.`,
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

  const apiUpdateCategoryDataUpdate = async (object, id) => {
    try {
      setLoading(true)
      const res = await apiUpdateCategory(object, id)
      if (res.status === 200) {
        await apiAllCategoryData()
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
                <Permission permissions={[PERMISSIONS.nhom_san_pham]}>
                  <Button
                    size="large"
                    onClick={showDrawerGroup}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  >
                    Tạo danh mục
                  </Button>
                </Permission>

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
              {category.map((values, index) => {
                return <Option value={values.category_id}>{values.name}</Option>
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
          justify="space-between"
          style={{
            marginTop: '30px',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <Radio.Group
            onChange={(e) => {
              paramsFilter.page = 1
              paramsFilter.has_variable = e.target.value
              setParamsFilter({ ...paramsFilter })
            }}
            value={paramsFilter.has_variable}
          >
            <Radio value={false}>Hiện thị đơn lẻ</Radio>
            <Radio value={true}>Hiện thị theo nhóm</Radio>
          </Radio.Group>

          <Space>
            <Button size="large" onClick={onClickClear} type="primary">
              Xóa tất cả lọc
            </Button>
            <SettingColumns columns={columns} setColumns={setColumns} />
          </Space>
        </Row>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <Row style={{ width: '100%', marginBottom: 10 }}>
            <Permission permission={[PERMISSIONS.tao_phieu_chuyen_hang]}>
              <Button
                size="large"
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
            </Permission>
            <Permission permission={[PERMISSIONS.tao_nhom_san_pham]}>
              <Button
                size="large"
                style={{ marginLeft: '1rem' }}
                onClick={() => modal5VisibleModal(true)}
                type="primary"
              >
                Tạo danh mục
              </Button>
            </Permission>
            <Permission permission={[PERMISSIONS.cap_nhat_nhom_san_pham]}>
              <Button
                size="large"
                style={{ marginLeft: '1rem' }}
                onClick={() => modal50VisibleModal(true)}
                type="primary"
              >
                Cập nhật danh mục
              </Button>
            </Permission>
          </Row>
        ) : (
          ''
        )}

        <Row style={{ width: '100%' }}>
          <Tabs
            defaultActiveKey="all"
            style={{ width: '100%' }}
            onChange={filterProductByStatus}
          >
            <Tabs.TabPane tab="Tất Cả" key={STATUS_PRODUCT.all} />
            <Tabs.TabPane
              tab="Hàng Vận Chuyển"
              key={STATUS_PRODUCT.shipping_stock}
            />
            <Tabs.TabPane
              tab="Hàng Khả Dụng"
              key={STATUS_PRODUCT.available_stock}
            />
            <Tabs.TabPane tab="Hàng SL Thấp" key={STATUS_PRODUCT.low_stock} />
            <Tabs.TabPane tab="Hàng Hết" key={STATUS_PRODUCT.out_stock} />
          </Tabs>
        </Row>
        <div className={styles['view_product_table']}>
          <Table
            style={{ width: '100%' }}
            // rowSelection={rowSelection}
            rowKey="_id"
            columns={columns.map((column) => {
              if (column.key === 'image')
                return {
                  ...column,
                  width: !paramsFilter.has_variable && 390,
                  render: (text, record) =>
                    paramsFilter.has_variable ? (
                      <ImageProductVariable record={record} />
                    ) : (
                      <ImageProductNotVariable record={record} />
                    ),
                }

              if (column.key === 'name-product')
                return {
                  ...column,
                  dataIndex: paramsFilter.has_variable ? 'title' : 'name',
                  sorter: (a, b) =>
                    compare(a, b, paramsFilter.has_variable ? 'title' : 'name'),
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
                    (record._category && record._category.name) ||
                    record.category,
                }

              if (column.key === 'sale-price')
                return {
                  ...column,
                  sorter: (a, b) => compare(a, b, 'sale_price'),
                }

              if (column.key === 'create-date')
                return {
                  ...column,
                  render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
                  sorter: (a, b) =>
                    new Date(a.create_date).getTime() -
                    new Date(b.create_date).getTime(),
                }

              if (column.key === 'supplier')
                return {
                  ...column,
                  render: (text, record) =>
                    (record._supplier && record._supplier.name) ||
                    record.supplier,
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
              total: count,
            }}
          />
        </div>
      </div>
      <Modal
        title="Tạo danh mục"
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
                width: 'max-content',
              }}
            >
              Danh mục:
            </div>
            <div style={{ marginLeft: '1rem', width: '100%' }}>
              <Input
                size="large"
                style={{ width: '100%' }}
                onChange={onChangeGroupProduct}
                placeholder="Nhập tên danh mục"
              />
            </div>
          </div>
          {arrayUpdate.map((values, index) => {
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
          <Button onClick={onClickGroupProduct} type="primary" size="large">
            Tạo
          </Button>
        </div>
      </Modal>

      <Modal
        title="Cập nhật danh mục"
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
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
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
          {arrayUpdate.map((values, index) => {
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
            size="large"
          >
            Cập nhật
          </Button>
        </div>
      </Modal>

      <Drawer
        title="Danh mục"
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
                    size="large"
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
                <Permission permissions={[PERMISSIONS.tao_nhom_san_pham]}>
                  <Button
                    size="large"
                    onClick={() => modal6VisibleModal(true)}
                    type="primary"
                  >
                    Tạo danh mục
                  </Button>
                </Permission>
              </div>
            </Col>
          </Row>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Row style={{ width: '100%', marginTop: 20 }}>
              <Permission permissions={[PERMISSIONS.cap_nhat_nhom_san_pham]}>
                <Button
                  size="large"
                  onClick={showDrawerCategoryGroupUpdate}
                  type="primary"
                  style={{ marginRight: '1rem' }}
                >
                  Cập nhật danh mục
                </Button>
              </Permission>
              <Permission permissions={[PERMISSIONS.xoa_nhom_san_pham]}>
                <Button
                  size="large"
                  onClick={onChangeSwitchCategory}
                  danger
                  type="primary"
                >
                  Xóa
                </Button>
              </Permission>
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
              size="small"
              rowKey="_id"
              loading={loading}
              rowSelection={rowSelection}
              columns={columnsCategory}
              dataSource={category}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </div>
      </Drawer>

      <Modal
        title="Tạo danh mục"
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
                      Tên danh mục:
                    </div>
                  }
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="categoryName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập tên danh mục" />
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
                <Button size="large" type="primary" htmlType="submit">
                  Tạo danh mục
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title="Cập nhật danh mục"
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
        {arrayUpdateCategory.map((values, index) => {
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
                          <b style={{ color: 'red' }}>*</b>Tên danh mục:
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
