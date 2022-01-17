import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'

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
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'

//apis
import { uploadFile } from 'apis/upload'
import { addCategory, updateCategory } from 'apis/category'

export default function Category() {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const [fileUpload, setFileUpload] = useState(null)
  const [imageView, setImageView] = useState('')

  const [match, setMatch] = useState(location.state ? location.state.condition.must_match : 'all')
  const [conditions, setConditions] = useState(
    location.state
      ? location.state.condition.function
      : [{ name: 'slug_title', operator: 'is_equal_to', value: '' }]
  )

  const PRODUCT_TYPES = [
    { slug_title: 'Tiêu đề' },
    { slug_description: 'Mô tả' },
    { slug_sku: 'Sku' },
    { slug_origin_price: 'Giá gốc' },
    { slug_sale_price: 'Giá bán' },
    { slug_compare_at_price: 'So sánh giá' },
    { slug_weight: 'Trọng lượng' },
    { slug_inventory_stock: 'Kho hàng tồn kho' },
    { slug_variant_description: 'Mô tả thuộc tính' },
    { slug_variant_sku: 'Sku thuộc tính' },
    { slug_variant_origin_price: 'Giá gốc thuộc tính' },
    { slug_variant_sale_price: 'Giá bán thuộc tính' },
    { slug_variant_compare_at_price: 'Thuộc tính so sánh ở mức giá' },
    { slug_variant_inventory_stock: 'Thuộc tính tồn kho' },
    { slug_variant_weight: 'Thuộc tính tồn kho' },
    { slug_variant_inventory_stock: 'Trọng lượng thuộc tính' },
    { date_created: 'Ngày tạo' },
    { variant_date_created: 'Ngày tạo thuộc tính' },
  ]

  const ARCHIVES = [
    {
      name: { is_equal_to: 'bằng' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
    },
    {
      name: { is_not_equal_to: 'không bằng' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
    },
    {
      name: { is_greater_than: 'không bằng' },
      actives: [
        'slug_origin_price',
        'slug_sale_price',
        'slug_compare_at_price',
        'slug_weight',
        'slug_inventory_stock',
        'slug_variant_origin_price',
        'slug_variant_sale_price',
        'slug_variant_compare_at_price',
        'slug_variant_inventory_stock',
        'slug_variant_weight',
        'date_created',
        'variant_date_created',
      ],
    },
    {
      name: { is_less_than: 'ít hơn' },
      actives: [
        'slug_origin_price',
        'slug_sale_price',
        'slug_compare_at_price',
        'slug_weight',
        'slug_inventory_stock',
        'slug_variant_origin_price',
        'slug_variant_sale_price',
        'slug_variant_compare_at_price',
        'slug_variant_inventory_stock',
        'slug_variant_weight',
        'date_created',
        'variant_date_created',
      ],
    },
    {
      name: { contains: 'chứa' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
    },
    {
      name: { does_not_contains: 'không chứa' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
    },
    {
      name: { is_not_empty: 'không trống rỗng' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
    },
    {
      name: { is_empty: 'trống rỗng' },
      actives: [
        'slug_title',
        'slug_description',
        'slug_sku',
        'slug_variant_description',
        'slug_variant_sku',
      ],
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
            <Form.Item valuePropName="checked" name="default">
              <Checkbox>Chọn làm mặc định</Checkbox>
            </Form.Item>
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
                          <Select.Option
                            key={index}
                            value={Object.keys(archive.name)[0]}
                            disabled={!archive.actives.includes(condition.name) && true}
                          >
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
                    conditionsNew.push({ name: 'slug_title', operator: 'is_equal_to', value: '' })
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
            <Form.Item
              rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}
              name="priority"
              label="Độ ưu tiên"
            >
              <InputNumber placeholder="Nhập độ ưu tiên" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={4} placeholder="Nhập mô tả" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Row>
      </Form>
    </div>
  )
}
