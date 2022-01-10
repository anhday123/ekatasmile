import React, { useEffect, useState } from 'react'
import styles from './stock-adjustments.module.scss'
import moment from 'moment'
import { ROUTES } from 'consts'
import { Link, useHistory } from 'react-router-dom'

//components
import columnsStockAdjustments from './columns'
import SettingColumns from 'components/setting-columns'
import exportToCSV from 'components/ExportCSV/export'
import ImportCSV from 'components/ImportCSV'
import TitlePage from 'components/title-page'
import Permission from 'components/permission'
import locale from 'antd/es/date-picker/locale/zh_CN'

//antd
import { Row, Col, Input, Button, DatePicker, Space, Select, Table, Modal, Spin } from 'antd'

//icons
import {
  SearchOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
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

  return (
    <div className={`${styles['card']} ${styles['stock-adjustments']}`}>
      <TitlePage title="Phiếu kiểm hàng">
        <Button type="primary" size="large">
          Tạo phiếu kiểm
        </Button>
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
          {selectRowsKey.length !== 0 ? (
            <Space>
              <Button size="large" type="primary">
                In hóa đơn
              </Button>
            </Space>
          ) : (
            ''
          )}
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
            columnsDefault={columnsStockAdjustments}
            nameColumn="columnsStockAdjustments"
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
        // dataSource={ordersInventory}
        columns={columns}
        // columns={columns.map((column) => {
        //   if (column.key === 'code')
        //     return {
        //       ...column,
        //       render: (text, record) => (
        //         <a
        //           onClick={() =>
        //             history.push({ pathname: ROUTES.IMPORT_INVENTORY, state: record })
        //           }
        //         >
        //           #{record.code}
        //         </a>
        //       ),
        //     }
        //   if (column.key === 'warehouse')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record.import_location_info && record.import_location_info.name,
        //     }
        //   if (column.key === 'status')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record.create_date && moment(record.create_date).format('DD-MM-YYYY HH:mm'),
        //     }
        //   if (column.key === 'create_date')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record.import_location_info && record.import_location_info.name,
        //     }
        //   if (column.key === 'check_date')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record._creator &&
        //         `${record._creator.first_name || ''} ${record._creator.last_name || ''}`,
        //     }
        //   if (column.key === 'creator')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record._verifier &&
        //         `${record._verifier.first_name || ''} ${record._verifier.last_name || ''}`,
        //     }
        //   if (column.key === 'note')
        //     return {
        //       ...column,
        //       render: (text, record) =>
        //         record.verify_date && moment(record.verify_date).format('DD-MM-YYYY HH:mm'),
        //     }
        // })}
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
