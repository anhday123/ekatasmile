import UI from './../../components/Layout/UI'
import styles from './../product/product.module.scss'
import {
  Link, useHistory,
} from 'react-router-dom'
import axios from 'axios'

import ImgCrop from 'antd-img-crop';
import noimage from './../../assets/img/noimage.jpg'
import {
  Pagination,
  Switch,
  Drawer,
  Slider,
  InputNumber,
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
  Typography,
  Popover,
  Radio
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION } from './../../consts/index'
import {
  apiSearchProduct,
  apiUpdateProduct,
  apiProductSeller,
  apiAllProduct,
  apiUpdateProductStore,
  apiProductCategoryMerge
} from '../../apis/product'
import { useDispatch } from 'react-redux'
import Chart from '../../components/chart-page/ChartPage'
import {
  PlusOutlined,
  EditOutlined,
  WarningOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  FileImageOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { apiAllWarranty } from '../../apis/warranty'
import { apiAllSupplier } from '../../apis/supplier'
import { apiFilterCity, getAllBranchMain } from '../../apis/branch'
import { apiAddCategory, apiAllCategory, apiAllCategorySearch, apiUpdateCategory } from '../../apis/category'
import { apiAllInventory } from '../../apis/inventory'
import { getAllStore } from '../../apis/store'
import ProductInfo from './components/productInfo'
import UpdateProductSingle from './components/updateSingle'
import UpdateMultiProduct from './components/updateMulti'
import { values } from 'lodash';
const { Text } = Typography
const { RangePicker } = DatePicker
const { Dragger } = Upload
const { TextArea } = Input;
const { Search } = Input


const onFinishFailedCategory = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const content = (data) => {
  var result = (
    <div
      className={styles['shadow']}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
      }}
    >{`Số lượng bình thường: ${data}`}</div>
  )
  return result
}
const contentAttention = (data) => {
  var result = (
    <div
      className={styles['shadow']}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
        color: 'red',
      }}
    >{`Số lượng báo động: ${data}`}</div>
  )
  return result
}

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    productcode: (
      <Link
        to="/actions/product/view"
        style={{ color: '#0036F3', cursor: 'pointer' }}
      >
        {i}
      </Link>
    ),
    productname: `tên sản phẩm ${i}`,
    productpicture: <FileImageOutlined />,
    productprice: `${i} VNĐ`,
    producttype: 'Quà lưu niệm',
    productquantity: (
      <div>
        {i % 2 === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popover placement="bottom" content={content}>
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <WarningOutlined
                  style={{
                    fontSize: '1.75rem',
                    color: 'black',
                  }}
                />
              </div>
            </Popover>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popover placement="bottom" content={contentAttention}>
              <div
                style={{
                  display: 'flex',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <WarningOutlined
                  style={{
                    fontSize: '1.75rem',
                    color: 'red',
                  }}
                />
              </div>
            </Popover>
          </div>
        )}
      </div>
    ),
    supplier: 'An Phát',
    action: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Link
          to="/actions/product/update"
          style={{ marginRight: '0.5rem' }}
        >
          <EditOutlined
            style={{
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: '#0500E8',
            }}
          />
        </Link>
        <div>
          <DeleteOutlined
            style={{
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: '#E50000',
            }}
          />
        </div>
      </div>
    ),
  })
}

