import React, { useEffect, useState } from 'react'
import styles from './import-inventory.module.scss'
import moment from 'moment'
import { formatCash } from 'utils'
import { BILL_STATUS_ORDER, ROUTES } from 'consts'
import { Link } from 'react-router-dom'

//components
import columnsImportInventories from './columns'
import SettingColumns from 'components/setting-columns'
import exportToCSV from 'components/ExportCSV/export'
import ImportCSV from 'components/ImportCSV'

//antd
import { Row, Space, Select, Table, Button, Modal, Spin, DatePicker } from 'antd'

//icons
import { SettingOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'

//apis
import { getOrdersImportInventory, uploadOrdersImportInventory } from 'apis/inventory'
import { getAllBranch } from 'apis/branch'
import { apiAllSupplier } from 'apis/supplier'
import { getProducts } from 'apis/product'

export default function ImportInventories() {
  const [ordersInventory, setOrdersInventory] = useState([])
  const [countOrder, setCountOrder] = useState(0)
  const [selectRowsKey, setSelectRowKeys] = useState([])
  const [columns, setColumns] = useState([])

  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])
  const [loadingBranches, setLoadingBranches] = useState([])

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})

  const [supplierId, setSupplierId] = useState()
  const [productsSupplier, setProductsSupplier] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [visibleProductsToSupplier, setVisibleProductsToSupplier] = useState(false)
  const toggleProductsToSupplier = () => {
    setVisibleProductsToSupplier(!visibleProductsToSupplier)
    setProductsSupplier([])
    setSupplierId()
  }

  const ModalDownloadProducts = ({ products }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(!visible)

    const columnsProduct = [
      {
        title: 'STT',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Tên',
        dataIndex: 'name',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
      },
      {
        title: 'Số lượng',
        render: (text, record) => record.sale_quantity && formatCash(record.sale_quantity || 0),
      },
      {
        title: 'Chiều rộng',
        dataIndex: 'width',
      },
      {
        title: 'Cân nặng',
        dataIndex: 'weight',
      },
      {
        title: 'Chiều dài',
        dataIndex: 'length',
      },
      {
        title: 'Chiều cao',
        dataIndex: 'height',
      },
      {
        title: 'Đơn vị',
        dataIndex: 'unit',
      },
      {
        title: 'Files',
        render: (text, record) => record.files.join(', '),
      },
      {
        title: 'Tags',
        render: (text, record) => record.tags.join(', '),
      },
      {
        title: 'Ngày tạo',
        render: (text, record) =>
          record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
      },
    ]

    return (
      <>
        <div style={{ color: '#6074E2', cursor: 'pointer' }} href="" onClick={toggle}>
          Tải xuống
        </div>
        <Modal
          width={1050}
          footer={
            <Row justify="end">
              <Button
                type="primary"
                onClick={() => {
                  const dataExport = products.map((product, index) => ({
                    STT: index + 1,
                    Tên: product.name || '',
                    SKU: product.sku || '',
                    'Số lượng': product.sale_quantity && formatCash(product.sale_quantity || 0),
                    'Chiều rộng': product.width || '',
                    'Cân nặng': product.weight || '',
                    'Chiều dài': product.length || '',
                    'Chiều cao': product.height || '',
                    'Đơn vị': product.unit || '',
                    Files: product.files.join(', '),
                    Tags: product.tags.join(', '),
                    'Ngày tạo':
                      product.create_date && moment(product.create_date).format('DD-MM-YYYY HH:mm'),
                    'Mô tả': product.description || '',
                  }))
                  exportToCSV(dataExport, 'Danh sách sản phẩm')
                }}
              >
                Tải xuống
              </Button>
            </Row>
          }
          title="Danh sách sản phẩm"
          onCancel={toggle}
          visible={visible}
        >
          <Table
            dataSource={products}
            size="small"
            style={{ width: '100%' }}
            pagination={false}
            columns={columnsProduct}
          />
        </Modal>
      </>
    )
  }

  const columnsProductsToSupplier = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product_sku',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'categories',
    },
    {
      title: 'Mã phiên bản',
      dataIndex: 'sku',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Đơn giá nhập',
      dataIndex: 'import_price',
    },
    {
      title: 'Số lượng nhập',
      dataIndex: 'quantity',
    },
  ]

  const _onFilter = (attribute = '', value = '') => {
    const paramsFilterNew = { ...paramsFilter }
    if (value) paramsFilterNew[attribute] = value
    else delete paramsFilterNew[attribute]
    setParamsFilter({ ...paramsFilterNew })
  }

  const _getProductsToSupplier = async (supplierId) => {
    try {
      setLoading(true)
      const res = await getProducts({ merge: true, detach: true, supplier_id: supplierId })
      console.log(res)
      if (res.status === 200) {
        const productsSupplierNew = res.data.data.map((e) => ({
          ...e.variants,
          unit: e.unit || '',
          categories: e._categories && e._categories.map((category) => category.name).join(', '),
          product_sku: e.sku || '',
          product_name: e.name || '',
          import_price: e.import_price_default || 0,
          quantity: 1,
          inventory_quantity: e.location && e.location[0] ? e.location[0].quantity : 0,
          sumCost: e.import_price_default || 0,
        }))

        setProductsSupplier([...productsSupplierNew])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _getOrdersImportInventory = async () => {
    try {
      setLoading(true)
      const res = await getOrdersImportInventory(paramsFilter)
      console.log(res)
      if (res.status === 200) setOrdersInventory(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const _getBranches = async () => {
    try {
      setLoadingBranches(true)
      const res = await getAllBranch()
      console.log(res)
      if (res.status === 200) setBranches(res.data.data)
      setLoadingBranches(false)
    } catch (error) {
      setLoadingBranches(false)
      console.log(error)
    }
  }

  const _getSuppliers = async () => {
    try {
      const res = await apiAllSupplier()
      console.log(res)
      if (res.status === 200) setSuppliers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getBranches()
    _getSuppliers()
  }, [])

  useEffect(() => {
    _getOrdersImportInventory()
  }, [paramsFilter])

  return (
    <div className={`${styles['import-inventory-container']} ${styles['card']}`}>
      <Row
        justify="space-between"
        wrap={false}
        style={{ fontSize: 17, borderBottom: '1px solid #ece2e2' }}
      >
        <h3>Nhập kho</h3>
        <Link to={ROUTES.IMPORT_INVENTORY}>
          <Button type="primary">Tạo đơn nhập kho</Button>
        </Link>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Space>
          <div>
            <div>Lọc theo địa điểm nhập hàng</div>
            <Select
              value={paramsFilter.branch_id}
              onChange={(value) => _onFilter('branch_id', value)}
              notFoundContent={loadingBranches ? <Spin /> : null}
              style={{ width: 250 }}
              placeholder="Chọn địa điểm nhập hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {branches.map((branch, index) => (
                <Select.Option value={branch.branch_id} key={index}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <div>Lọc theo ngày mua hàng</div>
            <Select
              open={isOpenSelect}
              onBlur={() => {
                if (isOpenSelect) toggleOpenSelect()
              }}
              onClick={() => {
                if (!isOpenSelect) toggleOpenSelect()
              }}
              allowClear
              showSearch
              style={{ width: 280 }}
              placeholder="Chọn ngày mua hàng"
              optionFilterProp="children"
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
                  <DatePicker.RangePicker
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

                      //nếu search date thì xoá các params date
                      delete paramsFilter.to_day
                      delete paramsFilter.yesterday
                      delete paramsFilter.this_week
                      delete paramsFilter.last_week
                      delete paramsFilter.last_month
                      delete paramsFilter.this_month
                      delete paramsFilter.this_year
                      delete paramsFilter.last_year

                      //Kiểm tra xem date có được chọn ko
                      //Nếu ko thì thoát khỏi hàm, tránh cash app
                      //và get danh sách order
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
              <Select.Option value="today">Hôm nay</Select.Option>
              <Select.Option value="yesterday">Hôm qua</Select.Option>
              <Select.Option value="this_week">Tuần này</Select.Option>
              <Select.Option value="last_week">Tuần trước</Select.Option>
              <Select.Option value="this_month">Tháng này</Select.Option>
              <Select.Option value="last_month">Tháng trước</Select.Option>
              <Select.Option value="this_year">Năm này</Select.Option>
              <Select.Option value="last_year">Năm trước</Select.Option>
            </Select>
          </div>

          <div>
            <div>Lọc theo trạng thái</div>
            <Select
              style={{ width: 250 }}
              placeholder="Chọn trạng thái"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={paramsFilter.status}
              onChange={(value) => _onFilter('status', value)}
            >
              <Select.Option value="DRAFT">Lưu nháp</Select.Option>
              <Select.Option value="VERIFY">Xác nhận đơn hàng</Select.Option>
              <Select.Option value="COMPLETE">Hoàn thành</Select.Option>
              <Select.Option value="CANCEL">Hủy đơn hàng</Select.Option>
            </Select>
          </div>

          <Button
            onClick={() => setParamsFilter({ page: 1, page_size: 20 })}
            style={{ display: Object.keys(paramsFilter).length === 2 && 'none', marginTop: 20 }}
            danger
            type="primary"
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: 30 }}>
        <Row justify="end" wrap={false}>
          <Space>
            <Button
              onClick={toggleProductsToSupplier}
              icon={<VerticalAlignTopOutlined />}
              style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}
            >
              Xuất excel
            </Button>
            <Modal
              footer={null}
              title="Xuất file excel sản phẩm từ nhà cung cấp"
              width={920}
              visible={visibleProductsToSupplier}
              onCancel={toggleProductsToSupplier}
            >
              <Row justify="space-between" wrap={false} align="middle">
                <Select
                  value={supplierId}
                  onChange={(value) => {
                    setSupplierId(value)
                    _getProductsToSupplier(value)
                  }}
                  showSearch
                  style={{ width: 250, marginBottom: 10 }}
                  placeholder="Chọn nhà cung cấp"
                >
                  {suppliers.map((supplier, index) => (
                    <Select.Option key={index} value={supplier.supplier_id}>
                      {supplier.name}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    const dataExport = productsSupplier.map((record, index) => ({
                      STT: index + 1,
                      'Tên sản phẩm': record.product_name || '',
                      'Mã sản phẩm': record.product_sku || '',
                      'Loại sản phẩm': record.categories || '',
                      'Mã phiên bản': record.sku || '',
                      'Nhà cung cấp': record.supplier || '',
                      'Đơn vị': record.unit || '',
                      'Đơn giá nhập': record.import_price || '',
                      'Số lượng nhập': record.quantity || '',
                    }))
                    exportToCSV(dataExport, 'Danh sách sản phẩm')
                  }}
                  type="primary"
                  style={{ display: !productsSupplier.length && 'none' }}
                >
                  Tải xuống
                </Button>
              </Row>
              <Table
                size="small"
                loading={loading}
                dataSource={productsSupplier}
                columns={columnsProductsToSupplier}
                pagination={false}
                style={{ width: '100%' }}
                scroll={{ y: 370 }}
              />
            </Modal>
            {selectRowsKey.length !== 0 ? (
              <Space>
                <Button type="primary">In hóa đơn</Button>
              </Space>
            ) : (
              ''
            )}
            <ImportCSV
              upload={uploadOrdersImportInventory}
              reload={_getOrdersImportInventory}
              title="Nhập đơn hàng bằng file excel"
              fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/12/22/0da13f2d-cb35-4b73-beca-a8ba3dedb47a/NhapKhoAO.xlsx"
            />
            <SettingColumns
              btn={
                <Button icon={<SettingOutlined />} type="primary">
                  Điều chỉnh cột
                </Button>
              }
              columns={columns}
              setColumns={setColumns}
              columnsDefault={columnsImportInventories}
              nameColumn="columnsImportInventories"
            />
          </Space>
        </Row>

        <Table
          loading={loading}
          rowKey="_id"
          rowSelection={{
            selectedRowKeys: selectRowsKey,
            onChange: (keys) => setSelectRowKeys(keys),
          }}
          size="small"
          dataSource={ordersInventory}
          columns={columns.map((column) => {
            if (column.key === 'code')
              return { ...column, render: (text, record) => <a>#{record.code}</a> }
            if (column.key === 'location')
              return {
                ...column,
                render: (text, record) =>
                  record.import_location_info && record.import_location_info.name,
              }
            if (column.key === 'create_date')
              return {
                ...column,
                render: (text, record) =>
                  record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
              }
            if (column.key === 'total_cost')
              return {
                ...column,
                render: (text, record) => record.total_cost && formatCash(record.total_cost || 0),
              }
            if (column.key === 'final_cost')
              return {
                ...column,
                render: (text, record) => record.final_cost && formatCash(record.final_cost || 0),
              }
            if (column.key === 'total_quantity')
              return {
                ...column,
                render: (text, record) =>
                  record.total_quantity && formatCash(record.total_quantity || 0),
              }
            if (column.key === 'location')
              return {
                ...column,
                render: (text, record) =>
                  record.import_location_info && record.import_location_info.name,
              }
            if (column.key === 'creator')
              return {
                ...column,
                render: (text, record) =>
                  record._creator &&
                  `${record._creator.first_name || ''} ${record._creator.last_name || ''}`,
              }
            if (column.key === 'verifier')
              return {
                ...column,
                render: (text, record) =>
                  record._verifier &&
                  `${record._verifier.first_name || ''} ${record._verifier.last_name || ''}`,
              }
            if (column.key === 'verify_date')
              return {
                ...column,
                render: (text, record) =>
                  record.verify_date && moment(record.verify_date).format('DD-MM-YYYY HH:mm'),
              }
            if (column.key === 'status')
              return {
                ...column,
                render: (text, record) => record.status && BILL_STATUS_ORDER[record.status],
              }
            if (column.key === 'products')
              return {
                ...column,
                render: (text, record) => (
                  <ModalDownloadProducts
                    products={record.products ? record.products.map((e) => e.product_info) : []}
                  />
                ),
              }
            return column
          })}
          style={{ width: '100%', marginTop: 10 }}
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            pageSize: paramsFilter.page_size,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              paramsFilter.page = page
              paramsFilter.page_size = pageSize
              setParamsFilter({ ...paramsFilter })
            },
            total: countOrder,
          }}
        />
      </div>
    </div>
  )
}
