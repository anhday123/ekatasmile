import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'
import columnsProduct from '../product/columns'

//components
import TitlePage from 'components/title-page'

//antd
import {
  Row,
  Form,
  Upload,
  InputNumber,
  Input,
  Checkbox,
  Button,
  notification,
  Radio,
  Space,
  Select,
  Col,
  Table,
  Tag,
  Switch,
} from 'antd'

//icons
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

//apis
import { uploadFile } from 'apis/upload'
import { addCategory, updateCategory } from 'apis/category'
import { getProducts } from 'apis/product'
import { Link } from 'react-router-dom'
import { compare, compareCustom, formatCash } from 'utils'
import moment from 'moment'

export default function Category() {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const [fileUpload, setFileUpload] = useState(null)
  const [imageView, setImageView] = useState('')
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [productsByCategory, setProductsByCategory] = useState([])

  const [match, setMatch] = useState(
    location.state && location.state.condition ? location.state.condition.must_match : 'all'
  )
  const [conditions, setConditions] = useState(
    location.state && location.state.condition
      ? location.state.condition.function
      : [{ name: 'name', operator: 'is_equal_to', value: '' }]
  )

  const PRODUCT_TYPES = [
    { name: 'Tên sản phẩm' },
    { description: 'Mô tả' },
    { sku: 'SKU' },
    { weight: 'Cân nặng' },
    { height: 'Chiều cao' },
    { width: 'Chiều rộng' },
    { quantity: 'Số lượng' },
    { price_import: 'Giá nhập' },
    { price_sale: 'Giá bán' },
  ]

  const ARCHIVES = [
    {
      name: { is_equal_to: 'giống' },
      actives: [],
    },
    {
      name: { is_not_equal_to: 'không giống' },
      actives: [],
    },
    {
      name: { is_greater_than: 'nhiều hơn' },
      actives: [],
    },
    {
      name: { is_less_than: 'ít hơn' },
      actives: [],
    },
    {
      name: { contains: 'chứa' },
      actives: [],
    },
    {
      name: { does_not_contains: 'không chứa' },
      actives: [],
    },
    {
      name: { is_not_empty: 'trống' },
      actives: [],
    },
    {
      name: { is_empty: 'không trống' },
      actives: [],
    },
  ]

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const _addOrUpdateCategory = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      await form.validateFields()
      const dataForm = form.getFieldsValue()

      const image = await uploadFile(fileUpload)
      const body = {
        ...dataForm,
        parent_id: -1,
        image: image || imageView || '',
        default: dataForm.default || false,
        description: dataForm.description || '',
        condition: {
          must_match: match,
          function: conditions,
        },
      }

      let res

      if (location.state) res = await updateCategory(body, location.state.category_id)
      else res = await addCategory(body)

      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({
            message: `${location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm thành công!`,
          })
          history.push(ROUTES.CATEGORIES)
        } else
          notification.error({
            message:
              res.data.mess ||
              res.data.message ||
              `${location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm thất bại!`,
          })
      } else
        notification.error({
          message:
            res.data.mess ||
            res.data.message ||
            `${location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm thất bại!`,
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  /**
   * Lấy danh sách sản phẩm theo nhóm sản phẩm
   */
  const getProductsByCategory = async () =>{
    if (location.state && location.state.category_id) {
      const res = await getProducts({ ...paramsFilter, category_id: location.state.category_id })
      setProductsByCategory(res.data.data)
    }
  }
  useEffect(() => {
    getProductsByCategory();
  }, [])

  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({ ...location.state })
      setImageView(location.state.image || '')
    }
  }, [])

  return (
    <div className="card">
      <TitlePage
        title={
          <Row
            align="middle"
            onClick={() => history.push(ROUTES.CATEGORIES)}
            style={{ cursor: 'pointer' }}
          >
            <ArrowLeftOutlined />
            <div style={{ marginLeft: 8 }}>{location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm</div>
          </Row>
        }
      >
        <Button size="large" type="primary" onClick={_addOrUpdateCategory}>
          {location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm
        </Button>
      </TitlePage>
      <Form layout="vertical" form={form}>
        <Row style={{ margin: '25px 0px' }}>
          <div style={{ width: '60%' }}>
            {/* <Form.Item valuePropName="checked" name="default">
              <Checkbox>Chọn làm mặc định</Checkbox>
            </Form.Item> */}
            <div>Hình ảnh</div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="upload-category-image"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                if (info.file.status !== 'done') info.file.status = 'done'
                getBase64(info.file.originFileObj, (imageUrl) => setImageView(imageUrl))
                setFileUpload(info.file.originFileObj)
              }}
            >
              {imageView ? (
                <img src={imageView} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div style={{ width: '100%', padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 500, marginBottom: 7 }}>
                  Các điều kiện
                </span>
                <Row>
                  <p style={{ marginBottom: 0, marginRight: 18 }}>Các sản phẩm phải phù hợp:</p>
                  <Radio.Group value={match} onChange={(e) => setMatch(e.target.value)}>
                    <Space>
                      <Radio value="all">Tất cả điều kiện</Radio>
                      <Radio value="any">Bất kì điều kiện nào</Radio>
                    </Space>
                  </Radio.Group>
                </Row>
                {conditions.map((condition, index) => (
                  <>
                    <Row
                      wrap={false}
                      justify="space-between"
                      align="middle"
                      style={{ marginTop: 20 }}
                    >
                      <Select
                        style={{ width: '50%' }}
                        value={condition.name}
                        onChange={(value) => {
                          const conditionsNew = [...conditions]
                          conditionsNew[index].name = value
                          const labelFind = ARCHIVES.find((e) => e.actives.includes(value))
                          if (labelFind)
                            conditionsNew[index].operator = Object.keys(labelFind.name)[0]
                          setConditions([...conditionsNew])
                        }}
                      >
                        {PRODUCT_TYPES.map((objectType, index) => {
                          const type = Object.keys(objectType)

                          return (
                            <Select.Option key={index} value={type[0]}>
                              {objectType[type[0]]}
                            </Select.Option>
                          )
                        })}
                      </Select>
                      <Select
                        style={{ width: '50%' }}
                        value={condition.operator}
                        onChange={(value) => {
                          const conditionsNew = [...conditions]
                          conditionsNew[index].operator = value
                          setConditions([...conditionsNew])
                        }}
                      >
                        {ARCHIVES.map((archive, index) => (
                          <Select.Option key={index} value={Object.keys(archive.name)[0]}>
                            {archive.name[Object.keys(archive.name)[0]]}
                          </Select.Option>
                        ))}
                      </Select>
                      <div style={{ width: '50%' }}>
                        <Input
                          defaultValue={condition.value}
                          onBlur={(e) => {
                            const conditionsNew = [...conditions]
                            conditionsNew[index].value = e.target.value || ''
                            setConditions([...conditionsNew])
                          }}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <Button
                        style={{ display: conditions.length === 1 && 'none' }}
                        onClick={() => {
                          const conditionsNew = [...conditions]
                          conditionsNew.splice(index, 1)
                          setConditions([...conditionsNew])
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Row>
                    {/* <Row
                    style={{
                      width: '100%',
                      marginTop: 5,
                      color: 'red',
                      display: condition.value.length && 'none',
                    }}
                    align="middle"
                  >
                    <ExclamationCircleFilled style={{ marginRight: 9 }} />
                    <span>
                      {!condition.value && 'Enter some text for Variant’s title contains.'}
                    </span>
                  </Row> */}
                  </>
                ))}
                <Button
                  style={{ borderRadius: 6, width: 'max-content', marginTop: 30 }}
                  type="primary"
                  onClick={() => {
                    const conditionsNew = [...conditions]
                    conditionsNew.push({ name: 'name', operator: 'is_equal_to', value: '' })
                    setConditions([...conditionsNew])
                  }}
                >
                  Thêm điều kiện khác
                </Button>
              </div>
            </div>
          </div>
          <div style={{ width: '40%' }}>
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm sản phẩm' }]}
              name="name"
              label="Tên nhóm sản phẩm"
            >
              <Input placeholder="Nhập tên nhóm sản phẩm" style={{ width: '100%' }} />
            </Form.Item>
            {/* <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}
              name="priority"
              label="Độ ưu tiên"
            >
              <InputNumber placeholder="Nhập độ ưu tiên" style={{ width: '100%' }} />
            </Form.Item> */}
            {/* <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} placeholder="Nhập mô tả" style={{ width: '100%' }} />
            </Form.Item> */}
          </div>
        </Row>

      </Form>
      <Row>
        <Table
          style={{ width: '100%' }}
          // rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          rowKey="product_id"
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div style={{ marginTop: 25, marginBottom: 25 }}>
                </div>
              )
            },
            expandIconColumnIndex: -1,
          }}
          columns={columnsProduct.map((column) => {
            if (column.key === 'stt')
              return {
                ...column,
                width: 50,
                render: (text, record, index) =>
                  (paramsFilter.page - 1) * paramsFilter.page_size + index + 1,
              }
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
                  // const supplier = suppliers.find((c) => c.supplier_id === record.supplier_id)
                  // if (supplier) return supplier.name
                  // else 
                  return ''
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
                  <Space size="middle">
                    <div>
                      <div>Mở bán</div>
                      <Switch
                        defaultChecked={record.active}
                      // onClick={() =>
                      //   _updateProduct({ active: !record.active }, record.product_id)
                      // }
                      />
                    </div>
                  </Space>
                ),
              }

            return column
          })}
          dataSource={productsByCategory}
          size="small"
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            // total: countProduct,
          }}
        />
      </Row>
      <Row>
      <div> Ghi chú: Nhóm sản phẩm chỉ hiệu quả khi doanh nghiệp có triển khai bán hàng online và bán hàng trên thương mại điện tử</div>  
      </Row>
    </div>
  )
}
