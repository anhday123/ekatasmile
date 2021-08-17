import UI from "./../../../components/Layout/UI";
import styles from "./../function-shortcut/function-shortcut.module.scss";
import product from "./../../../assets/img/product.png";
import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  PlusCircleOutlined,
  AudioOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Select,
  Button,
  Table,
  Checkbox,
  Input,
  Tooltip,
  DatePicker,
  Popover,
  Space,
  Row,
  Modal,
  Form,
  Col,
  Radio,
} from "antd";
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode', width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName', width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit', width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity', width: 150,
  },
  {
    title: 'Đơn giá',
    dataIndex: 'bill', width: 150,
  },
  {
    title: 'Thành tiền',
    dataIndex: 'moneyTotal', width: 150,
  },
  {
    title: '',
    dataIndex: 'actions', width: 150,
  },
];

const data = [];

const data2 = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: `${i}`,
    skuCode: `PNH ${i}`,
    productName: `sản phẩm ${i}`,
    unit: `${i} cái`,
    quantity: 'UI là input nhập vào nhưng để tạm này nha, có API xử lý sau',
    bill: ` ${i}00.000 VNĐ`,
    moneyTotal: `${i}00.000 VNĐ`,
    actions: <div><DeleteOutlined /></div>
  });
}
for (let i = 0; i < 46; i++) {
  data2.push({
    key: i,
    stt: `${i} Bill 2`,
    skuCode: `PNH ${i} Bill 2`,
    productName: `sản phẩm ${i} Bill 2`,
    unit: `${i} cái Bill 2`,
    quantity: 'UI là input nhập vào nhưng để tạm này nha, có API xử lý sau Bill 2',
    bill: ` ${i}00.000 VNĐ Bill 2`,
    moneyTotal: `${i}00.000 VNĐ Bill 2`,
    actions: <div><DeleteOutlined /></div>
  });
}
const { Option } = Select;
export default function Sell() {
  const [selectedRowKeys, setSelectedRowKey] = useState([]);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [formatMoney, setFormatMoney] = useState('');
  const [modal3Visible, setModal3Visible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { Search } = Input;
  const [status, setStatus] = useState(0);
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );
  const FunctionShortcut = (e) => {
    const { value } = e.target;
    const format = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setFormatMoney(format);
  }
  const onSearch = (value) => console.log(value);

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKey(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const [billQuantity, setBillQuantity] = useState(0)
  const onClickCreateBill = () => {
    if (billQuantity >= 2) {
      alert('Tạm thời chỉ setup sẵn 2 bill mà thôi!!!')
    } else {
      var temp = billQuantity;
      temp++;
      setBillQuantity(temp)
    }
  }
  const onClickStatus = (data) => {
    setStatus(data);
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const setModal2VisibleFunc = (modal2Visible) => {
    setModal2Visible(modal2Visible);
  };
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible);
  };
  const onFinishModal = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailedModal = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  const content = (
    <div className={styles['popover']}>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const contentFormatMoney = (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      <div style={{ color: 'black', fontWeight: '600' }}>{formatMoney ? `${formatMoney} VNĐ` : `0 VNĐ`}</div>
    </div>
  );
  return (
    <>

      <div onClick={() => modal3VisibleModal(true)}>
        <div
          className={
            styles["sell_manager_title_row_col_child_name"]
          }
        >
          {/* <div>
                          <HomeOutlined
                            style={{
                              fontSize: "1.25rem",
                              color: "white",
                              fontWeight: "600",
                            }}
                          />
                        </div> */}
          <div
            className={
              styles[
              "sell_manager_title_row_col_child_name_support"
              ]
            }
          >
            Phím tắt hỗ trợ
          </div>
        </div>
      </div>


      <Modal
        title="Phím tắt chức năng"
        centered
        width={700}
        footer={null}
        visible={modal3Visible}
        onOk={() => modal3VisibleModal(false)}
        onCancel={() => modal3VisibleModal(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F1:</b> Thêm hóa đơn mới
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F10:</b> Quét mã vạch cân điện tử
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F2:</b> Bật/tắt chế độ in tự động
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F11:</b> Toàn màn hình
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F3:</b> Tìm sản phẩm
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>Home:</b> thay đổi số lượng sản phẩm
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F4:</b> Tìm khách hàng
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}><ArrowUpOutlined />:</b> Tăng số lượng sản phẩm
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F5:</b> Thanh toán
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}><ArrowDownOutlined />:</b> Giảm số lượng sản phẩm
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F6:</b> Thay đổi chế độ nhập số lượng
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F6:</b> Enter: di chuyển xuống sản phẩm tiếp theo
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>F8:</b> Khách thanh toán
            </Col>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <b style={{ marginRight: '0.25rem' }}>Shjft:</b> di chuyển lên sản phẩm tiếp theo
            </Col>
          </Row>
        </div>
      </Modal>

    </ >
  );
}
