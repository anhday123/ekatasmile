import styles from './../tax/tax.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import { ACTION, ROUTES, PERMISSIONS } from './../../consts/index'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  DatePicker,
  Switch,
  InputNumber,
  Input,
  Button,
  notification,
  Table,
  Row,
  Form,
  Col,
  Typography,
  Drawer,
  Checkbox,
} from 'antd'
import {
  PlusCircleOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import {
  apiAddTax,
  apiAllTax,
  apiSearchTax,
  apiUpdateTax,
} from '../../apis/tax'
import Permission from 'components/permission'
import { compare } from 'utils'
const { RangePicker } = DatePicker
const { Text } = Typography
export default function Tax() {
  const dispatch = useDispatch()
  const { TextArea } = Input
  const [tax, setTax] = useState([])
  const [visible, setVisible] = useState(false)
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  const [visibleUpdateMulti, setVisibleUpdateMulti] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [defaultActive, setDefaultActive] = useState(false)
  const [arrayUpdate, setArrayUpdate] = useState([])
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
    const array = []
    tax &&
      tax.length > 0 &&
      tax.forEach((values, index) => {
        selectedRowKeys.forEach((values1, index1) => {
          if (values._id === values1) {
            array.push(values)
          }
        })
      })
    setArrayUpdate([...array])
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const showDrawerUpdateMulti = () => {
    setVisibleUpdateMulti(true)
  }

  const onCloseUpdateMulti = () => {
    setVisibleUpdateMulti(false)
  }
  const showDrawerUpdate = () => {
    setVisibleUpdate(true)
  }

  const onCloseUpdate = () => {
    setVisibleUpdate(false)
  }
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  const apiSearchData = async (value) => {
    try {
      setLoading(true)

      const res = await apiSearchTax({ name: value })

      if (res.status === 200) setTax(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const typingTimeoutRef = useRef(null)
  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value
      apiSearchData(value)
    }, 300)
    //
  }
  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      taxName: <div>{`Thuế nhập hàng ${i}`}</div>,
      taxCode: `Nhập hàng`,
      tax: `10.00`,
      value: `1000`,
      action: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div onClick={showDrawerUpdate} style={{ marginRight: '0.5rem' }}>
            <EditOutlined
              style={{
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: '#0500E8',
              }}
            />
          </div>
        </div>
      ),
    })
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Thêm thông tin thuế thành công.',
    })
  }

  const openNotificationUpdateTax = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên thuế phải là chữ.',
    })
  }
  const openNotificationUpdateTaxError = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Tên thuế đã tồn tại.',
    })
  }
  const apiAllTaxData = async () => {
    try {
      setLoading(true)
      const res = await apiAllTax()
      console.log(res)
      if (res.status === 200) {
        setTax(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    apiAllTaxData()
  }, [])
  const apiAddTaxData = async (object) => {
    try {
      setLoading(true)
      const res = await apiAddTax(object)
      if (res.status === 200) {
        await apiAllTaxData()
        setVisible(false)
        openNotification()
      } else {
        openNotificationUpdateTaxError()
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const onFinish = (values) => {
    if (!isNaN(values.taxName)) {
      openNotificationUpdateTax()
    } else {
      const object = {
        name: values.taxName,
        value: values.value,
        description: values && values.description ? values.description : '',
        default: defaultActive,
      }
      apiAddTaxData(object)
    }
  }

  function onChange(value) {
    console.log('changed', value)
  }
  const openNotificationUpdateMulti = (data) => {
    notification.success({
      message: 'Thành công',
      description: (
        <div>
          Cập nhật thông tin thuế <b>{data}</b> thành công.
        </div>
      ),
    })
  }
  const openNotificationDeleteSupplier = (data) => {
    notification.success({
      message: 'Thành công',
      description:
        data === 2
          ? 'Vô hiệu hóa thuế thành công.'
          : 'Kích hoạt thuế thành công',
    })
  }
  const apiUpdateTaxDataStatus = async (object, id, data) => {
    try {
      setLoading(true)

      const res = await apiUpdateTax(object, id)
      console.log(res)
      console.log('1111222')
      if (res.status === 200) {
        await apiAllTaxData()
        openNotificationDeleteSupplier(data)
      } else {
        openNotificationUpdateTaxError()
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function onChangeSwitch(checked, record) {
    const object = {
      active: checked,
    }
    apiUpdateTaxDataStatus(object, record.tax_id, checked ? 1 : 2)
  }
  const apiUpdateTaxData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })

      const res = await apiUpdateTax(object, id)

      if (res.status === 200) {
        await apiAllTaxData()
        openNotificationUpdateMulti(object.name)
        onCloseUpdate()
        setSelectedRowKeys([])
        onCloseUpdateMulti()
      } else {
        openNotificationUpdateTaxError()
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const apiSearchDateData = async (start, end) => {
    try {
      setLoading(true)

      const res = await apiSearchTax({ from_date: start, to_date: end })
      if (res.status === 200) {
        setTax(res.data.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const dateFormat = 'YYYY/MM/DD'
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [clear, setClear] = useState(-1)
  function onChangeDate(dates, dateStrings) {
    setClear(0)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '')
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
    apiSearchDateData(
      dateStrings && dateStrings.length > 0 ? dateStrings[0] : '',
      dateStrings && dateStrings.length > 0 ? dateStrings[1] : ''
    )
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu.',
    })
  }
  const onClickClear = async () => {
    await apiAllTaxData()
    openNotificationClear()
    setValueSearch('')
    setClear(1)
    setSelectedRowKeys([])
    setStart([])
    setEnd([])
  }
  const onCloseUpdateFunc = (data) => {
    if (data === 1) {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (!isNaN(values.name)) {
            openNotificationUpdateTax()
          } else {
            const object = {
              name: values.name,
              value: values.value,
              description:
                values && values.description ? values.description : '',
            }
            apiUpdateTaxData(object, values.tax_id)
          }
        })
    } else {
      arrayUpdate &&
        arrayUpdate.length > 0 &&
        arrayUpdate.forEach((values, index) => {
          if (!isNaN(values.name)) {
            openNotificationUpdateTax()
          } else {
            const object = {
              name: values.name,
              value: arrayUpdate[0].value,
              description:
                arrayUpdate[0] && arrayUpdate[0].description
                  ? arrayUpdate[0].description
                  : '',
            }
            apiUpdateTaxData(object, values.tax_id)
          }
        })
    }
  }
  const columns = [
    {
      title: 'Tên thuế',
      dataIndex: 'name',
      sorter: (a, b) => compare(a, b, 'name'),
    },

    {
      title: 'Giá trị',
      dataIndex: 'value',
      render: (text, record) => text && `${text}%`,
      sorter: (a, b) => compare(a, b, 'value'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      sorter: (a, b) => compare(a, b, 'description'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      render: (text, record) =>
        text ? (
          <Switch defaultChecked onChange={(e) => onChangeSwitch(e, record)} />
        ) : (
          <Switch onChange={(e) => onChangeSwitch(e, record)} />
        ),
    },
  ]
  return (
    <>
      <div className={`${styles['supplier_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(241, 236, 236)',
            paddingBottom: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Link
            className={styles['supplier_add_back_parent']}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
            to={ROUTES.CONFIGURATION_STORE}
          >
            <ArrowLeftOutlined
              style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }}
            />
            <div
              style={{
                color: 'black',
                fontWeight: '600',
                fontSize: '1rem',
                marginLeft: '0.5rem',
              }}
              className={styles['supplier_add_back']}
            >
              Quản lý thuế
            </div>
          </Link>
          <Permission permissions={[PERMISSIONS.them_thue]}>
            <div onClick={showDrawer}>
              <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
                Thêm thuế
              </Button>
            </div>
          </Permission>
        </div>
        <Row
          style={{
            display: 'flex',
            margin: '1rem 0',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={7}>
            <div style={{ width: '100%' }}>
              <Input
                size="large"
                style={{ width: '100%' }}
                name="name"
                value={valueSearch}
                enterButton
                onChange={onSearch}
                className={styles['orders_manager_content_row_col_search']}
                placeholder="Tìm kiếm theo tên"
                allowClear
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginLeft: '1rem' }}
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
                value={
                  clear === 1
                    ? []
                    : start !== ''
                    ? [moment(start, dateFormat), moment(end, dateFormat)]
                    : []
                }
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                onChange={onChangeDate}
              />
            </div>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <Button size="large" onClick={onClickClear} type="primary">
            Xóa tất cả lọc
          </Button>
        </div>

        <div style={{ width: '100%', border: '1px solid rgb(243, 234, 234)' }}>
          <Table
            size="small"
            columns={columns}
            loading={loading}
            dataSource={tax}
            style={{ width: '100%' }}
            summary={(pageData) => {
              let totalTax = 0
              let totalValue = 0
              console.log(pageData)
              pageData
                .filter((e) => e.active)
                .forEach((values, index) => {
                  totalTax += parseInt(values.value)
                })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        <div style={{ color: 'black', fontWeight: '600' }}>
                          Tổng cộng:
                        </div>
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        <div
                          style={{ color: 'black', fontWeight: '600' }}
                        >{`${totalTax}%`}</div>
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </div>
      </div>
      <Drawer
        title="Thêm thông tin thuế"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          className={styles['supplier_add_content']}
          onFinish={onFinish}
          layout="vertical"
        >
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Tên thuế
                    </div>
                  }
                  name="taxName"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Nhập tên thuế" size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <Form.Item
                  label={
                    <div style={{ color: 'black', fontWeight: '600' }}>
                      Giá trị
                    </div>
                  }
                  name="value"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <InputNumber
                    size="large"
                    className="br-15__input"
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={onChange}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  style={{
                    color: 'black',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}
                >
                  Mô tả
                </div>
                <Form.Item name="description">
                  <TextArea rows={4} placeholder="Nhập mô tả" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row>
            <Checkbox onChange={(e) => setDefaultActive(e.target.checked)}>
              Kích hoạt
            </Checkbox>
          </Row>
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflow: 'auto',
              margin: '1rem 0',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <b style={{ marginRight: '0.25rem' }}>Chú ý:</b> bạn không thể sửa
            giá trị thuế khi đã sử dụng thuế đó trong một đơn hàng.
          </div>

          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
            className={styles['supplier_add_content_supplier_button']}
          >
            <Col
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              xs={24}
              sm={24}
              md={5}
              lg={4}
              xl={3}
            >
              <Form.Item>
                <Button size="large" type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
