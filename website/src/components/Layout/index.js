import React, { useState, useEffect } from 'react'
import styles from './layout.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { ACTION, ROUTES, PERMISSIONS, LOGO_DEFAULT } from 'consts'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { Bell, Plus } from 'utils/icon'
import jwt_decode from 'jwt-decode'

import {
  Layout,
  Menu,
  Select,
  Button,
  Dropdown,
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
  MenuFoldOutlined,
  LogoutOutlined,
  GiftOutlined,
  CarOutlined,
  UserAddOutlined,
  RotateLeftOutlined,
  SettingOutlined,
  ControlOutlined,
  UserOutlined,
  ExportOutlined,
  SlidersOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  ShopOutlined,
  LineChartOutlined,
  CalendarOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'

//components
import Permission from 'components/permission'
import ModalUpdateUser from './modal-user'
import DropdownLanguage from 'components/dropdown-language'

//apis
import { updateEmployee, getEmployees } from 'apis/employee'
import { getAllBranch } from 'apis/branch'

const { Sider } = Layout
const BaseLayout = (props) => {
  const location = useLocation()
  const routeMatch = useRouteMatch()
  const dispatch = useDispatch()
  const WIDTH_MENU_OPEN = 195
  const WIDTH_MENU_CLOSE = 60
  const HEIGHT_HEADER = 56

  const [branches, setBranches] = useState([])
  const [user, setUser] = useState({})
  const login = useSelector((state) => state.login)
  const branchIdApp = useSelector((state) => state.branch.branchId)
  const triggerReloadBranch = useSelector((state) => state.branch.trigger)
  const setting = useSelector((state) => state.setting)

  const dataUser = localStorage.getItem('accessToken')
    ? jwt_decode(localStorage.getItem('accessToken'))
    : {}

  const isCollapsed = localStorage.getItem('collapsed')
    ? JSON.parse(localStorage.getItem('collapsed'))
    : false
  const [collapsed, setCollapsed] = useState(isCollapsed)
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
      const res = await getEmployees({ user_id: dataUser.data.user_id })
      if (res.status === 200) {
        if (res.data.data.length) setUser({ ...res.data.data[0] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _getBranches = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  var toggle = () => {
    localStorage.setItem('collapsed', JSON.stringify(!collapsed))
    setCollapsed(!collapsed)
  }

  const MENUS = [
    {
      pathsChild: [],
      path: ROUTES.OVERVIEW,
      title: 'Tổng quan',
      permissions: [PERMISSIONS.tong_quan],
      icon: <MenuFoldOutlined />,
    },
    {
      pathsChild: [],
      path: ROUTES.SELL,
      title: 'Bán hàng',
      permissions: [],
      icon: <ShoppingCartOutlined />,
    },
    {
      pathsChild: [ROUTES.ORDER_CREATE],
      path: ROUTES.ORDER_LIST,
      title: 'Đơn hàng',
      permissions: [PERMISSIONS.danh_sach_don_hang],
      icon: <ShoppingOutlined />,
    },
    {
      pathsChild: [ROUTES.PRODUCT_ADD, ROUTES.PRODUCT_UPDATE],
      icon: <CalendarOutlined />,
      path: ROUTES.PRODUCT,
      title: 'Sản phẩm',
      permissions: [],
    },
    {
      pathsChild: [ROUTES.CATEGORY],
      path: ROUTES.CATEGORIES,
      title: 'Nhóm sản phẩm',
      permissions: [],
      icon: <SlidersOutlined />,
    },
    {
      pathsChild: [],
      icon: <ShopOutlined />,
      path: ROUTES.BRANCH_MANAGEMENT,
      title: 'Chi nhánh',
      permissions: [],
    },
    {
      icon: <GiftOutlined />,
      path: ROUTES.IMPORT_INVENTORIES,
      title: 'Nhập hàng',
      permissions: [],
      pathsChild: [ROUTES.IMPORT_INVENTORY],
    },
    {
      icon: <FileSearchOutlined />,
      path: ROUTES.STOCK_ADJUSTMENTS,
      title: 'Kiểm hàng',
      permissions: [],
      pathsChild: [ROUTES.STOCK_ADJUSTMENTS_CREATE],
    },
    {
      pathsChild: [],
      icon: <GoldOutlined />,
      path: ROUTES.SUPPLIER,
      title: 'Nhà cung cấp',
      permissions: [PERMISSIONS.quan_li_nha_cung_cap],
    },
    // {
    //   icon: <CodeSandboxOutlined />,
    //   path: ROUTES.STOCK_ADJUSTMENTS,
    //   title: 'Kiểm hàng',
    //   permissions: [],
    //   pathsChild: [],
    // },
    {
      icon: <RotateLeftOutlined />,
      path: ROUTES.SHIPPING_PRODUCT,
      title: 'Phiếu chuyển hàng',
      permissions: [],
      pathsChild: [ROUTES.SHIPPING_PRODUCT_ADD],
    },
    // {
    //   path: 'offer',
    //   title: 'Quản lý ưu đãi',
    //   permissions: [],
    //   icon: <ControlOutlined />,
    //   pathsChild: [],
    //   menuItems: [
    // {
    //   icon: <TagsOutlined />,
    //   path: ROUTES.PROMOTION,
    //   title: 'Khuyến mãi',
    //   permissions: [PERMISSIONS.khuyen_mai],
    // },
    // {
    //   icon: <ControlOutlined />,
    //   path: ROUTES.OFFER_LIST,
    //   title: 'Quản lý ưu đãi',
    //   permissions: [],
    // },
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
    // pathsChild: [],
    //   icon: <ContactsOutlined />,
    // },
    {
      pathsChild: [],
      path: ROUTES.CUSTOMER,
      title: 'Khách hàng',
      permissions: [PERMISSIONS.quan_li_khach_hang],
      icon: <UserAddOutlined />,
    },
    {
      pathsChild: [
        ROUTES.RECEIPTS_PAYMENT,
        ROUTES.REPORT_INVENTORY,
        ROUTES.REPORT_VARIANT,
        ROUTES.SALES_REPORT,
        ROUTES.SALES_REPORT,
        ROUTES.REPORT_IMPORT_EXPORT_INVENTORY_PRODUCT,
        ROUTES.REPORT_IMPORT_EXPORT_INVENTORY_VARIANT,
      ],
      path: ROUTES.REPORTS,
      title: 'Tổng hợp báo cáo',
      permissions: [],
      icon: <LineChartOutlined />,
    },
    {
      path: ROUTES.SHIPPING,
      title: 'Đối tác vận chuyển',
      permissions: [PERMISSIONS.quan_li_doi_tac_van_chuyen],
      icon: <CarOutlined />,
      pathsChild: [],
    },
    {
      pathsChild: [
        ROUTES.EMPLOYEE,
        ROUTES.GUARANTEE,
        ROUTES.TAX,
        ROUTES.PAYMENT,
        ROUTES.ACTIVITY_DIARY,
        ROUTES.SHIPPING_CONTROL,
        ROUTES.POINT,
      ],
      path: ROUTES.CONFIGURATION_STORE,
      title: 'Cấu hình',
      permissions: [PERMISSIONS.cau_hinh_thong_tin],
      icon: <ControlOutlined />,
    },
    {
      pathsChild: [],
      path: ROUTES.SETTING,
      title: 'Cài đặt',
      permissions: [],
      icon: <SettingOutlined />,
    },
  ]

  const renderMenuItem = (_menu) => (
    <Permission permissions={_menu.permissions} key={_menu.path}>
      {_menu.menuItems ? (
        <Menu.SubMenu key={_menu.path} title={_menu.title} icon={_menu.icon}>
          {_menu.menuItems.map((e) => (
            <Permission permissions={e.permissions}>
              <Menu.Item
                key={e.path}
                style={{
                  fontSize: '0.8rem',
                  backgroundColor:
                    (location.pathname === e.path || e.pathsChild.includes(location.pathname)) &&
                    '#e7e9fb',
                }}
              >
                <Link to={e.path}>{e.title}</Link>
              </Menu.Item>
            </Permission>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={_menu.path}
          style={{
            fontSize: '0.8rem',
            backgroundColor:
              (location.pathname === _menu.path || _menu.pathsChild.includes(location.pathname)) &&
              '#e7e9fb',
          }}
          icon={_menu.icon}
        >
          <Link to={_menu.path}>{_menu.title}</Link>
        </Menu.Item>
      )}
    </Permission>
  )

  const onSignOut = () => {
    dispatch({ type: ACTION.LOGOUT })
    dispatch({ type: 'UPDATE_INVOICE', data: [] })
  }

  useEffect(() => {
    if (localStorage.getItem('openKey')) setOpenKeys([localStorage.getItem('openKey')])
  }, [])

  const content = (
    <div className={styles['user_information']}>
      <ModalUpdateUser user={dataUser && dataUser.data}>
        <div>
          <div style={{ color: '#565656', paddingLeft: 10 }}>
            <UserOutlined style={{ fontSize: '1rem', marginRight: 10, color: ' #565656' }} />
            Tài khoản của tôi
          </div>
        </div>
      </ModalUpdateUser>

      <div>
        <Link to={ROUTES.LOGIN} onClick={onSignOut} style={{ color: '#565656', paddingLeft: 10 }}>
          <div>
            <ExportOutlined style={{ fontSize: '1rem', marginRight: 10, color: '#565656' }} />
            Đăng xuất
          </div>
        </Link>
      </div>
    </div>
  )
  const NotifyContent = () => (
    <div className={styles['notificationBox']}>
      <div className={styles['title']}>Thông báo</div>
      <div className={styles['content']}>
        <Empty />
      </div>
    </div>
  )

  useEffect(() => {
    _getBranches()
  }, [triggerReloadBranch])

  useEffect(() => {
    getInfoUser()
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
      >
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            display: collapsed ? 'none' : 'flex',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <img
            src={setting && setting.company_logo ? setting.company_logo : LOGO_DEFAULT}
            style={{ width: '6rem', objectFit: 'contain' }}
            alt=""
          />
        </div>
        <Menu
          style={{
            height: `calc(100vh - ${collapsed ? 4 : 96}px)`,
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
          {/* <Menu.Item
            style={{
              display: dataUser && dataUser.data.role_id !== 1 && 'none',
              fontSize: '0.8rem',
            }}
            key={ROUTES.CLIENT_MANAGEMENT}
            icon={<ApartmentOutlined />}
          >
            <Link to={ROUTES.CLIENT_MANAGEMENT}>Quản lý client</Link>
          </Menu.Item> */}
          <Menu.Item key={ROUTES.LOGIN} onClick={onSignOut} icon={<LogoutOutlined />}>
            <Link to={ROUTES.LOGIN}>Đăng xuất</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? WIDTH_MENU_CLOSE : WIDTH_MENU_OPEN }}>
        <Affix offsetTop={0}>
          <Row
            wrap={isMobile}
            justify="space-between"
            align="middle"
            style={{ backgroundColor: '#5b6be8' }}
          >
            <Row
              align="middle"
              wrap={false}
              style={{
                width: '100%',
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 12,
                paddingBottom: 12,
              }}
              justify={isMobile && 'space-between'}
            >
              <MenuOutlined
                onClick={toggle}
                style={{ fontSize: 20, marginRight: 18, color: 'white' }}
              />
              <Permission permissions={[PERMISSIONS.them_cua_hang]}>
                <Link
                  to={{ pathname: ROUTES.BRANCH, state: 'show-modal-create-branch' }}
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
              <Row align="middle">
                <div style={{ color: 'white', marginRight: 8 }}>Chi nhánh:</div>
                <Select
                  disabled={dataUser && dataUser.data.role_id === 1 ? false : true}
                  placeholder="Chi nhánh"
                  style={{ width: isMobile ? '90%' : 250 }}
                  onChange={(value) => dispatch({ type: 'SET_BRANCH_ID', data: value })}
                  value={branchIdApp}
                >
                  {branches.map((e, index) => (
                    <Select.Option value={e.branch_id} key={index}>
                      {e.name}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
            </Row>
            <Row wrap={false} align="middle" style={{ marginRight: 10 }}>
              <DropdownLanguage />
              <div style={{ marginTop: 8, marginRight: 15 }}>
                <Dropdown overlay={<NotifyContent />} placement="bottomCenter" trigger="click">
                  <Badge count={0} showZero size="small" offset={[-3, 3]}>
                    <Bell style={{ color: 'rgb(253, 170, 62)', cursor: 'pointer' }} />
                  </Badge>
                </Dropdown>
              </div>
              <Dropdown overlay={content} trigger="click">
                <Row align="middle" wrap={false} style={{ cursor: 'pointer' }}>
                  <Avatar
                    src={dataUser && (dataUser.data.avatar || '')}
                    style={{ color: '#FFF', backgroundColor: '#FDAA3E', width: 35, height: 35 }}
                  />
                  <span
                    style={{
                      textTransform: 'capitalize',
                      marginLeft: 5,
                      color: 'white',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dataUser &&
                      (dataUser.data.first_name || '') + ' ' + (dataUser.data.last_name || '')}
                  </span>
                </Row>
              </Dropdown>
            </Row>
          </Row>
        </Affix>
        <div
          style={{
            backgroundColor: '#f0f2f5',
            width: '100%',
            minHeight: `calc(100vh - ${HEIGHT_HEADER}px)`,
          }}
        >
          {props.children}
        </div>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
