export const convertFields = (data, template, reverse = false) => {
  if (reverse) {
    return Object.keys(template).reduce(
      (a, b) => ((a[template[b]] = data[b] || ''), a),
      {}
    )
  }
  return Object.keys(template).reduce(
    (a, b) => ((a[b] = data[template[b]] || ''), a),
    {}
  )
}

export const guarantee = {
  code: 'Mã phiếu',
  name: 'Tên bảo hành',
  type: 'Loại bảo hành',
  time: 'Thời hạn bảo hành',
  description: 'Mô tả',
}
