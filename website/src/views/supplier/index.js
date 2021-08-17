import UI from "../../components/Layout/UI";
import styles from "./../supplier/supplier.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { apiAllSupplier, apiSearch, apiUpdateSupplier } from "../../apis/supplier";
import { ACTION } from './../../consts/index'
import moment from 'moment';
import { apiDistrict, apiProvince } from "../../apis/information";
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Popconfirm, Switch, message, Tag, Radio, DatePicker, Form, Drawer, Select, notification, Input, Button, Table, Row, Col, Popover } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { apiFilterCity } from "../../apis/branch";
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Supplier() {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [supplier, setSupplier] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [locationSearch, setLocationSearch] = useState({})
  const { Search } = Input;
  const typingTimeoutRef = useRef(null);
  const apiSearchData = async (value) => {
    try {
      //    setLoading(true)
      setLoading(true)
      const res = await apiSearch({ keyword: value });

      if (res.status === 200) setSupplier(res.data.data)
      setLoading(false)
      //    setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
      //    setLoading(false)
    }
  };
  const apiSearchDateData = async (start, end) => {
    try {
      //    setLoading(true)
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end });
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        setSupplier(res.data.data)
      }
      setLoading(false)
      //    setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      setLoading(false)
      //    setLoading(false)
    }
  };
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(0)
    console.log(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
    console.log("---")
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '')
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
    apiSearchDateData(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value;
      apiSearchData(value);
    }, 300);
    // 
  };

  const [arrayUpdate, setArrayUpdate] = useState([])
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      supplierCode: <Link to="/actions/supplier/information/show/10" style={{ color: '#0019FF' }}>{`${i}HGN`}</Link>,
      supplierName: <Link to="/actions/supplier/information/show/10" style={{ color: '#0019FF' }}>{`An phát ${i}`}</Link>,
      email: <div>gmail@gmail.com</div>,
      phoneNumber: <div>{`038494349${i}`}</div>,
      address: <div>{`Kinh dương vương ${i}`}</div>,
      district: <div>{`Bình tân ${i}`}</div>,
      city: <div>{`Hồ Chí Minh ${i}`}</div>,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/supplier/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>,
      productview: (
        <Link to="/actions/supplier/view/show">
          <div className={styles["product_view"]}>Xem sản phẩm</div>
        </Link>
      ),
      // information: (
      //   <Link to="/actions/supplier/information/show">
      //     <IssuesCloseOutlined height="1rem" width="1rem" />
      //   </Link>
      // ),
    });
  }
  const apiAllSupplierData = async () => {
    try {
      //    setLoading(true)
      setLoading(true)
      const res = await apiAllSupplier();
      console.log(res)
      if (res.status === 200) {
        // const array = [];
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        setSupplier(res.data.data)
      }
      setLoading(false)

      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      //    setLoading(false)
    } catch (error) {
      setLoading(false)
      //    setLoading(false)
    }
  };
  const openNotificationDeleteSupplier = (data) => {
    notification.success({
      message: 'Thành công',
      description: data === 2 ? ('Vô hiệu hóa nhà cung cấp thành công.') : ('Kích hoạt nhà cung cấp thành công')
    });
  };
  const apiUpdateSupplierData = async (object, id, data) => {
    try {
      //    setLoading(true)
      setLoading(true)
      const res = await apiUpdateSupplier(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllSupplierData();
        openNotificationDeleteSupplier(data)
        setSelectedRowKeys([])
      }
      setLoading(false)
      // if (res.status === 200) {
      //   openNotification()
      //   history.push("/supplier/10")
      // } else {
      //   openNotificationError()
      // }
      // if (res.status === 200) setStatus(res.data.status);
      //    setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
      //    setLoading(false)
    }
  };
  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Nhà cung cấp đang hoạt động. Không thể thực hiện chức năng này.'
    });
  };
  const openNotificationDeleteSupplierError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Nhà cung cấp đang ở trạng thái vô hiệu hóa. Không thể thực hiện chức năng này.'
    });
  };
  function confirmActive(e) {
    console.log(e);
    // message.success('Click on Yes');
    supplier && supplier.length > 0 && supplier.forEach((values, index) => {
      selectedRowKeys && selectedRowKeys.length > 0 && selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active) {
            openNotificationDeleteSupplierErrorActive()
          } else {
            const object = {
              active: true,
            }
            apiUpdateSupplierData(object, values.supplier_id, 2)
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
    apiUpdateSupplierData(object, record.supplier_id, checked ? 1 : 2)
  }
  function cancelActive(e) {
    console.log(e);
    // message.error('Click on No');
  }
  function confirm(e) {
    console.log(e);
    // message.success('Click on Yes');
    supplier && supplier.length > 0 && supplier.forEach((values, index) => {
      selectedRowKeys && selectedRowKeys.length > 0 && selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active === false) {
            openNotificationDeleteSupplierError()
          } else {
            const object = {
              active: false,
            }
            apiUpdateSupplierData(object, values.supplier_id, 1)
          }
        }
      })
    })
  }

  function cancel(e) {
    console.log(e);
    // message.error('Click on No');
  }
  useEffect(() => {
    apiAllSupplierData();
  }, []);
  const content = (
    <div>
      <p>Gợi ý 1</p>
      <p>Gợi ý 2</p>
    </div>
  );
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

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    supplier && supplier.length > 0 && supplier.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })
    setArrayUpdate([...array])
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Gmail phải ở dạng @gmail.com.',
    });
  };
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        <div>Cập nhật thông tin nhà cung cấp <b>{data}</b> thành công</div>
    });
  };
  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin nhà cung cấp',
    });
  };
  const apiUpdateSupplierDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateSupplier(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllSupplierData()
        openNotificationUpdate(object.name)
        setSelectedRowKeys([])
        onCloseUpdate()
        onClose()
      } else {
        openNotificationErrorUpdate()
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
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (validateEmail(values.email)) {
          if (isNaN(values.phone)) {
            openNotificationRegisterFailMailRegex('Liên hệ')
          } else {
            if (regex.test(values.phone)) {
              const object = {
                name: values.name.toLowerCase(),
                // code: values.code.toLowerCase(),
                email: values.email,
                phone: values.phone,
                address: values && values.address ? values.address.toLowerCase() : '',
                ward: ' ',
                district: values.district.toLowerCase(),
                province: values.province.toLowerCase(),
                active: true
              }
              console.log(object)
              apiUpdateSupplierDataUpdate(object, values.supplier_id);
            } else {
              openNotificationRegisterFailMailRegex('Liên hệ')
            }
          }
        } else {
          openNotificationRegisterFailMail()
        }
      })
    } else {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (validateEmail(values.email)) {
          if (isNaN(values.phone)) {
            openNotificationRegisterFailMailRegex('Liên hệ')
          } else {
            if (regex.test(values.phone)) {
              const object = {
                name: values.name.toLowerCase(),
                // code: values.code.toLowerCase(),
                email: values.email,
                phone: values.phone,
                address: arrayUpdate[0] && arrayUpdate[0].address ? arrayUpdate[0].address.toLowerCase() : '',
                ward: ' ',
                district: arrayUpdate[0].district.toLowerCase(),
                province: arrayUpdate[0].province.toLowerCase(),
                active: true
              }
              console.log(object)
              apiUpdateSupplierDataUpdate(object, values.supplier_id);
            } else {
              openNotificationRegisterFailMailRegex('Liên hệ')
            }
          }
        } else {
          openNotificationRegisterFailMail()
        }
      })
    }
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };
  const dateFormat = 'YYYY/MM/DD';

  const onClickClear = async () => {
    await apiAllSupplierData()
    openNotificationClear()
    setValueSearch("")
    setClear(1)
    setCity("")
    setDistrictSelect("")
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }


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
  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "code",
      width: 150,
      render: (text, record) => <Link to={{
        pathname: '/actions/supplier/information/10', state: record
      }} style={{ color: '#0019FF' }}>{text}</Link>,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      width: 150,
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 150,
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: "Quận/huyện",
      dataIndex: "district",
      width: 150,
    },
    {
      title: "Tỉnh/thành phố",
      dataIndex: "province",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
    },

    // {
    //   title: "",
    //   dataIndex: "productview",
    //   width: 150,
    //   render: (text, record) => <Link to="/actions/supplier/view/10">
    //     <div className={styles["product_view"]}>Xem sản phẩm</div>
    //   </Link>
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} /> : <Switch onChange={(e) => onChangeSwitch(e, record)} />
    },
    // {
    //   title: "",
    //   dataIndex: "information",
    //   width: 150,
    // },
  ];
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
  const searchByLocation = async (key, val) => {
    try {
      const res = await apiSearch({ ...locationSearch, [key]: val })
      if (res.status == 200) {
        setSupplier(res.data.data)
        setLocationSearch({ ...locationSearch, [key]: val })
      }
    } catch (e) {
      console.log(e);
    }
  }
  const [districtMain, setDistrictMain] = useState([])

  const [provinceMain, setProvinceMain] = useState([])
  const apiSearchProvinceData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ province: value });

      if (res.status === 200) setSupplier(res.data.data)
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

      if (res.status === 200) setSupplier(res.data.data)
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
      await apiAllSupplierData()
    }
  }
  const [districtSelect, setDistrictSelect] = useState('')
  const handleChangeDistrict = async (value) => {
    console.log(`selected ${value}`);
    setDistrictSelect(value)
    if (value !== 'default') {
      apiSearchDistrictData(value)
    } else {
      await apiAllSupplierData()
    }
  }
  return (
    <UI>
      <div className={styles["supplier_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(241, 236, 236)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["supplier_manager_title"]}>Quản lý nhà cung cấp</div>
          <Link to="/actions/supplier/add/10">
            <Button
              className={styles["supplier_manager_search_right"]}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Thêm nhà cung cấp
            </Button>
          </Link>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>

            <div style={{ width: '100%' }}>

              <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                placeholder="Tìm kiếm theo mã, theo tên" allowClear />
            </div>

          </Col>

          <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
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
          <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
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
          <Col style={{ width: '100%', marginTop: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div>
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
          <Table
            rowKey="_id"
            rowSelection={rowSelection}
            bordered
            columns={columns}
            dataSource={supplier}
            loading={loading}
            scroll={{ y: 500 }}
          />
        </div>

      </div>

      <Drawer
        title="Cập nhật thông tin nhà cung cấp"
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

                // form={form}
                layout="vertical"
                initialValues={values}

              >
                <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {
                    obj.map((data) => {
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

                              {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên nhà cung cấp</div>
                              <InputName />
                              {/* </Form.Item> */}
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

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'email') {
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
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Email</div>

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
                    })
                  }
                </Row>

              </Form>

            )
          })
        }
      </Drawer>

      <Drawer
        title="Cập nhật thông tin nhà cung cấp"
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

                  // form={form}
                  layout="vertical"
                  initialValues={values}

                >
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      obj.map((data) => {
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

                                {/* <Form.Item
  
                                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                  name="phone"
                                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                > */}
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên nhà cung cấp</div>

                                <InputName />
                                {/* </Form.Item> */}
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

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }

                        if (data === 'email') {
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
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Email</div>

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
