import React, { useState, useEffect, useRef } from 'react'
import { ACTION, PERMISSIONS } from './../../consts/index'
import moment from 'moment'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import styles from './../shipping/shipping.module.scss'

import {
  Drawer,
  Upload,
  Form,
  Modal,
  notification,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  DatePicker,
  Popover,
} from 'antd'
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  apiAllShipping,
  apiSearchShipping,
  apiUpdateShipping,
} from '../../apis/shipping'
import { apiDistrict, apiProvince } from '../../apis/information'
import { apiFilterCity } from '../../apis/branch'
import ShippingAdd from 'views/actions/shipping/add'
import Permission from 'components/permission'

export default function Shipping() {
  const { RangePicker } = DatePicker
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [shipping, setShipping] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    shipping &&
      shipping.length > 0 &&
      shipping.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            array.push(values)
          }
        })
      })
    setArrayUpdate([...array])
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }

  const apiSearchShippingDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearchShipping({ from_date: start, to_date: end })
      console.log(res)
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setShipping([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchShippingDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  const { Option } = Select

  const apiSearchShippingData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchShipping({ keyword: value })

      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setShipping([...array])
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
      apiSearchShippingData(value)
    }, 300)
  }

  const contentImage = (record) => {
    return (
      <img
        src={record.image}
        style={{ width: '30rem', height: '25rem', objectFit: 'contain' }}
        alt=""
      />
    )
  }

  const columns = [
    {
      title: 'Mã đối tác',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => (
        <div
          style={{ color: '#40A9FF', cursor: 'pointer' }}
          onClick={() => modal2VisibleModalMain(true, record)}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Tên đối tác',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'province',
      width: 150,
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Zip code',
      dataIndex: 'zipcode',
      width: 150,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
    },

    {
      title: 'Ảnh đối tác',
      dataIndex: 'image',
      width: 150,
      fixed: 'right',
      render: (text, record) => (
        <Popover placement="left" content={() => contentImage(record)}>
          {' '}
          <div>
            {
              <img
                src={text}
                style={{
                  cursor: 'pointer',
                  width: '7.5rem',
                  objectFit: 'contain',
                  height: '7.5rem',
                }}
                alt=""
              />
            }
          </div>
        </Popover>
      ),
    },
  ]

  const [record, setRecord] = useState({})
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }
  const apiAllShippingData = async () => {
    try {
      setLoading(true)
      const res = await apiAllShipping()
      console.log(res)
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setShipping([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllShippingData()
  }, [])
  const openNotification = (data) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Hủy liên kết đối tác vận chuyển <b>{data}</b> thành công.
        </div>
      ),
    })
  }
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Cập nhật thông tin đối tác <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const apiUpdateShippingDataUpdate = async (object, id, data) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateShipping(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllShippingData()
        setSelectedRowKeys([])
        onClose()
        openNotificationUpdate(object.name)
        onCloseUpdate()
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const apiUpdateShippingData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await apiUpdateShipping(object, id)
      console.log(res)
      if (res.status === 200) {
        await apiAllShippingData()
        openNotification(data)
        setSelectedRowKeys([])
      }

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Đối tác vận chuyển đang hoạt động. Không thể thực hiện chức năng này.',
    })
  }

  function onChangeSwitch() {
    arrayUpdate &&
      arrayUpdate.length > 0 &&
      arrayUpdate.forEach((values, index) => {
        const object = {
          active: false,
        }
        apiUpdateShippingData(object, values.transport_id, values.name)
      })
  }

  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const dateFormat = 'YYYY/MM/DD'
  const onClickClear = async () => {
    await apiAllShippingData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setCity('')
    setDistrictSelect('')
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  function confirmActive(e) {
    console.log(e)
    shipping &&
      shipping.length > 0 &&
      shipping.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            if (values.active) {
              openNotificationDeleteSupplierErrorActive()
            } else {
              const object = {
                active: true,
              }
              apiUpdateShippingData(object, values.transport_id, 2)
            }
          }
        })
      })
  }

  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Liên hệ phải là số và có độ dài là 10',
    })
  }
  const openNotificationZipcode = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Zip code phải là số',
    })
  }

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  const [list, setList] = useState('')
  const UploadImg = ({ imageUrl, indexUpdate }) => {
    const [imgUrl, setImgUrl] = useState(imageUrl)
    const [imgFile, setImgFile] = useState(null)
    function getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    }
    const handleChange = (info) => {
      if (info.file.originFileObj) setImgFile(info.file.originFileObj)

      getBase64(info.file.originFileObj, (imageUrl) => {
        setImgUrl(imageUrl)
      })
    }

    useEffect(() => {
      const _uploadImg = async () => {
        try {
          const formData = new FormData()
          formData.append('files', imgFile)

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
            console.log(resultsMockup[0].data.data[0])
            dispatch({ type: ACTION.LOADING, data: false })
            //   const array = [...store];
            arrayUpdate[indexUpdate].image = resultsMockup[0].data.data[0]
          }
        } catch (error) {}
      }

      if (imgFile) {
        _uploadImg()
      }
    }, [imgFile])

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        onChange={handleChange}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="avatar"
            style={{ width: '5rem', height: '5rem', objectFit: 'contain' }}
          />
        ) : (
          <p className="ant-upload-drag-icon">
            <PlusOutlined />

            <div>Thêm ảnh</div>
          </p>
        )}
      </Upload>
    )
  }
  const [districtMain, setDistrictMain] = useState([])
  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict()
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [provinceMain, setProvinceMain] = useState([])
  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince()
      console.log(res)
      if (res.status === 200) {
        setProvinceMain(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiDistrictData()
  }, [])
  useEffect(() => {
    apiProvinceData()
  }, [])
  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object })
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function handleChangeCity(value) {
    console.log(`selected ${value}`)
    apiFilterCityData(value)
  }
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (list !== '') {
            if (values.zipcode) {
              if (isNaN(values.phone) || isNaN(values.zipcode)) {
                if (isNaN(values.phone)) {
                  openNotificationRegisterFailMailPhone()
                }
                if (isNaN(values.zipcode)) {
                  openNotificationZipcode()
                }
              } else {
                if (regex.test(values.phone)) {
                  const object = {
                    name: values.name,
                    image: values.image,
                    phone: values.phone,
                    zipcode: values && values.zipcode ? values.zipcode : '',
                    address: values && values.address ? values.address : '',
                    ward: '',
                    district: values.district,
                    province: values.province,
                  }
                  alert('123')
                  apiUpdateShippingDataUpdate(object, values.transport_id)
                } else {
                  openNotificationRegisterFailMailPhone()
                }
              }
            } else {
              if (isNaN(values.phone)) {
                if (isNaN(values.phone)) {
                  openNotificationRegisterFailMailPhone()
                }
              } else {
                if (regex.test(values.phone)) {
                  const object = {
                    name: values.name,
                    image: values.image,
                    phone: values.phone,
                    zipcode: '',
                    address: values && values.address ? values.address : '',
                    ward: '',
                    district: values.district,
                    province: values.province,
                  }
                  alert('456')
                  apiUpdateShippingDataUpdate(object, values.transport_id)
                } else {
                  openNotificationRegisterFailMailPhone()
                }
              }
            }
          } else {
            if (values.zipcode) {
              if (isNaN(values.phone) || isNaN(values.zipcode)) {
                if (isNaN(values.phone)) {
                  openNotificationRegisterFailMailPhone()
                }
                if (isNaN(values.zipcode)) {
                  openNotificationZipcode()
                }
              } else {
                if (regex.test(values.phone)) {
                  const object = {
                    name: values.name,
                    image: values.image,
                    phone: values.phone,
                    zipcode: values && values.zipcode ? values.zipcode : '',
                    address: values && values.address ? values.address : '',
                    ward: '',
                    district: values.district,
                    province: values.province,
                  }
                  apiUpdateShippingDataUpdate(object, values.transport_id)
                } else {
                  openNotificationRegisterFailMailPhone()
                }
              }
            } else {
              if (isNaN(values.phone)) {
                if (isNaN(values.phone)) {
                  openNotificationRegisterFailMailPhone()
                }
              } else {
                if (regex.test(values.phone)) {
                  const object = {
                    name: values.name,
                    image: values.image,
                    phone: values.phone,
                    zipcode: '',
                    address: values && values.address ? values.address : '',
                    ward: '',
                    district: values.district,
                    province: values.province,
                  }
                  apiUpdateShippingDataUpdate(object, values.transport_id)
                } else {
                  openNotificationRegisterFailMailPhone()
                }
              }
            }
          }
        })
    } else {
      arrayUpdate.forEach((values, index) => {
        const object = {
          name: values.name,
          phone: values.phone,

          image: arrayUpdate[0].image,
          zipcode: '',
          address:
            arrayUpdate[0] && arrayUpdate[0].address
              ? arrayUpdate[0].address
              : '',
          ward: '',
          district: arrayUpdate[0].district,
          province: arrayUpdate[0].province,
        }
        apiUpdateShippingDataUpdate(object, values.transport_id)
      })
    }
  }
  const apiSearchProvinceData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearchShipping({ province: value })

      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setShipping([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const [city, setCity] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`)
    setCity(value)
    if (value !== 'default') {
      apiSearchProvinceData(value)
    } else {
      await apiAllShippingData()
    }
  }
  const apiSearchDistrictData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchShipping({ district: value })

      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setShipping([...array])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const [districtSelect, setDistrictSelect] = useState('')
  const handleChangeDistrict = async (value) => {
    console.log(`selected ${value}`)
    setDistrictSelect(value)
    if (value !== 'default') {
      apiSearchDistrictData(value)
    } else {
      await apiAllShippingData()
    }
  }
  return (
    <>
      <div className={`${styles['shipping_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgb(235, 223, 223)',
            paddingBottom: '1rem',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['shipping_manager_title']}>
            <div>Quản lý đối tác vận chuyển</div>
          </div>
          <Permission permissions={[PERMISSIONS.them_doi_tac_van_chuyen]}>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              size="large"
              onClick={() => setShowCreate(true)}
            >
              Thêm đối tác
            </Button>
          </Permission>
        </div>
        <Row className={styles['shipping_manager_search']}>
          <Col
            style={{ marginTop: '1.25rem', marginRight: '1rem' }}
            className={styles['shipping_manager_search_col']}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                size="large"
                style={{ width: '100%' }}
                name="name"
                value={valueSearch}
                enterButton
                onChange={onSearch}
                className={styles['orders_manager_content_row_col_search']}
                placeholder="Tìm kiếm theo mã, theo tên"
                allowClear
              />
            </div>
          </Col>

          <Col
            style={{ marginTop: '1.25rem', marginRight: '1rem' }}
            className={styles['shipping_manager_search_col']}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={city ? city : 'default'}
                onChange={(event) => {
                  handleChange(event)
                  handleChangeCity(event)
                }}
              >
                <Option value="default">Tất cả tỉnh/thành phố</Option>
                {provinceMain &&
                  provinceMain.length > 0 &&
                  provinceMain.map((values, index) => {
                    return (
                      <Option value={values.province_name}>
                        {values.province_name}
                      </Option>
                    )
                  })}
              </Select>
            </div>
          </Col>
          <Col
            style={{ marginTop: '1.25rem', marginRight: '1rem' }}
            className={styles['shipping_manager_search_col']}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={districtSelect ? districtSelect : 'default'}
                onChange={handleChangeDistrict}
              >
                <Option value="default">Tất cả quận/huyện</Option>
                {districtMainAPI && districtMainAPI.length > 0
                  ? districtMainAPI &&
                    districtMainAPI.length > 0 &&
                    districtMainAPI.map((values, index) => {
                      return (
                        <Option value={values.district_name}>
                          {values.district_name}
                        </Option>
                      )
                    })
                  : districtMain &&
                    districtMain.length > 0 &&
                    districtMain.map((values, index) => {
                      return (
                        <Option value={values.district_name}>
                          {values.district_name}
                        </Option>
                      )
                    })}
              </Select>
            </div>
          </Col>

          <Col
            style={{ marginTop: '1.25rem' }}
            className={styles['shipping_manager_search_col']}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                value={
                  clear === 1
                    ? []
                    : start !== ''
                    ? [moment(start, dateFormat), moment(end, dateFormat)]
                    : []
                }
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                onChange={onChangeDate}
              />
            </div>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            marginBottom: '1rem',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button onClick={onClickClear} type="primary" size="large">
            Xóa tất cả lọc
          </Button>
        </div>

        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Permission permissions={[PERMISSIONS.cap_nhat_doi_tac_van_chuyen]}>
              <Button
                size="large"
                type="primary"
                onClick={showDrawer}
                style={{
                  marginBottom: '1rem',
                  marginRight: '1rem',
                }}
              >
                Cập nhật
              </Button>
            </Permission>
            <Permission permissions={[PERMISSIONS.xoa_doi_tac_van_chuyen]}>
              <Button
                size="large"
                type="primary"
                danger
                onClick={onChangeSwitch}
                style={{ marginBottom: '1rem' }}
              >
                Xóa
              </Button>
            </Permission>
          </div>
        ) : (
          ''
        )}

        <div
          style={{ marginTop: '0.25rem' }}
          className={styles['shipping_manager_table']}
        >
          <Table
            size="small"
            rowKey="_id"
            loading={loading}
            rowSelection={rowSelection}
            bordered
            columns={columns}
            dataSource={shipping}
            scroll={{ y: 500 }}
          />
        </div>
      </div>
      <Modal
        title={`Thông tin chi tiết đối tác ${record.name}`}
        centered
        width={800}
        footer={null}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
          className={styles['supplier_information_content_parent']}
        >
          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Row className={styles['supplier_information_content_main']}>
              <Col
                style={{ padding: '0rem 1rem 1rem 0' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_left']}
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
                    sm={12}
                    md={12}
                    lg={6}
                    xl={6}
                  >
                    <div
                      style={{
                        borderRadius: '0.5rem',
                        border: '2.5px solid #017A6E',
                      }}
                      className={styles['shipping_manager_shipping_col_parent']}
                    >
                      <img
                        className={styles['shipping_manager_shipping_col_img']}
                        src={record.image}
                        alt=""
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Row className={styles['supplier_information_content_main']}>
              <Col
                style={{ marginBottom: '1rem' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_left']}
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
                      <b>Mã đối tác:</b>{' '}
                      {record && record.code ? record.code : ''}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col
                style={{ marginBottom: '1rem' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_right']}
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
                      <b>Quận/huyện:</b>{' '}
                      {record && record.district ? record.district : ''}
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col
                style={{ marginBottom: '1rem' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_left']}
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
                      <b>Địa chỉ:</b>{' '}
                      {record && record.address ? record.address : ''}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col
            style={{ width: '100%', marginBottom: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Row className={styles['supplier_information_content_main']}>
              <Col
                style={{ marginBottom: '1rem' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_right']}
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
                      <b>Liên hệ:</b>{' '}
                      {record && record.phone ? record.phone : ''}
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col
                style={{ marginBottom: '1rem' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_left']}
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
                    {' '}
                    <div>
                      <b>Tên đối tác:</b>{' '}
                      {record && record.name ? record.name : ''}
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className={styles['supplier_information_content_child_right']}
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
                      <b>Tỉnh/thành phố:</b>{' '}
                      {record && record.province ? record.province : ''}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>

      <Drawer
        title="Cập nhật thông tin đối tác vận chuyển"
        width={1000}
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
              size="large"
              onClick={() => onCloseUpdateFunc(1)}
              type="primary"
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        {arrayUpdate &&
          arrayUpdate.length > 0 &&
          arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            return (
              <Form
                style={{
                  borderBottom: '1px solid rgb(238, 224, 224)',
                  paddingBottom: '1.5rem',
                }}
                className={styles['supplier_add_content']}
                // form={form}
                layout="vertical"
                initialValues={values}
              >
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {obj.map((data) => {
                    if (data === 'image') {
                      const InputName = () => (
                        <UploadImg
                          imageUrl={values[data]}
                          indexUpdate={index}
                        />
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Ảnh
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'name') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Tên đối tác
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'address') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Địa chỉ
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'phone') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Liên hệ
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }

                    if (data === 'province') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                            handleChangeCity(event)
                          }}
                        >
                          {provinceMain &&
                            provinceMain.length > 0 &&
                            provinceMain.map((values, index) => {
                              return (
                                <Option value={values.province_name}>
                                  {values.province_name}
                                </Option>
                              )
                            })}
                        </Select>
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Tỉnh/thành phố
                            </div>
                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'district') {
                      const InputName = () => (
                        <Select
                          size="large"
                          defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event
                          }}
                        >
                          {districtMainAPI && districtMainAPI.length > 0
                            ? districtMainAPI &&
                              districtMainAPI.length > 0 &&
                              districtMainAPI.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>
                                    {values.district_name}
                                  </Option>
                                )
                              })
                            : districtMain &&
                              districtMain.length > 0 &&
                              districtMain.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>
                                    {values.district_name}
                                  </Option>
                                )
                              })}
                        </Select>
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Quận/huyện
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                    if (data === 'zipcode') {
                      const InputName = () => (
                        <Input
                          size="large"
                          defaultValue={values[data]}
                          onChange={(event) => {
                            const value = event.target.value
                            arrayUpdate[index][data] = value
                          }}
                        />
                      )
                      return (
                        <Col
                          style={{ width: '100%' }}
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                        >
                          <div>
                            <div
                              style={{
                                color: 'black',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              Zip code
                            </div>

                            <InputName />
                          </div>
                        </Col>
                      )
                    }
                  })}
                </Row>
              </Form>
            )
          })}
      </Drawer>

      <Drawer
        title="Cập nhật thông tin đối tác vận chuyển"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(2)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {arrayUpdate &&
          arrayUpdate.length > 0 &&
          arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            if (index === 0) {
              return (
                <Form
                  style={{
                    borderBottom: '1px solid rgb(238, 224, 224)',
                    paddingBottom: '1.5rem',
                  }}
                  className={styles['supplier_add_content']}
                  layout="vertical"
                  initialValues={values}
                >
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {obj.map((data) => {
                      if (data === 'province') {
                        const InputName = () => (
                          <Select
                            defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              arrayUpdate[index][data] = event
                              handleChangeCity(event)
                            }}
                          >
                            {provinceMain &&
                              provinceMain.length > 0 &&
                              provinceMain.map((values, index) => {
                                return (
                                  <Option value={values.province_name}>
                                    {values.province_name}
                                  </Option>
                                )
                              })}
                          </Select>
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Tỉnh/thành phố
                              </div>
                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'district') {
                        const InputName = () => (
                          <Select
                            defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              arrayUpdate[index][data] = event
                            }}
                          >
                            {districtMainAPI && districtMainAPI.length > 0
                              ? districtMainAPI &&
                                districtMainAPI.length > 0 &&
                                districtMainAPI.map((values, index) => {
                                  return (
                                    <Option value={values.district_name}>
                                      {values.district_name}
                                    </Option>
                                  )
                                })
                              : districtMain &&
                                districtMain.length > 0 &&
                                districtMain.map((values, index) => {
                                  return (
                                    <Option value={values.district_name}>
                                      {values.district_name}
                                    </Option>
                                  )
                                })}
                          </Select>
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Quận/huyện
                              </div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'image') {
                        const InputName = () => (
                          <UploadImg
                            imageUrl={values[data]}
                            indexUpdate={index}
                          />
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Ảnh
                              </div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'name') {
                        const InputName = () => (
                          <Input
                            disabled
                            defaultValue={values[data]}
                            onChange={(event) => {
                              const value = event.target.value
                              arrayUpdate[index][data] = value
                            }}
                          />
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Tên đối tác
                              </div>
                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'address') {
                        const InputName = () => (
                          <Input
                            defaultValue={values[data]}
                            onChange={(event) => {
                              const value = event.target.value
                              arrayUpdate[index][data] = value
                            }}
                          />
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Địa chỉ
                              </div>
                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'phone') {
                        const InputName = () => (
                          <Input
                            disabled
                            defaultValue={values[data]}
                            onChange={(event) => {
                              const value = event.target.value
                              arrayUpdate[index][data] = value
                            }}
                          />
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Liên hệ
                              </div>
                              <InputName />
                            </div>
                          </Col>
                        )
                      }

                      if (data === 'zipcode') {
                        const InputName = () => (
                          <Input
                            defaultValue={values[data]}
                            onChange={(event) => {
                              const value = event.target.value
                              arrayUpdate[index][data] = value
                            }}
                          />
                        )
                        return (
                          <Col
                            style={{ width: '100%' }}
                            xs={24}
                            sm={24}
                            md={11}
                            lg={11}
                            xl={11}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'black',
                                  fontWeight: '600',
                                  marginBottom: '0.5rem',
                                  marginTop: '1rem',
                                }}
                              >
                                Zip code
                              </div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                    })}
                  </Row>
                </Form>
              )
            }
          })}
      </Drawer>
      <Drawer
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        width="75%"
        title="Thêm đối tác"
      >
        <ShippingAdd close={() => setShowCreate(false)} />
      </Drawer>
    </>
  )
}
