import UI from "../../components/Layout/UI";
import styles from "./../import-export-file/import-export-file.module.scss";
import React, { useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Popover, Select, Table, Modal, Typography } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { FileExcelOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
];

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
export default function ImportExportFile() {
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
  const columnsPromotion = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      width: 150,
    },
    {
      title: 'Người thao tác',
      dataIndex: 'actionPerson',
      width: 150,
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      width: 150,
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: 150,
    },
    {
      title: 'Trạng thái xử lý',
      dataIndex: 'processStatus',
      width: 150,
    },
  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      fileName: <div>GH.xls {i}</div>,
      actionPerson: `Nguyễn A ${i}`,
      function: `Quản lý đơn hàng ${i}`,
      time: `07:30, 16/07/2021 ${i}`,
      processStatus: i % 2 === 0 ? `Hoàn thành ${i}` : `Chưa hoàn thành ${i}`,
    });
  }
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <Row style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', width: '100%' }}>
          <Col xs={24} sm={11} md={11} lg={11} xl={11} className={styles["promotion_manager_title"]}>            <Link className={styles["supplier_add_back_parent"]} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

            <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Quản lý xuất nhập file</div>

          </Link></Col>
          {/* <Col style={{ marginBottom: '0.5rem' }} xs={24} sm={11} md={11} lg={11} xl={11} className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/show">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </Col> */}
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}><Search
                placeholder="Tìm kiếm theo tên file"
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
              <Select style={{ width: '100%' }} placeholder="Lọc theo chi nhánh" onChange={handleChange}>
                <Option value="branch1">Chi nhánh 1</Option>
                <Option value="branch2">Chi nhánh 2</Option>
                <Option value="branch3">Chi nhánh 3</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Trạng thái xử lý" onChange={handleChange}>
                <Option value="status1">Trạng thái 1</Option>
                <Option value="status2">Trạng thái 2</Option>
                <Option value="status3">Trạng thái 3</Option>
              </Select>
            </div>
          </Col>
        </Row>
        {/* <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <div style={{ width: '100%', }}>
              <div className={styles['hover_item']} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#3B6CC9', borderRadius: '0.5rem', padding: '1rem 1rem', width: '50%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>500</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'white', fontSize: '1rem', }}>Tổng số đơn hàng bán được</div>
              </div>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#004F88', color: 'white' }}>Nhập excel</Button>
              </Col>
              <Col style={{ width: '100%', marginLeft: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#008816', color: 'white' }}>Xuất excel</Button>
              </Col>
            </Row>
          </Col>
        </Row> */}
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table
            rowSelection={rowSelection}
            columns={columnsPromotion} dataSource={dataPromotion} scroll={{ y: 500 }} />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '10rem' }}>Xóa thông tin</Button></Popconfirm></div>) : ('')
        }
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
            </div></Popover>
          <div style={{ marginTop: '1rem', border: '1px solid rgb(209, 191, 191)', width: '100%', maxWidth: '100%', overflow: 'auto' }}> <Table scroll={{ y: 500 }} rowSelection={rowSelection} columns={columns} dataSource={data} /></div>
          {/* <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <div onClick={() => modal2VisibleModal(false)} style={{ marginRight: '1rem' }}><Button style={{ width: '7.5rem' }} type="primary" danger>Hủy</Button></div>
            <div><Button type="primary" style={{ width: '7.5rem' }}>Xác nhận</Button></div>
          </div> */}
        </div>
      </Modal>
    </UI >
  );
}
