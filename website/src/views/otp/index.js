import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts/index'
import store from 'assets/img/store.png'
import { verify, getOtp } from 'apis/auth'
import { useHistory, useLocation } from 'react-router-dom'
import { Form, Input, Button, notification, Row, Col } from 'antd'
import jwt_decode from 'jwt-decode'

export default function OTP() {
  const dispatch = useDispatch()
  let history = useHistory()
  let location = useLocation()
  const [form] = Form.useForm()

  const username = location.state && location.state.username
  const phone = location.state && location.state.phone

  const _verifyAccount = async () => {
    try {
      await form.validateFields()
      dispatch({ type: ACTION.LOADING, data: true })
      const dataForm = form.getFieldsValue()
      var body = { username: phone || username, otp_code: dataForm.otp }
      const res = await verify(body)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          dispatch({ type: ACTION.LOGIN, data: res.data.data })

          //luu branch id len redux
          const dataUser = jwt_decode(res.data.data.accessToken)
          dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.branch_id })

          notification.success({ message: 'Xác thực otp thành công' })
          history.push(ROUTES.OVERVIEW)
        } else
          notification.error({
            message: res.data.message || 'Xác thực otp thất bại, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Xác thực otp thất bại, vui lòng thử lại',
        })

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const _resendOtp = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getOtp(phone)
      if (res.status === 200) {
        if (res.data.success)
          notification.success({ message: 'Gửi lại otp thành công, vui lòng kiểm tra lại' })
        else notification.error({ message: 'Gửi lại otp thất bại, vui lòng thử lại' })
      } else notification.error({ message: 'Gửi lại otp thất bại, vui lòng thử lại' })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  useEffect(() => {
    if (!location.state) history.push(ROUTES.LOGIN)
  }, [])

  return (
    <Row align="middle" style={{ backgroundColor: '#5B6BE8' }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={10}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            paddingLeft: '10%',
            paddingRight: '10%',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Xác minh mã OTP</div>
          <div>
            {location.state && location.state.phone
              ? `Mã otp đã được gửi vào số điện thoại ${
                  location.state && <b>{location.state.phone}</b>
                }`
              : 'Mã otp đã được gửi vào email của bạn'}
          </div>
          <Form form={form} style={{ marginTop: 15, width: '100%' }}>
            <Form.Item name="otp" rules={[{ required: true, message: 'Bạn chưa nhập mã otp' }]}>
              <Input
                size="large"
                onPressEnter={_verifyAccount}
                style={{ textAlign: 'center' }}
                maxLength="6"
                placeholder="Nhập mã xác thực otp"
              />
            </Form.Item>
            <Row
              wrap={false}
              align="middle"
              style={{ display: location.state && !location.state.phone && 'none', color: 'white' }}
            >
              <div>Bạn chưa nhận được mã? </div>
              <p
                onClick={_resendOtp}
                style={{
                  marginBottom: 0,
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  fontWeight: 700,
                }}
              >
                Gửi lại OTP
              </p>
            </Row>
          </Form>
          <Button
            size="large"
            type="primary"
            style={{
              width: '100%',
              borderColor: 'black',
              backgroundColor: 'black',
              borderRadius: 40,
              marginTop: 5,
            }}
            onClick={_verifyAccount}
          >
            Xác thực
          </Button>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={14}>
        <img
          src={store}
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'contain',
            backgroundColor: 'white',
          }}
          alt=""
        />
      </Col>
    </Row>
  )
}
