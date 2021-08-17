import UI from "../../components/Layout/UI";
import styles from "./../shipping-product/shipping-product.module.scss";
import React, { useEffect, useState } from "react";
import { Input, Button, Row, Col, DatePicker, Select, Table, Modal, Popover } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getDelivery } from "../../apis/delivery";
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
export default function ShippingProduct() {
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [deliveryList, setDelivery] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const columns = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return ((page - 1) * pageSize) + index + 1
      }
    },
    {
      title: 'Tên khách hàng',
      dataIndex: '_creator',
      width: 150,
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'creator',
      width: 150,
      render(data) {
        return data.user_id
      }
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'customerType',
      width: 150,
    },
    {
      title: 'Liên hệ',
      dataIndex: 'creator',
      width: 150,
      render(data) {
        return data.phone
      }
    },
  ];
  const changePage = (page, pageSize) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const getAllDelivery = async (params) => {
    try {
      setLoading(true)
      const res = await getDelivery(params)
      if (res.status == 200) {
        setDelivery(res.data.data)
      }
      setLoading(false)
    } catch (e) {
      console.log(e);
      setLoading(false)
    }
  }

  const onSearch = (value) => {
    getAllDelivery({ keyword: value })
  };
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    getAllDelivery({ 'from_date': dateStrings[0], 'to_date': dateStrings[1] })
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
    getAllDelivery({ create_date: dateString })

  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const columnsPromotion = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return ((page - 1) * pageSize) + index + 1
      }
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: 'Chi nhánh chuyển',
      dataIndex: 'from',
      width: 150,
      render(data) {
        return data.name
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render(data, record) {
        switch (data) {
          case 'PROGRESSING': {
            return <div onClick={() => onClickStatus(record)} style={{ color: '#FF9D0A', fontWeight: '600', cursor: 'pointer' }}>Chờ chuyển</div>
          }
          case "SHIPPING": {
            return <div onClick={() => onClickStatus(record)} style={{ color: 'rgba(47, 155, 255, 1)', fontWeight: '600', cursor: 'pointer' }}>Đang chuyển</div>
          }
          case 'CANCEL': {
            return <div onClick={() => onClickStatus(record)} style={{ color: '#ff7875', fontWeight: '600', cursor: 'pointer' }}>Đang hủy</div>
          }
          case 'CANCEL_FINISH': {
            return <div onClick={() => onClickStatus(record)} style={{ color: 'red', fontWeight: '600', cursor: 'pointer' }}>Đã Hủy</div>
          }
          case 'COMPLETE': {
            return <div onClick={onClickStatus(record)} style={{ color: 'rgba(26, 184, 0, 1)', fontWeight: '600', cursor: 'pointer' }}>Hoàn thành</div>
          }
        }
      }
    },
    {
      title: 'Chi nhánh nhận',
      dataIndex: 'to',
      width: 150,
      render(data) {
        return data.name
      }
    },
    {
      title: 'Ngày chuyển',
      dataIndex: 'create_date',
      width: 150,
      render(data) {
        return moment(data).format('DD-MM-YYYY hh:mm')
      }
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'dateReceive',
      width: 150,
    },
    {
      title: 'Nhân viên tạo',
      dataIndex: '_creator',
      width: 150,
    },
  ];
  const onClickStatus = (data) => {
    history.push({ pathname: '/actions/shipping-product/update/9', state: data })
    // alert('Chưa có API nên để thông báo này')
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
  useEffect(() => {
    getAllDelivery()
  }, [])
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Quản lý chuyển hàng</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/shipping-product/add/9">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Tạo phiếu chuyển hàng</Button>
            </Link>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>

            <div style={{ width: '100%' }}>
              <Search
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
                allowClear
              /></div>
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
              <Select style={{ width: '100%' }} placeholder="Lọc phiếu chuyển" onChange={handleChange}>
                <Option value="ticket1">Phiếu chuyển 1</Option>
                <Option value="ticket2">Phiếu chuyển 2</Option>
                <Option value="ticket3">Phiếu chuyển 3</Option>
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
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowSelection={rowSelection} loading={loading} columns={columnsPromotion} rowKey="_id" pagination={{ onChange: changePage }} dataSource={deliveryList} scroll={{ y: 500 }} />
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
            </div></Popover>
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
