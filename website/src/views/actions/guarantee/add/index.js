import styles from './../add/add.module.scss'
import { Form, notification, Row, Col, Input, InputNumber, Button } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react'
import { addWarranty } from '../../../../apis/warranty'
import { ROUTES } from 'consts'

export default function GuaranteeAdd() {
  let history = useHistory()
  const [form] = Form.useForm()

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Tạo phiếu bảo hành.',
    })
  }
  const onFinish = async (values) => {
    try {
      const res = await addWarranty({
        ...values,
        description: values.description || '',
      })
      if (res.status == 200) {
        openNotification()
        history.push(ROUTES.GUARANTEE)
      }
    } catch (e) {
      notification.error({
        message: 'Thất bại',
        description: e.data ? e.data.message : 'Tạo bảo hành thất bại',
      })
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        onFinishFailed={onFinishFailed}
        className={styles['product_check_add']}
      >
        <Row
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(231, 219, 219)',
            paddingBottom: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={5} xl={5}>
            <Link
              to={ROUTES.GUARANTEE}
              style={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div>
                <ArrowLeftOutlined
                  style={{
                    color: 'black',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                />
              </div>
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginLeft: '0.5rem',
                }}
              >
                Tạo phiếu bảo hành
              </div>
            </Link>
          </Col>
        </Row>
        <Row
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 15,
          }}
        >
          <Col span={11}>
            <Form.Item
              label="Tên bảo hành"
              name="name"
              rules={[
                { required: true, message: 'Tên bảo hành không được để trống' },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              label="Thời hạn bảo hành (tháng)"
              name="time"
              rules={[
                {
                  required: true,
                  message: 'Thời hạn bảo hành không được để trống',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                className="br-15__input"
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              label="Loại bảo hành"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Loại bảo hành không được để trống',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row
          style={{
            width: '100%',
            marginBottom: 20,
            justifyContent: 'flex-end',
          }}
        >
          <Button size="large" type="primary" htmlType="submit">
            Tạo
          </Button>
        </Row>
      </Form>
    </>
  )
}
