import React, { useEffect, useState } from 'react'
import styles from './report-inventory.module.scss'
import moment from 'moment'
import { compare, formatCash } from 'utils'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

//components
import TitlePage from 'components/title-page'

//antd
import { Input, Col, Row, DatePicker, Table } from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//apis
import { getReportInventory } from 'apis/report'

export default function ReportInventory() {
  const history = useHistory()

  const [reportInventory, setReportInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [paramsFilter, setParamsFilter] = useState([])
  const [countReport, setCountReport] = useState(0)

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
    },
  ]

  const [columns, setColumns] = useState(columnsDefault)

  const _reportInventory = async () => {
    try {
      setLoading(true)
      const res = await getReportInventory({ ...paramsFilter })
      console.log(res)
      if (res.status === 200) {
        setCountReport(res.data.count)
        const columnsNew = [...columnsDefault]
        let reportNew = []

        res.data.data.map((e) => {
          let report = {
            sku: e.product ? e.product.sku : '',
            name: e.product ? e.product.name : '',
            unit: e.product ? e.product.unit : '',
          }

          e.warehouse.map((w) => {
            if (w.branch) {
              report[w.branch.name] = w.branch.name || ''
              report.quantity = w.quantity || 0
              report.price = w.price || 0
            }
          })

          reportNew.push(report)
        })

        res.data.data.map((e) => {
          e.warehouse.map((item) => {
            if (item.branch) {
              const findBranch = columnsNew.find((e) => e.title === item.branch.name)
              if (!findBranch)
                columnsNew.push({
                  title: item.branch ? item.branch.name : '',
                  children: [
                    {
                      title: 'Số lượng',
                      render: (text, record) =>
                        record.quantity ? formatCash(record.quantity || 0) : 0,
                    },
                    {
                      title: 'Thành tiền',
                      render: (text, record) => (record.price ? formatCash(record.price || 0) : 0),
                    },
                  ],
                })
            }
          })
        })

        setReportInventory(reportNew)
        setColumns([...columnsNew])
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    _reportInventory()
  }, [paramsFilter])

  const dateFormat = 'YYYY/MM/DD'
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <TitlePage
          title={
            <Row
              wrap={false}
              align="middle"
              style={{ cursor: 'pointer' }}
              onClick={() => history.push(ROUTES.REPORTS)}
            >
              <ArrowLeftOutlined style={{ marginRight: 10 }} />
              Báo cáo tồn kho theo sản phẩm
            </Row>
          }
        ></TitlePage>
        <Row>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <DatePicker.RangePicker
              onChange={onChangeDate}
              style={{ width: '100%', marginBottom: 20, marginTop: 10 }}
              size="large"
              format={dateFormat}
            />
          </Col>
        </Row>

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
          // summary={(pageData) => (
          //   <Table.Summary.Row>
          //     <Table.Summary.Cell>
          //       <h4>Tổng</h4>
          //     </Table.Summary.Cell>
          //     <Table.Summary.Cell></Table.Summary.Cell>
          //     <Table.Summary.Cell></Table.Summary.Cell>
          //     <Table.Summary.Cell></Table.Summary.Cell>
          //     <Table.Summary.Cell></Table.Summary.Cell>
          //     <Table.Summary.Cell>100</Table.Summary.Cell>
          //     <Table.Summary.Cell>{formatCash(4500000)}</Table.Summary.Cell>
          //     <Table.Summary.Cell>100</Table.Summary.Cell>
          //     <Table.Summary.Cell>{formatCash(5500000)}</Table.Summary.Cell>
          //   </Table.Summary.Row>
          // )}
        />
      </div>
    </>
  )
}
