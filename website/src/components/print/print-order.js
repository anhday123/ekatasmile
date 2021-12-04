import React from 'react'

//antd
import { Row, Divider } from 'antd'
import moment from 'moment'
import { formatCash } from 'utils'

export default class PrintOrder extends React.PureComponent {
  render() {
    const data = this.props.data || {}

    return (
      <div style={{ paddingTop: 55, paddingLeft: 35, paddingRight: 35 }}>
        <Row>
          <div style={{ width: '50%' }}>{moment(new Date()).format('DD/MM/YYYY HH:mm')}</div>
          <div style={{ width: '50%' }}>Hóa đơn bán hàng [SON00032]</div>
        </Row>
        <Divider dashed />
        <div>
          <Row justify="center">
            <h3 style={{ fontWeight: 700 }}>HÓA ĐƠN BÁN HÀNG</h3>
          </Row>
          <Row justify="space-between">
            <p style={{ marginBottom: 0 }}>Số: SON00032</p>
            <p style={{ marginBottom: 0 }}>Ngày: {moment(new Date()).format('DD-MM-YYYY')}</p>
          </Row>
        </div>
        <Divider />
        <div>
          <Row wrap={false} align="middle">
            <p style={{ marginBottom: 0 }}>Khách hàng: </p>
            <p style={{ fontWeight: 700, marginBottom: 0, marginLeft: 4 }}>
              {data.customer &&
                `${data.customer.first_name || ''} ${data.customer.last_name || ''}`}
            </p>
          </Row>
          <Row wrap={false} align="middle">
            <p style={{ marginBottom: 0 }}>Điện thoại: </p>
            <p style={{ fontWeight: 700, marginBottom: 0, marginLeft: 4 }}>
              {data.customer && (data.customer.phone || '')}
            </p>
          </Row>
          <Row wrap={false} align="middle">
            <p style={{ marginBottom: 0 }}>Địa chỉ giao hàng: </p>
            <p style={{ fontWeight: 700, marginBottom: 0, marginLeft: 4 }}>
              {data.deliveryAddress &&
                `${data.deliveryAddress.address || ''}, ${data.deliveryAddress.district || ''}, ${
                  data.deliveryAddress.province || ''
                }`}
            </p>
          </Row>
        </div>
        <Divider dashed />
        <Row justify="space-between" wrap={false} style={{ borderBottom: '1px solid gray' }}>
          <div style={{ width: '33.333333%', fontWeight: 600 }}>Số lượng</div>
          <div style={{ width: '33.333333%', fontWeight: 600, textAlign: 'center' }}>Đơn giá</div>
          <div style={{ width: '33.333333%', fontWeight: 600, textAlign: 'end' }}>Thành tiền</div>
        </Row>
        <div style={{ marginBottom: 20 }}>
          {data.order_details &&
            data.order_details.map((product) => (
              <div style={{ paddingBottom: 7, marginTop: 6, borderBottom: '1px dashed gray' }}>
                <div>{product.title}</div>
                <Row justify="space-between" wrap={false} align="middle">
                  <div style={{ width: '33.333333%' }}>
                    <div>{product.quantity}</div>
                  </div>
                  <div style={{ width: '33.333333%', textAlign: 'center' }}>
                    {formatCash(product.price || 0)}
                  </div>
                  <div style={{ width: '33.333333%', textAlign: 'end' }}>
                    {formatCash(product.sumCost || 0)}
                  </div>
                </Row>
              </div>
            ))}
        </div>
        <div>
          <Row justify="space-between">
            <div>Cộng tiền hàng</div>
            <div>{formatCash(data.sumCostPaid || 0)}</div>
          </Row>
          <Row justify="space-between">
            <div>Chiết khấu</div>
            <div>
              {formatCash(data.discount ? data.discount.value : 0)}{' '}
              {data.discount ? (data.discount.type === 'VALUE' ? '' : '%') : ''}
            </div>
          </Row>
          <Row justify="space-between" style={{ fontWeight: 600 }}>
            <div>Khách phải trả</div>
            <div>{formatCash(data.moneyToBePaidByCustomer || 0)}</div>
          </Row>
          <Row justify="space-between">
            <div>{data.isDelivery ? 'Tiền khách thanh toán trước' : 'Tiền khách đưa'}</div>
            <div>{formatCash(data.isDelivery ? data.prepay : data.moneyGivenByCustomer)}</div>
          </Row>
          <Row justify="space-between" style={{ display: data.isDelivery && 'none' }}>
            <div>Tiền thừa</div>
            <div>{formatCash(data.excessCash || 0)}</div>
          </Row>
        </div>
        <Row justify="center" style={{ marginTop: 20 }}>
          <i>Cảm ơn quý khách. Hện gặp lại!</i>
        </Row>
      </div>
    )
  }
}
