import UI from "../../../../components/Layout/UI";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import {
  Select,
  Row,
  Col,
  Radio,
  notification,
  Button,
  Popover,
  Modal,
  Input,
  DatePicker,
  Table,
  Form,
  Space,
  Checkbox,
  InputNumber,
} from "antd";
import {
  AudioOutlined,
  FileImageOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./../add/add.module.scss";
import moment from "moment";
import { getAllBranch } from "../../../../apis/branch";
import { addPromotion } from "../../../../apis/promotion";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";

const dateFormatList = ["YYYY/MM/DD", "DD/MM/YY"];

const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
const { Option } = Select;
const provinceData = ["Zhejiang", "Jiangsu"];
const cityData = {
  Zhejiang: ["Chương trình khuyến mãi (CTKM)", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};

const provinceDataPercent = ["Zhejiang", "Jiangsu"];
const cityDataPercent = {
  Zhejiang: ["Theo phần trăm", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};

const { Search } = Input;
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
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
export default function PromotionAdd() {
  let history = useHistory();
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [valueCheckbox, setValueCheckbox] = useState(false);
  const [value, setValue] = useState(1);
  const [branchList, setBranchList] = useState([])
  const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [citiesPercent, setCitiesPercent] = React.useState(
    cityDataPercent[provinceDataPercent[0]]
  );
  const [secondCity, setSecondCity] = React.useState(
    cityData[provinceData[0]][0]
  );
  const [secondCityPercent, setSecondCityPercent] = React.useState(
    cityDataPercent[provinceDataPercent[0]][0]
  );
  const handleProvinceChange = (value) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };
  const onSecondCityChangePercent = (value) => {
    setSecondCityPercent(value);
  };
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
    // this.setState({
    //   value: e.target.value,
    // });
  };
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const onChangeCheckbox = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setValueCheckbox(e.target.checked);
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm khuyến mãi thành công.',
    });
  };
  const onFinish = async (values) => {
    try {
      const obj = {
        name: values.name,
        type: values.type,
        value: values.value,
        limit: {
          amount: values.amount,
          branchs: values.branch
        }
      }
      const res = await addPromotion(obj)
      if (res.status === 200) {
        openNotification()
        history.push("/promotion/20");
      }
      else
        throw res
    }
    catch (e) {
      console.log(e)
      notification.error({ message: 'Thất bại!', description: "Thêm khuyến mãi không thành công" })
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  const content = (
    <div>
      <p>Gợi ý 1</p>
      <p>Gợi ý 2</p>
    </div>
  );
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = value => console.log(value);
  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const getBranch = async (params) => {
    try {
      const res = await getAllBranch(params)
      if (res.status === 200) {
        setBranchList(res.data.data.filter(e => e.active))
      }
      else {
        throw res
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getBranch()
  }, [])
  return (
    <UI>
      <div className={styles["promotion_add"]}>
        <Link className={styles["promotion_add_title"]} to="/promotion/20">

          <div>
            <ArrowLeftOutlined />
          </div>
          <div>Thêm khuyến mãi</div>

        </Link>

        <Form
          className={styles["promotion_add_form_parent"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/*           
          <Row className={styles["promotion_add_form"]}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles["promotion_add_form_left"]}
            >
              <div className={styles["promotion_add_form_left_title"]}>
                Hình thức khuyến mãi
              </div>
              <div className={styles["promotion_add_form_left_select"]}>
                <Form.Item
                  name="promotion"
                  noStyle
                  rules={[{ required: true, message: "Giá trị rỗng" }]}
                >
                  <Select
                    className={styles["promotion_add_form_left_select_child"]}
                    placeholder="Chương trình khuyến mãi (CTKM)"
                  >
                    <Option value="km1">Khuyến mãi 1</Option>
                    <Option value="km2">Khuyến mãi 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>

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
                  Áp dụng mới
                </div>

                <Form.Item
                  className={styles["promotion_add_name_col_child_radio"]}
                  name="radio-group"
                // label="Radio.Group"
                >
                  <Radio.Group>
                    <Radio value="radio0">Tất cả sản phẩm</Radio>
                    <Radio value="radio1">Danh mục sản phẩm</Radio>
                    <Radio value="radio2">Sản phẩm</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>



          </Row>
           */}
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
                  <Input placeholder="Nhập tên chương trình khuyến mãi" />
                </Form.Item>
              </div>
            </Col>

            {/*             
            <Col
              style={{ marginTop: '1rem', width: '100%' }}
              className={styles["promotion_add_name_col"]}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div style={{ width: '100%' }} className={styles["promotion_add_name_col_child"]}>
                <div className={styles["promotion_add_form_left_title"]}>
                  Mã khuyến mãi
                </div>
                <Form.Item
                  className={styles["promotion_add_name_col_child_title"]}
                  // label="Username"
                  name="promotionCode"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                >
                  <Input placeholder="Nhập mã khuyến mãi" />
                </Form.Item>
                <div onClick={() => modal2VisibleModal(true)} style={{ color: '#0019FF', cursor: 'pointer', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Chọn khách hàng</div>
                <div style={{ width: '100%', maxWidth: '100%', overflow: 'auto' }} className={styles['customer_name_tag']}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div style={{ marginRight: '1rem' }}>Nguyễn Văn A</div>
                    <div><CloseOutlined style={{ color: 'black', fontSize: '1rem' }} /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div style={{ marginRight: '1rem' }}>Nguyễn Văn B</div>
                    <div><CloseOutlined style={{ color: 'black', fontSize: '1rem' }} /></div>
                  </div>
                </div>
              </div>
            </Col>
 */}

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
                            style={{ width: '100%' }}
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
                              branchList.map(e => <Option value={e.branch_id}>{e.name}</Option>)
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
                Tạo
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
            <Popover placement="bottomLeft" trigger="click" content={content} >
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                <Search placeholder="Tìm kiếm khách hàng" onSearch={onSearchCustomerChoose} enterButton />
              </div>
            </Popover>
            <div style={{ marginTop: '1rem', border: '1px solid rgb(209, 191, 191)', width: '100%', maxWidth: '100%', overflow: 'auto' }}> <Table scroll={{ y: 500 }} rowSelection={rowSelection} columns={columns} dataSource={data} /></div>
            <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              {/* <div onClick={() => modal2VisibleModal(false)} style={{ marginRight: '1rem' }}><Button style={{ width: '7.5rem' }} type="primary" danger>Hủy</Button></div> */}
              <div onClick={() => modal2VisibleModal(false)}><Button type="primary" style={{ width: '7.5rem' }}>Xác nhận</Button></div>
            </div>
          </div>
        </Modal>

      </div>
    </UI>
  );
}
