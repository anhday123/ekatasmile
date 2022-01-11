import React, { useEffect, useState } from 'react'
import styles from './stock-adjustments.module.scss'
import moment from 'moment'
import { ROUTES } from 'consts'
import { Link, useHistory } from 'react-router-dom'

//components
// import columnsStockAdjustments from './columns'
import SettingColumns from 'components/setting-columns'
import exportToCSV from 'components/ExportCSV/export'
import ImportCSV from 'components/ImportCSV'
import TitlePage from 'components/title-page'
import Permission from 'components/permission'
import locale from 'antd/es/date-picker/locale/zh_CN'

//antd
import { Row, Col, Input, Button, DatePicker, Space, Table, Modal } from 'antd'

//icons
import {
  SearchOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined
}
  from '@ant-design/icons'

export default function Reports() {
  const history = useHistory()

  const [selectRowsKey, setSelectRowKeys] = useState([])
  const [columns, setColumns] = useState([])

  const [loading, setLoading] = useState(false)

  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const [isOpenSelect, setIsOpenSelect] = useState(false)
  const toggleOpenSelect = () => setIsOpenSelect(!isOpenSelect)
  const [valueDateSearch, setValueDateSearch] = useState(null) //dùng để hiện thị date trong filter by date
  const [valueTime, setValueTime] = useState() //dùng để hiện thị value trong filter by time
  const [valueDateTimeSearch, setValueDateTimeSearch] = useState({})

  const [supplierId, setSupplierId] = useState()
  const [productsSupplier, setProductsSupplier] = useState([])
  const [visibleProductsToSupplier, setVisibleProductsToSupplier] = useState(false)
  const toggleProductsToSupplier = () => {
    setVisibleProductsToSupplier(!visibleProductsToSupplier)
    setProductsSupplier([])
    setSupplierId()
  }

  const columnsStock = [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      render: (text, record, index) => {
        console.log(text, record, index)
        return <Link to={ROUTES.STOCK_ADJUSTMENTS_CREATE}>{text}</Link>
      }
    },
    {
      title: 'Kho kiểm hàng',
      dataIndex: 'warehouse',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
    },
    {
      title: 'Ngày kiểm',
      dataIndex: 'check_date',
    },
    {
      title: 'Nhân viên tạo',
      dataIndex: 'creator',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
  ]

  const dataStockAdjustment = []
  for (let i = 0; i < 46; i++) {
    dataStockAdjustment.push({
      key: i,
      code: `JANUARY ${i}`,
      warehouse: 'Chi nhanh mac dinh',
      status: `London, Park Lane no. ${i}`,
      create_date: `Da can bang`,
      check_date: `11/01/2022`,
      creator: `Duck`,
      note: `Hang to`,
    })
  }

  return (
    <div className={`${styles['card']} ${styles['stock-adjustments']}`}>
      <TitlePage title="Phiếu kiểm hàng">
        <Link to={ROUTES.STOCK_ADJUSTMENTS_CREATE}>
          <Button type="primary" size="large">
            Tạo phiếu kiểm
          </Button>
        </Link>
      </TitlePage>
      <Row gutter={[16, 16]} style={{ marginTop: 25 }}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo mã phiếu kiểm hàng"
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <DatePicker.RangePicker size="large" />
        </Col>
      </Row>
      <Row justify="end" wrap={false}>
        <Space>
          <Button
            size="large"
            onClick={toggleProductsToSupplier}
            icon={<VerticalAlignTopOutlined />}
            style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}
          >
            Xuất excel
          </Button>
          <Modal
            style={{ top: 20 }}
            footer={null}
            title="Xuất file danh sách phiếu kiểm hàng"
            width={920}
            visible={visibleProductsToSupplier}
            onCancel={toggleProductsToSupplier}
          >
            <Row justify="space-between" wrap={false} align="middle">
              {/* <Button
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
              </Button> */}
            </Row>
          </Modal>
          <ImportCSV
            size="large"
            // upload={uploadOrdersImportInventory}
            // reload={_getOrdersImportInventory}
            title="Nhập phiếu kiểm hàng bằng file excel"
            fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2021/12/22/0da13f2d-cb35-4b73-beca-a8ba3dedb47a/NhapKhoAO.xlsx"
          />
          <SettingColumns
            btn={
              <Button size="large" icon={<SettingOutlined />} type="primary">
                Điều chỉnh cột
              </Button>
            }
            columns={columns}
            setColumns={setColumns}
            columnsDefault={columnsStock}
            nameColumn="columnsStockAdjustments"
          />
        </Space>
      </Row>
      <Table
        loading={loading}
        // rowKey="_id"
        // rowSelection={{
        //   selectedRowKeys: selectRowsKey,
        //   onChange: (keys) => setSelectRowKeys(keys),
        // }}
        size="small"
        dataSource={dataStockAdjustment}
        columns={columns.map((column) => {
          if (column.dataIndex === 'code')
            return {
              ...column,
              render: (text, record) => (
                <Link to={ROUTES.STOCK_ADJUSTMENTS_CREATE}>{text}</Link>
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
          // total: countOrder,
        }}
      />
    </div>
  )
}
