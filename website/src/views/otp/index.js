import React, { useEffect } from 'react'
import styles from './otp.module.scss'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts/index'
import { verify, getOtp } from 'apis/auth'
import { useHistory, useLocation } from 'react-router-dom'
import { Form, Input, Button, notification, Row, Col } from 'antd'
import jwt_decode from 'jwt-decode'
import delay from 'delay'

export default function OTP() {
  const dispatch = useDispatch()
  let history = useHistory()
  let location = useLocation()
  const [form] = Form.useForm()

  const username = location.state && (location.state.username || '')

  const _verifyAccount = async () => {
    try {
      await form.validateFields()
      dispatch({ type: ACTION.LOADING, data: true })
      const dataForm = form.getFieldsValue()
      var body = { username: username, otp_code: dataForm.otp }
      const res = await verify(body)
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Xác thực otp thành công' })

          if (location.state.action && location.state.action === 'FORGOT_PASSWORD') {
            history.push({ pathname: ROUTES.PASSWORD_NEW, state: { username } })
            return
          }

          dispatch({ type: ACTION.LOGIN, data: res.data.data })

          //luu branch id len redux
          const dataUser = jwt_decode(res.data.data.accessToken)
          dispatch({ type: 'SET_BRANCH_ID', data: dataUser.data.branch_id })

          await delay(300)
          window.location.href = `https://${dataUser.data._business.business_name}.vdropship.vn${ROUTES.OVERVIEW}`
        } else
          notification.error({
            message: res.data.message || 'Xác thực otp thất bại, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Xác thực otp thất bại, vui lòng thử lại',
        })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const _resendOtp = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getOtp(username)
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
    <Row justify="center" align="middle" className={styles['otp-container']}>
      <img
        src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/bg-register.jpg"
        style={{
          width: '100%',
          height: '100vh',
        }}
        alt=""
      />
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className={styles['otp-content']}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: '10%',
            paddingRight: '10%',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Xác minh mã OTP</div>
          <div>
            Mã otp đã được gửi vào{' '}
            {
              <i>
                <b>{username}</b>
              </i>
            }{' '}
            của bạn
          </div>
          <Form form={form} style={{ marginTop: 15, width: '100%' }}>
            <Form.Item name="otp" rules={[{ required: true, message: 'Bạn chưa nhập mã otp' }]}>
              <Input
                size="large"
                onPressEnter={_verifyAccount}
                className={styles['input']}
                maxLength="6"
                placeholder="Nhập mã xác thực otp"
              />
            </Form.Item>
            <Row wrap={false} align="middle" style={{ color: 'white' }}>
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
            className={styles['otp-button']}
            onClick={_verifyAccount}
          >
            Xác thực
          </Button>
        </div>
      </Col>
    </Row>
  )
}
