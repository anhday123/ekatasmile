import styles from "./../uid/uid.module.scss";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { ACTION } from '../../consts/index'
import { apiOTPMain } from "../../apis/otp";
import { checkUID } from "../../apis/uid";
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
export default function UID() {
  var username = JSON.parse(localStorage.getItem('registerAccount'))
  var usernameLocal = JSON.parse(localStorage.getItem('username'))
  var usernameForgetPassword = JSON.parse(localStorage.getItem('forget-password'))
  const dispatch = useDispatch()
  let history = useHistory();
  let { slug } = useParams();
  console.log(slug)
  const errorOTP = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Mã OTP đã hết hạn'
    });
  };
  const checkUIDData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await checkUID({ UID: slug });
      console.log(res)
      console.log("|||000")
      // alert('123')
      if (res.status === 200) {
        history.push(`/otp/register/${res.data.data.username}`)
        // history.push({ pathname: '/otp/register', state: res.data.data.username });
      } else {
        history.push('/')
        errorOTP()
      }
      // if (res.status === 200) {
      //   setSupplier(res.data.data)
      // }

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
    checkUIDData();
  }, []);
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
          if (res.data.data.active) {
            openNotificationOTPSuccess()
            //  openNotificationOTPError()
            history.push('/');
            localStorage.removeItem("registerAccount");
            localStorage.removeItem("username");
          } else {
            openNotificationOTPError()
          }
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
        if (res.status === 200) {
          if (res.data.data.active) {
            history.push('/password-new');
            // openNotificationOTPSuccess()
            //  openNotificationOTPError()
            // history.push('/');
            // localStorage.removeItem("registerAccount");
          } else {
            openNotificationOTPError()
          }
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
    if (slug === 'register') {
      // openNotificationOTPSuccess()
      // openNotificationOTPError()
      // history.push('/');

      if (username) {
        var otp = {
          username: username.username,
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
      var otp1 = { otp: `${usernameForgetPassword.username}-${values.otp}` };
      console.log(otp1)
      localStorage.setItem("password-new", JSON.stringify(otp1))
      apiOTP(otp1, 2);
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
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Xác thực OTP thất bại'

    });
  };
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
          <div>Bạn chưa nhận được mã? <a style={{ marginLeft: '0.5rem' }}>Gửi lại OTP</a></div>
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
