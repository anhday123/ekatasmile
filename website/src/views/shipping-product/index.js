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
} from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { PlusCircleOutlined, FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getDelivery, UpdateDelivery } from '../../apis/delivery'
import ImportModal from '../../components/ExportCSV/importModal'
import exportToCSV from '../../components/ExportCSV/export'
import ChangeStatusModal from 'components/shipping-product/changeStatus'
const { Option } = Select
const { RangePicker } = DatePicker

export default function ShippingProduct() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [totalRecord, setTotalRecord] = useState(0)
  const [deliveryList, setDelivery] = useState([])
  const [loading, setLoading] = useState(false)
  const [exportVisible, setExportVisible] = useState(false)
  const [showMultiUpdate, setShowMultiUpdate] = useState(false)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState({
    keyword: '',
    from_date: moment().startOf('month').format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
  })
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const history = useHistory()

  const changePage = (page, page_size) => {
    setPagination({ page, page_size })
  }

  const getAllDelivery = async (params) => {
    try {
      setLoading(true)
      const res = await getDelivery({
        ...params,
        page: pagination.page,
        page_size: pagination.page_size,
      })
      if (res.status == 200) {
        setDelivery(res.data.data)
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
          getAllDelivery({ ...filter })
          setShowMultiUpdate(false)
        }
      } else setShowMultiUpdate(false)
    } catch (e) {
      console.log(e)
    }
  }

  const onSearch = (value) => {
    setFilter({ ...filter, keyword: value })
  }
  function handleChange(value) {
    // console.log(`selected ${value}`);
  }
  const columnsPromotion = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return (pagination.page - 1) * pagination.page_size + index + 1
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: 'Nơi chuyển',
      dataIndex: 'from',
      width: 150,
      render(data) {
        return data.name
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render(data, record) {
        switch (data) {
          case 'PROCESSING': {
            return (
              <div
                onClick={() => onClickStatus(record)}
                style={{
                  color: '#FF9D0A',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Chờ chuyển
              </div>
            )
          }
          case 'SHIPPING': {
            return (
              <div
                onClick={() => onClickStatus(record)}
                style={{
                  color: 'rgba(47, 155, 255, 1)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Đang chuyển
              </div>
            )
          }
          case 'CANCEL': {
            return (
              <div
                onClick={() => onClickStatus(record)}
                style={{
                  color: '#ff7875',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Đang hủy
              </div>
            )
          }
          case 'CANCEL_FINISH': {
            return (
              <div
                onClick={() => onClickStatus(record)}
                style={{ color: 'red', fontWeight: '600', cursor: 'pointer' }}
              >
                Đã Hủy
              </div>
            )
          }
          case 'COMPLETE': {
            return (
              <div
                onClick={() => onClickStatus(record)}
                style={{
                  color: 'rgba(26, 184, 0, 1)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Hoàn thành
              </div>
            )
          }
        }
      },
    },
    {
      title: 'Nơi nhận',
      dataIndex: 'to',
      width: 150,
      render(data) {
        return data.name
      },
    },
    {
      title: 'Ngày chuyển',
      dataIndex: 'create_date',
      width: 150,
      render(data) {
        return moment(data).format('DD-MM-YYYY hh:mm')
      },
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'dateReceive',
      width: 150,
    },
    {
      title: 'Nhân viên tạo',
      dataIndex: '_creator',
      width: 150,
    },
  ]
  const onClickStatus = (data) => {
    history.push({ pathname: '/actions/shipping-product/update', state: data })
  }
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
    setFilter({ ...filter, from_date: dateString[0], to_date: dateString[1] })
  }
  const changeTimeOption = (value) => {
    switch (value) {
      case 'to_day':
        setFilter({
          ...filter,
          from_date: moment().format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'yesterday':
        setFilter({
          ...filter,
          from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        })
        break
      case 'this_week':
        setFilter({
          ...filter,
          from_date: moment().startOf('week').format('YYYY-MM-DD'),
          to_date: moment().endOf('week').format('YYYY-MM-DD'),
        })
        break
      case 'last_week':
        setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'weeks')
            .startOf('week')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'weeks')
            .endOf('week')
            .format('YYYY-MM-DD'),
        })
        break
      case 'this_month':
        setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
      case 'last_month':
        setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
        })
        break
      case 'this_year':
        setFilter({
          ...filter,
          from_date: moment().startOf('years').format('YYYY-MM-DD'),
          to_date: moment().endOf('years').format('YYYY-MM-DD'),
        })
        break
      case 'last_year':
        setFilter({
          ...filter,
          from_date: moment()
            .subtract(1, 'year')
            .startOf('year')
            .format('YYYY-MM-DD'),
          to_date: moment()
            .subtract(1, 'year')
            .endOf('year')
            .format('YYYY-MM-DD'),
        })
        break
      default:
        setFilter({
          ...filter,
          from_date: moment().startOf('month').format('YYYY-MM-DD'),
          to_date: moment().format('YYYY-MM-DD'),
        })
        break
    }
  }
  useEffect(() => {
    getAllDelivery()
  }, [])
  useEffect(() => {
    getAllDelivery({ ...filter })
  }, [filter, pagination])
  return (
    <>
      <div className={styles['promotion_manager']}>
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
          <div className={styles['promotion_manager_title']}>
            Quản lý chuyển hàng
          </div>
          <div className={styles['promotion_manager_button']}>
            <Button
              onClick={() => setShowCreate(true)}
              icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
              type="primary"
            >
              Tạo phiếu chuyển hàng
            </Button>
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                placeholder="Tìm kiếm theo mã, theo tên"
                onChange={onSearch}
                enterButton
                allowClear
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <Select
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
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc phiếu chuyển"
                onChange={handleChange}
              ></Select>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Col
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  display: 'flex',
                  marginLeft: '1rem',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
              >
                <Button
                  icon={<FileExcelOutlined />}
                  style={{
                    width: '7.5rem',
                    backgroundColor: '#008816',
                    color: 'white',
                  }}
                  onClick={() => setExportVisible(true)}
                >
                  Xuất excel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          {selectedRowKeys.length ? (
            <Button type="primary" onClick={() => setShowMultiUpdate(true)}>
              Cập nhật trạng thái
            </Button>
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
            rowSelection={rowSelection}
            loading={loading}
            columns={columnsPromotion}
            rowKey="delivery_id"
            pagination={{ onChange: changePage, total: totalRecord }}
            dataSource={deliveryList}
            scroll={{ y: 500 }}
          />
        </div>
      </div>
      <Drawer visible={showCreate}></Drawer>
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
