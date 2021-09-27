import styles from './../store/store.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES, PERMISSIONS } from 'consts'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import noimage from 'assets/img/noimage.jpg'
import { Link } from 'react-router-dom'

//antd
import {
  Switch,
  Input,
  Row,
  DatePicker,
  Col,
  notification,
  Select,
  Table,
  Popover,
  Button,
} from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//components
import StoreInformationView from 'components/store/store-information-view'
import StoreInformationAdd from 'components/store/store-information-add'
import Permission from 'components/permission'

//apis
import { apiDistrict, apiProvince } from 'apis/information'
import { apiFilterCity } from 'apis/branch'
import { apiSearch, getAllStore, updateStore } from 'apis/store'
import { compare } from 'utils'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Store() {
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)

  const [arrayUpdate, setArrayUpdate] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [store, setStore] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [countStore, setCountStore] = useState(0)
  const [paramsFilter, setParamsFilter] = useState({
    page: 1,
    page_size: 20,
  })

  const [valueDateFilter, setValueDateFilter] = useState(null)
  function onChangeDate(dates, dateStrings) {
    if (dates) {
      setValueDateFilter(dates)
      paramsFilter.from_date = dateStrings[0]
      paramsFilter.to_date = dateStrings[1]
    } else {
      setValueDateFilter(null)
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      if (value) paramsFilter.search = value
      else delete paramsFilter.search

      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }

  const openNotificationSuccessStoreDelete = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        data === 2
          ? 'Vô hiệu hóa cửa hàng thành công.'
          : 'Kích hoạt cửa hàng thành công',
    })
  }

  const updateStoreData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await updateStore(object, id)
      console.log(res)
      if (res.status === 200) {
        await _getStores()
        setSelectedRowKeys([])
        openNotificationSuccessStoreDelete(data)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`)
    updateStoreData(
      { ...record, active: checked },
      record.store_id,
      checked ? 1 : 2
    )
  }

  const _getStores = async (params) => {
    try {
      setLoading(true)
      const res = await getAllStore(params)
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)
        setCountStore(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const contentImage = (data) => (
    <div>
      <img
        src={data}
        style={{ width: '25rem', height: '15rem', objectFit: 'contain' }}
        alt=""
      />
    </div>
  )
  const columns = [
    {
      title: 'Mã cửa hàng',
      dataIndex: 'code',
      render: (text, record) => <StoreInformationView recordData={record} />,
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Ảnh',
      dataIndex: 'logo',
      render: (text, record) =>
        text ? (
          <Popover content={() => contentImage(text)}>
            <div>
              <img
                src={text}
                style={{
                  width: '7.5rem',
                  cursor: 'pointer',
                  height: '5rem',
                  objectFit: 'contain',
                }}
                alt=""
              />
            </div>
          </Popover>
        ) : (
          <img
            src={noimage}
            style={{ width: '6.75rem', height: '5rem', objectFit: 'cover' }}
            alt=""
          />
        ),
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'name',
      render: (text, record) => <div>{text}</div>,
      sorter: (a, b) => compare(a, b, 'name'),
    },

    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      sorter: (a, b) => compare(a, b, 'district'),
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      sorter: (a, b) => compare(a, b, 'province'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) => (text ? moment(text).format('YYYY-MM-DD') : ''),
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) =>
        text ? (
          <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        ),
    },
  ]

  const onClose = () => {
    setVisible(false)
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }

  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    store &&
      store.length > 0 &&
      store.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            array.push(values)
          }
        })
      })
    setArrayUpdate([...array])
  }
  const openNotificationErrorStoreRegexPhone = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: `${data} phải là số và có độ dài là 10`,
    })
  }
  const openNotificationErrorStoreRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: `${data} phải là số`,
    })
  }
  const openNotificationSuccessStoreUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Cập nhật thông tin cửa hàng <b>{data}</b> thành công
        </div>
      ),
    })
  }
  const openNotificationErrorStore = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Lỗi cập nhật thông tin cửa hàng.',
    })
  }
  const updateStoreDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      // console.log(value);
      const res = await updateStore(object, id)
      console.log(res)
      if (res.status === 200) {
        await _getStores()
        setSelectedRowKeys([])
        openNotificationSuccessStoreUpdate(object.name)
        onClose()
        onCloseUpdate()
      } else {
        openNotificationErrorStore()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (isNaN(values.phone) || isNaN(values.fax)) {
            if (isNaN(values.phone)) {
              openNotificationErrorStoreRegexPhone('Liên hệ')
            }
            if (isNaN(values.fax)) {
              openNotificationErrorStoreRegex('Số fax')
            }
          } else {
            if (regex.test(values.phone)) {
              updateStoreDataUpdate(
                {
                  ...values,
                  name: values.name.toLowerCase(),
                  logo: values.logo,
                  phone: values.phone,
                  email: values.email,
                  fax: values.fax,
                  website: values && values.website ? values.website : '',
                  latitude: ' ',
                  longtitude: ' ',
                  address:
                    values && values.address
                      ? values.address.toLowerCase()
                      : '',
                  ward: '',
                  district: values.district,
                  province: values.province,
                },
                values.store_id
              )
            } else {
              openNotificationErrorStoreRegexPhone('Liên hệ')
            }
          }
        })
    } else {
      arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone) || isNaN(values.fax)) {
          if (isNaN(values.phone)) {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
          if (isNaN(values.fax)) {
            openNotificationErrorStoreRegex('Số fax')
          }
        } else {
          if (regex.test(values.phone)) {
            updateStoreDataUpdate(
              {
                ...values,
                name: values.name.toLowerCase(),
                phone: values.phone,
                email: values.email,
                fax: arrayUpdate[0].fax,
                website:
                  arrayUpdate[0] && arrayUpdate[0].website
                    ? arrayUpdate[0].website
                    : '',
                latitude: ' ',
                longtitude: ' ',
                address:
                  arrayUpdate[0] && arrayUpdate[0].address
                    ? arrayUpdate[0].address.toLowerCase()
                    : '',
                ward: '',
                district: arrayUpdate[0].district,
                province: arrayUpdate[0].province,
                logo: arrayUpdate[0].logo,
              },
              values.store_id
            )
          } else {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
        }
      })
    }
  }

  const onClickClear = async () => {
    Object.keys(paramsFilter).map((e) => delete paramsFilter[e])
    paramsFilter.page = 1
    paramsFilter.page_size = 20
    setParamsFilter({ ...paramsFilter })
    setValueSearch('')
    setValueDateFilter(null)
    setSelectedRowKeys([])
  }

  const [districtMain, setDistrictMain] = useState([])
  const apiDistrictData = async (params) => {
    try {
      setLoading(true)
      const res = await apiDistrict(params)
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
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiProvinceData()
  }, [])
  useEffect(() => {
    apiDistrictData({ search: paramsFilter.province })
  }, [paramsFilter.province])

  useEffect(() => _getStores({ ...paramsFilter }), [paramsFilter])

  return (
    <div className={`${styles['promotion_manager']} ${styles['card']}`}>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgb(236, 226, 226)',
          paddingBottom: '0.75rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Link
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
          to={ROUTES.CONFIGURATION_STORE}
        >
          <ArrowLeftOutlined
            style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }}
          />
          <div
            style={{
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
              marginLeft: '0.5rem',
            }}
          >
            Quản lý cửa hàng
          </div>
        </Link>
        <div className={styles['promotion_manager_button']}>
          <Permission permissions={[PERMISSIONS.them_cua_hang]}>
            <StoreInformationAdd reloadData={_getStores} />
          </Permission>
        </div>
      </div>

      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Col
          style={{ width: '100%', marginTop: '1rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
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
          style={{ width: '100%', marginTop: '1rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={7}
        >
          <div style={{ width: '100%' }}>
            <Select
              size="large"
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn tỉnh/thành phố"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => {
                if (value) paramsFilter.province = value
                else delete paramsFilter.province
                paramsFilter.page = 1
                setParamsFilter({ ...paramsFilter })
              }}
              value={paramsFilter.province}
            >
              {provinceMain.map((values, index) => (
                <Option value={values.province_name} key={index}>
                  {values.province_name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col
          style={{ width: '100%', marginTop: '1rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={7}
        >
          <div style={{ width: '100%' }}>
            <Select
              size="large"
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn quận/huyện"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.district}
              onChange={(value) => {
                if (value) paramsFilter.district = value
                else delete paramsFilter.district

                paramsFilter.page = 1
                setParamsFilter({ ...paramsFilter })
              }}
            >
              {districtMain.map((values, index) => (
                <Option value={values.district_name} key={index}>
                  {values.district_name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col
          style={{ width: '100%', marginTop: '1rem' }}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={7}
        >
          <div style={{ width: '100%' }}>
            <RangePicker
              size="large"
              className="br-15__date-picker"
              value={valueDateFilter}
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
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          marginTop: '1rem',
        }}
      >
        <Button onClick={onClickClear} type="primary" size="large">
          Xóa tất cả lọc
        </Button>
      </div>
      <div
        style={{
          width: '100%',
          marginTop: '1rem',
          border: '1px solid rgb(243, 234, 234)',
        }}
      >
        <Table
          size="small"
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={store}
          style={{ width: '100%' }}
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            defaultPageSize: 20,
            pageSizeOptions: [20, 30, 50, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setSelectedRowKeys([])
              paramsFilter.page = page
              paramsFilter.page_size = pageSize
              _getStores({ ...paramsFilter })
            },
            total: countStore,
          }}
        />
      </div>
    </div>
  )
}
