import React, { useState, useEffect } from 'react'
import { ACTION } from './../../../../consts/index'
import { useHistory } from 'react-router-dom'
import styles from './../add/add.module.scss'
import { Button, Tabs, Table, Input, Form } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { apiAllCategory } from '../../../../apis/category'
import { apiAllWarranty } from './../../../../apis/warranty'
import { apiAllSupplier } from '../../../../apis/supplier'
import { useDispatch } from 'react-redux'
import SingleProduct from './components/singleProduct'
import GroupProduct from './components/groupProduct'
import { apiAllInventory } from '../../../../apis/inventory'

export default function ProductAdd() {
  const [supplier, setSupplier] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = Form.useForm()
  const [warranty, setWarranty] = useState([])
  const [warehouse, setWarehouse] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { TabPane } = Tabs

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
  const data = form.getFieldValue()
  data.productType =
    category && category.length > 0 ? category[0].category_id : ''

  useEffect(() => {
    getWarehouse()
    apiAllSupplierData()
    apiAllWarrantyData()
    apiAllCategoryData()
  }, [])

  return (
    <>
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
              <Button
                style={{ width: '7.5rem' }}
                htmlType="submit"
                type="primary"
              >
                Thêm
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
