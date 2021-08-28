import styles from './../report-end-day/report-end-day.module.scss'
import React from 'react'
import { Input, Row, Col, DatePicker, Select, Button, Popover } from 'antd'

import { FileExcelOutlined } from '@ant-design/icons'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker

export default function ReportEndDay() {
  const { Search } = Input

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  return (
    <>
      <div className={styles['promotion_manager']}>
        <Row
          style={{
            width: '100%',
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.5rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div className={styles['promotion_manager_title']}>
                Báo cáo cuối ngày
              </div>
            </div>
          </Col>
          <Col
            style={{ width: '100%' }}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Col
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  marginLeft: '1rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={6}
              >
                <Button
                  size="large"
                  icon={<FileExcelOutlined />}
                  style={{ backgroundColor: '#008816', color: 'white' }}
                >
                  Xuất excel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Input
                placeholder="Tìm kiếm theo mã, theo tên"
                enterButton
                size="large"
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <RangePicker
                size="large"
                className="br-15__date-picker"
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                className="br-15__date-picker"
              />
            </div>
          </Col>
          <Col
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={7}
          >
            <div style={{ width: '100%' }}>
              <Select style={{ width: '100%' }} placeholder="Loại" size="large">
                <Option value="type1">Loai 1</Option>
                <Option value="type2">Loai 2</Option>
                <Option value="type3">Loai 3</Option>
              </Select>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                500
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng số đơn hàng bán được
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                100
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng số đơn hàng đổi trả
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                80
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng số đơn hàng hoàn tiền
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                10.000.000 VNĐ
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng doanh thu
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                5.000.000 VNĐ
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng chi phí
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                20.000.000 VNĐ
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng lợi nhuận
              </div>
            </div>
          </Col>
          <Col
            className={styles['hover_item']}
            style={{ width: '100%', marginTop: '1rem' }}
            xs={24}
            sm={24}
            md={11}
            lg={7}
            xl={7}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#5363E0',
                padding: '1.5rem 1rem',
                border: '1px solid #2F9BFF',
                borderRadius: '0.25rem',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                0%
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  color: 'white',
                  fontSize: '1rem',
                  marginTop: '0.5rem',
                }}
              >
                Tổng chiết khấu
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
