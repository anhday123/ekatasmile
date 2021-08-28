import styles from './../report-inventory/report-inventory.module.scss'
import React, { useState } from 'react'
import {
  Popconfirm,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Modal,
  Typography,
  Popover,
  Space,
} from 'antd'

import { FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

export default function ReportInventory() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 150,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'productQuantity',
      width: 150,
    },
    {
      title: 'Mã lô hàng',
      dataIndex: 'goodsCode',
      width: 150,
    },
    {
      title: 'Tên kho',
      dataIndex: 'inventoryName',
      width: 150,
    },
  ]
  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <div>{i}</div>,
      productName: `tên sản phẩm ${i}`,
      productQuantity: i,
      goodsCode: `BS5426${i}`,
      inventoryName: `Bình thạnh`,
    })
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  return (
    <>
      <div className={styles['promotion_manager']}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Báo cáo tồn kho
          </div>
        </div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="Tìm kiếm theo mã, theo tên"
                enterButton
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
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
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                className="br-15__date-picker"
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo kho"
                size="large"
              >
                <Option value="inventory1">Kho hàng 1</Option>
                <Option value="inventory2">Kho hàng 2</Option>
                <Option value="inventory3">Kho hàng 3</Option>
              </Select>
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select
                style={{ width: '100%' }}
                defaultValue="default"
                size="large"
              >
                <Option value="default">Tất cả mã lô hàng</Option>
                <Option value="goods1">Lô hàng 1</Option>
                <Option value="goods2">Lô hàng 2</Option>
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
                  size="large"
                  icon={<FileExcelOutlined />}
                  style={{
                    backgroundColor: '#004F88',
                    color: 'white',
                  }}
                >
                  Nhập excel
                </Button>
              </Col>
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
                  size="large"
                  icon={<FileExcelOutlined />}
                  style={{
                    backgroundColor: '#008816',
                    color: 'white',
                  }}
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
            border: '1px solid rgb(235, 222, 222)',
            marginTop: '1rem',
          }}
        >
          <Table
            rowSelection={rowSelection}
            columns={columns}
            summary={(pageData) => {
              let totalPrice = 0

              console.log(pageData)
              pageData.forEach((values, index) => {
                totalPrice += parseInt(values.productQuantity)
              })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      {' '}
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>{`${totalPrice}`}</Text>
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
            dataSource={data}
          />
        </div>
        <Row
          style={{ width: '100%', marginTop: 15 }}
          justify="end"
          align="middle"
        >
          <Space>
            {selectedRowKeys && selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger size="large">
                  Xóa báo cáo
                </Button>
              </Popconfirm>
            ) : (
              ''
            )}
            <Button
              size="large"
              type="primary"
              style={{
                backgroundColor: '#E9A800',
                borderColor: '#E9A800',
              }}
            >
              Xuất báo cáo
            </Button>
          </Space>
        </Row>
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
