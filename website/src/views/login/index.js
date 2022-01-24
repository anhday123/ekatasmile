import React, { useState, useEffect } from 'react'
import styles from './login.module.scss'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { ACTION, ROUTES } from 'consts'
import jwt_decode from 'jwt-decode'

//antd
import { Row, Col, Form, Input, Button, notification, Select, Tabs } from 'antd'

//apis
import { register, login, getOtp } from 'apis/auth'
import { checkDomain } from 'apis/app'

export default function Login() {
  const dispatch = useDispatch()
  const [formLogin] = Form.useForm()
  const [formRegister] = Form.useForm()
  let history = useHistory()

  const [key, setKey] = useState('login')
  const [loadingCheckDomain, setLoadingCheckDomain] = useState(false)

  // const checkSubdomain = async () => {
  //   const domain = window.location.href

  //   // check domain login
  //   if (!domain.includes('vdropship.vn/check-subdomain')) {
  //     setLoadingCheckDomain(true)

  //     let subDomain = domain.split('.vdropship.vn')
  //     subDomain = subDomain[0].split('//')
  //     console.log(subDomain)

  //     //Khi code comment lại, code xong để lại như cũ
  //     // const res = await checkDomain(subDomain[1])
  //     // console.log(res)
  //     // if (res.status === 200) {
  //     //   if (res.data.success) {
  //     //   } else {
  //     //     window.location.href = 'https://vdropship.vn/check-subdomain'
  //     //     return
  //     //   }
  //     // } else {
  //     //   window.location.href = 'https://vdropship.vn/check-subdomain'
  //     //   return
  //     // }
  //   }

  //   setLoadingCheckDomain(false)
  // }

  const _login = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })

      const domain = window.location.href
      let subDomain = domain.split('.vdropship.vn')
      subDomain = subDomain[0].split('//')
      console.log(subDomain)

      //Khi code comment lại, code xong để lại như cũ
      // const res = await login({ ...body, username: body.username }, { shop: 'buidinhvietduc' })
      const res = await login({ ...body, username: body.username }, { shop: subDomain[1] })

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

  // useEffect(() => {
  //   checkSubdomain()
  // }, [])

  return (
    <Row className={styles['login-container']}>
      <Col xs={24} sm={24} md={14} lg={14} xl={10} className={styles['login-content']}>
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
                  label={<div style={{ color: 'white' }}>SĐT đăng nhập</div>}
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập SĐT đăng nhập!' }]}
                >
                  <Input size="large" placeholder="Nhập SĐT" />
                </Form.Item>
                <Form.Item
                  label={<div style={{ color: 'white' }}>Mật khẩu</div>}
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password size="large" type="password" placeholder="Mật khẩu" />
                </Form.Item>
                <Row justify="end">
                  <Link to={ROUTES.FORGET_PASSWORD} style={{ margin: '20px 0px', color: 'white' }}>
                    Quên mật khẩu?
                  </Link>
                </Row>
                <Row justify="center">
                  <Form.Item style={{ width: '100%' }}>
                    <Button
                      size="large"
                      style={{ width: '100%', backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                      htmlType="submit"
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}
