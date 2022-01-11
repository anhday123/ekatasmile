import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

const columns = [
  {
    title: 'Mã phiếu',
    dataIndex: 'code',
    render: (text, record, index) => {
      console.log(text, record, index)
      return <Link to={ROUTES.STOCK_ADJUSTMENTS_CREATE}>{text}</Link>
    }
  },
  {
    title: 'Kho kiểm hàng',
    dataIndex: 'warehouse',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'create_date',
  },
  {
    title: 'Ngày kiểm',
    dataIndex: 'check_date',
  },
  {
    title: 'Nhân viên tạo',
    dataIndex: 'creator',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
  },
]

export default columns
