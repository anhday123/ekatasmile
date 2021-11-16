import React, { useState } from 'react'
import styles from './setting.module.scss'
import { copyText } from 'utils'

//antd
import { Upload } from 'antd'

//icons
import { LoadingOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'

//apis
import { uploadFile } from 'apis/upload'

export default function Setting() {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState('')

  return (
    <div className={styles['setting-container']}>
      <div className={`${styles['setting-content']} ${styles['card']}`}>
        <div style={{ color: '#1A3873', fontSize: '1.25rem', fontWeight: '700', marginBottom: 30 }}>
          Cài đặt
        </div>
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
      </div>
    </div>
  )
}
