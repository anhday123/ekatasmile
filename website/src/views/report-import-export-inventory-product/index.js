import React, { useEffect, useState } from 'react'
import styles from './report-import-export-inventory.module.scss'
import { formatCash } from 'utils'
import { useHistory } from 'react-router-dom'

//antd
import { Table, Row, Input, DatePicker, Col } from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//components
import TitlePage from 'components/title-page'

//apis
import { getReportImportExportInventory } from 'apis/report'
import { ROUTES } from 'consts'

export default function ReportImportExportInventoryProduct() {
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [countReport, setCountReport] = useState(0)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })

  const onChangeDate = (date, dateString) => {
    if (date) {
      paramsFilter.from_date = dateString[0]
      paramsFilter.to_date = dateString[1]
    } else {
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    setParamsFilter({ ...paramsFilter, page: 1 })
  }

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'sku',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
    },
    {
      title: 'ĐVT',
      dataIndex: 'unit',
    },
    {
      title: 'Nhóm',
    },
    {
      title: 'Đầu kỳ',
      children: [
        {
          title: 'Số lượng',
          render: (text, record) => (record.begin_quantity ? formatCash(record.begin_quantity) : 0),
        },
        {
          title: 'Thành tiền',
          render: (text, record) => (record.begin_price ? formatCash(record.begin_price) : 0),
        },
      ],
    },
    {
      title: 'Nhập',
      children: [
        {
          title: 'Số lượng',
          render: (text, record) =>
            record.import_quantity ? formatCash(record.import_quantity) : 0,
        },
        {
          title: 'Thành tiền',
          render: (text, record) => (record.import_price ? formatCash(record.import_price) : 0),
        },
      ],
    },
    {
      title: 'Xuất',
      children: [
        {
          title: 'Số lượng',
          render: (text, record) =>
            record.export_quantity ? formatCash(record.export_quantity) : 0,
        },
        {
          title: 'Thành tiền',
          render: (text, record) => (record.export_price ? formatCash(record.export_price) : 0),
        },
      ],
    },
    {
      title: 'Cuối kỳ',
      children: [
        {
          title: 'Số lượng',
          render: (text, record) => (record.end_quantity ? formatCash(record.end_quantity) : 0),
        },
        {
          title: 'Thành tiền',
          render: (text, record) => (record.end_price ? formatCash(record.end_price) : 0),
        },
      ],
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
  ]

  const _getReportImportExportInventory = async () => {
    try {
      setLoading(true)
      const res = await getReportImportExportInventory({ type: 'product', ...paramsFilter })
      console.log(res)
      if (res.status === 200) {
        setReports(res.data.data.map((e) => ({ ...e.product, ...e })))
        setCountReport(res.data.count)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    _getReportImportExportInventory()
  }, [paramsFilter])

  return (
    <div className={`${styles['report-import-export-inventory']} ${styles['card']}`}>
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.REPORTS)}
          >
            <ArrowLeftOutlined style={{ marginRight: 10 }} />
            Báo cáo xuất nhập tồn theo sản phẩm
          </Row>
        }
      ></TitlePage>

      <div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DatePicker.RangePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: '100%', marginTop: 15, marginBottom: 25 }}
            />
          </Col>
        </Row>
        <Table
          style={{ width: '100%' }}
          loading={loading}
          columns={columns}
          dataSource={reports}
          size="small"
          bordered
          pagination={{
            position: ['bottomLeft'],
            current: paramsFilter.page,
            defaultPageSize: 20,
            pageSizeOptions: [20, 30, 40, 50, 60, 70, 80, 90, 100],
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setParamsFilter({ ...paramsFilter, page: page, page_size: pageSize }),
            total: countReport,
          }}
          summary={(pageData) => {
            console.log(pageData)
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>Tổng</div>
                </Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.begin_quantity, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.begin_price, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.import_quantity, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.import_price, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.export_quantity, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.export_price, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce((value, current) => value + current.end_quantity, 0)
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(pageData.reduce((value, current) => value + current.end_price, 0))}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </div>
    </div>
  )
}