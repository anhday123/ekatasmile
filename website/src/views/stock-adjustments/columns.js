import { Link, useHistory } from 'react-router-dom'
import { ROUTES } from 'consts'

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: 50,
  },
  {
    title: 'Mã phiếu',
    key: 'code',
  },
  {
    title: 'Kho kiểm hàng',
    key: 'branch',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
  },
  {
    title: 'Ngày tạo',
    key: 'create_date',
  },
  {
    title: 'Ngày kiểm',
    dataIndex: 'inventory_date',
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
