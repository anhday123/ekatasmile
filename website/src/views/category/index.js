import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'

//antd
import { Row, Form, Upload, InputNumber, Input, Checkbox, Button, notification } from 'antd'

//icons
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'

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
    <div className="card-container">
      <div style={{ borderBottom: '0.75px solid #BBBCBD', paddingBottom: 15 }}>
        <Row
          align="middle"
          onClick={() => history.push(ROUTES.CATEGORIES)}
          style={{ cursor: 'pointer', width: 'max-content' }}
        >
          <ArrowLeftOutlined style={{ fontSize: 16 }} />
          <h3 style={{ marginBottom: 0, fontWeight: 700, marginLeft: 7 }}>
            {location.state ? 'Cập nhật' : 'Tạo'} nhóm sản phẩm
          </h3>
        </Row>
      </div>
      <div>
        <div style={{ width: '50%', margin: '25px 0px' }}>
          Hình ảnh
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
        </div>
        <Form layout="vertical" form={form}>
          <Form.Item
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm sản phẩm' }]}
            name="name"
            label="Tên nhóm sản phẩm"
          >
            <Input placeholder="Nhập tên nhóm sản phẩm" style={{ width: '50%' }} />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}
            name="priority"
            label="Độ ưu tiên"
          >
            <InputNumber placeholder="Nhập độ ưu tiên" style={{ width: '50%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Nhập mô tả" style={{ width: '50%' }} />
          </Form.Item>
          <Form.Item valuePropName="checked" name="default">
            <Checkbox>Chọn làm mặc định</Checkbox>
          </Form.Item>
          <Button onClick={_addOrUpdateCategory} type="primary" size="large" style={{ width: 120 }}>
            {location.state ? 'Lưu' : 'Tạo'}
          </Button>
        </Form>
      </div>
    </div>
  )
}