export default function Product() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  const [supplier, setSupplier] = useState([])
  const [product, setProduct] = useState([])
  const [visible, setVisible] = useState(false)
  const [warranty, setWarranty] = useState([])
  const [modal6Visible, setModal6Visible] = useState(false)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [category, setCategory] = useState([])
  const [paginationChecked, setPaginationChecked] = useState(0)
  const [categorySearch, setCategorySearch] = useState('')
  const [viewMode, setViewMode] = useState(0)
  const [visibleCategoryGroupUpdate, setVisibleCategoryGroupUpdate] = useState(false)
  const [warehouseList, setWarehouseList] = useState([])
  const [branchList, setBranchList] = useState([])
  const [viewLocation, setViewLocation] = useState(false)
  const [filter, setFilter] = useState({})
  const [searchFilter, setSearchFilter] = useState({})
  const history = useHistory()
  const showDrawerCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(true)
  };

  const onCloseCategoryGroupUpdate = () => {
    setVisibleCategoryGroupUpdate(false)
  };
  const modal6VisibleModal = (modal6Visible) => {
    setModal6Visible(modal6Visible)

  }
  const onFinishCategory = (values) => {
    console.log('Success:', values);
    const object = {
      name: values.categoryName,
      type: values.categoryType,
      description: values.categoryDescription ? values.categoryDescription : ''
    }
    apiAddCategoryDataMain(object)
  };
  const [productGroupName, setProductGroupName] = useState('')
  const onChangeGroupProduct = (e) => {
    setProductGroupName(e.target.value)
  }
  const showDrawerGroup = () => {
    setVisibleDrawer(true)

  };

  const onCloseGroup = async () => {
    setVisibleDrawer(false)
    await apiAllCategoryData()
  };
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
      title: 'Loại nhóm',
      dataIndex: 'type',
    },
    {
      title: 'Người tạo',
      dataIndex: '_creator',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD, HH:mm:ss') : ''
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitchCategory(e, record)} /> : <Switch onChange={(e) => onChangeSwitchCategory(e, record)} />
    },
  ];
  const openNotificationSuccessCategoryMain = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: data === 2 ? ('Vô hiệu hóa nhóm sản phẩm thành công.') : ('Kích hoạt nhóm sản phẩm thành công')
    });
  };
  const openNotificationSuccessCategoryMainSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thêm nhóm sản phẩm thành công.'
    });
  };
  const apiAddCategoryDataMain = async (object) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiAddCategory(object);
      console.log(res);
      console.log("___________________________123123")
      if (res.status === 200) {
        await apiAllCategoryData()
        setModal6Visible(false)
        openNotificationSuccessCategoryMainSuccess()
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const apiUpdateCategoryData = async (object, id, data) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiUpdateCategory(object, id);
      console.log(res);
      console.log("___________________________123123")
      if (res.status === 200) {
        await apiAllCategoryData()
        setSelectedRowKeysCategory([])
        openNotificationSuccessCategoryMain(data)
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const openNotificationSuccessStoreUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        <div>Cập nhật thông tin nhóm sản phẩm <b>{data}</b> thành công</div>
    });
  };

  function onChangeSwitchCategory(checked, record) {
    console.log(`switch to ${checked}`);
    const object = {
      active: checked
    }
    apiUpdateCategoryData(object, record.category_id, checked ? 1 : 2)
    // setValueSwitch(checked)
    // updateStoreData({ ...record, active: checked }, record.store_id, checked ? 1 : 2)
  }
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [categorySelect, setCategorySelect] = useState([])
  const apiAllCategoryData = async () => {
    try {
      setLoading(true)

      const res = await apiAllCategory()
      if (res.status === 200) {
        setCategory(res.data.data)
        setCategorySelect(res.data.data)
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
  const onClickGroupProductAdd = () => {

  }
  const showDrawer = () => {
    setVisible(true)
    setIndexCheckbox([])
  }
  const apiAllSupplierData = async () => {
    try {
      setLoading(true)
      const res = await apiAllSupplier()
      console.log(res)
      if (res.status === 200) {
        //  alert("123")
        setSupplier(res.data.data)
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }


  const [checkboxValue, setCheckboxValue] = useState(false)
  function onChangeCheckbox(e) {
    console.log(`checked = ${e.target.checked}`);
    setCheckboxValue(e.target.checked)
  }

  const UploadImg = ({ imageUrl, indexUpdate }) => {
    const [imgUrl, setImgUrl] = useState(imageUrl)
    const [imgFile, setImgFile] = useState(null)
    const [start, setStart] = useState([imageUrl])

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
                dispatch({ type: ACTION.LOADING, data: true });
                let a = axios
                  .post(
                    'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                    formData,
                    {
                      headers: {
                        'Content-Type':
                          'multipart/form-data',
                      },
                    }
                  )
                  .then((resp) => resp)
                let resultsMockup = await Promise.all([a])
                console.log(resultsMockup)
                console.log('|||99999999999999999999')
                console.log(resultsMockup[0].data.data[0])
                dispatch({ type: ACTION.LOADING, data: false });
                setList(resultsMockup[0].data.data)
                console.log(indexUpdate)
                if (viewMode === 1) {
                  productStore &&
                    productStore.length > 0 &&
                    productStore.forEach((values, index) => {
                      if (values._id === indexUpdate) {
                        productStore[index].image =
                          resultsMockup[0].data.data
                        console.log(productStore[index])
                      }
                    })
                } else {
                  product &&
                    product.length > 0 &&
                    product.forEach((values, index) => {
                      if (values._id === indexUpdate) {
                        product[index].image =
                          resultsMockup[0].data.data
                        console.log(product[index])
                      }
                    })
                }

              }
            }
          }
        }
        // if (status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
      },
      onDrop(e) {
        //   console.log('Dropped files', e.dataTransfer.files);
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
              width: '100%',
            }}
          >
            {list &&
              list.length > 0 &&
              list.map((values, index) => {
                return (
                  <Col
                    style={{
                      width: '100%',
                      marginRight: '1rem',
                      margin: '1rem 0 0 0',
                    }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={5}
                    xl={5}
                  >
                    <img
                      src={values}
                      style={{
                        width: '5rem',
                        height: '5rem',
                        objectFit: 'contain',
                      }}
                      alt=""
                    />
                  </Col>
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
                  <Col
                    style={{
                      width: '100%',
                      marginRight: '1rem',
                      margin: '1rem 0 0 0',
                    }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={5}
                    xl={5}
                  >
                    <img
                      src={values}
                      style={{
                        width: '5rem',
                        height: '5rem',
                        objectFit: 'contain',
                      }}
                      alt=""
                    />
                  </Col>
                )
              })}
          </div>
        )}
      </Row>

      // arrayBackup && arrayBackup.length > 0 ? (<Upload
      //   name="avatar"
      //   listType="picture-card"
      //   className="avatar-uploader"
      //   showUploadList={false}
      //   onChange={handleChange}
      // >

      //   <div>123</div>
      // </Upload>) : (<Upload
      //   name="avatar"
      //   listType="picture-card"
      //   className="avatar-uploader"
      //   showUploadList={false}
      //   onChange={handleChange}
      // >
      //   <img
      //     src={Array.isArray(imgUrl) ? imgUrl[imgUrl.length - 1] : imgUrl}

      //     alt="avatar"
      //     style={{ width: "5rem", height: "5rem", objectFit: "contain" }}
      //   />
      // </Upload>)
    )
  }
  const UploadImgChild = ({ imageUrl, indexUpdate, index20 }) => {
    const [imgUrl, setImgUrl] = useState(imageUrl)
    const [imgFile, setImgFile] = useState(null)
    const [start, setStart] = useState([imageUrl])
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
                dispatch({ type: ACTION.LOADING, data: true });
                let a = axios
                  .post(
                    'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                    formData,
                    {
                      headers: {
                        'Content-Type':
                          'multipart/form-data',
                      },
                    }
                  )
                  .then((resp) => resp)
                let resultsMockup = await Promise.all([a])
                console.log(resultsMockup)
                console.log('|||99999999999999999999')
                console.log(resultsMockup[0].data.data[0])
                dispatch({ type: ACTION.LOADING, data: false });
                setList(resultsMockup[0].data.data)
                console.log(indexUpdate)
                if (viewMode === 1) {
                  productStore &&
                    productStore.length > 0 &&
                    productStore.forEach((values, index) => {
                      if (values._id === indexUpdate) {
                        productStore[index].variants[
                          index20
                        ].image = resultsMockup[0].data.data
                        console.log(
                          productStore[index].variants[
                            index20
                          ].image
                        )
                      }
                    })
                } else {
                  product &&
                    product.length > 0 &&
                    product.forEach((values, index) => {
                      if (values._id === indexUpdate) {
                        product[index].variants[
                          index20
                        ].image = resultsMockup[0].data.data
                        console.log(
                          product[index].variants[
                            index20
                          ].image
                        )
                      }
                    })
                }

              }
            }
          }
        }
      },
      onDrop(e) {
        //   console.log('Dropped files', e.dataTransfer.files);
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
                  <Col
                    style={{
                      width: '100%',
                      margin: '1rem 1rem 0 0',
                    }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <img
                      src={values}
                      style={{
                        width: '5rem',
                        height: '5rem',
                        objectFit: 'contain',
                      }}
                      alt=""
                    />
                  </Col>
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
                  <Col
                    style={{
                      width: '100%',
                      margin: '1rem 1rem 0 0',
                    }}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <img
                      src={values}
                      style={{
                        width: '5rem',
                        height: '5rem',
                        objectFit: 'contain',
                      }}
                      alt=""
                    />
                  </Col>
                )
              })}
          </div>
        )}
      </Row>
    )
  }
  const onClose = () => {
    setVisible(false)
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  }
  const [selectedRowKeysCategory, setSelectedRowKeysCategory] = useState([])
  const [arrayUpdateCategory, setArrayUpdateCategory] = useState([])
  const onSelectChangeCategory = (selectedRowKeysCategory) => {
    console.log('selectedRowKeys changed: ', selectedRowKeysCategory)
    setSelectedRowKeysCategory(selectedRowKeysCategory)
    const array = []
    category && category.length > 0 && category.forEach((values, index) => {
      selectedRowKeysCategory.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })
    setArrayUpdateCategory([...array])
  }
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    if (viewMode === 1) {
      productStore &&
        productStore.length > 0 &&
        productStore.forEach((values, index) => {
          selectedRowKeys.forEach((values1, index1) => {
            if (values._id === values1) {
              array.push(values)
            }
          })
        })
    } else {
      product &&
        product.length > 0 &&
        product.forEach((values, index) => {
          selectedRowKeys.forEach((values1, index1) => {
            if (values._id === values1) {
              array.push(values)
            }
          })
        })
    }

    setArrayUpdate([...array])





    const array1 = []
    category && category.length > 0 && category.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array1.push(values)
        }
      })
    })
    setArrayUpdateCategory([...array1])
  }
  const apiSearchDataGroup = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchProduct({
        _category: value,
        page: 1,
        page_size: 10,
      })
      console.log(res)
      console.log("___123")
      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
        setSelectedRowKeys([])
        setPaginationChecked(1)
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
    }
  }

  const apiAllCategorySearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiAllCategorySearch({
        keyword: value,
      })
      console.log(res)
      console.log("___123")
      if (res.status === 200) {
        setCategory(res.data.data)

      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
    }
  }
  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchProduct({
        keyword: value,
        page: 1,
        page_size: 10,
      })
      console.log(res)
      console.log("___123")
      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
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
    if (categorySearch) {
      setSearchFilter({ [categorySearch]: e.target.value })
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value
        filterProduct({
          [categorySearch]: value,
          page: 1,
          page_size: 10,
        })
      }, 300)
    }
    else
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value
        setSearchFilter({ keyword: e.target.value })
        apiSearchData(value)
      }, 300)
    //
  }
  const [record, setRecord] = useState({})
  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }
  const onChangeCategoryMainDrawer = async (e) => {
    console.log(e)
    if (e === 'default') {
      await apiAllCategoryData()
    } else {
      apiAllCategorySearchData(e)
    }
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const rowSelectionCategory = {
    selectedRowKeysCategory,
    onChange: onSelectChangeCategory,
  }
  const { Option } = Select
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = !viewMode ? await apiSearchProduct({ ...filter, ...searchFilter, from_date: start, to_date: end, page: pagination.page, page_size: pagination.pageSize }) : await apiProductSeller({ ...filter, ...searchFilter, from_date: start, to_date: end, page: pagination.page, page_size: pagination.pageSize })

      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
        setSelectedRowKeys([])
        setPaginationChecked(1)
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
    }
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  const dateFormat = 'YYYY/MM/DD'
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    setFilter({ ...filter, from_date: dateStrings[0], to_date: dateStrings[1] })
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  const [count, setCount] = useState(0)
  const [productStore, setProductStore] = useState([])
  const apiAllProductData = async (params) => {
    setLoading(true)
    try {

      const res = viewMode === 0 ? await apiSearchProduct({ ...filter, ...searchFilter, ...params, page: pagination.page, page_size: pagination.pageSize }) : await apiProductSeller({ ...params, page: pagination.page, page_size: pagination.pageSize })
      console.log(res)
      console.log("____333333")
      if (res.status === 200) {
        if (viewMode === 1) {
          setProductStore(res.data.data)
          setProduct([])
        } else {
          setProductStore([])
          setProduct(res.data.data)
        }
        // setProduct(res.data.data)
        setCount(res.data.count)
        setSelectedRowKeys([])
        setPaginationChecked(1)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const openNotificationSuccessGroup = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Tạo nhóm thành công.',

    });
  };
  const openNotificationSuccessGroupError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tạo nhóm thất bại.',

    });
  };
  const apiAddCategoryData = async (object) => {
    setLoading(true)
    try {

      const res = await apiAddCategory(object)
      console.log(res)
      if (res.status === 200) {
        await apiAllProductData()
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
  const [productCategory, setProductCategory] = useState([])
  const [countProductCategory, setCountProductCategory] = useState(0)
  const apiProductCategoryMergeData = async () => {
    setLoading(true)
    try {

      const res = await apiProductCategoryMerge({ page: 1, page_size: 10 })
      console.log("______________________________77777777777777")
      console.log(res)
      if (res.status === 200) {
        setProductCategory(res.data.data)
        setCountProductCategory(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const apiAllProductDataMain = async () => {
    setLoading(true)
    try {

      const res = await apiAllProduct({ page: pagination.page, page_size: pagination.pageSize })
      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
        setStatusName('')
        setSelectedRowKeys([])
        setPaginationChecked(1)
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
    apiAllProductData(viewLocation && viewLocation)
  }, [viewMode, pagination])
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
    arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
      array.push(values.product_id)
    })
    const object = {
      name: productGroupName ? productGroupName : '',
      product_list: [...array],
    }
    console.log(object)
    apiAddCategoryData(object)
  }
  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onChangeImage = async (info, index3, record) => {
    console.log(info)
    if (info.fileList && info.fileList.length > 0) {

      var image

      let formData = new FormData()
      info.fileList.forEach((values, index) => {
        image = values.originFileObj
        formData.append('files', image) //append the values with key, value pair
      })

      if (formData) {
        //      dispatch({ type: ACTION.LOADING, data: true });
        setLoading(true)
        let a = axios
          .post(
            'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
            formData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            }
          )
          .then((resp) => resp)
        let resultsMockup = await Promise.all([a])
        console.log(resultsMockup)
        console.log('|||99999999999999999999')
        console.log(resultsMockup[0].data.data)
        setLoading(false)
        //    dispatch({ type: ACTION.LOADING, data: false });
        // setList(resultsMockup[0].data.data)
        // console.log(indexUpdate)
        var objectFinish = {}
        if (viewMode === 1) {
          productStore &&
            productStore.length > 0 &&
            productStore.forEach((values, index) => {
              if (values._id === record._id) {
                var array = []
                console.log(productStore[index].variants[
                  index3
                ].image)
                console.log("_____3333")
                array = [...productStore[index].variants[
                  index3
                ].image]
                // resultsMockup[0].data.data && resultsMockup[0].data.data.length > 0 && resultsMockup[0].data.data.forEach((values5, index5) => {
                //   array.push(values5)
                // })
                array.unshift(resultsMockup[0].data.data[resultsMockup[0].data.data.length - 1])

                var objectResult = { ...productStore[index].variants[index3], image: array }
                var arrayFinish = [...values.variants]
                arrayFinish[index3] = objectResult
                objectFinish = { ...values, variants: arrayFinish }
                console.log(objectFinish)
                apiUpdateProductMultiMain(objectFinish, objectFinish.product_id)
              }
            })


        } else {
          product &&
            product.length > 0 &&
            product.forEach((values, index) => {
              if (values._id === record._id) {
                var array = []
                console.log(product[index].variants[
                  index3
                ].image)
                console.log("_____3333")
                array = [...product[index].variants[
                  index3
                ].image]
                // resultsMockup[0].data.data && resultsMockup[0].data.data.length > 0 && resultsMockup[0].data.data.forEach((values5, index5) => {
                //   array.push(values5)
                // })
                array.unshift(resultsMockup[0].data.data[resultsMockup[0].data.data.length - 1])

                var objectResult = { ...product[index].variants[index3], image: array }
                var arrayFinish = [...values.variants]
                arrayFinish[index3] = objectResult
                objectFinish = { ...values, variants: arrayFinish }
                console.log(objectFinish)
                apiUpdateProductMultiMain(objectFinish, objectFinish.product_id)
              }
            })


        }

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
        //      dispatch({ type: ACTION.LOADING, data: true });
        setLoading(true)
        let a = axios
          .post(
            'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
            formData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            }
          )
          .then((resp) => resp)
        let resultsMockup = await Promise.all([a])
        console.log(resultsMockup)
        console.log('|||99999999999999999999')
        console.log(resultsMockup[0].data.data)
        setLoading(false)
        //    dispatch({ type: ACTION.LOADING, data: false });
        // setList(resultsMockup[0].data.data)
        // console.log(indexUpdate)
        var objectFinish = {}
        if (viewMode === 1) {
          productStore &&
            productStore.length > 0 &&
            productStore.forEach((values, index) => {
              if (values._id === record._id) {
                var listImage = [...values.image]
                listImage.push(resultsMockup[0].data.data[resultsMockup[0].data.data.length - 1])

                apiUpdateProductMultiMain({ ...values, image: listImage }, values.product_id)
              }
            })
        } else {
          product &&
            product.length > 0 &&
            product.forEach((values, index) => {
              if (values._id === record._id) {
                var listImage = [...values.image]
                listImage.push(resultsMockup[0].data.data[resultsMockup[0].data.data.length - 1])

                apiUpdateProductMultiMain({ ...values, image: listImage }, values.product_id)
              }
            })
        }



      }
    }
  }

  const [valueImage, setValueImage] = useState(20)
  function formatter(value) {
    console.log(value)
    setValueImage(value)

  }
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
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: `${valueImage}rem`,
            height: `${valueImage - 10}rem`,
            objectFit: 'contain',
          }}
          src={url}
          alt=""
        />
        <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600' }}>Thay đổi kích thước ảnh</div>
        <div style={{ backgroundColor: 'grey', padding: '0.25rem 0', marginTop: '1rem' }}> <Slider value={valueImage} min={20} max={70} onChange={onChangeHoverImage} /></div>
      </div>

    )
  }
  const [indexCheckbox, setIndexCheckbox] = useState([])
  const [checkBoxImage, setCheckboxImage] = useState(false)
  const [idSelect, setIdSelect] = useState("")
  const [skuSelect, setSkuSelect] = useState('')
  const [skuSelectArray, setSkuSelectArray] = useState([])
  const [skuSelectArrayBackup, setSkuSelectArrayBackup] = useState([])
  const onChangeSelectInventoryStore = async (e) => {
    setViewMode(e.target.value)
    await apiAllProductDataMain()
    setValueSearch('')
    setCategoryValue("")
    setClear(1)
    setStatusName('')
    setTimeFilter("")
    setAllSelect("")
    setSelectValue("")
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setFilter({})
    setSearchFilter({})
  }
  const [arrayCheck, setArrayCheck] = useState([])
  const onChangeCheckboxImage = (e, index, id, index3, sku, indexFinish, list) => {
    setIdSelect(id)
    setSkuSelect(sku)
    if (e.target.checked) {
      var array = [...indexCheckbox]
      array.push(index)
      setIndexCheckbox([...array])



      // const arrayCheckTemp = [...arrayCheck]
      // arrayCheckTemp.push({ list10: list, values10: index })
      setArrayCheck([...list])



      var array1 = [...skuSelectArray]
      if (skuSelectArray && skuSelectArray.length > 0) {
        var result = skuSelectArray.findIndex(x => x.sku === sku)
        if (result === -1) {
          array1.push({ status: e.target.checked, sku: sku })
          setSkuSelectArray([...array1])
          setSkuSelectArrayBackup([...array1])
        }

      } else {
        array1.push({ status: e.target.checked, sku: sku })
        setSkuSelectArray([...array1])
        setSkuSelectArrayBackup([...array1])
      }

    } else {
      var array = [...indexCheckbox]
      indexCheckbox && indexCheckbox.length > 0 && indexCheckbox.forEach((values1, index1) => {
        if (values1 === index) {
          array.splice(index1, 1)
          setIndexCheckbox([...array])
        }
      })




      var array1 = [...skuSelectArray]
      skuSelectArray && skuSelectArray.length > 0 && skuSelectArray.forEach((values1, index1) => {
        if (values1.sku === sku) {
          array1.splice(index1, 1)
          setSkuSelectArray([...array])
          setSkuSelectArrayBackup([...array])
        }
      })
    }
  }
  const [indexCheckboxSimple, setIndexCheckboxSimple] = useState([])
  const [idSelectSimple, setIdSelectSimple] = useState('')
  const onChangeCheckboxImageSimple = (e, index, record) => {
    // setIdSelect(index3)
    setIdSelectSimple(record._id)
    if (e.target.checked) {
      var array = [...indexCheckboxSimple]
      array.push(index)
      setIndexCheckboxSimple([...array])
    } else {
      var array = [...indexCheckboxSimple]
      indexCheckboxSimple && indexCheckboxSimple.length > 0 && indexCheckboxSimple.forEach((values1, index1) => {
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

    console.log(record)
    apiUpdateProductMultiMainDelete({ ...record, image: listImage }, record.product_id)
  }
  const [listImage, setListImage] = useState([])
  const onClickDeleteImage = (index1, index2, record, list) => {
    var arrayVariant = [...record.variants]
    setListImage(list)
    arrayVariant[index2].image.splice(index1, 1)
    record.variants = arrayVariant
    console.log(record)
    apiUpdateProductMultiMainDelete(record, record.product_id)
  }
  const onClickDeleteAllImage = (index2, record) => {
    var array = [...arrayCheck]
    indexCheckbox && indexCheckbox.length > 0 && indexCheckbox.forEach((values, index) => {
      var arrayVariant = [...record.variants]
      arrayVariant[index2].image && arrayVariant[index2].image.length > 0 && arrayVariant[index2].image.forEach((values20, index20) => {
        if (values20 === values) {
          arrayVariant[index2].image.splice(index20, 1)
          array.splice(index20, 1)
          record.variants = arrayVariant
          console.log(record)
        }
      })


    })
    setArrayCheck([...array])
    apiUpdateProductMultiMainDelete(record, record.product_id)
  }
  const onClickDeleteAllImageSimple = (record) => {
    var listImage = [...record.image]
    indexCheckboxSimple && indexCheckboxSimple.length > 0 && indexCheckboxSimple.forEach((values, index) => {


      listImage && listImage.length > 0 && listImage.forEach((values5, index5) => {
        if (values5 === values) {
          listImage.splice(index5, 1)
        }
      })

    })
    apiUpdateProductMultiMainDelete({ ...record, image: [...listImage] }, record.product_id)
  }
  const funcHoverImageSimple = (record) => {
    return (

      <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            multiple
            showUploadList={false}
            onChange={(e) => onChangeImageSimple(e, record)}
          // onPreview={onPreview}
          >
            + Upload
          </Upload>
        </Col>




        {
          record.image && record.image.length > 0 && record.image.map((values1, index1) => {
            return (
              <Popover placement="right" content={() => content(values1)} >
                <Col xs={24} sm={24} md={11} lg={11} xl={11} className={styles['hover_Image']} style={{ border: '1px solid white', padding: '1rem', width: '6.5rem', height: '6.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={values1} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                  <div className={styles['icon_hover']}>
                    <a
                      href={
                        values1
                      }
                      target="_blank"
                    >
                      <EyeOutlined style={{ color: 'white', marginTop: '0.25rem', fontSize: '1.25rem', fontWeight: '600', marginRight: '0.5rem' }} /></a>
                    <DeleteOutlined onClick={() => onClickDeleteImageSimple(index1, record)} style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', }} />
                  </div>
                  {/* {
                    indexCheckboxSimple && indexCheckboxSimple.length > 0 ? (
                      indexCheckboxSimple && indexCheckboxSimple.length > 0 && indexCheckboxSimple.map((values50, index50) => {
                        if (values50 === values1) {
                          return (
                            <Checkbox checked={true} onChange={(e) => onChangeCheckboxImageSimple(e, values1, record)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>
                          )
                        } else {
                          return (
                            <Checkbox checked={false} onChange={(e) => onChangeCheckboxImageSimple(e, values1, record)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>
                          )
                        }
                      })
                    ) : (<Checkbox onChange={(e) => onChangeCheckboxImageSimple(e, values1, record)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>)
                  } */}

                  <Checkbox onChange={(e) => onChangeCheckboxImageSimple(e, values1, record)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>
                </Col>
              </Popover>
            )
          })
        }
        {
          idSelectSimple === record._id ? (indexCheckboxSimple && indexCheckboxSimple.length > 0 ? (<Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div onClick={() => onClickDeleteAllImageSimple(record)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Button style={{ width: '12.5rem' }} type="primary" danger>Xóa tất cả ảnh đã chọn</Button></div>
          </Col>) : '') : ''
        }
        {/* {
          idSelect === record._id ? (indexCheckbox && indexCheckbox.length > 0 ? (<Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div onClick={() => onClickDeleteAllImage(index, record)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Button style={{ width: '12.5rem' }} type="primary" danger>Xóa tất cả ảnh đã chọn</Button></div>
          </Col>) : '') : ''
        } */}


      </Row>

    )
  }
  console.log(skuSelectArray)
  console.log("___________________________123123123")
  const funcHoverImage = (list, index, record, sku) => {


    return (

      <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            multiple
            showUploadList={false}
            onChange={(e) => onChangeImage(e, index, record)}
          // onPreview={onPreview}
          >
            + Upload
          </Upload>
        </Col>


        {
          list && list.length > 0 && list.map((values1, index1) => {
            return (
              <Popover placement="right" content={() => content(values1)} >
                <Col xs={24} sm={24} md={11} lg={11} xl={11} className={styles['hover_Image']} style={{ border: '1px solid white', padding: '1rem', width: '6.5rem', height: '6.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>

                  <img src={values1} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />


                  <div className={styles['icon_hover']}>
                    <a

                      href={
                        values1
                      }
                      target="_blank"
                    >
                      <EyeOutlined style={{ color: 'white', marginTop: '0.25rem', fontSize: '1.25rem', fontWeight: '600', marginRight: '0.5rem' }} /></a>
                    <DeleteOutlined onClick={() => onClickDeleteImage(index1, index, record, list)} style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', }} />

                  </div>
                  {/* {
                    arrayCheck && arrayCheck.length > 0 ? (arrayCheck.map((values5, index5) => {
                      if (values1.toLowerCase === values5) {
                        return (
                          <Checkbox checked={false} onChange={(e) => onChangeCheckboxImage(e, values1, record._id, index, sku, index1)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>
                        )
                      }
                    })) : <Checkbox onChange={(e) => onChangeCheckboxImage(e, values1, record._id, index, sku, index1)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>
                  } */}
                  <Checkbox onChange={(e) => onChangeCheckboxImage(e, values1, record._id, index, sku, index1)} style={{ zIndex: '99', top: '0', right: '0', position: 'absolute' }}></Checkbox>

                </Col>
              </Popover>
            )
          })
        }


        {/* {
          idSelect === record._id ? (indexCheckbox && indexCheckbox.length > 0 ? (<Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div onClick={() => onClickDeleteAllImage(index, record)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Button style={{ width: '12.5rem' }} type="primary" danger>Xóa tất cả ảnh đã chọn</Button></div>
          </Col>) : '') : ''
        } */}

        {
          skuSelect === sku ? (indexCheckbox && indexCheckbox.length > 0 ? (<Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
            <div onClick={() => onClickDeleteAllImage(index, record)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}><Button style={{ width: '12.5rem' }} type="primary" danger>Xóa tất cả ảnh đã chọn</Button></div>
          </Col>) : '') : ''
        }
      </Row>

    )
  }
  const columns = [
    {
      title: 'Hình ảnh',
      align: 'center',
      dataIndex: 'image',
      width: 250,
      render: (text, record) => (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record &&
            record.variants &&
            record.variants.length > 0 ? (
            record.variants.map((values, index) => {
              return (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  style={{
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
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {values.title}:{' '}
                  </div>
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {
                      statusName === '' || statusName === ' ' || statusName === 'default' ? (funcHoverImage(values.image, index, record, values.sku)) : (values &&
                        values.image &&
                        values.image.length > 0 &&
                        values.image.map(
                          (values1, index1) => {
                            return (
                              <Popover
                                content={() =>
                                  content(values1)
                                }
                                placement="right"
                              >
                                <Col
                                  xs={11}
                                  sm={11}
                                  md={11}
                                  lg={11}
                                  xl={11}
                                  style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom:
                                      '1rem',
                                  }}
                                >
                                  <div>
                                    <a
                                      style={{
                                        position:
                                          'relative',
                                      }}
                                      href={
                                        values1
                                      }
                                      target="_blank"
                                    >
                                      <img
                                        src={
                                          values1
                                        }
                                        style={{
                                          width: '5rem',
                                          height: '5rem',
                                          objectFit:
                                            'contain',
                                        }}
                                        alt=""
                                      />
                                    </a>
                                  </div>
                                </Col>
                              </Popover>

                            )
                          }
                        ))

                    }

                  </Row>
                </Col>
              )
            })
          ) :

            statusName === '' || statusName === ' ' || statusName === 'default' ? (record && record.image && record.image.length > 0 ? (funcHoverImageSimple(record))

              : funcHoverImageSimple(record)) : (record.image.map((values, index) => {
                return (
                  <Popover
                    content={() => content(values)}
                    placement="right"
                  >
                    <Col
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                      xl={11}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                      }}
                    >
                      <a
                        style={{ position: 'relative' }}
                        href={values}
                        target="_blank"
                      >
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                          }}
                          alt=""
                        />
                      </a>
                    </Col>
                  </Popover>
                )
              }))





          }
        </Row>
      ),
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantityMain',
      width: 200,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{e.title}</div>
        {
          (e.quantity && e.quantity > 0) || (e.available_stock_quantity && e.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.quantity && e.quantity <= 0 || e.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {
                e.quantity && e.quantity > 0 ? e.quantity && e.quantity && `${formatCash(
                  String(e.quantity)
                )}.` : (e.available_stock_quantity > 0 ? e.available_stock_quantity && e.available_stock_quantity && `${formatCash(
                  String(e.available_stock_quantity)
                )}.` : '')
              }


            </div>
          </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {e.low_stock_quantity > 0 ? e.low_stock_quantity && `${formatCash(
                String(e.low_stock_quantity)
              )}.` : ''}
            </div>
          </div>)
        }


      </>)) : (
        <>
          {
            (record.quantity && record.quantity > 0) || (record.available_stock_quantity && record.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.available_stock_quantity > 0 ? record.available_stock_quantity && `${formatCash(
                    String(record.available_stock_quantity)
                  )}.` : ''}
                </div>
              </div>
            </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.low_stock_quantity > 0 ? record.low_stock_quantity && `${formatCash(
                    String(record.low_stock_quantity)
                  )}.` : ''}
                </div>
              </div>

            </div>)
          }


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
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{record.name}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Phiên bản:</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    return (
                      <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>{`${values.title}.`}</div>
                    )
                  })
                ) : ''
              }
            </div>
          </div>) : <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
        }
      </div>
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'category',
      width: 125,
      render: (text, record) =>
        text.name
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusMain',
      width: 250,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    if (values.status === 'available_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'low_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'out_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    }

                  })
                ) : ''
              }
            </div>
          </div>) : record.status === 'available_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'low_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'out_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>)))
        }
      </div>
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'sale_price',
      width: 250,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>{e.title}</div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.sale_price && `${formatCash(
            String(e.sale_price)
          )} VNĐ (giá bán),`}
        </div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.base_price && `${formatCash(
            String(e.base_price)
          )} VNĐ (giá cơ bản).`}
        </div>
      </>)) : (
        <>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.sale_price && `${formatCash(
              String(record.sale_price)
            )} VNĐ (giá bán),`}
          </div>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.base_price && `${formatCash(
              String(record.base_price)
            )} VNĐ (giá cơ bản).`}
          </div>
        </>

      ),
    },

    {
      title: "Ngày nhập",
      dataIndex: "create_date",
      width: 150,
      render(data) {
        return moment(data).format("DD-MM-YYYY")
      }
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'suppliers',
      width: 200,
      render: (text, record) => (
        <div>
          {text.name}
        </div>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'warehouse',
      width: 200,
      render: (text, record) => (
        <div>
          {text ? text.name : ''}
        </div>
      ),
    },
    {
      title: 'Mở bán',
      // fixed: 'right',
      dataIndex: 'active',
      width: 100,
      render: (text, record) =>

        text ? (
          <Switch
            defaultChecked
            onChange={(e) => onChangeSwitch(e, record)}
          />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        )
    },
  ]
  const columnsStatusName = [
    {
      title: 'Hình ảnh',
      align: 'center',
      dataIndex: 'image',
      width: 250,
      render: (text, record) => (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record &&
            record.variants &&
            record.variants.length > 0 ? (
            record.variants.map((values, index) => {
              return (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  style={{
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
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {values.title}:{' '}
                  </div>
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {
                      statusName === '' || statusName === ' ' || statusName === 'default' ? (funcHoverImage(values.image, index, record, values.sku)) : (values &&
                        values.image &&
                        values.image.length > 0 &&
                        values.image.map(
                          (values1, index1) => {
                            return (
                              <Popover
                                content={() =>
                                  content(values1)
                                }
                                placement="right"
                              >
                                <Col
                                  xs={11}
                                  sm={11}
                                  md={11}
                                  lg={11}
                                  xl={11}
                                  style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom:
                                      '1rem',
                                  }}
                                >
                                  <div>
                                    <a
                                      style={{
                                        position:
                                          'relative',
                                      }}
                                      href={
                                        values1
                                      }
                                      target="_blank"
                                    >
                                      <img
                                        src={
                                          values1
                                        }
                                        style={{
                                          width: '5rem',
                                          height: '5rem',
                                          objectFit:
                                            'contain',
                                        }}
                                        alt=""
                                      />
                                    </a>
                                  </div>
                                </Col>
                              </Popover>

                            )
                          }
                        ))

                    }

                  </Row>
                </Col>
              )
            })
          ) :

            statusName === '' || statusName === ' ' || statusName === 'default' ? (record && record.image && record.image.length > 0 ? (funcHoverImageSimple(record))

              : funcHoverImageSimple(record)) : (record.image.map((values, index) => {
                return (
                  <Popover
                    content={() => content(values)}
                    placement="right"
                  >
                    <Col
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                      xl={11}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                      }}
                    >
                      <a
                        style={{ position: 'relative' }}
                        href={values}
                        target="_blank"
                      >
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                          }}
                          alt=""
                        />
                      </a>
                    </Col>
                  </Popover>
                )
              }))





          }
        </Row>
      ),
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantityMain',
      width: 200,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{e.title}</div>
        {
          (e.quantity && e.quantity > 0) || (e.available_stock_quantity && e.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.quantity && e.quantity <= 0 || e.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {
                e.quantity && e.quantity > 0 ? e.quantity && e.quantity && `${formatCash(
                  String(e.quantity)
                )}.` : (e.available_stock_quantity > 0 ? e.available_stock_quantity && e.available_stock_quantity && `${formatCash(
                  String(e.available_stock_quantity)
                )}.` : '')
              }


            </div>
          </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {e.low_stock_quantity > 0 ? e.low_stock_quantity && `${formatCash(
                String(e.low_stock_quantity)
              )}.` : ''}
            </div>
          </div>)
        }


      </>)) : (
        <>
          {
            (record.quantity && record.quantity > 0) || (record.available_stock_quantity && record.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.available_stock_quantity > 0 ? record.available_stock_quantity && `${formatCash(
                    String(record.available_stock_quantity)
                  )}.` : ''}
                </div>
              </div>
            </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.low_stock_quantity > 0 ? record.low_stock_quantity && `${formatCash(
                    String(record.low_stock_quantity)
                  )}.` : ''}
                </div>
              </div>

            </div>)
          }


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
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{record.name}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Phiên bản:</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    return (
                      <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>{`${values.title}.`}</div>
                    )
                  })
                ) : ''
              }
            </div>
          </div>) : <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
        }
      </div>
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'category',
      width: 125,
      render: (text, record) =>
        text.name
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusMain',
      width: 250,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    if (values.status === 'available_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'low_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'out_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    }

                  })
                ) : ''
              }
            </div>
          </div>) : record.status === 'available_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'low_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'out_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>)))
        }
      </div>
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'sale_price',
      width: 250,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>{e.title}</div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.sale_price && `${formatCash(
            String(e.sale_price)
          )} VNĐ (giá bán),`}
        </div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.base_price && `${formatCash(
            String(e.base_price)
          )} VNĐ (giá cơ bản).`}
        </div>
      </>)) : (
        <>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.sale_price && `${formatCash(
              String(record.sale_price)
            )} VNĐ (giá bán),`}
          </div>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.base_price && `${formatCash(
              String(record.base_price)
            )} VNĐ (giá cơ bản).`}
          </div>
        </>

      ),
    },

    {
      title: "Ngày nhập",
      dataIndex: "create_date",
      width: 150,
      render(data) {
        return moment(data).format("DD-MM-YYYY")
      }
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'suppliers',
      width: 200,
      render: (text, record) => (
        <div>
          {text.name}
        </div>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'warehouse',
      width: 200,
      render: (text, record) => (
        <div>
          {text ? text.name : ''}
        </div>
      ),
    },

  ]
  const columnsStore = [
    {
      title: 'Hình ảnh',
      align: 'center',
      dataIndex: 'image',
      width: 250,
      render: (text, record) => (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record &&
            record.variants &&
            record.variants.length > 0 ? (
            record.variants.map((values, index) => {
              return (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  style={{
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
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {values.title}:{' '}
                  </div>
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {
                      statusName === '' || statusName === ' ' || statusName === 'default' ? (funcHoverImage(values.image, index, record, values.sku)) : (values &&
                        values.image &&
                        values.image.length > 0 &&
                        values.image.map(
                          (values1, index1) => {
                            return (
                              <Popover
                                content={() =>
                                  content(values1)
                                }
                                placement="right"
                              >
                                <Col
                                  xs={11}
                                  sm={11}
                                  md={11}
                                  lg={11}
                                  xl={11}
                                  style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom:
                                      '1rem',
                                  }}
                                >
                                  <div>
                                    <a
                                      style={{
                                        position:
                                          'relative',
                                      }}
                                      href={
                                        values1
                                      }
                                      target="_blank"
                                    >
                                      <img
                                        src={
                                          values1
                                        }
                                        style={{
                                          width: '5rem',
                                          height: '5rem',
                                          objectFit:
                                            'contain',
                                        }}
                                        alt=""
                                      />
                                    </a>
                                  </div>
                                </Col>
                              </Popover>

                            )
                          }
                        ))

                    }

                  </Row>
                </Col>
              )
            })
          ) :

            statusName === '' || statusName === ' ' || statusName === 'default' ? (record && record.image && record.image.length > 0 ? (funcHoverImageSimple(record))

              : funcHoverImageSimple(record)) : (record.image.map((values, index) => {
                return (
                  <Popover
                    content={() => content(values)}
                    placement="right"
                  >
                    <Col
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                      xl={11}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                      }}
                    >
                      <a
                        style={{ position: 'relative' }}
                        href={values}
                        target="_blank"
                      >
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                          }}
                          alt=""
                        />
                      </a>
                    </Col>
                  </Popover>
                )
              }))





          }
        </Row>
      ),
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantityMain',
      width: 200,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{e.title}</div>
        {
          (e.quantity && e.quantity > 0) || (e.available_stock_quantity && e.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.quantity && e.quantity <= 0 || e.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {
                e.quantity && e.quantity > 0 ? e.quantity && e.quantity && `${formatCash(
                  String(e.quantity)
                )}.` : (e.available_stock_quantity > 0 ? e.available_stock_quantity && e.available_stock_quantity && `${formatCash(
                  String(e.available_stock_quantity)
                )}.` : '')
              }


            </div>
          </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {e.low_stock_quantity > 0 ? e.low_stock_quantity && `${formatCash(
                String(e.low_stock_quantity)
              )}.` : ''}
            </div>
          </div>)
        }


      </>)) : (
        <>
          {
            (record.quantity && record.quantity > 0) || (record.available_stock_quantity && record.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.available_stock_quantity > 0 ? record.available_stock_quantity && `${formatCash(
                    String(record.available_stock_quantity)
                  )}.` : ''}
                </div>
              </div>
            </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.low_stock_quantity > 0 ? record.low_stock_quantity && `${formatCash(
                    String(record.low_stock_quantity)
                  )}.` : ''}
                </div>
              </div>

            </div>)
          }


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
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{record.name}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Phiên bản:</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    return (
                      <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>{`${values.title}.`}</div>
                    )
                  })
                ) : ''
              }
            </div>
          </div>) : <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
        }
      </div>
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'category',
      width: 125,
      render: (text, record) =>
        text.name
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusMain',
      width: 250,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    if (values.status === 'available_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'low_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'out_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    }

                  })
                ) : ''
              }
            </div>
          </div>) : record.status === 'available_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'low_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'out_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>)))
        }
      </div>
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'sale_price',
      width: 250,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>{e.title}</div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.sale_price && `${formatCash(
            String(e.sale_price)
          )} VNĐ (giá bán),`}
        </div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.base_price && `${formatCash(
            String(e.base_price)
          )} VNĐ (giá cơ bản).`}
        </div>
      </>)) : (
        <>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.sale_price && `${formatCash(
              String(record.sale_price)
            )} VNĐ (giá bán),`}
          </div>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.base_price && `${formatCash(
              String(record.base_price)
            )} VNĐ (giá cơ bản).`}
          </div>
        </>

      ),
    },

    {
      title: "Ngày nhập",
      dataIndex: "create_date",
      width: 150,
      render(data) {
        return moment(data).format("DD-MM-YYYY")
      }
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'suppliers',
      width: 200,
      render: (text, record) => (
        <div>
          {text.name}
        </div>
      ),
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      width: 200,
      render: (text, record) => (
        <div>
          {text ? text.name : ''}
        </div>
      ),
    },
    {
      title: 'Mở bán',
      // fixed: 'right',
      dataIndex: 'active',
      width: 100,
      render: (text, record) =>

        text ? (
          <Switch
            defaultChecked
            onChange={(e) => onChangeSwitch(e, record)}
          />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        )
    },
  ]
  const columnsStatusNameStore = [
    {
      title: 'Hình ảnh',
      align: 'center',
      dataIndex: 'image',
      width: 250,
      render: (text, record) => (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {record &&
            record.variants &&
            record.variants.length > 0 ? (
            record.variants.map((values, index) => {
              return (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  style={{
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
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {values.title}:{' '}
                  </div>
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {
                      statusName === '' || statusName === ' ' || statusName === 'default' ? (funcHoverImage(values.image, index, record, values.sku)) : (values &&
                        values.image &&
                        values.image.length > 0 &&
                        values.image.map(
                          (values1, index1) => {
                            return (
                              <Popover
                                content={() =>
                                  content(values1)
                                }
                                placement="right"
                              >
                                <Col
                                  xs={11}
                                  sm={11}
                                  md={11}
                                  lg={11}
                                  xl={11}
                                  style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    marginBottom:
                                      '1rem',
                                  }}
                                >
                                  <div>
                                    <a
                                      style={{
                                        position:
                                          'relative',
                                      }}
                                      href={
                                        values1
                                      }
                                      target="_blank"
                                    >
                                      <img
                                        src={
                                          values1
                                        }
                                        style={{
                                          width: '5rem',
                                          height: '5rem',
                                          objectFit:
                                            'contain',
                                        }}
                                        alt=""
                                      />
                                    </a>
                                  </div>
                                </Col>
                              </Popover>

                            )
                          }
                        ))

                    }

                  </Row>
                </Col>
              )
            })
          ) :

            statusName === '' || statusName === ' ' || statusName === 'default' ? (record && record.image && record.image.length > 0 ? (funcHoverImageSimple(record))

              : funcHoverImageSimple(record)) : (record.image.map((values, index) => {
                return (
                  <Popover
                    content={() => content(values)}
                    placement="right"
                  >
                    <Col
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                      xl={11}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                      }}
                    >
                      <a
                        style={{ position: 'relative' }}
                        href={values}
                        target="_blank"
                      >
                        <img
                          src={values}
                          style={{
                            width: '5rem',
                            height: '5rem',
                            objectFit: 'contain',
                          }}
                          alt=""
                        />
                      </a>
                    </Col>
                  </Popover>
                )
              }))





          }
        </Row>
      ),
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantityMain',
      width: 200,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{e.title}</div>
        {
          (e.quantity && e.quantity > 0) || (e.available_stock_quantity && e.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.quantity && e.quantity <= 0 || e.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {
                e.quantity && e.quantity > 0 ? e.quantity && e.quantity && `${formatCash(
                  String(e.quantity)
                )}.` : (e.available_stock_quantity > 0 ? e.available_stock_quantity && e.available_stock_quantity && `${formatCash(
                  String(e.available_stock_quantity)
                )}.` : '')
              }


            </div>
          </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            {
              e.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Số lượng:</div>)
            }

            <div>
              {e.low_stock_quantity > 0 ? e.low_stock_quantity && `${formatCash(
                String(e.low_stock_quantity)
              )}.` : ''}
            </div>
          </div>)
        }


      </>)) : (
        <>
          {
            (record.quantity && record.quantity > 0) || (record.available_stock_quantity && record.available_stock_quantity > 0) ? (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.available_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.available_stock_quantity > 0 ? record.available_stock_quantity && `${formatCash(
                    String(record.available_stock_quantity)
                  )}.` : ''}
                </div>
              </div>
            </div>) : (<div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                {
                  record.low_stock_quantity <= 0 ? ('') : (<div style={{ marginRight: '0.25rem', color: 'black', fontWeight: '600', fontSize: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>Số lượng:</div>)
                }

                <div>
                  {record.low_stock_quantity > 0 ? record.low_stock_quantity && `${formatCash(
                    String(record.low_stock_quantity)
                  )}.` : ''}
                </div>
              </div>

            </div>)
          }


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
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{record.name}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Phiên bản:</div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    return (
                      <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>{`${values.title}.`}</div>
                    )
                  })
                ) : ''
              }
            </div>
          </div>) : <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
        }
      </div>
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'category',
      width: 125,
      render: (text, record) =>
        text.name
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusMain',
      width: 250,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
        {
          record && record.variants && record.variants.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              {
                record && record.variants && record.variants.length > 0 ? (
                  record && record.variants.map((values, index) => {
                    if (values.status === 'available_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'low_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else if (values.status === 'out_stock') {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    } else {
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{`${values.title}.`}</div>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${values.status}`}</div>
                        </div>
                      )
                    }

                  })
                ) : ''
              }
            </div>
          </div>) : record.status === 'available_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'low_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (record.status === 'out_stock' ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600' }}>{statusName !== '' ? (record && record.variants && record.variants.length === 0 ? (record.title) : (record.name)) : (record.name)}</div>
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', textTransform: 'capitalize', fontWeight: '600' }}>{`${record.status}`}</div>
          </div>)))
        }
      </div>
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'sale_price',
      width: 250,
      render: (text, record) => record.variants && record.variants.length > 0 ? record.variants.map(e => (<>
        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>{e.title}</div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.sale_price && `${formatCash(
            String(e.sale_price)
          )} VNĐ (giá bán),`}
        </div>
        <div style={{ marginBottom: '0.5rem', }}>
          {e.base_price && `${formatCash(
            String(e.base_price)
          )} VNĐ (giá cơ bản).`}
        </div>
      </>)) : (
        <>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.sale_price && `${formatCash(
              String(record.sale_price)
            )} VNĐ (giá bán),`}
          </div>
          <div style={{ marginBottom: '0.5rem', }}>
            {record.base_price && `${formatCash(
              String(record.base_price)
            )} VNĐ (giá cơ bản).`}
          </div>
        </>

      ),
    },

    {
      title: "Ngày nhập",
      dataIndex: "create_date",
      width: 150,
      render(data) {
        return moment(data).format("DD-MM-YYYY")
      }
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'suppliers',
      width: 200,
      render: (text, record) => (
        <div>
          {text.name}
        </div>
      ),
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      width: 200,
      render: (text, record) => (
        <div>
          {text ? text.name : ''}
        </div>
      ),
    },

  ]
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const onClickClear = async () => {
    if (statusName !== 'available_stock') {
      await apiAllProductDataMain()
      openNotificationClear()
      setValueSearch('')
      setCategoryValue("")
      setClear(1)
      setStatusName('')
      setTimeFilter("")
      setAllSelect("")
      setSelectValue("")
      setSelectedRowKeys([])
      setStart([])
      setEnd([])
      setFilter({})
      setSearchFilter({})
    }

  }

  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Sản phẩm đang cung cấp. Không thể thực hiện chức năng này.',
    })
  }
  const openNotificationDeleteSupplierError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Sản phẩm đang ở trạng thái ngừng cung cấp. Không thể thực hiện chức năng này.',
    })
  }
  const openNotificationSuccessStoreDelete = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        data === 2
          ? 'Sản phẩm đã ngừng bán.'
          : 'Sản phẩm đã bán lại',
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
  const openNotificationSuccessUpdateProductMain = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Thêm ảnh sản phẩm <b>{data}</b> thành công
        </div>
      ),
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
  const apiUpdateProductMultiMainDelete = async (object, id) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      setLoading(true)
      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        if (res.status === 200) {
          await apiAllProductData()
          setIndexCheckbox([])

          setSkuSelectArray([])
          setIndexCheckboxSimple([])
          // setSelectedRowKeys([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
          //   onClose()
          //   onCloseUpdate()
          //   setCheckboxValue(false)
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          await apiAllProductData()
          setIndexCheckbox([])

          setIndexCheckboxSimple([])
          // setSelectedRowKeys([])
          openNotificationSuccessUpdateProductMainDelete(object.name)
          //   onClose()
          //   onCloseUpdate()
          //   setCheckboxValue(false)
        }
      }

      // if (res.status === 200) setStatus(res.data.status);
      //   dispatch({type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
      setLoading(false)
    } catch (error) {
      console.log(error)
      //    dispatch({type: ACTION.LOADING, data: false });
      setLoading(false)
    }
  }
  const apiUpdateProductMultiMain = async (object, id) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      setLoading(true)

      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        console.log("______________________________555555555555")
        if (res.status === 200) {
          await apiAllProductData()
          // setSelectedRowKeys([])
          //    openNotificationSuccessUpdateProductMain(object.name)
          //   onClose()
          //   onCloseUpdate()
          //   setCheckboxValue(false)
        }
        // if (res.status === 200) setStatus(res.data.status);
        //   dispatch({type: ACTION.LOADING, data: false });
        // openNotification();
        // history.push(ROUTES.NEWS);
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          await apiAllProductData()
          // setSelectedRowKeys([])
          //    openNotificationSuccessUpdateProductMain(object.name)
          //   onClose()
          //   onCloseUpdate()
          //   setCheckboxValue(false)
        }
        // if (res.status === 200) setStatus(res.data.status);
        //   dispatch({type: ACTION.LOADING, data: false });
        // openNotification();
        // history.push(ROUTES.NEWS);
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      //    dispatch({type: ACTION.LOADING, data: false });
      setLoading(false)
    }
  }
  const apiUpdateProductMulti = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      if (viewMode === 1) {
        const res = await apiUpdateProductStore(object, id)
        console.log(res)
        if (res.status === 200) {
          await apiAllProductData()
          setSelectedRowKeys([])
          openNotificationSuccessUpdateProduct(object.name)
          onClose()
          onCloseUpdate()
          setCheckboxValue(false)
        } else {
          openNotificationSuccessUpdateProductError()
        }
      } else {
        const res = await apiUpdateProduct(object, id)
        console.log(res)
        if (res.status === 200) {
          await apiAllProductData()
          setSelectedRowKeys([])
          openNotificationSuccessUpdateProduct(object.name)
          onClose()
          onCloseUpdate()
          setCheckboxValue(false)
        } else {
          openNotificationSuccessUpdateProductError()
        }
      }

      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false });
    }
  }
  const apiUpdateProductData = async (object, id, data) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiUpdateProduct(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllProductData()
        setSelectedRowKeys([])
        openNotificationSuccessStoreDelete(data)
      } else {
        openNotificationSuccessStoreDeleteError()
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  function confirm(e) {
    console.log(e)
    // message.success('Click on Yes');
    product &&
      product.length > 0 &&
      product.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            if (values.active === false) {
              openNotificationDeleteSupplierError()
            } else {
              const object = {
                active: false,
              }
              apiUpdateProductData(object, values.product_id, 1)
            }
          }
        })
      })
  }
  const [valueSwitch, setValueSwitch] = useState(false)
  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`)
    setValueSwitch(checked)
    // const object = {
    //   active: checked,
    // }
    apiUpdateProductData({ ...record, active: checked }, record.product_id, checked ? 1 : 2)
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
          // console.log(values)
          // const object = {
          //   sku: values.sku,
          //   name: values.name,
          //   barcode: '',
          //   category:
          //     typeof values.category === 'object'
          //       ? values.category.category_id
          //       : values.category,
          //   image: [],
          //   length: 0,
          //   width: 0,
          //   height: 0,
          //   weight: 0,
          //   warranty: [],
          //   quantity: 0,
          //   unit: '',
          //   has_variable: true,
          //   // suppliers: values && values.suppliers ? values.suppliers[-1] : values.suppliers,
          //   suppliers:
          //     values && values.suppliers ? array : [],
          //   variants: values.variants,
          //   attributes: values.attributes,
          //   // regular_price: values.regular_price,
          //   // sale_price: values.sale_price,
          // }
          console.log(values)
          console.log("________777778888")
          apiUpdateProductMulti({ ...values }, values.product_id)
          // if (
          //   values &&
          //   values.attributes &&
          //   values.attributes.length > 0
          // ) {
          //   if (
          //     values.length === '' &&
          //     values.width === '' &&
          //     values.height === '' &&
          //     values.weight === '' &&
          //     values.unit === ''
          //   ) {
          //     if (
          //       isNaN(values.base_price) ||
          //       isNaN(values.sale_price) ||
          //       // isNaN(values.import_price) ||
          //       isNaN(values.quantity)
          //     ) {
          //       if (isNaN(values.provideQuantity)) {
          //         openNotificationNumber('Số lượng cung cấp')
          //       }
          //     } else {
          //       var array = []
          //       values &&
          //         values.supplier &&
          //         values.supplier.length > 0 &&
          //         values.supplier.forEach(
          //           (values10, index10) => {
          //             array.push(values10.supplier_id)
          //           }
          //         )
          //       const object = {
          //         sku: values.sku,
          //         name: values.name,
          //         barcode: '',
          //         category:
          //           typeof values.category === 'object'
          //             ? values.category.category_id
          //             : values.category,
          //         image: [],
          //         length: 0,
          //         width: 0,
          //         height: 0,
          //         weight: 0,
          //         warranty: [],
          //         quantity: 0,
          //         unit: '',
          //         has_variable: true,
          //         // suppliers: values && values.suppliers ? values.suppliers[-1] : values.suppliers,
          //         suppliers:
          //           values && values.suppliers ? array : [],
          //         variants: values.variants,
          //         attributes: values.attributes,
          //         // regular_price: values.regular_price,
          //         // sale_price: values.sale_price,
          //       }
          //       apiUpdateProductMulti(object, values.product_id)
          //     }
          //   } else {
          //     if (
          //       (values.length && isNaN(values.length)) ||
          //       (values.width && isNaN(values.width)) ||
          //       (values.height && isNaN(values.height)) ||
          //       (values.weight && isNaN(values.weight)) ||
          //       isNaN(values.quantity)
          //     ) {
          //       if (values.length && isNaN(values.length)) {
          //         openNotificationNumber('Chiều dài')
          //       }
          //       if (values.width && isNaN(values.width)) {
          //         openNotificationNumber('Chiều rộng')
          //       }
          //       if (values.height && isNaN(values.height)) {
          //         openNotificationNumber('Chiều cao')
          //       }
          //       if (values.weight && isNaN(values.weight)) {
          //         openNotificationNumber('Cân nặng')
          //       }
          //       if (isNaN(values.quantity)) {
          //         openNotificationNumber('Số lượng cung cấp')
          //       }
          //     } else {
          //       var array = []
          //       values &&
          //         values.suppliers &&
          //         values.suppliers.length > 0 &&
          //         values.suppliers.forEach(
          //           (values10, index10) => {
          //             array.push(values10.supplier_id)
          //           }
          //         )
          //       const object = {
          //         sku: values.sku,
          //         name: values.name,
          //         barcode: '',
          //         category:
          //           typeof values.category === 'object'
          //             ? values.category.category_id
          //             : values.category,
          //         image: [],
          //         length: values.length,
          //         width: values.width,
          //         height: values.height,
          //         weight: values.weight,
          //         warranty: [],
          //         quantity: 0,
          //         unit: '',
          //         has_variable: true,
          //         suppliers:
          //           values && values.suppliers ? array : [],
          //         variants: values.variants,
          //         attributes: values.attributes,
          //       }
          //       apiUpdateProductMulti(object, values.product_id)
          //     }
          //   }
          // } else {
          //   if (
          //     values.length === '' &&
          //     values.width === '' &&
          //     values.height === '' &&
          //     values.weight === '' &&
          //     values.unit === ''
          //   ) {
          //     if (
          //       isNaN(values.regular_price) ||
          //       isNaN(values.sale_price) ||
          //       isNaN(values.import_price) ||
          //       isNaN(values.quantity)
          //     ) {
          //       if (isNaN(values.provideQuantity)) {
          //         openNotificationNumber('Số lượng cung cấp')
          //       }
          //     } else {
          //       const object = {
          //         sku: values.sku,
          //         name: values.name,
          //         barcode: values.barcode,
          //         category:
          //           typeof values.category === 'object'
          //             ? values.category.category_id
          //             : values.category,
          //         image: values.image,
          //         length: 0,
          //         width: 0,
          //         height: 0,
          //         weight: 0,
          //         warranty:
          //           values && values.warranty
          //             ? values.warranty[-1]
          //             : values.warranty,
          //         quantity: values.quantity,
          //         unit: values.unit,
          //         has_variable: false,
          //         suppliers:
          //           values && values.suppliers
          //             ? values.suppliers[-1]
          //             : values.suppliers,
          //         regular_price: values.regular_price,
          //         sale_price: values.sale_price,
          //       }
          //       apiUpdateProductMulti(object, values.product_id)
          //     }
          //   } else {
          //     if (
          //       (values.length && isNaN(values.length)) ||
          //       (values.width && isNaN(values.width)) ||
          //       (values.height && isNaN(values.height)) ||
          //       (values.weight && isNaN(values.weight)) ||
          //       isNaN(values.quantity)
          //     ) {
          //       if (values.length && isNaN(values.length)) {
          //         openNotificationNumber('Chiều dài')
          //       }
          //       if (values.width && isNaN(values.width)) {
          //         openNotificationNumber('Chiều rộng')
          //       }
          //       if (values.height && isNaN(values.height)) {
          //         openNotificationNumber('Chiều cao')
          //       }
          //       if (values.weight && isNaN(values.weight)) {
          //         openNotificationNumber('Cân nặng')
          //       }
          //       if (isNaN(values.quantity)) {
          //         openNotificationNumber('Số lượng cung cấp')
          //       }
          //     } else {
          //       const object = {
          //         sku: values.sku,
          //         name: values.name,
          //         barcode: values.barcode,
          //         image: values.image,
          //         length: values.length,
          //         width: values.width,
          //         height: values.height,
          //         weight: values.weight,
          //         regular_price: values.regular_price,
          //         sale_price: values.sale_price,
          //         warranty:
          //           values && values.warranty
          //             ? values.warranty[-1]
          //             : values.warranty,
          //         quantity: values.quantity,
          //         unit:
          //           values && values.unit
          //             ? values.unit
          //             : '',

          //         category:
          //           typeof values.category === 'object'
          //             ? values.category.category_id
          //             : values.category,
          //         suppliers:
          //           values &&
          //             values.suppliers &&
          //             values.suppliers
          //             ? values.suppliers[-1]
          //             : values.suppliers,
          //         has_variable: false,
          //       }
          //       apiUpdateProductMulti(object, values.product_id)
          //     }
          //   }
          // }
        })
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          console.log(values)
          if (
            values &&
            values.attributes &&
            values.attributes.length > 0
          ) {
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
                // if (isNaN(values.priceTax)) {
                //   openNotificationNumber('Giá nhập thuế')
                // }
                // if (isNaN(values.priceRetail)) {
                //   openNotificationNumber('Giá bán lẻ')
                // }
                // if (isNaN(values.priceWholeSale)) {
                //   openNotificationNumber('Giá bán sỉ')
                // }
              } else {
                var array = []
                values &&
                  values.suppliers &&
                  values.suppliers.length > 0 &&
                  values.suppliers.forEach(
                    (values10, index10) => {
                      array.push(values10.supplier_id)
                    }
                  )
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: '',
                  category:
                    typeof arrayUpdate[0].category ===
                      'object'
                      ? arrayUpdate[0].category
                        .category_id
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
                  // suppliers: arrayUpdate[0] && arrayUpdate[0].suppliers ? arrayUpdate[0].suppliers[-1] : arrayUpdate[0].suppliers,
                  suppliers:
                    arrayUpdate[0] &&
                      arrayUpdate[0].suppliers
                      ? array
                      : [],
                  variants: arrayUpdate[0].variants,
                  attributes: arrayUpdate[0].attributes,
                  // regular_price: values.regular_price,
                  // sale_price: values.sale_price,
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
                // if (isNaN(values.import_price)) {
                //   openNotificationNumber('Giá nhập thuế')
                // }
                // if (isNaN(values.sale_price)) {
                //   openNotificationNumber('Giá bán lẻ')
                // }
                // if (isNaN(values.regular_price)) {
                //   openNotificationNumber('Giá bán sỉ')
                // }
              } else {
                var array = []
                arrayUpdate[0] &&
                  arrayUpdate[0].suppliers &&
                  arrayUpdate[0].suppliers.length > 0 &&
                  arrayUpdate[0].suppliers.forEach(
                    (values10, index10) => {
                      array.push(values10.supplier_id)
                    }
                  )
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: '',
                  category:
                    typeof arrayUpdate[0].category ===
                      'object'
                      ? arrayUpdate[0].category
                        .category_id
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
                    arrayUpdate[0] &&
                      arrayUpdate[0].suppliers
                      ? array
                      : [],
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
                // if (isNaN(values.priceTax)) {
                //   openNotificationNumber('Giá nhập thuế')
                // }
                // if (isNaN(values.priceRetail)) {
                //   openNotificationNumber('Giá bán lẻ')
                // }
                // if (isNaN(values.priceWholeSale)) {
                //   openNotificationNumber('Giá bán sỉ')
                // }
              } else {
                const object = {
                  sku: values.sku,
                  name: values.name,
                  barcode: arrayUpdate[0].barcode,
                  category:
                    typeof arrayUpdate[0].category ===
                      'object'
                      ? arrayUpdate[0].category
                        .category_id
                      : arrayUpdate[0].category,
                  image: arrayUpdate[0].image,
                  length: 0,
                  width: 0,
                  height: 0,
                  weight: 0,
                  warranty:
                    arrayUpdate[0] &&
                      arrayUpdate[0].warranty
                      ? arrayUpdate[0].warranty[-1]
                      : arrayUpdate[0].warranty,
                  quantity: arrayUpdate[0].quantity,
                  unit: arrayUpdate[0].unit,
                  has_variable: false,
                  suppliers:
                    arrayUpdate[0] &&
                      arrayUpdate[0].suppliers
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
                // if (isNaN(values.import_price)) {
                //   openNotificationNumber('Giá nhập thuế')
                // }
                // if (isNaN(values.sale_price)) {
                //   openNotificationNumber('Giá bán lẻ')
                // }
                // if (isNaN(values.regular_price)) {
                //   openNotificationNumber('Giá bán sỉ')
                // }
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
                    arrayUpdate[0] &&
                      arrayUpdate[0].warranty
                      ? arrayUpdate[0].warranty[-1]
                      : arrayUpdate[0].warranty,
                  quantity: arrayUpdate[0].quantity,
                  unit:
                    arrayUpdate[0] && arrayUpdate[0].unit
                      ? arrayUpdate[0].unit
                      : '',

                  category:
                    typeof arrayUpdate[0].category ===
                      'object'
                      ? arrayUpdate[0].category
                        .category_id
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
    arrayUpdateCategory && arrayUpdateCategory.length > 0 && arrayUpdateCategory.forEach((values, index) => {
      if ((values.name === '' || values.name === ' ' || values.name === 'default') || (values.type === '' || values.type === ' ' || values.type === 'default')) {
        if (values.name === '' || values.name === ' ' || values.name === 'default') {
          openNotificationErrorCategory('tên')
        }
        if (values.type === '' || values.type === ' ' || values.type === 'default') {
          openNotificationErrorCategory('loại')
        }
      } else {
        const object = {
          name: values.name,
          type: values.type,
          description: values.description ? values.description : ''
        }
        apiUpdateCategoryDataUpdate(object, values.category_id)
      }

    })
  }
  const apiAllWarrantyData = async () => {
    try {
      setLoading(true)
      const res = await apiAllWarranty()
      console.log(res)
      if (res.status === 200) {
        setWarranty(res.data.data)
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }


  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object })
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [statusName, setStatusName] = useState('')
  const [productStatus, setProductStatus] = useState([])
  const filterProductMain = async (params) => {
    try {
      setLoading(true)
      const res = await apiSearchProduct(params)
      console.log(res)
      if (res.status === 200) {

        console.log(res.data.data)
        console.log("_________________-6666666666")
        setProduct(res.data.data)
        setCount(res.data.count)

        setSelectedRowKeys([])
        setProductStatus(res.data.data)
        setStatusName(params.status.toLowerCase())
        setPaginationChecked(1)
      }
      setLoading(false)
    } catch (e) {
      console.log(e);
      setLoading(false)
    }
  }
  const filterProduct = async (params) => {
    try {
      setLoading(true)
      const res = !viewMode ? await apiSearchProduct(params) : await apiProductSeller(params)
      console.log(res)
      if (res.status === 200) {
        setProduct(res.data.data)
        setSelectedRowKeys([])
        setPaginationChecked(1)
        setCount(res.data.count)
      }
      setLoading(false)
    } catch (e) {
      console.log(e);
      setLoading(false)
    }
  }
  const [timeFilter, setTimeFilter] = useState("")
  const filterByTime = async (e) => {
    // console.log(JSON.parse(e));
    if (e === 'default') {
      await apiAllProductData()
    } else {
      setTimeFilter(e)
      filterProduct({ ...JSON.parse(e), page: 1, page_size: 10 })
    }


  }
  const [selectValue, setSelectValue] = useState("")
  function onSelectSearch(val) {
    console.log(val);
    setCategorySearch(val)
    setSelectValue(val)
  }

  const getwarehouse = async () => {
    try {
      const res = await apiAllInventory()
      if (res.status == 200) {

        setWarehouseList(res.data.data)
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  const getBranch = async () => {
    try {
      const res = await getAllBranchMain()
      if (res.status == 200) {
        setBranchList(res.data.data)
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  const [allSelect, setAllSelect] = useState("")
  const onChangeAllSelect = async (e) => {
    setAllSelect(e)
    if (e === 'default') {
      await apiAllProductDataMain()
    } else {
      if (viewMode) {
        apiAllProductData({ branch: e });
        setViewLocation({ branch: e })
      } else {
        apiAllProductData({ warehouse: e });
        setViewLocation({ warehouse: e })
      }
    }
  }
  const apiAllProductPage = async (current, pageSize) => {
    try {
      setLoading(true)
      if (viewMode === 1) {
        const res = await apiProductSeller({
          page: current,
          page_size: pageSize,
        })

        if (res.status === 200) {
          setProductStore(res.data.data)
          setCount(res.data.count)
          setSelectedRowKeys([])
        }
      } else {
        const res = await apiSearchProduct({
          page: current,
          page_size: pageSize,
        })

        if (res.status === 200) {
          setProduct(res.data.data)
          setCount(res.data.count)
          setSelectedRowKeys([])
        }
      }

      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
    }
  }
  const apiUpdateCategoryDataUpdate = async (object, id) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiUpdateCategory(object, id);
      console.log(res);
      console.log("___________________________123123")
      if (res.status === 200) {
        await apiAllCategoryData()
        setSelectedRowKeysCategory([])
        setSelectedRowKeys([])

        openNotificationSuccessStoreUpdate(object.name)
        onCloseCategoryGroupUpdate()
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  console.log(selectedRowKeysCategory)
  console.log("__________________________456456")
  function onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
    apiAllProductPage(current, pageSize)
    setPaginationChecked(current)
  }
  const onChangePage = page => {
    console.log(page);
    apiAllProductPage(page, 10)

    setPaginationChecked(page)
  };
  console.log(productStatus)
  console.log("_____________________________456456456")
  const [statusCount, setStatusCount] = useState(0)
  const filterProductMainFunc = (data, count) => {
    filterProductMain({ status: data, page: 1, page_size: 10, merge: false })
    setStatusCount(count)
  }
  const onClickAll = async (count) => {

    if (statusName !== 'available_stock') {
      await apiAllProductDataMain()
      setStatusName('')
      setStatusCount(count)
    }
  }
  const [categoryValue, setCategoryValue] = useState('')
  const onChangeCategoryValue = async (e) => {
    if (e === '' || e === ' ' || e === 'default') {
      await apiAllProductData()
    } else {

      apiSearchDataGroup(e)
    }
    setCategoryValue(e)
  }
  console.log(warehouseList)
  console.log("______________________567567")
  return (
    <UI>
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
                <div
                  className={
                    styles['view_product_back_title']
                  }
                >
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', marginRight: '1rem', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Button
                    onClick={showDrawerGroup}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  >
                    Nhóm sản phẩm
                  </Button></div>
                <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', }}>
                  <Link to="/actions/product/add/6">
                    <Button

                      type="primary"
                      icon={<PlusCircleOutlined />}
                    >
                      Thêm sản phẩm
                    </Button>
                  </Link>
                </div>

              </div>

            </Col>
          </Row>
          <Row style={{ width: "100%", marginTop: 20 }}>
            <Radio.Group defaultValue={viewMode} onChange={(e) => onChangeSelectInventoryStore(e)}>
              <Radio style={{ marginBottom: '0.5rem' }} value={0}>Xem theo Kho</Radio>
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
              <Select value={allSelect ? allSelect : 'default'} showSearch
                style={{ width: '100%' }}
                placeholder={!viewMode ? `Chọn kho` : 'Chọn chi nhánh'}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } onChange={onChangeAllSelect}>
                <Option value="default">{!viewMode ? `Chọn kho` : 'Chọn chi nhánh'}</Option>)
                {!viewMode ?
                  warehouseList.map(e => <Option value={e.warehouse_id}>{e.name}</Option>)
                  : branchList.map(e => <Option value={e.branch_id}>{e.name}</Option>)
                }
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
              <Select showSearch
                style={{ width: '100%' }}
                placeholder="Chọn nhóm sản phẩm"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={categoryValue ? categoryValue : 'default'} onChange={onChangeCategoryValue}>
                <Option value="default">Chọn nhóm sản phẩm</Option>
                {
                  category && category.length > 0 && category.map((values, index) => {
                    return (
                      <Option value={values.name}>{values.name}</Option>
                    )
                  })
                }
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
                      enterButton
                      onChange={onSearch}
                      className={
                        styles[
                        'orders_manager_content_row_col_search'
                        ]
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
                      value={selectValue ? selectValue : 'default'}
                      onChange={onSelectSearch}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {/* <Option value="create_date">Ngày nhập</Option> */}
                      <Option value="default">Chọn theo</Option>
                      <Option value="sku">SKU</Option>
                      <Option value="name">Tên sản phẩm</Option>
                      <Option value="_category">Loại sản phẩm</Option>
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
              <Select value={timeFilter ? timeFilter : 'default'} onChange={filterByTime} showSearch
                style={{ width: '100%' }}
                placeholder="Lọc theo thời gian"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                <Option value="default">Lọc theo thời gian</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') })
                }>Today</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'days').format('YYYY-MM-DD') })
                }>Yesterday</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().startOf('week').format('YYYY-MM-DD'), to_date: moment().endOf('week').format('YYYY-MM-DD') })
                }>This week</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD') })
                }>Last week</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') })
                }>This month</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') })
                }>Last Month</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().startOf('years').format('YYYY-MM-DD'), to_date: moment().endOf('years').format('YYYY-MM-DD') })
                }>This year</Option>
                <Option value={
                  JSON.stringify({ from_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') })
                }>Last year</Option>
              </Select>
            </Col>
            {/* 
            <Col
              style={{
                width: '100%',
                marginTop: '1rem',
                // marginLeft: '1rem',
              }}
              xs={24}
              sm={24}
              md={24}
              lg={11}
              xl={11}
            >
              <div style={{ width: '100%' }}>
                <RangePicker
                  // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                  value={
                    clear === 1
                      ? []
                      : start !== ''
                        ? [
                          moment(start, dateFormat),
                          moment(end, dateFormat),
                        ]
                        : []
                  }
                  style={{ width: '100%' }}
                  ranges={{
                    Today: [moment(), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  onChange={onChangeDate}
                />
              </div>
            </Col> */}

          </Row>


          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
              marginBottom: '1rem',
            }}
          >

            <Button
              onClick={onClickClear}
              type="primary"
              style={{ width: '7.5rem' }}
            >
              Xóa tất cả lọc
            </Button>
          </div>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Row style={{ width: "100%", marginBottom: 10 }}>
              {/* <Button onClick={showDrawerUpdate} value={1} type="primary" style={{ marginRight: 20 }}>
                Cập nhật hàng loạt
              </Button> */}
              <Button onClick={showDrawer} value={1} type="primary" style={{ marginRight: '1rem' }}>
                Cập nhật
              </Button>
              <Button onClick={() => {
                history.push({
                  pathname: '/actions/shipping-product/add/9',
                  state: arrayUpdate
                })
              }} type="primary">
                Tạo phiếu chuyển hàng
              </Button>
              <Button style={{ marginLeft: '1rem' }} onClick={() => modal5VisibleModal(true)}
                type="primary">
                Tạo nhóm sản phẩm
              </Button>
            </Row>
          ) : (
            ''
          )}
          <Row style={{ width: "100%", backgroundColor: 'rgb(235, 224, 224)', marginTop: '0.25rem', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
            {
              statusCount === 0 ? (<div onClick={() => onClickAll(0)} style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600', color: 'orange' }} >All &nbsp;</div>) : (<div onClick={() => onClickAll(0)} style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600' }} >All &nbsp;</div>)
            }

            <span style={{ width: 12, height: 12, background: "rgba(47, 155, 255, 1)", marginRight: 5, marginTop: '0.45rem' }}></span>
            {
              statusCount === 1 ? (<div style={{ cursor: "pointer", color: 'rgba(47, 155, 255, 1)', marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('shipping_stock', 1)}> Shipping &nbsp;</div>) : (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('shipping_stock', 1)}> Shipping &nbsp;</div>)
            }

            <span style={{ width: 12, height: 12, background: "#24A700", marginRight: 5, marginTop: '0.45rem' }}></span>
            {
              statusCount === 2 ? (<div style={{ cursor: "pointer", color: '#24A700', marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('available_stock', 2)}>   Available</div>) : (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('available_stock', 2)}>Available</div>)
            }


            <span style={{ width: 12, height: 12, background: "#A06000", marginRight: 5, marginTop: '0.45rem' }}></span>
            {
              statusCount === 3 ? (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600', color: '#A06000' }} onClick={() => filterProductMainFunc('low_stock', 3)}> Low stock &nbsp;</div>) : (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('low_stock', 3)}> Low stock &nbsp;</div>)
            }

            <span style={{ width: 12, height: 12, background: "rgba(254, 146, 146, 1)", marginRight: 5, marginTop: '0.45rem' }}></span>
            {
              statusCount === 4 ? (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600', color: 'rgba(254, 146, 146, 1)' }} onClick={() => filterProductMainFunc('out_stock', 4)}> Out stock &nbsp;</div>) : (<div style={{ cursor: "pointer", marginRight: 30, fontSize: '1rem', fontWeight: '600' }} onClick={() => filterProductMainFunc('out_stock', 4)}> Out stock &nbsp;</div>)
            }
          </Row>
          <div className={styles['view_product_table']}>
            <Table
              className={styles['time-table-row-select']}
              rowSelection={statusName === '' || statusName === ' ' || statusName === 'default' ? rowSelection : ''}
              bordered
              rowClassName={(record, index) =>
                // record.has_variable && record.variants.length > 0 ? (record.variants.map((values, index) => {
                //   return (
                //     (parseInt(values && values.quantity && values.quantity !== null ? values.quantity : 0) + parseInt(values.available_stock_quantity)) > parseInt(values && values.status_check_value) ? styles['normal'] : styles['warm']
                //   )
                // })) : (record.available_stock_quantity > parseInt(record.status_check_value) ? styles['normal'] : styles['warm'])
                record.has_variable && record.variants.length > 0 ? (record.variants.map((values, index) => {
                  if (values.status.toLowerCase() === 'available_stock') {
                    return (
                      styles['available_stock']
                    )
                  } else if (values.status.toLowerCase() === 'low_stock') {
                    return (
                      styles['low_stock']
                    )
                  } else if (values.status.toLowerCase() === 'shipping_stock') {
                    return (
                      styles['shipping_stock']
                    )
                  } else {
                    return (
                      styles['out_stock']
                    )
                  }
                  // return (
                  //   (parseInt(values && values.quantity && values.quantity !== null ? values.quantity : 0) + parseInt(values.available_stock_quantity)) > 10 ? styles['normal'] : styles['warm']
                  // )
                })) : (record.status.toLowerCase() === 'available_stock' ? (styles['available_stock']) : (record.status.toLowerCase() === 'low_stock' ? (styles['low_stock']) : (record.status.toLowerCase() === 'shipping_stock' ? (styles['shipping_stock']) : (styles['out_stock']))))
              }
              rowKey="_id"
              columns={viewMode === 1 ? (statusName === '' || statusName === ' ' || statusName === 'default' ? columnsStore : columnsStatusNameStore) : (statusName === '' || statusName === ' ' || statusName === 'default' ? columns : columnsStatusName)}
              pagination={false}
              // pagination={pagination}
              loading={loading}
              dataSource={productStore && productStore.length > 0 ? productStore : product}
              scroll={{ y: 1000 }}
            />
          </div>
          <Pagination
            style={{ marginTop: '1rem' }}
            showSizeChanger
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
            current={paginationChecked ? paginationChecked : 1}
            total={count}
          />
        </div>
      </div>

      {/* <div
        style={{
          margin: '0 1rem 0 1rem',
          padding: '0rem 0rem 1rem 1rem',
          backgroundColor: 'white',
        }}
      >
        <Row
          className={
            styles[
            'product_manager_main_product_quantity_type_table_child_chart'
            ]
          }
        >
          <Col
            style={{ marginTop: '1rem' }}
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={
              styles[
              'product_manager_main_product_quantity_type_table_title'
              ]
            }
          >
            Biểu đồ thể hiện số lượng tồn kho
          </Col>
        </Row>
        <div
          style={{ marginTop: '1rem', paddingRight: '1rem' }}
          className={
            styles[
            'product_manager_main_product_quantity_type_table_child_chart_parent'
            ]
          }
        >
          <Chart
            className={
              styles[
              'product_manager_main_product_quantity_type_table_child_chart'
              ]
            }
          />
        </div>
      </div> */}
      {
        viewMode === 1 ? (
          <Drawer
            style={{ zIndex: '999' }}
            title="Cập nhật số lượng sản phẩm"
            width='90%'
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button
                  onClick={() => onCloseUpdateFunc(1)}
                  type="primary"
                >
                  Cập nhật
                </Button>
              </div>
            }
          >
            {
              arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
                const obj = Object.keys(values)
                return values &&
                  values.attributes &&
                  values.attributes.length > 0 ? (

                  <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Col style={{ width: '100%', color: 'black', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>Sản phẩm Variant</Col>
                    {
                      obj.map((data) => {
                        if (data === 'suppliers') {
                          const InputName = () => (
                            <Select
                              defaultValue={
                                values[data].supplier_id
                              }
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn nhà cung cấp"
                              optionFilterProp="children"
                              filterOption={(
                                input,
                                option
                              ) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(
                                    input.toLowerCase()
                                  ) >= 0
                              }
                              onChange={(event) => {
                                // const value =
                                //   event.target.value;
                                arrayUpdate[index][
                                  data
                                ] = event
                              }}
                            >
                              {supplier &&
                                supplier.length > 0 &&
                                supplier.map(
                                  (values, index) => {
                                    return (
                                      <Option
                                        value={
                                          values.supplier_id
                                        }
                                      >
                                        {
                                          values.name
                                        }
                                      </Option>
                                    )
                                  }
                                )}
                            </Select>
                          )
                          return (
                            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà cung cấp</div>
                              <InputName />

                            </Col>
                          )
                        }
                        if (data === 'category') {
                          const InputName = () => (
                            <Select
                              defaultValue={
                                values[data].category_id
                              }
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn loại sản phẩm"
                              optionFilterProp="children"
                              filterOption={(
                                input,
                                option
                              ) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(
                                    input.toLowerCase()
                                  ) >= 0
                              }
                              onChange={(event) => {
                                // const value =
                                //   event.target.value;
                                arrayUpdate[index][
                                  data
                                ] = event
                              }}
                            >
                              {category &&
                                category.length > 0 &&
                                category.map(
                                  (values, index) => {
                                    return (
                                      <Option
                                        value={
                                          values.category_id
                                        }
                                      >
                                        {
                                          values.name
                                        }
                                      </Option>
                                    )
                                  }
                                )}
                            </Select>
                          )
                          return (
                            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Loại sản phẩm</div>
                              <InputName />

                            </Col>
                          )
                        }


                      })
                    }

                    <Col style={{ width: '100%' }}>
                      <Row style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', margin: '0.75rem 0 0.25rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Checkbox checked={checkboxValue} onChange={onChangeCheckbox}>Thông số sản phẩm (không bắt buộc)</Checkbox></div>
                        {
                          checkboxValue ? (obj.map((data) => {
                            if (data === 'length') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].length = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều dài (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'width') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].width = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều rộng (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'height') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].height = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều cao (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'weight') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].weight = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Cân nặng (kg)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                          })) : ''
                        }

                      </Row>
                    </Col>

                    <div style={{ width: '100%' }}>
                      <div style={{ color: 'black', padding: '1rem 1rem 1.5rem 0', fontSize: '1rem', fontWeight: '600' }}>Phiên bản:</div>
                      <Row style={{ display: 'flex', backgroundColor: '#FAFAFA', padding: '0 1rem 1rem 1rem', border: '1px solid rgb(230, 219, 219)', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={3}>Picture</Col> */}
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Variants</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Hình ảnh</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Giá cơ bản</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Giá bán</Col>

                        {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Seller</Col> */}
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Số lượng</Col>
                      </Row>
                      {
                        values.variants && values.variants.length > 0 && values.variants.map((values1, index1) => {
                          const obj1 = Object.keys(values1)
                          return (
                            <Row style={{ display: 'flex', borderBottom: '1px solid rgb(230, 219, 219)', borderLeft: '1px solid rgb(230, 219, 219)', borderRight: '1px solid rgb(230, 219, 219)', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              {
                                obj1.map((data1) => {
                                  if (data1 === 'title') {
                                    const InputName = () => (
                                      <Input
                                        disabled
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {
                                          const value =
                                            event.target.value
                                          arrayUpdate[index].variants[index1].title = value
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'available_stock_quantity') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        // defaultValue={values1.quantity}
                                        defaultValue={arrayUpdate[index].variants[index1].quantity !== null && arrayUpdate[index].variants[index1].quantity > 0 ? arrayUpdate[index].variants[index1].quantity : (arrayUpdate[index].variants[index1].available_stock_quantity > 0 ? arrayUpdate[index].variants[index1].available_stock_quantity : arrayUpdate[index].variants[index1].low_stock_quantity)}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].quantity = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'base_price') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].base_price = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'sale_price') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].sale_price = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'image') {
                                    const InputName = () => <UploadImgChild
                                      imageUrl={values1[data1]}
                                      indexUpdate={values._id}
                                      index20={index1}

                                    />
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <div>

                                          {/* <Form.Item
        label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
        name="phone"
        rules={[{ required: true, message: "Giá trị rỗng!" }]}
      > */}
                                          {/* <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh sản phẩm</div> */}

                                          <InputName />
                                          {/* </Form.Item> */}
                                        </div>
                                      </Col>
                                    )
                                  }
                                })
                              }
                            </Row>
                          )
                        })
                      }
                    </div>

                  </Row>
                ) : <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Col style={{ width: '100%', color: 'black', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>Sản phẩm Simple</Col>
                  {
                    obj.map((data) => {
                      if (data === 'suppliers') {
                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].supplier_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn nhà cung cấp"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {supplier &&
                              supplier.length > 0 &&
                              supplier.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.supplier_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )
                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà cung cấp</div>
                            <InputName />

                          </Col>
                        )
                      }
                      if (data === 'category') {
                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].category_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn loại sản phẩm"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {category &&
                              category.length > 0 &&
                              category.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.category_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )
                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Loại sản phẩm</div>
                            <InputName />

                          </Col>
                        )
                      }

                      if (data === 'warehouse') {

                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].warehouse_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn kho"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {warehouseList &&
                              warehouseList.length > 0 &&
                              warehouseList.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.warehouse_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )

                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà Kho</div>
                            <InputName />

                          </Col>
                        )





                      }
                      if (data === 'available_stock_quantity') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            // defaultValue={values.quantity}
                            defaultValue={arrayUpdate[index].available_stock_quantity}
                            onChange={(event) => {

                              arrayUpdate[index].quantity = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Số lượng</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'base_price') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            defaultValue={values[data]}
                            onChange={(event) => {

                              arrayUpdate[index][
                                data
                              ] = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá cơ bản</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'sale_price') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            defaultValue={values[data]}
                            onChange={(event) => {

                              arrayUpdate[index][
                                data
                              ] = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá bán</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'image') {
                        const InputName = () => <UploadImg
                          imageUrl={values[data]}
                          indexUpdate={values._id}

                        />
                        return (
                          <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', marginBottom: '0.5rem', fontWeight: '600' }}><b style={{ color: 'red' }}>*</b>Ảnh sản phẩm</div>
                              {/* <Form.Item
              label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
              name="phone"
              rules={[{ required: true, message: "Giá trị rỗng!" }]}
            > */}
                              {/* <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh sản phẩm</div> */}

                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                    })
                  }

                  <Col style={{ width: '100%' }}>
                    <Row style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', margin: '1.5rem 0 0.25rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Checkbox checked={checkboxValue} onChange={onChangeCheckbox}>Thông số sản phẩm (không bắt buộc)</Checkbox></div>
                      {
                        checkboxValue ? (obj.map((data) => {
                          if (data === 'length') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].length = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều dài (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'width') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].width = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều rộng (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'height') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].height = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều cao (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'weight') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].weight = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Cân nặng (kg)</div>

                                <InputName />
                              </Col>
                            )
                          }
                        })) : ''
                      }

                    </Row>
                  </Col>


                </Row>
              })
            }
          </Drawer>
        ) : (
          <Drawer
            style={{ zIndex: '999' }}
            title="Cập nhật số lượng sản phẩm"
            width='90%'
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button
                  onClick={() => onCloseUpdateFunc(1)}
                  type="primary"
                >
                  Cập nhật
                </Button>
              </div>
            }
          >
            {
              arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
                const obj = Object.keys(values)
                return values &&
                  values.attributes &&
                  values.attributes.length > 0 ? (

                  <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Col style={{ width: '100%', color: 'black', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>Sản phẩm Variant</Col>
                    {
                      obj.map((data) => {
                        if (data === 'suppliers') {
                          const InputName = () => (
                            <Select
                              defaultValue={
                                values[data].supplier_id
                              }
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn nhà cung cấp"
                              optionFilterProp="children"
                              filterOption={(
                                input,
                                option
                              ) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(
                                    input.toLowerCase()
                                  ) >= 0
                              }
                              onChange={(event) => {
                                // const value =
                                //   event.target.value;
                                arrayUpdate[index][
                                  data
                                ] = event
                              }}
                            >
                              {supplier &&
                                supplier.length > 0 &&
                                supplier.map(
                                  (values, index) => {
                                    return (
                                      <Option
                                        value={
                                          values.supplier_id
                                        }
                                      >
                                        {
                                          values.name
                                        }
                                      </Option>
                                    )
                                  }
                                )}
                            </Select>
                          )
                          return (
                            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà cung cấp</div>
                              <InputName />

                            </Col>
                          )
                        }
                        if (data === 'category') {
                          const InputName = () => (
                            <Select
                              defaultValue={
                                values[data].category_id
                              }
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn loại sản phẩm"
                              optionFilterProp="children"
                              filterOption={(
                                input,
                                option
                              ) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(
                                    input.toLowerCase()
                                  ) >= 0
                              }
                              onChange={(event) => {
                                // const value =
                                //   event.target.value;
                                arrayUpdate[index][
                                  data
                                ] = event
                              }}
                            >
                              {category &&
                                category.length > 0 &&
                                category.map(
                                  (values, index) => {
                                    return (
                                      <Option
                                        value={
                                          values.category_id
                                        }
                                      >
                                        {
                                          values.name
                                        }
                                      </Option>
                                    )
                                  }
                                )}
                            </Select>
                          )
                          return (
                            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Loại sản phẩm</div>
                              <InputName />

                            </Col>
                          )
                        }
                        if (data === 'warehouse') {
                          const InputName = () => (
                            <Select
                              defaultValue={
                                values[data].warehouse_id
                              }
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn kho"
                              optionFilterProp="children"
                              filterOption={(
                                input,
                                option
                              ) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(
                                    input.toLowerCase()
                                  ) >= 0
                              }
                              onChange={(event) => {
                                // const value =
                                //   event.target.value;
                                arrayUpdate[index][
                                  data
                                ] = event
                              }}
                            >
                              {warehouseList &&
                                warehouseList.length > 0 &&
                                warehouseList.map(
                                  (values, index) => {
                                    return (
                                      <Option
                                        value={
                                          values.warehouse_id
                                        }
                                      >
                                        {
                                          values.name
                                        }
                                      </Option>
                                    )
                                  }
                                )}
                            </Select>
                          )
                          return (
                            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà Kho</div>
                              <InputName />

                            </Col>
                          )





                        }

                      })
                    }

                    <Col style={{ width: '100%' }}>
                      <Row style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', margin: '0.75rem 0 0.25rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Checkbox checked={checkboxValue} onChange={onChangeCheckbox}>Thông số sản phẩm (không bắt buộc)</Checkbox></div>
                        {
                          checkboxValue ? (obj.map((data) => {
                            if (data === 'length') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].length = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều dài (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'width') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].width = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều rộng (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'height') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].height = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều cao (cm)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                            if (data === 'weight') {
                              const InputName = () => (
                                <InputNumber
                                  style={{ width: '100%' }}
                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  // defaultValue={values.quantity}
                                  defaultValue={values[data]}
                                  onChange={(event) => {

                                    arrayUpdate[index].weight = parseInt(event)
                                  }}
                                />
                              )
                              return (
                                <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Cân nặng (kg)</div>

                                  <InputName />
                                </Col>
                              )
                            }
                          })) : ''
                        }

                      </Row>
                    </Col>

                    <div style={{ width: '100%' }}>
                      <div style={{ color: 'black', padding: '1rem 1rem 1.5rem 0', fontSize: '1rem', fontWeight: '600' }}>Phiên bản:</div>
                      <Row style={{ display: 'flex', backgroundColor: '#FAFAFA', padding: '0 1rem 1rem 1rem', border: '1px solid rgb(230, 219, 219)', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={3}>Picture</Col> */}
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Variants</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Hình ảnh</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Giá cơ bản</Col>
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Giá bán</Col>

                        {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Seller</Col> */}
                        <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Số lượng</Col>
                      </Row>
                      {
                        values.variants && values.variants.length > 0 && values.variants.map((values1, index1) => {
                          const obj1 = Object.keys(values1)
                          return (
                            <Row style={{ display: 'flex', borderBottom: '1px solid rgb(230, 219, 219)', borderLeft: '1px solid rgb(230, 219, 219)', borderRight: '1px solid rgb(230, 219, 219)', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              {
                                obj1.map((data1) => {
                                  if (data1 === 'title') {
                                    const InputName = () => (
                                      <Input
                                        disabled
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {
                                          const value =
                                            event.target.value
                                          arrayUpdate[index].variants[index1].title = value
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'available_stock_quantity') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        // defaultValue={values1.quantity}
                                        defaultValue={arrayUpdate[index].variants[index1].quantity !== null && arrayUpdate[index].variants[index1].quantity > 0 ? arrayUpdate[index].variants[index1].quantity : (arrayUpdate[index].variants[index1].available_stock_quantity > 0 ? arrayUpdate[index].variants[index1].available_stock_quantity : arrayUpdate[index].variants[index1].low_stock_quantity)}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].quantity = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'base_price') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].base_price = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'sale_price') {
                                    const InputName = () => (
                                      <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        defaultValue={values1[data1]}
                                        onChange={(event) => {

                                          arrayUpdate[index].variants[index1].sale_price = parseInt(event)
                                        }}
                                      />
                                    )
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <InputName />
                                      </Col>
                                    )
                                  }
                                  if (data1 === 'image') {
                                    const InputName = () => <UploadImgChild
                                      imageUrl={values1[data1]}
                                      indexUpdate={values._id}
                                      index20={index1}

                                    />
                                    return (
                                      <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                                        <div>

                                          {/* <Form.Item
        label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
        name="phone"
        rules={[{ required: true, message: "Giá trị rỗng!" }]}
      > */}
                                          {/* <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh sản phẩm</div> */}

                                          <InputName />
                                          {/* </Form.Item> */}
                                        </div>
                                      </Col>
                                    )
                                  }
                                })
                              }
                            </Row>
                          )
                        })
                      }
                    </div>

                  </Row>
                ) : <Row style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Col style={{ width: '100%', color: 'black', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>Sản phẩm Simple</Col>
                  {
                    obj.map((data) => {
                      if (data === 'suppliers') {
                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].supplier_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn nhà cung cấp"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {supplier &&
                              supplier.length > 0 &&
                              supplier.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.supplier_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )
                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà cung cấp</div>
                            <InputName />

                          </Col>
                        )
                      }
                      if (data === 'category') {
                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].category_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn loại sản phẩm"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {category &&
                              category.length > 0 &&
                              category.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.category_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )
                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Loại sản phẩm</div>
                            <InputName />

                          </Col>
                        )
                      }

                      if (data === 'warehouse') {

                        const InputName = () => (
                          <Select
                            defaultValue={
                              values[data].warehouse_id
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn kho"
                            optionFilterProp="children"
                            filterOption={(
                              input,
                              option
                            ) =>
                              option.children
                                .toLowerCase()
                                .indexOf(
                                  input.toLowerCase()
                                ) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][
                                data
                              ] = event
                            }}
                          >
                            {warehouseList &&
                              warehouseList.length > 0 &&
                              warehouseList.map(
                                (values, index) => {
                                  return (
                                    <Option
                                      value={
                                        values.warehouse_id
                                      }
                                    >
                                      {
                                        values.name
                                      }
                                    </Option>
                                  )
                                }
                              )}
                          </Select>
                        )

                        return (
                          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà Kho</div>
                            <InputName />

                          </Col>
                        )





                      }
                      if (data === 'available_stock_quantity') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            // defaultValue={values.quantity}
                            defaultValue={arrayUpdate[index].available_stock_quantity}
                            onChange={(event) => {

                              arrayUpdate[index].quantity = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Số lượng</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'base_price') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            defaultValue={values[data]}
                            onChange={(event) => {

                              arrayUpdate[index][
                                data
                              ] = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá cơ bản</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'sale_price') {
                        const InputName = () => (
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            defaultValue={values[data]}
                            onChange={(event) => {

                              arrayUpdate[index][
                                data
                              ] = parseInt(event)
                            }}
                          />
                        )
                        return (
                          <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá bán</div>
                            <InputName />
                          </Col>
                        )
                      }
                      if (data === 'image') {
                        const InputName = () => <UploadImg
                          imageUrl={values[data]}
                          indexUpdate={values._id}

                        />
                        return (
                          <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', marginBottom: '0.5rem', fontWeight: '600' }}><b style={{ color: 'red' }}>*</b>Ảnh sản phẩm</div>
                              {/* <Form.Item
              label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
              name="phone"
              rules={[{ required: true, message: "Giá trị rỗng!" }]}
            > */}
                              {/* <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh sản phẩm</div> */}

                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                    })
                  }

                  <Col style={{ width: '100%' }}>
                    <Row style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', margin: '1.5rem 0 0.25rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Checkbox checked={checkboxValue} onChange={onChangeCheckbox}>Thông số sản phẩm (không bắt buộc)</Checkbox></div>
                      {
                        checkboxValue ? (obj.map((data) => {
                          if (data === 'length') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].length = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều dài (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'width') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].width = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều rộng (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'height') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].height = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều cao (cm)</div>

                                <InputName />
                              </Col>
                            )
                          }
                          if (data === 'weight') {
                            const InputName = () => (
                              <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                // defaultValue={values.quantity}
                                defaultValue={values[data]}
                                onChange={(event) => {

                                  arrayUpdate[index].weight = parseInt(event)
                                }}
                              />
                            )
                            return (
                              <Col style={{ width: '100%', marginBottom: '0.5rem', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Cân nặng (kg)</div>

                                <InputName />
                              </Col>
                            )
                          }
                        })) : ''
                      }

                    </Row>
                  </Col>


                </Row>
              })
            }
          </Drawer>
        )
      }
      {/* <Drawer
          title="Tạo nhóm sản phẩm"
          width={720}
          onClose={onClose}
          visible={visibleDrawer}
          bodyStyle={{ paddingBottom: 80 }}

      >
        
        </Drawer> */}
      <Modal
        title="Tạo nhóm sản phẩm"
        centered
        width={700}
        footer={null}
        visible={modal5Visible}
        onOk={() => modal5VisibleModal(false)}
        onCancel={() => modal5VisibleModal(false)}
      >

        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600', width: '10rem' }}>Nhóm sản phẩm:</div>
            <div style={{ marginLeft: '1rem', width: '100%' }}><Input style={{ width: '100%' }} onChange={onChangeGroupProduct} placeholder="Nhập tên nhóm sản phẩm" /></div>
          </div>
          {
            arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
              return (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginBottom: '1rem', borderBottom: '1px solid rgb(235, 226, 226)', paddingBottom: '1rem' }}>{values.name}</div>
              )
            })
          }


        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button onClick={onClickGroupProduct} type="primary" style={{ width: '7.5rem' }}>Tạo</Button></div>

      </Modal>
      <ProductInfo record={record} modal2Visible={modal2Visible} modal2VisibleModal={modal2VisibleModal} warranty={warranty} />
      {/* <UpdateProductSingle styles={styles} visible={visible} onClose={onClose} onCloseUpdateFunc={onCloseUpdateFunc} arrayUpdate={arrayUpdate} warranty={warranty} supplier={supplier} UploadImg={UploadImg} category={category} UploadImgChild={UploadImgChild} /> */}

      {/* <UpdateMultiProduct styles={styles} onCloseUpdate={onCloseUpdate} visibleUpdate={visibleUpdate} onCloseUpdateFunc={onCloseUpdateFunc} arrayUpdate={arrayUpdate} UploadImgChild={UploadImgChild} warranty={warranty} supplier={supplier} UploadImg={UploadImg} /> */}

      <Drawer
        title="Nhóm sản phẩm"
        width={1000}
        onClose={onCloseGroup}
        visible={visibleDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>

              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn nhóm sản phẩm"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={onChangeCategoryMainDrawer}

              >
                <Option value="default">Tất cả nhóm sản phẩm</Option>
                {
                  categorySelect && categorySelect.length > 0 && categorySelect.map((values, index) => {
                    return (
                      <Option value={values.name}>{values.name}</Option>
                    )
                  })
                }
              </Select>

            </Col>
            <Col style={{ width: '100%', }} xs={24} sm={24} md={24} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <Button onClick={() => modal6VisibleModal(true)} style={{ width: '10rem' }} type="primary">Tạo nhóm sản phẩm</Button>
              </div>
            </Col>
          </Row>
          {/* <div style={{ display: 'flex', marginTop: '1.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Button style={{ width: '7.5rem' }} type="primary" danger>
              Xóa nhóm
            </Button>
          </div> */}
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Row style={{ width: "100%", marginTop: 20 }}>
              <Button onClick={showDrawerCategoryGroupUpdate} value={1} type="primary" style={{ marginRight: '1rem' }}>
                Cập nhật nhóm sản phẩm
              </Button>
            </Row>
          ) : (
            ''
          )}
          <div style={{ width: '100%', marginTop: '1.25rem', border: '1px solid rgb(243, 234, 234)' }}>
            <Table rowKey="_id" loading={loading}
              rowSelection={rowSelection}
              bordered columns={columnsCategory} dataSource={category} scroll={{ y: 500 }} />
          </div>
        </div>
      </Drawer>

      <Modal
        title="Tạo nhóm sản phẩm"
        centered
        width={1000}
        footer={null}
        visible={modal6Visible}
        onOk={() => modal6VisibleModal(false)}
        onCancel={() => modal6VisibleModal(false)}
      >

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinishCategory}
          layout="vertical"
          onFinishFailed={onFinishFailedCategory}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên nhóm sản phẩm: </div>}
                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="categoryName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên nhóm sản phẩm" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Loại nhóm sản phẩm</div>}
                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="categoryType"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập loại nhóm sản phẩm" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mô tả nhóm sản phẩm</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="categoryDescription"
                // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >

                  <TextArea placeholder="Nhập loại nhóm sản phẩm" rows={4} />
                </Form.Item>
              </div>
            </Col>
          </Row>




          <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }} className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Tạo nhóm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Modal>

      <Drawer
        title="Cập nhật nhóm sản phẩm"
        width={1000}
        onClose={onCloseCategoryGroupUpdate}
        visible={visibleCategoryGroupUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={onCloseUpdateFuncCategory}
              type="primary"
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdateCategory && arrayUpdateCategory.length > 0 && arrayUpdateCategory.map((values, index) => {
            const obj = Object.keys(values)
            return (



              <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {
                  obj.map((data) => {
                    if (data === 'name') {
                      const InputName = () => (
                        <Input
                          style={{ width: '100%' }}
                          // defaultValue={values.quantity}
                          placeholder="Nhập tên nhóm"
                          defaultValue={values[data]}
                          onChange={(event) => {

                            arrayUpdateCategory[index].name = event.target.value
                          }}
                        />
                      )
                      return (
                        <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div>

                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red' }}>*</b>Tên nhóm sản phẩm: </div>
                            <InputName />

                          </div>
                        </Col>
                      )
                    }
                    if (data === 'type') {
                      const InputName = () => (
                        <Input
                          style={{ width: '100%' }}
                          placeholder="Nhập loại nhóm"
                          // defaultValue={values.quantity}
                          defaultValue={values[data]}
                          onChange={(event) => {

                            arrayUpdateCategory[index][data] = event.target.value
                          }}
                        />
                      )
                      return (
                        <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div>

                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red' }}>*</b>Loại nhóm sản phẩm: </div>
                            <InputName />

                          </div>
                        </Col>
                      )
                    }
                    if (data === 'description') {
                      const InputName = () => (
                        <TextArea
                          rows={4}
                          style={{ width: '100%' }}
                          placeholder="Nhập mô tả"
                          // defaultValue={values.quantity}
                          defaultValue={values[data]}
                          onChange={(event) => {

                            arrayUpdateCategory[index].description = event.target.value
                          }}
                        />
                      )
                      return (
                        <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div>

                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Mô tả nhóm sản phẩm: </div>
                            <InputName />

                          </div>
                        </Col>
                      )
                    }
                  })
                }



              </Row>






            )
          })
        }
      </Drawer>

    </UI >
  )
}