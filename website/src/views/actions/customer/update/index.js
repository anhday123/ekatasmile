import UI from "../../../../components/Layout/UI";
import styles from "./../update/update.module.scss";
import { Select, Button, Input, Form, Row, Col, DatePicker, notification, Space, Drawer } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from 'moment';
import { useEffect, useState } from "react";
import { updateCustomer } from "../../../../apis/customer";
import { apiProvince, apiDistrict } from "../../../../apis/information";

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customFormat = value => `custom format: ${value.format(dateFormat)}`;
const { Option } = Select;
const removeUndefined = (a) => {
  Object.keys(a)
    .filter(key => a[key] === undefined)
    .reduce((res, key) => (res[key] = a[key], res), {});
}
export default function CustomerUpdate(props) {
  let history = useHistory();
  const location = useLocation()
  const [Address, setAddress] = useState({ province: [], district: [] })
  const [form] = Form.useForm()
  const openNotification = () => {
    notification.success({
      description: 'Cập nhật khách hàng thành công.',
    });
  };
  const onFinish = async (values) => {
    try {
      const res = await Promise.all(values.customer.map(e => {
        var obj = {
          address: e.address,
          birthday: moment(e.birthday).format(),
          district: e.district,
          first_name: e.first_name,
          last_name: e.last_name,
          phone: e.phone,
          province: e.province,
          type: e.type
        }
        return updateCustomer(e.customer_id, obj)
      }))
      if (res.reduce((a, b) => a && b.data.success, true)) {
        openNotification()
        history.push("/customer/12");
      }
    }
    catch (e) {
      console.log(e)
      notification.error({ message: "Thất bại", description: e.data ? e.data.message : "Cập nhật thông tin không thành công!" })
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    errorInfo.errorFields.forEach(e => notification.error(
      { message: e.errors[0] }
    ))
  };

  const getAddress = async (api, callback, keyword) => {
    try {
      const res = await api()
      if (res.status == 200) {
        callback(e => { return { ...e, [keyword]: res.data.data } })
      }
    }
    catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    form.setFieldsValue({
      customer: props.customerData.map(e => {
        return {
          customer_id: e.customer_id,
          code: e.code,
          first_name: e.first_name,
          last_name: e.last_name,
          type: e.type,
          phone: e.phone,
          address: e.address,
          province: e.province,
          district: e.district
        }
      })
    })
  }, [props.customerData])

  useEffect(() => {
    getAddress(apiProvince, setAddress, 'province')
    getAddress(apiDistrict, setAddress, 'district')
  }, [])
  return (
    <Drawer
      visible={props.visible}
      onClose={props.onClose}
      width={1000}
    >
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/customer/12">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Cập nhật thông tin khách hàng</div>

        </Link>
        <Form
          name="dynamic_form_nest_item"
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          form={form}
          onFinishFailed={onFinishFailed}
        >
          <Form.List name="customer">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (

                  <Row key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: "solid 1px #7f8c8d", marginBottom: 15 }}>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>

                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã khách hàng</div>
                        <Form.Item
                          {...restField}
                          name={[name, 'code']}
                          fieldKey={[fieldKey, 'code']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="GH6789" disabled />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ngày sinh</div>
                        <Form.Item

                          className={styles["supplier_add_content_supplier_code_input"]}

                          {...restField}
                          name={[name, 'birthday']}
                          fieldKey={[fieldKey, 'birthday']}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <DatePicker style={{ width: '100%' }} placeholder={moment('2021/06/28', dateFormat)} />
                        </Form.Item>
                      </div>
                    </Col>

                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Liên hệ</div>
                        <Form.Item

                          {...restField}
                          name={[name, 'phone']}
                          fieldKey={[fieldKey, 'phone']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="0384943497" />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Loại khách hàng</div>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          fieldKey={[fieldKey, 'type']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Select placeholder="Tiềm năng">
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
                          {...restField}
                          name={[name, 'address']}
                          fieldKey={[fieldKey, 'address']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="27/27, đường Ngô Y Linh" />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tên</div>
                        <Form.Item
                          {...restField}
                          name={[name, 'last_name']}
                          fieldKey={[fieldKey, 'last_name']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Tỷ" />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>
                        <Form.Item
                          {...restField}
                          name={[name, 'province']}
                          fieldKey={[fieldKey, 'province']}
                          hasFeedback
                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}

                        >
                          <Select placeholder="Hồ Chí Minh" showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              Address.province.map(e => (<Option value={e.province_name}>{e.province_name}</Option>))
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Họ</div>
                        <Form.Item
                          // label="Mã nhà cung cấp"
                          {...restField}
                          name={[name, 'first_name']}
                          fieldKey={[fieldKey, 'first_name']}
                          className={styles["supplier_add_content_supplier_code_input"]}
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input placeholder="Nguyễn" />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div>
                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Quận/huyện</div>
                        <Form.Item
                          {...restField}
                          name={[name, 'district']}
                          fieldKey={[fieldKey, 'district']}

                          rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                        >
                          <Select placeholder="q1" showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                            {
                              Address.district.map(e => (<Option value={e.district_name}>{e.district_name}</Option>))
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col>
                      <Form.Item
                        {...restField}
                        name={[name, 'customer_id']}
                        fieldKey={[fieldKey, 'customer_id']}
                        className={styles["supplier_add_content_supplier_code_input"]}
                        rules={[{ required: true, message: "Giá trị rỗng!" }]}
                      >
                        <Input placeholder="GH6789" disabled hidden />
                      </Form.Item></Col>
                  </Row>
                ))}
              </>
            )}

          </Form.List>
          <Row className={styles["supplier_add_content_supplier_button"]}>
            <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
}
