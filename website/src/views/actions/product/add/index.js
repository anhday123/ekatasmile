import React, { useState, useEffect } from 'react'
import styles from './../add/add.module.scss'

import { ACTION } from 'consts'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

//antd
import {
  Button,
  Tabs,
  Table,
  Input,
  Form,
  Row,
  Col,
  InputNumber,
  Select,
  Upload,
  Checkbox,
  notification,
  Popconfirm,
  Tooltip,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  InboxOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons'

//components
import SingleProduct from './components/singleProduct'
import GroupProduct from './components/groupProduct'

//apis
import { apiAllCategory } from 'apis/category'
import { apiAllWarranty } from 'apis/warranty'
import { apiAllSupplier } from 'apis/supplier'
import { apiAllInventory } from 'apis/inventory'
import { uploadFiles } from 'apis/upload'

const { TabPane } = Tabs
export default function ProductAdd() {
  const [supplier, setSupplier] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = Form.useForm()
  const [warranty, setWarranty] = useState([])
  const [warehouse, setWarehouse] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [imageUrlProduct, setImageUrlProduct] = useState('') //file preview
  const [imagesUploadProduct, setImageUploadProduct] = useState([]) //files upload
  const [attributes, setAttributes] = useState([
    {
      option: '',
      values: [],
    },
  ])
  const [variants, setVariants] = useState([])
  const [productList, setProductList] = useState([])
  const [selectRowKeyVariant, setSelectRowKeyVariant] = useState([])
  const [isProductVariants, setIsProductVariants] = useState(false) //check product is have variants ?

  const addAttribute = () => {
    let attributesNew = [...attributes]
    attributesNew.push({
      option: '',
      values: [],
    })
    setAttributes([...attributesNew])
  }

  const removeAttribute = (index) => {
    let attributesNew = [...attributes]
    attributesNew.splice(index, 1)
    setAttributes([...attributesNew])
  }

  const addValueVariant = () => {
    let variantsNew = []
    const dataProductAdd = form.getFieldsValue()

    //trường hợp chỉ có 1 attribute
    if (attributes.length === 1) {
      attributes[0].values.map((value) => {
        variantsNew.push({
          title: `${dataProductAdd.name || ''} ${value}`,
          sku: `${dataProductAdd.sku || ''}-${value}`,
          image: '',
          supplier: dataProductAdd.suppliers || '',
          options: [{ name: attributes[0].option, values: value }],
          quantity: 0,
          import_price: 0,
          base_price: 0,
          sale_price: 0,
        })
      })
    } else {
      //trường hợp có 2 attribute
      attributes[0].values.map((v0) => {
        attributes[1].values.map((v1) => {
          variantsNew.push({
            title: `${dataProductAdd.name || ''} ${v0} ${v1}`,
            sku: `${dataProductAdd.sku || ''}-${v0}-${v1}`,
            image: '',
            supplier: dataProductAdd.suppliers || '',
            options: [
              { name: attributes[0].option, values: v0 },
              { name: attributes[1].option, values: v1 },
            ],
            quantity: 0,
            import_price: 0,
            base_price: 0,
            sale_price: 0,
          })
        })
      })
    }

    setVariants([...variantsNew])
  }

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const apiAllSupplierData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllSupplier()
      console.log(res)
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setSupplier([...array])
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const [category, setCategory] = useState([])
  const apiAllCategoryData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllCategory()

      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setCategory([...array])
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
    },
    {
      title: 'Mã barcode',
      dataIndex: 'barcode',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'moneyPrice',
    },
  ]
  console.log(variants)
  /* list input variants */
  const UploadImageProduct = ({ variant }) => {
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="upload-variant-image"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        data={(file) => {
          let variantsNew = [...variants]

          getBase64(file, (img) => {
            //preview anh tren table
            const indexAdd = variantsNew.findIndex(
              (ob) => ob.title === variant.title
            )

            if (indexAdd !== -1) {
              variantsNew[indexAdd].image = img
            }
          })

          setVariants([...variantsNew])
        }}
      >
        {variant.image ? (
          <img src={variant.image} alt="" style={{ width: '100%' }} />
        ) : (
          <div>
            <PlusOutlined />
          </div>
        )}
      </Upload>
    )
  }
  /* list input variants */

  const columnsVariant = [
    {
      width: 120,
      title: 'Hình ảnh',
      key: 'image',
    },
    {
      title: 'Variant',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Số lượng',
    },
    {
      title: 'Giá',
    },
  ]
  const dataTable = []
  for (let i = 0; i < 46; i++) {
    dataTable.push({
      key: i,
      productName: `Quần áo ${i}`,
      productCode: `QA-${i}`,
      barcode: `${i}`,
      quantity: <Input defaultValue={i} />,
      moneyPrice: `${i}00.000 VNĐ`,
    })
  }
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const apiAllWarrantyData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllWarranty()
      console.log(res)
      if (res.status === 200) {
        setWarranty(res.data.data)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const getWarehouse = async () => {
    try {
      const res = await apiAllInventory()
      if (res.status === 200) {
        var array = []
        res.data.data &&
          res.data.data.length > 0 &&
          res.data.data.forEach((values, index) => {
            if (values.active) {
              array.push(values)
            }
          })
        setWarehouse([...array])
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getWarehouse()
    apiAllSupplierData()
    apiAllWarrantyData()
    apiAllCategoryData()
  }, [])

  useEffect(() => {
    addValueVariant()
  }, [attributes])

  return (
    <div className={styles['product_manager']}>
      <a
        onClick={() => history.goBack()}
        className={styles['product_manager_title']}
      >
        <ArrowLeftOutlined style={{ color: 'black' }} />
        <div className={styles['product_manager_title_product']}>
          Thêm mới sản phẩm
        </div>
      </a>

      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', marginTop: 15 }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input size="large" placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Mã sản phẩm/SKU"
              name="sku"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input size="large" placeholder="Nhập mã sản phẩm/sku" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Số lượng sản phẩm"
              name="quantity"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                size="large"
                min={1}
                placeholder="Nhập số lượng sản phẩm"
                style={{ width: '100%' }}
                className="br-15__input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Giá bán"
              name="sale_price"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá bán"
                style={{ width: '100%' }}
                className="br-15__input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Giá cơ bản"
              name="base_price"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá cơ bản"
                style={{ width: '100%' }}
                className="br-15__input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Giá nhập"
              name="import_price"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá nhập"
                style={{ width: '100%' }}
                className="br-15__input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Nhà cung cấp"
              name="suppliers"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn nhà cung cấp"
              >
                {supplier.map((values, index) => {
                  return (
                    <Select.Option value={values.supplier_id} key={index}>
                      {values.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Loại kho"
              name="warehouse"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn loại kho"
              >
                {warehouse.map((values, index) => {
                  return (
                    <Select.Option value={values.warehouse_id} key={index}>
                      {values.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Loại sản phẩm"
              name="category"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn loại sản phẩm"
              >
                {category.map((values, index) => {
                  return (
                    <Select.Option value={values.category_id} key={index}>
                      {values.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <span style={{ color: 'red' }}>* </span>
            Hình ảnh
            <Upload.Dragger
              name="files"
              listType="picture"
              multiple
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                const { status } = info.file
                if (status !== 'done') info.file.status = 'done'
              }}
              // defaultFileList={d.mockup.map((e, index) => {
              //   let nameFile = ['image']
              //   if (typeof e === 'string')
              //     nameFile = e.split('/')
              //   return {
              //     uid: index,
              //     name: nameFile[nameFile.length - 1] || 'image',
              //     status: 'done',
              //     url: e,
              //     thumbUrl: e,
              //   }
              // })}
              data={async (file) => {
                imagesUploadProduct.push(file)
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a .PNG, .JPG, .TIFF, .EPS image.
              </p>
            </Upload.Dragger>
          </Col>
          <Row
            justify="space-between"
            style={{ width: '100%', marginTop: 15, marginBottom: 15 }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>Thuộc tính</div>
            <Checkbox
              checked={isProductVariants}
              onChange={(e) => setIsProductVariants(e.target.checked)}
            >
              Sản phẩm có nhiều variant
            </Checkbox>
          </Row>
        </Row>
      </Form>

      <div
        style={{
          display: isProductVariants ? '' : 'none',
          width: '100%',
        }}
      >
        <div
          style={{
            marginBottom: 16,
            border: '1px solid #f0f0f0',
            padding: 16,
            width: '100%',
          }}
        >
          {attributes.map((e, index) => {
            const RenderInput = () => (
              <Input
                size="large"
                placeholder="Nhập tên thuộc tính"
                defaultValue={e.option}
                onBlur={(e) => {
                  attributes[index].option = e.target.value
                }}
                style={{ width: '100%' }}
              />
            )
            return (
              <Row
                style={{ width: '100%', marginBottom: 15 }}
                justify="space-between"
                align="middle"
              >
                <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                  <span style={{ marginBottom: 0 }}>Tên thuộc tính</span>
                  <RenderInput />
                </Col>
                <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                  <span style={{ marginBottom: 0 }}>Giá trị</span>
                  <Select
                    mode="tags"
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Nhập giá trị"
                    value={e.values.map((v) => v)}
                    onDeselect={(v) => {
                      //remove tag
                      let items = [...attributes]
                      const indexRemove = e.values.findIndex((f) => f === v)
                      if (indexRemove !== -1) {
                        items[index].values.splice(indexRemove, 1)
                        setAttributes([...items])
                      }
                    }}
                    onSelect={(e) => {
                      //add tag
                      let items = [...attributes]

                      //check value add này đã tồn tại chưa
                      for (let i = 0; i < items.length; ++i) {
                        for (let j = 0; j < items[i].values.length; ++j) {
                          if (items[i].values[j] === e) {
                            notification.error({
                              message: 'Giá trị đã có!',
                            })
                            return
                          }
                        }
                      }

                      //trường hợp nhập nhiều variant bởi dấu phẩy
                      //ví dụ: color, size, quantity
                      const splitValue = e.split(',')

                      splitValue.map((v) => {
                        if (v) items[index].values.push(v.trim())
                      })
                      setAttributes([...items])
                    }}
                    optionLabelProp="label"
                  ></Select>
                </Col>
                <Popconfirm
                  title="Bạn có muốn xoá thuộc tính này?"
                  onConfirm={() => removeAttribute(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseOutlined
                    style={{
                      cursor: 'pointer',
                      color: 'red',
                      fontSize: 18,
                      marginTop: 22,
                      marginLeft: 5,
                      display: attributes.length === 1 && 'none',
                    }}
                  />
                </Popconfirm>
                <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                  <Tooltip title="Tối đa tạo 2 thuộc tính">
                    <Button
                      size="large"
                      style={{
                        marginTop: 17,
                        display: attributes.length === 2 && 'none',
                      }}
                      onClick={addAttribute}
                    >
                      Thêm thuộc tính khác
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            )
          })}
        </div>

        <div
          style={{
            marginBottom: 16,
            border: '1px solid #f0f0f0',
            width: '100%',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid #f0f0f0',
              width: '100%',
            }}
          >
            <div style={{ width: '100%', padding: 16 }}>
              <h3 style={{ marginBottom: 0, fontWeight: 700 }}>Phiên bản</h3>
            </div>
          </div>
          <Table
            rowKey="title"
            columns={columnsVariant.map((e) => {
              if (e.key === 'image') {
                return {
                  ...e,
                  render: (text, record) => (
                    <UploadImageProduct variant={record} />
                  ),
                }
              }
              return e
            })}
            dataSource={variants}
            pagination={false}
            rowSelection={{
              selectedRowKeys: selectRowKeyVariant,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectRowKeyVariant(selectedRowKeys)
              },
            }}
            size="small"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <Tabs style={{ width: '100%' }} defaultActiveKey="1">
        <TabPane tab="Sản phẩm đơn" key="1">
          <SingleProduct
            category={category}
            supplier={supplier}
            warranty={warranty}
            warehouse={warehouse}
          />
        </TabPane>
        <TabPane tab="Sản phẩm đa nhóm" key="2">
          <GroupProduct
            category={category}
            supplier={supplier}
            warranty={warranty}
            warehouse={warehouse}
          />
        </TabPane>
        <TabPane tab="Quét để nhập" key="3">
          <div
            style={{
              width: '100%',
              marginTop: '1rem',
              border: '1px solid rgb(243, 234, 234)',
            }}
          >
            <Table
              size="small"
              rowKey="_id"
              bordered
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataTable}
              scroll={{ y: 500 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button size="large" htmlType="submit" type="primary">
              Thêm
            </Button>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}
