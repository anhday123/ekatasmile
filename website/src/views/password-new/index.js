import React, { useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts/index'

//antd
import { Form, Input, Button, notification, Row, Col } from 'antd'

//icons
import { LockOutlined } from '@ant-design/icons'
import store from 'assets/img/store.png'

//apis
import { resetPassword } from 'apis/auth'

export default function PasswordNew() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [form] = Form.useForm()
  let history = useHistory()

  var username = location.state && location.state.username

  const _changePassword = async (dataForm) => {
    try {
      if (dataForm.password !== dataForm.passwordAgain) {
        notification.warning({ message: 'Nhập lại mật khẩu không chính xác' })
        return
      }

      dispatch({ type: ACTION.LOADING, data: true })

      const body = { ...dataForm, username: username }
      delete body.passwordAgain
      const res = await resetPassword(body)
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          history.push(ROUTES.LOGIN)
          notification.success({ message: 'Thay đổi mật khẩu thành công' })
        } else
          notification.error({
            message: res.data.message || 'Thay đổi mật khẩu không thành công, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Thay đổi mật khẩu không thành công, vui lòng thử lại',
        })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  useEffect(() => {
    if (!location.state) history.push(ROUTES.LOGIN)
  }, [])

  return (
    <Row justify="center" align="middle" style={{ backgroundColor: '#5B6BE8' }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={10}>
        <div style={{ color: 'white' }}>
          <h2
            style={{
              color: 'white',
              textAlign: 'center',
              marginBottom: 25,
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            Tạo mật khẩu mới
          </h2>
          <Form
            style={{ paddingLeft: '10%', paddingRight: '10%' }}
            layout="vertical"
            form={form}
            onFinish={_changePassword}
          >
            <Form.Item
              label={<div style={{ color: 'white' }}>Nhập mật khẩu mới</div>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mật khẩu mới"
              />
            </Form.Item>
            <Form.Item
              label={<div style={{ color: 'white' }}>Nhập lại mật khẩu mới</div>}
              name="passwordAgain"
              rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu mới' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                  backgroundColor: 'black',
                  borderColor: 'black',
                  borderRadius: 40,
                }}
              >
                Thay đổi mật khẩu
              </Button>
            </Form.Item>
            <Row justify="end">
              <Link to={ROUTES.LOGIN} style={{ color: 'white' }}>
                Quay về đăng nhập
              </Link>
            </Row>
          </Form>
        </div>
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
