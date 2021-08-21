import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import React, { useState, useEffect } from "react";
import { ACTION} from './../../../../consts/index'
import { apiDistrict, apiProvince } from "../../../../apis/information";
import { useDispatch } from 'react-redux'
import { apiAddSupplier } from "../../../../apis/supplier";
import { Select, Button, Input, Form, Row, Col, notification } from "antd";
import {
  Link,
  useHistory,
} from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { apiFilterCity } from "../../../../apis/branch";
const { Option } = Select;
export default function SupplierAdd() {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  let history = useHistory();
  const openNotificationRegisterFailMail = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Gmail phải ở dạng @gmail.com',
    });
  };
  const openNotificationRegisterFailMailRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  function validateEmail(email) {
    const re = /^[a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-z0-9]@[a-z0-9][-\.]{0,1}([a-z][-\.]{0,1})*[a-z0-9]\.[a-z0-9]{1,}([\.\-]{0,1}[a-z]){0,}[a-z0-9]{0,}$/;
    return re.test(String(email).toLowerCase());
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
    if (validateEmail(values.email)) {
      if (isNaN(values.phoneNumber)) {
        openNotificationRegisterFailMailRegex('Liên hệ')
      } else {
        if (regex.test(values.phoneNumber)) {
          const object = {
            // code: values.supplierCode.toLowerCase(),
            name: values.supplierName.toLowerCase(),
            phone: values.phoneNumber,
            email: values.email,
            address: values && values.supplierAddress ? values.supplierAddress.toLowerCase() : '',
            ward: " ",
            district: values.district.toLowerCase(),
            province: values.city.toLowerCase()
          }
          console.log(object)
          apiAddSupplierData(object)
        } else {
          openNotificationRegisterFailMailRegex('Liên hệ')
        }
      }
    } else {
      openNotificationRegisterFailMail()
    }
  };

  const apiAddSupplierData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAddSupplier(object);
      console.log(res)
      if (res.status === 200) {
        openNotification();
        history.push("/supplier/10");
      } else {
        openNotificationError()
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  // useEffect(() => {
  //   apiAddSupplierData();
  // }, []);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm nhà cung cấp thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên nhà cung cấp đã tồn tại.',
    });
  };
  const data = form.getFieldValue()

  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiProvinceData();
  }, []);
  const [districtMain, setDistrictMain] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }
  data.district = districtMain && districtMain.length > 0 ? districtMain[districtMain.length - 2].district_name : '';
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/supplier/10">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Thêm nhà cung cấp</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          layout="vertical"
          form={form}
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item

                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên nhà cung cấp</div>}
                  name="supplierName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên nhà cung cấp" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                <Form.Item


                  name="supplierAddress"
                // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
           
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="phoneNumber"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập liên hệ" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  name="city"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    onChange={handleChangeCity}
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn tỉnh/thành phố"
                    optionFilterProp="children"


                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      province && province.length > 0 && province.map((values, index) => {
                        return <Option value={values.province_name}>{values.province_name}</Option>
                      })
                    }

                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="email"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Email</div>}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </div>
            </Col>
            {
              districtMain && districtMain.length > 0 ? (
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <Form.Item
                      name="district"
                      label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select showSearch
                        style={{ width: '100%' }}
                        placeholder="Select a person"
                        optionFilterProp="children"


                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {
                          districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                            return (
                              <Option value={values.district_name}>{values.district_name}</Option>
                            )
                          })
                        }


                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              ) : ('')
            }

          </Row>
          {/* 
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          </Row> */}


          <Row className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', marginLeft: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
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
