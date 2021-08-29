import styles from './../add/add.module.scss'
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
} from 'antd'
import { addCustomer } from '../../../../apis/customer'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { apiDistrict, apiProvince } from '../../../../apis/information'
const { Option } = Select
export default function CustomerAdd({ close, reload }) {
  const [gender, setGender] = useState('male')
  const [birthday, setBirthday] = useState(null)
  const dispatch = useDispatch()
  const [Location, setLocation] = useState({ province: [], district: [] })
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật thông tin khách hàng thành công.',
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
      } else notification.error({ message: 'Tạo khách hàng không thành công!' })
      dispatch({ type: 'LOADING', data: false })
    } catch (e) {
      console.log(e)
      dispatch({ type: 'LOADING', data: false })
    }
  }
  const getAddress = async (api, callback, key, params) => {
    try {
      const res = await api(params)
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
  }, [])
  return (
    <>
      <div className={styles['supplier_add']}>
        <Form className={styles['supplier_add_content']} onFinish={onFinish}>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  <span style={{ color: '#ff4d4f' }}>*</span> Họ
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="first_name"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập họ" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  <span style={{ color: '#ff4d4f' }}>*</span> Tên
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="last_name"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập tên" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Ngày sinh
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="birthday"
                >
                  <DatePicker
                    size="large"
                    className="br-15__date-picker"
                    style={{ width: '100%' }}
                    onChange={(date, dateString) => {
                      if (date) setBirthday(dateString)
                      else setBirthday(null)
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  <span style={{ color: '#ff4d4f' }}>*</span> Liên hệ
                </div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phone"
                  className={styles['supplier_add_content_supplier_code_input']}
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input size="large" placeholder="Nhập liên hệ" />
                </Form.Item>
              </div>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  <span style={{ color: '#ff4d4f' }}>*</span> Loại khách hàng
                </div>
                <Form.Item
                  name="type"
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select placeholder="Chọn loại khách hàng" size="large">
                    <Option value="Tiềm năng">Tiềm năng</Option>
                    <Option value="Vãng lai">Vãng lai</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Địa chỉ
                </div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="address"
                  className={styles['supplier_add_content_supplier_code_input']}
                >
                  <Input placeholder="Nhập địa chỉ" size="large" />
                </Form.Item>
              </div>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Tỉnh/thành phố
                </div>
                <Form.Item name="province" hasFeedback>
                  <Select
                    size="large"
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={(e) =>
                      getAddress(apiDistrict, setLocation, 'district', {
                        keyword: e,
                      })
                    }
                  >
                    {Location.province.map((e) => (
                      <Option value={e.province_name}>{e.province_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Quận/huyện
                </div>
                <Form.Item name="district" hasFeedback>
                  <Select size="large" placeholder="Chọn quận/huyện">
                    {Location.district.map((e) => (
                      <Option value={e.district_name}>{e.district_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
          >
            <Radio.Group
              defaultValue={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Row>
          <Row className={styles['supplier_add_content_supplier_button']}>
            <Col
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              xs={24}
              sm={24}
              md={5}
              lg={4}
              xl={3}
            >
              <Form.Item>
                <Button
                  style={{ width: '7.5rem' }}
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}
