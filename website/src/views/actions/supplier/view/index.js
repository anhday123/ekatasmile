import UI from "../../../../components/Layout/UI";
import styles from "./../view/view.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Popconfirm, message, Select, Button, Table, Input, Space, Popover, Row, Col, DatePicker } from "antd";
import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  AudioOutlined,
  EditOutlined,
  WarningOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import moment from 'moment';

const { RangePicker } = DatePicker;
const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    width: 100,
  },
  {
    title: "Mã sản phẩm",
    dataIndex: "productcode",
    width: 150,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "productname",
    width: 150,
  },
  {
    title: "Hình ảnh",
    dataIndex: "productpicture",
    width: 150,
  },
  {
    title: "Giá (VNĐ)",
    dataIndex: "productprice",
    width: 150,
  },
  {
    title: "Loại",
    dataIndex: "producttype",
    width: 150,
  },
  {
    title: "Số lượng",
    dataIndex: "productquantity",
    width: 150,
  },
  {
    title: "Nhà cung cấp",
    dataIndex: "supplier",
    width: 150,
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   width: 150,
  // },
];
function confirm(e) {
  console.log(e);
  message.success('Click on Yes');
}

function cancel(e) {
  console.log(e);
  message.error('Click on No');
}
const { Search } = Input;
const data = [];
const content = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center' }}>Số lượng báo động: 10</div>
);
const contentAttention = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'red' }}>Số lượng báo động: 20</div>
);
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    productcode: <div>{i}</div>,
    productname: `tên sản phẩm ${i}`,
    productpicture: <FileImageOutlined />,
    productprice: `${i} VNĐ`,
    producttype: "Quà lưu niệm",
    productquantity: i,
    supplier: 'An Phát',
    // action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
    //   {/* <div style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div> */}
    //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
    // </div>
  });
}
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const onSearch = (value) => console.log(value);
export default function SupplierView() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const { Option } = Select;
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
  }
  function handleChangeProductType(value) {
    console.log(`selected ${value}`);
  }
  function handleChangeProductStatus(value) {
    console.log(`selected ${value}`);
  }
  function handleChangeProductBrand(value) {
    console.log(`selected ${value}`);
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  return (
    <UI>
      <div className={styles["view_product"]}>
        <Row style={{ display: 'flex', paddingBottom: '1rem', borderBottom: '1px solid rgb(236, 228, 228)', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={12} xl={12}>
            <Link className={styles["view_product_back"]} to="/supplier/10">

              <ArrowLeftOutlined style={{ fontSize: '1rem', fontWeight: '600', color: 'black' }} />
              <div className={styles["view_product_back_title"]}>
                Sản phẩm nhà cung cấp An Phát
              </div>
            </Link>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={12} xl={12}>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
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
          </Col>
        </Row>

        <Row style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ width: '100%' }}>
                <Search
                  tyle={{ width: '100%' }}
                  placeholder="Tìm kiếm"
                  onSearch={onSearch}
                  enterButton
                />
              </div>
            </Popover>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <RangePicker
              style={{ width: '100%' }}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              onChange={onChange}
            />
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <DatePicker style={{ width: '100%' }} onChange={onChangeMain} />
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <Select style={{ width: '100%' }} placeholder="Loại sản phẩm" onChange={handleChangeProductType}>
              <Option value="productType1">Loại 1</Option>
              <Option value="productType2">Loại 2</Option>
            </Select>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <Select style={{ width: '100%' }} placeholder="Lọc theo trạng thái sản phẩm" onChange={handleChangeProductStatus}>
              <Option value="productStatus1">Trạng thái 1</Option>
              <Option value="productStatus2">Trạng thái 2</Option>
            </Select>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <Select style={{ width: '100%' }} placeholder="Lọc sản phẩm theo nhãn hiệu" onChange={handleChangeProductBrand}>
              <Option value="productBrand1">Nhãn hiệu 1</Option>
              <Option value="productBrand2">Nhãn hiệu 2</Option>
            </Select>
          </Col>
        </Row>

        <div className={styles["view_product_table"]}>
          <Table
            rowSelection={rowSelection}
            rowClassName={(record, index) => record.productquantity > 5 ? styles['normal'] : styles['warm']}
            columns={columns}

            dataSource={data}
            scroll={{ y: 500 }}
          />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa sản phẩm</Button></Popconfirm>
          </div>) : ('')
        }
        {/* <div className={styles["view_product_button"]}>
          <Button type="primary">Lưu</Button>
        </div> */}
      </div>
    </UI>
  );
}
