import UI from "./../../components/Layout/UI";
import styles from "./../customer/customer.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ACTION } from './../../consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment';
import { Popconfirm, message, Switch, Tag, Radio, Drawer, Input, Row, Col, DatePicker, notification, Popover, Select, Table, Modal, Form, Upload, Checkbox, Button } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, ArrowLeftOutlined, DeleteOutlined, EditOutlined, CheckOutlined, FileImageOutlined, BorderVerticleOutlined } from "@ant-design/icons";
import { addBranch, apiFilterCity, apiSearch, apiUpdateBranch, getAllBranch } from "../../apis/branch";
import { getAllStore } from '../../apis/store'
import BranchAdd from "../../components/branch/branch-add";
import { apiDistrict, apiProvince } from "../../apis/information";
const { Option } = Select;
const { RangePicker } = DatePicker;
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
export default function Branch(propsData) {
  const state = propsData.location.state;
  const history = useHistory()
  const dispatch = useDispatch()
  const { Search } = Input;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal3Visible, setModal3Visible] = useState(false)
  const [store, setStore] = useState([])
  const [branch, setBranch] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  console.log(store)
  const typingTimeoutRef = useRef(null);
  const apiSearchData = async (value, data) => {
    if (data === 1) {
      try {
        setLoading(true)

        const res = await apiSearch({ keyword: value });

        if (res.status === 200) setBranch(res.data.data)
        setLoading(false)
        // openNotification();
        // history.push(ROUTES.NEWS);
      } catch (error) {

        setLoading(false)
      }
    } else {
      try {
        setLoading(true)

        const res = await apiSearch({ store: value });
        console.log(res)
        if (res.status === 200) setBranch(res.data.data)
        setLoading(false)
        // openNotification();
        // history.push(ROUTES.NEWS);
      } catch (error) {

        setLoading(false)
      }
    }
  };
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end });
      console.log(res)
      if (res.status === 200) setBranch(res.data.data)
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      setLoading(false)
    }
  };
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiSearchDateData(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value;
      apiSearchData(value, 1);
    }, 300);
    // 
  };
  const openNotificationErrorNotBranch = (code, name) => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 20,
      description:
        <div>Tại giao diện <b>Danh sách nhân sự</b> bạn sẽ thấy được những nhân sự mà bạn đang quản lý. Tích chọn vào ô vuông phía bên trái cột <b>Mã nhân sự</b> để phân những nhân sự này vào chi nhánh <b>{name}</b> .Kết thúc thao tác bằng các chọn vào ô tròn có tên <b>Phân nhân sự vào chi nhánh.</b></div>
    });
  };
  const [modalFinish, setModalFinish] = useState(0)
  const [objectFinish, setObjectFinish] = useState({})
  const [recordFinish, setRecordFinish] = useState({})
  const onClickNotBranch = (code, name, record) => {
    if (state && state === '1') {
      setObjectFinish({ code: code, name: name })
      setModalFinishValue(true)
      setRecordFinish(record)
    } else {
      history.push({ pathname: "/actions/branch/view/19/1", state: record })
    }
  }
  const columnsPromotion = [
    // {
    //   title: 'STT',
    //   dataIndex: 'stt',
    //   width: 150,
    // },
    {
      title: 'Mã chi nhánh',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => <div onClick={() => onClickNotBranch(record.code, record.name, record)} style={{ color: '#007ACC', cursor: 'pointer' }}>{text}</div>
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      width: 150,
      render: (text, record) => <div>{text}</div>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      width: 150,
      render: (text, record) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'store',
      width: 150,
      render: (text, record) => record && record.store && record.store.name ? record.store.name : ''
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 150,
    },

    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Thành phố',
      dataIndex: 'ward',
      width: 150,
    },
    // {
    //   title: 'Zip code',
    //   dataIndex: 'zipcode',
    //   width: 150,
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} /> : <Switch onChange={(e) => onChangeSwitch(e, record)} />
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 100,
    //   render: (text, record) => <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
    //     <div onClick={() => modal3VisibleModalUpdate(true, record)} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
    //     {/* <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div> */}
    //   </div>
    // },
  ];

  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      branchCode: <Link to="/actions/branch/view/19" style={{ color: '#2400FF' }}>CN {i}</Link>,
      branchName: <Link to="/actions/branch/view/19" style={{ color: '#2400FF' }}>Chi nhánh {i}</Link>,
      address: `Địa chỉ ${i}`,
      district: `Bình thạnh ${i}`,
      city: `Hồ chí minh ${i}`,
      branchDefault: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{i === 2 ? (<CheckOutlined style={{ color: '#0400DE', fontSize: '1.5rem' }} />) : ('')}</div>,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <div onClick={() => modal3VisibleModal(true)} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const [record, setRecord] = useState({})
  const modal3VisibleModalUpdate = (modal, record) => {
    setModal3Visible(modal)
    setRecord(record)
    console.log(record)
    const update = form.getFieldValue()
    update.branchName = record.name;
    update.address = record.address;
    update.city = record.ward;
    update.branchCode = record.code;
    update.district = record.district;
    update.defaultStore = record.default;
  }
  const onSearchCustomerChoose = value => console.log(value);
  const [arrayUpdate, setArrayUpdate] = useState([])
  const openNotification = (check) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: check === 2 ? ('Vô hiệu hóa chi nhánh thành công.') : ('Kích hoạt chi nhánh thành công')
    });
  };
  const openNotificationUpdateMulti = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: <div>Cập nhật thông tin chi nhánh <b>{data}</b> thành công</div>
    });
  };
  const openNotificationDelete = () => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        'Xóa chi nhánh thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Lỗi cập nhật thông tin chi nhánh.',
    });
  };
  const addBranchData = async (object) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await addBranch(object);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        await getAllBranchData()
        openNotification()
        modal2VisibleModal(false)
        form.resetFields();
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const apiUpdateBranchData = async (object, id, check) => {
    try {
      setLoading(true)
      // console.log(value);
      const res = await apiUpdateBranch(object, id);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        await getAllBranchData()
        openNotification(check)
        setSelectedRowKeys([])
        modal3VisibleModal(false)
        // form.resetFields();
      } else {
        openNotificationError()
      }
      setLoading(false)
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    const object = {
      // code: values.branchCode.toLowerCase(),
      name: values.branchName.toLowerCase(),
      phone: record.phone,
      latitude: ' ',
      longtitude: ' ',
      default: values.defaultStore,
      address: values.address.toLowerCase(),
      ward: values.city.toLowerCase(),
      district: values.district.toLowerCase(),
      province: ' ',
      store_id: record.store_id.store_id,
    }
    console.log(object)
    apiUpdateBranchData(object, record.branch_id, 1);
  };

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
  const getAllBranchData = async () => {
    try {
      setLoading(true)
      const res = await getAllBranch();
      console.log(res)
      console.log("|||000000111")
      if (res.status === 200) {
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  const openNotificationDeleteSupplierErrorActive = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Chi nhánh đang hoạt động. Không thể thực hiện chức năng này.'
    });
  };
  const openNotificationDeleteSupplierError = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description: 'Chi nhánh đang ở trạng thái vô hiệu hóa. Không thể thực hiện chức năng này.'
    });
  };
  function confirm(e) {
    console.log(e);
    branch && branch.length > 0 && branch.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active === false) {
            openNotificationDeleteSupplierError()
          } else {
            const object = {
              active: false
            }
            apiUpdateBranchData(object, values.branch_id, 1)
          }
        }
      })
    })
  }

  function cancel(e) {
    console.log(e);

  }
  function confirmActive(e) {
    console.log(e);
    branch && branch.length > 0 && branch.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          if (values.active) {
            openNotificationDeleteSupplierErrorActive()
          } else {
            const object = {
              active: true
            }
            apiUpdateBranchData(object, values.branch_id, 2)
          }
        }
      })
    })
  }

  function cancelActive(e) {
    console.log(e);

  }
  useEffect(() => {
    getAllBranchData();
  }, []);
  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };

  useEffect(() => {
    getAllStoreData();
  }, []);
  const branchChild = (data) => {
    setBranch(data)
  }
  console.log(dataPromotion)
  const modal3VisibleModal = (modal2Visible) => {
    setModal3Visible(modal2Visible)
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  };
  const openNotificationErrorFormatPhone = (data) => {
    notification.error({
      message: 'Lỗi',
      description:
        `${data} chưa đúng định dạng`,
    });
  };
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  };
  const apiUpdateBranchDataUpdateMulti = async (object, id) => {

    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await apiUpdateBranch(object, id);
      console.log(res);
      // if (res.status === 200) setStatus(res.data.status);
      if (res.status === 200) {
        await getAllBranchData()
        openNotificationUpdateMulti(object.name)
        setSelectedRowKeys([])
        onClose()
        onCloseUpdate()
        // form.resetFields();
      } else {
        openNotificationError()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onCloseUpdateFunc = (data) => {

    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        console.log(values)
        console.log("_________________678678")
        if (isNaN(values.phone)) {
          if (isNaN(values.phone)) {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        } else {
          if (regex.test(values.phone)) {
            console.log(values)
            const object = {
              // code: values.branchCode.toLowerCase(),
              name: values.name.toLowerCase(),
              phone: values.phone,
              latitude: ' ',
              longtitude: ' ',
              // default: values.defaultStore,
              address: values && values.address ? values.address.toLowerCase() : '',
              ward: values.ward.toLowerCase(),
              district: values.district.toLowerCase(),
              province: ' ',
              store: values && values.store && values.store.store_id ? values.store.store_id : values.store,
            }
            console.log(object)
            console.log("0--------------------------")
            apiUpdateBranchDataUpdateMulti(object, values.branch_id);
          } else {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        }
      })
    } else {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone)) {
          if (isNaN(values.phone)) {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        } else {
          if (regex.test(values.phone)) {
            console.log(values)
            const object = {
              // code: values.branchCode.toLowerCase(),
              name: values.name.toLowerCase(),
              phone: values.phone,
              latitude: ' ',
              longtitude: ' ',
              // default: values.defaultStore,
              address: arrayUpdate[0] && arrayUpdate[0].address ? arrayUpdate[0].address.toLowerCase() : '',
              ward: arrayUpdate[0].ward.toLowerCase(),
              district: arrayUpdate[0].district.toLowerCase(),
              province: ' ',
              store: arrayUpdate[0] && arrayUpdate[0].store && arrayUpdate[0].store.store_id ? arrayUpdate[0].store.store_id : arrayUpdate[0].store,
            }
            console.log(object)
            console.log("0--------------------------")
            apiUpdateBranchDataUpdateMulti(object, values.branch_id);
          } else {
            openNotificationErrorFormatPhone('Liên hệ')
          }
        }
      })
    }
  }
  console.log(arrayUpdate)
  console.log("|||11112222")
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    branch && branch.length > 0 && branch.forEach((values, index) => {
      selectedRowKeys.forEach((values1, index1) => {
        if (values._id === values1) {
          array.push(values)
        }
      })
    })
    setArrayUpdate([...array])
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };
  const [storeSelect, setStoreSelect] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    setStoreSelect(value)
    if (value > -1) {
      apiSearchData(value, 2)
    } else {
      await getAllBranchData()
    }
  }
  const dateFormat = 'YYYY/MM/DD';
  const onClickClear = async () => {
    await getAllBranchData()
    openNotificationClear()
    setValueSearch("")
    setClear(1)
    setStoreSelect("default")
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  const [district, setDistrict] = useState([])
  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrict(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  const [province, setProvince] = useState([])
  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvince(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const [districtMain, setDistrictMain] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }
  console.log(districtMain)
  console.log("|||11111111111111")
  const [valueSwitch, setValueSwitch] = useState(false)
  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`);
    setValueSwitch(checked)
    // const object = {
    //   active: checked
    // }
    apiUpdateBranchData({ ...record, active: checked }, record.branch_id, checked ? 1 : 2)
  }
  const [checkedValue, setCheckedValue] = useState(0)
  const openNotificationNotifycation = () => {
    notification.warning({
      message: 'Nhắc nhở',
      duration: 15,
      description:
        'Tại giao diện thêm chi nhánh, thêm một cửa hàng mà bạn muốn vào chi nhánh này.',
    });
  };
  const onClickTutorial = () => {
    if (state === '1' && checkedValue === 0) {
      setCheckedValue(1)
      openNotificationNotifycation()
    }
  }
  const [confirmValue, setConfirmValue] = useState('')
  const [attentionAddBranch, setAttentionAddBranch] = useState(true)
  const onClickTurnOffAttentAddBranch = () => {
    setAttentionAddBranch(false)
    setConfirmValue('1')
    return (<BranchAdd confirmValue={confirmValue} state={state} branchChild={branchChild} />)
  }
  const [modalFinishValue, setModalFinishValue] = useState(false)
  const onClickFinishModal = () => {
    if (state && state === '1') {
      openNotificationErrorNotBranch(objectFinish.code, objectFinish.name)
      setModalFinish(1)
      setModalFinishValue(false)
      history.push({ pathname: "/actions/branch/view/19/2", state: recordFinish })
    }
  }

  return (
    <UI>

      {/* <Modal
        width={700}
        title="Hướng dẫn cài đặt chức năng trước khi thao tác bán hàng"
        centered
        footer={null}
        visible={modalFinishValue}

      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '900', color: 'black', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>Gồm 3 bước:</div>
          <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '900', color: 'black', textDecoration: 'line-through' }}>1. Chọn nút thêm cửa hàng ở góc trên cùng, phía bên phải để thêm một cửa hàng mới.</div>
          <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '900', color: 'black', textDecoration: 'line-through' }}>2. Chọn nút thêm chi nhánh ở góc trên cùng, phía bên phải để thêm một chi nhánh mới.</div>
          <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '900', color: 'black' }}>3. Tại giao diện danh sách nhân sự, thêm nhân sự vào chi nhánh kết thúc quá trình thao tác.</div>
          <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <Button onClick={onClickFinishModal} type="primary" style={{ width: '7.5rem' }}>Đã hiểu</Button>
          </div>
        </div>
      </Modal> */}


      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link className={styles["supplier_add_back_parent"]} style={{ paddingBottom: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

            <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} className={styles["supplier_add_back"]}>Quản lý chi nhánh A</div>

          </Link>
          <div className={styles["promotion_manager_button"]}>
            <BranchAdd state={state} branchChild={branchChild} />
          </div>
        </div>
        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            {/* <Popover placement="bottomLeft" content={content} trigger="click"> */}
            <div style={{ width: '100%' }}>
              <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                placeholder="Tìm kiếm theo mã, theo tên" allowClear />
            </div>
            {/* </Popover> */}
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', marginRight: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            {/* <Popover placement="bottomLeft" content={content} trigger="click"> */}
            <div style={{ width: '100%' }}>
              <RangePicker
                // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                onChange={onChangeDate}
              />
            </div>
            {/* </Popover> */}
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                showSearch

                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={storeSelect ? storeSelect : 'default'} onChange={handleChange}>
                <Option value="default">Tất cả cửa hàng</Option>
                {
                  store && store.length > 0 && store.map((values, index) => {
                    return (
                      <Option value={values.store_id}>{values.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
          </Col>
          {/* <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Tất cả chi nhánh" onChange={handleChange}>
                <Option value="branch1">Chi nhánh 1</Option>
                <Option value="branch2">Chi nhánh 2</Option>
                <Option value="branch3">Chi nhánh 3</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Quận" onChange={handleChange}>
                <Option value="branch1">Branch 1</Option>
                <Option value="branch2">Branch 2</Option>
                <Option value="branch3">Branch 3</Option>
              </Select>
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Thành phố" onChange={handleChange}>
                <Option value="haNoi">Hà nội</Option>
                <Option value="hoChiMinh">Hồ chí minh</Option>
              </Select>
            </div>
          </Col> */}
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (



            <Radio.Group style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', width: '100%' }} >
              <Radio onClick={showDrawerUpdate} value={1}>Cập nhật hàng loạt</Radio>
              <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio>
              {/* <Popconfirm
                  title="Bạn chắc chắn muốn xóa?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Radio value={3}>     Vô hiệu hóa</Radio>
                </Popconfirm>
                <Popconfirm
                  title="Bạn chắc chắn muốn kích hoạt lại?"
                  onConfirm={confirmActive}
                  onCancel={cancelActive}
                  okText="Yes"
                  cancelText="No"
                >
                  <Radio value={4}>Kích hoạt</Radio>
                </Popconfirm> */}
            </Radio.Group>


          ) : ('')
        }
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowKey="_id" loading={loading} bordered rowSelection={rowSelection} columns={columnsPromotion} dataSource={branch} scroll={{ y: 500 }} />
        </div>

      </div>

      <Drawer
        title="Cập nhật thông tin chi nhánh"
        width={1000}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(1)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            return (

              <Form
                style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                className={styles["supplier_add_content"]}

                // form={form}
                layout="vertical"
                initialValues={values}

              >
                <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {
                    obj.map((data) => {
                      if (data === 'name') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên chi nhánh</div>

                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'phone') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>

                              <InputName />
                              {/* </Form.Item> */}
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'address') {
                        const InputName = () => <Input defaultValue={values[data]}
                          onChange={(event) => {
                            const value =
                              event.target.value;
                            arrayUpdate[index][data] =
                              value;
                          }} />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Địa chỉ</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'ward') {
                        const InputName = () => <Select defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"
                          // onChange={handleChangeCity}

                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] = event; handleChangeCity(event)
                          }}>
                          {
                            province && province.length > 0 && province.map((values, index) => {
                              return <Option value={values.province_name}>{values.province_name}</Option>
                            })
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tỉnh/thành phố</div>
                              <InputName />

                            </div>
                          </Col>
                        )
                      }
                      if (data === 'district') {

                        const InputName = () => <Select defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"


                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] =
                              event;
                          }}>
                          {
                            districtMain && districtMain.length > 0 ? (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                              return (
                                <Option value={values.district_name}>{values.district_name}</Option>
                              )
                            })) : (district && district.length > 0 && district.map((values, index) => {
                              return (
                                <Option value={values.district_name}>{values.district_name}</Option>
                              )
                            }))
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Quận/huyện</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'store') {
                        const InputName = () => <Select defaultValue={values[data].store_id}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Chọn cửa hàng"
                          optionFilterProp="children"


                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            // const value =
                            //   event.target.value;
                            arrayUpdate[index][data] =
                              event;
                          }}>
                          {
                            store && store.length > 0 && store.map((values, index) => {
                              return (
                                <Option value={values.store_id}>{values.name}</Option>
                              )
                            })
                          }
                        </Select>
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Cửa hàng</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                    })
                  }
                </Row>

              </Form>

            )
          })
        }
      </Drawer>

      <Drawer
        title="Cập nhật thông tin chi nhánh"
        width={1000}
        onClose={onCloseUpdate}
        visible={visibleUpdate}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => onCloseUpdateFunc(2)} type="primary">
              Cập nhật
            </Button>
          </div>
        }
      >
        {
          arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.map((values, index) => {
            const obj = Object.keys(values)
            if (index === 0) {
              return (

                <Form
                  style={{ borderBottom: '1px solid rgb(238, 224, 224)', paddingBottom: '1.5rem', }}
                  className={styles["supplier_add_content"]}

                  // form={form}
                  layout="vertical"
                  initialValues={values}

                >
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      obj.map((data) => {
                        if (data === 'name') {
                          const InputName = () => <Input disabled defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên chi nhánh</div>

                                <InputName />
                                {/* </Form.Item> */}
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'phone') {
                          const InputName = () => <Input disabled defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                {/* <Form.Item

                                label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                name="phone"
                                rules={[{ required: true, message: "Giá trị rỗng!" }]}
                              > */}
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>

                                <InputName />
                                {/* </Form.Item> */}
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'address') {
                          const InputName = () => <Input defaultValue={values[data]}
                            onChange={(event) => {
                              const value =
                                event.target.value;
                              arrayUpdate[index][data] =
                                value;
                            }} />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Địa chỉ</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'ward') {
                          const InputName = () => <Select defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            // onChange={handleChangeCity}

                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] = event; handleChangeCity(event)
                            }}>
                            {
                              province && province.length > 0 && province.map((values, index) => {
                                return <Option value={values.province_name}>{values.province_name}</Option>
                              })
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tỉnh/thành phố</div>
                                <InputName />

                              </div>
                            </Col>
                          )
                        }
                        if (data === 'district') {

                          const InputName = () => <Select defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] =
                                event;
                            }}>
                            {
                              districtMain && districtMain.length > 0 ? (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>{values.district_name}</Option>
                                )
                              })) : (district && district.length > 0 && district.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>{values.district_name}</Option>
                                )
                              }))
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Quận/huyện</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'store') {
                          const InputName = () => <Select defaultValue={values[data].store_id}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Chọn cửa hàng"
                            optionFilterProp="children"


                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              // const value =
                              //   event.target.value;
                              arrayUpdate[index][data] =
                                event;
                            }}>
                            {
                              store && store.length > 0 && store.map((values, index) => {
                                return (
                                  <Option value={values.store_id}>{values.name}</Option>
                                )
                              })
                            }
                          </Select>
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Cửa hàng</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                      })
                    }
                  </Row>

                </Form>

              )
            }
          })
        }
      </Drawer>

    </UI >
  );
}
