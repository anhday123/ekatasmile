import React, { useEffect, useState } from 'react'

//components antd
import { Modal, Button, Checkbox } from 'antd'

import columnsProduct from 'views/product/columns'

export default function SettingColumns({ columns, setColumns }) {
  const [visible, setVisible] = useState(false)

  const toggle = () => setVisible(!visible)

  useEffect(() => {}, [])

  return (
    <>
      <Button type="primary" onClick={toggle} size="large">
        Điều chỉnh cột
      </Button>
      <Modal
        title="Điều chỉnh cột hiện thị trên trang danh sách"
        visible={visible}
        footer={null}
        onCancel={toggle}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {columnsProduct.map((e, index) => (
            <div style={{ width: '33.333333%', marginBottom: 10 }}>
              <Checkbox
                defaultChecked={
                  columns.filter((v) => v.title === e.title).length
                }
                onChange={(event) => {
                  let columnsNew = [...columns]

                  if (event.target.checked) {
                    columnsNew.splice(index, 0, { ...e })
                  } else {
                    const indexHidden = columns.findIndex(
                      (c) => c.title === e.title
                    )
                    columnsNew.splice(indexHidden, 1)
                  }

                  //lưu setting columns lên localstorage
                  localStorage.setItem(
                    'columnsProduct',
                    JSON.stringify(columnsNew)
                  )

                  setColumns([...columnsNew])
                }}
              >
                {e.title}
              </Checkbox>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
