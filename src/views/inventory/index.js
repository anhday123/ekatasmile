import UI from "./../../components/Layout/UI";
import styles from "./../inventory/inventory.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ACTION } from './../../consts/index'
import moment from 'moment';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { Popconfirm, message, Switch, Drawer, Tag, Radio, Form, Input, InputNumber, Button, Row, notification, Col, DatePicker, Popover, Select, Table, Modal } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { apiAllInventory, apiSearch, apiUpdateInventory } from "../../apis/inventory";
import { apiDistrict, apiProvince } from "../../apis/information";
import { apiFilterCity } from "../../apis/branch";
const { Option } = Select;
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
const { RangePicker } = DatePicker;
const { Search } = Input;
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
export default function Inventory() {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [searchQuery, setSearchQuery] = useState({})
  const [modal2Visible, setModal2Visible] = useState(false)
  const [inventory, setInventory] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const openNotificationDelete = (data) => {
    notification.success({
      message: 'Thành công',
      description: data === 2 ? ('Vô hiệu hóa kho thành công.') : ('Kích hoạt kho thành công')
    });
  };
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        <div>Cập nhật thông tin kho <b>{data}</b> thành công</div>
    });
  };
  const openNotificationUpdateError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin kho.',
    });
  };
  const apiUpdateInventoryData = async (object, id, data) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiUpdateInventory(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllInventoryData()
        setSelectedRowKeys([])
        openNotificationDelete(data)
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Kho đang hoạt động. Không thể thực hiện chức năng này.'
    });
  };
  const openNotificationDeleteSupplierError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Kho đang ở trạng thái vô hiệu hóa. Không thể thực hiện chức năng này.'
    });
  };

  function confirmActive(e) {
    console.log(e);
    inventory && inventory.length > 0 && inventory.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active) {
            openNotificationDeleteSupplierErrorActive()
          } else {
            const object = {
              active: true
            }
            apiUpdateInventoryData(object, values.warehouse_id, 2)
          }
        }
      })
    })
  }
  const [valueSwitch, setValueSwitch] = useState(false)
  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`);
    setValueSwitch(checked)
    const object = {
      active: checked
    }
    apiUpdateInventoryData(object, record.warehouse_id, checked ? 1 : 2)
  }
  function cancelActive(e) {
    console.log(e);

  }
  function confirm(e) {
    console.log(e);
    inventory && inventory.length > 0 && inventory.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active === false) {
            openNotificationDeleteSupplierError()
          } else {
            const object = {
              active: false
            }
            apiUpdateInventoryData(object, values.warehouse_id, 1)
          }
        }
      })
    })
  }

  function cancel(e) {
    console.log(e);

  }
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end });
      console.log(res)
      if (res.status === 200) setInventory(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ keyword: value });
      console.log(res)
      if (res.status === 200) setInventory(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const typingTimeoutRef = useRef(null);
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const { value, name } = e.target;
      apiSearchData(value);
    }, 300);
    // 
  };
  function formatCash(str) {
    console.log(str)
    console.log("|||000")
    if (isNaN(str) || str.length === 0) {
      return 0;
    } else {
      return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
      })
    }
  }

  const dateFormat = 'YYYY/MM/DD';
  const columnsPromotion = [
    {
      title: 'Mã kho',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => <Link to={{ pathname: "/actions/inventory/view/7", state: record }}>{text}</Link>
    },
    {
      title: 'Tên kho',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: 'Loại kho',
      dataIndex: 'type',
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
      title: 'Phí duy trì tháng',
      dataIndex: 'monthly_cost',
      width: 150,
      render: (text, record) => <div>{`${formatCash(String(text))} VNĐ`}</div>
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
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => <Switch checked={text} onChange={(e) => onChangeSwitch(e, record)} />
    },
  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      inventoryCode: <Link to="/actions/inventory/view/10" style={{ color: '#2400FF' }}>GH {i}</Link>,
      inventoryName: `Văn Tỷ ${i}`,
      inventoryType: `Kho riêng ${i}`,
      phoneNumber: '0384943497',
      size: i,
      district: 'Bình Tân',
      city: 'Hồ Chí Minh',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/inventory/view/10"><ExclamationCircleOutlined style={{ fontSize: '1.25rem', marginRight: '0.5rem', cursor: 'pointer', color: '#096E00' }} /></Link>
        <Link to="/actions/inventory/update/10" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);

  const apiAllInventoryData = async () => {
    try {
      // dispatch({ type: ACTION.LOADING, data: true });
      setLoading(true)
      const res = await apiAllInventory();
      console.log(res)
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        setInventory(res.data.data)
      }
      setLoading(false)
      // if (res.status === 200) setUsers(res.data);
      // dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {
      setLoading(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllInventoryData();
  }, []);
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  var currentDate = moment().format();
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  };
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  };

  const [arrayUpdate, setArrayUpdate] = useState([])
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    inventory && inventory.length > 0 && inventory.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })
    console.log(array)
    console.log("|||113")
    setArrayUpdate([...array])
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin kho thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin kho.',
    });
  };
  // const apiUpdateInventoryDataMain = async (object) => {
  //   try {
  //     dispatch({ type: ACTION.LOADING, data: true });
  //     // console.log(value);
  //     const res = await apiUpdateInventory(object, state.warehouse_id);
  //     console.log(res);
  //     if (res.status === 200) {
  //       openNotification()
  //       // history.push("/inventory/7");
  //     } else {
  //       openNotificationError()
  //     }
  //     // if (res.status === 200) setStatus(res.data.status);
  //     dispatch({ type: ACTION.LOADING, data: false });
  //     // openNotification();
  //     // history.push(ROUTES.NEWS);
  //   } catch (error) {
  //     console.log(error);
  //     dispatch({ type: ACTION.LOADING, data: false });
  //   }
  // };
  const openNotificationErrorFormat = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số`,
    });
  };
  const warehouseSearch = async (key, val) => {
    try {
      setLoading(true)
      const res = await apiSearch({ ...searchQuery, [key]: val })
      if (res.data.success) {
        setInventory(res.data.data)
        setSearchQuery({ ...searchQuery, [key]: val })
      }
      setLoading(false)
    }
    catch (e) {
      console.log(e);
      setLoading(false)
    }
  }
  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [dataCheck, setDataCheck] = useState(0)
  var countCheck = 0;
  const apiUpdateInventoryDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await apiUpdateInventory(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllInventoryData()
        setSelectedRowKeys([])

        onClose()
        openNotificationUpdate(object.name)
        onCloseUpdate()

      } else {
        openNotificationUpdateError()
      }

      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      console.log(arrayUpdate)
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone)) {
          if (isNaN(values.phone)) {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        } else {
          if (regex.test(values.phone)) {
            const object = {
              // code: values.code.toLowerCase(),
              name: values.name.toLowerCase(),
              type: values.type.toLowerCase(),
              phone: values.phone,
              capacity: values.capacity,
              monthly_cost: values && values.monthly_cost ? values.monthly_cost : '',
              address: values.address.toLowerCase(),
              ward: values.ward.toLowerCase(),
              district: values.district.toLowerCase(),
              province: values.province.toLowerCase()
            }
            console.log(object);
            apiUpdateInventoryDataUpdate(object, values.warehouse_id)
          } else {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        }
      })
    } else {
      console.log(arrayUpdate)
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone)) {
          if (isNaN(values.phone)) {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        } else {
          if (regex.test(values.phone)) {
            const object = {
              // code: values.code.toLowerCase(),
              name: values.name.toLowerCase(),
              type: arrayUpdate[0].type.toLowerCase(),
              phone: values.phone,
              capacity: arrayUpdate[0].capacity,
              monthly_cost: arrayUpdate[0] && arrayUpdate[0].monthly_cost ? arrayUpdate[0].monthly_cost : '',
              address: arrayUpdate[0].address.toLowerCase(),
              ward: arrayUpdate[0].ward.toLowerCase(),
              district: arrayUpdate[0].district.toLowerCase(),
              province: arrayUpdate[0].province.toLowerCase()
            }
            console.log(object);
            apiUpdateInventoryDataUpdate(object, values.warehouse_id)
          } else {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        }
      })
    }
  };

  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };

  const onClickClear = async () => {
    await apiAllInventoryData()
    openNotificationClear()
    setClear(1)
    setCity("")
    setDistrictSelect("")
    setValueSearch("")
    setInventoryTypeValue("")
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  const onChangeRadio = e => {
    console.log('radio checked', e.target.value);

  };
  // data.city = province && province.length > 0 ? province[province.length - 2].province_name : '';
  // data.district = district && district.length > 0 ? district[district.length - 2].district_name : '';
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }
  const [inventoryTypeValue, setInventoryTypeValue] = useState("")
  const onChangeInventoryTypeValue = (e) => {
    console.log(e)
    if (e === '' || e === ' ' || e === 'default') {
      apiAllInventoryData()
    } else {
      apiSearchData(e)
      setInventoryTypeValue(e)
    }

  }
  const [districtMain, setDistrictMain] = useState([])

  const [provinceMain, setProvinceMain] = useState([])

  const apiSearchProvinceData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ province: value });

      if (res.status === 200) setInventory(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const apiSearchDistrictData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ district: value });

      if (res.status === 200) setInventory(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const [city, setCity] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    setCity(value)
    if (value !== 'default') {
      apiSearchProvinceData(value)
    } else {
      await apiAllInventoryData()
    }
  }
  const [districtSelect, setDistrictSelect] = useState('')
  const handleChangeDistrict = async (value) => {
    console.log(`selected ${value}`);
    setDistrictSelect(value)
    if (value !== 'default') {
      apiSearchDistrictData(value)
    } else {
      await apiAllInventoryData()
    }
  }
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Quản lý kho</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/inventory/add/7">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm kho</Button>
            </Link>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            {/* <Popover placement="bottomLeft" content={content} trigger="click"> */}
            <div style={{ width: '100%' }}>
              <Input style={{ width: '100%' }} enterButton name="name" value={valueSearch} onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                placeholder="Tìm kiếm theo mã, theo tên" allowClear />
            </div>
            {/* </Popover> */}
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            {/* <Popover placement="bottomLeft" content={content} trigger="click"> */}
            <div style={{ width: '100%' }}>
              <RangePicker
                // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={onChangeDate}
              />
            </div>
            {/* </Popover> */}
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} value={inventoryTypeValue ? inventoryTypeValue : 'default'} placeholder="Chọn loại kho" onChange={onChangeInventoryTypeValue}>
                <Option value="default">Chọn loại kho</Option>
                <Option value="chung">Chung</Option>
                <Option value="riêng">Riêng</Option>
                <Option value="dịch vụ">Dịch vụ</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>

              <Select showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"


                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={city ? city : 'default'} onChange={(event) => { handleChange(event); handleChangeCity(event) }}>
                <Option value="default">Tất cả tỉnh/thành phố</Option>
                {
                  province && province.length > 0 && province.map((values, index) => {
                    return (
                      <Option value={values.province_name}>{values.province_name}</Option>
                    )
                  })
                }
              </Select>

            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>

              <Select showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"


                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={districtSelect ? districtSelect : 'default'} onChange={handleChangeDistrict}>
                <Option value="default">Tất cả quận/huyện</Option>
                {
                  districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                    return (
                      <Option value={values.district_name}>{values.district_name}</Option>
                    )
                  })) : (district && district.length > 0 && district.map((values, index) => {
                    return (
                      <Option value={values.district_name}>{values.district_name}</Option>
                    )
                  }))
                }
              </Select>

            </div>
          </Col>

        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Radio.Group style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', width: '100%' }} >
              <Radio onClick={showDrawerUpdate} value={1}>Cập nhật hàng loạt</Radio>
              <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio>
            </Radio.Group>
          ) : ('')
        }
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowKey="_id" loading={loading} bordered rowSelection={rowSelection} columns={columnsPromotion} dataSource={inventory} scroll={{ y: 500 }} />
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

      <Drawer
        title="Cập nhật thông tin kho"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(1)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            return (

              <Form
                style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                className={styles["supplier_add_content"]}
                onFinish={onFinish}
                // form={form}
                layout="vertical"
                initialValues={values}
                onFinishFailed={onFinishFailed}
              >
                <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {
                    obj.map((data) => {
                      if (data === 'phone') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>
                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'name') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên kho</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'address') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Địa chỉ</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'type') {
                        const InputName = () => <Select style={{ width: '100%' }} defaultValue={values[data]}
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] =
                              event;
                          }}>
                          <Option value="chung">Chung</Option>
                          <Option value="riêng">Riêng</Option>
                          <Option value="dịch vụ">Dịch vụ</Option>
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Loại kho</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'province') {
                        const InputName = () => <Select defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"


                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] =
                              event; handleChangeCity(event)
                          }}>
                          {
                            province && province.length > 0 && province.map((values, index) => {
                              return <Option value={values.province_name}>{values.province_name}</Option>
                            })
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tỉnh/thành phố</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'district') {
                        const InputName = () => <Select defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"


                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] =
                              event;
                          }}>
                          {
                            districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                              return (
                                <Option value={values.district_name}>{values.district_name}</Option>
                              )
                            })) : (district && district.length > 0 && district.map((values, index) => {
                              return (
                                <Option value={values.district_name}>{values.district_name}</Option>
                              )
                            }))
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Quận/huyện</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'monthly_cost') {
                        const InputName = () => <InputNumber
                          style={{ width: '100%' }} defaultValue={values[data]}
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;

                            arrayUpdate[index][data] =
                              isNaN(event) ? 0 : event === 0 ? 0 : event;
                          }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        // onChange={onChange}
                        />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Phí duy trì tháng</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }


                    })
                  }
                </Row>

              </Form>

            )
          })
        }
      </Drawer>

      <Drawer
        title="Cập nhật thông tin kho"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(2)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            if (index === 0) {
              return (

                <Form
                  style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                  className={styles["supplier_add_content"]}
                  onFinish={onFinish}
                  // form={form}
                  layout="vertical"
                  initialValues={values}
                  onFinishFailed={onFinishFailed}
                >
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      obj.map((data) => {
                        if (data === 'phone') {
                          const InputName = () => <Input disabled defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>
                                <InputName />
                                {/* </Form.Item> */}
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'name') {
                          const InputName = () => <Input disabled defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên kho</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'address') {
                          const InputName = () => <Input defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Địa chỉ</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'type') {
                          const InputName = () => <Select style={{ width: '100%' }} defaultValue={values[data]}
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] =
                                event;
                            }}>
                            <Option value="chung">Chung</Option>
                            <Option value="riêng">Riêng</Option>
                            <Option value="dịch vụ">Dịch vụ</Option>
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Loại kho</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'province') {
                          const InputName = () => <Select defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] =
                                event; handleChangeCity(event)
                            }}>
                            {
                              province && province.length > 0 && province.map((values, index) => {
                                return <Option value={values.province_name}>{values.province_name}</Option>
                              })
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tỉnh/thành phố</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'district') {
                          const InputName = () => <Select defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] =
                                event;
                            }}>
                            {
                              districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>{values.district_name}</Option>
                                )
                              })) : (district && district.length > 0 && district.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>{values.district_name}</Option>
                                )
                              }))
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Quận/huyện</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'monthly_cost') {
                          const InputName = () => <InputNumber
                            style={{ width: '100%' }} defaultValue={values[data]}
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;

                              arrayUpdate[index][data] =
                                isNaN(event) ? 0 : event === 0 ? 0 : event;
                            }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          // onChange={onChange}
                          />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Phí duy trì tháng</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }


                      })
                    }
                  </Row>

                </Form>

              )
            }
          })
        }
      </Drawer>

    </UI>
  );
}
