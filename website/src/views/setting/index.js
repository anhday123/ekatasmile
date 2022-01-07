import React, { useState } from 'react'
import styles from './setting.module.scss'
import { copyText } from 'utils'

//antd
import { Upload, Tabs, Table, Button, Row, Popconfirm, Modal, Input } from 'antd'

//icons
import { LoadingOutlined, PlusOutlined, CopyOutlined, PlusCircleOutlined } from '@ant-design/icons'

//apis
import { uploadFile } from 'apis/upload'
import { VERSION_APP } from 'consts'

export default function Setting() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState('')

  const columnsLanguage = [
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'logo',
    },
    {
      title: 'File',
      dataIndex: 'file',
    },
    {
      width: 110,
      title: '',
      render: (text, record) => (
        <Popconfirm title="Bạn có muốn xóa file này không ?">
          <Button type="primary" danger>
            Xóa file
          </Button>
        </Popconfirm>
      ),
    },
  ]

  let dataMockup = []
  for (let i = 0; i < 2; i++)
    dataMockup.push({
      name: 'Ngôn ngữ ' + i++,
      logo: '',
      file: 'File' + 1,
    })

  const ModalImportFile = () => {
    const [visible, setVisible] = useState(false)

    const toggle = () => setVisible(!visible)

    return (
      <>
        <Button onClick={toggle} icon={<PlusCircleOutlined />} type="primary">
          Tải file
        </Button>
        <Modal title={<a>Tải file mẫu</a>} visible={visible} onCancel={toggle}>
          <div>
            <div>Tên file</div>
            <Input placeholder="Nhập tên file" />
          </div>
          <Button
            icon={<PlusOutlined />}
            style={{ width: 150, height: 100, marginTop: 15 }}
          ></Button>
        </Modal>
      </>
    )
  }

  return (
    <div className={styles['setting-container']}>
      <div className={`${styles['setting-content']} ${styles['card']}`}>
        <Tabs size="large" type="card">
          <Tabs.TabPane tab="Ngôn ngữ" key="1">
            <Row justify="end" style={{ marginBottom: 15 }}>
              <ModalImportFile />
            </Row>
            <Table
              size="small"
              dataSource={dataMockup}
              columns={columnsLanguage}
              style={{ width: '100%' }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Chi tiết phiên bản" key="2">
            <div>
              <div>Version: {VERSION_APP}</div>
              <div>
                <div>Chi tiết:</div>
                <div>- Bổ sung giao diện nhập kho</div>
                <div>- Bổ sung chức năng tạo đơn nhập kho</div>
                <div>- Chỉnh sửa chức năng import sản phẩm bằng file excel</div>
                <div>- Cho phép tải file đính kèm khi tạo sản phẩm</div>
                <div>- Xuất file excel các đơn hàng nhập </div>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Kết nối API" key="3">
            Phát triển sau
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khác" key="4">
            <div>Lấy link hình ảnh</div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="upload-category-image"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              data={async (file) => {
                console.log(file)
                setLoading(true)
                const url = await uploadFile(file)
                setImageUrl(url)
                setLoading(false)
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <h3>
              {imageUrl}{' '}
              <CopyOutlined
                style={{
                  display: !imageUrl && 'none',
                  color: '#5B6BE8',
                  cursor: 'pointer',
                  marginLeft: 7,
                  fontSize: 19,
                }}
                onClick={() => copyText(imageUrl)}
              />
            </h3>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
