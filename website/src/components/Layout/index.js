import React, { useState, useEffect } from 'react'
import styles from './layout.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION, ROUTES, PERMISSIONS } from 'consts'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { Bell, CarretDown, Plus } from 'utils/icon'

import {
  Layout,
  Menu,
  Select,
  Radio,
  notification,
  Upload,
  Button,
  Input,
  Dropdown,
  Modal,
  Form,
  BackTop,
  Affix,
  Avatar,
  Badge,
  Empty,
  Row,
  Col,
} from 'antd'

import {
  MenuOutlined,
  GoldOutlined,
  ApartmentOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  GiftOutlined,
  CarOutlined,
  UserAddOutlined,
  RotateLeftOutlined,
  SettingOutlined,
  ControlOutlined,
  ClusterOutlined,
  PlusOutlined,
  PartitionOutlined,
  FormOutlined,
  UserOutlined,
  ExportOutlined,
  SlidersOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TransactionOutlined,
  HomeOutlined,
  AreaChartOutlined,
} from '@ant-design/icons'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'

//components
import Permission from 'components/permission'

//apis
import { getRoles, updateUser, getUsers } from 'apis/user'
import { getAllBranch } from 'apis/branch'
import { uploadFile } from 'apis/upload'

import jwt_decode from 'jwt-decode'

