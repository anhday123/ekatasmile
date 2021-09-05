import styles from './../role/role.module.scss'
import React, { useState, useEffect } from 'react'
import { ACTION, PERMISSIONS } from './../../consts/index'
import { useDispatch, useSelector } from 'react-redux'

import {
  Col,
  Row,
  Collapse,
  notification,
  Checkbox,
  Drawer,
  Tabs,
  Button,
  Switch,
  Input,
  Tree,
} from 'antd'

import {
  apiAddRole,
  apiAllMenu,
  apiAllRole,
  apiAllRolePermission,
  apiUpdateRole,
  apiUpdateRolePermission,
} from '../../apis/role'

import Permission from 'components/permission'

const { Panel } = Collapse
export default function Role() {
  const { TabPane } = Tabs
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)
  const [visible, setVisible] = useState(false)
  const [permission, setPermission] = useState([])

  const PERMISSIONS_APP = [
    {
      pParent: 'tong_quan',
    },
    {
      pParent: 'ban_hang',
    },
    {
      pParent: 'danh_sach_don_hang',
      pChildren: ['tao_don_hang'],
    },
    {
      pParent: 'business_management',
    },
    {
      pParent: 'san_pham',
    },
    {
      pParent: 'quan_li_san_pham',
      pChildren: [
        'nhom_san_pham',
        'them_san_pham',
        'tao_nhom_san_pham',
        'xoa_nhom_san_pham',
        'cap_nhat_nhom_san_pham',
      ],
    },
    {
      pParent: 'quan_li_kho',
      pChildren: ['them_kho', 'cap_nhat_kho'],
    },
    {
      pParent: 'quan_li_chuyen_hang',
      pChildren: [
        'tao_phieu_chuyen_hang',
        'cap_nhat_trang_thai_phieu_chuyen_hang',
      ],
    },
    {
      pParent: 'quan_li_nha_cung_cap',
      pChildren: ['them_nha_cung_cap', 'cap_nhat_nha_cung_cap'],
    },
    {
      pParent: 'quan_li_bao_hanh',
      pChildren: ['them_phieu_bao_hanh'],
    },
    {
      pParent: 'khuyen_mai',
      pChildren: ['them_khuyen_mai'],
    },
    {
      pParent: 'kiem_hang_cuoi_ngay',
      pChildren: ['them_phieu_kiem_hang'],
    },
    {
      pParent: 'quan_li_khach_hang',
      pChildren: ['them_khach_hang', 'cap_nhat_khach_hang'],
    },
    {
      pParent: 'bao_cao_don_hang',
    },
    {
      pParent: 'bao_cao_cuoi_ngay',
    },
    {
      pParent: 'bao_cao_nhap_hang',
    },
    {
      pParent: 'bao_cao_ton_kho',
    },
    {
      pParent: 'bao_cao_tai_chinh',
    },
    {
      pParent: 'van_chuyen',
    },
    {
      pParent: 'doi_soat_van_chuyen',
      pChildren: ['them_phieu_doi_soat_van_chuyen'],
    },
    {
      pParent: 'quan_li_doi_tac_van_chuyen',
      pChildren: [
        'them_doi_tac_van_chuyen',
        'cap_nhat_doi_tac_van_chuyen',
        'xoa_doi_tac_van_chuyen',
      ],
    },
    {
      pParent: 'cau_hinh_thong_tin',
      pChildren: [
        { parent: 'quan_li_nguoi_dung', children: ['them_nguoi_dung'] },
        {
          parent: 'quan_li_nhan_su',
          children: ['them_nhan_su', 'cap_nhat_nhan_su'],
        },
        { parent: 'quan_li_thue', children: ['them_thue'] },
        {
          parent: 'quan_li_thanh_toan',
          children: ['them_hinh_thuc_thanh_toan'],
        },
        { parent: 'nhap_xuat_file' },
        { parent: 'nhat_ki_hoat_dong' },
      ],
    },
    {
      pParent: 'quan_li_phan_quyen',
      pChildren: ['tao_quyen'],
    },
  ]

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const [key, setKey] = useState('')
  function callback(key) {
    setKey(key)
  }

  const openNotificationUpdateRole = () => {
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật quyền thành công',
    })
  }
  const apiUpdateRolePermissionData = async (body) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      console.log(body)
      const res = await apiUpdateRolePermission(body, key)
      console.log(res)
      if (res.status === 200) {
        await apiAllRolePermissionData()
        openNotificationUpdateRole()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const addPermission = (permissionAdd, typePermission) => {
    const role = rolePermission.find((e) => e.role_id === key)
    if (role) {
      let body = { active: true }
      if (typePermission === 'permission_list') {
        console.log(permissionAdd)
        role.permission_list.push(permissionAdd)
        body.permission_list = role.permission_list
      }
      if (typePermission === 'menu_list') {
        role.menu_list.push(permissionAdd)
        body.menu_list = role.menu_list
      }

      apiUpdateRolePermissionData(body)
    }
  }

  const removePermission = (permissionAdd, typePermission) => {
    const role = rolePermission.find((e) => e.role_id === key)
    if (role) {
      let body = { active: true }
      if (typePermission === 'permission_list') {
        const itemIndex = role.permission_list.findIndex(
          (e) => e === permissionAdd
        )
        if (itemIndex !== -1) role.permission_list.splice(itemIndex, 1)

        body.permission_list = role.permission_list
      }
      if (typePermission === 'menu_list') {
        const itemIndex = role.menu_list.findIndex((e) => e === permissionAdd)
        if (itemIndex !== -1) role.menu_list.splice(itemIndex, 1)
        body.menu_list = role.menu_list
      }

      apiUpdateRolePermissionData(body)
    }
  }

  const [permissionAdd, setPermissionAdd] = useState([])
  function onChangeChildMenuDrawerPermission(checkedValues) {
    setPermissionAdd(checkedValues)
  }
  const [menuAdd, setMenuAdd] = useState([])
  function onChangeChildMenuDrawerMenu(checkedValues) {
    setMenuAdd(checkedValues)
  }

  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllRole()
      if (res.status === 200) {
        setPermission(res.data.data.permission_list)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const [menu, setMenu] = useState([])
  const apiAllMenuData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllMenu()
      if (res.status === 200) {
        setMenu(res.data.data.menu_list)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const [rolePermission, setRolePermission] = useState([])
  const apiAllRolePermissionData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllRolePermission()
      console.log('role', res)
      if (res.status === 200) {
        setRolePermission([...res.data.data])
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const openNotificationAddRole = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm vai trò mới thành công',
    })
  }
  const openNotificationAddRoleErrorMain = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên vai trò đã tồn tại',
    })
  }
  const openNotificationAddRoleDelete = (e) => {
    notification.success({
      message: 'Thành công',
      description: e
        ? `Kích hoạt vai trò thành công`
        : 'Vô hiệu hóa vai trò thành công',
    })
  }
  const [name, setName] = useState('')
  const apiUpdateRoleData = async (object, id, e) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiUpdateRole(object, id)
      if (res.status === 200) {
        await apiAllRoleData()
        await apiAllRolePermissionData()
        openNotificationAddRoleDelete(e)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const apiAddRoleData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAddRole(object)
      console.log(res)
      if (res.status === 200) {
        await apiAllRolePermissionData()
        onClose()
        openNotificationAddRole()

        setName('')
      } else {
        openNotificationAddRoleErrorMain()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const onChangeName = (e) => {
    setName(e.target.value)
  }
  const openNotificationAddRoleError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa nhập tên vai trò',
    })
  }
  const onClickAddRole = () => {
    if (name) {
      const object = {
        name: name.toLowerCase(),
        permission_list: permissionAdd,
        menu_list: menuAdd,
      }
      apiAddRoleData(object)
    } else {
      openNotificationAddRoleError()
    }
  }

  const onClickDeleteDisable = (e, id, index) => {
    const object = {
      active: e ? e : false,
      permission_list: [...rolePermission[index].permission_list],
      menu_list: [...rolePermission[index].menu_list],
    }
    apiUpdateRoleData(object, id, e)
  }

  useEffect(() => {
    apiAllMenuData()
    apiAllRoleData()
    apiAllRolePermissionData()
  }, [])

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '1rem',
          margin: '1rem',
          backgroundColor: 'white',
        }}
        className={styles['card']}
      >
        <Row
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(230, 220, 220)',
            paddingBottom: '1rem',
            marginBottom: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                fontSize: '1rem',
                width: '100%',
              }}
            >
              Quản lý phân quyền
            </div>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={11}
            md={11}
            lg={11}
            xl={11}
          >
            <Permission permissions={[PERMISSIONS.tao_quyen]}>
              <div
                onClick={showDrawer}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Button type="primary" size="large">
                  Tạo quyền
                </Button>
              </div>
            </Permission>
          </Col>
        </Row>
        <div style={{ width: '100%' }}>
          <Collapse accordion onChange={callback} expandIconPosition="left">
            {rolePermission.map((values, index) => {
              if (
                values.name === 'ADMIN' ||
                (values.name === 'BUSINESS' &&
                  dataUser.data._role.name === 'BUSINESS')
              )
                return ''

              return (
                <Panel
                  extra={
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch
                        defaultChecked={values.active}
                        onChange={(e) =>
                          onClickDeleteDisable(e, values.role_id, index)
                        }
                      />
                    </div>
                  }
                  header={`Permission ${values.name}`}
                  key={values.role_id}
                >
                  <Tree
                    showIcon={false}
                    defaultExpandAll={true}
                    defaultExpandParent={true}
                    treeData={PERMISSIONS_APP.map((p) => {
                      return {
                        title: (
                          <Checkbox
                            defaultChecked={[
                              ...values.permission_list,
                              ...values.menu_list,
                            ].includes(p.pParent)}
                            onClick={(e) => {
                              if (e.target.checked)
                                addPermission(p.pParent, 'menu_list')
                              else removePermission(p.pParent, 'menu_list')
                              e.stopPropagation()
                            }}
                          >
                            {p.pParent}
                          </Checkbox>
                        ),
                        key: p.pParent,
                        children:
                          p.pChildren &&
                          p.pChildren.map((c) => {
                            if (typeof c === 'string')
                              return {
                                title: (
                                  <Checkbox
                                    defaultChecked={[
                                      ...values.permission_list,
                                      ...values.menu_list,
                                    ].includes(c)}
                                    onClick={(e) => {
                                      if (e.target.checked)
                                        addPermission(c, 'permission_list')
                                      else
                                        removePermission(c, 'permission_list')
                                      e.stopPropagation()
                                    }}
                                  >
                                    {c}
                                  </Checkbox>
                                ),
                                key: c,
                              }

                            return {
                              title: (
                                <Checkbox
                                  defaultChecked={[
                                    ...values.permission_list,
                                    ...values.menu_list,
                                  ].includes(c.parent)}
                                  onClick={(e) => {
                                    if (e.target.checked)
                                      addPermission(c.parent, 'permission_list')
                                    else
                                      removePermission(
                                        c.parent,
                                        'permission_list'
                                      )
                                    e.stopPropagation()
                                  }}
                                >
                                  {c.parent}
                                </Checkbox>
                              ),
                              key: c.parent,
                              children:
                                c.children &&
                                c.children.map((e) => {
                                  return {
                                    title: (
                                      <Checkbox
                                        defaultChecked={[
                                          ...values.permission_list,
                                          ...values.menu_list,
                                        ].includes(e)}
                                        onClick={(event) => {
                                          if (event.target.checked)
                                            addPermission(e, 'permission_list')
                                          else
                                            removePermission(
                                              e,
                                              'permission_list'
                                            )
                                          event.stopPropagation()
                                        }}
                                      >
                                        {e}
                                      </Checkbox>
                                    ),
                                    key: e,
                                  }
                                }),
                            }
                          }),
                      }
                    })}
                  />
                </Panel>
              )
            })}
          </Collapse>
        </div>
      </div>
      <Drawer
        title="Thêm vai trò"
        width={950}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <Row justify="end" style={{ width: '100%' }} onClick={onClickAddRole}>
            <Button type="primary" size="large">
              Lưu
            </Button>
          </Row>
        }
      >
        <div className={styles['role--add']}>
          <div>
            <div
              style={{
                color: 'black',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              Tên vai trò
            </div>
            <div>
              <Input
                size="large"
                name="name"
                value={name}
                onChange={onChangeName}
                placeholder="Nhập tên vai trò mới"
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div
              style={{ color: '#5B6BE8', fontSize: '1rem', fontWeight: '600' }}
            >
              Chức năng hiện thị:{' '}
            </div>
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={onChangeChildMenuDrawerPermission}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {permission.map((values1, index1) => {
                  return (
                    <Col
                      style={{ width: '100%', marginBottom: '1rem' }}
                      xs={24}
                      sm={11}
                      md={7}
                      lg={7}
                      xl={7}
                    >
                      <Checkbox value={values1}>{values1}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </div>
          <div>
            <div
              style={{ color: '#5B6BE8', fontSize: '1rem', fontWeight: '600' }}
            >
              Menu hiện thị:{' '}
            </div>
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={onChangeChildMenuDrawerMenu}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {menu.map((values1, index1) => {
                  return (
                    <Col
                      style={{ width: '100%', marginBottom: '1rem' }}
                      xs={24}
                      sm={11}
                      md={7}
                      lg={7}
                      xl={7}
                    >
                      <Checkbox value={values1}>{values1}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </div>
        </div>
      </Drawer>
    </>
  )
}
