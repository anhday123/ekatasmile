import React, { useEffect, useState } from 'react'
import styles from './../blog-create/blog-create.module.scss'
// antd
import { ArrowLeftOutlined, InfoCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Input, Select, Table, Upload, message, InputNumber, notification } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

// ckeditor
import { CKEditor } from 'ckeditor4-react'
// html react parser
import parse from 'html-react-parser'

// api
import { addDeal, updateDeal } from 'apis/deal'

const { Dragger } = Upload

export default function BlogCreate() {
  const history = useHistory()
  const location=useLocation()  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image,setImage]=useState('')

  const handleChangeNoiDung = (e) => {
    const value = e.editor.getData()
    setContent(value)
  }

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info)
        // status = 'done'
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.success(`${info.file.name} file upload successfully.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const _actionDeal = async () => {
    const body = {
      name: title,
      content: content,
    }
    console.log(body)
    try {
      const res = await addDeal(body)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          history.goBack()
          notification.success({ message: 'Tạo bài viết thành công' })
        } else {
          notification.success({ message: res.data.message || 'Tạo bài viết thất bại' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    if(location.state){
      // console.log(location.state)
      setContent(location.state.content)
      setTitle(location.state.title)
      setImage(location.state.image)
    }
  })

  return (
    <div className={styles['body_blog']}>
      <div className={styles['body_blog_header']}>
        <div className={styles['body_blog_header_title']}>
          <ArrowLeftOutlined
            onClick={() => history.goBack()}
            style={{ fontSize: '20px', paddingRight: '10px' }}
          />
          <span className={styles['body_blog_header_list_text']}>{location.state ? 'Cập nhật bài viết' : 'Tạo bài viết'}</span>
          <a>
            <InfoCircleOutlined />
          </a>
        </div>
        <Button onClick={_actionDeal} style={{ width: '90px' }} type="primary">
          {location.state ? 'Cập nhật' : 'Tạo'}
        </Button>
      </div>
      <hr />
      <div className={styles['body_blog_content']}>
        <div style={{marginTop:20}}>
        <Dragger listType="picture" {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
          <p className="ant-upload-hint">Hỗ trợ định dạng .PNG,.JPG,.TIFF,.EPS</p>
          {image ? <img src={image} style={{width:80,height:80}} alt="" /> : ''}
        </Dragger>
        </div>
        <div className={styles['body_blog_content_header']}>
          <h3>Tiêu đề</h3>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%' }}
            placeholder="Nhập tiêu đề"
          ></Input>
        </div>
        <h3 style={{ padding: '20px 0' }}>Nội dung</h3>
        <CKEditor initData={location.state ? parse(location.state.content) : ''} onChange={handleChangeNoiDung} />
      </div>
    </div>
  )
}
