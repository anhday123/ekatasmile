import UI from "./../../components/Layout/UI";
import styles from "./../orders/orders.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import React, { useState } from "react";
import moment from "moment";
import {
  Select,
  Button,
  Popover,
  Table,
  Input,
  Row,
  Col,
  DatePicker,
} from "antd";
import { } from "@ant-design/icons";
const { Option } = Select;
const columns = [
  {
    title: "Mã đơn hàng",
    dataIndex: "ordercode",
    width: 150,
  },
  {
    title: "Ngày tạo đơn",
    dataIndex: "date",
    width: 150,
  },
  {
    title: "Tên khách hàng",
    dataIndex: "namecustomer",
    width: 150,
  },
  {
    title: "Liên hệ",
    dataIndex: "phonenumber",
    width: 150,
  },
  {
    title: "Phải trả",
    dataIndex: "payment",
    width: 150,
  },
  {
    title: "Tên nhân viên tạo đơn",
    dataIndex: "nameemployee",
    width: 150,
  },
  {
    title: "Trạng thái đơn hàng",
    dataIndex: "status",
    width: 150,
  },
  {
    title: "Nhà vận chuyển",
    dataIndex: "supplier",
    width: 150,
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    width: 150,
  },
];
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    ordercode: `MHN ${i}`,
    date: "2021/04/28",
    namecustomer: `Nguyễn Văn A ${i}`,
    phonenumber: `038494349 ${i}`,
    payment: `50.000 VNĐ`,
    nameemployee: `Nguyễn Văn B ${i}`,
    status: `Đang giao ${i}`,
    supplier: "Giao hàng nhanh",
    note: `Rỗng`,
  });
}
export default function Orders() {
  const { Search } = Input;

  const onSearch = (value) => console.log(value);

  const dateFormat = "YYYY/MM/DD";
  function handleChangeStatus(value) {
    console.log(`selected ${value}`);
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["orders_manager"]}>
        <div className={styles["orders_manager_title"]}>Tổng quan đơn hàng</div>
        <div className={styles["orders_manager_search"]}>
          <Row className={styles["orders_manager_search_row"]}>
            <Col
              className={styles["orders_manager_search_row_col"]}
              xs={21}
              sm={18}
              md={18}
              lg={18}
              xl={18}
            >
              <Popover placement="bottomLeft" content={content} trigger="click">
                <div
                  className={styles["orders_manager_search_row_col_seach_parent"]}
                >
                  <Search
                    className={
                      styles["orders_manager_search_row_col_seach_child"]
                    }
                    placeholder="Tìm kiếm đơn hàng"
                    onSearch={onSearch}
                    enterButton
                  />
                </div></Popover>
            </Col>
            <Col
              className={styles["orders_manager_search_row_col"]}
              xs={21}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles["orders_manager_search_row_col_button"]}>
                <Link to="/actions/orders/add">
                  <Button type="primary">Tạo đơn hàng</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles["orders_manager_select"]}>
          <Row className={styles["orders_manager_select_row"]}>
            <Col
              // className={styles["orders_manager_search_row_col"]}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <div>
                <Row className={styles["orders_manager_search_row_col_child"]}>
                  <Col
                    className={styles["orders_manager_search_row_col_select"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={7}
                  >
                    <div>
                      <Select
                        defaultValue="status0"
                        style={{ width: 150 }}
                        onChange={handleChangeStatus}
                      >
                        <Option value="status0">Trạng thái</Option>
                        <Option value="status1">Chờ giao hàng</Option>
                        <Option value="status2">Đang giao hàng</Option>
                        <Option value="status3">Đã giao hàng</Option>
                        <Option value="status4">Hủy giao hàng</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles["orders_manager_search_row_col_select"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={7}
                  >
                    <div>
                      <DatePicker
                        defaultValue={moment("2015/01/01", dateFormat)}
                        style={{ width: 150 }}
                        onChange={onChangeDate}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              className={styles["orders_manager_search_row_col"]}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            ></Col>
          </Row>
        </div>
        <div className={styles["orders_manager_table"]}>
          <Table

            // rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            scroll={{ y: 500 }}
          />
        </div>
      </div>
    </UI>
  );
}
