import React, { useState, useEffect } from 'react'
import styles from './receipts-payment.module.scss'
import columnsReceiptsPayment from './columns'
import { formatCash } from 'utils'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import moment from 'moment'

//apis
import { getCustomers } from 'apis/customer'
import { addFinances, getFinances } from 'apis/report'

//antd
import { Row, Space, Button, Input, Select, Table, Modal, Form, InputNumber, notification } from 'antd'

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
import FilterDate from 'components/filter-date'
import { useSelector } from 'react-redux'

export default function ReceiptsAndPayment() {
  const history = useHistory()
  const dataUser = useSelector((state) => state.login.dataUser)
  const {username}=dataUser.data
  
  const [customers, setCustomers] = useState([])

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columns, setColumns] = useState([])
  const [finances, setFinances] = useState([])

  const [paramsFilter, setParamsFilter] = useState({}) //params search by site, date, order name
  const ModalCreatePaymentOrReceipts = ({ type }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [form] = Form.useForm()
    const onFinish = async (values) => {
      const body = {
        source: "CUSTOMER_PAY",
        note: values.note,
        payer: values.payer,
        value: values.value,
        receiver: values.receiver,
        type: values.type,
        payments: [
          {
            payment_method_id: 1,
            name: values.payments,
            value: values.values,
          }
        ],
        status: "COMPLETE",
        username:username,
      }
      console.log("body", body)
      let res
      res = await addFinances(body)
      if (res.status === 200) {
        if (res.data.success){
          _getFinances()
          notification.success({ message: 'T???o phi???u th??nh c??ng !' })
        }
        else
          notification.error({
            message: res.data.message || 'T???o phi???u th???t b???i, vui l??ng th??? l???i!',
          })
        }else
        notification.error({
          message: res.data.message || 'T???o phi???u th???t b???i, vui l??ng th??? l???i!',
        })


    }
    // const _createPaymentOrReceipts = async () => {
    //   let isValidated = true

    //   try {

    //     await form.validateFields()
    //     isValidated = true
    //   } catch (error) {
    //     isValidated = false
    //   }
    //   console.log(isValidated)
    //   if (!isValidated) return

    //   try {
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

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
          {type === 'payment' ? 'T???o phi???u chi' : 'T???o phi???u thu'}
        </Button>
     
        <Modal
          width={650}
          onCancel={toggle}
          visible={visible}
          title={type === 'payment' ? 'T???o phi???u chi' : 'T???o phi???u thu'}
          footer={false}
        >
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Form.Item
                  name="payer"
                  label="Ng?????i tr???"
                  rules={[
                    {
                      required: true,
                      message: 'Vui l??ng ch???n nh??m ng?????i nh???n',
                    },
                  ]}
                >
                  <Select showSearch placeholder="Ch???n ch???n  tr???" style={{ width: 280 }}>
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
                <Form.Item
                  name="receiver"
                  label="T??n ng?????i nh???n"
                  rules={[{ required: true, message: 'Vui l??ng ch???n t??n ng?????i nh???n' }]}
                >
                  <Select showSearch placeholder="Ch???n ch???n  ng?????i nh???n" style={{ width: 280 }}>
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
                  name="type"
                  label="Lo???i phi???u chi"
                  rules={[{ required: true, message: 'Vui l??ng ch???n lo???i phi???u chi' }]}
                >
                  <Select placeholder="Ch???n lo???i phi???u chi" style={{ width: 280 }}>
                    <Select.Option value="RECEIPT">Phi???u thu</Select.Option>
                    <Select.Option value="PAYMENT">Phi???u chi</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="value"
                  label="Gi?? tr??? ghi nh???n"
                  rules={[
                    {
                      required: true,
                      message: 'Vui l??ng nh???p gi?? tr??? ghi nh???n',
                    },
                  ]}
                >
                  <InputNumber min={0} placeholder="Nh???p gi?? tr??? ghi nh???n" style={{ width: 280 }} />
                </Form.Item>
              </Row>
              <Row justify="space-between">
                <Form.Item
                  name="payments"
                  label="H??nh th???c thanh to??n"
                  rules={[
                    {
                      required: true,
                      message: 'Vui l??ng ch???n h??nh th???c thanh to??n',
                    },
                  ]}
                >
                  <Select placeholder="Ch???n h??nh th???c thanh to??n" style={{ width: 280 }}>
                    <Select.Option value="SWIPE">Qu???t th???</Select.Option>
                    <Select.Option value="CASH">Ti???n m???t</Select.Option>
                    <Select.Option value="BANKING">Th??? ng??n h??ng</Select.Option>
                  </Select>
                </Form.Item>
                 <Form.Item
                  name="values"
                  label="Nh???p gi?? tr??? thanh to??n"
                  rules={[
                    {
                      required: true,
                      message: 'Vui l??ng gi?? tr???',
                    },
                  ]}
                >
                   <InputNumber value="" min={0} placeholder="Nh???p gi?? tr??? ghi nh???n" style={{ width: 280 }} />
                </Form.Item>
                <Form.Item name="note" label="M?? t???">
                  <Input.TextArea rows={4} placeholder="Nh???p M?? t???" style={{ width: 280 }} />
                </Form.Item>
              </Row>
            </Space>
           
            <Row justify="end">
              <Button
                style={{
                  backgroundColor: type === 'payment' ? '#DE7C08' : '#0877DE',
                  borderColor: type === 'payment' ? '#DE7C08' : '#0877DE',
                  borderRadius: 5,
                  color: 'white',
                  fontWeight: 600,
                  
                  
                }}
                type="primary" htmlType="submit" size="large"
              >
                {type === 'payment' ? 'T???o phi???u chiiii' : 'T???o phi???u thu'}
              </Button>
            </Row>
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

  const _getFinances = async () => {
    try {
      const res = await getFinances()
      console.log(res)
      if (res.status === 200) setFinances(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getCustomers()
    _getFinances()
  }, [])

  return (
    <div className="card">
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.REPORTS)}
          >
            <ArrowLeftOutlined style={{ marginRight: 10 }} />
            Danh s??ch phi???u
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
            Lo???i phi???u chi
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
            Lo???i phi???u thu
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
            placeholder="T??m ki???m theo m??"
          />
        </div>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="Ch???n lo???i phi???u"
          style={{ width: 100, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Phi???u thu</Select.Option>
          <Select.Option>Phi???u chi</Select.Option>
        </Select>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="H??nh th???c thanh to??n"
          style={{ width: 180, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Qu???t th???</Select.Option>
          <Select.Option>Ti???n m???t</Select.Option>
          <Select.Option>Th??? ng??n h??ng</Select.Option>
        </Select>
        <Select
          clearIcon={<CloseOutlined />}
          allowClear
          bordered={false}
          placeholder="?????i t?????ng"
          style={{ width: 170, borderRight: '1px solid #d9d9d9' }}
        >
          <Select.Option>Kh??ch h??ng</Select.Option>
          <Select.Option>Nh?? cung c???p</Select.Option>
          <Select.Option>Nh??n vi??n</Select.Option>
          <Select.Option>?????i t??c v???n chuy???n</Select.Option>
        </Select>

        <FilterDate paramsFilter={paramsFilter} setParamsFilter={setParamsFilter} width={300} />
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
          ???n phi???u
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
            Xu???t excel
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
                ??i???u ch???nh c???t
              </Button>
            }
          />
        </Space>
      </Row>
      <Table
        dataSource={finances}
        size="small"
        rowSelection={{ selectedRowKeys, onChange: (keys) => console.log(keys) }}
        style={{ width: '100%' }}
        columns={columns.map((column) => {
          if (column.key === 'payment')
            return {
              ...column,
              render: (text, record) =>
                record.payments && record.payments.map((e) => e.name).join(', '),
            }
          if (column.key === 'money')
            return {
              ...column,
              render: (text, record) => record.value && formatCash(record.value || 0),
            }
        
          if (column.key === 'creator')
            return {
              ...column,
              render: (text, record) => record.username && record.username,
            }
          if (column.key === 'receiver')
            return {
              ...column,
              render: (text, record) =>
              record.receiver_id ?(`${record.receiver_id}`):"",
            }
          if (column.key === 'payer')
            return {
              ...column,
              render: (text, record) => 
              record.payer_id ?(`${record.payer_id}`):"",
            }
          if (column.key === 'create_date')
            return {
              ...column,
              render: (text, record) =>
                record.create_date && moment(record.create_date).format('DD/MM/YYYY HH:mm'),
            }
          return column
        })}
      />
    </div>
  )
}