const { Sider } = Layout
const { Option } = Select
const { Dragger } = Upload
const BaseLayout = (props) => {
  const location = useLocation()
  const routeMatch = useRouteMatch()
  const WIDTH_MENU_OPEN = 230
  const WIDTH_MENU_CLOSE = 160

  const [username, setUsername] = useState('')
  const [listBranch, setListBranch] = useState([])
  const [user, setUser] = useState({})
  const [appLanguage, setAppLanguage] = useState('VN')
  const login = useSelector((state) => state.login)
  const branchId = useSelector((state) => state.branch.branchId)
  const dataUser = localStorage.getItem('accessToken')
    ? jwt_decode(localStorage.getItem('accessToken'))
    : {}

  const [form] = Form.useForm()
  const [role, setRole] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false)
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(location.pathname === ROUTES.SELL ? true : false) //nếu nhấn vào menu bán hàng thì thu gọn menu
  const [isMobile, setIsMobile] = useState(false)

  const [openKeys, setOpenKeys] = useState([])
  const rootSubmenuKeys = ['store', 'warehouse', 'offer', 'report', 'transport', 'commerce']
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      localStorage.setItem('openKey', latestOpenKey)
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const getInfoUser = async () => {
    try {
      const res = await getUsers({ user_id: dataUser.data.user_id })
      console.log(res)
      if (res.status === 200) {
        if (res.data.data.length) setUser({ ...res.data.data[0] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllBranchData = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) {
        setListBranch(res.data.data)
      }
    } catch (error) {
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
      permissions: [],
      icon: <ShoppingCartOutlined />,
    },
    {
      path: ROUTES.ORDER_LIST,
      title: 'Danh sách đơn hàng',
      permissions: [PERMISSIONS.danh_sach_don_hang],
      icon: <NoteAddIcon />,
    },
    {
      path: ROUTES.CATEGORIES,
      title: 'Quản lý danh mục',
      permissions: [],
      icon: <SlidersOutlined />,
    },
    {
      path: 'store',
      title: 'Cửa hàng',
      permissions: [],
      icon: <FormOutlined />,
      menuItems: [
        {
          icon: <GiftOutlined />,
          path: ROUTES.PRODUCT,
          title: 'Sản phẩm cửa hàng',
          permissions: [],
        },
        // {
        //   icon: <BankOutlined />,
        //   path: ROUTES.INVENTORY,
        //   title: 'Sản phẩm ở kho',
        //   permissions: [PERMISSIONS.quan_li_kho],
        // },
        {
          icon: <RotateLeftOutlined />,
          path: ROUTES.STORE,
          title: 'Quản lý cửa hàng',
          permissions: [],
        },
      ],
    },
    {
      path: 'warehouse',
      title: 'Kho',
      permissions: [],
      icon: <HomeOutlined />,
      menuItems: [
        {
          icon: <GiftOutlined />,
          path: ROUTES.IMPORT_INVENTORIES,
          title: 'Nhập kho',
          permissions: [],
        },
        {
          icon: (
            <svg
              style={{ width: 14, height: 14 }}
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="warehouse"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              class="svg-inline--fa fa-warehouse fa-w-20 fa-3x"
            >
              <path
                fill="currentColor"
                d="M504 208H136c-22.1 0-40 17.9-40 40v248c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-48h352v48c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V248c0-22.1-17.9-40-40-40zm-8 208H144v-64h352v64zm0-96H144v-64h352v64zm101.9-209.9L346.3 5.3c-17-7-35.7-7.1-52.6 0L42.1 110.1C16.5 120.7 0 145.5 0 173.2V496c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V173.2c0-8.3 4.9-15.7 12.5-18.8L312.2 49.6c5.1-2.1 10.6-2.1 15.7 0l251.6 104.8c7.6 3.2 12.5 10.6 12.5 18.8V496c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V173.2c0-27.7-16.5-52.5-42.1-63.1z"
                class=""
              ></path>
            </svg>
          ),
          path: ROUTES.BRANCH_MANAGEMENT,
          title: 'Danh sách kho',
          permissions: [],
        },
        {
          icon: <AreaChartOutlined />,
          path: ROUTES.PRODUCT,
          title: 'Sản phẩm ở kho',
          permissions: [],
        },
        {
          icon: <GoldOutlined />,
          path: ROUTES.SUPPLIER,
          title: 'Nhà cung cấp',
          permissions: [PERMISSIONS.quan_li_nha_cung_cap],
        },
        {
          icon: <RotateLeftOutlined />,
          path: ROUTES.SHIPPING_PRODUCT,
          title: 'Phiếu chuyển hàng',
          permissions: [],
        },
      ],
    },
    // {
    //   path: 'offer',
    //   title: 'Quản lý ưu đãi',
    //   permissions: [],
    //   icon: <ControlOutlined />,
    //   menuItems: [
    //     {
    //       icon: <AlertOutlined />,
    //       path: ROUTES.POINT,
    //       title: 'Tích điểm',
    //       permissions: [PERMISSIONS.tich_diem],
    //     },
    //     {
    //       icon: <TagsOutlined />,
    //       path: ROUTES.PROMOTION,
    //       title: 'Khuyến mãi',
    //       permissions: [PERMISSIONS.khuyen_mai],
    //     },
    //     {
    //       icon: <ControlOutlined />,
    //       path: ROUTES.OFFER_LIST,
    //       title: 'Quản lý ưu đãi',
    //       permissions: [],
    //     },
    //   ],
    // },
    // {
    //   path: 'commerce',
    //   title: 'Thương mại',
    //   permissions: [],
    //   icon: <ControlOutlined />,
    //   menuItems: [
    //     {
    //       path: ROUTES.BLOG,
    //       title: 'Quản lý bài viết',
    //       permissions: [],
    //       icon: <FileDoneOutlined />,
    //     },
    //     {
    //       path: ROUTES.BRAND,
    //       title: 'Quản lý thương hiệu',
    //       permissions: [],
    //       icon: <SketchOutlined />,
    //     },
    //     {
    //       path: ROUTES.CHANNEL,
    //       title: 'Quản lý kênh',
    //       permissions: [],
    //       icon: <ForkOutlined />,
    //     },
    //   ],
    // },

    // {
    //   path: ROUTES.CONTACT,
    //   title: 'Liên hệ',
    //   permissions: [],
    //   icon: <ContactsOutlined />,
    // },
    {
      path: ROUTES.CUSTOMER,
      title: 'Quản lý khách hàng',
      permissions: [PERMISSIONS.quan_li_khach_hang],
      icon: <UserAddOutlined />,
    },
    {
      path: 'report',
      title: 'Báo cáo',
      permissions: [],
      icon: <BarChartOutlined />,
      menuItems: [
        {
          icon: <GraphicEqIcon />,
          path: ROUTES.RECEIPTS_PAYMENT,
          title: 'Báo cáo thu chi',
          permissions: [],
        },
        {
          icon: (
            <svg
              style={{ width: 14, height: 14 }}
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="dolly-flatbed-alt"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              class="svg-inline--fa fa-dolly-flatbed-alt fa-w-20 fa-3x"
            >
              <path
                fill="currentColor"
                d="M208 352h384c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16h-48V80c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16v256c0 8.8 7.2 16 16 16zM416 96h96v96h-96V96zm0 128h160v96H416v-96zM224 96h160v224H224V96zm408 320H128V8c0-4.4-3.6-8-8-8H8C3.6 0 0 3.6 0 8v16c0 4.4 3.6 8 8 8h88v408c0 4.4 3.6 8 8 8h58.9c-1.8 5-2.9 10.4-2.9 16 0 26.5 21.5 48 48 48s48-21.5 48-48c0-5.6-1.2-11-2.9-16H451c-1.8 5-2.9 10.4-2.9 16 0 26.5 21.5 48 48 48s48-21.5 48-48c0-5.6-1.2-11-2.9-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-424 64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm288 0c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z"
                class=""
              ></path>
            </svg>
          ),
          path: ROUTES.REPORT_INVENTORY,
          title: 'Báo cáo tồn kho',
          permissions: [],
        },
        {
          icon: (
            <svg
              style={{ width: 14, height: 14 }}
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="sack-dollar"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-sack-dollar fa-w-16 fa-3x"
            >
              <path
                fill="currentColor"
                d="M334.89 121.63l43.72-71.89C392.77 28.47 377.53 0 352 0H160.15c-25.56 0-40.8 28.5-26.61 49.76l43.57 71.88C-9.27 240.59.08 392.36.08 412c0 55.23 49.11 100 109.68 100h292.5c60.58 0 109.68-44.77 109.68-100 0-19.28 8.28-172-177.05-290.37zM160.15 32H352l-49.13 80h-93.73zM480 412c0 37.49-34.85 68-77.69 68H109.76c-42.84 0-77.69-30.51-77.69-68v-3.36c-.93-59.86 20-173 168.91-264.64h110.1C459.64 235.46 480.76 348.94 480 409zM285.61 310.74l-49-14.54c-5.66-1.62-9.57-7.22-9.57-13.68 0-7.86 5.76-14.21 12.84-14.21h30.57a26.78 26.78 0 0 1 13.93 4 8.92 8.92 0 0 0 11-.75l12.73-12.17a8.54 8.54 0 0 0-.65-13 63.12 63.12 0 0 0-34.17-12.17v-17.6a8.68 8.68 0 0 0-8.7-8.62H247.2a8.69 8.69 0 0 0-8.71 8.62v17.44c-25.79.75-46.46 22.19-46.46 48.57 0 21.54 14.14 40.71 34.38 46.74l49 14.54c5.66 1.61 9.58 7.21 9.58 13.67 0 7.87-5.77 14.22-12.84 14.22h-30.61a26.72 26.72 0 0 1-13.93-4 8.92 8.92 0 0 0-11 .76l-12.84 12.06a8.55 8.55 0 0 0 .65 13 63.2 63.2 0 0 0 34.17 12.17v17.55a8.69 8.69 0 0 0 8.71 8.62h17.41a8.69 8.69 0 0 0 8.7-8.62V406c25.68-.64 46.46-22.18 46.57-48.56.02-21.5-14.13-40.67-34.37-46.7z"
                class=""
              ></path>
            </svg>
          ),
          path: ROUTES.SALES_REPORT,
          title: 'Báo cáo bán hàng',
          permissions: [],
        },
      ],
    },
    {
      path: 'transport',
      title: 'Vận chuyển',
      permissions: [PERMISSIONS.van_chuyen],
      icon: <TransactionOutlined />,
      menuItems: [
        {
          icon: <ClusterOutlined />,
          path: ROUTES.SHIPPING_CONTROL,
          title: 'Đối soát',
          permissions: [PERMISSIONS.doi_soat_van_chuyen],
        },
        {
          icon: <CarOutlined />,
          path: ROUTES.SHIPPING,
          title: 'Đối tác',
          permissions: [PERMISSIONS.quan_li_doi_tac_van_chuyen],
        },
      ],
    },

    {
      path: ROUTES.CONFIGURATION_STORE,
      title: 'Cấu hình',
      permissions: [PERMISSIONS.cau_hinh_thong_tin],
      icon: <ControlOutlined />,
    },
    {
      path: ROUTES.SETTING,
      title: 'Cài đặt',
      permissions: [],
      icon: <SettingOutlined />,
    },
    {
      path: ROUTES.ROLE,
      title: 'Phân quyền',
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
                      backgroundColor: location.pathname === e.path && '#e7e9fb',
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

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Chỉnh sửa thông tin cá nhân thành công',
    })
  }
  const apiAllRoleData = async () => {
    try {
      const res = await getRoles()
      if (res.status === 200) {
        setRole(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const onSignOut = () => {
    dispatch({ type: ACTION.LOGOUT })
    dispatch({ type: 'UPDATE_INVOICE', data: [] })
  }

  useEffect(() => {
    if (localStorage.getItem('openKey')) setOpenKeys([localStorage.getItem('openKey')])

    const username = localStorage.getItem('username')
    setUsername(username)
  }, [])
  const content = (
    <div className={styles['user_information']}>
      <div onClick={() => modal1VisibleModal(true)}>
        <div style={{ color: '#565656', paddingLeft: 10 }}>
          <UserOutlined style={{ fontSize: '1rem', marginRight: 10, color: ' #565656' }} />
          Tài khoản của tôi
        </div>
      </div>
      <Link
        to={ROUTES.LOGIN}
        onClick={onSignOut}
        className={styles['user_information_link']}
        style={{ color: '#565656', fontWeight: '600', paddingLeft: 10 }}
      >
        <div>
          <ExportOutlined style={{ fontSize: '1rem', marginRight: 10, color: '#565656' }} />
          Đăng xuất
        </div>
      </Link>
    </div>
  )
  const NotifyContent = (props) => (
    <div className={styles['notificationBox']}>
      <div className={styles['title']}>Thông báo</div>
      <div className={styles['content']}>
        <Empty />
      </div>
    </div>
  )

  const LanguageDropdown = () => (
    <Menu>
      <Menu.Item
        icon={
          <img
            alt=""
            src="https://admin-order.s3.ap-northeast-1.wasabisys.com/2021/12/08/88294930-deff-4371-866d-ca2e882f24f8/1f1fb-1f1f3.png"
            width="30"
          />
        }
        onClick={() => setAppLanguage('VN')}
      >
        Tiếng việt
      </Menu.Item>
      <Menu.Item
        icon={
          <img
            alt=""
            src="https://admin-order.s3.ap-northeast-1.wasabisys.com/2021/12/08/14065773-9bee-46ea-8ee5-26e87cdb01b8/1f1ec-1f1e7.png"
            width="30"
          />
        }
        onClick={() => setAppLanguage('EN')}
      >
        Tiếng anh
      </Menu.Item>
    </Menu>
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
      data.address = user.address
    } else {
      data.firstName = login.objectUsername.first_name
      data.lastName = login.objectUsername.last_name
      data.phoneNumber = login.objectUsername.phone
      data.email = login.objectUsername.email
      data.workPlace = login.objectUsername.company_name
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

  const [list, setList] = useState('')
  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    maxCount: 1,
    async onChange(info) {
      var { status } = info.file
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          const imgLink = await uploadFile(info.file.originFileObj)
          dispatch({ type: ACTION.LOADING, data: false })

          setList(imgLink)
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

  const changeBranch = async (value) => {
    dispatch({ type: 'SET_BRANCH_ID', data: value })
    updateUser({ branch_id: value }, user.user_id)
  }

  useEffect(() => {
    getInfoUser()
    apiAllRoleData()
    getAllBranchData()
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
      <BackTop style={{ right: 10, bottom: 15 }} />
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        centered
        footer={null}
        visible={modal1Visible}
        onOk={() => modal1VisibleModal(false)}
        onCancel={() => modal1VisibleModal(false)}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
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
                    <p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">
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
                    <p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">
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
                    <p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">
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
              <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Giá trị rỗng!' }]}>
                <Input placeholder="Nhập liên hệ" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Email</div>
              <Form.Item name="email" rules={[{ required: true, message: 'Giá trị rỗng!' }]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </div>
            <div className={styles['information_user_modal']}>
              <div>Tên công ty</div>
              <Form.Item name="workPlace" rules={[{ required: true, message: 'Giá trị rỗng!' }]}>
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
              <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Sider
        trigger={null}
        collapsible
        width={isMobile ? '100%' : WIDTH_MENU_OPEN}
        collapsedWidth={isMobile ? 0 : WIDTH_MENU_CLOSE}
        style={{
          backgroundColor: 'white',
          zIndex: isMobile && 6000,
          height: '100vh',
          position: 'fixed',
        }}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            display: collapsed ? 'none' : 'flex',
            maxHeight: 108,
          }}
        >
          <img
            src="https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/09/02/95131dfc-bf13-4c49-82f3-6c7c43a7354d_logo_quantribanhang 1.png"
            style={{ width: '6rem', objectFit: 'contain', marginTop: 12 }}
            alt=""
          />
          <Row
            justify="center"
            style={{ color: 'black', fontSize: '1rem', fontWeight: '600', margin: '7px 0px' }}
          >
            {(user && user.company_name) || dataUser.data.company_name}
          </Row>
        </div>
        <Menu
          style={{
            height: `calc(100vh - ${collapsed ? 4 : 108}px)`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          theme="light"
          onClick={(e) => {
            if (e.keyPath && e.keyPath.length === 1) localStorage.removeItem('openKey')
          }}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={routeMatch.path}
          mode="inline"
        >
          {MENUS.map(renderMenuItem)}
          <Menu.Item
            style={{
              display: dataUser && dataUser.data.role_id !== 1 && 'none',
              fontSize: '0.8rem',
            }}
            key={ROUTES.CLIENT_MANAGEMENT}
            icon={<ApartmentOutlined />}
          >
            <Link to={ROUTES.CLIENT_MANAGEMENT}>Quản lý client</Link>
          </Menu.Item>
          <Menu.Item onClick={onSignOut} key="9" icon={!collapsed && <LogoutOutlined />}>
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
      <Layout style={{ marginLeft: collapsed ? WIDTH_MENU_CLOSE : WIDTH_MENU_OPEN }}>
        <Affix offsetTop={0}>
          <Row className={styles['background_right_top']}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row wrap={isMobile} justify="space-between" className={styles['navbar']}>
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
                    <MenuOutlined onClick={toggle} className={styles['header_navbar_left_icon']} />
                  </div>
                  <Permission permissions={[PERMISSIONS.them_cua_hang]}>
                    <Link
                      to={{
                        pathname: ROUTES.BRANCH,
                        state: 'show-modal-create-branch',
                      }}
                      style={{ marginRight: '1rem', cursor: 'pointer' }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          backgroundColor: '#FFAB2D',
                          borderColor: '#FFAB2D',
                          fontSize: 18,
                          marginLeft: 10,
                          display: login.role === 'EMPLOYEE' && 'none',
                        }}
                      >
                        <Plus />
                      </Button>
                    </Link>
                  </Permission>
                  <Select
                    disabled={login.role === 'EMPLOYEE' ? true : false}
                    placeholder="Chọn chi nhánh"
                    style={{ width: isMobile ? '90%' : 250 }}
                    size="large"
                    onChange={changeBranch}
                    value={branchId || user.branch_id}
                  >
                    {listBranch.map((e, index) => (
                      <Option value={e.branch_id} key={index}>
                        {e.name}
                      </Option>
                    ))}
                  </Select>
                </Row>
                <div className={styles['navbar_right']}>
                  <div className={styles['navbar_notification']}>
                    <Dropdown
                      overlay={<LanguageDropdown />}
                      placement="bottomCenter"
                      trigger="click"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div>
                          {appLanguage == 'VN' ? (
                            <img
                              src="https://admin-order.s3.ap-northeast-1.wasabisys.com/2021/12/08/88294930-deff-4371-866d-ca2e882f24f8/1f1fb-1f1f3.png"
                              width="30"
                            />
                          ) : (
                            <img
                              src="https://admin-order.s3.ap-northeast-1.wasabisys.com/2021/12/08/14065773-9bee-46ea-8ee5-26e87cdb01b8/1f1ec-1f1e7.png"
                              width="30"
                            />
                          )}
                        </div>
                        <div style={{ color: '#fff', width: 90 }}>
                          {appLanguage == 'VN' ? 'Tiếng Việt' : 'Tiếng Anh'} <CarretDown />
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                  <div className={styles['navbar_notification']}>
                    <Dropdown overlay={<NotifyContent />} placement="bottomCenter" trigger="click">
                      <Badge count={0} showZero size="small" offset={[-3, 3]}>
                        <Bell style={{ color: 'rgb(253, 170, 62)' }} />
                      </Badge>
                    </Dropdown>
                  </div>
                  <Dropdown overlay={content} trigger="click">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ padding: '0 0.75rem 0 0.5rem' }}>
                        {(user && user.avatar === ' ') || !user.avatar ? (
                          <Avatar
                            style={{
                              color: '#FFF',
                              backgroundColor: '#FDAA3E',
                            }}
                          >
                            {username ? (
                              <span style={{ textTransform: 'capitalize' }}>{username[0]}</span>
                            ) : (
                              <span style={{ textTransform: 'capitalize' }}>
                                {login.username[0]}
                              </span>
                            )}
                          </Avatar>
                        ) : (
                          <Avatar src={user.avatar} />
                        )}
                      </div>
                      <div className={styles['navbar_right_left_name']}>
                        <div
                          style={{
                            color: '#FFF',
                            fontWeight: '600',
                            fontSize: '1rem',
                          }}
                        >
                          {username ? (
                            <span style={{ textTransform: 'capitalize' }}>{username}</span>
                          ) : (
                            <span style={{ textTransform: 'capitalize' }}>{login.username}</span>
                          )}{' '}
                          &nbsp; <CarretDown />
                        </div>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </Row>
            </Col>
          </Row>
        </Affix>
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

export default BaseLayout
