import styles from './../report-financial/report-financial.module.scss'
import React, { useState } from 'react'
import { Row, Col, Button, Select, Table, Modal } from 'antd'
import moment from 'moment'
import { formatCash } from 'utils'
import FilterRangeTime from './filterRangeTime'
import { CalendarComponent } from '@syncfusion/ej2-react-calendars'
const getThisMonth = () => {
  return {
    from_date: moment().startOf('month').format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
  }
}
export default function ReportFinancial() {
  const [filter, setFilter] = useState({ ...getThisMonth() })
  const [showKeyWord, setShowKeyword] = useState(false)
  const [showDateCheck, setShowDateCheck] = useState()

  const columns = [
    {
      title: 'Loại phiếu',
      dataIndex: '',
      render(data) {
        return 'Phiếu thu'
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: '',
      render(data) {
        return moment('2021-09-07T12:05:09').format('DD/MM/YYYY hh:mm:ss')
      },
    },
    {
      title: 'Ngày ghi nhận',
      dataIndex: '',
      render(data) {
        return moment('2021-09-07T12:05:09').format('DD/MM/YYYY hh:mm:ss')
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: '',
      render(data) {
        return 'RVN0016'
      },
    },
    {
      title: 'Mã doanh nghiệp',
      dataIndex: '',
      render(data) {
        return 'BGY0016'
      },
    },
    {
      title: 'Người nộp/nhận',
      dataIndex: '',
      render(data) {
        return 'Khách lẻ'
      },
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: '',
      render(data) {
        return 'Tiền mặt'
      },
    },
    {
      title: 'tiền thu/tiền chi',
      dataIndex: '',
      render(data) {
        return <span style={{ color: '#009D10' }}>+355,000</span>
      },
    },
    {
      title: 'Mô tả',
      dataIndex: '',
      render(data) {
        return 'Bán hàng'
      },
    },
  ]
  const keyWordColumns = [
    {
      title: 'Thuật ngữ',
      dataIndex: 'keyword',
      width: 250,
    },
    {
      title: 'Mô tả thuật ngữ',
      dataIndex: 'description',
    },
  ]
  const KeywordData = [
    {
      keyword: 'Ngày tạo',
      description: 'Ngày phiếu thu hoặc phiếu chi được tạo trên hệ thống',
    },
    {
      keyword: 'Ngày ghi nhận',
      description: 'Ngày ghi nhận là ngày nhập vào hệ thống',
    },
    {
      keyword: 'Số dư đầy kỳ',
      description:
        'Là số tiền trong quỹ tính đến ngày trước khoảng ngày lọc Ví dụ: Thời gian được lọc từ ngày 02/11/2020 - 15/11/2020 (Ngày ghi nhận hoặc Ngày tạo)->Quỹ đầu kỳ là số tiền tính đến ngày 01/11/2020',
    },
    {
      keyword: 'Tổng thu',
      description:
        'Là số tiền cửa hàng thu về trong khoảng ngày lọc. Ví dụ: Thời gian được lọc từ ngày 02/11/2020 - 15/11/2020 (Ngày ghi nhận hoặc Ngày tạo)-> Tổng thu là số tiền tính của hàng thu được trong thời gian từ 02/11/2020 - 15/11/2020',
    },
    {
      keyword: 'Tổng chi',
      description:
        'Là số tiền cửa hàng chi, thanh toán trong khoảng ngày lọc. Ví dụ: Thời gian được lọc từ ngày 02/11/2020 - 15/11/2020 (Ngày ghi nhận hoặc Ngày tạo) -> Tổng chi là số tiền tính của hàng bỏ ra trong thời gian từ 02/11/2020 - 15/11/2020',
    },
    {
      keyword: 'Số dư cuối kỳ(Tồn quỹ)',
      description:
        'Là số tiền trong quỹ tính đến ngày cuối trong khoảng ngày lọc. Tồn quỹ = Quỹ đầu kỳ + Tổng thu - Tổng chi. Ví dụ: Thời gian được lọc từ ngày 02/11/2020 - 15/11/2020 (Ngày ghi nhận hoặc Ngày tạo) -> Tồn quỹ là số tiền tính đến ngày 15/11/2020',
    },
  ]
  return (
    <>
      <div className={styles['report']}>
        <div className={styles['report-header']}>
          <div className={styles['report-title']}>Báo cáo tài chính</div>
          <Button
            size="large"
            type="primary"
            onClick={() => setShowKeyword(true)}
          >
            Giải thích thuật ngữ
          </Button>
        </div>
        <Row gutter={10}>
          <Col xs={24} lg={8}>
            <Select
              placeholder="Chọn loại phiếu"
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              <Select.Option value="chi">Phiếu chi</Select.Option>
              <Select.Option value="thu">Phiếu chi</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Chọn hình thức thanh toán"
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              <Select.Option value="money">Tiền mặt</Select.Option>
              <Select.Option value="point">Điểm</Select.Option>
              <Select.Option value="bank">Thẻ ngân hàng</Select.Option>
            </Select>
          </Col>
          <Col>
            <FilterRangeTime filter={filter} setFilter={setFilter} />
          </Col>
        </Row>

        <Row gutter={10} justify="end" style={{ margin: '1em 0' }}>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={() => setShowDateCheck(true)}
            >
              Cài đặt ngày ghi nhận
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large">
              Xóa tất cả các lọc
            </Button>
          </Col>
        </Row>

        <Row justify="center" style={{ margin: '1.5em 0' }}>
          <Col span={23}>
            <Row gutter={30} align="middle" className={styles['report-statis']}>
              <Col>
                <Row>Số dư đầu kỳ</Row>
                <Row style={{ color: '#2F68BE' }}>{formatCash(0)}</Row>
              </Col>
              <Col>+</Col>
              <Col>
                <Row>Tổng thu</Row>
                <Row style={{ color: '#00A324' }}>{formatCash(6789000)}</Row>
              </Col>
              <Col>-</Col>
              <Col>
                <Row>Tổng chi</Row>
                <Row style={{ color: '#DF0000' }}>{formatCash(0)}</Row>
              </Col>
              <Col>=</Col>
              <Col>
                <Row>Tồn cuối kỳ</Row>
                <Row style={{ color: '#2F68BE' }}>{formatCash(6789000)}</Row>
              </Col>
            </Row>
          </Col>
        </Row>

        <Table columns={columns} dataSource={[1, 2, 3]} size="small" />
      </div>
      <Modal
        title="Giải thích thuật ngữ"
        visible={showKeyWord}
        onCancel={() => setShowKeyword(false)}
        onOk={() => setShowKeyword(false)}
        width={800}
        centered
      >
        <Table
          columns={keyWordColumns}
          dataSource={KeywordData}
          pagination={false}
        />
      </Modal>
      <Modal
        title="Cài đặt ngày ghi nhận"
        visible={showDateCheck}
        onCancel={() => setShowDateCheck(false)}
        centered
        footer=""
        width={300}
      >
        <div>
          <b>Thời gian chốt sổ mỗi kì trong tháng.</b>
        </div>
        <Row justify="center">
          <CalendarComponent id="calendar" />
        </Row>

        <Row justify="center" style={{ margin: '1em 0' }}>
          <Button
            type="primary"
            style={{ width: 120 }}
            size="large"
            onClick={() => setShowDateCheck(false)}
          >
            Xác nhận
          </Button>
        </Row>
      </Modal>
    </>
  )
}
