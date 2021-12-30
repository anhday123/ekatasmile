const columns = [
  {
    title: 'STT',
    key: 'stt',
  },
  {
    title: 'Mã hàng',
    dataIndex: 'code',
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
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Doanh thu',
    dataIndex: 'sales',
    key: 'sales',
  },
  {
    title: 'Giá vốn',
    dataIndex: 'price_base',
    key: 'price_base',
  },
  {
    title: 'Lợi nhuận gộp',
    dataIndex: 'profit',
  },
  {
    title: '% Lợi nhuận',
    dataIndex: 'percent_sales',
    key: 'percent_sales',
  },
]

export default columns
