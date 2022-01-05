import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { ACTION, ROUTES } from 'consts'
import jwt_decode from 'jwt-decode'

//icons
import store from 'assets/img/store.png'

//antd
import { Row, Col, Form, Input, Button, notification, Select, Tabs } from 'antd'

//apis
import { register, login, getOtp } from 'apis/auth'

export default function Login() {
  const dispatch = useDispatch()
  const [formLogin] = Form.useForm()
  const [formRegister] = Form.useForm()
  let history = useHistory()

  const [key, setKey] = useState('login')

  const _login = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await login(body)
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(res)

      //check account have verify
      if (res.status === 400)
        if (!res.data.success)
          if (res.data.data) {
            await getOtp(res.data.data.username)
            notification.error({
              message: res.data.message || 'Đăng nhập thất bại, vui lòng thử lại',
            })
            history.push({ pathname: ROUTES.OTP, state: res.data.data })
            return
          }

      if (res.status === 200) {
        if (res.data.success) {
          dispatch({ type: ACTION.LOGIN, data: res.data.data })

          //luu branch id len redux
          const dataUser = jwt_decode(res.data.data.accessToken)

          dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.branch_id })

          history.push(ROUTES.OVERVIEW)
        } else
          notification.error({
            message: res.data.message || 'Đăng nhập thất bại, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Đăng nhập thất bại, vui lòng thử lại',
        })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const _register = async (dataForm) => {
    try {
      if (dataForm.password !== dataForm.passwordAgain) {
        notification.error({ message: 'Mật khẩu và nhập lại mật khẩu phải giống nhau' })
        return
      }
      if (dataForm.username && !regex.test(dataForm.username)) {
        notification.error({ message: 'Vui lòng nhập số điện thoại đúng định dạng' })
        return
      }
      /*check validated form*/
      delete dataForm.passwordAgain
      const body = {
        ...dataForm,
        avatar: '',
        first_name: dataForm.first_name || '',
        email: dataForm.email || '',
        birthday: '',
        address: '',
        ward: '',
        district: '',
        province: '',
        company_name: '',
        company_website: '',
        tax_code: '',
        fax: '',
        branch: '',
        business_areas: '',
      }

      dispatch({ type: ACTION.LOADING, data: true })
      const res = await register(body)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          if (res.data.verify_with === 'EMAIL') {
            setKey('login')
            notification.info({ message: 'Vui lòng kiểm tra email để lấy link xác thực tài khoản' })
          } else {
            notification.info({ message: 'Mã otp đã được gửi về số điện thoại của bạn' })
            history.push({ pathname: ROUTES.OTP, state: res.data.data })
          }
        } else
          notification.error({
            message: res.data.message || 'Đăng kí không thành công, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Đăng kí không thành công, vui lòng thử lại',
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

  return (
    <Row style={{ backgroundColor: '#5B6BE8' }}>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={10}
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <Tabs
          className="tabs-login"
          size="large"
          activeKey={key}
          centered
          onChange={(key) => {
            setKey(key)
            formLogin.resetFields()
            formRegister.resetFields()
          }}
        >
          <Tabs.TabPane
            tab={<div style={{ fontSize: 23, fontWeight: 700, color: 'white' }}>Đăng nhập</div>}
            key="login"
          >
            <Row justify="center" align="middle" style={{ padding: '0px 80px' }}>
              <Form form={formLogin} onFinish={_login} layout="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label={<div style={{ color: 'white' }}>Tài khoản</div>}
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                >
                  <Input size="large" placeholder="Nhập tài khoản" />
                </Form.Item>
                <Form.Item
                  label={<div style={{ color: 'white' }}>Mật khẩu</div>}
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password size="large" type="password" placeholder="*Mật khẩu" />
                </Form.Item>
                <Row justify="end">
                  <Link to={ROUTES.FORGET_PASSWORD} style={{ margin: '20px 0px', color: 'white' }}>
                    Quên mật khẩu?
                  </Link>
                </Row>
                <Row justify="center">
                  <Form.Item>
                    <Button
                      size="large"
                      style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                      htmlType="submit"
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<div style={{ fontSize: 23, fontWeight: 700, color: 'white' }}>Đăng kí</div>}
            key="register"
          >
            <Form layout="vertical" form={formRegister} onFinish={_register}>
              <Row gutter={[10, 10]} style={{ padding: '0px 20px' }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Số điện thoại</div>}
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Tên doanh nghiệp</div>}
                    name="business_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp' }]}
                  >
                    <Input size="large" placeholder="Nhập tên doanh nghiệp" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    label={<div style={{ color: 'white' }}>Tên</div>}
                    name="last_name"
                  >
                    <Input size="large" placeholder="Tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                    label={<div style={{ color: 'white' }}>Email</div>}
                    name="email"
                  >
                    <Input size="large" placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Mật khẩu</div>}
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                  >
                    <Input.Password size="large" type="password" placeholder="Mật khẩu" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Nhập lại mật khẩu</div>}
                    name="passwordAgain"
                    rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu' }]}
                  >
                    <Input.Password size="large" type="password" placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="center">
                <Form.Item>
                  <Button
                    size="large"
                    style={{ backgroundColor: 'black', color: 'white', border: 'none' }}
                    htmlType="submit"
                  >
                    Tạo tài khoản
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Col>

      <Col xs={24} sm={24} md={24} lg={24} xl={14}>
        <img
          src={store}
          style={{ width: '100%', height: '100vh', objectFit: 'contain', backgroundColor: 'white' }}
          alt=""
        />
      </Col>
    </Row>
  )
}
