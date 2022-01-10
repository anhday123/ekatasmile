import React, { useState, useEffect } from 'react'
import styles from './receipts-payment.module.scss'
import columnsReceiptsPayment from './columns'
import { formatCash } from 'utils'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

//apis
import { getCustomers } from 'apis/customer'

//antd
import {
  Row,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Table,
  Modal,
  Form,
  InputNumber,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  SearchOutlined,
  CloseOutlined,
  UploadOutlined,
} from '@ant-design/icons'

//components
import SettingColumns from 'components/setting-columns'
import TitlePage from 'components/title-page'

export default function ReceiptsAndPayment() {
  const history = useHistory()

  const [customers, setCustomers] = useState([])

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columns, setColumns] = useState(
    localStorage.getItem('columnsReceiptsPayment')
      ? JSON.parse(localStorage.getItem('columnsReceiptsPayment'))
      : [...columnsReceiptsPayment]
  )

  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [paramsFilter, setParamsFilter] = useState({}) //params search by site, date, order name

  function onFilterTime(dates, dateStrings) {
    //khi search hoac filter thi reset page ve 1
    // setPage(1)

    if (isOpenSelect) toggleOpenSelect()

    //nếu search date thì xoá các params date
    delete paramsFilter.to_day
    delete paramsFilter.yesterday
    delete paramsFilter.this_week
    delete paramsFilter.last_week
    delete paramsFilter.last_month
    delete paramsFilter.this_month
    delete paramsFilter.this_year
    delete paramsFilter.last_year

    //Kiểm tra xem date có được chọn ko
    //Nếu ko thì thoát khỏi hàm, tránh cash app
    //và get danh sách order
    if (!dateStrings[0] && !dateStrings[1]) {
      delete paramsFilter.startDate
      delete paramsFilter.endDate
      // getOrdersByStatus(key, 1, pageSize, { ...paramsFilter })
      setParamsFilter({ ...paramsFilter })
      setValueDateSearch(null)
      setValueTime()
    } else {
      const dateFirst = dateStrings[0]
      const dateLast = dateStrings[1]
      setValueDateSearch(dates)
      setValueTime(`${dateFirst} -> ${dateLast}`)

      dateFirst.replace(/-/g, '/')
      dateLast.replace(/-/g, '/')
      // getOrdersByStatus(key, 1, pageSize, {
      //   ...paramsFilter,
      //   startDate: dateFirst,
      //   endDate: dateLast,
      // })
      setParamsFilter({
        ...paramsFilter,
        startDate: dateFirst,
        endDate: dateLast,
      })
    }
  }

  const ModalCreatePaymentOrReceipts = ({ type }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [form] = Form.useForm()

    const _createPaymentOrReceipts = async () => {
      let isValidated = true

      try {
        await form.validateFields()
        isValidated = true
      } catch (error) {
        isValidated = false
      }
      console.log(isValidated)
      if (!isValidated) return

      try {
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <>
        <Button
          onClick={toggle}
          style={{
            backgroundColor: type === 'payment' ? '#DE7C08' : '#0877DE',
            borderColor: type === 'payment' ? '#DE7C08' : '#0877DE',
            borderRadius: 5,
            color: 'white',
            fontWeight: 600,
          }}
        >
          {type === 'payment' ? 'Tạo phiếu chi' : 'Tạo phiếu thu'}
        </Button>
        <Modal
          width={650}
          onCancel={toggle}
          visible={visible}
          title={type === 'payment' ? 'Tạo phiếu chi' : 'Tạo phiếu thu'}
          footer={
            <Row justify="end">
              <Button
                style={{
                  backgroundColor: type === 'payment' ? '#DE7C08' : '#0877DE',
                  borderColor: type === 'payment' ? '#DE7C08' : '#0877DE',
                  borderRadius: 5,
                  color: 'white',
                  fontWeight: 600,
                }}
                onClick={_createPaymentOrReceipts}
              >
                {type === 'payment' ? 'Tạo phiếu chi' : 'Tạo phiếu thu'}
              </Button>
            </Row>
          }
        >
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Form.Item
                  name="receiver"
                  label="Nhóm người nhận"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn nhóm người nhận',
                    },
                  ]}
                >
                  <Select placeholder="Chọn nhóm người nhận" style={{ width: 280 }}>
                    <Select.Option value="">Khách hàng</Select.Option>
                    <Select.Option value="">Nhà cung cấp</Select.Option>
                    <Select.Option value="">Nhân viên</Select.Option>
                    <Select.Option value="">Đối tác vận chuyển</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="nameReceiver"
                  label="Tên người nhận"
                  rules={[{ required: true, message: 'Vui lòng chọn tên người nhận' }]}
                >
                  <Select showSearch placeholder="Chọn chọn  người nhận" style={{ width: 280 }}>
                    {customers.map((customer, index) => (
                      <Select.Option
                        key={index}
                        value={(customer.first_name || '') + ' ' + (customer.last_name || '')}
                      >
                        {(customer.first_name || '') + ' ' + (customer.last_name || '')} -{' '}
                        {customer.phone || ''}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Row>
              <Row justify="space-between">
                <Form.Item
                  name="paymentType"
                  label="Loại phiếu chi"
                  rules={[{ required: true, message: 'Vui lòng chọn loại phiếu chi' }]}
                >
                  <Select placeholder="Chọn loại phiếu chi" style={{ width: 280 }}></Select>
                </Form.Item>
                <Form.Item
                  name="valueReceiver"
                  label="Giá trị ghi nhận"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giá trị ghi nhận',
                    },
                  ]}
                >
                  <InputNumber min={0} placeholder="Nhập giá trị ghi nhận" style={{ width: 280 }} />
                </Form.Item>
              </Row>
              <Row justify="space-between">
                <Form.Item
                  name="formPayment"
                  label="Hình thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn hình thức thanh toán',
                    },
                  ]}
                >
                  <Select placeholder="Chọn hình thức thanh toán" style={{ width: 280 }}>
                    <Select.Option value="">Quẹt thẻ</Select.Option>
                    <Select.Option value="">Tiền mặt</Select.Option>
                    <Select.Option value="">Thẻ ngân hàng</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                  <Input.TextArea rows={4} placeholder="Nhập Mô tả" style={{ width: 280 }} />
                </Form.Item>
              </Row>
            </Space>
          </Form>
        </Modal>
      </>
    )
  }

  const _getCustomers = async () => {
    try {
      const res = await getCustomers()
      console.log(res)
      if (res.status === 200) setCustomers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getCustomers()
  }, [])

  return (
    <div className={styles['card']}>
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.REPORTS)}
          >
            <ArrowLeftOutlined style={{ marginRight: 10 }} />
            Danh sách phiếu
          </Row>
        }
      >
        <Space size="middle">
          <ModalCreatePaymentOrReceipts type="payment" />
          <ModalCreatePaymentOrReceipts type="receipts" />
        </Space>
      </TitlePage>

      <Row style={{ marginTop: 15, marginBottom: 15 }}>
        <Space size="middle">
          <Button
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: '#DE7C08',
              borderColor: '#DE7C08',
              borderRadius: 5,
              color: 'white',
              fontWeight: 600,
            }}
            onClick={() => history.push(ROUTES.PAYMENT_TYPE)}
          >
            Loại phiếu chi
          </Button>
          <Button
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: '#0877DE',
              borderColor: '#0877DE',
              borderRadius: 5,
              color: 'white',
              fontWeight: 600,
            }}
            onClick={() => history.push(ROUTES.RECEIPTS_TYPE)}
          >
            Loại phiếu thu
          </Button>
        </Space>
      </Row>
      <Row
        align="middle"
        wrap={false}
        style={{
          border: '1px solid #d9d9d9',
          width: 'max-content',
          borderRadius: 5,
        }}
      >
        <div style={{ borderRight: '1px solid #d9d9d9' }}>
          <Input
            clearIcon={<CloseOutlined />}
            allowClear
            prefix={<SearchOutlined />}
            bordered={false}
            style={{ width: 350 }}
            placeholder="Tìm kiếm theo mã"
          />
        </div>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="Chọn loại phiếu"
          style={{ width: 150, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Phiếu thu</Select.Option>
          <Select.Option>Phiếu chi</Select.Option>
        </Select>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="Hình thức thanh toán"
          style={{ width: 180, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Quẹt thẻ</Select.Option>
          <Select.Option>Tiền mặt</Select.Option>
          <Select.Option>Thẻ ngân hàng</Select.Option>
        </Select>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="Đối tượng"
          style={{ width: 170, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Khách hàng</Select.Option>
          <Select.Option>Nhà cung cấp</Select.Option>
          <Select.Option>Nhân viên</Select.Option>
          <Select.Option>Đối tác vận chuyển</Select.Option>
        </Select>

        <Select
          clearIcon={<CloseOutlined />}
          open={isOpenSelect}
          onBlur={() => {
            if (isOpenSelect) toggleOpenSelect()
          }}
          onClick={() => {
            if (!isOpenSelect) toggleOpenSelect()
          }}
          bordered={false}
          placeholder="Thời gian"
          style={{ width: 280 }}
          allowClear
          value={valueTime}
          onChange={async (value) => {
            setValueTime(value)

            //khi search hoac filter thi reset page ve 1
            // setPage(1)

            //xoa params search date hien tai
            const p = Object.keys(valueDateTimeSearch)
            if (p.length) delete paramsFilter[p[0]]

            setValueDateSearch(null)
            delete paramsFilter.startDate
            delete paramsFilter.endDate

            if (isOpenSelect) toggleOpenSelect()

            if (value) {
              const searchDate = Object.fromEntries([[value, true]]) // them params search date moi
              // getOrdersByStatus(key, 1, pageSize, {
              //   ...paramsFilter,
              //   ...searchDate,
              // })
              setParamsFilter({ ...paramsFilter, ...searchDate })
              setValueDateTimeSearch({ ...searchDate })
            } else {
              // getOrdersByStatus(key, 1, pageSize, { ...paramsFilter })
              setParamsFilter({ ...paramsFilter })
              setValueDateTimeSearch({})
            }
          }}
          dropdownRender={(menu) => (
            <div>
              <DatePicker.RangePicker
                onFocus={() => {
                  if (!isOpenSelect) toggleOpenSelect()
                }}
                onBlur={() => {
                  if (isOpenSelect) toggleOpenSelect()
                }}
                value={valueDateSearch}
                onChange={onFilterTime}
                style={{ width: '100%' }}
              />
              {menu}
            </div>
          )}
        >
          <Select.Option value="to_day">Today</Select.Option>
          <Select.Option value="yesterday">Yesterday</Select.Option>
          <Select.Option value="this_week">This week</Select.Option>
          <Select.Option value="last_week">Last week</Select.Option>
          <Select.Option value="last_month">Last month</Select.Option>
          <Select.Option value="this_month">This month</Select.Option>
          <Select.Option value="this_year">This year</Select.Option>
          <Select.Option value="last_year">Last year</Select.Option>
        </Select>
      </Row>
      <Row justify="space-between" align="middle" style={{ marginTop: 15, marginBottom: 15 }}>
        <Button
          type="primary"
          danger
          style={{
            borderRadius: 5,
            color: 'white',
            fontWeight: 600,
          }}
        >
          Ẩn phiếu
        </Button>
        <Space>
          <Button
            icon={<UploadOutlined />}
            style={{
              backgroundColor: '#66AE43',
              borderColor: '#66AE43',
              borderRadius: 5,
              color: 'white',
              fontWeight: 600,
            }}
          >
            Xuất excel
          </Button>
          <SettingColumns
            columns={columns}
            setColumns={setColumns}
            columnsDefault={columnsReceiptsPayment}
            nameColumn="columnsReceiptsPayment"
            btn={
              <Button
                style={{
                  backgroundColor: '#4E7DD9',
                  borderColor: '#4E7DD9',
                  borderRadius: 5,
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Điều chỉnh cột
              </Button>
            }
          />
        </Space>
      </Row>
      <Table
        size="small"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => console.log(keys),
        }}
        style={{ width: '100%' }}
        columns={columns}
      />
    </div>
  )
}
