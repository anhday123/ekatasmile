import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as types from "./../../consts/index";
import axios from 'axios'
import { ACTION, ROUTES } from './../../consts/index'
import avatar from "./../../assets/img/icon_header_right.png";
import { Layout, Menu, Select, Radio, notification, Upload,  Button, Input, Popover, Modal, Form } from "antd";
import {
  MenuOutlined,
  GoldOutlined,
  BankOutlined,
  ApartmentOutlined,
  MenuFoldOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  GiftOutlined,
  CarOutlined,
  UserAddOutlined,
  RotateLeftOutlined,
  TagsOutlined,
  SettingOutlined,
  ClusterOutlined,
  PlusOutlined,
  AlertOutlined,
  AccountBookOutlined,
  PartitionOutlined,
  FormOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import styles from "./../Layout/layout.module.scss";

import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import cart from './../../assets/img/cart.png'
import Permission from 'components/permission'
import {
  useParams,
  Link,
  useHistory,
  useLocation,
  useRouteMatch
} from "react-router-dom";
import { Row, Col } from "antd";
import { getStoreSelectValue } from './../../actions/store/index'
import { apiAllRole, updateUser, apiSearch } from "../../apis/user";
import { decodeToken } from "react-jwt";
const { Sider } = Layout;
const { Option } = Select;
const { Dragger } = Upload;

const UI = (props) => {
  let history = useHistory();
  const location = useLocation()
  const routeMatch = useRouteMatch()

  const storeReducer = useSelector((state) => state.store)
  const login = useSelector((state) => state.login)
  const dataUser = localStorage.getItem('accessToken') ? decodeToken(localStorage.getItem('accessToken')) : {}
  const [modal2Visible, setModal2Visible] = useState(false)
  const [form] = Form.useForm();
  const [role, setRole] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false)
  let { slug } = useParams();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  var toggle = (data) => {
    if (count === 0) {
      dispatch({ type: types.authConstants.TOGGLE, temp: data });
      setCount(1);
    } else {
      dispatch({ type: types.authConstants.TOGGLE, temp: 0 });
      setCount(0);
    }
  };

  const [user, setUser] = useState({})
  const getInfoUser = async () => {
    try {
      const res = await apiSearch({user_id: dataUser.data.user_id});
      if (res.status === 200) {
        if (res.data.data[0]) setUser(res.data.data[0])
      }
    } catch (error) {
      console.log(error)
    }
  };
  var toggle = () => {
    setCollapsed(!collapsed);

  };

  const onCollapse = (collapsed) => {
    setCollapsed({ collapsed });
  };

  const MENUS = [
    {
      path: ROUTES.OVERVIEW,
      title: 'Tổng quan',
      permissions: [],
      icon: <MenuFoldOutlined className={styles["icon_parent"]} />,
    },
    {
      path: ROUTES.SELL,
      title: 'Bán hàng',
      permissions: [],
      icon: <ShoppingCartOutlined />,
    },
    {
      path: ROUTES.ORDER_LIST,
      title: 'Danh sách đơn hàng',
      permissions: [],
      icon: <NoteAddIcon />,
    },
    {
      path: ROUTES.BUSINESS,
      title: 'Business',
      permissions: [],
      icon: <ApartmentOutlined />,
    },
    {
      path: 'product',
      title: 'Sản phẩm',
      permissions: [],
      icon: <FormOutlined />,
      menuItems: [
        {
          icon: <GiftOutlined />,
          path: ROUTES.PRODUCT,
          title: 'Quản lý sản phẩm',
          permissions: [],
        },
        {
          icon: <BankOutlined />,
          path: ROUTES.INVENTORY,
          title: 'Quản lý kho',
          permissions: [],
        },
        {
          icon: <RotateLeftOutlined />,
          path: ROUTES.SHIPPING_PRODUCT,
          title: 'Quản lý chuyển hàng',
          permissions: [],
        },
        {
          icon: <GoldOutlined />,
          path: ROUTES.SUPPLIER,
          title: 'Quản lý nhà cung cấp',
          permissions: [],
        },
        {
          icon: <AccountBookOutlined />,
          path: ROUTES.GUARANTEE,
          title: 'Quản lý bảo hành',
          permissions: [],
        },
      ],
    },
    {
      path: ROUTES.PRODUCT_CHECK,
      title: 'Kiểm hàng cuối ngày',
      permissions: [],
      icon: <AlertOutlined />,
    },
    {
      path: ROUTES.CUSTOMER,
      title: 'Quản lý khách hàng',
      permissions: [],
      icon: <UserAddOutlined />,
    },
    {
      path: 'report',
      title: 'Báo cáo đơn hàng',
      permissions: [],
      icon: <DollarCircleOutlined />,
      menuItems: [
        {
          icon: <GraphicEqIcon />,
          path: ROUTES.REPORT_END_DAY,
          title: 'Báo cáo cuối ngày',
          permissions: [],
        },
        {
          icon: <ReplyAllIcon />,
          path: ROUTES.REPORT_IMPORT,
          title: 'Báo cáo nhập hàng',
          permissions: [],
        },
        {
          icon: <FastfoodIcon />,
          path: ROUTES.REPORT_INVENTORY,
          title: 'Báo cáo tồn kho',
          permissions: [],
        },
        {
          icon: <FastfoodIcon />,
          path: ROUTES.REPORT_FINANCIAL,
          title: 'Báo cáo tài chính',
          permissions: [],
        },
      ],
    },
    {
      path: 'transport',
      title: 'Vận chuyển',
      permissions: [],
      icon: <DollarCircleOutlined />,
      menuItems: [
        {
          icon: <ClusterOutlined />,
          path: ROUTES.SHIPPING_CONTROL,
          title: 'Đối soát vận chuyển',
          permissions: [],
        },
        {
          icon: <CarOutlined />,
          path: ROUTES.SHIPPING,
          title: 'Quản lý đối tác vận chuyển',
          permissions: [],
        },
      ],
    },
    {
      path: ROUTES.CONFIGURATION_STORE,
      title: 'Cấu hình thông tin',
      permissions: [],
      icon: <SettingOutlined />,
    },
    {
      path: ROUTES.PROMOTION,
      title: 'Khuyến mãi',
      permissions: [],
      icon: <TagsOutlined />,
    },
    {
      path: ROUTES.ROLE,
      title: 'Quản lý phân quyền',
      permissions: [],
      icon: <PartitionOutlined />,
    },
  ]

  const renderMenuItem = (_menu) => (
    <Permission permissions={_menu.permissions} key={_menu.path}>
      {_menu.menuItems ? (
        <Menu.SubMenu
          key={_menu.path}
          icon={_menu.icon}
          title={<span style={{ fontSize: '1rem' }}>{_menu.title}</span>}
        >
          {_menu.menuItems.map((e) => (
            <Permission permissions={e.permissions}>
              <Menu.Item 
                key={e.path} 
                icon={e.icon} 
                style={{
                  fontSize: '1rem', 
                  color: 'black',
                  backgroundColor: location.pathname === e.path && '#e7e9fb'
                }}
              >
                <Link to={e.path} style={{color: !collapsed ? 'black' : 'white'}}>
                  {e.title}
                </Link>
              </Menu.Item>
            </Permission>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item 
          icon={_menu.icon} 
          key={_menu.path} 
          style={{
            fontSize: '1rem', 
            color: 'black',
            backgroundColor:  location.pathname === _menu.path && '#e7e9fb'
          }}
        >
          <Link to={_menu.path} style={{color: !collapsed ? 'black' : 'white'}}>
            {_menu.title}
          </Link>
        </Menu.Item>
      )}
    </Permission>
  )

  const [key, setKey] = useState([]);
  const onOpenChange = (data) => {
    localStorage.setItem("key", JSON.stringify(data));
    setKey(data);
  };
  useEffect(() => {
    setKey(JSON.parse(localStorage.getItem("key")));
  }, []);
  const onClickMenuItem = () => {
    localStorage.removeItem("key");
  };
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const [branchId, setBranchId] = useState({})
  useEffect(() => {
    const branch_id = JSON.parse(localStorage.getItem('branch_id'))
    setBranchId(branch_id && branch_id.data && branch_id.data.branch && branch_id.data.branch.branch_id && branch_id.data.branch.branch_id ? branch_id.data.branch.branch_id : '')
  }, [])
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Chỉnh sửa thông tin cá nhân thành công',
    });
  };
  const apiAllRoleData = async () => {
    try {
      const res = await apiAllRole();
      if (res.status === 200) {
        setRole(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllRoleData();
  }, []);

  const onClickSignout = () => {
    localStorage.clear()
  }

  const [username, setUsername] = useState('')
  useEffect(() => {
    const username = localStorage.getItem('username')
    setUsername(username)
  }, [])
  const content = (
    <div className={styles['user_information']}>
      <div onClick={() => modal2VisibleModal(true)}>
        <div><b><UserOutlined style={{ fontSize: '1rem', color: 'black' }} /></b> Thông tin cá nhân</div>
        <div><RightOutlined style={{ fontSize: '0.75rem' }} /></div>
      </div>
      <div onClick={() => modal1VisibleModal(true)}>
        <div><b><EditOutlined style={{ fontSize: '1rem', color: 'black' }} /></b> Chỉnh sửa thông tin cá nhân</div>
        <div><RightOutlined style={{ fontSize: '0.75rem' }} /></div>
      </div>
      <Link to="/" onClick={onClickSignout} className={styles['user_information_link']} style={{ color: 'black', fontWeight: '600' }} >
        <div><b><LogoutOutlined style={{ fontSize: '1rem', color: 'black' }} /></b> Đăng xuất</div>
        <div><RightOutlined style={{ fontSize: '0.75rem' }} /></div>
      </Link>
    </div>
  );
  const modal1VisibleModal = (modal1Visible) => {
    setModal1Visible(modal1Visible)
    const data = form.getFieldValue()
    if (user) {
      data.firstName = user.first_name
      data.lastName = user.last_name
      data.phoneNumber = user.phone;
      data.email = user.email;
      data.workPlace = user.company_name;
      data.role = user.role.role_id;
      data.address = user.address
    } else {
      data.firstName = login.objectUsername.first_name
      data.lastName = login.objectUsername.last_name
      data.phoneNumber = login.objectUsername.phone;
      data.email = login.objectUsername.email;
      data.workPlace = login.objectUsername.company_name;
      data.role = login.objectUsername.role.role_id;
      data.address = login.objectUsername.address
    }
  }
  const updateUserData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await updateUser(object, id);
      console.log(res);
      if (res.status === 200) {
        await getInfoUser();
        modal1VisibleModal(false)
        openNotification()
      }
      dispatch({ type: ACTION.LOADING, data: false });
 
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const [storeValue, setStoreValue] = useState('')
  function handleChange(value) {
    setStoreValue(value)
    const actions = getStoreSelectValue(value)
    dispatch(actions)
  }

  const [list, setList] = useState('')
  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    async onChange(info) {
      var { status } = info.file;
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          console.log(info.file, info.fileList);
          if (info.fileList && info.fileList.length > 0) {
            const image = info.fileList[info.fileList.length - 1].originFileObj;
            let formData = new FormData();    //formdata object
            formData.append("files", image);   //append the values with key, value pair
            if (formData) {
              dispatch({ type: ACTION.LOADING, data: true });
              let a = axios
                .post(
                  "https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                )
                .then((resp) => resp);
              let resultsMockup = await Promise.all([a]);
              console.log(resultsMockup[0].data.data[0])
              dispatch({ type: ACTION.LOADING, data: false });

              setList(resultsMockup[0].data.data[0])
            }
          }
        }
      }
    },
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      history.push('/')
    }
  }, [])
  const onFinish = async (values) => {
    console.log('Success:', values);
    console.log(role)
    if (list !== 'default') {
      if (user.avatar !== "default") {
        updateUserData({
          ...values, role: values.role,
          phone: values.phoneNumber,
          email: values.email,
          store: " ",
          branch: " ",
          avatar: list,
          first_name: values && values.firstName ? values.firstName.toLowerCase() : '',
          last_name: values && values.lastName ? values.lastName.toLowerCase() : '',
          birthday: " ",
          address: values && values.address ? values.address.toLowerCase() : '',
          ward: " ",
          district: " ",
          province: " ",
          company_name: values.workPlace,
          company_website: " ",
          tax_code: " ",
          fax: " "
        }, user.user_id)
      } else {

        updateUserData({
          ...values, role: values.role,
          phone: values.phoneNumber,
          email: values.email,
          branch: " ",
          avatar: list,
          first_name: values.firstName.toLowerCase(),
          last_name: values.lastName.toLowerCase(),
          birthday: " ",
          address: values.address.toLowerCase(),
          ward: " ",
          district: " ",
          province: " ",
          company_name: values.workPlace,
          company_website: " ",
          tax_code: " ",
          fax: " "
        }, login.objectUsername.user_id)
      }
    } else {
      if (user.avatar !== "default") {
        updateUserData({
          ...values, role: values.role,
          phone: values.phoneNumber,
          email: values.email,
          branch: " ",
          avatar: user.avatar,
          first_name: values && values.firstName ? values.firstName.toLowerCase() : '',
          last_name: values && values.lastName ? values.lastName.toLowerCase() : '',
          birthday: " ",
          address: values && values.address ? values.address.toLowerCase() : '',
          ward: " ",
          district: " ",
          province: " ",
          company_name: values.workPlace,
          company_website: " ",
          tax_code: " ",
          fax: " "
        }, user.user_id)
      } else {

        updateUserData({
          ...values, role: values.role,
          phone: values.phoneNumber,
          email: values.email,
          branch: " ",
          avatar: '',
          first_name: values.firstName.toLowerCase(),
          last_name: values.lastName.toLowerCase(),
          birthday: " ",
          address: values.address.toLowerCase(),
          ward: " ",
          district: " ",
          province: " ",
          company_name: values.workPlace,
          company_website: " ",
          tax_code: " ",
          fax: " "
        }, login.objectUsername.user_id)
      }
    }
  };

  const [attentionModal, setAttentionModal] = useState(false)

  useEffect(() => {
    getInfoUser()
    if (slug === '1' || slug === 1) {
      const branch_id = JSON.parse(localStorage.getItem('branch_id'))
      var result = branch_id && branch_id.data && branch_id.data.branch && branch_id.data.branch.branch_id && branch_id.data.branch.branch_id ? branch_id.data.branch.branch_id : ''
      if ((result && result.name !== '') || (result && result.name !== ' ') || (result && result.name !== 'default') || (result && result.name !== null)) {

      } else {
        setAttentionModal(true)
      }
    }
  }, [])
  const onClickConfirmAttention = () => {
    history.push({ pathname: "/store/19", state: '1' })
    setAttentionModal(false)
  }

  return (
    <Layout style={{ backgroundColor: '#FFFFFF', height: '100%' }}>
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        centered
        footer={null}
        visible={modal1Visible}
        onOk={() => modal1VisibleModal(false)}
        onCancel={() => modal1VisibleModal(false)}
      >
        <Form
          style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', width: '100%' }}
          onFinish={onFinish}
          form={form}
        >
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={7} md={7} lg={7} xl={7}>
              <div>
                <Dragger {...propsMain}>
                  {
                    list ? (<p style={{ marginTop: '1.25rem', }} className="ant-upload-drag-icon">

                      <img src={list} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                    </p>) : (user && user.avatar !== " " ? (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <img src={user.avatar} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                    </p>) : (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <PlusOutlined />

                      <div>Thêm ảnh</div>

                    </p>))
                  }
                </Dragger>
              </div>
            </Col>
          </Row>
          <div className={styles['information_user_modal']}>
            <div className={styles['information_user_modal']}>
              <div>Họ</div>
              <Form.Item
                name="lastName"

              >
                <Input placeholder="Nhập họ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên</div>
              <Form.Item
                name="firstName"

              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Liên hệ</div>
              <Form.Item
                name="phoneNumber"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập liên hệ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Email</div>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên công ty</div>
              <Form.Item
                name="workPlace"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
            </div>
            {
              role && role.length > 0 ? (<div className={styles['information_user_modal']}>
                <div>Chức vụ</div>
                <Form.Item name="role"  >
                  <Radio.Group>
                    {
                      role && role.length > 0 && role.map((values, index) => {
                        return (
                          <Radio disabled style={{ marginRight: '1.5rem', marginBottom: '1rem' }} value={values.role_id}>{values.name}</Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
              </div>) : ('')
            }
            <div className={styles['information_user_modal']}>
              <div>Địa chỉ</div>
              <Form.Item
                name="address"

              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </div>
            <Form.Item style={{ width: '100%', marginTop: '1rem' }}>
              <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Thông tin cá nhân"
        centered
        footer={null}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ marginRight: '1.5rem' }}>
            {
              user && user.avatar === '' || user.avatar === ' ' ? (<img src={user.avatar} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" />)
                : <img src={user.avatar} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" />
            }



          </div>
          {
            user ? (<div className={styles['information_user_modal']}>
              <div>{`Họ tên: ${user.first_name} ${user.last_name}`}</div>
              <div>{`Liên hệ: ${user.phone}`}</div>
              <div>{`Email: ${user.email}`}</div>
              <div>{`Tên công ty: ${user.company_name}`}</div>
              <div>{`Chức vụ: ${user && user.role_id && user.role_id.name ? user.role_id.name : ''}`}</div>
              <div>{`Địa chỉ: ${user.address}`}</div>
            </div>)
              : (<div className={styles['information_user_modal']}>
                <div>{`Họ tên: ${login.objectUsername.first_name} ${login.objectUsername.last_name}`}</div>
                <div>{`Liên hệ: ${login.objectUsername.phone}`}</div>
                <div>{`Email: ${login.objectUsername.email}`}</div>
                <div>{`Tên công ty: ${login.objectUsername.company_name}`}</div>
                <div>{`Chức vụ: ${login.objectUsername && login.objectUsername.role_id && login.objectUsername.role_id.name ? login.objectUsername.role_id.name : ''}`}</div>
                <div>{`Địa chỉ: ${login.objectUsername.address}`}</div>
              </div>)
          }
        </div>
      </Modal>
      <Sider
        trigger={null}
        collapsible
        width={275}
        style={{ backgroundColor: '#FFFFFF', height: '100%', }}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }} className={collapsed ? styles['hidden'] : styles['show']}>
          <img src={cart} className={collapsed ? styles['hidden'] : styles['show']} style={{ width: '7.5rem', objectFit: 'contain', height: '5rem' }} alt="" />
          <div className={collapsed ? styles['hidden'] : styles['show']} style={{ color: 'black', fontSize: '1.25rem', fontWeight: '600', margin: '0.5rem 0 1rem 0.5rem' }}>{(user && user.company_name) || dataUser.data.company_name}</div>
        </div>
        <Menu
          className={styles["toggle_left"]}
          theme="light"
          onOpenChange={(openKeys) => onOpenChange(openKeys)}
          openKeys={
            key
              ? key.map((values, index) => {
                if (index === key.length - 1) {
                  return values;
                }
              })
              : ""
          }
          selectedKeys={routeMatch.path}
          mode="inline"
        >
          {MENUS.map(renderMenuItem)}
          <Menu.Item onClick={onClickSignout} key="9" icon={<LogoutOutlined />}>
            <Link to={ROUTES.LOGIN}>Logout</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles["site-layout"]}>
        <Row className={styles["background_right_top"]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ backgroundColor: '#5B6BE8', width: '100%' }} className={styles["navbar"]}>
              <div className={styles["navbar_left"]}>
                <div className={styles["navbar_left_parent"]}>
                  <div>
                    <MenuOutlined
                      onClick={toggle}
                      className={styles["header_navbar_left_icon"]}
                    />
                  </div>
                </div>
                <Link to={ROUTES.STORE} style={{ marginRight: '1rem', cursor: 'pointer' }}><PlusOutlined style={{ backgroundColor: '#50D648', color: 'white', borderRadius: '50%', padding: '0.25rem', fontSize: '1.5rem', fontWeight: '900' }} /></Link>
                <div className={styles["navbar_right_select"]}>
                  {
                    storeReducer && storeReducer.length > 0 ? (<Select
                      value={storeValue ? storeValue : storeReducer[0].data[0].store_id}
                      style={{ width: 300 }}
                      onChange={handleChange}
                    >
                      {
                        storeReducer[0].data.map((values, index) => {
                          return (
                            <Option value={values.store_id}>{values.name}</Option>
                          )
                        })
                      }

                    </Select>) : (<div style={{ width: 200, padding: '0.25rem 1rem', fontSize: '1rem', color: 'black', cursor: 'pointer', backgroundColor: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>Chưa có cửa hàng</div>)
                  }
                </div>
              </div>
              <div className={styles["navbar_right"]}>
                <Popover placement="bottomRight" content={content}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
                    <div style={{ padding: '0 0.75rem 0 0.5rem' }}>
                      {
                        user && user.avatar === ' ' || user.avatar === '' ? (<img src={avatar} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} alt="" />)
                          : <img src={avatar} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} alt="" />
                      }

                    </div>
                    <div className={styles["navbar_right_left_name"]}>
                      <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>{username ? username : login.username}</div>
                      <div>0 VNĐ</div>
                    </div></div></Popover>
              </div>
            </div>
          </Col>
        </Row>
        <Row >
          <Col
            className={styles["background_right"]}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            {/* {toggleLeft(key)} */}
            {props.children}
          </Col>
        </Row>
        <Modal
          title="Xin chào"
          centered
          width={700}
          footer={null}
          visible={attentionModal}
          onOk={() => setAttentionModal(false)}
          onCancel={() => setAttentionModal(false)}
        >
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}>Chào mừng bạn sử dụng Admin Order, tạo 1 cửa hàng để bắt đầu công việc kinh doanh của mình nhé.</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
            <Button type="primary" style={{ width: '7.5rem', marginRight: 15 }} onClick={() => setAttentionModal(false)}>Để sau</Button>
            <Button type="primary" style={{ width: '7.5rem' }} onClick={onClickConfirmAttention}>Tiếp tục</Button>
          </div>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default UI;