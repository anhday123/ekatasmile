import styles from './../customer/customer.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, PERMISSIONS } from 'consts/index'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

//icons
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'

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
  Upload,
  Typography,
} from 'antd'

//components
import BranchAdd from 'components/branch/branch-add'
import BranchView from 'views/actions/branch/view'
import Permission from 'components/permission'

//apis
import { apiDistrict, apiProvince } from 'apis/information'
import { getAllStore } from 'apis/store'
import { apiUpdateBranch, getAllBranch } from 'apis/branch'
import { uploadFile } from 'apis/upload'
import { compare } from 'utils'

const { Option } = Select
const { RangePicker } = DatePicker
const { Text } = Typography
export default function Branch() {
  const typingTimeoutRef = useRef(null)

  const dispatch = useDispatch()
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
  const [districtsDefault, setDistrictsDefault] = useState([])

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

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
      if (value) paramsFilter.search = value
      else delete paramsFilter.search

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
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
      sorter: (a, b) =>
        moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      sorter: (a, b) => compare(a, b, 'phone'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => compare(a, b, 'address'),
    },
    {
      title: 'Loại kho',
      dataIndex: 'warehouse_type',
    },
    {
      title: 'Dùng điểm',
      dataIndex: 'use_point',
      render: (text) => (text ? 'Có' : 'Không'),
    },
    {
      title: 'Tích điểm',
      dataIndex: 'accumulate_point',
      render: (text) => (text ? 'Có' : 'Không'),
    },
    {
      title: 'Hành động',
      dataIndex: 'active',
      fixed: 'right',
      render: (text, record) => (
        <Space size="large">
          {/* <Switch
            defaultChecked={text}
            onChange={(e) => onChangeSwitch(e, record)}
          /> */}
          <Permission permissions={[PERMISSIONS.cap_nhat_chi_nhanh]}>
            <ModalUpdateBranch record={record} />
          </Permission>
        </Space>
      ),
    },
  ]

  const ModalUpdateBranch = ({ record }) => {
    const [visibleUpdateBranch, setVisibleUpdateBranch] = useState(false)
    const [imageBranch, setImageBranch] = useState('')
    const [fileImageBranch, setFileImageBranch] = useState(null)

    const toggleUpdateBranch = () =>
      setVisibleUpdateBranch(!visibleUpdateBranch)

    useEffect(() => {
      if (!visibleUpdateBranch) {
        formUpdateBranch.resetFields()
        setImageBranch('')
        setFileImageBranch(null)
      } else {
        setImageBranch(record.logo)
        formUpdateBranch.setFieldsValue({
          name: record.name,
          address: record.address,
          phone: record.phone,
          province: record.province,
          store: record.store_id,
          district: record.district,
          warehouse_type: record.warehouse_type,
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
            const formData = formUpdateBranch.getFieldValue()

            let urlImageBranch
            if (fileImageBranch) {
              dispatch({ type: ACTION.LOADING, data: true })
              urlImageBranch = await uploadFile(fileImageBranch)
              dispatch({ type: ACTION.LOADING, data: false })
            }

            let body = {
              name: formData.name,
              address: formData.address,
              phone: formData.phone,
              province: formData.province,
              district: formData.district,
              warehouse_type: formData.warehouse_type,
            }

            if (urlImageBranch) body.logo = urlImageBranch || ''

            apiUpdateInfoBranch(body, record.branch_id)
          }}
        >
          Hình ảnh
          <Upload
            showUploadList={false}
            name="avatar"
            listType="picture-card"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            onChange={(info) => {
              if (info.file.status === 'done') info.file.status = 'done'
              setFileImageBranch(info.file.originFileObj)
              getBase64(info.file.originFileObj, (imageUrl) =>
                setImageBranch(imageUrl)
              )
            }}
          >
            {imageBranch ? (
              <img src={imageBranch} alt="" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
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
                    {provinces.map((values, index) => {
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
              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={11}
                lg={11}
                xl={11}
              >
                <Form.Item
                  name="warehouse_type"
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Loại kho
                    </div>
                  }
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    size="large"
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn quận huyện"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="sở hữu">Kho sở hữu</Option>
                    <Option value="dịch vụ">Kho thuê dịch vụ</Option>
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
                    {districts.map((values, index) => {
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
      console.log(params)
      const res = await getAllBranch(params)
      console.log(res)
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

  const onClickClear = async () => {
    await getAllBranchData({ page: 1, page_size })
    setParamsFilter({})
    setValueSearch('')
    setPage(1)
    setValueDate(null)
    setSelectedRowKeys([])
  }
  const [districts, setDistricts] = useState([])
  const apiDistrictData = async () => {
    try {
      const res = await apiDistrict()
      if (res.status === 200) {
        setDistricts(res.data.data)
        setDistrictsDefault(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [provinces, setProvinces] = useState([])
  const apiProvinceData = async () => {
    try {
      const res = await apiProvince()
      if (res.status === 200) {
        setProvinces(res.data.data)
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
          <Permission permissions={[PERMISSIONS.them_chi_nhanh]}>
            <BranchAdd reload={getAllBranchData} />
          </Permission>
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
                prefix={<SearchOutlined />}
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
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo kho"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.warehouse_type}
              onChange={(value) => {
                setPage(1)
                if (value) paramsFilter.warehouse_type = value
                else delete paramsFilter.warehouse_type

                getAllBranchData({ page: 1, page_size, ...paramsFilter })
                setParamsFilter({ ...paramsFilter })
              }}
            >
              <Option value="so huu">Kho sở hữu</Option>
              <Option value="dich vu">Kho thuê dịch vụ</Option>
            </Select>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo tỉnh/thành phố"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.province}
              onChange={(value) => {
                setPage(1)
                if (value) {
                  paramsFilter.province = value
                  const districtsByProvince = districtsDefault.filter(
                    (e) => e.province_name === value
                  )
                  setDistricts([...districtsByProvince])
                } else {
                  delete paramsFilter.province
                  setDistricts([...districtsDefault])
                }

                getAllBranchData({ page: 1, page_size, ...paramsFilter })
                setParamsFilter({ ...paramsFilter })
              }}
            >
              {provinces.map((values, index) => {
                return (
                  <Option value={values.province_name}>
                    {values.province_name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Tìm kiếm theo quận/huyện"
              optionFilterProp="children"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.district}
              onChange={(value) => {
                setPage(1)
                if (value) paramsFilter.district = value
                else delete paramsFilter.district

                getAllBranchData({ page: 1, page_size, ...paramsFilter })
                setParamsFilter({ ...paramsFilter })
              }}
            >
              {districts.map((values, index) => {
                return (
                  <Option value={values.district_name} key={index}>
                    {values.district_name}
                  </Option>
                )
              })}
            </Select>
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
            size="small"
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
