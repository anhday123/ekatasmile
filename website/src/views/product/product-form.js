import React, { useState, useEffect, useRef } from 'react'
import styles from './product.module.scss'

import { ACTION, ROUTES, PERMISSIONS } from 'consts'
import { removeAccents } from 'utils'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CKEditor } from 'ckeditor4-react'
import parse from 'html-react-parser'
import delay from 'delay'

//components
import NotSupportMobile from 'components/not-support-mobile'
import TitlePage from 'components/title-page'
import SupplierForm from 'views/supplier/supplier-form'
import Permission from 'components/permission'

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
  Switch,
  Tabs,
  TreeSelect,
} from 'antd'

//icons
import {
  ArrowLeftOutlined,
  InboxOutlined,
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  FileImageOutlined,
  DollarOutlined,
  ReloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

//apis
import { getCategories } from 'apis/category'
import { getSuppliers } from 'apis/supplier'
import { uploadFiles, uploadFile } from 'apis/upload'
import { getWarranties } from 'apis/warranty'
import { updateProduct, addProduct } from 'apis/product'

export default function ProductAdd() {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const [form] = Form.useForm()
  const typingTimeoutRef = useRef(null)
  const dataUser = useSelector((state) => state.login.dataUser)
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [keyTab, setKeyTab] = useState('1')
  const [isRenderFirst, setIsRenderFirst] = useState(false)
  const [files, setFiles] = useState([])
  const [loadingFile, setLoadingFile] = useState(false)
  const [idsWarranty, setIdsWarranty] = useState([])
  const [isWarranty, setIsWarranty] = useState(true)
  const [warranties, setWarranties] = useState([])
  const [attributes, setAttributes] = useState([{ option: '', values: [] }])
  const [variants, setVariants] = useState([])
  const [selectRowKeyVariant, setSelectRowKeyVariant] = useState([])
  const [isProductHasVariants, setIsProductHasVariants] = useState(false) //check product is have variants ?
  const [imagesProduct, setImagesProduct] = useState([]) //files upload
  const [imagesPreviewProduct, setImagesPreviewProduct] = useState([]) //url image
  const [isInputInfoProduct, setIsInputInfoProduct] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [description, setDescription] = useState('')
  const [productIsHaveDescription, setProductIsHaveDescription] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState('') // dung o variant
  const [isGeneratedSku, setIsGeneratedSku] = useState(false)
  const [valueGeneratedSku, setValueGeneratedSku] = useState('')
  const [skuProductWithEdit, setSkuProductWithEdit] = useState('')
  const [bulkPrices, setBulkPrices] = useState([]) //giá sỉ

  const addAttribute = () => {
    let attributesNew = [...attributes]
    attributesNew.push({ option: '', values: [] })
    setAttributes([...attributesNew])
  }

  const removeAttribute = (index) => {
    let attributesNew = [...attributes]
    attributesNew.splice(index, 1)
    setAttributes([...attributesNew])
  }

  const addValueVariant = () => {
    let variantsNew = []

    const dataForm = form.getFieldsValue()
    console.log(dataForm)

    const initVariant = {
      image: [],
      price: dataForm.price || 0,
      bulk_prices: [...bulkPrices],
      enable_bulk_price: true,
    }

    if (attributes.length !== 0) {
      //trường hợp chỉ có 1 attribute
      if (attributes.length === 1) {
        attributes[0].values.map((value) => {
          variantsNew.push({
            title: `${(
              dataForm.name || ''
            ).toUpperCase()} ${attributes[0].option.toUpperCase()} ${value.toUpperCase()}`,
            sku: `${
              valueGeneratedSku || ''
            }-${attributes[0].option.toUpperCase()}-${value.toUpperCase()}`,
            options: [{ name: attributes[0].option, value: value }],
            ...initVariant,
          })
        })
      } else {
        //trường hợp có 2 attribute
        if (!attributes[0].values.length)
          attributes[1].values.map((value) => {
            variantsNew.push({
              title: `${(
                dataForm.name || ''
              ).toUpperCase()} ${attributes[1].option.toUpperCase()} ${value.toUpperCase()}`,
              sku: `${
                valueGeneratedSku || ''
              }-${attributes[1].option.toUpperCase()}-${value.toUpperCase()}`,
              options: [{ name: attributes[1].option, value: value }],
              ...initVariant,
            })
          })

        if (!attributes[1].values.length)
          attributes[0].values.map((value) => {
            variantsNew.push({
              title: `${(
                dataForm.name || ''
              ).toUpperCase()} ${attributes[0].option.toUpperCase()} ${value.toUpperCase()}`,
              sku: `${
                valueGeneratedSku || ''
              }-${attributes[0].option.toUpperCase()}-${value.toUpperCase()}`,
              options: [{ name: attributes[0].option, value: value }],
            })
          })

        if (attributes[0].values.length && attributes[1].values.length)
          attributes[0].values.map((v0) => {
            attributes[1].values.map((v1) => {
              variantsNew.push({
                title: `${(
                  dataForm.name || ''
                ).toUpperCase()} ${attributes[0].option.toUpperCase()} ${v0} ${attributes[1].option.toUpperCase()} ${v1}`,
                sku: `${
                  valueGeneratedSku || ''
                }-${attributes[0].option.toUpperCase()}-${v0}-${attributes[1].option.toUpperCase()}-${v1}`,
                options: [
                  { name: attributes[0].option, value: v0 },
                  { name: attributes[1].option, value: v1 },
                ],
                ...initVariant,
              })
            })
          })
      }
    }

    variantsNew = variantsNew.map((e) => {
      const variantCurrent = variants.find((v) => v.title === e.title)
      if (variantCurrent) return variantCurrent
      else return e
    })

    setVariants([...variantsNew])
  }

  const _addBulkPriceOfVariant = (index) => {
    const variantsNew = [...variants]
    const bulkPrice = { min_quantity_apply: 1, max_quantity_apply: 1, price: 0 }
    variantsNew[index].bulk_prices = [...variantsNew[index].bulk_prices, { ...bulkPrice }]
    setVariants([...variantsNew])
  }

  const _enableBulkPriceOfVariant = (value, variant) => {
    const variantsNew = [...variants]
    const indexVariant = variantsNew.findIndex((e) => e.title === variant.title)
    if (indexVariant !== -1) variantsNew[indexVariant].enable_bulk_price = value
    setVariants([...variantsNew])
  }

  const _editBulkPriceOfVariant = (value, attribute = '', index, indexBulkPrice) => {
    const variantsNew = [...variants]
    variantsNew[index].bulk_prices[indexBulkPrice][attribute] = value
    setVariants([...variantsNew])
  }

  const _deleteBulkPriceOfVariant = (index, indexBulkPrice) => {
    const variantsNew = [...variants]
    variantsNew[index].bulk_prices.splice(indexBulkPrice, 1)
    setVariants([...variantsNew])
  }

  const _addBulkPrice = () => {
    const bulkPricesNew = [...bulkPrices]
    const bulkPrice = { min_quantity_apply: 1, max_quantity_apply: 1, price: 0 }
    if (bulkPricesNew.length)
      bulkPrice.min_quantity_apply = bulkPricesNew[bulkPricesNew.length - 1].max_quantity_apply + 1

    bulkPricesNew.push(bulkPrice)
    setBulkPrices([...bulkPricesNew])
  }

  const _editBulkPrice = (attribute = '', value = '', index = 0) => {
    const bulkPricesNew = [...bulkPrices]
    bulkPricesNew[index][attribute] = value
    setBulkPrices([...bulkPricesNew])
  }

  const _deleteBulkPrice = (index = 0) => {
    const bulkPricesNew = [...bulkPrices]
    bulkPricesNew.splice(index, 1)
    setBulkPrices([...bulkPricesNew])
  }

  const _getSuppliers = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getSuppliers()
      if (res.status === 200) {
        if (res.data.data && res.data.data.length) {
          if (!location.state) {
            let supplierDefault = res.data.data.find(
              (supplier) => supplier.active && supplier.default
            )
            if (supplierDefault) {
              form.setFieldsValue({ supplier_id: supplierDefault.supplier_id })
              setSupplier(supplierDefault.name)
            } else form.setFieldsValue({ supplier_id: res.data.data[0].supplier_id })
          }
          setSuppliers(res.data.data)
        }
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const addOrUpdateProduct = async () => {
    //validated
    let isValidated = true
    try {
      await form.validateFields()
      isValidated = true
    } catch (error) {
      isValidated = false
    }

    if (!isValidated) return
    console.log(variants)
    if (isProductHasVariants && variants.length === 0) {
      notification.error({ message: 'Vui lòng nhập ít nhất một thuộc tính' })
      return
    }

    //validated, prices
    for (let i = 0; i < variants.length; ++i)
      if (!variants[i].price) {
        notification.error({ message: 'Vui lòng nhập giá bán trong thuộc tính!' })
        return
      }

    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const formProduct = form.getFieldsValue()
      console.log(formProduct)
      //phát sinh sku nếu user ko điền sku
      let valueDefaultSku = ''
      if (!formProduct.sku) {
        const generatedItemsSku = formProduct.name.split(' ')
        valueDefaultSku = generatedItemsSku
          .map((items) => (items[0] ? removeAccents(items[0]).toUpperCase() : ''))
          .join('')
      }

      let body = {
        sku: !isGeneratedSku
          ? formProduct.sku
            ? formProduct.sku
            : valueDefaultSku
          : valueGeneratedSku,
        barcode: '',
        name: formProduct.name,
        category_id: formProduct.category_id,
        supplier_id: formProduct.supplier_id,
        length: formProduct.length || '',
        width: formProduct.width || '',
        height: formProduct.height || '',
        weight: formProduct.weight || '',
        unit: formProduct.unit || '',
        files: files || [],
        warranties: idsWarranty,
        description: productIsHaveDescription ? description || '' : '',
      }

      if (isProductHasVariants) {
        body.attributes = attributes

        const variantsNew = variants.map((v) => ({ ...v, supplier: supplier || '' }))
        body.variants = variantsNew
      } else {
        const images = location.state ? imagesPreviewProduct : await uploadFiles(imagesProduct)

        body.attributes = []
        const bodyOneVariant = {
          title: formProduct.name,
          sku: location.state
            ? skuProductWithEdit
            : !isGeneratedSku
            ? formProduct.sku
              ? formProduct.sku
              : valueDefaultSku
            : valueGeneratedSku,
          options: [],
          image: images || [],
          supplier: supplier || '',
          price: formProduct.price,
          enable_bulk_price: formProduct.enable_bulk_price,
          bulk_prices: bulkPrices,
        }
        body.variants = [bodyOneVariant]
      }

      let res
      //case update product
      if (location.state) res = await updateProduct(body, location.state.product_id)
      else res = await addProduct({ products: [body] })
      console.log(res)
      if (res.status === 200) {
        notification.success({
          message: `${location.state ? 'Cập nhật' : 'Tạo'} sản phẩm thành công!`,
        })
        history.goBack()
      } else
        notification.error({
          message: res.data.message || `${location.state ? 'Cập nhật' : 'Tạo'} sản phẩm thất bại!`,
        })
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const [categories, setCategories] = useState([])
  const _getCategories = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getCategories()
      if (res.status === 200) {
        if (res.data.data && res.data.data.length) {
          const category = res.data.data.find((category) => category.active && category.default)
          if (!location.state) {
            if (category) form.setFieldsValue({ category_id: category.category_id })
            else form.setFieldsValue({ category_id: res.data.data[0].category_id })
          }
          setCategories(res.data.data.filter((e) => e.active))
        }
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  /* list input variants */
  const uploadImage = async (file, indexVariant) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      let variantsNew = [...variants]

      const url = await uploadFile(file)
      if (url) variantsNew[indexVariant].image = [url]

      setVariants([...variantsNew])
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      console.log(error)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const UploadImageWithEditProduct = () => {
    return (
      <Upload.Dragger
        name="files"
        listType="picture"
        multiple
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        onChange={(info) => {
          if (info.file.status !== 'done') info.file.status = 'done'

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          typingTimeoutRef.current = setTimeout(async () => {
            let files = []
            let urls = []
            info.fileList.map((f) => {
              if (f.originFileObj) files.push(f.originFileObj)
              else urls.push(f.url)
            })
            dispatch({ type: ACTION.LOADING, data: true })
            const images = await uploadFiles(files)
            dispatch({ type: ACTION.LOADING, data: false })
            setImagesPreviewProduct([...images, ...urls])
          }, 350)
        }}
        fileList={imagesPreviewProduct.map((e, index) => {
          let nameFile = ['image']
          if (typeof e === 'string') nameFile = e.split('/')
          return {
            uid: index,
            name: nameFile[nameFile.length - 1] || 'image',
            status: 'done',
            url: e,
            thumbUrl: e,
          }
        })}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
        <p className="ant-upload-hint">Hỗ trợ định dạng .PNG, .JPG, .TIFF, .EPS</p>
      </Upload.Dragger>
    )
  }

  const UploadImageProduct = ({ variant }) => (
    <Upload
      name="avatar"
      listType="picture-card"
      className="upload-variant-image"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      data={(file) => {
        const indexVariant = variants.findIndex((ob) => ob.title === variant.title)
        if (indexVariant !== -1) uploadImage(file, indexVariant)
      }}
    >
      {variant.image && variant.image.length ? (
        <img src={variant.image[0] || ''} alt="" style={{ width: '100%' }} />
      ) : (
        <PlusOutlined />
      )}
    </Upload>
  )

  const InputSku = ({ value, variant }) => {
    const [valueSku, setValueSku] = useState(value)

    return (
      <Input
        disabled={location.state ? true : false}
        placeholder="Nhập sku"
        size="large"
        defaultValue={value}
        onBlur={() => {
          let variantsNew = [...variants]
          const index = variantsNew.findIndex((e) => e.title === variant.title)
          variantsNew[index].sku = valueSku
          setVariants([...variantsNew])
        }}
        onChange={(e) => setValueSku(e.target.value)}
        style={{ width: '100%' }}
      />
    )
  }

  const InputSalePrice = ({ value, variant }) => {
    const [valueSalePrice, setValueSalePrice] = useState(value)

    return (
      <InputNumber
        placeholder="Nhập giá bán"
        className="br-15__input"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        size="large"
        defaultValue={value}
        min={0}
        onBlur={() => {
          let variantsNew = [...variants]
          const index = variantsNew.findIndex((e) => e.title === variant.title)
          variantsNew[index].price = valueSalePrice
          setVariants([...variantsNew])
        }}
        onChange={(value) => setValueSalePrice(value)}
        style={{ width: '100%' }}
      />
    )
  }

  const UploadAllVariant = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)

    const upload = () => {
      const variantsNew = [...variants]

      selectRowKeyVariant.map((key) => {
        const indexVariant = variantsNew.findIndex((ob) => ob.title === key)
        variantsNew[indexVariant].image = [image]
      })

      setVariants([...variantsNew])

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) setImage('')
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle} icon={<FileImageOutlined />}>
          Chỉnh sửa ảnh
        </Button>
        <Modal
          visible={visible}
          title="Chọn ảnh"
          onCancel={toggle}
          onOk={upload}
          footer={
            <Row justify="end">
              <Space>
                <Button onClick={() => setVisible(false)}>Đóng</Button>
                <Button loading={loading} type="primary" onClick={upload}>
                  Lưu
                </Button>
              </Space>
            </Row>
          }
        >
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            data={async (file) => {
              setLoading(true)
              const url = await uploadFile(file)
              if (url) setImage(url || '')
              setLoading(false)
            }}
          >
            {image ? <img src={image} alt="" style={{ width: '100%' }} /> : <PlusOutlined />}
          </Upload>
        </Modal>
      </>
    )
  }

  const EditSku = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [valueSku, setValueSku] = useState('')

    const edit = () => {
      if (valueSku) {
        let variantsNew = [...variants]

        selectRowKeyVariant.map((key) => {
          const indexVariant = variantsNew.findIndex((ob) => ob.title === key)
          variantsNew[indexVariant].sku = valueSku
        })

        setVariants([...variantsNew])
      }

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) setValueSku('')
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle} icon={<EditOutlined />}>
          Chỉnh sửa sku
        </Button>
        <Modal visible={visible} onCancel={toggle} onOk={edit} title="Nhập sku">
          <Input
            placeholder="Nhập sku"
            size="large"
            value={valueSku}
            onChange={(e) => setValueSku(e.target.value)}
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

    const edit = () => {
      let variantsNew = [...variants]

      selectRowKeyVariant.map((key) => {
        const indexVariant = variantsNew.findIndex((ob) => ob.title === key)

        variantsNew[indexVariant].price = valueSalePrice
      })

      setVariants([...variantsNew])

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) {
        setValueSalePrice('')
      }
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle} icon={<DollarOutlined />}>
          Chỉnh sửa giá
        </Button>
        <Modal visible={visible} onCancel={toggle} onOk={edit} title="Nhập giá">
          <Space size="middle" direction="vertical">
            <div>
              <span style={{ marginBottom: 0 }}>Giá bán</span>
              <InputNumber
                placeholder="Nhập giá bán"
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                size="large"
                min={0}
                onChange={(value) => setValueSalePrice(value)}
                style={{ width: '100%' }}
              />
            </div>
          </Space>
        </Modal>
      </>
    )
  }

  const BulkPricesOfVariant = ({ variant }) => {
    const indexVariant = variants.findIndex((e) => e.title === variant.title)
    return (
      <Space direction="vertical">
        {variant.bulk_prices &&
          variant.bulk_prices.map((bulkPrice, indexBulkPrice) => {
            const InputMin = () => (
              <InputNumber
                onMouseOut={(e) => {
                  const value = e.target.value.replaceAll(',', '')
                  if (indexVariant !== -1)
                    _editBulkPriceOfVariant(
                      +value,
                      'min_quantity_apply',
                      indexVariant,
                      indexBulkPrice
                    )
                }}
                style={{ width: '100%' }}
                defaultValue={bulkPrice.min_quantity_apply}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                placeholder="Nhập số lượng tối thiểu áp dụng"
              />
            )
            const InputMax = () => (
              <InputNumber
                onMouseOut={(e) => {
                  const value = e.target.value.replaceAll(',', '')
                  if (indexVariant !== -1)
                    _editBulkPriceOfVariant(
                      +value,
                      'max_quantity_apply',
                      indexVariant,
                      indexBulkPrice
                    )
                }}
                style={{ width: '100%' }}
                defaultValue={bulkPrice.max_quantity_apply}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập số lượng tối đa áp dụng"
              />
            )
            const InputPrice = () => (
              <InputNumber
                onMouseOut={(e) => {
                  const value = e.target.value.replaceAll(',', '')
                  if (indexVariant !== -1)
                    _editBulkPriceOfVariant(+value, 'price', indexVariant, indexBulkPrice)
                }}
                style={{ width: '100%' }}
                defaultValue={bulkPrice.price}
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập giá sỉ áp dụng"
              />
            )

            return (
              <Space size="middle">
                <div>
                  <div>Số lượng tối thiểu</div>
                  <InputMin />
                </div>
                <div>
                  <div>Số lượng tối đa</div>
                  <InputMax />
                </div>
                <div>
                  <div>Giá sỉ áp dụng</div>
                  <InputPrice />
                </div>
                <div>
                  <DeleteOutlined
                    onClick={() => _deleteBulkPriceOfVariant(indexVariant, indexBulkPrice)}
                    style={{ color: 'red', fontSize: 17, cursor: 'pointer', marginTop: 26 }}
                  />
                </div>
              </Space>
            )
          })}
      </Space>
    )
  }

  const columnsVariant = [
    {
      width: 90,
      title: 'Hình ảnh',
      render: (text, record) => <UploadImageProduct variant={record} />,
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      render: (text, record) => <InputSku value={record.sku} variant={record} />,
    },
    {
      title: 'Giá bán',
      render: (text, record) => <InputSalePrice value={record.price} variant={record} />,
    },
    {
      title: 'Giá bán sỉ',
      render: (text, record) => {
        return (
          <Space direction="vertical">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  const indexVariant = variants.findIndex((e) => e.title === record.title)
                  if (indexVariant !== -1) _addBulkPriceOfVariant(indexVariant)
                }}
              >
                Thêm bán giá sỉ
              </Button>
              <Row wrap={false}>
                <Switch
                  onChange={(checked) => _enableBulkPriceOfVariant(checked, record)}
                  checked={record.enable_bulk_price}
                  style={{ marginRight: 4 }}
                />{' '}
                <div>Bật giá sỉ</div>
              </Row>
            </Space>
            <BulkPricesOfVariant variant={record} />
          </Space>
        )
      },
    },
  ]

  const _getWarranties = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getWarranties({ branch_id: branchIdApp })
      if (res.status === 200) {
        setWarranties(res.data.data)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const initProductWithEditProduct = async () => {
    setKeyTab('2')
    if (location.state) {
      const product = location.state
      console.log(product)
      delete product.sumBasePrice
      delete product.sumImportPrice
      delete product.sumQuantity
      delete product.sumSalePrice

      form.setFieldsValue({ ...product })

      if (product.variants.length === 1) {
        setIsProductHasVariants(false)
        setImagesPreviewProduct(product.variants[0].image || [])
        form.setFieldsValue({
          ...product.variants[0],
          enable_bulk_price: product.variants[0].enable_bulk_price || false,
        })
        setSkuProductWithEdit(product.variants[0].sku)
        setBulkPrices(product.variants[0].bulk_prices || [])
      } else {
        setIsProductHasVariants(true)
        setAttributes([
          ...product.attributes.map((e) => {
            return { option: e.option, values: e.values }
          }),
        ])
        setVariants([...product.variants])
      }

      //check product co thong so khac
      if (product.height || product.length || product.width || product.weight || product.unit) {
        setIsInputInfoProduct(true)
      }

      //check product co mo ta ?
      if (product.description) {
        setProductIsHaveDescription(true)
        setDescription(product.description)
      }

      setIsGeneratedSku(true)
      setValueGeneratedSku(product.sku)
      setFiles(product.files)

      //check bao hanh
      if (product.warranties.length) {
        setIsWarranty(true)
        setIdsWarranty([...product.warranties.map((e) => e.warranty_id)])
      }
    }
    await delay(100)
    setIsRenderFirst(true)
    setKeyTab('3')
    await delay(100)
    setKeyTab('1')
  }

  useEffect(() => {
    _getWarranties()
  }, [branchIdApp])

  useEffect(() => {
    _getSuppliers()
    _getCategories()
  }, [])

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true)
    else setIsMobile(false)
  }, [])

  useEffect(() => {
    if (isRenderFirst) addValueVariant()
  }, [attributes])

  //update product
  useEffect(() => {
    initProductWithEditProduct()
  }, [])

  return !isMobile ? (
    <div className="card">
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.PRODUCT)}
          >
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            <div>{location.state ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}</div>
          </Row>
        }
      >
        <Space>
          <Button
            icon={<ReloadOutlined />}
            style={{ display: !location.state && 'none' }}
            size="large"
            onClick={() => history.go(0)}
          >
            Tải lại
          </Button>
          <Button icon={<EditOutlined />} size="large" type="primary" onClick={addOrUpdateProduct}>
            {location.state ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Space>
      </TitlePage>

      <Form form={form} layout="vertical" style={{ width: '100%', marginTop: 15 }}>
        <Tabs activeKey={keyTab} type="card" onChange={setKeyTab}>
          <Tabs.TabPane tab="Thông tin sản phẩm" key="1">
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập tên sản phẩm"
                    onBlur={(e) => {
                      const generatedItemsSku = e.target.value.split(' ')
                      const valueSku = generatedItemsSku
                        .map((items) => (items[0] ? removeAccents(items[0]).toUpperCase() : ''))
                        .join('')

                      if (isGeneratedSku) form.setFieldsValue({ sku: valueSku })

                      setValueGeneratedSku(valueSku)
                    }}
                  />
                </Form.Item>
                <div style={{ position: 'absolute', bottom: -17 }}>
                  <Checkbox
                    checked={isGeneratedSku}
                    onChange={(e) => {
                      if (e.target.checked) form.setFieldsValue({ sku: valueGeneratedSku })

                      setIsGeneratedSku(e.target.checked)
                    }}
                  >
                    Tự động tạo mã sản phẩm/sku
                  </Checkbox>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
                style={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <Form.Item
                  label="Nhà cung cấp"
                  name="supplier_id"
                  style={{ marginRight: 10, width: '100%' }}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Chọn nhà cung cấp"
                    onChange={(value) => {
                      const supplier = suppliers.find((s) => s.supplier_id === value)
                      supplier && setSupplier(supplier.name)
                    }}
                  >
                    {suppliers.map((values, index) => {
                      return (
                        <Select.Option value={values.supplier_id} key={index}>
                          {values.name}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                <SupplierForm reloadData={_getSuppliers}>
                  <Permission permissions={[PERMISSIONS.them_nha_cung_cap]}>
                    <Button
                      size="large"
                      type="primary"
                      icon={<PlusOutlined />}
                      style={{ marginBottom: 24 }}
                    />
                  </Permission>
                </SupplierForm>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                <Form.Item label="Nhóm sản phẩm" name="category_id">
                  <TreeSelect
                    size="large"
                    style={{ width: '100%' }}
                    showSearch={false}
                    placeholder="Chọn nhóm sản phẩm"
                    allowClear
                    multiple
                    treeDefaultExpandAll
                  >
                    {categories.map((category) => (
                      <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                        {category.children_category.map((child) => (
                          <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                            {child.children_category.map((e) => (
                              <TreeSelect.TreeNode value={e.category_id} title={e.name}>
                                {e.name}
                              </TreeSelect.TreeNode>
                            ))}
                          </TreeSelect.TreeNode>
                        ))}
                      </TreeSelect.TreeNode>
                    ))}
                  </TreeSelect>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7} xl={7} style={{ marginTop: 30 }}>
                <Form.Item label="Mã sản phẩm/SKU" name="sku">
                  <Input
                    disabled={isGeneratedSku}
                    size="large"
                    placeholder="Nhập mã sản phẩm/sku"
                  />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                style={{ marginTop: 2, marginBottom: 15 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Switch
                    checked={productIsHaveDescription}
                    onChange={(checked) => {
                      setProductIsHaveDescription(checked)
                    }}
                    style={{ marginRight: 5 }}
                  />
                  Sản phẩm {productIsHaveDescription ? 'có' : 'không'} mô tả
                </div>
                {productIsHaveDescription ? (
                  <div style={{ display: !productIsHaveDescription && 'none' }}>
                    <CKEditor
                      initData={location.state && parse(location.state.description)}
                      onChange={(e) => setDescription(e.editor.getData())}
                    />
                  </div>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Thuộc tính" key="2">
            <div style={{ display: !location.state && 'none', marginBottom: 10 }}>
              <div style={{ display: isProductHasVariants && 'none' }}>Sản phẩm 1 thuộc tính</div>
            </div>
            <Row justify="space-between">
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Form.Item
                  rules={[
                    {
                      required: !isProductHasVariants && true,
                      message: 'Vui lòng nhập giá bán!',
                    },
                  ]}
                  label="Giá bán"
                  name="price"
                >
                  <InputNumber
                    size="large"
                    min={0}
                    placeholder="Nhập giá bán"
                    style={{ width: '75%' }}
                    className="br-15__input"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <a>
                  {dataUser &&
                    dataUser.data &&
                    dataUser.data.price_recipe &&
                    `* Giá vốn được tính theo công thức ${dataUser.data.price_recipe}`}
                </a>
              </Col>

              <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                <div>
                  <Row wrap={false}>
                    <Form.Item
                      style={{ marginBottom: 5, marginRight: 25 }}
                      name="enable_bulk_price"
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Space>
                        <Switch />
                        Bật giá sỉ
                      </Space>
                    </Form.Item>
                    <Button onClick={_addBulkPrice} type="primary" icon={<PlusOutlined />}>
                      Thêm giá bán sỉ
                    </Button>
                  </Row>
                  <div style={{ marginTop: 15, marginBottom: 25 }}>
                    <Space direction="vertical" size="middle">
                      {bulkPrices.map((bulkPrice, index) => {
                        const InputMin = () => (
                          <InputNumber
                            onBlur={(e) => {
                              const value = e.target.value.replaceAll(',', '')
                              _editBulkPrice('min_quantity_apply', +value, index)
                            }}
                            style={{ width: '100%' }}
                            defaultValue={bulkPrice.min_quantity_apply}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            min={bulkPrices.length > 1 ? bulkPrice.min_quantity_apply : 0}
                            placeholder="Nhập số lượng tối thiểu áp dụng"
                          />
                        )
                        const InputMax = () => (
                          <InputNumber
                            onBlur={(e) => {
                              const value = e.target.value.replaceAll(',', '')
                              _editBulkPrice('max_quantity_apply', +value, index)
                            }}
                            style={{ width: '100%' }}
                            defaultValue={bulkPrice.max_quantity_apply}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Nhập số lượng tối đa áp dụng"
                          />
                        )
                        const InputPrice = () => (
                          <InputNumber
                            onBlur={(e) => {
                              const value = e.target.value.replaceAll(',', '')
                              _editBulkPrice('price', +value, index)
                            }}
                            style={{ width: '100%' }}
                            defaultValue={bulkPrice.price}
                            min={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Nhập giá sỉ áp dụng"
                          />
                        )

                        return (
                          <Space size="middle">
                            <div>
                              <div>Số lượng tối thiểu áp dụng</div>
                              <InputMin />
                            </div>
                            <div>
                              <div>Số lượng tối đa áp dụng</div>
                              <InputMax />
                            </div>
                            <div>
                              <div>Giá sỉ áp dụng</div>
                              <InputPrice />
                            </div>
                            <div>
                              <DeleteOutlined
                                onClick={() => _deleteBulkPrice(index)}
                                style={{
                                  color: 'red',
                                  fontSize: 17,
                                  cursor: 'pointer',
                                  marginTop: 26,
                                }}
                              />
                            </div>
                          </Space>
                        )
                      })}
                    </Space>
                  </div>
                </div>
              </Col>

              <div
                style={{
                  width: '100%',
                  marginTop: 40,
                  marginBottom: 15,
                  display: location.state && 'none',
                }}
              >
                <Row wrap={false} align="middle" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600 }}>Thuộc tính</div>
                  <InfoCircleOutlined style={{ marginLeft: 5, marginRight: 8, color: '' }} />
                  <Switch
                    checked={isProductHasVariants}
                    onChange={(checked) => {
                      setIsProductHasVariants(checked)
                      setVariants([])
                      setAttributes([{ option: '', values: [] }])
                    }}
                  />
                </Row>
                <div>
                  Thêm mới thuộc tính giúp sản phẩm có nhiều sự lựa chọn, như kích cỡ hay màu sắc
                </div>
              </div>
              <div
                style={{
                  display: isProductHasVariants ? '' : 'none',
                  width: '100%',
                  marginTop: 35,
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
                        disabled={location.state ? true : false}
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
                            disabled={location.state ? true : false}
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
                              visibility: location.state && 'hidden',
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
                              disabled={location.state ? true : false}
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
                      <h3 style={{ marginBottom: 0, fontWeight: 700 }}>Thuộc tính</h3>
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
                      {!location.state && <EditSku />}
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
                  />
                </div>
              </div>

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                style={{
                  display: isProductHasVariants && 'none',
                }}
              >
                Hình ảnh
                <div>
                  {location.state ? (
                    <UploadImageWithEditProduct />
                  ) : (
                    <Upload.Dragger
                      name="files"
                      listType="picture"
                      multiple
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      onChange={(info) => {
                        if (info.file.status !== 'done') info.file.status = 'done'
                        let imagesProductNew = info.fileList.map((e) => e.originFileObj)
                        setImagesProduct([...imagesProductNew])
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Nhấp hoặc kéo tệp vào khu vực này để tải lên
                      </p>
                      <p className="ant-upload-hint">Hỗ trợ định dạng .PNG, .JPG, .TIFF, .EPS</p>
                    </Upload.Dragger>
                  )}
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Thông số sản phẩm" key="3">
            <Row justify="space-between" align="middle">
              <Row align="middle" style={{ marginBottom: 5, marginTop: 10, width: '100%' }}>
                <Switch
                  checked={isInputInfoProduct}
                  onChange={(checked) => setIsInputInfoProduct(checked)}
                  style={{ marginRight: 5 }}
                />
                Thông số sản phẩm
              </Row>
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
                  <Form.Item label="Chiều dài" name="length">
                    <InputNumber
                      style={{ width: '100%' }}
                      className="br-15__input"
                      size="large"
                      placeholder="Chiều dài (cm)"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                  <Form.Item label="Chiều rộng" name="width">
                    <InputNumber
                      style={{ width: '100%' }}
                      className="br-15__input"
                      size="large"
                      placeholder="Chiều rộng (cm)"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                  <Form.Item label="Chiều cao" name="height">
                    <InputNumber
                      style={{ width: '100%' }}
                      className="br-15__input"
                      size="large"
                      placeholder="Chiều cao (cm)"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                  <Form.Item label="Cân nặng" name="weight">
                    <InputNumber
                      style={{ width: '100%' }}
                      className="br-15__input"
                      size="large"
                      placeholder="Cân nặng (kg)"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                  <Form.Item label="Đơn vị" name="unit">
                    <Input size="large" placeholder="Đơn vị" />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ width: '100%', marginTop: 20 }}>
                <Col xs={24} sm={24} md={9} lg={9} xl={9}>
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
                    {warranties.map((values, index) => (
                      <Select.Option value={values.warranty_id} key={index}>
                        {values.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="File đính kèm" key="4">
            <div style={{ minHeight: 250 }}>
              <Upload
                fileList={files.map((file, index) => {
                  const fileSplit = file.split('/')
                  const nameFile = fileSplit[fileSplit.length - 1]
                  return {
                    uid: index,
                    name: nameFile ? nameFile : 'file',
                    status: 'done',
                    url: file,
                  }
                })}
                onRemove={(file) => {
                  const indexRemove = files.findIndex((url) => url === file)
                  if (indexRemove) {
                    const filesNew = [...files]
                    filesNew.splice(indexRemove, 1)
                    setFiles([...filesNew])
                  }
                }}
                data={async (file) => {
                  setLoadingFile(true)
                  const url = await uploadFile(file)
                  setLoadingFile(false)
                  const filesNew = [...files]
                  filesNew.push(url)
                  setFiles([...filesNew])
                }}
                onChange={(info) => {
                  if (info.file.status !== 'done') info.file.status = 'done'
                }}
              >
                <Button
                  loading={loadingFile}
                  style={{ width: 140 }}
                  size="large"
                  icon={<UploadOutlined />}
                >
                  Chọn file
                </Button>
              </Upload>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  ) : (
    <NotSupportMobile />
  )
}
