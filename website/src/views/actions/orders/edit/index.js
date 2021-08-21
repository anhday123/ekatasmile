import styles from "./../edit/edit.module.scss";
import React, { useState } from "react";
// import Link from "next/link";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {
  Select,
  DatePicker,
  Row,
  Col,
  Input,
  Popover,

} from "antd";
import moment from "moment";
import {

  ArrowLeftOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const provinceData = ["Zhejiang", "Jiangsu"];
const cityData = {
  Zhejiang: [
    "Nhà vận chuyển",
    "Giao hàng tiết kiệm",
    "Giao hàng nhanh",
    "Boxme",
    "VNPost",
    "DHL",
    "Viettel Post",
    "Khác",
  ],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};
const provinceDataProvince = ["Zhejiang", "Jiangsu"];
const cityDataProvince = {
  Zhejiang: [
    "Chọn quận huyện",
    "Giao hàng tiết kiệm",
    "Giao hàng nhanh",
    "Boxme",
    "VNPost",
    "DHL",
    "Viettel Post",
    "Khác",
  ],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};
const provinceDataDistrict = ["Zhejiang", "Jiangsu"];
const cityDataDistrict = {
  Zhejiang: [
    "Chọn tỉnh thành",
    "Giao hàng tiết kiệm",
    "Giao hàng nhanh",
    "Boxme",
    "VNPost",
    "DHL",
    "Viettel Post",
    "Khác",
  ],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};
export default function OrdersEdit() {
  const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = React.useState(
    cityData[provinceData[0]][0]
  );

  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };
  const [citiesProvince, setCitiesProvince] = React.useState(
    cityDataProvince[provinceDataProvince[0]]
  );
  const [secondCityProvince, setSecondCityProvince] = React.useState(
    cityDataProvince[provinceDataProvince[0]][0]
  );

  const onSecondCityChangeProvince = (value) => {
    setSecondCityProvince(value);
  };

  const [citiesDistrict, setCitiesDistrict] = React.useState(
    cityDataDistrict[provinceDataDistrict[0]]
  );
  const [secondCityDistrict, setSecondCityDistrict] = React.useState(
    cityDataDistrict[provinceDataDistrict[0]][0]
  );
  const [temp, setTemp] = useState(0);
  const onClick = (data) => {
    setTemp(data);
  };


  const onSecondCityChangeDistrict = (value) => {
    setSecondCityDistrict(value);
  };


  const dateFormat = "YYYY/MM/DD";
  const content = (
    <div>
      <p>Gợi ý sản phẩm 1</p>
      <p>Gợi ý sản phẩm 2</p>
    </div>
  );
  return (
    <>
      <div className={styles["orders_edit"]}>
          <div className={styles["orders_edit_title"]}>
            <div>
              <ArrowLeftOutlined />
            </div>
            <div>Sửa đơn hàng</div>
          </div>
        <div className={styles["orders_edit_bottom"]}>
          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Nhập mã đơn hàng
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Input defaultValue="mã đơn hàng 1" />
              </div>
            </Col>
          </Row>
          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Sản phẩm
                </div>
              </div>
            </Col>
            <Col xs={23} sm={20} md={20} lg={20} xl={20}>
              <div>
                <Row
                  className={styles["orders_edit_bottom_row_col_product_name"]}
                >
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={21}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    {" "}
                    <Popover content={content}>
                      <div>
                        <Input defaultValue="hủ tiếu" />
                      </div>
                    </Popover>
                  </Col>
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={21}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    {" "}
                    <div>
                      <Input defaultValue="12" />
                    </div>{" "}
                  </Col>
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={21}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                  >
                    {" "}
                    <div>
                      <Input defaultValue="30.000 VNĐ" />
                    </div>{" "}
                  </Col>
                </Row>
                {temp === 1 ? (
                  <Row
                    className={
                      styles["orders_edit_bottom_row_col_product_name"]
                    }
                  >
                    <Col
                      className={styles["orders_edit_bottom_row_col"]}
                      xs={21}
                      sm={1}
                      md={1}
                      lg={1}
                      xl={1}
                    >
                      <div onClick={() => onClick(1)}>
                        <AddCircleOutlineIcon />
                      </div>
                    </Col>
                    <Col
                      className={styles["orders_edit_bottom_row_col"]}
                      xs={21}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                    >
                      <div>
                        <Input defaultValue="hủ tiếu" />
                      </div>
                    </Col>
                    <Col
                      className={styles["orders_edit_bottom_row_col"]}
                      xs={21}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                    >
                      {" "}
                      <div>
                        <Input defaultValue="12" />
                      </div>{" "}
                    </Col>
                    <Col
                      className={styles["orders_edit_bottom_row_col"]}
                      xs={21}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                    >
                      {" "}
                      <div>
                        <Input defaultValue="30.000 VNĐ" />
                      </div>{" "}
                    </Col>
                  </Row>
                ) : (
                  <Row
                    className={
                      styles["orders_edit_bottom_row_col_product_name"]
                    }
                  >
                    <Col
                      className={styles["orders_edit_bottom_row_col"]}
                      xs={21}
                      sm={3}
                      md={3}
                      lg={3}
                      xl={3}
                    >
                      <div onClick={() => onClick(1)}>
                        <AddCircleOutlineIcon
                          className={styles["orders_edit_bottom_row_col_icon"]}
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Ngày đặt
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <DatePicker
                  defaultValue={moment("2015/01/01", dateFormat)}
                  format={dateFormat}
                />
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Khách hàng
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Input defaultValue="nguyễn văn tỷ" />
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row_top"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Địa chỉ
                </div>
              </div>
            </Col>
            <Col xs={23} sm={20} md={20} lg={20} xl={20}>
              <div>
                <Row className={styles["orders_edit_bottom_row_col_row_child"]}>
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div>
                      <Select
                        className={styles["district"]}
                        value={secondCityProvince}
                        onChange={onSecondCityChangeProvince}
                      >
                        {citiesProvince.map((city) => (
                          <Option key={city}>{city}</Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div>
                      <Select
                        className={styles["district"]}
                        value={secondCityDistrict}
                        onChange={onSecondCityChangeDistrict}
                      >
                        {citiesDistrict.map((city) => (
                          <Option key={city}>{city}</Option>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles["orders_edit_bottom_row_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div>
                      <Input defaultValue="27/27" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  COD
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Input defaultValue="5.000 VNĐ" />
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Tổng tiền
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Input defaultValue="10.000.000 VNĐ" />
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Nhà vận chuyển
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Select
                  className={styles["district"]}
                  value={secondCity}
                  onChange={onSecondCityChange}
                >
                  {cities.map((city) => (
                    <Option key={city}>{city}</Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          <Row className={styles["orders_edit_bottom_row"]}>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div>
                <div className={styles["orders_edit_bottom_row_col_name"]}>
                  Mã giao hàng
                </div>
              </div>
            </Col>
            <Col
              className={styles["orders_edit_bottom_row_col"]}
              xs={23}
              sm={20}
              md={20}
              lg={20}
              xl={20}
            >
              <div>
                <Input defaultValue="mã giao hàng 1" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
