import styles from './../view/view.module.scss'
import React, { useState } from 'react'
import {
  Popconfirm,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Popover,
  Table,
  Modal,
  Typography,
} from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ROUTES } from 'consts'
import { tableSum } from 'utils'
const { Option } = Select
const { Text } = Typography
const { RangePicker } = DatePicker

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  })
}
export default function SaleDetailView() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
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
      sorter: (a, b) => {
        return a.productCode > b.productCode
          ? 1
          : a.productCode === b.productCode
          ? 0
          : -1
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
      sorter: (a, b) => {
        return a.productName > b.productName
          ? 1
          : a.productName === b.productName
          ? 0
          : -1
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      width: 150,
      sorter: (a, b) => a.productQuantity - b.productQuantity,
    },
    {
      title: 'Mã lô hàng',
      dataIndex: 'goodsCode',
      width: 150,
      sorter: (a, b) => {
        return a.goodsCode > b.goodsCode
          ? 1
          : a.goodsCode === b.goodsCode
          ? 0
          : -1
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 150,
      sorter: (a, b) => {
        return a.description > b.description
          ? 1
          : a.description === b.description
          ? 0
          : -1
      },
    },
    {
      title: 'Chi phí',
      dataIndex: 'cost',
      width: 150,
      sorter: (a, b) => a.cost - b.cost,
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ]

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <Link
          style={{
            display: 'flex',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgb(238, 227, 227)',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
          }}
          className={styles['supplier_information_title']}
          to={ROUTES.REPORT_FINANCIAL}
        >
          <ArrowLeftOutlined
            style={{
              color: 'black',
              marginRight: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          />
          <div
            style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}
            className={styles['supplier_information_title_right']}
          >
            Chi phí bán hàng
          </div>
        </Link>
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
                size="large"
                style={{ width: '100%' }}
                placeholder="Lọc theo kho"
              >
                <Option value="warehouse1">Kho 1</Option>
                <Option value="warehouse2">Kho 2</Option>
                <Option value="warehouse3">Kho 3</Option>
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
                size="large"
                style={{ width: '100%' }}
                defaultValue="default"
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
                  marginLeft: '1rem ',
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

              pageData.forEach((values, index) => {
                totalPrice += parseInt(values.productQuantity)
              })

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>
                        Tổng số lượng:{tableSum(pageData, 'productQuantity')}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                      {/* <Text type="danger">456</Text> */}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
            dataSource={data}
          />
        </div>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger size="large">
                Xóa báo cáo
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ''
        )}
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
              <Search placeholder="Tìm kiếm khách hàng" enterButton />
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
