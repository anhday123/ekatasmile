import styles from "./../store-information-update/store-information-update.module.scss";
import React, { useState } from "react";
import { ACTION } from './../../../consts/index'
import axios from 'axios';
import noimage from './../../../assets/img/noimage.jpg'
import { updateStore } from "./../../../apis/store";
import { useDispatch } from 'react-redux'
import { Input, Button, Row, Col,notification, Select, Modal, Form, Upload,} from "antd";
import { EditOutlined, } from "@ant-design/icons";
const { Option } = Select;

export default function StoreInformationUpdate({ recordDataMain, storeUpdateChild }) {
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const [modal5Visible, setModal5Visible] = useState(false)

    const modal5VisibleModal = (modal5Visible) => {
        setModal5Visible(modal5Visible)
        const update = form.getFieldValue()
        update.storeName = recordDataMain.name;
        update.address = recordDataMain.address;
        update.phoneNumber = recordDataMain.phone;
        update.city = recordDataMain.province;
        update.district = recordDataMain.district;
        update.fax = recordDataMain.fax;
        update.websiteLink = recordDataMain.website;

    }
    const openNotificationSuccessStore = () => {
        notification.success({
            message: 'Thành công',
            duration: 3,
            description:
                'Thêm thông tin cửa hàng thành công.',
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
    const openNotificationErrorStoreRegex = (data) => {
        notification.error({
            message: 'Thất bại',
            duration: 3,
            description:
                `${data} phải là số`,
        });
    };
    const openNotificationErrorStoreRegexPhone = (data) => {
        notification.error({
            message: 'Thất bại',
            duration: 3,
            description:
                `${data} phải là số và có độ dài là 10`,
        });
    };

    const updateStoreData = async (object, id) => {
        try {
            dispatch({ type: ACTION.LOADING, data: true });
            const res = await updateStore(object, id);
            console.log(res);
            if (res.status === 200) {
                storeUpdateChild(1)
                openNotificationSuccessStore()
                modal5VisibleModal(false)
          
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
    const onFinish = async (values) => {
        const image = values.dragger && values.dragger.length > 0 && values.dragger[0].originFileObj;
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
            dispatch({ type: ACTION.LOADING, data: false });
            if (isNaN(values.phoneNumber) || isNaN(values.fax)) {
                if (isNaN(values.phoneNumber)) {
                    openNotificationErrorStoreRegexPhone('Liên hệ')
                }
                if (isNaN(values.fax)) {
                    openNotificationErrorStoreRegex('Số fax')
                }
            } else {
                if (regex.test(values.phoneNumber)) {
                    const object = {
                        // code: values.storeCode.toLowerCase(),
                        name: values.storeName.toLowerCase(),
                        logo: values.dragger && values.dragger.length > 0 ? resultsMockup[0].data.data[0] : recordDataMain.logo,
                        phone: values.phoneNumber,
                        email: values.email,
                        fax: values.fax,
                        website: values && values.websiteLink ? values.websiteLink : '',
                        // default: values.defaultStore,
                        latitude: " ",
                        longtitude: " ",
                        address: values && values.address ? values.address.toLowerCase() : '',
                        ward: '',
                        district: values.district.toLowerCase(),
                        province: values.city.toLowerCase()
                    }
                    updateStoreData(object, recordDataMain.store_id)
                } else {
                    openNotificationErrorStoreRegexPhone('Liên hệ')
                }
            }
        }

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
    return (
        <>
            <div onClick={() => modal5VisibleModal(true)} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
            <Modal
                title={`Cập nhật thông tin cửa hàng ${recordDataMain.name}`}
                centered
                width={1000}
                footer={null}
                visible={modal5Visible}
                onOk={() => modal5VisibleModal(false)}
                onCancel={() => modal5VisibleModal(false)}
            >
                <Form
                    className={styles["supplier_add_content"]}
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    onFinishFailed={onFinishFailed}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <Form.Item>
                                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                        <Upload.Dragger fileList={recordDataMain.logo} name="files" action="/upload.do">
                                            <p style={{ marginTop: '1.25rem' }} className="ant-upload-drag-icon">
                                                {
                                                    recordDataMain && recordDataMain.logo ? (<img src={recordDataMain.logo} style={{ width: '10rem', height: '5rem', objectFit: 'contain' }} alt="" />) : (<img src={noimage} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" />)
                                                }
                                            </p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Form.Item>
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
                                    <Input placeHolder="cửa hàng A" />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <Form.Item
                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Địa chỉ</div>}
                                    name="address"
                                >
                                    <Input placeHolder="27 ngô y linh" />
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
                                    <Input placeHolder="0384943497" />
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
                                    <Select defaultValue="hcm">
                                        <Option value="hcm">Hồ Chí Minh</Option>
                                        <Option value="hn">Hà Nội</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <Form.Item
                                    name="district"
                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Quận/huyện</div>}
                                    hasFeedback
                                    rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                >
                                    <Select defaultValue="binhTan">
                                        <Option value="binhTan">Bình tân</Option>
                                        <Option value="goVap">Gò vấp</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Col>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Số fax</div>
                                <Form.Item
                                    className={styles["supplier_add_content_supplier_code_input"]}
                                    name="fax"
                                >
                                    <Input placeHolder="123456789" />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Link website</div>
                                <Form.Item
                                    className={styles["supplier_add_content_supplier_code_input"]}
                                    name="websiteLink"
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>

                        <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
                            <Form.Item>
                                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}
