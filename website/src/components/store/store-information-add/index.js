import styles from "./../store-information-update/store-information-update.module.scss";
import React, { useState, useEffect } from "react";
import { ACTION} from './../../../consts/index'
import axios from 'axios';
import { addStore} from "./../../../apis/store";
import { useDispatch } from 'react-redux'
import { Input,  Button, Row, Col, notification, Select, Modal, Form, Upload, message } from "antd";
import {
    useHistory,
} from "react-router-dom";
import { PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { apiProvince } from "../../../apis/information";
import { apiFilterCity } from "../../../apis/branch";
const { Option } = Select;
const { Dragger } = Upload;
export default function StoreInformationAdd({ storeChild, state }) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const [modal3Visible, setModal3Visible] = useState(false)
    const modal3VisibleModal = (modal3Visible) => {
        setModal3Visible(modal3Visible)
    }
  
    const openNotificationSuccessStore = () => {
        notification.success({
            message: 'Thành công',
            duration: 7,
            description:
                'Thêm thông tin cửa hàng thành công.',
        });
    };

    const openNotificationForgetImageError = () => {
        notification.error({
            message: 'Thất bại',
            duration: 3,
            description:
                'Tên cửa hàng đã tồn tại.',
        });
    };
    const openNotificationForgetImageErrorRegex = (data) => {
        notification.error({
            message: 'Thất bại',
            duration: 3,
            description:
                `${data} phải là số`,
        });
    };
    const openNotificationForgetImageErrorRegexPhone = (data) => {
        notification.error({
            message: 'Thất bại',
            duration: 3,
            description:
                `${data} chưa đúng định dạng`,
        });
    };
    const addStoreData = async (object) => {
        try {
            dispatch({ type: ACTION.LOADING, data: true });
            const res = await addStore(object);
            console.log(res);
            if (res.status === 200) {
                openNotificationSuccessStore()
                modal3VisibleModal(false)
                if (state && state !== '' && state === '1') {
                    history.push({ pathname: '/branch/19', state: state })
                }
                form.resetFields();
            } else {
                openNotificationForgetImageError()
            }
            dispatch({ type: ACTION.LOADING, data: false });
      
        } catch (error) {
            console.log(error);
            dispatch({ type: ACTION.LOADING, data: false });
        }
    };
    function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
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
    const onFinish = async (values) => {
        if (isURL(values.websiteLink)) {

            if (values.fax) {
                if (isNaN(values.phoneNumber) || isNaN(values.fax)) {
                    if (isNaN(values.phoneNumber)) {
                        openNotificationForgetImageErrorRegexPhone('Liên hệ')
                    }
                    if (isNaN(values.fax)) {
                        openNotificationForgetImageErrorRegex('Số fax')
                    }
                } else {
                    if (regex.test(values.phoneNumber)) {
                        // setList(resultsMockup[0].data.data[0])1
                        const object = {
                            // code: values.storeCode.toLowerCase(),
                            name: values.storeName.toLowerCase(),
                            logo: list ? list : '',
                            phone: values.phoneNumber,
                            email: ' ',
                            fax: values.fax,
                            website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                            latitude: " ",
                            longtitude: " ",
                            address: values && values.address ? values.address.toLowerCase() : '',
                            ward: ' ',
                            district: values.district.toLowerCase(),
                            province: values.city.toLowerCase(),
                            // default: false
                        }
                        console.log(object)
                        console.log("123")
                        addStoreData(object)
                    } else {
                        openNotificationForgetImageErrorRegexPhone('Liên hệ')
                    }
                }

            } else {
                if (values.dragger && values.dragger.length > 0) {
                    const image = values.dragger[0].originFileObj;
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
                        if (isNaN(values.phoneNumber)) {
                            if (isNaN(values.phoneNumber)) {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }

                        } else {
                            if (regex.test(values.phoneNumber)) {
                                setList(resultsMockup[0].data.data[0])
                                const object = {
                                    // code: values.storeCode.toLowerCase(),
                                    name: values.storeName.toLowerCase(),
                                    logo: list ? list : '',
                                    phone: values.phoneNumber,
                                    email: ' ',
                                    fax: 0,
                                    website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                    latitude: " ",
                                    longtitude: " ",
                                    address: values && values.address ? values.address.toLowerCase() : '',
                                    ward: ' ',
                                    district: values.district.toLowerCase(),
                                    province: values.city.toLowerCase(),
                                    // default: false
                                }
                                console.log(object)
                                console.log("123")
                                addStoreData(object)
                            } else {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }
                        }

                    }
                } else {
                    if (isNaN(values.phoneNumber)) {
                        if (isNaN(values.phoneNumber)) {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                    } else {
                        if (regex.test(values.phoneNumber)) {
                            const object = {
                                // code: values.storeCode.toLowerCase(),
                                name: values.storeName.toLowerCase(),
                                logo: list ? list : '',
                                phone: values.phoneNumber,
                                email: ' ',
                                fax: 0,
                                website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                latitude: " ",
                                longtitude: " ",
                                address: values && values.address ? values.address.toLowerCase() : '',
                                ward: ' ',
                                district: values.district.toLowerCase(),
                                province: values.city.toLowerCase(),
                                // default: false
                            }
                            console.log(object)
                            console.log("123")
                            addStoreData(object)
                        } else {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                    }
                }
            }

        } else {

            if (values.fax) {
                if (values.dragger && values.dragger.length > 0) {
                    const image = values.dragger[0].originFileObj;
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
                        if (isNaN(values.phoneNumber) || isNaN(values.fax)) {
                            if (isNaN(values.phoneNumber)) {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }
                            if (isNaN(values.fax)) {
                                openNotificationForgetImageErrorRegex('Số fax')
                            }
                        } else {
                            if (regex.test(values.phoneNumber)) {
                                setList(resultsMockup[0].data.data[0])
                                const object = {
                                    // code: values.storeCode.toLowerCase(),
                                    name: values.storeName.toLowerCase(),
                                    logo: list ? list : '',
                                    phone: values.phoneNumber,
                                    email: ' ',
                                    fax: values.fax,
                                    website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                    latitude: " ",
                                    longtitude: " ",
                                    address: values && values.address ? values.address.toLowerCase() : '',
                                    ward: ' ',
                                    district: values.district.toLowerCase(),
                                    province: values.city.toLowerCase(),
                                    // default: false
                                }
                                addStoreData(object)
                            } else {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }
                        }

                    }
                } else {
                    if (isNaN(values.phoneNumber) || isNaN(values.fax)) {
                        if (isNaN(values.phoneNumber)) {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                        if (isNaN(values.fax)) {
                            openNotificationForgetImageErrorRegex('Số fax')
                        }
                    } else {
                        if (regex.test(values.phoneNumber)) {
                            const object = {
                                // code: values.storeCode.toLowerCase(),
                                name: values.storeName.toLowerCase(),
                                logo: list ? list : '',
                                phone: values.phoneNumber,
                                email: ' ',
                                fax: values.fax,
                                website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                latitude: " ",
                                longtitude: " ",
                                address: values && values.address ? values.address.toLowerCase() : '',
                                ward: ' ',
                                district: values.district.toLowerCase(),
                                province: values.city.toLowerCase(),
                                // default: false
                            }
                            addStoreData(object)
                        } else {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                    }
                }
            } else {
                if (values.dragger && values.dragger.length > 0) {
                    const image = values.dragger[0].originFileObj;
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
                        if (isNaN(values.phoneNumber)) {
                            if (isNaN(values.phoneNumber)) {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }

                        } else {
                            if (regex.test(values.phoneNumber)) {
                                setList(resultsMockup[0].data.data[0])
                                const object = {
                                    name: values.storeName.toLowerCase(),
                                    logo: list ? list : '',
                                    phone: values.phoneNumber,
                                    email: ' ',
                                    fax: 0,
                                    website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                    latitude: " ",
                                    longtitude: " ",
                                    address: values && values.address ? values.address.toLowerCase() : '',
                                    ward: ' ',
                                    district: values.district.toLowerCase(),
                                    province: values.city.toLowerCase(),
                                }
                                console.log(object)
                                console.log("123")
                                addStoreData(object)
                            } else {
                                openNotificationForgetImageErrorRegexPhone('Liên hệ')
                            }
                        }

                    }
                } else {
                    if (isNaN(values.phoneNumber)) {
                        if (isNaN(values.phoneNumber)) {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                    } else {
                        if (regex.test(values.phoneNumber)) {
                            const object = {
                                name: values.storeName.toLowerCase(),
                                logo: list ? list : '',
                                phone: values.phoneNumber,
                                email: ' ',
                                fax: 0,
                                website: values && values.websiteLink ? values.websiteLink.toLowerCase() : '',
                                latitude: " ",
                                longtitude: " ",
                                address: values && values.address ? values.address.toLowerCase() : '',
                                ward: ' ',
                                district: values.district.toLowerCase(),
                                province: values.city.toLowerCase(),
                                // default: false
                            }
                            addStoreData(object)
                        } else {
                            openNotificationForgetImageErrorRegexPhone('Liên hệ')
                        }
                    }
                }
            }

        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [province, setProvince] = useState([])
    const apiProvinceData = async () => {
        try {
            const res = await apiProvince();
            console.log(res)
            if (res.status === 200) {
                setProvince(res.data.data)
            }
            dispatch({ type: ACTION.LOADING, data: false });
        } catch (error) {

            dispatch({ type: ACTION.LOADING, data: false });
        }
    };

    useEffect(() => {
        apiProvinceData();
    }, []);
    const [districtMain, setDistrictMain] = useState([])
    const apiFilterCityData = async (object) => {
        try {
            dispatch({ type: ACTION.LOADING, data: true });
            const res = await apiFilterCity({ keyword: object });
            console.log(res)
            if (res.status === 200) {
                setDistrictMain(res.data.data)
            }
            dispatch({ type: ACTION.LOADING, data: false });
        } catch (error) {

            dispatch({ type: ACTION.LOADING, data: false });
        }
    };
    function handleChangeCity(value) {
        console.log(`selected ${value}`);
        apiFilterCityData(value)
    }
    useEffect(() => {
        if (state === 1 || state === '1') {
            modal3VisibleModal(true)
        }
    }, [])
    const dataValue = form.getFieldValue()
    dataValue.district = districtMain && districtMain.length > 0 ? districtMain[districtMain.length - 2].district_name : '';
    return (
        <>
            <div onClick={() => modal3VisibleModal(true)}>
                <Button icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />} type="primary">Thêm cửa hàng</Button>
            </div>
            {
                state === 1 || state === '1' ? (
                    <Modal
                        title="Thêm cửa hàng"
                        centered
                        width={1000}
                        footer={null}
                        visible={modal3Visible}
                    // onOk={() => modal3VisibleModal(false)}
                    // onCancel={() => modal3VisibleModal(false)}
                    >

                        <Form
                            className={styles["supplier_add_content"]}
                            onFinish={onFinish}
                            form={form}
                            layout="vertical"
                            onFinishFailed={onFinishFailed}
                        >

                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={5} md={5} lg={5} xl={5}>
                                    <div>
                                        <Dragger {...propsMain}>
                                            {
                                                list ? (<p style={{ marginTop: '1.25rem', }} className="ant-upload-drag-icon">

                                                    <img src={list} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                                                </p>) : (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                                                    <PlusOutlined />

                                                    <div>Thêm ảnh</div>

                                                </p>)
                                            }
                                        </Dragger>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>

                                        <Form.Item

                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Tên cửa hàng</div>}
                                            name="storeName"
                                            rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                        >
                                            <Input placeholder="Nhập tên cửa hàng" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                                        <Form.Item


                                            name="address"

                                        >
                                            <Input placeholder="Nhập địa chỉ" />
                                        </Form.Item>

                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <Form.Item

                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                            name="phoneNumber"
                                            rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                        >
                                            <Input placeholder="Nhập liên hệ" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <Form.Item
                                            name="city"
                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                        >
                                            <Select
                                                onChange={handleChangeCity}
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="Chọn tỉnh/thành phố"
                                                optionFilterProp="children"


                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    province && province.length > 0 && province.map((values, index) => {
                                                        return <Option value={values.province_name}>{values.province_name}</Option>
                                                    })
                                                }

                                            </Select>
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Số fax</div>
                                        <Form.Item

                                            className={styles["supplier_add_content_supplier_code_input"]}
                                            name="fax"

                                        >
                                            <Input placeholder="Nhập số fax" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                {
                                    districtMain && districtMain.length > 0 ? (

                                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                            <div>
                                                <Form.Item
                                                    name="district"
                                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                                                    hasFeedback
                                                    rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                                >
                                                    <Select showSearch
                                                        style={{ width: '100%' }}
                                                        placeholder="Select a person"
                                                        optionFilterProp="children"


                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }>
                                                        {
                                                            districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                                                                return (
                                                                    <Option value={values.district_name}>{values.district_name}</Option>
                                                                )
                                                            })
                                                        }


                                                    </Select>


                                                </Form.Item>
                                            </div>
                                        </Col>

                                    ) : ('')

                                }


                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Link website</div>
                                        <Form.Item

                                            className={styles["supplier_add_content_supplier_code_input"]}
                                            name="websiteLink"

                                        >
                                            <Input placeholder="Nhập link website" />

                                        </Form.Item>

                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                                    <Form.Item>
                                        <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                    </Modal>
                ) : (
                    <Modal
                        title="Thêm cửa hàng"
                        centered
                        width={1000}
                        footer={null}
                        visible={modal3Visible}
                        onOk={() => modal3VisibleModal(false)}
                        onCancel={() => modal3VisibleModal(false)}
                    >

                        <Form
                            className={styles["supplier_add_content"]}
                            onFinish={onFinish}
                            form={form}
                            layout="vertical"
                            onFinishFailed={onFinishFailed}
                        >

                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={5} md={5} lg={5} xl={5}>
                                    <div>
                                        <Dragger {...propsMain}>
                                            {
                                                list ? (<p style={{ marginTop: '1.25rem', }} className="ant-upload-drag-icon">

                                                    <img src={list} style={{ width: '7.5rem', height: '5rem', objectFit: 'contain' }} alt="" />

                                                </p>) : (<p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">

                                                    <PlusOutlined />

                                                    <div>Thêm ảnh</div>

                                                </p>)
                                            }
                                        </Dragger>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>

                                        <Form.Item

                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Tên cửa hàng</div>}
                                            name="storeName"
                                            rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                        >
                                            <Input placeholder="Nhập tên cửa hàng" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                                        <Form.Item


                                            name="address"

                                        >
                                            <Input placeholder="Nhập địa chỉ" />
                                        </Form.Item>

                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <Form.Item

                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                            name="phoneNumber"
                                            rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                        >
                                            <Input placeholder="Nhập liên hệ" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <Form.Item
                                            name="city"
                                            label={<div style={{ color: 'black', fontWeight: '600' }}>Tỉnh/thành phố</div>}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                        >
                                            <Select
                                                onChange={handleChangeCity}
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="Chọn tỉnh/thành phố"
                                                optionFilterProp="children"


                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    province && province.length > 0 && province.map((values, index) => {
                                                        return <Option value={values.province_name}>{values.province_name}</Option>
                                                    })
                                                }

                                            </Select>
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Số fax</div>
                                        <Form.Item

                                            className={styles["supplier_add_content_supplier_code_input"]}
                                            name="fax"

                                        >
                                            <Input placeholder="Nhập số fax" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                {
                                    districtMain && districtMain.length > 0 ? (
                                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                            <div>
                                                <Form.Item
                                                    name="district"
                                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                                                    hasFeedback
                                                    rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                                >
                                                    <Select showSearch
                                                        style={{ width: '100%' }}
                                                        placeholder="Select a person"
                                                        optionFilterProp="children"


                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }>
                                                        {
                                                            districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                                                                return (
                                                                    <Option value={values.district_name}>{values.district_name}</Option>
                                                                )
                                                            })
                                                        }


                                                    </Select>


                                                </Form.Item>
                                            </div>
                                        </Col>
                                    ) : ('')
                                }

                                <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                    <div>
                                        <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Link website</div>
                                        <Form.Item

                                            className={styles["supplier_add_content_supplier_code_input"]}
                                            name="websiteLink"

                                        >
                                            <Input placeholder="Nhập link website" />

                                        </Form.Item>

                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                                <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                                    <Form.Item>
                                        <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                )
            }
        </>
    );
}
