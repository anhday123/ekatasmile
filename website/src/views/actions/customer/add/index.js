import styles from './add.module.scss'
import {
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  notification,
  Radio,
  InputNumber,
} from 'antd'
import { addCustomer } from 'apis/customer'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { apiDistrict, apiProvince } from 'apis/information'
import moment from 'moment'
import jwt_decode from 'jwt-decode'

const { Option } = Select
export default function CustomerAdd({ close, reload, text = 'Lưu' }) {
  const [form] = Form.useForm()

  const [gender, setGender] = useState('male')
  const [birthday, setBirthday] = useState(null)
  const dispatch = useDispatch()
  const [location, setLocation] = useState({ province: [], district: [] })
  const storeCurrent = JSON.parse(localStorage.getItem('storeSell'))

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm khách hàng thành công.',
    })
  }

  const onFinish = async (values) => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const obj = {
        gender,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        type: values.type || '',
        birthday: birthday || '',
        address: values.address || '',
        province: values.province || '',
        district: values.district || '',
        balance: [],
      }
      console.log(JSON.stringify(obj))
      const res = await addCustomer(obj)
      console.log('result', res)
      if (res.status == 200 && res.data.data) {
        await reload()
        openNotification()
        close()
        form.resetFields()
      } else
        notification.error({
          message: 'Thất bại!',
          description: res.data.message,
        })
      dispatch({ type: 'LOADING', data: false })
    } catch (e) {
      console.log(e)
      dispatch({ type: 'LOADING', data: false })
    }
  }
  const getAddress = async (api, callback, key, params) => {
    try {
      const res = await api(params)
      console.log(res)
      if (res.status == 200) {
        callback((e) => {
          return { ...e, [key]: res.data.data }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAddress(apiProvince, setLocation, 'province')
    getAddress(apiDistrict, setLocation, 'district')
  }, [])
  return (
    <>
      <div className={styles['supplier_add']}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item label="Họ" name="first_name">
                  <Input size="large" placeholder="Nhập họ khách hàng" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label="Tên khách hàng"
                name="last_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
              >
                <Input size="large" placeholder="Nhập tên khách hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                label="Số diện thọai"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item
                name="type"
                label="Loại khách hàng"
                rules={[{ required: true, message: 'Vui lòng chọn loại khách hàng' }]}
              >
                <Select defaultValue="VÃNG LAI" placeholder="Chọn loại khách hàng" size="large">
                  <Option value="TIỀM NĂNG">Tiềm năng</Option>
                  <Option value="VÃNG LAI">Vãng lai</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item name="birthday" label="Ngày sinh">
                <DatePicker
                  defaultValue={moment(new Date('1995-01-01'))}
                  placeholder="Chọn ngày sinh"
                  size="large"
                  className="br-15__date-picker"
                  style={{ width: '100%' }}
                  onChange={(date, dateString) => {
                    if (date) setBirthday(dateString)
                    else setBirthday(null)
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Tỉnh/thành phố" name="province">
                <Select
                  defaultValue={storeCurrent && storeCurrent.province}
                  size="large"
                  placeholder="Chọn tỉnh/thành phố"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) =>
                    getAddress(apiDistrict, setLocation, 'district', { province_name: value })
                  }
                >
                  {location.province.map((e) => (
                    <Option value={e.province_name}>{e.province_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <Form.Item label="Quận/huyện" name="district">
                <Select
                  defaultValue={storeCurrent && storeCurrent.district}
                  size="large"
                  placeholder="Chọn quận/huyện"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {location.district.map((e) => (
                    <Option value={e.district_name}>{e.district_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Radio.Group defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Row>
          <Row justify="end">
            <Form.Item>
              <Button
                style={{ width: '7.5rem', backgroundColor: '#0877DE' }}
                type="primary"
                htmlType="submit"
                size="large"
              >
                {text}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </>
  )
}
