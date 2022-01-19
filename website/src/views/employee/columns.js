const columns = [
  {
    title: 'STT',
    key: 'stt',
    width: 60,
  },
  {
    title: 'Tên nhân viên',
    key: 'name',
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: 'Địa chỉ',
    key: 'address',
  },
  {
    title: 'Ngày sinh',
    key: 'birthday',
    dataIndex: 'birthday',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Vai trò',
    key: 'role',
  },
  {
    title: 'Thời gian đăng kí',
    dataIndex: 'create_date',
    key: 'create_date',
  },
  {
    title: 'Hành động',
    key: 'action',
  },
]

export default columns
