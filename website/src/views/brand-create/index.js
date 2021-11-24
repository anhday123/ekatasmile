import React, { useEffect, useRef, useState } from 'react'
import styles from './../brand-create/brand-create.module.scss'
// antd
import { ArrowLeftOutlined, InfoCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table, Upload, message, notification, InputNumber, DatePicker } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'
// html react parser
import parse from 'html-react-parser'

// api
import { createBlog, updateBlog } from 'apis/blog'
import { uploadFile, uploadFiles } from 'apis/upload'
import { Option } from 'antd/lib/mentions'

const { Dragger } = Upload

export default function BrandCreate() {
  const history = useHistory()
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState([])
  const [idBrand, setIdBrand] = useState('')
  const typingTimeoutRef = useRef()

  const handleChangeNoiDung = (e) => {
    const value = e.editor.getData()
    setContent(value)
  }
  const handleChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  //   const _actionBrand = async () => {
  //     const body = {
  //       title: title,
  //       content: content,
  //       image: image,
  //     }
  //     console.log(body)
  //     try {
  //       let res
  //       if (location.state) {
  //         res = await updateBrand(idBlog, body)
  //       } else {
  //         res = await createBrand(body)
  //       }
  //       console.log(res)
  //       if (res.status === 200) {
  //         if (res.data.success) {
  //           history.goBack()
  //           notification.success({
  //             message: `${location.state ? 'Cập nhật' : 'Tạo'} bài viết thành công`,
  //           })
  //         } else {
  //           notification.success({
  //             message:
  //               res.data.message || `${location.state ? 'Cập nhật' : 'Tạo'} bài viết thành công`,
  //           })
  //         }
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  useEffect(() => {
    // if (location.state) {
    //   setIdBrand(location.state.blog_id)
    //   setContent(location.state.content)
    //   setTitle(location.state.title)
    //   setImage(location.state.image || [])
    // }
  }, [])

  return (
    <div className={styles['body_brand']}>
      <div className={styles['body_brand_header']}>
        <div className={styles['body_brand_header_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['body_brand_header_list_text']}>
            {location.state ? 'Cập nhật thương hiệu' : 'Tạo thương hiệu'}
          </span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button style={{ width: '90px' }} type="primary">
          {location.state ? 'Cập nhật' : 'Tạo'}
        </Button>
      </div>
      <hr />
      <div className={styles['body_brand_content']}>
        <div style={{ marginTop: 20 }}>
          <h3>Hình ảnh</h3>
          {location.state ? (
            <Dragger
              listType="picture"
              name="file"
              multiple
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                if (info.file.status !== 'done') info.file.status = 'done'
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
                }
                typingTimeoutRef.current = setTimeout(async () => {
                  let imageBlog = []
                  info.fileList.map((item) => imageBlog.push(item.originFileObj))
                  // const imgUrl=await uploadFile(info.file.originFileObj)
                  const imgUrl = await uploadFiles(imageBlog)
                  setImage(imgUrl)
                  console.log(imgUrl)
                }, 350)
                console.log(info)
              }}
              fileList={image?.map((item, index) => {
                return {
                  uid: index,
                  name: 'image',
                  status: 'done',
                  url: item,
                  thumbUrl: item,
                }
              })}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
              <p className="ant-upload-hint">Hỗ trợ định dạng .PNG,.JPG,.TIFF,.EPS</p>
            </Dragger>
          ) : (
            <Dragger
              listType="picture"
              name="file"
              multiple
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                if (info.file.status !== 'done') info.file.status = 'done'
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
                }
                typingTimeoutRef.current = setTimeout(async () => {
                  let imageBlog = []
                  info.fileList.map((item) => imageBlog.push(item.originFileObj))
                  // const imgUrl=await uploadFile(info.file.originFileObj)
                  const imgUrl = await uploadFiles(imageBlog)
                  setImage(imgUrl)
                  console.log(imgUrl)
                }, 350)
                console.log(info)
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
              <p className="ant-upload-hint">Hỗ trợ định dạng .PNG,.JPG,.TIFF,.EPS</p>
            </Dragger>
          )}
        </div>
        <div className={styles['body_brand_content_header']}>
          <div>
            <h3>Tên thương hiệu</h3>
            <Input
              value={title}
              onChange={handleChangeTitle}
              style={{ width: '85%' }}
              placeholder="Nhập tên thương hiệu"
            ></Input>
          </div>
          <div>
            <h3>Quốc gia</h3>
            <Select placeholder="Chọn quốc gia" style={{ width: "85%" }} allowClear>
              <Option value="america">Mỹ</Option>
              <Option value="japan">Nhật</Option>
            </Select>
          </div>
          <div>
            <h3>Năm thành lập</h3>
            <DatePicker placeholder="Chọn năm thành lập" style={{ width: '85%' }} />
          </div>
          <div>
            <h3>Độ ưu tiên</h3>
            <InputNumber
              min={1}
              max={100}
              style={{ width: '85%' }}
              placeholder="Nhập độ ưu tiên"
            ></InputNumber>
          </div>
        </div>
        <h3 style={{ padding: '20px 0' }}>Mô tả</h3>
        <CKEditor
          initData={location.state ? parse(location.state.content) : ''}
          onChange={handleChangeNoiDung}
        />
      </div>
    </div>
  )
}
