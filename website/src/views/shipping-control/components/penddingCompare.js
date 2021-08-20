import React, { useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Select, Table } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function PenddingCompare(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const { compareList } = props
    const penddingCompareColumns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code',
            width: 150,
        },
        {
            title: 'Mã vận đơn',
            dataIndex: 'code',
            width: 150,
        },
        {
            title: 'Đơn vị vận chuyển',
            dataIndex: 'shipping_company',
            width: 150,
        },
        {
            title: "Tên khách hàng",
            width: 150,
        },
        {
            title: "Mã số khách",
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'revice_date',
            width: 150,
        },
        {
            title: 'Tiền CoD',
            dataIndex: 'cod_cost',
            width: 150,
        },
        {
            title: 'Tiền chuyển khoản',
            dataIndex: 'transfer_cost',
            width: 150,
        },
        {
            title: "Ghi chú đơn",
            dataIndex: "note",
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150,
        },
    ];
    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const onSearch = (value) => console.log(value);
    function onChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    }
    function confirm(e) {
        console.log(e);
        message.success('Click on Yes');
    }

    function cancel(e) {
        console.log(e);
        message.error('Click on No');
    }
    function onChangeMain(date, dateString) {
        console.log(date, dateString);
    }
    function handleChange(value) {
        console.log(`selected ${value}`);
    }
    return (
        <div>
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
                    <div style={{ width: '100%' }}>
                        <Input
                            placeholder="Tìm kiếm theo mã, theo tên"
                            onChange={onSearch}
                            enterButton
                        /></div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
                    <div style={{ width: '100%' }}>
                        <RangePicker
                            style={{ width: '100%' }}
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={onChange}
                        />
                    </div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
                    <Select placeholder="Chọn chi nhánh" style={{ width: '100%' }}>

                    </Select>
                </Col>

            </Row>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>

                        <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                            <Button icon={<FileExcelOutlined />} style={{ backgroundColor: '#008816', color: 'white' }}>Import phiếu đối soát</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
                <Table
                    rowSelection={rowSelection}
                    columns={penddingCompareColumns}
                    style={{ width: '100%' }}
                    dataSource={compareList.filter(e => e.status.toLowerCase() != 'complete')}
                    scroll={{ y: 500 }}
                />
            </div>
        </div>
    )
}