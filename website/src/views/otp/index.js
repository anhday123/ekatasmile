import styles from "./../otp/otp.module.scss";
import "antd/dist/antd.css";
import React, { } from "react";
import { useDispatch } from 'react-redux'
import { ACTION } from './../../consts/index'
import { apiOTPForgetPassword, apiOTPMain } from "../../apis/otp";
import {
  BrowserRouter as Router,
  Switch,
  useParams,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import pgc from "./../../assets/img/logo.png";
import { Form, Input, Button, notification } from "antd";
import { } from "@ant-design/icons";
export default function OTP() {
  // var username = JSON.parse(localStorage.getItem('registerAccount'))
  // const username = propsData.location.state;

  console.log("|||")
  var usernameLocal = JSON.parse(localStorage.getItem('username'))
  var usernameForgetPassword = JSON.parse(localStorage.getItem('forget-password'))
  const dispatch = useDispatch()
  let history = useHistory();
  let { slug, slug1 } = useParams();
  var username = slug1;
  const onChange = e => {
    console.log(e);
  };
  const apiOTP = async (otp, data) => {
    if (data === 1) {
      console.log(otp)
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await apiOTPMain(otp);
        console.log(res);
        if (res.status === 200) {
          if (res.data.success) {
            openNotificationOTPSuccess()
            //  openNotificationOTPError()
            history.push('/');
            // localStorage.removeItem("registerAccount");
            // localStorage.removeItem("username");
          }

        }
        else if (res.status === 400) {
          openNotificationOTPError()
        }
        dispatch({ type: ACTION.LOADING, data: false });
        // openNotification();
        // history.push(ROUTES.NEWS);
      } catch (error) {
        console.log(error);
        dispatch({ type: ACTION.LOADING, data: false });
      }
    } else {
      console.log(otp)
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await apiOTPMain(otp);
        console.log(res);
        console.log("222")
        if (res.status === 200) {
          if (res.data.success) {
            history.push(`/password-new/${username}`)
            // history.push({ pathname: '/password-new', state: otp.username });
            // openNotificationOTPSuccess()
            //  openNotificationOTPError()
            // history.push('/');
            // localStorage.removeItem("registerAccount");
          }
        }
        else if (res.status === 400) {
          openNotificationOTPError()
        }
        dispatch({ type: ACTION.LOADING, data: false });
        // openNotification();
        // history.push(ROUTES.NEWS);
      } catch (error) {
        console.log(error);
        dispatch({ type: ACTION.LOADING, data: false });
      }
    }
  };
  const onFinish = (values) => {
    console.log("Finish:", values);
    if (values.otp) {
      if (slug === 'register') {
        // openNotificationOTPSuccess()
        // openNotificationOTPError()
        // history.push('/');

        if (username) {
          var otp = {
            username: username,
            otp_code: values.otp
          }
          // var otp = { otp: `${username.username}-${values.otp}` };
          console.log(otp)
          apiOTP(otp, 1);
        } else {
          // var otp = { otp: `${usernameLocal.username}-${values.otp}` };
          var otp = {
            username: usernameLocal.username,
            otp_code: values.otp
          }
          console.log(otp)
          apiOTP(otp, 1);
        }
      } else {
        // openNotificationOTPSuccess()
        // openNotificationOTPError()
        // history.push('/password-new');
        var otp1 = {
          username: username,
          otp_code: values.otp
        }
        console.log(otp1)
        // localStorage.setItem("password-new", JSON.stringify(otp1))
        apiOTP(otp1, 2);
      }
    } else {
      openNotificationOTPErrorOTP()
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const openNotificationOTPSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Đăng ký tài khoản thành công'
    });
  };
  const openNotificationOTPError = () => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 3,
      description: 'Mã OTP không chính xác hoặc đã hết hạn.'
    });
  };
  const openNotificationOTPErrorForget = () => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 3,
      description: 'Mã OTP không chính xác hoặc đã hết hạn.'
    });
  };
  const openNotificationOTPErrorOTP = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Bạn chưa nhập mã OTP.'

    });
  };
  const openNotificationOTPErrorResendError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gửi lại mã thất bại. Xin vui lòng thử lại.'

    });
  };
  const openNotificationOTPErrorResend = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: `Mã OTP đã được gửi lại vào gmail của bạn`

    });
  };
  const apiOTPForgetPasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiOTPForgetPassword(object);
      console.log(res);
      if (res.status === 200) {
        openNotificationOTPErrorResend()
      }
      else {
        openNotificationOTPErrorResendError()
      }
      // if (res.status === 200) {
      //   if (res.data.success) {
      //     // history.push('/otp/register');
      //     history.push('/')
      //     openNotificationRegisterFailMailPhoneOTP(object.email)
      //   }
      // }
      // else {
      //   openNotificationRegisterUsername()
      // }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const onClickOTP = () => {
    const object = {
      username: username
    }
    apiOTPForgetPasswordData(object)
  }
  return (
    <div className={styles["login"]}>
      <div className={styles["login_img_parent"]}>
        <img className={styles["login_img"]} src={pgc} alt="" />
        {/* <div>Vie</div> */}
      </div>
      <div className={styles['confirm_otp']}>
        <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>Xác minh mã OTP</div>
        <div>Mã xác minh đã được gửi qua gmail mà bạn đã đăng ký</div>

        {/* <div>{`Email: ${username ? username.email : (usernameForgetPassword ? usernameForgetPassword.email : `${usernameLocal.username}`)}`}</div> */}
        <div>Vui lòng nhập OTP</div>
      </div>
      <Form
        onFinishFailed={onFinishFailed}
        onFinish={onFinish} className={styles['confirm_otp_input']}>
        <Form.Item
          style={{ display: 'flex', backgroundColor: 'white' }}
          // label="Username"
          name="otp"
        // rules={[{ required: true, message: '' }]}
        >
          <Input style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', }} maxLength='6' placeholder="" onChange={onChange} />

        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '22.5rem' }}>
          <div>Bạn chưa nhận được mã? <a onClick={onClickOTP} style={{ marginLeft: '0.5rem' }}>Gửi lại OTP</a></div>
          <Link to="/">Đăng nhập</Link>
        </div>
        <div className={styles["login_bottom_left_button_parent"]}>
          <Form.Item style={{ width: '100%' }}>
            <Button
              // className={styles["login_bottom_left_button"]}
              type="primary"
              style={{ width: '100%' }}
              htmlType="submit"
            >
              Xác thực
            </Button>
          </Form.Item >
        </div>
      </Form>
    </div>
  );
}
