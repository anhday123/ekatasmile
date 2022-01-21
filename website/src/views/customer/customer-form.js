import { useEffect, useState } from 'react'

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
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { ACTION } from 'consts'

//apis
import { getDistricts, getProvinces } from 'apis/address'
import { addCustomer, updateCustomer, getCustomerTypes, addCustomerType } from 'apis/customer'

const { Option } = Select
export default function CustomerForm({ record, close, reload, text = 'Thêm' }) {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const [districts, setDistricts] = useState([])
  const [provinces, setProvinces] = useState([])
  const [provinceName, setProvinceName] = useState('')
  const [customerTypes, setCustomerTypes] = useState([])
  const [type, setType] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)

  const _createType = async () => {
    try {
      if (!type) {
        notification.warning({ message: 'Vui lòng nhập loại khách hàng' })
        return
      }
      setLoadingBtn(true)
      const res = await addCustomerType({ name: type })
      if (res.status === 200) {
        if (res.data.success) {
          await _getCustomerTypes()
          notification.success({ message: 'Tạo loại khách hàng thành công' })
          setType('')
        } else
          notification.error({
            message: res.data.message || 'Tạo loại khách hàng thất bại, vui lòng thử lại',
          })
      } else
        notification.error({
          message: res.data.message || 'Tạo loại khách hàng thất bại, vui lòng thử lại',
        })
      setLoadingBtn(false)
    } catch (error) {
      console.log(error)
      setLoadingBtn(false)
    }
  }

  const onFinish = async (values) => {
    try {
      if (!Number(values.phone)) {
        notification.warning({ message: 'Vui lòng nhập số điện thoại đúng định dạng' })
        return
      }
      dispatch({ type: ACTION.LOADING, data: true })
      const body = {
        ...values,
        point: 0,
        used_point: 0,
        order_quantity: 0,
        order_total_cost: 0,
        first_name: values.first_name || '',
        birthday: values.birthday ? new Date(values.birthday).toString() : null,
        address: values.address || '',
        province: values.province || '',
        district: values.district || '',
        balance: [],
      }
      let res
      if (record) res = await updateCustomer(record.customer_id, body)
      else res = await addCustomer(body)
      console.log('result', res)
      if (res.status === 200) {
        if (res.data.success) {
          reload()
          notification.success({ message: `${record ? 'Cập nhật' : 'Thêm'} khách hàng thành công` })
          close()
          initForm()
        } else
          notification.error({
            message:
              res.data.message ||
              `${record ? 'Cập nhật' : 'Thêm'} khách hàng thất bại, vui lòng thử lại!`,
          })
      } else
        notification.error({
          message:
            res.data.message ||
            `${record ? 'Cập nhật' : 'Thêm'} khách hàng thất bại, vui lòng thử lại!`,
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const initForm = () => {
    form.setFieldsValue({
      // type: 'Vãng Lai',
      gender: 'male',
      birthday: moment(new Date('1991-01-01')),
      district: districts[0] && districts[0].district_name,
      province: provinces[0] && provinces[0].province_name,
    })
  }

  const _getDistricts = async () => {
    try {
      const res = await getDistricts()
      if (res.status === 200) {
        setDistricts(res.data.data)
        if (res.data.data && res.data.data.length && !record)
          form.setFieldsValue({ district: res.data.data[0].district_name })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const _getProvinces = async () => {
    try {
      const res = await getProvinces()
      if (res.status === 200) {
        setProvinces(res.data.data)
        if (res.data.data && res.data.data.length && !record) {
          setProvinceName(res.data.data[0].province_name)
          form.setFieldsValue({ province: res.data.data[0].province_name })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _getCustomerTypes = async () => {
    try {
      const res = await getCustomerTypes()
      if (res.status === 200) setCustomerTypes(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getDistricts()
    _getProvinces()
    _getCustomerTypes()

    if (!record) initForm()
    else {
      setProvinceName(record.province || '')
      form.setFieldsValue({
        ...record,
        birthday: moment(new Date(record.birthday)),
        type_id: record._type ? record._type.type_id : '',
      })
    }
  }, [])

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <div>
            <Form.Item label="Họ" name="first_name">
              <Input allowClear size="large" placeholder="Nhập họ khách hàng" />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item
            label="Tên khách hàng"
            name="last_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input allowClear size="large" placeholder="Nhập tên khách hàng" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item
            label="Số diện thọai"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input
              allowClear
              style={{ width: '100%' }}
              size="large"
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item name="type_id" label="Loại khách hàng">
            <Select
              allowClear
              placeholder="Chọn loại khách hàng"
              size="large"
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input
                      value={type}
                      onPressEnter={_createType}
                      placeholder="Nhập loại khách hàng mới"
                      onChange={(e) => setType(e.target.value)}
                    />
                    <Button
                      loading={loadingBtn}
                      onClick={_createType}
                      type="primary"
                      style={{ marginLeft: 10 }}
                    >
                      Tạo mới
                    </Button>
                  </div>
                </div>
              )}
            >
              {customerTypes.map((type, index) => (
                <Option value={type.type_id} key={index}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item rules={[{ type: 'object' }]} name="birthday" label="Ngày sinh">
            <DatePicker
              placeholder="Chọn ngày sinh"
              size="large"
              className="br-15__date-picker"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item label="Địa chỉ" name="address">
            <Input allowClear placeholder="Nhập địa chỉ" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item label="Tỉnh/thành phố" name="province">
            <Select
              allowClear
              size="large"
              placeholder="Chọn tỉnh/thành phố"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={provinceName}
              onChange={setProvinceName}
            >
              {provinces.map((e, index) => (
                <Option value={e.province_name} key={index}>
                  {e.province_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
          <Form.Item label="Quận/huyện" name="district">
            <Select
              allowClear
              size="large"
              placeholder="Chọn quận/huyện"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {districts
                .filter((d) => !provinceName || d.province_name === provinceName)
                .map((e, index) => (
                  <Option value={e.district_name} key={index}>
                    {e.district_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Form.Item name="gender" label="Giới tính">
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      <Row justify="end">
        <Form.Item>
          <Button style={{ width: 100 }} type="primary" htmlType="submit" size="large">
            {text}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}
