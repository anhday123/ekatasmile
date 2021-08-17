import styles from './../password-new/password-new.module.scss'
import 'antd/dist/antd.css'
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
  useHistory,
  useLocation
} from "react-router-dom";
import pgc from './../../assets/img/logo.png'
import { changePasswordMain } from "../../apis/changePassword";
import { useDispatch } from 'react-redux'
import { ACTION } from './../../consts/index'
import { Form, Input, Button, notification } from 'antd'
import {
  LockOutlined,
} from '@ant-design/icons'
export default function PasswordNew() {
  let { slug } = useParams();
  var username = slug
  const dispatch = useDispatch()
  // const router = useRouter()
  const [form] = Form.useForm()
  let history = useHistory()
  const changePasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await changePasswordMain(object);
      console.log(res);
      if (res.status === 200) {
        if (res.data.success) {
          history.push('/');
          openNotificationLoginSuccess()
          // localStorage.removeItem("password-new");
          // localStorage.removeItem("forget-password");
        }
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
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
  const onFinishRegister = (values) => {
    console.log('Finish:', values)
    if (username) {
      if (values.passwordRegister.trim() === values.RepasswordRegister.trim() && password_validate(values.passwordRegister.trim())) {
        const object1 = {
          username: username.trim(),
          password: values.passwordRegister.trim()
        }
        console.log(object1)
        changePasswordData(object1);
      } else {
        openNotificationLoginError()
      }
      // form.resetFields()
      // openNotificationLoginSuccess()
      // openNotificationLoginError()
      // history.push('/')
    } else {
      openNotificationLoginErrorPasswordUsername()
      history.push('/forget-password')
    }
  }
  const openNotificationLoginSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thay đổi mật khẩu thành công'
    })
  }
  const openNotificationLoginErrorPassword = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Mật khẩu phải có độ dài lớn hơn 5 ký tự'
    })
  }
  const openNotificationLoginErrorPasswordUsername = () => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 3,
      description: 'Đã hết thời hạn đổi mật khẩu mới. Xin vui lòng nhập lại tài khoản.'
    })
  }
  const openNotificationLoginError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description: 'Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
    })
  }
  return (
    <div className={styles['login']}>
      <div className={styles['login_img_parent']}>
        <img className={styles['login_img']} src={pgc} alt="" />
        {/* <div>Vie</div> */}
      </div>
      <div className={styles['login_forget']}>
        <div
          style={{
            color: '#1890FF',
            marginBottom: '1rem',
            fontSize: '1.25rem',
          }}
        >
          Tạo mật khẩu mới
        </div>
        <div className={styles['login_forget_title']}>
          Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.
        </div>
      </div>
      <Form
        className={styles['login_bottom']}
        form={form}
        onFinish={onFinishRegister}
      >
        <Form.Item
          className={styles['login_bottom_password']}
          name="passwordRegister"
          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
        >
          <Input.Password
            size="large"
            prefix={
              <LockOutlined className="site-form-item-icon" />
            }
            type="password"
            placeholder="Mật khẩu mới"
          />
        </Form.Item>
        <Form.Item
          className={styles['login_bottom_password']}
          name="RepasswordRegister"
          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
        >
          <Input.Password
            size="large"
            prefix={
              <LockOutlined className="site-form-item-icon" />
            }
            type="password"
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>
        <Link to="/" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }} className={styles['login_bottom_email']}>Đăng nhập</Link>
        <div className={styles['login_bottom_left_button_parent']}>
          <Form.Item>
            <Button
              className={styles['login_bottom_left_button']}
              type="primary"
              htmlType="submit"
            >
              Thay đổi mật khẩu
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* <div className={styles["copyright"]}>
        <div>Copyright © 2021 Vie. All rights reserved.</div>
      </div> */}
    </div>
  )
}
