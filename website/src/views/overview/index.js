import React, { useEffect, useState } from 'react'
import styles from './overview.module.scss'
import { LineChart } from 'react-chartkick'
import { formatCash } from 'utils'
import { useSelector } from 'react-redux'
import noData from 'assets/icons/no-data.png'

//antd
import { Row, Col, Skeleton } from 'antd'

//icons antd
import { ShoppingCartOutlined, InfoCircleOutlined } from '@ant-design/icons'

//apis
import { getStatisticalToday, getStatisticalChart, getStatisticalProduct } from 'apis/statis'
import moment from 'moment'
import { IMAGE_DEFAULT } from 'consts'

const Overview = () => {
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [statisticalProduct, setStatisticalProduct] = useState({})
  const [statisticalToday, setStatisticalToday] = useState({})
  const [statisticalChart, setStatisticalChart] = useState({})
  const [loadingSkeleton, setLoadingSkeleton] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
      const resToday = await getStatisticalToday({ branch_id: branchIdApp })

      if (resToday.status === 200) setStatisticalToday(resToday.data.data)

      const resChart = await getStatisticalChart({ branch_id: branchIdApp })
      if (resChart.status === 200) {
        let data = {}
        resChart.data.data.map((value) => (data[value.name] = value.data))
        setStatisticalChart(data)
      }

      const resProduct = await getStatisticalProduct({ branch_id: branchIdApp })
      console.log(resProduct)
      if (resProduct.status === 200) setStatisticalProduct(resProduct.data.data)

      setLoadingSkeleton(false)
    } catch (e) {
      setLoadingSkeleton(false)
      console.log(e)
    }
  }

  console.log(statisticalToday)

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
        <div className={styles['card-overview']}>
          <div className={styles['dashboard_manager_balance_title']}>
            <div>DOANH SỐ BÁN HÀNG HÔM NAY ({moment(new Date()).format('DD/MM/YYYY')})</div>
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
                <Row justify="space-between" wrap={false} style={{ fontWeight: 600, fontSize: 18 }}>
                  <div>
                    <ShoppingCartOutlined /> {e.name}
                  </div>
                  <InfoCircleOutlined />
                </Row>
                <span style={{ marginBottom: 0, fontWeight: 700, fontSize: 17, color: '#5B6BE8' }}>
                  {e.name === 'Tổng đơn hàng'
                    ? formatCash(statisticalToday?.sum_order)
                    : e.name === 'Tổng giá vốn'
                    ? formatCash(statisticalToday?.sum_origin_cost)
                    : e.name === 'Tổng doanh thu'
                    ? formatCash(statisticalToday?.sum_revenue)
                    : formatCash(statisticalToday?.sum_profit)}
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
            <div
              style={{ marginRight: !isMobile && 7, marginTop: 0, height: '95%', marginBottom: 15 }}
              className={styles['card-overview']}
            >
              <div className={styles['dashboard_manager_revenue_title']}>
                <div>Biểu đồ doanh thu tháng {new Date().getMonth() + 1}</div>
              </div>
              <div>
                <LineChart data={statisticalChart} />
              </div>
            </div>
          </Col>
        )}

        {loadingSkeleton ? (
          <Skeleton active paragraph={{ rows: 9 }} style={{ marginBottom: 15 }} />
        ) : (
          <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ marginBottom: isMobile && 15 }}>
            <div
              style={{
                marginLeft: !isMobile ? 7 : 0,
                marginTop: 0,
                height: '95%',
                marginBottom: 15,
              }}
              className={styles['card-overview']}
            >
              <div className={styles['dashboard_manager_bottom_row_col_parent_top']}>
                <div>Top 10 sản phẩm bán chạy</div>
              </div>
              <div style={{ width: '100%', margin: 'auto' }}>
                {statisticalProduct.length ? (
                  statisticalProduct.map((e, index) => {
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
                          <img
                            alt=""
                            src={e.image && e.image.length ? e.image : IMAGE_DEFAULT}
                            width="50px"
                          />
                        </Col>
                        <Col span={12}>
                          <Row>{e.name || e.title}</Row>
                          <Row style={{ fontWeight: 500 }}>Đã bán {e.sale_quantity} sản phẩm</Row>
                        </Col>
                      </Row>
                    )
                  })
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <img src={noData} alt="" style={{ width: 90, height: 90 }} />
                    <h4 style={{ fontSize: 15, color: '#555' }}>Chưa có sản phẩm bán chạy</h4>
                  </div>
                )}
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  )
}
export default Overview
