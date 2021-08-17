import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import { Select, Button, Input, Form, Row, Col, DatePicker, notification, Radio } from "antd";
import {
  Link,
  useHistory,
} from "react-router-dom";
import { addCustomer } from '../../../../apis/customer'
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { apiDistrict, apiProvince } from "../../../../apis/information";
const { Option } = Select;
export default function CustomerAdd() {
  const [gender, setGender] = useState('male')
  const dispatch = useDispatch()
  const [Location, setLocation] = useState({ province: [], district: [] })
  let history = useHistory();
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin khách hàng thành công.',
    });
  };
  const onFinish = async (values) => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const obj = {
        gender,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        type: values.type,
        birthday: values.birthday ? values.birthday : "",
        address: values.address ? values.address : '',
        province: values.province ? values.province : "",
        district: values.district ? values.district : '',
        "ward": "",
        "balance": [],
      }
      const res = await addCustomer(obj)
      if (res.status == 200 && res.data.data) {
        // console.log("Success:", values);
        openNotification()
        dispatch({ type: 'LOADING', data: false })
        history.push("/customer/12");
      }
      else {
        throw res
      }
    }
    catch (e) {
      console.log(e);
      dispatch({ type: 'LOADING', data: false })
      notification.error({ message: "Thất bại", description: e.data.message })
    }
  };
  const getAddress = async (api, callback, key, params) => {
    try {
      const res = await api(params)
      if (res.status == 200) {
        callback(e => { return { ...e, [key]: res.data.data } })
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  useEffect(() => {
    getAddress(apiProvince, setLocation, 'province')
  }, [])
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/customer/12">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Thêm khách hàng</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}><span style={{ color: '#ff4d4f' }}>*</span> Họ</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="first_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập họ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}><span style={{ color: '#ff4d4f' }}>*</span> Tên</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="last_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </div>
            </Col>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}> */}
            {/* <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên khách hàng</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="first_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Họ" />
                </Form.Item>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="last_name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Tên" />
                </Form.Item>
              </div> */}
            {/* </Col> */}
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày sinh</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="birthday"
                >
                  <DatePicker style={{ width: '100%' }} onChange={onChange} />
                </Form.Item>

              </div>
            </Col>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div> */}
            {/* <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã khách hàng</div> */}
            {/* <Form.Item
                  // label="Mã nhà cung cấp"

                  name="code"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã khách hàng" />
                </Form.Item> */}
            {/* </div>
            </Col> */}
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}><span style={{ color: '#ff4d4f' }}>*</span> Liên hệ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phone"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập liên hệ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}><span style={{ color: '#ff4d4f' }}>*</span> Loại khách hàng</div>
                <Form.Item
                  name="type"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select placeholder="Chọn loại khách hàng">
                    {/* <Option value="vip">VIP</Option> */}
                    <Option value="potential">Tiềm năng</Option>
                    <Option value="vangLai">Vãng lai</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Địa chỉ</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="address"
                  className={styles["supplier_add_content_supplier_code_input"]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </div>
            </Col>

            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>
                <Form.Item
                  name="province"
                  hasFeedback
                >
                  <Select placeholder="Chọn tỉnh/thành phố" onChange={(e) => getAddress(apiDistrict, setLocation, 'district', { keyword: e })}>
                    {
                      Location.province.map(e => (<Option value={e.province_name}>{e.province_name}</Option>))
                    }
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Quận/huyện</div>
                <Form.Item
                  name="district"
                  hasFeedback
                >
                  <Select placeholder="Chọn quận/huyện">
                    {
                      Location.district.map(e => (<Option value={e.district_name}>{e.district_name}</Option>))
                    }
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Email</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="email"
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <Radio.Group defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Row>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </UI>
  );
}
