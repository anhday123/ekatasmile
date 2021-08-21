import React, { useEffect, useState } from "react";
import { Popconfirm, message, Input, Button, Row, Col, DatePicker, Select, Table } from "antd";
import moment from 'moment';
import ImportFile from "./ImportFile";
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function PenddingCompare(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isOpenSelect, setIsOpenSelect] = useState(false)
    const [filter, setFilter] = useState({ keyword: '', from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD'), branch: "" })
    const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
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
    const onSearch = (value) => props.setFilter({ ...filter, keyword: value.target.value })
    const changeRange = (date, dateString) => {
        props.setFilter({ ...filter, from_date: dateString[0], to_date: dateString[1] })
    }
    const changeTimeOption = (value) => {
        switch (value) {
            case "to_day":
                props.setFilter({ ...filter, from_date: moment().format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') })
                break
            case "yesterday":
                props.setFilter({ ...filter, from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'days').format('YYYY-MM-DD') })
                break
            case "this_week":
                props.setFilter({ ...filter, from_date: moment().startOf('week').format('YYYY-MM-DD'), to_date: moment().endOf('week').format('YYYY-MM-DD') })
                break
            case "last_week":
                props.setFilter({ ...filter, from_date: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD') })
                break
            case "this_month":
                props.setFilter({ ...filter, from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') })
                break
            case "last_month":
                props.setFilter({ ...filter, from_date: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') })
                break
            case "this_year":
                props.setFilter({ ...filter, from_date: moment().startOf('years').format('YYYY-MM-DD'), to_date: moment().endOf('years').format('YYYY-MM-DD') })
                break
            case "last_year":
                props.setFilter({ ...filter, from_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'), to_date: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') })
                break
            default:
                props.setFilter({ ...filter, from_date: moment().startOf('month').format('YYYY-MM-DD'), to_date: moment().format('YYYY-MM-DD') })
                break;
        }
    }
    // useEffect(() => {
    //     props.props.props.setFilter(filter)
    // }, [filter])
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
                        <Select
                            open={isOpenSelect}
                            onBlur={() => {
                                if (isOpenSelect) toggleOpenSelect()
                            }}
                            onClick={() => {
                                if (!isOpenSelect) toggleOpenSelect()
                            }}
                            style={{ width: 380 }}
                            placeholder="Choose time"
                            allowClear
                            onChange={async (value) => {
                                if (isOpenSelect) toggleOpenSelect()
                                changeTimeOption(value)
                            }}
                            dropdownRender={(menu) => (
                                <div>
                                    <RangePicker
                                        onFocus={() => {
                                            if (!isOpenSelect) toggleOpenSelect()
                                        }}
                                        onBlur={() => {
                                            if (isOpenSelect) toggleOpenSelect()
                                        }}
                                        style={{ width: '100%' }}
                                        onChange={changeRange}
                                    />
                                    {menu}
                                </div>
                            )}>
                            <Option value="to_day">Today</Option>
                            <Option value="yesterday">Yesterday</Option>
                            <Option value="this_week">This week</Option>
                            <Option value="last_week">Last week</Option>
                            <Option value="last_month">Last month</Option>
                            <Option value="this_month">This month</Option>
                            <Option value="this_year">This year</Option>
                            <Option value="last_year">Last year</Option>
                        </Select>
                    </div>
                </Col>
                <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
                    <Select placeholder="Chọn chi nhánh" style={{ width: '100%' }}
                        onChange={(e) =>
                            props.setFilter({
                                ...filter,
                                branch: e,
                            })}>
                        {
                            props.branchList.filter(e => e.active).map(e => <Option value={e.branch_id}>{e.name}</Option>)
                        }
                    </Select>
                </Col>

            </Row>
            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>

                        <Col style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                            <ImportFile />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
                <Table
                    rowSelection={rowSelection}
                    columns={penddingCompareColumns}
                    style={{ width: '100%' }}
                    dataSource={compareList.filter(e => e.status ? e.status.toLowerCase() != 'complete' : false)}
                    scroll={{ y: 500 }}
                    rowKey="_id"
                />
            </div>
        </div>
    )
}