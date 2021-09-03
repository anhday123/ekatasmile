import styles from './../business/business.module.scss'
import React, { useEffect, useState } from 'react'
import {
  Popconfirm,
  message,
  Input,
  Row,
  Col,
  Select,
  Popover,
  Table,
  Modal,
  Button,
} from 'antd'
import { apiAllUser } from 'apis/user'
import { apiDistrict, apiProvince } from 'apis/information'
const { Option } = Select
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    width: 150,
  },
  {
    title: 'Mã khách hàng',
    dataIndex: 'customerCode',
    width: 150,
  },
  {
    title: 'Loại khách hàng',
    dataIndex: 'customerType',
    width: 150,
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phoneNumber',
    width: 150,
  },
]
function removeFalse(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: i,
    customerName: `Nguyễn Văn A ${i}`,
    customerCode: `PRX ${i}`,
    customerType: `Tiềm năng ${i}`,
    phoneNumber: `038494349${i}`,
  })
}
export default function Business() {
  const { Search } = Input
  const [modal2Visible, setModal2Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [businessList, setBusinessList] = useState([])
  const [pagination, setpagination] = useState({ page: 1, page_size: 10 })
  const [Address, setAddress] = useState({ province: [], district: [] })
  const [filter, setFilter] = useState({
    keyword: '',
    province: undefined,
    district: undefined,
  })

  const onSearch = (value) => {
    setFilter({ ...filter, keyword: value.target.value })
  }
  function handleChange(value) {
    getAddress(apiDistrict, setAddress, 'district', { province_name: value })
    setFilter({ ...filter, province: value })
  }
  const columnsPromotion = [
    {
      title: 'Mã business',
      dataIndex: 'businessCode',
      width: 150,
    },
    {
      title: 'Tên business',
      dataIndex: 'businessName',
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'district',
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
    },
    {
      title: 'Thời gian đăng kí',
    },
    {
      title: 'Lĩnh vực kinh doanh',
    },
  ]

  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const onSearchCustomerChoose = (value) => console.log(value)
  const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  const getAllBusiness = async (params) => {
    try {
      const res = await apiAllUser({ ...params, ...pagination })
      console.log(res)
      if (res.status === 200) {
        setBusinessList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const getAddress = async (api, callback, key, params) => {
    try {
      const res = await api(params)
      if (res.status === 200) {
        callback((e) => {
          return { ...e, [key]: res.data.data }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  const changePagi = (page, page_size) => setpagination({ page, page_size })
  const resetFilter = () =>
    setFilter({ keyword: '', province: undefined, district: undefined })
  useEffect(() => {
    getAddress(apiProvince, setAddress, 'province')
    getAddress(apiDistrict, setAddress, 'district')
  }, [])
  useEffect(() => {
    getAllBusiness({ role: 2, ...removeFalse(filter) })
  }, [filter])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgb(236, 226, 226)',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Danh sách business
          </div>
        </div>
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
                placeholder="Tìm kiếm"
                onChange={onSearch}
                value={filter.keyword}
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
              <Select
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="Chọn tỉnh/thành phố"
                showSearch
                onChange={handleChange}
                value={filter.province}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Address.province.map((e) => (
                  <Option value={e.province_name}>{e.province_name}</Option>
                ))}
              </Select>
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
              {Address.district.length ? (
                <Select
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Chọn quận/huyện"
                  optionFilterProp="children"
                  value={filter.district}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(e) => setFilter({ ...filter, district: e })}
                >
                  {Address.district.map((e) => (
                    <Option value={e.district_name}>{e.district_name}</Option>
                  ))}
                </Select>
              ) : (
                <Select
                  style={{ width: '100%' }}
                  placeholder="Chọn quận/huyện"
                ></Select>
              )}
            </div>
          </Col>
        </Row>
        <Row style={{ width: '100%', marginTop: 15 }} justify="end">
          <Button size="large" onClick={resetFilter} type="primary">
            Xóa bộ lọc
          </Button>
        </Row>
        <div
          style={{
            width: '100%',
            marginTop: '1rem',
            border: '1px solid rgb(243, 234, 234)',
          }}
        >
          <Table
            rowSelection={rowSelection}
            rowKey="_id"
            size="small"
            pagination={{ onChange: changePagi }}
            columns={columnsPromotion}
            dataSource={businessList}
            style={{ width: '100%' }}
          />
        </div>
        {selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '1rem',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" style={{ width: '7.5rem' }} danger>
                Xóa Business
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal
        title="Danh sách khách hàng dùng khuyến mãi"
        centered
        footer={null}
        width={1000}
        visible={modal2Visible}
        onOk={() => modal2VisibleModal(false)}
        onCancel={() => modal2VisibleModal(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Popover placement="bottomLeft" content={content} trigger="click">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search
                placeholder="Tìm kiếm khách hàng"
                onSearch={onSearchCustomerChoose}
                enterButton
              />
            </div>
          </Popover>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(209, 191, 191)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Table
              size="small"
              style={{ width: '100%' }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
