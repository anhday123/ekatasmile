import UI from "../../../../components/Layout/UI";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import styles from "./../view/view.module.scss";
import React, { useState } from "react";
import { Select, Button, Input, Row, Col, Typography, Table } from "antd";
import { ArrowLeftOutlined, TeamOutlined, BranchesOutlined, FileDoneOutlined, CarOutlined, FileImageOutlined, WarningOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;
export default function OrderInformationView() {
  const { Search } = Input;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 150,
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
      title: "Giá (VNĐ)",
      dataIndex: "productprice",
      width: 150,
    },
    {
      title: "Thuế",
      dataIndex: "tax",
      width: 150,
    },
    {
      title: "Chiết khấu",
      dataIndex: "discount",
      width: 150,
    },
    {
      title: "Số lượng",
      dataIndex: "productquantity",
      width: 150,
    },
    {
      title: "Thành tiền",
      dataIndex: "moneyTotal",
      width: 150,
    },
  ];
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
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productcode: <Link to="/actions/order-information/view-product/4" style={{ color: '#0036F3', cursor: 'pointer' }}>{i}</Link>,
      productname: `tên sản phẩm ${i}`,
      productpicture: <FileImageOutlined />,
      productprice: `${i}`,
      tax: `100.00${i}`,
      discount: `200.00${i}`,
      productquantity: i,
      moneyTotal: `300,00${i}`
    });
  }
  return (
    <UI>
      <div className={styles['order_information']}>
        <Link to="/order-list/4" className={styles['order_information_title']}>
          <div><ArrowLeftOutlined /></div>
          <div>Thông tin mã đơn hàng DH1111</div>
        </Link>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className={styles['order_information_content']}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#1A38A3', fontSize: '1.25rem', fontWeight: '600' }}>Thông tin khách hàng</div>
                <div style={{ backgroundColor: '#BAC3E3', borderRadius: '50%', padding: '0.5rem', border: '1px solid #1A38A3' }}><TeamOutlined style={{ color: '#1A38A3', fontSize: '1.25rem' }} /></div>
              </div>
              <div><b style={{ marginRight: '0.25rem' }}>Tên khách hàng:</b> nguyễn văn tỷ</div>
              <div><b style={{ marginRight: '0.25rem' }}>Mã khách hàng:</b> DH1111</div>
              <div><b style={{ marginRight: '0.25rem' }}>Liên hệ:</b> 0384943497</div>
              <div><b style={{ marginRight: '0.25rem' }}>Địa chỉ:</b> 12, nguyễn A, gò vấp</div>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className={styles['order_information_content_center']}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#F08556', fontSize: '1.25rem', fontWeight: '600' }}>Thông tin chi nhánh</div>
                <div style={{ backgroundColor: '#FBDACC', borderRadius: '50%', padding: '0.5rem', border: '1px solid #F08556' }}><BranchesOutlined style={{ color: '#F08556', fontSize: '1.25rem' }} /></div>
              </div>
              <div><b style={{ marginRight: '0.25rem' }}>Tên chi nhánh:</b> chi nhánh A</div>
              <div><b style={{ marginRight: '0.25rem' }}>Mã chi nhánh:</b> 123456789</div>
              <div><b style={{ marginRight: '0.25rem' }}>Liên hệ:</b> 0384943497</div>
              <div><b style={{ marginRight: '0.25rem' }}>Địa chỉ:</b> 12, nguyễn A, gò vấp</div>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className={styles['order_information_content_right']}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#3F4AF0', fontSize: '1.25rem', fontWeight: '600' }}>Thông tin vận chuyển</div>
                <div style={{ backgroundColor: '#C5C9FB', borderRadius: '50%', padding: '0.5rem', border: '1px solid #3F4AF0' }}><CarOutlined style={{ color: '#3F4AF0', fontSize: '1.25rem' }} /></div>
              </div>
              <div><b style={{ marginRight: '0.25rem' }}>Đơn vị vận chuyển:</b> giao hàng nhanh</div>
              <div><b style={{ marginRight: '0.25rem' }}>Số HĐVC:</b> 123456789</div>
              <div><b style={{ marginRight: '0.25rem' }}>Nơi vận chuyển đến:</b> Gò Vấp</div>
              <div><b style={{ marginRight: '0.25rem' }}>Liên hệ nhận hàng:</b> 0384943497</div>
            </div>
          </Col>
        </Row>
        <div style={{ display: 'flex', border: '1px solid rgb(231, 214, 214)', borderRadius: '0.25rem', flexDirection: 'column', backgroundColor: 'white', marginTop: '1rem', padding: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', color: 'black', fontWeight: '600', fontSize: '1rem', width: '100%' }}>Danh sách sản phẩm</div>
          <div style={{ display: 'flex', border: '1px solid rgb(231, 214, 214)', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Table
              rowSelection={rowSelection}
              columns={columns}

              dataSource={data}
              scroll={{ y: 500 }}
              summary={pageData => {
                let totalPrice = 0;
                let totalTax = 0;
                let totalDiscount = 0;
                let total = 0;
                console.log(pageData)
                pageData.forEach((values, index) => {
                  totalPrice += parseInt(values.productprice);
                  totalTax += parseInt(values.tax);
                  totalDiscount += parseInt(values.discount);
                })
                total = totalPrice + totalTax + totalDiscount;
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

                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalPrice}`}</Text>


                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{`${totalTax}`}</Text>

                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{totalDiscount}</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text></Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{total}</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className={styles['order_information_content_bottom']}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#4CA322', fontSize: '1.25rem', fontWeight: '600' }}>Người lập hóa đơn</div>
                <div style={{ backgroundColor: '#BAC9E3BDC3E3', borderRadius: '50%', padding: '0.5rem', border: '1px solid #4CA322' }}><FileDoneOutlined style={{ color: '#4CA322', fontSize: '1.25rem' }} /></div>
              </div>
              <div><b style={{ marginRight: '0.25rem' }}>Tên nhân viên:</b> nguyễn văn tỷ</div>
              <div><b style={{ marginRight: '0.25rem' }}>Mã nhân viên:</b> DH1111</div>
              <div><b style={{ marginRight: '0.25rem' }}>Ngày lập:</b> 2021/07/01</div>
            </div>
          </Col>
        </Row>
      </div>
    </UI >
  );
}
