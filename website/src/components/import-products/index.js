import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Modal, notification, Row, Space, Upload } from 'antd'

import {
  ImportOutlined,
  LinkOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'

//apis
import { importProduct } from 'apis/product'
import { ACTION } from 'consts'

export default function ImportProducts({ reload }) {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [valueFileImport, setValueFileImport] = useState('')

  const _importFile = async () => {
    try {
      if (!valueFileImport) {
        notification.warning({ message: 'Vui lòng nhập file import' })
        return
      }
      dispatch({ type: ACTION.LOADING, data: true })
      const formData = new FormData()
      formData.append('file', valueFileImport)
      const res = await importProduct(formData)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          setValueFileImport(null)
          toggle()
          notification.success({ message: 'Import sản phẩm thành công!' })
          reload()
        } else
          notification.error({
            message:
              res.data.mess || res.data.message || 'Import sản phẩm thất bại!',
          })
      } else
        notification.error({
          message:
            res.data.mess || res.data.message || 'Import sản phẩm thất bại!',
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  return (
    <>
      <Button
        onClick={toggle}
        style={{ minWidth: 130 }}
        type="primary"
        size="large"
        icon={<ImportOutlined />}
      >
        Import Sản Phẩm
      </Button>

      <Modal
        footer={
          <Row justify="end">
            <Space>
              <Button type="primary" danger>
                Cancel
              </Button>
              <Button
                onClick={_importFile}
                type="primary"
                disabled={!valueFileImport ? true : false}
              >
                Import
              </Button>
            </Space>
          </Row>
        }
        visible={visible}
        onCancel={toggle}
        title={
          <a
            href="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/11/15/12a10bad-8293-407d-936c-3dcfab363553/templated products import.xlsx"
            target="_blank"
          >
            <Button icon={<LinkOutlined />} type="link">
              Download Template
            </Button>
          </a>
        }
        width="50%"
      >
        <Upload.Dragger
          maxCount={1}
          onChange={(info) => {
            if (info.file.status !== 'done') info.file.status = 'done'
            if (info.fileList && info.fileList.length)
              setValueFileImport(info.file.originFileObj)
            else setValueFileImport(null)
          }}
          name="file"
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">
            Kéo thả file vào đây hoặc tải lên từ thiết bị
          </p>
        </Upload.Dragger>
      </Modal>
    </>
  )
}
