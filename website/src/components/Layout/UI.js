import React, { useState, useEffect } from "react";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { useDispatch, useSelector } from "react-redux";
import * as types from "./../../consts/index";
import axios from 'axios'
import { ACTION } from './../../consts/index'
import avatar from "./../../assets/img/icon_header_right.png";
import { Layout, Menu, Spin, Select, DatePicker, Radio, notification, Upload, Checkbox, Space, Button, Input, Popover, Modal, Form } from "antd";
import {
  MenuOutlined,
  FileImageOutlined,
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
import { connect } from "react-redux";
import * as actions from "./../../actions/index";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import cart from './../../assets/img/cart.png'
import {
  BrowserRouter as Router,
  Switch,
  useParams,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Row, Col } from "antd";
import { logoutAction } from "../../actions/login";
import { getStoreSelectValue } from './../../actions/store/index'
import { apiAllRole, apiAllUser, updateUser } from "../../apis/user";
import { getAllStore } from "../../apis/store";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;
const data = [];
const { Dragger } = Upload;
for (let i = 0; i < 46; i++) {
  data.push({
    checkbox: <Checkbox />,
    stt: i,
    productCode: (
      <Input className={styles["table_input"]} defaultValue="productCode" />
    ),
    productName: (
      <Input className={styles["table_input"]} defaultValue="productName" />
    ),
    productImage: <FileImageOutlined />,
    productPrice: (
      <Input className={styles["table_input"]} defaultValue="productPrice" />
    ),
    productType: (
      <Input className={styles["table_input"]} defaultValue="productType" />
    ),
    productQuantity: "productQuantity",
    productSupplier: (
      <Input className={styles["table_input"]} defaultValue="productSupplier" />
    ),
  });
}
const UI = (props) => {
  let history = useHistory();
  const storeReducer = useSelector((state) => state.store)
  const login = useSelector((state) => state.login)
  const siderStatus = useSelector(state => state.sider)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [form] = Form.useForm();
  const [role, setRole] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false)
  let { slug } = useParams();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [clickToSell, setClickToSell] = useState(false)
  const pathnameIgnoreLoading = ['/customer/12', '/employee/19', '/shipping-product/9', '/product/6', '/promotion/20']
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
  const apiAllUserData = async () => {
    try {
      if (pathnameIgnoreLoading.indexOf(history.location.pathname) == -1) {
        //   dispatch({ type: ACTION.LOADING, data: true });
      }




      const res = await apiAllUser();
      console.log(res)
      console.log("991")
      if (res.status === 200) {
        const username = localStorage.getItem("username")
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (username === values.username) {
            setUser(values)
          }
        })


      }
      // setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      // <Spin size="large" spinning={false} />
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllUserData();
    if (history.location.pathname == '/sell/2') {
      dispatch({ type: ACTION.CHANGE_SIDER, value: true });
    }
    else {
      dispatch({ type: ACTION.CHANGE_SIDER, value: false });
    }
  }, []);
  var toggle = () => {
    setCollapsed(!collapsed);
    dispatch({ type: ACTION.CHANGE_SIDER, value: !siderStatus });

  };

  const onCollapse = (collapsed) => {
    console.log(collapsed);
    console.log("|||123")
    setCollapsed({ collapsed });
  };
  // Correct
  const [key, setKey] = useState([]);
  const onOpenChange = (data) => {
    console.log(data);
    console.log("|||")
    localStorage.setItem("key", JSON.stringify(data));
    setKey(data);
    // props.onKey(data);
  };
  useEffect(() => {
    setKey(JSON.parse(localStorage.getItem("key")));
    console.log(key);
  }, []);
  console.log(key);
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
      if (pathnameIgnoreLoading.indexOf(history.location.pathname) == -1) {
        //  dispatch({ type: ACTION.LOADING, data: true });
      }

      const res = await apiAllRole();
      console.log(res)
      console.log("|||777")
      if (res.status === 200) {
        setRole(res.data.data)
      }
      // setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllRoleData();
  }, []);
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
  const onClickSignout = () => {
    const actions = logoutAction('123');
    dispatch(actions)
  }
  const onClickMoveMenu = (menu) => {

    // const menu_list = JSON.parse(localStorage.getItem('menu_list'))
    // menu_list && menu_list.length > 0 && menu_list.forEach((values, index) => {
    //   if (values.indexOf(menu) !== -1) {
    //     history.push(menu_list)
    //   } else {
    //     alert('123')
    //   }
    // })
  }
  console.log(typeof slug)
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
    console.log(user)
    console.log("||0000")
    if (user) {
      // user.forEach((values, index) => {
      data.firstName = user.first_name
      data.lastName = user.last_name
      data.phoneNumber = user.phone;
      data.email = user.email;
      data.workPlace = user.company_name;
      data.role = user.role.role_id;
      data.address = user.address
      // })
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
        await apiAllUserData();
        modal1VisibleModal(false)
        openNotification()
        // history.push("/user/19");
      }
      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const [store, setStore] = useState([])
  const getAllStoreData = async () => {
    try {
      if (pathnameIgnoreLoading.indexOf(history.location.pathname) == -1) {
        //   dispatch({ type: ACTION.LOADING, data: true });
      }

      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

        // var arrayDistrict = []
        // var arrayProvince = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   arrayDistrict.push(values.district)
        //   arrayProvince.push(values.province)
        // })
        // setDistrict([...arrayDistrict])
        // setProvince([...arrayProvince])
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
  const [storeValue, setStoreValue] = useState('')
  function handleChange(value) {
    setStoreValue(value)
    const actions = getStoreSelectValue(value)
    dispatch(actions)
    // store && store.forEach((values, index) => {
    //   if (values.name === value) {
    //     if (values.bussiness_id && values && values.bussiness_id.username) {
    //       setCity(values.bussiness_id.username)
    //     } else {
    //       setCity('Chưa Có Doanh Nghiệp')
    //     }

    //   }
    // })
  }
  console.log(user)
  console.log("881")
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
      // if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      // }
      // if (status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      //   console.log('Dropped files', e.dataTransfer.files);
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
        // user.forEach((values6, index6) => {

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
        // })
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
        // user.forEach((values6, index6) => {

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
        // })
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
  const openNotificationForgetImage = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Bạn đang ở cửa hàng.',
    });
  };
  const onClickStore = () => {
    if (slug === '19') {
      openNotificationForgetImage()
    } else {
      history.push('/store/19')
    }
  }
  const [attentionModal, setAttentionModal] = useState(false)
  const onClickAttention = () => {
    //   to = {{ pathname: "/store/19", state: '1' }
    // }
    setAttentionModal(true)
  }
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
          onFinishFailed={onFinishFailed}
        >
          {/* <Form.Item >
            <Form.Item name="imageUpdateInformation" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Upload.Dragger name="files" action="/upload.do">
                <img src={user.avatar === "" ? "" : user.avatar} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" />
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={7} md={7} lg={7} xl={7}>
              <div>
                <Dragger {...propsMain}>
                  {
                    list ? (<p style={{ marginTop: '1.25rem', }} className="ant-upload-drag-icon">

                      <img src={list} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                    </p>) : (user.avatar !== "" ? (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <img src={user.avatar} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                    </p>) : (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <PlusOutlined />

                      <div>Thêm ảnh</div>

                    </p>))
                  }
                </Dragger>
              </div>
            </Col>
          </Row> */}
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={7} md={7} lg={7} xl={7}>
              <div>
                {/* <Dragger {...propsMain}>
                  {
                    user && user.avatar === 'default' ? (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <PlusOutlined />

                      <div>Thêm ảnh</div>

                    </p>) : (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                      <img src={user.avatar} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                    </p>)

                  }
                </Dragger> */}
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
                // label="Username"
                name="lastName"

              >
                <Input placeholder="Nhập họ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên</div>
              <Form.Item
                // label="Username"
                name="firstName"

              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Liên hệ</div>
              <Form.Item
                // label="Username"
                name="phoneNumber"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập liên hệ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Email</div>
              <Form.Item
                // label="Username"
                name="email"
                rules={[{ required: true, message: 'Giá trị rỗng!' }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên công ty</div>
              <Form.Item
                // label="Username"
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
                // label="Username"
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
              user && user.avatar === '' || user.avatar === ' ' ? (<img src={avatar} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" />)
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

              // user.map((values, index) => {
              //   return (
              // <div className={styles['information_user_modal']}>
              //   <div>{`Họ tên: ${user.first_name} ${user.last_name}`}</div>
              //   <div>{`Liên hệ: ${user.phone}`}</div>
              //   <div>{`Email: ${user.email}`}</div>
              //   <div>{`Tên công ty: ${user.company_name}`}</div>
              //   <div>{`Chức vụ: ${user && user.role_id && user.role_id.name ? user.role_id.name : ''}`}</div>
              //   <div>{`Địa chỉ: ${user.address}`}</div>
              // </div>
              // )
              // }

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
        width={250}
        style={{ backgroundColor: '#FFFFFF', height: '100%', }}
        collapsed={siderStatus}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }} className={siderStatus ? styles['hidden'] : styles['show']}>
          <img src={cart} className={siderStatus ? styles['hidden'] : styles['show']} style={{ width: '7.5rem', objectFit: 'contain', height: '5rem' }} alt="" />
          <div className={siderStatus ? styles['hidden'] : styles['show']} style={{ color: 'black', fontSize: '1.25rem', fontWeight: '600', margin: '0.5rem 0 1rem 0.5rem' }}>{user && user.company_name !== " " ? user.company_name : 'CHƯA CÓ DANH NGHIỆP'}</div>
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
          defaultSelectedKeys={[slug ? slug : "1"]}
          mode="inline"
        >
          <Menu.Item
            key="1"
            style={slug && slug === '1' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            onClick={onClickMenuItem}
            // className={slug && slug === '1' ? styles['active_key'] : styles['key']}
            icon={<MenuFoldOutlined className={styles["icon_parent"]} />}
          >
            <Link to="/overview/1" style={slug && slug === '1' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}> Tổng quan</Link>
          </Menu.Item>
          <Menu.Item
            onClick={onClickMenuItem}
            key="2"
            style={slug && slug === '2' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}

            icon={<ShoppingCartOutlined />}
          >
            {
              (branchId && branchId.name !== '') || (branchId && branchId.name !== ' ') || (branchId && branchId.name !== 'default') || (branchId && branchId.name !== null) ? (<Link to="/sell/2" >Bán hàng</Link>) : (<div onClick={onClickAttention} >Bán hàng</div>)
            }

          </Menu.Item>
          <Menu.Item
            icon={<NoteAddIcon />}
            style={slug && slug === '4' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}

            key="4"
          >
            <Link to="/order-list/4" style={slug && slug === '4' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}>Danh sách đơn hàng</Link>
          </Menu.Item>
          {/* <Menu.Item
              icon={<DescriptionIcon />}
              style={{ fontSize: '1rem' }}
              key="3"
            >
              <Link to="/order-create-shipping/3">Tạo đơn và giao hàng</Link>
            </Menu.Item> */}
          {/* <SubMenu
            style={{ fontSize: '1rem' }}
            key="sub1"
            icon={<FormOutlined />}
            title="Quản lý đơn hàng"
          >
            <Menu.Item
              icon={<DescriptionIcon />}
              style={{ fontSize: '1rem' }}
              key="3"
            >
              <Link to="/order-create-shipping/3">Tạo đơn và giao hàng</Link>
            </Menu.Item>
            <Menu.Item
              icon={<NoteAddIcon />}
              style={{ fontSize: '1rem' }}
              key="4"
            >
              <Link to="/order-list/4">Danh sách đơn hàng</Link>
            </Menu.Item> */}
          {/* </SubMenu> */}

          <Menu.Item
            onClick={onClickMenuItem}
            key="5"

            style={slug && slug === '5' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<ApartmentOutlined />}
          >
            <Link style={slug && slug === '5' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/business/5">Business</Link>
          </Menu.Item>

          <SubMenu
            style={{ fontSize: '1rem' }}
            key="sub2"
            icon={<FormOutlined />}
            title="Sản phẩm"
          >
            <Menu.Item

              key="6"
              style={slug && slug === '6' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<GiftOutlined />}
            >
              <Link style={slug && slug === '6' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/product/6">Quản lý sản phẩm</Link>
            </Menu.Item>

            <Menu.Item

              key="7"
              style={slug && slug === '7' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<BankOutlined />}
            >
              <Link style={slug && slug === '7' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/inventory/7">Quản lý kho</Link>
            </Menu.Item>

            <Menu.Item

              key="9"
              style={slug && slug === '9' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<RotateLeftOutlined />}
            >
              <Link style={slug && slug === '9' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/shipping-product/9">Quản lý chuyển hàng</Link>
            </Menu.Item>
            <Menu.Item

              key="10"
              style={slug && slug === '10' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<GoldOutlined />}
            >
              <Link style={slug && slug === '10' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/supplier/10">Quản lý nhà cung cấp</Link>
            </Menu.Item>
            <Menu.Item

              key="11"
              style={slug && slug === '11' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<AccountBookOutlined />}
            >
              <Link style={slug && slug === '11' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/guarantee/11">Quản lý bảo hành</Link>
            </Menu.Item>

          </SubMenu>
          <Menu.Item

            key="8"
            style={slug && slug === '8' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<AlertOutlined />}
          >
            <Link style={slug && slug === '8' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/product-check/8">Kiểm hàng cuối ngày</Link>
          </Menu.Item>
          <Menu.Item
            onClick={onClickMenuItem}
            key="12"
            style={slug && slug === '12' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<UserAddOutlined />}
          >
            <Link style={slug && slug === '12' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/customer/12">Quản lý khách hàng</Link>
          </Menu.Item>

          <SubMenu icon={<DollarCircleOutlined />} style={{ fontSize: '1rem' }} key="sub3" title="Báo cáo đơn hàng">
            <Menu.Item
              icon={<GraphicEqIcon />}
              style={slug && slug === '13' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              key="13"
            >
              <Link style={slug && slug === '13' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/report-end-day/13">Báo cáo cuối ngày</Link>
            </Menu.Item>
            <Menu.Item
              icon={<ReplyAllIcon />}
              style={slug && slug === '14' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              key="14"
            >
              <Link style={slug && slug === '14' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/report-import/14">Báo cáo nhập hàng</Link>
            </Menu.Item>
            <Menu.Item
              icon={<FastfoodIcon />}
              style={slug && slug === '15' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              key="15"
            >
              <Link style={slug && slug === '15' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/report-inventory/15">Báo cáo tồn kho</Link>
            </Menu.Item>
            <Menu.Item
              icon={<FastfoodIcon />}
              style={slug && slug === '16' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              key="16"
            >
              <Link style={slug && slug === '16' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/report-financial/16">Báo cáo tài chính</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu style={{ fontSize: '1rem' }} icon={<DollarCircleOutlined />} key="sub4" title="Vận chuyển">
            <Menu.Item

              key="17"
              style={slug && slug === '17' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<ClusterOutlined />}
            >
              <Link style={slug && slug === '17' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/shipping-control/17">Đối soát vận chuyển</Link>
            </Menu.Item>
            <Menu.Item

              key="18"
              style={slug && slug === '18' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
              icon={<CarOutlined />}
            >
              <Link style={slug && slug === '18' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/shipping/18">Quản lý đối tác vận chuyển</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            onClick={onClickMenuItem}
            key="19"
            style={slug && slug === '19' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<SettingOutlined />}
          >
            <Link style={slug && slug === '19' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/configuration-store/19">Cấu hình thông tin</Link>
          </Menu.Item>
          <Menu.Item
            onClick={onClickMenuItem}
            key="20"
            style={slug && slug === '20' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<TagsOutlined />}
          >
            <Link style={slug && slug === '20' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/promotion/20">Khuyến mãi</Link>
          </Menu.Item>

          <Menu.Item
            onClick={onClickMenuItem}
            key="21"
            style={slug && slug === '21' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<PartitionOutlined />}
          >
            <Link style={slug && slug === '21' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} to="/role/21">Quản lý phân quyền</Link>
          </Menu.Item>
          <Menu.Item
            onClick={onClickMenuItem}
            key="22"
            style={slug && slug === '22' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }}
            icon={<LogoutOutlined />}
          >
            <Link style={slug && slug === '22' ? { color: '#000000', fontSize: '1rem', backgroundColor: '#e7e9fb' } : { fontSize: '1rem' }} onClick={onClickSignout} to="/">Đăng xuất</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles["site-layout"]}>
        <Row className={styles["background_right_top"]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div style={{ backgroundColor: '#5B6BE8', width: '100%' }} className={styles["navbar"]}>
              <div className={styles["navbar_left"]}>
                <div className={styles["navbar_left_parent"]}>
                  {/* <img src="/img/icon_header_left.png" alt="" />
                  <div className={styles["header_navbar_left_name"]}>
                    Company name
                  </div> */}
                  <div>
                    {" "}
                    <MenuOutlined
                      onClick={toggle}
                      className={styles["header_navbar_left_icon"]}
                    />
                  </div>
                </div>
                <div onClick={onClickStore} style={{ marginRight: '1rem', cursor: 'pointer' }}><PlusOutlined style={{ backgroundColor: '#50D648', color: 'white', borderRadius: '50%', padding: '0.25rem', fontSize: '1.5rem', fontWeight: '900' }} /></div>
                <div className={styles["navbar_right_select"]}>
                  {
                    storeReducer && storeReducer.length > 0 ? (<Select
                      // defaultValue={storeReducer[0].name}
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
                {/* <div><BellOutlined style={{ color: 'black', fontSize: '1.5rem' }} /></div> */}

                <Popover placement="bottomRight" content={content}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
                    <div style={{ padding: '0 0.75rem 0 0.5rem' }}>
                      {
                        user && user.avatar === ' ' || user.avatar === '' ? (<img src={avatar} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} alt="" />)
                          : <img src={user.avatar} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} alt="" />
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
          <div onClick={onClickConfirmAttention} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button type="primary" style={{ width: '7.5rem' }}>Tiếp tục</Button>
          </div></Modal>
      </Layout>
    </Layout>
  );
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch, props) => {
  return {
    onKey: (data) => {
      dispatch(actions.key(data));
    },
    // onProductAPI: () => {
    //   dispatch(actions.productAPI());
    // },
    // onCart: (data) => {
    //   dispatch(actions.cartReducers(data));
    // },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UI);