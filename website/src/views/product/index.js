import React, { useState, useEffect, useRef } from 'react'
import styles from './product.module.scss'
import { Link } from 'react-router-dom'
import { ROUTES, PERMISSIONS, IMAGE_DEFAULT, FILTER_SIZE } from 'consts'
import { compareCustom, formatCash } from 'utils'
import moment from 'moment'
import { compare } from 'utils'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import {
  Switch,
  Upload,
  Select,
  notification,
  Button,
  Modal,
  Table,
  Input,
  Row,
  Col,
  DatePicker,
  Space,
  Popconfirm,
  Tag,
  TreeSelect,
  Badge,
  Affix,
} from 'antd'

//components
import Permission from 'components/permission'
import SettingColumns from 'components/setting-columns'
import columnsProduct from './columns'
import exportToCSV from 'components/ExportCSV/export'
import TitlePage from 'components/title-page'
import ImportCSV from 'components/ImportCSV'

//icons
import {
  PlusCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  CloseCircleFilled,
  ToTopOutlined,
} from '@ant-design/icons'

//apis
import { getSuppliers } from 'apis/supplier'
import { getCategories } from 'apis/category'
import { getProducts, updateProduct, deleteProducts, importProducts } from 'apis/product'
import { uploadFile, uploadFiles, uploadFileToExport } from 'apis/upload'
import { createFileHistory } from 'apis/action'

