import React, { useState, useEffect } from 'react'
import styles from './../add/add.module.scss'

import { ACTION } from 'consts'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

//antd
import {
  Button,
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
  Space,
  Modal,
  Affix,
  Typography,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  InboxOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons'

//apis
import { apiAllCategory } from 'apis/category'
import { apiAllSupplier } from 'apis/supplier'
import { apiAllInventory } from 'apis/inventory'
import { uploadFiles, uploadFile } from 'apis/upload'
import { apiAllWarranty } from 'apis/warranty'
import { apiAddProduct } from 'apis/product'

const { Text } = Typography

export default function ProductAdd() {
  const [supplier, setSupplier] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = Form.useForm()

  const [idsWarranty, setIdsWarranty] = useState([])
  const [isWarranty, setIsWarranty] = useState(false)
  const [warrantys, setWarrantys] = useState([])
  const [warehouse, setWarehouse] = useState([])
  const [attributes, setAttributes] = useState([
    {
      option: '',
      values: [],
    },
  ])
  const [variants, setVariants] = useState([])
  const [selectRowKeyVariant, setSelectRowKeyVariant] = useState([])
  const [isProductHasVariants, setIsProductHasVariants] = useState(false) //check product is have variants ?
  const [helpTextImage, setHelpTextImage] = useState('')
  const [imagesProduct, setImagesProduct] = useState([])
  const [isInputInfoProduct, setIsInputInfoProduct] = useState(false)

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
          imagePreview: '',
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
            imagePreview: '',
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

  const addProduct = async () => {
    //validated
    let isValidated = true
    try {
      await form.validateFields()
      isValidated = true
    } catch (error) {
      isValidated = false
    }

    if (!isValidated) return

    //validated images product
    if (imagesProduct.length === 0) {
      setHelpTextImage('Vui lòng chọn ít nhất 1 ảnh!')
      return
    } else setHelpTextImage('')

    //validated quantity, prices
    for (let i = 0; i < variants.length; ++i) {
      if (!variants[i].base_price) {
        notification.error({
          message: 'Vui lòng nhập giá cơ bản trong variant!',
        })
        return
      }
      if (!variants[i].import_price) {
        notification.error({ message: 'Vui lòng nhập giá nhập trong variant!' })
        return
      }
      if (!variants[i].sale_price) {
        notification.error({ message: 'Vui lòng nhập giá bán trong variant!' })
        return
      }
      if (!variants[i].quantity) {
        notification.error({
          message: 'Vui lòng nhập số lượng sản phẩm trong variant!',
        })
        return
      }
    }

    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const formProduct = form.getFieldsValue()

      const images = await uploadFiles(imagesProduct)

      let body = {
        ...formProduct,
        length: formProduct.length || '',
        width: formProduct.width || '',
        height: formProduct.height || '',
        weight: formProduct.weight || '',
        unit: formProduct.unit || '',
        warranty: idsWarranty,
        barcode: '',
        image: images || [],
        has_variable: isProductHasVariants,
      }

      if (isProductHasVariants) {
        body.attributes = attributes
        const promiseUpload = variants.map(async (v) => {
          const resUpload = await uploadFile(v.image)
          delete v.imagePreview
          return {
            ...v,
            supplier: formProduct.suppliers,
            image: resUpload,
          }
        })

        const variantsNew = await Promise.all(promiseUpload)

        body.variants = variantsNew
      }

      console.log(JSON.stringify({ product_list: [body] }))
      const res = await apiAddProduct({ product_list: [body] })
      if (res.data.status === 200) {
        notification.success({ message: 'Tạo sản phẩm thành công!' })
        history.goBack()
      } else notification.error({ message: 'Tạo sản phẩm thất bại!' })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
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

  /* list input variants */
  const uploadImage = async (file, imagePreview, indexVariant) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      let variantsNew = [...variants]

      //preview anh tren table
      if (indexVariant !== -1 && file) {
        variantsNew[indexVariant].imagePreview = imagePreview //lưu base64
        variantsNew[indexVariant].image = file //lưu file upload
      }

      setVariants([...variantsNew])
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const UploadImageProduct = ({ variant }) => {
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="upload-variant-image"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        data={(file) => {
          getBase64(file, (url) => {
            const indexVariant = variants.findIndex(
              (ob) => ob.title === variant.title
            )
            uploadImage(file, url, indexVariant)
          })
        }}
      >
        {variant.imagePreview ? (
          <img src={variant.imagePreview} alt="" style={{ width: '100%' }} />
        ) : (
          <div>
            <PlusOutlined />
          </div>
        )}
      </Upload>
    )
  }

  const InputQuantity = ({ value, variant }) => {
    const [valueQuantity, setValueQuantity] = useState(value)

    return (
      <InputNumber
        placeholder="Nhập số lượng"
        className="br-15__input"
        size="large"
        defaultValue={value}
        min={0}
        onBlur={() => {
          let variantsNew = [...variants]
          const index = variantsNew.findIndex((e) => e.title === variant.title)
          variantsNew[index].quantity = valueQuantity
          setVariants([...variantsNew])
        }}
        onChange={(value) => setValueQuantity(value)}
        style={{ width: '100%' }}
      />
    )
  }

  const InputImportPrice = ({ value, variant }) => {
    const [valueImportPrice, setValueImportPrice] = useState(value)

    return (
      <>
        Giá nhập
        <InputNumber
          placeholder="Nhập giá nhập"
          className="br-15__input"
          size="large"
          defaultValue={value}
          min={0}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          onBlur={() => {
            let variantsNew = [...variants]
            const index = variantsNew.findIndex(
              (e) => e.title === variant.title
            )
            variantsNew[index].import_price = valueImportPrice
            setVariants([...variantsNew])
          }}
          onChange={(value) => setValueImportPrice(value)}
          style={{ width: '100%' }}
        />
      </>
    )
  }

  const InputBasePrice = ({ value, variant }) => {
    const [valueBasePrice, setValueBasePrice] = useState(value)

    return (
      <>
        Giá cơ bản
        <InputNumber
          placeholder="Nhập giá cơ bản"
          className="br-15__input"
          size="large"
          defaultValue={value}
          min={0}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          onBlur={() => {
            let variantsNew = [...variants]
            const index = variantsNew.findIndex(
              (e) => e.title === variant.title
            )
            variantsNew[index].base_price = valueBasePrice
            setVariants([...variantsNew])
          }}
          onChange={(value) => setValueBasePrice(value)}
          style={{ width: '100%' }}
        />
      </>
    )
  }

  const InputSalePrice = ({ value, variant }) => {
    const [valueSalePrice, setValueSalePrice] = useState(value)

    return (
      <>
        Giá bán
        <InputNumber
          placeholder="Nhập giá bán"
          className="br-15__input"
          size="large"
          defaultValue={value}
          min={0}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          onBlur={() => {
            let variantsNew = [...variants]
            const index = variantsNew.findIndex(
              (e) => e.title === variant.title
            )
            variantsNew[index].sale_price = valueSalePrice
            setVariants([...variantsNew])
          }}
          onChange={(value) => setValueSalePrice(value)}
          style={{ width: '100%' }}
        />
      </>
    )
  }

  const UploadAllVariant = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [urlImage, setUrlImage] = useState('')
    const [file, setFile] = useState(null)

    const upload = () => {
      if (file) {
        const variantsNew = [...variants]

        selectRowKeyVariant.map((key) => {
          const indexVariant = variantsNew.findIndex((ob) => ob.title === key)
          variantsNew[indexVariant].imagePreview = urlImage
          variantsNew[indexVariant].image = file
        })

        setVariants([...variantsNew])
      }

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) setUrlImage('')
    }, [visible])
    return (
      <>
        <Button size="large" onClick={toggle}>
          Chọn ảnh
        </Button>
        <Modal
          visible={visible}
          title="Chọn ảnh"
          onCancel={toggle}
          onOk={upload}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            data={(file) => {
              setFile(file)
              getBase64(file, (url) => setUrlImage(url))
            }}
          >
            {urlImage ? (
              <img src={urlImage} alt="" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
              </div>
            )}
          </Upload>
        </Modal>
      </>
    )
  }

  const EditQuantity = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [valueQuantity, setValueQuantity] = useState('')

    const edit = () => {
      if (valueQuantity) {
        let variantsNew = [...variants]

        selectRowKeyVariant.map((key) => {
          const indexVariant = variantsNew.findIndex((ob) => ob.title === key)
          variantsNew[indexVariant].quantity = valueQuantity
        })

        setVariants([...variantsNew])
      }

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) setValueQuantity('')
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle}>
          Nhập số lượng sản phẩm
        </Button>
        <Modal
          visible={visible}
          onCancel={toggle}
          onOk={edit}
          title="Nhập số lượng sản phẩm"
        >
          <InputNumber
            placeholder="Nhập số lượng"
            className="br-15__input"
            size="large"
            defaultValue={valueQuantity}
            min={0}
            onChange={(value) => setValueQuantity(value)}
            style={{ width: '100%' }}
          />
        </Modal>
      </>
    )
  }

  const EditPrice = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [valueSalePrice, setValueSalePrice] = useState('')
    const [valueBasePrice, setValueBasePrice] = useState('')
    const [valueImportPrice, setValueImportPrice] = useState('')

    const edit = () => {
      let variantsNew = [...variants]

      selectRowKeyVariant.map((key) => {
        const indexVariant = variantsNew.findIndex((ob) => ob.title === key)

        variantsNew[indexVariant].import_price = valueImportPrice
        variantsNew[indexVariant].sale_price = valueSalePrice
        variantsNew[indexVariant].base_price = valueBasePrice
      })

      setVariants([...variantsNew])

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) {
        setValueSalePrice('')
        setValueImportPrice('')
        setValueBasePrice('')
      }
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle}>
          Nhập giá
        </Button>
        <Modal visible={visible} onCancel={toggle} onOk={edit} title="Nhập giá">
          <Space size="middle" direction="vertical">
            <div>
              <span style={{ marginBottom: 0 }}>Giá bán</span>
              <InputNumber
                placeholder="Nhập giá bán"
                className="br-15__input"
                size="large"
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValueSalePrice(value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <span style={{ marginBottom: 0 }}>Giá cơ bản</span>
              <InputNumber
                placeholder="Nhập giá cơ bản"
                className="br-15__input"
                size="large"
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValueBasePrice(value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <span style={{ marginBottom: 0 }}>Giá nhập</span>
              <InputNumber
                placeholder="Nhập giá nhập"
                className="br-15__input"
                size="large"
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValueImportPrice(value)}
                style={{ width: '100%' }}
              />
            </div>
          </Space>
        </Modal>
      </>
    )
  }
  /* list input variants */

  const columnsVariant = [
    {
      width: 120,
      title: 'Hình ảnh',
      render: (text, record) => <UploadImageProduct variant={record} />,
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
      width: 300,
      render: (text, record) => (
        <InputQuantity value={record.quantity} variant={record} />
      ),
    },
    {
      title: 'Giá',
      width: 300,
      render: (text, record) => (
        <Space size="middle" direction="vertical" style={{ width: '100%' }}>
          <InputSalePrice value={record.sale_price} variant={record} />
          <InputBasePrice value={record.base_price} variant={record} />
          <InputImportPrice value={record.import_price} variant={record} />
        </Space>
      ),
    },
  ]

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

  const apiAllWarrantyData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllWarranty()
      console.log(res)
      if (res.status === 200) {
        setWarrantys(res.data.data)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
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
      <Affix offsetTop={10} style={{ width: '100%' }}>
        <Row
          align="middle"
          justify="space-between"
          style={{
            width: '100%',
            paddingBottom: 10,
            paddingTop: 10,
            borderBottom: '1px solid rgb(235, 226, 226)',
            backgroundColor: 'white',
            zIndex: 8888,
          }}
        >
          <a
            onClick={() => history.goBack()}
            className={styles['product_manager_title']}
          >
            <ArrowLeftOutlined style={{ color: 'black' }} />
            <div className={styles['product_manager_title_product']}>
              Thêm mới sản phẩm
            </div>
          </a>
          <Button type="primary" onClick={addProduct}>
            Thêm
          </Button>
        </Row>
      </Affix>
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
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              ]}
            >
              <Input size="large" placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Mã sản phẩm/SKU"
              name="sku"
              rules={[
                { required: true, message: 'Vui lòng nhập mã sản phẩm/sku!' },
              ]}
            >
              <Input size="large" placeholder="Nhập mã sản phẩm/sku" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Số lượng sản phẩm"
              name="quantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng sản phẩm!' },
              ]}
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
              rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
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
              rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản!' }]}
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
              rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
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
              rules={[
                { required: true, message: 'Vui lòng chọn nhà cung cấp!' },
              ]}
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
              rules={[{ required: true, message: 'Vui lòng chọn kho!' }]}
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
              rules={[
                { required: true, message: 'Vui lòng chọn loại sản phẩm!' },
              ]}
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
          <div style={{ marginBottom: 10 }}>
            <Checkbox
              checked={isInputInfoProduct}
              onChange={(e) => setIsInputInfoProduct(e.target.checked)}
            >
              Thông số sản phẩm (không bắt buộc)
            </Checkbox>
          </div>
          <Row
            justify="space-between"
            align="middle"
            style={{
              width: '100%',
              marginBottom: 15,
              display: !isInputInfoProduct && 'none',
            }}
          >
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item name="length">
                <Input size="large" placeholder="Chiều dài (cm)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item name="width">
                <Input size="large" placeholder="Chiều rộng (cm)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item name="height">
                <Input size="large" placeholder="Chiều cao (cm)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item name="weight">
                <Input size="large" placeholder="Cân nặng (kg)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item name="unit">
                <Input size="large" placeholder="Đơn vị" />
              </Form.Item>
            </Col>
          </Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <span style={{ color: 'red' }}>* </span>
            Hình ảnh
            <Upload.Dragger
              name="files"
              listType="picture"
              multiple
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => {
                if (info.file.status !== 'done') info.file.status = 'done'
                let imagesProductNew = [...imagesProduct]
                imagesProductNew = info.fileList.map((e) => e.originFileObj)
                setImagesProduct([...imagesProductNew])
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
              // data={(file) => {
              //   let imagesProductNew = [...imagesProduct]
              //   imagesProductNew.push(file)
              //   setImagesProduct([...imagesProductNew])
              // }}
              // onRemove={(file) => {
              //   let imagesProductNew = [...imagesProduct]
              //   console.log(file)
              //   console.log(imagesProductNew)
              // }}
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
            <span style={{ color: 'red' }}>{helpTextImage}</span>
          </Col>
          <Row
            justify="space-between"
            style={{ width: '100%', marginTop: 15, marginBottom: 15 }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>Thuộc tính</div>
            <Checkbox
              checked={isProductHasVariants}
              onChange={(e) => setIsProductHasVariants(e.target.checked)}
            >
              Sản phẩm có nhiều variant
            </Checkbox>
          </Row>
        </Row>
      </Form>

      <div
        style={{
          display: isProductHasVariants ? '' : 'none',
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
          <div
            style={{
              marginLeft: 10,
              marginTop: 10,
              marginBottom: 20,
              display: !selectRowKeyVariant.length && 'none',
            }}
          >
            <Space wrap>
              <UploadAllVariant />
              <EditQuantity />
              <EditPrice />
            </Space>
          </div>
          <Table
            rowKey="title"
            columns={columnsVariant}
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
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Row
        style={{
          width: '100%',
          marginTop: 20,
        }}
      >
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Checkbox
            style={{ marginBottom: 4 }}
            checked={isWarranty}
            onChange={(e) => {
              const checked = e.target.checked
              if (!checked) setIdsWarranty([])

              setIsWarranty(checked)
            }}
          >
            Thêm chính sách bảo hành (không bắt buộc)
          </Checkbox>
          <Select
            size="large"
            mode="multiple"
            style={{ width: '100%', display: !isWarranty && 'none' }}
            placeholder="Chọn chính sách bảo hành"
            onChange={(value) => setIdsWarranty(value)}
            value={idsWarranty}
          >
            {warrantys.map((values, index) => (
              <Select.Option value={values.warranty_id} key={index}>
                {values.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  )
}
