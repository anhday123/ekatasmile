import React, { useState } from 'react'
import styles from './register.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ACTION, ROUTES } from 'consts'

//icons
import store from 'assets/img/store.png'

//antd
import { Row, Col, Form, Input, Button, notification, Tabs } from 'antd'

//apis
import { register } from 'apis/auth'

export default function Login() {
  const dispatch = useDispatch()
  const [formLogin] = Form.useForm()
  const [formRegister] = Form.useForm()
  let history = useHistory()

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
        business_name: dataForm.username,
        first_name: '',
        last_name: dataForm.username,
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
    <Row className={styles['registration']}>
      <img
        src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/bg-register.jpg"
        alt="background"
      />
      <div className={styles['registration-content']}>
        <Tabs
          className="tabs-login"
          size="large"
          activeKey="register"
          centered
          onChange={(key) => {
            formLogin.resetFields()
            formRegister.resetFields()
          }}
        >
          <Tabs.TabPane
            tab={
              <div className={styles['registration-content-container']}>
                <div className={styles['registration-content--logo']}>
                  <img
                    style={{ maxWidth: 120, maxHeight: 120 }}
                    src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/09/02/95131dfc-bf13-4c49-82f3-6c7c43a7354d_logo_quantribanhang 1.png"
                    alt="logo"
                  />
                </div>
              </div>
            }
            key="register"
          >
            <div className={styles['registration-content-container']}>
              <div className={styles['registration-content--form']}>
                <Form layout="vertical" form={formRegister} onFinish={_register}>
                  <Row gutter={[20, 20]} style={{ padding: '0px 20px' }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        // label={<div style={{ color: 'white' }}>Số điện thoại đăng ký</div>}
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Nhập số điện thoại"
                          className={styles['input']}
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Tên doanh nghiệp</div>}
                    name="business_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp' }]}
                  >
                    <Input size="large" placeholder="Nhập tên doanh nghiệp" />
                  </Form.Item>
                </Col> */}
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                        // label={<div style={{ color: 'white' }}>Email</div>}
                        name="email"
                      >
                        <Input size="large" placeholder="Nhập email" className={styles['input']} />
                      </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    label={<div style={{ color: 'white' }}>Tên</div>}
                    name="last_name"
                  >
                    <Input size="large" placeholder="Tên" />
                  </Form.Item>
                </Col> */}
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        // label={<div style={{ color: 'white' }}>Mật khẩu</div>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                      >
                        <Input.Password
                          size="large"
                          type="password"
                          placeholder="Mật khẩu"
                          className={styles['input']}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        // label={<div style={{ color: 'white' }}>Nhập lại mật khẩu</div>}
                        name="passwordAgain"
                        rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu' }]}
                      >
                        <Input.Password
                          size="large"
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          className={styles['input']}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row justify="center">
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className={styles['btn-registration']}
                      >
                        Đăng ký dùng thử
                      </Button>
                    </Form.Item>
                  </Row>
                </Form>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Row>
  )
}
