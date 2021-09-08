import styles from './../orders/orders.module.scss'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Select,
  Button,
  Popover,
  Table,
  Input,
  Row,
  Col,
  DatePicker,
  Typography,
} from 'antd'
import { compare } from 'utils'
const { Option } = Select
const { Text } = Typography
const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'ordercode',
    width: 150,
    sorter: (a, b) => compare(a, b, 'ordercode'),
  },
  {
    title: 'Ngày tạo đơn',
    dataIndex: 'date',
    width: 150,
    sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'namecustomer',
    width: 150,
    sorter: (a, b) => compare(a, b, 'namecustomer'),
  },
  {
    title: 'Liên hệ',
    dataIndex: 'phonenumber',
    width: 150,
    sorter: (a, b) => compare(a, b, 'phonenumber'),
  },
  {
    title: 'Phải trả',
    dataIndex: 'payment',
    width: 150,
    sorter: (a, b) => compare(a, b, 'payment'),
  },
  {
    title: 'Tên nhân viên tạo đơn',
    dataIndex: 'nameemployee',
    width: 150,
    sorter: (a, b) => compare(a, b, 'nameemployee'),
  },
  {
    title: 'Trạng thái đơn hàng',
    dataIndex: 'status',
    width: 150,
    sorter: (a, b) => compare(a, b, 'status'),
  },
  {
    title: 'Nhà vận chuyển',
    dataIndex: 'supplier',
    width: 150,
    sorter: (a, b) => compare(a, b, 'supplier'),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    width: 150,
    sorter: (a, b) => compare(a, b, 'note'),
  },
]
const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    ordercode: `MHN ${i}`,
    date: '2021/04/28',
    namecustomer: `Nguyễn Văn A ${i}`,
    phonenumber: `038494349 ${i}`,
    payment: `50.000 VNĐ`,
    nameemployee: `Nguyễn Văn B ${i}`,
    status: `Đang giao ${i}`,
    supplier: 'Giao hàng nhanh',
    note: `Rỗng`,
  })
}
export default function Orders() {
  const { Search } = Input

  const onSearch = (value) => console.log(value)

  const dateFormat = 'YYYY/MM/DD'

  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  )
  return (
    <>
      <div className={styles['orders_manager']}>
        <div className={styles['orders_manager_title']}>Tổng quan đơn hàng</div>
        <div className={styles['orders_manager_search']}>
          <Row className={styles['orders_manager_search_row']}>
            <Col
              className={styles['orders_manager_search_row_col']}
              xs={21}
              sm={18}
              md={18}
              lg={18}
              xl={18}
            >
              <Popover placement="bottomLeft" content={content} trigger="click">
                <div
                  className={
                    styles['orders_manager_search_row_col_seach_parent']
                  }
                >
                  <Search
                    className={
                      styles['orders_manager_search_row_col_seach_child']
                    }
                    placeholder="Tìm kiếm đơn hàng"
                    onSearch={onSearch}
                    enterButton
                  />
                </div>
              </Popover>
            </Col>
            <Col
              className={styles['orders_manager_search_row_col']}
              xs={21}
              sm={3}
              md={3}
              lg={3}
              xl={3}
            >
              <div className={styles['orders_manager_search_row_col_button']}>
                <Link to="/actions/orders/add">
                  <Button type="primary">Tạo đơn hàng</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['orders_manager_select']}>
          <Row className={styles['orders_manager_select_row']}>
            <Col
              // className={styles["orders_manager_search_row_col"]}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <div>
                <Row className={styles['orders_manager_search_row_col_child']}>
                  <Col
                    className={styles['orders_manager_search_row_col_select']}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={7}
                  >
                    <div>
                      <Select defaultValue="status0" style={{ width: 150 }}>
                        <Option value="status0">Trạng thái</Option>
                        <Option value="status1">Chờ giao hàng</Option>
                        <Option value="status2">Đang giao hàng</Option>
                        <Option value="status3">Đã giao hàng</Option>
                        <Option value="status4">Hủy giao hàng</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col
                    className={styles['orders_manager_search_row_col_select']}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={7}
                  >
                    <div>
                      <DatePicker
                        defaultValue={moment('2015/01/01', dateFormat)}
                        style={{ width: 150 }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              className={styles['orders_manager_search_row_col']}
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            ></Col>
          </Row>
        </div>
        <div className={styles['orders_manager_table']}>
          <Table
            size="small"
            columns={columns}
            dataSource={data}
            scroll={{ y: 500 }}
            summary={(pageData) => {
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text>Tổng cộng:{`${pageData.length}`}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text></Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </div>
      </div>
    </>
  )
}
