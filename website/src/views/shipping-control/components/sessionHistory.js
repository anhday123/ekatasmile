import { Table, Drawer, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getCompare } from '../../../apis/compare'
import moment from 'moment'
import { compare } from 'utils'
const { Text } = Typography
export default function SessionHistory(props) {
  const { visible, onClose, data } = props
  const [compareList, setCompareList] = useState([])
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'code',
      sorter: (a, b) => compare(a, b, 'code'),
    },
    {
      title: 'DVVC',
      dataIndex: 'shipping_company',
      sorter: (a, b) => compare(a, b, 'shipping_company'),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customer_name',
      sorter: (a, b) => compare(a, b, 'customer_name'),
    },
    {
      title: 'Mã số khách',
      dataIndex: 'customer_id',
      sorter: (a, b) => compare(a, b, 'customer_id'),
    },
    {
      title: 'Ngày tạo đơn',
      dataIndex: 'revice_date',
      sorter: (a, b) =>
        moment(a.revice_date).unix() - moment(b.revice_date).unix(),
    },
    {
      title: 'Tiền COD',
      dataIndex: 'cod_cost',
      sorter: (a, b) => compare(a, b, 'cod_cost'),
    },
    {
      title: 'tiền chuyển khoản',
      dataIndex: 'transfer_cost',
      sorter: (a, b) => compare(a, b, 'transfer_cost'),
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'delivery_cost',
      sorter: (a, b) => compare(a, b, 'delivery_cost'),
    },
    {
      title: 'Tiền COD thực nhận',
      dataIndex: 'real_cod_cost',
      sorter: (a, b) => compare(a, b, 'real_cod_cost'),
    },
    {
      title: 'Phí bảo hiểm',
      dataIndex: 'insurance_cost',
      sorter: (a, b) => compare(a, b, 'insurance_cost'),
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shipping_cost',
      sorter: (a, b) => compare(a, b, 'shipping_cost'),
    },
    {
      title: 'Phí chuyển hoàn',
      dataIndex: 'warehouse_cost',
      sorter: (a, b) => compare(a, b, 'warehouse_cost'),
    },
    {
      title: 'Phí lưu kho',
      dataIndex: 'warehouse_cost',
      sorter: (a, b) => compare(a, b, 'warehouse_cost'),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      render(data) {
        return data + 'kg'
      },
      sorter: (a, b) => compare(a, b, 'weight'),
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'revice_date',
      sorter: (a, b) =>
        moment(a.revice_date).unix() - moment(b.revice_date).unix(),
    },

    {
      title: 'Ngày hoàn thành',
      dataIndex: 'complete_date',
      sorter: (a, b) =>
        moment(a.complete_date).unix() - moment(b.complete_date).unix(),
    },
    {
      title: 'Ghi chú đơn',
      dataIndex: 'note',
      width: 200,
      sorter: (a, b) => compare(a, b, 'note'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (data) => (
        <span
          style={
            data.toLowerCase() == 'processing'
              ? { color: 'orange' }
              : data.toLowerCase() == 'complete'
              ? { color: 'green' }
              : { color: 'red' }
          }
        >
          {data}
        </span>
      ),
      sorter: (a, b) => compare(a, b, 'status'),
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
        summary={(pageData) => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
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
    </Drawer>
  )
}
