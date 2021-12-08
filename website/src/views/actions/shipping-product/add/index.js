import styles from './add.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Select,
  Button,
  Input,
  Form,
  Row,
  Col,
  Upload,
  Modal,
  notification,
  AutoComplete,
  InputNumber,
  Radio,
  DatePicker,
  Table,
  Space,
  Typography,
} from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { FileExcelOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { getAllBranch } from 'apis/branch'
import { getProducts } from 'apis/product'
import { addDelivery } from 'apis/delivery'
import { useDispatch } from 'react-redux'
import XLSX from 'xlsx'
import ImportModal from 'components/ExportCSV/importModal'
import moment from 'moment'
import { ROUTES } from 'consts'
import { getAllStore } from 'apis/store'
import { compare } from 'utils'
const { Option } = Select
export default function ShippingProductAdd(props) {
  const [modal3Visible, setModal3Visible] = useState(false)
  const [selectedRowKeysMain, setSelectedRowKeysMain] = useState([])
  const [branchList, setBranchList] = useState([])
  const [deliveryFlow, setDeliveryFlow] = useState({
    from: '',
    fromtype: 'BRANCH',
    to: '',
    totype: 'BRANCH',
  })
  const [productDelivery, setProductDelivery] = useState([])
  const [modalImportVisible, setModalImportVisible] = useState(false)
  const [options, setOptions] = useState([])
  const [ImportData, setImportData] = useState([])
  const [importLoading, setImportLoading] = useState(false)
  const [storeList, setStoreList] = useState([])
  const [flag, setFlag] = useState(0)
  const history = useHistory()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    var productSend = []
    var success = true
    productDelivery.forEach((e) => {
      if (success)
        if (e.has_variable) {
          let quantityIsvalid = true
          e.variants.forEach((variant) => {
            if (variant.quantity > variant.available_stock_quantity) {
              quantityIsvalid = false
              success = false
              notification.error({
                message: 'Thất bại!',
                description: `Số lượng ${e.name} vượt quá số lượng hiện có`,
              })
              success = false
              return
            }
          })
          if (quantityIsvalid) {
            productSend.push(e)
          }
        } else {
          if (e.quantity <= e.available_stock_quantity) productSend.push(e)
          else {
            notification.error({
              message: 'Thất bại!',
              description: 'Số lượng vượt quá số lượng hiện có',
            })
            success = false
            return
          }
        }
    })
    if (success) {
      try {
        dispatch({ type: 'LOADING', data: true })
        const obj = {
          type: `${deliveryFlow.fromtype}-${deliveryFlow.totype}`,
          user_ship: values.from,
          user_receive: values.to,
          from:
            deliveryFlow.fromtype === 'BRANCH'
              ? branchList.find((e) => e.branch_id === values.from)
              : storeList.find((e) => e.store_id === values.from),
          to:
            deliveryFlow.totype === 'BRANCH'
              ? branchList.find((e) => e.branch_id === values.to)
              : storeList.find((e) => e.store_id === values.to),
          products: productSend,
          ship_time: moment(values.ship_date).format(),
          status: flag ? 'processing' : 'shipping',
          note: values.note,
          tag: values.tag,
        }
        const res = await addDelivery(obj)
        if (res.status == 200) {
          notification.success({
            message: 'Thành công',
            description: 'Thêm phiếu chuyển hàng thành công',
          })
          history.push(ROUTES.SHIPPING_PRODUCT)
        } else {
          notification.error({
            message: 'Thất bại',
            description: res.data.message,
          })
        }
        dispatch({ type: 'LOADING', data: false })
      } catch (e) {
        console.log(e)
        notification.error({
          message: 'Thất bại',
          description: 'Thêm phiếu chuyển hàng thất bại',
        })
        dispatch({ type: 'LOADING', data: false })
      }
    }
  }

  const columns = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return index + 1
      },
    },
    {
      title: 'Mã hàng',
      dataIndex: 'sku',
      width: 150,
      sorter: (a, b) => compare(a, b, 'sku'),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 150,
      sorter: (a, b) => compare(a, b, 'name'),

      render(data, record) {
        return record.title || data
      },
    },
    {
      title: 'Tồn kho',
      width: 150,
      sorter: (a, b) => compare(a, b, 'available_stock_quantity'),
      render(data) {
        return data.available_stock_quantity
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'deliveryQuantity',
      width: 150,
      sorter: (a, b) => compare(a, b, 'quantity'),
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 150,
    // },
  ]
  const columnsVariant = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render(data) {
        return <img src={data[0]} width="80px" />
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      sorter: (a, b) => compare(a, b, 'sku'),
    },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price',
      sorter: (a, b) => compare(a, b, 'import_price'),
    },
    {
      title: 'Giá cơ bản',
      dataIndex: 'base_price',
      sorter: (a, b) => compare(a, b, 'quantity'),
    },
    {
      title: 'Giá bán',
      dataIndex: 'sale_price',
      sorter: (a, b) => compare(a, b, 'sale_price'),
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'available_stock_quantity',
      sorter: (a, b) => compare(a, b, 'available_stock_quantity'),
    },
    {
      title: 'Số lượng chuyển',
      key: 'variantsNumber',
      sorter: (a, b) => compare(a, b, 'variantsNumber'),
    },
  ]

  const settings = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        setImportLoading(true)
      }
      if (info.file.status === 'done') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const bstr = e.target.result
          const workBook = XLSX.read(bstr, { type: 'binary' })
          const workSheetname = workBook.SheetNames[0]
          const workSheet = workBook.Sheets[workSheetname]

          const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 0 })
          // initialTable(fileData);
          const productList = await Promise.all(
            fileData.map((e) => {
              return deliveryFlow.fromtype == 'BRANCH'
                ? getProducts({
                    branch: true,
                    sku: e.sku,
                    product_id: e.product_id,
                    merge: false,
                  })
                : getProducts({
                    store: true,
                    sku: e.sku,
                    product_id: e.product_id,
                    merge: false,
                  })
            })
          )
          console.log('productList', productList)
          if (productList.reduce((a, b) => a && b.data.success, true)) {
            setImportData(
              productList
                .filter((e, index) => {
                  if (e.data.data.length) return true
                  else {
                    notification.error({
                      message: 'Thất bại',
                      description: `Không tìm thấy sản phẩm id ${fileData[index].product_id}`,
                    })
                    return false
                  }
                })
                .map((e, index) => {
                  return {
                    ...e.data.data[0],
                    quantity: fileData[index].quantity,
                  }
                })
            )
          } else {
            notification.error({ message: 'Thất bại' })
          }
          setImportLoading(false)
        }

        reader.readAsBinaryString(info.file.originFileObj)
      }
    },
  }
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const onSelectChangeMain = (selectedRowKeys) => {
    setSelectedRowKeysMain(selectedRowKeys)
  }
  const rowSelectionMain = {
    selectedRowKeysMain,
    onChange: onSelectChangeMain,
  }
  const getBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.status == 200) {
        setBranchList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getStore = async () => {
    try {
      const res = await getAllStore()
      if (res.status == 200) {
        setStoreList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleImport = () => {
    if (ImportData.reduce((a, b) => a && b.available_stock_quantity >= b.quantity, true)) {
      ImportData.forEach((e) => onSelect(JSON.stringify(e)))
      // setProductDelivery([...productDelivery, ...ImportData])
      setModalImportVisible(false)
    } else {
      notification.error({ message: 'Số lượng không hợp lệ' })
    }
  }
  const handleSearch = async (value) => {
    console.log(deliveryFlow)
    if (deliveryFlow.from != '') {
      const res =
        deliveryFlow.fromtype == 'BRANCH'
          ? await getProducts({
              search: value,
              page: 1,
              page_size: 20,
              branch: true,
            })
          : await getProducts({
              search: value,
              store: true,
              page: 1,
              page_size: 20,
            })
      if (res.status == 200) {
        res.data.data.length > 0 ? setOptions(searchResult(res.data.data)) : setOptions([])
      }
    } else {
      notification.warning({ message: 'Vui lòng chọn nơi chuyển!' })
    }
  }

  const searchResult = (query) => {
    return query.map((_, idx) => {
      return {
        value: JSON.stringify(_),
        label: (
          <div
            style={{
              display: 'flex',
              // justifyContent: 'space-between',
            }}
          >
            <img src={_.image[0]} width="100px" style={{ marginRight: 20 }} />
            <span>{_.name}</span>
            {/* <span>{_.sale_price}</span> */}
          </div>
        ),
      }
    })
  }

  const onSelect = (value) => {
    let tmp = JSON.parse(value)
    if (
      !productDelivery
        .map((e) => {
          return e._id
        })
        .includes(tmp._id)
    ) {
      setProductDelivery([...productDelivery, tmp])
    } else {
      notification.info({ message: `Sản phẩm ${tmp.name} đã được thêm` })
    }
  }
  const ImportButton = () => (
    <Upload {...settings}>
      <Button>Nhập Excel</Button>
    </Upload>
  )
  const removeProduct = () => {
    selectedRowKeysMain.forEach((e) => {
      if (
        productDelivery
          .map((e) => {
            return e._id
          })
          .indexOf(e) != -1
      ) {
        let tmp = [...productDelivery]
        tmp.splice(
          productDelivery
            .map((e) => {
              return e._id
            })
            .indexOf(e),
          1
        )
        setSelectedRowKeysMain([])
        setProductDelivery(tmp)
      }
    })
  }
  useEffect(() => {
    getBranch()
    getStore()
  }, [])
  useEffect(() => {
    if (history.location.state) setProductDelivery(history.location.state)
  }, [])
  return (
    <>
      <div className={styles['supplier_add']}>
        <Row className={styles['supplier_add-header']}>
          <Col>
            <ArrowLeftOutlined onClick={() => history.goBack()} style={{ cursor: 'pointer' }} />
          </Col>
          <Col>Thêm phiếu chuyển hàng</Col>
        </Row>

        <Form style={{}} className={styles['supplier_add_content']} onFinish={onFinish}>
          <Row style={{ width: '100%' }} align="middle">
            <span
              style={{
                marginBottom: '0.5rem',
                color: 'black',
                fontWeight: '600',
              }}
            >
              Đặt thời gian : &nbsp;
            </span>
            <Form.Item name="ship_date">
              <DatePicker
                size="large"
                className="br-15__date-picker"
                style={{ width: 250 }}
                showTime
                defaultValue={moment()}
              />
            </Form.Item>
          </Row>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Chuyển từ:&nbsp;
                  <Radio.Group
                    defaultValue="BRANCH"
                    value={deliveryFlow.fromtype}
                    onChange={(e) =>
                      setDeliveryFlow({
                        ...deliveryFlow,
                        fromtype: e.target.value,
                      })
                    }
                  >
                    <Radio value="BRANCH">Chi nhánh</Radio>
                    <Radio value="STORE">Cửa hàng</Radio>
                  </Radio.Group>
                </div>
                <Form.Item
                  name="from"
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn nơi chuyển"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e) => setDeliveryFlow({ ...deliveryFlow, from: e })}
                    optionFilterProp="children"
                  >
                    {deliveryFlow.fromtype === 'BRANCH'
                      ? branchList
                          .filter((e) => e.active)
                          .map((e) => <Option value={e.branch_id}>{e.name}</Option>)
                      : storeList
                          .filter((e) => e.active)
                          .map((e) => <Option value={e.store_id}>{e.name}</Option>)}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Ghi chú
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="note"
                >
                  <Input placeholder="Nhập ghi chú" size="large" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row
            style={{
              borderBottom: '1px solid rgb(236, 226, 226)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Nhận ở:&nbsp;
                  <Radio.Group
                    defaultValue="BRANCH"
                    value={deliveryFlow.totype}
                    onChange={(e) =>
                      setDeliveryFlow({
                        ...deliveryFlow,
                        totype: e.target.value,
                      })
                    }
                  >
                    <Radio value="BRANCH">Chi nhánh</Radio>
                    <Radio value="STORE">Cửa hàng</Radio>
                  </Radio.Group>
                </div>
                <Form.Item
                  name="to"
                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn nơi nhận"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e) => setDeliveryFlow({ ...deliveryFlow, to: e })}
                    optionFilterProp="children"
                  >
                    {deliveryFlow.totype === 'BRANCH'
                      ? branchList
                          .filter((e) => e.active)
                          .map((e) => <Option value={e.branch_id}>{e.name}</Option>)
                      : storeList
                          .filter((e) => e.active)
                          .map((e) => <Option value={e.store_id}>{e.name}</Option>)}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div
                  style={{
                    marginBottom: '0.5rem',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  Tag
                </div>
                <Form.Item
                  className={styles['supplier_add_content_supplier_code_input']}
                  name="tag"
                >
                  <Select size="large" mode="tags" style={{ width: '100%' }}></Select>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              color: 'black',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Thông tin sản phẩm
          </div>

          <AutoComplete
            size="large"
            dropdownMatchSelectWidth={252}
            style={{
              width: '100%',
            }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            onFocus={handleSearch}
          >
            <div
              style={{
                display: 'flex',
                margin: '1rem 0',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="Tìm kiếm theo mã, theo tên"
                size="large"
              />
            </div>
          </AutoComplete>

          <Row
            style={{
              width: '100%',
              marginTop: 20,
            }}
            justify="end"
          >
            <Button
              size="large"
              icon={<FileExcelOutlined />}
              onClick={() => setModalImportVisible(true)}
              style={{
                backgroundColor: '#004F88',
                color: 'white',
              }}
            >
              Nhập excel
            </Button>
          </Row>

          <Row style={{ width: '100%' }}>
            <div
              style={{
                marginBottom: '0.5rem',
                color: 'black',
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Danh sách sản phẩm chuyển
            </div>
          </Row>
          <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
            <Table
              rowSelection={rowSelectionMain}
              expandable={{
                expandedRowRender: (record, indexRecord) => (
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={record.variants}
                    columns={columnsVariant.map((e, indexVariant) => {
                      if (e.key == 'variantsNumber')
                        return {
                          ...e,
                          render(text, data, i) {
                            return (
                              <InputNumber
                                onBlur={(val) => {
                                  productDelivery[indexRecord].variants[i].quantity = parseInt(
                                    val.target.value
                                  )
                                }}
                              />
                            )
                          },
                        }
                      return e
                    })}
                  />
                ),
                rowExpandable: (record) => record.has_variable,
              }}
              rowKey="_id"
              columns={columns.map((e) => {
                if (e.key === 'deliveryQuantity')
                  return {
                    ...e,
                    render(data, record, index) {
                      return (
                        !record.has_variable && (
                          <InputNumber
                            defaultValue={data}
                            onBlur={(e) => {
                              productDelivery[index].quantity = parseInt(e.target.value)
                            }}
                          />
                        )
                      )
                    },
                  }
                return e
              })}
              dataSource={productDelivery}
              scroll={{ y: 500 }}
            />
          </div>

          <Row justify="end" style={{ marginTop: '1rem', width: '100%' }}>
            <Space size="large">
              {selectedRowKeysMain.length ? (
                <Button
                  size="large"
                  type="primary"
                  danger
                  // style={{ width: 120 }}
                  onClick={removeProduct}
                >
                  Xóa sản phẩm
                </Button>
              ) : (
                ''
              )}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  onClick={() => setFlag(1)}
                  style={{ width: 120 }}
                >
                  Lưu
                </Button>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  onClick={() => setFlag(0)}
                  style={{ width: 120 }}
                >
                  Chuyển
                </Button>
              </Form.Item>
            </Space>
          </Row>
        </Form>

        <Modal
          title="Cập nhật số lượng sản phẩm"
          centered
          footer={null}
          visible={modal3Visible}
          onOk={() => modal3VisibleModal(false)}
          onCancel={() => modal3VisibleModal(false)}
        >
          <Form
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
            onFinish={onFinish}
          >
            <div
              style={{
                display: 'flex',
                marginBottom: '0.5rem',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              Số lượng
            </div>
            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
              // label="Username"
              name="quantity"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input placeholder="Nhập số lượng cập nhật" />
            </Form.Item>
            <Row style={{}} className={styles['supplier_add_content_supplier_button']}>
              {/* <Col onClick={() => modal2VisibleModal(false)} style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>

              </Col> */}
              <Col
                onClick={() => modal3VisibleModal(false)}
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
                md={5}
                lg={4}
                xl={3}
              >
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
        <ImportModal
          visible={modalImportVisible}
          onOk={handleImport}
          dataSource={ImportData}
          importLoading={importLoading}
          columns={columns}
          actionComponent={<ImportButton />}
          downTemplate="https://ecomfullfillment.s3.ap-southeast-1.amazonaws.com/1629443650598_ecomfullfillment.xlsx"
          onCancel={() => setModalImportVisible(false)}
        />
      </div>
    </>
  )
}
