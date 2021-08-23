import styles from "./../uid/uid.module.scss";
import "antd/dist/antd.css";
import React, {  useEffect } from "react";
import { useDispatch } from 'react-redux'
import { ACTION } from '../../consts/index'
import { apiOTPMain } from "../../apis/otp";
import { checkUID } from "../../apis/uid";
import {
 
  useParams,
  Link,
  useHistory,
} from "react-router-dom";
import pgc from "./../../assets/img/logo.png";
import { Form, Input, Button, notification } from "antd";
export default function UID() {
  var username = JSON.parse(localStorage.getItem('registerAccount'))
  var usernameLocal = JSON.parse(localStorage.getItem('username'))
  var usernameForgetPassword = JSON.parse(localStorage.getItem('forget-password'))
  const dispatch = useDispatch()
  let history = useHistory();
  let { slug } = useParams();
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

      if (res.status === 200) {
        history.push(`/otp/register/${res.data.data.username}`)
      } else {
        history.push('/')
        errorOTP()
      }
     
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    checkUIDData();
  }, []);
 
  const apiOTP = async (otp, data) => {
    if (data === 1) {
      console.log(otp)
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await apiOTPMain(otp);
        if (res.status === 200) {
          if (res.data.data.active) {
            openNotificationOTPSuccess()
            history.push('/');
            localStorage.removeItem("registerAccount");
            localStorage.removeItem("username");
          } else {
            openNotificationOTPError()
          }
        }
        dispatch({ type: ACTION.LOADING, data: false });

      } catch (error) {
        console.log(error);
        dispatch({ type: ACTION.LOADING, data: false });
      }
    } else {
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await apiOTPMain(otp);
        console.log(res);
        if (res.status === 200) {
          if (res.data.data.active) {
            history.push('/password-new');
           
          } else {
            openNotificationOTPError()
          }
        }
        dispatch({ type: ACTION.LOADING, data: false });
     
      } catch (error) {
        console.log(error);
        dispatch({ type: ACTION.LOADING, data: false });
      }
    }
  };
  const onFinish = (values) => {
    if (slug === 'register') {

      if (username) {
        var otp = {
          username: username.username,
          otp_code: values.otp
        }
        console.log(otp)
        apiOTP(otp, 1);
      } else {
        var otp = {
          username: usernameLocal.username,
          otp_code: values.otp
        }
        apiOTP(otp, 1);
      }
    } else {
    
      var otp1 = { otp: `${usernameForgetPassword.username}-${values.otp}` };
      localStorage.setItem("password-new", JSON.stringify(otp1))
      apiOTP(otp1, 2);
    }
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
      </div>
      <div className={styles['confirm_otp']}>
        <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>Xác minh mã OTP</div>
        <div>Mã xác minh đã được gửi qua gmail mà bạn đã đăng ký</div>

        <div>Vui lòng nhập OTP</div>
      </div>
      <Form
        onFinish={onFinish} className={styles['confirm_otp_input']}>
        <Form.Item
          style={{ display: 'flex', backgroundColor: 'white' }}
          name="otp"
        >
          <Input style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', }} maxLength='6' placeholder="" />

        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '22.5rem' }}>
          <div>Bạn chưa nhận được mã? <a style={{ marginLeft: '0.5rem' }}>Gửi lại OTP</a></div>
          <Link to="/">Đăng nhập</Link>
        </div>
        <div className={styles["login_bottom_left_button_parent"]}>
          <Form.Item style={{ width: '100%' }}>
            <Button
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
