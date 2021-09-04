import loading from './../../../../assets/img/loading.png'
import styles from './../view/view.module.scss'
import {
  Popconfirm,
  Button,
  Input,
  Form,
  Row,
  Col,
  Typography,
  message,
  Table,
  Modal,
  notification,
} from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, AudioOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

const { Text } = Typography

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName',
    width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    width: 150,
  },
  {
    title: 'Tồn chi nhánh',
    dataIndex: 'branchInventory',
    width: 150,
    sorter: (a, b) => a - b,
  },
  {
    title: 'Tồn thực tế',
    dataIndex: 'realityInventory',
    width: 150,
    sorter: (a, b) => a - b,
  },
  {
    title: 'Số lượng lệch',
    dataIndex: 'deviationAmount',
    width: 150,
    sorter: (a, b) => a - b,
  },
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    skuCode: `IAN ${i}`,
    productName: `Ly thủy tinh`,
    unit: `${i} đơn vị`,
    branchInventory: i,
    realityInventory: i,
    deviationAmount: i,
  })
}

export default function ProductCheckView() {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  function confirm(e) {
    console.log(e)
    message.success('Click on Yes')
  }

  function cancel(e) {
    console.log(e)
    message.error('Click on No')
  }

  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description: 'Đã kiểm hàng thành công.',
    })
  }
  const checkFinish = () => {
    openNotification()
    modal2VisibleModal(true)
  }
  return (
    <>
      <Form style={{ margin: '1rem' }} className={styles['product_check_add']}>
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
            md={24}
            lg={11}
            xl={11}
          >
            <Link
              to="/product-check/8"
              style={{
                display: 'flex',
                cursor: 'pointer',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div>
                <ArrowLeftOutlined
                  style={{
                    color: 'black',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                />
              </div>
              <div
                style={{
                  color: 'black',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginLeft: '0.5rem',
                }}
              >
                Phiếu kiểm hàng INA001
              </div>
            </Link>
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            marginTop: '1rem',
            padding: '1rem 1rem 0.5rem 1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Thông tin phiếu kiểm hàng
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
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Chi nhánh kiểm: </b> mặc định
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Nhân viên tạo:</b> Nguyễn An
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Ngày tạo: </b> 2021/07/01
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Ghi chú: </b> không có ghi chú
                </div>
              </div>
            </Col>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '7.5rem',
                    padding: '0.5rem',
                    borderRadius: '2rem',
                    backgroundColor: '#FFAC2F',
                    color: 'black',
                  }}
                >
                  Đang kiểm kho
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Nhân viên kiểm:</b> Nguyễn An
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Ngày tạo: </b> 2021/07/01
                </div>
              </div>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '0.5rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={5}
              xl={5}
            >
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <b>Tag: </b> không có tag
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            marginTop: '1rem',
            padding: '1rem 1rem 0rem 1rem',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Danh sách sản phẩm
          </div>
          <div
            style={{
              border: '1px solid rgb(224, 208, 208)',
              marginTop: '1rem',
              width: '100%',
            }}
          >
            <Table
              size="small"
              rowSelection={rowSelection}
              summary={(pageData) => {
                let totalBranchInventory = 0
                let totalRealityInventory = 0
                let totalDeviationAmount = 0
                console.log(pageData)
                pageData.forEach((values, index) => {
                  totalBranchInventory += parseInt(values.branchInventory)
                  totalRealityInventory += parseInt(values.realityInventory)
                  totalDeviationAmount += parseInt(values.deviationAmount)
                })

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
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
                        <Text></Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{`${totalBranchInventory}`}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{totalRealityInventory}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text>{totalDeviationAmount}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
              columns={columns}
              style={{ width: '100%' }}
              dataSource={data}
              scroll={{ y: 500 }}
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
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger style={{ width: '7.5rem' }}>
                  Xóa sản phẩm
                </Button>
              </Popconfirm>
            </div>
          ) : (
            ''
          )}
          <div
            onClick={checkFinish}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Form.Item style={{ marginLeft: '1rem', marginTop: '1rem' }}>
              <Button type="primary" htmlType="submit">
                Hoàn thành kiểm
              </Button>
            </Form.Item>
          </div>
        </div>
        <Modal
          title="Thêm nhanh sản phẩm"
          centered
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <img
                style={{ width: '5rem', height: '5rem' }}
                src={loading}
                alt=""
              />
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                Hệ thống đang xử lý dữ liệu phiếu kiểm
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                Quý khách vui lòng chờ trong giây lát.
              </div>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  )
}
