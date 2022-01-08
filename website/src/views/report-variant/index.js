import React, { useEffect, useState } from 'react'
import styles from './report-inventory.module.scss'
import moment from 'moment'
import { compare, formatCash } from 'utils'
import { useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

//components
import TitlePage from 'components/title-page'

//antd
import { Input, Row, DatePicker, Table } from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//apis
import { getReportInventory } from 'apis/report'

export default function ReportInventory() {
  const history = useHistory()
  const [reportInventory, setReportInventory] = useState([])
  const [loading, setLoading] = useState(false)

  const [columns, setColumns] = useState([
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
  ])

  const _reportInventory = async () => {
    try {
      setLoading(true)
      const res = await getReportInventory()
      console.log(res)
      if (res.status === 200) {
        const columnsNew = [...columns]
        let reportNew = []

        res.data.data.map((e) => {
          let report = {
            sku: e.product ? e.product.sku : '',
            name: e.product ? e.product.name : '',
            unit: e.product ? e.product.unit : '',
          }

          e.warehouse.map((w) => {
            if (w.branch) {
              report[w.branch.name] = w.branch.name
              report[w.quantity] = w.quantity
              report[w.price] = w.price
            }
          })
        })

        res.data.data.map((e) => {
          e.warehouse.map((item) => {
            if (item.branch)
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
  }, [])

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
              Báo cáo tồn kho thuộc tính
            </Row>
          }
        ></TitlePage>
        <Row style={{ marginBottom: 10, marginTop: 20 }}>
          <DatePicker.RangePicker
            style={{ width: 350 }}
            size="large"
            defaultValue={[moment('2021/11/01', dateFormat), moment('2021/12/01', dateFormat)]}
            format={dateFormat}
          />
        </Row>

        <Table
          loading={loading}
          size="small"
          style={{ width: '100%' }}
          pagination={{ position: ['bottomLeft'] }}
          columns={columns}
          dataSource={reportInventory}
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
