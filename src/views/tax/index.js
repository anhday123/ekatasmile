import UI from "../../components/Layout/UI";
import styles from "./../tax/tax.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { apiAllSupplier, apiSearch, apiUpdateSupplier } from "../../apis/supplier";
import { ACTION } from './../../consts/index'
import moment from 'moment';
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Popconfirm, DatePicker, Switch, Radio, message, Select, InputNumber, Input, Button, notification, Table, Row, Form, Col, Typography, Popover, Drawer } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { apiAddTax, apiAllTax, apiSearchTax, apiUpdateTax } from "../../apis/tax";
import Checkbox from "antd/lib/checkbox/Checkbox";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

// onClick={showDrawerUpdate}
export default function Tax() {
  const dispatch = useDispatch()
  const { TextArea } = Input;
  const [tax, setTax] = useState([])
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleUpdateMulti, setVisibleUpdateMulti] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [defaultActive, setDefaultActive] = useState(false)
  const { Search } = Input;
  const [arrayUpdate, setArrayUpdate] = useState([])
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    tax && tax.length > 0 && tax.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })
    setArrayUpdate([...array])
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showDrawerUpdateMulti = () => {
    setVisibleUpdateMulti(true)
  };

  const onCloseUpdateMulti = () => {
    setVisibleUpdateMulti(false)
  };
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  };

  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  };
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchTax({ name: value });

      if (res.status === 200) setTax(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const typingTimeoutRef = useRef(null);
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value;
      apiSearchData(value);
    }, 300);
    // 
  };
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      taxName: <div>{`Thuế nhập hàng ${i}`}</div>,
      taxCode: `Nhập hàng`,
      tax: `10.00`,
      value: `1000`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <div onClick={showDrawerUpdate} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
      </div>,
    });
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm thông tin thuế thành công.',
    });
  };
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const openNotificationUpdateTax = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên thuế phải là chữ.',
    });
  }
  const openNotificationUpdateTaxError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên thuế đã tồn tại.',
    });
  }
  const apiAllTaxData = async () => {
    try {
      // setLoading(true)
      setLoading(true)
      const res = await apiAllTax();
      console.log(res);
      if (res.status === 200) {
        setTax(res.data.data)
      }
      setLoading(false)
      // if (res.status === 200) setStatus(res.data.status);
      // setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
      // setLoading(false)
    }
  };
  useEffect(() => {
    apiAllTaxData()
  }, [])
  const apiAddTaxData = async (object) => {
    try {
      setLoading(true)
      const res = await apiAddTax(object);
      console.log(res);
      if (res.status === 200) {
        await apiAllTaxData()
        setVisible(false)
        openNotification()
      } else {
        openNotificationUpdateTaxError()
      }
      // if (res.status === 200) setStatus(res.data.status);
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const onFinish = (values) => {
    console.log("Success123:", values);

    if (!isNaN(values.taxName)) {
      openNotificationUpdateTax()
    } else {
      const object = {
        name: values.taxName,
        value: values.value,
        description: values && values.description ? values.description : '',
        default: defaultActive
      }
      apiAddTaxData(object)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const openNotificationUpdate = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin thuế thành công.',
    });
  }
  const onFinishUpdate = (values) => {
    console.log("Success:", values);
    setVisibleUpdate(false)
    openNotificationUpdate()
  };

  const onFinishFailedUpdate = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChange(value) {
    console.log('changed', value);
  }
  const openNotificationUpdateMulti = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        <div>Cập nhật thông tin thuế <b>{data}</b> thành công.</div>,
    });
  }
  const openNotificationDeleteSupplier = (data) => {
    notification.success({
      message: 'Thành công',
      description: data === 2 ? ('Vô hiệu hóa thuế thành công.') : ('Kích hoạt thuế thành công')
    });
  };
  const [valueSwitch, setValueSwitch] = useState(false)
  const apiUpdateTaxDataStatus = async (object, id, data) => {
    try {
      setLoading(true)

      const res = await apiUpdateTax(object, id);
      console.log(res)
      console.log("1111222")
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        await apiAllTaxData()
        openNotificationDeleteSupplier(data)
        // onCloseUpdate()
        // setSelectedRowKeys([])
        // onCloseUpdateMulti()
      } else {
        openNotificationUpdateTaxError()
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`);
    setValueSwitch(checked)
    const object = {
      active: checked
    }
    apiUpdateTaxDataStatus(object, record.tax_id, checked ? 1 : 2)
  }
  const apiUpdateTaxData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiUpdateTax(object, id);
      console.log(res)
      console.log("1111222")
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        await apiAllTaxData()
        openNotificationUpdateMulti(object.name)
        onCloseUpdate()
        setSelectedRowKeys([])
        onCloseUpdateMulti()
      } else {
        openNotificationUpdateTaxError()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearchTax({ from_date: start, to_date: end });
      console.log(res)
      console.log("1111222")
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        setTax(res.data.data)
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const dateFormat = 'YYYY/MM/DD';
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(0)
    console.log(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
    console.log("---")
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '')
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
    apiSearchDateData(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };
  const onClickClear = async () => {
    await apiAllTaxData()
    openNotificationClear()
    setValueSearch("")
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (!isNaN(values.name)) {
          openNotificationUpdateTax()
        } else {
          const object = {
            name: values.name,
            value: values.value,
            description: values && values.description ? values.description : ''
          }
          apiUpdateTaxData(object, values.tax_id)
        }
      })
    } else {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (!isNaN(values.name)) {
          openNotificationUpdateTax()
        } else {
          const object = {
            name: values.name,
            value: arrayUpdate[0].value,
            description: arrayUpdate[0] && arrayUpdate[0].description ? arrayUpdate[0].description : ''
          }
          apiUpdateTaxData(object, values.tax_id)
        }
      })
    }
  }
  const columns = [
    {
      title: "Tên thuế",
      dataIndex: "name",
      width: 150,
    },
    // {
    //   title: "Mã thuế",
    //   dataIndex: "taxCode",
    //   width: 150,
    // },
    // {
    //   title: "Thuế suất",
    //   dataIndex: "tax",
    //   width: 150,
    // },
    {
      title: "Giá trị",
      dataIndex: "value",
      width: 150,
      render: (text, record) => text && `${text}%`
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} /> : <Switch onChange={(e) => onChangeSwitch(e, record)} />
    },
  ];
  return (
    <UI>
      <div className={styles["supplier_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(241, 236, 236)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link className={styles["supplier_add_back_parent"]} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

            <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Quản lý thuế</div>

          </Link>
          <div onClick={showDrawer}>
            <Button
              className={styles["supplier_manager_search_right"]}
              type="primary"
              icon={<PlusCircleOutlined />}

            // onClick={() => this.enterLoading(1)}
            >
              Thêm thuế
            </Button>
          </div>
        </div>
        <Row style={{ display: 'flex', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={7}>

            <div style={{ width: '100%' }}>

              <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                placeholder="Tìm kiếm theo tên" allowClear />
            </div>

          </Col>
          <Col style={{ width: '100%', marginLeft: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <RangePicker
                // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={onChangeDate}
              />
            </div>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Radio.Group style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start', width: '100%' }} >
              <Radio onClick={showDrawerUpdateMulti} value={1}>Cập nhật hàng loạt</Radio>
              <Radio onClick={showDrawerUpdate} value={2}>Cập nhật riêng lẻ</Radio>
            </Radio.Group>
          ) : ('')
        }
        <div style={{ width: '100%', border: '1px solid rgb(243, 234, 234)' }}>
          <Table
            rowKey="_id"
            rowSelection={rowSelection}
            bordered
            columns={columns}
            loading={loading}
            dataSource={tax}
            scroll={{ y: 500 }}
            summary={pageData => {
              let totalTax = 0;
              let totalValue = 0;
              console.log(pageData)
              pageData.filter(e => e.active).forEach((values, index) => {
                totalTax += parseInt(values.value);
                // totalValue += parseInt(values.value);
              })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell >
                      <Text><div style={{ color: 'black', fontWeight: '600' }}>Tổng cộng:</div></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text><div style={{ color: 'black', fontWeight: '600' }}>{`${totalTax}%`}</div></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>

        {/* <div className={styles["supplier_manager_search_delete"]}>
            <Button
              danger
              type="primary"
              loading={loadings[1]}
            // onClick={() => this.enterLoading(1)}
            >
              Xóa
            </Button>
          </div> */}

      </div>
      <Drawer
        title="Thêm thông tin thuế"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >

        <Form
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          layout="vertical"
          onFinishFailed={onFinishFailed}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Tên thuế</div>}

                  name="taxName"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên thuế" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>

                <Form.Item
                  // label="Mã nhà cung cấp"
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Giá trị</div>}
                  name="value"

                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChange}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Mô tả</div>
                <Form.Item
                  // label="Mã nhà cung cấp"

                  name="description"


                >
                  <TextArea rows={4} placeholder="Nhập mô tả" />
                </Form.Item>
              </div>
            </Col>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Mã</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="taxCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã thuế." />
                </Form.Item>
              </div>
            </Col> */}
          </Row>

          {/* <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Thuế suất</div>
                <Form.Item
             

                  name="tax"
                  className={styles["supplier_add_content_supplier_code_input"]}
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập thuế suất" />
                </Form.Item>
              </div>
            </Col>

          </Row> */}
          <Row>
            <Checkbox onChange={(e) => setDefaultActive(e.target.checked)}>Kích hoạt</Checkbox>
          </Row>
          <div style={{ display: 'flex', maxWidth: '100%', overflow: 'auto', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><b style={{ marginRight: '0.25rem' }}>Chú ý:</b> bạn không thể sửa giá trị thuế khi đã sử dụng thuế đó trong một đơn hàng.</div>

          <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }} className={styles["supplier_add_content_supplier_button"]}>
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

      </Drawer>

      <Drawer
        title="Cập nhật thông tin thuế"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(1)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            return (

              <Form
                style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                className={styles["supplier_add_content"]}

                // form={form}
                layout="vertical"
                initialValues={values}

              >
                <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {
                    obj.map((data) => {
                      if (data === 'name') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên thuế</div>
                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'value') {
                        const InputName = () => <InputNumber
                          style={{ width: '100%' }} defaultValue={values[data]}
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;

                            arrayUpdate[index][data] =
                              isNaN(event) ? 0 : event === 0 ? 0 : event;
                          }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        // onChange={onChange}
                        />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Giá trị</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'description') {
                        const InputName = () => <TextArea rows={4} defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Mô tả</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }


                    })
                  }
                </Row>

              </Form>

            )
          })
        }
      </Drawer>

      <Drawer
        title="Cập nhật thông tin thuế"
        width={1000}
        onClose={onCloseUpdateMulti}
        visible={visibleUpdateMulti}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(2)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            if (index === 0) {
              return (

                <Form
                  style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                  className={styles["supplier_add_content"]}

                  // form={form}
                  layout="vertical"
                  initialValues={values}

                >
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      obj.map((data) => {
                        if (data === 'name') {
                          const InputName = () => <Input disabled defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                {/* <Form.Item
  
                                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                  name="phone"
                                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                > */}
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên thuế</div>
                                <InputName />
                                {/* </Form.Item> */}
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'value') {
                          const InputName = () => <InputNumber
                            style={{ width: '100%' }} defaultValue={values[data]}
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;

                              arrayUpdate[index][data] =
                                isNaN(event) ? 0 : event === 0 ? 0 : event;
                            }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          // onChange={onChange}
                          />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Giá trị</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'description') {
                          const InputName = () => <TextArea rows={4} defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Mô tả</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }


                      })
                    }
                  </Row>

                </Form>

              )
            }
          })
        }
      </Drawer>

    </UI>
  );
}
