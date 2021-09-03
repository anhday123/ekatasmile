import {
  Modal,
  Row,
  Col,
  Select,
  Upload,
  Button,
  message,
  Table,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { apiAllShipping } from '../../../apis/shipping'
import XLSX from 'xlsx'
import { uploadImg } from '../../../apis/upload'
import { addCompare } from '../../../apis/compare'
export default function ImportFile(props) {
  const [visible, setVisible] = useState(false)
  const [transport, setTransport] = useState([])
  const [importData, setImportData] = useState([])
  const [fileLink, setFileLink] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const settingUpload = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        setImportLoading(true)
      }
      if (info.file.status === 'done') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const bstr = e.target.result
          const workBook = XLSX.read(bstr, { type: 'binary' })
          const workSheetname = workBook.SheetNames[0]
          const workSheet = workBook.Sheets[workSheetname]

          const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 0 })
          try {
            const fd = new FormData()
            fd.append('file', info.file.originFileObj)
            const res = await uploadImg(fd)
            if (res.data.success) {
              setFileLink(res.data.data)
              console.log(fileData)
              setImportData(translate(fileData))
              notification.success({
                message: 'Thành công',
                description: 'Upload file thành công',
              })
            }
          } catch (e) {
            console.log(e)
            notification.error({
              message: 'Thất bại',
              description: 'Upload file thất bại',
            })
          }
          setImportLoading(false)
        }

        reader.readAsBinaryString(info.file.originFileObj)
      }
    },
  }
  const translate = (data) => {
    return data.map((e) => {
      return {
        order: e['Mã vận đơn'],
        revice_date: e['Ngày nhận đơn'],
        cod_cost: e['Tiền COD'],
        insurance_cost: e['Phí bảo hiểm'],
        shipping_cost: e['Phí giao hàng'],
        warehouse_cost: e['Phí lưu Kho'],
        weight: e['Khối lượng'],
        complete_date: e['Ngày hoàn thành'],
      }
    })
  }
  const columns = [
    {
      title: 'Mã vận đơn',
      dataIndex: 'order',
    },
    {
      title: 'Ngày nhận đơn',
      dataIndex: 'revice_date',
    },
    {
      title: 'Tiền COD',
      dataIndex: 'cod_cost',
    },
    {
      title: 'Phí bảo hiểm',
      dataIndex: 'insurance_cost',
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shipping_cost',
    },
    {
      title: 'Phí lưu kho',
      dataIndex: 'warehouse_cost',
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      render(data) {
        return data + 'kg'
      },
    },
    {
      title: 'Ngày hoàn thành',
      dataIndex: 'complete_date',
    },
  ]
  const getTransport = async () => {
    try {
      const res = await apiAllShipping()
      if (res.data.success) {
        setTransport(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const addToServer = async () => {
    try {
      if (transport) {
        const obj = {
          type: 'file',
          file: fileLink,
          compares: importData.map((e) => {
            return { ...e, shipping_company: transport, shipping: transport }
          }),
        }
        const res = await addCompare(obj)
        if (res.data.success) {
          // console.log(res.data.data);

          setVisible(false)
          notification({ message: 'Đối soát thành công' })
        }
      } else {
        notification.error({
          message: 'Thất bại',
          description: 'Vui lòng cho đơn vị vận chuyển',
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getTransport()
  }, [])
  return (
    <>
      <Button
        size="large"
        type="primary"
        style={{
          background: 'rgba(0, 136, 22, 1)',
          marginRight: 20,
          border: 'none',
        }}
        onClick={() => setVisible(true)}
      >
        Import phiếu đối soát
      </Button>
      <Modal
        title="Nhập dữ liệu đối soát"
        visible={visible}
        centered
        footer=""
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Row>
          <Col span={6}>Chọn đơn vị vận chuyển:</Col>
          <Col span={12}>
            <Select size="large" style={{ width: '100%' }}>
              {transport
                .filter((e) => e.active)
                .map((e) => (
                  <Select.Option value={e.transport_id}>{e.name}</Select.Option>
                ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <p>
            *Chú ý: <br />
            - Mã đơn vận Chuyển phải là duy nhất. <br />
            - Chỉ nhập các đơn hàng đối soát thành công vào file. <br />
            - Chuyển đổi file nhập dưới dạng .XLS trước tải dữ liệu.
            <br />- Tải file mẫu đơn hàng{' '}
            <a
              href="https://ecomfullfillment.s3.ap-southeast-1.amazonaws.com/1629531640659_ecomfullfillment.xlsx"
              target="_blank"
            >
              tại đây
            </a>
          </p>
        </Row>
        <Row style={{ marginBottom: 15 }}>
          <Upload {...settingUpload}>
            <Button size="large">Đính kèm file</Button>
          </Upload>
        </Row>
        <Table
          size="small"
          columns={columns}
          dataSource={importData}
          loading={importLoading}
          scroll={{ x: 'max-content' }}
        />
        <Row
          justify="end"
          style={{
            marginTop: 15,
          }}
        >
          <Button type="primary" size="large" onClick={addToServer}>
            Lưu
          </Button>
        </Row>
      </Modal>
    </>
  )
}
