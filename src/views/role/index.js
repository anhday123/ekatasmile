import UI from './../../components/Layout/UI';
import styles from "./../role/role.module.scss";
import React, { useState, useEffect } from "react";
import { apiAllSupplier } from "../../apis/supplier";
import { ACTION } from './../../consts/index'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import {
  Col,
  Row,
  Collapse,
  notification,
  Checkbox,
  Drawer,
  Tabs,
  Button,
  Modal,
  Switch,
  Select,
  Input,
} from "antd";
import {
  PlusOutlined, DeleteOutlined
} from "@ant-design/icons";
import { apiAddRole, apiAllMenu, apiAllRole, apiAllRolePermission, apiUpdateRole, apiUpdateRolePermission } from '../../apis/role';

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `username ${i}`,
    phoneNumber: `038494349${i}`,
    site: `Website bán hàng Viesoftware`,
    role: `Seller ${i}`,
  });
}
const { Panel } = Collapse;
const { Option } = Select;
export default function Role() {
  const { TabPane } = Tabs;
  const dispatch = useDispatch()
  const permissionReducer = useSelector((state) => state.login)
  console.log("|||")
  console.log(permissionReducer)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false)
  const [permission, setPermission] = useState([])
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [key, setKey] = useState('')
  const hasSelected = selectedRowKeys.length > 0;
  function callback(key) {
    console.log(key);
    setKey(key)
  }
  function callbackTab(key) {
    console.log(key);

  }
  const openNotificationUpdateRole = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật quyền thành công',
    });
  };
  const apiUpdateRolePermissionData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateRolePermission(object, key);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        await apiAllRolePermissionData()
        openNotificationUpdateRole()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function onChange(checkedValues) {
    console.log("|||Parent")
    console.log('checked = ', checkedValues);
    rolePermission.forEach((values, index) => {
      if (values.role_id === key) {
        const object = {
          permission_list: checkedValues,
          menu_list: [...values.menu_list],
          active: true
        }
        console.log(object, key)
        apiUpdateRolePermissionData(object)
      }
    })
  }
  function onChangeChildDrawer(checkedValues) {
    console.log("|||Child")
    console.log('checked = ', checkedValues);
    // const object = {
    //   permission_list: checkedValues,
    //   menu_list: [],
    //   active: true
    // }
    // console.log(object)
    // apiUpdateRolePermissionData(object, id)
  }
  function onChangeChild(checkedValues) {
    console.log("|||Child")
    console.log('checked = ', checkedValues);
    // const object = {
    //   permission_list: checkedValues,
    //   menu_list: [],
    //   active: true
    // }
    // console.log(object)
    // apiUpdateRolePermissionData(object, id)
  }
  function onChangeMenu(checkedValues) {
    console.log("|||Parent7777")
    console.log('checked = ', checkedValues);
    rolePermission.forEach((values, index) => {
      if (values.role_id === key) {
        const object = {
          permission_list: [...values.permission_list],
          menu_list: checkedValues,
          active: true
        }
        console.log(object, key)
        console.log("|||Parent8888")
        apiUpdateRolePermissionData(object)
      }
    })
  }
  function onChangeChildMenu(checkedValues) {
    console.log("|||Child")
    console.log('checked = ', checkedValues);
    // const object = {
    //   permission_list: checkedValues,
    //   menu_list: [],
    //   active: true
    // }
    // console.log(object)
    // apiUpdateRolePermissionData(object, id)
  }
  const [permissionAdd, setPermissionAdd] = useState([])
  function onChangeChildMenuDrawerPermission(checkedValues) {
    console.log("|||Child")
    console.log('checked = ', checkedValues);
    setPermissionAdd(checkedValues)
    // const object = {
    //   permission_list: checkedValues,
    //   menu_list: [],
    //   active: true
    // }
    // console.log(object)
    // apiUpdateRolePermissionData(object, id)
  }
  const [menuAdd, setMenuAdd] = useState([])
  function onChangeChildMenuDrawerMenu(checkedValues) {
    console.log("|||Child")
    console.log('checked = ', checkedValues);
    setMenuAdd(checkedValues)
    // const object = {
    //   permission_list: checkedValues,
    //   menu_list: [],
    //   active: true
    // }
    // console.log(object)
    // apiUpdateRolePermissionData(object, id)
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Phân quyền thành công.',
    });
  };
  const onClickSave = () => {
    openNotification()
  }
  const [permissionBackup, setPermissionBackup] = useState([])
  const apiAllRoleData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllRole();
      console.log("|||123123")
      console.log(res)
      if (res.status === 200) {
        setPermission(res.data.data.permission_list)
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
  const [menu, setMenu] = useState([]);
  const apiAllMenuData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllMenu();
      console.log(res)
      if (res.status === 200) {
        setMenu(res.data.data.menu_list)
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
  useEffect(() => {
    apiAllMenuData();
  }, []);
  const [rolePermission, setRolePermission] = useState([])
  const apiAllRolePermissionData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllRolePermission();
      console.log(res)
      if (res.status === 200) {
        // const array = []
        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   if (values.active) {
        //     array.push(values)
        //   }
        // })
        setRolePermission(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllRolePermissionData();
  }, []);
  console.log("123")
  console.log(menu)
  const openNotificationAddRole = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm vai trò mới thành công',
    });
  };
  const openNotificationAddRoleErrorMain = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên vai trò đã tồn tại',
    });
  };
  const openNotificationAddRoleDelete = (e) => {
    notification.success({
      message: 'Thành công',
      description:
        e ? `Kích hoạt vai trò thành công` : 'Vô hiệu hóa vai trò thành công',
    });
  };
  const [name, setName] = useState('')
  const apiUpdateRoleData = async (object, id, e) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateRole(object, id);
      console.log(res);
      if (res.status === 200) {
        await apiAllRoleData()
        await apiAllRolePermissionData()
        openNotificationAddRoleDelete(e)
        // setPermissionAdd([])
        // setMenu([])
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
  const apiAddRoleData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAddRole(object);
      console.log(res);
      if (res.status === 200) {
        await apiAllRolePermissionData()
        onClose()
        openNotificationAddRole()
        // setPermissionAdd([])
        // setMenu([])
        setName('')
      } else {
        openNotificationAddRoleErrorMain()
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

  const onChangeName = (e) => {
    setName(e.target.value)
  }
  const openNotificationAddRoleError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Bạn chưa nhập tên vai trò',
    });
  };
  const onClickAddRole = () => {
    if (name) {
      const object = {
        name: name.toLowerCase(),
        permission_list: permissionAdd,
        menu_list: menuAdd
      }
      console.log(object)
      apiAddRoleData(object)
    } else {
      openNotificationAddRoleError()
    }
  }
  const [index1, setIndex1] = useState(-1)
  const onClickDeleteActive = (id, index) => {
    const object = {
      active: true,
      permission_list: [],
      menu_list: [],
    }
    setIndex1(index)
    apiUpdateRoleData(object, id)
    console.log(id)
    console.log("|||444")
  }
  const onClickDeleteDisable = (e, id, index) => {

    const object = {
      active: e ? e : false,
      permission_list: [...rolePermission[index].permission_list],
      menu_list: [...rolePermission[index].menu_list],
    }
    setIndex1(index)
    apiUpdateRoleData(object, id, e)
    console.log(id)
    console.log("|||444")
  }
  return (
    <UI>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '1rem', margin: '1rem', backgroundColor: 'white' }}>
        <Row style={{ display: 'flex', borderBottom: '1px solid rgb(230, 220, 220)', paddingBottom: '1rem', marginBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', width: '100%' }}>Quản lý phân quyền</div>
          </Col>
          <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={11} xl={11}>
            <div onClick={showDrawer} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Button type="primary" style={{ width: '7.5rem' }}>Tạo quyền</Button>
            </div>
          </Col>
        </Row>
        <div style={{ width: '100%' }}>
          <Collapse
            accordion
            // defaultActiveKey={['1']}
            onChange={callback}

            expandIconPosition="left"

          >
            {
              rolePermission.map((values, index) => {
                if (values.active) {
                  return (

                    <Panel extra={<Switch defaultChecked={values.active} onChange={(e) => onClickDeleteDisable(e, values.role_id, index)} />} header={`Permission ${values.name}`} key={values.role_id}>
                      <Tabs defaultActiveKey="1" onChange={callbackTab}>
                        <TabPane tab="Quyền" key="1">
                          <Checkbox.Group style={{ width: '100%' }} defaultValue={values.permission_list} onChange={onChange}>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                              {
                                permission.map((values1, index1) => {
                                  return (
                                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={5}>
                                      <Checkbox onChange={onChangeChild} value={values1}>{values1}</Checkbox>
                                    </Col>
                                  )
                                })
                              }
                            </Row>
                          </Checkbox.Group>
                        </TabPane>
                        <TabPane tab="Menu hiển thị" key="2">
                          <Checkbox.Group style={{ width: '100%' }} defaultValue={values.menu_list} onChange={onChangeMenu}>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                              {
                                menu.map((values1, index1) => {
                                  return (
                                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={5}>
                                      <Checkbox onChange={onChangeChildMenu} value={values1}>{values1}</Checkbox>
                                    </Col>
                                  )
                                })
                              }
                            </Row>
                          </Checkbox.Group>
                        </TabPane>
                      </Tabs>
                    </Panel>

                  )
                } else {
                  return (

                    <Panel extra={<Switch defaultChecked={values.active} onChange={(e) => onClickDeleteDisable(e, values.role_id, index)} />} header={`Permission ${values.name}`} key={values.role_id}>
                      <Tabs defaultActiveKey="1" onChange={callbackTab}>
                        <TabPane tab="Quyền" key="1">
                          <Checkbox.Group style={{ width: '100%' }} defaultValue={values.permission_list} onChange={onChange}>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                              {
                                permission.map((values1, index1) => {
                                  return (
                                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={5}>
                                      <Checkbox onChange={onChangeChild} value={values1}>{values1}</Checkbox>
                                    </Col>
                                  )
                                })
                              }
                            </Row>
                          </Checkbox.Group>
                        </TabPane>
                        <TabPane tab="Menu hiển thị" key="2">
                          <Checkbox.Group style={{ width: '100%' }} defaultValue={values.menu_list} onChange={onChangeMenu}>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                              {
                                menu.map((values1, index1) => {
                                  return (
                                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={5}>
                                      <Checkbox onChange={onChangeChildMenu} value={values1}>{values1}</Checkbox>
                                    </Col>
                                  )
                                })
                              }
                            </Row>
                          </Checkbox.Group>
                        </TabPane>
                      </Tabs>
                    </Panel>

                  )
                }

              })
            }
          </Collapse></div>
        {/* <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <div><Button style={{ width: '5rem' }} type="primary" danger>Hủy</Button></div>
          <div onClick={onClickSave}><Button style={{ width: '5rem', marginLeft: '1rem' }} type="primary">Lưu</Button></div>
        </div> */}
      </div>
      <Drawer
        title="Thêm vai trò"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div className={styles['role--add']}>
          <div>
            <div style={{ color: 'black', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>Tên vai trò</div>
            <div><Input name="name" value={name} onChange={onChangeName} placeholder="Nhập tên vai trò mới" /></div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ color: '#5B6BE8', fontSize: '1rem', fontWeight: '600' }}>Quyền: </div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeChildMenuDrawerPermission}>
              <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                {
                  permission.map((values1, index1) => {
                    return (
                      <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={7}>
                        <Checkbox value={values1}>{values1}</Checkbox>
                      </Col>
                    )
                  })
                }
              </Row>
            </Checkbox.Group>
          </div>
          <div>
            <div style={{ color: '#5B6BE8', fontSize: '1rem', fontWeight: '600' }}>Menu hiện thị: </div>
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeChildMenuDrawerMenu}>
              <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', alignItems: 'center', width: '100%' }}>
                {
                  menu.map((values1, index1) => {
                    return (
                      <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={11} md={7} lg={7} xl={7}>
                        <Checkbox value={values1}>{values1}</Checkbox>
                      </Col>
                    )
                  })
                }
              </Row>
            </Checkbox.Group>
          </div>
          <div onClick={onClickAddRole} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Button type="primary" style={{ width: '7.5rem' }}>Lưu</Button>
            </div>
          </div>
        </div>
      </Drawer>
    </UI>
  );
}
