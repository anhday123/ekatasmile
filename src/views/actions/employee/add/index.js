import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import { ACTION } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
// import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Select,
  DatePicker,
  Space,
  Upload,
  message,
  notification,
  Row,
  Col,
  Input,
  Form,
  Checkbox,
  Popover,
  Button,
  Table,
} from "antd";
import moment from "moment";
import {
  AudioOutlined,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { apiFilterCity, getAllBranch } from "../../../../apis/branch";
import { apiDistrict, apiProvince } from "../../../../apis/information";
import { apiAllRole, apiAllUser } from "../../../../apis/user";
import { apiUpdateEmployee } from "../../../../apis/employee";
import { getAllStore } from "../../../../apis/store";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const { RangePicker } = DatePicker;
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
export default function EmployeeAdd() {
  const dispatch = useDispatch()
  let history = useHistory();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [branch, setBranch] = useState([])
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { RangePicker } = DatePicker;
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      // this.setState({ loading: true });
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setLoading({ imageUrl: imageUrl, loading: false })
      );
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const dateFormat = "YYYY/MM/DD";
  const monthFormat = "YYYY/MM";
  const { Option } = Select;
  const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];

  const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
  const props = {
    action: "//jsonplaceholder.typicode.com/posts/",
    listType: "picture",
    previewFile(file) {
      console.log("Your upload file:", file);
      // Your process logic. Here we just mock to the same file
      return fetch("https://next.json-generator.com/api/json/get/4ytyBoLK8", {
        method: "POST",
        body: file,
      })
        .then((res) => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
  };

  const onChange = ({ target: { value } }) => {
    setValue(value);
  };
  const [date, setDate] = useState('')
  function onChangeDateAlone(date, dateString) {
    console.log(date, dateString);
    setDate(dateString)
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên đăng nhập hoặc email đã tồn tại.',
    });
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm nhân sự thành công.',
    });
  };
  const apiUpdateEmployeeData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateEmployee(object);
      console.log(res)
      if (res.status === 200) {
        openNotification()
        history.push("/employee/19");
      } else {
        openNotificationError()
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function password_validate(password) {
    var re = {
      // 'capital': /[A-Z]/,
      // 'digit': /[0-9]/,
      'full': /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()?])[A-Za-z0-9\d!@#$%^&*()?]{8,}$/
    };
    return re.full.test(password);
    // return re.capital.test(password) &&
    //   re.digit.test(password) &&
    //   re.full.test(password);
  }
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Gmail phải ở dạng @gmail.com',
    });
  };
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tên đăng nhập phải là chuỗi',
    });
  };
  const openNotificationRegisterFail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description: 'Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
    });
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const [user, setUser] = useState({})
  const [userString, setUserString] = useState('')
  const apiAllUserData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllUser();
      console.log(res)
      console.log("991")
      if (res.status === 200) {
        const username = localStorage.getItem("username")
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (username === values.username) {
            setUser(values)
            setUserString(values.company_name.toLowerCase())
          }
        })


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
    apiAllUserData();
  }, []);
  const [store, setStore] = useState([])
  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

        // var arrayDistrict = []
        // var arrayProvince = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   arrayDistrict.push(values.district)
        //   arrayProvince.push(values.province)
        // })
        // setDistrict([...arrayDistrict])
        // setProvince([...arrayProvince])
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
  const openNotificationRegisterFailMailPhoneMain = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Liên hệ chưa đúng định dạng',
    });
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (value) => {
    console.log(value)
    if (validateEmail(value.email)) {
      if (password_validate(value.password)) {
        if (isNaN(value.username)) {
          if (isNaN(value.phoneNumber)) {
            openNotificationRegisterFailMailPhoneMain()
          } else {
            if (regex.test(value.phoneNumber)) {
              var array = [];
              array.push(value.branch)
              const object = {
                username: user && user.company_name !== " " ? `${user.company_name.toLowerCase()}_${value.username}` : value.username,
                password: value.password, //
                role: value.role, //
                phone: value.phoneNumber,
                email: value.email, //
                avatar: " ",
                store: value.store,
                first_name: value && value.name ? value.name : ' ',
                last_name: value && value.surname ? value.surname : ' ',
                branch: value && value.branch ? value.branch : " ", //
                birthday: date ? date : ' ',
                address: value && value.address ? value.address : ' ',
                ward: " ",
                district: value && value.district ? value.district : ' ',
                province: value && value.city ? value.city : ' ',
                company_name: " ",
                company_website: " ",
                tax_code: " ",
                fax: " "
              }
              console.log(object)
              console.log("----------------------444")
              apiUpdateEmployeeData(object)
            } else {
              openNotificationRegisterFailMailPhoneMain()
            }

          }


        } else {
          openNotificationRegisterFailMailPhone()
        }
      } else {
        openNotificationRegisterFail()
      }
    } else {



      if (!validateEmail(value.email)) {
        openNotificationRegisterFailMail()
      }

    }
  };
  function onChangeDateWork(date, dateString) {
    console.log(date, dateString);
  }
  function onChangeDateBirdthday(date, dateString) {
    console.log(date, dateString);
  }
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
  const [districtMain, setDistrictMain] = useState([])
  const apiDistrictData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [provinceMain, setProvinceMain] = useState([])
  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvinceMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const [permission, setPermission] = useState([])
  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
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
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllRoleData();
  }, []);
  const [checkbox, setCheckbox] = useState(false)
  function onChangeCheckbox(e) {
    console.log(`checked = ${e.target.checked}`);
    setCheckbox(e.target.checked)
  }
  const [districtMainSelect, setDistrictMainSelect] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMainSelect(res.data.data)
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
  const dataValue = form.getFieldValue()
  dataValue.store = store && store.length > 0 ? (store[store.length - 1].store_id) : ('')
  dataValue.branch = branch && branch.length > 0 ? (branch[branch.length - 1].branch_id) : ('')
  // dataValue.city = provinceMain && provinceMain.length > 0 ? provinceMain[provinceMain.length - 2].province_name : '';
  dataValue.district = districtMainSelect && districtMainSelect.length > 0 ? districtMainSelect[districtMainSelect.length - 2].district_name : '';
  dataValue.role = permission && permission.length > 0 ? permission[0].role_id : '';
  const [storeValue, setStoreValue] = useState(store && store.length > 0 ? store[0].store_id : '')
  const onChangeStoreValue = (e) => {
    setStoreValue(e)
  }
  return (
    <UI>
      <div className={styles["employee_add_parent"]}>
        <Link style={{ borderBottom: '1px solid rgb(233, 240, 240)', paddingBottom: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/employee/19">

          <ArrowLeftOutlined style={{ fontWeight: '600', marginRight: '0.5rem', fontSize: '1rem', color: 'black' }} />
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }} className={styles["supplier_add_back"]}>Thêm nhân sự</div>

        </Link>
        <Form
          className={styles["employee_add_parent_form"]}
          onFinish={onFinish}
          layout="vertical"
          form={form}
          onFinishFailed={onFinishFailed}
        >
          <div style={{ display: 'flex', marginBottom: '1rem', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <Checkbox onChange={onChangeCheckbox}>Thêm thông tin (không bắt buộc)</Checkbox>
          </div>
          {
            checkbox ? (

              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>

                <Row className={styles["employee_add_parent_row"]}>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Tên đăng nhập</div>}
                          name="username"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          {
                            ((user && user.company_name !== '') || (user && user.company_name !== ' ') || (user && user.company_name !== 'default')) ? (<Input addonBefore={(user && user.company_name !== '') || (user && user.company_name !== ' ') || (user && user.company_name !== 'default') ? userString : ''} placeholder="Nhập tên nhân sự" />) : (<Input placeholder="Nhập tên nhân sự" />)
                          }

                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Họ</div>
                        <Form.Item

                          name="surname"

                        >
                          <Input placeholder="Nhập họ" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                </Row>

                <Row className={styles["employee_add_parent_row"]}>
                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Mật khẩu</div>}
                          name="password"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Tên</div>
                        <Form.Item
                          // label="Username"
                          name="name"

                        >
                          <Input placeholder="Nhập tên" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                </Row>
                <Row className={styles["employee_add_parent_row"]}>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Vai trò </div>}
                          name="role"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >

                          <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {
                              permission && permission.length > 0 && permission.map((values, index) => {
                                return <Option value={values.role_id}>{values.name}</Option>
                              })
                            }

                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        < div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                        <Form.Item
                          // label="Username"
                          name="address"

                        >
                          <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className={styles["employee_add_parent_row"]}>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                          name="phoneNumber"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Nhập liên hệ" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Email</div>}
                          name="email"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Nhập email" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* <Col
              className={styles["employee_add_parent_col"]}
              xs={24}
              sm={11}
              md={11}
              lg={11}
              xl={11}
            >
              <Row className={styles["employee_add_parent_col_row_child"]}>
                <Col
                  className={styles["employee_add_parent_col_row_child_input"]}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <Form.Item
                    label={<div style={{ color: 'black', fontWeight: '600' }}>Xác nhận mật khẩu</div>}
                    name="passwordConfirm"
                    rules={[{ required: true, message: "Giá trị rỗng!" }]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu xác nhận" />
                  </Form.Item>
                </Col>
              </Row>
            </Col> */}






                </Row>

                <Row className={styles["employee_add_parent_row"]}>


                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Chi nhánh làm việc</div>}
                          name="branch"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Select showSearch
                            style={{ width: '100%' }}
                            optionFilterProp="children"

                            placeholder="Chọn chi nhánh làm việc"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              branch && branch.length > 0 && branch.map((values, index) => {
                                return (
                                  <Option value={values.branch_id}>{values.name}</Option>
                                )
                              })
                            }


                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Cửa hàng</div>}
                          name="store"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Select showSearch
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            value={storeValue}
                            onChange={onChangeStoreValue}
                            placeholder="Chọn cửa hàng"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              store && store.length > 0 && store.map((values, index) => {
                                return (
                                  <Option value={values.store_id}>{values.name}</Option>
                                )
                              })
                            }


                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>


                </Row>


                <Row className={styles["employee_add_parent_row"]}>


                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Tỉnh/thành phố</div>
                        <Form.Item
                          name="city"

                          hasFeedback

                        >
                          <Select
                            onChange={handleChangeCity}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn tỉnh/thành phố"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {
                              provinceMain && provinceMain.length > 0 && provinceMain.map((values, index) => {
                                return <Option value={values.province_name}>{values.province_name}</Option>
                              })
                            }

                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>


                  {
                    districtMainSelect && districtMainSelect.length > 0 ? (
                      <Col
                        className={styles["employee_add_parent_col"]}
                        xs={24}
                        sm={11}
                        md={11}
                        lg={11}
                        xl={11}
                      >
                        <Row className={styles["employee_add_parent_col_row_child"]}>
                          <Col
                            className={styles["employee_add_parent_col_row_child_input"]}
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Quận/huyện</div>
                            <Form.Item
                              name="district"

                              hasFeedback

                            >
                              <Select showSearch
                                style={{ width: '100%' }}
                                placeholder="Select a person"
                                optionFilterProp="children"


                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {
                                  districtMainSelect && districtMainSelect.length > 0 && districtMainSelect.map((values, index) => {
                                    return (
                                      <Option value={values.district_name}>{values.district_name}</Option>
                                    )
                                  })
                                }


                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>

                    ) : ('')
                  }

                </Row>


              </div>

            ) : (

              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>

                <Row className={styles["employee_add_parent_row"]}>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Tên đăng nhập</div>}
                          name="username"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          {
                            ((user && user.company_name !== '') || (user && user.company_name !== ' ') || (user && user.company_name !== 'default')) ? (<Input addonBefore={(user && user.company_name !== '') || (user && user.company_name !== ' ') || (user && user.company_name !== 'default') ? userString : ''} placeholder="Nhập tên nhân sự" />) : (<Input placeholder="Nhập tên nhân sự" />)
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Mật khẩu</div>}
                          name="password"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>









                </Row>

                <Row className={styles["employee_add_parent_row"]}>
                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Chi nhánh làm việc</div>}
                          name="branch"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Select showSearch
                            style={{ width: '100%' }}
                            optionFilterProp="children"

                            placeholder="Chọn chi nhánh làm việc"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              branch && branch.length > 0 && branch.map((values, index) => {
                                return (
                                  <Option value={values.branch_id}>{values.name}</Option>
                                )
                              })
                            }


                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Vai trò </div>}
                          name="role"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >

                          <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {
                              permission && permission.length > 0 && permission.map((values, index) => {
                                return <Option value={values.role_id}>{values.name}</Option>
                              })
                            }

                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>



                </Row>


                <Row className={styles["employee_add_parent_row"]}>



                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Email</div>}
                          name="email"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Nhập email" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>


                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Cửa hàng</div>}
                          name="store"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Select showSearch
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            value={storeValue}
                            onChange={onChangeStoreValue}
                            placeholder="Chọn cửa hàng"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              store && store.length > 0 && store.map((values, index) => {
                                return (
                                  <Option value={values.store_id}>{values.name}</Option>
                                )
                              })
                            }


                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>


                  <Col
                    className={styles["employee_add_parent_col"]}
                    xs={24}
                    sm={11}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <Row className={styles["employee_add_parent_col_row_child"]}>
                      <Col
                        className={styles["employee_add_parent_col_row_child_input"]}
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        <Form.Item
                          label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                          name="phoneNumber"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Nhập liên hệ" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                </Row>

              </div>

            )
          }
          {/*
          <Row className={styles["employee_add_parent_row"]}>





            <Col
              className={styles["employee_add_parent_col"]}
              xs={24}
              sm={11}
              md={11}
              lg={11}
              xl={11}
            >
              <Row className={styles["employee_add_parent_col_row_child"]}>
                <Col
                  className={styles["employee_add_parent_col_row_child_input"]}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <Form.Item
                    label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                    name="phoneNumber"
                    rules={[{ required: true, message: "Giá trị rỗng!" }]}
                  >
                    <Input placeholder="Nhập liên hệ" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row> */}

          {/* <div className={styles["button"]}>
            <Button type="primary" icon={<CheckCircleOutlined />}>
              Thêm nhân viên
            </Button>
          </div> */}
          <div className={styles["button"]}>
            {/* <Form.Item>
              <Button type="primary" style={{ width: '5rem' }} danger>
                Hủy
              </Button>
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" style={{ width: '7.5rem' }} htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </UI>
  );
}
