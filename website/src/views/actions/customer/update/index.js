import styles from './update.module.scss'
import {
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  notification,
  Drawer,
  Radio,
  InputNumber,
} from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { updateCustomer } from 'apis/customer'
import { apiProvince, apiDistrict } from 'apis/information'

const { Option } = Select
export default function CustomerUpdate(props) {
  const [loading, setLoading] = useState(false)
  const [Address, setAddress] = useState({ province: [], district: [] })
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const body = {
        ...values.customer[0],
        birthday: values.customer[0].birthday
          ? new Date(values.customer[0].birthday).toString()
          : null,
      }
      const res = await updateCustomer(values.customer[0].customer_id, body)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Cập nhật khách hàng thành công!' })
          props.reload()
          props.onClose()
        } else
          notification.error({
            message: res.data.message || 'Cập nhật khách hàng thất bại, vui lòng thử lại!',
          })
      } else
        notification.error({
          message: res.data.message || 'Cập nhật khách hàng thất bại, vui lòng thử lại!',
        })
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  const getAddress = async (api, callback, keyword, params) => {
    try {
      const res = await api(params)
      if (res.status == 200) {
        callback((e) => {
          return { ...e, [keyword]: res.data.data }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      customer: props.customerData.map((e) => {
        return {
          ...e,
          birthday: e.birthday ? moment(e.birthday) : null,
        }
      }),
    })
  }, [props.customerData])

  useEffect(() => {
    getAddress(apiProvince, setAddress, 'province')
    getAddress(apiDistrict, setAddress, 'district')
  }, [])
  return (
    <Drawer
      title=" Cập nhật thông tin khách hàng"
      visible={props.visible}
      onClose={props.onClose}
      width={1000}
    >
      <Form
        layout="vertical"
        name="dynamic_form_nest_item"
        className={styles['supplier_add_content']}
        onFinish={onFinish}
        form={form}
      >
        <Form.List name="customer">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row justify="space-between" align="middle">
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Họ"
                      {...restField}
                      name={[name, 'first_name']}
                      fieldKey={[fieldKey, 'first_name']}
                    >
                      <Input placeholder="Nhập họ" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Tên"
                      {...restField}
                      name={[name, 'last_name']}
                      fieldKey={[fieldKey, 'last_name']}
                      rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                      <Input placeholder="Nhập tên" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Số điện thoại"
                      {...restField}
                      name={[name, 'phone']}
                      fieldKey={[fieldKey, 'phone']}
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập số điện thoại"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Loại khách hàng"
                      {...restField}
                      name={[name, 'type']}
                      fieldKey={[fieldKey, 'type']}
                      rules={[{ required: true, message: 'Vui lòng chọn loại khách hàng!' }]}
                    >
                      <Select placeholder="Chọn loại khách hàng" size="large">
                        <Option value="TIỀM NĂNG">Tiềm năng</Option>
                        <Option value="VÃNG LAI">Vãng lai</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item label="Ngày sinh" {...restField} name={[name, 'birthday']}>
                      <DatePicker
                        size="large"
                        className="br-15__date-picker"
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày sinh"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Địa chỉ"
                      {...restField}
                      name={[name, 'address']}
                      fieldKey={[fieldKey, 'address']}
                    >
                      <Input placeholder="Nhập địa chỉ" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Tỉnh/thành phố"
                      {...restField}
                      name={[name, 'province']}
                      fieldKey={[fieldKey, 'province']}
                    >
                      <Select
                        size="large"
                        placeholder="Chọn tỉnh/thành phố"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(e) =>
                          getAddress(apiDistrict, setAddress, 'district', {
                            search: e,
                          })
                        }
                      >
                        {Address.province.map((e, index) => (
                          <Option value={e.province_name} key={index}>
                            {e.province_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Quận/huyện"
                      {...restField}
                      name={[name, 'district']}
                      fieldKey={[fieldKey, 'district']}
                    >
                      <Select
                        placeholder="Chọn quận/huyện"
                        showSearch
                        size="large"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {Address.district.map((e, index) => (
                          <Option value={e.district_name} key={index}>
                            {e.district_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                    <Form.Item
                      label="Giới tính"
                      {...restField}
                      name={[name, 'gender']}
                      fieldKey={[fieldKey, 'gender']}
                    >
                      <Radio.Group>
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Form.List>
        <Row justify="end">
          <Form.Item>
            <Button loading={loading} size="large" type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Drawer>
  )
}
