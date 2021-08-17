import UI from "./../../components/Layout/UI";
import styles from "./../customer/customer.module.scss";
import React, { useEffect, useState } from "react";
import { Switch, message, Input, Button, Row, Col, DatePicker, Select, Table, Modal, Popover, notification, Radio } from "antd";
import {
  Link,
} from "react-router-dom";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getCustomer, updateCustomer } from "../../apis/customer";
import CustomerInfo from "./components/customerInfo";
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
export default function Promotion() {
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const [tableLoading, setTableLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [infoCustomer, setInfoCustomer] = useState({})
  const [customerFilter, setCustomerFilter] = useState({ search: '', date: [], category: undefined })
  const onSearch = (value) => {
    getAllCustomer({ keyword: value })
    changeFilter('search', value)
  }
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    getAllCustomer({ from_date: dateStrings[0], to_date: dateStrings[1] })
    changeFilter('date', [moment(dateStrings[0]), moment(dateStrings[1])])
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
  }
  function handleChange(value) {
    getAllCustomer({ type: value })
    changeFilter('category', value)
  }
  const changeActiveCustomer = async (id, status) => {
    try {
      const res = await updateCustomer(id, { active: status })
      if (res.status === 200) {
        if (status) {
          notification.success({ message: "Kích hoạt khách hàng thành công" })
        }
        else {
          notification.success({ message: "Vô hiệu hóa khách hàng thành công" })
        }
      }
    }
    catch (e) {
      console.log(e);
      notification.error({ message: "Thay thay đổi trạng thái thất bại" })
    }
  }
  const changeFilter = (key, val) => {
    setCustomerFilter(e => { return { ...e, [key]: val } })
  }
  const columnsPromotion = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return ((pagination.page - 1) * pagination.size) + index + 1
      }
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'code',
      width: 150,
      render(data, record) {
        return <span style={{ color: '#42a5f5', cursor: 'pointer' }} onClick={() => { setInfoCustomer(record); modal2VisibleModal(true) }}>{data}</span>
      }
    },
    {
      title: 'Tên khách hàng',
      width: 150,
      render(data) {
        return data.first_name + " " + data.last_name
      }
    },
    {
      title: 'Loại khách hàng',
      dataIndex: 'type',
      width: 150,
      render(data) {
        if (data && data.toUpperCase() == 'POTENTIAL') {
          return 'Tiềm năng'
        }
        else
          return 'Vãng lai'
      }
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      width: 150,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      width: 150,
      render(data) {
        return data && moment(data).format('L')
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: 'active',
      width: 120,
      fixed: 'right',
      render(data, record) {
        return <Switch defaultChecked={data} onChange={(e) => changeActiveCustomer(record.customer_id, e)} />
      }
    }
    // {
    //   title: 'Action',
    //   // dataIndex: 'action',
    //   width: 100,
    //   render(data) {
    //     return <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
    //       <Link to={{ pathname: "/actions/customer/update/12", state: data }} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>

    //     </div>
    //   }
    // },
  ];
  const changePagi = (page, size) => setPagination({ page, size })

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/customer/view/12" style={{ color: '#2400FF' }}>GH {i}</Link>,
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
        <Link to="/actions/customer/update/12" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
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
  const getAllCustomer = async (params) => {
    setTableLoading(true)
    try {
      const res = await getCustomer({ ...params, page: pagination.page, page_size: pagination.size })

      if (res.status === 200 && res.data.success) {
        setCustomerList(res.data.data)
        setTableLoading(false)
      }
    } catch (e) {
      console.log(e);
      setTableLoading(false)
    }
  }
  const handleSearch = (value) => {
    const tmpValue = customerList.filter(e => e.code.toLowerCase().includes(value.toLowerCase()) || `${e.first_name} ${e.last_name}`.toLowerCase().includes(value.toLowerCase()))
    // if(value === ''){

    // }
    // else
    setOptions(
      !tmpValue.length
        ? []
        : tmpValue.map(e => { return { value: e.code } }),
    );
  };

  const handleKeyPress = (ev) => {
    console.log('handleKeyPress', ev);
  };

  const onSelect = (value) => {
    console.log('onSelect', value);
  };
  const clearFilter = () => {
    getAllCustomer()
    setCustomerFilter({ search: '', date: [], category: undefined })
  }
  useEffect(() => {
    getAllCustomer()
  }, [])
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Quản lý khách hàng</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/customer/add/12">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm khách hàng</Button>
            </Link>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Input
              placeholder="Tìm kiếm theo tên"
              value={customerFilter.search}
              onChange={e => { onSearch(e); changeFilter('search', e.target.value) }}
            />
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                value={customerFilter.date}
                onChange={onChange}
              />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Lọc theo khách hàng" value={customerFilter.category} onChange={handleChange}>
                <Option value="POTENTIAL">Khách hàng tiềm năng</Option>
                <Option value="VANGLAI">Khách hàng vãng lai</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }} justify="end">
          <Button onClick={clearFilter} type="primary">Xóa bộ lọc</Button>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }}>
          {
            selectedRowKeys && selectedRowKeys.length > 0 && (<Radio.Group>
              <Radio value={0}>Cập nhật hàng loạt</Radio>
              <Radio value={1}> Cập nhật riêng lẻ</Radio>
            </Radio.Group>)
          }
        </Row>


        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowSelection={rowSelection} rowKey="_id" loading={tableLoading} pagination={{ onChange: changePagi }} columns={columnsPromotion} dataSource={customerList} scroll={{ y: 500 }} />
        </div>
        {/* {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '7.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Xóa khách hàng</Button></Popconfirm></div>) : ('')
        } */}
      </div>
      <CustomerInfo visible={modal2Visible} onCancel={() => modal2VisibleModal(false)} infoCustomer={infoCustomer} />
    </UI>
  );
}
