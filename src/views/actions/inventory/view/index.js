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
import moment from 'moment'
import styles from "./../view/view.module.scss";
import React, { useEffect, useState } from "react";
import { Select, Table, Button, Input, Row, Col, Popover, Modal, Typography, DatePicker } from "antd";
import { ArrowLeftOutlined, FileImageOutlined, WarningOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { apiSearchProduct } from "../../../../apis/product";
export default function InventoryView(propsData) {
  const state = propsData.location.state;
  console.log(state)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [warehousePrroduct, setWarehouseProduct] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const { Search } = Input;
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const { Text } = Typography;
  const { RangePicker } = DatePicker;
  const columns = [
    {
      title: "STT",
      width: 150,
      render(data, record, index) {
        return ((pagination.page - 1) * pagination.page_size) + (index + 1)
      }
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "sku",
      width: 150,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: 150,
      render(data, record) {
        return record.title || record.name
      }
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 150,
      render(data) {
        return <img src={data[0]} width="80px" />
      }
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "sale_price",
      width: 150,
    },
    {
      title: "Loại",
      dataIndex: "_category",
      width: 150,
    },
    {
      title: "Số lượng",
      dataIndex: "available_stock_quantity",
      width: 150,
      render(data, record) {
        return record.shipping_quantity + data
      }
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "_supplier",
      width: 150,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ];
  const getProductWarehouse = async () => {
    try {
      const res = await apiSearchProduct({ warehouse: state.warehouse_id, merge: false, ...pagination })
      if (res.status == 200) {
        setWarehouseProduct(res.data.data)
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getProductWarehouse()
  }, [pagination])
  const content = (
    <div className={styles['shadow']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center' }}>Số lượng báo động: 10</div>
  );
  const contentAttention = (
    <div className={styles['shadow']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'red' }}>Số lượng báo động: 20</div>
  );
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productcode: <div>{i}</div>,
      productname: `tên sản phẩm ${i}`,
      productpicture: <FileImageOutlined />,
      productprice: `${i} VNĐ`,
      producttype: "Quà lưu niệm",
      productquantity: <div>
        {
          i % 2 === 0 ? (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Popover placement="bottom" content={content} >
              <div style={{ display: 'flex', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', width: '100%' }}><WarningOutlined style={{ fontSize: '1.75rem', color: 'black' }} /></div>
            </Popover>
          </div>) : (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Popover placement="bottom" content={contentAttention} >
              <div style={{ display: 'flex', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', width: '100%' }}><WarningOutlined style={{ fontSize: '1.75rem', color: 'red' }} /></div>
            </Popover>
          </div>)
        }
      </div>,
      supplier: 'An Phát',
      // action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      //   <Link to="/actions/product/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
      //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      // </div>
    });
  }
  const contentSearch = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const onSearch = value => console.log(value);
  return (
    <UI>
      <div className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to="/inventory/7">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} />
          <div className={styles["supplier_information_title_right"]}>
            {`Thông tin chi tiết ${state.name}`}
          </div>

        </Link>

        <div className={styles["supplier_information_content_parent"]}>
          <Row className={styles["supplier_information_content_main"]}>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>              <div
                >
                  <b>Mã kho:</b> {`${state.code}`}
                </div></Col>
              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="An Phát" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Ngày tạo:</b> {`${moment(state.create_date).format('YYYY-MM-DD')}`}
                  </div>
                </Col>
              </Row>


              {/* <Input
                style={{ width: "100%" }}
                defaultValue="Số 2, đường số 10, Gò Vấp"
              /> */}
            </Col>

          </Row>
          <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_left"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Tên kho:</b> {`${state.name}`}
                  </div>
                </Col>

              </Row>


              {/* <Input disabled="true" style={{ width: "100%" }} defaultValue="MNT200" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Địa chỉ:</b> {`${state.address}`}
                  </div>
                </Col>

              </Row>

              {/* <Input style={{ width: "100%" }} defaultValue="Gò Vấp" /> */}
            </Col>
          </Row>

          <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Loại kho:</b> {`${state.type}`}
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="vanty@gmail.com" /> */}
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Quận/huyện:</b> {`${state.district}`}
                  </div>
                </Col>

              </Row>
              {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
            </Col>
          </Row>

          <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Liên hệ:</b> {`${state.phone}`}
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="vanty@gmail.com" /> */}
            </Col>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Tỉnh/thành phố:</b> {`${state.province}`}
                  </div>
                </Col>

              </Row>
              {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
            </Col>
          </Row>

          <Row className={styles["supplier_information_content_main"]}>
            {/* <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Chi nhánh:</b> chi nhánh 1
                  </div>
                </Col>

              </Row>


  
            </Col> */}
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Dung lượng:</b> {`${state.capacity}`}
                  </div>
                </Col>

              </Row>


              {/* <Input style={{ width: "100%" }} defaultValue="vanty@gmail.com" /> */}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Phí duy trì tháng:</b> {`${state.monthly_cost}`}
                  </div>
                </Col>

              </Row>
              {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
            </Col>
          </Row>

          {/* <Row className={styles["supplier_information_content_main"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["supplier_information_content_child_right"]}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div

                  >
                    <b>Dung lượng:</b> {`${state.capacity}`}
                  </div>
                </Col>

              </Row>


          
            </Col>


          </Row> */}





          {/* <div onClick={() => modal2VisibleModal(true)} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '10rem' }}>Danh sách sản phẩm</Button></div> */}

        </div>
        <Modal
          title="Danh sách sản phẩm"
          centered
          width={1000}
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div>
            <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>

              <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo mã, theo tên" onSearch={onSearch} enterButton />
            </div>
            <div style={{ width: '100%', border: '1px solid rgb(233, 227, 227)' }}>
              <Table
                rowSelection={rowSelection}
                columns={columns}

                dataSource={warehousePrroduct}
                scroll={{ y: 500 }}
              // summary={pageData => {
              //   let totalPrice = 0;

              //   console.log(pageData)
              //   pageData.forEach((values, index) => {
              //     totalPrice += parseInt(values.productprice);

              //   })

              //   return (
              //     <Table.Summary fixed>
              //       <Table.Summary.Row>
              //         <Table.Summary.Cell>
              //           <Text></Text></Table.Summary.Cell>
              //         <Table.Summary.Cell >
              //           <Text>Tổng cộng:</Text>
              //           {/* <Text type="danger">456</Text> */}
              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell>
              //           <Text></Text>
              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell>
              //           <Text></Text>
              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell>
              //           <Text>{`${totalPrice}`}</Text>

              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell >
              //           <Text></Text>
              //           {/* <Text type="danger">456</Text> */}
              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell >
              //           <Text></Text>
              //           {/* <Text type="danger">456</Text> */}
              //         </Table.Summary.Cell>
              //         <Table.Summary.Cell >
              //           <Text></Text>
              //           {/* <Text type="danger">456</Text> */}
              //         </Table.Summary.Cell>
              //       </Table.Summary.Row>
              //     </Table.Summary>
              //   );
              // }}
              />
            </div>
          </div>
        </Modal>
      </div>
    </UI >
  );
}
