import UI from "../../../../components/Layout/UI";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useParams,
  useHistory,
  useLocation
} from "react-router-dom";
import { apiAllEmployee, apiFilterRoleEmployee, apiUpdateEmployee } from "../../../../apis/employee";
import { apiAllRole, apiSearch, updateUser } from "../../../../apis/user";
import { apiFilterCity, getAllBranch } from "../../../../apis/branch";
import { apiDistrict, apiProvince } from "../../../../apis/information";
import styles from "./../view/view.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ACTION, } from './../../../../consts/index'
import { ExportCSV } from './../../../../components/ExportCSV/ExportCSV'
import { apiAllProduct, } from "../../../../apis/product";
import { useDispatch } from 'react-redux'
import moment from 'moment';
import { Popconfirm, Switch, message, Select, Tag, Radio, Form, Button, Input, Row, Col, Popover, Drawer, Collapse, Table, Space, notification, DatePicker, Modal, Typography } from "antd";
import { ArrowLeftOutlined, PlusCircleOutlined, FileImageOutlined, CheckOutlined, DeleteOutlined, AudioOutlined, FileExcelOutlined, EditOutlined, WarningOutlined } from "@ant-design/icons";
import { logoutAction } from "../../../../actions/login";
export default function BranchView(propsData) {
  const state = propsData.location.state;
  const history = useHistory()
  console.log(state)
  console.log("|||123456999")
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modal3Visible, setModal3Visible] = useState(false)
  let { slug2 } = useParams();
  const [visible, setVisible] = useState(false)
  const { Panel } = Collapse;
  const { Option } = Select;
  const [product, setProduct] = useState([])
  const dispatch = useDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { RangePicker } = DatePicker;
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const { Text } = Typography;
  function onChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function callback(key) {
    console.log(key);
  }
  const contentImage = (data) => {
    return (
      <div>
        <img src={data} style={{ width: '25rem', height: '14.5rem', objectFit: 'contain' }} alt="" />
      </div>
    )
  }
  const contentProduct = (url) => {
    return (
      <img style={{ width: '35rem', height: '30rem', objectFit: 'contain' }} src={url} alt="" />
    )
  }
  function formatCash(str) {
    return str.split('').reverse().reduce((prev, next, index) => {
      return ((index % 3) ? next : (next + ',')) + prev
    })
  }

  const columnsAddProduct = [
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
    // {
    //   title: "Số lượng",
    //   dataIndex: "productquantity",
    //   width: 150,
    // },
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

  const data = [];
  const content = (
    <div className={styles['shadow']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center' }}>Số lượng báo động: 10</div>
  );
  const contentAttention = (
    <div className={styles['shadow']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', textAlign: 'center', color: 'red' }}>Số lượng báo động: 20</div>
  );
  const dataAddProduct = [];
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
      //   {/* <div style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div> */}
      //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      // </div>
    });
  }
  for (let i = 0; i < 46; i++) {
    dataAddProduct.push({
      key: i,
      stt: i,
      productcode: <div>{i}</div>,
      productname: `tên sản phẩm ${i}`,
      productpicture: <FileImageOutlined />,
      productprice: `${i} VNĐ`,
      producttype: "Quà lưu niệm",
      // productquantity: <div>
      //   {
      //     `cho nay la input`
      //   }
      // </div>,
      supplier: 'An Phát',
      // action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      //   <div style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
      //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      // </div>
    });
  }
  function onChangeDateAlone(date, dateString) {
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
  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );
  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      branchCode: <Link to="/actions/branch/view" style={{ color: '#2400FF' }}>CN {i}</Link>,
      branchName: <Link to="/actions/branch/view" style={{ color: '#2400FF' }}>Chi nhánh {i}</Link>,
      address: `Địa chỉ ${i}`,
      district: `Bình thạnh ${i}`,
      city: `Hồ chí minh ${i}`,
      branchDefault: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{i === 2 ? (<CheckOutlined style={{ color: '#0400DE', fontSize: '1.5rem' }} />) : ('')}</div>,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/customer/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }


  const columnsEmployee = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 150,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      width: 150,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      width: 150,
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      width: 150,
    },
    {
      title: "Chi nhánh",
      dataIndex: "branch",
      width: 150,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDay",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "Liên hệ",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
    },
    {
      title: "Quận/huyện",
      dataIndex: "district",
      width: 150,
    },

    {
      title: "Tỉnh/thành phố",
      dataIndex: "city",
      width: 150,
    },
    {
      title: "Tên công ty",
      dataIndex: "workPlace",
      width: 150,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ];
  const columnsEmployeeModal = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 150,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      width: 150,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      width: 150,
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      width: 150,
    },
    {
      title: "Chi nhánh",
      dataIndex: "branch",
      width: 150,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDay",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "Liên hệ",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
    },
    {
      title: "Quận/huyện",
      dataIndex: "district",
      width: 150,
    },

    {
      title: "Tỉnh/thành phố",
      dataIndex: "city",
      width: 150,
    },

    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ];
  const dataEmployee = [];
  const dataEmployeeModal = [];

  for (let i = 0; i < 46; i++) {
    dataEmployeeModal.push({
      key: i,
      stt: i,
      employeeCode: <div>{`JKB ${i}`}</div>,
      employeeName: `Văn tỷ + ${i}`,
      role: `Nhân viên + ${i}`,
      branch: `Chi nhánh ${i}`,
      birthDay: `2021/06/28`,
      email: 'anhhung_so11@yahoo.com',
      phoneNumber: `038494349${i}`,
      address: `27/27, ngô y linh`,
      district: `Bình Tân ${i}`,
      city: `Hồ chí minh`,

      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/employee/edit" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const onClickAddEmployee = () => {
    openNotification()
    modal3VisibleModal(false)
  }
  const onClickAddProduct = () => {
    openNotification()
    modal2VisibleModal(false)
  }
  const contentSearch = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const apiAllProductData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllProduct();
      console.log(res)
      if (res.status === 200) {
        setProduct(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllProductData();
  }, []);
  const username = localStorage.getItem("username");
  const [employee, setEmployee] = useState([])
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [record, setRecord] = useState({})
  const modal2VisibleModalMain = (modal2Visible, record) => {
    setModal2Visible(modal2Visible)
    setRecord(record)
  }

  function onChangeDateDouble(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  function onChangeDateAlone(date, dateString) {
    console.log(date, dateString);
  }



  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin nhân sự thành công.',
    });
  };
  function confirm(e) {
    console.log(e);
    employee && employee.length > 0 && employee.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active === false) {
            openNotificationDeleteSupplierError()
          } else {
            const object = {
              active: false
            }
            updateUserData(object, values.user_id, 1)
          }
        }
      })
    })
  }
  const [valueSwitch, setValueSwitch] = useState(false)
  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`);
    setValueSwitch(checked)
    updateUserData({ ...record, active: checked }, record.user_id, checked ? 1 : 2)
  }
  function cancel(e) {
    console.log(e);
  }
  const apiSearchData = async (value) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiSearch({ keyword: value });

      if (res.status === 200) {
        var array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.bussiness_id.username === username) {

        //     if (values.role_id.name === "EMPLOYEE") {
        //       array.push(values)
        //       console.log(values)
        //       console.log("------------------------")
        //     }
        //   }
        // })
        setEmployee(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
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
      const value = e.target.value;
      apiSearchData(value);
    }, 300);
    // 
  };
  const onClickUpdate = () => {
    setVisible(false)
    openNotification()
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  // for (let i = 0; i < 46; i++) {
  //   data.push({
  //     key: i,
  //     stt: i,
  //     employeeCode: <div style={{ color: '#40A9FF', cursor: 'pointer' }} onClick={() => modal2VisibleModal(true)}>{`JKB ${i}`}</div>,
  //     employeeName: `Văn tỷ + ${i}`,
  //     role: `Nhân viên + ${i}`,
  //     branch: `Chi nhánh ${i}`,
  //     birthDay: `2021/06/28`,
  //     email: 'anhhung_so11@yahoo.com',
  //     phoneNumber: `038494349${i}`,
  //     address: `27/27, ngô y linh`,
  //     district: `Bình Tân ${i}`,
  //     city: `Hồ chí minh`,
  //     action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
  //       <div onClick={showDrawer} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
  //       {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
  //     </div>
  //   });
  // }
  const [monthSix, setMonthSix] = useState(0)
  var temp = 0;
  const [employeeTemp, setEmployeeTemp] = useState([])
  const [employeeCount, setEmployeeCount] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const apiAllEmployeeData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiSearch({ page: pagination.page, page_size: pagination.page_size });
      console.log(res)
      if (res.status === 200) {

        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.bussiness.username === username) {

            if (values._role === "EMPLOYEE") {
              array.push(values)
              console.log(values)
              console.log("------------------------")
              console.log(values.create_date)
              let now = moment()
              let days = now.diff(values.create_date, 'days')
              if (days > 180) {

                temp++;
              }
            }
          }
        })
        setMonthSix(temp)
        setEmployeeTemp(res.data.data)
        setEmployee(res.data.data)
        setEmployeeCount(res.data.data)
      }

      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllEmployeeData();
  }, []);
  const columns = [
    {
      title: "Mã nhân sự",
      dataIndex: "user_id",
      width: 150,
      render: (text, record) => <div>{text}</div>,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      width: 150,
    },

    {
      title: "Chi nhánh",
      dataIndex: "branch",
      width: 150,
      render: (text, record) => <div>
        {text.name}
        {/* {
          record && record.branch_id.length > 0 && record.branch_id.map((values, index) => {
            return (
              <div>{`-${values.name}`}</div>
            )
          })
        } */}
      </div>
    },
    {
      title: "Chức vụ",
      dataIndex: "_role",
      width: 150,
    },
    {
      title: "Tên nhân sự",
      dataIndex: "name",
      width: 150,
      render: (text, record) => <div>{`${record.first_name} ${record.last_name}`}</div>
    },
    {
      title: "Ngày gia nhập",
      dataIndex: "create_date",
      width: 150,
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
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
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} /> : <Switch onChange={(e) => onChangeSwitch(e, record)} />
    },
  ];
  const apiSearchDateData = async (start, end) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiSearch({ from_date: start, to_date: end });

      if (res.status === 200) {
        var array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.bussiness_id.username === username) {

        //     if (values.role_id.name === "EMPLOYEE") {
        //       array.push(values)
        //       console.log(values)
        //       console.log("------------------------")
        //     }
        //   }
        // })
        setEmployee(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const dateFormat = 'YYYY/MM/DD';
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChange(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };
  const openNotificationUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      description: data === 2 ? ('Vô hiệu hóa nhân sự thành công.') : ('Kích hoạt nhân sự thành công.')
    });
  };

  const openNotificationUpdateData = (data, data2) => {
    notification.success({
      message: 'Thành công',
      description: <div>Cập nhật thông tin nhân sự <b>{data}</b> thành công</div>
    });
  };
  const onClickClear = async () => {
    await apiAllEmployeeData()
    openNotificationClear()
    setValueSearch("")
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setRoleSelect("default")
  }
  const openNotificationErrorUpdate = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin nhân sự.',
    });
  };

  const updateUserUpdateData = async (object, id, data) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await updateUser(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllEmployeeData();
        openNotificationUpdateData(object.first_name, object.last_name)
        setSelectedRowKeys([])
        onClose()
        onCloseUpdate()
        // setVisibleUpdate(false)
        // history.push("/user/19");
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
  }
  const updateUserData = async (object, id, data) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await updateUser(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllEmployeeData();
        openNotificationUpdate(data)
        setSelectedRowKeys([])
        // setVisibleUpdate(false)
        // history.push("/user/19");
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
  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Nhân viên đang hoạt động. Không thể thực hiện chức năng này.'
    });
  };
  const openNotificationDeleteSupplierError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Nhân viên đang ở trạng thái vô hiệu hóa. Không thể thực hiện chức năng này.'
    });
  };
  function confirmActive(e) {
    console.log(e);
    employee && employee.length > 0 && employee.forEach((values, index) => {

      selectedRowKeys.forEach((values1, index1) => {

        if (values._id === values1) {
          if (values.active) {

            openNotificationDeleteSupplierErrorActive()
          } else {

            const object = {
              active: true
            }
            updateUserData(object, values.user_id, 2)
          }
        }
      })
    })
  }
  function cancelActive(e) {
    console.log(e);

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
  const openNotificationErrorStoreRegexPhone = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const openNotificationErrorStoreRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationRegisterFailMailRegexUpdate = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const openNotificationRegisterFailMailUpdate = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Gmail phải ở dạng @gmail.com.',
    });
  };
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tên đăng nhập phải là số điện thoại và có độ dài là 10',
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
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên đăng nhập đã tồn tại.',
    });
  };
  const openNotificationErrorMove = () => {
    notification.error({
      message: 'Thất bại',
      description:
        `Phân nhân sự vào chi nhánh ${state.name} lỗi.`,
    });
  };
  const openNotificationErrorMoveSuccess = (name) => {
    notification.success({
      message: 'Thành công',
      duration: 5,
      description:
        <div>Nhân sự <b>{name}</b> đã được phân vào chi nhánh <b>{state.name}</b>.</div>,
    });
  };
  const openNotificationSuccessSell = () => {
    notification.success({
      message: 'Thành công',
      duration: 15,
      description:
        'Hệ thống đã cập nhật dữ liệu, vui lòng đăng nhập lại để tiến hành thao tác bán hàng.',
    });
  };
  const updateUserDataMove = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await updateUser(object, id);
      console.log(res)
      console.log("1111111")
      if (res.status === 200) {
        // openNotification()

        if (slug2 && slug2 === '2') {
          openNotificationSuccessSell()
          const actions = logoutAction('123');
          dispatch(actions)
          history.push("/");
        } else {
          history.push("/branch/19");
        }

        openNotificationErrorMoveSuccess(`${object.first_name} ${object.last_name}`)
      } else {
        openNotificationErrorMove()
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const regexCheck = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (validateEmail(values.email)) {
          const object = {
            role: values && values.role && values.role.role_id ? values.role.role_id : values.role_id, //
            branch: values && values.branch && values.branch.branch_id ? values.branch.branch_id : values.branch_id, //
            phone: '',
            email: values.email, //

            avatar: " ",
            first_name: values && values.first_name ? values.first_name : '',
            last_name: values && values.last_name ? values.last_name : '',
            birthday: '',
            address: values && values.address ? values.address : '',
            ward: " ",
            district: values && values.district ? values.district : '',
            province: values && values.province ? values.province : '',
            company_name: " ",
            company_website: " ",
            tax_code: " ",
            fax: " ",
          }
          console.log(values)
          console.log(object)
          console.log("------------------999")
          updateUserUpdateData(object, values.user_id)
          // if (isNaN(values.username)) {
          //   openNotificationRegisterFailMailPhone()
          // } else {
          //   if (regexCheck.test(values.username)) {


          //   } else {
          //     openNotificationRegisterFailMailPhone()
          //   }
          // }
        } else {
          openNotificationRegisterFailMail()
        }
      })
    } else {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (validateEmail(values.email)) {
          const object = {
            role: arrayUpdate[0] && arrayUpdate[0].role && arrayUpdate[0].role.role_id ? arrayUpdate[0].role.role_id : arrayUpdate[0].role_id, //
            branch: arrayUpdate[0] && arrayUpdate[0].branch && arrayUpdate[0].branch.branch_id ? arrayUpdate[0].branch.branch_id : arrayUpdate[0].branch_id, //
            phone: '',
            email: values.email, //

            avatar: " ",
            first_name: values && values.first_name ? values.first_name : '',
            last_name: values && values.last_name ? values.last_name : '',
            birthday: '',
            address: arrayUpdate[0] && arrayUpdate[0].address ? arrayUpdate[0].address : '',
            ward: " ",
            district: arrayUpdate[0] && arrayUpdate[0].district ? arrayUpdate[0].district : '',
            province: arrayUpdate[0] && arrayUpdate[0].province ? arrayUpdate[0].province : '',
            company_name: " ",
            company_website: " ",
            tax_code: " ",
            fax: " ",
          }
          console.log(values)
          console.log(object)
          console.log("------------------999")
          updateUserUpdateData(object, values.user_id)
          // if (isNaN(values.username)) {
          //   openNotificationRegisterFailMailPhone()
          // } else {
          //   if (regexCheck.test(values.username)) {


          //   } else {
          //     openNotificationRegisterFailMailPhone()
          //   }
          // }
        } else {
          openNotificationRegisterFailMail()
        }
      })
    }
  }
  const [arrayUpdate, setArrayUpdate] = useState([])
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    employee && employee.length > 0 && employee.forEach((values, index) => {
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
  const openNotificationErrorNotEmployee = (data) => {
    notification.error({
      message: 'Thất bại',
      description:
        <div>Nhân sự <b>{data}</b> đang ở trạng thái vô hiệu hóa không thể thêm.</div>,
    });
  };
  const openNotificationErrorNotEmployeeError = (data, branch) => {
    notification.error({
      message: 'Thất bại',
      description:
        <div>Nhân sự <b>{data}</b> đang ở chi nhánh <b>{branch}</b> không thể thêm.</div>,
    });
  };
  const onClickMove = () => {
    arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
      console.log(values)
      console.log('1')
      console.log(state)
      console.log("___________________555")
      if (values.active) {
        if (values.branch.branch_id === state.branch_id) {
          openNotificationErrorNotEmployeeError(`${values.first_name} ${values.last_name}`, values.branch.name)
        } else {
          updateUserDataMove({ ...values, branch: state.branch_id }, values.user_id)
        }

      }
      else {
        openNotificationErrorNotEmployee(`${values.first_name} ${values.last_name}`)
      }
    })

  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [permission, setPermission] = useState([])
  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllRole();
      console.log("|||123123")
      console.log(res)
      if (res.status === 200) {
        var array = []
        // if(res.data.data && res.data.data.length > 0) {
        //   res.data.data.forEach((values, index) => {
        //     array.push(values.name)
        //   })
        // } 
        setPermission(res.data.data)
      }
      // setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllRoleData();
  }, []);
  const [branch, setBranch] = useState([])
  const getAllBranchData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllBranch();
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    getAllBranchData();
  }, []);
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [roleFilter, setRoleFilter] = useState([])
  const apiFilterRoleEmployeeData = async data => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiFilterRoleEmployee({ _role: data });
      console.log(res)
      console.log("-----------")
      if (res.status === 200) {
        setEmployee(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [roleSelect, setRoleSelect] = useState("")
  const onChangeFilter = async (e) => {
    if (e === 'default') {

      await apiAllEmployeeData()
    } else {
      apiFilterRoleEmployeeData(e)
    }
    setRoleSelect(e)
  }
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }
  var employeeName = []
  employeeTemp && employeeTemp.length > 0 && employeeTemp.forEach((values, index) => {
    employeeName.push(values.role.name)
  })
  return (
    <UI>

      <div style={{ paddingBottom: '1rem' }} className={styles["supplier_information"]}>
        <Link className={styles["supplier_information_title"]} to="/branch/19">

          <ArrowLeftOutlined style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }} />
          <div className={styles["supplier_information_title_right"]}>
            Chi nhánh {state.name}
          </div>

        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ color: 'black', marginTop: '1rem', fontSize: '1.25rem', fontWeight: '600', width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>Danh sách nhân sự</div>

        </div>

        <div style={{ width: '100%', }}>

          <div className={styles["employee_manager"]}>
            <div className={styles["employee_manager_search"]}>
              <Row className={styles["employee_manager_search_row"]}>
                <Col
                  style={{ marginTop: '1.25rem', marginRight: '1rem' }}
                  className={styles["employee_manager_search_row_col"]}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={7}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                      placeholder="Tìm kiếm theo mã, tên đăng nhập" allowClear />
                  </div>
                </Col>
                <Col
                  style={{ marginTop: '1.25rem', marginRight: '1rem' }}
                  className={styles["employee_manager_search_row_col"]}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={7}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <RangePicker
                      // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                      value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                      style={{ width: '100%' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                      }}
                      onChange={onChange}
                    />
                  </div>
                </Col>
                <Col
                  style={{ marginTop: '1.25rem', marginRight: '1rem' }}
                  className={styles["employee_manager_search_row_col"]}
                  xs={24}
                  sm={24}
                  md={11}
                  lg={7}
                  xl={7}
                >
                  <div style={{ width: '100%' }}>
                    <Select showSearch
                      style={{ width: '100%' }}
                      placeholder="Select a person"
                      optionFilterProp="children"


                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      } value={roleSelect ? roleSelect : 'default'} onChange={(event) => { onChangeFilter(event) }}>
                      <Option value="default">Tất cả chức vụ</Option>

                      {
                        permission && permission.length > 0 && permission.map((values, index) => {
                          return <Option value={values.name}>{values.name}</Option>
                        })
                      }
                    </Select>
                  </div>
                </Col>

              </Row>
            </div>
            <div className={styles["employee_manager_top"]}>
              <Row className={styles["employee_manager_top_center"]} gutter={20}>

                <Col
                  style={{ marginTop: '1.25rem' }}
                  className={styles["employee_manager_top_center_col"]}
                  xs={20}
                  sm={10}
                  md={10}
                  lg={6}
                  xl={6}
                >
                  <div className={styles["employee_manager_top_center_item"]}>
                    <div
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}

                    >
                      {employeeCount.length}
                    </div>
                    <div className={styles["employee_manager_top_center_item_top"]}>
                      Tổng nhân sự
                    </div>

                  </div>
                </Col>
                <Col
                  style={{ marginTop: '1.25rem' }}
                  className={styles["employee_manager_top_center_col"]}
                  xs={20}
                  sm={10}
                  md={10}
                  lg={6}
                  xl={6}
                >
                  <div className={styles["employee_manager_top_center_item"]}>
                    <div
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}

                    >
                      {monthSix}
                    </div>
                    <div className={styles["employee_manager_top_center_item_top"]}>
                      Nhân viên trên 6 tháng
                    </div>

                  </div>
                </Col>
                <Col
                  style={{ marginTop: '1.25rem' }}
                  className={styles["employee_manager_top_center_col"]}
                  xs={20}
                  sm={10}
                  md={10}
                  lg={6}
                  xl={6}
                >
                  <div className={styles["employee_manager_top_center_item_left"]}>
                    <div
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}

                    >
                      0
                    </div>
                    <div className={styles["employee_manager_top_center_item_top"]}>
                      Tổng chi phí
                    </div>

                  </div>
                </Col>
                <Col
                  style={{ marginTop: '1.25rem' }}
                  className={styles["employee_manager_top_center_col"]}
                  xs={20}
                  sm={10}
                  md={10}
                  lg={6}
                  xl={6}
                >
                  <div className={styles["employee_manager_top_center_item_center"]}>
                    <div
                      style={{ fontSize: '1.5rem', fontWeight: '600' }}

                    >
                      {monthSix}
                    </div>
                    <div className={styles["employee_manager_top_center_item_top"]}>
                      Tổng thu nhập
                    </div>

                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles["employee_manager_bottom"]}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
              </div>
              {
                selectedRowKeys && selectedRowKeys.length > 0 ? (
                  <Radio.Group style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', width: '100%' }} >
                    {/* <Radio onClick={showDrawerUpdate} value={1}>Cập nhật hàng loạt</Radio>
                    <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio> */}
                    <Radio onClick={onClickMove} value={3}>Phân nhân sự vào chi nhánh</Radio>
                    {/* <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio>
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Radio value={3}>     Vô hiệu hóa</Radio>
                </Popconfirm>
                <Popconfirm
                  title="Bạn chắc chắn muốn kích hoạt lại?"
                  onConfirm={confirmActive}
                  onCancel={cancelActive}
                  okText="Yes"
                  cancelText="No"
                >
                  <Radio value={4}>Kích hoạt</Radio>
                </Popconfirm> */}
                  </Radio.Group>
                ) : ('')
              }
              <div className={styles["employee_manager_bottom_table"]}>
                <Table
                  rowKey="_id"
                  columns={columns}
                  rowSelection={rowSelection}
                  dataSource={employee}
                  scroll={{ y: 500 }}
                />
              </div>{" "}

            </div>
          </div>

          <Modal
            title="Xem chi tiết thông tin nhân sự"
            centered
            footer={null}
            width={800}
            visible={modal2Visible}
            onOk={() => modal2VisibleModal(false)}
            onCancel={() => modal2VisibleModal(false)}
          >

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
                      <b>Tên nhân sự:</b> {`${record.first_name} ${record.last_name}`}
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
                        <b>Email:</b> {record.email}
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
                        <b>Chức vụ:</b> {record && record.role ? record.role.name : ''}
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
                        <b>Liên hệ:</b> {record.username}
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
                        <b>Ngày tạo:</b> {moment(record.create_date).format('YYYY-MM-DD')}
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
                        <b>Địa chỉ:</b> {record.address}
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
                        <b>Quận/huyện:</b> {record.district}
                      </div>
                    </Col>

                  </Row>
                  {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
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
                        <b>Chi nhánh làm việc:</b> {record.branch_id}
                      </div>
                    </Col>

                  </Row>


                  {/* <Input style={{ width: "100%" }} defaultValue="vanty@gmail.com" /> */}
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
                        <b>Tỉnh/thành phố:</b> {record.province}

                      </div>
                    </Col>

                  </Row>
                  {/* <Input style={{ width: "100%" }} defaultValue="TNHH An Phát" /> */}
                </Col>
              </Row>





            </div>

          </Modal>

          <Drawer
            title="Cập nhật thông tin nhân sự"
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
                          if (data === 'username') {
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
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên đăng nhập</div>
                                  <InputName />
                                  {/* </Form.Item> */}
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
                          if (data === 'branch_id') {
                            const InputName = () => <Select defaultValue={values[data][data]}
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn chi nhánh"
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
                                branch && branch.length > 0 && branch.map((values, index) => {
                                  return <Option value={values.branch_id}>{values.name}</Option>
                                })
                              }
                            </Select>
                            return (
                              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                <div>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Chi nhánh làm việc</div>
                                  <InputName />

                                </div>
                              </Col>
                            )
                          }
                          if (data === 'role') {
                            const InputName = () => <Select defaultValue={values[data].role_id}
                              showSearch
                              style={{ width: '100%' }}
                              placeholder="Chọn vai trò"
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
                                permission && permission.length > 0 && permission.map((values, index) => {
                                  return <Option value={values.role_id}>{values.name}</Option>
                                })
                              }
                            </Select>
                            return (
                              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                <div>
                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Vai trò</div>
                                  <InputName />

                                </div>
                              </Col>
                            )
                          }

                          if (data === 'first_name') {
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

                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên</div>
                                  <InputName />

                                </div>
                              </Col>
                            )
                          }
                          if (data === 'last_name') {
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

                                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Họ</div>
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
            title="Cập nhật thông tin nhân sự"
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
                            if (data === 'username') {
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
                                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên đăng nhập</div>
                                    <InputName />
                                    {/* </Form.Item> */}
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
                            if (data === 'branch_id') {
                              const InputName = () => <Select defaultValue={values[data][data]}
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Chọn chi nhánh"
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
                                  branch && branch.length > 0 && branch.map((values, index) => {
                                    return <Option value={values.branch_id}>{values.name}</Option>
                                  })
                                }
                              </Select>
                              return (
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                  <div>
                                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Chi nhánh làm việc</div>
                                    <InputName />

                                  </div>
                                </Col>
                              )
                            }
                            if (data === 'role') {
                              const InputName = () => <Select defaultValue={values[data].role_id}
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Chọn vai trò"
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
                                  permission && permission.length > 0 && permission.map((values, index) => {
                                    return <Option value={values.role_id}>{values.name}</Option>
                                  })
                                }
                              </Select>
                              return (
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                  <div>
                                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Vai trò</div>
                                    <InputName />

                                  </div>
                                </Col>
                              )
                            }

                            if (data === 'first_name') {
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

                                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên</div>
                                    <InputName />

                                  </div>
                                </Col>
                              )
                            }
                            if (data === 'last_name') {
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

                                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Họ</div>
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

        </div>
      </div>

    </UI >
  );
}
