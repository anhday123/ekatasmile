import styles from './../guarantee/guarantee.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Switch,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Table,
  notification,
  Upload,
} from 'antd'
import { Link } from 'react-router-dom'
import { FileExcelOutlined, PlusCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import {
  addWarranty,
  apiAllWarranty,
  updateWarranty,
} from '../../apis/warranty'
import { ROUTES, PERMISSIONS } from 'consts'
import Permission from 'components/permission'
import exportToCSV from 'components/ExportCSV/export'
import ImportModal from 'components/ExportCSV/importModal'
import { convertFields, guarantee } from 'components/ExportCSV/fieldConvert'
import { compare } from 'utils'
import * as XLSX from 'xlsx'
const { RangePicker } = DatePicker
function removeFalse(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}
export default function Guarantee() {
  const [warrantyList, setWarrantyList] = useState([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [showImport, setShowImport] = useState(false)
  const [importData, setImportData] = useState([])
  const [importLoading, setImportLoading] = useState(false)
  const [filter, setFilter] = useState({
    search: '',
    from_date: undefined,
    to_date: undefined,
  })
  const onSearch = (value) =>
    setFilter({ ...filter, search: value.target.value })
  function onChange(dates, dateStrings) {
    setFilter({ ...filter, from_date: dateStrings[0], to_date: dateStrings[1] })
  }

  const warrantyUpdate = async (id, data) => {
    try {
      console.log(data)
      const res = await updateWarranty(id, data)
      if (res.data.success) {
        notification.success({
          message: 'Thành công',
          description: `${
            data.active ? 'Kích hoạt' : 'Vô hiệu hóa'
          } thành công`,
        })
      }
    } catch (e) {
      console.log(e)
      notification.error({
        message: 'Thất bại',
        description: `${data.active ? 'Kích hoạt' : 'Vô hiệu hóa'} thất bại`,
      })
    }
  }
  const columnsPromotion = [
    {
      title: 'STT',
      width: 60,
      render(data, record, index) {
        return (pagination.page - 1) * pagination.page_size + index + 1
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      width: 150,
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Tên bảo hành',
      dataIndex: 'name',
      width: 150,
      sorter: (a, b) => compare(a, b, 'name'),
    },
    {
      title: 'Loại bảo hành',
      dataIndex: 'type',
      width: 150,
      sorter: (a, b) => compare(a, b, 'type'),
    },
    {
      title: 'Thời hạn bảo hành',
      dataIndex: 'time',
      width: 150,
      render(data) {
        return data + ' tháng'
      },
      sorter: (a, b) => a.time - b.time,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 150,
      sorter: (a, b) => compare(a, b, 'description'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 150,
      render(data, record) {
        return (
          <Switch
            defaultChecked={data}
            onChange={(e) => warrantyUpdate(record.warranty_id, { active: e })}
          />
        )
      },
    },
  ]

  const settings = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        info.file.status = 'done'

        setImportLoading(true)
      }
      if (info.file.status == 'done') {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const bstr = e.target.result
          const workBook = XLSX.read(bstr, { type: 'binary' })
          const workSheetname = workBook.SheetNames[0]
          const workSheet = workBook.Sheets[workSheetname]

          const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 0 })
          setImportData(fileData.map((e) => convertFields(e, guarantee)))
          setImportLoading(false)
        }

        reader.readAsBinaryString(info.file.originFileObj)
      }
    },
  }

  const handleImport = async () => {
    console.log(importData)
    try {
      const res = await Promise.all(
        importData.map((e) => {
          return addWarranty(e)
        })
      )
      if (res.reduce((a, b) => a && b.data.success, true)) {
        setShowImport(false)
        setImportData([])
        getWarranty({ ...removeFalse(filter) })
        notification.success({ message: 'Import thành công' })
      } else {
        res.forEach((e, index) => {
          if (!e.data.success) {
            notification.error({
              message: 'Thất bại',
              description: `Dòng ${index+1}: ${e.data.message} ` ,
            })
          }
        })
      }
    } catch (err) {
      console.log(err)
      notification.error({ message: 'Thất bại' })
    }
  }

  const changePagi = (page, page_size) => setPagination({ page, page_size })
  const getWarranty = async (params) => {
    try {
      const res = await apiAllWarranty({ ...params, ...pagination })
      if (res.status == 200) {
        setWarrantyList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const ImportComponent = () => {
    return (
      <Upload {...settings}>
        <Button type="primary">Import</Button>
      </Upload>
    )
  }
  const onResetFilter = () => {
    setFilter({
      search: '',
      from_date: undefined,
      to_date: undefined,
    })
    notification.success({
      message: 'Thành công',
      description: 'Dữ liệu đã được reset về ban đầu',
    })
  }
  useEffect(() => {
    getWarranty({ ...removeFalse(filter) })
  }, [filter])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgb(236, 226, 226)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Quản lý bảo hành
          </div>
          <div className={styles['promotion_manager_button']}>
            <Permission permissions={[PERMISSIONS.them_phieu_bao_hanh]}>
              <Link to={ROUTES.GUARANTEE_ADD}>
                <Button
                  icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                  type="primary"
                  size="large"
                >
                  Tạo phiếu bảo hành
                </Button>
              </Link>
            </Permission>
          </div>
        </div>
        <Row
          gutter={20}
          style={{
            display: 'flex',
            // justifyContent: 'space-between',
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
                value={filter.search}
                onChange={onSearch}
                enterButton
                size="large"
                allowClear
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
                value={
                  filter.from_date
                    ? [moment(filter.from_date), moment(filter.to_date)]
                    : []
                }
                onChange={onChange}
              />
            </div>
          </Col>
        </Row>
        <Row justify="end" style={{ width: '100%' }}>
          <Button size="large" type="primary" onClick={onResetFilter}>
            Xóa bộ lọc
          </Button>
        </Row>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
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
                  marginTop: '1rem',
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
                  icon={<FileExcelOutlined />}
                  style={{
                    backgroundColor: '#004F88',
                    color: 'white',
                  }}
                  size="large"
                  onClick={() => setShowImport(true)}
                >
                  Nhập excel
                </Button>
              </Col>
              <Col
                style={{
                  width: '100%',
                  marginTop: '1rem',
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
                  icon={<FileExcelOutlined />}
                  style={{
                    backgroundColor: '#008816',
                    color: 'white',
                  }}
                  size="large"
                  onClick={() =>
                    exportToCSV(
                      warrantyList.map((e) =>
                        convertFields(e, guarantee, true)
                      ),
                      'bao_hanh'
                    )
                  }
                >
                  Xuất excel
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            size="small"
            columns={columnsPromotion}
            pagination={{ onChange: changePagi }}
            dataSource={warrantyList}
            style={{ width: '100%' }}
          />
          <ImportModal
            visible={showImport}
            importLoading={importLoading}
            columns={[
              {
                title: 'Tên bảo hành',
                dataIndex: 'name',
                width: 150,
                sorter: (a, b) => compare(a, b, 'name'),
              },
              {
                title: 'Loại bảo hành',
                dataIndex: 'type',
                width: 150,
                sorter: (a, b) => compare(a, b, 'type'),
              },
              {
                title: 'Thời hạn bảo hành',
                dataIndex: 'time',
                width: 150,
                render(data) {
                  return data + ' tháng'
                },
                sorter: (a, b) => a.time - b.time,
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                width: 150,
                sorter: (a, b) => compare(a, b, 'description'),
              },
            ]}
            downTemplate="./template/guarantee.xlsx"
            actionComponent={<ImportComponent />}
            dataSource={importData}
            onCancel={() => setShowImport(false)}
            onOk={handleImport}
          />
        </div>
      </div>
    </>
  )
}
