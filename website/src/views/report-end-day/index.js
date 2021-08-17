import UI from "./../../components/Layout/UI";
import styles from "./../report-end-day/report-end-day.module.scss";
import React, { useState } from "react";
import { Input, Row, Col, DatePicker, Select, Button, Popover } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  });
}
export default function ReportEndDay() {
  const { Search } = Input;

  const onSearch = (value) => console.log(value);
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }


  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/customer/view" style={{ color: '#2400FF' }}>GH {i}</Link>,
      customerName: `Văn Tỷ ${i}`,
      customerType: `Tiềm năng ${i}`,
      branch: `Chi nhánh ${i}`,
      birthDay: `2021/06/28 ${i}`,
      email: `anhhung_so11@yahoo.com`,
      phoneNumber: '0384943497',
      address: '27/27, đường Ngô Y Linh',
      district: 'Bình Tân',
      city: 'Hồ Chí Minh',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/customer/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <Row style={{ width: '100%', display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.5rem', justifyContent: 'space-between', alignItems: 'center', }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div className={styles["promotion_manager_title"]}>Báo cáo cuối ngày</div>
              {/* <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/show">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </div> */}
            </div>
          </Col>
          <Col style={{ width: '100%', }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>

              <Col style={{ width: '100%', marginTop: '0.5rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#008816', color: 'white' }}>Xuất excel</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
              /></div>
            </Popover>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={onChange}
              />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }} onChange={onChangeMain} />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Loại" onChange={handleChange}>
                <Option value="type1">Loai 1</Option>
                <Option value="type2">Loai 2</Option>
                <Option value="type3">Loai 3</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>500</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng số đơn hàng bán được</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>100</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng số đơn hàng đổi trả</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>80</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng số đơn hàng hoàn tiền</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>10.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng doanh thu</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>5.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng chi phí</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>20.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng lợi nhuận</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>0%</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}>Tổng chiết khấu</div>
            </div>
          </Col>
        </Row>
      </div>

    </UI>
  );
}
