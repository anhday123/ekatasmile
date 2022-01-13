import React, { useEffect, useState, useRef } from 'react'
import { POSITION_TABLE, ROUTES, ACTION, PAGE_SIZE_OPTIONS, IMAGE_DEFAULT } from 'consts'
import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { compare, compareCustom } from 'utils'

//components
import TitlePage from 'components/title-page'

//antd
import {
  Row,
  Button,
  Space,
  Input,
  Select,
  Table,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Upload,
  notification,
  DatePicker,
} from 'antd'

//icons
import { DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'

//apis
import { getCategories, addCategory, deleteCategory } from 'apis/category'
import { uploadFile } from 'apis/upload'
import { getEmployees } from 'apis/employee'

const { RangePicker } = DatePicker
const { Option } = Select
export default function Category() {
  const history = useHistory()
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)
  const [formCategoryChild] = Form.useForm()

  const [categories, setCategories] = useState([])
  const [countCategories, setCountCategories] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [valueSearch, setValueSearch] = useState('')
  const [valueFilterTime, setValueFilterTime] = useState()
  const [openSelect, setOpenSelect] = useState(false)
  const [valueDateSearch, setValueDateSearch] = useState(null)
  const [userList, setUserList] = useState([])
  const [valueUserFilter, setValueUserFilter] = useState(null)

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const _getUserList = async () => {
    try {
      const res = await getEmployees({ page: 1, page_size: 1000 })
      if (res.status === 200) {
        if (res.data.success) {
          setUserList(res.data.data)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const toggleOpenSelect = () => {
    setOpenSelect(!openSelect)
  }

  const _onSearch = (e) => {
    setValueSearch(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter.name = value
      else delete paramsFilter.name

      paramsFilter.page = 1
      setParamsFilter({ ...paramsFilter })
    }, 750)
  }
  const onChangeUserFilter = (value) => {
    setValueUserFilter(value)
    if (value) paramsFilter.creator_id = value
    else delete paramsFilter.creator_id
    setParamsFilter({ ...paramsFilter })
  }

  const _deleteCategory = async (category_id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await deleteCategory(category_id)
      dispatch({ type: ACTION.LOADING, data: false })
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Xóa nhóm sản phẩm thành công!' })
          _getCategories()
        } else
          notification.error({
            message: res.data.message || 'Xóa nhóm sản phẩm thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xóa nhóm sản phẩm thất bại, vui lòng thử lại!',
        })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const _addCategory = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await addCategory(body)
      dispatch({ type: ACTION.LOADING, data: false })
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Tạo nhóm sản phẩm thành công!' })
          _getCategories()
        } else
          notification.error({
            message: res.data.mess || res.data.message || 'Tạo nhóm sản phẩm thất bại!',
          })
      } else
        notification.error({
          message: res.data.mess || res.data.message || 'Tạo nhóm sản phẩm thất bại!',
        })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const ModalCreateCategoryChild = ({ record }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => {
      setVisible(!visible)
    }
    const [imageView, setImageView] = useState('')
    const [fileUpload, setFileUpload] = useState(null)
    const [loading, setLoading] = useState(false)

    const reset = () => {
      formCategoryChild.resetFields()
      setFileUpload(null)
      setImageView('')
      toggle()
    }

    return (
      <>
        {record.parent_id !== -1 ? (
          <Button
            type="primary"
            style={{ backgroundColor: 'rgb(253 170 62)', border: 'none' }}
            onClick={toggle}
          >
            Tạo nhóm sản phẩm con
          </Button>
        ) : (
          <Button type="primary" onClick={toggle}>
            Tạo nhóm sản phẩm con
          </Button>
        )}
        <Modal
          footer={
            <Row justify="end">
              <Button
                loading={loading}
                type="primary"
                onClick={async () => {
                  setLoading(true)
                  await formCategoryChild.validateFields()
                  const dataForm = formCategoryChild.getFieldsValue()
                  const image = await uploadFile(fileUpload)
                  setLoading(false)

                  const body = {
                    ...dataForm,
                    parent_id: record.category_id,
                    image: image || '',
                    default: dataForm.default || '',
                    description: dataForm.description || '',
                  }
                  reset()
                  _addCategory(body)
                }}
              >
                Tạo
              </Button>
            </Row>
          }
          width={500}
          title="Tạo nhóm sản phẩm con"
          onCancel={reset}
          visible={visible}
        >
          <div style={{ marginBottom: 15 }}>
            Hình ảnh
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                if (info.file.status !== 'done') info.file.status = 'done'
                getBase64(info.file.originFileObj, (imageUrl) => setImageView(imageUrl))
                setFileUpload(info.file.originFileObj)
              }}
            >
              {imageView ? (
                imageView !== '' ?
                  <img src={imageView} alt="avatar" style={{ width: '100%' }} /> :
                  <img src={IMAGE_DEFAULT} alt="" style={{ width: 70, height: 70 }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>
          <Form layout="vertical" form={formCategoryChild}>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm sản phẩm' }]}
              name="name"
              label="Tên nhóm sản phẩm"
            >
              <Input placeholder="Nhập tên nhóm sản phẩm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}
              name="priority"
              label="Độ ưu tiên"
            >
              <InputNumber placeholder="Nhập độ ưu tiên" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }

  const _onClearFilters = () => {
    Object.keys(paramsFilter).map((key) => delete paramsFilter[key])

    setValueSearch('')
    setValueFilterTime()
    setValueUserFilter(null)
    paramsFilter.page = 1
    paramsFilter.page_size = 20

    setParamsFilter({ ...paramsFilter })
  }

  const _getCategories = async () => {
    try {
      setLoading(true)
      const res = await getCategories({ ...paramsFilter, _creator: true })
      if (res.status === 200) {
        setCategories(res.data.data)
        setCountCategories(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const columnsParent = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 50,
      render: (text, record, index) =>
        (paramsFilter.page - 1) * paramsFilter.page_size + index + 1
    },
    {
      title: 'Hình ảnh',
      align: 'center',
      render: (text, record) =>
        record.image ?
          <img src={record.image} alt="" style={{ width: 70, height: 70 }} /> :
          <img src={IMAGE_DEFAULT} alt="" style={{ width: 70, height: 70 }} />,
    },
    {
      title: 'Tên nhóm sản phẩm',
      align: 'center',
      sorter: (a, b) => compare(a, b, 'name'),

      render: (text, record) => (
        <Link to={{ pathname: ROUTES.CATEGORY, state: record }}>{record.name || ''}</Link>
      ),
    },
    {
      title: 'Mã nhóm sản phẩm',
      align: 'center',
      dataIndex: 'code',
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Người tạo',
      align: 'center',
      sorter: (a, b) =>
        compareCustom(
          a._creator ? `${a._creator.first_name} ${a._creator.last_name}` : '',
          b._creator ? `${b._creator.first_name} ${b._creator.last_name}` : ''
        ),
      render: (text, record) =>
        record._creator && `${record._creator.first_name} ${record._creator.last_name}`,
    },
    {
      title: 'Ngày tạo',
      align: 'center',
      sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
      render: (text, record) =>
        record.create_date && moment(record.create_date).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Độ ưu tiên',
      align: 'center',
      dataIndex: 'priority',
      sorter: (a, b) => compare(a, b, 'priority'),
    },
    {
      title: 'Hành động',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Space>
          <ModalCreateCategoryChild record={record} />
          <Popconfirm
            onConfirm={() => _deleteCategory(record.category_id)}
            title="Bạn có muốn xóa nhóm sản phẩm này không?"
            okText="Đồng ý"
            cancelText="Từ chối"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const columnsChildren = [
    {
      title: 'Hình ảnh',
      align: 'center',
      render: (text, record) =>
        record.image && <img src={record.image} alt="" style={{ width: 45, height: 45 }} />,
    },
    {
      title: 'Tên nhóm sản phẩm',
      align: 'center',
      render: (text, record) => record.name || '',
    },
    { title: 'Mã nhóm sản phẩm', align: 'center', dataIndex: 'code' },
    {
      title: 'Người tạo',
      align: 'center',
      render: (text, record) =>
        record._creator && `${record._creator.first_name} ${record._creator.last_name}`,
    },
    {
      title: 'Ngày tạo',
      align: 'center',
      render: (text, record) =>
        record.create_date && moment(record.create_date).format('DD/MM/YYYY HH:mm:ss'),
    },
    { title: 'Độ ưu tiên', align: 'center', dataIndex: 'priority' },
    {
      align: 'center',
      render: (text, record) => (
        <Space>
          <ModalCreateCategoryChild color={'orange'} record={record} />
          <Popconfirm
            onConfirm={() => _deleteCategory(record.category_id)}
            title="Bạn có muốn xóa nhóm sản phẩm con này?"
            okText="Đồng ý"
            cancelText="Từ chối"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const columnsChildrenSmall = [
    {
      render: (text, record) => (
        <Popconfirm
          onConfirm={() => _deleteCategory(record.category_id)}
          title="Bạn có muốn xóa nhóm sản phẩm con này?"
          okText="Đồng ý"
          cancelText="Từ chối"
        >
          <DeleteOutlined style={{ color: 'red', fontSize: 22, cursor: 'pointer' }} />
        </Popconfirm>
      ),
    },
    {
      title: 'Hình ảnh',
      align: 'center',
      render: (text, record) =>
        record.image && <img src={record.image} alt="" style={{ width: 45, height: 45 }} />,
    },
    {
      title: 'Tên nhóm sản phẩm',
      align: 'center',
      render: (text, record) => record.name || '',
    },
    { title: 'Mã nhóm sản phẩm', align: 'center', dataIndex: 'code' },
    {
      title: 'Người tạo',
      align: 'center',
      render: (text, record) =>
        record._creator && `${record._creator.first_name} ${record._creator.last_name}`,
    },
    {
      title: 'Ngày tạo',
      align: 'center',
      render: (text, record) =>
        record.create_date && moment(record.create_date).format('DD/MM/YYYY HH:mm:ss'),
    },
    { title: 'Độ ưu tiên', align: 'center', dataIndex: 'priority' },
  ]

  useEffect(() => {
    _getUserList()
  }, [])

  useEffect(() => {
    _getCategories()
  }, [paramsFilter])

  return (
    <div className="card">
      <TitlePage title="Nhóm sản phẩm">
        <Button size="large" type="primary" onClick={() => history.push(ROUTES.CATEGORY)}>
          Tạo nhóm sản phẩm
        </Button>
      </TitlePage>
      <div style={{ margin: '25px 0' }}>
        <Space>
          <Input
            size="large"
            allowClear
            value={valueSearch}
            onChange={_onSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên hoặc theo mã"
          />
          <Select
            size="large"
            onChange={onChangeUserFilter}
            value={valueUserFilter}
            style={{ width: 250 }}
            placeholder="Tìm kiếm theo người tạo"
            allowClear
            showSearch
          >
            {userList.map((item, index) => {
              return (
                <Option value={item.user_id}>
                  {item.first_name} {item.last_name}
                </Option>
              )
            })}
          </Select>
          <Select
            size="large"
            value={valueFilterTime}
            allowClear
            style={{ width: 250 }}
            placeholder="Lọc theo thời gian"
            showSearch
            open={openSelect}
            onChange={(value) => {
              setValueFilterTime(value)
              delete paramsFilter[valueFilterTime]
              if (value) paramsFilter[value] = true
              else delete paramsFilter[value]
              setParamsFilter({ ...paramsFilter })
            }}
            onBlur={() => {
              if (openSelect) toggleOpenSelect()
            }}
            onClick={() => {
              if (!openSelect) toggleOpenSelect()
            }}
            dropdownRender={(menu) => (
              <>
                <RangePicker
                  style={{ width: '100%' }}
                  onFocus={() => {
                    if (!openSelect) toggleOpenSelect()
                  }}
                  onBlur={() => {
                    if (openSelect) toggleOpenSelect()
                  }}
                  value={valueDateSearch}
                  onChange={(dates, dateStrings) => {
                    //khi search hoac filter thi reset page ve 1
                    paramsFilter.page = 1

                    if (openSelect) toggleOpenSelect()

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
                      setValueFilterTime()
                    } else {
                      const dateFirst = dateStrings[0]
                      const dateLast = dateStrings[1]
                      setValueDateSearch(dates)
                      setValueFilterTime(`${dateFirst} -> ${dateLast}`)

                      dateFirst.replace(/-/g, '/')
                      dateLast.replace(/-/g, '/')

                      paramsFilter.from_date = dateFirst
                      paramsFilter.to_date = dateLast
                    }

                    setParamsFilter({ ...paramsFilter })
                  }}
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
          <Button
            size="large"
            onClick={_onClearFilters}
            type="primary"
            danger
            style={{ display: Object.keys(paramsFilter).length <= 2 && 'none' }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>

      <Table
        expandable={{
          expandedRowRender: (record) => {
            return record.children_category && record.children_category.length ? (
              <div style={{ margin: 25 }}>
                <Table
                  rowKey="category_id"
                  style={{ width: '100%' }}
                  pagination={false}
                  columns={columnsChildren}
                  dataSource={record.children_category}
                  size="small"
                  expandable={{
                    expandedRowRender: (record) =>
                      record.children_category && record.children_category.length ? (
                        <Table
                          rowKey="category_id"
                          style={{ width: '100%' }}
                          pagination={false}
                          columns={columnsChildrenSmall}
                          dataSource={record.children_category}
                          size="small"
                        />
                      ) : (
                        ''
                      ),
                    expandedRowKeys: record.children_category.map((item) => item.category_id),
                    expandIconColumnIndex: -1,
                  }}
                />
              </div>
            ) : (
              ''
            )
          },
        }}
        pagination={{
          position: POSITION_TABLE,
          current: paramsFilter.page,
          pageSize: paramsFilter.page_size,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showQuickJumper: true,
          onChange: (page, pageSize) =>
            setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
          total: countCategories,
        }}
        rowKey="category_id"
        loading={loading}
        dataSource={categories}
        columns={columnsParent}
        style={{ width: '100%' }}
        size="small"
      />
    </div>
  )
}
