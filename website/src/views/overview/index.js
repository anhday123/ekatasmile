import React, { useEffect, useState } from 'react'
import styles from './overview.module.scss'
import { LineChart } from 'react-chartkick'
import { formatCash } from 'utils'

import ModalIntro from 'components/introduction'

//antd
import { Row, Col, Popover, Skeleton, Space } from 'antd'

//icons antd
import { ShoppingCartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getStatistical } from 'apis/statis'
import axios from 'axios'

const Overview = () => {
  const [statistical, setStatistical] = useState({})
  const [loadingSkeleton, setLoadingSkeleton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const contentProfit = <div>Profit = Seller's Revenue - Total Base cost</div>
  const contentRevenue = <div>Revenue = SUM OF [Sale price * Line Item Quantity]</div>

  const contentOrder = <div>Number of Orders in this app including line items in each</div>

  const SALES = [
    {
      profitToday: '0 VND',
      name: 'Tổng đơn hàng',
      sumProfit: '0 VND',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng giá vốn',
      sumProfit: '0 VND',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng doanh thu',
      sumProfit: '0 VND',
    },
    {
      profitToday: '0 VND',
      name: 'Tổng lợi nhuận',
      sumProfit: '0 VND',
    },
  ]

  const _getStatistical = async () => {
    try {
      setLoadingSkeleton(true)
      const res = await getStatistical()
      console.log(res)
      if (res.status === 200) setStatistical(res.data.data)

      setLoadingSkeleton(false)
    } catch (e) {
      setLoadingSkeleton(false)
      console.log(e)
    }
  }
  useEffect(() => {
    _getStatistical()
  }, [])

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else setIsMobile(false)
  }, [])

  return (
    <div className={styles['dashboard_manager']}>
      <ModalIntro />
      {loadingSkeleton ? (
        <Skeleton active paragraph={{ rows: 9 }} />
      ) : (
        <div className={`${styles['dashboard_manager_balance']} ${styles['card']}`}>
          <div className={styles['dashboard_manager_balance_title']}>
            <div>DOANH SỐ BÁN HÀNG</div>
          </div>
          <Row justify="space-between" style={{ width: '100%' }}>
            {SALES.map((e, index) => (
              <div
                style={{
                  width: '50%',
                  padding: 15,
                  borderRight: (index === 0 || index === 2) && '1px solid gray',
                  borderBottom: (index === 0 || index === 1) && '1px solid gray',
                }}
              >
                <Row wrap={false}>
                  <p style={{ marginBottom: 0, fontSize: 17, marginRight: 7 }}>Hôm nay:</p>
                  <p style={{ marginBottom: 0, fontSize: 17, color: '#5B6BE8' }}>{e.profitToday}</p>
                </Row>
                <Row
                  justify="space-between"
                  wrap={false}
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  <div>
                    <ShoppingCartOutlined /> {e.name}
                  </div>
                  <InfoCircleOutlined />
                </Row>
                <span
                  style={{
                    marginBottom: 0,
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#5B6BE8',
                  }}
                >
                  {e.sumProfit}
                </span>
              </div>
            ))}
          </Row>
        </div>
      )}

      <div className={styles['dashboard_manager_bottom']}>
        <Row style={{ width: '100%' }}>
          {loadingSkeleton ? (
            <Skeleton active paragraph={{ rows: 9 }} />
          ) : (
            <Col xs={24} sm={24} md={24} lg={14} xl={14}>
              <div
                style={{
                  marginRight: !isMobile && 7,
                  padding: '1rem',
                  backgroundColor: 'white',
                  height: '100%',
                }}
                className={styles['card']}
              >
                <div className={styles['dashboard_manager_revenue_title']}>
                  <div>Doanh thu</div>
                </div>
                <LineChart
                  data={[
                    {
                      name: 'Đơn hàng hôm nay',
                      data: {
                        '00:00': 3,
                        '01:00': 7,
                        '02:00': 5,
                        '03:00': 1,
                        '04:00': 9,
                        '05:00': 15,
                      },
                    },
                    {
                      name: 'Đơn hàng hôm qua',
                      data: {
                        '00:00': 10,
                        '01:00': 1,
                        '02:00': 5,
                        '03:00': 7,
                        '04:00': 12,
                        '05:00': 2,
                      },
                    },
                  ]}
                />
              </div>
            </Col>
          )}
          {loadingSkeleton ? (
            <Skeleton active paragraph={{ rows: 9 }} style={{ marginBottom: 15 }} />
          ) : (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={10}
              xl={10}
              style={{
                marginBottom: isMobile && 15,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  height: '100%',
                  marginLeft: !isMobile ? 7 : 0,
                  marginTop: isMobile && 15,
                  padding: '1rem',
                }}
                className={styles['card']}
              >
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
    </div>
  )
}
export default Overview
