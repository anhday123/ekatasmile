import UI from "../../components/Layout/UI";
import React, { useState, useEffect, useRef } from "react";
import { ACTION } from './../../consts/index'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import {
  Link,
} from "react-router-dom";
import styles from "./../employee/employee.module.scss";
import {
  Select,
  DatePicker,
  Row,
  notification,
  Switch,
  Col,
  Radio,
  Form,
  Input,
  Modal,
  Button,
  Drawer,
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import { apiAllEmployee, apiFilterRoleEmployee, apiUpdateEmployee } from "../../apis/employee";
import { apiAllRole, apiSearch, updateUser } from "../../apis/user";
import { apiFilterCity, getAllBranch } from "../../apis/branch";
import { apiDistrict, apiProvince } from "../../apis/information";
import { getAllStore } from "../../apis/store";
const { Option } = Select;
export default function Employee() {
  const dispatch = useDispatch()
  const username = localStorage.getItem("username");
  const [employee, setEmployee] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [loading, setLoading] = useState(false)
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
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
  const { RangePicker } = DatePicker;

  const { Search } = Input;
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
      setLoading(true)

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
      const value = e.target.value;
      apiSearchData(value);
    }, 300);
    // 
  };
  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const onClickUpdate = () => {
    setVisible(false)
    openNotification()
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const data = [];
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
  const apiAllEmployeeData = async () => {
    try {
      //      setLoading(true)
      setLoading(true)
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
      setLoading(false)
      // if (res.status === 200) setUsers(res.data);
      //           setLoading(false)
    } catch (error) {
      setLoading(false)
      //           setLoading(false)
    }
  };
  useEffect(() => {
    apiAllEmployeeData();
  }, []);
  const columns = [
    {
      title: "Mã nhân sự",
      dataIndex: "user_id",
      width: 100,
      render: (text, record) => <div style={{ color: '#40A9FF', cursor: 'pointer' }} onClick={() => modal2VisibleModalMain(true, record)}>{text}</div>,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      width: 200,
    },
    {
      title: "Tên nhân sự",
      dataIndex: "name",
      width: 150,
      render: (text, record) => <div>{`${record.first_name} ${record.last_name}`}</div>
    },
    {
      title: "Chức vụ",
      dataIndex: "_role",
      width: 150,
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Ngày gia nhập",
      dataIndex: "create_date",
      width: 150,
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: "Cửa hàng",
      dataIndex: "store",
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
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end, page: pagination.page, page_size: pagination.page_size });

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
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
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
      description: <div>Cập nhật thông tin nhân sự <b>{`${data} ${data2}`}</b> thành công</div>
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
    console.log(object)
    console.log("___333")
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
      setLoading(true)
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
  const [store, setStore] = useState([])
  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };

  useEffect(() => {
    getAllStoreData();
  }, []);
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
  const apiUpdateEmployeeData = async (object) => {
    try {
      setLoading(true)
      const res = await apiUpdateEmployee(object);
      console.log(res)
      if (res.status === 200) {
        // openNotification()
        // history.push("/employee/19");
      } else {
        openNotificationError()
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const openNotificationRegisterFailMailPhoneMain = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Liên hệ chưa đúng định dạng',
    });
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const regexCheck = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (validateEmail(values.email)) {
          if (regex.test(values.phone)) {

            updateUserUpdateData({
              ...values,
              role: values && values.role && values.role.role_id ? values.role.role_id : values.role, //
              branch: values && values.branch && values.branch.branch_id ? values.branch.branch_id : values.branch, //
              store: values && values.store && values.store.store_id ? values.store.store_id : values.store, //
              phone: values.phone,

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
            }, values.user_id)
          } else {
            openNotificationRegisterFailMailPhoneMain()
          }
          console.log(values)

          console.log("------------------999")

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
          if (regex.test(values.phone)) {
            updateUserUpdateData({
              ...values,
              role: arrayUpdate[0] && arrayUpdate[0].role && arrayUpdate[0].role.role_id ? arrayUpdate[0].role.role_id : arrayUpdate[0].role, //
              branch: arrayUpdate[0] && arrayUpdate[0].branch && arrayUpdate[0].branch.branch_id ? arrayUpdate[0].branch.branch_id : arrayUpdate[0].branch, //
              store: arrayUpdate[0] && arrayUpdate[0].store && arrayUpdate[0].store.store_id ? arrayUpdate[0].store.store_id : arrayUpdate[0].store, //
              phone: values.phone,
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
            }, values.user_id)
          } else {
            openNotificationRegisterFailMailPhoneMain()
          }

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
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [permission, setPermission] = useState([])
  const apiAllRoleData = async () => {
    try {
      setLoading(true)
      const res = await apiAllRole();
      console.log("|||123123")
      console.log(res)
      if (res.status === 200) {
        setPermission(res.data.data)
      }
      // setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  useEffect(() => {
    apiAllRoleData();
  }, []);
  const [branch, setBranch] = useState([])
  const getAllBranchData = async () => {
    try {
      setLoading(true)
      const res = await getAllBranch();
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  useEffect(() => {
    getAllBranchData();
  }, []);
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
  const [roleFilter, setRoleFilter] = useState([])
  const apiFilterRoleEmployeeData = async data => {
    try {
      setLoading(true)
      const res = await apiFilterRoleEmployee({ _role: data });
      console.log(res)
      console.log("-----------")
      if (res.status === 200) {
        setEmployee(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
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
  var employeeName = []
  employeeTemp && employeeTemp.length > 0 && employeeTemp.forEach((values, index) => {
    employeeName.push(values.role.name)
  })
  const unique = [...new Set(employeeName)]
  return (
    <UI>
      <div className={styles["employee_manager"]}>
        <div style={{ display: 'flex', paddingBottom: '1rem', borderBottom: '1px solid rgb(231, 224, 224)', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["employee_manager_title"]}>
            <Link className={styles["supplier_add_back_parent"]} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

              <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
              <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Quản lý nhân sự</div>

            </Link>
          </div>
          <Link to="/actions/employee/add/19">
            <Button
              className={
                styles["employee_manager_search_row_col_button_right"]
              }
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Thêm nhân sự
            </Button>
          </Link>
        </div>
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
            {/*             
            <Col
              style={{ marginTop: '1.25rem', marginRight: '1rem' }}
              className={styles["employee_manager_search_row_col"]}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <DatePicker style={{ width: '100%' }} onChange={onChangeDateAlone} />
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
              <Select placeholder="Lọc theo vai trò" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="employee">Nhân viên</Option>
                <Option value="manager">Giám đốc</Option>

              </Select>
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
              <Select placeholder="Lọc theo chi nhánh" style={{ width: '100%' }} onChange={handleChange}>
                <Option value="branch1">Chi nhanh 1</Option>
                <Option value="branch2">Chi nhanh 2</Option>

              </Select>
            </Col>
        */}
          </Row>
        </div>
        <div className={styles["employee_manager_top"]}>
          <Row className={styles["employee_manager_top_center"]}>
            {/* <Col
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
                  500
                </div>
                <div className={styles["employee_manager_top_center_item_top"]}>
                  Tổng ca làm
                </div>

              </div>
            </Col> */}
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
              style={{ marginTop: '1.25rem', marginLeft: '1rem' }}
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
          </Row>
        </div>
        <div className={styles["employee_manager_bottom"]}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
          {
            selectedRowKeys && selectedRowKeys.length > 0 ? (
              <Radio.Group style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', width: '100%' }} >
                <Radio onClick={showDrawerUpdate} value={1}>Cập nhật hàng loạt</Radio>
                <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio>
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
              loading={loading}
              dataSource={employee}
              scroll={{ y: 500 }}
              pagination={{ onChange: changePagi }}
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
                      if (data === 'branch') {
                        const InputName = () => <Select defaultValue={values[data].branch_id}
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
                      if (data === 'store') {
                        const InputName = () => <Select defaultValue={values[data].store_id}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn cửa hàng"
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
                            store && store.length > 0 && store.map((values, index) => {
                              return <Option value={values.store_id}>{values.name}</Option>
                            })
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Cửa hàng</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'role') {

                        const InputName = () => <Select defaultValue={values[data] && values[data].role_id ? values[data].role_id : 'Đã lưu vai trò'}
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
                        if (data === 'store') {
                          const InputName = () => <Select defaultValue={values[data].store_id}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn cửa hàng"
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
                              store && store.length > 0 && store.map((values, index) => {
                                return <Option value={values.store_id}>{values.name}</Option>
                              })
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Cửa hàng</div>
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
                        if (data === 'branch') {
                          const InputName = () => <Select defaultValue={values[data].branch_id}
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
                          const InputName = () => <Select defaultValue={values[data] && values[data].role_id ? values[data].role_id : 'Đã lưu vai trò'}
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

    </UI>
  );
}
