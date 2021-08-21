import styles from "./../store-information-update/store-information-update.module.scss";
import React, { useState } from "react";
import noimage from './../../../assets/img/noimage.jpg'
import { Row, Col,  Modal, } from "antd";
import moment from 'moment';
export default function StoreInformationView(recordData) {
    const [modal4Visible, setModal4Visible] = useState(false)
    const [record, setRecord] = useState({});
    const modal4VisibleModalInfo = (modal4Visible, record) => {
        setModal4Visible(modal4Visible)
        console.log(record)
        setRecord(record)
    }
    const modal4VisibleModal = (modal4Visible) => {
        setModal4Visible(modal4Visible)
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
                        </div>
                    </Col>

                    <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                        <div className={styles['information_store_modal']}>
                            <div><b style={{ marginRight: '0.25rem' }}>Liên hệ:</b> {record.phone}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Mã cửa hàng:</b> {record.code}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Fax: </b> {record.fax}</div>
                            <div><b style={{ marginRight: '0.25rem' }}>Link website: </b> {record.website}</div>
                        </div>
                    </Col>

                </Row>
            </Modal>
        </>
    );
}
