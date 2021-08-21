import styles from "./../store/store.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ACTION } from './../../consts/index'
import { useDispatch } from 'react-redux'
import moment from 'moment';
import axios from 'axios';
import noimage from './../../assets/img/noimage.jpg'
import {  Switch, Modal, Input, Upload, Row, Radio, Drawer, DatePicker, Col, notification, Select, Table, Form, Popover, Button } from "antd";
import {

  Link,

} from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined, CheckOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {  apiSearch, getAllStore, updateStore } from "../../apis/store";
import StoreInformationView from "../../components/store/store-information-view";
import StoreInformationAdd from "../../components/store/store-information-add";
import { apiDistrict, apiProvince } from "../../apis/information";
import { apiFilterCity } from "../../apis/branch";
const { Option } = Select;
const { RangePicker } = DatePicker;
export default function Store(propsData) {
  const state = propsData.location.state;
  const dispatch = useDispatch()
  const [arrayUpdate, setArrayUpdate] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [store, setStore] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const typingTimeoutRef = useRef(null);
  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ keyword: value });

      if (res.status === 200) setStore(res.data.data)
      setLoading(false)
  
    } catch (error) {

      setLoading(false)
    }
  };
  const apiSearchProvinceData = async (value) => {
    try {
      setLoading(true)
      const res = await apiSearch({ province: value });

      if (res.status === 200) setStore(res.data.data)
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  const apiSearchDistrictData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearch({ district: value });

      if (res.status === 200) setStore(res.data.data)
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearch({ from_date: start, to_date: end });

      if (res.status === 200) setStore(res.data.data)
      setLoading(false)
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
      apiSearchData(value);
    }, 300);
    // 
  };
  const dataPromotion = [];
  for (let i = 0; i < 46; i++) {
    dataPromotion.push({
      key: i,
      stt: i,
      customerCode: <Link to="/actions/customer/view" style={{ color: '#2400FF' }}>GH {i}</Link>,
      customerName: `Văn Tỷ ${i}`,
      customerType: `Tiềm năng ${i}`,
      branch: `Chi nhánh ${i}`,
      birthDay: `2021/06/28 ${i}`,
      email: `anhhung_so11@yahoo.com`,
      phoneNumber: '0384943497',
      address: '27/27, đường Ngô Y Linh',
      district: 'Bình Tân',
      city: 'Hồ Chí Minh',
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <div><ExclamationCircleOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#096E00' }} /></div>
        <Link to="/actions/customer/update" style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>
    });
  }

  const openNotificationSuccessStoreDelete = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description: data === 2 ? ('Vô hiệu hóa cửa hàng thành công.') : ('Kích hoạt cửa hàng thành công')
    });
  };

  const updateStoreData = async (object, id, data) => {
    try {
      setLoading(true)
      const res = await updateStore(object, id);
      console.log(res);
      if (res.status === 200) {
        await getAllStoreData()
        setSelectedRowKeys([])
        openNotificationSuccessStoreDelete(data)
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  function onChangeSwitch(checked, record) {
    console.log(`switch to ${checked}`);
    updateStoreData({ ...record, active: checked }, record.store_id, checked ? 1 : 2)
  }


  const getAllStoreData = async () => {
    try {
      setLoading(true)
      const res = await getAllStore();
      console.log(res)
      if (res.status === 200) {
        setStore(res.data.data)

        var arrayDistrict = []
        var arrayProvince = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          arrayDistrict.push(values.district)
          arrayProvince.push(values.province)
        })

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
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      storeName: <Link to="/branch/9">{`PRX ${i}`}</Link>,
      storeCode: <Link to="/branch/9">{`Nguyễn Văn A ${i}`}</Link>,
      phoneNumber: `038494349${i}`,
      district: `Bình Tân${i}`,
      city: `Hồ Chí Minh ${i}`,
      storeDefault: <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>{i === 2 ? (<CheckOutlined style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0400DE' }} />) : ('')}</div>,
      action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
        <div><ExclamationCircleOutlined style={{ fontSize: '1.25rem', marginRight: '0.5rem', cursor: 'pointer', color: '#096E00' }} /></div>
        <div style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
        <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      </div>,
    });
  }

  const contentImage = (data) => (
    <div>
      <img src={data} style={{ width: '25rem', height: '15rem', objectFit: 'contain' }} alt="" />
    </div>
  );
  const columns = [
    {
      title: 'Mã cửa hàng',
      dataIndex: 'code',
      width: 150,
      render: (text, record) => <StoreInformationView recordData={record} />
    },
    {
      title: 'Tên cửa hàng',
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
      title: 'Ảnh',
      dataIndex: 'logo',
      width: 150,
      render: (text, record) => text ? (<Popover content={() => contentImage(text)}><div>
        <img src={text} style={{ width: '7.5rem', cursor: 'pointer', height: '5rem', objectFit: 'contain' }} alt="" />
      </div></Popover>) : <img src={noimage} style={{ width: '6.75rem', height: '5rem', objectFit: 'cover' }} alt="" />
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
      width: 150,
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      width: 150,
    },
    {
      title: 'Số fax',
      dataIndex: 'fax',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      fixed: 'right',
      width: 100,
      render: (text, record) => text ? <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} /> : <Switch onChange={(e) => onChangeSwitch(e, record)} />
    },
  
  ];
  const storeChild = (data) => {
    setStore(data)
  }

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  };
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  };
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    store && store.length > 0 && store.forEach((values, index) => {
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
  const openNotificationErrorStoreRegexPhone = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số và có độ dài là 10`,
    });
  };
  const openNotificationErrorStoreRegex = (data) => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        `${data} phải là số`,
    });
  };
  const openNotificationSuccessStoreUpdate = (data) => {
    notification.success({
      message: 'Thành công',
      duration: 3,
      description:
        <div>Cập nhật thông tin cửa hàng <b>{data}</b> thành công</div>
    });
  };
  const openNotificationErrorStore = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Lỗi cập nhật thông tin cửa hàng.',
    });
  };
  const updateStoreDataUpdate = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await updateStore(object, id);
      console.log(res);
      if (res.status === 200) {
        await getAllStoreData()
        setSelectedRowKeys([])
        openNotificationSuccessStoreUpdate(object.name)
        onClose()
        onCloseUpdate()
      
      } else {
        openNotificationErrorStore()
      }
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone) || isNaN(values.fax)) {
          if (isNaN(values.phone)) {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
          if (isNaN(values.fax)) {
            openNotificationErrorStoreRegex('Số fax')
          }
        } else {
          if (regex.test(values.phone)) {
            updateStoreDataUpdate({
              ...values, name: values.name.toLowerCase(), logo: values.logo, phone: values.phone, email: values.email,
              fax: values.fax,
              website: values && values.website ? values.website : '', latitude: " ",
              longtitude: " ",
              address: values && values.address ? values.address.toLowerCase() : '',
              ward: '',
              district: values.district,
              province: values.province
            }, values.store_id)
      
          } else {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
        }
      })
    } else {
      arrayUpdate && arrayUpdate.length > 0 && arrayUpdate.forEach((values, index) => {
        if (isNaN(values.phone) || isNaN(values.fax)) {
          if (isNaN(values.phone)) {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
          if (isNaN(values.fax)) {
            openNotificationErrorStoreRegex('Số fax')
          }
        } else {
          if (regex.test(values.phone)) {


            updateStoreDataUpdate({
              ...values, name: values.name.toLowerCase(),
              phone: values.phone,
              email: values.email,
              fax: arrayUpdate[0].fax,
              website: arrayUpdate[0] && arrayUpdate[0].website ? arrayUpdate[0].website : '',
              latitude: " ",
              longtitude: " ",
              address: arrayUpdate[0] && arrayUpdate[0].address ? arrayUpdate[0].address.toLowerCase() : '',
              ward: '',
              district: arrayUpdate[0].district,
              province: arrayUpdate[0].province,
              logo: arrayUpdate[0].logo,
            }, values.store_id)
           
          } else {
            openNotificationErrorStoreRegexPhone('Liên hệ')
          }
        }
      })
    }
  }
  const UploadImg = ({ imageUrl, indexUpdate }) => {
    const [imgUrl, setImgUrl] = useState(imageUrl);
    const [imgFile, setImgFile] = useState(null);
    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    }
    const handleChange = (info) => {
      if (info.file.originFileObj) setImgFile(info.file.originFileObj);

      getBase64(info.file.originFileObj, (imageUrl) => {
        setImgUrl(imageUrl);
      });
    };

    useEffect(() => {
      const _uploadImg = async () => {
        try {
          const formData = new FormData();
          formData.append("files", imgFile);
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
            //   const array = [...store];
            arrayUpdate[indexUpdate].logo = resultsMockup[0].data.data[0]
          }
        } catch (error) {

        }
      };

      if (imgFile) {
        _uploadImg();
      }
    }, [imgFile]);

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        onChange={handleChange}
      >
        {
          imgUrl ? (<img
            src={imgUrl}
            alt="avatar"
            style={{ width: "5rem", height: "5rem", objectFit: "contain" }}
          />) : (<p className="ant-upload-drag-icon">

            <PlusOutlined />

            <div>Thêm ảnh</div>

          </p>)
        }
      </Upload>
    );
  };
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };

  const [districtSelect, setDistrictSelect] = useState('')
  const dateFormat = 'YYYY/MM/DD';
  const onClickClear = async () => {
    await getAllStoreData()
    openNotificationClear()
    setValueSearch("")
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
    setCity('default')
    setDistrictSelect('default')
  }
  const [city, setCity] = useState('')
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    setCity(value)
    if (value !== 'default') {
      apiSearchProvinceData(value)
    } else {
      await getAllStoreData()
    }
  }
  const handleChangeDistrict = async (value) => {
    console.log(`selected ${value}`);
    setDistrictSelect(value)
    if (value !== 'default') {
      apiSearchDistrictData(value)
    } else {
      await getAllStoreData()
    }
  }
  const [districtMain, setDistrictMain] = useState([])
  const apiDistrictData = async () => {
    try {
      setLoading(true)
      const res = await apiDistrict();
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
  const [provinceMain, setProvinceMain] = useState([])
  const apiProvinceData = async () => {
    try {
      setLoading(true)
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvinceMain(res.data.data)
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
  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const apiFilterCityData = async (object) => {
    try {
      setLoading(true)
      const res = await apiFilterCity({ keyword: object });
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      setLoading(false)
    } catch (error) {

      setLoading(false)
    }
  };
  function handleChangeCity(value) {
    apiFilterCityData(value)
  }

  const [attentionAddStore, setAttentionAddStore] = useState(true)
  const onClickTurnOffAttentAddStore = () => {
    setAttentionAddStore(false)
  }
  return (
    <>
      {
        state === '1' ? (<Modal
          width={700}
          title="Hướng dẫn thêm thông tin cần thiết trước khi thao tác bán hàng"
          centered
          footer={null}
          visible={attentionAddStore}

        >

          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '900', color: 'black', display: 'flex', justifyContent: 'flex-start', width: '100%' }}>Gồm 3 bước:</div>
            <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '900', color: 'black' }}>1. Chọn nút thêm cửa hàng ở góc trên cùng, phía bên phải để thêm một cửa hàng mới.</div>
            <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', }}>2. Chọn nút thêm chi nhánh ở góc trên cùng, phía bên phải để thêm một chi nhánh mới.</div>
            <div style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', }}>3. Tại giao diện danh sách nhân sự, thêm nhân sự vào chi nhánh kết thúc quá trình thao tác.</div>
            <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Button onClick={onClickTurnOffAttentAddStore} type="primary" style={{ width: '7.5rem' }}>Đã hiểu</Button>
            </div>
          </div>

        </Modal>) : ''
      }
      <div className={styles["promotion_manager"]}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgb(236, 226, 226)', paddingBottom: '0.75rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link style={{ paddingBottom: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }} to="/configuration-store/19">

            <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
            <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginLeft: '0.5rem' }} >Quản lý cửa hàng</div>

          </Link>
          <div className={styles["promotion_manager_button"]}>
            <StoreInformationAdd state={state} storeChild={storeChild} />
          </div>
        </div>

        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>

            <div style={{ width: '100%' }}>
              <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                placeholder="Tìm kiếm theo mã, theo tên" allowClear />
            </div>

          </Col>

          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>

              <Select showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"


                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={city ? city : 'default'} onChange={(event) => { handleChange(event); handleChangeCity(event) }}>
                <Option value="default">Tất cả tỉnh/thành phố</Option>
                {
                  provinceMain && provinceMain.length > 0 && provinceMain.map((values, index) => {
                    return (
                      <Option value={values.province_name}>{values.province_name}</Option>
                    )
                  })
                }
              </Select>

            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>

              <Select showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"


                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } value={districtSelect ? districtSelect : 'default'} onChange={handleChangeDistrict}>
                <Option value="default">Tất cả quận/huyện</Option>
                {
                  districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                    return (
                      <Option value={values.district_name}>{values.district_name}</Option>
                    )
                  })) : (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                    return (
                      <Option value={values.district_name}>{values.district_name}</Option>
                    )
                  }))
                }
              </Select>

            </div>
          </Col>

          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>

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

          </Col>

        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
        {
          selectedRowKeys && selectedRowKeys.length > 0 ? (
            <Radio.Group style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', width: '100%' }} >
              <Radio onClick={showDrawerUpdate} value={1}>Cập nhật hàng loạt</Radio>
              <Radio onClick={showDrawer} value={2}>Cập nhật riêng lẻ</Radio>
            
            </Radio.Group>
          ) : ('')
        }
        <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
          <Table rowKey="_id" loading={loading} rowSelection={rowSelection} bordered columns={columns} dataSource={store} scroll={{ y: 500 }} />
        </div>

      </div>

      <Drawer
        title="Cập nhật thông tin cửa hàng"
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

                      if (data === 'logo') {
                        const InputName = () => <UploadImg
                          imageUrl={values[data]}
                          indexUpdate={index}

                        />
                        return (
                          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
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

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên cửa hàng</div>

                              <InputName />
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

                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'province') {
                        const InputName = () => <Select defaultValue={values[data]}
                          showSearch
                          style={{ width: '100%' }}
                          placeholder="Select a person"
                          optionFilterProp="children"

                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(event) => {
                            arrayUpdate[index][data] = event; handleChangeCity(event)
                          }}>
                          {
                            provinceMain && provinceMain.length > 0 && provinceMain.map((values, index) => {
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
                            arrayUpdate[index][data] =
                              event;
                          }}>
                          {
                            districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                              return (
                                <Option value={values.district_name}>{values.district_name}</Option>
                              )
                            })) : (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
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

                      if (data === 'fax') {
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
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Số fax</div>

                              <InputName />
                            </div>
                          </Col>
                        )
                      }
                      if (data === 'website') {
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
                              <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Link website</div>

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
        title="Cập nhật thông tin cửa hàng"
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

                  layout="vertical"
                  initialValues={values}

                >
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      obj.map((data) => {

                        if (data === 'logo') {
                          const InputName = () => <UploadImg
                            imageUrl={values[data]}
                            indexUpdate={index}

                          />
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                              <div>

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Ảnh</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
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

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Tên cửa hàng</div>

                                <InputName />
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

                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Liên hệ</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'province') {
                          const InputName = () => <Select defaultValue={values[data]}
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Select a person"
                            optionFilterProp="children"

                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(event) => {
                              arrayUpdate[index][data] = event; handleChangeCity(event)
                            }}>
                            {
                              provinceMain && provinceMain.length > 0 && provinceMain.map((values, index) => {
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
                              arrayUpdate[index][data] =
                                event;
                            }}>
                            {
                              districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                                return (
                                  <Option value={values.district_name}>{values.district_name}</Option>
                                )
                              })) : (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
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

                        if (data === 'fax') {
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
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Số fax</div>

                                <InputName />
                              </div>
                            </Col>
                          )
                        }
                        if (data === 'website') {
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
                                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Link website</div>

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

    </>
  );
}
