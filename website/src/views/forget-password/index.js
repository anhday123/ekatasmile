import styles from './../forget-password/forget-password.module.scss'
import 'antd/dist/antd.css'
import React from 'react'
import {
  Link,
  useHistory,
} from "react-router-dom";
import pgc from './../../assets/img/logo.png'
import { useDispatch } from 'react-redux'
import { ACTION, } from './../../consts/index'
import { Form, Input, Button, notification, } from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons'
import { apiOTPForgetPassword } from '../../apis/otp'
export default function ForgetPassword() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  let history = useHistory()
  const openNotificationForgetPassword = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tài khoản không tồn tại',
    })
  }
  const apiForgetPasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiOTPForgetPassword(object);
      console.log(res);
      console.log("111")
      if (res.status === 200) {
        if (res.data.success) {
          history.push(`/otp/forget-password/${object.username}`)
        }
      
      } else {
        openNotificationForgetPassword()
      }
      
      dispatch({ type: ACTION.LOADING, data: false });
 
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const onFinishRegister = (values) => {
    const object = {
      username: values.usernameRegister.trim(),
    }
    apiForgetPasswordData(object);
  
  }
  return (
    <div className={styles['login']}>
      <div className={styles['login_img_parent']}>
        <img className={styles['login_img']} src={pgc} alt="" />
      </div>
      <div className={styles['login_forget']}>
        <div
          style={{
            color: '#1890FF',
            marginBottom: '1rem',
            fontSize: '1.25rem',
          }}
        >
          Quên mật khẩu
        </div>
        <div className={styles['login_forget_title']}>
          Nhập các thông tin được liên kết với tài khoản của bạn để
          đặt lại mật khẩu
        </div>
      </div>
      <Form
        className={styles['login_bottom']}
        form={form}
        onFinish={onFinishRegister}
      >
        <Form.Item
          className={styles['login_bottom_email']}
          name="usernameRegister"
          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
        >
          <Input
            size="large"
            prefix={
              <UserOutlined className="site-form-item-icon" />
            }
            placeholder="Tài khoản"
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
              Xác nhận
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
