import UI from "../../components/Layout/UI";
import styles from "./../guarantee/guarantee.module.scss";
import React, { useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Select, Table, Modal, Popover } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, FileExcelOutlined, EditOutlined, PlusCircleOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
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
export default function Guarantee() {
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
      title: 'Mã phiếu',
      dataIndex: 'ticketCode',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      width: 150,
    },
    {
      title: 'Mã SKU',
      dataIndex: 'skuCode',
      width: 150,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      width: 150,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: 'Thời hạn bảo hành',
      dataIndex: 'guaranteeTime',
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
      ticketCode: <Link to="/actions/guarantee/view/11">BGH {i}</Link>,
      status: `Hoạt động ${i}`,
      product: `Ly thủy tinh ${i}`,
      skuCode: `63UIFJ ${i}`,
      orderCode: `PV ${i}`,
      customerName: `Van Ty`,
      guaranteeTime: '30 ngày',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        {/* <Link to="/actions/guarantee/view/11"><ExclamationCircleOutlined style={{ fontSize: '1.25rem', marginRight: '0.5rem', cursor: 'pointer', color: '#096E00' }} /></Link> */}
        <Link to="/actions/guarantee/update/11" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
      </div>
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
        <div style={{ display: 'flex', paddingBottom: '0.75rem', borderBottom: '1px solid rgb(236, 226, 226)', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Quản lý bảo hành</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/guarantee/add/11">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Tạo phiếu bảo hành</Button>
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
              <Select style={{ width: '100%' }} placeholder="Lọc phiếu bảo hành" onChange={handleChange}>
                <Option value="ticket1">Phiếu bảo hành 1</Option>
                <Option value="ticket2">Phiếu bảo hành 2</Option>
                <Option value="ticket3">Phiếu bảo hành 3</Option>
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
          <Table rowSelection={rowSelection} columns={columnsPromotion} dataSource={dataPromotion} scroll={{ y: 500 }} />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa bảo hành</Button></Popconfirm></div>) : ('')
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
