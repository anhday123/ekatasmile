import styles from './../shipping-product/shipping-product.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  notification,
  Drawer,
  Typography,
  Space,
} from 'antd'

import { PERMISSIONS } from 'consts'

import { Link, useHistory } from 'react-router-dom'
import { PlusCircleOutlined, FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getDelivery, UpdateDelivery } from '../../apis/delivery'

//components
import ImportModal from 'components/ExportCSV/importModal'
import exportToCSV from 'components/ExportCSV/export'
import ChangeStatusModal from 'components/shipping-product/changeStatus'
import Permission from 'components/permission'
import ShippingProductAdd from 'views/actions/shipping-product/add'
import { compare, compareCustom } from 'utils'

import { ROUTES } from 'consts'
const { Option } = Select
const { RangePicker } = DatePicker
export default function ShippingProduct() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [totalRecord, setTotalRecord] = useState(0)
  const [deliveryList, setDeliveryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportVisible, setExportVisible] = useState(false)
  const [showMultiUpdate, setShowMultiUpdate] = useState(false)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const history = useHistory()

  const getAllDelivery = async (params) => {
    try {
      setLoading(true)
      const res = await getDelivery(params)
      console.log(res)
      if (res.status === 200) {
        setDeliveryList(res.data.data)
        setTotalRecord(res.data.count)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const updateMultiDelivery = async (data) => {
    try {
      if (data) {
        const res = await Promise.all(
          selectedRowKeys.map((e) => {
            return UpdateDelivery(e, { status: data })
          })
        )
        if (res.reduce((a, b) => a && b.data.success, true)) {
          notification.success({ message: 'Cập nhật thành công' })
          getAllDelivery({ ...paramsFilter })
          setShowMultiUpdate(false)
        }
      } else setShowMultiUpdate(false)
    } catch (e) {
      console.log(e)
    }
  }

  const onSearch = (value) => {
    setParamsFilter({ ...paramsFilter, search: value.target.value })
  }

  const columnsPromotion = [
    {
      title: 'STT',
      width: 50,
      render: (data, record, index) => index + 1,
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Nơi chuyển',
      dataIndex: 'from',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Nơi nhận',
      dataIndex: 'to',
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'create_date',
      // render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
      // sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Ngày chuyển',
      dataIndex: 'ship_time',
      // render: (data) => moment(data).format('DD-MM-YYYY hh:mm'),
      // sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),
    },
    {
      title: 'Nhân viên tạo',
      dataIndex: '_creator',
      // sorter: (a, b) =>
      //   compareCustom(
      //     a._creator ? `${a._creator.first_name} ${a._creator.last_name}` : '',
      //     b._creator ? `${b._creator.first_name} ${b._creator.last_name}` : ''
      //   ),
      // render: (text) => text && text.first_name + ' ' + text.last_name,
    },
  ]

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const ExportExcel = () => {
    exportToCSV(
      deliveryList.map((e) => {
        return {
          code: e.code,
          status: e.status,
          from: e.from.name,
          to: e.to.name,
          create_date: moment(e.create_date).format('DD-MM-YYYY hh:mm'),
          creator: e._creator,
        }
      }),
      'chuyen_hang'
    )
    setExportVisible(false)
  }
  const ExportButton = () => <Button onClick={ExportExcel}>Xuất excel</Button>

  const changeRange = (date, dateString) => {
    setParamsFilter({ ...paramsFilter, from_date: dateString[0], to_date: dateString[1] })
  }

  const changeTimeOption = (value) => {
    switch (value) {
      case 'to_day':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'yesterday':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        })
        break
      case 'this_week':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().startOf('week').format('YYYY-MM-DD'),
          to_date: moment().endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'last_week':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'this_month':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'last_month':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        })
        break
      case 'this_year':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().startOf('years').format('YYYY-MM-DD'),
          to_date: moment().endOf('years').format('YYYY-MM-DD'),
        })
        break
      case 'last_year':
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
        })
        break
      default:
        setParamsFilter({
          ...paramsFilter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
    }
  }

  useEffect(() => {
    let data = []
    const status = ['Chờ Chuyển', 'Đang Chuyển', 'Đã Hủy', 'Hoàn Thành']
    for (let i = 0; i < 40; i++)
      data.push({
        code: Math.floor(Math.random() * 500000),
        from: 'Cửa hàng 48',
        status: status[Math.floor(Math.random() * 3)],
        to: 'Nguyên Văn Trỗi',
        create_date: moment(new Date()).format('DD-MM-YYYY HH:mm'),
        ship_time: '04-12-2021 12:00',
        _creator: 'Van Hoang',
      })

    setDeliveryList([...data])
  }, [])

  useEffect(() => {
    getAllDelivery({ ...paramsFilter })
  }, [paramsFilter])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>Quản lý chuyển hàng</div>
          {/* <div className={styles['promotion_manager_button']}>
            <Permission permissions={[PERMISSIONS.tao_phieu_chuyen_hang]}>
              <Button
                size="large"
                icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                type="primary"
                onClick={() => history.push(ROUTES.SHIPPING_PRODUCT_ADD)}
              >
                Tạo phiếu chuyển hàng
              </Button>
            </Permission>
          </div> */}
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Input size="large" placeholder="Tìm kiếm theo mã" onChange={onSearch} allowClear />
            </div>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <Select
              size="large"
              open={isOpenSelect}
              defaultValue="this_month"
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
              )}
            >
              <Option value="to_day">Today</Option>
              <Option value="yesterday">Yesterday</Option>
              <Option value="this_week">This week</Option>
              <Option value="last_week">Last week</Option>
              <Option value="last_month">Last month</Option>
              <Option value="this_month">This month</Option>
              <Option value="this_year">This year</Option>
              <Option value="last_year">Last year</Option>
            </Select>
          </Col>
          <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Select
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="Lọc theo trạng thái"
                value={paramsFilter.status}
                onChange={(e) => setParamsFilter({ ...paramsFilter, status: e })}
              >
                <Option value="processing">Chờ chuyển</Option>
                <Option value="shipping">Đang chuyển</Option>
                <Option value="cancel">Đã hủy</Option>
                <Option value="complete">Hoàn thành</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 30 }}>
          <Space>
            {/* <Button size="large" type="primary" >
              Xóa bộ lọc
            </Button> */}
            <Button
              size="large"
              icon={<FileExcelOutlined />}
              style={{
                backgroundColor: '#008816',
                color: 'white',
              }}
              onClick={() => setExportVisible(true)}
            >
              Xuất excel
            </Button>
          </Space>
        </Row>
        <Row style={{ width: '100%' }}>
          {selectedRowKeys.length ? (
            <Permission permissions={[PERMISSIONS.cap_nhat_trang_thai_phieu_chuyen_hang]}>
              <Button size="large" type="primary" onClick={() => setShowMultiUpdate(true)}>
                Cập nhật trạng thái
              </Button>
            </Permission>
          ) : (
            ''
          )}
        </Row>

        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            size="small"
            rowSelection={rowSelection}
            loading={loading}
            columns={columnsPromotion}
            rowKey="delivery_id"
            pagination={{
              page: paramsFilter.page,
              pageSize: paramsFilter.page_size,
              onChange: (page, pageSize) =>
                setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
              total: totalRecord,
            }}
            dataSource={deliveryList}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <Drawer
        visible={showCreate}
        width="75%"
        onClose={() => setShowCreate(false)}
        title="Tạo phiếu chuyển hàng"
        bodyStyle={{ padding: 0 }}
      >
        <ShippingProductAdd close={() => setShowCreate(false)} />
      </Drawer>
      <ImportModal
        visible={exportVisible}
        onCancel={() => setExportVisible(false)}
        dataSource={deliveryList}
        columns={columnsPromotion}
        actionComponent={<ExportButton />}
      />
      <ChangeStatusModal
        onCancel={() => setShowMultiUpdate(false)}
        onOk={updateMultiDelivery}
        visible={showMultiUpdate}
      />
    </>
  )
}
