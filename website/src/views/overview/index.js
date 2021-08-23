import React, { useEffect, useState } from 'react'
import styles from './overview.module.scss'

import { LineChart } from 'react-chartkick'
import 'chartkick/chart.js'
//components antd
import { Select, DatePicker, Row, Col, Popover, Skeleton } from 'antd'

//icons antd
import { ShoppingCartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getStatis } from '../../apis/statis'

const { RangePicker } = DatePicker
function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
const Overview = () => {
  const [statis, setStatis] = useState({})
  const [loadingSkeleton, setLoadingSkeleton] = useState(false)

  const { Option } = Select

  const contentProfit = <div>Profit = Seller's Revenue - Total Base cost</div>
  const contentRevenue = (
    <div>Revenue = SUM OF [Sale price * Line Item Quantity]</div>
  )

  const contentOrder = (
    <div>Number of Orders in this app including line items in each</div>
  )
  const getAllStatis = async () => {
    try {
      setLoadingSkeleton(true)
      const res = await getStatis()
      if (res.status) {
        setStatis(res.data.data)
      }
      setLoadingSkeleton(false)
    } catch (e) {
      setLoadingSkeleton(false)
      console.log(e)
    }
  }
  useEffect(() => {
    getAllStatis()
  }, [])
  return (
    <>
      <div className={styles['dashboard_manager']}>
        <div className={styles['dashboard_manager_date']}>
          <Row className={styles['dashboard_manager_date_row']}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div style={{ width: '100%' }}>
                <Row gutter={20}>
                  <Col
                    className={styles['dashboard_manager_date_row_col']}
                    style={{ width: '100%' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={7}
                    xl={7}
                  >
                    <div style={{ width: '100%' }}>
                      <Select
                        style={{ width: '100%' }}
                        className={
                          styles['dashboard_manager_date_row_col_select']
                        }
                        defaultValue="default"
                      >
                        <Option value="default">Tất cả chi nhánh</Option>
                        <Option value="branch1">Chi nhánh 1</Option>
                        <Option value="branch2">Chi nhánh 2</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles['dashboard_manager_date_row_col']}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={7}
                    xl={7}
                  >
                    <div>
                      <RangePicker
                        className={
                          styles['dashboard_manager_date_row_col_select']
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        {loadingSkeleton ? (
          <Skeleton active paragraph={{ rows: 9 }} />
        ) : (
          <div className={styles['dashboard_manager_balance']}>
            <div className={styles['dashboard_manager_balance_title']}>
              <div>DOANH SỐ BÁN HÀNG</div>
            </div>
            <div className={styles['dashboard_manager_balance_parent']}>
              <Row className={styles['dashboard_manager_balance_parent_row']}>
                <Col
                  className={styles['dashboard_manager_balance_parent_row_col']}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <div
                    className={
                      styles['dashboard_manager_balance_parent_row_col_parent']
                    }
                  >
                    <div
                      className={
                        styles['dashboard_manager_balance_parent_row_col_top']
                      }
                    >
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_parent_bottom'
                          ]
                        }
                      >
                        <div>Hôm nay: </div>
                        <div
                          className={
                            styles[
                              'dashboard_manager_balance_parent_row_col_parent_bottom_today'
                            ]
                          }
                        >
                          {' '}
                          0 VNĐ
                        </div>
                      </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_title'
                          ]
                        }
                      >
                        <div
                          className={
                            styles[
                              'dashboard_manager_balance_parent_row_col_top_title_left'
                            ]
                          }
                        >
                          <div>
                            <ShoppingCartOutlined />
                          </div>
                          <div className={styles['order']}>Tổng đơn hàng</div>
                        </div>
                        <Popover content={contentOrder}>
                          <div
                            className={
                              styles[
                                'orders_manager_header_bottom_col_parent_child_icon'
                              ]
                            }
                          >
                            <InfoCircleOutlined />
                          </div>
                        </Popover>
                      </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_value'
                          ]
                        }
                      >
                        <div>{(statis && statis.order_amount) || 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col
                  className={styles['dashboard_manager_balance_parent_row_col']}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <div
                    className={
                      styles['dashboard_manager_balance_parent_row_col_parent']
                    }
                  >
                    <div
                      className={
                        styles[
                          'dashboard_manager_balance_parent_row_col_parent_bottom'
                        ]
                      }
                    >
                      <div>Hôm nay: </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_parent_bottom_today'
                          ]
                        }
                      >
                        {' '}
                        0 VNĐ
                      </div>
                    </div>
                    <div
                      className={
                        styles['dashboard_manager_balance_parent_row_col_top']
                      }
                    >
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_title'
                          ]
                        }
                      >
                        <div
                          className={
                            styles[
                              'dashboard_manager_balance_parent_row_col_top_title_left'
                            ]
                          }
                        >
                          <div>
                            <ShoppingCartOutlined />
                          </div>
                          <div className={styles['order']}>Tổng giá vốn</div>
                        </div>
                        <Popover content={contentRevenue}>
                          <div
                            className={
                              styles[
                                'orders_manager_header_bottom_col_parent_child_icon'
                              ]
                            }
                          >
                            <InfoCircleOutlined />
                          </div>
                        </Popover>
                      </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_value_balance'
                          ]
                        }
                      >
                        <div>
                          {statis && statis.total_base_cost
                            ? formatCash(statis.total_base_cost)
                            : 0}{' '}
                          VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col
                  className={styles['dashboard_manager_balance_parent_row_col']}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <div
                    className={
                      styles['dashboard_manager_balance_parent_row_col_parent']
                    }
                  >
                    <div
                      className={
                        styles[
                          'dashboard_manager_balance_parent_row_col_parent_bottom'
                        ]
                      }
                    >
                      <div>Hôm nay: </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_parent_bottom_today'
                          ]
                        }
                      >
                        {' '}
                        0 VNĐ
                      </div>
                    </div>

                    <div
                      className={
                        styles['dashboard_manager_balance_parent_row_col_top']
                      }
                    >
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_title'
                          ]
                        }
                      >
                        <div
                          className={
                            styles[
                              'dashboard_manager_balance_parent_row_col_top_title_left'
                            ]
                          }
                        >
                          <div>
                            <ShoppingCartOutlined />
                          </div>
                          <div className={styles['order']}>Tổng doanh thu</div>
                        </div>
                        <Popover content={contentRevenue}>
                          <div
                            className={
                              styles[
                                'orders_manager_header_bottom_col_parent_child_icon'
                              ]
                            }
                          >
                            <InfoCircleOutlined />
                          </div>
                        </Popover>
                      </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_value'
                          ]
                        }
                      >
                        <div>
                          {statis && statis.total_sale
                            ? formatCash(statis.total_sale)
                            : 0}{' '}
                          VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col
                  className={styles['dashboard_manager_balance_parent_row_col']}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <div
                    className={
                      styles['dashboard_manager_balance_parent_row_col_parent']
                    }
                  >
                    <div
                      className={
                        styles[
                          'dashboard_manager_balance_parent_row_col_parent_bottom'
                        ]
                      }
                    >
                      <div>Hôm nay: </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_parent_bottom_today'
                          ]
                        }
                      >
                        {' '}
                        0 VNĐ
                      </div>
                    </div>

                    <div
                      className={
                        styles['dashboard_manager_balance_parent_row_col_top']
                      }
                    >
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_title'
                          ]
                        }
                      >
                        <div
                          className={
                            styles[
                              'dashboard_manager_balance_parent_row_col_top_title_left'
                            ]
                          }
                        >
                          <div>
                            <ShoppingCartOutlined />
                          </div>
                          <div className={styles['profit']}>Tổng lợi nhuận</div>
                        </div>
                        <Popover content={contentProfit}>
                          <div
                            className={
                              styles[
                                'orders_manager_header_bottom_col_parent_child_icon'
                              ]
                            }
                          >
                            <InfoCircleOutlined />
                          </div>
                        </Popover>
                      </div>
                      <div
                        className={
                          styles[
                            'dashboard_manager_balance_parent_row_col_top_value_profit'
                          ]
                        }
                      >
                        <div>
                          {statis && statis.gross_profit
                            ? formatCash(statis.gross_profit)
                            : 0}{' '}
                          VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}

        <div className={styles['dashboard_manager_bottom']}>
          <Row wrap={false} justify="space-between" style={{ width: '100%' }}>
            {loadingSkeleton ? (
              <Skeleton active paragraph={{ rows: 9 }} />
            ) : (
              <Col
                className={styles['dashboard_manager_bottom_row_col']}
                xs={24}
                sm={24}
                md={24}
                lg={14}
                xl={14}
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
              </Col>
            )}
            {loadingSkeleton ? (
              <Skeleton
                active
                paragraph={{ rows: 9 }}
                style={{ marginBottom: 15 }}
              />
            ) : (
              <Col
                className={styles['dashboard_manager_bottom_row_col']}
                xs={24}
                sm={24}
                md={24}
                lg={9}
                xl={9}
              >
                <div
                  className={styles['dashboard_manager_bottom_row_col_parent']}
                >
                  <div
                    className={
                      styles['dashboard_manager_bottom_row_col_parent_top']
                    }
                  >
                    <div>Sản phẩm bán chạy</div>
                  </div>
                  <div style={{ width: '100%' }}>
                    {statis &&
                      statis.product_rank &&
                      statis.product_rank.slice(0, 5).map((e, index) => {
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
                                src={e[0].image && e[0].image[0]}
                                width="50px"
                              />
                            </Col>
                            <Col span={13}>
                              <Row>
                                {(e[0].name || e[0].title) &&
                                  (e[0].name || e[0].title)}
                              </Row>
                              <Row style={{ fontWeight: 500 }}>
                                Đã bán {e[1].quantity} sản phẩm
                              </Row>
                            </Col>
                            <Col span={6} style={{ fontSize: 15 }}>
                              {formatCash(e[1].cost)} &#8363;
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
    </>
  )
}
export default Overview
