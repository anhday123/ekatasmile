import UI from "./../../../../components/Layout/UI";
import styles from "./../view/view.module.scss";
import React from "react";
import { Input,  Button, Row, Col, Popover, DatePicker, Select } from "antd";
import {

  Link,

} from "react-router-dom";
import {  ArrowLeftOutlined, FileExcelOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RevenueDetailView() {
  const { Search } = Input;
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <Link style={{ display: 'flex', paddingBottom: '1rem', borderBottom: '1px solid rgb(238, 227, 227)', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} className={styles["supplier_information_title"]} to="/report-financial/16">

          <ArrowLeftOutlined style={{ color: 'black', marginRight: '0.5rem', fontWeight: '600', fontSize: '1rem' }} />
          <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} className={styles["supplier_information_title_right"]}>
            Chi phí doanh thu
          </div>

        </Link>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo mã, theo tên"
                enterButton
              /></div>
            </Popover>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
              />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }} />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Lọc theo kho">
                <Option value="warehouse1">Kho 1</Option>
                <Option value="warehouse2">Kho 2</Option>
                <Option value="warehouse3">Kho 3</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} defaultValue="default" >
                <Option value="default">Tất cả mã lô hàng</Option>
                <Option value="goods1">Lô hàng 1</Option>
                <Option value="goods2">Lô hàng 2</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#004F88', color: 'white' }}>Nhập excel</Button>
              </Col>
              <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#008816', color: 'white' }}>Xuất excel</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>

          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>
          <Col className={styles['hover_item']} style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div style={{ display: 'flex', backgroundColor: '#5363E0', padding: '1.5rem 1rem', border: '1px solid #2F9BFF', borderRadius: '0.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}><b style={{ marginRight: '0.5rem' }}>Tổng đơn hàng:</b> 100</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Tổng tiền:</b> 50.000.000 VNĐ</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', marginTop: '0.5rem' }}><b style={{ marginRight: '0.5rem' }}>Ngày:</b> 2021/07/01</div>
            </div>
          </Col>

        </Row>
      </div>

    </UI>
  );
}
