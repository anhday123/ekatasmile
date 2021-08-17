import UI from "../../../../components/Layout/UI";
import React, { useState } from "react";
import styles from "./../delete/delete.module.scss";
import {
  Select,
  DatePicker,
  Space,
  Row,
  Col,
  Input,
  Checkbox,
  Popover,
  Button,
  Table,
} from "antd";
import {
  AudioOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import moment from "moment";
const { Option } = Select;
const provinceData = ["Zhejiang", "Jiangsu"];
const cityData = {
  Zhejiang: ["Chọn cửa hàng", "Cửa hàng A", "Cửa hàng B", "Cửa hàng C"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};
const provinceDataShjft = ["Zhejiang", "Jiangsu"];
const cityDataShjft = {
  Zhejiang: [
    "Tất cả",
    "Ca làm hôm nay",
    "Ca làm ngày mai",
    "Ca làm hôm qua",
    "Hiệu suất",
  ],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
// const content = (
//   <div className={styles["work_date"]}>
//     <div className={styles["work_date_item"]}>
//       <div className={styles["work_date_item_title"]}>Tên</div>
//       <div>Nguyễn Văn A</div>
//     </div>
//     <div className={styles["work_date_item"]}>
//       <div className={styles["work_date_item_title"]}>Chức vụ</div>
//       <div>Trưởng phòng nhân sự</div>
//     </div>
//     <div className={styles["work_date_item"]}>
//       <div className={styles["work_date_item_title"]}>Tổng giờ làm</div>
//       <div>
//         624 giờ{" "}
//         <span className={styles["work_date_item_title_span"]}>( 78 ca )</span>
//       </div>
//     </div>
//     <div className={styles["work_date_item"]}>
//       <div className={styles["work_date_item_title"]}>Ngày vào làm</div>
//       <div>20/01/2021</div>
//     </div>
//   </div>
// );
const effective = (
  <div className={styles["work_date"]}>
    <div className={styles["work_date_item"]}>
      <div className={styles["work_date_item_title"]}>Tên</div>
      <div>Nguyễn Văn A</div>
    </div>
    <div className={styles["work_date_item"]}>
      <div className={styles["work_date_item_title"]}>Chức vụ</div>
      <div>Trưởng phòng nhân sự</div>
    </div>
    <div className={styles["work_date_item"]}>
      <div className={styles["work_date_item_title"]}>Tổng số ca</div>
      <div>78 ca</div>
    </div>
    <div className={styles["work_date_item"]}>
      <div className={styles["work_date_item_title"]}>Tổng số ca thực</div>
      <div>78 ca</div>
    </div>
    <div className={styles["work_date_item"]}>
      <div className={styles["work_date_item_title"]}>Số giờ đi trễ</div>
      <div>1 giờ</div>
    </div>
  </div>
);
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    stt: i,
    name: `name + ${i}`,
    option: `option + ${i}`,
    // workdate:  <Popover content={content}>workdate</Popover>,
    contact: `contact + ${i}`,
    effective: <Popover content={effective}>Hiệu suất</Popover>,
    status:
      i % 2 === 0 ? (
        <Button key="111" type="primary">
          {" "}
          {`Hoạt động + ${i}`}
        </Button>
      ) : (
        <Button key={i} type="primary" danger>
          {" "}
          {`Không hoạt động + ${i}`}
        </Button>
      ),
    edit: <Checkbox onChange={onChange}></Checkbox>,
  });
}
export default function EmployeeDelete() {
  const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [secondCity, setSecondCity] = React.useState(
    cityData[provinceData[0]][0]
  );
  const [citiesShjft, setCitiesShjft] = React.useState(
    cityDataShjft[provinceDataShjft[0]]
  );
  const [secondCityShjft, setSecondCityShjft] = React.useState(
    cityDataShjft[provinceDataShjft[0]][0]
  );
  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };
  const onSecondCityChangeShjft = (value) => {
    setSecondCityShjft(value);
  };
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";
  const monthFormat = "YYYY/MM";

  const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];
  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );

  const onSearch = (value) => console.log(value);
  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Chức vụ",
      dataIndex: "option",
    },
    // {
    //   title: "Số ngày trong công việc",
    //   dataIndex: "workdate",
    // },
    {
      title: "Liên hệ",
      dataIndex: "contact",
    },
    {
      title: "Hiệu suất",
      dataIndex: "effective",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Cài đặt",
      dataIndex: "edit",
    },
  ];
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["employee_manager"]}>
        <div className={styles["employee_manager_top"]}>
          <div className={styles["employee_manager_top_select"]}>
            <Select
              style={{ width: 150 }}
              value={secondCity}
              onChange={onSecondCityChange}
            >
              {cities.map((city) => (
                <Option key={city}>{city}</Option>
              ))}
            </Select>
            <DatePicker
              defaultValue={moment("2021/04/26", dateFormatList[0])}
              format={dateFormatList}
            />
          </div>
          <Row className={styles["employee_manager_top_center"]}>
            <Col
              className={styles["employee_manager_top_center_col"]}
              xs={20}
              sm={10}
              md={10}
              lg={6}
              xl={6}
            >
              <div className={styles["employee_manager_top_center_item"]}>
                <div>Tổng ca làm</div>
                <div>500</div>
              </div>
            </Col>
            <Col
              className={styles["employee_manager_top_center_col"]}
              xs={20}
              sm={10}
              md={10}
              lg={6}
              xl={6}
            >
              <div className={styles["employee_manager_top_center_item"]}>
                <div>Tổng nhân viên</div>
                <div>30</div>
              </div>
            </Col>
            <Col
              className={styles["employee_manager_top_center_col"]}
              xs={20}
              sm={10}
              md={10}
              lg={6}
              xl={6}
            >
              <div className={styles["employee_manager_top_center_item"]}>
                <div>Nhân viên trên 6 tháng</div>
                <div>20</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles["employee_manager_bottom"]}>
          <Row className={styles["employee_manager_bottom_row"]}>
            <Col
              className={styles["employee_manager_bottom_col"]}
              xs={22}
              sm={22}
              md={15}
              lg={15}
              xl={15}
            >

              <Popover placement="bottomLeft" content={content} trigger="click">
                <Search placeholder="Tìm kiếm" onSearch={onSearch} enterButton />
              </Popover>
            </Col>
            <Col
              className={styles["employee_manager_bottom_col_right"]}
              xs={22}
              sm={22}
              md={7}
              lg={7}
              xl={7}
            >
              <div className={styles["employee_manager_bottom_right"]}>
                <div className={styles["employee_manager_bottom_right_select"]}>
                  <Select
                    className={
                      styles["employee_manager_bottom_right_select_child"]
                    }
                    value={secondCityShjft}
                    onChange={onSecondCityChangeShjft}
                  >
                    {citiesShjft.map((city) => (
                      <Option key={city}>{city}</Option>
                    ))}
                  </Select>
                </div>
                <Row className={styles["employee_manager_bottom_right_bottom"]}>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <div
                      className={
                        styles["employee_manager_bottom_right_bottom_left"]
                      }
                    >
                      <Checkbox onChange={onChange}>Hoạt động</Checkbox>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <div
                      className={
                        styles["employee_manager_bottom_right_bottom_left"]
                      }
                    >
                      <Checkbox onChange={onChange}>Không hoạt động</Checkbox>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className={styles["employee_manager_bottom_table"]}>
            <Table

              columns={columns}
              dataSource={data}
            />
          </div>{" "}
          <Row className={styles["employee_manager_button"]}>
            <Col
              className={styles["employee_manager_button_right"]}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              {" "}
              {/* <Link href="/manager/employee/show"> */}
              <Button
                className={styles["employee_manager_button_main"]}
                type="primary"
              >
                Hủy
              </Button>
              {/* </Link> */}
            </Col>
            <Col
              className={styles["employee_manager_button_left"]}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              {" "}
              <Button
                className={styles["employee_manager_button_main"]}
                danger
                type="primary"
              >
                Xóa nhân viên
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </UI>
  );
}
