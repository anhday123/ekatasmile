import styles from "./../branch-add/branch-add.module.scss";
import React, { useState, useEffect } from "react";
import { ACTION, ROUTES } from './../../../consts/index'
import { useDispatch } from 'react-redux'
import { apiDistrict, apiProvince } from "./../../../apis/information";
import { Input, Space, Button, Row, Col, DatePicker, notification, Select, Table, Modal, Form, Upload, Checkbox } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, CheckOutlined, FileImageOutlined, BorderVerticleOutlined } from "@ant-design/icons";
import moment from 'moment';
import { addBranch, apiFilterCity, getAllBranch } from "../../../apis/branch";
import { getAllStore } from '../../..//apis/store'
const { Option } = Select;

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  });
}
export default function BranchAdd({ branchChild, state, confirmValue }) {
  const dispatch = useDispatch()
  const { Search } = Input;
  const [form] = Form.useForm();
  const [modal2Visible, setModal2Visible] = useState(false)
  const [store, setStore] = useState([])
  const [branch, setBranch] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  console.log(store)
  const onSearch = (value) => console.log(value);
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const columnsPromotion = [
    // {
    //   title: 'STT',
    //   dataIndex: 'stt',
    //   width: 150,
    // },
    {
      title: 'Mã chi nhánh',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => <Link to="/actions/branch/view/9" style={{ color: '#2400FF' }}>{text}</Link>
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => <Link to="/actions/branch/view/9" style={{ color: '#2400FF' }}>{text}</Link>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Thành phố',
      dataIndex: 'ward',
      width: 150,
    },
    {
      title: 'Chi nhánh mặc định',
      dataIndex: 'default',
      width: 100,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{text ? <CheckOutlined style={{ color: '#0400DE', fontSize: '1.5rem' }} /> : ''}</div>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/branch/view/9" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    },
  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      branchCode: <Link to="/actions/branch/view/9" style={{ color: '#2400FF' }}>CN {i}</Link>,
      branchName: <Link to="/actions/branch/view/9" style={{ color: '#2400FF' }}>Chi nhánh {i}</Link>,
      address: `Địa chỉ ${i}`,
      district: `Bình thạnh ${i}`,
      city: `Hồ chí minh ${i}`,
      branchDefault: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{i === 2 ? (<CheckOutlined style={{ color: '#0400DE', fontSize: '1.5rem' }} />) : ('')}</div>,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <Link to="/actions/branch/view/9" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        'Thêm chi nhánh thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 6,
      description:
        'Tên chi nhánh đã tồn tại.',
    });
  };
  const openNotificationErrorStore = () => {
    notification.error({
      message: 'Thất bại',
      duration: 6,
      description:
        'Cửa hàng đã bị vô hiệu hóa, không thể thêm chi nhánh.',
    });
  };
  const openNotificationErrorRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationErrorRegexPhone = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} chưa đúng định dạng`,
    });
  };
  const openNotificationTutorial = (data) => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 20,
      description:
        <div>Hệ thống sẽ hiển thị chi nhánh bạn vừa tạo, ở cột <b>Mã chi nhánh</b> click vào tên chi nhánh: <b style={{ marginRight: '0.25rem', color: '#007ACC', fontSize: '1rem', fontWeight: '600' }}>{data}</b>
          mà bạn vừa tạo, để thêm nhân viên vào chi nhánh này.</div>,
    });
  };
  const addBranchData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await addBranch(object);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        await getAllBranchData()
        openNotification()
        if (state && state === '1') {
          openNotificationTutorial(res.data.data.code)
        }

        modal2VisibleModal(false)
        form.resetFields();
      } else {
        if (res.data.message === 'Branch name was exists!') {
          openNotificationError()
        } else {
          openNotificationErrorStore()
        }
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

    console.log('Success:', values);
    if (values.fax) {
      if (isNaN(values.phoneNumber)) {
        if (isNaN(values.phoneNumber)) {
          openNotificationErrorRegexPhone('Liên hệ')
        }

      } else {
        if (regex.test(values.phoneNumber)) {
          const object = {
            address: values && values.address ? values.address.toLowerCase() : '',
            // code: values.branchCode.toLowerCase(),
            // default: values && values.defaultStore ? values.defaultStore : false,
            district: values.district.toLowerCase(),
            name: values.branchName.toLowerCase(),
            phone: values.phoneNumber,
            latitude: ' ',
            longtitude: ' ',
            ward: values.city.toLowerCase(),
            province: ' ',
            store: values.store,
          }
          console.log(object)
          console.log("|--------------------")
          addBranchData(object);
        } else {
          openNotificationErrorRegexPhone('Liên hệ')
        }
      }
    } else {
      if (isNaN(values.phoneNumber)) {
        if (isNaN(values.phoneNumber)) {
          openNotificationErrorRegexPhone('Liên hệ')
        }
      } else {
        if (regex.test(values.phoneNumber)) {
          const object = {
            address: values && values.address ? values.address.toLowerCase() : '',
            // code: values.branchCode.toLowerCase(),
            // default: values && values.defaultStore ? values.defaultStore : false,
            district: values.district.toLowerCase(),
            name: values.branchName.toLowerCase(),
            phone: values.phoneNumber,
            latitude: ' ',
            longtitude: ' ',
            ward: values.city.toLowerCase(),
            province: ' ',
            store: values.store,
          }
          console.log(object)
          addBranchData(object);
        } else {
          openNotificationErrorRegexPhone('Liên hệ')
        }
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const getAllBranchData = async () => {
    try {
      // dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllBranch();
      console.log(res)
      if (res.status === 200) {
        setBranch(res.data.data)
        branchChild(res.data.data)
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
  const getAllStoreData = async () => {
    try {
      //  dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    getAllStoreData();
  }, []);
  console.log(dataPromotion)
  const data = form.getFieldValue()
  data.store = store && store.length > 0 ? store[0].store_id : ''
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      //  dispatch({ type: ACTION.LOADING, data: true });
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
      //   dispatch({ type: ACTION.LOADING, data: true });
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
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  // data.city = province && province.length > 0 ? province[province.length - 2].province_name : '';
  data.district = districtMain && districtMain.length > 0 ? districtMain[districtMain.length - 2].district_name : '';

  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }
  const onClickTurnOffAttentAddBranch = () => {
    modal2VisibleModal(true)
  }
  useEffect(() => {
    if (confirmValue === 1 || confirmValue === '1') {
      modal2VisibleModal(true)
    }
  }, [])
  const [attentionAddBranch, setAttentionAddBranch] = useState(true)
  return (
    <>
      {
        state === '1' ? (
          <Modal
            // title="Xin chào"
            centered
            width={700}
            footer={null}
            visible={attentionAddBranch}
          // onOk={() => setAttentionModal(false)}
          // onCancel={() => setAttentionModal(false)}
          >
            <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}>Chào mừng bạn sử dụng Admin Order, tạo 1 cửa hàng để bắt đầu công việc kinh doanh của mình nhé.</div>
            <div style={{ fontSize: '1rem', marginTop: '1rem' }}><b style={{ color: 'red' }}>Gợi ý:</b> tạo 1 chi nhánh ( điểm bán hàng ) để sử dụng chức năng bán hàng.</div>
            <div onClick={onClickTurnOffAttentAddBranch} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button type="primary" style={{ width: '7.5rem' }}>Tiếp tục</Button>
            </div>
          </Modal>
        ) : ''
      }
      <div onClick={() => modal2VisibleModal(true)}>
        <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm chi nhánh</Button>
      </div>
      {
        state === 1 || state === '1' ? (
          <Modal
            title="Thêm chi nhánh"
            centered
            width={1000}
            footer={null}
            visible={modal2Visible}
          // onOk={() => modal2VisibleModal(false)}
          // onCancel={() => modal2VisibleModal(false)}
          >

            <Form
              className={styles["supplier_add_content"]}
              onFinish={onFinish}
              form={form}
              layout="vertical"
              onFinishFailed={onFinishFailed}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <Form.Item

                      label={<div style={{ color: 'black', fontWeight: '600' }}>Tên chi nhánh</div>}
                      name="branchName"
                      rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Input placeholder="Nhập tên chi nhánh" />
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                    <Form.Item


                      name="address"
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

                      label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                      name="phoneNumber"
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
                {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã chi nhánh</div>
                    <Form.Item
    
                      className={styles["supplier_add_content_supplier_code_input"]}
                      name="branchCode"
                      rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Input placeholder="Nhập mã chi nhánh" />
                    </Form.Item>
                  </div>
                </Col> */}

                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <Form.Item
                      name="store"
                      label={<div style={{ color: 'black', fontWeight: '600' }}>Cửa hàng</div>}
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select placeholder="Chọn cửa hàng">
                        {
                          store.map((values, index) => {
                            return (
                              <Option value={values.store_id}>{values.name}</Option>
                            )
                          })
                        }


                      </Select>
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

                {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Zip code</div>
                    <Form.Item
    
                      className={styles["supplier_add_content_supplier_code_input"]}
                      name="fax"
                    // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Input placeholder="Nhập zip code" />
                    </Form.Item>
                  </div>
                </Col> */}
              </Row>
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

              </Row>
              {/* <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
    
                    <Form.Item name="defaultStore" valuePropName="checked" >
                      <Checkbox>Chi nhánh mặc định</Checkbox>
                    </Form.Item>
                  </div>
                </Col>
              </Row> */}
              <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                {/* <Col onClick={() => modal2VisibleModal(false)} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                  <Form.Item >
                    <Button style={{ width: '7.5rem' }} type="primary" danger>
                      Hủy
                    </Button>
                  </Form.Item>
                </Col> */}
                <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                  <Form.Item>
                    <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                      Thêm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

          </Modal>
        ) : (
          <Modal
            title="Thêm chi nhánh"
            centered
            width={1000}
            footer={null}
            visible={modal2Visible}
            onOk={() => modal2VisibleModal(false)}
            onCancel={() => modal2VisibleModal(false)}
          >

            <Form
              className={styles["supplier_add_content"]}
              onFinish={onFinish}
              form={form}
              layout="vertical"
              onFinishFailed={onFinishFailed}
            >
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <Form.Item

                      label={<div style={{ color: 'black', fontWeight: '600' }}>Tên chi nhánh</div>}
                      name="branchName"
                      rules={[{ required: true, message: "Giá trị rỗng!" }]}
                    >
                      <Input placeholder="Nhập tên chi nhánh" />
                    </Form.Item>
                  </div>
                </Col>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                    <Form.Item


                      name="address"
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

                      label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                      name="phoneNumber"
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
                {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã chi nhánh</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="branchCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã chi nhánh" />
                </Form.Item>
              </div>
            </Col> */}

                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div>
                    <Form.Item
                      name="store"
                      label={<div style={{ color: 'black', fontWeight: '600' }}>Cửa hàng</div>}
                      hasFeedback
                      rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                    >
                      <Select placeholder="Chọn cửa hàng">
                        {
                          store.map((values, index) => {
                            return (
                              <Option value={values.store_id}>{values.name}</Option>
                            )
                          })
                        }


                      </Select>
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

                {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Zip code</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="fax"
                // rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập zip code" />
                </Form.Item>
              </div>
            </Col> */}
              </Row>
              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

              </Row>
              {/* <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item name="defaultStore" valuePropName="checked" >
                  <Checkbox>Chi nhánh mặc định</Checkbox>
                </Form.Item>
              </div>
            </Col>
          </Row> */}
              <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                {/* <Col onClick={() => modal2VisibleModal(false)} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
                <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                  <Form.Item>
                    <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                      Thêm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

          </Modal>
        )
      }
    </>
  );
}
