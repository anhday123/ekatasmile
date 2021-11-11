import React, { useState, useEffect } from 'react'
import { ToTopOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

//apis
import { apiAllCategorySearch } from 'apis/category'
import { apiAllSupplier } from 'apis/supplier'

export default function ExportProduct({ fileName, name, getProductsExport }) {
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([])

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  const _getSuppliers = async () => {
    try {
      const res = await apiAllSupplier()
      if (res.status === 200) {
        setSuppliers(res.data.data)
      }
    } catch (error) {}
  }

  const _getCategories = async () => {
    try {
      const res = await apiAllCategorySearch()
      if (res.status === 200) {
        setCategories(res.data.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    _getCategories()
    _getSuppliers()
  }, [])

  return (
    <Button
      onClick={async () => {
        const data = await getProductsExport()
        let dataExport = []

        data.map((e) => {
          const findCategory = categories.find(
            (c) => c.category_id === e.category_id
          )

          const findSupplier = suppliers.find(
            (s) => s.supplier_id === e.supplier_id
          )

          const objProduct = {
            'Tên sản phẩm': e.name,
            'Chiều rộng': e.width,
            'Cân nặng': e.weight,
            'Đơn vị': e.unit,
            'Chiều dài': e.length,
            'Chiều cao': e.height,
            'Danh mục': findCategory ? findCategory.name : '',
            'Nhà cung cấp': findSupplier ? findSupplier.name : '',
            'Sku sản phẩm': e.sku,
            'Mô tả': e.description,
          }
          if (e.active)
            e.variants.map((v) => {
              dataExport.push({
                ...objProduct,
                'Hình ảnh': v.image.join(', '),
                'Giá nhập': v.import_price || '',
                'Giá bán': v.base_price || '',
                'Giá cơ bản': v.sale_price || '',
                sku: v.sku || '',
                'Tên phiên bản': v.title || '',
                'Số lượng sản phẩm ở các cửa hàng': v.locations
                  .map((k) => `${k.name}:${k.quantity}`)
                  .join('|'),
                options: v.options.map((k) => `${k.name}:${k.value}`).join('|'),
                'Thuộc tính': e.attributes
                  .map((a) => `${a.option}:${a.values.join(',')}`)
                  .join('|'),
              })
            })
        })

        exportToCSV(dataExport, fileName)
      }}
      icon={<ToTopOutlined />}
      size="large"
      style={{
        backgroundColor: '#2A53CD',
        borderColor: '#2A53CD',
        borderRadius: 5,
        minWidth: 130,
        color: 'white',
      }}
    >
      {name}
    </Button>
  )
}
