import { Col, Row, Input, DatePicker, Select, Button, Table } from "antd";
import { useState } from "react";
import SessionHistory from "./sessionHistory";
import moment from 'moment'
export default function CompareHistory(props) {
    const { compareList } = props
    const [showDetail, setShowDetail] = useState(false)
    const [sessionDetail, setSessionDetail] = useState({})
    const columns = [
        {
            title: "Mã phiên đối soát",
            dataIndex: "code",
            render(data, record) {
                return <span style={{ color: '#40a9ff', cursor: "pointer" }} onClick={() => {
                    setSessionDetail(record);
                    setTimeout(() =>
                        setShowDetail(true), 200)
                }}>
                    {data}</span>
            }
        },
        {
            title: "Thời gian đối soát",
            dataIndex: "create_date",
            render(data) {
                return moment(data).format('DD-MM-YYYY hh:mm')
            }
        },
        {
            title: "Hình thức đối soát",
            dataIndex: 'type'
        },
        {
            title: "File đính kèm",
            dataIndex: "file",
            render(data) {
                return <a href={data} target="_blank">Tải file</a>
            }
        }
    ]
    console.log(compareList);
    return (
        <div>
            <Row gutter={30} justify="space-between">
                <Col span={8}>
                    <Input placeholder="Tìm theo mã, theo tên" />
                </Col>
                <Col span={8}>
                    <DatePicker.RangePicker />
                </Col>
                <Col span={8}>
                    <Select placeholder="Chọn chi nhánh" style={{ width: "100%" }}></Select>
                </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 15, marginBottom: 15 }}>
                <Button type="primary" style={{ background: "rgba(0, 136, 22, 1)", marginRight: 20, border: "none" }}>Import phiếu đối soát</Button>
            </Row>
            <Table columns={columns} dataSource={compareList} />
            <SessionHistory data={sessionDetail} visible={showDetail} onClose={() => setShowDetail(false)} />
        </div>
    )
}