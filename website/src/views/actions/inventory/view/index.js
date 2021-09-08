import { Link, useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import styles from './../view/view.module.scss'
import React, { useEffect, useState } from 'react'
import { Table, Input, Row, Col, Modal, Typography } from 'antd'
import { apiSearchProduct } from '../../../../apis/product'
const { Text } = Typography
export default function InventoryView(props) {
  const location = useLocation()
  const history = useHistory()
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [warehousePrroduct, setWarehouseProduct] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const { Search } = Input
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
      width: 150,
      render(data, record, index) {
        return (pagination.page - 1) * pagination.page_size + (index + 1)
      },
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      width: 150,
      sorter: (a, b) => {
        return a.sku > b.sku ? 1 : a.sku === b.sku ? 0 : -1
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 150,
      sorter: (a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1
      },
      render(data, record) {
        return record.title || record.name
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 150,
      render(data) {
        return <img src={data[0]} width="80px" />
      },
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'sale_price',
      width: 150,
      sorter: (a, b) => a.sale_price - b.sale_price,
    },
    {
      title: 'Loại',
      dataIndex: '_category',
      width: 150,
      sorter: (a, b) => {
        return a._category > b._category
          ? 1
          : a._category === b._category
          ? 0
          : -1
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'available_stock_quantity',
      width: 150,
      render(data, record) {
        return record.shipping_quantity + data
      },
      sorter: (a, b) => a.available_stock_quantity - b.available_stock_quantity,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: '_supplier',
      width: 150,
      sorter: (a, b) => {
        return a._suplier > b._suplier ? 1 : a._suplier === b._suplier ? 0 : -1
      },
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   width: 150,
    // },
  ]
  const getProductWarehouse = async () => {
    try {
      const res = await apiSearchProduct({
        warehouse: props.data.warehouse_id,
        merge: false,
        ...pagination,
      })
      if (res.status == 200) {
        setWarehouseProduct(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getProductWarehouse()
  }, [pagination])

  const onSearch = (value) => console.log(value)
  return (
    <>
      <div className={styles['supplier_information']}>
        <div className={styles['supplier_information_content_parent']}>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  {' '}
                  <div>
                    <b>Mã kho:</b> {`${props.data.code}`}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Ngày tạo:</b>{' '}
                    {`${moment(props.data.create_date).format('YYYY-MM-DD')}`}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Tên kho:</b> {`${props.data.name}`}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Địa chỉ:</b> {`${props.data.address}`}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Loại kho:</b> {`${props.data.type}`}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Quận/huyện:</b> {`${props.data.district}`}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Liên hệ:</b> {`${props.data.phone}`}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Tỉnh/thành phố:</b> {`${props.data.province}`}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Dung lượng:</b> {`${props.data.capacity}`}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
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
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div>
                    <b>Phí duy trì tháng:</b> {`${props.data.monthly_cost}`}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Modal
          title="Danh sách sản phẩm"
          centered
          width={1000}
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <div>
            <div
              style={{
                display: 'flex',
                marginBottom: '1rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo mã, theo tên"
                onSearch={onSearch}
                enterButton
              />
            </div>
            <div
              style={{ width: '100%', border: '1px solid rgb(233, 227, 227)' }}
            >
              <Table
                size="small"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={warehousePrroduct}
                scroll={{ y: 500 }}
                summary={(pageData) => {
                  return (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text></Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text>Tổng cộng:{`${pageData.length}`}</Text>
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
        </Modal>
      </div>
    </>
  )
}
