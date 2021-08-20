import { Drawer, Row, Col, Form, Input, Select, DatePicker, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { apiAllShipping } from "../../../apis/shipping";

export default function CreateCompare(props) {
    const { visible, onClose } = props
    const [transportList, setTransportList] = useState([])
    const onFinish = (value) => {

    }
    const getTransport = async () => {
        try {
            const res = await apiAllShipping()
            if (res.data.status) {
                setTransportList(res.data.data)
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getTransport()
    }, [])
    return (
        <Drawer visible={visible} onClose={onClose} width={1100} title="Tạo đối soát">
            <Form>
                <Row justify="space-between">
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Đơn vị vận chuyển</Col>
                            <Col span={16}>
                                <Form.Item>
                                    <Select>
                                        {
                                            transportList.map(e => (<Select.Option value={e.transport_id}>{e.name}</Select.Option>))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Mã vận đơn</Col>
                            <Col span={16}>
                                <Form.Item name="order">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Phí vận chuyển</Col>
                            <Col span={16}>
                                <Form.Item name="transfer_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Tiền COD thực nhận</Col>
                            <Col span={16}>
                                <Form.Item name="real_cod_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Phí giao hàng</Col>
                            <Col span={16}>
                                <Form.Item name="shipping_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Phí chuyển hoàn</Col>
                            <Col span={16} >
                                <Form.Item name="delivery_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Ngày nhận đơn</Col>
                            <Col span={16}>
                                <Form.Item name="revice_date">
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Trạng thái vận chuyển</Col>
                            <Col span={16}>
                                <Form.Item name="status">
                                    <Select>
                                        <Select.Option value="PROCESSING">Processing</Select.Option>
                                        <Select.Option value="REFUN">Refun</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Ngày hoàn thành</Col>
                            <Col span={16}>
                                <Form.Item name="complete_date">
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Phí bảo hiểm</Col>
                            <Col span={16}>
                                <Form.Item name="insurance_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Khối lượng (kg)</Col>
                            <Col span={16}>
                                <Form.Item name="weight">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={11}>
                        <Row>
                            <Col span={8}>Phí lưu kho</Col>
                            <Col span={16}>
                                <Form.Item name="warehouse_cost">
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Form>
        </Drawer>
    )
}