import styles from './forget-password.module.scss'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import pgc from 'assets/img/logo.png'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts/index'
import { Form, Input, Button, notification, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { verify } from 'apis/auth'
import store from 'assets/img/store.png'

export default function ForgetPassword() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  let history = useHistory()
  const openNotificationForgetPassword = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Tài khoản không tồn tại',
    })
  }
  const apiForgetPasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await verify(object)

      if (res.status === 200) {
        if (res.data.success) {
          history.push({
            pathname: ROUTES.OTP,
            state: {
              username: object.username,
              action: 'FORGOT_PASSWORD',
            },
          })
        } else notification.error({ message: 'Có lỗi, vui lòng thử lại' })
      } else openNotificationForgetPassword()

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const onFinishRegister = (values) => {
    const object = {
      username: values.usernameRegister.trim(),
    }
    apiForgetPasswordData(object)
  }
  return (
    <Row
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: '#5B6BE8',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={8}>
        <div className={styles['login_forget']}>
          <div
            style={{
              fontSize: '1.5rem',
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Quên mật khẩu
          </div>
          <div className={styles['login_forget_title']}>
            Nhập tài khoản của bạn để đặt lại mật khẩu
          </div>
        </div>
        <Form className={styles['login_bottom']} form={form} onFinish={onFinishRegister}>
          <Form.Item
            className={styles['login_bottom_email']}
            name="usernameRegister"
            rules={[{ required: true, message: 'Giá trị rỗng!' }]}
          >
            <Input
              style={{ borderRadius: 50 }}
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tài khoản"
            />
          </Form.Item>

          <Link
            to={ROUTES.LOGIN}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              color: 'white',
              marginBottom: '1.5rem',
            }}
            className={styles['login_bottom_email']}
          >
            Đăng nhập
          </Link>

          <div className={styles['login_bottom_left_button_parent']}>
            <Form.Item>
              <Button
                className={styles['login_bottom_left_button']}
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: 'black',
                  borderColor: 'black',
                  borderRadius: 40,
                }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Col>
      <Col
        style={{ width: '100%', height: '100vh', backgroundColor: 'white' }}
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={16}
      >
        <img
          src={store}
          style={{
            width: '100%',
            paddingBottom: '4rem',
            height: '100vh',
            objectFit: 'contain',
          }}
          alt=""
        />
      </Col>
    </Row>
  )
}
