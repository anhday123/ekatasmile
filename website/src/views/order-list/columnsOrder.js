const columnsOrder = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'create_date',
    key: 'create_date',
  },
  {
    title: 'Tên khách hàng',
    key: 'customer',
  },
  {
    title: 'Nhân viên',
    key: 'employee',
  },
  {
    title: 'Trạng thái đơn hàng',
    dataIndex: 'bill_status',
    key: 'bill_status',
  },
  {
    title: 'Thanh toán',
    dataIndex: 'payment_status',
    key: 'payment_status',
  },
  {
    title: 'Khách phải trả',
    dataIndex: 'final_cost',
    key: 'final_cost',
  },
]

export default columnsOrder