const { Option } = Select
const { RangePicker } = DatePicker
export default function Product() {
  const typingTimeoutRef = useRef(null)
  const history = useHistory()
  const branchIdApp = useSelector((state) => state.branch.branchId)

  const [loading, setLoading] = useState(true)
  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //list checkbox row, key = _id
  const [categories, setCategories] = useState([])
  const [valueDateSearch, setValueDateSearch] = useState(null) //d??ng ????? hi???n th??? date trong filter by date
  const [valueTime, setValueTime] = useState() //d??ng ????? hi???n th??? value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})
  const [columns, setColumns] = useState([])

  const [countProduct, setCountProduct] = useState(0)

  const _getCategories = async () => {
    try {
      const res = await getCategories()
      if (res.status === 200) setCategories(res.data.data.filter((e) => e.active))
    } catch (error) {
      console.log(error)
    }
  }

  const _onFilter = (attribute = '', value = '') => {
    if (value) paramsFilter[attribute] = value
    else delete paramsFilter[attribute]
    setParamsFilter({ ...paramsFilter, page: 1 })
  }

  const enableBulkPrice = async (product, variant) => {
    try {
      setLoading(true)

      const variantsNew = product.variants.map((e) => {
        if (e.variant_id === variant.variant_id) return variant
        else return e
      })

      const body = { variants: variantsNew }
      const res = await updateProduct(body, product.product_id)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getProducts()
          notification.success({ message: 'C???p nh???t th??nh c??ng!' })
        } else
          notification.error({
            message: res.data.message || 'C???p nh???t th???t b???i, vui l??ng th??? l???i!',
          })
      } else
        notification.error({
          message: res.data.message || 'C???p nh???t th???t b???i, vui l??ng th??? l???i!',
        })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const ModalViewBulkPrices = ({ bulkPrices }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const columns = [
      {
        title: 'STT',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'S??? l?????ng th???p nh???t',
        render: (text, record) => formatCash(record.min_quantity_apply || 0),
      },
      {
        title: 'S??? l?????ng cao nh???t',
        render: (text, record) => formatCash(record.max_quantity_apply || 0),
      },
      {
        title: 'Gi?? ??p d???ng',
        render: (text, record) => formatCash(record.price || 0),
      },
    ]

    return (
      <>
        <a onClick={toggle}>Xem gi?? s???</a>
        <Modal
          width="50%"
          title="Danh s??ch gi?? s???"
          footer={null}
          visible={visible}
          onCancel={toggle}
        >
          <Table
            scroll={{ y: '50vh' }}
            size="small"
            pagination={false}
            columns={columns}
            dataSource={bulkPrices}
          />
        </Modal>
      </>
    )
  }

  const columnsVariant = [
    {
      title: 'H??nh ???nh',
      key: 'image',
    },
    {
      title: 'Thu???c t??nh',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Gi?? b??n l???',
      render: (text, record) => formatCash(record.price || 0),
    },
    {
      title: 'Gi?? b??n s???',
      render: (text, record) =>
        record.bulk_prices && record.bulk_prices.length ? (
          <ModalViewBulkPrices bulkPrices={record.bulk_prices || []} />
        ) : (
          ''
        ),
    },
    // {
    //   title: 'Gi?? s???',
    //   key: 'enable_bulk_price',
    // },
  ]

  const _getSuppliers = async () => {
    try {
      setLoading(true)
      const res = await getSuppliers()
      console.log(res)
      if (res.status === 200) setSuppliers(res.data.data)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const [valueSearch, setValueSearch] = useState('')
  const onSearch = (e) => {
    setValueSearch(e.target.value)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value

      if (value) paramsFilter[optionSearchName] = value
      else delete paramsFilter[optionSearchName]

      setParamsFilter({ ...paramsFilter, page: 1 })
    }, 750)
  }

  console.log(categories)
  console.log(suppliers)

  const _getProductsToExport = async (query) => {
    try {
      const res = await getProducts({ branch: true, ...query })

      if (res.status === 200) {
        let dataExport = []

        res.data.data.map((e) => {
          console.log(e)
          const findCategory = categories.find((c) => e.category_id.includes(c.category_id))
          const findSupplier = suppliers.find((s) => s.supplier_id === e.supplier_id)

          let objProduct = {
            'T??n s???n ph???m': e.name || '',
            'M?? s???n ph???m': e.sku || '',
            'Nh??m s???n ph???m': findCategory ? findCategory.name : '',
            // 'Nh??m s???n ph???m': e._categories.map((item) => {
            //   return <p>{item.name}</p>
            // }),
            'Nh?? cung c???p': findSupplier ? findSupplier.name : '',
            'Chi???u d??i': e.length,
            'Chi???u r???ng': e.width,
            'Chi???u cao': e.height,
            'C??n n???ng': e.weight,
            '????n v???': e.unit,
            'Thu???': 'C??',
            'B???o h??nh': e.warranties && e.warranties.length ? 'C??' : 'Kh??ng',
            'Th????ng hi???u': '',
            'Xu???t x???': '',
            'T??nh tr???ng': 'M???i',
            'M?? t???': e.description !== '' ? e.description : 'Ch??a c?? m?? t???',
            'Tr???ng th??i': e.active ? 'M??? b??n' : 'Ng???ng b??n',
          }
          e.attributes.map(
            (attribute, index) => (objProduct[`Thu???c t??nh ${index + 1}`] = attribute.option)
          )

          e.variants.map((v) => {
            let locationImport = {}
            v.locations.map((k) => {
              console.log(k)
              locationImport['N??i nh???p'] = k.type
              locationImport['T??n n??i nh???p'] = k.name
              locationImport['S??? l?????ng nh???p'] = k.quantity
            })

            v.bulk_prices.map(si =>
              dataExport.push({
                ...objProduct,
                'T??n phi??n b???n': v.title || '',
                'M?? phi??n b???n': v.sku || '',
                'H??nh ???nh': v.image.join(', '),
                'Gi?? nh???p h??ng': v.import_price_default || 0,
                'Gi?? v???n': v.base_price || '',
                'Gi?? b??n l???': v.price || '',
                'Gi?? b??n s???': si.price || '',
                'S??? l?????ng s???': `${si.min_quantity_apply} - ${si.max_quantity_apply}` || '',
                'S??? ?????a ??i???m nh???p': v.locations.length || 0,
                ...locationImport,
              })
            )
          })
        })

        exportToCSV(dataExport, 'Danh s??ch s???n ph???m')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _getProducts = async () => {
    setLoading(true)
    setProducts([])

    try {
      const res = await getProducts({ ...paramsFilter, branch: true, branch_id: branchIdApp })
      console.log(res)
      if (res.status === 200) {
        setProducts(res.data.data)
        setCountProduct(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    _getProducts()
  }, [paramsFilter, branchIdApp])

  useEffect(() => {
    _getSuppliers()
    _getCategories()
  }, [])

  const UpdateCategoryProducts = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [categoryIds, setCategoryIds] = useState([])

    useEffect(() => {
      if (!visible) setCategoryIds([])
    }, [visible])

    return (
      <>
        <Permission permissions={[PERMISSIONS.cap_nhat_nhom_san_pham]}>
          <Button size="large" onClick={toggle} type="primary">
            C???p nh???t nh??m s???n ph???m
          </Button>
        </Permission>
        <Modal
          title="C???p nh???t nh??m s???n ph???m"
          centered
          width={500}
          footer={null}
          visible={visible}
          onCancel={toggle}
        >
          <TreeSelect
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            allowClear
            multiple
            treeDefaultExpandAll
            size="large"
            style={{ width: '100%', marginBottom: 30 }}
            placeholder="Ch???n nh??m s???n ph???m"
            treeNodeFilterProp="title"
            onChange={(value) => setCategoryIds(value)}
            value={categoryIds}
          >
            {categories.map((category) => (
              <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                {category.children_category.map((child) => (
                  <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                    {child.children_category &&
                      child.children_category.map((e) => (
                        <TreeSelect.TreeNode value={e.category_id} title={e.name}>
                          {e.name}
                        </TreeSelect.TreeNode>
                      ))}
                  </TreeSelect.TreeNode>
                ))}
              </TreeSelect.TreeNode>
            ))}
          </TreeSelect>
          <Row justify="end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true)

                  const listPromise = selectedRowKeys.map(async (product_id) => {
                    const res = await updateProduct({ category_id: categoryIds }, product_id)
                    return res
                  })

                  await Promise.all(listPromise)
                  setLoading(false)
                  toggle()
                  await _getProducts()
                  notification.success({ message: `C???p nh???t s???n ph???m th??nh c??ng!` })
                } catch (error) {
                  setLoading(false)
                  toggle()
                  console.log(error)
                }
              }}
              type="primary"
              size="large"
              disabled={categoryIds.length !== 0 ? false : true}
            >
              C???p nh???t
            </Button>
          </Row>
        </Modal>
      </>
    )
  }

  const ModalOptionExportProducts = () => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)
    const [optionExport, setOptionExport] = useState()
    const [loading, setLoading] = useState(false)

    const handleExportProducts = async () => {
      setLoading(true)
      if (optionExport === 'all') await _getProductsToExport()
      if (optionExport === 'onePage')
        await _getProductsToExport({ page: paramsFilter.page, page_size: paramsFilter.page_size })
      if (optionExport === 'filters') {
        delete paramsFilter.page
        delete paramsFilter.page_size
        await _getProductsToExport({ ...paramsFilter })
      }
      setLoading(false)
      toggle()
    }

    useEffect(() => {
      if (!visible) setOptionExport()
    }, [visible])

    return (
      <>
        <Button size="large" onClick={toggle} type="primary" icon={<ToTopOutlined />}>
          Export s???n ph???m
        </Button>

        <Modal
          onOk={handleExportProducts}
          onCancel={toggle}
          title="T??y ch???n export danh s??ch s???n ph???m"
          visible={visible}
          footer={
            <Row justify="end">
              <Space>
                <Button onClick={toggle}>????ng</Button>
                <Button
                  disabled={optionExport ? false : true}
                  loading={loading}
                  onClick={handleExportProducts}
                  type="primary"
                >
                  Export
                </Button>
              </Space>
            </Row>
          }
        >
          <div>T??y ch???n export s???n ph???m</div>
          <Select
            value={optionExport}
            onChange={setOptionExport}
            style={{ width: 400 }}
            placeholder="Ch???n t??y ch???n export s???n ph???m"
          >
            <Select.Option value="all">Export t???t c??? s???n ph???m</Select.Option>
            <Select.Option value="onePage">Export nh???ng s???n ph???m tr??n 1 trang</Select.Option>
            <Select.Option value="filters">
              Export nh???ng s???n ph???m theo ch??? ????? l???c ??ang ch???n
            </Select.Option>
          </Select>
        </Modal>
      </>
    )
  }

  const _deleteProduct = async (product_id) => {
    try {
      setLoading(true)
      const res = await deleteProducts({ product_id: [product_id] })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          _getProducts()
          notification.success({ message: 'Xo?? s???n ph???m th??nh c??ng!' })
        } else
          notification.error({
            message: res.data.message || 'Xo?? s???n ph???m th???t b???i, vui l??ng th??? l???i!',
          })
      } else
        notification.error({
          message: res.data.message || 'Xo?? s???n ph???m th???t b???i, vui l??ng th??? l???i!',
        })

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const ModalImagesProduct = ({ product }) => {
    const [visible, setVisible] = useState(false)
    const [imagesProduct, setImagesProducts] = useState(product.images || [])
    const toggle = () => setVisible(!visible)
    const [loadingUpload, setLoadingUpload] = useState(false)

    const updateImageProduct = async (body) => {
      try {
        setLoadingUpload(true)
        let res = await updateProduct(body, product.product_id)
        setLoadingUpload(false)
        console.log(res)
        if (res.status === 200) {
          if (res.data.success) {
            notification.success({ message: 'C???p nh???t h??nh ???nh th??nh c??ng!', duration: 1 })
          } else
            notification.error({
              message: res.data.message || 'C???p nh???t h??nh ???nh th???t b???i, vui l??ng th??? l???i!',
            })
        } else
          notification.error({
            message: res.data.message || 'C???p nh???t h??nh ???nh th???t b???i, vui l??ng th??? l???i!',
          })
      } catch (error) {
        console.log(error)
        setLoadingUpload(false)
      }
    }

    return (
      <>
        <img
          onClick={toggle}
          src={imagesProduct && imagesProduct.length ? imagesProduct[0] : IMAGE_DEFAULT}
          alt=""
          style={{ cursor: 'pointer', width: 65, height: 65 }}
        />

        <Modal
          title="Danh s??ch h??nh ???nh s???n ph???m"
          visible={visible}
          footer={false}
          onCancel={() => {
            toggle()
            _getProducts()
          }}
          width="90%"
          style={{ top: 20 }}
        >
          <Space size="large" wrap={true} style={{ width: '100%', marginBottom: 0 }}>
            {imagesProduct.map((image) => (
              <Badge
                count={
                  <CloseCircleFilled
                    onClick={() => {
                      const indexImage = imagesProduct.findIndex((img) => img === image)
                      if (indexImage !== -1) {
                        const imagesNew = [...imagesProduct]
                        imagesNew.splice(indexImage, 1)
                        setImagesProducts([...imagesNew])
                        updateImageProduct({ images: imagesNew })
                      }
                    }}
                    style={{ fontSize: 25, color: '#ff4d4f', cursor: 'pointer' }}
                  />
                }
              >
                <img src={image} alt="" style={{ width: 170, height: 170, objectFit: 'cover' }} />
              </Badge>
            ))}
            <Upload
              multiple
              listType="picture-card"
              showUploadList={false}
              className={styles['product-upload-img']}
              onChange={(file) => {
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
                }
                typingTimeoutRef.current = setTimeout(async () => {
                  setLoadingUpload(true)
                  const urls = await uploadFiles(file.fileList.map((e) => e.originFileObj))
                  setLoadingUpload(false)
                  if (urls) {
                    const imagesNew = [...imagesProduct, ...urls]
                    updateImageProduct({ images: imagesNew })
                    setImagesProducts([...imagesNew])
                  }
                }, 450)
              }}
            >
              <div>
                {loadingUpload ? (
                  <LoadingOutlined />
                ) : (
                  <PlusCircleFilled style={{ color: 'rgba(128, 128, 128, 0.3)', fontSize: 20 }} />
                )}
                <div style={{ marginTop: 8, color: '#808080' }}>T???i l??n</div>
              </div>
            </Upload>
          </Space>
        </Modal>
      </>
    )
  }

  const ImagesVariant = ({ record, product }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const [images, setImages] = useState([])
    const [imagesView, setImagesView] = useState([])

    const [loading, setLoading] = useState(false)

    const addFile = async (file) => {
      setLoading(true)
      const url = await uploadFile(file)
      setImages([...images, url])
      const fileNames = url.split('/')
      const fileName = fileNames[fileNames.length - 1]
      setImagesView([
        ...imagesView,
        { uid: imagesView.length, name: fileName, status: 'done', url: url, thumbUrl: url },
      ])
      setLoading(false)
    }

    const _removeFile = (file) => {
      const imagesNew = [...images]
      const imagesViewNew = [...imagesView]

      const indexImage = images.findIndex((url) => url === file.url)
      const indexImageView = imagesView.findIndex((f) => f.url === file.url)

      if (indexImage !== -1) imagesNew.splice(indexImage, 1)
      if (indexImageView !== -1) imagesViewNew.splice(indexImageView, 1)

      setImages([...imagesNew])
      setImagesView([...imagesViewNew])
    }

    useEffect(() => {
      if (visible) {
        setImages(record.image || [])
        setImagesView(
          record.image
            ? record.image.map((image, index) => {
              const fileNames = image.split('/')
              const fileName = fileNames[fileNames.length - 1]
              return { uid: index, name: fileName, status: 'done', url: image, thumbUrl: image }
            })
            : []
        )
      }
    }, [visible])

    return (
      <>
        <div onClick={toggle} className={styles['variant-image']}>
          {record.image && record.image.length ? (
            <img
              src={record.image[0] || IMAGE_DEFAULT}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <img src={IMAGE_DEFAULT} alt="" style={{ width: '100%' }} />
          )}
        </div>
        <Modal
          footer={
            <Row justify="end">
              <Space>
                <Button style={{ minWidth: 100 }} onClick={toggle}>
                  ????ng
                </Button>
                <Button
                  onClick={async () => {
                    const body = {
                      variants: product.variants.map((e) => {
                        if (e.variant_id === record.variant_id) return { ...e, image: images }
                        return e
                      }),
                    }
                    await _updateProduct(body, product.product_id)
                    toggle()
                  }}
                  style={{ minWidth: 100 }}
                  type="primary"
                >
                  L??u
                </Button>
              </Space>
            </Row>
          }
          width={700}
          onCancel={toggle}
          title="C???p nh???t h??nh ???nh"
          visible={visible}
        >
          <Upload.Dragger
            fileList={imagesView}
            listType="picture"
            data={addFile}
            onRemove={_removeFile}
            name="file"
            onChange={(info) => {
              if (info.file.status !== 'done') info.file.status = 'done'
            }}
          >
            <p className="ant-upload-drag-icon">
              {loading ? <LoadingOutlined /> : <InboxOutlined />}
            </p>
            <p className="ant-upload-text">Nh???p ho???c k??o th??? v??o khu v???c n??y ????? t???i l??n</p>
            <p className="ant-upload-hint">H??? tr??? h??nh ???nh .PNG, .JPG,...</p>
          </Upload.Dragger>
        </Modal>
      </>
    )
  }

  const onClickClear = async () => {
    setParamsFilter({ page: 1, page_size: 20 })
    setValueSearch('')
    setSelectedRowKeys([])
    setValueTime()
    setValueDateTimeSearch({})
    setValueDateSearch(null)
  }

  const _updateProduct = async (body, id) => {
    try {
      setLoading(true)
      let res = await updateProduct(body, id)
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) notification.success({ message: 'C???p nh???t th??nh c??ng!', duration: 1 })
        else
          notification.error({
            message: res.data.message || 'C???p nh???t th???t b???i, vui l??ng th??? l???i!',
          })
      } else
        notification.error({
          message: res.data.message || 'C???p nh???t th???t b???i, vui l??ng th??? l???i!',
        })

      await _getProducts()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const [optionSearchName, setOptionSearchName] = useState('name')

  const onChangeCategoryValue = (id) => {
    if (id) paramsFilter.category_id = id.join('---')
    else delete paramsFilter.category_id

    paramsFilter.page = 1
    setParamsFilter({ ...paramsFilter })
  }

  //X??? l?? auto expand s???n ph???m khi reload page
  useEffect(() => {
    if (selectedRowKeys.length)
      localStorage.setItem('rowKeysProduct', JSON.stringify(selectedRowKeys))
  }, [selectedRowKeys])

  useEffect(() => {
    //get keys product t??? localStorage
    const keysProduct = localStorage.getItem('rowKeysProduct')
    setSelectedRowKeys(keysProduct ? JSON.parse(keysProduct) : [])

    //x??a l??u kh???i localstorage khi remove DOM
    return () => {
      localStorage.removeItem('rowKeysProduct')
    }
  }, [])

  return (
    <>
      <div className="card">
        <Affix offsetTop={60}>
          <TitlePage title="Danh s??ch s???n ph???m">
            <Space>
              <Button
                size="large"
                style={{ display: Object.keys(paramsFilter).length <= 2 && 'none' }}
                onClick={onClickClear}
                type="primary"
                danger
              >
                X??a t???t c??? l???c
              </Button>
              <SettingColumns
                columns={columns}
                setColumns={setColumns}
                columnsDefault={columnsProduct}
                nameColumn="columnsProductStore"
              />
              <ImportCSV
                size="large"
                txt="Import s???n ph???m"
                upload={importProducts}
                title="Nh???p s???n ph???m b???ng file excel"
                fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2022/01/12/93eab748-117c-4ebf-8125-5b823999b535/ImportProductAO.xlsx"
                reload={_getProducts}
              />
              <ModalOptionExportProducts />
              <Permission permissions={[PERMISSIONS.them_san_pham]}>
                <Link to={ROUTES.PRODUCT_ADD}>
                  <Button size="large" type="primary" icon={<PlusCircleOutlined />}>
                    Th??m s???n ph???m
                  </Button>
                </Link>
              </Permission>
            </Space>
          </TitlePage>
        </Affix>
        <Row gutter={[16, 16]} justify="space-between" style={{ marginLeft: 0, marginTop: 20 }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={8}
            xl={8}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 5,
            }}
          >
            <Input.Group style={{ width: '100%' }}>
              <Row style={{ width: '100%' }}>
                <Col span={14}>
                  <Input
                    style={{ width: '100%' }}
                    name="name"
                    size={FILTER_SIZE}
                    value={valueSearch}
                    onChange={onSearch}
                    placeholder="T??m ki???m s???n ph???m"
                    allowClear
                    bordered={false}
                  />
                </Col>
                <Col span={10}>
                  <Select
                    showSearch
                    size={FILTER_SIZE}
                    style={{
                      width: '100%',
                      borderLeft: '1px solid #d9d9d9',
                    }}
                    placeholder="Ch???n theo"
                    optionFilterProp="children"
                    value={optionSearchName}
                    bordered={false}
                    onChange={(value) => {
                      delete paramsFilter[optionSearchName]
                      setOptionSearchName(value)
                    }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="name">T??n s???n ph???m</Option>
                    <Option value="sku">SKU</Option>
                  </Select>
                </Col>
              </Row>
            </Input.Group>
          </Col>

          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <Row gutter={[0, 20]}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={6}
                xl={6}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRight: 'none',
                  borderRadius: '5px 0px 0px 5px',
                }}
              >
                <Select
                  size={FILTER_SIZE}
                  allowClear
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="L???c theo nh?? cung c???p"
                  optionFilterProp="children"
                  bordered={false}
                  value={paramsFilter.supplier_id}
                  onChange={(value) => _onFilter('supplier_id', value)}
                >
                  {suppliers.map((supplier, index) => (
                    <Option value={supplier.supplier_id} key={index}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ border: '1px solid #d9d9d9' }}>
                <Select
                  allowClear
                  showSearch
                  size={FILTER_SIZE}
                  style={{ width: '100%' }}
                  placeholder="L???c theo tr???ng th??i"
                  optionFilterProp="children"
                  bordered={false}
                  value={paramsFilter.active}
                  onChange={(value) => {
                    if (value !== undefined) paramsFilter.active = value
                    else delete paramsFilter.active
                    setParamsFilter({ ...paramsFilter, page: 1 })
                  }}
                >
                  <Option value={true}>M??? b??n</Option>
                  <Option value={false}>Ng???ng b??n</Option>
                </Select>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={6}
                xl={6}
                style={{ borderTop: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9' }}
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="L???c theo nh??m s???n ph???m "
                  allowClear
                  multiple
                  size={FILTER_SIZE}
                  treeNodeFilterProp="title"
                  treeDefaultExpandAll
                  bordered={false}
                  maxTagCount="responsive"
                  value={
                    paramsFilter.category_id
                      ? paramsFilter.category_id.split('---').map((e) => +e)
                      : []
                  }
                  onChange={onChangeCategoryValue}
                >
                  {categories.map((category) => (
                    <TreeSelect.TreeNode value={category.category_id} title={category.name}>
                      {category.children_category.map((child) => (
                        <TreeSelect.TreeNode value={child.category_id} title={child.name}>
                          {child.children_category &&
                            child.children_category.map((e) => (
                              <TreeSelect.TreeNode value={e.category_id} title={e.name}>
                                {e.name}
                              </TreeSelect.TreeNode>
                            ))}
                        </TreeSelect.TreeNode>
                      ))}
                    </TreeSelect.TreeNode>
                  ))}
                </TreeSelect>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={6}
                xl={6}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '0px 5px 5px 0px',
                }}
              >
                <Select
                  style={{ width: '100%' }}
                  open={isOpenSelect}
                  onBlur={() => {
                    if (isOpenSelect) toggleOpenSelect()
                  }}
                  onClick={() => {
                    if (!isOpenSelect) toggleOpenSelect()
                  }}
                  allowClear
                  showSearch
                  size={FILTER_SIZE}
                  placeholder="L???c theo th???i gian t???o"
                  optionFilterProp="children"
                  bordered={false}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  value={valueTime}
                  onChange={async (value) => {
                    setValueTime(value)

                    paramsFilter.page = 1

                    //xoa params search date hien tai
                    const p = Object.keys(valueDateTimeSearch)
                    if (p.length) delete paramsFilter[p[0]]

                    setValueDateSearch(null)
                    delete paramsFilter.from_date
                    delete paramsFilter.to_date

                    if (isOpenSelect) toggleOpenSelect()

                    if (value) {
                      const searchDate = Object.fromEntries([[value, true]]) // them params search date moi

                      setParamsFilter({ ...paramsFilter, ...searchDate })
                      setValueDateTimeSearch({ ...searchDate })
                    } else {
                      setParamsFilter({ ...paramsFilter })
                      setValueDateTimeSearch({})
                    }
                  }}
                  dropdownRender={(menu) => (
                    <>
                      <RangePicker
                        onFocus={() => {
                          if (!isOpenSelect) toggleOpenSelect()
                        }}
                        onBlur={() => {
                          if (isOpenSelect) toggleOpenSelect()
                        }}
                        value={valueDateSearch}
                        onChange={(dates, dateStrings) => {
                          //khi search hoac filter thi reset page ve 1
                          paramsFilter.page = 1

                          if (isOpenSelect) toggleOpenSelect()

                          //n???u search date th?? xo?? c??c params date
                          delete paramsFilter.to_day
                          delete paramsFilter.yesterday
                          delete paramsFilter.this_week
                          delete paramsFilter.last_week
                          delete paramsFilter.last_month
                          delete paramsFilter.this_month
                          delete paramsFilter.this_year
                          delete paramsFilter.last_year

                          //Ki???m tra xem date c?? ???????c ch???n ko
                          //N???u ko th?? tho??t kh???i h??m, tr??nh cash app
                          //v?? get danh s??ch order
                          if (!dateStrings[0] && !dateStrings[1]) {
                            delete paramsFilter.from_date
                            delete paramsFilter.to_date

                            setValueDateSearch(null)
                            setValueTime()
                          } else {
                            const dateFirst = dateStrings[0]
                            const dateLast = dateStrings[1]
                            setValueDateSearch(dates)
                            setValueTime(`${dateFirst} -> ${dateLast}`)

                            dateFirst.replace(/-/g, '/')
                            dateLast.replace(/-/g, '/')

                            paramsFilter.from_date = dateFirst
                            paramsFilter.to_date = dateLast
                          }

                          setParamsFilter({ ...paramsFilter })
                        }}
                        style={{ width: '100%' }}
                      />
                      {menu}
                    </>
                  )}
                >
                  <Option value="today">H??m nay</Option>
                  <Option value="yesterday">H??m qua</Option>
                  <Option value="this_week">Tu???n n??y</Option>
                  <Option value="last_week">Tu???n tr?????c</Option>
                  <Option value="this_month">Th??ng n??y</Option>
                  <Option value="last_month">Th??ng tr?????c</Option>
                  <Option value="this_year">N??m n??y</Option>
                  <Option value="last_year">N??m tr?????c</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row justify="space-between" style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>
          <Space size="middle" style={{ display: !selectedRowKeys.length && 'none' }}>
            <UpdateCategoryProducts />

            <Button
              size="large"
              type="primary"
              onClick={() =>
                history.push(`${ROUTES.IMPORT_INVENTORY}?product_ids=${selectedRowKeys.join('--')}`)
              }
            >
              Nh???p h??ng SP ???? ch???n
            </Button>
          </Space>
        </Row>

        <Table
          style={{ width: '100%' }}
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          rowKey="product_id"
          scroll={{ y: 400 }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div style={{ marginTop: 25, marginBottom: 25 }}>
                  <Table
                    style={{ width: '100%' }}
                    pagination={false}
                    columns={columnsVariant.map((column) => {
                      if (column.key === 'image')
                        return {
                          ...column,
                          render: (text, variant) => (
                            <ImagesVariant record={variant} product={record} />
                          ),
                        }
                      // if (column.key === 'enable_bulk_price')
                      //   return {
                      //     ...column,
                      //     render: (text, variant) => (
                      //       <Switch
                      //         checked={variant.enable_bulk_price}
                      //         onChange={(checked) =>
                      //           enableBulkPrice(record, { ...variant, enable_bulk_price: checked })
                      //         }
                      //       />
                      //     ),
                      //   }

                      return column
                    })}
                    dataSource={record.variants}
                    size="small"
                  />
                </div>
              )
            },
            expandedRowKeys: selectedRowKeys,
            expandIconColumnIndex: -1,
          }}
          columns={columns.map((column) => {
            if (column.key === 'stt')
              return {
                ...column,
                render: (text, record, index) => index + 1,
              }
            if (column.key === 'image')
              return {
                ...column,
                render: (text, record) => <ModalImagesProduct product={record} />,
              }
            if (column.key === 'name-product')
              return {
                ...column,
                render: (text, record) => (
                  <Link to={{ pathname: ROUTES.PRODUCT_UPDATE, state: record }}>{text}</Link>
                ),
                sorter: (a, b) => compare(a, b, 'name'),
              }

            if (column.key === 'sku')
              return {
                ...column,
                sorter: (a, b) => compare(a, b, 'sku'),
              }

            if (column.key === 'category')
              return {
                ...column,
                sorter: (a, b) =>
                  compareCustom(
                    a._categories && a._categories.length ? a._categories[0].name : '',
                    b._categories && b._categories.length ? b._categories[0].name : ''
                  ),
                render: (text, record) =>
                  record._categories &&
                  record._categories.map((category, index) => (
                    <Tag key={index} closable={false}>
                      {category.name}
                    </Tag>
                  )),
              }

            if (column.key === 'supplier')
              return {
                ...column,
                sorter: (a, b) =>
                  compareCustom(
                    a.supplier_info ? a.supplier_info.name : '',
                    b.supplier_info ? b.supplier_info.name : ''
                  ),
                render: (text, record) => record.supplier_info && record.supplier_info.name,
              }

            if (column.key === 'create_date')
              return {
                ...column,
                sorter: (a, b) => moment(a.create_date).unix() - moment(b.create_date).unix(),

                render: (text, record) =>
                  record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
              }

            if (column.key === 'active')
              return {
                ...column,
                render: (text, record) => (
                  <Space size="middle">
                    <div>
                      <div>M??? b??n</div>
                      <Switch
                        checked={record.active}
                        onClick={() =>
                          _updateProduct({ active: !record.active }, record.product_id)
                        }
                      />
                    </div>
                    <Popconfirm
                      onConfirm={() => _deleteProduct(record.product_id)}
                      title="B???n c?? mu???n x??a s???n ph???m n??y kh??ng?"
                      okText="?????ng ??"
                      cancelText="T??? ch???i"
                    >
                      <Button
                        style={{ marginTop: 17 }}
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                    <div>
                      <div>Pre-order</div>
                      <Switch
                        checked={record.is_pre_order}
                        onClick={() => {
                          _updateProduct({ is_pre_order: !record.is_pre_order }, record.product_id)
                        }}
                      />
                    </div>
                  </Space>
                ),
              }

            return column
          })}
          loading={loading}
          dataSource={products}
          size="small"
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            total: countProduct,
          }}
        />
      </div>
    </>
  )
}
