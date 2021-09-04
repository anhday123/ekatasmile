import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as types from './../../consts/index'
import axios from 'axios'
import { ACTION, ROUTES } from './../../consts/index'
import avatar from './../../assets/img/icon_header_right.png'
import {
  Layout,
  Menu,
  Select,
  Radio,
  notification,
  Upload,
  Button,
  Input,
  Popover,
  Modal,
  Form,
  Spin,
  BackTop,
} from 'antd'
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
  DownOutlined,
} from '@ant-design/icons'
import FastfoodIcon from '@material-ui/icons/Fastfood'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import styles from './../Layout/layout.module.scss'

import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import ReplyAllIcon from '@material-ui/icons/ReplyAll'
import cart from './../../assets/img/cart.png'

//components
import Permission from 'components/permission'

import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { Row, Col } from 'antd'
import { getStoreSelectValue } from './../../actions/store/index'
import { PERMISSIONS } from 'consts'

//apis
import { apiAllRole, updateUser, apiSearch } from 'apis/user'
import { getAllStore } from 'apis/store'

import { decodeToken } from 'react-jwt'
const { Sider } = Layout
const { Option } = Select
const { Dragger } = Upload

const UI = (props) => {
  const location = useLocation()
  const routeMatch = useRouteMatch()

  const [listStore, setListStore] = useState([])
  const [user, setUser] = useState({})
  const login = useSelector((state) => state.login)
  const dataUser = localStorage.getItem('accessToken')
    ? decodeToken(localStorage.getItem('accessToken'))
    : {}
  console.log('datauser', dataUser)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [form] = Form.useForm()
  const [role, setRole] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false)
  const dispatch = useDispatch()
  const [count, setCount] = useState(0)
  const [collapsed, setCollapsed] = useState(
    location.pathname === ROUTES.SELL ? true : false
  ) //nếu nhấn vào menu bán hàng thì thu gọn menu
  const [loadingStore, setLoadingStore] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  var toggle = (data) => {
    if (count === 0) {
      dispatch({ type: types.authConstants.TOGGLE, temp: data })
      setCount(1)
    } else {
      dispatch({ type: types.authConstants.TOGGLE, temp: 0 })
      setCount(0)
    }
  }

  const getInfoUser = async () => {
    try {
      const res = await apiSearch({ user_id: dataUser.data.user_id })
      if (res.status === 200) {
        if (res.data.data.length) setUser(res.data.data[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getStoreByUser = async () => {
    try {
      setLoadingStore(true)
      const res = await getAllStore()

      if (res.status === 200) setListStore(res.data.data)
      setLoadingStore(false)
    } catch (error) {
      setLoadingStore(false)
      console.log(error)
    }
  }

  var toggle = () => {
    setCollapsed(!collapsed)
  }

  const onCollapse = (collapsed) => {
    setCollapsed({ collapsed })
  }

  const MENUS = [
    {
      path: ROUTES.OVERVIEW,
      title: 'Tổng quan',
      permissions: [PERMISSIONS.tong_quan],
      icon: <MenuFoldOutlined />,
    },
    {
      path: ROUTES.SELL,
      title: 'Bán hàng',
      permissions: [PERMISSIONS.ban_hang],
      icon: <ShoppingCartOutlined />,
    },
    {
      path: ROUTES.ORDER_LIST,
      title: 'Danh sách đơn hàng',
      permissions: [PERMISSIONS.danh_sach_don_hang],
      icon: <NoteAddIcon />,
    },
    {
      path: ROUTES.BUSINESS,
      title: 'Quản lý kinh doanh',
      permissions: [PERMISSIONS.business_management],
      icon: <ApartmentOutlined />,
    },
    {
      path: 'product',
      title: 'Sản phẩm',
      permissions: [PERMISSIONS.san_pham],
      icon: <FormOutlined />,
      menuItems: [
        {
          icon: <GiftOutlined />,
          path: ROUTES.PRODUCT,
          title: 'Quản lý sản phẩm',
          permissions: [PERMISSIONS.quan_li_san_pham],
        },
        {
          icon: <BankOutlined />,
          path: ROUTES.INVENTORY,
          title: 'Quản lý kho',
          permissions: [PERMISSIONS.quan_li_kho],
        },
        {
          icon: <RotateLeftOutlined />,
          path: ROUTES.SHIPPING_PRODUCT,
          title: 'Quản lý chuyển hàng',
          permissions: [PERMISSIONS.quan_li_chuyen_hang],
        },
        {
          icon: <GoldOutlined />,
          path: ROUTES.SUPPLIER,
          title: 'Quản lý nhà cung cấp',
          permissions: [PERMISSIONS.quan_li_nha_cung_cap],
        },
        {
          icon: <AccountBookOutlined />,
          path: ROUTES.GUARANTEE,
          title: 'Quản lý bảo hành',
          permissions: [PERMISSIONS.quan_li_bao_hanh],
        },
      ],
    },
    {
      path: ROUTES.PROMOTION,
      title: 'Khuyến mãi',
      permissions: [PERMISSIONS.khuyen_mai],
      icon: <TagsOutlined />,
    },
    {
      path: ROUTES.PRODUCT_CHECK,
      title: 'Kiểm hàng cuối ngày',
      permissions: [PERMISSIONS.kiem_hang_cuoi_ngay],
      icon: <AlertOutlined />,
    },
    {
      path: ROUTES.CUSTOMER,
      title: 'Quản lý khách hàng',
      permissions: [PERMISSIONS.quan_li_khach_hang],
      icon: <UserAddOutlined />,
    },
    {
      path: 'report',
      title: 'Báo cáo đơn hàng',
      permissions: [PERMISSIONS.bao_cao_don_hang],
      icon: <DollarCircleOutlined />,
      menuItems: [
        {
          icon: <GraphicEqIcon />,
          path: ROUTES.REPORT_END_DAY,
          title: 'Báo cáo cuối ngày',
          permissions: [PERMISSIONS.bao_cao_cuoi_ngay],
        },
        {
          icon: <ReplyAllIcon />,
          path: ROUTES.REPORT_IMPORT,
          title: 'Báo cáo nhập hàng',
          permissions: [PERMISSIONS.bao_cao_nhap_hang],
        },
        {
          icon: <FastfoodIcon />,
          path: ROUTES.REPORT_INVENTORY,
          title: 'Báo cáo tồn kho',
          permissions: [PERMISSIONS.bao_cao_ton_kho],
        },
        {
          icon: <FastfoodIcon />,
          path: ROUTES.REPORT_FINANCIAL,
          title: 'Báo cáo tài chính',
          permissions: [PERMISSIONS.bao_cao_tai_chinh],
        },
      ],
    },
    {
      path: 'transport',
      title: 'Vận chuyển',
      permissions: [PERMISSIONS.van_chuyen],
      icon: <DollarCircleOutlined />,
      menuItems: [
        {
          icon: <ClusterOutlined />,
          path: ROUTES.SHIPPING_CONTROL,
          title: 'Đối soát vận chuyển',
          permissions: [PERMISSIONS.doi_soat_van_chuyen],
        },
        {
          icon: <CarOutlined />,
          path: ROUTES.SHIPPING,
          title: 'Quản lý đối tác vận chuyển',
          permissions: [PERMISSIONS.quan_li_doi_tac_van_chuyen],
        },
      ],
    },
    {
      path: ROUTES.CONFIGURATION_STORE,
      title: 'Cấu hình thông tin',
      permissions: [PERMISSIONS.cau_hinh_thong_tin],
      icon: <SettingOutlined />,
    },
    {
      path: ROUTES.ROLE,
      title: 'Quản lý phân quyền',
      permissions: [PERMISSIONS.quan_li_phan_quyen],
      icon: <PartitionOutlined />,
    },
  ]

  const renderMenuItem = (_menu) => (
    <Permission permissions={_menu.permissions} key={_menu.path}>
      {_menu.menuItems ? (
        <Menu.SubMenu
          key={_menu.path}
          title={
            <div
              style={{
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: collapsed && 'center',
                lineHeight: '25px',
              }}
            >
              {collapsed && _menu.icon}
              {_menu.title}
            </div>
          }
          icon={!collapsed && _menu.icon}
        >
          {_menu.menuItems.map((e) => (
            <Permission permissions={e.permissions}>
              {!collapsed ? (
                <Menu.Item
                  key={e.path}
                  style={{
                    fontSize: '0.8rem',
                    backgroundColor: location.pathname === e.path && '#e7e9fb',
                  }}
                  icon={!collapsed && e.icon}
                >
                  <Link
                    to={e.path}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: collapsed && 'center',
                      lineHeight: '25px',
                    }}
                  >
                    {collapsed && e.icon}

                    {e.title}
                  </Link>
                </Menu.Item>
              ) : (
                <Link to={e.path}>
                  <Menu.Item
                    key={e.path}
                    style={{
                      fontSize: '0.8rem',
                      backgroundColor:
                        location.pathname === e.path && '#e7e9fb',
                      color: 'black',
                    }}
                    icon={collapsed && e.icon}
                  >
                    {e.title}
                  </Menu.Item>
                </Link>
              )}
            </Permission>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={_menu.path}
          style={{
            fontSize: '0.8rem',
            backgroundColor: location.pathname === _menu.path && '#e7e9fb',
            color: collapsed && 'white',
          }}
          icon={!collapsed && _menu.icon}
        >
          <Link
            to={_menu.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: collapsed && 'center',
              lineHeight: '25px',
            }}
          >
            {collapsed && _menu.icon}
            {_menu.title}
          </Link>
        </Menu.Item>
      )}
    </Permission>
  )

  const [key, setKey] = useState([])
  const onOpenChange = (data) => {
    localStorage.setItem('key', JSON.stringify(data))
    setKey(data)
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Chỉnh sửa thông tin cá nhân thành công',
    })
  }
  const apiAllRoleData = async () => {
    try {
      const res = await apiAllRole()
      if (res.status === 200) {
        setRole(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const onClickSignout = () => {
    dispatch({ type: ACTION.LOGOUT })
  }

  const [username, setUsername] = useState('')
  useEffect(() => {
    setKey(JSON.parse(localStorage.getItem('key')))

    const username = localStorage.getItem('username')
    setUsername(username)
  }, [])
  const content = (
    <div className={styles['user_information']}>
      <div onClick={() => modal2VisibleModal(true)}>
        <div>
          <UserOutlined
            style={{ fontSize: '1rem', marginRight: 10, color: 'black' }}
          />
          Thông tin cá nhân
        </div>
      </div>
      <div onClick={() => modal1VisibleModal(true)}>
        <div>
          <EditOutlined
            style={{ fontSize: '1rem', marginRight: 10, color: 'black' }}
          />
          Chỉnh sửa thông tin cá nhân
        </div>
      </div>
      <Link
        to={ROUTES.LOGIN}
        onClick={onClickSignout}
        className={styles['user_information_link']}
        style={{ color: 'black', fontWeight: '600' }}
      >
        <div>
          <LogoutOutlined
            style={{ fontSize: '1rem', marginRight: 10, color: 'black' }}
          />
          Đăng xuất
        </div>
      </Link>
    </div>
  )
  const modal1VisibleModal = (modal1Visible) => {
    setModal1Visible(modal1Visible)
    const data = form.getFieldValue()
    if (user) {
      data.firstName = user.first_name
      data.lastName = user.last_name
      data.phoneNumber = user.phone
      data.email = user.email
      data.workPlace = user.company_name
      data.role = user.role.role_id
      data.address = user.address
    } else {
      data.firstName = login.objectUsername.first_name
      data.lastName = login.objectUsername.last_name
      data.phoneNumber = login.objectUsername.phone
      data.email = login.objectUsername.email
      data.workPlace = login.objectUsername.company_name
      data.role = login.objectUsername.role.role_id
      data.address = login.objectUsername.address
    }
  }
  const updateUserData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await updateUser(object, id)
      console.log(res)
      if (res.status === 200) {
        await getInfoUser()
        modal1VisibleModal(false)
        openNotification()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  function handleChange(value) {
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
      var { status } = info.file
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          console.log(info.file, info.fileList)
          if (info.fileList && info.fileList.length > 0) {
            const image = info.fileList[info.fileList.length - 1].originFileObj
            let formData = new FormData() //formdata object
            formData.append('files', image) //append the values with key, value pair
            if (formData) {
              dispatch({ type: ACTION.LOADING, data: true })
              let a = axios
                .post(
                  'https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }
                )
                .then((resp) => resp)
              let resultsMockup = await Promise.all([a])
              console.log(resultsMockup[0].data.data[0])
              dispatch({ type: ACTION.LOADING, data: false })

              setList(resultsMockup[0].data.data[0])
            }
          }
        }
      }
    },
  }

  const onFinish = async (values) => {
    if (list !== 'default') {
      if (user.avatar !== 'default') {
        updateUserData(
          {
            ...values,
            role: values.role,
            phone: values.phoneNumber,
            email: values.email,
            store: ' ',
            branch: ' ',
            avatar: list,
            first_name: values && values.firstName ? values.firstName : '',
            last_name: values && values.lastName ? values.lastName : '',
            birthday: ' ',
            address: values && values.address ? values.address : '',
            ward: ' ',
            district: ' ',
            province: ' ',
            company_name: values.workPlace,
            company_website: ' ',
            tax_code: ' ',
            fax: ' ',
          },
          user.user_id
        )
      } else {
        updateUserData(
          {
            ...values,
            role: values.role,
            phone: values.phoneNumber,
            email: values.email,
            branch: ' ',
            avatar: list,
            first_name: values.firstName,
            last_name: values.lastName,
            birthday: ' ',
            address: values.address,
            ward: ' ',
            district: ' ',
            province: ' ',
            company_name: values.workPlace,
            company_website: ' ',
            tax_code: ' ',
            fax: ' ',
          },
          login.objectUsername.user_id
        )
      }
    } else {
      if (user.avatar !== 'default') {
        updateUserData(
          {
            ...values,
            role: values.role,
            phone: values.phoneNumber,
            email: values.email,
            branch: ' ',
            avatar: user.avatar,
            first_name: values && values.firstName ? values.firstName : '',
            last_name: values && values.lastName ? values.lastName : '',
            birthday: ' ',
            address: values && values.address ? values.address : '',
            ward: ' ',
            district: ' ',
            province: ' ',
            company_name: values.workPlace,
            company_website: ' ',
            tax_code: ' ',
            fax: ' ',
          },
          user.user_id
        )
      } else {
        updateUserData(
          {
            ...values,
            role: values.role,
            phone: values.phoneNumber,
            email: values.email,
            branch: ' ',
            avatar: '',
            first_name: values.firstName,
            last_name: values.lastName,
            birthday: ' ',
            address: values.address,
            ward: ' ',
            district: ' ',
            province: ' ',
            company_name: values.workPlace,
            company_website: ' ',
            tax_code: ' ',
            fax: ' ',
          },
          login.objectUsername.user_id
        )
      }
    }
  }

  const changeBranch = (value) => {
    localStorage.store = value
    updateUser({ store_id: value }, user.user_id)
  }

  useEffect(() => {
    getInfoUser()
    getStoreByUser()
    apiAllRoleData()
  }, [])

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
      setCollapsed(true)
    } else setIsMobile(false)
  }, [])

  return (
    <Layout style={{ backgroundColor: 'white', height: '100%' }}>
      <BackTop style={{ right: '20px', bottom: '20px' }} />
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        centered
        footer={null}
        visible={modal1Visible}
        onOk={() => modal1VisibleModal(false)}
        onCancel={() => modal1VisibleModal(false)}
      >
        <Form
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            width: '100%',
          }}
          onFinish={onFinish}
          form={form}
        >
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginBottom: '1rem' }}
              xs={24}
              sm={7}
              md={7}
              lg={7}
              xl={7}
            >
              <div>
                <Dragger {...propsMain}>
                  {list ? (
                    <p
                      style={{ marginTop: '1.25rem' }}
                      className="ant-upload-drag-icon"
                    >
                      <img
                        src={list}
                        style={{
                          width: '7.5rem',
                          height: '5rem',
                          objectFit: 'contain',
                        }}
                        alt=""
                      />
                    </p>
                  ) : user && user.avatar !== ' ' ? (
                    <p
                      style={{ marginTop: '1.25rem' }}
                      className="ant-upload-drag-icon"
                    >
                      <img
                        src={user.avatar}
                        style={{
                          width: '7.5rem',
                          height: '5rem',
                          objectFit: 'contain',
                        }}
                        alt=""
                      />
                    </p>
                  ) : (
                    <p
                      style={{ marginTop: '1.25rem' }}
                      className="ant-upload-drag-icon"
                    >
                      <PlusOutlined />

                      <div>Thêm ảnh</div>
                    </p>
                  )}
                </Dragger>
              </div>
            </Col>
          </Row>
          <div className={styles['information_user_modal']}>
            <div className={styles['information_user_modal']}>
              <div>Họ</div>
              <Form.Item name="lastName">
                <Input placeholder="Nhập họ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên</div>
              <Form.Item name="firstName">
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
            {role && role.length > 0 ? (
              <div className={styles['information_user_modal']}>
                <div>Chức vụ</div>
                <Form.Item name="role">
                  <Radio.Group>
                    {role &&
                      role.length > 0 &&
                      role.map((values, index) => {
                        return (
                          <Radio
                            disabled
                            style={{
                              marginRight: '1.5rem',
                              marginBottom: '1rem',
                            }}
                            value={values.role_id}
                          >
                            {values.name}
                          </Radio>
                        )
                      })}
                  </Radio.Group>
                </Form.Item>
              </div>
            ) : (
              ''
            )}
            <div className={styles['information_user_modal']}>
              <div>Địa chỉ</div>
              <Form.Item name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </div>
            <Form.Item style={{ width: '100%', marginTop: '1rem' }}>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
              >
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <div style={{ marginRight: '1.5rem' }}>
            {(user && user.avatar === '') || user.avatar === ' ' ? (
              <img
                src={user.avatar}
                style={{
                  width: '7.5rem',
                  height: '7.5rem',
                  objectFit: 'contain',
                }}
                alt=""
              />
            ) : (
              <img
                src={user.avatar}
                style={{
                  width: '7.5rem',
                  height: '7.5rem',
                  objectFit: 'contain',
                }}
                alt=""
              />
            )}
          </div>
          {user ? (
            <div className={styles['information_user_modal']}>
              <div>{`Họ tên: ${user.first_name} ${user.last_name}`}</div>
              <div>{`Liên hệ: ${user.phone}`}</div>
              <div>{`Email: ${user.email}`}</div>
              <div>{`Tên công ty: ${user.company_name}`}</div>
              <div>{`Chức vụ: ${
                user && user.role_id && user.role_id.name
                  ? user.role_id.name
                  : ''
              }`}</div>
              <div>{`Địa chỉ: ${user.address}`}</div>
            </div>
          ) : (
            <div className={styles['information_user_modal']}>
              <div>{`Họ tên: ${login.objectUsername.first_name} ${login.objectUsername.last_name}`}</div>
              <div>{`Liên hệ: ${login.objectUsername.phone}`}</div>
              <div>{`Email: ${login.objectUsername.email}`}</div>
              <div>{`Tên công ty: ${login.objectUsername.company_name}`}</div>
              <div>{`Chức vụ: ${
                login.objectUsername &&
                login.objectUsername.role_id &&
                login.objectUsername.role_id.name
                  ? login.objectUsername.role_id.name
                  : ''
              }`}</div>
              <div>{`Địa chỉ: ${login.objectUsername.address}`}</div>
            </div>
          )}
        </div>
      </Modal>
      <Sider
        trigger={null}
        collapsible
        width={isMobile ? '100%' : 230}
        collapsedWidth={isMobile ? 0 : 150}
        style={{
          backgroundColor: 'white',
          height: '100%',
          zIndex: isMobile && 6000,
        }}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
          className={collapsed ? styles['hidden'] : styles['show']}
        >
          <img
            src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/09/02/95131dfc-bf13-4c49-82f3-6c7c43a7354d_logo_quantribanhang 1.png"
            className={collapsed ? styles['hidden'] : styles['show']}
            style={{ width: '6rem', objectFit: 'contain' }}
            alt=""
          />
          <div
            className={collapsed ? styles['hidden'] : styles['show']}
            style={{
              color: 'black',
              fontSize: '1rem',
              fontWeight: '600',
              margin: '0.5rem 0 1rem 0.5rem',
            }}
          >
            {(user && user.company_name) || dataUser.data.company_name}
          </div>
        </div>
        <Menu
          className={styles['toggle_left']}
          theme="light"
          onOpenChange={(openKeys) => onOpenChange(openKeys)}
          openKeys={
            key
              ? key.map((values, index) => {
                  if (index === key.length - 1) {
                    return values
                  }
                })
              : ''
          }
          selectedKeys={routeMatch.path}
          mode="inline"
        >
          {MENUS.map(renderMenuItem)}
          <Menu.Item
            onClick={onClickSignout}
            key="9"
            icon={!collapsed && <LogoutOutlined />}
          >
            <Link
              to={ROUTES.LOGIN}
              style={{
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: collapsed && 'center',
                justifyContent: 'center',
                lineHeight: '25px',
              }}
            >
              {collapsed && <LogoutOutlined />}
              Logout
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles['site-layout']}>
        <Row className={styles['background_right_top']}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row
              wrap={isMobile}
              justify="space-between"
              className={styles['navbar']}
            >
              <Row
                align="middle"
                wrap={false}
                style={{
                  width: '100%',
                  paddingLeft: 5,
                  paddingRight: 5,
                  marginTop: 10,
                  marginBottom: 15,
                }}
                justify={isMobile && 'space-between'}
              >
                <div className={styles['navbar_left_parent']}>
                  <MenuOutlined
                    onClick={toggle}
                    className={styles['header_navbar_left_icon']}
                  />
                </div>
                <Permission permissions={[PERMISSIONS.them_cua_hang]}>
                  <Link
                    to={{
                      pathname: ROUTES.STORE,
                      state: 'show-modal-create-store',
                    }}
                    style={{ marginRight: '1rem', cursor: 'pointer' }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        backgroundColor: '#FFAB2D',
                        borderColor: '#FFAB2D',
                        fontWeight: 600,
                        marginLeft: 10,
                      }}
                    >
                      Thêm cửa hàng
                    </Button>
                  </Link>
                </Permission>
                <Select
                  placeholder="Chọn cửa hàng"
                  style={{ width: isMobile ? '90%' : 250 }}
                  size="large"
                  onChange={changeBranch}
                  defaultValue={localStorage.store || dataUser.data.store_id}
                >
                  {listStore.map((e, index) => (
                    <Option value={e.store_id} key={index}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
              </Row>
              <div className={styles['navbar_right']}>
                <Popover placement="bottomRight" content={content}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ padding: '0 0.75rem 0 0.5rem' }}>
                      <img
                        src={
                          (user && user.avatar === ' ') || !user.avatar
                            ? avatar
                            : user.avatar
                        }
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          objectFit: 'contain',
                        }}
                        alt=""
                      />
                    </div>
                    <div className={styles['navbar_right_left_name']}>
                      <div
                        style={{
                          color: 'black',
                          fontWeight: '600',
                          fontSize: '1rem',
                        }}
                      >
                        {username ? username : login.username}
                      </div>
                      <div>0 VNĐ</div>
                    </div>
                  </div>
                </Popover>
              </div>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              backgroundColor: '#f0f2f5',
              width: '100%',
              height: '100%',
            }}
          >
            {props.children}
          </Col>
        </Row>
      </Layout>
    </Layout>
  )
}

export default UI
