import styles from "./../login/login.module.scss";
import "antd/dist/antd.css";
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import store from './../../assets/img/store.png'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ACTION } from './../../consts/index'
import { Row, Col, Form, Input, Button, notification, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { register } from "../../apis/register";
import { login } from "../../apis/login";
import { loginAccessToken } from "../../actions/login";
import { getAllStore } from "../../apis/store";
import { getStore } from "../../actions/store";
export default function Login() {
  const dispatch = useDispatch()
  // const router = useRouter()
  const [form] = Form.useForm();
  const [status, setStatus] = useState(1);
  let history = useHistory();
  const onClickStatus = (data) => {
    setStatus(data);
  };
  const apiLogin = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await login(object);
      console.log(res);
      if (res.status === 200) {
        openNotificationLoginSuccess()
        history.push('/overview/1');
        window.location.reload();
        const actions = loginAccessToken(res.data.data)
        dispatch(actions)
      }
      else {
        if (res.data.message === 'User has not activated!') {
          openNotificationLoginErrorActive()
        } else if (res.data.message === 'User is not exists!') {
          openNotificationLoginErrorActiveError()
        } else if (res.data.message === 'User had banned by admin!') {
          openNotificationLoginErrorActiveErrorBanned()
        } else {
          openNotificationLoginErrorActiveErrorPassword()
        }
        // if (res.data.message === 'User has not activated!') {
        //   openNotificationLoginErrorActive()
        // } else {
        //   openNotificationLoginError()
        // }
      }
      // if (res.status === 200) {
      //   if (res.data.success) {

      //     history.push('/otp/register');
      //   }
      // }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error.response)
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const onFinish = (values) => {
    console.log("Finish:", values);
    const object = {
      username: values.emailLogin.trim(),
      password: values.passwordLogin.trim()
    }
    apiLogin(object);
    // form.resetFields();
    // openNotificationLoginSuccess()
    // openNotificationLoginError()
    // history.push('/overview/1');
  };
  const openNotificationRegisterFail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
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
  const openNotificationRegisterFailMailPhone = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Liên hệ chưa đúng định dạng',
    });
  };
  const openNotificationRegisterFailMailPhoneString = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Họ và tên phải là chữ',
    });
  };
  const openNotificationRegisterFailUserPass = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tài khoản không có khoảng trắng, không dấu, độ dài từ 6 đến 20 ký tự.',
    });
  };
  const openNotificationRegisterFailUserPassError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Tài khoản không có khoảng trắng, không dấu, độ dài từ 6 đến 20 ký tự.',
    });
  };
  const openNotificationRegisterFailUserPassCity = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tên doanh nghiệp phải là chữ',
    });
  };

  const openNotificationRegisterFailMailPhoneOTP = (data) => {
    notification.info({
      message: 'Thông tin',
      duration: 6,
      description:
        `Mã OTP đã được gửi vào gmail: ${data}, vui lòng kiểm tra để lấy mã OTP xác thực tài khoản`,
    });
  };
  const apiRegister = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await register(object);
      console.log(res);
      if (res.status === 200) {
        if (res.data.success) {
          // history.push('/otp/register');
          history.push('/')
          openNotificationRegisterFailMailPhoneOTP(object.email)
        }
      }
      else {
        openNotificationRegisterUsername()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
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
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  function isValid(string) {
    var re = /^([a-zA-Z0-9]|[-._](?![-._])){6,20}$/
    return re.test(string)
  }
  function isValidVietnamese(string) {
    var re = /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u
    return re.test(string)
  }
  function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }
  const onFinishRegister = (values) => {
    console.log("Finish:", values);
    // form.resetFields();
    if (!validateEmail(values.emailRegister) || !isNaN(values.cityRegister) || !isValid(values.usernameRegister) || !regex.test(values.phoneNumberRegister) || isNaN(values.phoneNumberRegister) || values.passwordRegister !== values.RepasswordRegister || !password_validate(values.passwordRegister)) {
      if (!validateEmail(values.emailRegister)) {
        openNotificationRegisterFailMail()
      }
      if (values.passwordRegister !== values.RepasswordRegister || !password_validate(values.passwordRegister)) {
        openNotificationRegisterFail()
      }
      if (isNaN(values.phoneNumberRegister)) {
        openNotificationRegisterFailMailPhone()
      }
      if (!regex.test(values.phoneNumberRegister)) {
        openNotificationRegisterFailMailPhone()
      }
      if (!isValid(values.usernameRegister)) {
        openNotificationRegisterFailUserPass()
      }
      if (!isNaN(values.cityRegister)) {
        openNotificationRegisterFailUserPassCity()
      }
    } else {






      if (validateEmail(values.emailRegister)) {
        if (values.passwordRegister === values.RepasswordRegister && password_validate(values.passwordRegister)) {
          if (isNaN(values.phoneNumberRegister)) {
            openNotificationRegisterFailMailPhone()
          } else {
            if (regex.test(values.phoneNumberRegister)) {
              if (values.passwordRegister.length > 5 && values.usernameRegister.length > 5) {
                if (isNaN(values.cityRegister)) {
                  const object = {
                    username: nonAccentVietnamese(values.usernameRegister.toLowerCase().trim()),
                    password: values.passwordRegister.trim(),
                    role: " ",
                    phone: values.phoneNumberRegister.trim(),
                    email: values.emailRegister.trim(),
                    avatar: " ",
                    first_name: values && values.firstname ? values.firstname.toLowerCase().trim() : '',
                    last_name: values && values.lastname ? values.lastname.toLowerCase().trim() : '',
                    birthday: " ",
                    address: values && values.addressRegister ? values.addressRegister.toLowerCase().trim() : '',
                    ward: " ",
                    district: " ",
                    province: " ",
                    company_name: values && values.cityRegister ? values.cityRegister.toUpperCase().trim() : '',
                    company_website: " ",
                    tax_code: " ",
                    fax: " ",
                    branch: "",













                  }
                  // localStorage.setItem('registerAccount', JSON.stringify(object))
                  console.log(object)
                  console.log("------------")
                  apiRegister(object);
                } else {
                  openNotificationRegisterFailUserPassCity()
                }
              } else {
                openNotificationRegisterFailUserPass()
              }
            } else {
              openNotificationRegisterFailMailPhone()
            }
          }
        } else {
          openNotificationRegisterFail()
        }
      } else {
        openNotificationRegisterFailMail()
      }
    }
  };
  const openNotificationLoginSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Đăng nhập thành công'
    });
  };
  const openNotificationLoginError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản hoặc mật khẩu không chính xác'
    });
  };
  const openNotificationLoginErrorActive = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản của bạn chưa được kích hoạt'
    });
  };
  const openNotificationLoginErrorActiveError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản không tồn tại.'
    });
  };
  const openNotificationLoginErrorActiveErrorBanned = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản đã bị khóa bởi admin.'
    });
  };
  const openNotificationLoginErrorActiveErrorPassword = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Sai mật khẩu.'
    });
  };
  const openNotificationRegisterUsername = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản hoặc gmail đã được sử dụng'
    });
  };
  // const getAllUserData = async () => {
  //   try {
  //     dispatch({ type: ACTION.LOADING, data: true })
  //     const res = await getAllUser()
  //     console.log(res)
  //     // if (res.status === 200) setSites(res.data)

  //     dispatch({ type: ACTION.LOADING, data: false })
  //   } catch (error) {

  //     dispatch({ type: ACTION.LOADING, data: false })
  //   }
  // }
  // useEffect(() => {
  //   getAllUserData()
  // }, [])
  const getAllStoreData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        const action = getStore(res.data.data)
        dispatch(action)
        // alert('456')
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
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    getAllStoreData();
  }, []);
  return (
    <Row style={{ display: 'flex', height: '100%', backgroundColor: '#5B6BE8', justifyContent: 'space-between', alignItems: 'center' }}>
      {status === 1 ? (
        <Col style={{ width: '100%', height: '100%', }} xs={24} sm={24} md={24} lg={24} xl={8}>


          <div className={styles["login_choose_parent"]}>
            <div style={{ paddingTop: '1rem' }} className={styles["login_choose"]}>
              {/* <div
              onClick={() => onClickStatus(1)}
              className={
                status === 1
                  ? styles["login_choose_status_active"]
                  : styles["login_choose_status"]
              }
            >
              Đăng nhập
            </div> */}
              <div onClick={() => onClickStatus(1)}
                className={
                  status === 1
                    ? styles["login_choose_status_active"]
                    : styles["login_choose_status"]
                } style={{ color: 'white', fontWeight: '700', paddingTop: '0.25rem', marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đăng nhập
              </div>
              <div onClick={() => onClickStatus(2)}
                className={
                  status === 2
                    ? styles["login_choose_status_active"]
                    : styles["login_choose_status"]
                } style={{ color: 'white', fontWeight: '700', marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đăng ký
              </div>
            </div>
          </div>

          {status === 1 ? (
            <Form
              style={{ marginBottom: '3rem' }}
              className={styles["login_bottom"]}
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                className={styles["login_bottom_email"]}
                name="emailLogin"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="*Tài khoản"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="passwordLogin"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Mật khẩu"
                />
              </Form.Item>
              <div className={styles["login_bottom_left"]}>
                <Form.Item name="remember" valuePropName="checked">
                  {/* <Checkbox style={{ color: 'white' }} className={styles["login_bottom_left_checkbox"]}>
                    Nhớ mật khẩu
                  </Checkbox> */}
                </Form.Item>
                <Link to="/forget-password" style={{ paddingTop: '0.25rem', color: 'white' }}>Quên mật khẩu?</Link>
              </div>
              <div className={styles["login_bottom_left_button_parent"]}>
                <Form.Item >
                  <Button
                    className={styles["login_bottom_left_button"]}
                    style={{ background: '#000000', borderRadius: '2rem', height: '2.5rem', color: 'white', border: 'none', }}
                    // type="primary"
                    htmlType="submit"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </div>
            </Form>
          ) : (
            <Form

              className={styles["login_bottom"]}
              form={form}
              onFinish={onFinishRegister}
            >
              <Form.Item
                className={styles["login_bottom_email"]}
                name="usernameRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="*Tài khoản"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="passwordRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Mật khẩu"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="RepasswordRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Nhập lại mật khẩu"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="firstname"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Tên"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="lastname"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Họ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="emailRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="*Email"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="phoneNumberRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="*Liên hệ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="addressRegister"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<HomeOutlined className="site-form-item-icon" />}
                  placeholder="Địa chỉ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="cityRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                  placeholder="*Tên doanh nghiệp"
                />
              </Form.Item>
              <div className={styles["login_bottom_left_button_parent"]}>
                <Form.Item>
                  <Button
                    className={styles["login_bottom_left_button"]}
                    style={{ background: '#000000', borderRadius: '2rem', height: '2.5rem', color: 'white', border: 'none', }}

                    htmlType="submit"

                  >
                    Tạo tài khoản
                  </Button>
                </Form.Item>
              </div>
            </Form>
          )}

        </Col>
      ) : (
        <Col style={{ width: '100%', }} xs={24} sm={24} md={24} lg={24} xl={8}>


          <div style={{}} className={styles["login_choose_parent"]}>
            <div style={{ paddingTop: '1rem', }} className={styles["login_choose"]}>
              {/* <div
              onClick={() => onClickStatus(1)}
              className={
                status === 1
                  ? styles["login_choose_status_active"]
                  : styles["login_choose_status"]
              }
            >
              Đăng nhập
            </div> */}
              <div onClick={() => onClickStatus(1)}
                className={
                  status === 1
                    ? styles["login_choose_status_active"]
                    : styles["login_choose_status"]
                } style={{ color: 'white', fontWeight: '700', marginBottom: '2rem', paddingTop: '0.25rem', fontSize: '1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đăng nhập
              </div>
              <div onClick={() => onClickStatus(2)}
                className={
                  status === 2
                    ? styles["login_choose_status_active"]
                    : styles["login_choose_status"]
                } style={{ color: 'white', fontWeight: '700', marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đăng ký
              </div>
            </div>
          </div>

          {status === 1 ? (
            <Form

              className={styles["login_bottom"]}
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                className={styles["login_bottom_email"]}
                name="emailLogin"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="*Tài khoản"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="passwordLogin"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Mật khẩu"
                />
              </Form.Item>
              <div className={styles["login_bottom_left"]}>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox style={{ color: 'white' }} className={styles["login_bottom_left_checkbox"]}>
                    Nhớ mật khẩu
                  </Checkbox>
                </Form.Item>
                <Link to="/forget-password" style={{ paddingTop: '0.25rem', color: 'white' }}>Quên mật khẩu?</Link>
              </div>
              <div className={styles["login_bottom_left_button_parent"]}>
                <Form.Item >
                  <Button
                    className={styles["login_bottom_left_button"]}
                    style={{ background: '#000000', borderRadius: '2rem', height: '2.5rem', color: 'white', border: 'none', }}
                    // type="primary"
                    htmlType="submit"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </div>
            </Form>
          ) : (
            <Form
              style={{ marginBottom: '3rem' }}
              className={styles["login_bottom"]}
              form={form}
              onFinish={onFinishRegister}
            >
              <Form.Item
                className={styles["login_bottom_email"]}
                name="usernameRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  style={{ borderRadius: '2rem' }}
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="*Tài khoản"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="passwordRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Mật khẩu"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_password"]}
                name="RepasswordRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input.Password
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="*Nhập lại mật khẩu"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="firstname"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Tên"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="lastname"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Họ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="emailRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="*Email"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="phoneNumberRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="*Liên hệ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="addressRegister"

              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<HomeOutlined className="site-form-item-icon" />}
                  placeholder="Địa chỉ"
                />
              </Form.Item>
              <Form.Item
                className={styles["login_bottom_email"]}
                name="cityRegister"
                rules={[{ required: true, message: "Giá trị rỗng!" }]}
              >
                <Input
                  size="large"
                  style={{ borderRadius: '2rem' }}
                  prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                  placeholder="*Tên doanh nghiệp"
                />
              </Form.Item>
              <div className={styles["login_bottom_left_button_parent"]}>
                <Form.Item>
                  <Button
                    className={styles["login_bottom_left_button"]}
                    style={{ background: '#000000', borderRadius: '2rem', height: '2.5rem', color: 'white', border: 'none', }}
                    htmlType="submit"

                  >
                    Tạo tài khoản
                  </Button>
                </Form.Item>
              </div>
            </Form>
          )}

        </Col>
      )}

      <Col style={{ width: '100%', height: '100vh', backgroundColor: 'white' }} xs={24} sm={24} md={24} lg={24} xl={16}>
        <img src={store} style={{ width: '100%', paddingBottom: '4rem', height: '100vh', objectFit: 'contain' }} alt="" />
      </Col>
    </Row>
    // <div className={styles["login"]}>
    //   <div className={styles["login_img_parent"]}>
    //     <img className={styles["login_img"]} src={pgc} alt="" />
    //   </div>
    //   <div className={styles["login_choose_parent"]}>
    //     <div className={styles["login_choose"]}>
    //       <div
    //         onClick={() => onClickStatus(1)}
    //         className={
    //           status === 1
    //             ? styles["login_choose_status_active"]
    //             : styles["login_choose_status"]
    //         }
    //       >
    //         Đăng nhập
    //       </div>
    //       <div
    //         className={
    //           status === 2
    //             ? styles["login_choose_status_active"]
    //             : styles["login_choose_status"]
    //         }
    //         onClick={() => onClickStatus(2)}
    //       >
    //         Đăng ký
    //       </div>
    //     </div>
    //   </div>
    //   {status === 1 ? (
    //     <Form
    //       className={styles["login_bottom"]}
    //       form={form}
    //       onFinish={onFinish}
    //     >
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="emailLogin"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<UserOutlined className="site-form-item-icon" />}
    //           placeholder="Tài khoản"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_password"]}
    //         name="passwordLogin"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input.Password
    //           size="large"
    //           prefix={<LockOutlined className="site-form-item-icon" />}
    //           type="password"
    //           placeholder="Mật khẩu"
    //         />
    //       </Form.Item>
    //       <div className={styles["login_bottom_left"]}>
    //         <Form.Item name="remember" valuePropName="checked">
    //           <Checkbox style={{ color: 'white' }} className={styles["login_bottom_left_checkbox"]}>
    //             Nhớ mật khẩu
    //           </Checkbox>
    //         </Form.Item>
    //         <Link to="/forget-password" style={{ paddingTop: '0.25rem' }}>Quên mật khẩu?</Link>
    //       </div>
    //       <div className={styles["login_bottom_left_button_parent"]}>
    //         <Form.Item >
    //           <Button
    //             className={styles["login_bottom_left_button"]}
    //             type="primary"
    //             htmlType="submit"
    //           >
    //             Đăng nhập
    //           </Button>
    //         </Form.Item>
    //       </div>
    //     </Form>
    //   ) : (
    //     <Form
    //       className={styles["login_bottom"]}
    //       form={form}
    //       onFinish={onFinishRegister}
    //     >
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="usernameRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<UserOutlined className="site-form-item-icon" />}
    //           placeholder="Tài khoản"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_password"]}
    //         name="passwordRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input.Password
    //           size="large"
    //           prefix={<LockOutlined className="site-form-item-icon" />}
    //           type="password"
    //           placeholder="Mật khẩu"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_password"]}
    //         name="RepasswordRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input.Password
    //           size="large"
    //           prefix={<LockOutlined className="site-form-item-icon" />}
    //           type="password"
    //           placeholder="Nhập lại mật khẩu"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="firstname"
    //         rules={[
    //           { required: true, message: "Giá trị rỗng!" },
    //         ]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<UserOutlined className="site-form-item-icon" />}
    //           placeholder="Tên"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="lastname"
    //         rules={[
    //           { required: true, message: "Giá trị rỗng!" },
    //         ]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<UserOutlined className="site-form-item-icon" />}
    //           placeholder="Họ"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="emailRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<MailOutlined className="site-form-item-icon" />}
    //           placeholder="Email"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="phoneNumberRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<PhoneOutlined className="site-form-item-icon" />}
    //           placeholder="Số điện thoại"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="addressRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<HomeOutlined className="site-form-item-icon" />}
    //           placeholder="Địa chỉ"
    //         />
    //       </Form.Item>
    //       <Form.Item
    //         className={styles["login_bottom_email"]}
    //         name="cityRegister"
    //         rules={[{ required: true, message: "Giá trị rỗng!" }]}
    //       >
    //         <Input
    //           size="large"
    //           prefix={<EnvironmentOutlined className="site-form-item-icon" />}
    //           placeholder="Tên công ty (nếu có)"
    //         />
    //       </Form.Item>
    //       <div className={styles["login_bottom_left_button_parent"]}>
    //         <Form.Item>
    //           <Button
    //             className={styles["login_bottom_left_button"]}
    //             type="primary"
    //             htmlType="submit"

    //           >
    //             Tạo tài khoản
    //           </Button>
    //         </Form.Item>
    //       </div>
    //     </Form>
    //   )}
    // </div>

  );
}
