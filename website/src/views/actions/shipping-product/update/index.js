import styles from './../update/update.module.scss'
import { Button, Table, Row, Col, Radio, notification } from 'antd'
import { useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { UpdateDelivery } from '../../../../apis/delivery'
import { ROUTES } from 'consts'
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
      sorter: (a, b) => {
        return a.sku > b.sku ? 1 : a.sku === b.sku ? 0 : -1
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 150,
      render(data, record) {
        return record.title || data
      },
      sorter: (a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'available_stock_quantity',
      width: 150,
      sorter: (a, b) => a.available_stock_quantity - b.available_stock_quantity,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 150,
      sorter: (a, b) => a.quantity - b.quantity,
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
        history.push(ROUTES.SHIPPING_PRODUCT)
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
            defaultValue={history.location.state.status.toUpperCase()}
          >
            <Radio value="PROCESSING">Chờ chuyển</Radio>
            <Radio value="SHIPPING">Đang chuyển</Radio>
            {/* <Radio value="CANCEL">Đang hủy</Radio> */}
            <Radio value="CANCEL">Đã Hủy</Radio>
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
          <Button
            size="large"
            type="primary"
            onClick={updateDelivery}
            style={{ width: 120 }}
          >
            Lưu
          </Button>
        </Row>
      </div>
    </>
  )
}
