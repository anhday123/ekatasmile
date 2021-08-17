import UI from "../../components/Layout/UI";
import styles from "./../report-inventory/report-inventory.module.scss";
import React, { useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Select, Table, Modal, Typography, Popover } from "antd";
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
const { Text } = Typography;
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
export default function ReportInventory() {
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

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

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 150,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
      width: 150,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: 150,
    },
    {
      title: "Số lượng tồn",
      dataIndex: "productQuantity",
      width: 150,
    },
    {
      title: "Mã lô hàng",
      dataIndex: "goodsCode",
      width: 150,
    },
    {
      title: "Tên kho",
      dataIndex: "inventoryName",
      width: 150,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ];
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <div>{i}</div>,
      productName: `tên sản phẩm ${i}`,
      productQuantity: i,
      goodsCode: `BS5426${i}`,
      inventoryName: `Bình thạnh`,
      // action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      //   <Link to="/actions/supplier/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
      //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      // </div>,
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
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Báo cáo tồn kho</div>
          {/* <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/show">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </div> */}
        </div>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
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
                onChange={onChange}
              />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <DatePicker style={{ width: '100%' }} onChange={onChangeMain} />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Lọc theo kho" onChange={handleChange}>
                <Option value="inventory1">Kho hàng 1</Option>
                <Option value="inventory2">Kho hàng 2</Option>
                <Option value="inventory3">Kho hàng 3</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} defaultValue="default" onChange={handleChange}>
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
              <Col style={{ width: '100%', marginTop: '1rem', display: 'flex', marginLeft: '1rem', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#008816', color: 'white' }}>Xuất excel</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div style={{ width: '100%', border: '1px solid rgb(235, 222, 222)', marginTop: '1rem' }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}

            summary={pageData => {
              let totalPrice = 0;

              console.log(pageData)
              pageData.forEach((values, index) => {
                totalPrice += parseInt(values.productQuantity);

              })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell> <Text></Text></Table.Summary.Cell>
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
            dataSource={data} scroll={{ y: 500 }}


          /></div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa báo cáo</Button></Popconfirm></div>) : ('')
        }
        <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ display: 'flex', backgroundColor: '#E9A800', borderRadius: '0.5rem', width: '7.5rem', color: 'white', display: 'flex', cursor: 'pointer', padding: '0.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>Xuất báo cáo</div>) : ('')
          }
        </div>
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <Search placeholder="Tìm kiếm khách hàng" onSearch={onSearchCustomerChoose} enterButton />
            </div>
          </Popover>
          <div style={{ marginTop: '1rem', border: '1px solid rgb(209, 191, 191)', width: '100%', maxWidth: '100%', overflow: 'auto' }}> <Table scroll={{ y: 500 }} rowSelection={rowSelection} columns={columns} dataSource={data} /></div>
          {/* <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <div onClick={() => modal2VisibleModal(false)} style={{ marginRight: '1rem' }}><Button style={{ width: '7.5rem' }} type="primary" danger>Hủy</Button></div>
            <div><Button type="primary" style={{ width: '7.5rem' }}>Xác nhận</Button></div>
          </div> */}
        </div>
      </Modal>
    </UI>
  );
}
