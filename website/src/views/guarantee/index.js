import styles from './../guarantee/guarantee.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Switch,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  Popover,
  notification,
} from 'antd'
import { Link } from 'react-router-dom'
import { FileExcelOutlined, PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { apiAllWarranty, updateWarranty } from '../../apis/warranty'
import { ROUTES, PERMISSIONS } from 'consts'
import Permission from 'components/permission'
const { Option } = Select
const { RangePicker } = DatePicker
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]

const data = []
function removeFalse(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}
export default function Guarantee() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [warrantyList, setWarrantyList] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [filter, setFilter] = useState({
    keyword: '',
    from_date: undefined,
    to_date: undefined,
  })
  const onSearch = (value) =>
    setFilter({ ...filter, keyword: value.target.value })
  function onChange(dates, dateStrings) {
    setFilter({ ...filter, from_date: dateStrings[0], to_date: dateStrings[1] })
  }

  const warrantyUpdate = async (id, data) => {
    try {
      console.log(data)
      const res = await updateWarranty(id, data)
      if (res.data.success) {
        notification.success({
          message: 'Thành công',
          description: `${
            data.active ? 'Kích hoạt' : 'Vô hiệu hóa'
          } thành công`,
        })
      }
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại',
        description: `${data.active ? 'Kích hoạt' : 'Vô hiệu hóa'} thất bại`,
      })
    }
  }
  const columnsPromotion = [
    {
      title: 'STT',
      width: 60,
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
      title: 'Tên bảo hành',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Loại bảo hành',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: 'Thời hạn bảo hành',
      dataIndex: 'time',
      width: 150,
      render(data) {
        return data + ' tháng'
      },
      sorter: (a, b) => a - b,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 150,
      render(data, record) {
        return (
          <Switch
            defaultChecked={data}
            onChange={(e) => warrantyUpdate(record.warranty_id, { active: e })}
          />
        )
      },
    },
  ]

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )

  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const getWarranty = async (params) => {
    try {
      const res = await apiAllWarranty({ ...params, ...pagination })
      if (res.status == 200) {
        setWarrantyList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getWarranty({ ...removeFalse(filter) })
  }, [filter])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgb(236, 226, 226)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Quản lý bảo hành
          </div>
          <div className={styles['promotion_manager_button']}>
            <Permission permissions={[PERMISSIONS.them_phieu_bao_hanh]}>
              <Link to={ROUTES.GUARANTEE_ADD}>
                <Button
                  icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                  type="primary"
                  size="large"
                >
                  Tạo phiếu bảo hành
                </Button>
              </Link>
            </Permission>
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
                size="large"
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
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                onChange={onChange}
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
            <div style={{ width: '100%' }}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="Lọc phiếu bảo hành"
              >
                <Option value="ticket1">Phiếu bảo hành 1</Option>
                <Option value="ticket2">Phiếu bảo hành 2</Option>
                <Option value="ticket3">Phiếu bảo hành 3</Option>
              </Select>
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
                    backgroundColor: '#004F88',
                    color: 'white',
                  }}
                  size="large"
                >
                  Nhập excel
                </Button>
              </Col>
              <Col
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  marginLeft: '1rem',
                  display: 'flex',
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
                    backgroundColor: '#008816',
                    color: 'white',
                  }}
                  size="large"
                >
                  Xuất excel
                </Button>
              </Col>
            </Row>
          </Col>
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
            columns={columnsPromotion}
            pagination={{ onChange: changePagi }}
            dataSource={warrantyList}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                placeholder="Tìm kiếm khách hàng"
                onSearch={onSearchCustomerChoose}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(209, 191, 191)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            {' '}
            <Table
              size="small"
              scroll={{ y: 500 }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
