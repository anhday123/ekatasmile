import UI from "../../../../components/Layout/UI";
import loading from './../../../../assets/img/loading.png'
import styles from "./../view/view.module.scss";
import { Popconfirm, Select, Button, Input, Form, Row, Col, DatePicker, Typography, Steps, message, Tree, Table, Modal, notification } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ArrowLeftOutlined, AudioOutlined } from "@ant-design/icons";
import React, { useState } from "react";
const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;
const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    width: 150,
  },
  {
    title: 'Tồn chi nhánh',
    dataIndex: 'branchInventory',
    width: 150,
  },
  {
    title: 'Tồn thực tế',
    dataIndex: 'realityInventory',
    width: 150,
  },
  {
    title: 'Số lượng lệch',
    dataIndex: 'deviationAmount',
    width: 150,
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    skuCode: `IAN ${i}`,
    productName: `Ly thủy tinh`,
    unit: `${i} đơn vị`,
    branchInventory: i,
    realityInventory: i,
    deviationAmount: i
  });
}
const treeData = [
  {
    title: 'Tất cả sản phẩm (tối đa 1000 sản phẩm)',
    key: 'productAll',
  },
  {
    title: 'Tất cả các nhóm sản phẩm',
    key: 'productGroupAll',
    children: [
      {
        title: 'Tất cả loại sản phẩm',
        key: 'productAllType',
      },
      {
        title: 'Tất cả nhãn sản phẩm',
        key: 'productAllBranch',
      },
    ],
  },
];
export default function ProductCheckView() {
  const [current, setCurrent] = useState(0)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState(['productGroupAll']);
  const [checkedKeys, setCheckedKeys] = useState(['']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const next = () => {
    setCurrent(current + 1);
  };
  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onChange = current => {
    console.log('onChange:', current);
    setCurrent(current)
  };
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const { Search } = Input;
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );

  const onSearch = value => console.log(value);

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Đã kiểm hàng thành công.',
    });
  };
  const checkFinish = () => {
    openNotification()
    modal2VisibleModal(true)
  }
  return (
    <UI>
      <Form style={{ margin: '1rem' }} onFinish={onFinish}
        onFinishFailed={onFinishFailed} className={styles['product_check_add']}>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>
            <Link to="/product-check/8" style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div><ArrowLeftOutlined style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }} /></div>
              <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }}>Phiếu kiểm hàng INA001</div>
            </Link>
          </Col>
          {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={17} xl={17}>
            <div>
              <Steps current={current} onChange={onChange}>
                <Step title="Lên danh sách kiểm"
                // description="This is a description."
                />
                <Step title="Kiểm hàng"
                // description="This is a description."
                />
                <Step title="Thống kê"
                // description="This is a description."
                />
                <Step title="Hoàn thành!"
                // description="This is a description."
                />
              </Steps>

            </div>
          </Col> */}
        </Row>
        {/* <div style={{ display: 'flex', backgroundColor: 'white', padding: '1rem', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Steps size="small" style={{ height: '17.5rem', paddingTop: '2rem' }} direction="vertical" current={current}
          // onChange={onChange}
          >
            <Step title="Lên danh sách kiểm"
            // description="This is a description."
            />
            <Step title="Kiểm hàng"
            // description="This is a description."
            />
            <Step title="Thống kê"
            // description="This is a description."
            />
            <Step title="Hoàn thành!"
            // description="This is a description."
            />
          </Steps>
        </div> */}

        <div style={{ display: 'flex', backgroundColor: 'white', marginTop: '1rem', padding: '1rem 1rem 0.5rem 1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin phiếu kiểm hàng</div>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Chi nhánh kiểm: </b> mặc định</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Nhân viên tạo:</b> Nguyễn An</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Ngày tạo: </b> 2021/07/01</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Ghi chú: </b> không có ghi chú</div>
              </div>
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '7.5rem', padding: '0.5rem', borderRadius: '2rem', backgroundColor: '#FFAC2F', color: 'black' }}>Đang kiểm kho</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Nhân viên kiểm:</b> Nguyễn An</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Ngày tạo: </b> 2021/07/01</div>
              </div>
            </Col>
            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={24} md={11} lg={5} xl={5}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}><b>Tag: </b> không có tag</div>
              </div>
            </Col>
          </Row>
        </div>


        <div style={{ display: 'flex', backgroundColor: 'white', marginTop: '1rem', padding: '1rem 1rem 0rem 1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Danh sách sản phẩm</div>
          <div style={{ border: '1px solid rgb(224, 208, 208)', marginTop: '1rem', width: '100%' }}>
            <Table
              rowSelection={rowSelection}
              summary={pageData => {
                let totalBranchInventory = 0;
                let totalRealityInventory = 0;
                let totalDeviationAmount = 0;
                console.log(pageData)
                pageData.forEach((values, index) => {
                  totalBranchInventory += parseInt(values.branchInventory);
                  totalRealityInventory += parseInt(values.realityInventory);
                  totalDeviationAmount += parseInt(values.deviationAmount);
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
                        <Text></Text>

                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{`${totalBranchInventory}`}</Text>

                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{totalRealityInventory}</Text>

                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >
                        <Text>{totalDeviationAmount}</Text>
                        {/* <Text type="danger">456</Text> */}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
              columns={columns} style={{ width: '100%' }} dataSource={data} scroll={{ y: 500 }} />
          </div>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            ><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa sản phẩm</Button></Popconfirm></div>) : ('')
          }
          <div onClick={checkFinish} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            {/* <Form.Item style={{ marginTop: '1rem' }}> */}
            {/* <Button type="primary" danger>
                Hủy
              </Button>
            </Form.Item> */}
            <Form.Item style={{ marginLeft: '1rem', marginTop: '1rem' }}>
              <Button type="primary" htmlType="submit">
                Hoàn thành kiểm
              </Button>
            </Form.Item>
          </div>
        </div>
        <Modal
          title="Thêm nhanh sản phẩm"
          centered
          footer={null}

          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', }}>
              <img style={{ width: '5rem', height: '5rem' }} src={loading} alt="" />
            </div>
            <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Hệ thống đang xử lý dữ liệu phiếu kiểm</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', }}>Quý khách vui lòng chờ trong giây lát.</div>
            </div>
          </div>
        </Modal>
      </Form>
    </UI>
  );
}
