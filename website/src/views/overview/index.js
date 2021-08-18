import React, { useState } from "react";
import LayoutMain from './../../components/Layout/UI'
import styles from "./overview.module.scss";
import ChartBar from "react-google-charts";
import Chart from './../../components/chart-page/ChartPage'
// import { ACTION, PERMISSIONS } from "consts";
import { BarChart, LineChart } from "react-chartkick";
import "chartkick/chart.js";
//components antd
import { Select, DatePicker, Row, Col, Popover, Divider, Button, Input } from "antd";

//icons antd
import {
  ShoppingCartOutlined,
  InfoCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const Overview = () => {
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const { Option } = Select;
  // const searchSitesData = async (value) => {
  //   try {
  //     dispatch({ type: ACTION.LOADING, data: true });
  //     console.log(value);
  //     const res = await searchSites({sites : value});
  //     console.log(res);
  //     // if (res.status === 200) setStatus(res.data.status);
  //     dispatch({ type: ACTION.LOADING, data: false });
  //   } catch (error) {
  //     console.log(error);
  //     dispatch({ type: ACTION.LOADING, data: false });
  //   }
  // };
  function handleChange(value) {
    console.log(`selected ${value}`);
    // searchSitesData(value);
  }

  function onChangeDateFA(date, dateString) {
    console.log(date, dateString);
  }
  const contentTotalCustomTransaction = (
    <div>
      Total custom transaction
    </div>
  );
  const contentProfit = (
    <div>
      Profit = Seller's Revenue - Total Base cost
    </div>
  );
  const contentRevenue = (
    <div>
      Revenue = SUM OF [Sale price * Line Item Quantity]
    </div>
  );
  const contentTotalBaseCost = (
    <div>
      Total Base cost =SUM OF [(Base cost - Discount + Extra Shipping Fee) * Line Item Quantity]
    </div>
  );
  const contentBalance = (
    <div>
      The money amount that is available for charging orders
    </div>
  );
  const contentOrder = (
    <div>
      Number of Orders in this app including line items in each
    </div>
  );
  return (
    <LayoutMain>
      <div className={styles["dashboard_manager"]}>
        <div className={styles["dashboard_manager_date"]}>
          <Row className={styles["dashboard_manager_date_row"]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div style={{ width: '100%' }}>
                <Row gutter={20}>

                  <Col
                    className={styles["dashboard_manager_date_row_col"]}
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
                          styles["dashboard_manager_date_row_col_select"]
                        }
                        defaultValue="default"
                        onChange={handleChange}
                      >
                        <Option value="default">Tất cả chi nhánh</Option>
                        <Option value="branch1">
                          Chi nhánh 1
                        </Option>
                        <Option value="branch2">
                          Chi nhánh 2
                        </Option>
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles["dashboard_manager_date_row_col"]}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={7}
                    xl={7}
                  >
                    <div>
                      <RangePicker
                        className={
                          styles["dashboard_manager_date_row_col_select"]
                        }
                        onChange={onChange}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles["dashboard_manager_balance"]}>
          <div className={styles["dashboard_manager_balance_title"]}>
            {/* <div>
              <WalletOutlined />
            </div> */}
            <div>DOANH SỐ BÁN HÀNG</div>
          </div>
          <div className={styles["dashboard_manager_balance_parent"]}>
            <Row className={styles["dashboard_manager_balance_parent_row"]}>
              <Col
                className={styles["dashboard_manager_balance_parent_row_col"]}
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <div
                  className={
                    styles["dashboard_manager_balance_parent_row_col_parent"]
                  }
                >
                  <div
                    className={
                      styles["dashboard_manager_balance_parent_row_col_top"]
                    }
                  >
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_parent_bottom"
                        ]
                      }
                    >
                      <div>Hôm nay: </div>
                      <div
                        className={
                          styles[
                          "dashboard_manager_balance_parent_row_col_parent_bottom_today"
                          ]
                        }
                      >
                        {" "}
                        0 VNĐ
                      </div>
                    </div>
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_top_title"
                        ]
                      }
                    >
                      <div
                        className={
                          styles[
                          "dashboard_manager_balance_parent_row_col_top_title_left"
                          ]
                        }
                      >
                        <div>
                          <ShoppingCartOutlined />
                        </div>
                        <div className={styles['order']}>Tổng đơn hàng</div>
                      </div>
                      <Popover content={contentOrder} >
                        <div
                          className={
                            styles[
                            "orders_manager_header_bottom_col_parent_child_icon"
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
                        "dashboard_manager_balance_parent_row_col_top_value"
                        ]
                      }
                    >
                      <div>0 VNĐ</div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col
                className={styles["dashboard_manager_balance_parent_row_col"]}
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <div
                  className={
                    styles["dashboard_manager_balance_parent_row_col_parent"]
                  }
                >
                  <div
                    className={
                      styles[
                      "dashboard_manager_balance_parent_row_col_parent_bottom"
                      ]
                    }
                  >
                    <div>Hôm nay: </div>
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_parent_bottom_today"
                        ]
                      }
                    >
                      {" "}
                      0 VNĐ
                    </div>
                  </div>
                  <div
                    className={
                      styles["dashboard_manager_balance_parent_row_col_top"]
                    }
                  >
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_top_title"
                        ]
                      }
                    >
                      <div
                        className={
                          styles[
                          "dashboard_manager_balance_parent_row_col_top_title_left"
                          ]
                        }
                      >
                        <div>
                          <ShoppingCartOutlined />
                        </div>
                        <div className={styles['order']}>Tổng giá vốn</div>
                      </div>
                      <Popover content={contentRevenue} >
                        <div
                          className={
                            styles[
                            "orders_manager_header_bottom_col_parent_child_icon"
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
                        "dashboard_manager_balance_parent_row_col_top_value_balance"
                        ]
                      }
                    >
                      <div>0 VNĐ</div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col
                className={styles["dashboard_manager_balance_parent_row_col"]}
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <div
                  className={
                    styles["dashboard_manager_balance_parent_row_col_parent"]
                  }
                >

                  <div
                    className={
                      styles[
                      "dashboard_manager_balance_parent_row_col_parent_bottom"
                      ]
                    }
                  >
                    <div>Hôm nay: </div>
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_parent_bottom_today"
                        ]
                      }
                    >
                      {" "}
                      0 VNĐ
                    </div>
                  </div>

                  <div
                    className={
                      styles["dashboard_manager_balance_parent_row_col_top"]
                    }
                  >
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_top_title"
                        ]
                      }
                    >
                      <div
                        className={
                          styles[
                          "dashboard_manager_balance_parent_row_col_top_title_left"
                          ]
                        }
                      >
                        <div>
                          <ShoppingCartOutlined />
                        </div>
                        <div className={styles['order']}>Tổng doanh thu</div>
                      </div>
                      <Popover content={contentRevenue} >
                        <div
                          className={
                            styles[
                            "orders_manager_header_bottom_col_parent_child_icon"
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
                        "dashboard_manager_balance_parent_row_col_top_value"
                        ]
                      }
                    >

                      <div>0 VNĐ</div>
                    </div>
                  </div>

                </div>
              </Col>

              <Col
                className={styles["dashboard_manager_balance_parent_row_col"]}
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <div
                  className={
                    styles["dashboard_manager_balance_parent_row_col_parent"]
                  }
                >

                  <div
                    className={
                      styles[
                      "dashboard_manager_balance_parent_row_col_parent_bottom"
                      ]
                    }
                  >
                    <div>Hôm nay: </div>
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_parent_bottom_today"
                        ]
                      }
                    >
                      {" "}
                      0 VNĐ
                    </div>
                  </div>

                  <div
                    className={
                      styles["dashboard_manager_balance_parent_row_col_top"]
                    }
                  >
                    <div
                      className={
                        styles[
                        "dashboard_manager_balance_parent_row_col_top_title"
                        ]
                      }
                    >
                      <div
                        className={
                          styles[
                          "dashboard_manager_balance_parent_row_col_top_title_left"
                          ]
                        }
                      >
                        <div>
                          <ShoppingCartOutlined />
                        </div>
                        <div className={styles['profit']}>Tổng lợi nhuận</div>
                      </div>
                      <Popover content={contentProfit} >
                        <div
                          className={
                            styles[
                            "orders_manager_header_bottom_col_parent_child_icon"
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
                        "dashboard_manager_balance_parent_row_col_top_value_profit"
                        ]
                      }
                    >
                      <div>0 VNĐ</div>
                    </div>
                  </div>

                </div>
              </Col>

            </Row>
          </div>
        </div>

        <div className={styles["dashboard_manager_bottom"]}>
          <Row className={styles["dashboard_manager_bottom_row"]}>
            <Col
              className={styles["dashboard_manager_bottom_row_col"]}
              xs={24}
              sm={24}
              md={24}
              lg={14}
              xl={14}
            >
              <div className={styles["dashboard_manager_revenue_title"]}>
                <div>Doanh thu</div>
              </div>
              <LineChart data={[
                { "name": "Đơn hàng hôm nay", "data": { "00:00": 3, "01:00": 7, "02:00": 5, "03:00": 1, "04:00": 9, "05:00": 15 } },
                { "name": "Đơn hàng hôm qua", "data": { "00:00": 10, "01:00": 1, "02:00": 5, "03:00": 7, "04:00": 12, "05:00": 2 } }
              ]} />
            </Col>
            <Col

              className={styles["dashboard_manager_bottom_row_col"]}
              xs={24}
              sm={24}
              md={24}
              lg={9}
              xl={9}
            >
              <div className={styles["dashboard_manager_bottom_row_col_parent"]}>
                <div
                  className={
                    styles["dashboard_manager_bottom_row_col_parent_top"]
                  }
                >
                  <div>Sản phẩm bán chạy</div>
                  {/* <div>
                    <InfoCircleOutlined />
                  </div> */}
                </div>
                <div style={{ width: '100%' }}>
                  {[...Array(5).keys()].map((e, index) => {
                    return <Row align="middle" style={index % 2 ? { marginBottom: 8, background: "#F7F8FA" } : { marginBottom: 8 }}>
                      <Col span={5}>
                        <img src='https://storage.googleapis.com/viesoftware0710/1628583247537_viesoftware0710.jpg' width="50px" />
                      </Col>
                      <Col span={13}>
                        <Row>Áo thun DoDo</Row>
                        <Row style={{ fontWeight: 500 }}>Đã bán 156 sản phẩm</Row>
                      </Col>
                      <Col span={6} style={{ fontSize: 15 }}>5.852.000 &#8363;</Col>
                    </Row>
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>


      </div>
    </LayoutMain>
  );
};
export default Overview;