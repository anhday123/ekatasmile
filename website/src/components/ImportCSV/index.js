import React, { useState, useRef } from 'react'
import { ExcelRenderer } from 'react-excel-renderer'
import exportToCSV from 'components/ExportCSV/export'

// antd
import { Row, Button, Modal, Upload, message, notification, Table } from 'antd'

//icons
import { DownloadOutlined } from '@ant-design/icons'
import moment from 'moment'

export default function ImportFile({
  title,
  fileTemplated,
  upload,
  txt = 'Nhập excel',
  reload,
  size = 'default',
  customFileTemplated = false,
  fileName = '',
  shippingId = '',
  reset,
  keyForm = {},
}) {
  const typingTimeoutRef = useRef()

  const [visible, setVisible] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [dataView, setDataView] = useState([])

  const toggle = () => {
    setVisible(!visible)
    setFileUpload(null)
    if (reset) reset()
  }

  const _handleUpload = async () => {
    if (fileUpload) {
      let formData = new FormData()
      formData.append('file', fileUpload)
      try {
        let res

        //Trường hợp upload file đối soát vận chuyển
        if (shippingId !== '') {
          formData.append('type', 'order')
          formData.append('shipping_company_id', shippingId)
          formData.append('status', 'DRAFT')
        }
        if (keyForm && keyForm.branch_id !== undefined && !keyForm.branch_id) {
          notification.warning({ message: 'Vui lòng chọn chi nhánh' })
          return
        }

        //add them key khac neu co
        const objKey = Object.keys(keyForm)
        if (objKey.length !== 0) objKey.map((key) => formData.append(key, keyForm[key]))

        setLoading(true)
        res = await upload(formData)
        console.log('res', res)
        if (res.status === 200) {
          if (res.data.success) {
            notification.success({ message: 'Nhập file excel thành công' })
            reload()
            toggle()
          } else notification.error({ message: res.data.message || 'Nhập file excel thất bại' })
        } else notification.error({ message: res.data.message || 'Nhập file excel thất bại' })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toggle()
        notification.error({ message: 'Nhập file excel thất bại, vui lòng thử lại!' })
      }
    }
  }

  return (
    <>
      <Button size={size} type="primary" icon={<DownloadOutlined />} onClick={toggle}>
        {txt}
      </Button>
      <Modal
        style={{ top: 20 }}
        width="87%"
        title={title}
        visible={visible}
        onCancel={toggle}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Row wrap={false} justify="space-between">
            {customFileTemplated ? (
              <a
                onClick={() => exportToCSV(fileTemplated, fileName)}
                style={{ marginBottom: 15, color: 'blue' }}
              >
                Tải xuống file mẫu
              </a>
            ) : (
              <a download href={fileTemplated} style={{ marginBottom: 15, color: 'blue' }}>
                Tải xuống file mẫu
              </a>
            )}
            <div>Mẫu file cập nhật lần cuối: {moment(new Date()).format('DD/MM/YYYY HH:mm')}</div>
          </Row>

          <Upload
            fileList={fileUpload ? [fileUpload] : []}
            maxCount={1}
            beforeUpload={(file) => {
              if (
                file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              ) {
                message.error(`${file.name} không phải là file excel`)
              }
              return file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ? true
                : Upload.LIST_IGNORE
            }}
            onChange={(info) => {
              if (info.file.status !== 'done') info.file.status = 'done'
              setFileUpload(info.file.originFileObj)

              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
              typingTimeoutRef.current = setTimeout(() => {
                if (info.file.originFileObj) {
                  ExcelRenderer(info.file.originFileObj, (err, resp) => {
                    if (err) console.log(err)
                    else {
                      if (resp.rows[0]) {
                        const columns = resp.rows[0].map((item) => {
                          return { title: item, dataIndex: item }
                        })
                        setColumns([...columns])
                      }

                      let result = []
                      for (let i = 1; i < resp.rows.length; ++i) {
                        if (resp.rows[i].length) {
                          let obj = {}
                          for (let j = 0; j < resp.rows[0].length; ++j)
                            if (resp.rows[0][j]) obj[resp.rows[0][j]] = resp.rows[i][j]

                          result.push(obj)
                        }
                      }
                      setDataView([...result])
                    }
                  })
                } else {
                  setColumns([])
                  setDataView([])
                }
              }, 400)
            }}
          >
            <Button>Chọn file excel</Button>
          </Upload>
          <Row style={{ marginTop: 30 }} justify="end">
            <Table
              sticky
              scroll={{ x: 'max-content', y: 325 }}
              size="small"
              style={{ width: '100%', display: !fileUpload && 'none', marginBottom: 20 }}
              dataSource={dataView}
              columns={columns.map((column) => {
                return { ...column, width: column.title.length * 20 }
              })}
              pagination={false}
            />
            <Button type="primary" onClick={_handleUpload} disabled={!fileUpload} loading={loading}>
              Xác nhận
            </Button>
          </Row>
        </div>
      </Modal>
    </>
  )
}
