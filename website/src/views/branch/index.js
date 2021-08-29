import styles from './../customer/customer.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES } from 'consts/index'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

//icons
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

//antd
import {
  Switch,
  Drawer,
  Input,
  Row,
  Col,
  DatePicker,
  notification,
  Select,
  Table,
  Form,
  Button,
  Space,
  Modal,
} from 'antd'

//components
import BranchAdd from 'components/branch/branch-add'
import BranchView from 'views/actions/branch/view'

//apis
import { apiDistrict, apiProvince } from 'apis/information'
import { getAllStore } from 'apis/store'
import {
  apiFilterCity,
  apiSearch,
  apiUpdateBranch,
  getAllBranch,
} from 'apis/branch'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Branch() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [viewBranch, setViewBranch] = useState(false)
  const [stores, setStores] = useState([])
  const [branchs, setBranchs] = useState([])
  const [countBranch, setCountBranch] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState(1)
  const [page_size, setPage_size] = useState(20)
  const [paramsFilter, setParamsFilter] = useState({})
  const [formUpdateBranch] = Form.useForm()

  const typingTimeoutRef = useRef(null)

  const [valueDate, setValueDate] = useState(null)
  function onChangeDate(date, dateStrings) {
    setPage(1)
    if (date) {
      setValueDate(date)
      paramsFilter.from_date = dateStrings[0]
      paramsFilter.to_date = dateStrings[1]
    } else {
      setValueDate(null)
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    setParamsFilter({ ...paramsFilter })
    getAllBranchData({ page: 1, page_size, ...paramsFilter })
  }
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      setPage(1)
      if (value) paramsFilter.keyword = value
      else delete paramsFilter.keyword

      getAllBranchData({ page: 1, page_size, ...paramsFilter })
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }
  const columnsBranch = [
    {
      title: 'Mã chi nhánh',
      dataIndex: 'code',
      render: (text, record) => (
        <div
          onClick={() => {
            setData(record)
            setViewBranch(true)
          }}
          style={{ color: '#007ACC', cursor: 'pointer' }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      render: (text, record) =>
        record && record.store && record.store.name ? record.store.name : '',
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },

    {
      title: 'Quận/huyện',
      dataIndex: 'district',
    },
    {
      title: 'Thành phố',
      dataIndex: 'ward',
    },

    {
      title: 'Hành động',
      dataIndex: 'active',
      fixed: 'right',
      render: (text, record) => (
        <Space size="large">
          <Switch
            defaultChecked={text}
            onChange={(e) => onChangeSwitch(e, record)}
          />
          <ModalUpdateBranch record={record} />
        </Space>
      ),
    },
  ]

  const ModalUpdateBranch = ({ record }) => {
    const [visibleUpdateBranch, setVisibleUpdateBranch] = useState(false)
    const toggleUpdateBranch = () =>
      setVisibleUpdateBranch(!visibleUpdateBranch)
    useEffect(() => {
      if (!visibleUpdateBranch) formUpdateBranch.resetFields()
      else {
        formUpdateBranch.setFieldsValue({
          name: record.name,
          address: record.address,
          phone: record.phone,
          province: record.province,
          store: record.store.store_id,
          district: record.district,
        })
      }
    }, [visibleUpdateBranch])

    return (
      <>
        <EditOutlined
          style={{ color: '#1890FF', fontSize: 18, cursor: 'pointer' }}
          onClick={toggleUpdateBranch}
        />
        <Modal
          width={750}
          title="Cập nhật chi nhánh"
          visible={visibleUpdateBranch}
          onCancel={toggleUpdateBranch}
          onOk={async () => {
            const body = formUpdateBranch.getFieldValue()
            apiUpdateInfoBranch(
              {
                name: body.name,
                address: body.address,
                phone: body.phone,
                province: body.province,
                store: body.store,
                district: body.district,
              },
              record.branch_id
            )
          }}
        >
          <Form form={formUpdateBranch} layout="vertical">
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item
                  name="name"
                  label="Tên chi nhánh"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên chi nhánh' },
                  ]}
                >
                  <Input size="large" placeholder="Nhập tên chi nhánh" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item name="address" label="Địa chỉ">
                  <Input size="large" placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item
                  name="phone"
                  label="Liên hệ"
                  rules={[{ required: true, message: 'Vui lòng nhập liên hệ' }]}
                >
                  <Input size="large" placeholder="Nhập liên hệ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item
                  name="province"
                  label="Tỉnh/thành phố"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tỉnh/thành phố' },
                  ]}
                >
                  <Select
                    allowClear
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn tỉnh/thành phố"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {province.map((values, index) => {
                      return (
                        <Option value={values.province_name} key={index}>
                          {values.province_name}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item
                  name="store"
                  label="Cửa hàng"
                  rules={[
                    { required: true, message: 'Vui lòng nhập cửa hàng' },
                  ]}
                >
                  <Select
                    allowClear
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Chọn cửa hàng"
                  >
                    {stores.map((values, index) => {
                      return (
                        <Option value={values.store_id} key={index}>
                          {values.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <Form.Item
                  name="district"
                  label="Quận/huyện"
                  rules={[
                    { required: true, message: 'Vui lòng nhập quận/huyện' },
                  ]}
                >
                  <Select
                    allowClear
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Chọn quận/huyện"
                  >
                    {district.map((values, index) => {
                      return (
                        <Option value={values.district_name} key={index}>
                          {values.district_name}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    )
  }

  const [arrayUpdate, setArrayUpdate] = useState([])
  const openNotification = (check) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        check === 2
          ? 'Vô hiệu hóa chi nhánh thành công.'
          : 'Kích hoạt chi nhánh thành công',
    })
  }
  const openNotificationUpdateMulti = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: (
        <div>
          Cập nhật thông tin chi nhánh <b>{data}</b> thành công
        </div>
      ),
    })
  }

  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Lỗi cập nhật thông tin chi nhánh.',
    })
  }

  const apiUpdateInfoBranch = async (object, id) => {
    try {
      setLoading(true)
      const res = await apiUpdateBranch(object, id)
      console.log('body', object)
      console.log('result', res)
      if (res.status === 200) {
        await getAllBranchData({ page: 1, page_size, ...paramsFilter })
        setSelectedRowKeys([])
        notification.success({
          message: 'Cập nhật thông tin chi nhánh thành công!',
        })
      } else {
        openNotificationError()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getAllBranchData = async (params) => {
    try {
      setLoading(true)
      const res = await getAllBranch(params)
      if (res.status === 200) {
        setBranchs(res.data.data)
        setCountBranch(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore()
      console.log('store', res)
      if (res.status === 200) {
        setStores(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onClose = () => {
    setVisible(false)
  }

  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description: `${data} chưa đúng định dạng`,
    })
  }
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }
  const apiUpdateBranchDataUpdateMulti = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateBranch(object, id)
      console.log(res)
      if (res.status === 200) {
        await getAllBranchData()
        openNotificationUpdateMulti(object.name)
        setSelectedRowKeys([])
        onClose()
        onCloseUpdate()
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const [storeSelect, setStoreSelect] = useState()
  const handleChange = async (value) => {
    setStoreSelect(value)
    setPage(1)
    if (value) paramsFilter.store = value
    else delete paramsFilter.store

    getAllBranchData({ page: 1, page_size, ...paramsFilter })
    setParamsFilter({ ...paramsFilter })
  }
  const onClickClear = async () => {
    await getAllBranchData({ page: 1, page_size })
    setValueSearch('')
    setPage(1)
    setValueDate(null)
    setStoreSelect()
    setSelectedRowKeys([])
  }
  const [district, setDistrict] = useState([])
  const apiDistrictData = async (params) => {
    try {
      const res = await apiDistrict(params)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      if (res.status === 200) {
        setProvince(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    apiProvinceData()
    getAllStoreData()
    getAllBranchData({ page, page_size })
    apiDistrictData()
  }, [])

  function onChangeSwitch(checked, record) {
    apiUpdateInfoBranch(
      { active: checked, store: record.store.store_id },
      record.branch_id
    )
  }

  return (
    <>
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
            className={styles['supplier_add_back_parent']}
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
              className={styles['supplier_add_back']}
            >
              Quản lý chi nhánh
            </div>
          </Link>
          <BranchAdd reload={getAllBranchData} />
        </div>
        <Row
          justify="space-between"
          align="middle"
          style={{
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
            style={{
              width: '100%',
              marginTop: '1rem',
            }}
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
                value={valueDate}
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
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo cửa hàng"
                optionFilterProp="children"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={storeSelect}
                onChange={handleChange}
              >
                {stores.map((values, index) => {
                  return <Option value={values.store_id}>{values.name}</Option>
                })}
              </Select>
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
            rowKey="_id"
            loading={loading}
            columns={columnsBranch}
            dataSource={branchs}
            pagination={{
              position: ['bottomLeft'],
              current: page,
              defaultPageSize: 20,
              pageSizeOptions: [20, 30, 50, 100],
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                setSelectedRowKeys([])
                setPage(page)
                setPage_size(pageSize)
                getAllBranchData({ page, page_size: pageSize, ...paramsFilter })
              },
              total: countBranch,
            }}
            size="small"
          />
        </div>
      </div>

      <Drawer
        visible={viewBranch}
        onClose={() => setViewBranch(false)}
        title="Chi tiết chi nhánh"
        width="75%"
        bodyStyle={{ padding: 0 }}
      >
        <BranchView data={data} />
      </Drawer>
    </>
  )
}
