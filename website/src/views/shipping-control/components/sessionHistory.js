import { Table, Drawer } from 'antd'
import { useEffect, useState } from 'react'
import { getCompare } from '../../../apis/compare'

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
    },
    {
      title: 'Tiền COD',
      dataIndex: 'cod_cost',
    },
    {
      title: 'tiền chuyển khoản',
      dataIndex: 'transfer_cost',
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'delivery_cost',
    },
    {
      title: 'Tiền COD thực nhận',
      dataIndex: 'real_cod_cost',
    },
    {
      title: 'Phí bảo hiểm',
      dataIndex: 'insurance_cost',
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shipping_cost',
    },
    {
      title: 'Phí chuyển hoàn',
      dataIndex: 'warehouse_cost',
    },
    {
      title: 'Phí lưu kho',
      dataIndex: 'warehouse_cost',
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      render(data) {
        return data + 'kg'
      },
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'revice_date',
    },

    {
      title: 'Ngày hoàn thành',
      dataIndex: 'complete_date',
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
