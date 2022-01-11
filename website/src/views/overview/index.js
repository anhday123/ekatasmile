import React, { useEffect, useState } from 'react'
import styles from './overview.module.scss'
import { LineChart } from 'react-chartkick'
import { formatCash } from 'utils'
import { useSelector } from 'react-redux'

//antd
import { Row, Col, Skeleton } from 'antd'

//icons antd
import { ShoppingCartOutlined, InfoCircleOutlined } from '@ant-design/icons'

//apis
import { getStatistical } from 'apis/statis'

const Overview = () => {
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [statistical, setStatistical] = useState({})
  const [loadingSkeleton, setLoadingSkeleton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [orderQuantity, setOrderQuantity] = useState(0)
  const [totalBasePrice, setTotalBasePrice] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalSales, settTotalSales] = useState(0)

  const SALES = [
    {
      profitToday: '0 VND',
      name: 'Tổng đơn hàng',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng giá vốn',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng doanh thu',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng lợi nhuận',
    },
  ]

  const _getStatistical = async () => {
    try {
      setLoadingSkeleton(true)
      const res = await getStatistical({ branch_id: branchIdApp })
      if (res.status === 200) {
        setStatistical(res.data.data)
        setOrderQuantity(res.data.data.order_quantity)
        setTotalBasePrice(res.data.data.total_base_price)
        setTotalProfit(res.data.data.total_profit)
        settTotalSales(res.data.data.total_sales)
      }

      setLoadingSkeleton(false)
    } catch (e) {
      setLoadingSkeleton(false)
      console.log(e)
    }
  }

  useEffect(() => {
    _getStatistical()
  }, [branchIdApp])

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else setIsMobile(false)
  }, [])

  return (
    <div>
      {loadingSkeleton ? (
        <Skeleton active paragraph={{ rows: 9 }} />
      ) : (
        <div className="card">
          <div className={styles['dashboard_manager_balance_title']}>
            <div>DOANH SỐ BÁN HÀNG</div>
          </div>
          <Row justify="space-between" style={{ width: '100%' }}>
            {SALES.map((e, index) => (
              <div
                style={{
                  width: '50%',
                  padding: 10,
                  borderRight: (index === 0 || index === 2) && '1px solid gray',
                  borderBottom: (index === 0 || index === 1) && '1px solid gray',
                }}
              >
                <Row wrap={false}>
                  <p style={{ marginBottom: 0, fontSize: 17, marginRight: 7 }}>Hôm nay:</p>
                  <p style={{ marginBottom: 0, fontSize: 17, color: '#5B6BE8' }}>{e.profitToday}</p>
                </Row>
                <Row justify="space-between" wrap={false} style={{ fontWeight: 600, fontSize: 18 }}>
                  <div>
                    <ShoppingCartOutlined /> {e.name}
                  </div>
                  <InfoCircleOutlined />
                </Row>
                <span style={{ marginBottom: 0, fontWeight: 700, fontSize: 17, color: '#5B6BE8' }}>
                  {(e.name === 'Tổng đơn hàng' && formatCash(orderQuantity)) ||
                    (e.name === 'Tổng giá vốn' && formatCash(totalBasePrice)) ||
                    (e.name === 'Tổng doanh thu' && formatCash(totalSales)) ||
                    (e.name === 'Tổng lợi nhuận' && formatCash(totalProfit))}
                </span>
              </div>
            ))}
          </Row>
        </div>
      )}

      <Row>
        {loadingSkeleton ? (
          <Skeleton active paragraph={{ rows: 9 }} />
        ) : (
          <Col xs={24} sm={24} md={24} lg={14} xl={14}>
            <div style={{ marginRight: !isMobile && 7, marginTop: 0 }} className="card">
              <div className={styles['dashboard_manager_revenue_title']}>
                <div>Doanh thu</div>
              </div>
              <div>
                <LineChart data={statistical.chart || []} />
              </div>
            </div>
          </Col>
        )}

        {loadingSkeleton ? (
          <Skeleton active paragraph={{ rows: 9 }} style={{ marginBottom: 15 }} />
        ) : (
          <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ marginBottom: isMobile && 15 }}>
            <div style={{ marginLeft: !isMobile ? 7 : 0, marginTop: 0 }} className="card">
              <div className={styles['dashboard_manager_bottom_row_col_parent_top']}>
                <div>Sản phẩm bán chạy</div>
              </div>
              <div style={{ width: '100%' }}>
                {statistical &&
                  statistical.product_rank &&
                  statistical.product_rank.slice(0, 5).map((e, index) => {
                    return (
                      <Row
                        align="middle"
                        style={
                          index % 2
                            ? { marginBottom: 8, background: '#F7F8FA' }
                            : { marginBottom: 8 }
                        }
                      >
                        <Col span={5}>
                          <img alt="" src={e[0].image && e[0].image[0]} width="50px" />
                        </Col>
                        <Col span={12}>
                          <Row>{(e[0].name || e[0].title) && (e[0].name || e[0].title)}</Row>
                          <Row style={{ fontWeight: 500 }}>Đã bán {e[1].quantity} sản phẩm</Row>
                        </Col>
                        <Col span={7} style={{ fontSize: 15 }}>
                          <div style={{ width: 'max-content' }}>
                            {formatCash(e[1].cost)} &#8363;
                          </div>
                        </Col>
                      </Row>
                    )
                  })}
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  )
}
export default Overview
