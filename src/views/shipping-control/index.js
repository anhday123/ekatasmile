import UI from "../../components/Layout/UI";
import styles from "./../shipping-control/shipping-control.module.scss";
import React, { useState } from "react";
import { Popconfirm, message ,Input, Button, Row, Col, DatePicker, Popover, Select, Table, Typography } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
const { Text } = Typography;
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
export default function ShippingControl() {
  const { Search } = Input;
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onSearch = (value) => console.log(value);
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }
  
  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const columnsPromotion = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'ticketCode',
      width: 150,
    },
    {
      title: 'Đối tác vận chuyển',
      dataIndex: 'shipping',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 150,
    },
    {
      title: 'Ngày đối xuất',
      dataIndex: 'controlDate',
      width: 150,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updateDate',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
    },




  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      ticketCode: <Link to="/actions/shipping-control/view/17" style={{ color: '#2400FF' }}>BGH {i}</Link>,
      shipping: 'ABC',
      status: `Đã đối soát ${i}`,
      payment: `${i}`,
      createdDate: `07:30, 2021/07/01`,
      controlDate: `07:30, 2021/08/01`,
      updateDate: `07:30, 2021/09/01`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/shipping-control/update/17" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
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
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Đối soát vận chuyển</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/shipping-control/add/17">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Tạo phiếu đối soát</Button>
            </Link>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
              /></div></Popover>
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
              <Select style={{ width: '100%' }} placeholder="Lọc phiếu đối soát" onChange={handleChange}>
                <Option value="ticket1">Phiếu đối soát 1</Option>
                <Option value="ticket2">Phiếu đối soát 2</Option>
                <Option value="ticket3">Phiếu đối soát 3</Option>
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
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table
            rowSelection={rowSelection}
            summary={pageData => {
              let totalPrice = 0;

              console.log(pageData)
              pageData.forEach((values, index) => {
                totalPrice += parseInt(values.payment);

              })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell >
                      <Text>Tổng cộng:</Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>{`${totalPrice}`}</Text>

                    </Table.Summary.Cell>
                    <Table.Summary.Cell >
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell >
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell >
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
            columns={columnsPromotion} style={{ width: '100%' }} dataSource={dataPromotion}  scroll={{ y: 500 }} />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
          title="Bạn chắc chắn muốn xóa?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa đối soát</Button></Popconfirm></div>) : ('')
        }
      </div>
    </UI>
  );
}
