import styles from './../password-new/password-new.module.scss'
import 'antd/dist/antd.css'
import React, { useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import pgc from 'assets/img/logo.png'
import { changePasswordMain } from 'apis/changePassword'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts/index'
import { Form, Input, Button, notification, Row, Col } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import store from 'assets/img/store.png'

export default function PasswordNew() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [form] = Form.useForm()
  let history = useHistory()

  var username = location.state && location.state.username
  const changePasswordData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await changePasswordMain(object)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          history.push(ROUTES.LOGIN)
          openNotificationLoginSuccess()
        } else
          notification.error({
            message: 'Thay đổi mật khẩu không thành công, vui lòng thử lại',
          })
      } else
        notification.error({
          message: 'Thay đổi mật khẩu không thành công, vui lòng thử lại',
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function password_validate(password) {
    var re = {
      full: /^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()?])[A-Za-z0-9\d!@#$%^&*()?]{8,}$/,
    }
    return re.full.test(password)
  }
  const onFinishRegister = (values) => {
    if (
      values.passwordRegister.trim() === values.RepasswordRegister.trim() &&
      password_validate(values.passwordRegister.trim())
    ) {
      const object1 = {
        username: username.trim(),
        password: values.passwordRegister.trim(),
      }
      changePasswordData(object1)
    } else {
      openNotificationLoginError()
    }
  }
  const openNotificationLoginSuccess = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: 'Thay đổi mật khẩu thành công',
    })
  }

  const openNotificationLoginError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 5,
      description:
        'Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký tự đặc biệt.',
    })
  }

  useEffect(() => {
    if (!location.state) history.goBack()
  }, [])
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
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            Tạo mật khẩu mới
          </div>
          <div className={styles['login_forget_title']}>
            Mật khẩu phải giống nhau, tối thiểu 8 ký tự, chứa chữ hoặc số và ký
            tự đặc biệt.
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
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu mới"
              style={{ borderRadius: 40 }}
            />
          </Form.Item>
          <Form.Item
            className={styles['login_bottom_password']}
            name="RepasswordRegister"
            rules={[{ required: true, message: 'Giá trị rỗng!' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              style={{ borderRadius: 40 }}
            />
          </Form.Item>
          <Link
            to={ROUTES.LOGIN}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '1.5rem',
              color: 'white',
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
                Thay đổi mật khẩu
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
