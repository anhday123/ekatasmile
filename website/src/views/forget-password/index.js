import React from 'react'
import styles from './forget-password.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'

//antd
import { Form, Input, Button, notification, Row, Col } from 'antd'

//icons
import { UserOutlined } from '@ant-design/icons'

//apis
import { getOtp } from 'apis/auth'

//background
import background from 'assets/img/bg1.jpg'

export default function ForgetPassword() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  let history = useHistory()

  const sendOtp = async () => {
    try {
      await form.validateFields()
      const dataForm = form.getFieldsValue()
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getOtp(dataForm.username)

      if (res.status === 200) {
        if (res.data.success)
          history.push({
            pathname: ROUTES.OTP,
            state: { username: dataForm.username, action: 'FORGOT_PASSWORD' },
          })
        else
          notification.error({
            message: res.data.message || 'Xác nhận tên tài khoản thất bại, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Xác nhận tên tài khoản thất bại, vui lòng thử lại',
        })

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  return (
    <Row className={styles['forget-pw-container']} align="middle" >
      <img
        src={background}
        style={{
          width: '100%',
          height: '100vh',
          display: 'block'
        }}
        alt=""
      />
      <Col className={styles['forget-pw-content']} xs={24} sm={24} md={24} lg={24} xl={24}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
            color: '#fff'
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: 10, fontWeight: 700 }}>Quên mật khẩu</div>
          <div>Nhập tài khoản của bạn để đặt lại mật khẩu</div>
        </div>
        <Form form={form} style={{ paddingLeft: '10%', paddingRight: '10%' }}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input
              onPressEnter={sendOtp}
              size="large"
              prefix={<UserOutlined />}
              placeholder="Nhập tên tài khoản"
            />
          </Form.Item>

          <Row justify="center" >
            <Form.Item>
              <Button
                onClick={sendOtp}
                size="large"
                type="primary"
                htmlType="submit"
                className={styles['forget-pw-button']}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Row>
          <Row justify="end">
            <Link to={ROUTES.LOGIN} style={{ color: '#fff' }}>
              Quay về đăng nhập
            </Link>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}
