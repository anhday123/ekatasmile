import UI from "./../../Layout/UI";
import styles from "./../store-information-update/store-information-update.module.scss";
import React, { useState, useEffect } from "react";
import { ACTION, ROUTES } from './../../../consts/index'
import axios from 'axios';
import noimage from './../../../assets/img/noimage.jpg'
import { addStore, getAllStore } from "./../../../apis/store";
import { useDispatch } from 'react-redux'
import { Input, Space, Button, Row, Col, DatePicker, notification, Select, Table, Modal, Form, Checkbox, Upload, message } from "antd";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import { AudioOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, CheckOutlined, ExclamationCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
export default function StoreInformationView(recordData) {
    console.log("|||")
    console.log(recordData)
    const dispatch = useDispatch()
    const { Search } = Input;
    const [store, setStore] = useState([])
    const [form] = Form.useForm();
    const [modal2Visible, setModal2Visible] = useState(false)
    const [modal3Visible, setModal3Visible] = useState(false)
    const [modal4Visible, setModal4Visible] = useState(false)
    const [modal5Visible, setModal5Visible] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const modal3VisibleModal = (modal3Visible) => {
        setModal3Visible(modal3Visible)
    }
    const [record, setRecord] = useState({});
    const modal4VisibleModalInfo = (modal4Visible, record) => {
        setModal4Visible(modal4Visible)
        console.log(record)
        setRecord(record)
    }
    const modal4VisibleModal = (modal4Visible) => {
        setModal4Visible(modal4Visible)
    }
    const modal5VisibleModal = (modal5Visible) => {
        setModal5Visible(modal5Visible)
    }

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

    const getAllStoreData = async () => {
        try {
            //  dispatch({ type: ACTION.LOADING, data: true });
            const res = await getAllStore();
            console.log(res)
            if (res.status === 200) {
                setStore(res.data.data)
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
                <div onClick={() => modal4VisibleModal(true)}><ExclamationCircleOutlined style={{ fontSize: '1.25rem', marginRight: '0.5rem', cursor: 'pointer', color: '#096E00' }} /></div>
                <div onClick={() => modal5VisibleModal(true)} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
                <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
            </div>,
        });
    }



    return (
        <>
            <div style={{ color: '#40A9FF', cursor: 'pointer' }} onClick={() => modal4VisibleModalInfo(true, recordData.recordData)}>{recordData.recordData.code}</div>
            <Modal
                title={`Thông tin chi tiết cửa hàng ${recordData.recordData.name}`}
                centered
                width={720}
                footer={null}
                visible={modal4Visible}
                onOk={() => modal4VisibleModal(false)}
                onCancel={() => modal4VisibleModal(false)}
            >
                <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={11} md={11} lg={7} xl={7}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                            {
                                record && record.logo ? (<img src={record.logo} style={{ width: '10rem', height: '10rem', objectFit: 'contain' }} alt="" />) : (<img src={noimage} style={{ width: '10rem', height: '10rem', objectFit: 'contain' }} alt="" />)
                            }
                        </div></Col>

                    <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                        <div className={styles['information_store_modal']}>
                            <div><b style={{ marginRight: '0.25rem' }}>Địa chỉ:</b> {record.address}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Quận/huyện:</b> {record.district}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Thành phố: </b> {record.province}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Ngày tạo: </b> {moment(record.create_date).format("YYYY-MM-DD")}</div>
                            {/* <div><b style={{ marginRight: '0.25rem' }}>Ngày hết hạn: </b> {moment(record.create_date).format("YYYY-MM-DD")}</div> */}
                        </div>
                    </Col>

                    <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                        <div className={styles['information_store_modal']}>
                            <div><b style={{ marginRight: '0.25rem' }}>Liên hệ:</b> {record.phone}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Mã cửa hàng:</b> {record.code}</div>
                            {/* <div><b style={{ marginRight: '0.25rem' }}>Email: </b> anhhung_so11@yahoo.com</div> */}
                            <div><b style={{ marginRight: '0.25rem' }}>Fax: </b> {record.fax}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Link website: </b> {record.website}</div>
                        </div>
                    </Col>

                </Row>
            </Modal>
        </>
    );
}
