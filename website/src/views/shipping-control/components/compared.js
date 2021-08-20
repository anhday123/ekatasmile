import { Col, Row, Input, DatePicker, Select, Button, Table } from "antd";

export default function Compared(props) {
    const { compareList } = props
    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "code"
        },
        {
            title: "Mã vận đơn",
            dataIndex: "code"
        },
        {
            title: "DVVC",
            dataIndex: ""
        },
        {
            title: "Tên khách hàng",
            dataIndex: ""
        },
        {
            title: "Mã số khách",
            dataIndex: ""
        },
        {
            title: "Ngày tạo đơn",
            dataIndex: "revice_date"
        },
        {
            title: "Tiền COD",
            dataIndex: "cod_cost"
        },
        {
            title: "tiền chuyển khoản",
            dataIndex: "transfer_cost"
        },
        {
            title: "Phí vận chuyển",
            dataIndex: "delivery_cost"
        },
        {
            title: "Tiền COD thực nhận",
            dataIndex: "real_cod_cost"
        },
        {
            title: "Phí bảo hiểm",
            dataIndex: "insurance_cost"
        },
        {
            title: "Phí giao hàng",
            dataIndex: "shipping_cost"
        },
        {
            title: "Phí chuyển hoàn",
            dataIndex: "warehouse_cost"
        },
        {
            title: "Phí lưu kho",
            dataIndex: "warehouse_cost"
        },
        {
            title: "Khối lượng",
            dataIndex: "weight",
            render(data) {
                return data + 'kg'
            }
        },
        {
            title: "Ngày nhận",
            dataIndex: "revice_date"
        },

        {
            title: "Ngày hoàn thành",
            dataIndex: "complete_date"
        },
        {
            title: "Ghi chú đơn",
            dataIndex: "note",
            width: 200
        },
        {
            title: "Trạng thái",
            dataIndex: "status"
        }
    ]
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
                <Button type="primary" >Setting Column</Button>
            </Row>
            <Table columns={columns} scroll={{ x: "max-content" }} dataSource={compareList.filter(e => e.status.toLowerCase() == 'complete')} />
        </div>
    )
}