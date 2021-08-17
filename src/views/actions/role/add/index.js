import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import {
  Layout,
  Menu,
  Col,
  Row,
  Tabs,
  Popover,
  Tree,
  DatePicker,
  Drawer,
  Space,
  Table,
  Form,
  Button,
  Modal,
  Select,
  Input,
} from "antd";
// import Link from "next/link";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import React, { useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  FilterOutlined,
  DownloadOutlined,
  UserOutlined,
  InfoCircleOutlined,
  BellOutlined,
  ToTopOutlined,
  AudioOutlined,
  DashboardOutlined,
  EyeOutlined,
  ChromeOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  UnorderedListOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  LinkOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { TextArea } = Input;
const treeData = [
  {
    title: "Order",
    key: "order",
    children: [
      {
        title: "View order",
        key: "viewOrder",
      },
      {
        title: "Create order",
        key: "createOrder",
      },
      {
        title: "Update order",
        key: "updateOrder",
      },
    ],
  },
];
const treeDataCenter = [
  {
    title: "Product",
    key: "product",
    children: [
      {
        title: "View product",
        key: "viewProduct",
      },
      {
        title: "Create product",
        key: "createProduct",
      },
      {
        title: "Update product",
        key: "updateProduct",
      },
      {
        title: "Delete product",
        key: "deleteProduct",
      },
      {
        title: "Export product file",
        key: "exportProductFile",
      },
      {
        title: "Bill payment",
        key: "billPayment",
      },
    ],
  },
];
const treeDataRight = [
  {
    title: "Report bill",
    key: "reportbill",
    children: [
      {
        title: "View bill",
        key: "viewBill",
      },
      {
        title: "Create bill",
        key: "createBill",
      },
      {
        title: "Update bill",
        key: "updateBill",
      },
      {
        title: "Delete bill",
        key: "deleteBill",
      },
      {
        title: "Export bill file",
        key: "exportBillFile",
      },
    ],
  },
];
export default function RoleAdd() {
  const [value, setValue] = useState("");

  const onChange = ({ target: { value } }) => {
    setValue(value);
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [expandedKeys, setExpandedKeys] = useState([
    "order",
    "product",
    "reportbill",
  ]);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <UI>
      <div className={styles["role_add"]}>
        <Row className={styles["role_add_title_parent"]}>
          <Col
            className={styles["role_add_title_parent_col"]}
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Link className={styles["role_add_title"]} to="/users/19">

              <div className={styles["role_add_title_left"]}>
                <div>
                  <ArrowLeftOutlined />
                </div>
                <div>Add new roles</div>
              </div>

            </Link>
          </Col>
          <Col
            className={styles["role_add_title_parent_col_fix"]}
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Form.Item className={styles["role_add_title_right"]}>
              <Button
                className={styles["role_add_title_right_child"]}
                type="primary"
                htmlType="submit"
              >
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={styles["role_add_bottom"]}
        >
          <div className={styles["role_add_bottom_title"]}>
            <div>Role details</div>
          </div>
          <Row className={styles["role_add_bottom_row"]}>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Row className={styles["role_add_bottom_row_child"]}>
                  <Col
                    className={styles["role_add_bottom_row_col"]}
                    xs={24}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                  >
                    <div className={styles["role_add_bottom_row_col_title"]}>
                      <div>Role name</div>
                    </div>
                  </Col>
                  <Col
                    className={styles["role_add_bottom_row_col"]}
                    xs={24}
                    sm={19}
                    md={19}
                    lg={19}
                    xl={19}
                  >
                    <Form.Item
                      className={styles["role_add_bottom_row_col_input"]}
                      // label="Username"
                      name="roleName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your role name!",
                        },
                      ]}
                    >
                      <Input
                        className={
                          styles["role_add_bottom_row_col_input_child"]
                        }
                        placeholder="Input role name"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <Row className={styles["role_add_bottom_row_child"]}>
                  <Col
                    className={styles["role_add_bottom_row_col"]}
                    xs={24}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                  >
                    <div className={styles["role_add_bottom_row_col_title"]}>
                      <div>Note</div>
                    </div>
                  </Col>
                  <Col
                    className={styles["role_add_bottom_row_col"]}
                    xs={24}
                    sm={19}
                    md={19}
                    lg={19}
                    xl={19}
                  >
                    <Form.Item
                      name="note"
                      className={styles["role_add_bottom_row_col_input"]}
                    >
                      <Input.TextArea
                        className={
                          styles["role_add_bottom_row_col_input_child"]
                        }
                        value={value}
                        onChange={onChange}
                        placeholder="Input note"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
        <Row className={styles["tree_checkbox"]}>
          <Col
            className={styles["tree_checkbox_col"]}
            xs={24}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            {" "}
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}

              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Col>
          <Col
            className={styles["tree_checkbox_col"]}
            xs={24}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            {" "}
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeDataRight}
            />
          </Col>
          <Col
            className={styles["tree_checkbox_col"]}
            xs={24}
            sm={11}
            md={7}
            lg={7}
            xl={7}
          >
            {" "}
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeDataCenter}
            />
          </Col>
        </Row>
      </div>
    </UI>
  );
}
