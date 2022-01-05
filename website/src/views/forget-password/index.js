import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'
import store from 'assets/img/store.png'

//antd
import { Form, Input, Button, notification, Row, Col } from 'antd'

//icons
import { UserOutlined } from '@ant-design/icons'

//apis
import { getOtp } from 'apis/auth'

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
    <Row justify="center" align="middle" style={{ backgroundColor: '#5B6BE8', color: 'white' }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={10}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
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

          <Form.Item>
            <Button
              onClick={sendOtp}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'black', borderColor: 'black', width: '100%' }}
            >
              Xác nhận
            </Button>
          </Form.Item>
          <Row justify="end">
            <Link to={ROUTES.LOGIN} style={{ color: 'white' }}>
              Quay về đăng nhập
            </Link>
          </Row>
        </Form>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={14}>
        <img
          src={store}
          style={{
            backgroundColor: 'white',
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
