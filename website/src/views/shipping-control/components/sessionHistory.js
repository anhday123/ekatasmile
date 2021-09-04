import { Table, Drawer } from 'antd'
import { useEffect, useState } from 'react'
import { getCompare } from '../../../apis/compare'
import moment from 'moment'
export default function SessionHistory(props) {
  const { visible, onClose, data } = props
  const [compareList, setCompareList] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'code',
    },
    {
      title: 'DVVC',
      dataIndex: '',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: '',
    },
    {
      title: 'Mã số khách',
      dataIndex: '',
    },
    {
      title: 'Ngày tạo đơn',
      dataIndex: 'revice_date',
      sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      title: 'Tiền COD',
      dataIndex: 'cod_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'tiền chuyển khoản',
      dataIndex: 'transfer_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'delivery_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Tiền COD thực nhận',
      dataIndex: 'real_cod_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí bảo hiểm',
      dataIndex: 'insurance_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shipping_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí chuyển hoàn',
      dataIndex: 'warehouse_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Phí lưu kho',
      dataIndex: 'warehouse_cost',
      sorter: (a, b) => a - b,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      render(data) {
        return data + 'kg'
      },
      sorter: (a, b) => a - b,
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'revice_date',
      sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },

    {
      title: 'Ngày hoàn thành',
      dataIndex: 'complete_date',
      sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      title: 'Ghi chú đơn',
      dataIndex: 'note',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
  ]
  const getAllCompare = async (params) => {
    try {
      setLoading(true)
      const res = await getCompare(params)
      if (res.data.success) {
        setCompareList(res.data.data)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllCompare({ session: data.session_id })
  }, [data])
  return (
    <Drawer
      title={'Danh sách đối soát trong phiên ' + data.code}
      visible={visible}
      onClose={onClose}
      width={1000}
    >
      <Table
        size="small"
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={compareList}
      />
    </Drawer>
  )
}
