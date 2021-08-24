import styles from './../otp/otp.module.scss'
import 'antd/dist/antd.css'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from './../../consts/index'
import { apiOTPForgetPassword, apiOTPMain } from '../../apis/otp'
import { Link, useHistory, useLocation } from 'react-router-dom'
import pgc from './../../assets/img/logo.png'
import { Form, Input, Button, notification } from 'antd'
export default function OTP() {
  const dispatch = useDispatch()
  let history = useHistory()
  let location = useLocation()
  var username = location.state && location.state.username
  console.log(username)
  const apiOTP = async (otp) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiOTPMain(otp)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          openNotificationOTPSuccess()
          if (location.state.action === 'REGISTER') history.push(ROUTES.LOGIN)
          else
            history.push({
              pathname: ROUTES.PASSWORD_NEW,
              state: { username },
            })
        }
      } else {
        openNotificationOTPError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const onFinish = (values) => {
    var body = {
      username: username,
      otp_code: values.otp,
    }
    apiOTP(body)
  }

  const openNotificationOTPSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Xác nhận mã otp thành công',
    })
  }
  const openNotificationOTPError = () => {
    notification.error({
      duration: 3,
      description: 'Mã OTP không chính xác hoặc đã hết hạn.',
    })
  }

  const openNotificationOTPErrorResendError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Gửi lại mã thất bại. Xin vui lòng thử lại.',
    })
  }
  const openNotificationOTPErrorResend = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: `Mã OTP đã được gửi lại vào gmail của bạn`,
    })
  }
  const apiOTPForgetPasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiOTPForgetPassword(object)
      console.log(res)
      if (res.status === 200) {
        openNotificationOTPErrorResend()
      } else {
        openNotificationOTPErrorResendError()
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const onClickOTP = () => {
    const object = {
      username: username,
    }
    apiOTPForgetPasswordData(object)
  }

  useEffect(() => {
    if (!location.state) history.goBack()
  }, [])

  return (
    <div className={styles['login']}>
      <div className={styles['login_img_parent']}>
        <img className={styles['login_img']} src={pgc} alt="" />
      </div>
      <div className={styles['confirm_otp']}>
        <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
          Xác minh mã OTP
        </div>
        <div>Mã xác minh đã được gửi qua gmail mà bạn đã đăng ký</div>

        <div>Vui lòng nhập OTP</div>
      </div>
      <Form onFinish={onFinish} className={styles['confirm_otp_input']}>
        <Form.Item
          name="otp"
          rules={[{ required: true, message: 'Bạn chưa nhập mã otp' }]}
        >
          <Input
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
            maxLength="6"
            placeholder=""
          />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '22.5rem',
          }}
        >
          <div>
            Bạn chưa nhận được mã?{' '}
            <a onClick={onClickOTP} style={{ marginLeft: '0.5rem' }}>
              Gửi lại OTP
            </a>
          </div>
          <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </div>
        <div className={styles['login_bottom_left_button_parent']}>
          <Form.Item style={{ width: '100%' }}>
            <Button type="primary" style={{ width: '100%' }} htmlType="submit">
              Xác thực
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
