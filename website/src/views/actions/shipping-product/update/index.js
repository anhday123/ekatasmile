import styles from './../update/update.module.scss'
import {
  Select,
  Button,
  Table,
  Row,
  Col,
  Radio,
  Space,
  notification,
} from 'antd'
import { useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { UpdateDelivery } from '../../../../apis/delivery'
const { Option } = Select
export default function DeliveryUpdate() {
  const history = useHistory()
  const [status, setStatus] = useState(history.location.state.status)
  const columns = [
    {
      title: 'STT',
      width: 20,
      render(data, record, index) {
        return index + 1
      },
    },
    {
      title: 'Mã hàng',
      dataIndex: 'sku',
      width: 150,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 150,
      render(data, record) {
        return record.title || data
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'available_stock_quantity',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 150,
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 150,
    // },
  ]
  const updateDelivery = async () => {
    try {
      const res = await UpdateDelivery(history.location.state.delivery_id, {
        status,
      })
      if (res.status === 200) {
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật sản phẩm thành công',
        })
        history.push('/shipping-product/9')
      }
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại!',
        description: 'Cập nhật thất bại',
      })
    }
  }
  return (
    <>
      <div className={styles['supplier_add']}>
        <div
          className={styles['supplier_add_back_parent']}
          style={{
            borderBottom: '1px solid rgb(233, 220, 220)',
            paddingBottom: '1rem',
          }}
        >
          <ArrowLeftOutlined
            style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }}
            onClick={() => history.push('/shipping-product')}
          />
          <div className={styles['supplier_add_back']}>
            Cập nhật phiếu chuyển hàng
          </div>
        </div>

        <Row
          style={{
            width: '100%',
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Thông tin phiếu chuyển hàng
        </Row>

        <Row
          gutter={[10, 10]}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            Nơi chuyển: {history.location.state.from.name}
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            Ghi chú:
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            Nơi nhận: {history.location.state.to.name}
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            Tag:
          </Col>
        </Row>
        <Row style={{ width: '100%', paddingLeft: 5, marginTop: 10 }}>
          <span style={{ marginRight: 20, fontSize: 16 }}>Trạng thái:</span>
          <Radio.Group
            onChange={(e) => setStatus(e.target.value)}
            defaultValue={history.location.state.status}
          >
            <Radio value="PROCESSING">Chờ chuyển</Radio>
            <Radio value="SHIPPING">Đang chuyển</Radio>
            {/* <Radio value="CANCEL">Đang hủy</Radio> */}
            <Radio value="CANCEL_FINISH">Đã Hủy</Radio>
            <Radio value="COMPLETE">Hoàn thành</Radio>
          </Radio.Group>
        </Row>
        <Row
          style={{
            width: '100%',
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Danh sách sản phẩm chuyển
        </Row>
        <Row style={{ width: '100%' }}>
          <Table
            size="small"
            style={{ width: '100%' }}
            columns={columns}
            dataSource={history.location.state.products}
          />
        </Row>
        <Row justify="end" style={{ width: '100%', marginTop: 20 }}>
          <Button size="large" type="primary" onClick={updateDelivery}>
            Lưu
          </Button>
        </Row>
      </div>
    </>
  )
}
