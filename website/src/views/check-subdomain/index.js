import React, { useState } from 'react'
import styles from './check-subdomain.module.scss'
import { useDispatch } from 'react-redux'
import { ACTION, ROUTES } from 'consts'
import { useHistory } from 'react-router-dom'

//antd
import { Row, Col, Form, Input, Button, notification, Tabs } from 'antd'

//apis
import { checkDomain } from 'apis/app'

export default function CheckSubdomain() {
  const dispatch = useDispatch()
  const [formLogin] = Form.useForm()
  const history = useHistory()

  const [key, setKey] = useState('login')

  const _checkSubdomain = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await checkDomain(body.business_name)
      if (res.status === 200) {
        if (res.data.success)
          window.location.href = `https://${body.business_name}.vdropship.vn/login`
        else
          notification.warning({
            message: res.data.message || 'Tên doanh nghiệp chưa được đăng ký!',
          })
      } else
        notification.warning({ message: res.data.message || 'Tên doanh nghiệp chưa được đăng ký!' })

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (err) {
      console.log(err)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  return (
    <div>
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
            }}
          >
            <Tabs.TabPane
              tab={<div style={{ fontSize: 23, fontWeight: 700, color: 'white' }}>Đăng nhập</div>}
              key="login"
            >
              <Row justify="center" align="middle" style={{ padding: '0px 80px' }}>
                <Form
                  form={formLogin}
                  onFinish={_checkSubdomain}
                  layout="vertical"
                  style={{ width: '100%' }}
                >
                  <Form.Item
                    label={<div style={{ color: 'white' }}>Nhập tên doanh nghiệp của bạn</div>}
                    name="business_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp của bạn!' }]}
                  >
                    <Input size="large" placeholder="Tên doanh nghiệp" />
                  </Form.Item>
                  <Row justify="center">
                    <Form.Item style={{ width: '100%' }}>
                      <Button
                        size="large"
                        style={{
                          width: '100%',
                          backgroundColor: 'black',
                          borderColor: 'black',
                          color: 'white',
                        }}
                        htmlType="submit"
                      >
                        Tiếp
                      </Button>
                    </Form.Item>
                  </Row>
                </Form>
                <Row >
                  <Col span={24} style={{ color: 'white', textAlign: 'right' }}>
                    Tạo không gian quản lí doanh nghiệp của riêng bạn?
                  </Col>
                  <Col span={24}
                    onClick={() => history.push({ pathname: ROUTES.REGISTER })}
                    className={styles['login-content-click']}
                  >
                    Đăng ký miễn phí!
                  </Col>
                </Row>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  )
}
