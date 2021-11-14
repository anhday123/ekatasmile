import React, { useEffect, useState } from 'react'
import { ExcelRenderer } from 'react-excel-renderer'
import { useDispatch } from 'react-redux'

import { Button, Modal, notification, Row, Space, Table } from 'antd'

import {
  ImportOutlined,
  FileAddOutlined,
  LinkOutlined,
} from '@ant-design/icons'

//apis
import { getCategories } from 'apis/category'
import { apiAllSupplier } from 'apis/supplier'
import { getAllStore } from 'apis/store'
import { addProduct } from 'apis/product'
import { ACTION } from 'consts'

export default function ImportProducts({ reload }) {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const [dataImport, setDataImport] = useState()

  const [suppliers, setSuppliers] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])

  const [valueFileImport, setValueFileImport] = useState('')
  const [dataImportView, setDataImportView] = useState([])
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Chiều dài',
      dataIndex: 'length',
    },
    {
      title: 'Chiều rộng',
      dataIndex: 'with',
    },
    {
      title: 'Chiều cao',
      dataIndex: 'height',
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier_id',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Hình ảnh',
      render: (text, record) => {
        if (record.image) {
          const imgs = record.image.split(', ')
          if (imgs && imgs.length)
            return (
              <img src={imgs[0]} alt="" style={{ width: 100, height: 100 }} />
            )
        }
        return ''
      },
    },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price',
    },
    {
      title: 'Giá bán',
      dataIndex: 'sale_price',
    },
    {
      title: 'Giá cơ bản',
      dataIndex: 'base_price',
    },
    {
      title: 'sku',
      dataIndex: 'sku',
    },
    {
      title: 'Tên phiên bản',
      dataIndex: 'title',
    },
    {
      title: 'Số lượng sản phẩm ở các cửa hàng',
      render: (text, record) => {
        if (record.locations) {
          const _locations = record.locations.split('|')
          if (_locations && _locations.length)
            return (
              <div>
                {_locations.map((e) => (
                  <div>{e}</div>
                ))}
              </div>
            )
        }
        return ''
      },
    },
    {
      title: 'options',
      render: (text, record) => {
        if (record.options) {
          const _options = record.options.split('|')
          if (_options && _options.length)
            return (
              <div>
                {_options.map((e) => (
                  <div>{e}</div>
                ))}
              </div>
            )
        }
        return ''
      },
    },
    {
      title: 'Thuộc tính',
      render: (text, record) => {
        if (record.attributes) {
          const _attributes = record.attributes.split('|')
          if (_attributes && _attributes.length)
            return (
              <div>
                {_attributes.map((e) => (
                  <div>{e}</div>
                ))}
              </div>
            )
        }
        return ''
      },
    },
  ]

  const _importProducts = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })
      const res = await addProduct({ products: [dataImport] })
      console.log(res)
      if (res.status === 200) {
        setDataImportView([])
        toggle()
        reload()
        notification.success({ message: 'Import sản phẩm thành công !' })
      } else
        notification.error({
          message: res.data.message || 'Import sản phẩm thất bại !',
        })

      dispatch({ type: ACTION.LOADING, data: false })
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
      console.log(error)
    }
  }

  const _getSuppliers = async () => {
    try {
      const res = await apiAllSupplier()
      console.log(res)
      if (res.status === 200) {
        setSuppliers(res.data.data)
      }
    } catch (error) {}
  }

  const _getCategories = async () => {
    try {
      const res = await getCategories()
      if (res.status === 200) {
        setCategories(res.data.data)
      }
    } catch (error) {}
  }

  const _getStores = async () => {
    try {
      const res = await getAllStore()
      if (res.status === 200) {
        setStores(res.data.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    _getCategories()
    _getSuppliers()
    _getStores()
  }, [])

  return (
    <>
      <Button
        onClick={toggle}
        style={{
          backgroundColor: '#2A53CD',
          borderColor: '#2A53CD',
          borderRadius: 5,
          minWidth: 130,
          color: 'white',
        }}
        size="large"
        icon={<ImportOutlined />}
      >
        Import Sản Phẩm
      </Button>

      <Modal
        footer={
          <Row justify="end">
            <Space>
              <Button type="primary" danger>
                Cancel
              </Button>
              <Button
                onClick={_importProducts}
                type="primary"
                disabled={!dataImportView.length ? true : false}
              >
                Import
              </Button>
            </Space>
          </Row>
        }
        visible={visible}
        onCancel={toggle}
        title={
          <a
            href="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/11/10/87c6b7cc-a73a-402a-8fa8-9d49aaed4470/template import products.xlsx"
            target="_blank"
          >
            <Button icon={<LinkOutlined />} type="link">
              Download Template
            </Button>
          </a>
        }
        width="80%"
      >
        <Button
          style={{ borderRadius: 5, minWidth: 130 }}
          type="dashed"
          icon={<FileAddOutlined />}
        >
          Chọn tệp
          <label
            for="import-order"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              cursor: 'pointer',
            }}
            onClick={() => setValueFileImport('')}
          ></label>
        </Button>
        <input
          value={valueFileImport}
          id="import-order"
          type="file"
          onChange={(e) => {
            let fileObj = e.target.files[0]
            if (fileObj)
              ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                  console.log(err)
                } else {
                  let result = []
                  let checkProductHaveAttribute = false

                  for (let i = 1; i < resp.rows.length; ++i) {
                    let obj = {}
                    for (let j = 0; j < resp.rows[0].length; ++j) {
                      if (resp.rows[0][j] === 'Tên sản phẩm') {
                        obj.name = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Chiều dài') {
                        obj.length = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Chiều rộng') {
                        obj.width = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Chiều cao') {
                        obj.height = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Cân nặng') {
                        obj.weight = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Đơn vị') {
                        obj.unit = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Danh mục') {
                        obj.category_id = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Nhà cung cấp') {
                        obj.supplier_id = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Sku sản phẩm') {
                        obj.skuProduct = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Mô tả') {
                        obj.description = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Hình ảnh') {
                        obj.image = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Giá nhập') {
                        obj.import_price = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Giá bán') {
                        obj.sale_price = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Giá cơ bản') {
                        obj.base_price = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'sku') {
                        obj.sku = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Tên phiên bản') {
                        obj.title = resp.rows[i][j] || ''
                      }
                      if (
                        resp.rows[0][j] === 'Số lượng sản phẩm ở các cửa hàng'
                      ) {
                        obj.locations = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'options') {
                        obj.options = resp.rows[i][j] || ''
                      }
                      if (resp.rows[0][j] === 'Thuộc tính') {
                        obj.attributes = resp.rows[i][j] || ''
                        if (resp.rows[i][j]) checkProductHaveAttribute = true
                      }
                    }

                    result.push(obj)
                  }

                  setDataImportView(result)

                  const findCategory = categories.find(
                    (e) =>
                      result[0] &&
                      result[0].category_id.toLowerCase() ===
                        e.name.toLowerCase()
                  )

                  const findSupplier = suppliers.find(
                    (e) =>
                      result[0] &&
                      result[0].supplier_id.toLowerCase() ===
                        e.name.toLowerCase()
                  )

                  let body = {
                    name: result[0] ? result[0].name : '',
                    barcode: '',
                    sku: result[0] ? result[0].skuProduct : '',
                    width: result[0] ? result[0].width : '',
                    weight: result[0] ? result[0].weight : '',
                    unit: result[0] ? result[0].unit : '',
                    length: result[0] ? result[0].length : '',
                    height: result[0] ? result[0].height : '',
                    description: result[0] ? result[0].description : '',
                    warranties: [],
                    category_id: findCategory ? findCategory.category_id : '',
                    supplier_id: findSupplier ? findSupplier.supplier_id : '',
                  }

                  if (checkProductHaveAttribute) {
                    const _attributes = result[0].attributes
                      .split('|')
                      .map((l) => {
                        const nameAndValue = l.split(':')
                        return {
                          option: nameAndValue[0],
                          values: nameAndValue[1].split(','),
                        }
                      })

                    body.attributes = _attributes
                    body.variants = result.map((e) => {
                      const optionsSplit = e.options.split('|')
                      const optionsNew = optionsSplit.map((k) => {
                        const nameAndValue = k.split(':')
                        return { name: nameAndValue[0], value: nameAndValue[1] }
                      })

                      const _locations = e.locations.split('|').map((m) => {
                        const nameAndValue = m.split(':')
                        const findStore = stores.find(
                          (e) =>
                            e.name.toLowerCase() ===
                            nameAndValue[0].toLowerCase()
                        )

                        if (findStore)
                          return {
                            type: 'store',
                            name: nameAndValue[0],
                            inventory_id: findStore ? findStore.store_id : '',
                            quantity: +nameAndValue[1],
                          }

                        return {}
                      })

                      return {
                        image: e
                          ? e.image.length
                            ? e.image.split(', ')
                            : []
                          : [],
                        options: optionsNew,
                        title: e ? e.title : '',
                        sku: e ? e.sku : [],
                        supplier: findSupplier ? findSupplier.name : '',
                        sale_price: e ? e.sale_price : '',
                        base_price: e ? e.base_price : '',
                        import_price: e ? e.import_price : '',
                        locations: _locations,
                      }
                    })
                  } else {
                    const _locations = result[0]
                      ? result[0].locations.split('|')
                      : []

                    const _locationSplit = _locations.map((l) => {
                      const nameAndQuantity = l.split(':')
                      const findStore = stores.find(
                        (e) =>
                          e.name.toLowerCase() ===
                          nameAndQuantity[0].toLowerCase()
                      )
                      return {
                        type: 'store',
                        name: nameAndQuantity[0],
                        inventory_id: findStore ? findStore.store_id : '',
                        quantity: +nameAndQuantity[1],
                      }
                    })

                    body.attributes = []
                    body.variants = [
                      {
                        image: result[0]
                          ? result[0].image.length
                            ? result[0].image.split(', ')
                            : []
                          : [],
                        options: [],
                        title: result[0] ? result[0].name : '',
                        sku: result[0] ? result[0].skuProduct : [],
                        supplier: findSupplier ? findSupplier.name : '',
                        sale_price: result[0] ? result[0].sale_price : '',
                        base_price: result[0] ? result[0].base_price : '',
                        import_price: result[0] ? result[0].import_price : '',
                        locations: _locationSplit,
                      },
                    ]
                  }

                  setDataImport(body)
                }
              })

            setValueFileImport(e.target.value)
          }}
          hidden
        />
        <Table
          pagination={false}
          size="small"
          columns={columns}
          dataSource={dataImportView}
          style={{ width: '100%', marginTop: 20 }}
          scroll={{ x: 'max-content' }}
        />
      </Modal>
    </>
  )
}
