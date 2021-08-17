import { Modal, Row, Col } from "antd";
import { useEffect, useState } from "react";

export default function CustomerInfo(props) {
    const { visible, onCancel } = props
    const [infoCustomer, setInfoCustomer] = useState(props.infoCustomer)
    useEffect(() => {
        setInfoCustomer(props.infoCustomer)
    }, [props.infoCustomer])
    return (
        <Modal visible={visible} onCancel={onCancel} onOk={onCancel} width={700}>
            <Row justify="space-between" gutter={[20, 20]}>
                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div >
                                <b>Mã khách hàng:</b> {infoCustomer.code}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Ngày sinh:</b> {infoCustomer.birthday}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Tên khách hàng:</b> {infoCustomer.full_name}
                            </div>
                        </Col>

                    </Row>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Liên hệ:</b> {infoCustomer.phone}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Loại khách hàng:</b> {infoCustomer.type == 'POTENTIAL' ? 'Tiềm năng' : 'Vãng lai'}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    style={{ width: '100%' }}
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Địa chỉ:</b> {infoCustomer.address}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Tên:</b> {infoCustomer.last_name}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Tỉnh/thành phố:</b> {infoCustomer.province}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Họ:</b> {infoCustomer.first_name}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Quận/huyện:</b> {infoCustomer.district}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={11}
                    lg={11}
                    xl={11}
                >
                    <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                <b>Email:</b> {infoCustomer.email}
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    )
}