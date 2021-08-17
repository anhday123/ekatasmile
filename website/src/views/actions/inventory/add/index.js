import UI from "../../../../components/Layout/UI";
import { useDispatch } from 'react-redux'
import { ACTION } from './../../../../consts/index'
import styles from "./../add/add.module.scss";
import React, { useState, useEffect } from "react";
import { Select, Button, Input, Form, Row, Col, DatePicker, notification, InputNumber } from "antd";
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
import { apiAddInventory } from "../../../../apis/inventory";
import { apiFilterCity, getAllBranch } from "../../../../apis/branch";
import { apiDistrict, apiProvince } from "../../../../apis/information";
const { Option } = Select;
export default function InventoryAdd() {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm kho thành công',
    });
  };
  const [branch, setBranch] = useState([])
  const getAllBranchData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllBranch();
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
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
    getAllBranchData();
  }, []);
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const openNotificationError = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationErrorPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const openNotificationErrorCode = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên kho đã tồn tại',
    });
  };
  let history = useHistory();
  const apiAddInventoryData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAddInventory(object);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        openNotification()
        history.push("/inventory/7");
      } else {
        openNotificationErrorCode()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinish = (values) => {
    console.log("Success:", values);
    if (values && values.maintainCost) {
      if (isNaN(values.phoneNumber) || isNaN(values.maintainCost)) {
        if (isNaN(values.phoneNumber)) {
          openNotificationErrorPhone('Liên hệ')
        }
        if (isNaN(values.maintainCost)) {
          openNotificationError('Phí duy trì tháng')
        }
      } else {
        if (regex.test(values.phoneNumber)) {
          const object = {
            name: values.inventoryName.toLowerCase(),
            type: values.inventoryType.toLowerCase(),
            phone: values.phoneNumber,
            capacity: 1,
            monthly_cost: values.maintainCost,
            address: values && values.address ? values.address.toLowerCase() : '',
            ward: ' ',
            district: values.district.toLowerCase(),
            province: values.city.toLowerCase()
          }
          console.log(object)
          apiAddInventoryData(object)
        } else {
          openNotificationErrorPhone('Liên hệ')
        }
      }
    } else {
      if (isNaN(values.phoneNumber)) {
        if (isNaN(values.phoneNumber)) {
          openNotificationErrorPhone('Liên hệ')
        }
      } else {
        if (regex.test(values.phoneNumber)) {
          const object = {
            name: values.inventoryName.toLowerCase(),
            type: values.inventoryType.toLowerCase(),
            phone: values.phoneNumber,
            capacity: 1,
            monthly_cost: 0,
            address: values && values.address ? values.address.toLowerCase() : '',
            ward: ' ',
            district: values.district.toLowerCase(),
            province: values.city.toLowerCase()
          }
          console.log(object)
          apiAddInventoryData(object)
        } else {
          openNotificationErrorPhone('Liên hệ')
        }
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  console.log(province)
  console.log("222333")
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
  const data = form.getFieldValue()
  // data.city = province && province.length > 0 ? province[province.length - 2].province_name : '';
  data.district = districtMain && districtMain.length > 0 ? districtMain[districtMain.length - 2].district_name : '';
  data.inventoryType = 'chung'
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/inventory/7">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Thêm kho</div>

        </Link>
        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          form={form}
          layout="vertical"
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ width: '100%' }}>
                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Ngày tạo</div>}
                  name="createdDate"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <DatePicker style={{ width: '100%' }} onChange={onChange} />
                </Form.Item>

              </div>
            </Col> */}
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên kho</div>}

                  name="inventoryName"

                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên kho" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                {/* <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Liên hệ</div> */}
                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  name="phoneNumber"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập liên hệ" />
                </Form.Item>
              </div>
            </Col>

          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}

                  name="address"


                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </div>
            </Col>

            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ display: 'flex', marginBottom: '0.5rem', color: 'black', fontWeight: '600 ', justifyContent: 'flex-start', alignItems: 'center', with: '100%' }}>Phí duy trì tháng</div>
                <Form.Item
                  name="maintainCost"
                // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    // defaultValue={1000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChange}
                  />
                  {/* <Input placeholder="Nhập phí duy trì tháng" /> */}
                </Form.Item>
              </div>
            </Col>

          </Row>


          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

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
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  name="inventoryType"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Loại kho</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select defaultValue="general">
                    <Option value="chung">Chung</Option>
                    <Option value="riêng">Riêng</Option>
                    <Option value="dịch vụ">Dịch vụ</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>




          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  name="branch"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Chi nhánh</div>}
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select placeholder="Chọn chi nhánh">
                    {
                      branch && branch.length > 0 && branch.map((values, index) => {
                        return (
                          <Option value={values.name}>{values.name}</Option>
                        )
                      })
                    }

                  </Select>
                </Form.Item>
              </div>
            </Col> */}
            {
              districtMain && districtMain.length > 0 ?
                (<Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
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
          <Row className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', display: 'flex', marginLeft: '1rem', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div >
    </UI >
  );
}
