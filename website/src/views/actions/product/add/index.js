import React, { useState, useEffect, useRef } from 'react'
import styles from './../add/add.module.scss'

import { ACTION } from 'consts'
import { removeAccents } from 'utils'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CKEditor } from 'ckeditor4-react'
import parse from 'html-react-parser'
import NotSupportMobile from 'components/not-support-mobile'
import delay from 'delay'

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
} from '@ant-design/icons'

//apis
import { getCategories } from 'apis/category'
import { apiAllSupplier } from 'apis/supplier'
import { uploadFiles, uploadFile } from 'apis/upload'
import { apiAllWarranty } from 'apis/warranty'
import { updateProduct, addProduct } from 'apis/product'
import { getAllStore } from 'apis/store'

export default function ProductAdd() {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const [form] = Form.useForm()

  const [locations, setLocations] = useState([])
  const [idsWarranty, setIdsWarranty] = useState([])
  const [isWarranty, setIsWarranty] = useState(false)
  const [warranties, setWarranties] = useState([])
  const [stores, setStores] = useState([])
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
  const [imagesProduct, setImagesProduct] = useState([]) //files upload
  const [imagesPreviewProduct, setImagesPreviewProduct] = useState([]) //url image
  const [isInputInfoProduct, setIsInputInfoProduct] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [description, setDescription] = useState('')
  const [productIsHaveDescription, setProductIsHaveDescription] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState('') // dung o variant
  const [isGeneratedSku, setIsGeneratedSku] = useState(false)
  const [valueGeneratedSku, setValueGeneratedSku] = useState('')
  const [skuProductWithEdit, setSkuProductWithEdit] = useState('')
  const typingTimeoutRef = useRef(null)

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

    const initVariant = {
      image: '',
      imagePreview: '',
      locations: [],
      import_price: 0,
      base_price: 0,
      price: 0,
    }

    if (attributes.length !== 0) {
      //trường hợp chỉ có 1 attribute
      if (attributes.length === 1) {
        attributes[0].values.map((value) => {
          variantsNew.push({
            title: `${attributes[0].option.toUpperCase()} ${value.toUpperCase()}`,
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
              title: `${attributes[1].option.toUpperCase()} ${value.toUpperCase()}`,
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
              title: `${attributes[0].option.toUpperCase()} ${value.toUpperCase()}`,
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
                title: `${attributes[0].option.toUpperCase()} ${v0} ${attributes[1].option.toUpperCase()} ${v1}`,
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

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const apiAllSupplierData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllSupplier()
      if (res.status === 200) {
        if (res.data.data && res.data.data.length) {
          const dataNew = res.data.data.filter((value) => value.active)

          let supplierDefault = res.data.data.find(
            (supplier) => supplier.active && supplier.default
          )
          if (supplierDefault) {
            if (!location.state)
              form.setFieldsValue({
                supplier_id: supplierDefault.supplier_id,
              })
            setSupplier(supplierDefault.name)
          }

          setSuppliers([...dataNew])
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

    if (isProductHasVariants && variants.length < 2) {
      notification.error({ message: 'Vui lòng nhập ít nhất hai phiên bản' })
      return
    }

    //validated images product
    if (!isProductHasVariants) {
      if (!imagesProduct.length && !location.state) {
        setHelpTextImage('Vui lòng chọn ít nhất 1 ảnh!')
        return
      }

      if (!imagesPreviewProduct.length && location.state) {
        setHelpTextImage('Vui lòng chọn ít nhất 1 ảnh!')
        return
      }

      setHelpTextImage('')
    } else setHelpTextImage('')

    //validated locations, prices
    for (let i = 0; i < variants.length; ++i) {
      if (!variants[i].base_price) {
        notification.error({
          message: 'Vui lòng nhập giá cơ bản trong phiên bản!',
        })
        return
      }
      if (!variants[i].import_price) {
        notification.error({
          message: 'Vui lòng nhập giá nhập trong phiên bản!',
        })
        return
      }
      if (!variants[i].price) {
        notification.error({
          message: 'Vui lòng nhập giá bán trong phiên bản!',
        })
        return
      }
      if (!variants[i].locations.length) {
        notification.error({
          message: 'Vui lòng nhập số lượng sản phẩm trong ít nhất 1 cửa hàng!',
        })
        return
      }
    }

    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const formProduct = form.getFieldsValue()

      let body = {
        sku: !isGeneratedSku ? formProduct.sku : valueGeneratedSku,
        barcode: '',
        name: formProduct.name,
        category_id: formProduct.category_id,
        supplier_id: formProduct.supplier_id,
        length: formProduct.length || '',
        width: formProduct.width || '',
        height: formProduct.height || '',
        weight: formProduct.weight || '',
        unit: formProduct.unit || '',
        warranties: idsWarranty,
        description: productIsHaveDescription ? description || '' : '',
      }

      if (isProductHasVariants) {
        body.attributes = attributes
        const promiseUpload = variants.map(async (v) => {
          if (v.image && Array.isArray(v.image)) {
            delete v.imagePreview
            return {
              ...v,
              supplier: supplier || '',
              image: v.image.length && v.image[0] ? [v.image[0]] : [],
            }
          } else {
            const resUpload = await uploadFile(v.image)
            delete v.imagePreview
            return {
              ...v,
              supplier: supplier || '',
              image: resUpload ? [resUpload] : [],
            }
          }
        })

        const variantsNew = await Promise.all(promiseUpload)

        body.variants = variantsNew
      } else {
        if (!locations.length) {
          notification.error({
            message: 'Vui lòng nhập số lượng sản phẩm trong ít nhất 1 cửa hàng',
          })
          dispatch({ type: ACTION.LOADING, data: false })
          return
        }
        const images = location.state ? imagesPreviewProduct : await uploadFiles(imagesProduct)

        body.attributes = []
        const bodyOneVariant = {
          title: formProduct.name,
          sku: location.state
            ? skuProductWithEdit
            : !isGeneratedSku
            ? formProduct.sku
            : valueGeneratedSku,
          options: [],
          image: images || [],
          supplier: supplier || '',
          price: formProduct.price,
          base_price: formProduct.base_price,
          import_price: formProduct.import_price,
          locations: locations,
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
  const apiAllCategoryData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getCategories()
      if (res.status === 200) {
        if (res.data.data && res.data.data.length) {
          const category = res.data.data.find((category) => category.active && category.default)
          if (category && !location.state)
            form.setFieldsValue({
              category_id: category.category_id,
            })
          setCategories(res.data.data.filter((e) => e.active))
        }
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

  const UploadImageWithEditProduct = () => {
    return (
      <Upload.Dragger
        name="files"
        listType="picture"
        multiple
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        onChange={(info) => {
          if (info.file.status !== 'done') info.file.status = 'done'
          setHelpTextImage('')

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
            const indexVariant = variants.findIndex((ob) => ob.title === variant.title)
            uploadImage(file, url, indexVariant)
          })
        }}
      >
        {variant.imagePreview || variant.image ? (
          <img
            src={variant.imagePreview || variant.image[0] || ''}
            alt=""
            style={{ width: '100%' }}
          />
        ) : (
          <div>
            <PlusOutlined />
          </div>
        )}
      </Upload>
    )
  }

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

  const InputQuantityStores = ({ locations, variant }) => {
    const [locationsVariant, setLocationsVariant] = useState(locations ? locations : [])

    return (
      <Select
        mode="multiple"
        placeholder="Nhập số lượng vào cửa hàng"
        size="large"
        style={{ width: '100%' }}
        value={locationsVariant.map((location) => `${location.name}: ${location.quantity + ''}`)}
        onDeselect={(value) => {
          const locationsNew = [...locationsVariant]
          const indexRemove = locationsNew.findIndex((e) => value.includes(e.name))
          if (indexRemove !== -1) locationsNew.splice(indexRemove, 1)

          let variantsNew = [...variants]
          const index = variantsNew.findIndex((e) => e.title === variant.title)
          variantsNew[index].locations = locationsNew
          setVariants([...variantsNew])

          setLocationsVariant([...locationsNew])
        }}
        dropdownRender={() => (
          <div>
            {stores.map((store) => (
              <Row
                wrap={false}
                align="middle"
                justify="space-between"
                style={{ marginBottom: 9, padding: '0px 10px' }}
              >
                <div style={{ color: 'black' }}>{store.name}</div>
                <Space>
                  <InputNumber
                    min={0}
                    placeholder="Nhập số lượng"
                    style={{ width: 100 }}
                    onBlur={(e) => {
                      const value = +e.target.value
                      const locationsNew = [...locationsVariant]

                      const indexLocation = locationsNew.findIndex(
                        (l) => l.inventory_id === store.store_id
                      )

                      if (value) {
                        const location = {
                          type: 'store',
                          name: store.name,
                          inventory_id: store.store_id,
                          quantity: value,
                        }

                        if (indexLocation !== -1) locationsNew[indexLocation] = location
                        else locationsNew.push(location)
                      } else {
                        if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                      }

                      let variantsNew = [...variants]
                      const index = variantsNew.findIndex((e) => e.title === variant.title)
                      variantsNew[index].locations = locationsNew
                      setVariants([...variantsNew])

                      setLocationsVariant([...locationsNew])
                    }}
                    onPressEnter={(e) => {
                      const value = +e.target.value
                      const locationsNew = [...locationsVariant]

                      const indexLocation = locationsNew.findIndex(
                        (l) => l.inventory_id === store.store_id
                      )

                      if (value) {
                        const location = {
                          type: 'store',
                          name: store.name,
                          inventory_id: store.store_id,
                          quantity: value,
                        }

                        if (indexLocation !== -1) locationsNew[indexLocation] = location
                        else locationsNew.push(location)
                      } else {
                        if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                      }

                      let variantsNew = [...variants]
                      const index = variantsNew.findIndex((e) => e.title === variant.title)
                      variantsNew[index].locations = locationsNew
                      setVariants([...variantsNew])

                      setLocationsVariant([...locationsNew])
                    }}
                  />
                </Space>
              </Row>
            ))}
          </div>
        )}
      ></Select>
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
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          size="large"
          defaultValue={value}
          min={0}
          onBlur={() => {
            let variantsNew = [...variants]
            const index = variantsNew.findIndex((e) => e.title === variant.title)
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
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          size="large"
          defaultValue={value}
          min={0}
          onBlur={() => {
            let variantsNew = [...variants]
            const index = variantsNew.findIndex((e) => e.title === variant.title)
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
        <Button size="large" onClick={toggle} icon={<FileImageOutlined />}>
          Chỉnh sửa ảnh
        </Button>
        <Modal visible={visible} title="Chọn ảnh" onCancel={toggle} onOk={upload}>
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

  const EditQuantityStores = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [locationsVariant, setLocationsVariant] = useState([])

    const edit = () => {
      if (locationsVariant.length) {
        let variantsNew = [...variants]

        selectRowKeyVariant.map((key) => {
          const indexVariant = variantsNew.findIndex((ob) => ob.title === key)
          variantsNew[indexVariant].locations = locationsVariant
        })

        setVariants([...variantsNew])
      }

      toggle()
    }

    //reset
    useEffect(() => {
      if (!visible) setLocationsVariant([])
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle} icon={<EditOutlined />}>
          Chỉnh sửa số lượng sản phẩm
        </Button>
        <Modal visible={visible} onCancel={toggle} onOk={edit} title="Nhập số lượng sản phẩm">
          <Select
            mode="multiple"
            placeholder="Nhập số lượng vào cửa hàng"
            size="large"
            style={{ width: '100%' }}
            value={locationsVariant.map(
              (location) => `${location.name}: ${location.quantity + ''}`
            )}
            onDeselect={(value) => {
              const locationsNew = [...locationsVariant]
              const indexRemove = locationsNew.findIndex((e) => value.includes(e.name))
              if (indexRemove !== -1) locationsNew.splice(indexRemove, 1)

              setLocationsVariant([...locationsNew])
            }}
            dropdownRender={() => (
              <div>
                {stores.map((store) => (
                  <Row
                    wrap={false}
                    align="middle"
                    justify="space-between"
                    style={{ marginBottom: 9, padding: '0px 10px' }}
                  >
                    <div style={{ color: 'black' }}>{store.name}</div>
                    <Space>
                      <InputNumber
                        min={0}
                        placeholder="Nhập số lượng"
                        style={{ width: 100 }}
                        onBlur={(e) => {
                          const value = +e.target.value
                          const locationsNew = [...locationsVariant]

                          const indexLocation = locationsNew.findIndex(
                            (l) => l.inventory_id === store.store_id
                          )

                          if (value) {
                            const location = {
                              type: 'store',
                              name: store.name,
                              inventory_id: store.store_id,
                              quantity: value,
                            }

                            if (indexLocation !== -1) locationsNew[indexLocation] = location
                            else locationsNew.push(location)
                          } else {
                            if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                          }

                          setLocationsVariant([...locationsNew])
                        }}
                        onPressEnter={(e) => {
                          const value = +e.target.value
                          const locationsNew = [...locationsVariant]

                          const indexLocation = locationsNew.findIndex(
                            (l) => l.inventory_id === store.store_id
                          )

                          if (value) {
                            const location = {
                              type: 'store',
                              name: store.name,
                              inventory_id: store.store_id,
                              quantity: value,
                            }

                            if (indexLocation !== -1) locationsNew[indexLocation] = location
                            else locationsNew.push(location)
                          } else {
                            if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                          }

                          setLocationsVariant([...locationsNew])
                        }}
                      />
                    </Space>
                  </Row>
                ))}
              </div>
            )}
          ></Select>
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
    const [valueBasePrice, setValueBasePrice] = useState('')
    const [valueImportPrice, setValueImportPrice] = useState('')

    const edit = () => {
      let variantsNew = [...variants]

      selectRowKeyVariant.map((key) => {
        const indexVariant = variantsNew.findIndex((ob) => ob.title === key)

        variantsNew[indexVariant].import_price = valueImportPrice
        variantsNew[indexVariant].price = valueSalePrice
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

            <div>
              <span style={{ marginBottom: 0 }}>Giá cơ bản</span>
              <InputNumber
                placeholder="Nhập giá cơ bản"
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                size="large"
                min={0}
                onChange={(value) => setValueBasePrice(value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <span style={{ marginBottom: 0 }}>Giá nhập</span>
              <InputNumber
                placeholder="Nhập giá nhập"
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                size="large"
                min={0}
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
      title: 'Phiên bản',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      width: 250,
      render: (text, record) => <InputSku value={record.sku} variant={record} />,
    },
    {
      title: 'Số lượng',
      width: 250,
      render: (text, record) => (
        <InputQuantityStores locations={record.locations} variant={record} />
      ),
    },
    {
      title: 'Giá',
      width: 250,
      render: (text, record) => (
        <Space size="middle" direction="vertical" style={{ width: '100%' }}>
          <InputSalePrice value={record.price} variant={record} />
          <InputBasePrice value={record.base_price} variant={record} />
          <InputImportPrice value={record.import_price} variant={record} />
        </Space>
      ),
    },
  ]

  const apiAllWarrantyData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await apiAllWarranty()
      if (res.status === 200) {
        setWarranties(res.data.data)
      }

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const apiGetAllStore = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await getAllStore()
      if (res.status === 200) {
        setStores(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }

  const initProductWithEditProduct = async () => {
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
        setLocations([...product.variants[0].locations])
        form.setFieldsValue({ ...product.variants[0] })
        setSkuProductWithEdit(product.variants[0].sku)
      } else {
        setIsProductHasVariants(true)
        setAttributes([
          ...product.attributes.map((e) => {
            return { option: e.option, values: e.values }
          }),
        ])
        await delay(1000)
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

      //check bao hanh
      if (product.waranties.length) {
        setIsWarranty(true)
        setIdsWarranty([...product.waranties.map((e) => e.warranty_id)])
      }
    }
  }

  useEffect(() => {
    apiAllSupplierData()
    apiAllWarrantyData()
    apiAllCategoryData()
    apiGetAllStore()
  }, [])

  //get width device
  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true)
    else setIsMobile(false)
  }, [])

  useEffect(() => {
    addValueVariant()
  }, [attributes])

  //update product
  useEffect(() => {
    initProductWithEditProduct()
  }, [])

  return !isMobile ? (
    <div className={styles['product_manager']}>
      <Affix offsetTop={65} style={{ width: '100%' }}>
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
          <a onClick={() => history.goBack()} className={styles['product_manager_title']}>
            <ArrowLeftOutlined style={{ color: 'black' }} />
            <div className={styles['product_manager_title_product']}>
              {location.state ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm'}
            </div>
          </a>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              style={{ display: !location.state && 'none' }}
              size="large"
              onClick={() => history.go(0)}
            >
              Tải lại
            </Button>
            <Button
              icon={<EditOutlined />}
              size="large"
              type="primary"
              onClick={addOrUpdateProduct}
            >
              {location.state ? 'Cập nhật' : 'Thêm'}
            </Button>
          </Space>
        </Row>
      </Affix>
      <Form form={form} layout="vertical" style={{ width: '100%', marginTop: 15 }}>
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
            <div
              style={{
                position: 'absolute',
                bottom: -17,
              }}
            >
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
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Nhà cung cấp"
              name="supplier_id"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
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
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
              >
                {categories.map((values, index) => {
                  return (
                    <Select.Option value={values.category_id} key={index}>
                      {values.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7} style={{ marginTop: 30 }}>
            <Form.Item
              label="Mã sản phẩm/SKU"
              name="sku"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã sản phẩm/sku!',
                },
              ]}
            >
              <Input disabled={isGeneratedSku} size="large" placeholder="Nhập mã sản phẩm/sku" />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={7}
            lg={7}
            xl={7}
            style={{ marginTop: 30, display: isProductHasVariants && 'none' }}
          >
            <div>
              <div>
                <span style={{ color: 'red' }}>*</span>
                <span>Danh sách cửa hàng</span>
              </div>
              <Select
                mode="multiple"
                placeholder="Nhập số lượng vào cửa hàng"
                size="large"
                style={{ width: '100%' }}
                value={locations.map((location) => `${location.name}: ${location.quantity + ''}`)}
                onDeselect={(value) => {
                  const locationsNew = [...locations]
                  const indexRemove = locationsNew.findIndex((e) => value.includes(e.name))
                  if (indexRemove !== -1) locationsNew.splice(indexRemove, 1)

                  setLocations([...locationsNew])
                }}
                dropdownRender={() => (
                  <div>
                    {stores.map((store) => (
                      <Row
                        wrap={false}
                        align="middle"
                        justify="space-between"
                        style={{ marginBottom: 9, padding: '0px 10px' }}
                      >
                        <div style={{ color: 'black' }}>{store.name}</div>
                        <Space>
                          <InputNumber
                            min={0}
                            placeholder="Nhập số lượng"
                            style={{ width: 100 }}
                            onBlur={(e) => {
                              const value = +e.target.value
                              const locationsNew = [...locations]

                              const indexLocation = locationsNew.findIndex(
                                (l) => l.inventory_id === store.store_id
                              )

                              if (value) {
                                const location = {
                                  type: 'store',
                                  name: store.name,
                                  inventory_id: store.store_id,
                                  quantity: value,
                                }

                                if (indexLocation !== -1) locationsNew[indexLocation] = location
                                else locationsNew.push(location)
                              } else {
                                if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                              }
                              console.log(locationsNew)
                              setLocations([...locationsNew])
                            }}
                            onPressEnter={(e) => {
                              const value = +e.target.value
                              const locationsNew = [...locations]

                              const indexLocation = locationsNew.findIndex(
                                (l) => l.inventory_id === store.store_id
                              )

                              if (value) {
                                const location = {
                                  type: 'store',
                                  name: store.name,
                                  inventory_id: store.store_id,
                                  quantity: value,
                                }

                                if (indexLocation !== -1) locationsNew[indexLocation] = location
                                else locationsNew.push(location)
                              } else {
                                if (indexLocation !== -1) locationsNew.splice(indexLocation, 1)
                              }

                              setLocations([...locationsNew])
                            }}
                          />
                        </Space>
                      </Row>
                    ))}
                  </div>
                )}
              ></Select>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: 2, marginBottom: 15 }}>
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
          <Row
            align="middle"
            style={{
              width: '100%',
              marginTop: 15,
              marginBottom: 15,
              display: location.state && 'none',
            }}
          >
            <Switch
              style={{ marginRight: 5 }}
              checked={isProductHasVariants}
              onChange={(checked) => setIsProductHasVariants(checked)}
            />
            Sản phẩm {isProductHasVariants ? 'có nhiều' : 'có 1'} phiên bản
          </Row>
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
                  <EditQuantityStores />
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
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>

          <Col
            xs={24}
            sm={24}
            md={7}
            lg={7}
            xl={7}
            style={{ display: isProductHasVariants && 'none' }}
          >
            <Form.Item
              label="Giá bán"
              name="price"
              rules={[
                {
                  required: !isProductHasVariants && true,
                  message: 'Vui lòng nhập giá bán!',
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá bán"
                style={{ width: '100%' }}
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={7}
            lg={7}
            xl={7}
            style={{ display: isProductHasVariants && 'none' }}
          >
            <Form.Item
              label="Giá cơ bản"
              name="base_price"
              rules={[
                {
                  required: !isProductHasVariants && true,
                  message: 'Vui lòng nhập giá cơ bản!',
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá cơ bản"
                style={{ width: '100%' }}
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={7}
            lg={7}
            xl={7}
            style={{ display: isProductHasVariants && 'none' }}
          >
            <Form.Item
              label="Giá nhập"
              name="import_price"
              rules={[
                {
                  required: !isProductHasVariants && true,
                  message: 'Vui lòng nhập giá nhập!',
                },
              ]}
            >
              <InputNumber
                size="large"
                min={0}
                placeholder="Nhập giá nhập"
                style={{ width: '100%' }}
                className="br-15__input"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

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
            <span style={{ color: 'red' }}>* </span>
            Hình ảnh
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
                  setHelpTextImage('')
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                <p className="ant-upload-hint">Hỗ trợ định dạng .PNG, .JPG, .TIFF, .EPS</p>
              </Upload.Dragger>
            )}
            <span style={{ color: 'red' }}>{helpTextImage}</span>
          </Col>
        </Row>
      </Form>

      <Row
        style={{
          width: '100%',
          marginTop: 20,
        }}
      >
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
    </div>
  ) : (
    <NotSupportMobile />
  )
}
