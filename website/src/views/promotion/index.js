import UI from "./../../components/Layout/UI";
import styles from "./../promotion/promotion.module.scss";
import React, { useEffect, useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Checkbox, Select, Table, Modal, notification, Popover, Drawer, Form, Radio, InputNumber, Switch } from "antd";
import {
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getPromoton, updatePromotion } from "../../apis/promotion";
import { getAllBranch } from "../../apis/branch";
import { useDispatch } from "react-redux";
const { Option } = Select;
const { RangePicker } = DatePicker;
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 50,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
];

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
function formatCash(str) {
  return str
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
export default function Promotion() {
  const { Search } = Input;
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [listPromotion, setListPromotion] = useState()
  const [listBranch, setListBranch] = useState([])
  const [PromotionInfo, setPromotionInfo] = useState({})
  const [form] = Form.useForm();
  const [valueCheckbox, setValueCheckbox] = useState(false);
  const [loading, setLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState({ keyword: '', date: [], type: undefined })
  const dispatch = useDispatch()
  const showDrawer = (data) => {
    setVisible(true)
    form.setFieldsValue({
      promotion_id: data.promotion_id,
      name: data.name,
      type: data.type,
      value: data.value,
      branch: data.limit.branchs,
      amount: data.limit.amount
    })
  };

  const onClose = () => {
    setVisible(false)
  };
  function onChange(dates, dateStrings) {
    getPromotions({ from_date: dateStrings[0], to_date: dateStrings[1] })
  }
  function onChangeMain(date, dateString) {
    console.log(date, dateString);
  }
  function handleChange(value) {
    getPromotions({ type: value })
  }
  const columnsPromotion = [
    {
      title: 'Tên chương trình khuyến mãi',
      dataIndex: 'name',
      width: 200,
      // render(data, record) {
      //   return <span style={{ color: "#42A5F5", cursor: "pointer" }} onClick={() => {
      //     setPromotionInfo(record);
      //     setTiomeout(()=>modal2VisibleModal(true), 200)
      //     }}>
      //       {data}</span>
      // }
    },
    {
      title: 'Loại khuyến mãi',
      dataIndex: 'type',
      width: 150,
      render(data) {
        return data == 'percent' ? 'Phần trăm' : 'VND'
      }
    },
    {
      title: 'Giá trị khuyến mãi',
      dataIndex: 'value',
      width: 150,
      render(data) {
        return formatCash(data.toString())
      }
    },
    {
      title: 'Số lượng khuyến mãi',
      dataIndex: 'limit',
      width: 150,
      render(data) {
        return data.amount
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 100,
      render(data, record) {
        return <Switch checked={data} onChange={(e) => onFinish(record.promotion_id, { active: e })} />
      }
    }
  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      promotionProgram: `Khuyến mãi ${i}`,
      promotionType: `KM ${i}`,
      promotionValue: `Giá trị ${i}`,
      promotionQuantity: `${i}`,
      description: `Mô tả ${i}`,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <div onClick={showDrawer} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
        {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
      </div>
    });
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];
  const openNotification = (e) => {
    notification.success({
      message: 'Thành công',
      description: e ?
        'Kích hoạt chương trình khuyến mãi thành công.' : "Vô hiệu hóa chương trình khuyến mãi thành công.",
    });
  };
  const onChangeCheckbox = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setValueCheckbox(e.target.checked);
  };
  const onFinish = async (id, values) => {
    try {
      dispatch({ type: "LOADING", data: true })

      const res = await updatePromotion(id, values)
      if (res.status == 200) {
        openNotification(values.active)
        onClose()
        form.resetFields()
        getPromotions()
      }
      else
        throw res
      dispatch({ type: "LOADING", data: false })
    } catch (e) {
      console.log(e);
      notification.error({ message: "Thất bại!", description: "Cập nhật khuyến mãi thất bại" })
      dispatch({ type: "LOADING", data: false })
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
  function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e) {
    console.log(e);
    message.error('Click on No');
  }
  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const getPromotions = async (params) => {
    try {
      setLoading(true)
      const res = await getPromoton({ ...params, ...pagination })
      if (res.status === 200) {
        setListPromotion(res.data.data)
      }
      else {
        throw res
      }
      setLoading(false)
    }
    catch (e) {
      console.log(e);
      setLoading(false)
    }
  }
  const getBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.status == 200) {
        setListBranch(res.data.data)
      }
      else {
        throw res
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  const resetFilter = () => {
    setSearchFilter({ keyword: '', date: [], type: undefined })
  }
  useEffect(() => {
    getBranch()
  }, [])
  useEffect(() => {
    getPromotions()
  }, [pagination])
  return (
    <UI>
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className={styles["promotion_manager_title"]}>Khuyến mãi</div>
          <div className={styles["promotion_manager_button"]}>
            <Link to="/actions/promotion/add/20">
              <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Tạo khuyến mãi</Button>
            </Link>
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}><Input
              placeholder="Tìm kiếm khuyến mãi"
              onChange={(e) => { setSearchFilter({ ...searchFilter, keyword: e.target.value }); getPromotions({ keyword: e.target.value }) }}
              allowClear
              value={searchFilter.keyword}
            /></div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                value={searchFilter.date}
                onChange={(a, b) => {
                  setSearchFilter({ ...searchFilter, date: a });
                  onChange(a, b)
                }}
              />
            </div>
          </Col>

          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} allowClear placeholder="Lọc theo hình thức khuyến mãi" value={searchFilter.type} onChange={(e) => { setSearchFilter({ ...searchFilter, type: e }); handleChange(e) }}>
                <Option value="percent">Phần trăm</Option>
                <Option value="value">Giá trị</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 20 }} justify="end">
          <Button type="primary" onClick={resetFilter}>Xóa bộ lọc</Button>
        </Row>
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowKey='promotion_id' loading={loading} pagination={{ onChange: changePagi }} columns={columnsPromotion} dataSource={listPromotion} scroll={{ y: 500 }} />
        </div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          ><Button type="primary" danger style={{ width: '7.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Xóa khuyến mãi</Button></Popconfirm></div>) : ('')
        }
      </div>
      <Modal
        title="Thông tin khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >

      </Modal>
      <Drawer
        title="Chỉnh sửa chương trình khuyến mãi"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >

        <Form
          className={styles["promotion_add_form_parent"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Row className={styles["promotion_add_name"]}>

            <Col
              className={styles["promotion_add_name_col"]}
              style={{ marginBottom: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles["promotion_add_name_col_child"]}>
                <div className={styles["promotion_add_form_left_title"]}>
                  Tên chương trình khuyến mãi
                </div>
                <Form.Item
                  className={styles["promotion_add_name_col_child_title"]}
                  // label="Username"
                  name="name"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập tên chương trình khuyến mãi" disabled />
                </Form.Item>
              </div>
            </Col>
            <Col

              className={styles["promotion_add_name_col"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles["promotion_add_name_col_child"]}>
                <div className={styles["promotion_add_form_left_title_parent"]}>
                  Tùy chọn khuyến mãi
                </div>
                <Row className={styles["promotion_add_option"]}>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles["promotion_add_option_col_left_title"]
                        }
                      >
                        Loại khuyến mãi
                      </div>
                      <div
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                      >
                        <Form.Item
                          name="type"
                          noStyle
                          rules={[
                            { required: true, message: "Giá trị rỗng" },
                          ]}
                        >
                          <Select
                            className={
                              styles["promotion_add_form_left_select_child"]
                            }
                            placeholder="Theo phần trăm"
                          >
                            <Option value="percent">Phần trăm</Option>
                            <Option value="value">Giá trị</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          className={styles["promotion_add_name_col_child_title"]}
                          // label="Username"
                          name="promotion_id"
                          rules={[{ required: true, message: "Giá trị rỗng!" }]}
                        >
                          <Input hidden />
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={22}
                    sm={22}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        className={
                          styles["promotion_add_option_col_left_title_left"]
                        }
                        style={{ marginBottom: '0.5rem' }}
                      >
                        Giá trị khuyến mãi
                      </div>
                      <div
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                      >
                        <Form.Item
                          className={
                            styles["promotion_add_name_col_child_title"]
                          }
                          // label="Username"
                          name="value"
                          rules={[
                            { required: true, message: "Giá trị rỗng!" },
                          ]}
                        >
                          <InputNumber
                            placeholder="Nhập giá trị"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
              </div>
            </Col>


          </Row>
          <Row className={styles["promotion_add_name"]}>

            <Col
              style={{ marginBottom: '1rem' }}
              className={styles["promotion_add_name_col"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles["promotion_add_name_col_child"]}>
                <div className={styles["promotion_add_form_left_title_parent"]}>
                  Giới hạn số lượng khuyến mãi
                </div>
                <Row className={styles["promotion_add_option"]}>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles["promotion_add_option_col_left_title"]
                        }
                      >
                        Vourcher
                      </div>
                      <div
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                      >
                        <Form.Item
                          className={
                            styles["promotion_add_name_col_child_title"]
                          }
                          // label="Username"
                          name="amount"
                          rules={[
                            { required: true, message: "Giá trị rỗng!" },
                          ]}
                        >
                          <Input placeholder="Nhập số lượng vourcher" />
                        </Form.Item>

                      </div>
                    </div>
                  </Col>
                  <Col
                    style={{ marginBottom: '1rem', }}
                    className={styles["promotion_add_option_col"]}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        className={
                          styles["promotion_add_option_col_left_title_left_fix"]
                        }
                        style={{ marginBottom: '0.5rem' }}
                      >
                        Chi nhánh
                      </div>
                      <div
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                      >
                        <Form.Item
                          name="branch"
                          noStyle
                          rules={[
                            { required: true, message: "Giá trị rỗng" },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            className={
                              styles["promotion_add_form_left_select_child"]
                            }
                            placeholder="Chọn chi nhánh"
                          >
                            {
                              listBranch.map(e => <Option value={e.branch_id}>{e.name}</Option>)
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>

                </Row>
              </div>
            </Col>

            <Col

              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["promotion_add_form_right"]}
            >
              <div className={styles["promotion_add_form_left_title"]}>
                Mô tả
              </div>
              <div style={{ width: '100%', height: '100%' }} className={styles["promotion_add_form_right_content"]}>
                <Input.TextArea style={{ width: '100%', height: '100%' }} rows={4} placeholder="Nhập mô tả" />
              </div>
            </Col>
            {/*             
            <Col
              style={{ marginTop: '1rem' }}
              className={styles["promotion_add_name_col"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div className={styles["promotion_add_name_col_child"]}>
                <div className={styles["promotion_add_form_left_title_parent"]}>
                  Thời gian
                </div>
                <Row className={styles["promotion_add_option"]}>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles["promotion_add_option_col_left_title"]
                        }
                      >
                        Ngày bắt đầu
                      </div>

                      <Form.Item
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                        name="date-picker_date_start"
                      >
                        <DatePicker
                          style={{ width: '100% ' }}
                          onChange={onChangeDate}
                          initialValues={moment("2021/04/26", dateFormatList[0])}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles["promotion_add_option_col_left_title_left"]
                        }
                      >
                        Thời gian
                      </div>
                      <Form.Item
                        className={
                          styles["promotion_add_option_col_left_percent"]
                        }
                        name="date-picker_date_1"
                      >
                        <DatePicker
                          style={{ width: '100% ' }}
                          onChange={onChangeDate}
                          initialValues={moment("2021/04/26", dateFormatList[0])}
                          format={dateFormatList}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
                <Row className={styles["promotion_add_option"]}>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={22}
                    sm={22}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        className={
                          styles["promotion_add_option_col_left_title"]
                        }
                      >
                        <div style={{ marginBottom: '0.5rem' }}>Ngày kết thúc</div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <Checkbox onChange={onChangeCheckbox}></Checkbox>
                        </div>
                      </div>
                      {valueCheckbox ? (
                        <Form.Item
                          className={
                            styles["promotion_add_option_col_left_percent"]
                          }
                          name="date-picker_date_finish"
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={onChangeDate}
                            initialValues={moment(
                              "2021/04/26",
                              dateFormatList[0]
                            )}
                            format={dateFormatList}
                          />
                        </Form.Item>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </Col>
                  <Col
                    className={styles["promotion_add_option_col"]}
                    xs={22}
                    sm={22}
                    md={11}
                    lg={11}
                    xl={11}
                  >
                    <div className={styles["promotion_add_option_col_left"]}>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles["promotion_add_option_col_left_title_left"]
                        }
                      >
                        Thời gian
                      </div>
                      {valueCheckbox === true ? (
                        <Form.Item
                          className={
                            styles["promotion_add_option_col_left_percent"]
                          }
                          name="date-picker_date_2"
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            onChange={onChangeDate}
                            initialValues={moment(
                              "2021/04/26",
                              dateFormatList[0]
                            )}
                            format={dateFormatList}
                          />
                        </Form.Item>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
              </div>
            </Col> */}

          </Row>
          {/* 
          <Row className={styles["promotion_add_name"]}>

          </Row> */}

          <div className={styles["promotion_add_button"]}>
            {/* <Form.Item style={{ marginRight: '1rem' }}>
              <Button style={{ width: '5rem' }} type="primary" danger>
                Hủy
              </Button>
            </Form.Item> */}

            <Form.Item>
              <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>

        <Modal
          title="Danh sách khách hàng"
          centered
          footer={null}
          width={1000}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
              <Search placeholder="Tìm kiếm khách hàng" onSearch={onSearchCustomerChoose} enterButton />
            </div>
            <div style={{ marginTop: '1rem', border: '1px solid rgb(209, 191, 191)', width: '100%', maxWidth: '100%', overflow: 'auto' }}> <Table scroll={{ y: 500 }} rowSelection={rowSelection} columns={columns} dataSource={data} /></div>
            <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              {/* <div onClick={() => modal2VisibleModal(false)} style={{ marginRight: '1rem' }}><Button style={{ width: '7.5rem' }} type="primary" danger>Hủy</Button></div> */}
              <div onClick={() => modal2VisibleModal(false)}><Button type="primary" style={{ width: '7.5rem' }}>Xác nhận</Button></div>
            </div>
          </div>
        </Modal>

      </Drawer>
    </UI>
  );
}
