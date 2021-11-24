import React, { useEffect, useRef, useState } from 'react'
import styles from './../blog-create/blog-create.module.scss'
// antd
import { ArrowLeftOutlined, InfoCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table, Upload, message, notification } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'
// html react parser
import parse from 'html-react-parser'

// api
import { createBlog, updateBlog } from 'apis/blog'
import { uploadFile, uploadFiles } from 'apis/upload'

const { Dragger } = Upload

export default function BlogCreate() {
  const history = useHistory()
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState([])
  const [idBlog, setIdBlog] = useState('')
  const typingTimeoutRef = useRef()

  const handleChangeNoiDung = (e) => {
    const value = e.editor.getData()
    setContent(value)
  }
  const handleChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {},
  }

  const _actionBlog = async () => {
    const body = {
      title: title,
      content: content,
      image: image,
    }
    console.log(body)
    try {
      let res
      if (location.state) {
        res = await updateBlog(idBlog, body)
      } else {
        res = await createBlog(body)
      }
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          history.goBack()
          notification.success({
            message: `${location.state ? 'Cập nhật' : 'Tạo'} bài viết thành công`,
          })
        } else {
          notification.success({
            message:
              res.data.message || `${location.state ? 'Cập nhật' : 'Tạo'} bài viết thành công`,
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (location.state) {
      setIdBlog(location.state.blog_id)
      setContent(location.state.content)
      setTitle(location.state.title)
      setImage(location.state.image || [])
    }
  }, [])

  return (
    <div className={styles['body_blog']}>
      <div className={styles['body_blog_header']}>
        <div className={styles['body_blog_header_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['body_blog_header_list_text']}>
            {location.state ? 'Cập nhật bài viết' : 'Tạo bài viết'}
          </span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button onClick={_actionBlog} style={{ width: '90px' }} type="primary">
          {location.state ? 'Cập nhật' : 'Tạo'}
        </Button>
      </div>
      <hr />
      <div className={styles['body_blog_content']}>
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
        <div className={styles['body_blog_content_header']}>
          <h3>Tiêu đề</h3>
          <Input
            value={title}
            onChange={handleChangeTitle}
            style={{ width: '100%' }}
            placeholder="Nhập tiêu đề"
          ></Input>
        </div>
        <h3 style={{ padding: '20px 0' }}>Nội dung</h3>
        <CKEditor
          initData={location.state ? parse(location.state.content) : ''}
          onChange={handleChangeNoiDung}
        />
      </div>
    </div>
  )
}
