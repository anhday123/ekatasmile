import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { compare, formatCash } from 'utils'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'
import delay from 'delay'
import { useSelector } from 'react-redux'

//components
import TitlePage from 'components/title-page'
import exportTableToCSV from 'components/ExportCSV/export-table'

//antd
import { Input, Col, Row, DatePicker, Table, Tag, Button, Select } from 'antd'

//icons
import { ArrowLeftOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'

//apis
import { getReportInventory } from 'apis/report'
import { getAllBranch } from 'apis/branch'

export default function ReportInventory() {
  const history = useHistory()

  const [branches, setBranches] = useState([])
  const [reportInventory, setReportInventory] = useState([])
  const [reportInventoryToExport, setReportInventoryToExport] = useState([])
  const [loading, setLoading] = useState(false)
  const [paramsFilter, setParamsFilter] = useState({ page: 1, page_size: 20 })
  const [countReport, setCountReport] = useState(0)
  const [warehousesName, setWarehousesName] = useState([])
  const [warehousesNameExport, setWarehousesNameExport] = useState([])
  const [dateFilter, setDateFilter] = useState()

  const onChangeDate = (date, dateString) => {
    setDateFilter(date)
    if (date) {
      paramsFilter.from_date = dateString[0]
      paramsFilter.to_date = dateString[1]
    } else {
      delete paramsFilter.from_date
      delete paramsFilter.to_date
    }

    setParamsFilter({ ...paramsFilter, page: 1 })
  }

  const _clearFilters = () => {
    setParamsFilter({ page: 1, page_size: 20 })
  }

  const columnsDefault = [
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
      render: (text, record) =>
        record.categories ? record.categories.map((category) => <Tag>{category.name}</Tag>) : '',
    },
  ]

  const [columns, setColumns] = useState(columnsDefault)
  const [columnsExport, setColumnsExport] = useState(columnsDefault)

  const _reportInventory = async () => {
    try {
      setLoading(true)
      const res = await getReportInventory({ ...paramsFilter, type: 'product' })
      console.log(res)
      if (res.status === 200) {
        setCountReport(res.data.count)
        const columnsNew = [...columnsDefault]
        let reportNew = []
        let warehousesNameNew = []

        res.data.data.map((e) => {
          let report = {
            sku: e.product ? e.product.sku : '',
            name: e.product ? e.product.name : '',
            unit: e.product ? e.product.unit : '',
            categories: e.product._categories ? e.product._categories : [],
          }

          e.warehouse.map((w) => {
            if (w.branch) report[w.branch.name] = { quantity: w.quantity || 0, price: w.price || 0 }
          })

          reportNew.push(report)
        })

        res.data.data.map((e) => {
          e.warehouse.map((item) => {
            if (item.branch) {
              const findBranch = columnsNew.find((e) => e.title === item.branch.name)
              if (!findBranch) {
                const branchName = item.branch ? item.branch.name : ''
                const column = {
                  title: branchName,
                  children: [
                    {
                      title: 'Số lượng',
                      render: (text, record) =>
                        record[branchName] ? formatCash(record[branchName].quantity || 0) : 0,
                    },
                    {
                      title: 'Thành tiền',
                      render: (text, record) =>
                        record[branchName] ? formatCash(record[branchName].price || 0) : 0,
                    },
                  ],
                }

                warehousesNameNew.push(branchName)
                columnsNew.push(column)
              }
            }
          })
        })

        setWarehousesName([...warehousesNameNew])
        setReportInventory([...reportNew])
        setColumns([...columnsNew])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _reportInventoryToExport = async () => {
    try {
      setLoading(true)
      const res = await getReportInventory({ type: 'product' })
      console.log(res)
      if (res.status === 200) {
        setCountReport(res.data.count)
        const columnsNew = [...columnsDefault]
        let reportNew = []
        let warehousesNameNew = []

        res.data.data.map((e) => {
          let report = {
            sku: e.product ? e.product.sku : '',
            name: e.product ? e.product.name : '',
            unit: e.product ? e.product.unit : '',
            categories: e.product._categories ? e.product._categories : [],
          }

          e.warehouse.map((w) => {
            if (w.branch) report[w.branch.name] = { quantity: w.quantity || 0, price: w.price || 0 }
          })

          reportNew.push(report)
        })

        res.data.data.map((e) => {
          e.warehouse.map((item) => {
            if (item.branch) {
              const findBranch = columnsNew.find((e) => e.title === item.branch.name)
              if (!findBranch) {
                const branchName = item.branch ? item.branch.name : ''
                const column = {
                  title: branchName,
                  children: [
                    {
                      title: 'Số lượng',
                      render: (text, record) =>
                        record[branchName] ? formatCash(record[branchName].quantity || 0) : 0,
                    },
                    {
                      title: 'Thành tiền',
                      render: (text, record) =>
                        record[branchName] ? formatCash(record[branchName].price || 0) : 0,
                    },
                  ],
                }

                warehousesNameNew.push(branchName)
                columnsNew.push(column)
              }
            }
          })
        })

        setWarehousesNameExport([...warehousesNameNew])
        setReportInventoryToExport([...reportNew])
        setColumnsExport([...columnsNew])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _getBranches = async () => {
    try {
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    _getBranches()
  }, [])

  useEffect(() => {
    _reportInventory()
  }, [paramsFilter])

  const dateFormat = 'YYYY-MM-DD'
  return (
    <div className="card">
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.REPORTS)}
          >
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Báo cáo tồn kho theo sản phẩm
          </Row>
        }
      >
        <Button
          icon={<VerticalAlignTopOutlined />}
          onClick={async () => {
            await _reportInventoryToExport()
            await delay(300)
            exportTableToCSV('report-inventory', 'Báo cáo tồn kho theo sản phẩm')
          }}
          style={{ backgroundColor: 'green', borderColor: 'green' }}
          size="large"
          type="primary"
        >
          Xuất excel
        </Button>
      </TitlePage>
      <Row gutter={[16]} style={{ marginBottom: 20, marginTop: 10 }}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <DatePicker.RangePicker
            value={dateFilter}
            onChange={onChangeDate}
            style={{ width: '100%' }}
            size="large"
            format={dateFormat}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Select
            mode="multiple"
            allowClear
            value={paramsFilter.branch_id}
            onChange={(value) => setParamsFilter({ ...paramsFilter, branch_id: value })}
            size="large"
            placeholder="Lọc theo chi nhánh"
            style={{ width: '100%' }}
          >
            {branches.map((branch, index) => (
              <Select.Option value={branch.branch_id} key={index}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={24} lg={7} xl={7}>
          <Select
            allowClear
            size="large"
            placeholder="Lọc theo nhóm sản phẩm"
            style={{ width: '100%' }}
          ></Select>
        </Col>
        <Button
          onClick={_clearFilters}
          style={{ display: Object.keys(paramsFilter).length <= 2 && 'none' }}
          size="large"
          danger
          type="primary"
        >
          Xóa bộ lọc
        </Button>
      </Row>

      <div className="report-inventory" style={{ display: 'none' }}>
        <Table
          bordered
          size="small"
          style={{ width: '100%' }}
          columns={columnsExport}
          dataSource={reportInventoryToExport}
          pagination={false}
          summary={(pageData) => (
            <Table.Summary.Row>
              <Table.Summary.Cell>
                <div style={{ fontWeight: 700 }}>Tổng</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              {warehousesNameExport.map((name) => (
                <>
                  <Table.Summary.Cell>
                    <div style={{ fontWeight: 700 }}>
                      {formatCash(
                        pageData.reduce(
                          (total, current) => total + (current[name] ? current[name].quantity : 0),
                          0
                        )
                      )}
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <div style={{ fontWeight: 700 }}>
                      {formatCash(
                        pageData.reduce(
                          (total, current) => total + (current[name] ? current[name].price : 0),
                          0
                        )
                      )}
                    </div>
                  </Table.Summary.Cell>
                </>
              ))}
            </Table.Summary.Row>
          )}
        />
      </div>

      <Table
        bordered
        loading={loading}
        size="small"
        style={{ width: '100%' }}
        columns={columns}
        dataSource={reportInventory}
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
        summary={(pageData) => (
          <Table.Summary.Row>
            <Table.Summary.Cell>
              <div style={{ fontWeight: 700 }}>Tổng</div>
            </Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            {warehousesName.map((name) => (
              <>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce(
                        (total, current) => total + (current[name] ? current[name].quantity : 0),
                        0
                      )
                    )}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <div style={{ fontWeight: 700 }}>
                    {formatCash(
                      pageData.reduce(
                        (total, current) => total + (current[name] ? current[name].price : 0),
                        0
                      )
                    )}
                  </div>
                </Table.Summary.Cell>
              </>
            ))}
          </Table.Summary.Row>
        )}
      />
    </div>
  )
}
